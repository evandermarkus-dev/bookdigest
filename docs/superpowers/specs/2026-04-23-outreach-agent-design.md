# BookDigest Outreach Agent — Design Spec
**Date:** 2026-04-23  
**Status:** Approved

---

## Goal

A standalone Python CLI tool that searches Reddit for potential BookDigest customers, generates personalized outreach message drafts via Claude, and lets the user approve/edit/skip each lead before saving to a queue file.

---

## Scope

- **Platforms:** Reddit only (free API, best audience fit)
- **Flow:** Semi-automatic — agent finds leads and writes drafts, user approves per lead
- **Delivery:** User copies approved messages manually from `outreach-queue.md` and sends as Reddit DMs
- **Offer:** 7 days free Reader access in exchange for feedback

---

## File Structure

```
outreach/
  outreach.py          # Main CLI entrypoint
  config.py            # Subreddits, search terms, BookDigest description
  reddit_search.py     # PRAW integration + lead filtering
  message_generator.py # Claude API → personalized outreach draft
  outreach-queue.md    # Output: approved leads + messages
  contacted.json       # Tracks already-contacted usernames (auto-updated)
  .env                 # Credentials (never committed)
  requirements.txt
```

---

## Reddit Search

**Subreddits:**
```python
SUBREDDITS = ["52book", "GradSchool", "productivity",
               "selfimprovement", "books", "mobileread"]
```

**Search terms:**
```python
SEARCH_TERMS = [
    "too many books", "can't finish", "reading list",
    "PDF book", "book summary", "summarize book",
    "don't have time to read", "too many PDFs"
]
```

Searches both posts and comments. Returns up to 50 results per term, sorted by recency.

**Automatic filters (discard lead if):**
- Post/comment older than 30 days
- Author karma < 10 or account age < 30 days
- Username already in `contacted.json`
- Username contains "bot" or "auto"

**Lead object passed to Claude:**
```python
{
  "author": "u/username",
  "subreddit": "r/GradSchool",
  "text": "I have 15 PDFs assigned this semester...",
  "url": "https://reddit.com/...",
  "score": 42
}
```

---

## Message Generation

Claude receives the lead object + a BookDigest description and generates a Reddit DM draft that:
- References what the person specifically wrote (not a generic template)
- Is 3–4 sentences max, conversational, non-salesy
- Offers 7 days free Reader access in exchange for honest feedback
- Does not mention it is AI-generated

**System prompt summary:**
> You are writing a short, genuine Reddit DM on behalf of the founder of BookDigest — an AI-powered PDF book summarizer. The message should feel personal and reference the specific thing the recipient wrote. Offer 7 days of free Reader access. Max 4 sentences. No marketing language.

---

## CLI Interaction Flow

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lead 3/12 · r/GradSchool · u/thesis_survivor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"I have 15 PDFs assigned this semester and no time to read them all..."
https://reddit.com/r/GradSchool/comments/...

📝 Förslag på meddelande:
──────────────────────────────────────────
Saw your post about the PDF overload this semester — I built
BookDigest exactly for that. Upload any PDF, get a structured
AI summary in 2 minutes. Happy to give you 7 days of free Reader
access if you want to try it out and share any feedback.
──────────────────────────────────────────
[y] Spara  [n] Hoppa  [e] Redigera  [q] Avsluta
>
```

On `e` (edit): user types a replacement message inline before saving.

---

## Output — `outreach-queue.md`

```markdown
## u/thesis_survivor · r/GradSchool
**URL:** https://reddit.com/...
**Datum:** 2026-04-23

Saw your post about the PDF overload this semester — I built
BookDigest exactly for that. Upload any PDF, get a structured
AI summary in 2 minutes. Happy to give you 7 days of free Reader
access if you want to try it out and share any feedback.

Status: [ ] Skickat

---
```

User manually sends each message via Reddit DMs and checks off the status box.

---

## Deduplication

`contacted.json` stores approved usernames. On each run, any username already in this file is skipped automatically — prevents double-outreach even across multiple runs.

```json
["thesis_survivor", "busy_reader_42", "phd_2026"]
```

---

## Cost Estimate

**Per run (approx 10–20 leads):**
- Claude API: ~$0.01–0.02 per message draft (short output)
- Total per run: <$0.30

**Free Reader access cost (per granted user):**
- Claude summarization: ~$2/month → ~$0.50 for 7 days
- OpenAI TTS audio (if used): ~$0.05–0.15
- **Total per outreach recipient: ~$0.65–0.70**

Recommended max: 20–30 free accounts active at any time (~$15–20/week in API costs).

---

## Dependencies

```
praw>=7.7
anthropic>=0.25
python-dotenv>=1.0
rich>=13.0
```

## Environment Variables

```
REDDIT_CLIENT_ID=...
REDDIT_CLIENT_SECRET=...
REDDIT_USER_AGENT=BookDigest Outreach Bot/1.0
ANTHROPIC_API_KEY=...
```

Reddit app: create at reddit.com/prefs/apps as "script" type.

---

## What Is Out of Scope

- Automatic sending of messages (by design — user approval required)
- Twitter/X or LinkedIn search (API costs/restrictions)
- Scheduling or cron automation
- Built-in Reader account provisioning (user grants manually via Supabase dashboard)
