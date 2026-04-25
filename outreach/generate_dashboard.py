# outreach/generate_dashboard.py

import json
import re
import webbrowser
from collections import defaultdict
from datetime import datetime, timedelta
from pathlib import Path

CONTACTED_FILE = Path("contacted.json")
QUEUE_FILE = Path("outreach-queue.md")
RUNS_FILE = Path("runs.json")
OUTPUT_FILE = Path("dashboard.html")


# ── Parsing helpers ────────────────────────────────────────────────────────────

def parse_queue_unsent_count(queue_text: str) -> int:
    return queue_text.count("Status: [ ] Skickat")


def parse_queue_entries(queue_text: str, unsent_only: bool = False) -> list[dict]:
    blocks = [b.strip() for b in queue_text.split("---") if b.strip()]
    entries = []
    for block in blocks:
        author_match = re.search(r"^##\s+(?:u/)?(\S+)", block, re.MULTILINE)
        date_match = re.search(r"\*\*Datum:\*\*\s+(\S+)", block)
        platform_match = re.search(r"\*\*Platform:\*\*\s+(\S+)", block)
        sent = "[x] Skickat" in block

        if not author_match:
            continue

        entry = {
            "author": author_match.group(1).rstrip("·").strip(),
            "date": date_match.group(1) if date_match else "",
            "platform": platform_match.group(1) if platform_match else "reddit",
            "sent": sent,
        }
        if unsent_only and sent:
            continue
        entries.append(entry)
    return entries


def compute_stats(contacted: list[dict], queue_text: str, runs: list[dict]) -> dict:
    today = datetime.now()
    week_ago = today - timedelta(days=7)

    by_platform: dict[str, int] = defaultdict(int)
    this_week = 0
    for entry in contacted:
        by_platform[entry["platform"]] += 1
        try:
            entry_date = datetime.strptime(entry["date"], "%Y-%m-%d")
            if entry_date >= week_ago:
                this_week += 1
        except ValueError:
            pass

    unsent = parse_queue_unsent_count(queue_text)

    approval_rate = None
    if runs:
        total_found = sum(r["found"] for r in runs)
        total_approved = sum(r["approved"] for r in runs)
        if total_found > 0:
            approval_rate = round(total_approved / total_found * 100)

    return {
        "total": len(contacted),
        "this_week": this_week,
        "unsent": unsent,
        "by_platform": dict(by_platform),
        "approval_rate": approval_rate,
    }


# ── HTML generation ────────────────────────────────────────────────────────────

def _platform_bar(platform: str, count: int, total: int) -> str:
    pct = round(count / total * 100) if total else 0
    color = "#ff6314" if platform == "reddit" else "#ff6600"
    label = platform.title()
    return f"""
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div style="color:{color};width:120px;font-size:0.85rem">{label}</div>
        <div style="flex:1;background:#2a2a3e;border-radius:4px;height:10px">
          <div style="background:{color};width:{pct}%;height:100%;border-radius:4px"></div>
        </div>
        <div style="color:#ccc;font-size:0.85rem;width:28px;text-align:right">{count}</div>
      </div>"""


def _lead_row(entry: dict) -> str:
    color = "#a78bfa" if entry["platform"] == "reddit" else "#f59e0b"
    return f"""
      <div style="border-bottom:1px solid #2a2a3e;padding:10px 0;display:flex;justify-content:space-between;align-items:center">
        <div>
          <span style="color:{color};font-size:0.88rem">{entry['author']}</span>
          <span style="color:#444;margin:0 6px">·</span>
          <span style="color:#666;font-size:0.78rem">{entry['platform'].title()}</span>
        </div>
        <span style="color:#666;font-size:0.78rem">{entry['date']}</span>
      </div>"""


def generate_html(stats: dict, unsent_leads: list[dict]) -> str:
    approval_html = (
        f'<div style="font-size:2rem;font-weight:700;color:#f59e0b">{stats["approval_rate"]}%</div>'
        if stats["approval_rate"] is not None
        else '<div style="font-size:1.2rem;color:#555">–</div>'
    )

    platform_bars = "".join(
        _platform_bar(p, c, stats["total"])
        for p, c in sorted(stats["by_platform"].items(), key=lambda x: -x[1])
    )

    lead_rows = "".join(_lead_row(e) for e in unsent_leads[:5])
    if not lead_rows:
        lead_rows = '<div style="color:#555;padding:10px 0">Inga ej skickade leads.</div>'

    generated = datetime.now().strftime("%Y-%m-%d %H:%M")

    return f"""<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8">
<title>BookDigest Outreach Dashboard</title>
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ background: #0f0f1a; color: #e0e0e0; font-family: -apple-system, sans-serif; padding: 32px; }}
  h1 {{ font-size: 1.4rem; margin-bottom: 4px; }}
  .sub {{ color: #555; font-size: 0.8rem; margin-bottom: 28px; }}
  .grid {{ display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 20px; }}
  .card {{ background: #1e1e2e; border: 1px solid #2a2a3e; border-radius: 8px; padding: 16px; text-align: center; }}
  .num {{ font-size: 2rem; font-weight: 700; }}
  .lbl {{ font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }}
  .section {{ background: #1e1e2e; border: 1px solid #2a2a3e; border-radius: 8px; padding: 16px; margin-bottom: 16px; }}
  .sec-title {{ font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }}
</style>
</head>
<body>
<h1>BookDigest Outreach Dashboard</h1>
<div class="sub">Genererad {generated} · <a href="outreach-queue.md" style="color:#555">outreach-queue.md</a></div>

<div class="grid">
  <div class="card"><div class="num" style="color:#a78bfa">{stats['total']}</div><div class="lbl">Totalt kontaktade</div></div>
  <div class="card"><div class="num" style="color:#34d399">{stats['this_week']}</div><div class="lbl">Den här veckan</div></div>
  <div class="card"><div class="num" style="color:#60a5fa">{stats['unsent']}</div><div class="lbl">Ej skickade</div></div>
  <div class="card">{approval_html}<div class="lbl">Godkännandegrad</div></div>
</div>

<div class="section">
  <div class="sec-title">Plattformsfördelning</div>
  {platform_bars if platform_bars else '<div style="color:#555">Inga data ännu.</div>'}
</div>

<div class="section">
  <div class="sec-title">Ej skickade (senaste 5)</div>
  {lead_rows}
</div>
</body>
</html>"""


def main() -> None:
    contacted = []
    if CONTACTED_FILE.exists():
        data = json.loads(CONTACTED_FILE.read_text())
        if data and isinstance(data[0], str):
            contacted = [{"username": u, "platform": "reddit", "date": "unknown"} for u in data]
        else:
            contacted = data

    queue_text = QUEUE_FILE.read_text(encoding="utf-8") if QUEUE_FILE.exists() else ""
    runs = json.loads(RUNS_FILE.read_text()) if RUNS_FILE.exists() else []

    stats = compute_stats(contacted, queue_text, runs)
    unsent_leads = parse_queue_entries(queue_text, unsent_only=True)

    html = generate_html(stats, unsent_leads)
    OUTPUT_FILE.write_text(html, encoding="utf-8")

    print(f"Dashboard genererat: {OUTPUT_FILE.resolve()}")
    webbrowser.open(OUTPUT_FILE.resolve().as_uri())


if __name__ == "__main__":
    main()
