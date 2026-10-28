import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarCheck2, Check, ChevronRight, MessageSquareText, ShieldCheck } from 'lucide-react'
import { Avatar, Badge, Button, Card, SectionTitle, Sheet, Tabs, Toggle, useToast } from '../../components/ui'
import { MobileHeader, HeaderActions } from '../../components/MobileShell'
import { BusMiniCard, useSOS } from '../../features/BusRadar'
import NoticeBoard, { NoticeCard, NoticeDetail, nTitle } from '../../features/NoticeBoard'
import ExamCalendar, { ExamCountdown } from '../../features/ExamCalendar'
import Performance, { useAttendance } from '../../features/Performance'
import HelpDesk, { NewRequest } from '../../features/HelpDesk'
import { KitTracker, ScholarshipTracker } from '../../features/Support'
import SecureChat from '../../features/SecureChat'
import { ListenButton } from '../../features/Voice'
import { useBus } from '../../components/BusMap'
import { useSession, useStore } from '../../store/Store'
import { TEACHERS, USERS } from '../../data/seed'
import { translate } from '../../i18n'
import { cx, daysUntil, fmtTime, greeting } from '../../lib/utils'

export function ChildSwitcher() {
  const { state, mutate } = useStore()
  const { user } = useSession()
  return (
    <div className="flex gap-2">
      {user.children.map((id) => {
        const c = USERS[id]
        const active = state.activeChild === id
        return (
          <button key={id} onClick={() => mutate((d) => { d.activeChild = id })} className={cx('flex flex-1 items-center gap-2 rounded-2xl p-2 pr-3 text-left transition', active ? 'bg-navy-800 text-white shadow-float' : 'bg-white text-navy-800 shadow-card ring-1 ring-slate-900/5')}>
            <Avatar emoji={c.avatar} color={active ? '#ffffff' : c.color} size={36} />
            <span className="min-w-0"><span className="block truncate text-sm font-bold">{c.short}</span><span className={cx('block text-[11px]', active ? 'text-white/70' : 'text-slate-500')}>Class {c.className}</span></span>
            {active && <Check className="ml-auto h-4 w-4 text-sun-300" />}
          </button>
        )
      })}
    </div>
  )
}

function useSummary(child) {
  const { state } = useStore()
  const att = useAttendance(child.id)
  const bus = useBus()
  const unread = state.notices.filter((n) => n.status === 'verified' && !n.readBy['rajesh'])
  const hw = (state.homework[child.id] || []).filter((h) => !h.done)
  const busTxt = bus.idle ? 'not started' : bus.arrived ? 'at school' : bus.passedHome ? 'already picked up' : `${bus.eta(bus.homeIdx)} minutes away`
  if (state.lang === 'ml') {
    const busMl = bus.idle ? 'ഇതുവരെ പുറപ്പെട്ടിട്ടില്ല' : bus.arrived ? 'സ്കൂളിൽ എത്തി' : bus.passedHome ? 'കുട്ടിയെ കയറ്റി സ്കൂളിലേക്ക് പോകുന്നു' : `${bus.eta(bus.homeIdx)} മിനിറ്റിനുള്ളിൽ എത്തും`
    return `നമസ്കാരം. ${child.short} ഇന്ന് ${att.todayMark === 'A' ? 'ഹാജരില്ല' : 'സ്കൂളിൽ ഹാജരാണ്'}. ബസ് ${busMl}. ${unread.length} പുതിയ അറിയിപ്പുകൾ ഉണ്ട്. ${unread[0] ? 'പ്രധാനം: ' + (unread[0].titleMl || unread[0].title) + '.' : ''} ${hw.length} ഗൃഹപാഠം ബാക്കിയുണ്ട്.`
  }
  if (state.lang === 'hi') {
    const busHi = bus.idle ? 'अभी शुरू नहीं हुई' : bus.arrived ? 'स्कूल पहुँच गई' : bus.passedHome ? 'बच्चे को लेकर स्कूल जा रही है' : `${bus.eta(bus.homeIdx)} मिनट में पहुँचेगी`
    return `नमस्ते। ${child.short} आज ${att.todayMark === 'A' ? 'अनुपस्थित है' : 'स्कूल में उपस्थित है'}। बस ${busHi}। ${unread.length} नई सूचनाएँ हैं। ${hw.length} गृहकार्य बाकी है।`
  }
  return `Namaskaram. ${child.short} is ${att.todayMark === 'A' ? 'absent today' : 'present at school today'}. The bus is ${busTxt}. You have ${unread.length} new verified notices. ${unread[0] ? 'Most important: ' + unread[0].title + '.' : ''} ${hw.length} homework tasks are pending.`
}

export function ParentHome() {
  const { state } = useStore()
  const { user } = useSession()
  const nav = useNavigate()
  const lang = state.lang
  const child = USERS[state.activeChild]
  const att = useAttendance(child.id)
  const summary = useSummary(child)
  const [notice, setNotice] = useState(null)
  const notices = state.notices.filter((n) => n.status === 'verified').sort((a, b) => (a.readBy[user.id] ? 1 : 0) - (b.readBy[user.id] ? 1 : 0) || new Date(b.at) - new Date(a.at)).slice(0, 3)
  const unread = state.notices.filter((n) => n.status === 'verified' && !n.readBy[user.id]).length
  const hw = state.homework[child.id] || []
  const urgentSch = state.scholarships.filter((s) => s.step < 4 && daysUntil(s.deadline) >= 0).sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0]

  return (
    <div className="space-y-5 px-4 pb-4">
      <div className="flex items-center gap-3 pt-1">
        <Avatar emoji={user.avatar} color={user.color} size={46} />
        <div className="min-w-0 flex-1">
          <div className="text-xs text-slate-500">{translate(greeting(), lang)} 👋</div>
          <div className="truncate font-display text-xl font-extrabold text-navy-800">{user.short}</div>
        </div>
        <HeaderActions userId={user.id} />
      </div>
      <ChildSwitcher />

      <Card className="overflow-hidden bg-gradient-to-br from-navy-800 to-navy-600 p-4 text-white ring-0">
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-2xl">🔊</div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-base font-extrabold">{translate('todaySummary', lang)}</div>
            <p className="mt-1 line-clamp-3 text-xs text-white/75">{summary}</p>
            <ListenButton dark text={summary} lang={lang} className="mt-2.5 !px-3 !py-1.5 !text-xs" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card onClick={() => nav('/parent/child')} className="p-3.5">
          <div className="text-[11px] font-semibold text-slate-500">{translate('attendance', lang)}</div>
          {att.todayMark === 'A' ? <div className="mt-1 font-display text-lg font-extrabold text-coral-500">{translate('absent', lang)}</div>
            : <div className="mt-1 flex items-center gap-1.5 font-display text-lg font-extrabold text-teal-600"><span className="grid h-6 w-6 place-items-center rounded-full bg-teal-500"><Check className="h-4 w-4 text-white" strokeWidth={3} /></span>{translate('present', lang)}</div>}
          <div className="text-[11px] text-slate-400">{att.submittedAt ? `Marked ${fmtTime(att.submittedAt)}` : 'Not yet marked'} · {att.pct}% this term</div>
        </Card>
        <Card onClick={() => nav('/parent/notices')} className="p-3.5">
          <div className="text-[11px] font-semibold text-slate-500">New notices</div>
          <div className="mt-1 font-display text-lg font-extrabold text-navy-800">{unread} unread</div>
          <div className="text-[11px] text-slate-400">All school-verified ✓</div>
        </Card>
      </div>

      <BusMiniCard onOpen={() => nav('/parent/bus')} childName={child.name} />

      <div>
        <SectionTitle action={translate('seeAll', lang)} onAction={() => nav('/parent/notices')}>{translate('verifiedNotices', lang)}</SectionTitle>
        <div className="space-y-2">{notices.map((n) => <NoticeCard key={n.id} n={n} onOpen={() => setNotice(n)} />)}</div>
      </div>

      <ExamCountdown />

      <div>
        <SectionTitle>{child.short}’s {translate('homework', lang).toLowerCase()}</SectionTitle>
        <Card className="divide-y divide-slate-100">
          {hw.map((h) => (
            <div key={h.id} className="flex items-center gap-3 p-3.5">
              <span className={cx('grid h-6 w-6 shrink-0 place-items-center rounded-full', h.done ? 'bg-teal-500' : 'bg-slate-200')}>{h.done && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}</span>
              <div className="min-w-0 flex-1"><div className="truncate text-[13px] font-semibold text-navy-800">{h.title}</div><div className="text-[11px] text-slate-500">{h.subject} · due in {Math.max(0, daysUntil(h.due))} day(s)</div></div>
              <Badge color={h.done ? 'green' : 'sun'}>{h.done ? 'Done' : 'Pending'}</Badge>
            </div>
          ))}
        </Card>
      </div>

      {urgentSch && (
        <Card onClick={() => nav('/parent/support')} className="flex items-center gap-3 p-4 ring-coral-500/30">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-coral-50 text-xl">🎓</div>
          <div className="min-w-0 flex-1"><div className="text-[13px] font-bold text-navy-800">{urgentSch.name}</div><div className="text-[11px] text-coral-600">{daysUntil(urgentSch.deadline)} days left · {urgentSch.status}</div></div>
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Card onClick={() => nav('/parent/chat')} className="p-3.5"><MessageSquareText className="h-6 w-6 text-teal-600" /><div className="mt-1.5 text-[13px] font-bold text-navy-800">Message class teacher</div><div className="text-[11px] text-slate-500">Fathima N. · masked</div></Card>
        <Card onClick={() => nav('/parent/support')} className="p-3.5"><CalendarCheck2 className="h-6 w-6 text-coral-500" /><div className="mt-1.5 text-[13px] font-bold text-navy-800">{translate('community_support', lang)}</div><div className="text-[11px] text-slate-500">Scholarships · kits · help</div></Card>
      </div>
      <NoticeDetail n={notice && state.notices.find((x) => x.id === notice.id)} onClose={() => setNotice(null)} onAsk={() => nav('/parent/support')} />
    </div>
  )
}

export function ParentNotices() {
  const { state } = useStore()
  const { user } = useSession()
  const [tab, setTab] = useState('board')
  const [ask, setAsk] = useState(null)
  return (
    <div>
      <MobileHeader title={translate('notices', state.lang)} sub="Only verified school, government & partner notices" right={<HeaderActions userId={user.id} />}>
        <Tabs className="mt-3" value={tab} onChange={setTab} tabs={[{ value: 'board', label: '📢 Notice board' }, { value: 'calendar', label: '📅 Exam calendar' }]} />
      </MobileHeader>
      {tab === 'board' ? <NoticeBoard onAsk={(n) => setAsk(n)} /> : <div className="px-4"><ExamCalendar /></div>}
      <NewRequest open={!!ask} onClose={() => setAsk(null)} preset={ask && { category: 'Exam', title: 'Question about: ' + nTitle(ask, 'en') }} />
    </div>
  )
}

export function ParentChild() {
  const { state } = useStore()
  const { user } = useSession()
  const child = USERS[state.activeChild]
  return (
    <div>
      <MobileHeader title={`${child.short}’s progress`} sub={`Class ${child.className} · Roll ${child.roll}`} right={<HeaderActions userId={user.id} />}>
        <div className="mt-3"><ChildSwitcher /></div>
      </MobileHeader>
      <div className="px-4"><Performance studentId={child.id} /></div>
    </div>
  )
}

export function ParentSupport() {
  const { state, mutate } = useStore()
  const { user } = useSession()
  const [tab, setTab] = useState('help')
  return (
    <div>
      <MobileHeader title={translate('community_support', state.lang)} sub="Help desk · scholarships · CSR kits · rights" right={<HeaderActions userId={user.id} />}>
        <Tabs className="mt-3" value={tab} onChange={setTab} tabs={[{ value: 'help', label: '🙋 Help desk' }, { value: 'sch', label: '🎓 Scholarships' }, { value: 'kits', label: '📦 Kits' }, { value: 'privacy', label: '🔒 Privacy' }]} />
      </MobileHeader>
      <div className="px-4">
        {tab === 'help' && <HelpDesk />}
        {tab === 'sch' && <ScholarshipTracker />}
        {tab === 'kits' && <KitTracker />}
        {tab === 'privacy' && (
          <div className="space-y-3">
            <Card className="flex gap-3 bg-teal-50 p-4 ring-teal-500/20"><ShieldCheck className="h-6 w-6 shrink-0 text-teal-600" /><p className="text-xs text-teal-900">You control your child’s data under the <b>Digital Personal Data Protection Act, 2023</b>. Parents see only their own children; teachers see only their class.</p></Card>
            <Card className="divide-y divide-slate-100 px-4">
              {[['location', 'Share bus location with me', 'Only during school trips'], ['voice', 'Voice assistant', 'Audio is processed and not stored'], ['analytics', 'Anonymous usage analytics', 'Helps the pilot measure impact'], ['photos', 'Show child photos on Talent Wall', 'Off: only first name + class'], ['ngoShare', 'Allow verified NGO support', 'Shares anonymised need with school-approved NGOs']].map(([k, l, s]) => (
                <Toggle key={k} checked={state.consent[k]} onChange={(v) => mutate((d) => { d.consent[k] = v })} label={l} sub={s} />
              ))}
            </Card>
            <Button variant="outline" className="w-full">Download my family’s data</Button>
          </div>
        )}
      </div>
    </div>
  )
}

export function ParentChat() {
  const { state } = useStore()
  const { user } = useSession()
  const toast = useToast()
  const [ptm, setPtm] = useState(false)
  const t = TEACHERS[0]
  return (
    <div className="flex h-full flex-col">
      <MobileHeader title={t.name} sub={`Class teacher 9-B · chat hours ${t.window}`} right={<Button size="sm" variant="soft" onClick={() => setPtm(true)}>Book PTM call</Button>} />
      <SecureChat threadId="parent-fathima" me={user} other={{ ...t, role: 'teacher' }} height="h-[calc(100dvh-210px)] md:h-[640px]" />
      <Sheet open={ptm} onClose={() => setPtm(false)} title="Can’t come to PTM? Book a call">
        <p className="mb-3 text-sm text-slate-600">Friday’s PTM is at 2:30 PM. If you can’t attend, pick a 10-minute masked call slot with Fathima teacher.</p>
        <div className="grid grid-cols-2 gap-2">
          {['Fri 4:00 PM', 'Fri 4:15 PM', 'Fri 4:30 PM', 'Sat 10:00 AM'].map((s) => <button key={s} onClick={() => { setPtm(false); toast(`PTM call booked: ${s}`, '📞') }} className="rounded-xl p-3 text-sm font-semibold text-navy-800 ring-1 ring-slate-200 hover:bg-teal-50">{s}</button>)}
        </div>
        <p className="mt-3 text-[11px] text-slate-400">{state.lang === 'ml' ? 'കോൾ മലയാളത്തിൽ.' : 'The call can be in Malayalam, English or Hindi.'}</p>
      </Sheet>
    </div>
  )
}

export function ParentSOSCard() {
  const send = useSOS()
  return <Button variant="danger" onClick={() => send('Parent-raised concern')}>SOS</Button>
}
