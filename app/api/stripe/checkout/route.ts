import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const tier: 'reader' | 'pro' = body.tier === 'reader' ? 'reader' : 'pro'

  const priceId = tier === 'reader'
    ? process.env.STRIPE_READER_PRICE_ID!
    : process.env.STRIPE_PRO_PRICE_ID!

  if (!priceId) {
    console.error(`[stripe] Missing price ID for tier: ${tier}`)
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'

  // Reuse existing Stripe customer if available
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id ?? undefined

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/dashboard`,
    metadata: { supabase_user_id: user.id, tier },
  })

  return NextResponse.json({ url: session.url })
}
