# outreach/platforms/reddit.py

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
from platforms.base import Lead


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


def build_lead(item) -> Lead:
    text = getattr(item, "selftext", None) or getattr(item, "body", "")
    return Lead(
        author=item.author.name,
        platform="reddit",
        text=text[:500],
        url=f"https://reddit.com{item.permalink}",
        score=item.score,
        subreddit=item.subreddit.display_name,
    )


def search(reddit: praw.Reddit, contacted: set) -> list[Lead]:
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
