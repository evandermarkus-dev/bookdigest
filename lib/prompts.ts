
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
  // Knowledge / Obsidian style
  core_idea: 'Core Idea',
  key_concepts: 'Key Concepts',
  questions_to_explore: 'Questions to Explore',
  related_topics: 'Related Topics & Books',
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
    description: 'Structured literature note for your Obsidian vault',
    emoji: '🧠',
  },
}

/** The three styles shown for regular books (excludes 'research'). */
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

    knowledge: `You are a knowledge curator helping readers build their personal knowledge management system.
Analyze this book and create a structured literature note optimized for Obsidian vaults.

Structure your response as valid JSON with this exact format:
{
  "title": "Book title",
  "author": "Author name — extract from the text if present, omit the field if not found",
  "tags": ["tag1", "tag2", "tag3"],
  "core_idea": "One paragraph synthesizing the book's central thesis and why it matters",
  "key_concepts": [
    {"concept": "ConceptName", "definition": "Clear one-sentence definition", "page": 42}
  ],
  "key_insights": [
    {"text": "A key insight or idea from the book", "page": 89}
  ],
  "questions_to_explore": [
    "An open question this book raises",
    "A topic worth investigating further"
  ],
  "related_topics": [
    {"topic": "Book or topic title", "reason": "Why it connects to this book"}
  ]
}

Guidelines:
- tags: 3-5 lowercase topic tags (e.g. ["python", "programming", "learning"])
- key_concepts: 4-8 core concepts/terms the reader must understand
- key_insights: 4-6 important ideas worth remembering
- questions_to_explore: 3-5 thought-provoking questions for further inquiry
- related_topics: 2-4 related books or topics the reader might explore next
- You may use **bold** for key terms within text values.
${PAGE_CITATION_INSTRUCTION} ${languageInstruction}`,
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
