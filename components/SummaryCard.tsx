'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { SUMMARY_STYLES, type SummaryStyle } from '@/lib/prompts'

interface Summary {
  id: string
  file_name: string
  style: SummaryStyle
  content: string
  created_at: string
}

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

export default function SummaryCard({ summary }: { summary: Summary }) {
  const [expanded, setExpanded] = useState(false)
  const style = SUMMARY_STYLES[summary.style]

  let parsed: Record<string, unknown> | null = null
  try {
    parsed = JSON.parse(summary.content)
  } catch {
    parsed = null
  }

  const title = parsed?.title as string | undefined
  const date = new Date(summary.created_at).toLocaleDateString('sv-SE')

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{style.emoji}</span>
          <div>
            <p className="font-semibold text-gray-900 truncate max-w-xs">
              {title ?? summary.file_name}
            </p>
            <p className="text-sm text-gray-500">{style.label} · {date}</p>
          </div>
        </div>
        <span className="text-gray-400 text-lg">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && parsed && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-4 space-y-5 text-sm text-gray-700">
          {Object.entries(parsed).map(([key, value]) => {
            if (key === 'title') return null
            const label = FIELD_LABELS[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

            return (
              <div key={key}>
                <p className="font-semibold text-gray-900 mb-2 text-base">{label}</p>

                {Array.isArray(value) ? (
                  <ul className="space-y-2">
                    {(value as unknown[]).map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-indigo-400 mt-0.5 shrink-0">•</span>
                        <span>
                          {typeof item === 'object' && item !== null ? (
                            <span>
                              {Object.entries(item as Record<string, string>).map(([k, v], j) => (
                                <span key={k}>
                                  {j > 0 && <span className="text-gray-400"> — </span>}
                                  {j === 0 ? <strong>{v}</strong> : <span className="prose prose-sm max-w-none"><ReactMarkdown>{v}</ReactMarkdown></span>}
                                </span>
                              ))}
                            </span>
                          ) : (
                            <div className="prose prose-sm max-w-none"><ReactMarkdown>{String(item)}</ReactMarkdown></div>
                          )}
                        </span>
                      </li>
                    ))}
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
      )}
    </div>
  )
}
