export const FREE_LIMIT = 10

export const FIELD_LABELS: Record<string, string> = {
  overview: 'Overview',
  key_insights: 'Key Insights',
  core_message: 'Core Message',
  relevance: 'Relevance',
  main_concepts: 'Main Concepts',
  key_chapters: 'Key Chapters',
  important_quotes: 'Important Quotes',
  study_questions: 'Study Questions',
  immediate_actions: 'Immediate Actions',
  weekly_habits: 'Weekly Habits',
  tools_and_frameworks: 'Tools & Frameworks',
  '30_day_plan': '30-Day Plan',
}

export type SummaryStyle = 'executive' | 'study' | 'action'

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
      ? 'Write your response in the same language as the book.'
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
  "important_quotes": [{"text": "exact quote from the book", "page": 78}],
  "study_questions": ["question 1", "question 2", "question 3"]
}

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
  }

  const contextSection = userContext ? `\n\n${userContext} Tailor the summary accordingly.` : ''
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
