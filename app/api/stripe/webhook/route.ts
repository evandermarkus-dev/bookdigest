import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase-server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Stripe requires the raw body for webhook signature verification
export const config = { api: { bodyParser: false } }

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
  } else {
    // Dev fallback: parse without signature verification
    event = JSON.parse(body) as Stripe.Event
  }

  const supabase = await createClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.supabase_user_id
    const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id

    if (userId) {
      await supabase
        .from('user_profiles')
        .upsert(
          { user_id: userId, is_pro: true, stripe_customer_id: customerId ?? null, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        )
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single()

    if (profile) {
      await supabase
        .from('user_profiles')
        .update({ is_pro: false, updated_at: new Date().toISOString() })
        .eq('user_id', profile.user_id)
    }
  }

  return NextResponse.json({ received: true })
}
