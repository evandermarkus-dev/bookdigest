import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const filePath = url.searchParams.get('filePath')

    if (!filePath) {
      return NextResponse.json({ error: 'Missing filePath' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete all summaries for this file (RLS ensures user owns them)
    const { error: dbError } = await supabase
      .from('summaries')
      .delete()
      .eq('file_path', filePath)
      .eq('user_id', user.id)

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    // Remove file from storage
    const { error: storageError } = await supabase.storage
      .from('Books')
      .remove([filePath])

    if (storageError) {
      // Non-fatal: summaries are deleted, log and continue
      console.error('Storage removal failed:', storageError.message)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
