# Claude Skill Builder — Design Spec
**Date:** 2026-04-05
**Status:** Approved

---

## Overview

A modal-based wizard triggered from BookCard's toolbar that converts a book's existing summary into a downloadable, installable Claude Code skill file (`.md` format). The user shapes the skill through a hybrid questionnaire (structured choices + optional freetext) before receiving the final output.

**Core principle:** Reuse the existing summary as context — no re-reading of the PDF. This makes generation fast (~5s) and cheap.

---

## User Flow

```
BookCard toolbar
  └── "🛠 Skill" button (Reader+ only, locked with 🔒 for Free)
        └── SkillBuilderModal opens
              ├── Step 1 — Questions (structured + freetext)
              ├── Step 2 — Generating (spinner)
              └── Step 3 — Preview + Copy + Download
```

1. User clicks **🛠 Skill** in the BookCard toolbar
2. Modal opens — shows book title, 3 structured questions + optional freetext
3. User clicks **Generate Skill**
4. API call to `POST /api/skill/generate` — returns skill name + full `.md` content
5. Preview shown in a code block with:
   - **📋 Copy** — copies content to clipboard
   - **⬇ Download .md** — downloads file as `{skill-name}.md`
   - Installation hint: *"Save to `~/.claude/skills/` to activate in Claude Code"*

---

## Questions (Step 1)

### Q1 — Focus Area (radio, required)
| Value | Label |
|-------|-------|
| `teaching` | Teaching & explaining concepts |
| `practical` | Practical application & workflows |
| `decisions` | Decision-making & frameworks |
| `reference` | Reference & quick lookup |

### Q2 — Tools (checkboxes, at least one required)
`Read`, `Write`, `Bash`, `Glob`, `Grep`, `WebSearch`, `WebFetch`
Default checked: `Read`, `Write`

### Q3 — Persona (radio, required)
| Value | Label |
|-------|-------|
| `expert` | Strict expert — direct, precise, no fluff |
| `mentor` | Friendly mentor — encouraging, explains reasoning |
| `concise` | Concise assistant — bullet points, short answers |
| `socratic` | Socratic teacher — asks questions, guides discovery |

### Freetext (optional)
Placeholder: *"Anything specific you want this skill to do or know?"*
Max 500 chars. Sanitized server-side (same pattern as `userContext` in `getSystemPrompt`).

---

## Component: `SkillBuilderModal.tsx`

**State machine:** `step: 'questions' | 'generating' | 'preview'`

**Props:**
```ts
interface SkillBuilderModalProps {
  open: boolean
  onClose: () => void
  bookTitle: string
  summaryId: string        // Pre-selected by BookCard: Knowledge > Executive > Study > Action > Research
  tier: Tier
}
```

**BookCard selects the best summary** before opening the modal:
```ts
const bestSummaryId =
  summaries.knowledge?.id ??
  summaries.executive?.id ??
  summaries.study?.id ??
  summaries.action?.id ??
  summaries.research?.id
```
If no summary exists yet, the 🛠 Skill button is disabled with tooltip *"Generate a summary first"*.

**Key behaviors:**
- The "Generate Skill" button is disabled until Q1, Q2 (≥1), and Q3 are answered
- On error: inline error message, button re-enabled for retry
- Download uses `URL.createObjectURL(new Blob([skillContent]))` — no server roundtrip

---

## API Route: `POST /api/skill/generate`

**File:** `app/api/skill/generate/route.ts`

**Auth:** Requires authenticated user. Verifies `summary.user_id === user.id` before using the summary.

**Rate limiting:** Uses existing `checkRateLimit('skill', user.id)` pattern. Reader tier: 3 skills/month. Pro: unlimited. Free: blocked (returns 403).

**Request body:**
```ts
{
  summaryId: string
  focusArea: 'teaching' | 'practical' | 'decisions' | 'reference'
  tools: string[]           // e.g. ["Read", "Write"]
  persona: 'expert' | 'mentor' | 'concise' | 'socratic'
  freetext?: string
}
```

**Response:**
```ts
{
  skillName: string         // kebab-case, e.g. "atomic-habits-coach"
  skillContent: string      // complete .md string ready to save
}
```

**Server-side skill name sanitization:**
Parse `name:` from Claude's YAML frontmatter. If missing or invalid, fall back to `slugify(bookTitle + '-' + focusArea)`.

---

## Prompt: `getSkillPrompt()`

**File:** `lib/prompts.ts` (new exported function alongside `getSystemPrompt`)

```
You are a Claude Code skill architect. Create a complete, installable
Claude Code skill (.md format) based on this book summary.

BOOK SUMMARY:
{summaryContent}

CONFIGURATION:
- Focus: {focusArea}
- Available tools: {tools}
- Persona: {persona}
{freetext ? `- Extra instructions: ${freetext}` : ''}

OUTPUT FORMAT — return ONLY valid markdown with this exact structure:

---
name: {kebab-case-skill-name}
description: One clear sentence describing what this skill does (max 100 chars)
tools: {comma-separated tool names}
---

# {Skill Title}

{3–5 paragraphs of detailed instructions for Claude, written in second
person ("You are...", "When the user..."). Draw directly from the book's
frameworks, concepts, and methodology. Reference the book's actual models
and language. Be specific and actionable.}

## Core Principles
{3–5 bullet points from the book's central ideas, in the book's own language}

## How to Use This Skill
{2–3 concrete usage examples showing what prompts or commands activate this skill}
```

**Model:** Claude Sonnet (same as other routes — no need for Haiku, skill quality matters)

---

## Config: `lib/config.ts`

```ts
export const READER_SKILL_LIMIT = 3   // skills per month for Reader tier
// Pro: unlimited
// Free: no access (blocked in API route)
```

Rate limit key: `skill:{userId}` — same Redis pattern as `chat` and `audio`.

---

## Tier Gating

| Tier | Behavior |
|------|----------|
| Free | 🔒 Button visible but disabled. Tooltip: *"Upgrade to Reader to build Claude Skills"* |
| Reader | ✓ Up to 3 skills/month |
| Pro | ✓ Unlimited |

---

## Storage

**MVP:** No database storage. Skill content lives in React state; user downloads or copies it. Modal close discards the generated skill.

**Post-MVP:** Add a `skills` table (`id`, `user_id`, `summary_id`, `skill_name`, `skill_content`, `created_at`) so users can revisit generated skills from their dashboard.

---

## Files to Create / Modify

| File | Action |
|------|--------|
| `components/SkillBuilderModal.tsx` | Create |
| `app/api/skill/generate/route.ts` | Create |
| `lib/prompts.ts` | Add `getSkillPrompt()` |
| `lib/config.ts` | Add `READER_SKILL_LIMIT` |
| `components/BookCard.tsx` | Add 🛠 Skill button to toolbar |

---

## Out of Scope (MVP)

- Storing generated skills in the database
- Editing/regenerating with revised answers (close and reopen to restart)
- Previewing the skill in a rendered markdown view (code block is sufficient)
- Auto-installing into Claude Code (requires OS file system access)
- Skill versioning or history
