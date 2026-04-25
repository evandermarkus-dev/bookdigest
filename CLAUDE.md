# BookDigest — CLAUDE.md

## Commands

```bash
npm run dev      # Dev server → http://localhost:3001 (port 3001, ej 3000!)
npm run build    # Production build
npm run lint     # ESLint
npx tsc --noEmit # Type-check utan build
```

## Architecture

Next.js 16.1.6 (App Router, Turbopack) · Supabase Auth/DB/Storage · Claude AI · Stripe

```
app/
  dashboard/        # Main authenticated view (force-dynamic)
  api/
    summarize/      # PDF → Claude → DB (core flow)
    audio/[id]/     # Claude script → OpenAI TTS → Storage cache
    chat/summary/   # Per-summary chat with Claude
    stripe/         # checkout, portal, success, webhook
    delete-book/    # DELETE via URL param (not body)
    share/          # Public share tokens
components/
  BookCard.tsx      # Tab UI, export, delete, AI chat, audio player
  PdfUpload.tsx     # idle→uploading→questionnaire→style→summarizing
lib/
  config.ts         # ALL constants (limits, bucket name, tier rules)
  prompts.ts        # getSystemPrompt(), detectLanguageFromContent(), FREE_LIMIT
  supabase.ts       # Browser client
  supabase-server.ts # Server client (@supabase/ssr)
  supabase-admin.ts  # Service-role client (bypasses RLS)
proxy.ts            # Auth middleware — export MUST be named `proxy` (not `middleware`)
```

## Tiers

`free` → 3 summaries/month, executive style only
`reader` → 20/month, all styles, AI audio
`pro` → unlimited, all features
Stored in `user_profiles.tier` (Supabase DB)

## Key Gotchas

**proxy.ts — not middleware.ts**
Next.js 16 requires the export function to be named `proxy`, file is `proxy.ts`.
Using `middleware.ts` or `export default` breaks auth silently.

**pdfjs-dist worker**
Worker loaded via `file://` URL at runtime — Vercel tracer misses it.
Fix is in `next.config.ts`: `outputFileTracingIncludes` for `/api/summarize`.
Never remove this or PDF parsing breaks on Vercel.

**DOMMatrix polyfill**
`pdfjs-dist` accesses `DOMMatrix` at module load time. Call `polyfillDOMMatrix()`
from `lib/dommatrix-polyfill.ts` before `await import('pdf-parse')`. Node ≥20 required.

**Supabase Storage RLS**
User-auth client requires `{user_id}/` path prefix in the Books bucket.
Audio cache files (`audio/{summaryId}.mp3`) use `supabase-admin.ts` to bypass RLS.
Never switch audio routes back to the user client.

**DELETE route**
Use URL query params (`?filePath=...`), NOT request body.
Next.js App Router drops the body on DELETE requests unreliably.

**dashboard/page.tsx**
Must have `export const dynamic = 'force-dynamic'` (not `unstable_noStore`).

## Environment Variables

See `.env.example` for all required vars. Key ones:
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase project
- `SUPABASE_SERVICE_ROLE_KEY` — admin client (never expose to browser)
- `ANTHROPIC_API_KEY` — Claude (summarize + chat + audio script)
- `OPENAI_API_KEY` — TTS audio narration (Reader/Pro only)
- `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` — billing
- `STRIPE_READER_PRICE_ID` + `STRIPE_PRO_PRICE_ID` — Stripe product price IDs

Supabase project ref: `mzssenuirgmcgnbjvibd`
Google OAuth configured for: `http://localhost:3001` (not 3000)

## Stripe Local Dev

```bash
stripe listen --forward-to localhost:3001/api/stripe/webhook
# Copy the whsec_... value → STRIPE_WEBHOOK_SECRET in .env.local
```

## Supabase CLI

Binary: `C:/Users/Markus/supabase.exe` (v2.22.6)
Management API: `POST https://api.supabase.com/v1/projects/mzssenuirgmcgnbjvibd/database/query`
