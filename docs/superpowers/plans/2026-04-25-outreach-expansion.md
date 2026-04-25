# Outreach Agent Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the outreach agent with Hacker News search, expanded Reddit subreddits, a platform adapter architecture, and a standalone HTML dashboard generator.

**Architecture:** Introduce `platforms/` package with a shared `Lead` dataclass and one adapter per platform. `run.py` becomes the new multi-platform CLI entrypoint. `generate_dashboard.py` reads local files and produces a standalone `dashboard.html`. Existing `outreach.py` becomes a pure library (no `main()`).

**Tech Stack:** Python 3.10+, PRAW 7.7+, requests, Anthropic SDK, Rich, python-dotenv, pytest

**Spec:** `docs/superpowers/specs/2026-04-25-outreach-expansion-design.md`

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `outreach/platforms/__init__.py` | Package marker |
| Create | `outreach/platforms/base.py` | Lead dataclass, load_contacted, load_contacted_entries, add_to_contacted |
| Create | `outreach/platforms/reddit.py` | Reddit adapter (moved from reddit_search.py) |
| Create | `outreach/platforms/hn.py` | HN Algolia adapter |
| Modify | `outreach/config.py` | New subreddits + HN_SEARCH_TERMS |
| Modify | `outreach/outreach.py` | Accept Lead objects, remove main() |
| Create | `outreach/run.py` | Multi-platform CLI entrypoint |
| Create | `outreach/generate_dashboard.py` | HTML dashboard generator |
| Create | `outreach/tests/test_base.py` | Tests for base.py |
| Modify | `outreach/tests/test_reddit.py` | Rename + update imports (was test_reddit_search.py) |
| Create | `outreach/tests/test_hn.py` | Tests for hn.py |
| Modify | `outreach/tests/test_outreach.py` | Update for Lead objects |
| Create | `outreach/tests/test_dashboard.py` | Tests for parsing functions |

---

## Task 1: `platforms/` package and `base.py`

**Files:**
- Create: `outreach/platforms/__init__.py`
- Create: `outreach/platforms/base.py`
- Create: `outreach/tests/test_base.py`

- [ ] **Step 1: Write failing tests for base.py**

```python
# outreach/tests/test_base.py

import json
import tempfile
from dataclasses import asdict
from datetime import datetime
from pathlib import Path

from platforms.base import Lead, add_to_contacted, load_contacted, load_contacted_entries


def write_json(path, data):
    path.write_text(json.dumps(data))


# ── Lead dataclass ─────────────────────────────────────────────────────────────

def test_lead_required_fields():
    lead = Lead(author="user1", platform="reddit", text="hi", url="https://x.com", score=5)
    assert lead.author == "user1"
    assert lead.subreddit is None  # optional field defaults to None


def test_lead_with_subreddit():
    lead = Lead(author="u1", platform="reddit", text="t", url="u", score=1, subreddit="books")
    assert lead.subreddit == "books"


# ── load_contacted_entries ─────────────────────────────────────────────────────

def test_load_entries_returns_empty_when_no_file(tmp_path):
    assert load_contacted_entries(tmp_path / "c.json") == []


def test_load_entries_reads_new_format(tmp_path):
    path = tmp_path / "c.json"
    data = [{"username": "user1", "platform": "reddit", "date": "2026-04-25"}]
    write_json(path, data)
    assert load_contacted_entries(path) == data


def test_load_entries_migrates_old_string_format(tmp_path):
    path = tmp_path / "c.json"
    write_json(path, ["user1", "user2"])
    entries = load_contacted_entries(path)
    assert len(entries) == 2
    assert entries[0]["username"] == "user1"
    assert entries[0]["platform"] == "reddit"  # migrated as reddit
    assert entries[0]["date"] == "unknown"
    # file is rewritten in new format
    reloaded = json.loads(path.read_text())
    assert isinstance(reloaded[0], dict)


def test_load_entries_handles_empty_list(tmp_path):
    path = tmp_path / "c.json"
    write_json(path, [])
    assert load_contacted_entries(path) == []


# ── load_contacted ─────────────────────────────────────────────────────────────

def test_load_contacted_returns_set_of_usernames(tmp_path):
    path = tmp_path / "c.json"
    data = [
        {"username": "user1", "platform": "reddit", "date": "2026-04-25"},
        {"username": "user2", "platform": "hackernews", "date": "2026-04-24"},
    ]
    write_json(path, data)
    assert load_contacted(path) == {"user1", "user2"}


def test_load_contacted_returns_empty_set_when_no_file(tmp_path):
    assert load_contacted(tmp_path / "c.json") == set()


def test_load_contacted_migrates_old_format(tmp_path):
    path = tmp_path / "c.json"
    write_json(path, ["user1", "user2"])
    assert load_contacted(path) == {"user1", "user2"}


# ── add_to_contacted ───────────────────────────────────────────────────────────

def test_add_to_contacted_creates_file(tmp_path):
    path = tmp_path / "c.json"
    lead = Lead(author="user1", platform="reddit", text="t", url="u", score=1)
    add_to_contacted(lead, path)
    assert path.exists()


def test_add_to_contacted_stores_username_and_platform(tmp_path):
    path = tmp_path / "c.json"
    lead = Lead(author="user1", platform="hackernews", text="t", url="u", score=1)
    add_to_contacted(lead, path)
    entries = json.loads(path.read_text())
    assert entries[0]["username"] == "user1"
    assert entries[0]["platform"] == "hackernews"


def test_add_to_contacted_stores_today_date(tmp_path):
    path = tmp_path / "c.json"
    lead = Lead(author="user1", platform="reddit", text="t", url="u", score=1)
    add_to_contacted(lead, path)
    entries = json.loads(path.read_text())
    assert entries[0]["date"] == datetime.now().strftime("%Y-%m-%d")


def test_add_to_contacted_no_duplicates(tmp_path):
    path = tmp_path / "c.json"
    lead = Lead(author="user1", platform="reddit", text="t", url="u", score=1)
    add_to_contacted(lead, path)
    add_to_contacted(lead, path)
    entries = json.loads(path.read_text())
    assert len([e for e in entries if e["username"] == "user1"]) == 1


def test_add_to_contacted_appends_to_existing(tmp_path):
    path = tmp_path / "c.json"
    existing = [{"username": "user1", "platform": "reddit", "date": "2026-04-24"}]
    write_json(path, existing)
    lead = Lead(author="user2", platform="hackernews", text="t", url="u", score=1)
    add_to_contacted(lead, path)
    entries = json.loads(path.read_text())
    usernames = [e["username"] for e in entries]
    assert "user1" in usernames
    assert "user2" in usernames
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd outreach && pytest tests/test_base.py -v
```

Expected: `ModuleNotFoundError: No module named 'platforms'`

- [ ] **Step 3: Create `platforms/__init__.py`**

```python
# outreach/platforms/__init__.py
```

(Empty file.)

- [ ] **Step 4: Create `platforms/base.py`**

```python
# outreach/platforms/base.py

import json
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path


@dataclass
class Lead:
    author: str
    platform: str       # "reddit" | "hackernews"
    text: str
    url: str
    score: int
    subreddit: str | None = None


def load_contacted_entries(path: Path) -> list[dict]:
    if not path.exists():
        return []
    data = json.loads(path.read_text())
    if not data:
        return []
    if isinstance(data[0], str):
        migrated = [{"username": u, "platform": "reddit", "date": "unknown"} for u in data]
        path.write_text(json.dumps(migrated, indent=2))
        return migrated
    return data


def load_contacted(path: Path) -> set[str]:
    return {e["username"] for e in load_contacted_entries(path)}


def add_to_contacted(lead: Lead, path: Path) -> None:
    entries = load_contacted_entries(path)
    existing_usernames = {e["username"] for e in entries}
    if lead.author in existing_usernames:
        return
    entries.append({
        "username": lead.author,
        "platform": lead.platform,
        "date": datetime.now().strftime("%Y-%m-%d"),
    })
    path.write_text(json.dumps(entries, indent=2))
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
cd outreach && pytest tests/test_base.py -v
```

Expected: all 16 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add outreach/platforms/__init__.py outreach/platforms/base.py outreach/tests/test_base.py
git commit -m "feat: add platforms package with Lead dataclass and contacted helpers"
```

---

## Task 2: Migrate Reddit to `platforms/reddit.py`

**Files:**
- Create: `outreach/platforms/reddit.py` (logic moved from `reddit_search.py`)
- Create: `outreach/tests/test_reddit.py` (moved + updated from `test_reddit_search.py`)

Do NOT delete `reddit_search.py` yet — `outreach.py` still imports from it. That import is fixed in Task 5.

- [ ] **Step 1: Create `platforms/reddit.py`**

```python
# outreach/platforms/reddit.py

import time
from pathlib import Path

import praw

from config import (
    MIN_AUTHOR_AGE_DAYS,
    MIN_AUTHOR_KARMA,
    SEARCH_LOOKBACK_DAYS,
    SEARCH_TERMS,
    SUBREDDITS,
)
from platforms.base import Lead


def is_recent(item, days: int = SEARCH_LOOKBACK_DAYS) -> bool:
    cutoff = time.time() - days * 86400
    return item.created_utc > cutoff


def is_credible_author(item) -> bool:
    author = item.author
    if author is None:
        return False
    total_karma = author.link_karma + author.comment_karma
    age_days = (time.time() - author.created_utc) / 86400
    return total_karma >= MIN_AUTHOR_KARMA and age_days >= MIN_AUTHOR_AGE_DAYS


def is_bot(item) -> bool:
    name = item.author.name.lower()
    return "bot" in name or "auto" in name


def should_include(item, contacted: set) -> bool:
    if item.author is None:
        return False
    return (
        is_recent(item)
        and is_credible_author(item)
        and not is_bot(item)
        and item.author.name not in contacted
    )


def build_lead(item) -> Lead:
    text = getattr(item, "selftext", None) or getattr(item, "body", "")
    return Lead(
        author=item.author.name,
        platform="reddit",
        text=text[:500],
        url=f"https://reddit.com{item.permalink}",
        score=item.score,
        subreddit=item.subreddit.display_name,
    )


def search(reddit: praw.Reddit, contacted: set) -> list[Lead]:
    leads = []
    seen_permalinks: set[str] = set()

    for subreddit_name in SUBREDDITS:
        subreddit = reddit.subreddit(subreddit_name)
        for term in SEARCH_TERMS:
            for item in subreddit.search(term, sort="new", time_filter="month", limit=50):
                if item.permalink in seen_permalinks:
                    continue
                seen_permalinks.add(item.permalink)
                if should_include(item, contacted):
                    leads.append(build_lead(item))

    return leads
```

- [ ] **Step 2: Create `tests/test_reddit.py`**

```python
# outreach/tests/test_reddit.py

import time
from unittest.mock import MagicMock, patch

import platforms.reddit as reddit_module
import pytest

from platforms.reddit import (
    build_lead,
    is_bot,
    is_credible_author,
    is_recent,
    search,
    should_include,
)


def make_item(
    username="reader_99",
    link_karma=50,
    comment_karma=50,
    age_days=60,
    created_days_ago=1,
    text="I have too many books and no time to read them",
    subreddit="books",
    score=42,
):
    item = MagicMock()
    item.author.name = username
    item.author.link_karma = link_karma
    item.author.comment_karma = comment_karma
    item.author.created_utc = time.time() - age_days * 86400
    item.created_utc = time.time() - created_days_ago * 86400
    item.selftext = text
    item.permalink = f"/r/{subreddit}/comments/abc123/post_title/"
    item.subreddit.display_name = subreddit
    item.score = score
    return item


def test_is_recent_within_30_days():
    assert is_recent(make_item(created_days_ago=15)) is True


def test_is_recent_older_than_30_days():
    assert is_recent(make_item(created_days_ago=31)) is False


def test_is_credible_author_passes():
    assert is_credible_author(make_item(link_karma=50, comment_karma=50, age_days=60)) is True


def test_is_credible_author_low_karma():
    assert is_credible_author(make_item(link_karma=4, comment_karma=4, age_days=60)) is False


def test_is_credible_author_new_account():
    assert is_credible_author(make_item(link_karma=100, comment_karma=100, age_days=10)) is False


def test_is_credible_author_deleted_returns_false():
    item = make_item()
    item.author = None
    assert is_credible_author(item) is False


def test_is_bot_detects_bot_in_name():
    assert is_bot(make_item(username="AutoModerator")) is True


def test_is_bot_detects_auto_in_name():
    assert is_bot(make_item(username="auto_summary_bot")) is True


def test_is_bot_passes_real_user():
    assert is_bot(make_item(username="thesis_survivor")) is False


def test_should_include_valid_lead():
    assert should_include(make_item(), contacted=set()) is True


def test_should_include_rejects_old_post():
    assert should_include(make_item(created_days_ago=31), contacted=set()) is False


def test_should_include_rejects_low_karma():
    assert should_include(make_item(link_karma=2, comment_karma=2), contacted=set()) is False


def test_should_include_rejects_contacted_user():
    assert should_include(make_item(username="reader_99"), contacted={"reader_99"}) is False


def test_should_include_rejects_bot():
    assert should_include(make_item(username="BookBot"), contacted=set()) is False


def test_should_include_rejects_deleted_author():
    item = make_item()
    item.author = None
    assert should_include(item, contacted=set()) is False


def test_build_lead_returns_lead_object():
    from platforms.base import Lead
    item = make_item(username="reader_99", subreddit="books", score=42)
    lead = build_lead(item)
    assert isinstance(lead, Lead)
    assert lead.author == "reader_99"
    assert lead.platform == "reddit"
    assert lead.subreddit == "books"
    assert lead.score == 42
    assert lead.url == "https://reddit.com/r/books/comments/abc123/post_title/"
    assert lead.text == "I have too many books and no time to read them"


def test_build_lead_truncates_long_text():
    lead = build_lead(make_item(text="x" * 1000))
    assert len(lead.text) <= 500


def test_search_returns_valid_leads():
    item = make_item()
    mock_reddit = MagicMock()
    mock_subreddit = MagicMock()
    mock_reddit.subreddit.return_value = mock_subreddit
    mock_subreddit.search.return_value = [item]

    with patch.object(reddit_module, "SUBREDDITS", ["books"]), \
         patch.object(reddit_module, "SEARCH_TERMS", ["too many books"]):
        leads = search(mock_reddit, contacted=set())

    assert len(leads) == 1
    assert leads[0].author == "reader_99"


def test_search_deduplicates_by_permalink():
    item = make_item()
    mock_reddit = MagicMock()
    mock_subreddit = MagicMock()
    mock_reddit.subreddit.return_value = mock_subreddit
    mock_subreddit.search.return_value = [item]

    with patch.object(reddit_module, "SUBREDDITS", ["books"]), \
         patch.object(reddit_module, "SEARCH_TERMS", ["too many books", "reading list"]):
        leads = search(mock_reddit, contacted=set())

    assert len(leads) == 1


def test_search_excludes_contacted():
    item = make_item(username="reader_99")
    mock_reddit = MagicMock()
    mock_subreddit = MagicMock()
    mock_reddit.subreddit.return_value = mock_subreddit
    mock_subreddit.search.return_value = [item]

    with patch.object(reddit_module, "SUBREDDITS", ["books"]), \
         patch.object(reddit_module, "SEARCH_TERMS", ["too many books"]):
        leads = search(mock_reddit, contacted={"reader_99"})

    assert len(leads) == 0
```

- [ ] **Step 3: Run tests to verify they pass**

```bash
cd outreach && pytest tests/test_reddit.py -v
```

Expected: all tests PASS.

- [ ] **Step 4: Commit**

```bash
git add outreach/platforms/reddit.py outreach/tests/test_reddit.py
git commit -m "feat: add platforms/reddit.py adapter with Lead output"
```

---

## Task 3: Expand `config.py`

**Files:**
- Modify: `outreach/config.py`

No tests needed — pure constants.

- [ ] **Step 1: Update `config.py`**

Replace the entire file content:

```python
# outreach/config.py

SUBREDDITS = [
    # Original
    "52book",
    "GradSchool",
    "productivity",
    "selfimprovement",
    "books",
    "mobileread",
    # New
    "PhD",
    "academia",
    "AskAcademia",
    "learnprogramming",
    "kindle",
    "nosurf",
]

SEARCH_TERMS = [
    "too many books",
    "can't finish",
    "reading list",
    "PDF book",
    "book summary",
    "summarize book",
    "don't have time to read",
    "too many PDFs",
]

HN_SEARCH_TERMS = [
    "too many books",
    "book summary",
    "summarize book",
    "PDF book",
    "reading list",
    "don't have time to read",
]

SEARCH_LOOKBACK_DAYS = 30
MIN_AUTHOR_KARMA = 10
MIN_AUTHOR_AGE_DAYS = 30

BOOKDIGEST_DESCRIPTION = """
BookDigest is an AI-powered PDF book summarizer built by Marcus (solo founder).
Users upload any PDF book and receive:
- A personalized AI summary in ~2 minutes (Executive, Study Guide, or Action Plan style)
- AI chat to ask follow-up questions about the book
- Audio narration of the summary

Website: https://bookdigest.se
Free tier: 3 summaries, no credit card required.
Reader tier: 20 summaries/month, all styles, audio narration.
"""
```

- [ ] **Step 2: Run existing tests to confirm no breakage**

```bash
cd outreach && pytest tests/ -v
```

Expected: all existing tests PASS.

- [ ] **Step 3: Commit**

```bash
git add outreach/config.py
git commit -m "feat: expand config with new subreddits and HN search terms"
```

---

## Task 4: HN Adapter (`platforms/hn.py`)

**Files:**
- Create: `outreach/platforms/hn.py`
- Create: `outreach/tests/test_hn.py`

Add `requests` to requirements.txt.

- [ ] **Step 1: Add `requests` to `requirements.txt`**

```
praw>=7.7
anthropic>=0.25
python-dotenv>=1.0
rich>=13.0
pytest>=8.0
requests>=2.31
```

Install:

```bash
cd outreach && pip install requests
```

- [ ] **Step 2: Write failing tests for `hn.py`**

```python
# outreach/tests/test_hn.py

from unittest.mock import MagicMock, patch

import platforms.hn as hn_module
import pytest

from platforms.base import Lead
from platforms.hn import build_lead, is_valid_hit, search


def make_hit(
    author="hn_user",
    points=10,
    days_ago=5,
    comment_text="I have too many PDFs to read this semester",
    title=None,
    object_id="12345",
):
    import time
    return {
        "objectID": object_id,
        "author": author,
        "points": points,
        "created_at_i": int(time.time()) - days_ago * 86400,
        "comment_text": comment_text,
        "title": title,
    }


def test_is_valid_hit_passes():
    assert is_valid_hit(make_hit(), contacted=set()) is True


def test_is_valid_hit_rejects_low_points():
    assert is_valid_hit(make_hit(points=1), contacted=set()) is False


def test_is_valid_hit_rejects_old_post():
    assert is_valid_hit(make_hit(days_ago=35), contacted=set()) is False


def test_is_valid_hit_rejects_bot_author():
    assert is_valid_hit(make_hit(author="HNbot"), contacted=set()) is False


def test_is_valid_hit_rejects_auto_author():
    assert is_valid_hit(make_hit(author="auto_digest"), contacted=set()) is False


def test_is_valid_hit_rejects_contacted():
    assert is_valid_hit(make_hit(author="hn_user"), contacted={"hn_user"}) is False


def test_is_valid_hit_rejects_none_author():
    hit = make_hit()
    hit["author"] = None
    assert is_valid_hit(hit, contacted=set()) is False


def test_build_lead_from_comment():
    hit = make_hit(comment_text="I need to read 15 PDFs", title=None)
    lead = build_lead(hit)
    assert isinstance(lead, Lead)
    assert lead.author == "hn_user"
    assert lead.platform == "hackernews"
    assert lead.text == "I need to read 15 PDFs"
    assert lead.url == "https://news.ycombinator.com/item?id=12345"
    assert lead.score == 10
    assert lead.subreddit is None


def test_build_lead_falls_back_to_title():
    hit = make_hit(comment_text=None, title="Ask HN: How do you handle too many books?")
    lead = build_lead(hit)
    assert lead.text == "Ask HN: How do you handle too many books?"


def test_build_lead_truncates_long_text():
    hit = make_hit(comment_text="x" * 1000)
    lead = build_lead(hit)
    assert len(lead.text) <= 500


def test_search_returns_leads(requests_mock):
    import time
    hit = make_hit()
    requests_mock.get(
        "https://hn.algolia.com/api/v1/search_by_date",
        json={"hits": [hit]},
    )

    with patch.object(hn_module, "HN_SEARCH_TERMS", ["too many books"]):
        leads = search(contacted=set())

    assert len(leads) == 1
    assert leads[0].author == "hn_user"


def test_search_deduplicates_by_object_id(requests_mock):
    hit = make_hit(object_id="99")
    requests_mock.get(
        "https://hn.algolia.com/api/v1/search_by_date",
        json={"hits": [hit]},
    )

    with patch.object(hn_module, "HN_SEARCH_TERMS", ["term1", "term2"]):
        leads = search(contacted=set())

    assert len(leads) == 1


def test_search_excludes_contacted(requests_mock):
    hit = make_hit(author="hn_user")
    requests_mock.get(
        "https://hn.algolia.com/api/v1/search_by_date",
        json={"hits": [hit]},
    )

    with patch.object(hn_module, "HN_SEARCH_TERMS", ["too many books"]):
        leads = search(contacted={"hn_user"})

    assert len(leads) == 0
```

- [ ] **Step 3: Install `pytest-requests-mock` for the test HTTP mocking**

```bash
pip install requests-mock pytest-mock
```

Add to `requirements.txt`:
```
requests-mock>=1.11
```

- [ ] **Step 4: Run tests to verify they fail**

```bash
cd outreach && pytest tests/test_hn.py -v
```

Expected: `ModuleNotFoundError: No module named 'platforms.hn'`

- [ ] **Step 5: Create `platforms/hn.py`**

```python
# outreach/platforms/hn.py

import time

import requests

from config import HN_SEARCH_TERMS, SEARCH_LOOKBACK_DAYS
from platforms.base import Lead

_ALGOLIA_URL = "https://hn.algolia.com/api/v1/search_by_date"
_MIN_POINTS = 2


def is_valid_hit(hit: dict, contacted: set) -> bool:
    author = hit.get("author")
    if author is None:
        return False
    name_lower = author.lower()
    if "bot" in name_lower or "auto" in name_lower:
        return False
    if author in contacted:
        return False
    if hit.get("points", 0) < _MIN_POINTS:
        return False
    cutoff = time.time() - SEARCH_LOOKBACK_DAYS * 86400
    if hit.get("created_at_i", 0) < cutoff:
        return False
    return True


def build_lead(hit: dict) -> Lead:
    text = hit.get("comment_text") or hit.get("title") or ""
    return Lead(
        author=hit["author"],
        platform="hackernews",
        text=text[:500],
        url=f"https://news.ycombinator.com/item?id={hit['objectID']}",
        score=hit.get("points", 0),
        subreddit=None,
    )


def search(contacted: set) -> list[Lead]:
    leads: list[Lead] = []
    seen_ids: set[str] = set()
    cutoff = int(time.time()) - SEARCH_LOOKBACK_DAYS * 86400

    for term in HN_SEARCH_TERMS:
        try:
            resp = requests.get(
                _ALGOLIA_URL,
                params={
                    "query": term,
                    "tags": "(story,comment)",
                    "numericFilters": f"created_at_i>{cutoff},points>{_MIN_POINTS}",
                    "hitsPerPage": 50,
                },
                timeout=10,
            )
            resp.raise_for_status()
        except requests.RequestException:
            continue

        for hit in resp.json().get("hits", []):
            oid = hit.get("objectID", "")
            if oid in seen_ids:
                continue
            seen_ids.add(oid)
            if is_valid_hit(hit, contacted):
                leads.append(build_lead(hit))

    return leads
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
cd outreach && pytest tests/test_hn.py -v
```

Expected: all tests PASS.

- [ ] **Step 7: Commit**

```bash
git add outreach/platforms/hn.py outreach/tests/test_hn.py outreach/requirements.txt
git commit -m "feat: add HN Algolia platform adapter"
```

---

## Task 5: Update `outreach.py` for Lead objects

**Files:**
- Modify: `outreach/outreach.py`
- Modify: `outreach/tests/test_outreach.py`

`outreach.py` is refactored to a pure library — `main()` is removed (it moves to `run.py` in Task 6). Imports switch from `reddit_search` to `platforms.base`.

- [ ] **Step 1: Replace `outreach.py`**

```python
# outreach/outreach.py

import json
from datetime import datetime
from pathlib import Path

import anthropic
from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt

from message_generator import generate_message
from platforms.base import Lead, add_to_contacted, load_contacted

QUEUE_FILE = Path("outreach-queue.md")
CONTACTED_FILE = Path("contacted.json")

console = Console()


def save_to_queue(lead: Lead, message: str, path: Path) -> None:
    platform_label = f"r/{lead.subreddit}" if lead.subreddit else lead.platform.title()
    entry = (
        f"## {lead.author} · {platform_label}\n"
        f"**Platform:** {lead.platform}\n"
        f"**URL:** {lead.url}\n"
        f"**Datum:** {datetime.now().strftime('%Y-%m-%d')}\n\n"
        f"{message}\n\n"
        f"Status: [ ] Skickat\n\n---\n\n"
    )
    with open(path, "a", encoding="utf-8") as f:
        f.write(entry)


def run_interactive_review(
    leads: list[Lead],
    client: anthropic.Anthropic,
    queue_path: Path = QUEUE_FILE,
    contacted_path: Path = CONTACTED_FILE,
) -> tuple[int, int]:
    """Returns (approved_count, skipped_count)."""
    total = len(leads)
    approved = 0
    skipped = 0

    if total == 0:
        console.print("[yellow]Inga nya leads hittades.[/yellow]")
        return 0, 0

    for i, lead in enumerate(leads, 1):
        platform_label = f"r/{lead.subreddit}" if lead.subreddit else lead.platform.title()
        console.rule(
            f"[bold]Lead {i}/{total} · {platform_label} · {lead.author}[/bold]"
        )
        console.print(f"[dim]{lead.url}[/dim]")
        console.print(Panel(lead.text[:400], title="Deras inlägg", border_style="dim"))

        console.print("[cyan]Genererar meddelande...[/cyan]")
        message = generate_message(lead.__dict__, client)
        console.print(Panel(message, title="Förslag på meddelande", border_style="green"))

        choice = Prompt.ask(
            "[y] Spara  [n] Hoppa  [e] Redigera  [q] Avsluta",
            choices=["y", "n", "e", "q"],
        )

        if choice == "q":
            console.print("[yellow]Avslutar.[/yellow]")
            break
        elif choice == "n":
            skipped += 1
            continue
        elif choice == "e":
            message = Prompt.ask("Skriv ditt meddelande")
            save_to_queue(lead, message, queue_path)
            add_to_contacted(lead, contacted_path)
            approved += 1
            console.print("[green]✓ Sparat.[/green]")
        elif choice == "y":
            save_to_queue(lead, message, queue_path)
            add_to_contacted(lead, contacted_path)
            approved += 1
            console.print("[green]✓ Sparat.[/green]")

    console.print(f"\n[bold green]Klar! Godkända leads sparade i {queue_path}[/bold green]")
    console.print(f"Godkända: {approved} · Hoppade: {skipped}")
    return approved, skipped
```

- [ ] **Step 2: Replace `tests/test_outreach.py`**

```python
# outreach/tests/test_outreach.py

import json
import tempfile
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from outreach import run_interactive_review, save_to_queue
from platforms.base import Lead


def make_lead(author="reader_99", platform="reddit", subreddit="books"):
    return Lead(
        author=author,
        platform=platform,
        text="I have too many books and no time",
        url="https://reddit.com/r/books/comments/abc/",
        score=42,
        subreddit=subreddit,
    )


# ── save_to_queue ──────────────────────────────────────────────────────────────

def test_save_to_queue_creates_file_if_missing(tmp_path):
    path = tmp_path / "queue.md"
    save_to_queue(make_lead(), "Hi there!", path)
    assert path.exists()


def test_save_to_queue_contains_author(tmp_path):
    path = tmp_path / "queue.md"
    save_to_queue(make_lead(author="reader_99"), "Hi!", path)
    assert "reader_99" in path.read_text()


def test_save_to_queue_contains_message(tmp_path):
    path = tmp_path / "queue.md"
    save_to_queue(make_lead(), "Hi there, saw your post!", path)
    assert "Hi there, saw your post!" in path.read_text()


def test_save_to_queue_contains_status_checkbox(tmp_path):
    path = tmp_path / "queue.md"
    save_to_queue(make_lead(), "Hi!", path)
    assert "[ ] Skickat" in path.read_text()


def test_save_to_queue_appends_multiple_leads(tmp_path):
    path = tmp_path / "queue.md"
    save_to_queue(make_lead(author="user1"), "Message 1", path)
    save_to_queue(make_lead(author="user2"), "Message 2", path)
    content = path.read_text()
    assert "user1" in content
    assert "user2" in content


def test_save_to_queue_shows_subreddit_for_reddit_lead(tmp_path):
    path = tmp_path / "queue.md"
    save_to_queue(make_lead(platform="reddit", subreddit="GradSchool"), "Hi!", path)
    assert "r/GradSchool" in path.read_text()


def test_save_to_queue_shows_platform_for_hn_lead(tmp_path):
    path = tmp_path / "queue.md"
    save_to_queue(
        make_lead(platform="hackernews", subreddit=None), "Hi!", path
    )
    assert "Hackernews" in path.read_text()


# ── run_interactive_review ─────────────────────────────────────────────────────

def test_review_saves_lead_on_y(tmp_path):
    queue = tmp_path / "queue.md"
    contacted = tmp_path / "contacted.json"
    mock_client = MagicMock()

    with patch("outreach.generate_message", return_value="Hi there!"), \
         patch("rich.prompt.Prompt.ask", return_value="y"):
        approved, skipped = run_interactive_review(
            [make_lead()], mock_client,
            queue_path=queue, contacted_path=contacted,
        )

    assert queue.exists()
    assert "reader_99" in queue.read_text()
    assert approved == 1
    assert skipped == 0


def test_review_skips_lead_on_n(tmp_path):
    queue = tmp_path / "queue.md"
    contacted = tmp_path / "contacted.json"
    mock_client = MagicMock()

    with patch("outreach.generate_message", return_value="Hi!"), \
         patch("rich.prompt.Prompt.ask", return_value="n"):
        approved, skipped = run_interactive_review(
            [make_lead()], mock_client,
            queue_path=queue, contacted_path=contacted,
        )

    assert not queue.exists()
    assert approved == 0
    assert skipped == 1


def test_review_saves_edited_message_on_e(tmp_path):
    queue = tmp_path / "queue.md"
    contacted = tmp_path / "contacted.json"
    mock_client = MagicMock()

    with patch("outreach.generate_message", return_value="Original draft"), \
         patch("rich.prompt.Prompt.ask", side_effect=["e", "My custom message"]):
        run_interactive_review(
            [make_lead()], mock_client,
            queue_path=queue, contacted_path=contacted,
        )

    content = queue.read_text()
    assert "My custom message" in content
    assert "Original draft" not in content


def test_review_stops_processing_on_q(tmp_path):
    queue = tmp_path / "queue.md"
    contacted = tmp_path / "contacted.json"
    mock_client = MagicMock()

    with patch("outreach.generate_message", return_value="Hi!"), \
         patch("rich.prompt.Prompt.ask", return_value="q"):
        run_interactive_review(
            [make_lead("user1"), make_lead("user2")], mock_client,
            queue_path=queue, contacted_path=contacted,
        )

    assert not queue.exists()


def test_review_handles_empty_leads_gracefully(tmp_path):
    mock_client = MagicMock()
    approved, skipped = run_interactive_review(
        [], mock_client,
        queue_path=tmp_path / "q.md",
        contacted_path=tmp_path / "c.json",
    )
    assert approved == 0
    assert skipped == 0
```

- [ ] **Step 3: Run tests**

```bash
cd outreach && pytest tests/test_outreach.py -v
```

Expected: all tests PASS.

- [ ] **Step 4: Commit**

```bash
git add outreach/outreach.py outreach/tests/test_outreach.py
git commit -m "feat: update outreach.py for Lead dataclass, return approval counts"
```

---

## Task 6: Orchestrator (`run.py`)

**Files:**
- Create: `outreach/run.py`

No unit tests — covered by integration (smoke test in Step 3). `run.py` is a thin shell that wires the pieces together.

- [ ] **Step 1: Create `run.py`**

```python
# outreach/run.py

import json
import os
import random
from datetime import datetime
from pathlib import Path

import anthropic
import praw
from dotenv import load_dotenv
from rich.console import Console

from outreach import CONTACTED_FILE, QUEUE_FILE, run_interactive_review
from platforms.base import load_contacted
from platforms.hn import search as hn_search
from platforms.reddit import search as reddit_search

load_dotenv()

RUNS_FILE = Path("runs.json")
console = Console()


def _append_run_stats(found: int, approved: int, skipped: int) -> None:
    runs = []
    if RUNS_FILE.exists():
        runs = json.loads(RUNS_FILE.read_text())
    runs.append({
        "date": datetime.now().strftime("%Y-%m-%d"),
        "found": found,
        "approved": approved,
        "skipped": skipped,
    })
    RUNS_FILE.write_text(json.dumps(runs, indent=2))


def main() -> None:
    load_dotenv()
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    contacted = load_contacted(CONTACTED_FILE)

    console.print("[bold]BookDigest Outreach Agent[/bold]\n")

    leads = []

    # Reddit (optional — skip gracefully if no credentials)
    reddit_id = os.environ.get("REDDIT_CLIENT_ID")
    if reddit_id:
        console.print("[dim]Söker Reddit...[/dim]")
        reddit = praw.Reddit(
            client_id=reddit_id,
            client_secret=os.environ["REDDIT_CLIENT_SECRET"],
            user_agent=os.environ.get("REDDIT_USER_AGENT", "BookDigest Outreach Bot/1.0"),
        )
        reddit_leads = reddit_search(reddit, contacted)
        console.print(f"[green]Reddit: {len(reddit_leads)} leads[/green]")
        leads.extend(reddit_leads)
    else:
        console.print("[yellow]REDDIT_CLIENT_ID saknas — hoppar över Reddit.[/yellow]")

    # Hacker News (always runs — no credentials needed)
    console.print("[dim]Söker Hacker News...[/dim]")
    hn_leads = hn_search(contacted)
    console.print(f"[green]Hacker News: {len(hn_leads)} leads[/green]")
    leads.extend(hn_leads)

    if not leads:
        console.print("[yellow]Inga nya leads hittades på någon plattform.[/yellow]")
        return

    random.shuffle(leads)
    console.print(f"\n[bold]{len(leads)} leads totalt. Startar granskning...[/bold]\n")

    approved, skipped = run_interactive_review(leads, client)
    _append_run_stats(found=len(leads), approved=approved, skipped=skipped)


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Verify imports resolve**

```bash
cd outreach && python -c "import run; print('OK')"
```

Expected: `OK` (no import errors).

- [ ] **Step 3: Smoke test (manual)**

```bash
cd outreach && python run.py
```

If Reddit credentials exist: both platforms searched. If not: only HN runs. Verify the review loop displays leads and saving works.

- [ ] **Step 4: Commit**

```bash
git add outreach/run.py
git commit -m "feat: add run.py multi-platform orchestrator with runs.json tracking"
```

---

## Task 7: Dashboard Generator (`generate_dashboard.py`)

**Files:**
- Create: `outreach/generate_dashboard.py`
- Create: `outreach/tests/test_dashboard.py`

- [ ] **Step 1: Write failing tests for the parsing functions**

Full `test_dashboard.py`:

```python
# outreach/tests/test_dashboard.py

import json
from datetime import datetime, timedelta
from pathlib import Path

from generate_dashboard import (
    compute_stats,
    parse_queue_entries,
    parse_queue_unsent_count,
)

SAMPLE_QUEUE = """\
## u/thesis_survivor · r/GradSchool
**Platform:** reddit
**URL:** https://reddit.com/r/GradSchool/comments/abc/
**Datum:** 2026-04-25

Saw your post about PDFs...

Status: [ ] Skickat

---

## pdfoverload2026 · Hackernews
**Platform:** hackernews
**URL:** https://news.ycombinator.com/item?id=99
**Datum:** 2026-04-24

Noticed your comment...

Status: [x] Skickat

---

## u/busy_reader · r/52book
**Platform:** reddit
**URL:** https://reddit.com/r/52book/comments/xyz/
**Datum:** 2026-04-23

Saw your reading challenge post...

Status: [ ] Skickat

---
"""


def test_parse_queue_unsent_count():
    assert parse_queue_unsent_count(SAMPLE_QUEUE) == 2


def test_parse_queue_entries_returns_all():
    entries = parse_queue_entries(SAMPLE_QUEUE)
    assert len(entries) == 3


def test_parse_queue_entries_unsent_only():
    entries = parse_queue_entries(SAMPLE_QUEUE, unsent_only=True)
    assert len(entries) == 2
    assert all(not e["sent"] for e in entries)


def test_parse_queue_entries_has_author():
    entries = parse_queue_entries(SAMPLE_QUEUE)
    authors = [e["author"] for e in entries]
    assert "thesis_survivor" in authors
    assert "pdfoverload2026" in authors


def test_parse_queue_entries_has_date():
    entries = parse_queue_entries(SAMPLE_QUEUE)
    assert entries[0]["date"] == "2026-04-25"


def test_parse_queue_entries_has_platform():
    entries = parse_queue_entries(SAMPLE_QUEUE)
    platforms = [e["platform"] for e in entries]
    assert "reddit" in platforms
    assert "hackernews" in platforms


def test_compute_stats_total():
    contacted = [
        {"username": "u1", "platform": "reddit", "date": "2026-04-25"},
        {"username": "u2", "platform": "hackernews", "date": "2026-04-20"},
    ]
    stats = compute_stats(contacted, queue_text="", runs=[])
    assert stats["total"] == 2


def test_compute_stats_platform_breakdown():
    contacted = [
        {"username": "u1", "platform": "reddit", "date": "2026-04-25"},
        {"username": "u2", "platform": "reddit", "date": "2026-04-24"},
        {"username": "u3", "platform": "hackernews", "date": "2026-04-23"},
    ]
    stats = compute_stats(contacted, queue_text="", runs=[])
    assert stats["by_platform"]["reddit"] == 2
    assert stats["by_platform"]["hackernews"] == 1


def test_compute_stats_this_week():
    today = datetime.now()
    recent = (today - timedelta(days=3)).strftime("%Y-%m-%d")
    old = (today - timedelta(days=10)).strftime("%Y-%m-%d")
    contacted = [
        {"username": "u1", "platform": "reddit", "date": recent},
        {"username": "u2", "platform": "reddit", "date": old},
    ]
    stats = compute_stats(contacted, queue_text="", runs=[])
    assert stats["this_week"] == 1


def test_compute_stats_approval_rate():
    runs = [
        {"date": "2026-04-24", "found": 10, "approved": 4, "skipped": 6},
        {"date": "2026-04-25", "found": 8, "approved": 6, "skipped": 2},
    ]
    stats = compute_stats([], queue_text="", runs=runs)
    assert stats["approval_rate"] == round(10 / 18 * 100)


def test_compute_stats_no_runs_gives_none_approval_rate():
    stats = compute_stats([], queue_text="", runs=[])
    assert stats["approval_rate"] is None
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd outreach && pytest tests/test_dashboard.py -v
```

Expected: `ModuleNotFoundError: No module named 'generate_dashboard'`

- [ ] **Step 3: Create `generate_dashboard.py`**

```python
# outreach/generate_dashboard.py

import json
import re
import webbrowser
from collections import defaultdict
from datetime import datetime, timedelta
from pathlib import Path

CONTACTED_FILE = Path("contacted.json")
QUEUE_FILE = Path("outreach-queue.md")
RUNS_FILE = Path("runs.json")
OUTPUT_FILE = Path("dashboard.html")


# ── Parsing helpers ────────────────────────────────────────────────────────────

def parse_queue_unsent_count(queue_text: str) -> int:
    return queue_text.count("Status: [ ] Skickat")


def parse_queue_entries(queue_text: str, unsent_only: bool = False) -> list[dict]:
    blocks = [b.strip() for b in queue_text.split("---") if b.strip()]
    entries = []
    for block in blocks:
        author_match = re.search(r"^##\s+(?:u/)?(\S+)", block, re.MULTILINE)
        date_match = re.search(r"\*\*Datum:\*\*\s+(\S+)", block)
        platform_match = re.search(r"\*\*Platform:\*\*\s+(\S+)", block)
        sent = "[x] Skickat" in block

        if not author_match:
            continue

        entry = {
            "author": author_match.group(1).rstrip("·").strip(),
            "date": date_match.group(1) if date_match else "",
            "platform": platform_match.group(1) if platform_match else "reddit",
            "sent": sent,
        }
        if unsent_only and sent:
            continue
        entries.append(entry)
    return entries


def compute_stats(contacted: list[dict], queue_text: str, runs: list[dict]) -> dict:
    today = datetime.now()
    week_ago = today - timedelta(days=7)

    by_platform: dict[str, int] = defaultdict(int)
    this_week = 0
    for entry in contacted:
        by_platform[entry["platform"]] += 1
        try:
            entry_date = datetime.strptime(entry["date"], "%Y-%m-%d")
            if entry_date >= week_ago:
                this_week += 1
        except ValueError:
            pass

    unsent = parse_queue_unsent_count(queue_text)

    approval_rate = None
    if runs:
        total_found = sum(r["found"] for r in runs)
        total_approved = sum(r["approved"] for r in runs)
        if total_found > 0:
            approval_rate = round(total_approved / total_found * 100)

    return {
        "total": len(contacted),
        "this_week": this_week,
        "unsent": unsent,
        "by_platform": dict(by_platform),
        "approval_rate": approval_rate,
    }


# ── HTML generation ────────────────────────────────────────────────────────────

def _platform_bar(platform: str, count: int, total: int) -> str:
    pct = round(count / total * 100) if total else 0
    color = "#ff6314" if platform == "reddit" else "#ff6600"
    label = platform.title()
    return f"""
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div style="color:{color};width:120px;font-size:0.85rem">{label}</div>
        <div style="flex:1;background:#2a2a3e;border-radius:4px;height:10px">
          <div style="background:{color};width:{pct}%;height:100%;border-radius:4px"></div>
        </div>
        <div style="color:#ccc;font-size:0.85rem;width:28px;text-align:right">{count}</div>
      </div>"""


def _lead_row(entry: dict) -> str:
    color = "#a78bfa" if entry["platform"] == "reddit" else "#f59e0b"
    return f"""
      <div style="border-bottom:1px solid #2a2a3e;padding:10px 0;display:flex;justify-content:space-between;align-items:center">
        <div>
          <span style="color:{color};font-size:0.88rem">{entry['author']}</span>
          <span style="color:#444;margin:0 6px">·</span>
          <span style="color:#666;font-size:0.78rem">{entry['platform'].title()}</span>
        </div>
        <span style="color:#666;font-size:0.78rem">{entry['date']}</span>
      </div>"""


def generate_html(stats: dict, unsent_leads: list[dict]) -> str:
    approval_html = (
        f'<div style="font-size:2rem;font-weight:700;color:#f59e0b">{stats["approval_rate"]}%</div>'
        if stats["approval_rate"] is not None
        else '<div style="font-size:1.2rem;color:#555">–</div>'
    )

    platform_bars = "".join(
        _platform_bar(p, c, stats["total"])
        for p, c in sorted(stats["by_platform"].items(), key=lambda x: -x[1])
    )

    lead_rows = "".join(_lead_row(e) for e in unsent_leads[:5])
    if not lead_rows:
        lead_rows = '<div style="color:#555;padding:10px 0">Inga ej skickade leads.</div>'

    generated = datetime.now().strftime("%Y-%m-%d %H:%M")

    return f"""<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8">
<title>BookDigest Outreach Dashboard</title>
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ background: #0f0f1a; color: #e0e0e0; font-family: -apple-system, sans-serif; padding: 32px; }}
  h1 {{ font-size: 1.4rem; margin-bottom: 4px; }}
  .sub {{ color: #555; font-size: 0.8rem; margin-bottom: 28px; }}
  .grid {{ display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 20px; }}
  .card {{ background: #1e1e2e; border: 1px solid #2a2a3e; border-radius: 8px; padding: 16px; text-align: center; }}
  .num {{ font-size: 2rem; font-weight: 700; }}
  .lbl {{ font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }}
  .section {{ background: #1e1e2e; border: 1px solid #2a2a3e; border-radius: 8px; padding: 16px; margin-bottom: 16px; }}
  .sec-title {{ font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }}
</style>
</head>
<body>
<h1>BookDigest Outreach Dashboard</h1>
<div class="sub">Genererad {generated} · <a href="outreach-queue.md" style="color:#555">outreach-queue.md</a></div>

<div class="grid">
  <div class="card"><div class="num" style="color:#a78bfa">{stats['total']}</div><div class="lbl">Totalt kontaktade</div></div>
  <div class="card"><div class="num" style="color:#34d399">{stats['this_week']}</div><div class="lbl">Den här veckan</div></div>
  <div class="card"><div class="num" style="color:#60a5fa">{stats['unsent']}</div><div class="lbl">Ej skickade</div></div>
  <div class="card">{approval_html}<div class="lbl">Godkännandegrad</div></div>
</div>

<div class="section">
  <div class="sec-title">Plattformsfördelning</div>
  {platform_bars if platform_bars else '<div style="color:#555">Inga data ännu.</div>'}
</div>

<div class="section">
  <div class="sec-title">Ej skickade (senaste 5)</div>
  {lead_rows}
</div>
</body>
</html>"""


def main() -> None:
    contacted = []
    if CONTACTED_FILE.exists():
        data = json.loads(CONTACTED_FILE.read_text())
        if data and isinstance(data[0], str):
            contacted = [{"username": u, "platform": "reddit", "date": "unknown"} for u in data]
        else:
            contacted = data

    queue_text = QUEUE_FILE.read_text(encoding="utf-8") if QUEUE_FILE.exists() else ""
    runs = json.loads(RUNS_FILE.read_text()) if RUNS_FILE.exists() else []

    stats = compute_stats(contacted, queue_text, runs)
    unsent_leads = parse_queue_entries(queue_text, unsent_only=True)

    html = generate_html(stats, unsent_leads)
    OUTPUT_FILE.write_text(html, encoding="utf-8")

    print(f"Dashboard genererat: {OUTPUT_FILE.resolve()}")
    webbrowser.open(OUTPUT_FILE.resolve().as_uri())


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd outreach && pytest tests/test_dashboard.py -v
```

Expected: all tests PASS.

- [ ] **Step 5: Smoke test the dashboard**

```bash
cd outreach && python generate_dashboard.py
```

Expected: `dashboard.html` opens in the browser. If `contacted.json` is empty, all stats show 0/–.

- [ ] **Step 6: Commit**

```bash
git add outreach/generate_dashboard.py outreach/tests/test_dashboard.py
git commit -m "feat: add dashboard generator with stats, platform breakdown, and unsent leads"
```

---

## Task 8: Full Test Suite + Cleanup

**Files:**
- Delete: `outreach/tests/test_reddit_search.py` (replaced by `test_reddit.py`)

- [ ] **Step 1: Delete the old test file**

```bash
rm outreach/tests/test_reddit_search.py
```

- [ ] **Step 2: Run the complete test suite**

```bash
cd outreach && pytest tests/ -v
```

Expected: all tests PASS. Example:
```
tests/test_base.py::test_lead_required_fields PASSED
tests/test_reddit.py::test_is_recent_within_30_days PASSED
tests/test_hn.py::test_is_valid_hit_passes PASSED
tests/test_outreach.py::test_review_saves_lead_on_y PASSED
tests/test_dashboard.py::test_compute_stats_total PASSED
... (all green)
```

- [ ] **Step 3: Update `.env.example` with any new variables**

No new variables needed — HN uses no credentials.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: remove test_reddit_search.py, full suite green"
```

---

## Known Limitations

- `reddit_search.py` is left in place (not deleted) to avoid breaking any direct references. It can be removed in a future cleanup once all callers are confirmed to use `platforms/reddit.py`.
- Granting 7-day Reader access remains a manual Supabase step (no change from original design).
- `dashboard.html` is a static snapshot — refresh by re-running `python generate_dashboard.py`.
