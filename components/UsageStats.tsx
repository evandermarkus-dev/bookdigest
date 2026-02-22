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
    <div
      className="rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4"
      style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}
    >
      {/* Stats */}
      <div className="flex gap-5 sm:gap-7 flex-1 flex-wrap">
        {[
          { value: totalBooks, label: 'Books' },
          { value: totalSummaries, label: 'Summaries' },
          { value: summariesThisMonth, label: 'This month' },
        ].map(({ value, label }) => (
          <div key={label}>
            <p
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif', color: 'var(--app-text)' }}
            >
              {value}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--app-muted)' }}>{label}</p>
          </div>
        ))}

        {streakCount > 0 && (
          <div>
            <p
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif', color: '#c9963a' }}
            >
              🔥 {streakCount}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--app-muted)' }}>
              Day streak{longestStreak > streakCount ? ` · best ${longestStreak}` : ''}
            </p>
          </div>
        )}

        {isPro && (
          <div className="flex items-center">
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full"
              style={{ background: 'var(--app-accent)', color: '#1a0f00' }}
            >
              ⚡ Pro
            </span>
          </div>
        )}
      </div>

      {/* Monthly usage bar */}
      {!isPro ? (
        <div className="sm:w-56 shrink-0">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--app-muted)' }}>
            <span>Monthly usage</span>
            <span style={atLimit ? { color: '#b45309', fontWeight: 500 } : {}}>
              {summariesThisMonth}/{FREE_LIMIT}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--app-border)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: pct >= 100 ? '#b45309' : pct >= 70 ? '#d97706' : 'var(--app-accent)',
              }}
            />
          </div>
          <p className="text-xs mt-1.5" style={{ color: atLimit ? '#b45309' : 'var(--app-muted)', fontWeight: atLimit ? 500 : undefined }}>
            {atLimit ? 'Monthly limit reached' : `${remaining} remaining this month`}
          </p>
        </div>
      ) : (
        <div className="sm:w-56 shrink-0">
          <p className="text-xs font-medium" style={{ color: 'var(--app-accent)' }}>Unlimited summaries</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--app-muted)' }}>BookDigest Pro active</p>
        </div>
      )}
    </div>
  )
}
