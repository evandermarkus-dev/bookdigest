# outreach/run.py

import json
import os
import random
from datetime import datetime
from pathlib import Path

import anthropic
import praw
from dotenv import load_dotenv
from rich.console import Console

from outreach import CONTACTED_FILE, QUEUE_FILE, run_interactive_review
from platforms.base import load_contacted
from platforms.hn import search as hn_search
from platforms.reddit import search as reddit_search

load_dotenv()

RUNS_FILE = Path("runs.json")
console = Console()


def _append_run_stats(found: int, approved: int, skipped: int) -> None:
    runs = []
    if RUNS_FILE.exists():
        runs = json.loads(RUNS_FILE.read_text())
    runs.append({
        "date": datetime.now().strftime("%Y-%m-%d"),
        "found": found,
        "approved": approved,
        "skipped": skipped,
    })
    RUNS_FILE.write_text(json.dumps(runs, indent=2))


def main() -> None:
    load_dotenv()
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    contacted = load_contacted(CONTACTED_FILE)

    console.print("[bold]BookDigest Outreach Agent[/bold]\n")

    leads = []

    # Reddit (optional — skip gracefully if no credentials)
    reddit_id = os.environ.get("REDDIT_CLIENT_ID")
    if reddit_id:
        console.print("[dim]Söker Reddit...[/dim]")
        reddit = praw.Reddit(
            client_id=reddit_id,
            client_secret=os.environ["REDDIT_CLIENT_SECRET"],
            user_agent=os.environ.get("REDDIT_USER_AGENT", "BookDigest Outreach Bot/1.0"),
        )
        reddit_leads = reddit_search(reddit, contacted)
        console.print(f"[green]Reddit: {len(reddit_leads)} leads[/green]")
        leads.extend(reddit_leads)
    else:
        console.print("[yellow]REDDIT_CLIENT_ID saknas — hoppar över Reddit.[/yellow]")

    # Hacker News (always runs — no credentials needed)
    console.print("[dim]Söker Hacker News...[/dim]")
    hn_leads = hn_search(contacted)
    console.print(f"[green]Hacker News: {len(hn_leads)} leads[/green]")
    leads.extend(hn_leads)

    if not leads:
        console.print("[yellow]Inga nya leads hittades på någon plattform.[/yellow]")
        return

    random.shuffle(leads)
    console.print(f"\n[bold]{len(leads)} leads totalt. Startar granskning...[/bold]\n")

    approved, skipped = run_interactive_review(leads, client)
    _append_run_stats(found=len(leads), approved=approved, skipped=skipped)


if __name__ == "__main__":
    main()
