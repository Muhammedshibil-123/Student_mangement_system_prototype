import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, Bell, ChevronRight, Languages, LogOut, Moon, RotateCcw, Smartphone, Sun } from 'lucide-react'
import { Avatar, IconButton, Segmented, Sheet, Toggle, useToast } from './ui'
import { useLogout, useSession, useStore } from '../store/Store'
import { FAMILY_PROFILES, USERS } from '../data/seed'
import { LANGS, translate } from '../i18n'
import { cx, timeAgo } from '../lib/utils'

// App frame: full screen on phones, an app-sized window on larger screens
export function AppFrame({ children }) {
  return (
    <div className="min-h-[100dvh] bg-background md:grid md:place-items-center md:bg-[radial-gradient(900px_500px_at_15%_0%,rgb(var(--teal-100)/.7),transparent),radial-gradient(800px_500px_at_100%_100%,rgb(var(--sun-100)/.6),transparent)] md:p-6">
      <div id="phone-root" className="relative mx-auto flex h-[100dvh] w-full flex-col overflow-hidden bg-background md:h-[min(900px,calc(100dvh-48px))] md:w-[420px] md:rounded-[40px] md:shadow-float md:ring-1 md:ring-border">
        {children}
      </div>
    </div>
  )
}

// Conversation-style screens take the full height and hide the tab bar
const FULLSCREEN = [/\/chat\/[^/]+$/, /\/tutor$/, /^\/parent\/chat$/]

export function MobileShell({ tabs }) {
  const { state } = useStore()
  const loc = useLocation()
  const scrollRef = useRef(null)
  const lang = state.lang
  const full = FULLSCREEN.some((re) => re.test(loc.pathname))

  useEffect(() => { scrollRef.current && scrollRef.current.scrollTo(0, 0) }, [loc.pathname])

  return (
    <AppFrame>
      <div className="edge-blur top" style={{ height: 'env(safe-area-inset-top)' }}><div /></div>
      <div ref={scrollRef} className={cx('no-scrollbar relative flex-1 overscroll-contain pt-safe', full ? 'flex min-h-0 flex-col overflow-hidden' : 'overflow-y-auto')} style={{ paddingBottom: full ? 0 : 'calc(env(safe-area-inset-bottom) + 92px)' }}>
        <div key={loc.pathname} className={cx('animate-screenIn', full && 'flex min-h-0 flex-1 flex-col')}>
          <Outlet context={{ lang }} />
        </div>
      </div>
      {!full && <div className="edge-blur bottom" style={{ height: 'calc(env(safe-area-inset-bottom) + 110px)' }}><div /></div>}
      <nav className={cx(full && 'hidden', 'absolute inset-x-0 bottom-0 z-20 border-t border-border/60 bg-card/80 px-2 pt-1.5 backdrop-blur-2xl')} style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 10px)' }}>
        <div className="flex">
          {tabs.map((t) => (
            <NavLink key={t.to} to={t.to} end={t.end} className="group flex flex-1 flex-col items-center gap-0.5 py-1">
              {({ isActive }) => (
                <>
                  <span className={cx('grid h-8 w-14 place-items-center rounded-full transition-all duration-300', isActive ? 'bg-teal-50' : 'group-hover:bg-muted')}>
                    <t.icon className={cx('h-[21px] w-[21px] transition-colors', isActive ? 'text-teal-600' : 'text-muted-foreground')} strokeWidth={isActive ? 2.3 : 1.9} />
                  </span>
                  <span className={cx('text-[10.5px] font-semibold transition-colors', isActive ? 'text-teal-700' : 'text-muted-foreground')}>{translate(t.label, lang)}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </AppFrame>
  )
}

export function MobileHeader({ title, sub, back, right, children, large }) {
  const nav = useNavigate()
  return (
    <header className="sticky top-0 z-10 bg-background/80 px-4 pb-3 pt-2 backdrop-blur-xl">
      <div className="flex min-h-[44px] items-center gap-2.5">
        {back && (
          <button onClick={() => (typeof back === 'string' ? nav(back) : nav(-1))} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-card shadow-soft ring-1 ring-border/60 transition-all duration-300 hover:bg-muted active:scale-95" aria-label="Back">
            <ArrowLeft className="h-[18px] w-[18px] text-foreground" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          {title && <h1 className={cx('truncate font-display font-extrabold tracking-tight text-foreground', large || !back ? 'text-[26px] leading-8' : 'text-lg')}>{title}</h1>}
          {sub && <p className="truncate text-xs text-muted-foreground">{sub}</p>}
        </div>
        {right}
      </div>
      {children}
    </header>
  )
}

export function AccountSheet({ open, onClose }) {
  const { state, mutate, reset } = useStore()
  const { user } = useSession()
  const logout = useLogout()
  const toast = useToast()
  const nav = useNavigate()
  if (!user) return null
  const family = user.role === 'student' || user.role === 'parent' ? FAMILY_PROFILES.map((id) => USERS[id]).filter((u) => u.id !== user.id) : []
  const roleLine = user.role === 'student' ? `Student · Class ${user.className}` : user.role === 'parent' ? `Parent · ${user.relation}` : user.title || user.subject || 'Driver · Route 3'
  return (
    <Sheet open={open} onClose={onClose} title="Account">
      <div className="flex items-center gap-3.5 rounded-[20px] bg-muted p-4">
        <Avatar name={user.name} color={user.color} size={54} />
        <div className="min-w-0">
          <div className="truncate font-display text-lg font-bold text-foreground">{user.name}</div>
          <div className="truncate text-xs text-muted-foreground">{roleLine}</div>
          <div className="text-xs text-muted-foreground">Vidyanagar GHSS</div>
        </div>
      </div>

      {family.length > 0 && (
        <div className="mt-5">
          <div className="mb-2 text-xs font-semibold text-muted-foreground">Switch family profile</div>
          <div className="flex gap-4">
            {family.map((f) => (
              <button key={f.id} onClick={() => { onClose(); nav('/family?pick=' + f.id) }} className="flex flex-col items-center gap-1.5 transition-transform active:scale-95">
                <Avatar name={f.name} color={f.color} size={48} /><span className="text-[11px] font-semibold text-foreground">{f.short}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 text-xs font-semibold text-muted-foreground">Appearance</div>
      <Segmented className="mt-2" value={state.theme} onChange={(v) => mutate((d) => { d.theme = v })} options={[{ value: 'system', label: 'Auto', icon: Smartphone }, { value: 'light', label: 'Light', icon: Sun }, { value: 'dark', label: 'Dark', icon: Moon }]} />

      <div className="mt-5 text-xs font-semibold text-muted-foreground">{translate('language', state.lang)}</div>
      <Segmented className="mt-2" value={state.lang} onChange={(v) => mutate((d) => { d.lang = v })} options={LANGS.map((l) => ({ value: l.code, label: l.native }))} />

      <div className="mt-3 divide-y divide-border">
        <Toggle checked={state.dataSaver} onChange={(v) => mutate((d) => { d.dataSaver = v })} label={translate('dataSaver', state.lang)} sub="Compressed audio, images load on tap" />
        <Toggle checked={state.consent.voice} onChange={(v) => mutate((d) => { d.consent.voice = v })} label="Voice prompts" sub="Read screens aloud" />
      </div>

      <div className="mt-4 overflow-hidden rounded-[20px] ring-1 ring-border">
        <button onClick={() => { reset(); toast('App data restored') }} className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted">
          <RotateCcw className="h-[18px] w-[18px] text-muted-foreground" /><span className="flex-1">Reset app data</span><ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
        <button onClick={() => { onClose(); logout() }} className="flex w-full items-center gap-3 border-t border-border px-4 py-3.5 text-left text-sm font-semibold text-coral-600 transition-colors hover:bg-coral-50">
          <LogOut className="h-[18px] w-[18px]" /><span className="flex-1">{translate('logout', state.lang)}</span>
        </button>
      </div>
      <p className="mt-4 text-center text-[11px] text-muted-foreground">Vidya Sethu · Version 1.0</p>
    </Sheet>
  )
}

export function HeaderActions({ userId }) {
  const { state, mutate } = useStore()
  const { user } = useSession()
  const [openN, setOpenN] = useState(false)
  const [openA, setOpenA] = useState(false)
  const mine = state.notifications.filter((n) => n.to === userId)
  const unread = mine.filter((n) => !n.read).length
  return (
    <div className="flex items-center gap-2">
      <IconButton icon={Bell} label="Notifications" badge={unread} onClick={() => { setOpenN(true); mutate((d) => d.notifications.forEach((n) => { if (n.to === userId) n.read = true })) }} />
      <button onClick={() => setOpenA(true)} className="rounded-full shadow-soft ring-2 ring-card transition-transform active:scale-95" aria-label="Account">
        <Avatar name={user?.name} color={user?.color} size={40} />
      </button>
      <Sheet open={openN} onClose={() => setOpenN(false)} title="Notifications">
        {mine.length === 0 && <div className="py-10 text-center text-sm text-muted-foreground">You’re all caught up</div>}
        <div className="divide-y divide-border">
          {mine.slice(0, 20).map((n) => (
            <div key={n.id} className="flex gap-3 py-3">
              <NotifIcon icon={n.icon} />
              <div className="min-w-0">
                <div className="text-[13px] font-medium leading-snug text-foreground">{n.text}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{timeAgo(n.at)}</div>
              </div>
            </div>
          ))}
        </div>
      </Sheet>
      <AccountSheet open={openA} onClose={() => setOpenA(false)} />
    </div>
  )
}

export function NotifIcon({ icon }) {
  const alert = icon === '🚨' || icon === '⚠️'
  return <span className={cx('grid h-9 w-9 shrink-0 place-items-center rounded-full', alert ? 'bg-coral-50 text-coral-600' : 'bg-teal-50 text-teal-600')}>{alert ? <AlertTriangle className="h-4 w-4" /> : <Bell className="h-4 w-4" />}</span>
}

// Greeting header used on each app's home tab
export function HomeHeader({ greeting, name, sub, userId }) {
  return (
    <div className="flex items-center gap-3 pb-1 pt-3">
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium text-muted-foreground">{greeting}</div>
        <div className="truncate font-display text-[28px] font-extrabold leading-9 tracking-tight text-foreground">{name}</div>
        {sub && <div className="truncate text-xs text-muted-foreground">{sub}</div>}
      </div>
      <HeaderActions userId={userId} />
    </div>
  )
}

export function LanguageButton() {
  const { state, mutate } = useStore()
  const i = Math.max(0, LANGS.findIndex((l) => l.code === state.lang))
  return (
    <button onClick={() => mutate((d) => { d.lang = LANGS[(i + 1) % LANGS.length].code })} className="flex h-10 items-center gap-1.5 rounded-full bg-card px-3.5 text-[13px] font-semibold text-foreground shadow-soft ring-1 ring-border/60 transition-all duration-300 hover:bg-muted" aria-label="Change language">
      <Languages className="h-4 w-4 text-muted-foreground" />{LANGS[i].native}
    </button>
  )
}
