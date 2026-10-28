import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AlertOctagon, CalendarPlus, CircleCheck, EyeOff, Send, ShieldAlert } from 'lucide-react'
import { Panel } from '../../components/DashShell'
import { Badge, Button, Field, Sheet, Stat, Tabs, inputCls, useToast } from '../../components/ui'
import { useStore } from '../../store/Store'
import { cx, fmtDate, fmtTime, timeAgo, uid } from '../../lib/utils'

const RISK = { high: 'red', medium: 'sun', low: 'green' }
const TEMPLATES = [
  'Thank you for trusting me with this. What you are feeling is very common before exams. Let’s make a simple 3-day revision plan together. Can you come to the counsellor room tomorrow at 11:15?',
  'I’m really glad you wrote to me. You are not alone, and it is not your fault. I would like to talk to you in person. You can also call Childline 1098 any time.',
  'Friendships can be hard. Try sitting with the Nature Club group at lunch tomorrow. I’ll check in with you on Friday.',
]

export function Inbox() {
  const { state, mutate } = useStore()
  const toast = useToast()
  const [sel, setSel] = useState(state.counselQueries[0]?.id)
  const [reply, setReply] = useState('')
  const [filter, setFilter] = useState('All')
  const list = state.counselQueries.filter((q) => filter === 'All' || q.status === filter)
  const q = state.counselQueries.find((x) => x.id === sel)
  const act = (status) => {
    mutate((d, { notify }) => {
      const x = d.counselQueries.find((k) => k.id === sel); x.status = status; if (reply) x.reply = reply
      if (status === 'Escalated') notify('principal', `Counsellor escalated a high-risk case (${x.anon}) under child-protection policy`, '🛡️')
      if (x.mine) notify(x.mine, 'The counsellor replied to your anonymous question 💚', '💬')
    })
    toast(status === 'Escalated' ? 'Escalated to safeguarding lead · protocol started' : 'Reply sent anonymously', status === 'Escalated' ? '🛡️' : '💬')
    setReply('')
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat label="New questions" value={state.counselQueries.filter((c) => c.status === 'New').length} tone="sky" />
        <Stat label="High-risk flagged" value={state.counselQueries.filter((c) => c.risk === 'high').length} tone="coral" sub="Keyword + AI triage" />
        <Stat label="Median reply time" value="5.5 h" tone="teal" />
        <Stat label="Sessions this week" value={state.sessions.length} tone="violet" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[380px_1fr]">
        <Panel title="Anonymous inbox" pad={false} action={<Tabs size="sm" value={filter} onChange={setFilter} tabs={['All', 'New', 'Replied', 'Escalated']} />}>
          <div className="divide-y divide-slate-100">
            {list.map((c) => (
              <button key={c.id} onClick={() => setSel(c.id)} className={cx('block w-full px-5 py-3 text-left', sel === c.id ? 'bg-violet-50' : 'hover:bg-slate-50')}>
                <div className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5 text-sm font-semibold text-foreground"><EyeOff className="h-3.5 w-3.5 text-slate-400" />{c.anon}</span><Badge color={RISK[c.risk]}>{c.risk} risk</Badge></div>
                <div className="mt-0.5 text-xs text-slate-500">{c.cls} · {c.topic} · {timeAgo(c.at)}</div>
                <div className="mt-1 line-clamp-2 text-xs text-slate-600">{c.text}</div>
              </button>
            ))}
          </div>
        </Panel>
        {q && (
          <Panel title={`${q.anon} · ${q.cls}`} sub={`${q.topic} · ${timeAgo(q.at)} · identity hidden`} action={<Badge color={q.status === 'Escalated' ? 'red' : q.status === 'Replied' ? 'green' : 'sky'}>{q.status}</Badge>}>
            {q.risk === 'high' && <div className="mb-3 flex gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-800 ring-1 ring-red-200"><AlertOctagon className="h-5 w-5 shrink-0" /><div><b>High-risk protocol:</b> reply within 1 hour, offer an in-person meeting, and escalate to the safeguarding lead. Anonymity can be lifted only under the child-protection policy.</div></div>}
            <div className="rounded-2xl bg-slate-50 p-4 text-[15px] leading-relaxed text-foreground">“{q.text}”</div>
            {q.reply && <div className="mt-3 rounded-2xl bg-violet-50 p-4 text-sm text-violet-900"><b>Your reply:</b> {q.reply}</div>}
            <div className="mt-4 text-xs font-semibold text-slate-500">Quick templates</div>
            <div className="mt-1 flex flex-wrap gap-2">{TEMPLATES.map((t, i) => <button key={i} onClick={() => setReply(t)} className="rounded-full bg-card px-3 py-1 text-xs text-slate-600 ring-1 ring-slate-200 hover:bg-violet-50">Template {i + 1}</button>)}</div>
            <textarea className={cx(inputCls, 'mt-2 h-28 resize-none')} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a warm, simple reply…" />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="primary" icon={Send} disabled={!reply} onClick={() => act('Replied')}>Send reply</Button>
              <Button variant="danger" icon={ShieldAlert} onClick={() => act('Escalated')}>Escalate to safeguarding lead</Button>
            </div>
          </Panel>
        )}
      </div>
    </div>
  )
}

export function Sessions() {
  const { state, mutate } = useStore()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [f, setF] = useState({ title: 'Exam stress: 5 techniques that work', who: 'Group: Class 10-B', mode: 'In school · Seminar hall' })
  return (
    <Panel title="Counselling sessions" action={<Button size="sm" icon={CalendarPlus} onClick={() => setOpen(true)}>New session</Button>} pad={false}>
      <div className="divide-y divide-slate-100">
        {state.sessions.slice().sort((a, b) => new Date(a.at) - new Date(b.at)).map((s) => (
          <div key={s.id} className="flex items-center gap-4 px-5 py-3">
            <div className="w-14 rounded-xl bg-violet-50 py-1.5 text-center"><div className="text-[10px] font-bold uppercase text-violet-500">{fmtDate(s.at, { month: 'short' })}</div><div className="font-display text-lg font-extrabold leading-none text-foreground">{new Date(s.at).getDate()}</div></div>
            <div className="min-w-0 flex-1"><div className="text-sm font-semibold text-foreground">{s.title}</div><div className="text-xs text-slate-500">{s.who} · {fmtTime(s.at)} · {s.mode}</div></div>
            <Badge color="violet">{s.seats}</Badge>
          </div>
        ))}
      </div>
      <Sheet fixed open={open} onClose={() => setOpen(false)} title="Schedule a session" footer={<Button className="w-full" onClick={() => { mutate((d, { notify }) => { d.sessions.push({ id: uid('ss'), ...f, at: new Date(Date.now() + 3 * 86400000).toISOString(), seats: '0/45' }); notify('ananya', `New wellbeing session: ${f.title}`, '💚') }); toast('Session scheduled · students notified', '🗓️'); setOpen(false) }}>Schedule</Button>}>
        <Field label="Title"><input className={inputCls} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
        <Field label="Audience"><input className={inputCls} value={f.who} onChange={(e) => setF({ ...f, who: e.target.value })} /></Field>
        <Field label="Mode"><select className={inputCls} value={f.mode} onChange={(e) => setF({ ...f, mode: e.target.value })}>{['In school · Seminar hall', 'Online (low-data audio)', 'Counsellor room'].map((m) => <option key={m}>{m}</option>)}</select></Field>
      </Sheet>
    </Panel>
  )
}

export function Trends() {
  const { state } = useStore()
  const weeks = [['W1', 22, 9], ['W2', 25, 11], ['W3', 24, 10], ['W4', 31, 14], ['W5', 38, 19], ['W6', 44, 23]].map(([w, s, a]) => ({ w, stressed: s, anxious: a }))
  const topics = [['Exam stress', 46], ['Friendship', 21], ['Home', 14], ['Career worry', 11], ['Bullying', 6], ['Body & health', 5]].map(([t, n]) => ({ t, n }))
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-violet-50 p-4 text-sm text-violet-900 ring-1 ring-violet-500/20">Aggregated and anonymised. Groups smaller than 10 students are hidden.</div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Daily mood check-ins: % ‘worried’ or ‘sad’" sub="Rises as terminal exams approach"><div className="h-64"><ResponsiveContainer><LineChart data={weeks}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="w" tick={{ fontSize: 11 }} /><YAxis unit="%" tick={{ fontSize: 11 }} /><Tooltip /><Line dataKey="stressed" name="Worried" stroke="#8b5cf6" strokeWidth={3} /><Line dataKey="anxious" name="Sad" stroke="#ec7563" strokeWidth={3} /></LineChart></ResponsiveContainer></div></Panel>
        <Panel title="Anonymous questions by topic"><div className="h-64"><ResponsiveContainer><BarChart data={topics} layout="vertical" margin={{ left: 30 }}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 11 }} /><YAxis type="category" dataKey="t" tick={{ fontSize: 11 }} width={90} /><Tooltip /><Bar dataKey="n" fill="#8b5cf6" radius={[0, 8, 8, 0]} /></BarChart></ResponsiveContainer></div></Panel>
      </div>
      <Panel title="Suggested actions">
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex gap-2"><CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />Schedule a “beating exam anxiety” group session for every Class 10 division in the next 2 weeks.</li>
          <li className="flex gap-2"><CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />Push the Malayalam audio pod “Exam-calm breathing” to Classes 9–10.</li>
          <li className="flex gap-2"><CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />Parent session: “Talking to teens about pressure” (63 registered already).</li>
        </ul>
      </Panel>
    </div>
  )
}
