'use client'

import { useState } from 'react'
import Link from 'next/link'

export type Tier = 'free' | 'reader' | 'pro'

interface Props {
  currentTier: Tier
}

const TIER_ORDER: Record<Tier, number> = { free: 0, reader: 1, pro: 2 }

const PLANS = [
  {
    tier: 'free' as Tier,
    name: 'Free',
    price: '0',
    period: '',
    description: 'Prova BookDigest utan kostnad.',
    features: [
      '3 sammanfattningar / månad',
      '1 sammanfattningsstil',
      'Sidcitat (p.N-märken)',
      'Readwise-export',
    ],
    highlight: false,
  },
  {
    tier: 'reader' as Tier,
    name: 'Reader',
    price: '79',
    period: '/ mån',
    description: 'För den som läser regelbundet.',
    features: [
      '20 sammanfattningar / månad',
      'Alla 3 sammanfattningsstilar',
      'AI-ljudberättelse',
      'Readwise-export',
      'Sidcitat (p.N-märken)',
    ],
    highlight: false,
  },
  {
    tier: 'pro' as Tier,
    name: 'Pro',
    price: '149',
    period: '/ mån',
    description: 'Obegränsat för power-läsare.',
    features: [
      'Obegränsade sammanfattningar',
      'Alla 3 sammanfattningsstilar',
      'AI-ljudberättelse',
      'Readwise-export',
      'Sidcitat (p.N-märken)',
      'Prioriterad support',
    ],
    highlight: true,
  },
]

function getPlanCta(
  planTier: Tier,
  currentTier: Tier
): { label: string; type: 'current' | 'upgrade' | 'manage' } {
  if (planTier === currentTier) {
    return { label: 'Ditt nuvarande plan', type: 'current' }
  }
  if (TIER_ORDER[planTier] > TIER_ORDER[currentTier]) {
    return {
      label: planTier === 'pro' ? 'Uppgradera till Pro →' : 'Uppgradera till Reader →',
      type: 'upgrade',
    }
  }
  return { label: 'Hantera abonnemang →', type: 'manage' }
}

export default function PricingClient({ currentTier }: Props) {
  const [loading, setLoading] = useState<Tier | null>(null)

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {PLANS.map((plan) => {
        const cta = getPlanCta(plan.tier, currentTier)
        const isCurrent = cta.type === 'current'
        const isHighlighted = plan.highlight && !isCurrent

        return (
          <div
            key={plan.tier}
            className="rounded-2xl p-6 flex flex-col relative"
            style={{
              background: isHighlighted ? 'var(--app-accent-dim)' : 'var(--app-surface)',
              border: isCurrent
                ? '2px solid rgba(201,150,58,0.8)'
                : isHighlighted
                ? '2px solid rgba(201,150,58,0.5)'
                : '1px solid var(--app-border)',
            }}
          >
            {/* Badges */}
            <div className="flex gap-2 mb-3 min-h-[24px]">
              {isCurrent && (
                <span
                  className="px-2.5 py-0.5 text-xs font-semibold rounded-full"
                  style={{ background: 'rgba(201,150,58,0.2)', color: 'var(--app-accent)' }}
                >
                  Ditt plan
                </span>
              )}
              {plan.highlight && !isCurrent && (
                <span
                  className="px-2.5 py-0.5 text-xs font-semibold rounded-full"
                  style={{ background: 'var(--app-accent)', color: '#1a0f00' }}
                >
                  Populärast
                </span>
              )}
            </div>

            <h2
              className="text-lg font-bold mb-1"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif', color: 'var(--app-text)' }}
            >
              {plan.name}
            </h2>

            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-bold" style={{ color: 'var(--app-text)' }}>
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

            {/* CTA button */}
            {cta.type === 'current' && (
              <button
                disabled
                className="w-full py-2.5 text-sm font-medium rounded-xl opacity-50 cursor-not-allowed"
                style={{ border: '1px solid var(--app-border)', color: 'var(--app-muted)' }}
              >
                {cta.label}
              </button>
            )}

            {cta.type === 'upgrade' && (
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
                {loading === plan.tier ? 'Laddar…' : cta.label}
              </button>
            )}

            {cta.type === 'manage' && (
              <Link
                href="/settings"
                className="w-full py-2.5 text-sm font-medium rounded-xl text-center transition-colors block"
                style={{ border: '1px solid var(--app-border)', color: 'var(--app-muted)', background: 'transparent' }}
              >
                {cta.label}
              </Link>
            )}
          </div>
        )
      })}
    </div>
  )
}
