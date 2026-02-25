import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import PdfUpload from '@/components/PdfUpload'
import BookCard, { type Book } from '@/components/BookCard'
import LibrarySearch from '@/components/LibrarySearch'
import UsageStats from '@/components/UsageStats'
import { type SummaryStyle } from '@/lib/prompts'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ upgraded?: string }> }) {
  const params = await searchParams
  const justUpgraded = params.upgraded === '1'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: summaries } = await supabase
    .from('summaries')
    .select('*')
    .order('created_at', { ascending: false })

  // Group summaries by file_path (one entry per uploaded book)
  const booksMap = (summaries ?? []).reduce<Record<string, Book>>((acc, summary) => {
    const key = summary.file_path
    if (!acc[key]) {
      acc[key] = { file_name: summary.file_name, file_path: key, summaries: {} }
    }
    acc[key].summaries[summary.style as SummaryStyle] = summary
    return acc
  }, {})
  const books = Object.values(booksMap)

  // Usage stats
  const allSummaries = summaries ?? []
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const summariesThisMonth = allSummaries.filter(s => s.created_at >= startOfMonth).length

  // User profile (streak + pro status)
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('streak_count, longest_streak, is_pro')
    .eq('user_id', user.id)
    .single()

  return (
    <main className="min-h-screen" style={{ background: 'var(--app-bg)' }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 gap-4">
          <h1 className="text-2xl sm:text-3xl shrink-0" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 700, color: 'var(--app-text)' }}>
            Book<span style={{ color: 'var(--app-accent)' }}>Digest</span>
          </h1>
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-sm truncate hidden sm:block" style={{ color: 'var(--app-muted)' }}>{user.email}</span>
            <Link
              href="/settings"
              className="p-1.5 rounded-lg transition-colors hover:bg-black/5"
              style={{ color: 'var(--app-muted)' }}
              title="Settings"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm transition-colors whitespace-nowrap"
                style={{ color: 'var(--app-muted)' }}
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        {/* Pro upgrade success banner */}
        {justUpgraded && (
          <div className="mb-6 rounded-2xl p-4 flex items-center gap-3" style={{ background: 'var(--app-accent)', color: '#1a0f00' }}>
            <span className="text-2xl">⚡</span>
            <div>
              <p className="font-semibold">Welcome to BookDigest Pro!</p>
              <p className="text-sm opacity-70">Unlimited summaries are now active. Enjoy!</p>
            </div>
          </div>
        )}

        {/* Usage Stats */}
        <UsageStats
          totalBooks={books.length}
          totalSummaries={allSummaries.length}
          summariesThisMonth={summariesThisMonth}
          streakCount={userProfile?.streak_count ?? 0}
          longestStreak={userProfile?.longest_streak ?? 0}
          isPro={userProfile?.is_pro ?? false}
        />

        {/* Upload Area */}
        <PdfUpload summariesThisMonth={summariesThisMonth} />

        {/* Books */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--app-text)' }}>Your Books</h2>
          <LibrarySearch
            books={books}
            summariesThisMonth={summariesThisMonth}
            emptyState={
              <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
                <div className="px-8 pt-10 pb-8 text-center">
                  <div className="text-5xl mb-4">📚</div>
                  <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', color: 'var(--app-text)' }}>
                    Your library is empty
                  </h3>
                  <p className="text-sm max-w-sm mx-auto" style={{ color: 'var(--app-muted)' }}>
                    Upload any PDF book above — BookDigest extracts the key insights and turns them into a structured, readable summary in seconds.
                  </p>
                </div>
                <div className="px-6 pb-10 flex items-start justify-center gap-4 sm:gap-10 flex-wrap">
                  {([
                    { step: '1', emoji: '📄', label: 'Upload a PDF', desc: 'Any non-fiction book' },
                    { step: '2', emoji: '✨', label: 'AI summarizes', desc: 'Executive, Study, or Action style' },
                    { step: '3', emoji: '💡', label: 'Read & explore', desc: 'Chat, export, listen' },
                  ] as const).map(({ step, emoji, label, desc }) => (
                    <div key={step} className="flex items-start gap-3 sm:flex-col sm:items-center sm:gap-2 sm:text-center min-w-[160px] sm:min-w-[100px]">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                        style={{ background: 'var(--app-accent-dim)', color: '#8a6820', border: '1px solid rgba(201,150,58,0.35)' }}>
                        {step}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--app-text)' }}>{emoji} {label}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--app-muted)' }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-8 py-3 text-center text-xs" style={{ borderTop: '1px solid var(--app-border)', color: 'var(--app-muted)', background: 'rgba(201,150,58,0.04)' }}>
                  Works best with non-fiction PDFs — business, self-help, science, and more.
                </div>
              </div>
            }
          />
        </div>
      </div>
    </main>
  )
}
