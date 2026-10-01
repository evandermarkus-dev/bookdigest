"use client"

import { useState, useRef, useEffect } from "react"

const WELCOME =
  "Hej och välkommen till BookDigest! 📚 Jag heter Saga och hjälper dig komma igång — det tar bara några minuter!\n\nVad heter du?"

const STEPS = [
  ["Jag heter Anna", "Jag heter Johan", "Jag heter Sara"],
  ["Ja, jag har en PDF redo", "Letar fortfarande", "Vilka stilar finns?"],
  ["Executive – snabb översikt", "Deep Study – djupare inlärning", "Action Plan – konkreta steg"],
  ["Hur laddar jag upp?", "Vad kostar det?", "Kom igång nu →"],
]

export default function SagaOnboarding() {
  const [messages, setMessages] = useState([{ role: "assistant", content: WELCOME }])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  async function send(text?: string) {
    const userMsg = text || input.trim()
    if (!userMsg) return
    setInput("")
    if (step < STEPS.length) setStep((s) => s + 1)

    const newMessages = [...messages, { role: "user", content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch("/api/saga", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      setMessages([...newMessages, { role: "assistant", content: data.reply || data.error || "Hmm, något gick snett!" }])
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Något gick fel. Försök igen!" }])
    }
    setLoading(false)
  }

  const currentReplies = STEPS[step] || []

  return (
    <div className="max-w-xl mx-auto py-6 px-4 font-sans">
      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg shrink-0">
          📚
        </div>
        <div>
          <p className="font-medium text-sm text-gray-900">Saga</p>
          <p className="text-xs text-gray-500">BookDigest · Onboarding-guide</p>
        </div>
        <span className="ml-auto text-xs px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
          Online
        </span>
      </div>

      <div className="min-h-64 max-h-96 overflow-y-auto border border-gray-100 rounded-xl p-4 bg-white flex flex-col gap-3 mb-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col gap-1 ${m.role === "user" ? "items-end" : "items-start"}`}>
            {m.role === "assistant" && <span className="text-xs text-gray-400 pl-1">Saga</span>}
            <div className={`max-w-xs px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap border border-gray-100 ${
              m.role === "user"
                ? "bg-emerald-50 text-emerald-900 rounded-2xl rounded-br-sm"
                : "bg-gray-50 text-gray-900 rounded-2xl rounded-bl-sm"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex flex-col items-start gap-1">
            <span className="text-xs text-gray-400 pl-1">Saga</span>
            <div className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm text-sm text-gray-400">
              skriver...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {currentReplies.length > 0 && !loading && (
        <div className="flex flex-wrap gap-2 mb-3">
          {currentReplies.map((r, i) => (
            <button key={i} onClick={() => send(r)}
              className="text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
              {r}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Skriv ett svar..."
          className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-300"
        />
        <button onClick={() => send()} disabled={loading || !input.trim()}
          className="px-4 py-2 text-sm rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 disabled:opacity-40">
          Skicka
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center mt-3">
        BookDigest · <a href="https://www.bookdigest.se" className="hover:underline">bookdigest.se</a>
      </p>
    </div>
  )
}
