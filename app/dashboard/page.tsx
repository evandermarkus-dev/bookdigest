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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 shrink-0">📚 BookDigest</h1>
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-sm text-gray-600 truncate hidden sm:block">{user.email}</span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors whitespace-nowrap"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        {/* Pro upgrade success banner */}
        {justUpgraded && (
          <div className="mb-6 bg-indigo-600 text-white rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="font-semibold">Welcome to BookDigest Pro!</p>
              <p className="text-sm text-indigo-200">Unlimited summaries are now active. Enjoy!</p>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Books</h2>
          {books.length > 0 ? (
            <div className="space-y-3">
              {books.map((book) => (
                <BookCard key={book.file_path} book={book} summariesThisMonth={summariesThisMonth} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="text-5xl mb-4">📖</div>
              <p className="text-gray-700 font-medium mb-1">No books yet</p>
              <p className="text-sm text-gray-400">Upload a PDF above to generate your first summary</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
