import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AlertTriangle, CheckCircle2, Circle, Clock, FileCheck2, Megaphone, MessageCircleQuestion, School, Send, Siren, Users } from 'lucide-react'
import { DataTable, Panel } from '../../components/DashShell'
import { Badge, Button, Progress, Stat, Toggle, inputCls, useToast } from '../../components/ui'
import { useStore } from '../../store/Store'
import { PILOT_SCHOOLS, WEEKLY_METRICS } from '../../data/seed'
import { cx, inr, uid } from '../../lib/utils'

export function Command() {
  const totalStudents = PILOT_SCHOOLS.reduce((a, s) => a + s.students, 0)
  const live = PILOT_SCHOOLS.filter((s) => s.status === 'Live')
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h2 className="font-display text-2xl font-extrabold text-foreground">Malappuram pilot · Month 4</h2><p className="text-sm text-slate-500">Phase 1 (Foundation) · Go-to-market stage: <b>Pilot → Prove</b></p></div>
        <div className="flex gap-2"><Badge color="green">{live.length} schools live</Badge><Badge color="sun">2 onboarding</Badge></div>
      </div>
      <div className="grid-fill grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
        <Stat label="Students covered" value={totalStudents.toLocaleString('en-IN')} sub="7 schools" icon={School} />
        <Stat label="Active families" value="3,260" sub="▲ 11% w/w" icon={Users} tone="sky" />
        <Stat label="Verified notices" value="171" sub="77% average read rate" icon={FileCheck2} tone="sun" />
        <Stat label="Median response" value="3.6 h" sub="target < 6 h" icon={Clock} tone="teal" />
        <Stat label="Cost per learner / yr" value="₹212" sub="Hosting, SMS and support" icon={Megaphone} tone="coral" />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Weekly active families" className="xl:col-span-2">
          <div className="h-64"><ResponsiveContainer><AreaChart data={WEEKLY_METRICS}><defs><linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#2f6bbf" stopOpacity=".35" /><stop offset="1" stopColor="#2f6bbf" stopOpacity="0" /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="w" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Area dataKey="families" stroke="#2f6bbf" strokeWidth={3} fill="url(#ga)" /></AreaChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Feature usage (last 30 days)">
          <div className="space-y-3">{[['Verified notices', 92], ['Bus radar', 71], ['Attendance alerts', 68], ['Audio pods (offline)', 44], ['Help requests', 23], ['AI tutor', 19], ['Counselling (anon.)', 6]].map(([l, v]) => <div key={l}><div className="mb-1 flex justify-between text-xs"><span className="font-medium text-foreground">{l}</span><span className="text-slate-500">{v}% of families</span></div><Progress value={v} h={6} color={v > 60 ? '#26a69a' : v > 30 ? '#2f6bbf' : '#f6b93b'} /></div>)}</div>
        </Panel>
      </div>
      <Panel title="Pilot milestones" sub="Partner commitments for the next expansion">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ['Private-school letters of intent', 'Met 18 of 25 principals', 2, 3, 'signed of 3 needed'],
            ['Parent notice survey', 'Audited 20 notices · called 15 parents', 9, 15, 'parents had missed a key notice'],
            ['Migrant-family support pilot', 'Spoke to 3 CSR-registered NGOs', 1, 1, 'scoping agreement signed'],
          ].map(([q, s, v, t, l]) => (
            <div key={q} className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm font-semibold text-foreground">{q}</div>
              <div className="mt-1 text-xs text-slate-500">{s}</div>
              <div className="mt-3 flex items-end justify-between"><span className="font-display text-2xl font-extrabold text-foreground">{v}/{t}</span><Badge color={v >= t ? 'green' : 'sun'}>{v >= t ? 'Done' : 'In progress'}</Badge></div>
              <div className="text-[11px] text-slate-500">{l}</div>
              <Progress className="mt-2" value={(v / t) * 100} h={6} color={v >= t ? '#10b981' : '#f6b93b'} />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

export function Schools() {
  return (
    <Panel title="Pilot schools · Malappuram" sub="Live and onboarding schools" pad={false}>
      <DataTable rows={PILOT_SCHOOLS} rowKey={(x) => x.name} minWidth={860} columns={[
        { label: 'School', primary: true, render: (x) => <span>{x.name}<span className="block text-[11px] font-normal text-muted-foreground">{x.type} · {x.students.toLocaleString('en-IN')} students</span></span> },
        { label: 'Family adoption', render: (x) => <span className="flex items-center gap-2"><span className="w-20"><Progress value={x.adoption} h={6} color={x.adoption > 70 ? '#26a69a' : x.adoption > 50 ? '#f6b93b' : '#ec7563'} /></span><span className="tabular text-xs font-semibold">{x.adoption}%</span></span> },
        { label: 'Notices / mo', render: (x) => <span className="tabular">{x.notices}</span> },
        { label: 'Avg. response', render: (x) => (x.resp ? x.resp + ' h' : '—') },
        { label: 'Buses', hideMobile: true, render: (x) => x.buses },
        { label: 'Status', side: true, render: (x) => <Badge color={x.status === 'Live' ? 'green' : x.status === 'Onboarding' ? 'sun' : 'sky'}>{x.status}</Badge> },
      ]} />
    </Panel>
  )
}

export function ExamCrisis() {
  const { mutate } = useStore()
  const toast = useToast()
  const [text, setText] = useState('The SSLC Mathematics question paper circulating on WhatsApp is FAKE. The exam will be held as scheduled. Do not share unverified papers. Official updates come only through Vidya Sethu and the Pareeksha Bhavan website.')
  const rumours = [
    { t: '“Maths paper leaked on WhatsApp”', n: 412, trend: '▲ fast', status: 'Clarification needed', tone: 'red' },
    { t: '“Exam postponed due to rain”', n: 138, trend: '▲', status: 'Monitoring', tone: 'sun' },
    { t: '“Hall ticket photo must be new”', n: 61, trend: '—', status: 'Answered', tone: 'green' },
  ]
  const send = () => {
    mutate((d, { notify }) => {
      d.notices.unshift({ id: uid('n'), source: 'govt', category: 'Exam', status: 'verified', urgent: true, pinned: true, title: 'Official: Viral “leaked Maths paper” is fake. Exam as scheduled', titleMl: 'ഔദ്യോഗികം: “ചോർന്ന കണക്ക് പേപ്പർ” വ്യാജം; പരീക്ഷ നിശ്ചയിച്ചതുപോലെ', body: text, bodyMl: 'വാട്സാപ്പിൽ പ്രചരിക്കുന്ന കണക്ക് ചോദ്യപേപ്പർ വ്യാജമാണ്. പരീക്ഷ നിശ്ചയിച്ചതുപോലെ നടക്കും.', author: 'District Exam Cell', authorRole: 'DDE Malappuram (relayed)', at: new Date().toISOString(), audience: 'All pilot families', reach: 5644, reads: 0, readBy: {} })
      ;['rajesh', 'ananya', 'principal', 'fathima'].forEach((u) => notify(u, 'Official exam clarification: viral leaked paper is fake', '🛡️'))
    })
    toast('Clarification pushed to 5,644 students & families in 3 languages', '📣')
  }
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-primary p-5 text-white"><div className="flex items-center gap-2 text-sm font-bold text-sun-300"><Siren className="h-4 w-4" /> District exam cell</div><div className="mt-1 font-display text-xl font-extrabold">Exam crisis management desk</div><p className="mt-1 max-w-3xl text-sm text-white/75">During paper leaks, cancellations or delays, boards and the district exam cell can reach every candidate and parent with one verified message. This cuts down rumours and anxiety.</p></div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat label="Exam-related questions today" value="611" icon={MessageCircleQuestion} tone="sky" />
        <Stat label="Rumours tracked" value="3" icon={AlertTriangle} tone="coral" />
        <Stat label="Clarification reach (last)" value="94%" sub="within 2 hours" icon={CheckCircle2} />
        <Stat label="Counsellor escalations" value="7" sub="exam anxiety" tone="violet" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Rumour radar" sub="Clustered from help-desk & AI-tutor questions (anonymised)">
          <div className="space-y-2">{rumours.map((r) => <div key={r.t} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><div className="flex-1"><div className="text-sm font-semibold text-foreground">{r.t}</div><div className="text-xs text-slate-500">{r.n} questions · {r.trend}</div></div><Badge color={r.tone}>{r.status}</Badge></div>)}</div>
        </Panel>
        <Panel title="Push official clarification">
          <textarea className={cx(inputCls, 'h-36 resize-none')} value={text} onChange={(e) => setText(e.target.value)} />
          <div className="mt-2 flex flex-wrap gap-2 text-xs"><Badge color="sky">Auto-translated: മലയാളം · हिंदी</Badge><Badge color="green">Voice + SMS fallback</Badge><Badge>All 7 pilot schools</Badge></div>
          <Button className="mt-3 w-full" variant="coral" icon={Send} onClick={send}>Publish verified clarification</Button>
        </Panel>
      </div>
    </div>
  )
}

export function Partners() {
  const [inst, setInst] = useState(100)
  const [fee, setFee] = useState(150000)
  const [csr, setCsr] = useState(10)
  const [grant, setGrant] = useState(1000000)
  const [prem, setPrem] = useState(0)
  const instRev = inst * fee, csrRev = csr * grant, premRev = prem * 12 * 75
  const total = instRev + csrRev + premRev
  const mix = [{ name: 'B2G / B2B contracts', value: instRev }, { name: 'CSR / grants', value: csrRev }, { name: 'Premium tools', value: premRev }]
  const cr = (v) => (v / 1e7).toFixed(2) + ' Cr'
  const pipeline = [['Private schools (LOI)', 2, 25], ['Govt / aided schools (MoU)', 7, 10], ['CSR partners', 2, 10], ['NGO implementing partners', 1, 3], ['District administration', 0, 1]]
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Panel title="Revenue scenario calculator" sub="Year-3 planning scenario. Adjust the assumptions.">
          {[['Institutional partners (schools / districts / NGOs)', inst, setInst, 0, 300, 1, inst], ['Annual service fee per partner', fee, setFee, 10000, 300000, 5000, inr(fee)], ['CSR / grant partners', csr, setCsr, 0, 30, 1, csr], ['Average CSR grant per partner', grant, setGrant, 100000, 5000000, 100000, inr(grant)], ['Premium subscribers (₹75/mo career reports)', prem, setPrem, 0, 20000, 500, prem.toLocaleString('en-IN')]].map(([l, v, set, min, max, step, shown]) => (
            <div key={l} className="mb-4">
              <div className="mb-1 flex justify-between text-sm"><span className="text-slate-600">{l}</span><b className="text-foreground">{shown}</b></div>
              <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => set(Number(e.target.value))} className="w-full accent-teal-600" />
            </div>
          ))}
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-4 text-center">
            <div><div className="text-xs text-slate-500">Institutional</div><div className="font-display text-lg font-extrabold text-foreground">₹{cr(instRev)}</div></div>
            <div><div className="text-xs text-slate-500">CSR / grants</div><div className="font-display text-lg font-extrabold text-foreground">₹{cr(csrRev)}</div></div>
            <div><div className="text-xs text-slate-500">Premium</div><div className="font-display text-lg font-extrabold text-foreground">₹{cr(premRev)}</div></div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-primary p-4 text-white"><span className="text-sm">Potential annual inflow</span><span className="font-display text-3xl font-extrabold text-sun-300">₹{cr(total)}</span></div>
          <p className="mt-2 text-[11px] text-muted-foreground">Base scenario: 100 partners × ₹1.5 lakh + 10 CSR partners × ₹10 lakh = ₹2.5 Cr a year.</p>
        </Panel>
        <div className="space-y-4">
          <Panel title="Revenue mix">
            <div className="h-48"><ResponsiveContainer><PieChart><Pie data={mix} dataKey="value" innerRadius={45} outerRadius={75}>{mix.map((_, i) => <Cell key={i} fill={['#2f6bbf', '#26a69a', '#f6b93b'][i]} />)}</Pie><Tooltip formatter={(v) => '₹' + cr(v)} /></PieChart></ResponsiveContainer></div>
            <div className="space-y-1">{mix.map((m, i) => <div key={m.name} className="flex items-center gap-2 text-xs"><span className="h-2.5 w-2.5 rounded" style={{ background: ['#2f6bbf', '#26a69a', '#f6b93b'][i] }} /><span className="flex-1 text-slate-600">{m.name}</span><b>{total ? Math.round((m.value / total) * 100) : 0}%</b></div>)}</div>
          </Panel>
          <Panel title="Partner pipeline">
            <div className="space-y-3">{pipeline.map(([l, v, t]) => <div key={l}><div className="mb-1 flex justify-between text-xs"><span className="font-medium text-foreground">{l}</span><span className="text-slate-500">{v} / {t}</span></div><Progress value={(v / t) * 100} h={6} /></div>)}</div>
          </Panel>
        </div>
      </div>
    </div>
  )
}

export function Roadmap() {
  const gtm = [
    ['0–3 months', 'Discover', 'Interviewed 38 students, parents, teachers & NGO leaders. Mapped existing workflows.', 'done'],
    ['3–6 months', 'Pilot', 'App co-designed with schools · 7 schools onboarded · 21 local champions trained.', 'active'],
    ['6–12 months', 'Prove', 'Measure engagement, response time, satisfaction, safety & cost per learner.', 'next'],
    ['12–24 months', 'Scale', 'Repeat contracts & CSR funding · expand district by district with local languages.', 'next'],
  ]
  const phases = [
    ['Phase 1 · Foundation', ['Bus tracking & SOS', 'Verified notices', 'Attendance alerts', 'Secure teacher chat', 'Teacher-managed onboarding', 'Family profile switcher', 'Help desk & resource hub'], 'In pilot'],
    ['Phase 2 · Intelligence', ['Voice-first assistant (ml / hi / en)', 'Age-adaptive AI tutor', 'Live & anonymous counselling', 'Talent wall', 'Vidya Coins', 'Better analytics'], 'In testing'],
    ['Phase 3 · Ecosystem', ['Vidya Sethu Store', 'NGO sponsorship portal', 'Peer tutoring', 'Competitive exam modules', 'AI career pathways', 'Partner API & CSR resource centres'], 'Planned'],
  ]
  return (
    <div className="space-y-4">
      <Panel title="Go-to-market: prove value locally">
        <div className="grid gap-3 md:grid-cols-4">
          {gtm.map(([t, s, d, st]) => (
            <div key={s} className={cx('rounded-2xl p-4 ring-1', st === 'active' ? 'bg-teal-50 ring-teal-500' : 'bg-slate-50 ring-slate-100')}>
              <div className="flex items-center gap-2">{st === 'done' ? <CheckCircle2 className="h-5 w-5 text-teal-600" /> : st === 'active' ? <span className="h-3 w-3 animate-pulse rounded-full bg-teal-500" /> : <Circle className="h-5 w-5 text-slate-300" />}<span className="text-xs font-semibold text-slate-500">{t}</span></div>
              <div className="mt-2 font-display text-lg font-extrabold text-foreground">{s}</div>
              <p className="mt-1 text-xs text-slate-600">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">Channels: school leadership · community organisations · CSR networks · local government · parent / teacher referrals</p>
      </Panel>
      <div className="grid gap-4 xl:grid-cols-3">
        {phases.map(([t, items, st], i) => (
          <Panel key={t} title={t} action={<Badge color={i === 0 ? 'green' : i === 1 ? 'sky' : 'slate'}>{st}</Badge>}>
            <ul className="space-y-1.5 text-sm text-slate-700">{items.map((it) => <li key={it} className="flex items-center gap-2"><CheckCircle2 className={cx('h-4 w-4', i === 0 ? 'text-teal-600' : 'text-slate-300')} />{it}</li>)}</ul>
          </Panel>
        ))}
      </div>
    </div>
  )
}

export function Settings() {
  const [s, setS] = useState({ ml: true, hi: true, ta: false, ivr: true, retention: true, minors: true, ai: true, store: false })
  const t = (k) => (v) => setS({ ...s, [k]: v })
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Panel title="Languages & access">
        <Toggle checked label="English" onChange={() => {}} />
        <Toggle checked={s.ml} onChange={t('ml')} label="Malayalam (മലയാളം)" sub="Default for Kerala pilot" />
        <Toggle checked={s.hi} onChange={t('hi')} label="Hindi (हिंदी)" sub="24,525 migrant students in Kerala schools (2024-25)" />
        <Toggle checked={s.ta} onChange={t('ta')} label="Tamil (தமிழ்)" sub="Phase 2" />
        <Toggle checked={s.ivr} onChange={t('ivr')} label="IVR voice calls for non-smartphone families" />
      </Panel>
      <Panel title="Privacy, safety & DPDP Act 2023">
        <Toggle checked={s.minors} onChange={t('minors')} label="Verifiable parental consent for under-18s" sub="Required before any child data is processed" />
        <Toggle checked={s.retention} onChange={t('retention')} label="Auto-delete GPS history after 30 days" />
        <Toggle checked={s.ai} onChange={t('ai')} label="AI tutor: no personal data in prompts" />
        <Toggle checked={s.store} onChange={t('store')} label="Enable Vidya Sethu Store (Phase 3)" sub="Feature flag, off for pilot schools" />
        <div className="mt-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">Data is hosted in India · encrypted at rest & in transit · role-based access · annual third-party audit.</div>
      </Panel>
    </div>
  )
}
