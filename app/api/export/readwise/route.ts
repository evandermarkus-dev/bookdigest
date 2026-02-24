import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { SUMMARY_STYLES, FIELD_LABELS, type SummaryStyle } from '@/lib/prompts'

interface ReadwiseHighlight {
  text: string
  title: string
  source_type: string
  note?: string
  location?: number
  location_type?: string
}

function summaryToHighlights(content: string, title: string, style: SummaryStyle): ReadwiseHighlight[] {
  let parsed: Record<string, unknown>
  try { parsed = JSON.parse(content) } catch { return [] }

  const styleInfo = SUMMARY_STYLES[style]
  const highlights: ReadwiseHighlight[] = []

  for (const [key, value] of Object.entries(parsed)) {
    if (key === 'title') continue
    const sectionLabel = FIELD_LABELS[key as keyof typeof FIELD_LABELS]
      ?? key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    const sectionNote = `${styleInfo.label} — ${sectionLabel}`

    if (Array.isArray(value)) {
      for (const item of value as unknown[]) {
        let text = ''
        let page: number | null = null

        if (typeof item === 'string') {
          text = item.replace(/\*\*/g, '').replace(/\*/g, '').trim()
        } else if (typeof item === 'object' && item !== null) {
          const obj = item as Record<string, unknown>
          page = typeof obj.page === 'number' ? obj.page : null
          const { page: _p, ...rest } = obj
          const parts = Object.values(rest).map(v => String(v).replace(/\*\*/g, '').replace(/\*/g, '').trim())
          text = parts.join(' — ')
        }

        if (!text) continue

        highlights.push({
          text,
          title,
          source_type: 'books',
          note: sectionNote,
          ...(page !== null ? { location: page, location_type: 'page' } : {}),
        })
      }
    } else if (typeof value === 'string' && value.trim()) {
      // Scalar fields (overview, core_message etc) — one highlight per field
      highlights.push({
        text: value.replace(/\*\*/g, '').replace(/\*/g, '').trim(),
        title,
        source_type: 'books',
        note: sectionNote,
      })
    }
  }

  return highlights
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { summaryId } = await request.json() as { summaryId: string }
  if (!summaryId) return NextResponse.json({ error: 'Missing summaryId' }, { status: 400 })

  // Fetch summary
  const { data: summary, error: sumErr } = await supabase
    .from('summaries')
    .select('content, style, file_name')
    .eq('id', summaryId)
    .eq('user_id', user.id)
    .single()

  if (sumErr || !summary) return NextResponse.json({ error: 'Summary not found' }, { status: 404 })

  // Fetch Readwise token
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('readwise_token')
    .eq('user_id', user.id)
    .single()

  const token = profile?.readwise_token
  if (!token) return NextResponse.json({ error: 'No Readwise token saved' }, { status: 400 })

  // Build highlights
  const title = (() => {
    try {
      const p = JSON.parse(summary.content) as Record<string, unknown>
      return typeof p.title === 'string' ? p.title : summary.file_name
    } catch { return summary.file_name }
  })()

  const highlights = summaryToHighlights(summary.content, title, summary.style as SummaryStyle)
  if (!highlights.length) return NextResponse.json({ error: 'No highlights to export' }, { status: 400 })

  // Send to Readwise
  const rwRes = await fetch('https://readwise.io/api/v2/highlights/', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ highlights }),
  })

  if (!rwRes.ok) {
    const text = await rwRes.text()
    if (rwRes.status === 401) return NextResponse.json({ error: 'Invalid Readwise token' }, { status: 401 })
    return NextResponse.json({ error: `Readwise error: ${text}` }, { status: 502 })
  }

  return NextResponse.json({ count: highlights.length })
}
