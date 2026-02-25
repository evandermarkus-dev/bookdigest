import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import SettingsClient from '@/components/SettingsClient'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('goal, level, focus, readwise_token')
    .eq('user_id', user.id)
    .single()

  return (
    <main className="min-h-screen" style={{ background: 'var(--app-bg)' }}>
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg transition-colors hover:bg-black/5"
            style={{ color: 'var(--app-muted)' }}
            aria-label="Back to dashboard"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', color: 'var(--app-text)' }}>
            Settings
          </h1>
        </div>

        <SettingsClient
          email={user.email ?? ''}
          initialGoal={profile?.goal ?? 'apply'}
          initialLevel={profile?.level ?? 'intermediate'}
          initialFocus={profile?.focus ?? 'practical'}
          initialReadwiseConnected={!!profile?.readwise_token}
        />
      </div>
    </main>
  )
}
