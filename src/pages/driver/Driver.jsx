import { useState } from 'react'
import { AlertTriangle, Car, Check, CloudRain, Construction, Gauge, MapPin, Play, Square, TrainFront, Users, Wrench } from 'lucide-react'
import { Avatar, Badge, Button, Card, Progress, SectionTitle, Sheet, useToast } from '../../components/ui'
import { HeaderActions, HomeHeader, MobileHeader } from '../../components/MobileShell'
import { BusMap, STOP_FRAC, useBus } from '../../components/BusMap'
import { SOSButton } from '../../features/BusRadar'
import { useSession, useStore } from '../../store/Store'
import { BUS, USERS } from '../../data/seed'
import { translate } from '../../i18n'
import { cx, greeting } from '../../lib/utils'

const DELAYS = [[Car, 'Heavy traffic', 10], [Construction, 'Road work at Athavanad', 10], [CloudRain, 'Heavy rain / waterlogging', 15], [Wrench, 'Minor breakdown', 20], [TrainFront, 'Railway gate closed', 5]]

export function useBoard() {
  const { mutate } = useStore()
  const toast = useToast()
  return (name, on) => {
    mutate((d, { notify }) => {
      if (on) d.trip.boarded[name] = new Date().toISOString(); else delete d.trip.boarded[name]
      const kid = Object.values(USERS).find((u) => u.name === name)
      if (kid && on) { notify(kid.parentId, `${kid.short} boarded bus ${BUS.route} at ${new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}`, '🚌'); notify(kid.id, 'You boarded the bus — have a safe ride!', '🚌') }
    })
    if (on) toast(`${name.split(' ')[0]} marked on board · parent notified`, '✅')
  }
}

export function DriverTrip() {
  const { state, mutate } = useStore()
  const { user } = useSession()
  const toast = useToast()
  const bus = useBus()
  const board = useBoard()
  const [delay, setDelay] = useState(false)
  const lang = state.lang
  const running = !bus.idle && !bus.arrived
  const next = BUS.stops[bus.nextIdx]
  const atNext = BUS.boardList.filter((s) => s.stop === next.id)
  const onboard = Object.keys(state.trip.boarded).length

  const start = () => {
    mutate((d, { notify }) => {
      d.trip = { status: 'running', startedAt: Date.now(), delayMin: 0, delayReason: '', boarded: {} }; d.alertsSent = {}
      notify('rajesh', `Bus ${BUS.route} has started from Edayur. Track live in Vidya Sethu.`, '🚌')
      notify('principal', `${BUS.route} trip started by ${user.name}`, '🚌')
    })
    toast('Trip started · GPS sharing ON · parents notified', '🟢')
  }
  const end = () => {
    mutate((d, { notify }) => { d.trip.status = 'idle'; notify('principal', `${BUS.route} trip ended · ${Object.keys(d.trip.boarded).length} students dropped at school`, '🏫') })
    toast('Trip ended · GPS sharing OFF', '🏁')
  }
  const report = ([e, reason, min]) => {
    mutate((d, { notify }) => {
      d.trip.delayMin = (d.trip.delayMin || 0) + min; d.trip.delayReason = reason
      notify('rajesh', `${BUS.route} delayed by ~${min} min: ${reason}`, '⚠️')
      notify('principal', `${BUS.route} delay +${min} min reported: ${reason}`, '⚠️')
    })
    setDelay(false)
    toast(`Delay sent to all ${BUS.boardList.length} families on the route`, '📣')
  }

  return (
    <div className="space-y-4 px-4 pb-4">
      <HomeHeader greeting={translate(greeting(), lang)} name={user.short} sub={`${BUS.id} · ${BUS.route}`} userId={user.id} />

      <Card className="overflow-hidden">
        <BusMap bus={bus} className="block h-auto w-full" />
        <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 text-center">
          <div className="p-2.5"><div className="text-[10px] font-semibold text-slate-500">Speed</div><div className={cx('font-display text-lg font-extrabold', bus.speed > BUS.speedLimit ? 'text-red-600' : 'text-foreground')}><Gauge className="mr-0.5 inline h-4 w-4" />{bus.speed}</div></div>
          <div className="p-2.5"><div className="text-[10px] font-semibold text-slate-500">On board</div><div className="font-display text-lg font-extrabold text-foreground"><Users className="mr-0.5 inline h-4 w-4" />{onboard}/{BUS.capacity}</div></div>
          <div className="p-2.5"><div className="text-[10px] font-semibold text-slate-500">Progress</div><div className="font-display text-lg font-extrabold text-foreground">{Math.round(bus.p * 100)}%</div></div>
        </div>
      </Card>

      {bus.idle || bus.arrived ? (
        <Button size="lg" variant="teal" className="h-16 w-full rounded-2xl text-lg" icon={Play} onClick={start}>{translate('startTrip', lang)} · Morning pickup</Button>
      ) : (
        <Card className="border-l-4 border-sun-400 p-4">
          <div className="text-[11px] font-bold uppercase tracking-wide text-sun-600">Next stop · {bus.eta(bus.nextIdx)} min</div>
          <div className="mt-0.5 flex items-center gap-2 font-display text-xl font-extrabold text-foreground"><MapPin className="h-5 w-5 text-coral-500" />{next.name}</div>
          <div className="text-xs text-slate-500">{next.ml} · scheduled {next.t} AM</div>
          {atNext.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {atNext.map((s) => {
                const on = !!state.trip.boarded[s.name]
                return (
                  <button key={s.name} onClick={() => board(s.name, !on)} className={cx('flex w-full items-center gap-3 rounded-xl p-2.5 text-left ring-1', on ? 'bg-teal-50 ring-teal-500/40' : 'bg-card ring-slate-200')}>
                    <span className={cx('grid h-7 w-7 place-items-center rounded-full', on ? 'bg-teal-500' : 'bg-slate-200')}>{on && <Check className="h-4 w-4 text-white" strokeWidth={3} />}</span>
                    <span className="flex-1 text-sm font-semibold text-foreground">{s.name}</span><Badge>{s.cls}</Badge>
                  </button>
                )
              })}
            </div>
          )}
        </Card>
      )}

      {state.trip.delayMin > 0 && running && <div className="flex items-center gap-2 rounded-xl bg-sun-50 p-3 text-xs font-semibold text-sun-700 ring-1 ring-sun-500/20"><AlertTriangle className="h-4 w-4" /> Delay shared with parents: +{state.trip.delayMin} min · {state.trip.delayReason}</div>}

      <div className="grid grid-cols-[1fr_auto] items-center gap-3">
        <div className="grid gap-2">
          <Button variant="sun" size="lg" className="w-full rounded-2xl" icon={AlertTriangle} disabled={!running} onClick={() => setDelay(true)}>{translate('reportDelay', lang)}</Button>
          <Button variant="outline" size="lg" className="w-full rounded-2xl" icon={Square} disabled={bus.idle} onClick={end}>{translate('endTrip', lang)}</Button>
        </div>
        <SOSButton big />
      </div>

      <Card className="p-4">
        <SectionTitle>Today’s stops</SectionTitle>
        <div className="space-y-2">
          {BUS.stops.map((s, i) => {
            const passed = bus.p >= STOP_FRAC[i]
            return (
              <div key={s.id} className="flex items-center gap-3 text-sm">
                <span className={cx('h-3 w-3 rounded-full', passed ? 'bg-teal-500' : 'bg-slate-200')} />
                <span className={cx('flex-1', passed ? 'text-slate-400 line-through' : 'font-semibold text-foreground')}>{s.name}</span>
                <span className="text-xs text-slate-400">{s.t}</span>
              </div>
            )
          })}
        </div>
      </Card>

      <Sheet open={delay} onClose={() => setDelay(false)} title="Report a delay">
        <p className="mb-3 text-sm text-slate-600">One tap sends a voice + text alert to every family on {BUS.route}.</p>
        <div className="space-y-2">
          {DELAYS.map((d) => (
            <button key={d[1]} onClick={() => report(d)} className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left ring-1 ring-slate-200 hover:bg-sun-50 hover:ring-sun-400">
              {(() => { const I = d[0]; return <span className="grid h-10 w-10 place-items-center rounded-xl bg-sun-50 text-sun-600"><I className="h-5 w-5" /></span> })()}<span className="flex-1 font-semibold text-foreground">{d[1]}</span><Badge color="sun">+{d[2]} min</Badge>
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  )
}

export function DriverStudents() {
  const { state } = useStore()
  const { user } = useSession()
  const board = useBoard()
  const onboard = Object.keys(state.trip.boarded).length
  return (
    <div>
      <MobileHeader title="Boarding list" sub={`${onboard} of ${BUS.boardList.length} on board · attender ${BUS.attender}`} right={<HeaderActions userId={user.id} />} />
      <div className="space-y-4 px-4">
        <Progress value={(onboard / BUS.boardList.length) * 100} h={10} />
        {BUS.stops.filter((s) => !s.isSchool).map((stop) => (
          <div key={stop.id}>
            <SectionTitle>{stop.name} · {stop.t}</SectionTitle>
            <Card className="divide-y divide-slate-100">
              {BUS.boardList.filter((s) => s.stop === stop.id).map((s) => {
                const on = !!state.trip.boarded[s.name]
                return (
                  <button key={s.name} onClick={() => board(s.name, !on)} className="flex w-full items-center gap-3 p-3 text-left">
                    <span className={cx('grid h-8 w-8 place-items-center rounded-full', on ? 'bg-teal-500' : 'bg-slate-100')}>{on ? <Check className="h-4 w-4 text-white" strokeWidth={3} /> : <span className="text-xs font-bold text-slate-400">{s.name[0]}</span>}</span>
                    <span className="flex-1"><span className="block text-sm font-semibold text-foreground">{s.name}</span><span className="text-[11px] text-slate-500">Class {s.cls}</span></span>
                    <Badge color={on ? 'green' : 'slate'}>{on ? 'On board' : 'Waiting'}</Badge>
                  </button>
                )
              })}
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DriverChecklist() {
  const { user } = useSession()
  const toast = useToast()
  const items = ['Tyres & brakes checked', 'First-aid kit stocked', 'Fire extinguisher valid', 'GPS device online', 'CCTV camera recording', 'Speed governor sealed (40 km/h)', 'Lady attender on board', 'Doors & emergency exit working']
  const [done, setDone] = useState({ 0: true, 3: true, 4: true })
  const docs = [['Fitness certificate', 'Valid till Mar 2027', 'green'], ['Insurance', 'Valid till Jan 2027', 'green'], ['Permit', 'Renew in 24 days', 'sun'], ['PUC', 'Valid till Dec 2026', 'green'], ['Driver police verification', 'Verified Jun 2026', 'green']]
  const count = Object.values(done).filter(Boolean).length
  return (
    <div>
      <MobileHeader title="Safety checklist" sub="Daily pre-trip inspection (MVD guidelines)" right={<HeaderActions userId={user.id} />} />
      <div className="space-y-4 px-4">
        <Card className="p-4">
          <div className="mb-2 flex justify-between text-sm"><b className="text-foreground">Pre-trip inspection</b><span className="text-slate-500">{count}/{items.length}</span></div>
          <Progress value={(count / items.length) * 100} />
          <div className="mt-3 divide-y divide-slate-100">
            {items.map((it, i) => (
              <button key={it} onClick={() => setDone({ ...done, [i]: !done[i] })} className="flex w-full items-center gap-3 py-2.5 text-left">
                <span className={cx('grid h-6 w-6 place-items-center rounded-lg border-2', done[i] ? 'border-teal-500 bg-teal-500' : 'border-slate-300')}>{done[i] && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}</span>
                <span className="text-sm text-foreground">{it}</span>
              </button>
            ))}
          </div>
          <Button className="mt-3 w-full" variant="teal" disabled={count < items.length} onClick={() => toast('Inspection submitted to transport cell', '✅')}>{count < items.length ? `${items.length - count} checks left` : 'Submit inspection'}</Button>
        </Card>
        <Card className="p-4">
          <SectionTitle>Vehicle documents</SectionTitle>
          {docs.map(([n, s, c]) => <div key={n} className="flex items-center justify-between border-b border-slate-100 py-2.5 last:border-0"><span className="text-sm text-foreground">{n}</span><Badge color={c}>{s}</Badge></div>)}
        </Card>
      </div>
    </div>
  )
}
