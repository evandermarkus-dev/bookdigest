# Outreach Agent Expansion — Design Spec
**Date:** 2026-04-25
**Status:** Approved

---

## Goal

Extend the existing outreach agent (`outreach/`) with two new platforms (Hacker News + expanded Reddit), and add a standalone HTML dashboard generator that shows key outreach statistics.

---

## Scope

- **New platforms:** Hacker News (Algolia API, free/no auth) + Reddit expansion (more subreddits)
- **Architecture:** Platform adapter pattern — one module per platform, shared `Lead` dataclass
- **Dashboard:** `generate_dashboard.py` reads local files → writes `dashboard.html` → opens in browser
- **Dashboard content:** Oversiktstatistik only — total contacted, this week, unsent queue count, approval rate, platform breakdown, recent unsent leads list
- **Delivery:** User still copies and sends messages manually; dashboard is local read-only

---

## File Structure

```
outreach/
  platforms/
    __init__.py
    base.py              # Lead dataclass
    reddit.py            # Moved from reddit_search.py — same logic, Lead output
    hn.py                # New: Algolia HN search
  config.py              # Expanded: more subreddits, HN search terms
  message_generator.py   # Unchanged
  outreach.py            # Updated: accepts List[Lead] instead of List[dict]
  run.py                 # New orchestrator: all platforms → shared review loop
  generate_dashboard.py  # New: reads contacted.json + outreach-queue.md → dashboard.html
  tests/
    __init__.py
    test_reddit.py       # Renamed from test_reddit_search.py, updated imports
    test_hn.py           # New
    test_outreach.py     # Updated for Lead dataclass
    test_dashboard.py    # New
  outreach-queue.md      # Runtime output (unchanged format)
  contacted.json         # Extended format (see Data Model)
  .env
  .env.example
  requirements.txt
```

---

## Lead Dataclass (`platforms/base.py`)

```python
from dataclasses import dataclass

@dataclass
class Lead:
    author: str
    platform: str        # "reddit" | "hackernews"
    text: str
    url: str
    score: int
    subreddit: str | None = None  # Reddit only
```

Each platform adapter exposes a single function:
```python
def search(contacted: set[str]) -> list[Lead]: ...
```

---

## Platform Adapters

### Reddit (`platforms/reddit.py`)

Moved from `reddit_search.py` with minimal changes:
- All existing filtering logic unchanged (`is_recent`, `is_credible_author`, `is_bot`, `should_include`)
- `build_lead()` returns a `Lead` instead of `dict`
- `search()` replaces `search_reddit()` — same PRAW logic

**Expanded subreddits in `config.py`:**
```python
SUBREDDITS = [
    # Existing
    "52book", "GradSchool", "productivity",
    "selfimprovement", "books", "mobileread",
    # New
    "PhD", "academia", "AskAcademia",
    "learnprogramming", "kindle", "nosurf",
]
```

### Hacker News (`platforms/hn.py`)

Uses the free Algolia HN Search API — no credentials required.

**API endpoint:**
```
GET https://hn.algolia.com/api/v1/search_by_date
  ?query=<term>
  &tags=(story,comment)
  &numericFilters=created_at_i>{30_days_ago_unix},points>2
```

**Search terms (shared with Reddit via `config.py`):**
```python
HN_SEARCH_TERMS = [
    "too many books",
    "book summary",
    "summarize book",
    "PDF book",
    "reading list",
    "don't have time to read",
]
```

**Filtering rules:**
- Max 30 days old
- `points` > 2
- `author` does not contain "bot" or "auto"
- `author` not already in `contacted`
- Deduplicate by `objectID` across search terms

**Lead output:**
```python
Lead(
    author=hit["author"],
    platform="hackernews",
    text=hit.get("comment_text") or hit.get("title", "")[:500],
    url=f"https://news.ycombinator.com/item?id={hit['objectID']}",
    score=hit.get("points", 0),
    subreddit=None,
)
```

---

## Orchestrator (`run.py`)

```python
# Usage: cd outreach && python run.py
```

Flow:
1. Load `contacted.json`
2. Call `platforms.reddit.search(contacted)` (requires PRAW credentials)
3. Call `platforms.hn.search(contacted)` (no credentials needed)
4. Combine leads, shuffle for variety
5. Pass combined list to `run_interactive_review()`
6. After review loop: print summary of approved leads

Reddit credentials remain optional — if `REDDIT_CLIENT_ID` is missing, skip Reddit gracefully and run HN only.

---

## Data Model Change — `contacted.json`

**Current format (list of strings):**
```json
["thesis_survivor", "busy_reader_42"]
```

**New format (list of objects):**
```json
[
  {"username": "thesis_survivor", "platform": "reddit", "date": "2026-04-25"},
  {"username": "busy_reader_42", "platform": "reddit", "date": "2026-04-23"},
  {"username": "pdfoverload2026", "platform": "hackernews", "date": "2026-04-24"}
]
```

**Backward compatibility:** `load_contacted()` moves from `reddit_search.py` to `platforms/base.py` (shared utility). It detects the old format (list of strings) and migrates automatically on first read. After migration, the file is rewritten in the new format.

The deduplication set is still built from `username` field only — platform is metadata.

---

## Dashboard (`generate_dashboard.py`)

**Usage:**
```bash
cd outreach && python generate_dashboard.py
# Opens dashboard.html in default browser automatically
```

**Data sources:**
- `contacted.json` — total counts, platform breakdown, this week's activity
- `outreach-queue.md` — count of entries still marked `[ ] Skickat` (unsent)

**Stats shown:**
| Metric | Source |
|--------|--------|
| Totalt kontaktade | `len(contacted.json)` |
| Den här veckan | entries where `date >= today - 7 days` |
| Ej skickade | count of `[ ] Skickat` in outreach-queue.md |
| Godkännandegrad | approved / (approved + skipped) — tracked in a new `runs.json` (see below) |
| Plattformsfördelning | group contacted.json by `platform` |
| Senaste leads (ej skickade) | parse outreach-queue.md, show last 5 `[ ] Skickat` entries |

**Approval rate tracking (`runs.json`):**
`run.py` appends a summary after each review loop completes:
```json
[{"date": "2026-04-25", "found": 18, "approved": 7, "skipped": 11}]
```
`generate_dashboard.py` computes overall approval rate from this file. If the file is missing (first run), the stat is hidden.

**Output:** Single self-contained `dashboard.html` file with inline CSS/JS — no dependencies.

---

## New Environment Variables

No new variables required for HN (free API). Reddit credentials unchanged.

---

## What Is Out of Scope

- Automatic message sending
- Twitter/X, LinkedIn, Product Hunt search
- Web-based dashboard (Next.js integration)
- Reader account auto-provisioning
- Scheduling / cron automation
