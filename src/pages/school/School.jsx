import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Area, Bar, BarChart, CartesianGrid, ComposedChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AlertTriangle, BellRing, Bus, Check, CheckCircle2, Clock, Download, FileCheck2, Megaphone, PhoneCall, Send, ShieldAlert, Smartphone, Users, X } from 'lucide-react'
import { Panel } from '../../components/DashShell'
import { Badge, Button, Field, Sheet, Stat, Tabs, Toggle, Verified, inputCls, useToast } from '../../components/ui'
import { BusMap, useBus } from '../../components/BusMap'
import { SOURCE_META } from '../../features/NoticeBoard'
import { useStore } from '../../store/Store'
import { BUS, FLEET, SCHOOL, WEEKLY_METRICS } from '../../data/seed'
import { cx, inr, timeAgo, uid } from '../../lib/utils'

const ST = { New: 'sky', 'In progress': 'sun', Resolved: 'green', Escalated: 'red' }

export function Overview() {
  const { state } = useStore()
  const nav = useNavigate()
  const pending = state.notices.filter((n) => n.status === 'pending')
  const activeSos = state.sos.filter((s) => s.status === 'Active')
  const openReq = state.requests.filter((r) => r.status !== 'Resolved')
  const verified = state.notices.filter((n) => n.status === 'verified')
  const readRate = Math.round((verified.reduce((a, n) => a + n.reads, 0) / Math.max(1, verified.reduce((a, n) => a + n.reach, 0))) * 100)
  return (
    <div className="space-y-4">
      {activeSos.length > 0 && (
        <button onClick={() => nav('/school/transport')} className="flex w-full items-center gap-3 rounded-2xl bg-red-600 p-4 text-left text-white shadow-float">
          <BellRing className="h-6 w-6 animate-pulse" />
          <div className="flex-1"><div className="font-bold">{activeSos.length} active SOS alert(s)</div><div className="text-sm text-white/80">{activeSos[0].from} · {activeSos[0].where} · {timeAgo(activeSos[0].at)}</div></div>
          <span className="rounded-xl bg-white px-3 py-1.5 text-sm font-bold text-red-600">Respond →</span>
        </button>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h2 className="font-display text-2xl font-extrabold text-navy-800">{SCHOOL.name}</h2><p className="text-sm text-slate-500">{SCHOOL.place} · School code {SCHOOL.code} · {SCHOOL.students} students · {SCHOOL.teachers} teachers</p></div>
        <Button variant="coral" icon={Megaphone} onClick={() => nav('/school/broadcast')}>Emergency broadcast</Button>
      </div>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        <Stat label="Families active (30d)" value="82%" sub="971 of 1,184" icon={Users} trend="▲ 9% vs last month" />
        <Stat label="Notice read rate" value={`${readRate}%`} sub="WhatsApp groups: ~40% (survey)" icon={FileCheck2} tone="sky" />
        <Stat label="Avg. request response" value="3.2 h" sub={`${openReq.length} open requests`} icon={Clock} tone="sun" trend="▼ from 11.2 h in week 1" />
        <Stat label="Buses live" value="2 / 4" sub="GPS: Vidya Vahan-compatible" icon={Bus} tone="navy" />
        <Stat label="Pending verification" value={pending.length} sub="notices waiting" icon={ShieldAlert} tone="coral" />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Family adoption & notice reads" sub="Weekly, since pilot launch" className="xl:col-span-2">
          <div className="h-64">
            <ResponsiveContainer>
              <ComposedChart data={WEEKLY_METRICS.map((w) => ({ ...w, families: Math.round(w.families / 2.9) }))}>
                <defs><linearGradient id="fa" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#26a69a" stopOpacity=".35" /><stop offset="1" stopColor="#26a69a" stopOpacity="0" /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" /><XAxis dataKey="w" tick={{ fontSize: 11 }} /><YAxis yAxisId="l" tick={{ fontSize: 11 }} /><YAxis yAxisId="r" orientation="right" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" /><Tooltip />
                <Area yAxisId="l" dataKey="families" name="Active families" stroke="#26a69a" strokeWidth={3} fill="url(#fa)" />
                <Line yAxisId="r" dataKey="reads" name="Read rate %" stroke="#f6b93b" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Needs your action">
          <div className="space-y-2">
            {pending.map((n) => <button key={n.id} onClick={() => nav('/school/verify')} className="flex w-full items-center gap-3 rounded-xl bg-sun-50 p-3 text-left"><FileCheck2 className="h-5 w-5 text-sun-600" /><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-navy-800">{n.title}</div><div className="text-xs text-slate-500">Verify notice · {n.author}</div></div></button>)}
            {state.nominations.filter((n) => n.status === 'Pending school verification').map((n) => <button key={n.id} onClick={() => nav('/school/sponsorship')} className="flex w-full items-center gap-3 rounded-xl bg-sky-50 p-3 text-left"><Users className="h-5 w-5 text-sky-500" /><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-navy-800">{n.need}</div><div className="text-xs text-slate-500">Verify NGO nomination · {n.cls}</div></div></button>)}
            {openReq.filter((r) => r.assigned === 'Unassigned').map((r) => <button key={r.id} onClick={() => nav('/school/requests')} className="flex w-full items-center gap-3 rounded-xl bg-coral-50 p-3 text-left"><AlertTriangle className="h-5 w-5 text-coral-500" /><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-navy-800">{r.title}</div><div className="text-xs text-slate-500">Unassigned request · {timeAgo(r.createdAt)}</div></div></button>)}
          </div>
        </Panel>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Latest verified notices" pad={false}>
          <div className="divide-y divide-slate-100">
            {verified.slice(0, 5).map((n) => (
              <div key={n.id} className="flex items-center gap-3 px-5 py-3">
                <span className="text-lg">{SOURCE_META[n.source].icon}</span>
                <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-navy-800">{n.title}</div><div className="text-xs text-slate-500">{n.audience} · {timeAgo(n.at)}</div></div>
                <div className="w-28"><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-teal-500" style={{ width: `${(n.reads / Math.max(1, n.reach)) * 100}%` }} /></div><div className="mt-0.5 text-right text-[10px] text-slate-500">{n.reads}/{n.reach} read</div></div>
              </div>
            ))}
          </div>
        </Panel>
        <LiveFleet />
      </div>
    </div>
  )
}

function LiveFleet() {
  const bus = useBus()
  const { state } = useStore()
  return (
    <Panel title="Fleet right now" sub="Route 3 shown live" pad={false}>
      <div className="grid sm:grid-cols-[1fr_1fr]">
        <div className="bg-[#eef3ea]"><BusMap bus={bus} className="h-full w-full" /></div>
        <div className="divide-y divide-slate-100">
          {FLEET.map((f) => {
            const live = f.route === 'Route 3'
            const status = live ? (bus.idle ? 'Not started' : bus.arrived ? 'Arrived' : 'On route') : f.status
            const delay = live ? state.trip.delayMin : f.delay
            return (
              <div key={f.id} className="flex items-center gap-3 px-4 py-3">
                <span className={cx('h-2.5 w-2.5 rounded-full', status === 'On route' ? 'animate-pulse bg-emerald-500' : status === 'Arrived' ? 'bg-sky-500' : 'bg-slate-300')} />
                <div className="min-w-0 flex-1"><div className="text-sm font-semibold text-navy-800">{f.route} <span className="font-mono text-[11px] text-slate-400">{f.id}</span></div><div className="text-xs text-slate-500">{f.driver} · {status}</div></div>
                {delay > 0 && <Badge color="sun">+{delay}m</Badge>}
              </div>
            )
          })}
        </div>
      </div>
    </Panel>
  )
}

export function Verify() {
  const { state, mutate } = useStore()
  const toast = useToast()
  const [edit, setEdit] = useState(null)
  const pending = state.notices.filter((n) => n.status === 'pending')
  const decide = (n, ok) => {
    mutate((d, { notify }) => {
      const x = d.notices.find((k) => k.id === n.id)
      x.status = ok ? 'verified' : 'rejected'
      if (ok) {
        x.at = new Date().toISOString(); x.reach = x.audience.includes('All') ? 1184 : x.audience.includes('9-B') ? 34 : 182; x.reads = 0
        notify('rajesh', `New verified notice: ${x.title}`, '📢'); notify('ananya', `New notice: ${x.title}`, '📢')
      }
      if (x.author === 'Fathima Nasrin') notify('fathima', `Your notice “${x.title}” was ${ok ? 'approved and published ✓' : 'returned for changes'}`, ok ? '✅' : '↩️')
    })
    toast(ok ? 'Published as verified ✓ · families notified' : 'Returned to author with comments', ok ? '✅' : '↩️')
  }
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-teal-50 p-4 text-sm text-teal-900 ring-1 ring-teal-500/20"><b>Why verification?</b> Families get exam dates, holidays and safety alerts only from accountable people, not WhatsApp forwards. Every published notice carries a ✓ Verified badge with the name of the person who verified it.</div>
      {pending.length === 0 && <Panel><div className="py-10 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-teal-500" /><div className="mt-2 font-semibold text-navy-800">Queue is clear</div><div className="text-sm text-slate-500">New teacher & partner notices will appear here.</div></div></Panel>}
      <div className="grid gap-4 xl:grid-cols-2">
        {pending.map((n) => (
          <Panel key={n.id} title={n.title} sub={`${n.author} · ${n.authorRole} · ${timeAgo(n.at)}`}
            action={<Badge color={SOURCE_META[n.source].color}>{SOURCE_META[n.source].label}</Badge>}>
            <p className="text-sm text-slate-700">{n.body}</p>
            {n.bodyMl && <p className="mt-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{n.bodyMl}</p>}
            <div className="mt-3 flex flex-wrap gap-2 text-xs"><Badge>{n.category}</Badge><Badge>Audience: {n.audience}</Badge><Badge color="sky">Voice playback auto-generated</Badge></div>
            <div className="mt-4 flex gap-2">
              <Button variant="teal" icon={Check} onClick={() => decide(n, true)}>Verify & publish</Button>
              <Button variant="soft" onClick={() => setEdit(n)}>Edit</Button>
              <Button variant="outline" icon={X} onClick={() => decide(n, false)}>Return</Button>
            </div>
          </Panel>
        ))}
      </div>
      <Panel title="Recently verified" pad={false}>
        <div className="divide-y divide-slate-100">{state.notices.filter((n) => n.status !== 'pending').slice(0, 6).map((n) => <div key={n.id} className="flex items-center gap-3 px-5 py-3"><div className="min-w-0 flex-1 truncate text-sm text-navy-800">{n.title}</div>{n.status === 'verified' ? <Verified /> : <Badge color="red">Returned</Badge>}</div>)}</div>
      </Panel>
      <Sheet fixed open={!!edit} onClose={() => setEdit(null)} title="Edit before publishing" footer={<Button className="w-full" variant="teal" onClick={() => { decide(edit, true); setEdit(null) }}>Save, verify & publish</Button>}>
        {edit && <><Field label="Title"><input className={inputCls} defaultValue={edit.title} /></Field><Field label="Body"><textarea className={cx(inputCls, 'h-32')} defaultValue={edit.body} /></Field></>}
      </Sheet>
    </div>
  )
}

export function Broadcast() {
  const { mutate } = useStore()
  const toast = useToast()
  const [f, setF] = useState({ title: 'Holiday tomorrow due to heavy rain (orange alert)', body: 'As per the District Collector’s order, all schools in Malappuram district will remain closed tomorrow due to the orange alert. Students should stay away from rivers and waterlogged areas.', app: true, voice: true, sms: true, ml: true, hi: true, audience: 'All families (1,184)' })
  const n = 1184
  const cost = { app: 0, sms: n * 0.18, voice: 213 * 0.9, wa: n * 0.115 }
  const send = () => {
    mutate((d, { notify }) => {
      d.notices.unshift({ id: uid('n'), source: 'school', category: 'Emergency', status: 'verified', urgent: true, pinned: true, title: f.title, titleMl: 'കനത്ത മഴ: നാളെ സ്കൂളിന് അവധി (ഓറഞ്ച് അലർട്ട്)', body: f.body, bodyMl: 'ജില്ലാ കളക്ടറുടെ ഉത്തരവ് പ്രകാരം ഓറഞ്ച് അലർട്ട് കാരണം നാളെ മലപ്പുറം ജില്ലയിലെ എല്ലാ സ്കൂളുകൾക്കും അവധിയായിരിക്കും. കുട്ടികൾ പുഴകളിൽ നിന്നും വെള്ളക്കെട്ടുകളിൽ നിന്നും അകന്നുനിൽക്കണം.', author: 'Dr. Mini Thomas', authorRole: 'Principal', at: new Date().toISOString(), audience: 'All families', reach: n, reads: 0, readBy: {} })
      ;['rajesh', 'ananya', 'aarav', 'fathima', 'shaji'].forEach((u) => notify(u, `🚨 ${f.title}`, '🚨'))
    })
    toast(`Broadcast sent to ${n} families · app + voice call + SMS fallback`, '📣')
  }
  return (
    <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
      <Panel title="Emergency / urgent broadcast" sub="Published instantly as verified. Reaches families without smartphones through voice calls (IVR) and SMS.">
        <Field label="Title"><input className={inputCls} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
        <Field label="Message"><textarea className={cx(inputCls, 'h-28 resize-none')} value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} /></Field>
        <Field label="Audience"><select className={inputCls} value={f.audience} onChange={(e) => setF({ ...f, audience: e.target.value })}>{['All families (1,184)', 'Route 3 families (86)', 'Class 10 families (198)', 'Staff only (46)'].map((a) => <option key={a}>{a}</option>)}</select></Field>
        <div className="grid gap-x-6 rounded-xl bg-slate-50 px-4 py-1 sm:grid-cols-2">
          <Toggle checked={f.app} onChange={(v) => setF({ ...f, app: v })} label="App push + voice playback" />
          <Toggle checked={f.voice} onChange={(v) => setF({ ...f, voice: v })} label="Voice call (IVR) for 213 non-app families" />
          <Toggle checked={f.sms} onChange={(v) => setF({ ...f, sms: v })} label="SMS fallback" />
          <Toggle checked={f.ml} onChange={(v) => setF({ ...f, ml: v })} label="Malayalam version" />
          <Toggle checked={f.hi} onChange={(v) => setF({ ...f, hi: v })} label="Hindi version (migrant families)" />
        </div>
        <Button className="mt-4 w-full" size="lg" variant="coral" icon={Send} onClick={send}>Send broadcast now</Button>
      </Panel>
      <div className="space-y-4">
        <Panel title="Delivery preview">
          <div className="mx-auto w-64 rounded-[2rem] border-[8px] border-navy-900 bg-slate-50 p-3">
            <div className="rounded-2xl bg-white p-3 shadow-card">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400"><Smartphone className="h-3 w-3" /> VIDYA SETHU · now</div>
              <div className="mt-1 text-[12px] font-bold text-navy-800">🚨 {f.title}</div>
              <div className="mt-0.5 line-clamp-3 text-[11px] text-slate-600">{f.body}</div>
              <div className="mt-2 flex gap-1"><Badge color="red">Important</Badge><Verified label="Principal" /></div>
            </div>
          </div>
        </Panel>
        <Panel title="Estimated cost per broadcast" sub="Based on 2026 messaging rates in the research report">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-600">In-app push (1,184)</span><b className="text-teal-700">₹0</b></div>
            <div className="flex justify-between"><span className="text-slate-600">Voice calls (213 × ₹0.90)</span><b>{inr(Math.round(cost.voice))}</b></div>
            <div className="flex justify-between"><span className="text-slate-600">SMS fallback (1,184 × ₹0.18)</span><b>{inr(Math.round(cost.sms))}</b></div>
            <div className="flex justify-between border-t border-slate-100 pt-2 text-slate-400"><span>vs. WhatsApp utility template only</span><span>{inr(Math.round(cost.wa))}</span></div>
          </div>
        </Panel>
      </div>
    </div>
  )
}

export function Transport() {
  const { state, mutate } = useStore()
  const toast = useToast()
  const bus = useBus()
  const resolve = (id) => { mutate((d, { notify }) => { const s = d.sos.find((x) => x.id === id); s.status = 'Resolved'; s.resolvedAt = new Date().toISOString(); notify('rajesh', 'SOS resolved: school transport cell confirmed everyone is safe.', '✅') }); toast('SOS marked resolved · families informed', '✅') }
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Panel title={`${BUS.route} · ${BUS.id}`} sub={BUS.name} pad={false} action={<Badge color={bus.idle ? 'slate' : 'green'}>{bus.idle ? 'Not running' : bus.arrived ? 'Arrived' : `Live · ${bus.speed} km/h`}</Badge>}>
          <div className="bg-[#eef3ea]"><BusMap bus={bus} className="mx-auto block max-h-[420px] w-full" /></div>
          <div className="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100 text-center sm:grid-cols-4">
            <div className="p-3"><div className="text-[11px] text-slate-500">Next stop</div><div className="text-sm font-bold text-navy-800">{BUS.stops[bus.nextIdx].name}</div></div>
            <div className="p-3"><div className="text-[11px] text-slate-500">On board</div><div className="text-sm font-bold text-navy-800">{Object.keys(state.trip.boarded).length}/{BUS.capacity}</div></div>
            <div className="p-3"><div className="text-[11px] text-slate-500">Delay</div><div className="text-sm font-bold text-navy-800">{state.trip.delayMin ? `+${state.trip.delayMin} min` : 'On time'}</div></div>
            <div className="p-3"><div className="text-[11px] text-slate-500">Speed limit</div><div className="text-sm font-bold text-navy-800">{BUS.speedLimit} km/h</div></div>
          </div>
        </Panel>
        <Panel title="SOS & incident log" sub="Every alert reaches principal, transport cell and parents on the route">
          {state.sos.length === 0 && <div className="py-6 text-center text-sm text-slate-500">No SOS alerts. Try the SOS button in the student, parent or driver app.</div>}
          <div className="space-y-2">
            {state.sos.map((s) => (
              <div key={s.id} className={cx('rounded-xl p-3 ring-1', s.status === 'Active' ? 'bg-red-50 ring-red-200' : 'bg-slate-50 ring-slate-100')}>
                <div className="flex items-center justify-between"><b className={cx('text-sm', s.status === 'Active' ? 'text-red-700' : 'text-navy-800')}>🚨 {s.from} ({s.role})</b><Badge color={s.status === 'Active' ? 'red' : 'green'}>{s.status}</Badge></div>
                <div className="mt-0.5 text-xs text-slate-500">{s.where} · {timeAgo(s.at)}</div>
                {s.status === 'Active' && <div className="mt-2 flex gap-2"><Button size="sm" variant="danger" icon={PhoneCall} onClick={() => toast('Calling driver Shaji via bridge line…', '📞')}>Call driver</Button><Button size="sm" variant="outline" onClick={() => resolve(s.id)}>Mark resolved</Button></div>}
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500">Escalation rule: if not acknowledged in 2 min → auto-call principal; at 5 min → notify local police control room (112) with GPS.</div>
        </Panel>
      </div>
      <Panel title="Fleet & drivers" pad={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-slate-50 text-left text-xs text-slate-500"><tr><th className="px-5 py-2.5">Bus</th><th className="px-5 py-2.5">Route</th><th className="px-5 py-2.5">Driver</th><th className="px-5 py-2.5">Status</th><th className="px-5 py-2.5">Load</th><th className="px-5 py-2.5">Compliance</th></tr></thead>
            <tbody>{FLEET.map((f) => (
              <tr key={f.id} className="border-t border-slate-100"><td className="px-5 py-3 font-mono text-xs">{f.id}</td><td className="px-5 py-3 font-semibold text-navy-800">{f.route}</td><td className="px-5 py-3">{f.driver} <Verified label="" /></td><td className="px-5 py-3"><Badge color={f.status === 'On route' ? 'green' : f.status === 'Arrived' ? 'sky' : 'slate'}>{f.status}</Badge></td><td className="px-5 py-3">{f.load}/{f.cap}</td><td className="px-5 py-3"><Badge color={f.route === 'Route 3' ? 'sun' : 'green'}>{f.route === 'Route 3' ? 'Permit renew in 24 d' : 'All valid'}</Badge></td></tr>
            ))}</tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

export function Requests() {
  const { state, mutate } = useStore()
  const toast = useToast()
  const [tab, setTab] = useState('requests')
  const assign = (id, who) => { mutate((d, { notify }) => { const r = d.requests.find((x) => x.id === id); r.assigned = who; r.status = 'In progress'; r.timeline.push({ s: `Assigned to ${who}`, at: new Date().toISOString() }); if (who === 'Fathima Nasrin') notify('fathima', `Request ${id} assigned to you`, '🙋') }); toast(`Assigned to ${who}`, '👤') }
  const flags = [
    ...state.counselQueries.filter((c) => c.risk === 'high').map((c) => ({ id: c.id, kind: 'Counselling escalation', text: `${c.anon} (${c.cls}): ${c.topic}`, at: c.at, status: c.status })),
    { id: 'f1', kind: 'Chat filter', text: 'Phone number sharing blocked in 10-A chat (no action needed)', at: new Date(Date.now() - 86400000).toISOString(), status: 'Auto-resolved' },
  ]
  return (
    <div className="space-y-4">
      <Tabs value={tab} onChange={setTab} tabs={[{ value: 'requests', label: 'Help requests', count: state.requests.length }, { value: 'safe', label: 'Safeguarding', count: flags.length }]} />
      {tab === 'requests' ? (
        <Panel pad={false}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="bg-slate-50 text-left text-xs text-slate-500"><tr><th className="px-5 py-2.5">ID</th><th className="px-5 py-2.5">Request</th><th className="px-5 py-2.5">From</th><th className="px-5 py-2.5">Category</th><th className="px-5 py-2.5">Assigned</th><th className="px-5 py-2.5">Status</th><th className="px-5 py-2.5">Age</th></tr></thead>
              <tbody>{state.requests.map((r) => (
                <tr key={r.id} className="border-t border-slate-100">
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{r.id}</td>
                  <td className="px-5 py-3 font-semibold text-navy-800">{r.title}</td>
                  <td className="px-5 py-3 text-slate-600">{r.byName}</td>
                  <td className="px-5 py-3"><Badge>{r.category}</Badge></td>
                  <td className="px-5 py-3">
                    <select value={r.assigned} onChange={(e) => assign(r.id, e.target.value)} className="rounded-lg bg-slate-50 px-2 py-1 text-xs ring-1 ring-slate-200">
                      {['Unassigned', 'Fathima Nasrin', 'School Office', 'Exam cell', 'School counsellor', 'Community volunteer (Hindi)', 'NGO desk'].map((o) => <option key={o}>{o}</option>)}
                      {!['Unassigned', 'Fathima Nasrin', 'School Office', 'Exam cell', 'School counsellor', 'Community volunteer (Hindi)', 'NGO desk'].includes(r.assigned) && <option>{r.assigned}</option>}
                    </select>
                  </td>
                  <td className="px-5 py-3"><Badge color={ST[r.status]}>{r.status}</Badge></td>
                  <td className="px-5 py-3 text-slate-500">{timeAgo(r.createdAt)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </Panel>
      ) : (
        <Panel title="Safeguarding register" sub="Visible only to the principal (designated safeguarding lead)">
          <div className="space-y-2">{flags.map((f) => <div key={f.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><ShieldAlert className={cx('h-5 w-5', f.status === 'Escalated' ? 'text-red-500' : 'text-slate-400')} /><div className="flex-1"><div className="text-sm font-semibold text-navy-800">{f.kind}</div><div className="text-xs text-slate-500">{f.text} · {timeAgo(f.at)}</div></div><Badge color={f.status === 'Escalated' ? 'red' : 'slate'}>{f.status}</Badge></div>)}</div>
          <div className="mt-3 rounded-xl bg-sun-50 p-3 text-xs text-sun-800">Policy: Vidya Sethu does not replace clinical or emergency services. High-risk cases follow the school’s child protection policy with CWC / Childline 1098 referral.</div>
        </Panel>
      )}
    </div>
  )
}

export function Sponsorship() {
  const { state, mutate } = useStore()
  const toast = useToast()
  const verify = (id) => { mutate((d, { notify }) => { const n = d.nominations.find((x) => x.id === id); n.status = 'Verified'; n.verifiedBy = 'Class teacher & Dr. Mini Thomas'; notify('ngo', `New school-verified need: ${n.need} (${n.cls})`, '🤝'); notify('fathima', `Nomination ${id} verified by Principal`, '✅') }); toast('Verified · visible to NGO partners (anonymised)', '✅') }
  return (
    <Panel title="NGO / CSR support verification" sub="Schools verify need so donors can give with confidence, and the child’s identity never leaves the school." pad={false}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="bg-slate-50 text-left text-xs text-slate-500"><tr><th className="px-5 py-2.5">Code</th><th className="px-5 py-2.5">Class</th><th className="px-5 py-2.5">Need</th><th className="px-5 py-2.5">Reason (internal)</th><th className="px-5 py-2.5">Amount</th><th className="px-5 py-2.5">Status</th><th /></tr></thead>
          <tbody>{state.nominations.map((n) => (
            <tr key={n.id} className="border-t border-slate-100">
              <td className="px-5 py-3 font-mono text-xs">{n.code}</td><td className="px-5 py-3">{n.cls}</td><td className="px-5 py-3 font-semibold text-navy-800">{n.need}</td><td className="max-w-xs px-5 py-3 text-xs text-slate-500">{n.reason}</td><td className="px-5 py-3">{inr(n.amount)}</td>
              <td className="px-5 py-3"><Badge color={n.status === 'Sponsored' ? 'green' : n.status === 'Verified' ? 'sky' : 'sun'}>{n.status}</Badge>{n.sponsor && <div className="mt-0.5 text-[10px] text-slate-400">{n.sponsor}</div>}</td>
              <td className="px-5 py-3 text-right">{n.status === 'Pending school verification' && <Button size="sm" variant="teal" onClick={() => verify(n.id)}>Verify</Button>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </Panel>
  )
}

export function UsersRoles() {
  const perms = ['View own child', 'View class data', 'Post notices', 'Verify notices', 'Mark attendance', 'Track bus', 'See NGO needs (anon.)', 'Read counselling notes']
  const roles = [
    ['Parent', [1, 0, 0, 0, 0, 1, 0, 0], 971], ['Student', [1, 0, 0, 0, 0, 1, 0, 0], 1040], ['Teacher', [0, 1, 1, 0, 1, 1, 0, 0], 46], ['Principal', [0, 1, 1, 1, 1, 1, 1, 0], 2],
    ['Driver / attender', [0, 0, 0, 0, 1, 1, 0, 0], 8], ['NGO / CSR', [0, 0, 0, 0, 0, 0, 1, 0], 2], ['Counsellor', [0, 0, 0, 0, 0, 0, 0, 1], 1],
  ]
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat label="Student accounts" value="1,040" sub="88% of enrolment" />
        <Stat label="Parent profiles" value="971" sub="1.4 profiles per phone" tone="sky" />
        <Stat label="First login pending" value="63" sub="Reminders sent" tone="sun" />
        <Stat label="Shared family phones" value="412" sub="Using profile switcher" tone="violet" />
      </div>
      <Panel title="Role-based access control" sub="Least-privilege by default · reviewed every term" pad={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-5 py-2.5 text-left">Role</th>{perms.map((p) => <th key={p} className="px-3 py-2.5 text-center font-medium">{p}</th>)}<th className="px-5 py-2.5 text-right">Users</th></tr></thead>
            <tbody>{roles.map(([r, p, n]) => <tr key={r} className="border-t border-slate-100"><td className="px-5 py-3 font-semibold text-navy-800">{r}</td>{p.map((v, i) => <td key={i} className="text-center">{v ? <Check className="mx-auto h-4 w-4 text-teal-600" strokeWidth={3} /> : <span className="text-slate-300">—</span>}</td>)}<td className="px-5 py-3 text-right text-slate-600">{n}</td></tr>)}</tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

export function Reports() {
  const toast = useToast()
  const data = WEEKLY_METRICS
  const ind = [['Active families reached', '3,260', 'pilot-wide'], ['Median request response', '3.6 h', 'from 11.2 h'], ['Resource access (kits + downloads)', '2,914', 'items'], ['Parent satisfaction (n = 212)', '4.4 / 5', 'IVR survey'], ['Referral follow-through', '87%', 'NGO & counselling'], ['Safeguarding incidents', '1 escalated', '0 unresolved']]
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">Pilot impact indicators, as proposed in the concept deck</p>
        <Button icon={Download} onClick={() => toast('Impact report PDF generated (demo)', '📄')}>Export term report</Button>
      </div>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-6">{ind.map(([l, v, s]) => <Stat key={l} label={l} value={v} sub={s} />)}</div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Response time to requests (hours)"><div className="h-60"><ResponsiveContainer><LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" /><XAxis dataKey="w" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line dataKey="resp" name="Hours" stroke="#ec7563" strokeWidth={3} /></LineChart></ResponsiveContainer></div></Panel>
        <Panel title="Requests by week"><div className="h-60"><ResponsiveContainer><BarChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" /><XAxis dataKey="w" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="requests" fill="#2f6bbf" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></Panel>
      </div>
    </div>
  )
}
