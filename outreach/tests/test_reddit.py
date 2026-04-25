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
