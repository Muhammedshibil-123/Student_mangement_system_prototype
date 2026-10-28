import { useState } from 'react'
import { ChevronRight, ShieldAlert } from 'lucide-react'
import { Badge, Button, Card, Field, SectionTitle, Sheet, Steps, inputCls, useToast } from '../components/ui'
import { MicButton } from './Voice'
import { useSession, useStore } from '../store/Store'
import { USERS } from '../data/seed'
import { cx, timeAgo } from '../lib/utils'

export const CATEGORIES = [
  { id: 'Academic', icon: '📚', label: 'Studies & homework', route: 'Class teacher', to: 'fathima' },
  { id: 'Exam', icon: '📝', label: 'Exam information', route: 'Exam cell', to: 'principal' },
  { id: 'Resources', icon: '🎒', label: 'Books, uniform, devices', route: 'School office + NGO desk', to: 'principal' },
  { id: 'Scholarship', icon: '🎓', label: 'Scholarship / fees', route: 'Scholarship helpdesk', to: 'principal' },
  { id: 'Wellbeing', icon: '💚', label: 'Stress or worries', route: 'School counsellor', to: 'counselor' },
  { id: 'Safety', icon: '🛡️', label: 'Safety concern', route: 'Principal (safeguarding lead)', to: 'principal' },
  { id: 'Language', icon: '🗣️', label: 'Need help in my language', route: 'Community volunteer', to: 'admin' },
]

const STATUS_COLOR = { New: 'sky', 'In progress': 'sun', Resolved: 'green', Escalated: 'red' }

export function RequestCard({ r, onOpen }) {
  return (
    <Card onClick={onOpen} className="flex items-center gap-3 p-3.5">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-50 text-xl">{CATEGORIES.find((c) => c.id === r.category)?.icon || '🙋'}</div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13.5px] font-semibold text-navy-800">{r.title}</div>
        <div className="text-[11px] text-slate-500">{r.id} · {r.assigned} · {timeAgo(r.createdAt)}</div>
      </div>
      <Badge color={STATUS_COLOR[r.status] || 'slate'}>{r.status}</Badge>
      <ChevronRight className="h-4 w-4 text-slate-300" />
    </Card>
  )
}

export function RequestDetail({ r, onClose }) {
  if (!r) return null
  return (
    <Sheet open={!!r} onClose={onClose} title={r.id}>
      <div className="flex flex-wrap gap-1.5"><Badge color={STATUS_COLOR[r.status]}>{r.status}</Badge><Badge>{r.category}</Badge></div>
      <h3 className="mt-2 font-display text-lg font-bold text-navy-800">{r.title}</h3>
      <p className="mt-1 text-sm text-slate-600">{r.detail}</p>
      <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">Routed to <b>{r.assigned}</b> · For {r.child}</div>
      <div className="mt-4"><SectionTitle>Progress</SectionTitle>
        <Steps current={r.timeline.length - 1} steps={r.timeline.map((t) => ({ label: t.s, sub: timeAgo(t.at) }))} />
      </div>
      {r.reply && <div className="mt-4 rounded-xl bg-teal-50 p-3 text-sm text-teal-900"><b>Reply:</b> {r.reply}</div>}
    </Sheet>
  )
}

export function NewRequest({ open, onClose, preset }) {
  const { state, mutate } = useStore()
  const { user } = useSession()
  const toast = useToast()
  const [cat, setCat] = useState(preset?.category || null)
  const [title, setTitle] = useState(preset?.title || '')
  const [detail, setDetail] = useState('')
  const child = user.role === 'parent' ? USERS[state.activeChild] : user
  const submit = () => {
    const c = CATEGORIES.find((x) => x.id === cat)
    const id = 'REQ-' + (1062 + state.requests.length)
    const now = new Date().toISOString()
    mutate((d, { notify }) => {
      d.requests.unshift({ id, by: user.id, byName: `${user.name} (${user.role})`, child: `${child.short} · ${child.className}`, category: cat, title: title || c.label, detail, status: 'New', assigned: c.route, createdAt: now, timeline: [{ s: 'Submitted', at: now }, { s: `Auto-routed to ${c.route}`, at: now }] })
      notify(c.to, `New ${cat} request from ${user.name}: “${title || c.label}”`, '🙋')
    })
    toast(`Request ${id} sent to ${c.route}`, '📨')
    setCat(null); setTitle(''); setDetail(''); onClose()
  }
  return (
    <Sheet open={open} onClose={onClose} title="Ask for guidance"
      footer={cat && <Button className="w-full" variant="teal" onClick={submit}>Send request</Button>}>
      {!cat ? (
        <>
          <p className="mb-3 text-sm text-slate-600">What do you need help with? We route it to the right person and you can track it here.</p>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((c) => (
              <button key={c.id} onClick={() => setCat(c.id)} className="rounded-2xl bg-slate-50 p-3 text-left ring-1 ring-slate-200 hover:bg-teal-50 hover:ring-teal-400">
                <div className="text-2xl">{c.icon}</div>
                <div className="mt-1 text-[13px] font-semibold text-navy-800">{c.label}</div>
                <div className="text-[10px] text-slate-500">→ {c.route}</div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <button onClick={() => setCat(null)} className="mb-3 text-xs font-semibold text-teal-600">← Change category</button>
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm"><span className="text-xl">{CATEGORIES.find((c) => c.id === cat).icon}</span><b className="text-navy-800">{cat}</b> <span className="text-xs text-slate-500">→ {CATEGORIES.find((c) => c.id === cat).route}</span></div>
          <Field label="Short title"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Need Physics textbook" /></Field>
          <Field label="Tell us more (type or speak)">
            <div className="flex gap-2">
              <textarea className={cx(inputCls, 'h-24 resize-none')} value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Describe the problem…" />
              <MicButton lang={state.lang} fallback="My son did not get the Malayalam textbook for term two." onText={(t) => setDetail((d) => (d ? d + ' ' : '') + t)} />
            </div>
          </Field>
          {cat === 'Safety' && <div className="flex gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700"><ShieldAlert className="h-4 w-4 shrink-0" /> Safety concerns go directly to the principal (safeguarding lead) and are handled confidentially. In an emergency call 112 or Childline 1098.</div>}
          {cat === 'Wellbeing' && <div className="rounded-xl bg-violet-50 p-3 text-xs text-violet-700">💚 Only the school counsellor can read this. You can also ask anonymously from the Wellbeing section.</div>}
        </>
      )}
    </Sheet>
  )
}

export default function HelpDesk({ compact }) {
  const { state } = useStore()
  const { user } = useSession()
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState(null)
  const mine = state.requests.filter((r) => r.by === user.id)
  return (
    <div className="space-y-3">
      <Card className="bg-gradient-to-br from-teal-500 to-teal-700 p-4 text-white ring-0">
        <div className="text-lg font-display font-extrabold">Need help? Ask us.</div>
        <p className="mt-1 text-xs text-white/85">Studies, books, exams, scholarships, safety or worries. We route your request to the right person and you can track every step.</p>
        <Button variant="sun" className="mt-3" onClick={() => setOpen(true)}>+ New request</Button>
      </Card>
      {!compact && (
        <>
          <SectionTitle>My requests ({mine.length})</SectionTitle>
          <div className="space-y-2">
            {mine.length === 0 && <div className="rounded-xl bg-white p-4 text-center text-sm text-slate-500 ring-1 ring-slate-100">No requests yet</div>}
            {mine.map((r) => <RequestCard key={r.id} r={r} onOpen={() => setDetail(r)} />)}
          </div>
        </>
      )}
      <NewRequest open={open} onClose={() => setOpen(false)} />
      <RequestDetail r={detail && state.requests.find((x) => x.id === detail.id)} onClose={() => setDetail(null)} />
    </div>
  )
}
