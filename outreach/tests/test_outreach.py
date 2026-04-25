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
