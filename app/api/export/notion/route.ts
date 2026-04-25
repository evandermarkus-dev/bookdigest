import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { SUMMARY_STYLES, FIELD_LABELS, type SummaryStyle } from '@/lib/prompts'

// ── Notion block helpers ──────────────────────────────────────────────────────

type RichText = {
  type: 'text'
  text: { content: string }
  annotations?: { italic?: boolean; code?: boolean; color?: string }
}

function richText(content: string, annotations?: RichText['annotations']): RichText {
  return { type: 'text', text: { content }, ...(annotations ? { annotations } : {}) }
}

function heading2(text: string) {
  return {
    object: 'block',
    type: 'heading_2',
    heading_2: { rich_text: [richText(text)] },
  }
}

function paragraph(parts: RichText[]) {
  return {
    object: 'block',
    type: 'paragraph',
    paragraph: { rich_text: parts },
  }
}

function bullet(parts: RichText[]) {
  return {
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: { rich_text: parts },
  }
}

function divider() {
  return { object: 'block', type: 'divider', divider: {} }
}

// ── Convert summary JSON → Notion blocks ─────────────────────────────────────

function summaryToNotionBlocks(
  content: string,
  title: string,
  style: SummaryStyle
): object[] {
  let parsed: Record<string, unknown>
  try { parsed = JSON.parse(content) } catch { return [] }

  const styleInfo = SUMMARY_STYLES[style]
  const blocks: object[] = []

  // Sub-header line: style label + book title
  blocks.push(
    paragraph([
      richText(`${styleInfo.emoji} ${styleInfo.label} Summary`, { italic: true, color: 'gray' }),
    ])
  )
  blocks.push(divider())

  for (const [key, value] of Object.entries(parsed)) {
    if (key === 'title') continue

    const sectionLabel =
      FIELD_LABELS[key as keyof typeof FIELD_LABELS] ??
      key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

    blocks.push(heading2(sectionLabel))

    if (Array.isArray(value)) {
      for (const item of value as unknown[]) {
        if (typeof item === 'string') {
          blocks.push(bullet([richText(item.replace(/\*\*/g, '').replace(/\*/g, ''))]))
        } else if (typeof item === 'object' && item !== null) {
          const obj = item as Record<string, unknown>
          const page = typeof obj.page === 'number' ? obj.page : null
          const { page: _p, ...rest } = obj
          const entries = Object.entries(rest)

          const parts: RichText[] = []

          if (entries.length === 1 && 'text' in rest) {
            parts.push(richText(String(rest.text).replace(/\*\*/g, '')))
          } else if (entries.length >= 2) {
            const [first, ...tail] = entries
            parts.push(richText(String(first[1]).replace(/\*\*/g, '')))
            if (tail.length) {
              parts.push(richText(' — '))
              parts.push(richText(tail.map(([, v]) => String(v)).join(' ').replace(/\*\*/g, '')))
            }
          } else {
            parts.push(richText(entries.map(([, v]) => String(v)).join(' ').replace(/\*\*/g, '')))
          }

          // Append page citation as italic gray text
          if (page !== null) {
            parts.push(richText(` p.${page}`, { italic: true, color: 'gray' }))
          }

          blocks.push(bullet(parts))
        }
      }
    } else if (typeof value === 'string' && value.trim()) {
      blocks.push(paragraph([richText(value.replace(/\*\*/g, '').replace(/\*/g, ''))]))
    }
  }

  // Notion allows max 100 children per request — trim if needed
  return blocks.slice(0, 98)
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { summaryId } = await request.json() as { summaryId: string }
  if (!summaryId) return NextResponse.json({ error: 'Missing summaryId' }, { status: 400 })

  // Fetch summary + Notion credentials in parallel
  const [{ data: summary }, { data: profile }] = await Promise.all([
    supabase.from('summaries').select('content, style, file_name').eq('id', summaryId).eq('user_id', user.id).single(),
    supabase.from('user_profiles').select('notion_token, notion_parent_id').eq('user_id', user.id).single(),
  ])

  if (!summary) return NextResponse.json({ error: 'Summary not found' }, { status: 404 })
  if (!profile?.notion_token || !profile?.notion_parent_id) {
    return NextResponse.json({ error: 'Notion not connected' }, { status: 400 })
  }

  const title = (() => {
    try {
      const p = JSON.parse(summary.content) as Record<string, unknown>
      return typeof p.title === 'string' ? p.title : summary.file_name
    } catch { return summary.file_name }
  })()

  const pageTitle = `${title} — ${SUMMARY_STYLES[summary.style as SummaryStyle].label}`
  const blocks = summaryToNotionBlocks(summary.content, title, summary.style as SummaryStyle)

  // Format parent ID with dashes (Notion API accepts both but this is canonical)
  const raw = profile.notion_parent_id.replace(/-/g, '')
  const parentId = `${raw.slice(0,8)}-${raw.slice(8,12)}-${raw.slice(12,16)}-${raw.slice(16,20)}-${raw.slice(20)}`

  const notionRes = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${profile.notion_token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parent: { type: 'page_id', page_id: parentId },
      properties: {
        title: { title: [{ type: 'text', text: { content: pageTitle } }] },
      },
      children: blocks,
    }),
  })

  if (!notionRes.ok) {
    const err = await notionRes.json().catch(() => ({}))
    if (notionRes.status === 401) return NextResponse.json({ error: 'Invalid Notion token' }, { status: 401 })
    return NextResponse.json({ error: (err as { message?: string }).message ?? 'Notion error' }, { status: 502 })
  }

  const page = await notionRes.json() as { url?: string }
  return NextResponse.json({ url: page.url })
}
