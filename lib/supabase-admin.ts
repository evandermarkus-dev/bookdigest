import { createClient } from '@supabase/supabase-js'

/**
 * Service-role client — kringgår RLS.
 * Använd BARA i server-side kod som körs utanför auth-kontext
 * (webhooks, bakgrundsjobb). Exponera aldrig nyckeln mot klienten.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
