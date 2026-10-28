import { useEffect, useState } from 'react'
import { EyeOff, Phone } from 'lucide-react'
import { Badge, Button, Card, Field, SectionTitle, Sheet, inputCls, useToast } from '../components/ui'
import { useSession, useStore } from '../store/Store'
import { cx, fmtDate, fmtTime, uid } from '../lib/utils'

const MOODS = [['😄', 'Great'], ['🙂', 'Okay'], ['😐', 'Meh'], ['😟', 'Worried'], ['😢', 'Sad']]

function Breathing({ onClose }) {
  const [t, setT] = useState(0)
  useEffect(() => { const i = setInterval(() => setT((x) => x + 1), 1000); return () => clearInterval(i) }, [])
  const phase = t % 8 < 4 ? 'Breathe in…' : 'Breathe out…'
  return (
    <div className="py-4 text-center">
      <div className="relative mx-auto grid h-48 w-48 place-items-center">
        <div className="absolute inset-0 animate-breathe rounded-full bg-teal-200/60" />
        <div className="absolute inset-6 animate-breathe rounded-full bg-teal-300/70" style={{ animationDelay: '.2s' }} />
        <div className="relative font-display text-lg font-bold text-teal-900">{phase}</div>
      </div>
      <p className="mt-4 text-sm text-slate-600">Follow the circle for 1 minute. In through the nose for 4, out through the mouth for 4.</p>
      <div className="mt-1 text-xs text-slate-400">{Math.floor(t / 8)} breaths</div>
      <Button className="mt-4" variant="soft" onClick={onClose}>I feel calmer</Button>
    </div>
  )
}

export default function Wellbeing() {
  const { state, mutate } = useStore()
  const { user } = useSession()
  const toast = useToast()
  const [breath, setBreath] = useState(false)
  const [ask, setAsk] = useState(false)
  const [book, setBook] = useState(false)
  const [q, setQ] = useState('')
  const [topic, setTopic] = useState('Exam stress')
  const myMood = state.mood.filter((m) => m.by === user.id)
  const lastMood = myMood[0]

  const logMood = (m) => {
    mutate((d) => { d.mood.unshift({ by: user.id, m, at: new Date().toISOString() }) })
    if (m[1] === 'Worried' || m[1] === 'Sad') toast('Thanks for sharing. Try a breathing break, or talk to Dr. Lakshmi 💚', '💚')
    else toast('Mood saved. Have a great day!', '🌤️')
  }

  const sendQ = () => {
    mutate((d, { notify }) => {
      d.counselQueries.unshift({ id: uid('cq'), anon: 'Student #A-' + (300 + d.counselQueries.length), cls: 'Class ' + (user.grade || 9), topic, text: q, at: new Date().toISOString(), risk: /die|hurt myself|suicide|kill/i.test(q) ? 'high' : 'low', status: 'New', mine: user.id })
      notify('counselor', `New anonymous question: ${topic}`, '💬')
    })
    toast('Sent anonymously. The counsellor usually replies within 24 hours.', '🔒')
    setQ(''); setAsk(false)
  }
  const myQs = state.counselQueries.filter((c) => c.mine === user.id)

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-violet-500 to-violet-700 p-4 text-white ring-0">
        <div className="text-xs font-semibold text-white/80">Daily check-in</div>
        <div className="font-display text-lg font-extrabold">How are you feeling today?</div>
        <div className="mt-3 flex justify-between">
          {MOODS.map((m) => (
            <button key={m[1]} onClick={() => logMood(m)} className={cx('flex flex-col items-center gap-1 rounded-2xl px-2 py-2 transition hover:bg-white/15', lastMood?.m[1] === m[1] && 'bg-white/20')}>
              <span className="text-3xl">{m[0]}</span><span className="text-[10px] font-semibold">{m[1]}</span>
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card onClick={() => setBreath(true)} className="p-4"><div className="text-2xl">🫁</div><div className="mt-1 text-sm font-bold text-navy-800">1-min breathing</div><div className="text-[11px] text-slate-500">Calm exam nerves</div></Card>
        <Card onClick={() => setAsk(true)} className="p-4"><div className="text-2xl">🕶️</div><div className="mt-1 text-sm font-bold text-navy-800">Ask anonymously</div><div className="text-[11px] text-slate-500">Your name stays hidden</div></Card>
        <Card onClick={() => setBook(true)} className="p-4"><div className="text-2xl">🗓️</div><div className="mt-1 text-sm font-bold text-navy-800">Book counsellor</div><div className="text-[11px] text-slate-500">Dr. Lakshmi Prabha</div></Card>
        <Card className="p-4"><div className="text-2xl">🎧</div><div className="mt-1 text-sm font-bold text-navy-800">Exam-calm audio</div><div className="text-[11px] text-slate-500">5 min · Malayalam</div></Card>
      </div>

      <div>
        <SectionTitle>Upcoming sessions</SectionTitle>
        <div className="space-y-2">
          {state.sessions.filter((s) => s.who.startsWith('Group') || s.who.startsWith('Parents') || s.mine === user.id).map((s) => (
            <Card key={s.id} className="flex items-center gap-3 p-3">
              <div className="w-12 shrink-0 rounded-xl bg-violet-50 py-1.5 text-center"><div className="text-[10px] font-bold uppercase text-violet-500">{fmtDate(s.at, { month: 'short' })}</div><div className="font-display text-lg font-extrabold leading-none text-navy-800">{new Date(s.at).getDate()}</div></div>
              <div className="min-w-0 flex-1"><div className="text-[13px] font-semibold text-navy-800">{s.title}</div><div className="text-[11px] text-slate-500">{fmtTime(s.at)} · {s.mode}</div></div>
            </Card>
          ))}
        </div>
      </div>

      {myQs.length > 0 && (
        <div>
          <SectionTitle>My anonymous questions</SectionTitle>
          <div className="space-y-2">{myQs.map((c) => (
            <Card key={c.id} className="p-3"><div className="flex items-center justify-between"><Badge color="violet">{c.topic}</Badge><Badge color={c.status === 'Replied' ? 'green' : 'sky'}>{c.status}</Badge></div><div className="mt-1.5 text-[13px] text-slate-600">{c.text}</div>{c.reply && <div className="mt-2 rounded-lg bg-violet-50 p-2.5 text-[13px] text-violet-900"><b>Counsellor:</b> {c.reply}</div>}</Card>
          ))}</div>
        </div>
      )}

      <Card className="p-4">
        <SectionTitle>Free helplines (24×7)</SectionTitle>
        {[['Tele-MANAS (mental health)', '14416'], ['Childline', '1098'], ['Emergency', '112']].map(([n, p]) => (
          <div key={p} className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0"><span className="text-sm text-navy-800">{n}</span><a href={`tel:${p}`} className="flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700"><Phone className="h-3 w-3" />{p}</a></div>
        ))}
        <p className="mt-2 text-[11px] text-slate-400">Vidya Sethu is not a clinical or emergency service. Sensitive issues are escalated to trained humans.</p>
      </Card>

      <Sheet open={breath} onClose={() => setBreath(false)} title="Breathing break"><Breathing onClose={() => setBreath(false)} /></Sheet>
      <Sheet open={ask} onClose={() => setAsk(false)} title="Ask the counsellor anonymously" footer={<Button className="w-full" variant="primary" disabled={!q.trim()} onClick={sendQ} icon={EyeOff}>Send anonymously</Button>}>
        <div className="mb-3 rounded-xl bg-violet-50 p-3 text-xs text-violet-800">🔒 The counsellor sees only “Student #A-xxx” and your class. If something sounds dangerous, a trained adult will reach out to keep you safe.</div>
        <Field label="Topic">
          <select className={inputCls} value={topic} onChange={(e) => setTopic(e.target.value)}>{['Exam stress', 'Friendship', 'Home', 'Body & health', 'Bullying', 'Career worry', 'Something else'].map((t) => <option key={t}>{t}</option>)}</select>
        </Field>
        <Field label="Your question"><textarea className={cx(inputCls, 'h-28 resize-none')} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Write what is on your mind…" /></Field>
      </Sheet>
      <Sheet open={book} onClose={() => setBook(false)} title="Book a 1:1 session">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3"><span className="text-3xl">🧑🏽‍⚕️</span><div><div className="font-semibold text-navy-800">Dr. Lakshmi Prabha</div><div className="text-xs text-slate-500">School counsellor · Mon–Fri</div></div></div>
        <div className="grid grid-cols-2 gap-2">
          {['Tomorrow 11:15 AM', 'Tomorrow 3:00 PM', 'Fri 12:00 PM', 'Fri 2:15 PM'].map((s) => (
            <button key={s} onClick={() => { mutate((d, { notify }) => { d.sessions.push({ id: uid('ss'), who: 'Student (private)', title: '1:1 session (booked in app)', at: new Date(Date.now() + 86400000).toISOString(), mode: 'Counsellor room', seats: '1:1', mine: user.id }); notify('counselor', `New 1:1 booking: ${s}`, '🗓️') }); toast(`Booked: ${s}. Only you and the counsellor can see this.`, '🗓️'); setBook(false) }} className="rounded-xl bg-white p-3 text-sm font-semibold text-navy-800 ring-1 ring-slate-200 hover:bg-violet-50 hover:ring-violet-400">{s}</button>
          ))}
        </div>
      </Sheet>
    </div>
  )
}
