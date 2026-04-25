/**
 * BookListPage — shared server component for /books (EN) and /sv/books (SV).
 * Lists all books in a responsive grid, grouped by genre.
 * Pure Server Component — zero JS to the browser.
 */

import { BOOKS } from '@/lib/books/data'
import type { Book } from '@/lib/books/data'
import type { Lang } from './BookPage'

const SITE_URL = 'https://bookdigest.com'

const UI = {
  en: {
    eyebrow: (n: number) => `${n} books`,
    heading: 'AI Book Summaries',
    subheading: 'Key insights from the most-read non-fiction books — in minutes, not hours.',
    ctaButton: 'Try for free →',
    altLang: 'Svenska',
    altLangPrefix: 'Finns även på',
    ctaHeading: 'Get your own personalized AI summary',
    ctaBody: 'Upload any PDF and get an Executive, Study, or Action summary tailored to your goals.',
    ctaAction: 'Start free →',
    trustLine: 'No credit card required · 3 free summaries/month',
  },
  sv: {
    eyebrow: (n: number) => `${n} böcker`,
    heading: 'AI-boksammanfattningar',
    subheading: 'Nyckelinsikter från de mest lästa fackböckerna — på minuter, inte timmar.',
    ctaButton: 'Prova gratis →',
    altLang: 'English',
    altLangPrefix: 'Also available in',
    ctaHeading: 'Få din egen personliga AI-sammanfattning',
    ctaBody: 'Ladda upp en PDF och få en Executive-, Studie- eller Handlingssammanfattning anpassad till dina mål.',
    ctaAction: 'Börja gratis →',
    trustLine: 'Inget kort krävs · 3 gratis sammanfattningar/månad',
  },
} as const

function groupByGenre(books: Book[]): [string, Book[]][] {
  const map = new Map<string, Book[]>()
  for (const book of books) {
    const arr = map.get(book.genre) ?? []
    arr.push(book)
    map.set(book.genre, arr)
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
}

export default function BookListPage({ lang }: { lang: Lang }) {
  const ui = UI[lang]
  const groups = groupByGenre(BOOKS)
  const enUrl = `${SITE_URL}/books`
  const svUrl = `${SITE_URL}/sv/books`
  const altUrl = lang === 'en' ? svUrl : enUrl

  return (
    <>
      <style>{`
        .bl-card {
          display: block;
          background: var(--app-surface, #fdfbf5);
          border: 1px solid var(--app-border, #e0d9cc);
          border-radius: 0.875rem;
          padding: 1.25rem 1.125rem;
          text-decoration: none;
          color: inherit;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .bl-card:hover {
          border-color: var(--app-accent, #c9963a);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(201,150,58,0.10);
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'var(--app-bg, #f5f2ec)', color: 'var(--app-text, #1a1714)' }}>

        {/* ── Nav ── */}
        <header style={{
          background: 'var(--app-surface, #fdfbf5)',
          borderBottom: '1px solid var(--app-border, #e0d9cc)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
            <a
              href="/"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--app-text, #1a1714)', textDecoration: 'none' }}
            >
              Book<span style={{ color: 'var(--app-accent, #c9963a)' }}>Digest</span>
            </a>
            <a
              href="/login"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#fdfbf5',
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

        {/* ── Main ── */}
        <main className="max-w-5xl mx-auto px-6 py-10">

          {/* Hero */}
          <div style={{ marginBottom: '3rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              border: '1px solid var(--app-accent, #c9963a)',
              background: 'rgba(201,150,58,0.10)',
              color: 'var(--app-accent, #c9963a)',
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}>
              {ui.eyebrow(BOOKS.length)}
            </span>

            <h1 style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontWeight: 900,
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              lineHeight: 1.15,
              marginBottom: '0.625rem',
              color: 'var(--app-text, #1a1714)',
            }}>
              {ui.heading}
            </h1>
            <p style={{ fontSize: '1rem', lineHeight: 1.65, color: 'var(--app-muted, #6b6359)', maxWidth: '42rem' }}>
              {ui.subheading}
            </p>
          </div>

          {/* ── Genre sections ── */}
          {groups.map(([genre, books]) => (
            <section key={genre} style={{ marginBottom: '3rem' }}>
              <h2 style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--app-accent, #c9963a)',
                marginBottom: '1rem',
                paddingBottom: '0.625rem',
                borderBottom: '1px solid var(--app-border, #e0d9cc)',
              }}>
                {genre}
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))',
                gap: '0.875rem',
              }}>
                {books.map(book => {
                  const href = lang === 'en' ? `/books/${book.slug}` : `/sv/books/${book.slug}`
                  return (
                    <a key={book.slug} href={href} className="bl-card">
                      <div style={{ fontSize: '2.25rem', lineHeight: 1, marginBottom: '0.75rem' }}>
                        {book.coverEmoji}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-playfair), Georgia, serif',
                        fontWeight: 700,
                        fontSize: '0.9375rem',
                        lineHeight: 1.3,
                        marginBottom: '0.375rem',
                        color: 'var(--app-text, #1a1714)',
                      }}>
                        {book.title}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--app-muted, #6b6359)' }}>
                        {book.author}
                        {book.year > 0 && (
                          <span style={{ marginLeft: '0.25rem', opacity: 0.65 }}>· {book.year}</span>
                        )}
                      </div>
                    </a>
                  )
                })}
              </div>
            </section>
          ))}

          {/* ── CTA block ── */}
          <div style={{
            background: 'var(--app-accent, #c9963a)',
            borderRadius: '1rem',
            padding: '1.75rem',
            textAlign: 'center',
            color: '#1a0f00',
            margin: '3rem 0 2rem',
          }}>
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
              {ui.ctaAction}
            </a>
            <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.75rem' }}>
              {ui.trustLine}
            </p>
          </div>

          {/* ── Alt language link ── */}
          <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--app-muted, #6b6359)', marginTop: '1.5rem' }}>
            {ui.altLangPrefix}{' '}
            <a href={altUrl} style={{ color: 'var(--app-accent, #c9963a)', textDecoration: 'underline' }}>
              {ui.altLang}
            </a>
          </p>

        </main>
      </div>
    </>
  )
}
