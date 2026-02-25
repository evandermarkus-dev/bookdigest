'use client'

import { useState } from 'react'

const QUESTIONS = [
  {
    id: 'goal' as const,
    label: 'Main reading goal',
    options: [
      { value: 'apply', label: '💼 Apply to my work' },
      { value: 'learn', label: '🎓 Deep understanding' },
      { value: 'reference', label: '📌 Quick reference' },
      { value: 'teach', label: '👥 Teach others' },
    ],
  },
  {
    id: 'level' as const,
    label: 'Experience level with topics',
    options: [
      { value: 'beginner', label: '🌱 Complete beginner' },
      { value: 'some', label: '📖 Some familiarity' },
      { value: 'intermediate', label: '⚡ Intermediate' },
      { value: 'expert', label: '🏆 Advanced / Expert' },
    ],
  },
  {
    id: 'focus' as const,
    label: 'Summary focus',
    options: [
      { value: 'practical', label: '🔧 Practical steps' },
      { value: 'theory', label: '🔬 Theory & concepts' },
      { value: 'insights', label: '💡 Key insights only' },
      { value: 'comprehensive', label: '📚 Everything in detail' },
    ],
  },
]

interface Props {
  email: string
  initialGoal: string
  initialLevel: string
  initialFocus: string
  initialReadwiseConnected: boolean
}

export default function SettingsClient({
  email,
  initialGoal,
  initialLevel,
  initialFocus,
  initialReadwiseConnected,
}: Props) {
  const [goal, setGoal] = useState(initialGoal)
  const [level, setLevel] = useState(initialLevel)
  const [focus, setFocus] = useState(initialFocus)
  const [prefSaving, setPrefSaving] = useState(false)
  const [prefSaved, setPrefSaved] = useState(false)

  const [rwConnected, setRwConnected] = useState(initialReadwiseConnected)
  const [rwToken, setRwToken] = useState('')
  const [rwSaving, setRwSaving] = useState(false)
  const [rwError, setRwError] = useState<string | null>(null)
  const [rwSaved, setRwSaved] = useState(false)

  async function savePreferences() {
    setPrefSaving(true)
    setPrefSaved(false)
    try {
      const res = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, level, focus }),
      })
      if (res.ok) {
        setPrefSaved(true)
        setTimeout(() => setPrefSaved(false), 3000)
      }
    } finally {
      setPrefSaving(false)
    }
  }

  async function saveReadwise() {
    if (!rwToken.trim()) return
    setRwSaving(true)
    setRwError(null)
    try {
      const res = await fetch('/api/settings/readwise', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: rwToken.trim() }),
      })
      if (res.ok) {
        localStorage.setItem('bookdigest_readwise_token', rwToken.trim())
        setRwConnected(true)
        setRwToken('')
        setRwSaved(true)
        setTimeout(() => setRwSaved(false), 3000)
      } else {
        setRwError('Could not save token — check and try again')
      }
    } catch {
      setRwError('Network error')
    } finally {
      setRwSaving(false)
    }
  }

  async function disconnectReadwise() {
    setRwSaving(true)
    try {
      await fetch('/api/settings/readwise', { method: 'DELETE' })
      localStorage.removeItem('bookdigest_readwise_token')
      setRwConnected(false)
    } finally {
      setRwSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Preferences */}
      <section className="rounded-2xl p-6" style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
        <h2 className="font-semibold mb-1" style={{ color: 'var(--app-text)' }}>Reading preferences</h2>
        <p className="text-sm mb-5" style={{ color: 'var(--app-muted)' }}>
          These shape how AI summaries are personalised for you.
        </p>

        <div className="space-y-5">
          {QUESTIONS.map(q => (
            <div key={q.id}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--app-accent)', letterSpacing: '0.07em' }}>
                {q.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {q.options.map(opt => {
                  const current = q.id === 'goal' ? goal : q.id === 'level' ? level : focus
                  const active = current === opt.value
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        if (q.id === 'goal') setGoal(opt.value)
                        else if (q.id === 'level') setLevel(opt.value)
                        else setFocus(opt.value)
                      }}
                      className="px-3 py-1.5 text-sm rounded-lg border transition-colors"
                      style={active
                        ? { background: 'var(--app-accent-dim)', color: '#8a6820', borderColor: 'rgba(201,150,58,0.5)' }
                        : { color: 'var(--app-muted)', borderColor: 'var(--app-border)', background: 'transparent' }
                      }
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={savePreferences}
            disabled={prefSaving}
            className="px-5 py-2 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
            style={{ background: 'var(--app-accent)', color: '#1a0f00' }}
          >
            {prefSaving ? 'Saving…' : 'Save preferences'}
          </button>
          {prefSaved && (
            <span className="text-sm" style={{ color: '#16a34a' }}>✓ Saved</span>
          )}
        </div>
      </section>

      {/* Readwise */}
      <section className="rounded-2xl p-6" style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
        <h2 className="font-semibold mb-1" style={{ color: 'var(--app-text)' }}>Readwise integration</h2>
        <p className="text-sm mb-5" style={{ color: 'var(--app-muted)' }}>
          Export summary highlights directly to your Readwise library.
        </p>

        {rwConnected ? (
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl" style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.2)' }}>
            <div className="flex items-center gap-2">
              <span className="text-green-600 text-sm">●</span>
              <span className="text-sm font-medium text-green-700">Connected</span>
            </div>
            <button
              onClick={disconnectReadwise}
              disabled={rwSaving}
              className="text-xs text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="password"
                value={rwToken}
                onChange={e => setRwToken(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveReadwise()}
                placeholder="Paste your Readwise Access Token…"
                className="flex-1 text-sm px-3 py-2 rounded-xl focus:outline-none"
                style={{ border: '1px solid var(--app-border)', background: 'var(--app-surface)', color: 'var(--app-text)' }}
              />
              <button
                onClick={saveReadwise}
                disabled={!rwToken.trim() || rwSaving}
                className="px-4 py-2 text-sm font-medium rounded-xl transition-colors disabled:opacity-40"
                style={{ background: 'var(--app-accent)', color: '#1a0f00' }}
              >
                {rwSaving ? 'Saving…' : 'Connect'}
              </button>
            </div>
            <a
              href="https://readwise.io/access_token"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline"
              style={{ color: 'var(--app-accent)' }}
            >
              Get your Readwise token →
            </a>
            {rwError && <p className="text-xs text-red-500">{rwError}</p>}
            {rwSaved && <p className="text-xs" style={{ color: '#16a34a' }}>✓ Connected</p>}
          </div>
        )}
      </section>

      {/* Account */}
      <section className="rounded-2xl p-6" style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
        <h2 className="font-semibold mb-1" style={{ color: 'var(--app-text)' }}>Account</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--app-muted)' }}>{email}</p>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="text-sm px-4 py-2 rounded-xl border transition-colors"
            style={{ color: 'var(--app-muted)', borderColor: 'var(--app-border)' }}
          >
            Sign out
          </button>
        </form>
      </section>
    </div>
  )
}
