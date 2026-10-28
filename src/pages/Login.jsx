import { useState } from 'react'
import { flushSync } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, KeyRound, Smartphone, UserRound } from 'lucide-react'
import { Badge, Logo, inputCls, useToast } from '../components/ui'
import { persistSession, useStore } from '../store/Store'
import { DEMO_PASSWORD, LOGINS, USERS } from '../data/seed'
import { LANGS } from '../i18n'
import { cx } from '../lib/utils'

const ROLE_ICON = { student: '🎒', parent: '👨‍👩‍👧', teacher: '👩🏽‍🏫', school: '🏫', driver: '🚌', ngo: '🤝', counselor: '💚', admin: '🛰️' }

export default function Login() {
  const { state, mutate } = useStore()
  const nav = useNavigate()
  const toast = useToast()
  const [sel, setSel] = useState(LOGINS[0])
  const [username, setUsername] = useState(LOGINS[0].username)
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')

  const pick = (l) => { setSel(l); setUsername(l.username); setPassword(''); setErr('') }
  const submit = (e) => {
    e.preventDefault()
    const match = LOGINS.find((l) => l.username === username.trim().toLowerCase())
    if (!match) return setErr('Unknown username. Pick a demo role above.')
    if (password !== DEMO_PASSWORD) return setErr('Wrong password. Demo password is 123456')
    const session = { userId: match.username, role: match.role, via: 'password' }
    persistSession(session)
    flushSync(() => mutate((d) => { d.session = session }))
    toast(`Welcome, ${USERS[match.username].name}`, ROLE_ICON[match.role])
    nav(match.home)
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden overflow-hidden bg-navy-800 p-12 text-white lg:flex lg:flex-col">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-teal-500/30" />
        <div className="absolute bottom-24 right-24 h-40 w-40 rounded-full bg-sun-400/30" />
        <div className="absolute -bottom-16 left-24 h-64 w-64 rounded-full bg-sky-500/25" />
        <div className="absolute left-1/2 top-1/2 h-20 w-20 rounded-full bg-coral-400/40" />
        <Link to="/" className="relative"><Logo size={44} light sub="Socio-educational support bridge" /></Link>
        <div className="relative mt-auto max-w-lg">
          <Badge color="sun" className="!bg-sun-400 !text-navy-900">Clickable prototype · demo data</Badge>
          <h1 className="mt-4 font-display text-5xl font-extrabold leading-[1.05] tracking-tight">One bridge between students, families, schools & community.</h1>
          <p className="mt-4 text-lg text-white/75">Verified notices, live bus safety, voice-first learning in Malayalam, and CSR support, built for families sharing one smartphone.</p>
          <div className="mt-8 grid grid-cols-3 gap-3 text-sm">
            {[['🚌', 'Live bus radar'], ['🎧', 'Audio pods'], ['📢', 'Verified notices']].map(([e, t]) => <div key={t} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10"><div className="text-2xl">{e}</div><div className="mt-1 font-semibold">{t}</div></div>)}
          </div>
        </div>
        <div className="relative mt-10 text-xs text-white/50">Pilot concept · Malappuram district, Kerala</div>
      </div>

      <div className="flex items-center justify-center bg-slate-50 p-5 sm:p-10">
        <div className="w-full max-w-lg">
          <div className="mb-6 flex items-center justify-between lg:hidden"><Link to="/"><Logo size={38} /></Link></div>
          <h2 className="font-display text-3xl font-extrabold text-navy-800">Sign in</h2>
          <p className="mt-1 text-sm text-slate-500">Choose a role to explore. <b className="text-navy-800">Every demo account uses password 123456.</b></p>

          <Link to="/family" className="mt-5 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 p-4 text-white shadow-float transition hover:brightness-105">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/15"><Smartphone className="h-6 w-6" /></div>
            <div className="flex-1">
              <div className="font-bold">Family Device mode</div>
              <div className="text-xs text-white/80">One shared phone, separate PIN-protected profiles for parents & children (PIN 123456)</div>
            </div>
            <ArrowRight className="h-5 w-5" />
          </Link>

          <div className="my-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400"><span className="h-px flex-1 bg-slate-200" />or sign in with a role<span className="h-px flex-1 bg-slate-200" /></div>

          <div className="grid grid-cols-3 gap-2">
            {LOGINS.map((l) => (
              <button key={l.username} type="button" onClick={() => pick(l)} className={cx('rounded-2xl p-3 text-left transition', sel.username === l.username ? 'bg-navy-800 text-white shadow-float' : 'bg-white text-navy-800 shadow-card ring-1 ring-slate-900/5 hover:ring-teal-400')}>
                <div className="text-xl">{ROLE_ICON[l.role]}</div>
                <div className="mt-1 text-[12.5px] font-bold leading-tight">{l.label}</div>
                <div className={cx('mt-0.5 truncate text-[10.5px]', sel.username === l.username ? 'text-white/70' : 'text-slate-500')}>{l.hint}</div>
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-5 rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-900/5">
            <label className="block text-xs font-semibold text-slate-600">Username</label>
            <div className="relative mt-1">
              <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input className={cx(inputCls, 'pl-9')} value={username} onChange={(e) => setUsername(e.target.value)} autoCapitalize="none" />
            </div>
            <label className="mt-3 block text-xs font-semibold text-slate-600">Password</label>
            <div className="relative mt-1">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input className={cx(inputCls, 'pl-9 pr-10')} type={show ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); setErr('') }} placeholder="123456" inputMode="numeric" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Show password">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </div>
            {err && <div className="mt-2 text-xs font-semibold text-coral-600">{err}</div>}
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setPassword(DEMO_PASSWORD)} className="rounded-xl bg-slate-100 px-3 text-xs font-semibold text-navy-800 hover:bg-slate-200">Fill demo password</button>
              <button type="submit" className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-navy-800 text-sm font-bold text-white hover:bg-navy-700">Sign in as {sel.label} <ArrowRight className="h-4 w-4" /></button>
            </div>
            <div className="mt-3 text-[11px] text-slate-400">Real app: teachers create student accounts with temporary passwords, and users set their own password on first login.</div>
          </form>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-1.5">
              {LANGS.map((l) => <button key={l.code} onClick={() => mutate((d) => { d.lang = l.code })} className={cx('rounded-full px-3 py-1 text-xs font-semibold', state.lang === l.code ? 'bg-teal-500 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200')}>{l.native}</button>)}
            </div>
            <Link to="/" className="text-xs font-semibold text-teal-600 hover:underline">← About Vidya Sethu</Link>
          </div>

          <details className="mt-4 rounded-2xl bg-white p-4 text-xs text-slate-600 ring-1 ring-slate-200">
            <summary className="cursor-pointer font-semibold text-navy-800">All demo logins</summary>
            <table className="mt-2 w-full">
              <tbody>{LOGINS.map((l) => <tr key={l.username} className="border-t border-slate-100"><td className="py-1.5 font-semibold">{l.label}</td><td className="font-mono">{l.username}</td><td className="font-mono">123456</td></tr>)}</tbody>
            </table>
          </details>
        </div>
      </div>
    </div>
  )
}
