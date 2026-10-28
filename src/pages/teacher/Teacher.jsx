import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AlertCircle, Check, CheckCheck, ClipboardCheck, Clock, Languages, LifeBuoy, Megaphone, Printer, Send, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { DataTable, Panel } from '../../components/DashShell'
import { Avatar, Badge, Button, Card, Field, Sheet, Stat, Tabs, Toggle, inputCls, useToast } from '../../components/ui'
import SecureChat from '../../features/SecureChat'
import { useSession, useStore } from '../../store/Store'
import { CLASS_9B, MARKS, TIMETABLE, USERS } from '../../data/seed'
import { cx, fmtTime, timeAgo, todayKey, uid } from '../../lib/utils'

const STATUS = { New: 'sky', 'In progress': 'sun', Resolved: 'green', Escalated: 'red', pending: 'sun', verified: 'green', rejected: 'red' }

export function Dashboard() {
  const { state } = useStore()
  const nav = useNavigate()
  const today = state.attendance[todayKey()]
  const present = today ? Object.values(today.marks).filter((m) => m === 'P').length : 0
  const myReqs = state.requests.filter((r) => r.assigned === 'Fathima Nasrin')
  const adoption = CLASS_9B.filter((s) => s.guardianApp).length
  const avg = MARKS.ananya.map((m) => ({ exam: m.exam, Class: Math.round(m.Mathematics * 0.86), 'Top 5': Math.min(98, m.Mathematics + 9) }))
  const attention = [
    { name: 'Midhun Lal', why: 'Absent 4 days this month', tone: 'coral' },
    { name: 'Sanjay Kumar (from Bihar)', why: 'Parent needs Hindi notices', tone: 'sky' },
    { name: 'Anu Mol', why: 'Maths dropped 18 pts in Unit 3', tone: 'sun' },
  ]
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Good day, Fathima</h2><p className="text-sm text-slate-500">Class teacher · 9-B · Mathematics for 9-A, 9-B, 10-C</p></div>
        <div className="flex gap-2"><Button icon={ClipboardCheck} onClick={() => nav('/teacher/attendance')}>Take attendance</Button><Button variant="teal" icon={Megaphone} onClick={() => nav('/teacher/notices')}>Post class update</Button></div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat label="Present today (9-B)" value={today ? `${present}/${CLASS_9B.length}` : '—'} sub={today ? `Submitted ${fmtTime(today.submittedAt)}` : 'Not yet taken'} icon={Users} />
        <Stat label="Open help requests" value={myReqs.filter((r) => r.status !== 'Resolved').length} sub="Avg. response 2.1 hrs" icon={LifeBuoy} tone="coral" />
        <Stat label="Parents on Vidya Sethu" value={`${adoption}/${CLASS_9B.length}`} sub="Others get SMS fallback" icon={Megaphone} tone="sky" />
        <Stat label="Chat window" value={state.chatWindow.enabled ? `${state.chatWindow.start}–${state.chatWindow.end}` : 'Always on'} sub="Protects your personal time" icon={Clock} tone="violet" />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Today’s timetable" className="xl:col-span-1">
          <div className="space-y-2">
            {TIMETABLE.map((t) => (
              <div key={t.time} className={cx('flex items-center gap-3 rounded-xl p-2.5', t.subject === 'Mathematics' ? 'bg-teal-50' : 'bg-slate-50')}>
                <div className="w-12 text-xs font-bold text-foreground">{t.time}</div>
                <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-foreground">{t.subject}</div><div className="truncate text-[11px] text-slate-500">{t.topic}</div></div>
                {t.subject === 'Mathematics' && <Badge color="teal">You</Badge>}
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Maths: Class 9-B average vs top 5" sub="Visual performance graph shared with parents" className="xl:col-span-2">
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={avg}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="exam" tick={{ fontSize: 11 }} /><YAxis domain={[40, 100]} tick={{ fontSize: 11 }} /><Tooltip /><Line dataKey="Class" stroke="#26a69a" strokeWidth={3} /><Line dataKey="Top 5" stroke="#f6b93b" strokeWidth={3} strokeDasharray="5 4" /></LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Students needing attention" sub="Flagged by attendance, marks and family requests">
          <div className="space-y-2">{attention.map((a) => <div key={a.name} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><Avatar name={a.name} size={34} color="#14253f" /><div className="flex-1"><div className="text-sm font-semibold text-foreground">{a.name}</div><div className="text-xs text-slate-500">{a.why}</div></div><Badge color={a.tone}>Follow up</Badge></div>)}</div>
        </Panel>
        <Panel title="Recent help requests" action={<Button size="sm" variant="soft" onClick={() => nav('/teacher/requests')}>Open all</Button>}>
          <div className="space-y-2">{state.requests.slice(0, 4).map((r) => <div key={r.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-foreground">{r.title}</div><div className="text-xs text-slate-500">{r.byName} · {timeAgo(r.createdAt)}</div></div><Badge color={STATUS[r.status]}>{r.status}</Badge></div>)}</div>
        </Panel>
      </div>
    </div>
  )
}

export function Attendance() {
  const { state, mutate } = useStore()
  const toast = useToast()
  const existing = state.attendance[todayKey()]
  const [marks, setMarks] = useState(() => existing?.marks || Object.fromEntries(CLASS_9B.map((s) => [s.id, 'P'])))
  const counts = useMemo(() => Object.values(marks).reduce((a, m) => ({ ...a, [m]: (a[m] || 0) + 1 }), {}), [marks])
  const submit = () => {
    const absent = CLASS_9B.filter((s) => marks[s.id] === 'A')
    mutate((d, { notify }) => {
      d.attendance[todayKey()] = { marks, submittedAt: new Date().toISOString(), by: 'Fathima Nasrin' }
      const a = marks.s14
      notify('rajesh', a === 'A' ? 'Ananya was marked ABSENT today. Reply in chat if this is a mistake.' : `Ananya marked ${a === 'L' ? 'Late' : 'Present'} at ${new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}`, a === 'A' ? '⚠️' : '✅')
      notify('ananya', `Attendance marked: ${a === 'A' ? 'Absent' : 'Present'} (+${a === 'A' ? 0 : 4} coins)`, '✅')
    })
    toast(`Attendance saved · ${CLASS_9B.length - absent.length} present · ${absent.length} absent parents alerted (voice call for 4 without app)`, '✅')
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
        <Stat label="Present" value={counts.P || 0} tone="teal" />
        <Stat label="Absent" value={counts.A || 0} tone="coral" />
        <Stat label="Late" value={counts.L || 0} tone="sun" />
        <Stat className="hidden sm:block" label="Status" value={existing ? 'Submitted' : 'Draft'} sub={existing ? `at ${fmtTime(existing.submittedAt)}` : 'Not sent yet'} />
      </div>
      <Panel title={`Class 9-B · ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}`} sub="Tap to cycle Present → Absent → Late. Parents of absentees get an instant alert in their language."
        action={<div className="flex gap-2"><Button size="sm" variant="soft" icon={CheckCheck} onClick={() => setMarks(Object.fromEntries(CLASS_9B.map((s) => [s.id, 'P'])))}>All present</Button><Button size="sm" variant="teal" icon={Send} onClick={submit}>{existing ? 'Update & notify' : 'Submit & notify parents'}</Button></div>}>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {CLASS_9B.map((s) => {
            const m = marks[s.id]
            return (
              <button key={s.id} onClick={() => setMarks({ ...marks, [s.id]: m === 'P' ? 'A' : m === 'A' ? 'L' : 'P' })} className={cx('flex items-center gap-3 rounded-xl p-2.5 text-left ring-1 transition', m === 'P' ? 'bg-card ring-slate-200' : m === 'A' ? 'bg-coral-50 ring-coral-300' : 'bg-sun-50 ring-sun-300')}>
                <span className="w-6 text-center text-xs font-bold text-slate-400">{s.roll}</span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-foreground">{s.name}</span><span className="text-[11px] text-slate-500">{s.bus} · {s.guardianApp ? 'Parent on app' : 'SMS / voice call'}</span></span>
                <span className={cx('grid h-8 w-8 place-items-center rounded-lg text-sm font-extrabold text-white', m === 'P' ? 'bg-teal-500' : m === 'A' ? 'bg-coral-500' : 'bg-sun-400')}>{m}</span>
              </button>
            )
          })}
        </div>
      </Panel>
    </div>
  )
}

export function Notices() {
  const { state, mutate } = useStore()
  const toast = useToast()
  const [form, setForm] = useState({ title: '', body: '', category: 'Class update', audience: 'Class 9-B parents', ml: true, hi: false })
  const mine = state.notices.filter((n) => n.author === 'Fathima Nasrin')
  const submit = () => {
    mutate((d, { notify }) => {
      d.notices.unshift({ id: uid('n'), source: 'school', category: form.category, status: 'pending', title: form.title, titleMl: '', body: form.body, bodyMl: '', autoTranslate: form.ml, author: 'Fathima Nasrin', authorRole: 'Class Teacher 9-B', at: new Date().toISOString(), audience: form.audience, reach: 0, reads: 0, readBy: {} })
      notify('principal', `Fathima Nasrin submitted a notice for verification: “${form.title}”`, '📝')
    })
    toast('Sent to Principal for verification. It goes live once approved ✓', '📝')
    setForm({ ...form, title: '', body: '' })
  }
  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
      <Panel title="Post a class update" sub="Every notice is verified by the principal before parents see it, so there are no rumours or fake forwards">
        <Field label="Title"><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Maths unit test on Tuesday – Chapter 4" /></Field>
        <Field label="Message"><textarea className={cx(inputCls, 'h-32 resize-none')} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Write in simple language. Voice playback is generated automatically." /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Category"><select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{['Class update', 'Exam', 'Homework', 'Event', 'Holiday', 'Fees'].map((c) => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Audience"><select className={inputCls} value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>{['Class 9-B parents', 'Class 9-B students', 'All Class 9 parents', 'Route 3 families'].map((c) => <option key={c}>{c}</option>)}</select></Field>
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-1">
          <Toggle checked={form.ml} onChange={(v) => setForm({ ...form, ml: v })} label="Auto-translate to Malayalam" sub="AI translation, editable before publishing" />
          <Toggle checked={form.hi} onChange={(v) => setForm({ ...form, hi: v })} label="Also send in Hindi" sub="2 migrant families in 9-B" />
        </div>
        <Button className="mt-4 w-full" variant="teal" icon={Send} disabled={!form.title.trim()} onClick={submit}>Submit for verification</Button>
      </Panel>
      <Panel title="My notices" sub="Status & read receipts">
        <div className="space-y-2">
          {mine.map((n) => (
            <div key={n.id} className="rounded-xl bg-slate-50 p-3">
              <div className="flex items-start justify-between gap-2"><div className="text-sm font-semibold text-foreground">{n.title}</div><Badge color={STATUS[n.status]}>{n.status === 'verified' ? 'Live ✓' : n.status}</Badge></div>
              <div className="mt-1 text-xs text-slate-500">{n.audience} · {timeAgo(n.at)}</div>
              {n.status === 'verified' && <div className="mt-2 flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-teal-500" style={{ width: `${(n.reads / Math.max(1, n.reach)) * 100}%` }} /></div><span className="text-[11px] font-semibold text-slate-600">{n.reads}/{n.reach} read</span></div>}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

export function Messages() {
  const { state, mutate } = useStore()
  const { user } = useSession()
  const [thread, setThread] = useState('fathima')
  const threads = [
    { id: 'fathima', who: USERS.ananya, label: 'Ananya Rajesh · student 9-B' },
    { id: 'parent-fathima', who: USERS.rajesh, label: 'Rajesh Kumar · parent of Ananya' },
  ]
  const cur = threads.find((t) => t.id === thread)
  return (
    <div className="grid gap-4 xl:grid-cols-[320px_1fr_300px]">
      <Panel title="Conversations" pad={false}>
        <div className="divide-y divide-slate-100">
          {threads.map((t) => {
            const msgs = state.chats[t.id] || []
            const last = msgs[msgs.length - 1]
            return (
              <button key={t.id} onClick={() => setThread(t.id)} className={cx('flex w-full items-center gap-3 p-4 text-left', thread === t.id ? 'bg-teal-50' : 'hover:bg-slate-50')}>
                <Avatar name={t.who.name} color={t.who.color} size={40} />
                <div className="min-w-0 flex-1"><div className="text-sm font-semibold text-foreground">{t.who.name}</div><div className="truncate text-xs text-slate-500">{last?.text}</div></div>
              </button>
            )
          })}
        </div>
      </Panel>
      <Panel title={cur.label} sub="Masked identities · numbers never shared" pad={false}>
        <div className="py-3"><SecureChat threadId={thread} me={user} other={{ ...cur.who }} autoReply={false} height="h-[520px]" /></div>
      </Panel>
      <Panel title="Chat window" sub="Students and parents can message you only during these hours">
        <Toggle checked={state.chatWindow.enabled} onChange={(v) => mutate((d) => { d.chatWindow.enabled = v })} label="Limit chat hours" sub="Messages outside hours are queued" />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Field label="From"><input type="time" className={inputCls} value={state.chatWindow.start} onChange={(e) => mutate((d) => { d.chatWindow.start = e.target.value })} /></Field>
          <Field label="To"><input type="time" className={inputCls} value={state.chatWindow.end} onChange={(e) => mutate((d) => { d.chatWindow.end = e.target.value })} /></Field>
        </div>
        <div className="flex gap-2 rounded-2xl bg-muted p-3 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 shrink-0 text-teal-600" />Automated safety filters block phone numbers, links, abusive words and grooming patterns. Flagged messages go to the safeguarding lead.</div>
      </Panel>
    </div>
  )
}

export function Gradebook() {
  const toast = useToast()
  const [exam, setExam] = useState('Unit 3')
  const [marks, setMarks] = useState(() => Object.fromEntries(CLASS_9B.map((s, i) => [s.id, s.roll === 14 ? 83 : 45 + ((i * 37) % 50)])))
  const vals = Object.values(marks).map(Number)
  const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
  const dist = [['0–39', 0, 39], ['40–59', 40, 59], ['60–79', 60, 79], ['80–100', 80, 100]].map(([r, a, b]) => ({ r, n: vals.filter((v) => v >= a && v <= b).length }))
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={exam} onChange={setExam} tabs={['Unit 1', '1st Term', 'Unit 2', 'Unit 3']} />
        <Button variant="teal" icon={Send} onClick={() => toast('Marks published · parents can see graphs in the app', '📈')}>Publish to parents</Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat label="Class average" value={`${avg}%`} sub="Mathematics · 9-B" />
        <Stat label="Highest" value={Math.max(...vals)} tone="sun" />
        <Stat label="Below 40%" value={vals.filter((v) => v < 40).length} sub="Remedial class suggested" tone="coral" />
        <Stat label="Entered" value={`${vals.length}/${CLASS_9B.length}`} tone="sky" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Panel title={`Mathematics · ${exam} (out of 100)`} pad={false}>
          <div className="max-h-[520px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-50 text-left text-xs text-slate-500"><tr><th className="px-4 py-2">Roll</th><th className="px-4 py-2">Student</th><th className="px-4 py-2">Marks</th><th className="px-4 py-2">Grade</th></tr></thead>
              <tbody>
                {CLASS_9B.map((s) => {
                  const m = Number(marks[s.id])
                  const g = m >= 90 ? 'A+' : m >= 80 ? 'A' : m >= 70 ? 'B+' : m >= 60 ? 'B' : m >= 50 ? 'C+' : m >= 40 ? 'C' : 'D'
                  return (
                    <tr key={s.id} className="border-t border-slate-100">
                      <td className="px-4 py-2 text-slate-400">{s.roll}</td>
                      <td className="px-4 py-2 font-medium text-foreground">{s.name}</td>
                      <td className="px-4 py-2"><input type="number" min="0" max="100" value={marks[s.id]} onChange={(e) => setMarks({ ...marks, [s.id]: e.target.value })} className="w-20 rounded-lg bg-slate-50 px-2 py-1 ring-1 ring-slate-200 focus:outline-none focus:ring-teal-500" /></td>
                      <td className="px-4 py-2"><Badge color={m >= 80 ? 'green' : m >= 50 ? 'sky' : 'coral'}>{g}</Badge></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title="Distribution">
          <div className="h-64"><ResponsiveContainer><BarChart data={dist}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="r" tick={{ fontSize: 11 }} /><YAxis allowDecimals={false} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="n" fill="#26a69a" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div>
          <div className="mt-3 flex items-start gap-2 rounded-2xl bg-sun-50 p-3 text-xs text-sun-700"><Sparkles className="mt-0.5 h-4 w-4 shrink-0" /> Insight: 6 students lose marks on word problems. Suggest assigning audio pod “Quadratic equations in 6 minutes” (Malayalam).</div>
        </Panel>
      </div>
    </div>
  )
}

export function Requests() {
  const { state, mutate } = useStore()
  const toast = useToast()
  const [open, setOpen] = useState(null)
  const [reply, setReply] = useState('')
  const [filter, setFilter] = useState('Open')
  const list = state.requests.filter((r) => (filter === 'All' || (filter === 'Open' ? r.status !== 'Resolved' : r.status === 'Resolved')))
  const respond = (r, resolve) => {
    mutate((d, { notify }) => {
      const x = d.requests.find((k) => k.id === r.id)
      x.reply = reply || x.reply
      x.status = resolve ? 'Resolved' : 'In progress'
      if (x.assigned === 'Unassigned') x.assigned = 'Fathima Nasrin'
      x.timeline.push({ s: resolve ? 'Resolved by Fathima Nasrin' : 'Responded: ' + (reply || 'Working on it'), at: new Date().toISOString() })
      if (x.by !== 'other') notify(x.by, `Update on ${x.id}: ${resolve ? 'Resolved ✓' : 'Teacher replied'}`, '💬')
    })
    toast(resolve ? 'Marked resolved · requester notified' : 'Reply sent', '✅'); setReply(''); setOpen(null)
  }
  const sel = open && state.requests.find((r) => r.id === open)
  return (
    <Panel title="Help requests" sub="Questions from students and families, routed to you" action={<Tabs size="sm" value={filter} onChange={setFilter} tabs={['Open', 'Resolved', 'All']} />} pad={false}>
      <DataTable rows={list} rowKey={(r) => r.id} onRow={(r) => setOpen(r.id)} empty="No requests in this view" columns={[
        { label: 'Request', primary: true, render: (r) => <span>{r.title}<span className="block text-xs font-normal text-muted-foreground md:hidden">{r.byName}</span></span> },
        { label: 'ID', hideMobile: true, render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
        { label: 'From', hideMobile: true, render: (r) => <span className="text-muted-foreground">{r.byName}</span> },
        { label: 'Category', render: (r) => <Badge>{r.category}</Badge> },
        { label: 'Age', render: (r) => timeAgo(r.createdAt) },
        { label: 'Status', side: true, render: (r) => <Badge color={STATUS[r.status]}>{r.status}</Badge> },
      ]} />
      <Sheet fixed wide open={!!sel} onClose={() => setOpen(null)} title={sel ? `${sel.id} · ${sel.title}` : ''}
        footer={sel && sel.status !== 'Resolved' && <div className="flex gap-2"><Button variant="soft" className="flex-1" onClick={() => respond(sel, false)}>Send reply</Button><Button variant="teal" className="flex-1" onClick={() => respond(sel, true)}>Reply & resolve</Button></div>}>
        {sel && (
          <>
            <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700"><b>{sel.byName}</b> · {sel.child}<br />{sel.detail}</div>
            {sel.category === 'Language' && <div className="mt-2 flex items-center gap-2 rounded-xl bg-sky-50 p-3 text-xs text-sky-700"><Languages className="h-4 w-4" /> Auto-translation: “We cannot understand the Malayalam notice.”</div>}
            <div className="mt-3"><Field label="Your reply"><textarea className={cx(inputCls, 'h-24 resize-none')} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="e.g. Nihala (Plus Two) will tutor you every Saturday 10 AM in the library." /></Field></div>
            <div className="text-xs text-slate-500">Timeline</div>
            <ul className="mt-1 space-y-1 text-xs text-slate-600">{sel.timeline.map((t, i) => <li key={i}>• {t.s} <span className="text-slate-400">({timeAgo(t.at)})</span></li>)}</ul>
          </>
        )}
      </Sheet>
    </Panel>
  )
}

export function Onboarding() {
  const { state, mutate } = useStore()
  const toast = useToast()
  const [form, setForm] = useState({ name: '', cls: '9-B', guardian: '' })
  const [slip, setSlip] = useState(null)
  const create = () => {
    const username = form.name.toLowerCase().split(' ')[0].replace(/[^a-z]/g, '') + '.' + form.cls.toLowerCase().replace('-', '')
    const temp = 'VS-' + Math.floor(1000 + Math.random() * 9000)
    const rec = { name: form.name, cls: form.cls, username, temp, guardian: form.guardian.slice(0, 2) + '•••••' + form.guardian.slice(-3), status: 'First login pending', at: new Date().toISOString() }
    mutate((d) => { d.onboarded.unshift(rec) })
    setSlip(rec); setForm({ name: '', cls: '9-B', guardian: '' })
    toast('Account created · SMS with login sent to guardian', '🆕')
  }
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1.4fr]">
      <Panel title="Create student account" sub="The guardian receives the login by SMS">
        <Field label="Student full name"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Fathima Hanna" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Class"><select className={inputCls} value={form.cls} onChange={(e) => setForm({ ...form, cls: e.target.value })}>{['9-A', '9-B', '9-C', '10-A'].map((c) => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Guardian mobile"><input className={inputCls} value={form.guardian} onChange={(e) => setForm({ ...form, guardian: e.target.value.replace(/\D/g, '').slice(0, 10) })} placeholder="10-digit number" /></Field>
        </div>
        <ul className="mb-4 space-y-1.5 rounded-2xl bg-muted p-3.5 text-xs text-muted-foreground">{['Parent consent is recorded', 'Temporary password must be changed at first login', 'Parents see only their own child'].map((t) => <li key={t} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-teal-600" strokeWidth={3} />{t}</li>)}</ul>
        <Button className="w-full" variant="teal" disabled={!form.name || form.guardian.length < 10} onClick={create}>Generate login & send to guardian</Button>
      </Panel>
      <Panel title="Accounts created" sub={`${state.onboarded.length} students`} pad={false}>
        <DataTable rows={state.onboarded} rowKey={(o) => o.username + o.at} minWidth={520} columns={[
          { label: 'Student', primary: true, render: (o) => <span>{o.name} <span className="text-xs font-normal text-muted-foreground">{o.cls}</span></span> },
          { label: 'Username', render: (o) => <span className="font-mono text-xs">{o.username}</span> },
          { label: 'Temporary password', render: (o) => <span className="font-mono text-xs">{o.status === 'Password changed' ? '••••••' : o.temp}</span> },
          { label: 'Status', side: true, render: (o) => <Badge color={o.status === 'Password changed' ? 'green' : 'sun'}>{o.status}</Badge> },
        ]} />
      </Panel>
      <Sheet fixed open={!!slip} onClose={() => setSlip(null)} title="Login slip" footer={<Button className="w-full" icon={Printer} onClick={() => window.print()}>Print slip</Button>}>
        {slip && (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 p-5 text-center">
            <div className="font-display text-lg font-extrabold text-foreground">Vidya Sethu · Vidyanagar GHSS</div>
            <div className="mt-1 text-sm text-slate-600">{slip.name} · Class {slip.cls}</div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-left text-sm"><div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">Username</div><b className="font-mono">{slip.username}</b></div><div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">Temporary password</div><b className="font-mono">{slip.temp}</b></div></div>
            <p className="mt-3 text-xs text-slate-500">Change this password at first login. Never share it outside your family.</p>
          </div>
        )}
      </Sheet>
    </div>
  )
}

export function Nominations() {
  const { state, mutate } = useStore()
  const toast = useToast()
  const [form, setForm] = useState({ student: CLASS_9B[31].name, need: 'Exam-prep books', reason: '', amount: 1500 })
  const submit = () => {
    mutate((d, { notify }) => {
      d.nominations.unshift({ id: 'NV-' + (307 + d.nominations.length), code: 'STU-9B-•••' + Math.floor(Math.random() * 10), cls: '9-B', need: form.need, reason: form.reason || 'Family facing financial difficulty', verifiedBy: 'Pending principal', amount: Number(form.amount), status: 'Pending school verification', sponsor: null })
      notify('principal', `New NGO-support nomination from Fathima N. (${form.need})`, '🤝')
    })
    toast('Nomination sent to Principal. NGOs see only anonymised details after verification.', '🤝')
    setForm({ ...form, reason: '' })
  }
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1.4fr]">
      <Panel title="Nominate a student for support" sub="Identity stays inside the school. NGOs see an anonymised code.">
        <Field label="Student"><select className={inputCls} value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })}>{CLASS_9B.map((s) => <option key={s.id}>{s.name}</option>)}</select></Field>
        <Field label="What is needed"><select className={inputCls} value={form.need} onChange={(e) => setForm({ ...form, need: e.target.value })}>{['Exam-prep books', 'Uniform set', 'Bus fee', 'Spectacles', 'Tablet for online classes', 'School fees', 'Stationery kit'].map((n) => <option key={n}>{n}</option>)}</select></Field>
        <Field label="Reason (confidential)"><textarea className={cx(inputCls, 'h-20 resize-none')} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="e.g. father lost job after accident" /></Field>
        <Field label="Estimated amount (₹)"><input type="number" className={inputCls} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></Field>
        <Button className="w-full" variant="teal" onClick={submit}>Send for principal verification</Button>
      </Panel>
      <Panel title="Nominations from my class" pad={false}>
        <div className="divide-y divide-slate-100">
          {state.nominations.filter((n) => n.cls === '9-B').map((n) => (
            <div key={n.id} className="flex items-center gap-3 px-5 py-3">
              <div className="min-w-0 flex-1"><div className="text-sm font-semibold text-foreground">{n.need} <span className="font-mono text-xs text-slate-400">{n.code}</span></div><div className="text-xs text-slate-500">{n.reason}</div></div>
              <Badge color={n.status === 'Sponsored' ? 'green' : n.status === 'Verified' ? 'sky' : 'sun'}>{n.status}</Badge>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-slate-100 p-4 text-xs text-slate-500"><AlertCircle className="h-4 w-4" /> Shared only if the parent has enabled “Allow verified NGO support”.</div>
      </Panel>
    </div>
  )
}
