/**
 * Central configuration for BookDigest.
 * All tuneable constants live here — no magic numbers scattered across routes.
 */

// ── Tiers ─────────────────────────────────────────────────────────────────────

export type Tier = 'free' | 'reader' | 'pro'

// ── Limits ────────────────────────────────────────────────────────────────────

/** Max summaries a Free user can generate per calendar month. */
export const FREE_MONTHLY_LIMIT = 3

/** Max summaries a Reader user can generate per calendar month. */
export const READER_MONTHLY_LIMIT = 20

/** Summary styles available on the Free tier. Reader and Pro get all styles. */
export const FREE_STYLES = ['executive'] as const
export type FreeStyle = typeof FREE_STYLES[number]

/** Returns the monthly summary limit for a tier, or null for unlimited (Pro). */
export function tierMonthlyLimit(tier: Tier): number | null {
  if (tier === 'pro') return null
  if (tier === 'reader') return READER_MONTHLY_LIMIT
  return FREE_MONTHLY_LIMIT
}

/** Max PDF size accepted for upload (bytes). */
export const MAX_PDF_SIZE_BYTES = 50 * 1024 * 1024 // 50 MB

/** Max characters extracted from a PDF before truncating (controls Claude context usage). */
export const MAX_PDF_CHARS = 80_000

/** Rate limiting: max summarize calls per window per user (best-effort, DB-based). */
export const RATE_LIMIT_COUNT = 5
export const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000 // 5 minutes

/** Chat: max messages sent to Claude per conversation turn. */
export const CHAT_MAX_HISTORY = 20

// ── Storage ───────────────────────────────────────────────────────────────────

/** Supabase storage bucket name (case-sensitive). */
export const STORAGE_BUCKET = 'Books'

// ── Signed URL TTL ────────────────────────────────────────────────────────────

/** Seconds a signed PDF download URL is valid. */
export const SIGNED_URL_TTL_SECONDS = 60
