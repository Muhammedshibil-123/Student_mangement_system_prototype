import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Bell, ChevronRight, LayoutGrid, LogOut, Search } from 'lucide-react'
import { Avatar, IconButton, Logo, Sheet } from './ui'
import { AccountSheet, NotifIcon } from './MobileShell'
import { useLogout, useSession, useStore } from '../store/Store'
import { cx, timeAgo } from '../lib/utils'
import { SCHOOL } from '../data/seed'

// Web workspace on laptops; a native-style app with bottom tabs on phones
export function DashShell({ nav, roleLabel, orgLine }) {
  const { state, mutate } = useStore()
  const { user } = useSession()
  const navigate = useNavigate()
  const loc = useLocation()
  const logout = useLogout()
  const [openN, setOpenN] = useState(false)
  const [openA, setOpenA] = useState(false)
  const [openMore, setOpenMore] = useState(false)
  useEffect(() => { setOpenMore(false); window.scrollTo(0, 0) }, [loc.pathname])

  const items = nav.filter((n) => !n.section)
  const mine = state.notifications.filter((n) => n.to === user?.id)
  const unread = mine.filter((n) => !n.read).length
  const current = [...items].reverse().find((n) => (n.end ? loc.pathname === n.to : loc.pathname.startsWith(n.to)))
  const primary = items.slice(0, 4)
  const rest = items.slice(4)
  const moreActive = rest.some((n) => loc.pathname.startsWith(n.to))
  const openNotifications = () => { setOpenN(true); mutate((d) => d.notifications.forEach((n) => { if (n.to === user?.id) n.read = true })) }

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col border-r border-border bg-card lg:flex">
        <div className="px-5 pb-4 pt-6"><Logo size={36} sub={roleLabel} /></div>
        <div className="mx-4 mb-4 rounded-2xl bg-muted px-3.5 py-3">
          <div className="text-[13px] font-semibold text-foreground">{orgLine || SCHOOL.short}</div>
          <div className="text-[11px] text-muted-foreground">{SCHOOL.place}</div>
        </div>
        <nav className="no-scrollbar flex-1 space-y-0.5 overflow-y-auto px-3">
          {items.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => cx('flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all duration-300', isActive ? 'bg-primary text-primary-foreground shadow-soft' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
              <n.icon className="h-[18px] w-[18px]" />
              <span className="flex-1">{n.label}</span>
              {n.badge ? <span className="rounded-full bg-coral-500 px-1.5 text-[10px] font-bold text-white">{n.badge}</span> : null}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <button onClick={() => setOpenA(true)} className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-muted">
            <Avatar name={user?.name} color={user?.color} size={36} />
            <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-foreground">{user?.name}</span><span className="block truncate text-[11px] text-muted-foreground">{user?.title || user?.subject || roleLabel}</span></span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          <button onClick={logout} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-coral-600 transition-colors hover:bg-coral-50"><LogOut className="h-4 w-4" /> Log out</button>
        </div>
      </aside>

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <div className="min-w-0 flex-1">
              <div className="truncate font-display text-[22px] font-extrabold tracking-tight text-foreground lg:text-xl">{current?.label || 'Dashboard'}</div>
              <div className="hidden truncate text-xs text-muted-foreground sm:block">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
            <div className="hidden w-72 items-center gap-2 rounded-2xl bg-muted px-3.5 py-2.5 text-sm md:flex">
              <Search className="h-4 w-4 text-muted-foreground" /><input className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground" placeholder="Search students, notices, requests" />
            </div>
            <IconButton icon={Bell} label="Notifications" badge={unread} onClick={openNotifications} />
            <button onClick={() => setOpenA(true)} className="rounded-full shadow-soft ring-2 ring-card transition-transform active:scale-95 lg:hidden" aria-label="Account"><Avatar name={user?.name} color={user?.color} size={40} /></button>
          </div>
        </header>
        <main className="mx-auto max-w-[1400px] px-4 pb-[calc(env(safe-area-inset-bottom)+104px)] pt-4 sm:px-6 lg:pb-10">
          <div key={loc.pathname} className="animate-screenIn"><Outlet /></div>
        </main>
      </div>

      {/* Phone tab bar */}
      <div className="edge-blur bottom fixed lg:hidden" style={{ position: 'fixed', height: 'calc(env(safe-area-inset-bottom) + 110px)' }}><div /></div>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-card/80 px-2 pt-1.5 backdrop-blur-2xl lg:hidden" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 10px)' }}>
        <div className="flex">
          {primary.map((t) => (
            <NavLink key={t.to} to={t.to} end={t.end} className="group relative flex flex-1 flex-col items-center gap-0.5 py-1">
              {({ isActive }) => (
                <>
                  <span className={cx('grid h-8 w-14 place-items-center rounded-full transition-all duration-300', isActive ? 'bg-teal-50' : 'group-hover:bg-muted')}><t.icon className={cx('h-[21px] w-[21px]', isActive ? 'text-teal-600' : 'text-muted-foreground')} strokeWidth={isActive ? 2.3 : 1.9} /></span>
                  <span className={cx('max-w-[76px] truncate text-[10.5px] font-semibold', isActive ? 'text-teal-700' : 'text-muted-foreground')}>{t.short || t.label}</span>
                  {t.badge ? <span className="absolute right-[18%] top-0 grid h-4 min-w-4 place-items-center rounded-full bg-coral-500 px-1 text-[9px] font-bold text-white">{t.badge}</span> : null}
                </>
              )}
            </NavLink>
          ))}
          {rest.length > 0 && (
            <button onClick={() => setOpenMore(true)} className="group flex flex-1 flex-col items-center gap-0.5 py-1">
              <span className={cx('grid h-8 w-14 place-items-center rounded-full transition-all duration-300', moreActive ? 'bg-teal-50' : 'group-hover:bg-muted')}><LayoutGrid className={cx('h-[21px] w-[21px]', moreActive ? 'text-teal-600' : 'text-muted-foreground')} /></span>
              <span className={cx('text-[10.5px] font-semibold', moreActive ? 'text-teal-700' : 'text-muted-foreground')}>More</span>
            </button>
          )}
        </div>
      </nav>

      <Sheet open={openMore} onClose={() => setOpenMore(false)} title="More">
        <div className="grid grid-cols-3 gap-2.5">
          {rest.map((n) => (
            <button key={n.to} onClick={() => navigate(n.to)} className={cx('relative flex flex-col items-center gap-2 rounded-[20px] px-2 py-4 text-center transition-all duration-300 active:scale-[.97]', loc.pathname.startsWith(n.to) ? 'bg-teal-50' : 'bg-muted hover:bg-slate-200')}>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-card text-teal-600 shadow-soft"><n.icon className="h-5 w-5" /></span>
              <span className="text-[11.5px] font-semibold leading-tight text-foreground">{n.label}</span>
              {n.badge ? <span className="absolute right-3 top-3 grid h-5 min-w-5 place-items-center rounded-full bg-coral-500 px-1 text-[10px] font-bold text-white">{n.badge}</span> : null}
            </button>
          ))}
        </div>
      </Sheet>
      <Sheet open={openN} onClose={() => setOpenN(false)} title="Notifications">
        {mine.length === 0 && <div className="py-10 text-center text-sm text-muted-foreground">You’re all caught up</div>}
        <div className="divide-y divide-border">
          {mine.slice(0, 25).map((n) => (
            <div key={n.id} className="flex gap-3 py-3">
              <NotifIcon icon={n.icon} />
              <div><div className="text-[13px] font-medium leading-snug text-foreground">{n.text}</div><div className="mt-0.5 text-[11px] text-muted-foreground">{timeAgo(n.at)}</div></div>
            </div>
          ))}
        </div>
      </Sheet>
      <AccountSheet open={openA} onClose={() => setOpenA(false)} />
    </div>
  )
}

export function PageGrid({ children, className }) {
  return <div className={cx('grid gap-4', className)}>{children}</div>
}

export function Panel({ title, sub, action, children, className, pad = true }) {
  return (
    <section className={cx('min-w-0 rounded-[22px] bg-card shadow-card ring-1 ring-border/70 dark:shadow-none', className)}>
      {(title || action) && (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <h3 className="font-display text-[15px] font-bold tracking-tight text-foreground">{title}</h3>
            {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={pad ? 'p-4 sm:p-5' : ''}>{children}</div>
    </section>
  )
}

// Table on wide screens, stacked cards on phones
export function DataTable({ columns, rows, rowKey, onRow, minWidth = 720, empty = 'Nothing here yet' }) {
  const primary = columns.find((c) => c.primary) || columns[0]
  const side = columns.find((c) => c.side)
  const others = columns.filter((c) => c !== primary && c !== side && !c.hideMobile)
  if (!rows.length) return <div className="py-10 text-center text-sm text-muted-foreground">{empty}</div>
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm" style={{ minWidth }}>
          <thead className="bg-muted/60 text-left text-xs text-muted-foreground"><tr>{columns.map((c) => <th key={c.label} className={cx('px-5 py-2.5 font-medium', c.align === 'right' && 'text-right')}>{c.label}</th>)}</tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={rowKey ? rowKey(r) : i} onClick={onRow && (() => onRow(r))} className={cx('border-t border-border transition-colors', onRow && 'cursor-pointer hover:bg-muted/50')}>
                {columns.map((c) => <td key={c.label} className={cx('px-5 py-3 align-middle', c.align === 'right' && 'text-right', c.className)}>{c.render(r)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-border md:hidden">
        {rows.map((r, i) => (
          <div key={rowKey ? rowKey(r) : i} onClick={onRow && (() => onRow(r))} className={cx('px-4 py-3.5', onRow && 'cursor-pointer active:bg-muted/60')}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 text-[14px] font-semibold text-foreground">{primary.render(r)}</div>
              {side && <div className="shrink-0">{side.render(r)}</div>}
            </div>
            {others.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-muted-foreground">
                {others.map((c) => <div key={c.label} className="flex min-w-0 items-center gap-1.5"><span className="shrink-0">{c.label}:</span><span className="min-w-0 text-foreground">{c.render(r)}</span></div>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
