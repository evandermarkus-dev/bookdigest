'use client'

import { useState } from 'react'
import Link from 'next/link'

const PLANS = [
  {
    tier: 'free' as const,
    name: 'Free',
    price: '0',
    period: '',
    description: 'Prova BookDigest utan kostnad.',
    features: [
      '3 sammanfattningar / månad',
      '1 sammanfattningsstil',
      'Sidcitat (p.N-märken)',
    ],
    cta: 'Ditt nuvarande plan',
    disabled: true,
    highlight: false,
  },
  {
    tier: 'reader' as const,
    name: 'Reader',
    price: '79',
    period: '/ mån',
    description: 'För den som läser regelbundet.',
    features: [
      '20 sammanfattningar / månad',
      'Alla 3 sammanfattningsstilar',
      'Readwise-export',
      'Sidcitat (p.N-märken)',
    ],
    cta: 'Välj Reader',
    disabled: false,
    highlight: false,
  },
  {
    tier: 'pro' as const,
    name: 'Pro',
    price: '149',
    period: '/ mån',
    description: 'Obegränsat för power-läsare.',
    features: [
      'Obegränsade sammanfattningar',
      'Alla 3 sammanfattningsstilar',
      'Readwise-export',
      'Sidcitat (p.N-märken)',
      'Prioriterad support',
    ],
    cta: 'Välj Pro',
    disabled: false,
    highlight: true,
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<'reader' | 'pro' | null>(null)

  async function startCheckout(tier: 'reader' | 'pro') {
    setLoading(tier)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      })
      if (res.status === 401) {
        window.location.href = '/login'
        return
      }
      const { url } = await res.json()
      if (url) window.location.href = url
    } finally {
      setLoading(null)
    }
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--app-bg)' }}>
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/dashboard"
            className="inline-block mb-8 text-sm"
            style={{ color: 'var(--app-muted)' }}
          >
            ← Tillbaka till dashboard
          </Link>
          <h1
            className="text-4xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif', color: 'var(--app-text)' }}
          >
            Välj ditt plan
          </h1>
          <p className="text-base" style={{ color: 'var(--app-muted)' }}>
            Alla planer inkluderar PDF-uppladdning, AI-sammanfattningar och sidcitat.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan) => (
            <div
              key={plan.tier}
              className="rounded-2xl p-6 flex flex-col"
              style={{
                background: plan.highlight ? 'var(--app-accent-dim)' : 'var(--app-surface)',
                border: plan.highlight
                  ? '2px solid rgba(201,150,58,0.5)'
                  : '1px solid var(--app-border)',
              }}
            >
              {plan.highlight && (
                <span
                  className="self-start mb-3 px-2.5 py-0.5 text-xs font-semibold rounded-full"
                  style={{ background: 'var(--app-accent)', color: '#1a0f00' }}
                >
                  Populärast
                </span>
              )}

              <h2
                className="text-lg font-bold mb-1"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif', color: 'var(--app-text)' }}
              >
                {plan.name}
              </h2>

              <div className="flex items-baseline gap-1 mb-2">
                <span
                  className="text-3xl font-bold"
                  style={{ color: 'var(--app-text)' }}
                >
                  {plan.price} kr
                </span>
                {plan.period && (
                  <span className="text-sm" style={{ color: 'var(--app-muted)' }}>
                    {plan.period}
                  </span>
                )}
              </div>

              <p className="text-sm mb-5" style={{ color: 'var(--app-muted)' }}>
                {plan.description}
              </p>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm" style={{ color: 'var(--app-text)' }}>
                    <span style={{ color: 'var(--app-accent)' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {plan.tier === 'free' ? (
                <button
                  disabled
                  className="w-full py-2.5 text-sm font-medium rounded-xl opacity-40 cursor-not-allowed"
                  style={{ border: '1px solid var(--app-border)', color: 'var(--app-muted)' }}
                >
                  {plan.cta}
                </button>
              ) : (
                <button
                  onClick={() => startCheckout(plan.tier as 'reader' | 'pro')}
                  disabled={loading !== null}
                  className="w-full py-2.5 text-sm font-medium rounded-xl transition-colors disabled:opacity-60"
                  style={
                    plan.highlight
                      ? { background: 'var(--app-accent)', color: '#1a0f00' }
                      : { border: '1px solid var(--app-border)', color: 'var(--app-text)', background: 'transparent' }
                  }
                >
                  {loading === plan.tier ? 'Laddar…' : plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-xs mt-8" style={{ color: 'var(--app-muted)' }}>
          Betala månadsvis. Avsluta när som helst via inställningarna.
        </p>
      </div>
    </main>
  )
}
