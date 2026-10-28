import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpenCheck, Bot, CalendarDays, Check, Flame, GraduationCap, Headphones, HeartHandshake, LifeBuoy, Palette, Search, ShoppingBag, Sparkles } from 'lucide-react'
import { Avatar, Badge, Card, Coin, SectionTitle, useToast } from '../../components/ui'
import { HomeHeader } from '../../components/MobileShell'
import { BusMiniCard } from '../../features/BusRadar'
import { NoticeCard, NoticeDetail } from '../../features/NoticeBoard'
import { MicButton } from '../../features/Voice'
import { useAttendance } from '../../features/Performance'
import { useSession, useStore } from '../../store/Store'
import { TIMETABLE, TIMETABLE_4A } from '../../data/seed'
import { translate } from '../../i18n'
import { cx, daysUntil, fmtTime, greeting } from '../../lib/utils'

export function QuickTile({ icon: Icon, label, color, onClick, big }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 text-center">
      <span className={cx('grid place-items-center rounded-2xl shadow-card', big ? 'h-16 w-16' : 'h-14 w-14')} style={{ background: color + '1f' }}>
        <Icon className={big ? 'h-7 w-7' : 'h-6 w-6'} style={{ color }} />
      </span>
      <span className="text-[11px] font-semibold leading-tight text-foreground">{label}</span>
    </button>
  )
}

function VoiceSearch() {
  const { state } = useStore()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const go = (text) => {
    const t = (text ?? q).toLowerCase()
    if (/bus|ബസ്/.test(t)) return nav('/student/bus')
    if (/exam|പരീക്ഷ|timetable/.test(t)) return nav('/student/exams')
    if (/coin|store|bag/.test(t)) return nav('/student/store')
    if (/sad|stress|worried|tension/.test(t)) return nav('/student/wellbeing')
    nav('/student/tutor?q=' + encodeURIComponent(text ?? q))
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); go() }} className="flex items-center gap-2 rounded-2xl bg-card p-1.5 pl-3.5 shadow-card ring-1 ring-slate-900/5">
      <Search className="h-4 w-4 shrink-0 text-slate-400" />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={translate('voiceSearch', state.lang)} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
      <MicButton size={36} lang={state.lang} fallback="When is my maths exam?" onText={(t) => { setQ(t); setTimeout(() => go(t), 400) }} />
    </form>
  )
}

export default function StudentHome() {
  const { state, mutate } = useStore()
  const { user } = useSession()
  const nav = useNavigate()
  const toast = useToast()
  const lang = state.lang
  const att = useAttendance(user.id)
  const [notice, setNotice] = useState(null)
  const kid = user.grade <= 5
  const hw = state.homework[user.id] || []
  const notices = state.notices.filter((n) => n.status === 'verified').sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 2)
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes()
  const toMin = (t) => { const [h, m] = t.split(':').map(Number); return (h < 8 ? h + 12 : h) * 60 + m }
  const tt = kid ? TIMETABLE_4A : TIMETABLE
  const next = tt.find((c) => toMin(c.end) > nowMin) || tt[0]

  const toggleHw = (id) => {
    const item = hw.find((h) => h.id === id)
    mutate((d) => {
      const h = d.homework[user.id].find((x) => x.id === id)
      h.done = !h.done
      if (h.done) { d.coins[user.id] += h.coins; d.coinHistory[user.id].unshift({ id: id + Date.now(), label: `Homework done: ${h.subject}`, amt: h.coins, at: new Date().toISOString() }) }
    })
    if (!item.done) toast(`+${item.coins} Vidya Coins for finishing homework!`, '🪙')
  }

  const tiles = kid ? [
    { icon: Headphones, label: 'Listen & Learn', color: '#26a69a', to: '/student/learn' },
    { icon: Bot, label: 'Ask Vidya Bot', color: '#2f6bbf', to: '/student/tutor' },
    { icon: Palette, label: 'My Art Wall', color: '#ec7563', to: '/student/talent' },
    { icon: ShoppingBag, label: 'My Coins', color: '#e9a21c', to: '/student/store' },
  ] : [
    { icon: Headphones, label: translate('audioPods', lang), color: '#26a69a', to: '/student/learn' },
    { icon: Bot, label: translate('askAI', lang), color: '#2f6bbf', to: '/student/tutor' },
    { icon: CalendarDays, label: translate('examCalendar', lang), color: '#ec7563', to: '/student/exams' },
    { icon: HeartHandshake, label: translate('wellbeing', lang), color: '#8b5cf6', to: '/student/wellbeing' },
    { icon: Palette, label: translate('talentWall', lang), color: '#db2777', to: '/student/talent' },
    { icon: ShoppingBag, label: translate('coinsStore', lang), color: '#e9a21c', to: '/student/store' },
    { icon: Sparkles, label: translate('careerPath', lang), color: '#0ea5e9', to: '/student/career' },
    { icon: GraduationCap, label: translate('peerTutors', lang), color: '#14253f', to: '/student/learn?tab=tutors' },
  ]

  return (
    <div className="space-y-5 px-4 pb-4">
      <HomeHeader greeting={translate(greeting(), lang)} name={user.short} sub={`Class ${user.className} · Roll ${user.roll} · Vidyanagar GHSS`} userId={user.id} />

      <VoiceSearch />

      <div className="grid grid-cols-3 gap-2">
        <Card onClick={() => nav('/student/store')} className="p-3">
          <div className="text-[10px] font-semibold text-slate-500">Vidya Coins</div>
          <div className="tabular flex items-center gap-1.5 font-display text-lg font-extrabold text-sun-600"><Coin size={18} /> {state.coins[user.id]}</div>
        </Card>
        <Card className="p-3">
          <div className="text-[10px] font-semibold text-slate-500">Streak</div>
          <div className="flex items-center gap-1 font-display text-lg font-extrabold text-coral-500"><Flame className="h-4 w-4" /> 7 days</div>
        </Card>
        <Card onClick={() => nav('/student/progress')} className="p-3">
          <div className="text-[10px] font-semibold text-slate-500">{translate('attendance', lang)}</div>
          <div className="font-display text-lg font-extrabold text-teal-600">{att.pct}%</div>
        </Card>
      </div>

      <div>
        <SectionTitle>{translate('todayAtSchool', lang)}</SectionTitle>
        <Card className="overflow-hidden">
          <div className="flex items-center gap-3 bg-teal-50 px-4 py-2.5 text-xs">
            {att.todayMark === 'P' ? <><Check className="h-4 w-4 text-teal-600" strokeWidth={3} /><span className="font-semibold text-teal-800">Marked {translate('present', lang)} at {att.submittedAt ? fmtTime(att.submittedAt) : '9:12 AM'}</span><span className="ml-auto text-teal-700/70">by class teacher</span></>
              : att.todayMark === 'A' ? <span className="font-semibold text-coral-600">Marked absent today</span> : <span className="text-slate-500">Attendance not yet taken</span>}
          </div>
          <div className="flex items-center gap-3 p-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-center font-display text-xs font-bold leading-tight text-white">{next.time}</div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold text-teal-600">NEXT CLASS</div>
              <div className="truncate text-sm font-bold text-foreground">{next.subject} · {next.teacher}</div>
              <div className="truncate text-xs text-slate-500">{next.topic}</div>
            </div>
            <Badge color="slate">{next.room}</Badge>
          </div>
        </Card>
      </div>

      <BusMiniCard onOpen={() => nav('/student/bus')} childName={user.name} />

      <div className={cx('grid gap-y-4', kid ? 'grid-cols-2' : 'grid-cols-4')}>
        {tiles.map((t) => <QuickTile key={t.label} big={kid} {...t} onClick={() => nav(t.to)} />)}
      </div>

      <div>
        <SectionTitle action={translate('seeAll', lang)} onAction={() => nav('/student/notices')}>{translate('verifiedNotices', lang)}</SectionTitle>
        <div className="space-y-2">{notices.map((n) => <NoticeCard key={n.id} n={n} compact onOpen={() => setNotice(n)} />)}</div>
      </div>

      <div>
        <SectionTitle>{translate('homework', lang)}</SectionTitle>
        <Card className="divide-y divide-slate-100">
          {hw.map((h) => (
            <button key={h.id} onClick={() => toggleHw(h.id)} className="flex w-full items-center gap-3 p-3.5 text-left">
              <span className={cx('grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2', h.done ? 'border-teal-500 bg-teal-500' : 'border-slate-300')}>{h.done && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}</span>
              <span className="min-w-0 flex-1">
                <span className={cx('block truncate text-[13px] font-semibold', h.done ? 'text-slate-400 line-through' : 'text-foreground')}>{h.title}</span>
                <span className="text-[11px] text-slate-500">{h.subject} · due in {Math.max(0, daysUntil(h.due))} day(s)</span>
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-sun-600">+{h.coins} <Coin size={13} /></span>
            </button>
          ))}
        </Card>
      </div>

      {!kid && (
        <Card onClick={() => nav('/student/help')} className="flex items-center gap-3 p-4">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-coral-50 text-coral-500"><LifeBuoy className="h-5 w-5" /></div>
          <div className="flex-1"><div className="text-sm font-bold text-foreground">{translate('askGuidance', lang)}</div><div className="text-[11px] text-slate-500">Books, scholarships, exam doubts, worries – routed to the right person</div></div>
          <BookOpenCheck className="h-5 w-5 text-slate-300" />
        </Card>
      )}
      <NoticeDetail n={notice && state.notices.find((x) => x.id === notice.id)} onClose={() => setNotice(null)} onAsk={() => nav('/student/help')} />
    </div>
  )
}
