import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell, BatteryMedium, Languages, LogOut, RotateCcw, Signal, Wifi } from 'lucide-react'
import { Logo, Sheet, useToast } from './ui'
import { useLogout, useSession, useStore } from '../store/Store'
import { LANGS, translate } from '../i18n'
import { cx, timeAgo } from '../lib/utils'

function Clock() {
  const [t, setT] = useState(() => new Date())
  useEffect(() => { const i = setInterval(() => setT(new Date()), 15000); return () => clearInterval(i) }, [])
  return <span>{t.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: false })}</span>
}

export function MobileShell({ tabs, guide, roleLabel, accent = '#26a69a' }) {
  const { state, mutate, reset } = useStore()
  const { user } = useSession()
  const nav = useNavigate()
  const loc = useLocation()
  const scrollRef = useRef(null)
  const toast = useToast()
  const lang = state.lang

  useEffect(() => { scrollRef.current && scrollRef.current.scrollTo(0, 0) }, [loc.pathname])

  const logout = useLogout()

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#dff3f0,transparent),radial-gradient(900px_500px_at_110%_10%,#fdf1d6,transparent)] bg-slate-50 md:flex md:items-center md:justify-center md:gap-10 md:p-6">
      {/* Presenter guide (desktop only) */}
      <aside className="hidden w-[300px] shrink-0 md:block">
        <Logo size={40} sub="Socio-educational support bridge" />
        <div className="mt-6 rounded-2xl bg-white/80 p-4 shadow-card ring-1 ring-slate-900/5 backdrop-blur">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: accent }}>
            <span className="h-2 w-2 rounded-full" style={{ background: accent }} /> {roleLabel} app
          </div>
          <div className="mt-1 text-sm text-slate-600">Logged in as <b className="text-navy-800">{user?.name}</b></div>
          <div className="mt-4 space-y-1">
            {guide.map((g) => (
              <NavLink key={g.to} to={g.to} end={g.end} className={({ isActive }) => cx('block rounded-xl px-3 py-2 transition', isActive ? 'bg-navy-800 text-white' : 'hover:bg-slate-100')}>
                {({ isActive }) => (
                  <>
                    <div className="text-[13px] font-semibold">{g.label}</div>
                    <div className={cx('text-[11px]', isActive ? 'text-white/70' : 'text-slate-500')}>{g.desc}</div>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={logout} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-navy-800 px-3 py-2 text-xs font-semibold text-white hover:bg-navy-700"><LogOut className="h-3.5 w-3.5" /> Log out</button>
          <button onClick={() => { reset(); toast('Demo data reset', '♻️') }} className="flex items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-navy-800 ring-1 ring-slate-200 hover:bg-slate-50"><RotateCcw className="h-3.5 w-3.5" /> Reset demo</button>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-400">Prototype with demo data. Tip: open a second tab with another role. Actions sync between tabs (for example, the driver reports a delay and the parent sees it).</p>
      </aside>

      {/* Phone */}
      <div id="phone-root" className="relative mx-auto h-[100dvh] w-full shrink-0 overflow-hidden md:mx-0 bg-slate-50 md:h-[860px] md:w-[400px] md:rounded-[52px] md:border-[12px] md:border-navy-900 md:shadow-[0_30px_80px_rgba(14,26,46,.35)]">
        <div className="absolute left-1/2 top-2 z-30 hidden h-7 w-28 -translate-x-1/2 rounded-full bg-navy-900 md:block" />
        <div className="flex h-full flex-col">
          {/* status bar */}
          <div className="relative z-20 flex h-9 shrink-0 items-center justify-between bg-transparent px-6 text-[12px] font-semibold text-navy-800 md:h-11 md:pt-1">
            <Clock />
            <div className="flex items-center gap-1.5">
              {state.dataSaver && <span className="rounded bg-teal-500/15 px-1 text-[9px] font-bold text-teal-700">LITE</span>}
              <Signal className="h-3.5 w-3.5" /><Wifi className="h-3.5 w-3.5" /><BatteryMedium className="h-4 w-4" />
            </div>
          </div>
          <div ref={scrollRef} className="no-scrollbar relative flex-1 overflow-y-auto pb-24">
            <Outlet context={{ lang }} />
          </div>
          {/* bottom nav */}
          <nav className="absolute inset-x-0 bottom-0 z-20 border-t border-slate-200/70 bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 backdrop-blur md:pb-4">
            <div className="flex">
              {tabs.map((t) => (
                <NavLink key={t.to} to={t.to} end={t.end} className="flex flex-1 flex-col items-center gap-0.5 py-1">
                  {({ isActive }) => (
                    <>
                      <span className={cx('grid h-8 w-12 place-items-center rounded-full transition', isActive ? 'bg-teal-50' : '')}>
                        <t.icon className={cx('h-5 w-5', isActive ? 'text-teal-600' : 'text-slate-400')} strokeWidth={isActive ? 2.4 : 2} />
                      </span>
                      <span className={cx('text-[10.5px] font-semibold', isActive ? 'text-teal-700' : 'text-slate-400')}>{translate(t.label, lang)}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}

export function MobileHeader({ title, sub, back, right, transparent, children }) {
  const nav = useNavigate()
  return (
    <header className={cx('sticky top-0 z-10 px-4 pb-3 pt-1', transparent ? '' : 'bg-slate-50/95 backdrop-blur')}>
      <div className="flex items-center gap-2">
        {back && (
          <button onClick={() => (typeof back === 'string' ? nav(back) : nav(-1))} className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-card ring-1 ring-slate-900/5" aria-label="Back">
            <ArrowLeft className="h-4 w-4 text-navy-800" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          {title && <h1 className="truncate font-display text-lg font-extrabold text-navy-800">{title}</h1>}
          {sub && <p className="truncate text-xs text-slate-500">{sub}</p>}
        </div>
        {right}
      </div>
      {children}
    </header>
  )
}

export function HeaderActions({ userId }) {
  const { state, mutate } = useStore()
  const logout = useLogout()
  const toast = useToast()
  const [openN, setOpenN] = useState(false)
  const [openL, setOpenL] = useState(false)
  const mine = state.notifications.filter((n) => n.to === userId)
  const unread = mine.filter((n) => !n.read).length
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={() => setOpenL(true)} className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-card ring-1 ring-slate-900/5" aria-label="Language">
        <Languages className="h-4 w-4 text-navy-800" />
      </button>
      <button onClick={() => { setOpenN(true); mutate((d) => d.notifications.forEach((n) => { if (n.to === userId) n.read = true })) }} className="relative grid h-9 w-9 place-items-center rounded-full bg-white shadow-card ring-1 ring-slate-900/5" aria-label="Notifications">
        <Bell className="h-4 w-4 text-navy-800" />
        {unread > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-coral-500 px-1 text-[9px] font-bold text-white">{unread}</span>}
      </button>
      <button onClick={() => { logout(); toast('Logged out. Pick another role to test.', '👋') }} className="grid h-9 w-9 place-items-center rounded-full bg-white text-coral-600 shadow-card ring-1 ring-slate-900/5" aria-label="Log out" title="Log out">
        <LogOut className="h-4 w-4" />
      </button>
      <Sheet open={openN} onClose={() => setOpenN(false)} title="Notifications">
        {mine.length === 0 && <div className="py-6 text-center text-sm text-slate-500">You are all caught up 🎉</div>}
        <div className="space-y-2">
          {mine.slice(0, 20).map((n) => (
            <div key={n.id} className="flex gap-3 rounded-xl bg-slate-50 p-3">
              <span className="text-lg">{n.icon}</span>
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-navy-800">{n.text}</div>
                <div className="text-[11px] text-slate-400">{timeAgo(n.at)}</div>
              </div>
            </div>
          ))}
        </div>
      </Sheet>
      <Sheet open={openL} onClose={() => setOpenL(false)} title="Language / ഭാഷ / भाषा">
        <div className="space-y-2">
          {LANGS.map((l) => (
            <button key={l.code} onClick={() => { mutate((d) => { d.lang = l.code }); setOpenL(false) }} className={cx('flex w-full items-center justify-between rounded-2xl p-4 text-left ring-1', state.lang === l.code ? 'bg-teal-50 ring-teal-500' : 'bg-white ring-slate-200')}>
              <span><span className="block text-base font-bold text-navy-800">{l.native}</span><span className="text-xs text-slate-500">{l.label} · voice prompts in {l.label}</span></span>
              {state.lang === l.code && <span className="text-teal-600">✓</span>}
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  )
}
