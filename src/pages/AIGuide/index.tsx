import { useState, useRef, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles, Send, Loader2, Map, Wallet, Route, RotateCcw, ExternalLink, Compass,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { sendGuideMessage, SUGGESTED_PROMPTS } from '@/services/aiGuide'
import type { ChatMessage, GuideAction } from '@/types/ai'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'
import { useT } from '@/hooks/useT'

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export default function AIGuidePage() {
  const t = useT()
  const { language } = useAppStore()

  const welcome = useMemo(
    (): ChatMessage => ({
      id: 'welcome',
      role: 'assistant',
      content: t.ai.welcome,
      createdAt: new Date().toISOString(),
      isDemo: true,
      actions: [
        { label: 'Trip planner', to: '/trip-planner' },
        { label: 'Map', to: '/map' },
        { label: 'Attractions', to: '/attractions' },
      ],
    }),
    [t.ai.welcome]
  )

  const [messages, setMessages] = useState<ChatMessage[]>([welcome])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [demoMode, setDemoMode] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const prevWelcome = useRef(welcome.content)

  useEffect(() => {
    if (prevWelcome.current !== welcome.content && messages.length <= 1) {
      setMessages([welcome])
      prevWelcome.current = welcome.content
    }
  }, [welcome, messages.length])

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
        actions: res.actions,
      }
      setMessages((m) => [...m, assistant])
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: uid(),
          role: 'assistant',
          content: t.ai.error,
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
    setMessages([welcome])
    setDemoMode(true)
  }

  return (
    /* Full viewport under header; sticky composer above tab bar */
    <div className="mx-auto flex h-[calc(100dvh-3.25rem-env(safe-area-inset-top,0px))] max-w-2xl flex-col bg-[#f2f2f7] dark:bg-black lg:h-[calc(100dvh-4rem)]">
      {/* Header strip */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-black/[0.06] bg-white/90 px-3 py-2.5 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#1c1c1e]/90 sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#078930] via-[#0b6e99] to-[#d4a017] text-white shadow-sm">
            <Sparkles className="h-4.5 w-4.5" strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-[17px] font-semibold tracking-tight text-[#1c1c1e] dark:text-white">
              {t.ai.title}
            </h1>
            <p className="text-[11px] font-medium text-[#8e8e93]">
              {demoMode ? t.ai.demoMode : t.ai.liveMode}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Link to="/trip-planner">
            <Button size="icon" variant="ghost" className="h-10 w-10" title="Trip planner">
              <Compass className="h-4.5 w-4.5" />
            </Button>
          </Link>
          <Link to="/map">
            <Button size="icon" variant="ghost" className="h-10 w-10" title={t.nav.map}>
              <Map className="h-4.5 w-4.5" />
            </Button>
          </Link>
          <Link to="/budget" className="hidden sm:inline-flex">
            <Button size="icon" variant="ghost" className="h-10 w-10" title={t.nav.budget}>
              <Wallet className="h-4.5 w-4.5" />
            </Button>
          </Link>
          <Link to="/trips" className="hidden sm:inline-flex">
            <Button size="icon" variant="ghost" className="h-10 w-10" title={t.nav.trips}>
              <Route className="h-4.5 w-4.5" />
            </Button>
          </Link>
          <Button size="icon" variant="ghost" className="h-10 w-10" title={t.ai.reset} onClick={reset}>
            <RotateCcw className="h-4.5 w-4.5" />
          </Button>
        </div>
      </div>

      {/* Scrollable messages */}
      <div className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-3 py-4 sm:px-4">
        {messages.map((m) => (
          <div key={m.id} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div
              className={cn(
                'max-w-[88%] px-3.5 py-2.5 text-[15px] leading-relaxed tracking-tight sm:max-w-[85%]',
                m.role === 'user'
                  ? 'rounded-[1.15rem] rounded-br-md bg-[#078930] text-white shadow-sm'
                  : 'rounded-[1.15rem] rounded-bl-md border border-black/[0.04] bg-white text-[#1c1c1e] shadow-sm dark:border-white/[0.08] dark:bg-[#1c1c1e] dark:text-white'
              )}
            >
              <div className="whitespace-pre-wrap">{formatContent(m.content)}</div>
              {m.actions && m.actions.length > 0 && m.role === 'assistant' && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {m.actions.map((a) => (
                    <ActionChip key={a.to + a.label} action={a} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-[1.15rem] rounded-bl-md border border-black/[0.04] bg-white px-4 py-3 text-[14px] text-[#8e8e93] shadow-sm dark:border-white/[0.08] dark:bg-[#1c1c1e]">
              <Loader2 className="h-4 w-4 animate-spin text-[#078930]" /> {t.ai.thinking}
            </div>
          </div>
        )}
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* Sticky composer — above mobile tab bar */}
      <div
        className="shrink-0 border-t border-black/[0.06] bg-white/95 px-3 pt-2 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#1c1c1e]/95 sm:px-4"
        style={{
          paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        }}
      >
        {messages.length <= 2 && (
          <div className="mobile-chips mb-2.5 gap-1.5">
            {SUGGESTED_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                disabled={sending}
                onClick={() => send(p)}
                className="shrink-0 rounded-full border border-black/[0.08] bg-[#f2f2f7] px-3 py-2 text-[12px] font-medium text-[#3c3c43] active:bg-black/5 dark:border-white/10 dark:bg-white/10 dark:text-white/80"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
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
            placeholder={t.ai.placeholder}
            className="max-h-28 min-h-[44px] flex-1 resize-none rounded-[1.25rem] border border-black/[0.08] bg-[#f2f2f7] px-4 py-2.5 text-[16px] leading-snug text-[#1c1c1e] outline-none focus:border-[#078930]/40 focus:ring-2 focus:ring-[#078930]/15 dark:border-white/10 dark:bg-black dark:text-white"
            disabled={sending}
          />
          <Button
            type="submit"
            size="icon"
            className="h-11 w-11 shrink-0 rounded-full shadow-md shadow-[#078930]/25"
            disabled={sending || !input.trim()}
          >
            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  )
}

function ActionChip({ action }: { action: GuideAction }) {
  const cls =
    'inline-flex min-h-[32px] items-center gap-1 rounded-full border border-[#078930]/25 bg-[#078930]/10 px-3 py-1 text-[12px] font-semibold text-[#056b24] active:bg-[#078930]/15 dark:border-[#30d158]/30 dark:bg-[#30d158]/10 dark:text-[#30d158]'
  if (action.external) {
    return (
      <a href={action.to} target="_blank" rel="noopener noreferrer" className={cls}>
        {action.label} <ExternalLink className="h-3 w-3" />
      </a>
    )
  }
  return (
    <Link to={action.to} className={cls}>
      {action.label}
    </Link>
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
