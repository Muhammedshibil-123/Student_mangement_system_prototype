import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Bell, LogOut, Menu, RotateCcw, Search, X } from 'lucide-react'
import { Avatar, Logo, Sheet, useToast } from './ui'
import { useSession, useStore } from '../store/Store'
import { cx, timeAgo } from '../lib/utils'
import { SCHOOL } from '../data/seed'

export function DashShell({ nav, roleLabel, orgLine }) {
  const { state, mutate, reset } = useStore()
  const { user } = useSession()
  const navigate = useNavigate()
  const loc = useLocation()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [openN, setOpenN] = useState(false)
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [loc.pathname])

  const mine = state.notifications.filter((n) => n.to === user?.id)
  const unread = mine.filter((n) => !n.read).length
  const current = [...nav].reverse().find((n) => (n.end ? loc.pathname === n.to : loc.pathname.startsWith(n.to)))
  const logout = () => { mutate((d) => { d.session = null }); navigate('/login') }

  const Side = (
    <div className="flex h-full flex-col bg-navy-800 text-white">
      <div className="flex items-center justify-between px-5 py-5">
        <Logo size={34} light sub={roleLabel} />
        <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button>
      </div>
      <div className="mx-4 mb-3 rounded-xl bg-white/5 px-3 py-2.5 text-xs text-white/70 ring-1 ring-white/10">
        <div className="font-semibold text-white">{orgLine || SCHOOL.short}</div>
        <div>{SCHOOL.place} · Pilot district</div>
      </div>
      <nav className="no-scrollbar flex-1 space-y-0.5 overflow-y-auto px-3">
        {nav.map((n) => n.section ? (
          <div key={n.section} className="px-3 pb-1 pt-4 text-[10px] font-bold uppercase tracking-widest text-white/40">{n.section}</div>
        ) : (
          <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => cx('flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition', isActive ? 'bg-white text-navy-800' : 'text-white/75 hover:bg-white/10 hover:text-white')}>
            <n.icon className="h-[18px] w-[18px]" />
            <span className="flex-1">{n.label}</span>
            {n.badge ? <span className="rounded-full bg-coral-500 px-1.5 text-[10px] font-bold text-white">{n.badge}</span> : null}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <Avatar emoji={user?.avatar} color="#ffffff" size={36} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{user?.name}</div>
            <div className="truncate text-[11px] text-white/60">{user?.title || user?.subject || roleLabel}</div>
          </div>
        </div>
        <div className="mt-1 grid grid-cols-2 gap-2">
          <button onClick={logout} className="flex items-center justify-center gap-1.5 rounded-lg bg-white/10 py-2 text-xs font-semibold hover:bg-white/20"><LogOut className="h-3.5 w-3.5" /> Switch role</button>
          <button onClick={() => { reset(); toast('Demo data reset', '♻️') }} className="flex items-center justify-center gap-1.5 rounded-lg bg-white/10 py-2 text-xs font-semibold hover:bg-white/20"><RotateCcw className="h-3.5 w-3.5" /> Reset demo</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{Side}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-900/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 animate-slideUp">{Side}</div>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button className="grid h-9 w-9 place-items-center rounded-lg ring-1 ring-slate-200 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
            <div className="min-w-0 flex-1">
              <div className="truncate font-display text-lg font-extrabold text-navy-800">{current?.label || 'Dashboard'}</div>
              <div className="hidden truncate text-xs text-slate-500 sm:block">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
            <div className="hidden w-72 items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-400 md:flex">
              <Search className="h-4 w-4" /> <input className="w-full bg-transparent text-navy-800 outline-none placeholder:text-slate-400" placeholder="Search students, notices, requests…" />
            </div>
            <span className="hidden rounded-full bg-sun-50 px-2.5 py-1 text-[11px] font-bold text-sun-700 ring-1 ring-sun-500/30 sm:inline">PROTOTYPE · demo data</span>
            <button onClick={() => { setOpenN(true); mutate((d) => d.notifications.forEach((n) => { if (n.to === user?.id) n.read = true })) }} className="relative grid h-10 w-10 place-items-center rounded-xl ring-1 ring-slate-200 hover:bg-slate-50" aria-label="Notifications">
              <Bell className="h-5 w-5 text-navy-800" />
              {unread > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-coral-500 px-1 text-[10px] font-bold text-white">{unread}</span>}
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-[1400px] p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
      <Sheet fixed open={openN} onClose={() => setOpenN(false)} title="Notifications">
        {mine.length === 0 && <div className="py-6 text-center text-sm text-slate-500">You are all caught up 🎉</div>}
        <div className="space-y-2">
          {mine.slice(0, 25).map((n) => (
            <div key={n.id} className="flex gap-3 rounded-xl bg-slate-50 p-3">
              <span className="text-lg">{n.icon}</span>
              <div><div className="text-sm text-navy-800">{n.text}</div><div className="text-[11px] text-slate-400">{timeAgo(n.at)}</div></div>
            </div>
          ))}
        </div>
      </Sheet>
    </div>
  )
}

export function PageGrid({ children, className }) {
  return <div className={cx('grid gap-4', className)}>{children}</div>
}

export function Panel({ title, sub, action, children, className, pad = true }) {
  return (
    <section className={cx('rounded-2xl bg-white shadow-card ring-1 ring-slate-900/5', className)}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="font-display text-[15px] font-bold text-navy-800">{title}</h3>
            {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={pad ? 'p-5' : ''}>{children}</div>
    </section>
  )
}
