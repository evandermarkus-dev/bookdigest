import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function PUT(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { token } = await request.json() as { token: string }
  if (!token?.trim()) return NextResponse.json({ error: 'Token required' }, { status: 400 })

  const { error } = await supabase
    .from('user_profiles')
    .update({ readwise_token: token.trim() })
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
    .update({ readwise_token: null })
    .eq('user_id', user.id)

  return NextResponse.json({ ok: true })
}
