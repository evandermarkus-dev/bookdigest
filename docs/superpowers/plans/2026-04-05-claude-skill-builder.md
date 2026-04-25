# Claude Skill Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "🛠 Skill" button to BookCard that opens a 3-step wizard modal, generating a downloadable Claude Code skill `.md` file from the book's existing summary.

**Architecture:** Modal wizard (`questions → generating → preview`) triggered from the BookCard export toolbar. Reuses existing Supabase summary as Claude context — no PDF re-read. New API route `POST /api/skill/generate` handles tier gating (free=blocked, reader=3/month, pro=unlimited), rate limiting, and the Claude call. No DB storage in MVP — skill lives in React state until downloaded or copied.

**Tech Stack:** Next.js 16 App Router, Anthropic SDK (`claude-sonnet-4-6`), Supabase (auth + summary fetch), Upstash Redis (rate limiting), TailwindCSS + CSS variables, TypeScript

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `lib/config.ts` | Modify | Add `READER_SKILL_LIMIT = 3` |
| `lib/ratelimit.ts` | Modify | Add `skill` limiter (3 req / 30 days) |
| `lib/prompts.ts` | Modify | Add `SkillFocusArea`, `SkillPersona` types + `getSkillPrompt()` |
| `app/api/skill/generate/route.ts` | Create | Auth, tier check, rate limit, Claude call, skill name extraction |
| `components/SkillBuilderModal.tsx` | Create | 3-step wizard UI, copy, download |
| `components/BookCard.tsx` | Modify | Add 🛠 Skill button + mount modal |

---

## Task 1: Config + Rate Limiter

**Files:**
- Modify: `lib/config.ts`
- Modify: `lib/ratelimit.ts`

- [ ] **Step 1: Add READER_SKILL_LIMIT to lib/config.ts**

Open `lib/config.ts`. After the `READER_MONTHLY_LIMIT` line, add:

```ts
/** Max Claude Code skills a Reader user can generate per rolling 30-day period. */
export const READER_SKILL_LIMIT = 3
```

- [ ] **Step 2: Add `skill` limiter to lib/ratelimit.ts**

Open `lib/ratelimit.ts`. Find the `limiters` object and add the `skill` entry:

```ts
export const limiters = redis ? {
  summarize: makeLimiter(redis, 10, '1 h',  'summarize'),
  chat:      makeLimiter(redis, 30, '1 h',  'chat'),
  audio:     makeLimiter(redis, 5,  '1 h',  'audio'),
  skill:     makeLimiter(redis, 3,  '30 d', 'skill'),
} : null
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd C:/Users/Markus/projects/bookdigest && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/config.ts lib/ratelimit.ts
git commit -m "feat: add READER_SKILL_LIMIT and skill rate limiter"
```

---

## Task 2: Add `getSkillPrompt()` to lib/prompts.ts

**Files:**
- Modify: `lib/prompts.ts`

- [ ] **Step 1: Add types and function at the bottom of lib/prompts.ts**

Append after the last existing export:

```ts
// ── Claude Skill Builder ──────────────────────────────────────────────────────

export type SkillFocusArea = 'teaching' | 'practical' | 'decisions' | 'reference'
export type SkillPersona   = 'expert'   | 'mentor'    | 'concise'   | 'socratic'

const SKILL_FOCUS_LABELS: Record<SkillFocusArea, string> = {
  teaching:  'Teaching & explaining concepts',
  practical: 'Practical application & workflows',
  decisions: 'Decision-making & frameworks',
  reference: 'Reference & quick lookup',
}

const SKILL_PERSONA_LABELS: Record<SkillPersona, string> = {
  expert:   'Strict expert — direct, precise, no fluff',
  mentor:   'Friendly mentor — encouraging, explains reasoning',
  concise:  'Concise assistant — bullet points, short answers',
  socratic: 'Socratic teacher — asks questions, guides discovery',
}

export function getSkillPrompt(params: {
  summaryText:  string
  focusArea:    SkillFocusArea
  tools:        string[]
  persona:      SkillPersona
  freetext?:    string
}): string {
  const { summaryText, focusArea, tools, persona, freetext } = params
  const sanitizedFreetext = freetext
    ? freetext.slice(0, 500).replace(/[<>{}\[\]\\]/g, '').trim()
    : ''

  return `You are a Claude Code skill architect. Create a complete, installable Claude Code skill (.md format) based on this book summary.

BOOK SUMMARY:
${summaryText}

CONFIGURATION:
- Focus: ${SKILL_FOCUS_LABELS[focusArea]}
- Available tools: ${tools.join(', ')}
- Persona: ${SKILL_PERSONA_LABELS[persona]}${sanitizedFreetext ? `\n- Extra instructions: ${sanitizedFreetext}` : ''}

OUTPUT FORMAT — return ONLY valid markdown with this exact structure (including the --- delimiters):

---
name: kebab-case-skill-name
description: One clear sentence describing what this skill does (max 100 chars)
tools: ${tools.join(', ')}
---

# Skill Title

Write 3–5 paragraphs of detailed instructions for Claude, in second person ("You are...", "When the user..."). Draw directly from the book's frameworks, concepts, and methodology. Reference the book's actual models and terminology. Be specific and actionable.

## Core Principles

- 3–5 bullet points from the book's central ideas, using the book's own language

## How to Use This Skill

- Example 1: a concrete prompt or scenario that activates this skill
- Example 2: another scenario
- Example 3: another scenario`
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/prompts.ts
git commit -m "feat: add getSkillPrompt() and skill types to lib/prompts"
```

---

## Task 3: Create API Route `POST /api/skill/generate`

**Files:**
- Create: `app/api/skill/generate/route.ts`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p "C:/Users/Markus/projects/bookdigest/app/api/skill/generate"
```

Create `app/api/skill/generate/route.ts` with this exact content:

```ts
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase-server'
import { checkRateLimit } from '@/lib/ratelimit'
import {
  SUMMARY_STYLES, FIELD_LABELS,
  getSkillPrompt,
  type SummaryStyle, type SkillFocusArea, type SkillPersona,
} from '@/lib/prompts'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

/** Convert stored summary JSON to readable plain text for the skill prompt. */
function summaryToText(content: string, style: string, title: string): string {
  let parsed: Record<string, unknown>
  try { parsed = JSON.parse(content) } catch { return content }

  const styleInfo = SUMMARY_STYLES[style as SummaryStyle]
  const lines: string[] = [`# ${title} — ${styleInfo?.label ?? style} Summary\n`]

  for (const [key, value] of Object.entries(parsed)) {
    if (key === 'title') continue
    const label =
      FIELD_LABELS[key] ??
      key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    lines.push(`\n## ${label}`)

    if (Array.isArray(value)) {
      for (const item of value as unknown[]) {
        if (typeof item === 'string') {
          lines.push(`- ${item.replace(/\*\*/g, '').replace(/\*/g, '')}`)
        } else if (typeof item === 'object' && item !== null) {
          const obj = item as Record<string, unknown>
          const { page: _p, ...rest } = obj
          const parts = Object.values(rest).map(v =>
            String(v).replace(/\*\*/g, '').replace(/\*/g, '')
          )
          lines.push(`- ${parts.join(' — ')}`)
        }
      }
    } else {
      lines.push(String(value).replace(/\*\*/g, '').replace(/\*/g, ''))
    }
  }
  return lines.join('\n')
}

/** Extract kebab-case skill name from Claude's YAML frontmatter. Falls back to slugified title. */
function extractSkillName(content: string, fallback: string): string {
  const match = content.match(/^---[\s\S]*?^name:\s*([^\n]+)/m)
  if (match) {
    const raw = match[1].trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    if (raw.length > 2) return raw
  }
  return fallback
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Fetch tier — default to free if profile missing
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('tier')
    .eq('user_id', user.id)
    .single()

  const tier = (profile?.tier ?? 'free') as 'free' | 'reader' | 'pro'

  if (tier === 'free') {
    return NextResponse.json(
      { error: 'Claude Skill generation requires a Reader or Pro subscription.' },
      { status: 403 }
    )
  }

  // Reader users are rate-limited; Pro users are not
  if (tier === 'reader') {
    const rlResponse = await checkRateLimit('skill', user.id)
    if (rlResponse) return rlResponse
  }

  const body = await request.json() as {
    summaryId: string
    focusArea:  SkillFocusArea
    tools:      string[]
    persona:    SkillPersona
    freetext?:  string
  }

  const { summaryId, focusArea, tools, persona, freetext } = body

  if (!summaryId || !focusArea || !tools?.length || !persona) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Fetch summary — .eq('user_id') is the auth guard
  const { data: summary } = await supabase
    .from('summaries')
    .select('content, style, file_name')
    .eq('id', summaryId)
    .eq('user_id', user.id)
    .single()

  if (!summary) {
    return NextResponse.json({ error: 'Summary not found' }, { status: 404 })
  }

  const title = (() => {
    try {
      const p = JSON.parse(summary.content) as Record<string, unknown>
      return typeof p.title === 'string' ? p.title : summary.file_name
    } catch { return summary.file_name }
  })()

  const summaryText = summaryToText(summary.content, summary.style, title)
  const prompt = getSkillPrompt({ summaryText, focusArea, tools, persona, freetext })

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  })

  const skillContent =
    response.content[0].type === 'text' ? response.content[0].text.trim() : ''

  const fallback = `${title}-${focusArea}`
  const skillName = extractSkillName(skillContent, fallback)

  return NextResponse.json({ skillName, skillContent })
}
```

- [ ] **Step 2: Verify TypeScript compiles and build succeeds**

```bash
npx tsc --noEmit && npx next build 2>&1 | tail -8
```

Expected: no TypeScript errors, build succeeds with route listed under `/api/skill/generate`.

- [ ] **Step 3: Commit**

```bash
git add app/api/skill/generate/route.ts
git commit -m "feat: add POST /api/skill/generate route"
```

---

## Task 4: Create SkillBuilderModal component

**Files:**
- Create: `components/SkillBuilderModal.tsx`

- [ ] **Step 1: Create the file**

Create `components/SkillBuilderModal.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/SkillBuilderModal.tsx
git commit -m "feat: add SkillBuilderModal component"
```

---

## Task 5: Wire up Skill button in BookCard

**Files:**
- Modify: `components/BookCard.tsx`

- [ ] **Step 1: Add import at the top of BookCard.tsx**

After the existing component imports (near the top of the file), add:

```ts
import SkillBuilderModal from '@/components/SkillBuilderModal'
```

- [ ] **Step 2: Add skillOpen state**

Inside the `BookCard` component body, after the existing `useState` declarations, add:

```ts
const [skillOpen, setSkillOpen] = useState(false)
```

- [ ] **Step 3: Compute bestSummaryId**

After the existing computed values near the top of the `BookCard` function (e.g., after `const upsellTier` or the monthly limit computation), add:

```ts
const bestSummaryId =
  summaries.knowledge?.id ??
  summaries.executive?.id ??
  summaries.study?.id ??
  summaries.action?.id ??
  summaries.research?.id ??
  null
```

- [ ] **Step 4: Add the 🛠 Skill button after the Ask button**

Find the Ask button (ends around line 1032 with `Ask` label). Immediately after its closing `</button>` tag and before the toolbar's closing `</div>`, add:

```tsx
{/* Skill builder */}
<button
  onClick={() => { if (tier !== 'free' && bestSummaryId) setSkillOpen(true) }}
  disabled={tier === 'free' || !bestSummaryId}
  className="flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg transition-colors shrink-0"
  style={
    tier === 'free'
      ? { color: 'var(--app-muted)', borderColor: 'var(--app-border)', opacity: 0.5, cursor: 'not-allowed' }
      : { color: 'var(--app-muted)', borderColor: 'var(--app-border)' }
  }
  title={
    tier === 'free'
      ? 'Upgrade to Reader to build Claude Skills'
      : !bestSummaryId
        ? 'Generate a summary first'
        : 'Build a Claude Code skill from this book'
  }
>
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l5.653-4.655m1.732-4.733a5.56 5.56 0 011.732 1.732" />
  </svg>
  🛠 Skill
  {tier === 'free' && <span className="text-xs opacity-40">🔒</span>}
</button>
```

- [ ] **Step 5: Mount SkillBuilderModal in JSX**

At the bottom of the BookCard JSX — just before the outermost closing `</div>` of the component return — add:

```tsx
{bestSummaryId && (
  <SkillBuilderModal
    open={skillOpen}
    onClose={() => setSkillOpen(false)}
    bookTitle={title}
    summaryId={bestSummaryId}
    tier={tier}
  />
)}
```

- [ ] **Step 6: Verify build**

```bash
npx tsc --noEmit && npx next build 2>&1 | tail -8
```

Expected: no TypeScript errors, build completes, `/api/skill/generate` appears in route listing.

- [ ] **Step 7: Manual browser verification**

1. Run `npm run dev` (port 3001)
2. Go to `http://localhost:3001/dashboard`
3. **Free account:** 🛠 Skill button is visible but greyed out with 🔒; hovering shows "Upgrade to Reader..."
4. **Reader/Pro account:** clicking 🛠 Skill opens modal
5. In modal: Q1, Q2, Q3 must all be answered before "Generate Skill" enables
6. Deselect all tools → "Select at least one tool." warning appears
7. Answer all questions → click Generate Skill → spinner appears
8. After ~5–10s, preview panel shows skill `.md` content with YAML frontmatter
9. 📋 Copy button → clipboard contains skill content
10. ⬇ Download .md → file `{skill-name}.md` downloads with correct content
11. Verify downloaded file opens correctly and contains valid `---\nname:\ndescription:\ntools:\n---` frontmatter

- [ ] **Step 8: Commit**

```bash
git add components/BookCard.tsx
git commit -m "feat: wire up Skill button and SkillBuilderModal in BookCard"
```
