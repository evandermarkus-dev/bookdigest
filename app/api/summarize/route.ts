import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase-server'
import { getSystemPrompt, FREE_LIMIT, type SummaryStyle } from '@/lib/prompts'
import { sendSummaryReadyEmail } from '@/lib/email'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const MAX_CHARS = 80000

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

    // Check Pro status and monthly usage limit
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('is_pro, streak_count, longest_streak, last_summary_date')
      .eq('user_id', user.id)
      .single()

    const isPro = userProfile?.is_pro ?? false

    if (!isPro) {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
      const { count } = await supabase
        .from('summaries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth)
      if ((count ?? 0) >= FREE_LIMIT) {
        return NextResponse.json({ error: 'Monthly limit reached. Upgrade to continue.' }, { status: 429 })
      }
    }

    // Create signed URL and download PDF
    const { data: signedData, error: signedError } = await supabase.storage
      .from('Books')
      .createSignedUrl(filePath, 60)

    if (signedError || !signedData) {
      return NextResponse.json({ error: 'Could not access file' }, { status: 400 })
    }

    const pdfResponse = await fetch(signedData.signedUrl)
    if (!pdfResponse.ok) {
      return NextResponse.json({ error: 'Could not download file' }, { status: 400 })
    }

    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer())

    // Extract text from PDF
    const { PDFParse } = await import('pdf-parse')
    const workerPath = `file://${process.cwd()}/node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs`
    PDFParse.setWorker(workerPath)
    const parser = new PDFParse({ data: pdfBuffer })
    const textResult = await parser.getText()
    const text = textResult.text.slice(0, MAX_CHARS)

    if (!text.trim()) {
      return NextResponse.json({ error: 'Could not extract text from PDF' }, { status: 400 })
    }

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: getSystemPrompt(style, language, userContext),
      messages: [
        {
          role: 'user',
          content: `Here is the book content to summarize:\n\n${text}`,
        },
      ],
    })

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

    // Send "summary ready" email (fire-and-forget)
    if (user.email) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'
      sendSummaryReadyEmail(user.email, fileName, style, `${siteUrl}/dashboard`)
    }

    return NextResponse.json({ summary })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
