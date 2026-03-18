'use client'

import { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react'
import { createClient } from '@/lib/supabase'
import { SUMMARY_STYLES, BOOK_STYLES, LANGUAGES, buildUserContext, type SummaryStyle, type UserProfile } from '@/lib/prompts'
import { MAX_PDF_SIZE_BYTES, FREE_MONTHLY_LIMIT, READER_MONTHLY_LIMIT, FREE_STYLES, type Tier } from '@/lib/config'
import { analytics } from '@/lib/analytics'

const MAX_SIZE_MB = MAX_PDF_SIZE_BYTES / (1024 * 1024)
const MAX_SIZE_BYTES = MAX_PDF_SIZE_BYTES

type UploadState = 'idle' | 'dragging' | 'uploading' | 'questionnaire' | 'select_style' | 'summarizing' | 'error'

const QUESTIONS = [
  {
    id: 'goal',
    label: 'What is your main goal with this book?',
    options: [
      { value: 'apply', label: '💼 Apply to my work' },
      { value: 'learn', label: '🎓 Deep understanding' },
      { value: 'reference', label: '📌 Quick reference' },
      { value: 'teach', label: '👥 Teach others' },
    ],
  },
  {
    id: 'level',
    label: 'What is your experience level with this topic?',
    options: [
      { value: 'beginner', label: '🌱 Complete beginner' },
      { value: 'some', label: '📖 Some familiarity' },
      { value: 'intermediate', label: '⚡ Intermediate' },
      { value: 'expert', label: '🏆 Advanced / Expert' },
    ],
  },
  {
    id: 'focus',
    label: 'What should the summary focus on?',
    options: [
      { value: 'practical', label: '🔧 Practical steps' },
      { value: 'theory', label: '🔬 Theory & concepts' },
      { value: 'insights', label: '💡 Key insights only' },
      { value: 'comprehensive', label: '📚 Everything in detail' },
    ],
  },
] as const

type QuestionId = typeof QUESTIONS[number]['id']

const resetDateStr = new Date(
  new Date().getFullYear(), new Date().getMonth() + 1, 1
).toLocaleDateString('en', { month: 'long', day: 'numeric' })

export default function PdfUpload({ summariesThisMonth = 0, tier = 'free' }: { summariesThisMonth?: number; tier?: Tier }) {
  const monthlyLimit = tier === 'pro' ? null : tier === 'reader' ? READER_MONTHLY_LIMIT : FREE_MONTHLY_LIMIT
  const atLimit = monthlyLimit !== null && summariesThisMonth >= monthlyLimit
  // Free users upgrading from limit → Reader is the right next step; Reader → Pro
  const upsellTier: 'reader' | 'pro' = tier === 'reader' ? 'pro' : 'reader'
  const [state, setState] = useState<UploadState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [upgrading, setUpgrading] = useState(false)

  async function handleUpgrade(targetTier: 'reader' | 'pro') {
    setUpgrading(true)
    analytics.upgrade(targetTier)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: targetTier }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      setUpgrading(false)
    }
  }
  const [fileName, setFileName] = useState<string | null>(null)
  const [filePath, setFilePath] = useState<string | null>(null)
  const [docType, setDocType] = useState<'book' | 'paper'>('book')
  const [selectedStyle, setSelectedStyle] = useState<SummaryStyle>('executive')
  const [selectedLanguage, setSelectedLanguage] = useState('auto')
  const [answers, setAnswers] = useState<Record<QuestionId, string>>({
    goal: 'apply',
    level: 'intermediate',
    focus: 'practical',
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // Load saved profile from Supabase on mount
  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('user_profiles')
        .select('goal, level, focus')
        .eq('user_id', user.id)
        .single()
      if (data) {
        setAnswers({ goal: data.goal, level: data.level, focus: data.focus })
      }
    }
    loadProfile()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function validate(file: File): string | null {
    if (file.type !== 'application/pdf') return 'Only PDF files are allowed'
    if (file.size > MAX_SIZE_BYTES) return `File must be under ${MAX_SIZE_MB}MB`
    return null
  }

  async function uploadFile(file: File) {
    const validationError = validate(file)
    if (validationError) {
      setError(validationError)
      setState('error')
      return
    }

    setFileName(file.name)
    setState('uploading')
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Not authenticated')
      setState('error')
      return
    }

    const path = `${user.id}/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('Books')
      .upload(path, file, { upsert: false })

    if (uploadError) {
      setError(uploadError.message)
      setState('error')
      return
    }

    analytics.pdfUploaded()
    setFilePath(path)
    setState(docType === 'paper' ? 'select_style' : 'questionnaire')
  }

  // Save profile to DB, then advance to style selection
  async function handleContinue() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const profile: UserProfile = { goal: answers.goal, level: answers.level, focus: answers.focus }
      await supabase.from('user_profiles').upsert(
        { user_id: user.id, ...profile, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )
    }
    setState('select_style')
  }

  async function handleGenerateSummary() {
    if (!filePath || !fileName) return
    setState('summarizing')
    setError(null)

    const profile: UserProfile = { goal: answers.goal, level: answers.level, focus: answers.focus }
    const userContext = docType === 'paper' ? '' : buildUserContext(profile)
    if (docType !== 'paper') localStorage.setItem('bookdigest_user_context', userContext)

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath,
          fileName,
          style: selectedStyle,
          language: selectedLanguage,
          userContext,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong')
        setState('error')
        return
      }

      analytics.summaryGenerated(selectedStyle)
      window.location.reload()
    } catch {
      setError('Network error — please try again')
      setState('error')
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setState('idle')
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setState('dragging')
  }

  function reset() {
    setState('idle')
    setError(null)
    setFileName(null)
    setFilePath(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const isDragging = state === 'dragging'

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => state === 'dragging' && setState('idle')}
      onClick={() => state === 'idle' && !atLimit && inputRef.current?.click()}
      className={`relative rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
        state === 'idle' && !atLimit ? 'cursor-pointer' : ''
      }`}
      style={{
        background: isDragging ? 'rgba(201,150,58,0.05)' : state === 'error' ? '#fef2f2' : 'var(--app-surface)',
        borderColor: isDragging ? 'var(--app-accent)' : state === 'error' ? '#fca5a5' : 'var(--app-border)',
        transform: isDragging ? 'scale(1.01)' : undefined,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0]
          if (file) uploadFile(file)
        }}
      />

      {/* Idle / Dragging */}
      {(state === 'idle' || state === 'dragging') && (
        <>
          {atLimit ? (
            /* ── Upgrade panel ── */
            <div onClick={(e) => e.stopPropagation()}>
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--app-text)' }}>Monthly limit reached</h2>
              <p className="mb-5" style={{ color: 'var(--app-muted)' }}>
                You&apos;ve used all {monthlyLimit} summaries this month.
              </p>
              <div className="max-w-xs mx-auto rounded-2xl p-4 mb-5 text-left" style={{ background: 'var(--app-accent-dim)', border: '1px solid rgba(201,150,58,0.25)' }}>
                {upsellTier === 'pro' ? (
                  <>
                    <p className="text-sm font-semibold mb-2" style={{ color: 'var(--app-text)' }}>⚡ BookDigest Pro</p>
                    <ul className="space-y-1.5">
                      {['Unlimited summaries', 'Priority processing', 'Advanced export options'].map(f => (
                        <li key={f} className="text-sm flex items-center gap-1.5" style={{ color: '#8a6820' }}>
                          <span className="font-bold" style={{ color: 'var(--app-accent)' }}>✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold mb-2" style={{ color: 'var(--app-text)' }}>📚 BookDigest Reader</p>
                    <ul className="space-y-1.5">
                      {['20 summaries per month', 'All summary styles', 'Priority support'].map(f => (
                        <li key={f} className="text-sm flex items-center gap-1.5" style={{ color: '#8a6820' }}>
                          <span className="font-bold" style={{ color: 'var(--app-accent)' }}>✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              <button
                onClick={() => handleUpgrade(upsellTier)}
                disabled={upgrading}
                className="px-6 py-3 font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed" style={{ background: 'var(--app-accent)', color: '#1a0f00' }}
              >
                {upgrading ? 'Redirecting…' : upsellTier === 'pro' ? 'Upgrade to Pro →' : 'Upgrade to Reader →'}
              </button>
              <p className="text-xs text-gray-400 mt-3">
                Limit resets on {resetDateStr}
              </p>
            </div>
          ) : (
            <>
              {!isDragging && (
                <div className="inline-flex rounded-xl p-1 mb-5" style={{ background: 'var(--app-border)' }} onClick={e => e.stopPropagation()}>
                  {(['book', 'paper'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={(e) => { e.stopPropagation(); setDocType(type); setSelectedStyle(type === 'paper' ? 'research' : 'executive') }}
                      className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
                      style={docType === type
                        ? { background: 'var(--app-surface)', color: 'var(--app-text)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
                        : { color: 'var(--app-muted)' }
                      }
                    >
                      {type === 'book' ? '📚 Book' : '📄 Research Paper'}
                    </button>
                  ))}
                </div>
              )}
              <div className="text-5xl mb-4">{isDragging ? '📂' : docType === 'paper' ? '🔬' : '📄'}</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {isDragging ? 'Drop it here!' : docType === 'paper' ? 'Upload a Research Paper' : 'Upload a PDF book'}
              </h2>
              {!isDragging && (
                <>
                  <p className="text-gray-500 mb-6">Drag & drop or click to browse</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
                    className="px-6 py-3 font-medium rounded-xl transition-colors" style={{ background: 'var(--app-accent)', color: '#1a0f00' }}
                  >
                    Choose PDF
                  </button>
                  <p className="text-xs text-gray-400 mt-4">PDF only · Max {MAX_SIZE_MB}MB</p>
                </>
              )}
            </>
          )}
        </>
      )}

      {/* Uploading */}
      {state === 'uploading' && (
        <>
          <svg className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: 'var(--app-accent)' }} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Uploading…</h2>
          <p className="text-sm text-gray-500 truncate max-w-xs mx-auto">{fileName}</p>
        </>
      )}

      {/* Questionnaire */}
      {state === 'questionnaire' && (
        <div onClick={(e) => e.stopPropagation()} className="max-w-lg mx-auto">
          <div className="text-4xl mb-3">✅</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Upload complete!</h2>
          <p className="text-sm text-gray-500 mb-6">Answer 3 quick questions to personalise your summary</p>

          <div className="space-y-6 text-left">
            {QUESTIONS.map((q) => (
              <div key={q.id}>
                <p className="text-sm font-medium text-gray-700 mb-2">{q.label}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.value }))}
                      className="px-3 py-2.5 rounded-xl border-2 text-sm text-left transition-all"
                      style={answers[q.id] === opt.value
                        ? { borderColor: 'var(--app-accent)', background: 'var(--app-accent-dim)', color: '#8a6820', fontWeight: 500 }
                        : { borderColor: 'var(--app-border)', color: 'var(--app-muted)' }
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleContinue}
            className="mt-8 px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Continue →
          </button>
        </div>
      )}

      {/* Select Style */}
      {state === 'select_style' && (
        <div onClick={(e) => e.stopPropagation()}>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Choose summary style</h2>
          <p className="text-sm text-gray-500 mb-5 truncate max-w-xs mx-auto">{fileName}</p>

          {/* Book: 3 style cards */}
          {docType === 'book' && (
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-3">
              {BOOK_STYLES.map((key) => {
                const val = SUMMARY_STYLES[key]
                const isLocked = tier === 'free' && !(FREE_STYLES as readonly string[]).includes(key)
                return (
                  <button
                    key={key}
                    onClick={() => !isLocked && setSelectedStyle(key)}
                    disabled={isLocked}
                    className="relative p-4 rounded-xl border-2 transition-all text-left"
                    style={isLocked
                      ? { borderColor: 'var(--app-border)', opacity: 0.55, cursor: 'not-allowed' }
                      : selectedStyle === key
                      ? { borderColor: 'var(--app-accent)', background: 'var(--app-accent-dim)' }
                      : { borderColor: 'var(--app-border)' }
                    }
                  >
                    {isLocked && <span className="absolute top-2 right-2 text-xs">🔒</span>}
                    <div className="text-2xl mb-1">{val.emoji}</div>
                    <div className="font-medium text-sm" style={{ color: 'var(--app-text)' }}>{val.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--app-muted)' }}>{val.description}</div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Free tier note */}
          {tier === 'free' && docType === 'book' && (
            <p className="text-xs text-center mb-4" style={{ color: 'var(--app-muted)' }}>
              🔒 Study & Action styles require{' '}
              <button onClick={() => handleUpgrade('reader')} className="underline" style={{ color: 'var(--app-accent)' }}>Reader or Pro</button>
            </p>
          )}

          {/* Paper: single research card */}
          {docType === 'paper' && (
            <div className="max-w-xs mx-auto mb-6">
              <div
                className="p-4 rounded-xl border-2 text-left"
                style={{ borderColor: 'var(--app-accent)', background: 'var(--app-accent-dim)' }}
              >
                <div className="text-2xl mb-1">🔬</div>
                <div className="font-medium text-sm" style={{ color: 'var(--app-text)' }}>Research Analysis</div>
                <div className="text-xs mt-1" style={{ color: 'var(--app-muted)' }}>Research question · Methodology · Key findings · Citations</div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Output language:</p>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-2 rounded-xl text-sm focus:outline-none" style={{ border: '1px solid var(--app-border)', color: 'var(--app-text)', background: 'var(--app-surface)' }}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => docType === 'paper' ? reset() : setState('questionnaire')}
              className="px-4 py-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {docType === 'paper' ? '← Start over' : '← Back'}
            </button>
            <button
              onClick={handleGenerateSummary}
              className="px-8 py-3 font-medium rounded-xl transition-colors" style={{ background: 'var(--app-accent)', color: '#1a0f00' }}
            >
              {docType === 'paper' ? 'Analyze Paper' : 'Generate Summary'}
            </button>
          </div>
        </div>
      )}

      {/* Summarizing */}
      {state === 'summarizing' && (
        <>
          <svg className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: 'var(--app-accent)' }} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{docType === 'paper' ? 'Analyzing paper…' : 'Generating summary…'}</h2>
          <p className="text-sm text-gray-500">This takes about 30–60 seconds</p>
        </>
      )}

      {/* Error */}
      {state === 'error' && (
        <>
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-sm text-red-500 mb-6">{error}</p>
          <button
            onClick={(e) => { e.stopPropagation(); reset() }}
            className="px-6 py-3 font-medium rounded-xl transition-colors" style={{ background: 'var(--app-accent)', color: '#1a0f00' }}
          >
            Try again
          </button>
        </>
      )}
    </div>
  )
}
