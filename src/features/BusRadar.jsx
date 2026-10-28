import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, BadgeCheck, Bell, Clock, Gauge, Phone, RotateCcw, ShieldAlert, UserRound } from 'lucide-react'
import { BusMap, STOP_FRAC, useBus } from '../components/BusMap'
import { Avatar, Badge, Button, Card, SectionTitle, Sheet, Toggle, useToast } from '../components/ui'
import { MobileHeader, HeaderActions } from '../components/MobileShell'
import { useSession, useStore } from '../store/Store'
import { BUS, USERS } from '../data/seed'
import { translate } from '../i18n'
import { cx, maskPhone, uid } from '../lib/utils'

export function useSOS() {
  const { mutate } = useStore()
  const { user } = useSession()
  const toast = useToast()
  return (where = 'Route 3 · near Athavanad') => {
    mutate((d, { notify }) => {
      d.sos.unshift({ id: uid('SOS'), from: user.name, role: user.role, at: new Date().toISOString(), where, status: 'Active' })
      notify('principal', `🚨 SOS from ${user.name} (${where})`, '🚨')
      notify('admin', `🚨 SOS raised on ${BUS.route} by ${user.name}`, '🚨')
      notify('shaji', `SOS raised by ${user.name}. School office is calling you.`, '🚨')
      if (user.role !== 'parent') notify('rajesh', `SOS alert raised by ${user.name}. School transport cell has been informed.`, '🚨')
    })
    toast('SOS sent to school, transport cell & parents', '🚨')
  }
}

export function SOSButton({ className, big }) {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(3)
  const send = useSOS()
  const timer = useRef(null)
  useEffect(() => {
    if (!open) return
    setCount(3)
    timer.current = setInterval(() => setCount((c) => c - 1), 1000)
    return () => clearInterval(timer.current)
  }, [open])
  useEffect(() => {
    if (open && count <= 0) { clearInterval(timer.current); setOpen(false); send() }
  }, [count, open, send])
  return (
    <>
      <button onClick={() => setOpen(true)} className={cx('relative grid place-items-center rounded-full bg-red-600 font-extrabold text-white shadow-[0_8px_24px_rgba(220,38,38,.45)] active:scale-95', big ? 'h-28 w-28 text-2xl' : 'h-14 w-14 text-sm', className)}>
        <span className="absolute inset-0 animate-pulseRing rounded-full bg-red-500/60" />
        <span className="relative">SOS</span>
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Emergency alert">
        <div className="text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-red-50 font-display text-5xl font-extrabold text-red-600">{Math.max(count, 0)}</div>
          <p className="mt-4 text-sm text-slate-600">Sending SOS with live bus location to the <b>school transport cell, principal and parents</b>.</p>
          <p className="mt-1 text-xs text-slate-400">Vidya Sethu is not an emergency service. For medical or police emergencies also call <b>112</b>.</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button variant="soft" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => { setOpen(false); send() }}>Send now</Button>
          </div>
        </div>
      </Sheet>
    </>
  )
}

export default function BusRadar({ role = 'parent' }) {
  const { state, mutate } = useStore()
  const { user } = useSession()
  const bus = useBus()
  const toast = useToast()
  const lang = state.lang
  const driver = USERS.shaji
  const [callOpen, setCallOpen] = useState(false)
  const [alertOn, setAlertOn] = useState(true)
  const childName = role === 'parent' ? USERS[state.activeChild].name : user.name
  const homeEta = bus.eta(bus.homeIdx)
  const boarded = state.trip.boarded[childName]

  // proximity alert: bus 5 minutes away from home stop
  useEffect(() => {
    if (!alertOn || bus.idle || bus.passedHome) return
    if (homeEta <= 5 && !state.alertsSent[user.id + '-5min']) {
      mutate((d, { notify }) => { d.alertsSent[user.id + '-5min'] = true; notify(user.id, `Bus ${BUS.id} is ${homeEta} min away from Athavanad Market`, '🚌') })
      toast(`Bus is ${homeEta} min away — get ready!`, '🚌')
    }
  }, [homeEta, alertOn, bus.idle, bus.passedHome, state.alertsSent, user.id, mutate, toast])

  const statusText = bus.idle ? 'Trip not started' : bus.arrived ? 'Reached school' : bus.passedHome ? `Heading to ${BUS.stops[bus.nextIdx].name}` : `${homeEta} ${translate('min', lang)}`

  return (
    <div>
      <MobileHeader title={translate('busRadar', lang)} sub={`${BUS.route} · ${BUS.id}`} right={<HeaderActions userId={user.id} />} />
      <div className="space-y-4 px-4">
        <Card className="overflow-hidden">
          <div className="relative">
            <BusMap bus={bus} className="block h-auto w-full" />
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-card/95 px-2.5 py-1 text-[11px] font-bold text-foreground shadow">
              <span className={cx('h-2 w-2 rounded-full', bus.idle ? 'bg-slate-400' : 'animate-pulse bg-emerald-500')} /> {bus.idle ? 'Offline' : translate('liveTracking', lang)}
            </div>
            <div className="absolute right-3 top-3 rounded-full bg-card/95 px-2.5 py-1 text-[11px] font-semibold text-slate-600 shadow">
              <Gauge className="mr-1 inline h-3 w-3" />{bus.speed} km/h
            </div>
          </div>
          <div className="border-t border-slate-100 p-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-slate-500">{bus.passedHome || bus.idle || bus.arrived ? 'Status' : `${translate('busArriving', lang)} · Athavanad Market`}</div>
                <div className="font-display text-3xl font-extrabold text-foreground">{statusText}</div>
              </div>
              <div className="text-right text-[11px] text-slate-400">Updated<br /><span className="font-semibold text-slate-600">{new Date(bus.now).toLocaleTimeString('en-IN')}</span></div>
            </div>
            {state.trip.delayMin > 0 && (
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-sun-50 p-3 text-xs text-sun-700 ring-1 ring-sun-500/20">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div><b>Delay reported by driver: +{state.trip.delayMin} min</b><br />{state.trip.delayReason}</div>
              </div>
            )}
            {boarded && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-teal-50 p-3 text-xs font-semibold text-teal-700">
                <BadgeCheck className="h-4 w-4" /> {childName.split(' ')[0]} boarded the bus · attendance marked by attender
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-[1fr_auto] items-center gap-3">
          <Card className="p-3">
            <div className="flex items-center gap-3">
              <Avatar name={driver.name} color="#e9a21c" size={48} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-sm font-bold text-foreground">{driver.name} <BadgeCheck className="h-4 w-4 fill-teal-500 text-white" /></div>
                <div className="text-[11px] text-slate-500">Driver · {driver.exp} · Police verified</div>
                <div className="text-[11px] text-slate-500">Attender: {BUS.attender}</div>
              </div>
              <button onClick={() => setCallOpen(true)} className="grid h-10 w-10 place-items-center rounded-full bg-teal-500 text-white" aria-label={translate('callDriver', lang)}><Phone className="h-4 w-4" /></button>
            </div>
          </Card>
          <SOSButton />
        </div>

        <Card className="p-4">
          <SectionTitle>Route timeline</SectionTitle>
          <ol className="relative ml-2 border-l-2 border-slate-100">
            {BUS.stops.map((s, i) => {
              const passed = bus.p >= STOP_FRAC[i]
              const isNext = !bus.idle && !bus.arrived && i === bus.nextIdx
              return (
                <li key={s.id} className="mb-3 ml-4 last:mb-0">
                  <span className={cx('absolute -left-[9px] mt-0.5 h-4 w-4 rounded-full border-2', passed ? 'border-teal-500 bg-teal-500' : isNext ? 'border-sun-500 bg-card' : 'border-slate-300 bg-card')} />
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className={cx('text-[13px]', passed ? 'text-slate-500' : 'font-semibold text-foreground')}>{lang === 'ml' ? s.ml : s.name} {s.isHome && <Badge color="sun">Your stop</Badge>}</div>
                      <div className="text-[11px] text-slate-400">Scheduled {s.t} AM{s.students ? ` · ${s.students} students` : ''}</div>
                    </div>
                    <div className="text-right text-xs font-semibold">{passed ? <span className="text-teal-600">Passed ✓</span> : bus.idle ? <span className="text-slate-400">—</span> : <span className={isNext ? 'text-sun-600' : 'text-slate-500'}>{bus.eta(i)} min</span>}</div>
                  </div>
                </li>
              )
            })}
          </ol>
        </Card>

        <Card className="p-4">
          <Toggle checked={alertOn} onChange={setAlertOn} label="Alert me 5 minutes before arrival" sub="Push + voice alert in your language" />
          <Toggle checked label="Alert if bus is delayed or off-route" sub="Geofence alert from GPS" onChange={() => {}} />
          <div className="mt-2 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500">
            <ShieldAlert className="h-4 w-4 shrink-0 text-slate-400" /> Location is shared only during school trips and only with families on this route.
          </div>
        </Card>
      </div>

      <Sheet open={callOpen} onClose={() => setCallOpen(false)} title="Masked call">
        <div className="text-center">
          <div className="flex justify-center"><Avatar name={driver.name} color="#e9a21c" size={76} /></div>
          <div className="mt-3 font-bold text-foreground">{driver.name}</div>
          <div className="text-sm text-slate-500">{maskPhone(driver.phone)}</div>
          <p className="mx-auto mt-3 max-w-xs text-xs text-slate-500">Calls are connected through the Vidya Sethu bridge number. Neither side sees the other’s personal phone number.</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button variant="soft" onClick={() => setCallOpen(false)}>Cancel</Button>
            <Button variant="teal" icon={Phone} onClick={() => { setCallOpen(false); toast('Connecting via bridge number 0483-2•••••…', '📞') }}>Call now</Button>
          </div>
        </div>
      </Sheet>
    </div>
  )
}

export function BusMiniCard({ onOpen, childName }) {
  const bus = useBus()
  const { state } = useStore()
  const eta = bus.eta(bus.homeIdx)
  return (
    <Card onClick={onOpen} className="overflow-hidden">
      <div className="flex">
        <div className="w-[42%] shrink-0 map-box"><BusMap bus={bus} compact className="h-full w-full" /></div>
        <div className="flex-1 p-3.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> {BUS.route} · LIVE</div>
          {bus.idle ? <div className="mt-1 font-display text-lg font-extrabold text-foreground">Not started</div>
            : bus.arrived ? <div className="mt-1 font-display text-lg font-extrabold text-foreground">At school ✓</div>
              : bus.passedHome ? <div className="mt-1 font-display text-lg font-extrabold text-foreground">On the way to school</div>
                : <div className="mt-1 font-display text-2xl font-extrabold text-foreground">{eta} min</div>}
          <div className="text-[11px] text-slate-500">{bus.passedHome || bus.arrived ? `Next: ${BUS.stops[bus.nextIdx].name}` : 'to Athavanad Market (your stop)'}</div>
          {state.trip.delayMin > 0 && <div className="mt-1 text-[11px] font-semibold text-sun-600">⚠ +{state.trip.delayMin} min delay</div>}
          {childName && state.trip.boarded[childName] && <div className="mt-1 text-[11px] font-semibold text-teal-600">✓ {childName.split(' ')[0]} on board</div>}
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400"><Clock className="h-3 w-3" /> {bus.speed} km/h · <UserRound className="h-3 w-3" /> Shaji V. <Bell className="h-3 w-3" /></div>
        </div>
      </div>
    </Card>
  )
}
