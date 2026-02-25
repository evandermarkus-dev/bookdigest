import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function PUT(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { goal, level, focus } = await request.json() as {
    goal: string; level: string; focus: string
  }
  if (!goal || !level || !focus) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { error } = await supabase
    .from('user_profiles')
    .update({ goal, level, focus, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
