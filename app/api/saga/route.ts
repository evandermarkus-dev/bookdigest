import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

export async function POST(request: Request) {
  const { messages, systemPrompt } = await request.json()

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: systemPrompt,
    messages,
  })

  const reply = response.content.find((b) => b.type === "text")?.text ?? ""
  return NextResponse.json({ reply })
}
