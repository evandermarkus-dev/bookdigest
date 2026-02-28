import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase-admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// ---------------------------------------------------------------------------
// resolveTier
// Givet ett aktivt Stripe-abonnemang — vilken tier ska användaren ha?
//
// TODO: Implementera denna funktion (se instruktioner i chatten)
// ---------------------------------------------------------------------------
function resolveTier(
  subscription: Stripe.Subscription,
  readerPriceId: string,
  proPriceId: string
): 'free' | 'reader' | 'pro' {
  const activeStatuses = ['active', 'trialing', 'past_due']
  if (!activeStatuses.includes(subscription.status)) return 'free'

  const priceId = subscription.items.data[0]?.price.id
  if (priceId === readerPriceId) return 'reader'
  if (priceId === proPriceId) return 'pro'
  return 'free'
}

// ---------------------------------------------------------------------------
// POST /api/stripe/webhook
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      // ── 1. Checkout slutförd (backup för success-routen) ──────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.payment_status !== 'paid') break

        const userId = session.metadata?.supabase_user_id
        const tier = (session.metadata?.tier as 'reader' | 'pro') ?? 'pro'
        const customerId =
          typeof session.customer === 'string'
            ? session.customer
            : session.customer?.id

        if (userId) {
          await supabase.from('user_profiles').upsert(
            {
              user_id: userId,
              tier,
              is_pro: tier === 'pro',
              stripe_customer_id: customerId ?? null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          )
          console.log(`[webhook] checkout.session.completed → ${tier} for user ${userId}`)
        }
        break
      }

      // ── 2. Abonnemang uppdaterat (uppgradering / nedgradering / avslut) ───
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : (subscription.customer as Stripe.Customer).id

        const tier = resolveTier(
          subscription,
          process.env.STRIPE_READER_PRICE_ID!,
          process.env.STRIPE_PRO_PRICE_ID!
        )

        await supabase
          .from('user_profiles')
          .update({
            tier,
            is_pro: tier === 'pro',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId)

        console.log(`[webhook] subscription.updated → ${tier} for customer ${customerId}`)
        break
      }

      // ── 3. Abonnemang avslutat (nedgradera till free) ─────────────────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : (subscription.customer as Stripe.Customer).id

        await supabase
          .from('user_profiles')
          .update({
            tier: 'free',
            is_pro: false,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId)

        console.log(`[webhook] subscription.deleted → free for customer ${customerId}`)
        break
      }

      default:
        // Ignorera okända events — returnera ändå 200 så Stripe inte retryar
        break
    }
  } catch (err) {
    console.error('[webhook] Handler error:', err)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
