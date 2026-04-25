# outreach/platforms/base.py

import json
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path


@dataclass
class Lead:
    author: str
    platform: str       # "reddit" | "hackernews"
    text: str
    url: str
    score: int
    subreddit: str | None = None


def load_contacted_entries(path: Path) -> list[dict]:
    if not path.exists():
        return []
    data = json.loads(path.read_text())
    if not data:
        return []
    if isinstance(data[0], str):
        migrated = [{"username": u, "platform": "reddit", "date": "unknown"} for u in data]
        path.write_text(json.dumps(migrated, indent=2))
        return migrated
    return data


def load_contacted(path: Path) -> set[str]:
    return {e["username"] for e in load_contacted_entries(path)}


def add_to_contacted(lead: Lead, path: Path) -> None:
    entries = load_contacted_entries(path)
    existing_usernames = {e["username"] for e in entries}
    if lead.author in existing_usernames:
        return
    entries.append({
        "username": lead.author,
        "platform": lead.platform,
        "date": datetime.now().strftime("%Y-%m-%d"),
    })
    path.write_text(json.dumps(entries, indent=2))
