import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BadgeCheck, Download, HandCoins, Package, School, Users, Wallet } from 'lucide-react'
import { Panel } from '../../components/DashShell'
import { Badge, Button, Field, Progress, Sheet, Stat, Tabs, inputCls, useToast } from '../../components/ui'
import { useStore } from '../../store/Store'
import { USERS } from '../../data/seed'
import { cx, inr, uid } from '../../lib/utils'

const COLORS = ['#26a69a', '#2f6bbf', '#f6b93b', '#ec7563', '#8b5cf6']

export function Overview() {
  const { state } = useStore()
  const budget = state.projects.reduce((a, p) => a + p.budget, 0)
  const used = state.projects.reduce((a, p) => a + p.used, 0)
  const sponsored = state.nominations.filter((n) => n.status === 'Sponsored')
  const byNeed = [['Books & kits', 312000], ['Girls’ fund', 145000], ['Eye care', 120000], ['Bus fees', 21600], ['Devices', 8500]].map(([name, value]) => ({ name, value }))
  const monthly = [['Jun', 40], ['Jul', 95], ['Aug', 160], ['Sep', 120], ['Oct', 162]].map(([m, v]) => ({ m, v: v * 1000 }))
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h2 className="font-display text-2xl font-extrabold text-navy-800">{USERS.ngo.name}</h2><p className="flex items-center gap-1.5 text-sm text-slate-500"><BadgeCheck className="h-4 w-4 fill-teal-500 text-white" /> CSR-1 registered ({USERS.ngo.csr1}) · Section 8 company · 12A / 80G</p></div>
        <Badge color="green">Every rupee traceable to a school-verified need</Badge>
      </div>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat label="CSR funds deployed" value={inr(used)} sub={`of ${inr(budget)} committed`} icon={Wallet} />
        <Stat label="Students supported" value="2,018" sub={`${sponsored.length} individual sponsorships`} icon={Users} tone="sky" />
        <Stat label="Kits delivered" value="640" sub="Doorstep, 8 schools" icon={Package} tone="sun" />
        <Stat label="Cost per learner" value="₹286" sub="vs ₹410 sector benchmark (A)" icon={HandCoins} tone="coral" />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Funds deployed by month" className="xl:col-span-2">
          <div className="h-64"><ResponsiveContainer><BarChart data={monthly}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" /><XAxis dataKey="m" tick={{ fontSize: 11 }} /><YAxis tickFormatter={(v) => '₹' + v / 1000 + 'k'} tick={{ fontSize: 11 }} /><Tooltip formatter={(v) => inr(v)} /><Bar dataKey="v" fill="#26a69a" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Where the money went">
          <div className="h-52"><ResponsiveContainer><PieChart><Pie data={byNeed} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>{byNeed.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip formatter={(v) => inr(v)} /></PieChart></ResponsiveContainer></div>
          <div className="space-y-1">{byNeed.map((b, i) => <div key={b.name} className="flex items-center gap-2 text-xs"><span className="h-2.5 w-2.5 rounded" style={{ background: COLORS[i] }} /><span className="flex-1 text-slate-600">{b.name}</span><b className="text-navy-800">{inr(b.value)}</b></div>)}</div>
        </Panel>
      </div>
    </div>
  )
}

export function Needs() {
  const { state, mutate } = useStore()
  const toast = useToast()
  const [tab, setTab] = useState('Verified')
  const [pick, setPick] = useState(null)
  const [project, setProject] = useState(state.projects[0].id)
  const list = state.nominations.filter((n) => (tab === 'All' ? n.status !== 'Pending school verification' : n.status === tab))
  const sponsor = () => {
    mutate((d, { notify }) => {
      const n = d.nominations.find((x) => x.id === pick.id); n.status = 'Sponsored'; n.sponsor = USERS.ngo.name
      const p = d.projects.find((x) => x.id === project); p.used += n.amount; p.students += 1
      d.kits.unshift({ id: uid('k'), name: n.need, by: USERS.ngo.name, status: 'School verified', eta: 'In 5–7 days', steps: ['Requested', 'School verified', 'Packed', 'Out for delivery', 'Delivered'], step: 1 })
      notify('principal', `${USERS.ngo.short} sponsored ${n.need} for ${n.code}`, '💚')
      notify('fathima', `Your nomination ${n.id} has been sponsored 🎉`, '💚')
    })
    toast(`Sponsored ${inr(pick.amount)} · school notified · delivery scheduled`, '💚')
    setPick(null)
  }
  return (
    <Panel title="School-verified student needs" sub="Anonymised codes. Verified by the class teacher and principal. Parents opted in." action={<Tabs size="sm" value={tab} onChange={setTab} tabs={['Verified', 'Sponsored', 'All']} />}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map((n) => (
          <div key={n.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
            <div className="flex items-center justify-between"><span className="font-mono text-xs text-slate-500">{n.code} · Class {n.cls}</span><Badge color={n.status === 'Sponsored' ? 'green' : 'sky'}>{n.status}</Badge></div>
            <div className="mt-2 font-display text-base font-bold text-navy-800">{n.need}</div>
            <p className="mt-1 text-xs text-slate-600">{n.reason}</p>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-teal-700"><BadgeCheck className="h-3.5 w-3.5 fill-teal-500 text-white" /> Verified by {n.verifiedBy}</div>
            <div className="mt-3 flex items-center justify-between"><b className="text-lg text-navy-800">{inr(n.amount)}</b>{n.status === 'Verified' ? <Button size="sm" variant="teal" onClick={() => setPick(n)}>Sponsor</Button> : <span className="text-xs text-slate-500">by {n.sponsor}</span>}</div>
          </div>
        ))}
      </div>
      <Sheet fixed open={!!pick} onClose={() => setPick(null)} title="Sponsor this need" footer={<Button className="w-full" variant="teal" onClick={sponsor}>Confirm {pick && inr(pick.amount)}</Button>}>
        {pick && (
          <>
            <div className="rounded-xl bg-slate-50 p-3 text-sm"><b className="text-navy-800">{pick.need}</b> · {pick.code}<br /><span className="text-xs text-slate-500">{pick.reason}</span></div>
            <Field label="Charge to CSR project"><select className={cx(inputCls, 'mt-1')} value={project} onChange={(e) => setProject(e.target.value)}>{state.projects.map((p) => <option key={p.id} value={p.id}>{p.name} · {inr(p.budget - p.used)} left</option>)}</select></Field>
            <p className="text-xs text-slate-500">Funds go to the school / vendor, not to the family. Delivery proof (photo + parent OTP) is attached to your impact report automatically.</p>
          </>
        )}
      </Sheet>
    </Panel>
  )
}

export function Projects() {
  const { state } = useStore()
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {state.projects.map((p) => (
        <Panel key={p.id} title={p.name} action={<Badge color={p.status === 'Active' ? 'green' : 'slate'}>{p.status}</Badge>}>
          <div className="flex items-end justify-between"><div><div className="text-xs text-slate-500">Utilised</div><div className="font-display text-2xl font-extrabold text-navy-800">{inr(p.used)}</div></div><div className="text-right text-xs text-slate-500">of {inr(p.budget)}</div></div>
          <Progress className="mt-2" value={(p.used / p.budget) * 100} />
          <div className="mt-4 grid grid-cols-2 gap-2 text-center"><div className="rounded-xl bg-slate-50 p-3"><Users className="mx-auto h-4 w-4 text-teal-600" /><div className="mt-1 font-bold text-navy-800">{p.students}</div><div className="text-[11px] text-slate-500">students</div></div><div className="rounded-xl bg-slate-50 p-3"><School className="mx-auto h-4 w-4 text-sky-500" /><div className="mt-1 font-bold text-navy-800">{p.schools}</div><div className="text-[11px] text-slate-500">schools</div></div></div>
        </Panel>
      ))}
    </div>
  )
}

export function Deliveries() {
  const { state, mutate } = useStore()
  const toast = useToast()
  const advance = (id) => { mutate((d, { notify }) => { const k = d.kits.find((x) => x.id === id); k.step = Math.min(4, k.step + 1); k.status = k.steps[k.step]; if (k.step === 4) { k.eta = 'Delivered today'; notify('rajesh', `${k.name} delivered ✓ (OTP verified)`, '📦') } }); toast('Delivery stage updated · family notified', '📦') }
  return (
    <Panel title="Doorstep kit deliveries" sub="Book & stationery kits for rural students, tracked end-to-end" pad={false}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-slate-50 text-left text-xs text-slate-500"><tr><th className="px-5 py-2.5">Kit</th><th className="px-5 py-2.5">Progress</th><th className="px-5 py-2.5">Stage</th><th className="px-5 py-2.5">ETA</th><th /></tr></thead>
          <tbody>{state.kits.map((k) => (
            <tr key={k.id} className="border-t border-slate-100">
              <td className="px-5 py-3 font-semibold text-navy-800">{k.name}<div className="text-[11px] font-normal text-slate-500">{k.by}</div></td>
              <td className="px-5 py-3"><div className="flex w-40 gap-1">{k.steps.map((s, i) => <div key={s} className={cx('h-1.5 flex-1 rounded-full', i <= k.step ? 'bg-teal-500' : 'bg-slate-200')} />)}</div></td>
              <td className="px-5 py-3"><Badge color={k.step >= 4 ? 'green' : 'sun'}>{k.status}</Badge></td>
              <td className="px-5 py-3 text-slate-500">{k.eta}</td>
              <td className="px-5 py-3 text-right">{k.step < 4 && <Button size="sm" variant="soft" onClick={() => advance(k.id)}>Next stage →</Button>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </Panel>
  )
}

export function Report() {
  const toast = useToast()
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-3 flex justify-end"><Button icon={Download} onClick={() => toast('CSR impact report (PDF) downloaded · demo', '📄')}>Download PDF</Button></div>
      <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-slate-900/5">
        <div className="flex items-start justify-between border-b border-slate-100 pb-5">
          <div><div className="text-xs font-bold uppercase tracking-widest text-teal-600">CSR Impact Report · Q2 FY 2026-27</div><h2 className="mt-1 font-display text-2xl font-extrabold text-navy-800">Book kits & Bright Girl Fund – Malappuram</h2><p className="text-sm text-slate-500">Implementing agency: {USERS.ngo.name} · CSR-1 {USERS.ngo.csr1}</p></div>
          <div className="text-right text-xs text-slate-400">Generated by<br /><b className="text-navy-800">Vidya Sethu</b></div>
        </div>
        <div className="grid grid-cols-2 gap-4 py-5 sm:grid-cols-4">{[['₹5.77 L', 'deployed'], ['2,018', 'students'], ['8', 'schools'], ['100%', 'delivery proof']].map(([v, l]) => <div key={l}><div className="font-display text-2xl font-extrabold text-navy-800">{v}</div><div className="text-xs text-slate-500">{l}</div></div>)}</div>
        <h3 className="font-display font-bold text-navy-800">Outcomes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li>640 Class 9–10 students received exam-prep kits 6 weeks before the terminal exams.</li>
          <li>58 girls supported through the Bright Girl Fund; 0 dropouts in the cohort this term.</li>
          <li>1,320 students screened in eye camps; 96 spectacles distributed.</li>
          <li>Median time from school verification to delivery: 6 days.</li>
        </ul>
        <h3 className="mt-5 font-display font-bold text-navy-800">Governance</h3>
        <p className="mt-1 text-sm text-slate-600">Needs verified by class teacher + principal. Student identity is anonymised for donors. Payments are made to vendors and schools, never to individuals. Delivery is confirmed by parent OTP and photo.</p>
        <p className="mt-6 text-[11px] text-slate-400">Prototype report · all figures are demo data.</p>
      </div>
    </div>
  )
}
