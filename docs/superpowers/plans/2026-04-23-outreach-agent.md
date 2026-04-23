# Outreach Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone Python CLI that searches Reddit for BookDigest customer leads, generates personalized outreach drafts via Claude, and lets the user approve/skip each one before saving to a queue file.

**Architecture:** Five focused modules — `config.py` (constants), `reddit_search.py` (PRAW + filtering), `message_generator.py` (Claude API), and `outreach.py` (CLI loop + file I/O). Tests live in `outreach/tests/`. All filtering is pure functions making them easy to unit test with mocks.

**Tech Stack:** Python 3.10+, PRAW 7.7+, Anthropic SDK 0.25+, Rich 13+, python-dotenv, pytest

---

## File Map

```
outreach/
  config.py              # All constants: subreddits, search terms, BookDigest description
  reddit_search.py       # PRAW integration + lead filtering (pure filter fns + search_reddit)
  message_generator.py   # Claude API call → personalized DM draft
  outreach.py            # CLI entrypoint: run_interactive_review, save_to_queue, add_to_contacted
  tests/
    __init__.py
    test_reddit_search.py
    test_message_generator.py
    test_outreach.py
  outreach-queue.md      # Created at runtime: approved leads + messages
  contacted.json         # Created at runtime: deduplicated contacted usernames
  .env                   # Never committed
  .env.example           # Committed template
  requirements.txt
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `outreach/requirements.txt`
- Create: `outreach/.env.example`
- Create: `outreach/tests/__init__.py`

- [ ] **Step 1: Create the outreach directory and requirements.txt**

```
outreach/requirements.txt
```

Content:
```
praw>=7.7
anthropic>=0.25
python-dotenv>=1.0
rich>=13.0
pytest>=8.0
```

- [ ] **Step 2: Create .env.example**

```
outreach/.env.example
```

Content:
```
REDDIT_CLIENT_ID=your_client_id_here
REDDIT_CLIENT_SECRET=your_client_secret_here
REDDIT_USER_AGENT=BookDigest Outreach Bot/1.0 by u/your_reddit_username
ANTHROPIC_API_KEY=your_anthropic_key_here
```

- [ ] **Step 3: Create tests/__init__.py (empty)**

```
outreach/tests/__init__.py
```

Content: empty file.

- [ ] **Step 4: Install dependencies**

Run from inside `outreach/`:
```bash
pip install -r requirements.txt
```

Expected: all packages installed with no errors.

- [ ] **Step 5: Commit**

```bash
git add outreach/requirements.txt outreach/.env.example outreach/tests/__init__.py
git commit -m "feat: scaffold outreach agent project"
```

---

## Task 2: config.py

**Files:**
- Create: `outreach/config.py`

No tests needed — this is pure constants.

- [ ] **Step 1: Create config.py**

```python
# outreach/config.py

SUBREDDITS = [
    "52book",
    "GradSchool",
    "productivity",
    "selfimprovement",
    "books",
    "mobileread",
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

- [ ] **Step 2: Commit**

```bash
git add outreach/config.py
git commit -m "feat: add outreach agent config"
```

---

## Task 3: Reddit Search — Filtering Functions (TDD)

**Files:**
- Create: `outreach/tests/test_reddit_search.py` (filtering tests)
- Create: `outreach/reddit_search.py` (filtering functions only — search_reddit comes in Task 4)

- [ ] **Step 1: Write failing tests for filtering functions**

```python
# outreach/tests/test_reddit_search.py

import json
import time
import tempfile
from pathlib import Path
from unittest.mock import MagicMock

import pytest

from reddit_search import (
    build_lead,
    is_bot,
    is_credible_author,
    is_recent,
    load_contacted,
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
    item = make_item(created_days_ago=15)
    assert is_recent(item) is True


def test_is_recent_older_than_30_days():
    item = make_item(created_days_ago=31)
    assert is_recent(item) is False


def test_is_credible_author_passes():
    item = make_item(link_karma=50, comment_karma=50, age_days=60)
    assert is_credible_author(item) is True


def test_is_credible_author_low_karma():
    item = make_item(link_karma=4, comment_karma=4, age_days=60)
    assert is_credible_author(item) is False


def test_is_credible_author_new_account():
    item = make_item(link_karma=100, comment_karma=100, age_days=10)
    assert is_credible_author(item) is False


def test_is_credible_author_deleted_returns_false():
    item = make_item()
    item.author = None
    assert is_credible_author(item) is False


def test_is_bot_detects_bot_in_name():
    item = make_item(username="AutoModerator")
    assert is_bot(item) is True


def test_is_bot_detects_auto_in_name():
    item = make_item(username="auto_summary_bot")
    assert is_bot(item) is True


def test_is_bot_passes_real_user():
    item = make_item(username="thesis_survivor")
    assert is_bot(item) is False


def test_should_include_valid_lead():
    item = make_item()
    assert should_include(item, contacted=set()) is True


def test_should_include_rejects_old_post():
    item = make_item(created_days_ago=31)
    assert should_include(item, contacted=set()) is False


def test_should_include_rejects_low_karma():
    item = make_item(link_karma=2, comment_karma=2)
    assert should_include(item, contacted=set()) is False


def test_should_include_rejects_contacted_user():
    item = make_item(username="reader_99")
    assert should_include(item, contacted={"reader_99"}) is False


def test_should_include_rejects_bot():
    item = make_item(username="BookBot")
    assert should_include(item, contacted=set()) is False


def test_should_include_rejects_deleted_author():
    item = make_item()
    item.author = None
    assert should_include(item, contacted=set()) is False


def test_build_lead_returns_correct_structure():
    item = make_item(username="reader_99", subreddit="books", score=42)
    lead = build_lead(item)
    assert lead["author"] == "reader_99"
    assert lead["subreddit"] == "books"
    assert lead["score"] == 42
    assert lead["url"] == "https://reddit.com/r/books/comments/abc123/post_title/"
    assert lead["text"] == "I have too many books and no time to read them"


def test_build_lead_truncates_long_text():
    item = make_item(text="x" * 1000)
    lead = build_lead(item)
    assert len(lead["text"]) <= 500


def test_load_contacted_returns_empty_set_when_no_file():
    with tempfile.TemporaryDirectory() as d:
        path = Path(d) / "contacted.json"
        assert load_contacted(path) == set()


def test_load_contacted_reads_existing_file():
    with tempfile.TemporaryDirectory() as d:
        path = Path(d) / "contacted.json"
        path.write_text(json.dumps(["user1", "user2"]))
        assert load_contacted(path) == {"user1", "user2"}
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd outreach && pytest tests/test_reddit_search.py -v
```

Expected: `ModuleNotFoundError: No module named 'reddit_search'`

- [ ] **Step 3: Implement filtering functions in reddit_search.py**

```python
# outreach/reddit_search.py

import json
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


def build_lead(item) -> dict:
    text = getattr(item, "selftext", None) or getattr(item, "body", "")
    return {
        "author": item.author.name,
        "subreddit": item.subreddit.display_name,
        "text": text[:500],
        "url": f"https://reddit.com{item.permalink}",
        "score": item.score,
    }


def load_contacted(path: Path) -> set:
    if not path.exists():
        return set()
    return set(json.loads(path.read_text()))


def search_reddit(reddit: praw.Reddit, contacted: set) -> list[dict]:
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

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd outreach && pytest tests/test_reddit_search.py -v
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add outreach/reddit_search.py outreach/tests/test_reddit_search.py
git commit -m "feat: add reddit search filtering functions with tests"
```

---

## Task 4: Reddit Search — PRAW Integration Tests

**Files:**
- Modify: `outreach/tests/test_reddit_search.py` (add search_reddit tests)

- [ ] **Step 1: Add search_reddit tests to test_reddit_search.py**

Append to the bottom of `outreach/tests/test_reddit_search.py`:

```python
from unittest.mock import patch
import reddit_search
from reddit_search import search_reddit


def test_search_reddit_returns_valid_leads():
    item = make_item()
    mock_reddit = MagicMock()
    mock_subreddit = MagicMock()
    mock_reddit.subreddit.return_value = mock_subreddit
    mock_subreddit.search.return_value = [item]

    with patch.object(reddit_search, "SUBREDDITS", ["books"]), \
         patch.object(reddit_search, "SEARCH_TERMS", ["too many books"]):
        leads = search_reddit(mock_reddit, contacted=set())

    assert len(leads) == 1
    assert leads[0]["author"] == "reader_99"


def test_search_reddit_deduplicates_by_permalink():
    item = make_item()  # same permalink for both search terms
    mock_reddit = MagicMock()
    mock_subreddit = MagicMock()
    mock_reddit.subreddit.return_value = mock_subreddit
    mock_subreddit.search.return_value = [item]

    with patch.object(reddit_search, "SUBREDDITS", ["books"]), \
         patch.object(reddit_search, "SEARCH_TERMS", ["too many books", "reading list"]):
        leads = search_reddit(mock_reddit, contacted=set())

    assert len(leads) == 1


def test_search_reddit_excludes_contacted():
    item = make_item(username="reader_99")
    mock_reddit = MagicMock()
    mock_subreddit = MagicMock()
    mock_reddit.subreddit.return_value = mock_subreddit
    mock_subreddit.search.return_value = [item]

    with patch.object(reddit_search, "SUBREDDITS", ["books"]), \
         patch.object(reddit_search, "SEARCH_TERMS", ["too many books"]):
        leads = search_reddit(mock_reddit, contacted={"reader_99"})

    assert len(leads) == 0


def test_search_reddit_excludes_old_posts():
    item = make_item(created_days_ago=45)
    mock_reddit = MagicMock()
    mock_subreddit = MagicMock()
    mock_reddit.subreddit.return_value = mock_subreddit
    mock_subreddit.search.return_value = [item]

    with patch.object(reddit_search, "SUBREDDITS", ["books"]), \
         patch.object(reddit_search, "SEARCH_TERMS", ["too many books"]):
        leads = search_reddit(mock_reddit, contacted=set())

    assert len(leads) == 0
```

- [ ] **Step 2: Run new tests to verify they pass**

```bash
cd outreach && pytest tests/test_reddit_search.py -v
```

Expected: all tests PASS (search_reddit is already implemented in Task 3).

- [ ] **Step 3: Commit**

```bash
git add outreach/tests/test_reddit_search.py
git commit -m "test: add search_reddit integration tests with PRAW mocks"
```

---

## Task 5: Message Generator (TDD)

**Files:**
- Create: `outreach/tests/test_message_generator.py`
- Create: `outreach/message_generator.py`

- [ ] **Step 1: Write failing tests**

```python
# outreach/tests/test_message_generator.py

from unittest.mock import MagicMock
from message_generator import generate_message


def make_lead(author="thesis_survivor", subreddit="GradSchool"):
    return {
        "author": author,
        "subreddit": subreddit,
        "text": "I have 15 PDFs assigned this semester and no time to read them all",
        "url": "https://reddit.com/r/GradSchool/comments/abc/post/",
        "score": 42,
    }


def make_mock_client(response_text="Hey, saw your post about PDFs..."):
    mock_client = MagicMock()
    mock_content = MagicMock()
    mock_content.text = response_text
    mock_client.messages.create.return_value.content = [mock_content]
    return mock_client


def test_generate_message_returns_string():
    result = generate_message(make_lead(), make_mock_client())
    assert isinstance(result, str)
    assert len(result) > 0


def test_generate_message_strips_whitespace():
    client = make_mock_client("  message with spaces  ")
    result = generate_message(make_lead(), client)
    assert result == "message with spaces"


def test_generate_message_uses_haiku_model():
    client = make_mock_client()
    generate_message(make_lead(), client)
    call_kwargs = client.messages.create.call_args[1]
    assert call_kwargs["model"] == "claude-haiku-4-5-20251001"


def test_generate_message_max_tokens_is_300():
    client = make_mock_client()
    generate_message(make_lead(), client)
    call_kwargs = client.messages.create.call_args[1]
    assert call_kwargs["max_tokens"] == 300


def test_generate_message_includes_author_in_user_prompt():
    client = make_mock_client()
    generate_message(make_lead(author="thesis_survivor"), client)
    call_kwargs = client.messages.create.call_args[1]
    user_message = call_kwargs["messages"][0]["content"]
    assert "thesis_survivor" in user_message


def test_generate_message_includes_lead_text_in_user_prompt():
    client = make_mock_client()
    lead = make_lead()
    generate_message(lead, client)
    call_kwargs = client.messages.create.call_args[1]
    user_message = call_kwargs["messages"][0]["content"]
    assert "15 PDFs" in user_message
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd outreach && pytest tests/test_message_generator.py -v
```

Expected: `ModuleNotFoundError: No module named 'message_generator'`

- [ ] **Step 3: Implement message_generator.py**

```python
# outreach/message_generator.py

import anthropic
from config import BOOKDIGEST_DESCRIPTION

SYSTEM_PROMPT = f"""You are writing a short, genuine Reddit DM on behalf of Marcus, the solo founder of BookDigest.

About BookDigest:
{BOOKDIGEST_DESCRIPTION}

Rules:
- Reference something specific the person wrote — quote or paraphrase a concrete detail from their post
- Maximum 4 sentences total
- Conversational and warm, not promotional or salesy
- Offer 7 days of free Reader access in exchange for honest feedback
- Do not mention AI or that this message was generated
- Do not use hype words like "amazing", "incredible", "game-changer"
- Sign off with: "— Marcus, founder of BookDigest"
"""


def generate_message(lead: dict, client: anthropic.Anthropic) -> str:
    user_prompt = (
        f"Write a Reddit DM to u/{lead['author']} from r/{lead['subreddit']}.\n\n"
        f"Their post:\n\"\"\"{lead['text']}\"\"\"\n\n"
        f"Post URL: {lead['url']}"
    )

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=300,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_prompt}],
    )
    return response.content[0].text.strip()
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd outreach && pytest tests/test_message_generator.py -v
```

Expected: all 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add outreach/message_generator.py outreach/tests/test_message_generator.py
git commit -m "feat: add message generator with Claude haiku integration"
```

---

## Task 6: File Helpers + Interactive Loop (TDD)

**Files:**
- Create: `outreach/tests/test_outreach.py`
- Create: `outreach/outreach.py`

- [ ] **Step 1: Write failing tests**

```python
# outreach/tests/test_outreach.py

import json
import tempfile
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from outreach import add_to_contacted, run_interactive_review, save_to_queue


def make_lead(author="reader_99", subreddit="books"):
    return {
        "author": author,
        "subreddit": subreddit,
        "text": "I have too many books and no time",
        "url": "https://reddit.com/r/books/comments/abc/",
        "score": 42,
    }


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


# ── add_to_contacted ───────────────────────────────────────────────────────────

def test_add_to_contacted_creates_file(tmp_path):
    path = tmp_path / "contacted.json"
    add_to_contacted("reader_99", path)
    assert path.exists()


def test_add_to_contacted_stores_username(tmp_path):
    path = tmp_path / "contacted.json"
    add_to_contacted("reader_99", path)
    data = json.loads(path.read_text())
    assert "reader_99" in data


def test_add_to_contacted_appends_to_existing(tmp_path):
    path = tmp_path / "contacted.json"
    path.write_text(json.dumps(["user1"]))
    add_to_contacted("user2", path)
    data = json.loads(path.read_text())
    assert "user1" in data
    assert "user2" in data


def test_add_to_contacted_no_duplicates(tmp_path):
    path = tmp_path / "contacted.json"
    add_to_contacted("reader_99", path)
    add_to_contacted("reader_99", path)
    data = json.loads(path.read_text())
    assert data.count("reader_99") == 1


# ── run_interactive_review ─────────────────────────────────────────────────────

def test_review_saves_lead_on_y(tmp_path):
    queue = tmp_path / "queue.md"
    contacted = tmp_path / "contacted.json"
    mock_client = MagicMock()

    with patch("outreach.generate_message", return_value="Hi there!"), \
         patch("rich.prompt.Prompt.ask", return_value="y"):
        run_interactive_review(
            [make_lead()], mock_client,
            queue_path=queue, contacted_path=contacted,
        )

    assert queue.exists()
    assert "reader_99" in queue.read_text()
    assert "reader_99" in json.loads(contacted.read_text())


def test_review_skips_lead_on_n(tmp_path):
    queue = tmp_path / "queue.md"
    contacted = tmp_path / "contacted.json"
    mock_client = MagicMock()

    with patch("outreach.generate_message", return_value="Hi!"), \
         patch("rich.prompt.Prompt.ask", return_value="n"):
        run_interactive_review(
            [make_lead()], mock_client,
            queue_path=queue, contacted_path=contacted,
        )

    assert not queue.exists()
    assert not contacted.exists()


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
    leads = [make_lead("user1"), make_lead("user2")]

    with patch("outreach.generate_message", return_value="Hi!"), \
         patch("rich.prompt.Prompt.ask", return_value="q"):
        run_interactive_review(
            leads, mock_client,
            queue_path=queue, contacted_path=contacted,
        )

    # quit before saving anything
    assert not queue.exists()


def test_review_handles_empty_leads_gracefully(tmp_path):
    mock_client = MagicMock()
    # should not raise
    run_interactive_review(
        [], mock_client,
        queue_path=tmp_path / "q.md",
        contacted_path=tmp_path / "c.json",
    )
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd outreach && pytest tests/test_outreach.py -v
```

Expected: `ModuleNotFoundError: No module named 'outreach'`

- [ ] **Step 3: Implement outreach.py**

```python
# outreach/outreach.py

import json
import os
from datetime import datetime
from pathlib import Path

import anthropic
import praw
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt

from message_generator import generate_message
from reddit_search import load_contacted, search_reddit

load_dotenv()

QUEUE_FILE = Path("outreach-queue.md")
CONTACTED_FILE = Path("contacted.json")

console = Console()


def save_to_queue(lead: dict, message: str, path: Path) -> None:
    entry = (
        f"## u/{lead['author']} · r/{lead['subreddit']}\n"
        f"**URL:** {lead['url']}\n"
        f"**Datum:** {datetime.now().strftime('%Y-%m-%d')}\n\n"
        f"{message}\n\n"
        f"Status: [ ] Skickat\n\n---\n\n"
    )
    with open(path, "a", encoding="utf-8") as f:
        f.write(entry)


def add_to_contacted(username: str, path: Path) -> None:
    contacted = load_contacted(path)
    contacted.add(username)
    path.write_text(json.dumps(sorted(contacted), indent=2))


def run_interactive_review(
    leads: list[dict],
    client: anthropic.Anthropic,
    queue_path: Path = QUEUE_FILE,
    contacted_path: Path = CONTACTED_FILE,
) -> None:
    total = len(leads)

    if total == 0:
        console.print("[yellow]Inga nya leads hittades.[/yellow]")
        return

    for i, lead in enumerate(leads, 1):
        console.rule(
            f"[bold]Lead {i}/{total} · r/{lead['subreddit']} · u/{lead['author']}[/bold]"
        )
        console.print(f"[dim]{lead['url']}[/dim]")
        console.print(Panel(lead["text"][:400], title="Deras inlägg", border_style="dim"))

        console.print("[cyan]Genererar meddelande...[/cyan]")
        message = generate_message(lead, client)
        console.print(Panel(message, title="Förslag på meddelande", border_style="green"))

        choice = Prompt.ask(
            "[y] Spara  [n] Hoppa  [e] Redigera  [q] Avsluta",
            choices=["y", "n", "e", "q"],
        )

        if choice == "q":
            console.print("[yellow]Avslutar.[/yellow]")
            break
        elif choice == "n":
            continue
        elif choice == "e":
            message = Prompt.ask("Skriv ditt meddelande")
            save_to_queue(lead, message, queue_path)
            add_to_contacted(lead["author"], contacted_path)
            console.print("[green]✓ Sparat.[/green]")
        elif choice == "y":
            save_to_queue(lead, message, queue_path)
            add_to_contacted(lead["author"], contacted_path)
            console.print("[green]✓ Sparat.[/green]")

    console.print(f"\n[bold green]Klar! Godkända leads sparade i {queue_path}[/bold green]")


def main() -> None:
    reddit = praw.Reddit(
        client_id=os.environ["REDDIT_CLIENT_ID"],
        client_secret=os.environ["REDDIT_CLIENT_SECRET"],
        user_agent=os.environ.get("REDDIT_USER_AGENT", "BookDigest Outreach Bot/1.0"),
    )
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    console.print("[bold]BookDigest Outreach Agent[/bold]\n")
    console.print("Söker Reddit efter leads...")

    contacted = load_contacted(CONTACTED_FILE)
    leads = search_reddit(reddit, contacted)

    console.print(f"[green]{len(leads)} leads hittade.[/green]\n")

    run_interactive_review(leads, client)


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd outreach && pytest tests/test_outreach.py -v
```

Expected: all 15 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add outreach/outreach.py outreach/tests/test_outreach.py
git commit -m "feat: add CLI interactive review loop with file helpers"
```

---

## Task 7: Full Test Suite + .gitignore

**Files:**
- Create: `outreach/.gitignore`

- [ ] **Step 1: Run the full test suite**

```bash
cd outreach && pytest tests/ -v
```

Expected: all tests PASS. Example output:
```
tests/test_reddit_search.py::test_is_recent_within_30_days PASSED
tests/test_reddit_search.py::test_is_recent_older_than_30_days PASSED
... (all green)
```

- [ ] **Step 2: Create .gitignore for the outreach directory**

```
# outreach/.gitignore
.env
contacted.json
outreach-queue.md
__pycache__/
.pytest_cache/
*.pyc
```

- [ ] **Step 3: Create a Reddit app for API access**

1. Go to https://www.reddit.com/prefs/apps
2. Click **"create another app"**
3. Name: `BookDigest Outreach`
4. Type: **script**
5. Redirect URI: `http://localhost:8080`
6. Click **Create app**
7. Copy the **client ID** (under the app name) and **client secret**
8. Create `outreach/.env` from `.env.example` and fill in the values

- [ ] **Step 4: Commit**

```bash
git add outreach/.gitignore
git commit -m "chore: add outreach .gitignore and complete test suite"
```

---

## Task 8: Smoke Test (Manual)

This task runs the agent for real to verify the end-to-end flow works.

- [ ] **Step 1: Run the agent**

```bash
cd outreach && python outreach.py
```

Expected:
```
BookDigest Outreach Agent

Söker Reddit efter leads...
X leads hittade.

──────────── Lead 1/X · r/books · u/some_user ────────────
...
```

- [ ] **Step 2: Approve one lead with [y] and verify outreach-queue.md**

Open `outreach/outreach-queue.md` and verify it contains:
- The username and subreddit
- A personalized message referencing what they wrote
- `Status: [ ] Skickat`

- [ ] **Step 3: Verify contacted.json was updated**

```bash
cat outreach/contacted.json
```

Expected: JSON array containing the approved username.

- [ ] **Step 4: Re-run and verify the approved user does not appear again**

```bash
python outreach.py
```

Expected: the previously approved user is absent from the leads list.

- [ ] **Step 5: Final commit**

```bash
git add outreach/
git commit -m "feat: outreach agent complete — Reddit search, Claude drafts, interactive approval"
```

---

## Known Limitation

Granting 7-day Reader access is a manual step: go to the Supabase dashboard → `user_profiles` table → find the user's row → set `tier = 'reader'`. There is currently no expiry mechanism in the DB schema. Set a calendar reminder to revert the tier after 7 days, or add a `trial_expires_at` column in a future sprint.
