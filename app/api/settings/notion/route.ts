import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// Extract a Notion page ID from a full URL or raw UUID
function parseNotionPageId(input: string): string | null {
  const clean = input.trim()
  // Raw 32-char hex (with or without dashes)
  const uuidRe = /([0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12})/i
  const match = clean.match(uuidRe)
  if (match) return match[1].replace(/-/g, '') // store without dashes — Notion accepts both
  return null
}

export async function PUT(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { token, parentUrl } = await request.json() as { token: string; parentUrl: string }
  if (!token?.trim()) return NextResponse.json({ error: 'Token required' }, { status: 400 })
  if (!parentUrl?.trim()) return NextResponse.json({ error: 'Parent page URL required' }, { status: 400 })

  const parentId = parseNotionPageId(parentUrl)
  if (!parentId) return NextResponse.json({ error: 'Could not parse a Notion page ID from that URL' }, { status: 400 })

  // Verify token works by hitting the Notion API
  const verifyRes = await fetch('https://api.notion.com/v1/users/me', {
    headers: { Authorization: `Bearer ${token.trim()}`, 'Notion-Version': '2022-06-28' },
  })
  if (!verifyRes.ok) return NextResponse.json({ error: 'Invalid Notion token' }, { status: 401 })

  const { error } = await supabase
    .from('user_profiles')
    .update({ notion_token: token.trim(), notion_parent_id: parentId })
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await supabase
    .from('user_profiles')
    .update({ notion_token: null, notion_parent_id: null })
    .eq('user_id', user.id)

  return NextResponse.json({ ok: true })
}
