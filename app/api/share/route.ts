import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// ---------------------------------------------------------------------------
// DELETE /api/share?summaryId=<id>
// Revokes a share link the user owns.
// ---------------------------------------------------------------------------
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const summaryId = url.searchParams.get('summaryId')
    if (!summaryId) return NextResponse.json({ error: 'Missing summaryId' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Delete only rows where this user is the owner (RLS + explicit eq)
    const { error } = await supabase
      .from('shared_summaries')
      .delete()
      .eq('summary_id', summaryId)
      .eq('user_id', user.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { summaryId } = await request.json()
    if (!summaryId) return NextResponse.json({ error: 'Missing summaryId' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Get the summary — RLS ensures the user owns it
    const { data: summary } = await supabase
      .from('summaries')
      .select('id, file_name, style, content')
      .eq('id', summaryId)
      .eq('user_id', user.id)
      .single()

    if (!summary) return NextResponse.json({ error: 'Summary not found' }, { status: 404 })

    // Return existing share link if already created
    const { data: existing } = await supabase
      .from('shared_summaries')
      .select('token')
      .eq('summary_id', summaryId)
      .single()

    if (existing) return NextResponse.json({ token: existing.token })

    // Create new share
    const { data: share, error: shareError } = await supabase
      .from('shared_summaries')
      .insert({
        summary_id: summary.id,
        user_id: user.id,
        file_name: summary.file_name,
        style: summary.style,
        content: summary.content,
      })
      .select('token')
      .single()

    if (shareError) return NextResponse.json({ error: shareError.message }, { status: 500 })

    return NextResponse.json({ token: share.token })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
