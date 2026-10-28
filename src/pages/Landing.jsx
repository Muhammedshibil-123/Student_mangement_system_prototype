import { flushSync } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Bus, CheckCircle2, Headphones, Languages, Megaphone, ShieldCheck, Smartphone, Sparkles, WifiOff } from 'lucide-react'
import { Badge, Logo } from '../components/ui'
import { persistSession, useStore } from '../store/Store'
import { LOGINS } from '../data/seed'
import { cx } from '../lib/utils'

function Section({ id, n, kicker, title, children, className, dark }) {
  return (
    <section id={id} className={cx('scroll-mt-20 px-5 py-16 sm:py-20', dark ? 'bg-navy-800 text-white' : '', className)}>
      <div className="mx-auto max-w-6xl">
        <div className={cx('flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em]', dark ? 'text-sun-300' : 'text-teal-600')}>{n && <span className={cx('grid h-6 w-6 place-items-center rounded-full text-[11px]', dark ? 'bg-sun-400 text-navy-900' : 'bg-teal-500 text-white')}>{n}</span>}{kicker}</div>
        <h2 className={cx('mt-3 max-w-3xl font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl', dark ? 'text-white' : 'text-navy-800')}>{title}</h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}

function MiniPhone({ children, className }) {
  return <div className={cx('w-[230px] shrink-0 rounded-[2.2rem] border-[7px] border-navy-900 bg-slate-50 p-3 shadow-[0_30px_60px_rgba(14,26,46,.3)]', className)}>{children}</div>
}

export default function Landing() {
  const { mutate } = useStore()
  const nav = useNavigate()
  const enter = (username, path) => {
    const l = LOGINS.find((x) => x.username === username)
    const session = { userId: l.username, role: l.role, via: 'password' }
    persistSession(session)
    flushSync(() => mutate((d) => { d.session = session }))
    nav(path || l.home)
  }
  const links = [['problem', 'Problem'], ['solution', 'Solution'], ['market', 'Market'], ['competition', 'Competition'], ['prototype', 'Prototype'], ['gtm', 'Go-to-market'], ['roadmap', 'Roadmap']]
  return (
    <div className="bg-white text-navy-800">
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
          <Logo size={34} />
          <nav className="hidden flex-1 justify-center gap-5 text-sm font-medium text-slate-600 lg:flex">{links.map(([id, l]) => <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }} className="hover:text-navy-800">{l}</a>)}</nav>
          <button onClick={() => nav('/login')} className="ml-auto flex items-center gap-1.5 rounded-xl bg-navy-800 px-4 py-2 text-sm font-bold text-white hover:bg-navy-700 lg:ml-0">Launch prototype <ArrowRight className="h-4 w-4" /></button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-800 px-5 pb-20 pt-14 text-white sm:pt-20">
        <div className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-teal-500/25" />
        <div className="absolute bottom-10 left-1/3 h-24 w-24 rounded-full bg-coral-400/40" />
        <div className="absolute -bottom-20 right-1/4 h-64 w-64 rounded-full bg-sky-500/20" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Badge color="sun" className="!bg-sun-400 !text-navy-900">Concept deck + clickable prototype · Oct 2026</Badge>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl">The socio-educational <span className="text-sun-300">support bridge</span></h1>
            <p className="mt-2 text-xl font-semibold text-white/80">വിദ്യാ സേതു: വിദ്യാർത്ഥികൾ, കുടുംബങ്ങൾ, സ്കൂളുകൾ, സമൂഹം. ഒരൊറ്റ പാലം.</p>
            <p className="mt-5 max-w-xl text-lg text-white/75">A practical, inclusive, mobile-first framework that connects students, families, schools and community support. It coordinates the help that already exists and does not replace teachers or schools.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => nav('/login')} className="flex items-center gap-2 rounded-2xl bg-sun-400 px-6 py-3.5 font-bold text-navy-900 shadow-float hover:bg-sun-300">Open the prototype <ArrowRight className="h-5 w-5" /></button>
              <button onClick={() => nav('/family')} className="flex items-center gap-2 rounded-2xl bg-white/10 px-6 py-3.5 font-bold text-white ring-1 ring-white/20 hover:bg-white/20"><Smartphone className="h-5 w-5" /> Family-phone demo</button>
            </div>
            <div className="mt-6 text-sm text-white/60">Every demo login uses password <b className="font-mono text-white">123456</b></div>
          </div>
          <div className="relative flex justify-center gap-4">
            <MiniPhone className="mt-10 hidden rotate-[-6deg] sm:block">
              <div className="text-[10px] font-bold text-teal-600">FAMILY DEVICE</div>
              <div className="mt-1 text-sm font-extrabold">Who is using the phone?</div>
              <div className="mt-3 grid grid-cols-2 gap-2">{[['👨🏽', 'Rajesh', '#2f6bbf'], ['👩🏽', 'Sreeja', '#ec7563'], ['👧🏽', 'Ananya', '#26a69a'], ['👦🏽', 'Aarav', '#f6b93b']].map(([e, n, c]) => <div key={n} className="rounded-2xl bg-white p-2 text-center shadow-card"><div className="mx-auto grid h-10 w-10 place-items-center rounded-full text-xl" style={{ background: c + '22' }}>{e}</div><div className="mt-1 text-[11px] font-bold">{n}</div></div>)}</div>
              <div className="mt-3 grid grid-cols-3 gap-1 text-center text-[10px] font-bold"><span className="rounded-lg bg-navy-800 py-1.5 text-white">മലയാളം</span><span className="rounded-lg bg-white py-1.5">English</span><span className="rounded-lg bg-white py-1.5">हिंदी</span></div>
            </MiniPhone>
            <MiniPhone className="rotate-[4deg]">
              <div className="text-[10px] text-slate-500">സുപ്രഭാതം 👋</div>
              <div className="text-sm font-extrabold">Namaskaram, Rajesh</div>
              <div className="mt-2 rounded-2xl bg-navy-800 p-2.5 text-white"><div className="text-[10px] font-bold">🔊 Listen to today’s summary</div><div className="mt-0.5 text-[9px] text-white/70">Ananya is present. Bus is 6 min away…</div></div>
              <div className="mt-2 flex items-center gap-2 rounded-2xl bg-white p-2.5 shadow-card"><span className="text-xl">🚌</span><div><div className="text-[9px] font-bold text-emerald-600">ROUTE 3 · LIVE</div><div className="text-base font-extrabold">6 min</div></div></div>
              <div className="mt-2 rounded-2xl bg-white p-2.5 shadow-card"><div className="flex gap-1"><span className="rounded-full bg-sky-50 px-1.5 text-[8px] font-bold text-sky-600">School</span><span className="rounded-full bg-red-50 px-1.5 text-[8px] font-bold text-red-600">Important</span></div><div className="mt-1 text-[10px] font-bold leading-snug">Second Terminal Exam timetable published</div><div className="mt-0.5 flex items-center gap-1 text-[8px] text-teal-700"><BadgeCheck className="h-2.5 w-2.5" /> Verified · Principal</div></div>
              <div className="mt-2 grid grid-cols-4 gap-1">{['🎧', '🤖', '📅', '💚'].map((e) => <div key={e} className="grid h-9 place-items-center rounded-xl bg-white text-base shadow-card">{e}</div>)}</div>
            </MiniPhone>
          </div>
        </div>
      </section>

      <Section id="problem" n="1" kicker="Problem statement" title="Support for students is fragmented. Information exists, but it is scattered.">
        <div className="grid gap-4 md:grid-cols-3">
          {[['📝', 'Exam uncertainty', 'Students and parents need clear, timely information about exams, deadlines, preparation and next steps. Paper leaks, cancellations and delays cause extreme stress.', '#ec7563'],
            ['🛡️', 'Safety & trust', 'Families lack a simple, reliable way to receive verified school updates, know where the school bus is, or raise concerns safely, without exposing phone numbers in WhatsApp groups.', '#2f6bbf'],
            ['📚', 'Resource divide', 'Access to books, guidance, career information and digital support depends on household and location. Migrant and low-literacy parents are left out of Malayalam-only text notices.', '#26a69a']].map(([e, t, d, c]) => (
            <div key={t} className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-slate-900/5" style={{ borderTop: `4px solid ${c}` }}><div className="text-3xl">{e}</div><h3 className="mt-3 font-display text-lg font-bold">{t}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{d}</p></div>
          ))}
        </div>
        <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-lg text-slate-700"><b className="text-navy-800">The gap:</b> the opportunity is to connect the dots between teachers, schools, families, NGOs and CSR without replacing any of them.</div>
      </Section>

      <Section id="solution" n="2" kicker="Solution" title="One bridge, multiple supports, designed for one shared smartphone." className="bg-slate-50">
        <div className="grid gap-4 md:grid-cols-3">
          {[['Intelligent access', 'Voice-first guidance in Malayalam, Hindi & English, age-adaptive AI tutor, audio pods, secure two-way teacher chat, and future-ready career pathways.', Headphones, '#26a69a'],
            ['Safety & reach', 'Verified school notices, live bus radar with 5-minute alerts, one-tap SOS, attendance alerts, IVR/SMS fallback for families without smartphones.', Bus, '#ec7563'],
            ['Ground-level resources', 'Offline learning library, exam prep, scholarship tracker, CSR-sponsored book kits delivered to the door, and school-verified NGO sponsorship.', Sparkles, '#2f6bbf']].map(([t, d, Icon, c]) => (
            <div key={t} className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-slate-900/5"><div className="grid h-12 w-12 place-items-center rounded-2xl" style={{ background: c + '1f' }}><Icon className="h-6 w-6" style={{ color: c }} /></div><h3 className="mt-4 font-display text-lg font-bold">{t}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{d}</p></div>
          ))}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[[WifiOff, 'Mobile-first & low-data'], [Languages, 'Malayalam + local languages'], [Smartphone, 'PIN profiles on a shared phone'], [ShieldCheck, 'Privacy, consent & safeguarding'], [Megaphone, 'Only verified information']].map(([Icon, t]) => <div key={t} className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-semibold shadow-card ring-1 ring-slate-900/5"><Icon className="h-5 w-5 shrink-0 text-teal-600" />{t}</div>)}
        </div>
      </Section>

      <Section id="market" n="3" kicker="Market opportunity" title="A large, growing ecosystem, with a clear need for region-language, community-connected services." dark>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[['$7.5B', 'India EdTech market, 2024'], ['$29B', 'Projected market by 2030'], ['248M', 'School enrolments in India (UDISE+ 2023-24)'], ['₹12,135 Cr', 'CSR spend on education, FY24 (~35% of all CSR)']].map(([v, l]) => <div key={l} className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10"><div className="font-display text-4xl font-extrabold text-sun-300">{v}</div><div className="mt-2 text-sm text-white/70">{l}</div></div>)}
        </div>
        <ul className="mt-6 grid gap-2 text-white/80 sm:grid-cols-2">
          {['Growing acceptance of digital & hybrid learning', 'Large school-going population with diverse local needs', 'Opportunity for affordable, region-language services', 'Combine paid institutional services with sponsored access'].map((t) => <li key={t} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-300" />{t}</li>)}
        </ul>
        <p className="mt-4 text-xs text-white/40">Sources: IAMAI & Grant Thornton Bharat via IBEF (Jan 2025); Ministry of Education UDISE+ 2023-24; CSR data FY24. Sector figures, not a Vidya Sethu sales forecast.</p>
      </Section>

      <Section id="target" n="4" kicker="Target market" title="Start focused in one Kerala district, then scale on evidence.">
        <div className="grid gap-4 md:grid-cols-3">
          {[['Primary users', 'Students, parents and caregivers, especially where guidance and resource access are fragmented: rural, migrant and low-literacy families.'], ['Implementation partners', 'Government & aided schools, local bodies (panchayats), NGOs, libraries, Kudumbashree and community groups.'], ['Funding / buyers', 'CSR teams, education departments, foundations, private schools, and institutions seeking measurable impact.']].map(([t, d]) => <div key={t} className="rounded-3xl bg-slate-50 p-6"><h3 className="font-display text-lg font-bold">{t}</h3><p className="mt-2 text-sm text-slate-600">{d}</p></div>)}
        </div>
        <div className="mt-4 rounded-3xl bg-teal-50 p-6 ring-1 ring-teal-500/20"><b>Beachhead:</b> pilot in Malappuram with 5–10 schools and 1–2 community partners, focused on <b>verified notices + resource access + guidance requests</b> before adding more features. Kerala schools already have 24,525 migrant students who most need multilingual, voice-first support.</div>
      </Section>

      <Section id="revenue" n="5" kicker="Market research & revenue potential" title="Revenue model: institutional, CSR & premium, with a non-profit core." className="bg-slate-50">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-slate-900/5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Illustrative Year-3 scenario</div>
            <table className="mt-3 w-full text-sm"><tbody>
              <tr className="border-b border-slate-100"><td className="py-3">100 institutional partners × ₹1.5 lakh / yr</td><td className="py-3 text-right font-bold">₹1.5 Cr</td></tr>
              <tr className="border-b border-slate-100"><td className="py-3">10 CSR / grant partners × ₹10 lakh</td><td className="py-3 text-right font-bold">₹1.0 Cr</td></tr>
              <tr><td className="py-3 font-bold">Potential annual inflow</td><td className="py-3 text-right font-display text-2xl font-extrabold text-teal-600">₹2.5 Cr</td></tr>
            </tbody></table>
            <p className="mt-3 rounded-2xl bg-sun-50 p-3 text-xs text-sun-800"><b>Reality check (research report):</b> this needs ~650 paying schools at ~₹38k each. Government tools (Sampoorna Plus, Vidya Vahan, DIKSHA) are free, so we test willingness to pay first: 3 signed LOIs from 25 principals.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[['B2G / B2B', 'School, district & NGO service contracts'], ['CSR / Grants', 'Sponsored access & impact projects'], ['Premium tools', 'Dashboards, AI career reports (₹50–100/mo), training'], ['Non-profit model', 'Grant-funded core support via Section 8 partner']].map(([t, d]) => <div key={t} className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-slate-900/5"><div className="font-display font-bold">{t}</div><div className="mt-1 text-xs text-slate-600">{d}</div></div>)}
          </div>
        </div>
      </Section>

      <Section id="competition" n="6" kicker="Existing alternatives" title="Others do parts of this well. Vidya Sethu connects them and works alongside them.">
        <div className="overflow-x-auto rounded-3xl ring-1 ring-slate-200">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Alternative</th><th className="px-5 py-3">What they do well</th><th className="px-5 py-3">Vidya Sethu’s distinction</th></tr></thead>
            <tbody>
              {[['DIKSHA / KITE Victers', 'Free learning content, 135 languages, offline use', 'Adds community coordination & support routing around learning'],
                ['Sampoorna Plus (KITE)', 'Attendance, marks & parent messages in 12,943 schools', 'Voice-first, multilingual, CSR & NGO layer; designed to integrate, not compete'],
                ['Vidya Vahan', 'Mandatory school-bus GPS tracking in Kerala', 'Reuses that GPS feed with family-friendly alerts, boarding status & SOS escalation'],
                ['School apps / WhatsApp groups', 'Fast notices & parent communication', 'Verified, structured workflows; no exposed phone numbers; read receipts'],
                ['EdTech / tutoring platforms', 'Courses, practice & exam prep', 'Access & inclusion first: low-bandwidth, Malayalam audio, sponsored seats'],
                ['NGOs / local networks', 'Trust & local relationships', 'Shared lightweight tools, school-verified needs, referral & impact reporting']].map(([a, b, c]) => <tr key={a} className="border-t border-slate-100"><td className="px-5 py-3.5 font-bold">{a}</td><td className="px-5 py-3.5 text-slate-600">{b}</td><td className="px-5 py-3.5 text-slate-700">{c}</td></tr>)}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500">Differentiation is a hypothesis to test, not a claim that no comparable service exists.</p>
      </Section>

      <Section id="change" n="7" kicker="How it creates change" title="Connect → Respond → Enable → Measure" className="bg-slate-50">
        <div className="grid gap-4 md:grid-cols-4">
          {[['01', 'Connect', 'Students and families know where to ask for help, in their own language, by voice.'], ['02', 'Respond', 'Schools and partners receive structured, trackable requests.'], ['03', 'Enable', 'Resources and guidance reach students with fewer barriers.'], ['04', 'Measure', 'Partners see response times, reach, usage and outcomes.']].map(([n, t, d]) => <div key={n} className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-slate-900/5"><div className="font-display text-3xl font-extrabold text-teal-500">{n}</div><div className="mt-2 font-display text-lg font-bold">{t}</div><p className="mt-1 text-sm text-slate-600">{d}</p></div>)}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">{['Active students / families reached', 'Time to respond to requests', 'Resource access & completion', 'Parent / teacher satisfaction', 'Referral follow-through', 'Safeguarding incidents'].map((t) => <span key={t} className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow-card ring-1 ring-slate-900/5">📊 {t}</span>)}</div>
      </Section>

      <Section id="prototype" n="8" kicker="Prototype" className="bg-white" title="Try the working prototype: 9 roles, one connected ecosystem.">
        <p className="-mt-4 mb-8 max-w-3xl text-slate-600">Every screen below is clickable with realistic demo data. Actions flow between roles: a teacher posts a notice → the principal verifies it → the parent hears it in Malayalam. A driver reports a delay → every family on the route is alerted.</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[['1 · Profile gateway', 'Family switcher with PIN & voice language prompt', '🔐', () => nav('/family')],
            ['2 · Student home & audio hub', 'Audio pods, offline downloads, notices, voice search', '🎧', () => enter('ananya', '/student/learn')],
            ['3 · Live bus radar', 'Real-time map, route timeline, ETA, SOS, driver contact', '🚌', () => enter('rajesh', '/parent/bus')],
            ['4 · Parent notice board', 'Verified broadcasts, exam calendar, rights, scholarships', '📢', () => enter('rajesh', '/parent/notices')]].map(([t, d, e, go]) => (
            <button key={t} onClick={go} className="group rounded-3xl bg-gradient-to-br from-slate-50 to-white p-6 text-left shadow-card ring-1 ring-slate-900/5 transition hover:-translate-y-1 hover:shadow-float">
              <div className="text-4xl">{e}</div><div className="mt-4 font-display text-lg font-bold">{t}</div><p className="mt-1 text-sm text-slate-600">{d}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-bold text-teal-600">Open screen <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></div>
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[['fathima', '👩🏽‍🏫 Teacher workspace'], ['principal', '🏫 School admin'], ['shaji', '🚌 Bus driver app'], ['ngo', '🤝 NGO / CSR partner'], ['counselor', '💚 Counsellor'], ['admin', '🛰️ District command centre'], ['aarav', '👦🏽 Class 4 kid mode']].map(([u, l]) => (
            <button key={u} onClick={() => enter(u)} className="rounded-2xl bg-navy-800 px-4 py-3 text-left text-sm font-semibold text-white hover:bg-navy-700">{l} →</button>
          ))}
        </div>
      </Section>

      <Section id="gtm" n="9" kicker="Go-to-market strategy" title="Prove value locally, then expand district by district." className="bg-slate-50">
        <div className="grid gap-4 md:grid-cols-4">
          {[['0–3 months', 'Discover', 'Interview 30–40 students, parents, teachers and NGO / school leaders. Map existing workflows.'], ['3–6 months', 'Pilot', 'Co-design this clickable prototype; pilot with 5–10 schools / partners; train local champions.'], ['6–12 months', 'Prove', 'Measure engagement, response times, satisfaction, safety and cost per learner served.'], ['12–24 months', 'Scale', 'Secure repeat contracts & CSR funding; expand with local-language support.']].map(([t, s, d], i) => (
            <div key={s} className="relative rounded-3xl bg-white p-6 shadow-card ring-1 ring-slate-900/5"><div className="text-xs font-bold text-slate-400">{t}</div><div className="mt-1 font-display text-xl font-extrabold" style={{ color: ['#26a69a', '#2f6bbf', '#e9a21c', '#ec7563'][i] }}>{s}</div><p className="mt-2 text-sm text-slate-600">{d}</p></div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-600"><b>Channels:</b> school leadership · community organisations · CSR networks · local government · parent / teacher referrals</p>
      </Section>

      <Section id="roadmap" n="10" kicker="Future plans" title="Roadmap: Foundation → Intelligence → Ecosystem">
        <div className="grid gap-4 md:grid-cols-3">
          {[['Phase 1 · Foundation', 'Prototype, partner interviews, one-district pilot, verified notices, bus safety, attendance, secure chat, resource hub & help requests.'], ['Phase 2 · Intelligence', 'Voice-first interface, multilingual AI tutor, live & anonymous counselling, accessibility features, Vidya Coins and better analytics.'], ['Phase 3 · Ecosystem', 'Career pathways, CSR-funded resource centres, Vidya Sethu Store, peer tutoring, competitive-exam modules, partner API & dashboards.']].map(([t, d], i) => <div key={t} className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-slate-900/5"><Badge color={['teal', 'sky', 'sun'][i]}>{['Now', 'Next', 'Later'][i]}</Badge><div className="mt-3 font-display text-lg font-bold">{t}</div><p className="mt-2 text-sm text-slate-600">{d}</p></div>)}
        </div>
        <div className="mt-6 rounded-3xl bg-white p-6 text-lg shadow-card ring-1 ring-slate-900/5"><b>Long-term vision:</b> a trusted socio-educational layer that helps communities work together, so a student’s access to guidance and opportunity depends less on where they live or what their family can afford.</div>
      </Section>

      <section className="bg-navy-800 px-5 py-20 text-center text-white">
        <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Let’s build the bridge.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75">Can we make the right support easier to find, easier to trust, and easier to measure?</p>
        <p className="mt-6 text-sm text-white/60">Seeking: pilot schools · community partners · CSR / grant partners · product & technology collaborators</p>
        <button onClick={() => nav('/login')} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-sun-400 px-7 py-4 font-bold text-navy-900 hover:bg-sun-300">Explore the prototype <ArrowRight className="h-5 w-5" /></button>
        <div className="mt-10 text-sm text-white/50">Muhammed Saheer · BSW Graduate · Founder, Vidya Sethu<br />Prototype with demo data only. No real users, partners or results are claimed.</div>
      </section>
    </div>
  )
}
