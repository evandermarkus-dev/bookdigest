import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import PricingClient, { type Tier } from '@/components/PricingClient'

export const dynamic = 'force-dynamic'

export default async function PricingPage() {
  // Fetch the current user's tier (null = unauthenticated = treat as free)
  let currentTier: Tier = 'free'
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('tier')
        .eq('user_id', user.id)
        .single()
      if (profile?.tier) currentTier = profile.tier as Tier
    }
  } catch {
    // unauthenticated or DB error — default to 'free'
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

        {/* Plan cards — client component handles interactivity */}
        <PricingClient currentTier={currentTier} />

        <p className="text-center text-xs mt-8" style={{ color: 'var(--app-muted)' }}>
          Betala månadsvis. Avsluta när som helst via inställningarna.
        </p>
      </div>
    </main>
  )
}
