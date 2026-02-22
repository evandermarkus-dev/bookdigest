import { FREE_LIMIT } from '@/lib/prompts'

interface UsageStatsProps {
  totalBooks: number
  totalSummaries: number
  summariesThisMonth: number
  streakCount?: number
  longestStreak?: number
  isPro?: boolean
}

export default function UsageStats({
  totalBooks,
  totalSummaries,
  summariesThisMonth,
  streakCount = 0,
  longestStreak = 0,
  isPro = false,
}: UsageStatsProps) {
  const pct = Math.min((summariesThisMonth / FREE_LIMIT) * 100, 100)
  const remaining = Math.max(FREE_LIMIT - summariesThisMonth, 0)
  const atLimit = !isPro && summariesThisMonth >= FREE_LIMIT

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Stats */}
      <div className="flex gap-4 sm:gap-6 flex-1 flex-wrap">
        <div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalBooks}</p>
          <p className="text-xs text-gray-500 mt-0.5">Books</p>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalSummaries}</p>
          <p className="text-xs text-gray-500 mt-0.5">Summaries</p>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{summariesThisMonth}</p>
          <p className="text-xs text-gray-500 mt-0.5">This month</p>
        </div>
        {streakCount > 0 && (
          <div>
            <p className="text-xl sm:text-2xl font-bold text-orange-500">
              🔥 {streakCount}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Day streak{longestStreak > streakCount ? ` · best ${longestStreak}` : ''}
            </p>
          </div>
        )}
        {isPro && (
          <div className="flex items-center">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">
              ⚡ Pro
            </span>
          </div>
        )}
      </div>

      {/* Monthly usage bar (hidden for Pro) */}
      {!isPro ? (
        <div className="sm:w-56 shrink-0">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Monthly usage</span>
            <span className={atLimit ? 'text-red-500 font-medium' : ''}>
              {summariesThisMonth}/{FREE_LIMIT}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                pct >= 100 ? 'bg-red-400' : pct >= 70 ? 'bg-amber-400' : 'bg-indigo-500'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className={`text-xs mt-1.5 ${atLimit ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
            {atLimit ? 'Monthly limit reached' : `${remaining} remaining this month`}
          </p>
        </div>
      ) : (
        <div className="sm:w-56 shrink-0">
          <p className="text-xs text-indigo-600 font-medium">Unlimited summaries</p>
          <p className="text-xs text-gray-400 mt-0.5">BookDigest Pro active</p>
        </div>
      )}
    </div>
  )
}
