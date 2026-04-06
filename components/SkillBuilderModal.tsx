'use client'

import { useState } from 'react'
import type { SkillFocusArea, SkillPersona } from '@/lib/prompts'
import type { Tier } from '@/lib/config'

interface SkillBuilderModalProps {
  open:         boolean
  onClose:      () => void
  bookTitle:    string
  summaryId:    string   // pre-selected by BookCard: knowledge > executive > study > action > research
  tier:         Tier
}

const FOCUS_OPTIONS: { value: SkillFocusArea; label: string }[] = [
  { value: 'teaching',  label: 'Teaching & explaining concepts' },
  { value: 'practical', label: 'Practical application & workflows' },
  { value: 'decisions', label: 'Decision-making & frameworks' },
  { value: 'reference', label: 'Reference & quick lookup' },
]

const PERSONA_OPTIONS: { value: SkillPersona; label: string }[] = [
  { value: 'expert',   label: 'Strict expert — direct, precise, no fluff' },
  { value: 'mentor',   label: 'Friendly mentor — encouraging, explains reasoning' },
  { value: 'concise',  label: 'Concise assistant — bullet points, short answers' },
  { value: 'socratic', label: 'Socratic teacher — asks questions, guides discovery' },
]

const ALL_TOOLS = ['Read', 'Write', 'Bash', 'Glob', 'Grep', 'WebSearch', 'WebFetch']

export default function SkillBuilderModal({
  open, onClose, bookTitle, summaryId, tier,
}: SkillBuilderModalProps) {
  const [step, setStep]             = useState<'questions' | 'generating' | 'preview'>('questions')
  const [focusArea, setFocusArea]   = useState<SkillFocusArea | null>(null)
  const [tools, setTools]           = useState<string[]>(['Read', 'Write'])
  const [persona, setPersona]       = useState<SkillPersona | null>(null)
  const [freetext, setFreetext]     = useState('')
  const [skillName, setSkillName]   = useState('')
  const [skillContent, setSkillContent] = useState('')
  const [error, setError]           = useState<string | null>(null)
  const [copied, setCopied]         = useState(false)

  const canGenerate = focusArea !== null && tools.length > 0 && persona !== null

  function toggleTool(tool: string) {
    setTools(prev =>
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
    )
  }

  async function handleGenerate() {
    if (!canGenerate) return
    setStep('generating')
    setError(null)
    try {
      const res = await fetch('/api/skill/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summaryId,
          focusArea,
          tools,
          persona,
          freetext: freetext || undefined,
        }),
      })
      const data = await res.json() as { skillName?: string; skillContent?: string; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Generation failed')
      setSkillName(data.skillName!)
      setSkillContent(data.skillContent!)
      setStep('preview')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStep('questions')
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(skillContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    const blob = new Blob([skillContent], { type: 'text/markdown' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `${skillName}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleClose() {
    setStep('questions')
    setFocusArea(null)
    setTools(['Read', 'Write'])
    setPersona(null)
    setFreetext('')
    setSkillName('')
    setSkillContent('')
    setError(null)
    setCopied(false)
    onClose()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={e => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--app-border)' }}
        >
          <div>
            <h2 className="font-semibold text-base" style={{ color: 'var(--app-text)' }}>
              🛠 Build a Claude Skill
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--app-muted)' }}>{bookTitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5">

          {/* ── STEP: questions ── */}
          {step === 'questions' && (
            <div className="flex flex-col gap-5">

              {/* Q1: Focus area */}
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--app-text)' }}>
                  What should this skill focus on?
                </p>
                <div className="flex flex-col gap-1.5">
                  {FOCUS_OPTIONS.map(opt => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="focusArea"
                        value={opt.value}
                        checked={focusArea === opt.value}
                        onChange={() => setFocusArea(opt.value)}
                        style={{ accentColor: 'var(--app-accent)' }}
                      />
                      <span className="text-sm" style={{ color: 'var(--app-text)' }}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q2: Tools */}
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--app-text)' }}>
                  Which tools should Claude have?
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {ALL_TOOLS.map(tool => (
                    <label key={tool} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tools.includes(tool)}
                        onChange={() => toggleTool(tool)}
                        style={{ accentColor: 'var(--app-accent)' }}
                      />
                      <span className="text-sm" style={{ color: 'var(--app-text)' }}>{tool}</span>
                    </label>
                  ))}
                </div>
                {tools.length === 0 && (
                  <p className="text-xs mt-1" style={{ color: '#e57373' }}>Select at least one tool.</p>
                )}
              </div>

              {/* Q3: Persona */}
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--app-text)' }}>Persona</p>
                <div className="flex flex-col gap-1.5">
                  {PERSONA_OPTIONS.map(opt => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="persona"
                        value={opt.value}
                        checked={persona === opt.value}
                        onChange={() => setPersona(opt.value)}
                        style={{ accentColor: 'var(--app-accent)' }}
                      />
                      <span className="text-sm" style={{ color: 'var(--app-text)' }}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Freetext */}
              <div>
                <p className="text-sm font-medium mb-1.5" style={{ color: 'var(--app-text)' }}>
                  Anything specific?{' '}
                  <span style={{ color: 'var(--app-muted)', fontWeight: 400 }}>(optional)</span>
                </p>
                <textarea
                  value={freetext}
                  onChange={e => setFreetext(e.target.value.slice(0, 500))}
                  placeholder="Anything specific you want this skill to do or know?"
                  rows={2}
                  className="w-full text-sm px-3 py-2 rounded-lg focus:outline-none resize-none"
                  style={{
                    border: '1px solid var(--app-border)',
                    background: 'var(--app-bg)',
                    color: 'var(--app-text)',
                  }}
                />
                <p className="text-xs text-right mt-0.5" style={{ color: 'var(--app-muted)' }}>
                  {freetext.length}/500
                </p>
              </div>

              {error && (
                <p className="text-sm" style={{ color: '#e57373' }}>{error}</p>
              )}

              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="w-full py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'var(--app-accent)', color: '#1a0f00' }}
              >
                Generate Skill
              </button>
            </div>
          )}

          {/* ── STEP: generating ── */}
          {step === 'generating' && (
            <div className="flex flex-col items-center py-10 gap-3">
              <svg className="w-8 h-8 animate-spin" style={{ color: 'var(--app-accent)' }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm" style={{ color: 'var(--app-muted)' }}>Crafting your skill…</p>
            </div>
          )}

          {/* ── STEP: preview ── */}
          {step === 'preview' && (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium" style={{ color: 'var(--app-text)' }}>
                ✓ Your Claude Skill is ready
              </p>

              {/* Skill file preview */}
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--app-border)' }}>
                <div
                  className="flex items-center gap-2 px-3 py-2 text-xs"
                  style={{
                    background: 'var(--app-surface)',
                    borderBottom: '1px solid var(--app-border)',
                    color: 'var(--app-muted)',
                    fontFamily: 'var(--font-geist-mono, monospace)',
                  }}
                >
                  {skillName}.md
                </div>
                <pre
                  className="text-xs p-4 overflow-auto max-h-52 leading-relaxed"
                  style={{
                    background: 'var(--app-bg)',
                    color: 'var(--app-text)',
                    fontFamily: 'var(--font-geist-mono, monospace)',
                    margin: 0,
                  }}
                >
                  {skillContent}
                </pre>
              </div>

              {/* Copy + Download */}
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium border transition-colors"
                  style={{
                    borderColor: 'var(--app-border)',
                    color: copied ? '#4caf50' : 'var(--app-text)',
                  }}
                >
                  {copied ? '✓ Copied' : '📋 Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-colors"
                  style={{ background: 'var(--app-accent)', color: '#1a0f00' }}
                >
                  ⬇ Download .md
                </button>
              </div>

              {/* Install hint */}
              <p className="text-xs text-center" style={{ color: 'var(--app-muted)' }}>
                💡 Save to{' '}
                <code
                  className="px-1 py-0.5 rounded text-xs"
                  style={{ background: 'var(--app-surface)', fontFamily: 'var(--font-geist-mono, monospace)' }}
                >
                  ~/.claude/skills/
                </code>{' '}
                to activate in Claude Code
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
