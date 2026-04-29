import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase-server'
import { getSystemPrompt, type SummaryStyle } from '@/lib/prompts'
import { MAX_PDF_CHARS, RATE_LIMIT_COUNT, RATE_LIMIT_WINDOW_MS, SIGNED_URL_TTL_SECONDS, FREE_STYLES, tierMonthlyLimit, type Tier } from '@/lib/config'
import { sendSummaryReadyEmail } from '@/lib/email'
import { polyfillDOMMatrix } from '@/lib/dommatrix-polyfill'
import { checkRateLimit } from '@/lib/ratelimit'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? '',
})

const MAX_CHARS = MAX_PDF_CHARS

export async function POST(request: Request) {
  try {
    const { filePath, fileName, style, language, userContext } = await request.json() as {
      filePath: string
      fileName: string
      style: SummaryStyle
      language: string
      userContext?: string
    }

    if (!filePath || !fileName || !style) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify user is authenticated
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the requested file belongs to this user (filePath must start with their user ID)
    if (!filePath.startsWith(`${user.id}/`)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Redis rate limit: fast atomic check before any expensive work
    const rlResponse = await checkRateLimit('summarize', user.id)
    if (rlResponse) return rlResponse

    // Fetch user profile for tier + streak tracking
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('tier, streak_count, longest_streak, last_summary_date')
      .eq('user_id', user.id)
      .single()

    const tier = ((userProfile?.tier as Tier) ?? 'free')

    // Enforce style restriction on Free tier
    if (tier === 'free' && !(FREE_STYLES as readonly string[]).includes(style)) {
      return NextResponse.json({ error: 'Upgrade to access this summary style.' }, { status: 403 })
    }

    // Enforce monthly usage limit (Pro = unlimited)
    const monthlyLimit = tierMonthlyLimit(tier)
    if (monthlyLimit !== null) {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
      const { count } = await supabase
        .from('summaries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth)
      if ((count ?? 0) >= monthlyLimit) {
        return NextResponse.json({ error: 'Monthly limit reached. Upgrade to continue.' }, { status: 429 })
      }
    }

    // Rate limit: max RATE_LIMIT_COUNT summaries per RATE_LIMIT_WINDOW_MS per user
    // Note: DB-based check is best-effort — not atomic. Sufficient for sustained abuse prevention.
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()
    const { count: recentCount } = await supabase
      .from('summaries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', windowStart)
    if ((recentCount ?? 0) >= RATE_LIMIT_COUNT) {
      return NextResponse.json({ error: 'Too many requests. Please wait a few minutes.' }, { status: 429 })
    }

    // Create signed URL and download PDF
    const { data: signedData, error: signedError } = await supabase.storage
      .from('Books')
      .createSignedUrl(filePath, SIGNED_URL_TTL_SECONDS)

    if (signedError || !signedData) {
      return NextResponse.json({ error: 'Could not access file' }, { status: 400 })
    }

    const pdfResponse = await fetch(signedData.signedUrl)
    if (!pdfResponse.ok) {
      return NextResponse.json({ error: 'Could not download file' }, { status: 400 })
    }

    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer())

    // Polyfill DOMMatrix for Node.js 18 (pdfjs-dist requires it at module load time)
    polyfillDOMMatrix()

    // Extract text from PDF
    const { PDFParse } = await import('pdf-parse')
    const workerPath = `file://${process.cwd()}/node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs`
    PDFParse.setWorker(workerPath)
    const parser = new PDFParse({ data: pdfBuffer })
    const textResult = await parser.getText()
    const rawText: string = textResult.text

    // Build page-annotated text: prefix each page with "[PAGE N]\n" so Claude
    // can cite specific pages. pdf-parse uses '\f' (form-feed) as page separator.
    const pages = rawText.split('\f')
    let text: string
    if (pages.length <= 1) {
      // No page breaks in this PDF — fall back gracefully, Claude skips page fields
      text = rawText.slice(0, MAX_CHARS)
    } else {
      const chunks: string[] = []
      let total = 0
      for (let i = 0; i < pages.length; i++) {
        const pageText = pages[i].trim()
        if (!pageText) continue
        const chunk = `[PAGE ${i + 1}]\n${pageText}`
        if (total + chunk.length > MAX_CHARS) break
        chunks.push(chunk)
        total += chunk.length + 2 // +2 for '\n\n' joiner
      }
      text = chunks.join('\n\n')
    }

    if (!text.trim()) {
      return NextResponse.json({ error: 'Could not extract text from PDF' }, { status: 400 })
    }

    // Call Claude API with prompt caching
    // - system prompt cached: same style/language combo reused across requests (~450 tokens)
    // - book content cached: user may generate multiple styles for the same PDF within 5-min TTL
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: [
        {
          type: 'text',
          text: getSystemPrompt(style, language, userContext),
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Here is the book content to summarize:\n\n${text}`,
              cache_control: { type: 'ephemeral' },
            },
          ],
        },
      ],
    })

    // Log cache performance (remove in production or send to analytics)
    if (process.env.NODE_ENV !== 'production') {
      const usage = message.usage as typeof message.usage & {
        cache_creation_input_tokens?: number
        cache_read_input_tokens?: number
      }
      console.log('[summarize] token usage:', {
        input: usage.input_tokens,
        output: usage.output_tokens,
        cache_created: usage.cache_creation_input_tokens ?? 0,
        cache_read: usage.cache_read_input_tokens ?? 0,
      })
    }

    const rawContent = message.content[0].type === 'text' ? message.content[0].text : ''

    // Parse JSON from response
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Invalid response from AI' }, { status: 500 })
    }
    const summaryContent = jsonMatch[0]

    // Save to database
    const { data: summary, error: dbError } = await supabase
      .from('summaries')
      .insert({
        user_id: user.id,
        file_name: fileName,
        file_path: filePath,
        style,
        content: summaryContent,
      })
      .select()
      .single()

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    // Update reading streak
    const todayStr = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    const lastDate = userProfile?.last_summary_date ?? null
    let newStreak = 1
    if (lastDate === todayStr) {
      newStreak = userProfile?.streak_count ?? 1
    } else if (lastDate === yesterdayStr) {
      newStreak = (userProfile?.streak_count ?? 0) + 1
    }
    const newLongest = Math.max(newStreak, userProfile?.longest_streak ?? 0)
    await supabase
      .from('user_profiles')
      .upsert(
        { user_id: user.id, streak_count: newStreak, longest_streak: newLongest, last_summary_date: todayStr, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )

    // Send "summary ready" email (fire-and-forget — errors are logged but don't fail the request)
    if (user.email) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'
      sendSummaryReadyEmail(user.email, fileName, style, `${siteUrl}/dashboard`).catch((err) => {
        console.error('[email] Failed to send summary ready email:', err)
      })
    }

    return NextResponse.json({ summary })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
