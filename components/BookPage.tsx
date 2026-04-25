/**
 * BookPage — shared server component for /books/[slug] (EN) and /sv/books/[slug] (SV).
 * Receives resolved book data and lang prop from the thin route wrappers.
 * No 'use client' — fully static, zero JS shipped to the browser.
 */

import type { Book } from '@/lib/books/data'

export type Lang = 'en' | 'sv'

const SITE_URL = 'https://bookdigest.com'

// UI strings per locale
const UI = {
  en: {
    genre: 'Genre',
    author: 'Author',
    year: 'Year',
    keyTakeaways: 'Key Takeaways',
    ctaHeading: 'Get your own personalized AI summary',
    ctaBody: 'Upload the PDF and get an Executive, Study, Action, or Research summary tailored to your goals.',
    ctaButton: 'Try for free →',
    trustLine: 'No credit card required · 3 free summaries/month',
    altLang: 'Svenska',
    altLangPrefix: 'Finns även på',
    backToBooks: '← All books',
  },
  sv: {
    genre: 'Genre',
    author: 'Författare',
    year: 'År',
    keyTakeaways: 'Viktiga lärdomar',
    ctaHeading: 'Få din egen personliga AI-sammanfattning',
    ctaBody: 'Ladda upp PDF:en och få en Executive-, Studie-, Handlings- eller Forskningssammanfattning anpassad till dina mål.',
    ctaButton: 'Prova gratis →',
    trustLine: 'Inget kort krävs · 3 gratis sammanfattningar/månad',
    altLang: 'English',
    altLangPrefix: 'Also available in',
    backToBooks: '← Alla böcker',
  },
} as const

interface BookPageProps {
  book: Book
  lang: Lang
}

export default function BookPage({ book, lang }: BookPageProps) {
  const loc = book[lang]
  const ui = UI[lang]
  const enUrl = `${SITE_URL}/books/${book.slug}`
  const svUrl = `${SITE_URL}/sv/books/${book.slug}`
  const altUrl = lang === 'en' ? svUrl : enUrl

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: { '@type': 'Person', name: book.author },
    datePublished: String(Math.abs(book.year)),
    genre: book.genre,
    url: lang === 'en' ? enUrl : svUrl,
    description: book.en.description,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div style={{ minHeight: '100vh', background: 'var(--app-bg, #f5f2ec)', color: 'var(--app-text, #1a1714)' }}>

        {/* ── Nav ─────────────────────────────────────────────────────── */}
        <header style={{
          background: 'var(--app-surface, #fdfbf5)',
          borderBottom: '1px solid var(--app-border, #e0d9cc)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <div className="max-w-2xl mx-auto px-6 py-3.5 flex items-center justify-between">
            <a
              href="/"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--app-text)' }}
            >
              Book<span style={{ color: 'var(--app-accent, #c9963a)' }}>Digest</span>
            </a>
            <a
              href="/login"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--app-surface)',
                background: 'var(--app-accent, #c9963a)',
                padding: '0.375rem 1rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
              }}
            >
              {ui.ctaButton}
            </a>
          </div>
        </header>

        {/* ── Main ────────────────────────────────────────────────────── */}
        <main className="max-w-2xl mx-auto px-6 py-10">

          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm" style={{ color: 'var(--app-muted, #6b6359)' }}>
              <li>
                <a href={lang === 'sv' ? '/sv/books' : '/books'} style={{ color: 'var(--app-accent)', textDecoration: 'none' }}>
                  {ui.backToBooks}
                </a>
              </li>
              <li aria-hidden="true">·</li>
              <li style={{ color: 'var(--app-muted)' }}>{book.genre}</li>
            </ol>
          </nav>

          {/* ── Book header ─────────────────────────────────────────── */}
          <div className="mb-8">
            {/* Genre pill */}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              border: '1px solid var(--app-accent, #c9963a)',
              background: 'var(--app-accent-dim, rgba(201,150,58,0.10))',
              color: 'var(--app-accent, #c9963a)',
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}>
              {book.genre}
            </span>

            {/* Emoji */}
            <div style={{ fontSize: '3.5rem', lineHeight: 1, marginBottom: '0.75rem' }}>
              {book.coverEmoji}
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontWeight: 900,
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                lineHeight: 1.2,
                marginBottom: '0.5rem',
                color: 'var(--app-text)',
              }}
            >
              {book.title}
            </h1>

            {/* Author · Year */}
            <p style={{ fontSize: '0.9375rem', color: 'var(--app-muted)', marginBottom: '1.25rem' }}>
              {book.author}
              {book.year > 0 && (
                <span style={{ marginLeft: '0.5rem', opacity: 0.7 }}>· {book.year}</span>
              )}
            </p>

            {/* Description */}
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--app-text)' }}>
              {loc.description}
            </p>
          </div>

          {/* ── Teaser card ─────────────────────────────────────────── */}
          <div
            style={{
              background: 'var(--app-surface, #fdfbf5)',
              border: '1px solid var(--app-border, #e0d9cc)',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <p style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--app-accent)',
              marginBottom: '1rem',
            }}>
              {ui.keyTakeaways}
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {loc.teaserPoints.map((point, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.625rem', fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--app-text)' }}>
                  <span style={{ color: 'var(--app-accent)', flexShrink: 0, marginTop: '0.1em', fontWeight: 700 }}>→</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── CTA block ───────────────────────────────────────────── */}
          <div
            style={{
              background: 'var(--app-accent, #c9963a)',
              borderRadius: '1rem',
              padding: '1.75rem',
              textAlign: 'center',
              color: '#1a0f00',
              marginBottom: '2rem',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📚</div>
            <h2 style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontWeight: 700,
              fontSize: '1.125rem',
              marginBottom: '0.5rem',
              color: '#1a0f00',
            }}>
              {ui.ctaHeading}
            </h2>
            <p style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '1.25rem', maxWidth: '28rem', margin: '0 auto 1.25rem' }}>
              {ui.ctaBody}
            </p>
            <a
              href="/login"
              style={{
                display: 'inline-block',
                background: '#1a0f00',
                color: 'var(--app-accent, #c9963a)',
                fontWeight: 700,
                fontSize: '0.9375rem',
                padding: '0.625rem 1.75rem',
                borderRadius: '0.625rem',
                textDecoration: 'none',
              }}
            >
              {ui.ctaButton}
            </a>
            <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.75rem' }}>
              {ui.trustLine}
            </p>
          </div>

          {/* ── Alt language link ───────────────────────────────────── */}
          <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--app-muted)' }}>
            {ui.altLangPrefix}{' '}
            <a href={altUrl} style={{ color: 'var(--app-accent)', textDecoration: 'underline' }}>
              {ui.altLang}
            </a>
          </p>

        </main>
      </div>
    </>
  )
}
