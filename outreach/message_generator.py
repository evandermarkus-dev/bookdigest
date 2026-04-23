# outreach/message_generator.py

import anthropic
from config import BOOKDIGEST_DESCRIPTION

SYSTEM_PROMPT = f"""You are writing a short, genuine Reddit DM on behalf of Marcus, the solo founder of BookDigest.

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


def generate_message(lead: dict, client: anthropic.Anthropic) -> str:
    user_prompt = (
        f"Write a Reddit DM to u/{lead['author']} from r/{lead['subreddit']}.\n\n"
        f"Their post:\n\"\"\"{lead['text']}\"\"\"\n\n"
        f"Post URL: {lead['url']}"
    )

    try:
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=300,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_prompt}],
        )
        return response.content[0].text.strip()
    except Exception as e:
        raise RuntimeError(f"Claude API call failed: {e}") from e
