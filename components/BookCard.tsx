'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { SUMMARY_STYLES, LANGUAGES, FREE_LIMIT, FIELD_LABELS, CHAT_SUGGESTIONS, detectLanguageFromContent, buildUserContext, type SummaryStyle } from '@/lib/prompts'
import { createClient } from '@/lib/supabase'

const resetDateStr = new Date(
  new Date().getFullYear(), new Date().getMonth() + 1, 1
).toLocaleDateString('en', { month: 'long', day: 'numeric' })

interface Summary {
  id: string
  file_name: string
  file_path: string
  style: SummaryStyle
  content: string
  created_at: string
}

export interface Book {
  file_name: string
  file_path: string
  summaries: Partial<Record<SummaryStyle, Summary>>
}


const STYLES: SummaryStyle[] = ['executive', 'study', 'action']

function getTitle(summaries: Partial<Record<SummaryStyle, Summary>>, fileName: string): string {
  for (const style of STYLES) {
    const s = summaries[style]
    if (s) {
      try {
        const parsed = JSON.parse(s.content)
        if (parsed?.title) return parsed.title
      } catch {}
    }
  }
  return fileName
}

function fieldToText(value: unknown): string {
  if (Array.isArray(value)) {
    return (value as unknown[])
      .map(item => {
        if (typeof item === 'object' && item !== null) {
          const obj = item as Record<string, unknown>
          const page = typeof obj.page === 'number' ? obj.page : null
          const { page: _p, ...rest } = obj
          const entries = Object.entries(rest)
          // Simple {text, page} format
          if (entries.length === 1 && 'text' in rest) {
            return `- ${String(rest.text)}${page !== null ? ` *(p. ${page})*` : ''}`
          }
          // Complex object {concept, explanation, page} etc.
          const vals = entries.map(([, v]) => String(v))
          const base = `- **${vals[0]}**${vals.length > 1 ? ' — ' + vals.slice(1).join(' ') : ''}`
          return page !== null ? `${base} *(p. ${page})*` : base
        }
        return `- ${String(item)}`
      })
      .join('\n')
  }
  return String(value)
}

function summaryToSpeech(summary: Summary, title: string): string {
  let parsed: Record<string, unknown>
  try { parsed = JSON.parse(summary.content) } catch { return title }

  const styleInfo = SUMMARY_STYLES[summary.style]
  const parts: string[] = [`${title}. ${styleInfo.label} summary.`]

  for (const [key, value] of Object.entries(parsed)) {
    if (key === 'title') continue
    const label = FIELD_LABELS[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    parts.push(label + '.')

    if (Array.isArray(value)) {
      for (const item of value as unknown[]) {
        if (typeof item === 'string') {
          parts.push(item.replace(/\*\*/g, '').replace(/\*/g, ''))
        } else if (typeof item === 'object' && item !== null) {
          const obj = item as Record<string, unknown>
          const page = typeof obj.page === 'number' ? obj.page : null
          const { page: _p, ...rest } = obj
          const texts = Object.values(rest).map(v => String(v).replace(/\*\*/g, '').replace(/\*/g, ''))
          const sentence = texts.join('. ')
          parts.push(page !== null ? `${sentence}. Source: page ${page}.` : sentence)
        }
      }
    } else {
      parts.push(String(value).replace(/\*\*/g, '').replace(/\*/g, ''))
    }
  }

  return parts.join(' ')
}

function summaryToMarkdown(summary: Summary, title: string): string {
  let parsed: Record<string, unknown>
  try { parsed = JSON.parse(summary.content) } catch { return summary.content }

  const styleInfo = SUMMARY_STYLES[summary.style]
  const lines: string[] = [
    `# ${title}`,
    `*${styleInfo.label} Summary — BookDigest*`,
    '',
  ]

  for (const [key, value] of Object.entries(parsed)) {
    if (key === 'title') continue
    const label = FIELD_LABELS[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    lines.push(`## ${label}`, '', fieldToText(value), '')
  }

  return lines.join('\n')
}

function downloadMarkdown(summary: Summary, title: string) {
  const md = summaryToMarkdown(summary, title)
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${summary.style}.md`
  a.click()
  URL.revokeObjectURL(url)
}

function printSummary(summary: Summary, title: string) {
  let parsed: Record<string, unknown>
  try { parsed = JSON.parse(summary.content) } catch { return }

  const styleInfo = SUMMARY_STYLES[summary.style]

  let body = `<h1>${title}</h1><p class="subtitle">${styleInfo.emoji} ${styleInfo.label} Summary · BookDigest</p>`

  for (const [key, value] of Object.entries(parsed)) {
    if (key === 'title') continue
    const label = FIELD_LABELS[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    body += `<h2>${label}</h2>`
    if (Array.isArray(value)) {
      body += '<ul>'
      for (const item of value as unknown[]) {
        if (typeof item === 'object' && item !== null) {
          const obj = item as Record<string, unknown>
          const page = typeof obj.page === 'number' ? obj.page : null
          const { page: _p, ...rest } = obj
          const entries = Object.entries(rest)
          const pageTag = page !== null ? ` <span class="page">p.&nbsp;${page}</span>` : ''
          if (entries.length === 1 && 'text' in rest) {
            body += `<li>${String(rest.text)}${pageTag}</li>`
          } else {
            const vals = entries.map(([, v]) => String(v))
            body += `<li><strong>${vals[0]}</strong>${vals.length > 1 ? ' — ' + vals.slice(1).join(' ') : ''}${pageTag}</li>`
          }
        } else {
          body += `<li>${String(item)}</li>`
        }
      }
      body += '</ul>'
    } else {
      body += `<p>${String(value)}</p>`
    }
  }

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title><style>
    body{font-family:Georgia,serif;max-width:680px;margin:40px auto;color:#111;font-size:15px;line-height:1.7}
    h1{font-size:22px;margin-bottom:2px}
    .subtitle{color:#666;font-size:12px;margin-bottom:32px}
    h2{font-size:14px;font-weight:700;margin-top:28px;margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em;color:#333;border-bottom:1px solid #eee;padding-bottom:4px}
    ul{margin:0;padding-left:20px}li{margin-bottom:6px}
    .page{display:inline-block;margin-left:6px;padding:1px 5px;font-size:10px;font-weight:600;border-radius:4px;background:#f5edd8;color:#8a6820;border:1px solid #e8d5a0;white-space:nowrap}
    p{margin:0}@media print{body{margin:20px}}
  </style></head><body>${body}</body></html>`

  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(html)
  win.document.close()
  win.focus()
  win.print()
}

export default function BookCard({ book, summariesThisMonth = 0 }: { book: Book; summariesThisMonth?: number }) {
  const router = useRouter()
  const supabase = createClient()
  const firstExisting = STYLES.find(s => book.summaries[s]) ?? 'executive'
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<SummaryStyle>(firstExisting)
  const [generating, setGenerating] = useState<SummaryStyle | null>(null)
  const [language, setLanguage] = useState('auto')
  const [error, setError] = useState<string | null>(null)
  const [summaries, setSummaries] = useState(book.summaries)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const existingCount = STYLES.filter(s => summaries[s]).length
  const atLimit = summariesThisMonth >= FREE_LIMIT
  const title = getTitle(summaries, book.file_name)
  const [downloaded, setDownloaded] = useState<SummaryStyle | null>(null)
  const [upgrading, setUpgrading] = useState(false)

  async function upgradeToStripe() {
    setUpgrading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      setUpgrading(false)
    }
  }
  const [sharing, setSharing] = useState(false)
  const [shareUrls, setShareUrls] = useState<Partial<Record<SummaryStyle, string>>>({})
  const [copiedShare, setCopiedShare] = useState<SummaryStyle | null>(null)
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const [rwExporting, setRwExporting] = useState(false)
  const [rwExported, setRwExported] = useState<number | null>(null) // highlight count
  const [rwError, setRwError] = useState<string | null>(null)
  const [rwShowInput, setRwShowInput] = useState(false)
  const [rwTokenInput, setRwTokenInput] = useState('')
  const [rwHasToken, setRwHasToken] = useState<boolean>(
    typeof window !== 'undefined' && !!localStorage.getItem('bookdigest_readwise_token')
  )
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Stop speech + reset chat when switching tabs or collapsing
  useEffect(() => {
    if (speaking || paused) {
      window.speechSynthesis?.cancel()
      setSpeaking(false)
      setPaused(false)
    }
    setChatOpen(false)
    setChatMessages([])
    setChatInput('')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, expanded])

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, chatLoading])

  function handleSpeak() {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const text = summaryToSpeech(summaries[activeTab]!, title)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.onend = () => { setSpeaking(false); setPaused(false) }
    utterance.onerror = () => { setSpeaking(false); setPaused(false) }
    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
    setSpeaking(true)
    setPaused(false)
  }

  function handlePauseResume() {
    if (paused) {
      window.speechSynthesis.resume()
      setPaused(false)
    } else {
      window.speechSynthesis.pause()
      setPaused(true)
    }
  }

  function handleStop() {
    window.speechSynthesis.cancel()
    setSpeaking(false)
    setPaused(false)
  }

  async function sendChatMessage(text?: string) {
    const content = (text ?? chatInput).trim()
    if (!content) return
    const summary = summaries[activeTab]
    if (!summary) return
    const newMessages = [...chatMessages, { role: 'user' as const, content }]
    setChatMessages(newMessages)
    setChatInput('')
    setChatLoading(true)
    try {
      const res = await fetch('/api/chat/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summaryId: summary.id, messages: newMessages }),
      })
      const data = await res.json()
      if (res.ok) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.answer }])
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error ?? 'Something went wrong'}` }])
      }
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Network error — please try again' }])
    } finally {
      setChatLoading(false)
    }
  }

  async function doReadwiseExport(summaryId: string) {
    setRwExporting(true)
    setRwError(null)
    setRwExported(null)
    try {
      const res = await fetch('/api/export/readwise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summaryId }),
      })
      const data = await res.json()
      if (res.ok) {
        setRwExported(data.count)
        setTimeout(() => setRwExported(null), 4000)
      } else if (res.status === 401) {
        localStorage.removeItem('bookdigest_readwise_token')
        setRwHasToken(false)
        setRwShowInput(true)
        setRwError('Token invalid — please re-enter')
      } else {
        setRwError(data.error ?? 'Export failed')
      }
    } catch {
      setRwError('Network error')
    } finally {
      setRwExporting(false)
    }
  }

  async function handleReadwiseExport() {
    const summary = summaries[activeTab]
    if (!summary) return
    if (!rwHasToken) { setRwShowInput(true); return }
    await doReadwiseExport(summary.id)
  }

  async function handleReadwiseSaveToken() {
    if (!rwTokenInput.trim()) return
    const token = rwTokenInput.trim()
    const res = await fetch('/api/settings/readwise', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    if (!res.ok) { setRwError('Could not save token'); return }
    localStorage.setItem('bookdigest_readwise_token', token)
    setRwHasToken(true)
    setRwShowInput(false)
    setRwTokenInput('')
    // Export directly — bypass rwHasToken state (not yet reflected in closure)
    const summary = summaries[activeTab]
    if (summary) await doReadwiseExport(summary.id)
  }

  async function handleShare(style: SummaryStyle) {
    const summary = summaries[style]
    if (!summary) return

    // If URL already cached, just copy again
    if (shareUrls[style]) {
      await navigator.clipboard.writeText(shareUrls[style]!)
      setCopiedShare(style)
      setTimeout(() => setCopiedShare(null), 2000)
      return
    }

    setSharing(true)
    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summaryId: summary.id }),
      })
      const data = await res.json()
      if (res.ok) {
        const url = `${window.location.origin}/s/${data.token}`
        setShareUrls(prev => ({ ...prev, [style]: url }))
        await navigator.clipboard.writeText(url)
        setCopiedShare(style)
        setTimeout(() => setCopiedShare(null), 2500)
      } else {
        setError(data.error ?? 'Failed to create share link')
      }
    } catch {
      setError('Network error — could not create share link')
    } finally {
      setSharing(false)
    }
  }

  function handleDownload(style: SummaryStyle) {
    downloadMarkdown(summaries[style]!, title)
    setDownloaded(style)
    setTimeout(() => setDownloaded(null), 2000)
  }

  async function deleteBook() {
    setDeleting(true)
    try {
      const res = await fetch(
        `/api/delete-book?filePath=${encodeURIComponent(book.file_path)}`,
        { method: 'DELETE' }
      )
      if (res.ok) {
        window.location.reload()
      } else {
        const data = await res.json()
        setError(data.error ?? 'Delete failed')
        setShowConfirm(false)
        setDeleting(false)
      }
    } catch {
      setError('Network error — please try again')
      setShowConfirm(false)
      setDeleting(false)
    }
  }

  async function generate(style: SummaryStyle) {
    setGenerating(style)
    setError(null)

    // Load user context from DB, fall back to localStorage
    let userContext: string | undefined
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('goal, level, focus')
          .eq('user_id', user.id)
          .single()
        if (profile) userContext = buildUserContext(profile)
      }
    } catch {}
    if (!userContext) {
      userContext = localStorage.getItem('bookdigest_user_context') ?? undefined
    }

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: book.file_path,
          fileName: book.file_name,
          style,
          language,
          userContext,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong')
      } else {
        setSummaries(prev => ({ ...prev, [style]: data.summary }))
      }
    } catch {
      setError('Network error — please try again')
    } finally {
      setGenerating(null)
    }
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
      {/* Confirm delete overlay */}
      {showConfirm && (
        <div className="p-5 sm:p-6 bg-red-50 border-b border-red-100 flex items-center justify-between gap-4">
          <p className="text-sm text-red-700 font-medium">Delete this book and all its summaries?</p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={deleting}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={deleteBook}
              disabled={deleting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleting ? (
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : null}
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-5 sm:p-6 flex items-center justify-between transition-colors" style={{ borderLeft: '3px solid var(--app-accent)' }}>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 min-w-0 pr-4 text-left"
        >
          <p className="font-semibold truncate" style={{ color: 'var(--app-text)' }}>{title}</p>
          <p className="text-sm mt-0.5" style={{ color: 'var(--app-muted)' }}>
            {STYLES.filter(s => summaries[s]).map(s => SUMMARY_STYLES[s].emoji).join(' ')}
            {' '}{existingCount}/3 styles
          </p>
        </button>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); setShowConfirm(true); setExpanded(true) }}
            className="p-1.5 text-gray-300 hover:text-red-400 transition-colors rounded-lg hover:bg-red-50"
            title="Delete book"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button onClick={() => setExpanded(!expanded)}>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 animate-slide-down">
          {/* Style tabs */}
          <div className="flex px-3 pt-2 gap-0.5 overflow-x-auto scrollbar-none" style={{ borderBottom: '1px solid var(--app-border)' }}>
            {STYLES.map(style => {
              const info = SUMMARY_STYLES[style]
              const exists = !!summaries[style]
              const isGenerating = generating === style
              return (
                <button
                  key={style}
                  onClick={() => setActiveTab(style)}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap shrink-0"
                  style={activeTab === style
                    ? { background: 'var(--app-accent-dim)', color: '#8a6820', borderBottom: '2px solid var(--app-accent)' }
                    : { color: exists ? 'var(--app-muted)' : '#a89880' }
                  }
                >
                  {isGenerating ? (
                    <svg className="w-3.5 h-3.5 animate-spin" style={{ color: 'var(--app-accent)' }} fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <span>{info.emoji}</span>
                  )}
                  <span>{info.label}</span>
                  {!exists && !isGenerating && <span className="text-xs opacity-40">+</span>}
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          <div className="p-5 sm:p-6">
            {summaries[activeTab] ? (
              <>
                {/* Export toolbar */}
                <div className="flex items-center justify-end gap-2 mb-5 flex-wrap">
                  <button
                    onClick={() => handleDownload(activeTab)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg transition-colors
                      text-gray-500 hover:text-gray-800 border-gray-200 hover:border-gray-300
                      data-[done=true]:text-green-600 data-[done=true]:border-green-200"
                    data-done={downloaded === activeTab}
                  >
                    {downloaded === activeTab ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Downloaded!
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Markdown
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => printSummary(summaries[activeTab]!, title)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print / PDF
                  </button>
                  <button
                    onClick={() => handleShare(activeTab)}
                    disabled={sharing}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg transition-colors disabled:opacity-50"
                    style={copiedShare === activeTab
                      ? { color: '#16a34a', borderColor: '#bbf7d0', background: '#f0fdf4' }
                      : shareUrls[activeTab]
                      ? { color: 'var(--app-accent)', borderColor: 'rgba(201,150,58,0.4)' }
                      : { color: 'var(--app-muted)', borderColor: 'var(--app-border)' }
                    }
                  >
                    {copiedShare === activeTab ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Link copied!
                      </>
                    ) : sharing ? (
                      <>
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Sharing…
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share
                      </>
                    )}
                  </button>
                  {/* Listen / audio controls */}
                  {!speaking && !paused ? (
                    <button
                      onClick={handleSpeak}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg transition-colors"
                      style={{ color: 'var(--app-muted)', borderColor: 'var(--app-border)' }}
                      title="Listen to this summary"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0 0l-3-3m3 3l3-3M9.172 9.172a4 4 0 000 5.656" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.07 4.929a9 9 0 010 14.142" />
                      </svg>
                      Listen
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handlePauseResume}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg transition-colors"
                        style={{ color: 'var(--app-accent)', borderColor: 'rgba(201,150,58,0.4)', background: 'var(--app-accent-dim)' }}
                      >
                        {paused ? (
                          <>
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            Resume
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                            Pause
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleStop}
                        className="p-1.5 text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg transition-colors"
                        title="Stop"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
                      </button>
                    </div>
                  )}
                  {/* Readwise export */}
                  <button
                    onClick={handleReadwiseExport}
                    disabled={rwExporting}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg transition-colors disabled:opacity-50"
                    style={rwExported !== null
                      ? { color: '#16a34a', borderColor: '#bbf7d0', background: '#f0fdf4' }
                      : { color: 'var(--app-muted)', borderColor: 'var(--app-border)' }
                    }
                    title="Export highlights to Readwise"
                  >
                    {rwExported !== null ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        {rwExported} highlights saved!
                      </>
                    ) : rwExporting ? (
                      <>
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                        Exporting…
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        Readwise
                      </>
                    )}
                  </button>
                  {/* Chat toggle */}
                  <button
                    onClick={() => setChatOpen(o => !o)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg transition-colors"
                    style={chatOpen
                      ? { color: '#8a6820', borderColor: 'rgba(201,150,58,0.4)', background: 'var(--app-accent-dim)' }
                      : { color: 'var(--app-muted)', borderColor: 'var(--app-border)' }
                    }
                    title="Chat with this summary"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Ask
                  </button>
                </div>

                {/* Readwise token input (shown on first use) */}
                {rwShowInput && (
                  <div className="mb-4 p-3 rounded-xl flex flex-col gap-2" style={{ background: 'var(--app-accent-dim)', border: '1px solid rgba(201,150,58,0.25)' }}>
                    <p className="text-xs font-medium" style={{ color: 'var(--app-text)' }}>
                      Enter your Readwise Access Token to export highlights.{' '}
                      <a href="https://readwise.io/access_token" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--app-accent)' }}>
                        Get your token →
                      </a>
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={rwTokenInput}
                        onChange={e => setRwTokenInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleReadwiseSaveToken()}
                        placeholder="Paste token here…"
                        className="flex-1 text-xs px-3 py-1.5 rounded-lg focus:outline-none"
                        style={{ border: '1px solid rgba(201,150,58,0.4)', background: 'white', color: 'var(--app-text)' }}
                        autoFocus
                      />
                      <button
                        onClick={handleReadwiseSaveToken}
                        disabled={!rwTokenInput.trim()}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-40"
                        style={{ background: 'var(--app-accent)', color: '#1a0f00' }}
                      >
                        Save & Export
                      </button>
                      <button
                        onClick={() => { setRwShowInput(false); setRwError(null) }}
                        className="text-xs px-2 py-1.5 text-gray-400 hover:text-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                    {rwError && <p className="text-xs text-red-500">{rwError}</p>}
                  </div>
                )}

                <SummaryContent summary={summaries[activeTab]!} />

                {/* Chat panel */}
                {chatOpen && (
                  <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--app-border)' }}>
                    {/* Message history */}
                    {chatMessages.length > 0 && (
                      <div className="space-y-3 mb-3 max-h-72 overflow-y-auto pr-1">
                        {chatMessages.map((msg, i) => (
                          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                              className="max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed"
                              style={msg.role === 'user'
                                ? { background: 'var(--app-accent)', color: '#1a0f00' }
                                : { background: 'var(--app-accent-dim)', border: '1px solid rgba(201,150,58,0.2)', color: 'var(--app-text)' }
                              }
                            >
                              {msg.content}
                            </div>
                          </div>
                        ))}
                        {chatLoading && (
                          <div className="flex justify-start">
                            <div className="rounded-xl px-4 py-3" style={{ background: 'var(--app-accent-dim)', border: '1px solid rgba(201,150,58,0.2)' }}>
                              <div className="flex gap-1 items-center">
                                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--app-accent)', animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--app-accent)', animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--app-accent)', animationDelay: '300ms' }} />
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>
                    )}

                    {/* Suggested questions (only before first message) */}
                    {chatMessages.length === 0 && !chatLoading && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {(CHAT_SUGGESTIONS[detectLanguageFromContent(summaries[activeTab]!.content)] ?? CHAT_SUGGESTIONS.en).map(q => (
                          <button
                            key={q}
                            onClick={() => sendChatMessage(q)}
                            className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:border-[rgba(201,150,58,0.4)]"
                            style={{ color: 'var(--app-muted)', borderColor: 'var(--app-border)', background: 'var(--app-surface)' }}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Input row */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage() } }}
                        placeholder="Ask a question about this summary…"
                        disabled={chatLoading}
                        className="flex-1 text-sm px-3 py-2 rounded-xl focus:outline-none disabled:opacity-50"
                        style={{ border: '1px solid var(--app-border)', background: 'var(--app-surface)', color: 'var(--app-text)' }}
                        autoFocus
                      />
                      <button
                        onClick={() => sendChatMessage()}
                        disabled={!chatInput.trim() || chatLoading}
                        className="px-4 py-2 text-sm font-medium rounded-xl transition-colors disabled:opacity-40"
                        style={{ background: 'var(--app-accent)', color: '#1a0f00' }}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">{SUMMARY_STYLES[activeTab].emoji}</div>
                <p className="text-gray-500 mb-1 font-medium">{SUMMARY_STYLES[activeTab].label} summary</p>
                <p className="text-sm text-gray-400 mb-6">{SUMMARY_STYLES[activeTab].description}</p>
                {atLimit ? (
                  <div className="inline-block rounded-2xl p-5 max-w-xs text-left" style={{ background: 'var(--app-accent-dim)', border: '1px solid rgba(201,150,58,0.25)' }}>
                    <p className="text-2xl mb-2">⚡</p>
                    <p className="font-semibold mb-1" style={{ color: 'var(--app-text)' }}>Upgrade to Pro</p>
                    <p className="text-sm mb-3" style={{ color: 'var(--app-muted)' }}>
                      You&apos;ve used {FREE_LIMIT}/{FREE_LIMIT} summaries this month.
                    </p>
                    <ul className="space-y-1 mb-4">
                      {['Unlimited summaries', 'Priority processing', 'Advanced exports'].map(f => (
                        <li key={f} className="text-sm flex items-center gap-1.5" style={{ color: '#8a6820' }}>
                          <span className="font-bold" style={{ color: 'var(--app-accent)' }}>✓</span> {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={upgradeToStripe}
                      disabled={upgrading}
                      className="w-full px-4 py-2 text-sm font-semibold rounded-xl transition-colors disabled:opacity-60" style={{ background: 'var(--app-accent)', color: '#1a0f00' }}
                    >
                      {upgrading ? 'Redirecting…' : 'Upgrade to Pro →'}
                    </button>
                    <p className="text-xs text-gray-400 mt-2 text-center">Resets {resetDateStr}</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <select
                      value={language}
                      onChange={e => setLanguage(e.target.value)}
                      className="px-3 py-2 rounded-xl text-sm focus:outline-none" style={{ border: '1px solid var(--app-border)', color: 'var(--app-text)', background: 'var(--app-surface)' }}
                    >
                      {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => generate(activeTab)}
                      disabled={!!generating}
                      className="flex items-center gap-2 px-6 py-2 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: 'var(--app-accent)', color: '#1a0f00' }}
                    >
                      {generating === activeTab ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Generating…
                        </>
                      ) : (
                        `Generate ${SUMMARY_STYLES[activeTab].label}`
                      )}
                    </button>
                  </div>
                )}
                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function PageBadge({ page }: { page: number }) {
  return (
    <span
      className="inline-flex items-center ml-2 px-1.5 py-0.5 text-[10px] font-semibold rounded shrink-0 align-middle"
      style={{ background: 'rgba(201,150,58,0.1)', color: 'var(--app-accent)', border: '1px solid rgba(201,150,58,0.25)' }}
      title={`Source: page ${page}`}
    >
      p.{page}
    </span>
  )
}

function SummaryContent({ summary }: { summary: Summary }) {
  let parsed: Record<string, unknown> | null = null
  try {
    parsed = JSON.parse(summary.content)
  } catch {
    parsed = null
  }

  if (!parsed) return <p className="text-gray-400 text-sm">Could not parse summary.</p>

  return (
    <div className="space-y-5 text-sm text-gray-700">
      {Object.entries(parsed).map(([key, value]) => {
        if (key === 'title') return null
        const label = FIELD_LABELS[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        return (
          <div key={key}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--app-accent)', letterSpacing: '0.08em' }}>{label}</p>
            {Array.isArray(value) ? (
              <ul className="space-y-2">
                {(value as unknown[]).map((item, i) => {
                  // Extract optional page number (new format), leave rest for display
                  const isObj = typeof item === 'object' && item !== null
                  const obj = isObj ? (item as Record<string, unknown>) : null
                  const page = obj && typeof obj.page === 'number' ? obj.page : null
                  const { page: _p, ...rest } = obj ?? {}
                  const restEntries = Object.entries(rest)
                  const isSimple = restEntries.length === 1 && 'text' in rest

                  return (
                    <li key={i} className="flex gap-2 items-start">
                      <span className="mt-0.5 shrink-0" style={{ color: 'var(--app-accent)' }}>•</span>
                      <span className="flex-1 min-w-0">
                        {!isObj ? (
                          // Plain string (old format)
                          <div className="prose prose-sm max-w-none"><ReactMarkdown>{String(item)}</ReactMarkdown></div>
                        ) : isSimple ? (
                          // {text, page} format
                          <span className="flex items-start flex-wrap gap-x-1">
                            <div className="prose prose-sm max-w-none inline"><ReactMarkdown>{String(rest.text)}</ReactMarkdown></div>
                            {page !== null && <PageBadge page={page} />}
                          </span>
                        ) : (
                          // {concept, explanation, page} or similar complex object
                          <span className="flex items-start flex-wrap gap-x-1">
                            <span>
                              {restEntries.map(([k, v], j) => (
                                <span key={k}>
                                  {j > 0 && <span className="text-gray-400"> — </span>}
                                  {j === 0
                                    ? <strong>{String(v)}</strong>
                                    : <span className="prose prose-sm max-w-none"><ReactMarkdown>{String(v)}</ReactMarkdown></span>}
                                </span>
                              ))}
                            </span>
                            {page !== null && <PageBadge page={page} />}
                          </span>
                        )}
                      </span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                <ReactMarkdown>{String(value)}</ReactMarkdown>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
