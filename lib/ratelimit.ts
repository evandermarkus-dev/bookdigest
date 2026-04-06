import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { READER_SKILL_LIMIT } from '@/lib/config'

// ---------------------------------------------------------------------------
// Rate limiting via Upstash Redis.
// Silently skips if env vars are missing (local dev without Redis configured).
// ---------------------------------------------------------------------------

function makeRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

function makeLimiter(redis: Redis, requests: number, window: `${number} ${'s' | 'm' | 'h' | 'd'}`, prefix: string) {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    prefix: `rl:${prefix}`,
    // Cache allows/denies in memory between requests in the same Lambda instance
    ephemeralCache: new Map(),
  })
}

const redis = makeRedis()

// Per-route limiters (keyed by user ID)
export const limiters = redis ? {
  summarize: makeLimiter(redis, 10, '1 h',  'summarize'), // Claude + PDF — most expensive
  chat:      makeLimiter(redis, 30, '1 h',  'chat'),      // Claude Haiku chat messages
  audio:     makeLimiter(redis, 5,  '1 h',  'audio'),     // Claude script + OpenAI TTS
  skill:     makeLimiter(redis, READER_SKILL_LIMIT, '30 d', 'skill'), // Claude Code skill generation
} : null

// ---------------------------------------------------------------------------
// Helper: run limit check and return a 429 response if exceeded.
// Returns null if allowed (or if Redis is unconfigured).
// ---------------------------------------------------------------------------
type LimiterKey = keyof NonNullable<typeof limiters>

export async function checkRateLimit(
  route: LimiterKey,
  userId: string
): Promise<NextResponse | null> {
  if (!limiters) return null // Redis not configured — skip silently

  const { success, limit, remaining, reset } = await limiters[route].limit(userId)

  if (!success) {
    const retryAfterSec = Math.ceil((reset - Date.now()) / 1000)
    return NextResponse.json(
      { error: `Too many requests. Try again in ${Math.ceil(retryAfterSec / 60)} minute(s).` },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfterSec),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(reset),
        },
      }
    )
  }

  return null // allowed
}
