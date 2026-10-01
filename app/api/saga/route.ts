import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/lib/supabase-server"
import { checkRateLimit } from "@/lib/ratelimit"
import { SAGA_SYSTEM_PROMPT } from "@/lib/saga-prompt"

const client = new Anthropic()

const MAX_MESSAGES = 20
const MAX_MESSAGE_CHARS = 1000

type SagaMessage = { role: "user" | "assistant"; content: string }

function parseMessages(input: unknown): SagaMessage[] | null {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_MESSAGES) return null
  const messages: SagaMessage[] = []
  for (const m of input) {
    if (typeof m !== "object" || m === null) return null
    const { role, content } = m as Record<string, unknown>
    if (role !== "user" && role !== "assistant") return null
    if (typeof content !== "string" || !content.trim() || content.length > MAX_MESSAGE_CHARS) return null
    messages.push({ role, content })
  }
  // The client opens with a canned assistant greeting; the API requires the
  // conversation to start with a user turn, so drop leading assistant turns.
  while (messages.length && messages[0].role === "assistant") messages.shift()
  if (!messages.length || messages[messages.length - 1].role !== "user") return null
  return messages
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const rlResponse = await checkRateLimit("saga", user.id)
  if (rlResponse) return rlResponse

  const body = await request.json().catch(() => null)
  const messages = parseMessages(body?.messages)
  if (!messages) return NextResponse.json({ error: "Invalid messages" }, { status: 400 })

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: SAGA_SYSTEM_PROMPT,
      messages,
    })

    const reply = response.content.find((b) => b.type === "text")?.text ?? ""
    return NextResponse.json({ reply })
  } catch (err) {
    console.error("[saga] Claude request failed:", err)
    return NextResponse.json({ error: "Saga is unavailable right now" }, { status: 502 })
  }
}
