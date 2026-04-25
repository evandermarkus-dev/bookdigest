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
