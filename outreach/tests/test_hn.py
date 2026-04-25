# outreach/tests/test_hn.py

import time
from unittest.mock import patch

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
