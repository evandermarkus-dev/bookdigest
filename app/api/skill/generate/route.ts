import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase-server'
import { checkRateLimit } from '@/lib/ratelimit'
import {
  SUMMARY_STYLES, FIELD_LABELS,
  getSkillPrompt,
  type SummaryStyle, type SkillFocusArea, type SkillPersona,
} from '@/lib/prompts'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

/** Convert stored summary JSON to readable plain text for the skill prompt. */
function summaryToText(content: string, style: string, title: string): string {
  let parsed: Record<string, unknown>
  try { parsed = JSON.parse(content) } catch { return content }

  const styleInfo = SUMMARY_STYLES[style as SummaryStyle]
  const lines: string[] = [`# ${title} — ${styleInfo?.label ?? style} Summary\n`]

  for (const [key, value] of Object.entries(parsed)) {
    if (key === 'title') continue
    const label =
      FIELD_LABELS[key] ??
      key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    lines.push(`\n## ${label}`)

    if (Array.isArray(value)) {
      for (const item of value as unknown[]) {
        if (typeof item === 'string') {
          lines.push(`- ${item.replace(/\*\*/g, '').replace(/\*/g, '')}`)
        } else if (typeof item === 'object' && item !== null) {
          const obj = item as Record<string, unknown>
          const { page: _p, ...rest } = obj
          const parts = Object.values(rest).map(v =>
            String(v).replace(/\*\*/g, '').replace(/\*/g, '')
          )
          lines.push(`- ${parts.join(' — ')}`)
        }
      }
    } else {
      lines.push(String(value).replace(/\*\*/g, '').replace(/\*/g, ''))
    }
  }
  return lines.join('\n')
}

/** Extract kebab-case skill name from Claude's YAML frontmatter. Falls back to slugified title. */
function extractSkillName(content: string, fallback: string): string {
  const match = content.match(/^---[\s\S]*?^name:\s*([^\n]+)/m)
  if (match) {
    const raw = match[1].trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    if (raw.length > 2) return raw
  }
  return fallback
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Fetch tier — default to free if profile missing
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('tier')
    .eq('user_id', user.id)
    .single()

  const tier = (profile?.tier ?? 'free') as 'free' | 'reader' | 'pro'

  if (tier === 'free') {
    return NextResponse.json(
      { error: 'Claude Skill generation requires a Reader or Pro subscription.' },
      { status: 403 }
    )
  }

  // Reader users are rate-limited; Pro users are not
  if (tier === 'reader') {
    const rlResponse = await checkRateLimit('skill', user.id)
    if (rlResponse) return rlResponse
  }

  const body = await request.json() as {
    summaryId: string
    focusArea:  SkillFocusArea
    tools:      string[]
    persona:    SkillPersona
    freetext?:  string
  }

  const { summaryId, focusArea, tools, persona, freetext } = body

  if (!summaryId || !focusArea || !tools?.length || !persona) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Fetch summary — .eq('user_id') is the auth guard
  const { data: summary } = await supabase
    .from('summaries')
    .select('content, style, file_name')
    .eq('id', summaryId)
    .eq('user_id', user.id)
    .single()

  if (!summary) {
    return NextResponse.json({ error: 'Summary not found' }, { status: 404 })
  }

  const title = (() => {
    try {
      const p = JSON.parse(summary.content) as Record<string, unknown>
      return typeof p.title === 'string' ? p.title : summary.file_name
    } catch { return summary.file_name }
  })()

  const summaryText = summaryToText(summary.content, summary.style, title)
  const prompt = getSkillPrompt({ summaryText, focusArea, tools, persona, freetext })

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  })

  const skillContent =
    response.content[0].type === 'text' ? response.content[0].text.trim() : ''

  const fallback = `${title}-${focusArea}`
  const skillName = extractSkillName(skillContent, fallback)

  return NextResponse.json({ skillName, skillContent })
}
