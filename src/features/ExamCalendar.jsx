import { useState } from 'react'
import { BadgeCheck, ChevronLeft, ChevronRight, Clock, NotebookPen } from 'lucide-react'
import { Badge, Card, SectionTitle } from '../components/ui'
import { CALENDAR_EVENTS, EXAMS } from '../data/seed'
import { cx, daysUntil, fmtDate } from '../lib/utils'

const KIND = { exam: '#ec7563', meeting: '#2f6bbf', holiday: '#f6b93b', community: '#26a69a', event: '#8b5cf6' }

export function ExamCountdown() {
  const terminal = EXAMS.filter((e) => e.type === 'Terminal').sort((a, b) => new Date(a.date) - new Date(b.date))[0]
  const d = daysUntil(terminal.date)
  return (
    <Card className="overflow-hidden bg-primary p-4 text-white ring-0">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-sun-300">Second Terminal Exam</div>
          <div className="mt-1 font-display text-3xl font-extrabold">{d} days to go</div>
          <div className="text-xs text-white/70">Starts {fmtDate(terminal.date, { weekday: 'short', day: 'numeric', month: 'long' })} · Malayalam I</div>
        </div>
        <div className="relative h-16 w-16">
          <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90"><circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="3" /><circle cx="18" cy="18" r="15.5" fill="none" stroke="#f6b93b" strokeWidth="3" strokeDasharray={`${Math.max(5, 100 - d)} 100`} strokeLinecap="round" pathLength="100" /></svg>
          <div className="absolute inset-0 grid place-items-center"><NotebookPen className="h-5 w-5 text-sun-300" /></div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-[11px] text-white/80"><BadgeCheck className="h-3.5 w-3.5 shrink-0 text-teal-300" /> Official timetable, verified by the Principal</div>
    </Card>
  )
}

export default function ExamCalendar() {
  const [offset, setOffset] = useState(0)
  const base = new Date(); base.setDate(1); base.setMonth(base.getMonth() + offset)
  const year = base.getFullYear(), month = base.getMonth()
  const first = new Date(year, month, 1).getDay()
  const days = new Date(year, month + 1, 0).getDate()
  const cells = Array.from({ length: first + days }, (_, i) => (i < first ? null : i - first + 1))
  const evFor = (day) => CALENDAR_EVENTS.filter((e) => { const d = new Date(e.date); return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day })
  const today = new Date()
  const upcoming = EXAMS.slice().sort((a, b) => new Date(a.date) - new Date(b.date))
  return (
    <div className="space-y-4">
      <ExamCountdown />
      <Card className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <button onClick={() => setOffset(offset - 1)} className="grid h-8 w-8 place-items-center rounded-full bg-slate-100" aria-label="Previous month"><ChevronLeft className="h-4 w-4" /></button>
          <div className="font-display font-bold text-foreground">{base.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</div>
          <button onClick={() => setOffset(offset + 1)} className="grid h-8 w-8 place-items-center rounded-full bg-slate-100" aria-label="Next month"><ChevronRight className="h-4 w-4" /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}</div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((c, i) => {
            const ev = c ? evFor(c) : []
            const isToday = c && today.getDate() === c && today.getMonth() === month && today.getFullYear() === year
            return (
              <div key={i} className={cx('flex aspect-square flex-col items-center justify-center rounded-lg text-xs', c && !isToday && 'bg-slate-50', isToday && 'bg-primary font-bold text-white', ev.length && !isToday && 'font-bold text-foreground ring-1 ring-slate-200')}>
                {c}
                {ev.length > 0 && <span className="mt-0.5 flex gap-0.5">{ev.map((e, k) => <span key={k} className="h-1.5 w-1.5 rounded-full" style={{ background: KIND[e.kind] }} />)}</span>}
              </div>
            )
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-slate-500">
          {Object.entries(KIND).map(([k, c]) => <span key={k} className="flex items-center gap-1 capitalize"><span className="h-2 w-2 rounded-full" style={{ background: c }} />{k}</span>)}
        </div>
      </Card>
      <div>
        <SectionTitle>Upcoming exams</SectionTitle>
        <div className="space-y-2">
          {upcoming.map((e) => (
            <Card key={e.id} className="flex items-center gap-3 p-3">
              <div className="w-12 shrink-0 rounded-xl bg-coral-50 py-1.5 text-center">
                <div className="text-[10px] font-bold uppercase text-coral-500">{fmtDate(e.date, { month: 'short' })}</div>
                <div className="font-display text-lg font-extrabold leading-none text-foreground">{new Date(e.date).getDate()}</div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-foreground">{e.subject}</div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500"><Clock className="h-3 w-3" /> {e.time}</div>
              </div>
              <Badge color={e.type === 'Terminal' ? 'coral' : e.type === 'Practical' ? 'violet' : 'sky'}>{e.type}</Badge>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
