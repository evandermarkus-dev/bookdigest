import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const { searchParams, origin } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.redirect(`${origin}/dashboard?error=missing_session`)
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.redirect(`${origin}/dashboard?error=payment_incomplete`)
    }

    const userId = session.metadata?.supabase_user_id
    const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id

    if (userId) {
      const supabase = await createClient()
      await supabase
        .from('user_profiles')
        .upsert(
          { user_id: userId, is_pro: true, stripe_customer_id: customerId ?? null, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        )
    }

    return NextResponse.redirect(`${origin}/dashboard?upgraded=1`)
  } catch {
    return NextResponse.redirect(`${origin}/dashboard?error=verification_failed`)
  }
}
