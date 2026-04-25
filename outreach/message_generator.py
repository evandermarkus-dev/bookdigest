# outreach/message_generator.py

import anthropic
from config import BOOKDIGEST_DESCRIPTION

_SYSTEM_PROMPT_BASE = f"""You are writing a short, genuine outreach message on behalf of Marcus, the solo founder of BookDigest.

About BookDigest:
{BOOKDIGEST_DESCRIPTION}

Rules:
- Reference something specific the person wrote — quote or paraphrase a concrete detail from their post
- Maximum 4 sentences total
- Conversational and warm, not promotional or salesy
- Offer 7 days of free Reader access in exchange for honest feedback
- Do not mention AI or that this message was generated
- Do not use hype words like "amazing", "incredible", "game-changer"
- Sign off with: "— Marcus, founder of BookDigest"
"""


def _build_user_prompt(lead: dict) -> str:
    platform = lead.get("platform", "reddit")
    if platform == "hackernews":
        return (
            f"Write a Hacker News reply to {lead['author']}.\n\n"
            f"Their post:\n\"\"\"{lead['text']}\"\"\"\n\n"
            f"Post URL: {lead['url']}"
        )
    subreddit = lead.get("subreddit") or "unknown"
    return (
        f"Write a Reddit DM to u/{lead['author']} from r/{subreddit}.\n\n"
        f"Their post:\n\"\"\"{lead['text']}\"\"\"\n\n"
        f"Post URL: {lead['url']}"
    )


def generate_message(lead: dict, client: anthropic.Anthropic) -> str:
    user_prompt = _build_user_prompt(lead)

    try:
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=300,
            system=_SYSTEM_PROMPT_BASE,
            messages=[{"role": "user", "content": user_prompt}],
        )
        return response.content[0].text.strip()
    except Exception as e:
        raise RuntimeError(f"Claude API call failed: {e}") from e
