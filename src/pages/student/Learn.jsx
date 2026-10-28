import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle2, CloudDownload, Download, Pause, Play, Rewind, Search, Star, WifiOff } from 'lucide-react'
import { Badge, Button, Card, Progress, Sheet, Tabs, useToast } from '../../components/ui'
import { MobileHeader, HeaderActions } from '../../components/MobileShell'
import { MicButton } from '../../features/Voice'
import { useSession, useStore } from '../../store/Store'
import { AUDIO_PODS, COMPETITIVE, PEER_TUTORS, RESOURCES } from '../../data/seed'
import { speak, stopSpeaking } from '../../lib/speech'
import { translate } from '../../i18n'
import { cx, uid } from '../../lib/utils'

const LANG_BADGE = { ml: ['മലയാളം', 'sun'], en: ['English', 'sky'], hi: ['हिंदी', 'coral'] }

function useDownload() {
  const { state, mutate } = useStore()
  const toast = useToast()
  const [busy, setBusy] = useState({})
  const start = (id, label) => {
    if (state.downloads[id]) return
    setBusy((b) => ({ ...b, [id]: 0 }))
    let p = 0
    const i = setInterval(() => {
      p += 20 + Math.random() * 25
      if (p >= 100) {
        clearInterval(i)
        setBusy((b) => { const n = { ...b }; delete n[id]; return n })
        mutate((d) => { d.downloads[id] = true })
        toast(`${label} saved for offline use`, '📥')
      } else setBusy((b) => ({ ...b, [id]: p }))
    }, 350)
  }
  const remove = (id) => mutate((d) => { delete d.downloads[id] })
  return { busy, start, remove, done: state.downloads }
}

function Player({ pod, onClose }) {
  const { state, mutate } = useStore()
  const { user } = useSession()
  const toast = useToast()
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)
  const [rate, setRate] = useState(1)
  const timer = useRef(null)
  const total = pod.mins * 60
  useEffect(() => () => { stopSpeaking(); clearInterval(timer.current) }, [])
  const play = () => {
    setPlaying(true)
    speak(pod.script, pod.lang === 'hi' ? 'hi' : pod.lang === 'ml' ? 'ml' : 'en', { rate: 0.95 * rate, onEnd: () => {
      setPlaying(false); clearInterval(timer.current); setPos(total)
      mutate((d) => { d.coins[user.id] += 10; d.coinHistory[user.id].unshift({ id: uid('c'), label: `Finished audio pod: ${pod.subject}`, amt: 10, at: new Date().toISOString() }) })
      toast('+10 Vidya Coins for completing the lesson', '🪙')
    } })
    clearInterval(timer.current)
    timer.current = setInterval(() => setPos((p) => Math.min(total, p + 7 * rate)), 1000)
  }
  const pause = () => { setPlaying(false); stopSpeaking(); clearInterval(timer.current) }
  const mm = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  return (
    <Sheet open onClose={() => { pause(); onClose() }} title="Now playing">
      <div className="text-center">
        <div className="mx-auto grid h-36 w-36 place-items-center rounded-[2rem] text-6xl shadow-float" style={{ background: `linear-gradient(135deg, ${pod.color}, ${pod.color}aa)` }}>{pod.emoji}</div>
        <div className="mt-4 font-display text-lg font-extrabold text-navy-800">{state.lang === 'ml' ? pod.titleMl : pod.title}</div>
        <div className="mt-1 flex items-center justify-center gap-2 text-xs text-slate-500"><Badge color={LANG_BADGE[pod.lang][1]}>{LANG_BADGE[pod.lang][0]}</Badge> {pod.subject} · Class {pod.grade} {state.downloads[pod.id] && <Badge color="teal"><WifiOff className="h-3 w-3" /> Offline</Badge>}</div>
        <div className="mx-auto mt-5 flex h-10 max-w-xs items-center justify-center gap-[3px]">
          {Array.from({ length: 36 }).map((_, i) => (
            <span key={i} className={cx('w-1 rounded-full', i / 36 <= pos / total ? 'bg-teal-500' : 'bg-slate-200', playing && 'animate-wave')} style={{ height: `${30 + ((i * 37) % 70)}%`, animationDelay: `${(i % 6) * 0.12}s` }} />
          ))}
        </div>
        <Progress className="mt-3" value={(pos / total) * 100} h={5} />
        <div className="mt-1 flex justify-between text-[11px] text-slate-400"><span>{mm(pos)}</span><span>{mm(total)}</span></div>
        <div className="mt-4 flex items-center justify-center gap-5">
          <button onClick={() => setPos(Math.max(0, pos - 15))} className="grid h-11 w-11 place-items-center rounded-full bg-slate-100" aria-label="Back 15 seconds"><Rewind className="h-5 w-5 text-navy-800" /></button>
          <button onClick={playing ? pause : play} className="grid h-16 w-16 place-items-center rounded-full bg-navy-800 text-white shadow-float" aria-label={playing ? 'Pause' : 'Play'}>{playing ? <Pause className="h-7 w-7 fill-white" /> : <Play className="ml-1 h-7 w-7 fill-white" />}</button>
          <button onClick={() => setRate(rate === 1 ? 1.25 : rate === 1.25 ? 0.75 : 1)} className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-xs font-bold text-navy-800">{rate}×</button>
        </div>
        <div className="mt-5 rounded-2xl bg-slate-50 p-3 text-left">
          <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">Transcript</div>
          <p className="text-[13px] leading-relaxed text-slate-600">{pod.script}</p>
        </div>
        <p className="mt-3 text-[11px] text-slate-400">Prototype uses your device voice to read the lesson. Final app: recorded teacher voices, about 350 KB per minute.</p>
      </div>
    </Sheet>
  )
}

export default function Learn() {
  const { state } = useStore()
  const { user } = useSession()
  const [params] = useSearchParams()
  const [tab, setTab] = useState(params.get('tab') || 'pods')
  const [q, setQ] = useState('')
  const [subject, setSubject] = useState('All')
  const [playing, setPlaying] = useState(null)
  const dl = useDownload()
  const toast = useToast()
  const lang = state.lang
  const pods = AUDIO_PODS.filter((p) => (user.grade <= 5 ? p.grade <= 5 : p.grade > 5))
  const subjects = ['All', ...new Set(pods.map((p) => p.subject))]
  const shown = pods.filter((p) => (subject === 'All' || p.subject === subject) && (p.title + p.titleMl + p.subject).toLowerCase().includes(q.toLowerCase()))
  const offlineCount = Object.keys(state.downloads).length

  return (
    <div>
      <MobileHeader title={translate('learn', lang)} sub="Audio pods & offline library" right={<HeaderActions userId={user.id} />}>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white p-1.5 pl-3.5 shadow-card ring-1 ring-slate-900/5">
          <Search className="h-4 w-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={translate('voiceSearch', lang)} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
          <MicButton size={34} lang={lang} fallback={user.grade <= 5 ? 'rain' : 'quadratic'} onText={(t) => setQ(t)} />
        </div>
        <Tabs className="mt-3" value={tab} onChange={setTab} tabs={[{ value: 'pods', label: '🎧 Audio pods' }, { value: 'library', label: '📚 Library' }, { value: 'exams', label: '🏆 Competitive' }, { value: 'tutors', label: '🤝 Peer tutors' }]} />
      </MobileHeader>

      <div className="space-y-4 px-4">
        <Card className="flex items-center gap-3 bg-navy-800 p-3.5 text-white ring-0">
          <WifiOff className="h-5 w-5 text-sun-300" />
          <div className="flex-1 text-xs"><b>{offlineCount} items available offline</b><div className="text-white/70">Data saver {state.dataSaver ? 'ON' : 'OFF'} · audio at 32 kbps (about 2 MB per lesson)</div></div>
        </Card>

        {tab === 'pods' && (
          <>
            <Tabs size="sm" value={subject} onChange={setSubject} tabs={subjects} />
            <div className="space-y-2.5">
              {shown.map((p) => {
                const done = dl.done[p.id], prog = dl.busy[p.id]
                return (
                  <Card key={p.id} className="flex items-center gap-3 p-3">
                    <button onClick={() => setPlaying(p)} className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl" style={{ background: p.color + '22' }}>
                      {p.emoji}
                      <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-navy-800 text-white ring-2 ring-white"><Play className="ml-0.5 h-3 w-3 fill-white" /></span>
                    </button>
                    <button onClick={() => setPlaying(p)} className="min-w-0 flex-1 text-left">
                      <div className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-navy-800">{lang === 'ml' ? p.titleMl : p.title}</div>
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500"><Badge color={LANG_BADGE[p.lang][1]}>{LANG_BADGE[p.lang][0]}</Badge>{p.mins} min · {p.size}</div>
                    </button>
                    {done ? <button onClick={() => { dl.remove(p.id); toast('Removed from device', '🗑️') }} className="flex flex-col items-center text-[10px] font-semibold text-teal-600" aria-label="Downloaded"><CheckCircle2 className="h-5 w-5" />{translate('downloaded', lang)}</button>
                      : prog != null ? <div className="w-10 text-center text-[10px] font-bold text-sky-600">{Math.round(prog)}%<Progress value={prog} h={4} color="#2f6bbf" /></div>
                        : <button onClick={() => dl.start(p.id, p.title)} className="flex flex-col items-center text-[10px] font-semibold text-slate-400" aria-label="Download"><CloudDownload className="h-5 w-5" />{p.size}</button>}
                  </Card>
                )
              })}
              {shown.length === 0 && <div className="py-8 text-center text-sm text-slate-500">No lessons match “{q}”</div>}
            </div>
          </>
        )}

        {tab === 'library' && (
          <div className="space-y-2.5">
            {RESOURCES.map((r) => {
              const done = dl.done[r.id], prog = dl.busy[r.id]
              return (
                <Card key={r.id} className="flex items-center gap-3 p-3.5">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-50 text-2xl">{r.icon}</div>
                  <div className="min-w-0 flex-1"><div className="text-[13px] font-semibold text-navy-800">{r.title}</div><div className="text-[11px] text-slate-500">{r.type} · {r.size}</div></div>
                  {done ? <span className="text-teal-600"><CheckCircle2 className="h-5 w-5" /></span> : prog != null ? <span className="text-[10px] font-bold text-sky-600">{Math.round(prog)}%</span> : <button onClick={() => dl.start(r.id, r.title)} className="text-slate-400" aria-label="Download"><Download className="h-5 w-5" /></button>}
                </Card>
              )
            })}
            <div className="rounded-xl bg-slate-100 p-3 text-[11px] text-slate-500">📦 Can’t download? Ask for a printed copy in the Help Desk and our CSR partners deliver to your door.</div>
          </div>
        )}

        {tab === 'exams' && (
          <div className="space-y-2.5">
            <p className="text-xs text-slate-500">Scholarship & competitive exam modules (NMMS, USS, Kerala PSC, SSC, banking, CA/CMA).</p>
            {COMPETITIVE.map((c) => (
              <Card key={c.id} onClick={() => toast(`${c.name}: Lesson ${c.done + 1} opened`, '🏆')} className="p-3.5">
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl font-display font-extrabold text-white" style={{ background: c.color }}>{c.name[0]}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2"><div className="text-[13.5px] font-semibold text-navy-800">{c.name}</div><Badge>{c.for}</Badge></div>
                    <div className="text-[11px] text-slate-500">{c.desc}</div>
                    <Progress className="mt-2" value={(c.done / c.lessons) * 100} h={5} color={c.color} />
                    <div className="mt-1 text-[10px] text-slate-400">{c.done}/{c.lessons} lessons</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === 'tutors' && <PeerTutors />}
      </div>
      {playing && <Player pod={playing} onClose={() => setPlaying(null)} />}
    </div>
  )
}

function PeerTutors() {
  const { mutate } = useStore()
  const toast = useToast()
  const [book, setBook] = useState(null)
  return (
    <div className="space-y-2.5">
      <Card className="bg-sun-50 p-3.5 ring-sun-500/20"><div className="text-sm font-bold text-navy-800">Learn from seniors 🤝</div><p className="text-xs text-slate-600">Plus Two and college students from your area teach for free (CSR-sponsored) or a small fee. All tutors are school-verified and sessions take place in school or library spaces.</p></Card>
      {PEER_TUTORS.map((t) => (
        <Card key={t.id} className="p-3.5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-2xl">{t.avatar}</div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-navy-800">{t.name}</div>
              <div className="text-[11px] text-slate-500">{t.cls} · {t.subjects.join(', ')}</div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500"><Star className="h-3 w-3 fill-sun-400 text-sun-400" />{t.rating} · {t.sessions} sessions</div>
            </div>
            <div className="text-right"><Badge color={t.fee.startsWith('Free') ? 'green' : 'slate'}>{t.fee}</Badge><Button size="sm" variant="teal" className="mt-1.5" onClick={() => setBook(t)}>Book</Button></div>
          </div>
        </Card>
      ))}
      <Sheet open={!!book} onClose={() => setBook(null)} title={`Book ${book?.name}`}>
        <div className="grid grid-cols-2 gap-2">
          {['Sat 10:00 AM · Library', 'Sat 11:30 AM · Library', 'Sun 4:00 PM · School', 'Wed 4:15 PM · Room 9-B'].map((s) => (
            <button key={s} onClick={() => { mutate((d) => d.bookings.push({ tutor: book.name, slot: s })); toast(`Booked with ${book.name}: ${s}`, '📅'); setBook(null) }} className="rounded-xl p-3 text-left text-sm font-semibold text-navy-800 ring-1 ring-slate-200 hover:bg-teal-50 hover:ring-teal-400">{s}</button>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-slate-400">Parents get a notification for every booked session.</p>
      </Sheet>
    </div>
  )
}

