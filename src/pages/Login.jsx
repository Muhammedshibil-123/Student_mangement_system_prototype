import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useNavigate, useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { ArrowLeft, ArrowRight, Delete, Eye, EyeOff, Fingerprint, Info, KeyRound, Lock, ShieldCheck, Smartphone, UserRound } from 'lucide-react'
import { Avatar, Logo, Segmented, useToast } from '../components/ui'
import { AppFrame, LanguageButton } from '../components/MobileShell'
import { persistSession, useStore } from '../store/Store'
import { DEMO_PASSWORD, FAMILY_PROFILES, LOGINS, USERS } from '../data/seed'
import { translate } from '../i18n'
import { speak } from '../lib/speech'
import { cx } from '../lib/utils'

const ROLE_LABEL = { student: 'Student', parent: 'Parent', teacher: 'Teacher', school: 'Principal', driver: 'Bus driver', ngo: 'NGO partner', counselor: 'Counsellor', admin: 'District admin' }
const PEOPLE = LOGINS.map((l) => ({ ...l, user: USERS[l.username] }))

function useSignIn() {
  const { mutate } = useStore()
  const nav = useNavigate()
  const toast = useToast()
  return (username, via) => {
    const l = LOGINS.find((x) => x.username === username)
    const session = { userId: l.username, role: l.role, via }
    persistSession(session)
    flushSync(() => mutate((d) => { d.session = session; if (l.role === 'parent') d.activeChild = 'ananya' }))
    toast(`Welcome, ${USERS[l.username].short}`)
    nav(l.home)
  }
}

function AccountForm() {
  const signIn = useSignIn()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [focus, setFocus] = useState(false)
  const [err, setErr] = useState('')
  const toast = useToast()
  const pwRef = useRef(null)

  const q = username.trim().toLowerCase()
  const matches = useMemo(() => PEOPLE.filter((p) => !q || p.username.includes(q) || p.user.name.toLowerCase().includes(q) || ROLE_LABEL[p.role].toLowerCase().includes(q)), [q])
  const exact = PEOPLE.find((p) => p.username === q || p.user.name.toLowerCase() === q)

  const choose = (p) => { setUsername(p.username); setFocus(false); setErr(''); setTimeout(() => pwRef.current && pwRef.current.focus(), 0) }
  const submit = (e) => {
    e.preventDefault()
    if (!exact) return setErr('We couldn’t find that account. Choose a name from the list.')
    if (password !== DEMO_PASSWORD) return setErr('Incorrect password. Please try again.')
    signIn(exact.username, 'password')
  }

  return (
    <form onSubmit={submit} className="space-y-3.5" autoComplete="off">
      <div className="relative z-20" data-anim style={{ animationDelay: "0.35s" }}>
        <label htmlFor="username" className="mb-1.5 block text-xs font-semibold text-muted-foreground">Username</label>
        <div className={cx('flex items-center gap-3 rounded-2xl bg-muted px-4 ring-1 transition-all duration-300', focus ? 'bg-card ring-2 ring-teal-500' : 'ring-transparent')}>
          {exact ? <Avatar name={exact.user.name} color={exact.user.color} size={26} /> : <UserRound className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />}
          <input id="username" value={username} onChange={(e) => { setUsername(e.target.value); setErr(''); setFocus(true) }} onFocus={() => setFocus(true)} onBlur={() => setTimeout(() => setFocus(false), 150)}
            placeholder="Enter your username" autoCapitalize="none" autoCorrect="off" spellCheck="false" className="h-[52px] min-w-0 flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-slate-400" />
          {exact && <span className="shrink-0 rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700">{ROLE_LABEL[exact.role]}</span>}
        </div>
        {focus && matches.length > 0 && !exact && (
          <div className="absolute inset-x-0 top-full z-30 mt-2 max-h-72 animate-slideUp overflow-y-auto rounded-[20px] bg-card p-1.5 shadow-float ring-1 ring-border">
            <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Suggested accounts</div>
            {matches.map((p) => (
              <button key={p.username} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => choose(p)} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-muted">
                <Avatar name={p.user.name} color={p.user.color} size={36} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">{p.user.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{ROLE_LABEL[p.role]}{p.user.className ? ` · Class ${p.user.className}` : ''} · @{p.username}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div data-anim style={{ animationDelay: "0.40s" }}>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="text-xs font-semibold text-muted-foreground">Password</label>
          <button type="button" onClick={() => toast('Ask your school office to reset your password')} className="text-xs font-semibold text-teal-600 hover:text-teal-700">Forgot password?</button>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-muted px-4 ring-1 ring-transparent transition-all duration-300 focus-within:bg-card focus-within:ring-2 focus-within:ring-teal-500">
          <KeyRound className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
          <input id="password" ref={pwRef} type={show ? 'text' : 'password'} inputMode="numeric" value={password} onChange={(e) => { setPassword(e.target.value); setErr('') }} placeholder="Enter your password" className="h-[52px] min-w-0 flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-slate-400" />
          <button type="button" onClick={() => setShow(!show)} className="text-muted-foreground transition-colors hover:text-foreground" aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}</button>
        </div>
      </div>

      {err && <div className="animate-fadeIn rounded-2xl bg-coral-50 px-4 py-2.5 text-[13px] font-medium text-coral-600" role="alert">{err}</div>}

      <div data-anim style={{ animationDelay: "0.45s" }} className="flex items-start gap-2.5 rounded-2xl bg-sky-50 px-4 py-3 text-[12.5px] text-sky-700">
        <Info className="mt-px h-4 w-4 shrink-0" />
        <span>Demo access: every account uses the password <b className="tabular font-bold">1234</b>.</span>
      </div>

      <button data-anim style={{ animationDelay: "0.50s" }} type="submit" className="flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-primary text-[15px] font-bold text-primary-foreground shadow-soft transition-all duration-300 hover:bg-primary/90 active:scale-[.98]">
        Sign in <ArrowRight className="h-[18px] w-[18px]" />
      </button>
    </form>
  )
}

function FamilyDevice({ initial }) {
  const { state } = useStore()
  const signIn = useSignIn()
  const [who, setWho] = useState(initial || null)
  const [pin, setPin] = useState('')
  const [shake, setShake] = useState(false)
  const lang = state.lang
  const u = who && USERS[who]

  const check = (full) => {
    if (full === DEMO_PASSWORD) return signIn(u.id, 'pin')
    setShake(true); setTimeout(() => { setShake(false); setPin('') }, 450)
  }
  const press = (k) => {
    if (k === 'del') return setPin(pin.slice(0, -1))
    if (pin.length >= 4) return
    const next = pin + k
    setPin(next)
    if (next.length === 4) setTimeout(() => check(next), 120)
  }

  if (!u) {
    return (
      <div>
        <p className="text-center text-sm text-muted-foreground">{translate('whoIsUsing', lang)}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {FAMILY_PROFILES.map((id) => {
            const p = USERS[id]
            return (
              <button key={id} onClick={() => { setWho(id); speak(`${p.short}. ${translate('enterPin', lang)}`, lang) }} className="flex flex-col items-center rounded-[22px] bg-muted px-3 py-4 transition-all duration-300 hover:bg-slate-200 active:scale-[.97]">
                <div className="relative">
                  <Avatar name={p.name} color={p.color} size={60} />
                  <span className="absolute -bottom-0.5 -right-0.5 grid h-6 w-6 place-items-center rounded-full bg-card shadow-soft"><Lock className="h-3 w-3 text-muted-foreground" /></span>
                </div>
                <div className="mt-2.5 text-sm font-bold text-foreground">{p.short}</div>
                <div className="text-[11px] text-muted-foreground">{p.role === 'parent' ? p.relation : `Class ${p.className}`}</div>
              </button>
            )
          })}
        </div>
        <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-sky-50 px-4 py-3 text-[12.5px] text-sky-700">
          <Info className="mt-px h-4 w-4 shrink-0" /><span>One shared phone, a private profile for each family member. Demo PIN: <b className="tabular font-bold">1234</b>.</span>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center">
      <button onClick={() => { setWho(null); setPin('') }} className="flex items-center gap-1 self-start text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5" /> All profiles</button>
      <Avatar name={u.name} color={u.color} size={64} />
      <div className="mt-2 font-display text-lg font-bold text-foreground">{u.short}</div>
      <div className="text-[13px] text-muted-foreground">{translate('enterPin', lang)}</div>
      <div className="mt-4 flex gap-4" style={shake ? { animation: 'shake .4s' } : undefined}>
        {[0, 1, 2, 3].map((i) => <span key={i} className={cx('h-3.5 w-3.5 rounded-full transition-all duration-200', i < pin.length ? (shake ? 'scale-110 bg-coral-500' : 'scale-110 bg-foreground') : 'bg-slate-200')} />)}
      </div>
      <div className="mt-5 grid w-full max-w-[264px] grid-cols-3 gap-2.5">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'bio', '0', 'del'].map((k) => (
          <button key={k} type="button" onClick={() => (k === 'bio' ? check(DEMO_PASSWORD) : press(k))} aria-label={k === 'bio' ? 'Use fingerprint' : k === 'del' ? 'Delete' : k}
            className={cx('grid h-[58px] place-items-center rounded-2xl font-display text-[22px] font-semibold text-foreground transition-all duration-200 active:scale-95', k === 'bio' || k === 'del' ? 'hover:bg-muted' : 'bg-muted hover:bg-slate-200')}>
            {k === 'del' ? <Delete className="h-5 w-5" /> : k === 'bio' ? <Fingerprint className="h-6 w-6 text-teal-600" /> : k}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Login({ mode }) {
  const [params] = useSearchParams()
  const [tab, setTab] = useState(mode === 'family' || params.get('pick') ? 'family' : 'account')
  const root = useRef(null)

  // GSAP entrance: hero mark, then the sign-in card, then its fields
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('[data-hero] > *', { y: 16, autoAlpha: 0, duration: 0.5, stagger: 0.06, clearProps: 'all' })
          .from('[data-card]', { y: 48, autoAlpha: 0, duration: 0.5, clearProps: 'all' }, '-=0.35')
      })
    }, root)
    return () => { ctx.revert(); mm.revert() }
  }, [])
  useEffect(() => { if (params.get('pick')) setTab('family') }, [params])

  return (
    <AppFrame>
      <div ref={root} className="no-scrollbar relative flex h-full flex-col overflow-y-auto bg-background">
        <div className="relative shrink-0 overflow-hidden bg-[linear-gradient(160deg,#1d3a63,#0e1a2e_70%)] px-6 pb-16 text-white" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 14px)' }}>
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-teal-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 top-24 h-48 w-48 rounded-full bg-sun-400/20 blur-3xl" />
          <div className="relative flex justify-end"><LanguageButton /></div>
          <div data-hero className="relative mt-6 flex flex-col items-center text-center">
            <div className="rounded-[26px] bg-white/10 p-2.5 ring-1 ring-white/15 backdrop-blur"><Logo size={60} withText={false} /></div>
            <h1 className="mt-4 font-display text-[30px] font-extrabold tracking-tight">Vidya Sethu</h1>
            <p className="mt-0.5 text-[15px] font-medium text-sun-300">വിദ്യാ സേതു</p>
            <p className="mt-1.5 text-[13.5px] text-white/70">School, family and community, connected.</p>
          </div>
        </div>

        <div data-card className="edge-gradient edge-gradient-soft relative -mt-9 flex-1 rounded-t-[32px] bg-card px-5 pt-6 shadow-float" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)' }}>
          <div data-anim style={{ animationDelay: "0.22s" }}>
            <h2 className="font-display text-[22px] font-extrabold tracking-tight text-foreground">{tab === 'account' ? 'Welcome back' : 'Family phone'}</h2>
            <p className="mt-0.5 text-[13px] text-muted-foreground">{tab === 'account' ? 'Sign in with the account your school gave you.' : 'Pick your profile and enter your PIN.'}</p>
          </div>
          <div data-anim style={{ animationDelay: "0.28s" }}><Segmented className="mb-5 mt-4" value={tab} onChange={setTab} options={[{ value: 'account', label: 'Account', icon: UserRound }, { value: 'family', label: 'Family phone', icon: Smartphone }]} /></div>
          {tab === 'account' ? <AccountForm /> : <FamilyDevice initial={params.get('pick')} />}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" /> Secure sign-in · Data protected under the DPDP Act</div>
        </div>
      </div>
    </AppFrame>
  )
}
