'use client'

import { useState, useEffect } from 'react'
import { Playfair_Display } from 'next/font/google'
import { createClient } from '@/lib/supabase'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})

type StyleTab = 'Executive' | 'Study' | 'Action'

const SHOWCASE: Record<StyleTab, { label: string; icon: string; desc: string; content: { h: string; p: string }[] }> = {
  Executive: {
    label: 'Executive Summary',
    icon: '⚡',
    desc: 'The bottom line. Fast.',
    content: [
      { h: 'Core Argument', p: 'Deliberate practice — not innate talent — separates experts from amateurs. The brain adapts to systematic challenge, not passive repetition.' },
      { h: '3 Key Decisions', p: '1. Attack your specific weak spots daily\n2. Build measurable feedback loops\n3. Operate consistently at the edge of your comfort zone' },
      { h: 'Bottom Line', p: '10,000 hours of deliberate — not mindless — practice is what creates world-class performance. Start designing your practice, not just doing it.' },
    ],
  },
  Study: {
    label: 'Study Guide',
    icon: '📖',
    desc: 'Deep concepts, built to last.',
    content: [
      { h: 'Core Concepts', p: 'Deliberate Practice: goal-directed with immediate feedback.\nMental Representations: expert internal models for faster pattern recognition.\nThe OK Plateau: the threshold where most people stop improving.' },
      { h: 'Chapter Breakdown', p: 'Ch. 1–3: The science of expertise. Chess masters, violin virtuosos, and athletes show consistent neurological adaptation through deliberate challenge.\n\nCh. 4–6: Building mental representations — how experts see what others cannot.' },
      { h: 'Memory Anchor', p: '"Naive practice is just going through the motions. Deliberate practice is purposeful, systematic, and sustained."' },
    ],
  },
  Action: {
    label: 'Action Plan',
    icon: '🎯',
    desc: 'What to do this week.',
    content: [
      { h: 'This Week', p: '☐ Identify the one skill you most want to develop\n☐ Find a coach, mentor, or objective feedback mechanism\n☐ 45 minutes of focused, distraction-free practice daily' },
      { h: 'This Month', p: '☐ Design a deliberate practice routine with measurable milestones\n☐ Review weekly against your specific benchmark\n☐ Study one world-class practitioner in your field' },
      { h: 'Habit to Build', p: 'First 60 minutes of each workday on your most important skill — before email, before meetings. Guard this time ruthlessly.' },
    ],
  },
}

export default function Home() {
  const [tab, setTab] = useState<StyleTab>('Executive')
  const [scrolled, setScrolled] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [bookCount, setBookCount] = useState(0)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      setLoggedIn(true)
      const { data } = await supabase.from('summaries').select('file_path')
      const unique = new Set((data ?? []).map((r: { file_path: string }) => r.file_path))
      setBookCount(unique.size)
    })
  }, [])

  const showcase = SHOWCASE[tab]

  return (
    <>
      <style>{`
        :root {
          --c-bg: #0e0d0b;
          --c-surface: #181612;
          --c-surface2: #201e19;
          --c-border: #2c2a25;
          --c-text: #f0ebe1;
          --c-muted: #7a7166;
          --c-accent: #c9963a;
          --c-accent-dim: rgba(201,150,58,0.12);
        }

        @keyframes c-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes c-shimmer {
          0%   { background-position: -300% center; }
          100% { background-position: 300% center; }
        }

        .c-fade-up { animation: c-fade-up 0.65s ease-out both; }
        .c-d1 { animation-delay: 0.05s; }
        .c-d2 { animation-delay: 0.15s; }
        .c-d3 { animation-delay: 0.25s; }
        .c-d4 { animation-delay: 0.35s; }
        .c-d5 { animation-delay: 0.5s; }

        .c-shimmer-text {
          background: linear-gradient(90deg, var(--c-accent) 0%, #f0c860 40%, var(--c-accent) 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: c-shimmer 4s linear infinite;
        }

        .c-card {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: 1.25rem;
          transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
        }
        .c-card:hover {
          border-color: var(--c-accent);
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(201,150,58,0.08);
        }

        .c-btn-primary {
          display: inline-block;
          background: var(--c-accent);
          color: #1a0f00;
          font-weight: 700;
          padding: 0.9rem 2rem;
          border-radius: 0.75rem;
          font-size: 1rem;
          letter-spacing: -0.01em;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          cursor: pointer;
        }
        .c-btn-primary:hover {
          background: #dcaa48;
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(201,150,58,0.3);
        }
        .c-btn-primary:active { transform: translateY(0); }

        .c-btn-ghost {
          display: inline-block;
          border: 1px solid var(--c-border);
          color: var(--c-muted);
          padding: 0.9rem 1.75rem;
          border-radius: 0.75rem;
          font-size: 1rem;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
        }
        .c-btn-ghost:hover {
          border-color: var(--c-accent);
          color: var(--c-accent);
        }

        .c-tab {
          padding: 0.5rem 1.25rem;
          border-radius: 0.625rem;
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          font-size: 0.9375rem;
          font-family: inherit;
          transition: all 0.2s;
          color: var(--c-muted);
        }
        .c-tab:hover { color: var(--c-text); }
        .c-tab.active {
          border-color: var(--c-accent);
          background: var(--c-accent-dim);
          color: var(--c-accent);
          font-weight: 600;
        }

        .c-nav-link {
          color: var(--c-muted);
          font-size: 0.9rem;
          text-decoration: none;
          transition: color 0.2s;
        }
        .c-nav-link:hover { color: var(--c-text); }

        .c-check { color: var(--c-accent); font-weight: 700; flex-shrink: 0; margin-top: 0.1em; }
      `}</style>

      <div
        className={playfair.variable}
        style={{ backgroundColor: 'var(--c-bg)', color: 'var(--c-text)', fontFamily: 'var(--font-geist-sans), sans-serif', minHeight: '100vh' }}
      >
        {/* ─── NAV ─── */}
        <nav style={{
          position: 'sticky', top: 0, zIndex: 50,
          borderBottom: `1px solid ${scrolled ? 'var(--c-border)' : 'transparent'}`,
          backgroundColor: scrolled ? 'rgba(14,13,11,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          transition: 'all 0.3s ease',
        }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: '1.125rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <a href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--c-text)', letterSpacing: '-0.025em' }}>
                Book<span style={{ color: 'var(--c-accent)' }}>Digest</span>
              </span>
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="#how" className="c-nav-link">How it works</a>
              <a href="#pricing" className="c-nav-link">Pricing</a>
              <a href="/login" className="c-nav-link">Sign in</a>
              <a href="/login" className="c-btn-primary" style={{ padding: '0.5rem 1.125rem', fontSize: '0.875rem' }}>
                Get Started
              </a>
            </div>
          </div>
        </nav>

        {/* ─── HERO ─── */}
        <section style={{ paddingTop: '6rem', paddingBottom: '4rem', position: 'relative', textAlign: 'center', overflow: 'hidden' }}>
          {/* Radial glow */}
          <div aria-hidden style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: 700, height: 500, pointerEvents: 'none',
            background: 'radial-gradient(ellipse, rgba(201,150,58,0.07) 0%, transparent 65%)',
          }} />

          <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
            {/* Eyebrow pill */}
            <div className="c-fade-up c-d1" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              border: '1px solid var(--c-border)', borderRadius: '100px',
              padding: '0.375rem 1rem', marginBottom: '2.25rem',
              backgroundColor: 'var(--c-surface)', fontSize: '0.8125rem',
              color: 'var(--c-accent)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'var(--c-accent)', display: 'inline-block', flexShrink: 0 }} />
              AI-Powered Book Intelligence
            </div>

            {/* Headline */}
            <h1 className="c-fade-up c-d2" style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(3rem, 8vw, 5.75rem)',
              fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em',
              marginBottom: '1.5rem', color: 'var(--c-text)',
            }}>
              Read <span className="c-shimmer-text">Smarter,</span>
              <br />Not Longer.
            </h1>

            {/* Subtext */}
            <p className="c-fade-up c-d3" style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.1875rem)',
              color: 'var(--c-muted)', maxWidth: 520, margin: '0 auto 2.25rem',
              lineHeight: 1.75,
            }}>
              Upload any PDF book and get a personalized AI summary in minutes — tailored to your goals, experience, and the way you learn.
            </p>

            {/* CTAs */}
            <div className="c-fade-up c-d4" style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              {loggedIn ? (
                <a href="/dashboard" className="c-btn-primary">
                  Go to your library {bookCount > 0 ? `(${bookCount} book${bookCount !== 1 ? 's' : ''})` : ''} →
                </a>
              ) : (
                <a href="/login" className="c-btn-primary">Start Reading Smarter →</a>
              )}
              <a href="#how" className="c-btn-ghost">See how it works</a>
            </div>

            {/* Trust line */}
            <p className="c-fade-up c-d4" style={{ fontSize: '0.8125rem', color: 'var(--c-muted)' }}>
              No credit card required · 10 free summaries/month · Powered by Claude AI
            </p>

            {/* Hero card mockup */}
            <div className="c-fade-up c-d5" style={{ marginTop: '4rem' }}>
              <div style={{
                backgroundColor: 'var(--c-surface)', border: '1px solid var(--c-border)',
                borderRadius: '1.5rem', padding: '1.75rem', textAlign: 'left',
                boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
                maxWidth: 560, margin: '0 auto',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: 38, height: 38, backgroundColor: 'var(--c-surface2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', flexShrink: 0 }}>
                    📚
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--c-text)' }}>Atomic Habits</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--c-muted)' }}>James Clear · Executive Summary</div>
                  </div>
                  <div style={{ marginLeft: 'auto', flexShrink: 0, fontSize: '0.75rem', color: 'var(--c-accent)', fontWeight: 600, border: '1px solid rgba(201,150,58,0.3)', padding: '0.25rem 0.625rem', borderRadius: 100, backgroundColor: 'var(--c-accent-dim)' }}>
                    ⚡ Ready
                  </div>
                </div>
                {[
                  { label: 'Core Insight', text: "You don't rise to the level of your goals, you fall to the level of your systems." },
                  { label: 'Key Framework', text: 'The 4 Laws of Behavior Change: Make it obvious, attractive, easy, and satisfying.' },
                  { label: 'First Action', text: "Identify which of the 4 laws you're violating for your most important habit today." },
                ].map((row, i) => (
                  <div key={i} style={{ borderTop: '1px solid var(--c-border)', paddingTop: '1rem', marginTop: '1rem' }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--c-accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.325rem' }}>
                      {row.label}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--c-text)', lineHeight: 1.65, opacity: 0.82 }}>
                      {row.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── STATS ─── */}
        <section style={{ borderTop: '1px solid var(--c-border)', borderBottom: '1px solid var(--c-border)', padding: '2.25rem 1.5rem' }}>
          <div style={{
            maxWidth: 900, margin: '0 auto',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '1.5rem', textAlign: 'center',
          }}>
            {[
              { num: '2–3 min', sub: 'per summary' },
              { num: '3', sub: 'summary styles' },
              { num: '100%', sub: 'free to start' },
              { num: 'Claude AI', sub: 'powered by' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.75rem', fontWeight: 700, color: 'var(--c-text)', letterSpacing: '-0.02em' }}>
                  {s.num}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--c-muted)', marginTop: '0.25rem' }}>
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section id="how" style={{ padding: '6rem 1.5rem' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--c-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                How it works
              </p>
              <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.15, color: 'var(--c-text)' }}>
                From PDF to insight<br />in three steps
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {[
                { n: '01', icon: '↑', title: 'Upload your PDF', desc: 'Drag and drop any book, paper, or document. We extract the text and get to work.' },
                { n: '02', icon: '◎', title: 'Tell us about you', desc: 'Answer 3 quick questions about your goals, experience, and focus. This shapes every summary.' },
                { n: '03', icon: '✓', title: 'Choose your style', desc: 'Get your personalized summary in executive, deep study, or action-plan format — or all three.' },
              ].map((step, i) => (
                <div key={i} className="c-card" style={{ padding: '2rem' }}>
                  <div style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--c-accent)', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
                    {step.n}
                  </div>
                  <div style={{ fontSize: '2rem', lineHeight: 1, marginBottom: '1.125rem', color: 'var(--c-accent)' }}>
                    {step.icon}
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.625rem', color: 'var(--c-text)' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--c-muted)', lineHeight: 1.65 }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── STYLES SHOWCASE ─── */}
        <section style={{ backgroundColor: 'var(--c-surface)', padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--c-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Three modes
              </p>
              <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.15, color: 'var(--c-text)', marginBottom: '1rem' }}>
                One book, three perspectives
              </h2>
              <p style={{ color: 'var(--c-muted)', fontSize: '1rem', maxWidth: 440, margin: '0 auto' }}>
                Different goals need different summaries. Switch between styles anytime.
              </p>
            </div>

            {/* Tab buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
              {(['Executive', 'Study', 'Action'] as StyleTab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`c-tab${tab === t ? ' active' : ''}`}
                >
                  {SHOWCASE[t].icon} {t}
                </button>
              ))}
            </div>

            {/* Content panel */}
            <div style={{
              backgroundColor: 'var(--c-bg)', border: '1px solid var(--c-border)',
              borderRadius: '1.25rem', padding: '2rem',
              boxShadow: '0 8px 48px rgba(0,0,0,0.4)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.375rem' }}>{showcase.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--c-text)', fontSize: '1rem' }}>{showcase.label}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--c-muted)' }}>{showcase.desc}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--c-muted)', fontFamily: 'var(--font-geist-mono), monospace' }}>
                  Atomic Habits — James Clear
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {showcase.content.map((item, i) => (
                  <div key={i} style={{ borderLeft: '2px solid var(--c-accent)', paddingLeft: '1.125rem' }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--c-accent)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                      {item.h}
                    </div>
                    <div style={{ fontSize: '0.9375rem', color: 'var(--c-text)', lineHeight: 1.7, opacity: 0.82, whiteSpace: 'pre-line' }}>
                      {item.p}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── FEATURES ─── */}
        <section style={{ padding: '6rem 1.5rem' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--c-text)' }}>
                Built for serious readers
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {[
                { icon: '🎯', title: 'Truly personalized', desc: 'Your goals, experience, and focus area shape every summary. No two users get the same output.' },
                { icon: '⚡', title: 'Fast. Really fast.', desc: 'Most summaries complete in under 3 minutes. Not the 10 hours the book would have taken.' },
                { icon: '📤', title: 'Export anywhere', desc: 'Download as Markdown or print to PDF with one click. Your summaries, your format.' },
                { icon: '🤖', title: 'Powered by Claude AI', desc: "Anthropic's most capable model for nuanced, accurate, genuinely useful summaries." },
                { icon: '🔄', title: 'All styles, one upload', desc: 'Upload once, generate Executive, Study, and Action summaries anytime — independently.' },
                { icon: '🔒', title: 'Private by design', desc: "Your books are yours. We don't train on your data, and you can delete everything." },
              ].map((feat, i) => (
                <div key={i} className="c-card" style={{ padding: '1.75rem' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.875rem' }}>{feat.icon}</div>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--c-text)' }}>{feat.title}</h3>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--c-muted)', lineHeight: 1.65 }}>{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PRICING ─── */}
        <section id="pricing" style={{ padding: '2rem 1.5rem 6rem', backgroundColor: 'var(--c-surface)' }}>
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--c-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Pricing
            </p>
            <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--c-text)', marginBottom: '3rem' }}>
              Start free.<br />No catches.
            </h2>

            <div style={{
              backgroundColor: 'var(--c-bg)', border: '1px solid var(--c-accent)',
              borderRadius: '1.5rem', padding: '2.5rem', textAlign: 'left',
              boxShadow: '0 0 80px rgba(201,150,58,0.07)',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.625rem', marginBottom: '0.375rem' }}>
                <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '3rem', fontWeight: 900, color: 'var(--c-text)', letterSpacing: '-0.03em' }}>
                  Free
                </span>
                <span style={{ color: 'var(--c-muted)', fontSize: '1rem' }}>forever</span>
              </div>
              <p style={{ color: 'var(--c-muted)', marginBottom: '2rem', fontSize: '0.9375rem' }}>
                Everything you need to start reading smarter
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem' }}>
                {[
                  '10 AI summaries per month',
                  'All 3 summary styles',
                  'Personalization questionnaire',
                  'Markdown & PDF export',
                  'Delete books anytime',
                  'Powered by Claude AI',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9375rem', color: 'var(--c-text)', alignItems: 'flex-start' }}>
                    <span className="c-check">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <a href="/login" className="c-btn-primary" style={{ display: 'block', textAlign: 'center', boxSizing: 'border-box', width: '100%', fontSize: '1.0625rem', padding: '1rem 2rem' }}>
                Get Started — Free
              </a>
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section style={{
          padding: '7rem 1.5rem', textAlign: 'center',
          background: 'radial-gradient(ellipse at center, rgba(201,150,58,0.07) 0%, transparent 65%)',
          borderTop: '1px solid var(--c-border)',
        }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 900,
              letterSpacing: '-0.03em', lineHeight: 1.05,
              marginBottom: '1.5rem', color: 'var(--c-text)',
            }}>
              Your next great read,<br />
              <span className="c-shimmer-text">already digested.</span>
            </h2>
            <p style={{ color: 'var(--c-muted)', fontSize: '1.125rem', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 2.5rem' }}>
              Stop spending 10 hours on books you'll forget. Get the key insights in minutes, in the format that works for you.
            </p>
            <a href="/login" className="c-btn-primary" style={{ fontSize: '1.125rem', padding: '1.0625rem 2.5rem' }}>
              Start Reading Smarter →
            </a>
            <p style={{ marginTop: '1.25rem', fontSize: '0.8125rem', color: 'var(--c-muted)' }}>
              No credit card · 10 summaries free · Cancel anytime
            </p>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer style={{ borderTop: '1px solid var(--c-border)', padding: '2rem 1.5rem' }}>
          <div style={{
            maxWidth: 1120, margin: '0 auto',
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
          }}>
            <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1rem', fontWeight: 700, color: 'var(--c-text)' }}>
              Book<span style={{ color: 'var(--c-accent)' }}>Digest</span>
            </span>
            <p style={{ fontSize: '0.8125rem', color: 'var(--c-muted)' }}>
              © 2026 BookDigest · Built with Claude AI
            </p>
            <a href="/login" className="c-nav-link" style={{ fontSize: '0.8125rem' }}>
              Sign In →
            </a>
          </div>
        </footer>
      </div>
    </>
  )
}
