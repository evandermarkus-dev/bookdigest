
export const FREE_LIMIT = 3

export const FIELD_LABELS: Record<string, string> = {
  // Book styles
  overview: 'Overview',
  key_insights: 'Key Insights',
  core_message: 'Core Message',
  relevance: 'Relevance',
  main_concepts: 'Main Concepts',
  key_chapters: 'Key Chapters',
  important_quotes: 'Key Ideas',
  study_questions: 'Study Questions',
  immediate_actions: 'Immediate Actions',
  weekly_habits: 'Weekly Habits',
  tools_and_frameworks: 'Tools & Frameworks',
  '30_day_plan': '30-Day Plan',
  // Knowledge style
  author: 'Author',
  tags: 'Tags',
  core_idea: 'Core Idea',
  key_concepts: 'Key Concepts',
  connections: 'Connections',
  practical_application: 'Practical Application',
  // Research / academic paper style
  study_type: 'Study Type',
  research_question: 'Research Question',
  sample: 'Sample',
  methodology: 'Methodology',
  key_findings: 'Key Findings',
  novelty: 'Novelty & Contribution',
  limitations: 'Limitations',
  practical_implications: 'Practical Implications',
  conclusion: 'Conclusion',
  key_citations: 'Key Citations',
}

export type SummaryStyle = 'executive' | 'study' | 'action' | 'research' | 'knowledge'

export const SUMMARY_STYLES: Record<SummaryStyle, { label: string; description: string; emoji: string }> = {
  executive: {
    label: 'Executive',
    description: 'High-level overview & key insights',
    emoji: '💼',
  },
  study: {
    label: 'Study',
    description: 'Detailed breakdown for deep learning',
    emoji: '🎓',
  },
  action: {
    label: 'Action',
    description: 'Practical steps & implementation',
    emoji: '🚀',
  },
  research: {
    label: 'Research',
    description: 'Academic analysis & key findings',
    emoji: '🔬',
  },
  knowledge: {
    label: 'Knowledge',
    description: 'Structured knowledge base entry for Obsidian',
    emoji: '🧠',
  },
}

/** The four styles shown for regular books (excludes 'research'). */
export const BOOK_STYLES: SummaryStyle[] = ['executive', 'study', 'action', 'knowledge']

// Suggested chat questions — one set per supported language
export const CHAT_SUGGESTIONS: Record<string, [string, string, string]> = {
  en: ['What are the main takeaways?', 'What action should I take first?', 'Summarize this in one sentence.'],
  sv: ['Vad är de viktigaste lärdomarna?', 'Vilken åtgärd bör jag ta först?', 'Sammanfatta detta i en mening.'],
  de: ['Was sind die wichtigsten Erkenntnisse?', 'Welche Maßnahme sollte ich zuerst ergreifen?', 'Fasse das in einem Satz zusammen.'],
  fr: ['Quels sont les points essentiels ?', 'Quelle action devrais-je entreprendre en premier ?', 'Résume cela en une phrase.'],
  es: ['¿Cuáles son las conclusiones principales?', '¿Qué acción debo tomar primero?', 'Resume esto en una oración.'],
  no: ['Hva er de viktigste lærdomene?', 'Hvilken handling bør jeg ta først?', 'Oppsummer dette i én setning.'],
  da: ['Hvad er de vigtigste pointer?', 'Hvilken handling bør jeg tage først?', 'Opsummer dette i én sætning.'],
  fi: ['Mitkä ovat tärkeimmät opit?', 'Mitä toimenpidettä minun pitäisi tehdä ensin?', 'Tiivistä tämä yhdellä lauseella.'],
}

/**
 * Detect the language of a summary by extracting text from the content JSON
 * and matching against language-specific character/word patterns.
 * Falls back to English when unsure.
 */
export function detectLanguageFromContent(content: string): string {
  // Extract all text values from the summary JSON
  let text = ''
  try {
    const parsed = JSON.parse(content) as Record<string, unknown>
    const parts: string[] = []
    for (const val of Object.values(parsed)) {
      if (typeof val === 'string') {
        parts.push(val)
      } else if (Array.isArray(val)) {
        for (const item of val) {
          if (typeof item === 'string') parts.push(item)
          else if (typeof item === 'object' && item !== null) {
            for (const v of Object.values(item as Record<string, unknown>)) {
              if (typeof v === 'string') parts.push(v)
            }
          }
        }
      }
    }
    text = parts.join(' ').slice(0, 800)
  } catch {
    text = content.slice(0, 800)
  }

  const t = text.toLowerCase()

  // Finnish — very distinctive morphology (no æ/ø/ä shared with other Nordics)
  if (/\b(että|kanssa|myös|kuten|ovat|sekä|joka|kaikki|kirja|toiminta|ensimmäinen)\b/.test(t)) return 'fi'

  // German — ß is unique; common German function words
  if (/ß/.test(t) || /\b(und|ist|das|nicht|auch|wird|sind|einer|einen|beim|durch)\b/.test(t)) return 'de'

  // French — distinctive articles and prepositions
  if (/\b(les|des|est|une|pour|dans|qui|sur|avec|très|cette|même|être|avoir)\b/.test(t)) return 'fr'

  // Spanish — ñ is unique; common Spanish words
  if (/ñ/.test(t) || /\b(los|las|del|una|por|con|más|para|también|acción|capítulo)\b/.test(t)) return 'es'

  // Swedish — has ä/ö but NOT æ/ø; distinctive Swedish words
  if ((/[äö]/.test(t) && !/[æø]/.test(t)) || /\b(och|att|är|för|med|till|som|det|av|på)\b/.test(t)) return 'sv'

  // Norwegian vs Danish (both have æ/ø/å)
  if (/[æø]/.test(t)) {
    if (/\b(ikke|gjøre|ønsker|viktig|første|handling|boken|leseren)\b/.test(t)) return 'no'
    if (/\b(ikke|gøre|ønsker|vigtig|første|handling|bogen|læseren)\b/.test(t)) return 'da'
    return 'no' // default to Norwegian if can't distinguish
  }

  return 'en'
}

export const LANGUAGES = [
  { code: 'auto', label: 'Same as PDF' },
  { code: 'sv', label: 'Svenska' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'no', label: 'Norsk' },
  { code: 'da', label: 'Dansk' },
  { code: 'fi', label: 'Suomi' },
]

// Page citation instruction appended to all prompts when text has [PAGE N] markers.
// Claude uses the markers to tie each array item back to a specific page.
const PAGE_CITATION_INSTRUCTION = `\
The book text is annotated with [PAGE N] markers that indicate where each new page begins. \
For every item in an array field, add a "page" field (integer) with the page number where \
that specific insight, concept, quote, or action appears in the source text. \
Determine the page by finding which [PAGE N] block the content belongs to. \
Only include "page" if you can identify it with confidence — omit the field entirely \
if the content spans many pages or you cannot clearly determine the source page.`

export function getSystemPrompt(style: SummaryStyle, language = 'auto', userContext?: string): string {
  const languageInstruction =
    language === 'auto'
      ? 'Write your response in the same language as the document.'
      : `Write your entire response in ${LANGUAGES.find((l) => l.code === language)?.label ?? language}. This includes all JSON values — the keys must remain in English but all text values must be in the specified language.`
  const prompts: Record<SummaryStyle, string> = {
    executive: `You are an expert business analyst. Summarize the book concisely for a busy executive.

Structure your response as valid JSON with this exact format:
{
  "title": "Book title",
  "overview": "2-3 sentence high-level summary",
  "key_insights": [
    {"text": "insight 1", "page": 42},
    {"text": "insight 2", "page": 67}
  ],
  "core_message": "The single most important takeaway in one sentence",
  "relevance": "Why this matters for business leaders"
}

Be concise, data-driven, and focus on ROI and strategic value. You may use **bold** for key terms within text values. ${PAGE_CITATION_INSTRUCTION} ${languageInstruction}`,

    study: `You are an expert educator. Create a comprehensive study guide for this book.

Structure your response as valid JSON with this exact format:
{
  "title": "Book title",
  "overview": "2-3 sentence summary",
  "main_concepts": [{"concept": "name", "explanation": "clear explanation", "page": 15}],
  "key_chapters": [{"topic": "topic name", "summary": "what was covered", "page": 23}],
  "important_quotes": [{"text": "a key idea from this part of the book, expressed entirely in your own words — do NOT reproduce verbatim text from the source", "page": 78}],
  "study_questions": ["question 1", "question 2", "question 3"]
}

IMPORTANT: The "important_quotes" field must contain paraphrased key ideas, NOT verbatim text copied from the book. Express each idea in your own words while preserving the meaning.
Focus on helping the reader deeply understand and retain the material. You may use **bold** for key terms within text values. ${PAGE_CITATION_INSTRUCTION} ${languageInstruction}`,

    action: `You are an expert coach. Extract the most actionable advice from this book.

Structure your response as valid JSON with this exact format:
{
  "title": "Book title",
  "overview": "2-3 sentence summary",
  "immediate_actions": [{"text": "action 1", "page": 12}],
  "weekly_habits": [{"text": "habit 1", "page": 34}],
  "tools_and_frameworks": [{"name": "tool name", "how_to_use": "brief instructions", "page": 56}],
  "30_day_plan": "A concise 30-day implementation plan"
}

Focus entirely on practical, immediately applicable steps. You may use **bold** for key terms within text values. ${PAGE_CITATION_INSTRUCTION} ${languageInstruction}`,

    research: `You are an expert research analyst. Analyze this academic paper or research document.

Structure your response as valid JSON with this exact format:
{
  "title": "Paper title",
  "study_type": "Type of study — e.g. RCT, Meta-analysis, Cohort study, Survey, Qualitative, Case study, Literature review, Theoretical",
  "research_question": "The central research question or hypothesis being investigated",
  "sample": "Sample description — e.g. 'N=1,204 adults with type 2 diabetes' or 'N/A — theoretical or literature review'",
  "methodology": "How the study was conducted: design, data collection, and analysis approach",
  "key_findings": [
    {"text": "Finding with statistics where available (e.g. effect sizes, p-values, percentages)", "page": 5},
    {"text": "finding 2", "page": 8}
  ],
  "novelty": "What this paper contributes that was not previously known or established — how does it differ from prior work?",
  "limitations": "Key limitations the authors acknowledge, or that you identify",
  "practical_implications": "Concrete takeaways — what should practitioners or researchers do with these findings?",
  "conclusion": "Main conclusion and its broader significance",
  "key_citations": ["Author (Year) — what was cited and why it matters"]
}

Be precise and academic. Distinguish clearly between findings and interpretations. Include quantitative data (effect sizes, p-values, confidence intervals) in findings where present. Do not add fields that are not in the schema above. ${PAGE_CITATION_INSTRUCTION} ${languageInstruction}`,

    knowledge: `You are a knowledge curator. Create a structured knowledge base entry for this book, optimized for import into Obsidian or any PKM (Personal Knowledge Management) tool.

Structure your response as valid JSON with this exact format:
{
  "title": "Book title",
  "author": "Author name",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "core_idea": "The single most important idea from this book in 2-3 sentences",
  "key_concepts": [
    {"concept": "Concept name", "explanation": "Brief explanation of this concept and why it matters", "page": 0}
  ],
  "connections": ["→ Related book or idea — why it connects"],
  "practical_application": "How to apply the core ideas from this book in practice"
}

Tags: 5-8 lowercase tags relevant to the book's themes, topics, and domain. Single words or short hyphenated phrases.
Key concepts: Extract 5-8 of the most important, linkable concepts — the kind you would create [[wiki-links]] for in Obsidian.
Connections: 3-5 links to related books, frameworks, or broader intellectual traditions.
You may use **bold** for key terms within text values. ${PAGE_CITATION_INSTRUCTION} ${languageInstruction}`,
  }

  // Sanitize userContext to prevent prompt injection: cap length and strip control characters
  const sanitizedContext = userContext
    ? userContext.slice(0, 500).replace(/[<>{}\[\]\\]/g, '').trim()
    : ''
  const contextSection = sanitizedContext ? `\n\n${sanitizedContext} Tailor the summary accordingly.` : ''
  return prompts[style] + contextSection
}

export type UserProfile = { goal: string; level: string; focus: string }

export function buildUserContext(profile: UserProfile): string {
  const goalMap: Record<string, string> = {
    apply: 'apply insights to their work',
    learn: 'deeply understand the topic',
    reference: 'use as a quick reference',
    teach: 'teach others about it',
  }
  const levelMap: Record<string, string> = {
    beginner: 'complete beginner',
    some: 'some familiarity',
    intermediate: 'intermediate',
    expert: 'advanced/expert',
  }
  const focusMap: Record<string, string> = {
    practical: 'practical implementation',
    theory: 'theory and concepts',
    insights: 'key insights only',
    comprehensive: 'comprehensive coverage',
  }
  return `Reader context: Goal is to ${goalMap[profile.goal] ?? profile.goal}. Experience level: ${levelMap[profile.level] ?? profile.level}. Focus preference: ${focusMap[profile.focus] ?? profile.focus}.`
}

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
