import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { detectLanguageFromContent } from '@/lib/prompts'
import { checkRateLimit } from '@/lib/ratelimit'

const LANGUAGE_NAMES: Record<string, string> = {
  sv: 'Swedish',
  en: 'English',
  de: 'German',
  fr: 'French',
  es: 'Spanish',
  no: 'Norwegian',
  da: 'Danish',
  fi: 'Finnish',
}

const BUCKET = 'Books'
const CACHE_FOLDER = 'audio'

// Service-role client bypasses RLS — used only for server-managed storage cache
function adminStorage() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  ).storage
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ summaryId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('tier')
    .eq('user_id', user.id)
    .single()

  if (!profile || profile.tier === 'free') {
    return NextResponse.json({ error: 'AI audio requires Reader or Pro plan' }, { status: 403 })
  }

  // Rate limit audio generation (Claude + OpenAI TTS — most expensive per request)
  const rlResponse = await checkRateLimit('audio', user.id)
  if (rlResponse) return rlResponse

  const { summaryId } = await params
  const storagePath = `${CACHE_FOLDER}/${summaryId}.mp3`

  // Check cache — list() is the reliable way to test file existence
  const storage = adminStorage()
  const { data: files } = await storage
    .from(BUCKET)
    .list(CACHE_FOLDER, { search: `${summaryId}.mp3` })

  if (files && files.length > 0) {
    const { data: signed } = await storage
      .from(BUCKET)
      .createSignedUrl(storagePath, 3600)
    if (signed?.signedUrl) {
      return NextResponse.json({ url: signed.signedUrl, cached: true })
    }
  }

  // Fetch summary from DB
  const { data: summary } = await supabase
    .from('summaries')
    .select('content, style, file_name')
    .eq('id', summaryId)
    .eq('user_id', user.id)
    .single()

  if (!summary) return NextResponse.json({ error: 'Summary not found' }, { status: 404 })

  // Build readable text from summary JSON
  let parsed: Record<string, unknown> = {}
  try { parsed = JSON.parse(summary.content) } catch { /* use empty */ }
  const title = typeof parsed.title === 'string' ? parsed.title : summary.file_name

  // Detect language from the summary content
  const langCode = detectLanguageFromContent(summary.content)
  const langName = LANGUAGE_NAMES[langCode] ?? 'English'

  const summaryText = Object.entries(parsed)
    .filter(([k]) => k !== 'title')
    .map(([k, v]) => {
      const label = k.replace(/_/g, ' ')
      if (Array.isArray(v)) {
        const items = (v as unknown[]).map(item => {
          if (typeof item === 'string') return item
          if (typeof item === 'object' && item !== null) {
            const obj = item as Record<string, unknown>
            return Object.values(obj)
              .filter(x => x !== null && typeof x !== 'number')
              .join(': ')
          }
          return String(item)
        }).join('. ')
        return `${label}: ${items}`
      }
      return `${label}: ${String(v)}`
    })
    .join('\n\n')

  // Step 1 — Claude writes a spoken script
  const anthropic = new Anthropic()
  const scriptMsg = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Convert this book summary into a warm, engaging spoken narration for audio.
Write in flowing prose — no bullet points, no markdown, no section headers.
Write as if a knowledgeable friend is telling you about the book.
Length: 250–350 words. Write entirely in ${langName} — every single word.
Output ONLY the narration text, nothing else.

Book: ${title}

${summaryText}`,
    }],
  })

  const script = scriptMsg.content[0].type === 'text' ? scriptMsg.content[0].text : ''
  if (!script) return NextResponse.json({ error: 'Script generation failed' }, { status: 500 })

  // Step 2 — OpenAI TTS
  const ttsRes = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: 'tts-1', input: script, voice: 'nova' }),
  })

  if (!ttsRes.ok) {
    const err = await ttsRes.text()
    console.error('OpenAI TTS error:', err)
    // Surface the real error in dev so we can see exactly what's wrong
    let detail = 'Audio generation failed'
    try { detail = JSON.parse(err)?.error?.message ?? err } catch { detail = err }
    return NextResponse.json({ error: detail }, { status: 502 })
  }

  const audioBuffer = await ttsRes.arrayBuffer()

  // Step 3 — Cache in Supabase Storage (admin client bypasses RLS)
  const { error: uploadError } = await storage
    .from(BUCKET)
    .upload(storagePath, audioBuffer, { contentType: 'audio/mpeg', upsert: true })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: signed } = await storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 3600)

  return NextResponse.json({ url: signed?.signedUrl })
}
