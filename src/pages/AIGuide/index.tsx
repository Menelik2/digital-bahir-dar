import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Send, Loader2, Map, Wallet, Route, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { sendGuideMessage, SUGGESTED_PROMPTS } from '@/services/aiGuide'
import type { ChatMessage } from '@/types/ai'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Selam! I'm the Digital Bahir Dar AI guide.\n\nAsk about Lake Tana, Blue Nile Falls, food, hotels, transport, safety, or a multi-day plan. I'll reply in DEMO mode until the server AI key is configured — tips are still useful for planning.\n\nPrices are estimates only; always verify locally.",
  createdAt: new Date().toISOString(),
  isDemo: true,
}

export default function AIGuidePage() {
  const { language } = useAppStore()
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [demoMode, setDemoMode] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || sending) return

    const userMsg: ChatMessage = {
      id: uid(),
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setSending(true)

    try {
      const res = await sendGuideMessage(next, language)
      if (res.fallback) setDemoMode(true)
      else setDemoMode(false)

      const assistant: ChatMessage = {
        id: uid(),
        role: 'assistant',
        content: res.reply,
        createdAt: new Date().toISOString(),
        isDemo: !!res.fallback,
      }
      setMessages((m) => [...m, assistant])
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: uid(),
          role: 'assistant',
          content: 'Something went wrong. Please try again or use Map / Budget / Trips.',
          createdAt: new Date().toISOString(),
          isDemo: true,
        },
      ])
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const reset = () => {
    setMessages([WELCOME])
    setDemoMode(true)
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-8rem)] max-w-2xl flex-col px-3 sm:px-4">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-teal-500 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">AI Guide</h1>
            <p className="text-[11px] text-slate-500">
              {demoMode ? 'DEMO knowledge · offline-safe' : 'Live model'}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <Link to="/map"><Button size="icon" variant="ghost" title="Map"><Map className="h-4 w-4" /></Button></Link>
          <Link to="/budget"><Button size="icon" variant="ghost" title="Budget"><Wallet className="h-4 w-4" /></Button></Link>
          <Link to="/trips"><Button size="icon" variant="ghost" title="Trips"><Route className="h-4 w-4" /></Button></Link>
          <Button size="icon" variant="ghost" title="Reset chat" onClick={reset}><RotateCcw className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto py-4">
        {messages.map((m) => (
          <div key={m.id} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div
              className={cn(
                'max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                m.role === 'user'
                  ? 'rounded-br-md bg-sky-600 text-white'
                  : 'rounded-bl-md bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
              )}
            >
              {m.role === 'assistant' && m.isDemo && (
                <span className="mb-1.5 inline-block rounded bg-amber-200/80 px-1.5 py-0.5 text-[10px] font-medium text-amber-900">DEMO</span>
              )}
              <div className="whitespace-pre-wrap">{formatContent(m.content)}</div>
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm text-slate-500 dark:bg-slate-800">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 2 && (
        <div className="mb-2 flex shrink-0 flex-wrap gap-1.5">
          {SUGGESTED_PROMPTS.map((p) => (
            <button key={p} type="button" disabled={sending} onClick={() => send(p)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              {p}
            </button>
          ))}
        </div>
      )}

      <form
        className="flex shrink-0 gap-2 border-t border-slate-200 py-3 dark:border-slate-800"
        onSubmit={(e) => { e.preventDefault(); send(input) }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send(input)
            }
          }}
          rows={1}
          placeholder="Ask about Bahir Dar…"
          className="max-h-28 min-h-[42px] flex-1 resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950"
          disabled={sending}
        />
        <Button type="submit" size="icon" className="h-[42px] w-[42px] shrink-0 rounded-xl" disabled={sending || !input.trim()}>
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  )
}

function formatContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}
