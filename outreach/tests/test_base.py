# outreach/tests/test_base.py

import json
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
