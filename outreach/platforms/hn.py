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
    text = hit.get("comment_text") or hit.get("story_text") or hit.get("title") or ""
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
                    "numericFilters": f"created_at_i>{cutoff},points>={_MIN_POINTS}",
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
