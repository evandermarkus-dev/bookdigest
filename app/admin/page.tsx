import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

const ADMIN_EMAIL = 'evandermarkus@gmail.com'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('sv-SE', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'idag'
  if (days === 1) return 'igår'
  if (days < 30) return `${days} dagar sedan`
  const months = Math.floor(days / 30)
  return `${months} mån sedan`
}

export default async function AdminPage() {
  // 1. Auth check — only admin can access
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/dashboard')
  }

  // 2. Fetch data using service role client
  const admin = createAdminClient()

  const [
    { data: usersData },
    { data: summaries },
    { data: allSummaries },
  ] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 100 }),
    admin.from('summaries').select('id, user_id, file_name, style, created_at').order('created_at', { ascending: false }).limit(20),
    admin.from('summaries').select('id, user_id, created_at'),
  ])

  const users = usersData?.users ?? []
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const summariesThisMonth = (allSummaries ?? []).filter(s => s.created_at >= startOfMonth).length
  const newUsersThisMonth = users.filter(u => u.created_at >= startOfMonth).length

  // Per-user summary count
  const summaryCountByUser = (allSummaries ?? []).reduce<Record<string, number>>((acc, s) => {
    acc[s.user_id] = (acc[s.user_id] ?? 0) + 1
    return acc
  }, {})

  return (
    <main className="min-h-screen" style={{ background: 'var(--app-bg)' }}>
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', color: 'var(--app-text)' }}>
              Book<span style={{ color: 'var(--app-accent)' }}>Digest</span> Admin
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--app-muted)' }}>Intern översikt — synlig bara för dig</p>
          </div>
          <a href="/dashboard" className="text-sm transition-colors" style={{ color: 'var(--app-muted)' }}>
            ← Min dashboard
          </a>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Användare totalt', value: users.length, sub: `+${newUsersThisMonth} denna månad` },
            { label: 'Sammanfattningar totalt', value: allSummaries?.length ?? 0, sub: `${summariesThisMonth} denna månad` },
            { label: 'Aktiva användare', value: Object.keys(summaryCountByUser).length, sub: 'har skapat minst 1' },
            { label: 'Snitt per användare', value: users.length > 0 ? ((allSummaries?.length ?? 0) / users.length).toFixed(1) : '0', sub: 'sammanfattningar' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="rounded-2xl p-5" style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
              <p className="text-xs mb-1" style={{ color: 'var(--app-muted)' }}>{label}</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--app-text)' }}>{value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--app-muted)' }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Users table */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--app-text)' }}>Användare</h2>
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--app-border)' }}>
                  {['E-post', 'Registrerad', 'Senast inloggad', 'Sammanfattningar'].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-medium" style={{ color: 'var(--app-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr
                    key={u.id}
                    style={{ borderTop: i > 0 ? '1px solid var(--app-border)' : undefined }}
                  >
                    <td className="px-5 py-3" style={{ color: 'var(--app-text)' }}>
                      {u.email}
                      {u.email === ADMIN_EMAIL && (
                        <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--app-accent-dim)', color: '#8a6820' }}>du</span>
                      )}
                    </td>
                    <td className="px-5 py-3" style={{ color: 'var(--app-muted)' }}>{formatDate(u.created_at)}</td>
                    <td className="px-5 py-3" style={{ color: 'var(--app-muted)' }}>
                      {u.last_sign_in_at ? timeAgo(u.last_sign_in_at) : '—'}
                    </td>
                    <td className="px-5 py-3 font-medium" style={{ color: 'var(--app-text)' }}>
                      {summaryCountByUser[u.id] ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent summaries */}
        <section>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--app-text)' }}>Senaste sammanfattningar</h2>
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--app-border)' }}>
                  {['Bok', 'Stil', 'Skapad'].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-medium" style={{ color: 'var(--app-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(summaries ?? []).map((s, i) => (
                  <tr
                    key={s.id}
                    style={{ borderTop: i > 0 ? '1px solid var(--app-border)' : undefined }}
                  >
                    <td className="px-5 py-3 max-w-xs truncate" style={{ color: 'var(--app-text)' }} title={s.file_name}>
                      {s.file_name.replace(/\.pdf$/i, '')}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: 'var(--app-accent-dim)', color: '#8a6820' }}>
                        {s.style}
                      </span>
                    </td>
                    <td className="px-5 py-3" style={{ color: 'var(--app-muted)' }}>{timeAgo(s.created_at)}</td>
                  </tr>
                ))}
                {(summaries ?? []).length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center" style={{ color: 'var(--app-muted)' }}>
                      Inga sammanfattningar ännu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  )
}
