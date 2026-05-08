import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ — AI Book Summarization',
  description: 'Frequently asked questions about BookDigest — how AI book summarization works, what PDF formats are supported, pricing, and how summaries are personalized.',
  alternates: { canonical: 'https://bookdigest.se/faq' },
}

const FAQ_ITEMS = [
  {
    q: 'How does AI book summarization work?',
    a: 'BookDigest extracts the text from your uploaded PDF, then sends it to Claude AI (by Anthropic) along with your personal context — your goals, experience level, and focus area. Claude analyzes the full text and generates a structured summary in your chosen style. The result is ready in 2–3 minutes.',
  },
  {
    q: 'What summary styles does BookDigest offer?',
    a: 'BookDigest offers five summary styles: (1) Executive Summary — bottom-line insights for busy professionals; (2) Study Guide — deep conceptual breakdowns for learning; (3) Action Plan — concrete tasks derived from the book\'s advice; (4) Knowledge Base — structured for Obsidian and PKM tools; (5) Research Analysis — methodology, findings, and limitations for academic papers.',
  },
  {
    q: 'Is BookDigest free?',
    a: 'Yes, BookDigest has a free tier that includes 3 AI summaries per month with no credit card required. Paid plans start at 79 SEK/month (Reader, 20 summaries, all styles) and 149 SEK/month (Pro, unlimited summaries, all features).',
  },
  {
    q: 'What types of PDFs can I summarize?',
    a: 'BookDigest works with any text-based PDF — non-fiction books, business books, self-help books, academic research papers, whitepapers, and reports. Scanned image PDFs without a text layer are not supported.',
  },
  {
    q: 'How is my summary personalized?',
    a: 'Before generating your first summary, BookDigest asks 3 quick questions: your main goal (learn, apply, retain knowledge), your experience level with the topic (beginner, intermediate, expert), and your specific focus area. These answers shape how Claude frames concepts, selects examples, and structures the output — so two readers of the same book get meaningfully different summaries.',
  },
  {
    q: 'Can I generate multiple summary styles from the same book?',
    a: 'Yes. Upload your PDF once and generate any or all of the five summary styles independently at any time — no need to re-upload. Each style is generated on demand and saved to your library.',
  },
  {
    q: 'How accurate are the AI summaries?',
    a: 'BookDigest summaries are generated directly from the text of your uploaded PDF by Claude AI, one of the most accurate and nuanced AI models available. Summaries include page citations (e.g., "p.42") so you can verify any insight against the source. BookDigest does not fabricate content from outside your PDF.',
  },
  {
    q: 'Can I chat with my book summary?',
    a: 'Yes. Every summary has a built-in chat feature powered by Claude AI. You can ask follow-up questions, dig deeper into specific concepts, request examples, or test your understanding — all in the context of your specific book.',
  },
  {
    q: 'Can I export my summaries?',
    a: 'Yes. All summaries can be exported as Markdown (for Obsidian, Notion, or any text editor) or printed to PDF directly from the browser. Your data is always yours.',
  },
  {
    q: 'Does BookDigest support Swedish?',
    a: 'Yes. BookDigest detects the language of your PDF and generates the summary in the same language. Swedish PDFs produce Swedish summaries. The service is also available at bookdigest.se/sv/books/ for Swedish users.',
  },
  {
    q: 'How is BookDigest different from Blinkist or Shortform?',
    a: 'Blinkist and Shortform summarize a fixed catalog of popular books, written by human editors. BookDigest lets you upload any PDF — including books not in any catalog, niche non-fiction, academic papers, or company reports — and generates an AI summary personalized to you specifically. You are not limited to their library.',
  },
  {
    q: 'Is my uploaded PDF stored securely?',
    a: 'Yes. Uploaded files are stored in a secure Supabase storage bucket with row-level security — only you can access your own files. You can delete any book and its associated summaries at any time from your dashboard.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div style={{
        backgroundColor: '#0e0d0b', color: '#f0ebe1',
        minHeight: '100vh', fontFamily: 'var(--font-geist-sans), sans-serif',
      }}>
        {/* Nav */}
        <nav style={{
          borderBottom: '1px solid #2c2a25',
          padding: '1.125rem 1.5rem',
        }}>
          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.25rem', fontWeight: 700, color: '#f0ebe1', letterSpacing: '-0.025em' }}>
                Book<span style={{ color: '#c9963a' }}>Digest</span>
              </span>
            </Link>
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <Link href="/pricing" style={{ color: '#7a7166', fontSize: '0.9rem', textDecoration: 'none' }}>Pricing</Link>
              <Link href="/login" style={{ color: '#c9963a', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600 }}>Get Started →</Link>
            </div>
          </div>
        </nav>

        {/* Header */}
        <header style={{ padding: '4rem 1.5rem 2rem', textAlign: 'center' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c9963a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              FAQ
            </p>
            <h1 style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1,
              color: '#f0ebe1', marginBottom: '1rem',
            }}>
              Frequently Asked Questions
            </h1>
            <p style={{ color: '#7a7166', fontSize: '1.0625rem', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
              Everything you need to know about AI book summarization with BookDigest.
            </p>
          </div>
        </header>

        {/* FAQ list */}
        <main style={{ padding: '2rem 1.5rem 6rem' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0' }}>
            {FAQ_ITEMS.map(({ q, a }, i) => (
              <div
                key={i}
                style={{
                  borderTop: '1px solid #2c2a25',
                  padding: '2rem 0',
                }}
              >
                <h2 style={{
                  fontSize: '1.0625rem', fontWeight: 600,
                  color: '#f0ebe1', marginBottom: '0.875rem', lineHeight: 1.4,
                }}>
                  {q}
                </h2>
                <p style={{ fontSize: '0.9375rem', color: '#a09890', lineHeight: 1.75, margin: 0 }}>
                  {a}
                </p>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #2c2a25' }} />
          </div>

          {/* CTA */}
          <div style={{ maxWidth: 800, margin: '4rem auto 0', textAlign: 'center' }}>
            <p style={{ color: '#7a7166', marginBottom: '1.25rem', fontSize: '1rem' }}>
              Still have questions? Try BookDigest for free — no credit card required.
            </p>
            <Link
              href="/login"
              style={{
                display: 'inline-block',
                background: '#c9963a', color: '#1a0f00',
                fontWeight: 700, padding: '0.9rem 2rem',
                borderRadius: '0.75rem', fontSize: '1rem',
                textDecoration: 'none',
              }}
            >
              Get 3 Free Summaries →
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid #2c2a25', padding: '1.75rem 1.5rem' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 700, color: '#f0ebe1' }}>
              Book<span style={{ color: '#c9963a' }}>Digest</span>
            </span>
            <p style={{ fontSize: '0.8125rem', color: '#7a7166', margin: 0 }}>© 2026 BookDigest · Powered by Claude AI</p>
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <Link href="/tos" style={{ color: '#7a7166', fontSize: '0.8125rem', textDecoration: 'none' }}>Terms</Link>
              <Link href="/privacy" style={{ color: '#7a7166', fontSize: '0.8125rem', textDecoration: 'none' }}>Privacy</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
