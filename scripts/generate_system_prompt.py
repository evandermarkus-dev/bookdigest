"""
scripts/generate_system_prompt.py

Hämtar aktuell info från bookdigest.se, konverterar priser till lokala valutor
och genererar system prompts för Saga på flera språk.

Kör: python scripts/generate_system_prompt.py
Output: scripts/system_prompt_{sv,en,de,fr,da,no}.txt

Installera beroenden först:
  pip install anthropic httpx beautifulsoup4
"""

import anthropic
import httpx
import json
import re
from bs4 import BeautifulSoup
from datetime import datetime

BOOKDIGEST_URL = "https://www.bookdigest.se"
EXCHANGE_API_URL = "https://api.exchangerate-api.com/v4/latest/SEK"

SUPPORTED_LANGUAGES = {
    "sv": {"language": "Swedish",   "currency": "SEK", "symbol": "kr"},
    "en": {"language": "English",   "currency": "USD", "symbol": "$"},
    "de": {"language": "German",    "currency": "EUR", "symbol": "€"},
    "fr": {"language": "French",    "currency": "EUR", "symbol": "€"},
    "da": {"language": "Danish",    "currency": "EUR", "symbol": "€"},
    "no": {"language": "Norwegian", "currency": "EUR", "symbol": "€"},
}

EXTRACTION_PROMPT = """
Read this webpage for BookDigest and extract EXACTLY the following info as JSON.
For pricing, extract the numeric SEK price as a number (e.g. 79, not "79 kr").

{
  "supported_formats": ["list of file formats supported for upload"],
  "summary_styles": ["list of summary styles with short descriptions"],
  "onboarding_steps": ["step-by-step how the app works"],
  "pricing": [
    {
      "name": "plan name",
      "price_sek": 0,
      "summaries": "count/month or unlimited",
      "styles": "number of styles or description",
      "features": ["feature 1", "feature 2"]
    }
  ],
  "key_features": ["important features to mention"],
  "free_tier_highlights": ["what is free and requires no credit card"]
}

If you cannot find info for a field, set it to null. Do not invent anything.

Webpage:
{page_content}
"""

SYSTEM_PROMPT_TEMPLATE = """
You are Saga - BookDigest's warm and personal onboarding assistant.

Below is exact, up-to-date information about how BookDigest works.
Stick STRICTLY to this info - never say anything not found here.
Always respond in {language}. If the user writes in a different language, switch to that language.

=== BOOKDIGEST - CURRENT INFO (fetched {date}) ===

SUPPORTED UPLOAD FORMATS:
{supported_formats}

HOW THE APP WORKS (step by step):
{onboarding_steps}

SUMMARY STYLES:
{summary_styles}

PRICING (in {currency}, rates from {date}):
{pricing}

KEY FEATURES:
{key_features}

FREE TIER (emphasize this in onboarding):
{free_tier}

=== PERSONALITY AND BEHAVIOR ===
- Warm, encouraging, slightly playful - like a book-loving friend
- Never robotic or formal
- Short responses, max 3-4 sentences at a time
- Always end with a concrete question or next step
- If unsure about something - say so honestly and refer to bookdigest.se

ONBOARDING FLOW:
1. Welcome and ask their name
2. Ask if they have a PDF book ready to upload
3. Explain the 3 personalization questions (goals, experience, focus)
4. Ask which summary style they want to start with
5. Remind them the free tier needs no credit card
6. Encourage them to log in and try at bookdigest.se
"""


def fetch_page(url: str) -> str:
    resp = httpx.get(url, follow_redirects=True, timeout=10)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()
    return soup.get_text(separator="\n", strip=True)


def fetch_exchange_rates() -> dict:
    print("Fetching exchange rates...")
    resp = httpx.get(EXCHANGE_API_URL, timeout=10)
    resp.raise_for_status()
    return resp.json().get("rates", {})


def convert_price(price_sek: float, currency: str, symbol: str, rates: dict) -> str:
    if currency == "SEK":
        return f"{int(round(price_sek))} kr"
    rate = rates.get(currency)
    if not rate:
        return f"{int(round(price_sek))} SEK"
    converted = price_sek * rate
    rounded = round(converted) if converted >= 20 else round(converted * 2) / 2
    return f"{symbol}{rounded}" if symbol in ("$", "€", "£") else f"{rounded} {symbol}"


def extract_info_with_claude(page_text: str) -> dict:
    client = anthropic.Anthropic()
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=2000,
        messages=[{"role": "user", "content": EXTRACTION_PROMPT.format(page_content=page_text[:8000])}],
    )
    raw = response.content[0].text
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if match:
        return json.loads(match.group())
    raise ValueError("Could not parse JSON from Claude response")


def format_pricing(pricing_list: list, currency: str, symbol: str, rates: dict) -> str:
    lines = []
    for p in pricing_list:
        price_sek = p.get("price_sek") or 0
        price_str = "Free" if price_sek == 0 else f"{convert_price(price_sek, currency, symbol, rates)}/month"
        lines.append(f"- {p['name']} ({price_str}): {p.get('summaries','?')} summaries/month, {p.get('styles','?')} styles")
        for f in p.get("features", []):
            lines.append(f"  . {f}")
    return "\n".join(lines)


def generate_system_prompt(info: dict, lang_config: dict, rates: dict) -> str:
    currency, symbol = lang_config["currency"], lang_config["symbol"]
    return SYSTEM_PROMPT_TEMPLATE.format(
        language=lang_config["language"],
        currency=currency,
        date=datetime.now().strftime("%Y-%m-%d"),
        supported_formats=", ".join(info.get("supported_formats") or ["Unknown"]),
        onboarding_steps="\n".join(f"{i+1}. {s}" for i, s in enumerate(info.get("onboarding_steps") or [])),
        summary_styles="\n".join(f"- {s}" for s in (info.get("summary_styles") or [])),
        pricing=format_pricing(info.get("pricing") or [], currency, symbol, rates),
        key_features="\n".join(f"- {f}" for f in (info.get("key_features") or [])),
        free_tier="\n".join(f"- {f}" for f in (info.get("free_tier_highlights") or [])),
    )


def main():
    print(f"Fetching {BOOKDIGEST_URL}...")
    page_text = fetch_page(BOOKDIGEST_URL)

    print("Extracting info with Claude...")
    info = extract_info_with_claude(page_text)

    with open("scripts/extracted_info.json", "w", encoding="utf-8") as f:
        json.dump(info, f, ensure_ascii=False, indent=2)
    print("Saved: scripts/extracted_info.json")

    rates = fetch_exchange_rates()

    for lang_code, lang_config in SUPPORTED_LANGUAGES.items():
        prompt = generate_system_prompt(info, lang_config, rates)
        filename = f"scripts/system_prompt_{lang_code}.txt"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(prompt)
        print(f"Saved: {filename}")

    print("\nDone! Generated prompts for:", ", ".join(SUPPORTED_LANGUAGES.keys()))


if __name__ == "__main__":
    main()
