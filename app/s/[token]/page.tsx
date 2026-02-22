import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { SUMMARY_STYLES, type SummaryStyle } from '@/lib/prompts'
import type { Metadata } from 'next'

const FIELD_LABELS: Record<string, string> = {
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

interface SharedSummary {
  file_name: string
  style: string
  content: string
  created_at: string
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('shared_summaries')
    .select('file_name, style')
    .eq('token', token)
    .single()

  if (!data) return { title: 'BookDigest' }
  const styleLabel = SUMMARY_STYLES[data.style as SummaryStyle]?.label ?? data.style
  return {
    title: `${data.file_name} — ${styleLabel} Summary | BookDigest`,
    description: `AI-generated ${styleLabel.toLowerCase()} summary of "${data.file_name}", created with BookDigest.`,
  }
}

export default async function SharedSummaryPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createClient()

  const { data: share } = await supabase
    .from('shared_summaries')
    .select('file_name, style, content, created_at')
    .eq('token', token)
    .single<SharedSummary>()

  if (!share) notFound()

  const style = share.style as SummaryStyle
  const styleInfo = SUMMARY_STYLES[style]

  let parsed: Record<string, unknown> | null = null
  try { parsed = JSON.parse(share.content) } catch {}

  const title = (parsed?.title as string) || share.file_name
  const createdDate = new Date(share.created_at).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <a href="/" className="font-semibold text-gray-900 text-base tracking-tight">
            Book<span className="text-indigo-600">Digest</span>
          </a>
          <a
            href="/login"
            className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-lg transition-colors"
          >
            Try for free →
          </a>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* Book header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full mb-4 uppercase tracking-wide">
            {styleInfo.emoji} {styleInfo.label} Summary
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2">{title}</h1>
          <p className="text-sm text-gray-400">Shared summary · Generated {createdDate} with BookDigest</p>
        </div>

        {/* Summary content */}
        {parsed ? (
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 space-y-6 mb-10">
            {Object.entries(parsed).map(([key, value]) => {
              if (key === 'title') return null
              const label = FIELD_LABELS[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
              return (
                <div key={key}>
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">{label}</p>
                  {Array.isArray(value) ? (
                    <ul className="space-y-2">
                      {(value as unknown[]).map((item, i) => (
                        <li key={i} className="flex gap-2 text-gray-700 text-sm leading-relaxed">
                          <span className="text-indigo-300 mt-0.5 shrink-0">•</span>
                          <span>
                            {typeof item === 'object' && item !== null ? (
                              (() => {
                                const vals = Object.values(item as Record<string, string>)
                                return (
                                  <span>
                                    <strong className="text-gray-900">{vals[0]}</strong>
                                    {vals.length > 1 && <span className="text-gray-500"> — {vals.slice(1).join(' ')}</span>}
                                  </span>
                                )
                              })()
                            ) : (
                              String(item)
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{String(value)}</p>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-400 mb-10">
            Could not load summary content.
          </div>
        )}

        {/* CTA block */}
        <div className="bg-indigo-600 rounded-2xl p-7 text-center text-white">
          <div className="text-3xl mb-3">📚</div>
          <h2 className="text-lg font-bold mb-1.5">Generate your own AI book summary</h2>
          <p className="text-indigo-200 text-sm mb-5 max-w-sm mx-auto">
            Upload any PDF and get a personalized {styleInfo.label.toLowerCase()} summary in minutes. Free to start.
          </p>
          <a
            href="/login"
            className="inline-block bg-white text-indigo-700 font-semibold px-7 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors text-sm"
          >
            Start for free →
          </a>
          <p className="text-indigo-300 text-xs mt-3">No credit card required · 10 free summaries/month</p>
        </div>
      </main>
    </div>
  )
}
