import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import PdfUpload from '@/components/PdfUpload'
import BookCard, { type Book } from '@/components/BookCard'
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
          {books.length > 0 ? (
            <div className="space-y-3">
              {books.map((book) => (
                <BookCard key={book.file_path} book={book} summariesThisMonth={summariesThisMonth} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl p-12 text-center" style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
              <div className="text-5xl mb-4">📖</div>
              <p className="font-medium mb-1" style={{ color: 'var(--app-text)' }}>No books yet</p>
              <p className="text-sm" style={{ color: 'var(--app-muted)' }}>Upload a PDF above to generate your first summary</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
