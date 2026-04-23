# outreach/tests/test_outreach.py

import json
from pathlib import Path
from unittest.mock import MagicMock, patch

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
    # Flow: "y" (show draft) → "y" (save)
    queue = tmp_path / "queue.md"
    contacted = tmp_path / "contacted.json"
    mock_client = MagicMock()

    with patch("outreach.generate_message", return_value="Hi there!"), \
         patch("rich.prompt.Prompt.ask", side_effect=["y", "y"]):
        run_interactive_review(
            [make_lead()], mock_client,
            queue_path=queue, contacted_path=contacted,
        )

    assert queue.exists()
    assert "reader_99" in queue.read_text()
    assert "reader_99" in json.loads(contacted.read_text())


def test_review_skips_lead_on_n(tmp_path):
    # "n" on first prompt → skips without generating message
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
    # Flow: "y" (show draft) → "e" (edit) → custom message text
    queue = tmp_path / "queue.md"
    contacted = tmp_path / "contacted.json"
    mock_client = MagicMock()

    with patch("outreach.generate_message", return_value="Original draft"), \
         patch("rich.prompt.Prompt.ask", side_effect=["y", "e", "My custom message"]):
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

    assert not queue.exists()


def test_review_skips_lead_on_api_error(tmp_path):
    # If Claude API fails, lead is skipped gracefully
    queue = tmp_path / "queue.md"
    contacted = tmp_path / "contacted.json"
    mock_client = MagicMock()

    with patch("outreach.generate_message", side_effect=RuntimeError("timeout")), \
         patch("rich.prompt.Prompt.ask", return_value="y"):
        run_interactive_review(
            [make_lead()], mock_client,
            queue_path=queue, contacted_path=contacted,
        )

    assert not queue.exists()
    assert not contacted.exists()


def test_review_handles_empty_leads_gracefully(tmp_path):
    mock_client = MagicMock()
    # should not raise
    run_interactive_review(
        [], mock_client,
        queue_path=tmp_path / "q.md",
        contacted_path=tmp_path / "c.json",
    )
