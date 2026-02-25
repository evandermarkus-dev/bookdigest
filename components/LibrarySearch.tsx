'use client'

import { useState, useMemo } from 'react'
import BookCard, { type Book } from './BookCard'

interface Props {
  books: Book[]
  summariesThisMonth: number
  emptyState: React.ReactNode
}

// ---------------------------------------------------------------------------
// TODO: Write the filter function
// ---------------------------------------------------------------------------
// This function decides which books match the user's search query.
// `query` is already lowercased and trimmed.
// `book.file_name` is the uploaded filename, e.g. "Atomic Habits.pdf"
//
// Options to consider:
//   A) Simple substring — easiest, works well for exact title searches
//      return book.file_name.toLowerCase().includes(query)
//
//   B) Word-by-word — every typed word must appear somewhere in the name
//      const words = query.split(/\s+/)
//      return words.every(w => book.file_name.toLowerCase().includes(w))
//
//   C) Also search summary content — most powerful, searches inside the AI text
//      const content = Object.values(book.summaries).map(s => s.content).join(' ').toLowerCase()
//      return book.file_name.toLowerCase().includes(query) || content.includes(query)
//
// Which approach fits your users best? Write 3-8 lines here:
// ---------------------------------------------------------------------------
function matchesQuery(book: Book, query: string): boolean {
  return book.file_name.toLowerCase().includes(query)
}

export default function LibrarySearch({ books, summariesThisMonth, emptyState }: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return books
    return books.filter(book => matchesQuery(book, q))
  }, [books, query])

  return (
    <div>
      {/* Search bar — only shown when there are books */}
      {books.length > 0 && (
        <div className="relative mb-5">
          {/* Search icon */}
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: 'var(--app-muted)' }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>

          <input
            type="text"
            placeholder="Search your books…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl outline-none transition-all"
            style={{
              background: 'var(--app-surface)',
              border: '1px solid var(--app-border)',
              color: 'var(--app-text)',
            }}
          />

          {/* Clear button */}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full transition-opacity hover:opacity-60"
              style={{ color: 'var(--app-muted)' }}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {books.length === 0 ? (
        emptyState
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center rounded-2xl" style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--app-text)' }}>No books match &ldquo;{query}&rdquo;</p>
          <p className="text-xs" style={{ color: 'var(--app-muted)' }}>Try a different title or clear the search</p>
        </div>
      ) : (
        <div className="space-y-3">
          {query && (
            <p className="text-xs mb-3" style={{ color: 'var(--app-muted)' }}>
              {filtered.length} of {books.length} book{books.length !== 1 ? 's' : ''}
            </p>
          )}
          {filtered.map(book => (
            <BookCard key={book.file_path} book={book} summariesThisMonth={summariesThisMonth} />
          ))}
        </div>
      )}
    </div>
  )
}
