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
