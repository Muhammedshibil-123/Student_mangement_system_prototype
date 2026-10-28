import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Bot, Send, ShieldCheck } from 'lucide-react'
import { MobileHeader } from '../../components/MobileShell'
import { ListenButton, MicButton } from '../../features/Voice'
import { useSession, useStore } from '../../store/Store'
import { AI_ANSWERS, EXAMS } from '../../data/seed'
import { cx, fmtDate } from '../../lib/utils'

function answer(q, grade) {
  const t = q.toLowerCase()
  const hit = AI_ANSWERS.find((a) => a.keys.some((k) => t.includes(k)))
  if (hit) return grade <= 5 ? hit.g4 : hit.g9
  if (/exam|test|when/.test(t)) {
    const e = EXAMS.slice().sort((a, b) => new Date(a.date) - new Date(b.date))[0]
    return `Your next exam is ${e.subject} on ${fmtDate(e.date, { weekday: 'long', day: 'numeric', month: 'long' })}, ${e.time}. This comes from the verified school timetable. 📅`
  }
  if (/hello|hi|namaskaram|hai/.test(t)) return grade <= 5 ? 'Hello friend! 👋 Ask me anything about your lessons — like “Why does it rain?”' : 'Namaskaram! I can explain textbook topics, solve doubts step-by-step, and tell you about exams. What are you studying today?'
  return grade <= 5
    ? 'Hmm, that is a great question! 🤔 I am not sure yet. Shall I ask your teacher for you?'
    : 'I don’t have a verified answer for that in your SCERT syllabus yet. I can send this doubt to your subject teacher, who will reply in the secure chat. 📨'
}

export default function Tutor() {
  const { state } = useStore()
  const { user } = useSession()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const [grade, setGrade] = useState(user.grade)
  const [msgs, setMsgs] = useState([{ from: 'bot', text: user.grade <= 5 ? `Hi ${user.short}! 🌟 I’m Vidya Bot. I explain things simply for Class ${user.grade}. Ask me anything!` : `Namaskaram ${user.short}! I’m your AI tutor. My answers are tuned for Class ${user.grade} (SCERT Kerala syllabus).` }])
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)
  const asked = useRef(false)
  const lang = state.lang

  const ask = (q) => {
    const t = (q ?? text).trim(); if (!t) return
    setText('')
    setMsgs((m) => [...m, { from: 'me', text: t }])
    setTyping(true)
    setTimeout(() => { setTyping(false); setMsgs((m) => [...m, { from: 'bot', text: answer(t, grade), grade }]) }, 1100)
  }
  useEffect(() => { const q = params.get('q'); if (q && !asked.current) { asked.current = true; ask(q) } }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { endRef.current && endRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' }) }, [msgs.length, typing])

  const chips = grade <= 5 ? ['Why does it rain?', 'How do plants eat?', 'Who was Gandhiji?'] : ['Explain photosynthesis', 'What is the discriminant?', 'Gandhi & freedom movement', 'When is my next exam?']

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileHeader back="/student" title="AI Tutor" sub="Age-adaptive · syllabus-aligned">
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-card p-2 shadow-card ring-1 ring-slate-900/5">
          <span className="shrink-0 pl-1 text-[11px] font-semibold text-slate-500">Explain for</span>
          {[4, 7, 9, 12].map((g) => (
            <button key={g} onClick={() => setGrade(g)} className={cx('flex-1 whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-bold', grade === g ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600')}>Class {g}</button>
          ))}
        </div>
      </MobileHeader>
      <div className="no-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-4 pt-1">
        {msgs.map((m, i) => (
          <div key={i} className={cx('flex gap-2', m.from === 'me' && 'justify-end')}>
            {m.from === 'bot' && <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-teal-400 to-sky-500 text-white"><Bot className="h-4 w-4" /></div>}
            <div className={cx('max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed', m.from === 'me' ? 'rounded-br-md bg-primary text-white' : 'rounded-bl-md bg-card text-foreground shadow-sm ring-1 ring-slate-900/5')}>
              {m.text}
              {m.from === 'bot' && i > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2">
                  <ListenButton text={m.text} lang={lang} />
                  {m.grade && <span className="text-[10px] font-semibold text-slate-400">Tuned for Class {m.grade}</span>}
                  {/teacher/.test(m.text) && <button onClick={() => nav('/student/chat/fathima')} className="rounded-full bg-sun-50 px-2.5 py-1 text-[11px] font-semibold text-sun-700">Send to teacher →</button>}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && <div className="ml-10 w-fit rounded-2xl bg-card px-4 py-3 shadow-sm"><span className="flex gap-1">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-400" style={{ animationDelay: `${i * 0.15}s` }} />)}</span></div>}
        <div ref={endRef} />
      </div>
      <div className="border-t border-border bg-card/90 px-3 pt-2.5 backdrop-blur-xl" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 10px)' }}>
        <div className="no-scrollbar mask-x -mx-3 mb-2 flex gap-1.5 overflow-x-auto px-3">
          {chips.map((c) => <button key={c} onClick={() => ask(c)} className="shrink-0 rounded-full bg-card px-3 py-1.5 text-[11px] font-semibold text-foreground ring-1 ring-border transition-colors hover:bg-muted">{c}</button>)}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); ask() }} className="flex items-center gap-2 rounded-full bg-muted p-1.5 pl-4">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask a doubt…" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
          {text ? <button type="submit" className="grid h-9 w-9 place-items-center rounded-full bg-teal-500 text-white" aria-label="Send"><Send className="h-4 w-4" /></button>
            : <MicButton size={36} lang={lang} fallback={grade <= 5 ? 'Why does it rain?' : 'Explain photosynthesis'} onText={(t) => ask(t)} />}
        </form>
        <div className="mt-1.5 flex items-center justify-center gap-1 text-[10px] text-slate-400"><ShieldCheck className="h-3 w-3" /> Child-safe answers from the SCERT syllabus</div>
      </div>
    </div>
  )
}
