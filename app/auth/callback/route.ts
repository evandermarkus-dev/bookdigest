import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { sendWelcomeEmail } from '@/lib/email'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        const createdAt = new Date(user.created_at).getTime()
        const isNewUser = Date.now() - createdAt < 60_000
        if (isNewUser) {
          sendWelcomeEmail(user.email) // fire-and-forget
          // Redirect new users to Saga onboarding instead of dashboard
          return NextResponse.redirect(`${origin}/onboarding`)
        }
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
