import { useEffect, useRef, useState } from 'react'
import { Clock, Lock, Paperclip, Send, ShieldAlert, ShieldCheck } from 'lucide-react'
import { MicButton } from './Voice'
import { useStore } from '../store/Store'
import { cx, fmtTime } from '../lib/utils'

const PHONE = /(\+?\d[\d\s-]{8,}\d)/
const LINK = /(https?:\/\/|www\.|wa\.me|t\.me|instagram\.com)/i
const ABUSE = /\b(stupid|idiot|shut up|hate you|loser)\b/i
const PRIVATE = /\b(meet (me )?alone|don'?t tell (your )?(parents|anyone)|send (me )?(your )?photo)\b/i

export function checkMessage(text) {
  if (PHONE.test(text)) return 'Phone numbers are hidden for everyone’s safety. Please keep conversations inside Vidya Sethu.'
  if (LINK.test(text)) return 'External links and social-media handles are blocked in student chats.'
  if (ABUSE.test(text)) return 'This message may be hurtful. Please rephrase it kindly.'
  if (PRIVATE.test(text)) return 'This message was flagged by the safeguarding filter and has been sent to the school safeguarding lead for review.'
  return null
}

export function inWindow(win) {
  if (!win.enabled) return true
  const n = new Date(); const mins = n.getHours() * 60 + n.getMinutes()
  const [sh, sm] = win.start.split(':').map(Number); const [eh, em] = win.end.split(':').map(Number)
  return mins >= sh * 60 + sm && mins <= eh * 60 + em
}

const fmt12 = (hm) => { const [h, m] = hm.split(':').map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}` }

const AUTO = [
  [/doubt|understand|how|why|solve|question|\?/i, 'Good question! Try the first step and send me what you get — I’ll guide you from there. 😊'],
  [/sorry|late|absent|leave|sick|fever/i, 'Noted, thank you for informing. Please collect the notes from your class leader.'],
  [/thank/i, 'You’re welcome! Keep going 👍'],
]

export default function SecureChat({ threadId, me, other, autoReply = true, height = 'h-full', dark }) {
  const { state, mutate } = useStore()
  const [text, setText] = useState('')
  const [warn, setWarn] = useState(null)
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)
  const msgs = state.chats[threadId] || []
  const open = inWindow(state.chatWindow)
  useEffect(() => { endRef.current && endRef.current.scrollIntoView({ block: 'end' }) }, [msgs.length, typing])

  const send = (raw) => {
    const t = (raw ?? text).trim()
    if (!t) return
    const problem = checkMessage(t)
    if (problem) {
      setWarn(problem)
      if (PRIVATE.test(t)) mutate((d, { notify }) => notify('principal', `Safeguarding filter flagged a chat message in thread ${threadId}`, '🛡️'))
      return
    }
    setWarn(null)
    setText('')
    mutate((d) => { (d.chats[threadId] = d.chats[threadId] || []).push({ from: me.id, text: t, at: new Date().toISOString(), queued: !open && me.role !== 'teacher' }) })
    if (autoReply && open && other.role === 'teacher') {
      setTyping(true)
      const reply = (AUTO.find(([re]) => re.test(t)) || [null, 'Got it. I will check and reply in detail tomorrow in class.'])[1]
      setTimeout(() => { setTyping(false); mutate((d) => { d.chats[threadId].push({ from: other.id, text: reply, at: new Date().toISOString() }) }) }, 2200)
    }
  }

  return (
    <div className={cx('flex flex-col', height)}>
      <div className={cx('mx-4 mb-2 flex items-center gap-2 rounded-xl px-3 py-2 text-[11px]', dark ? 'bg-white/10 text-white/80' : 'bg-teal-50 text-teal-800')}>
        <ShieldCheck className="h-4 w-4 shrink-0" />
        <span>Numbers masked · safety filter on · chats visible to school safeguarding lead if reported</span>
      </div>
      {state.chatWindow.enabled && other.role === 'teacher' && (
        <div className={cx('mx-4 mb-2 flex items-center gap-2 rounded-xl px-3 py-2 text-[11px]', open ? 'bg-slate-100 text-slate-600' : 'bg-sun-50 text-sun-700')}>
          <Clock className="h-3.5 w-3.5 shrink-0" />
          {open ? `Teacher chat hours: ${fmt12(state.chatWindow.start)} – ${fmt12(state.chatWindow.end)} (open now)` : `Outside chat hours (${fmt12(state.chatWindow.start)} – ${fmt12(state.chatWindow.end)}). Messages are delivered when the window opens.`}
        </div>
      )}
      <div className="no-scrollbar flex-1 space-y-2 overflow-y-auto px-4 py-2">
        <div className="mx-auto w-fit rounded-full bg-slate-200/70 px-3 py-1 text-[10px] font-semibold text-slate-500"><Lock className="mr-1 inline h-3 w-3" />End-to-end encrypted</div>
        {msgs.map((m, i) => {
          const mine = m.from === me.id
          return (
            <div key={i} className={cx('flex', mine ? 'justify-end' : 'justify-start')}>
              <div className={cx('max-w-[80%] rounded-2xl px-3.5 py-2 text-[13.5px] leading-snug shadow-sm', mine ? 'rounded-br-md bg-primary text-white' : 'rounded-bl-md bg-card text-foreground ring-1 ring-slate-900/5')}>
                {m.text}
                <div className={cx('mt-0.5 text-right text-[10px]', mine ? 'text-white/60' : 'text-slate-400')}>{fmtTime(m.at)}{mine && (m.queued ? ' · Queued' : ' · ✓✓')}</div>
              </div>
            </div>
          )
        })}
        {typing && <div className="w-fit rounded-2xl bg-card px-4 py-3 shadow-sm ring-1 ring-slate-900/5"><span className="flex gap-1">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${i * 0.15}s` }} />)}</span></div>}
        <div ref={endRef} />
      </div>
      {warn && <div className="mx-4 mb-2 flex items-start gap-2 rounded-2xl bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700"><ShieldAlert className="mt-px h-4 w-4 shrink-0" />{warn}</div>}
      <form onSubmit={(e) => { e.preventDefault(); send() }} className="flex items-center gap-2 border-t border-border bg-card/90 px-3 pt-2.5 backdrop-blur-xl" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 10px)' }}>
        <button type="button" className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-slate-100" aria-label="Attach"><Paperclip className="h-5 w-5" /></button>
        <input value={text} onChange={(e) => { setText(e.target.value); setWarn(null) }} placeholder="Type a message…" className="min-w-0 flex-1 rounded-full bg-slate-100 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500" />
        {text ? <button type="submit" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal-500 text-white" aria-label="Send"><Send className="h-4 w-4" /></button>
          : <MicButton lang={state.lang} fallback="Miss, can you explain question 6 again?" onText={(t) => setText(t)} />}
      </form>
    </div>
  )
}
