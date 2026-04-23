# outreach/outreach.py

import json
import os
from datetime import datetime
from pathlib import Path

import anthropic
import praw
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt

from message_generator import generate_message
from reddit_search import load_contacted, search_reddit

load_dotenv()

QUEUE_FILE = Path("outreach-queue.md")
CONTACTED_FILE = Path("contacted.json")

console = Console()


def save_to_queue(lead: dict, message: str, path: Path) -> None:
    entry = (
        f"## u/{lead['author']} · r/{lead['subreddit']}\n"
        f"**URL:** {lead['url']}\n"
        f"**Datum:** {datetime.now().strftime('%Y-%m-%d')}\n\n"
        f"{message}\n\n"
        f"Status: [ ] Skickat\n\n---\n\n"
    )
    with open(path, "a", encoding="utf-8") as f:
        f.write(entry)


def add_to_contacted(username: str, path: Path) -> None:
    contacted = load_contacted(path)
    contacted.add(username)
    path.write_text(json.dumps(sorted(contacted), indent=2))


def run_interactive_review(
    leads: list[dict],
    client: anthropic.Anthropic,
    queue_path: Path = QUEUE_FILE,
    contacted_path: Path = CONTACTED_FILE,
) -> None:
    total = len(leads)

    if total == 0:
        console.print("[yellow]Inga nya leads hittades.[/yellow]")
        return

    for i, lead in enumerate(leads, 1):
        console.rule(
            f"[bold]Lead {i}/{total} · r/{lead['subreddit']} · u/{lead['author']}[/bold]"
        )
        console.print(f"[dim]{lead['url']}[/dim]")
        console.print(Panel(lead["text"][:400], title="Deras inlägg", border_style="dim"))

        console.print("[cyan]Genererar meddelande...[/cyan]")
        message = generate_message(lead, client)
        console.print(Panel(message, title="Förslag på meddelande", border_style="green"))

        choice = Prompt.ask(
            "[y] Spara  [n] Hoppa  [e] Redigera  [q] Avsluta",
            choices=["y", "n", "e", "q"],
        )

        if choice == "q":
            console.print("[yellow]Avslutar.[/yellow]")
            break
        elif choice == "n":
            continue
        elif choice == "e":
            message = Prompt.ask("Skriv ditt meddelande")
            save_to_queue(lead, message, queue_path)
            add_to_contacted(lead["author"], contacted_path)
            console.print("[green]✓ Sparat.[/green]")
        elif choice == "y":
            save_to_queue(lead, message, queue_path)
            add_to_contacted(lead["author"], contacted_path)
            console.print("[green]✓ Sparat.[/green]")


def main() -> None:
    reddit = praw.Reddit(
        client_id=os.environ["REDDIT_CLIENT_ID"],
        client_secret=os.environ["REDDIT_CLIENT_SECRET"],
        user_agent=os.environ.get("REDDIT_USER_AGENT", "BookDigest Outreach Bot/1.0"),
    )
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    console.print("[bold]BookDigest Outreach Agent[/bold]\n")
    console.print("Söker Reddit efter leads...")

    contacted = load_contacted(CONTACTED_FILE)
    leads = search_reddit(reddit, contacted)

    console.print(f"[green]{len(leads)} leads hittade.[/green]\n")

    run_interactive_review(leads, client)


if __name__ == "__main__":
    main()
