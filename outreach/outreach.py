# outreach/outreach.py

import json
from datetime import datetime
from pathlib import Path

import anthropic
from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt

from message_generator import generate_message
from platforms.base import Lead, add_to_contacted, load_contacted

QUEUE_FILE = Path("outreach-queue.md")
CONTACTED_FILE = Path("contacted.json")

console = Console()


def save_to_queue(lead: Lead, message: str, path: Path) -> None:
    platform_label = f"r/{lead.subreddit}" if lead.subreddit else lead.platform.title()
    entry = (
        f"## {lead.author} · {platform_label}\n"
        f"**Platform:** {lead.platform}\n"
        f"**URL:** {lead.url}\n"
        f"**Datum:** {datetime.now().strftime('%Y-%m-%d')}\n\n"
        f"{message}\n\n"
        f"Status: [ ] Skickat\n\n---\n\n"
    )
    with open(path, "a", encoding="utf-8") as f:
        f.write(entry)


def run_interactive_review(
    leads: list[Lead],
    client: anthropic.Anthropic,
    queue_path: Path = QUEUE_FILE,
    contacted_path: Path = CONTACTED_FILE,
) -> tuple[int, int]:
    """Returns (approved_count, skipped_count)."""
    total = len(leads)
    approved = 0
    skipped = 0

    if total == 0:
        console.print("[yellow]Inga nya leads hittades.[/yellow]")
        return 0, 0

    for i, lead in enumerate(leads, 1):
        platform_label = f"r/{lead.subreddit}" if lead.subreddit else lead.platform.title()
        console.rule(
            f"[bold]Lead {i}/{total} · {platform_label} · {lead.author}[/bold]"
        )
        console.print(f"[dim]{lead.url}[/dim]")
        console.print(Panel(lead.text[:400], title="Deras inlägg", border_style="dim"))

        console.print("[cyan]Genererar meddelande...[/cyan]")
        message = generate_message(lead.__dict__, client)
        console.print(Panel(message, title="Förslag på meddelande", border_style="green"))

        choice = Prompt.ask(
            "[y] Spara  [n] Hoppa  [e] Redigera  [q] Avsluta",
            choices=["y", "n", "e", "q"],
        )

        if choice == "q":
            console.print("[yellow]Avslutar.[/yellow]")
            break
        elif choice == "n":
            skipped += 1
            continue
        elif choice == "e":
            message = Prompt.ask("Skriv ditt meddelande")
            save_to_queue(lead, message, queue_path)
            add_to_contacted(lead, contacted_path)
            approved += 1
            console.print("[green]✓ Sparat.[/green]")
        elif choice == "y":
            save_to_queue(lead, message, queue_path)
            add_to_contacted(lead, contacted_path)
            approved += 1
            console.print("[green]✓ Sparat.[/green]")

    console.print(f"\n[bold green]Klar! Godkända leads sparade i {queue_path}[/bold green]")
    console.print(f"Godkända: {approved} · Hoppade: {skipped}")
    return approved, skipped
