import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'

// ---------------------------------------------------------------------------
// DELETE /api/delete-account
// Permanently removes all user data and the auth account.
// Order matters: auth user deletion must be last.
// ---------------------------------------------------------------------------
export async function DELETE() {
  try {
    // Verify the request comes from an authenticated session
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = createAdminClient()

    // 1. Collect summary IDs so we can cascade-delete shared_summaries
    const { data: summaryRows } = await admin
      .from('summaries')
      .select('id')
      .eq('user_id', user.id)

    if (summaryRows && summaryRows.length > 0) {
      const ids = summaryRows.map((s: { id: string }) => s.id)
      await admin.from('shared_summaries').delete().in('summary_id', ids)
    }

    // 2. Delete summaries
    await admin.from('summaries').delete().eq('user_id', user.id)

    // 3. Delete user profile (preferences, tokens, tier info)
    await admin.from('user_profiles').delete().eq('user_id', user.id)

    // 4. Delete uploaded PDF files from storage (stored under {user_id}/ prefix)
    const { data: files } = await admin.storage
      .from('Books')
      .list(user.id, { limit: 1000 })

    if (files && files.length > 0) {
      const paths = files.map((f: { name: string }) => `${user.id}/${f.name}`)
      await admin.storage.from('Books').remove(paths)
    }

    // 5. Delete the Supabase auth user — must be last
    const { error: authError } = await admin.auth.admin.deleteUser(user.id)
    if (authError) {
      console.error('[delete-account] Auth deletion failed:', authError.message)
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
