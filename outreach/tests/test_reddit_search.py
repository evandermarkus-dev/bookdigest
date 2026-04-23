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


def test_is_bot_deleted_author_returns_false():
    item = make_item()
    item.author = None
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
