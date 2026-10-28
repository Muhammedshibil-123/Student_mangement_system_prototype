import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, BadgeCheck, Check, ChevronRight, Info, X } from 'lucide-react'
import { cx } from '../lib/utils'

export function Logo({ size = 36, light = false, withText = true, sub }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="shrink-0">
        <defs>
          <linearGradient id="lg-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1d3a63" /><stop offset="1" stopColor="#0e1a2e" /></linearGradient>
        </defs>
        <rect width="64" height="64" rx="18" fill={light ? '#ffffff' : 'url(#lg-bg)'} />
        <path d="M11 41c9-15 33-15 42 0" stroke="#f6b93b" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M19 40v9M32 32v17M45 40v9" stroke="#36ad9f" strokeWidth="5" strokeLinecap="round" />
        <path d="M9 50h46" stroke={light ? '#14253f' : '#ffffff'} strokeWidth="4" strokeLinecap="round" />
      </svg>
      {withText && (
        <div className="leading-tight">
          <div className={cx('font-display font-extrabold tracking-tight', light ? 'text-white' : 'text-foreground')} style={{ fontSize: size * 0.5 }}>Vidya Sethu</div>
          {sub && <div className={cx('text-[11px] font-medium', light ? 'text-white/70' : 'text-muted-foreground')}>{sub}</div>}
        </div>
      )}
    </div>
  )
}

export function Card({ className, children, onClick, as: As = 'div', ...rest }) {
  return (
    <As onClick={onClick} className={cx('min-w-0 rounded-[20px] bg-card shadow-card ring-1 ring-border/70 dark:shadow-none', onClick && 'cursor-pointer transition-all duration-300 active:scale-[.985] md:hover:-translate-y-0.5 md:hover:shadow-float', className)} {...rest}>
      {children}
    </As>
  )
}

const BTN = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft',
  teal: 'bg-teal-500 text-white hover:bg-teal-600 shadow-soft',
  sun: 'bg-sun-400 text-navy-900 hover:bg-sun-300 shadow-soft',
  coral: 'bg-coral-500 text-white hover:bg-coral-600 shadow-soft',
  ghost: 'bg-transparent text-foreground hover:bg-muted',
  soft: 'bg-muted text-foreground hover:bg-slate-200',
  outline: 'bg-card text-foreground ring-1 ring-border hover:bg-muted',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-soft',
}

export function Button({ variant = 'primary', size = 'md', className, children, icon: Icon, ...rest }) {
  const sz = size === 'sm' ? 'h-9 px-3.5 text-xs gap-1.5 rounded-xl' : size === 'lg' ? 'h-[52px] px-6 text-[15px] gap-2 rounded-2xl' : 'h-11 px-4 text-sm gap-2 rounded-2xl'
  return (
    <button className={cx('inline-flex items-center justify-center font-semibold transition-all duration-300 active:scale-[.97] disabled:pointer-events-none disabled:opacity-45', BTN[variant], sz, className)} {...rest}>
      {Icon && <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-[18px] w-[18px]'} />}
      {children}
    </button>
  )
}

export function IconButton({ icon: Icon, label, onClick, className, badge, tone }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} className={cx('relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-card shadow-soft ring-1 ring-border/60 transition-all duration-300 hover:bg-muted active:scale-95', tone === 'danger' ? 'text-coral-600' : 'text-foreground', className)}>
      <Icon className="h-[18px] w-[18px]" />
      {badge > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-coral-500 px-1 text-[10px] font-bold text-white ring-2 ring-background">{badge}</span>}
    </button>
  )
}

const BADGE = {
  slate: 'bg-slate-100 text-slate-700',
  teal: 'bg-teal-50 text-teal-700',
  sun: 'bg-sun-50 text-sun-700',
  coral: 'bg-coral-50 text-coral-600',
  sky: 'bg-sky-50 text-sky-600',
  navy: 'bg-primary text-primary-foreground',
  red: 'bg-red-50 text-red-700',
  green: 'bg-emerald-50 text-emerald-700',
  violet: 'bg-violet-50 text-violet-700',
}

export function Badge({ color = 'slate', className, children }) {
  return <span className={cx('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold', BADGE[color], className)}>{children}</span>
}

export function Verified({ className, label = 'Verified' }) {
  return (
    <span className={cx('inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700', className)}>
      <BadgeCheck className="h-3.5 w-3.5 fill-teal-500 text-white" /> {label}
    </span>
  )
}

// Initials avatar on a soft gradient (emoji are used only when no name is known)
export function Avatar({ emoji, name, color = '#26a69a', size = 40, className, ring }) {
  const initials = name ? name.replace(/^(Dr\.|Mr\.|Mrs\.)\s*/, '').split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase() : null
  return (
    <div className={cx('grid shrink-0 select-none place-items-center rounded-full font-display font-bold text-white', ring && 'ring-2 ring-card', className)}
      style={{ width: size, height: size, background: initials ? `linear-gradient(140deg, ${color}, ${color}cc)` : color + '22', fontSize: initials ? size * 0.36 : size * 0.55 }}>
      {initials || emoji}
    </div>
  )
}

export function SectionTitle({ children, action, onAction, className }) {
  return (
    <div className={cx('mb-2.5 flex items-center justify-between', className)}>
      <h3 className="font-display text-[15px] font-bold tracking-tight text-foreground">{children}</h3>
      {action && <button onClick={onAction} className="flex items-center rounded-full px-1 text-xs font-semibold text-teal-600 transition-colors hover:text-teal-700">{action}<ChevronRight className="h-3.5 w-3.5" /></button>}
    </div>
  )
}

export function Stat({ label, value, sub, icon: Icon, tone = 'teal', trend, className }) {
  const tones = { teal: 'bg-teal-50 text-teal-600', sun: 'bg-sun-50 text-sun-600', coral: 'bg-coral-50 text-coral-500', sky: 'bg-sky-50 text-sky-500', navy: 'bg-muted text-foreground', violet: 'bg-violet-50 text-violet-600' }
  return (
    <Card className={cx('p-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium text-muted-foreground">{label}</div>
          <div className="tabular mt-1 font-display text-2xl font-extrabold tracking-tight text-foreground">{value}</div>
          {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
        </div>
        {Icon && <div className={cx('grid h-10 w-10 shrink-0 place-items-center rounded-2xl', tones[tone])}><Icon className="h-5 w-5" /></div>}
      </div>
      {trend && <div className="mt-2 text-xs font-semibold text-emerald-600">{trend}</div>}
    </Card>
  )
}

export function Progress({ value, color = '#26a69a', className, h = 8 }) {
  return (
    <div className={cx('w-full overflow-hidden rounded-full bg-slate-100', className)} style={{ height: h }}>
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} />
    </div>
  )
}

// Pill tabs; horizontally scrollable with faded edges (css-alpha-masking)
export function Tabs({ tabs, value, onChange, className, size = 'md' }) {
  return (
    <div className={cx('no-scrollbar mask-x -mx-4 flex gap-2 overflow-x-auto px-4', className)}>
      {tabs.map((t) => {
        const key = typeof t === 'string' ? t : t.value
        const label = typeof t === 'string' ? t : t.label
        const active = key === value
        return (
          <button key={key} onClick={() => onChange(key)} className={cx('shrink-0 rounded-full font-semibold transition-all duration-300', size === 'sm' ? 'h-8 px-3.5 text-xs' : 'h-9 px-4 text-[13px]', active ? 'bg-primary text-primary-foreground shadow-soft' : 'bg-card text-muted-foreground ring-1 ring-border hover:bg-muted hover:text-foreground')}>
            {label}{t.count != null && <span className={cx('ml-1.5 rounded-full px-1.5 py-px text-[10px] tabular', active ? 'bg-white/20' : 'bg-muted')}>{t.count}</span>}
          </button>
        )
      })}
    </div>
  )
}

// iOS-style segmented control
export function Segmented({ options, value, onChange, className }) {
  return (
    <div className={cx('grid rounded-2xl bg-muted p-1', className)} style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)} className={cx('flex h-10 items-center justify-center gap-1.5 rounded-xl text-[13px] font-semibold transition-all duration-300', value === o.value ? 'bg-card text-foreground shadow-soft dark:bg-slate-200' : 'text-muted-foreground hover:text-foreground')}>
          {o.icon && <o.icon className="h-4 w-4" />}{o.label}
        </button>
      ))}
    </div>
  )
}

export function Toggle({ checked, onChange, label, sub }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-2.5">
      {(label || sub) && (
        <span className="min-w-0">
          <span className="block text-sm font-medium text-foreground">{label}</span>
          {sub && <span className="block text-xs text-muted-foreground">{sub}</span>}
        </span>
      )}
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={cx('relative h-[30px] w-[50px] shrink-0 rounded-full transition-colors duration-300', checked ? 'bg-teal-500' : 'bg-slate-300')}>
        <span className={cx('absolute top-[3px] h-6 w-6 rounded-full bg-white shadow-soft transition-all duration-300', checked ? 'left-[23px]' : 'left-[3px]')} />
      </button>
    </label>
  )
}

export function Empty({ icon: Icon = Info, title, sub }) {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-muted text-muted-foreground"><Icon className="h-6 w-6" /></div>
      <div className="mt-3 font-semibold text-foreground">{title}</div>
      {sub && <div className="mt-1 text-sm text-muted-foreground">{sub}</div>}
    </div>
  )
}

// Bottom sheet inside the app; centred dialog on wide screens (dashboards)
export function Sheet({ open, onClose, title, children, wide, footer, fixed }) {
  useEffect(() => {
    if (!open) return
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open, onClose])
  if (!open) return null
  const phone = !fixed && document.getElementById('phone-root')
  const dialog = fixed && window.innerWidth >= 768
  const node = (
    <div className={cx(phone ? 'absolute' : 'fixed', 'inset-0 z-50 flex justify-center', dialog ? 'items-center p-6' : 'items-end')}>
      <div className="absolute inset-0 animate-fadeIn bg-navy-900/45 backdrop-blur-[3px]" onClick={onClose} />
      <div className={cx('relative flex w-full animate-slideUp flex-col bg-card shadow-float ring-1 ring-border/60', dialog ? cx('max-h-[88vh] rounded-[28px]', wide ? 'max-w-2xl' : 'max-w-md') : 'max-h-[90%] rounded-t-[28px] sm:max-w-lg')}>
        {!dialog && <div className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-slate-200" />}
        <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-3">
          <h3 className="font-display text-[17px] font-bold tracking-tight text-foreground">{title}</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-muted text-muted-foreground transition-colors hover:text-foreground" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        <div className="overflow-y-auto px-5 pb-5">{children}</div>
        {footer && <div className="border-t border-border px-5 pt-3" style={{ paddingBottom: 'max(14px, env(safe-area-inset-bottom))' }}>{footer}</div>}
        {!footer && !dialog && <div style={{ height: 'env(safe-area-inset-bottom)' }} />}
      </div>
    </div>
  )
  return createPortal(node, phone || document.body)
}

export function Field({ label, children, hint }) {
  return (
    <label className="mb-3.5 block">
      <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  )
}

export const inputCls = 'w-full rounded-2xl border-0 bg-muted px-4 py-3 text-sm text-foreground ring-1 ring-transparent transition-all duration-300 placeholder:text-slate-400 focus:bg-card focus:outline-none focus:ring-2 focus:ring-teal-500'

export function Steps({ steps, current }) {
  return (
    <ol className="relative ml-2 border-l-2 border-border">
      {steps.map((s, i) => {
        const done = i <= current
        return (
          <li key={i} className="mb-3.5 ml-4 last:mb-0">
            <span className={cx('absolute -left-[9px] grid h-4 w-4 place-items-center rounded-full', done ? 'bg-teal-500' : 'bg-slate-200')}>
              {done && <Check className="h-2.5 w-2.5 text-white" strokeWidth={4} />}
            </span>
            <div className={cx('text-[13px]', done ? 'font-semibold text-foreground' : 'text-muted-foreground')}>{typeof s === 'string' ? s : s.label}</div>
            {s.sub && <div className="text-[11px] text-muted-foreground">{s.sub}</div>}
          </li>
        )
      })}
    </ol>
  )
}

// animation-on-scroll: children fade/blur in as they enter the scroll viewport
let io = null
export function Reveal({ children, className, delay = 0, as: As = 'div' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) { el.classList.add('in'); return }
    if (!io) io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.08, rootMargin: '0px 0px -4% 0px' })
    io.observe(el)
    const t = setTimeout(() => el.classList.add('in'), 1200) // never leave content hidden
    return () => { clearTimeout(t); io && io.unobserve(el) }
  }, [])
  return <As ref={ref} className={cx('reveal', className)} style={{ animationDelay: `${delay}ms` }}>{children}</As>
}

// ---------- Toasts ----------
const ToastCtx = createContext(() => {})
const ALERT_ICONS = ['🚨', '⚠️']

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const push = useCallback((text, icon) => {
    const id = Math.random()
    setItems((s) => [...s.slice(-1), { id, text, alert: ALERT_ICONS.includes(icon) }]) // at most two on screen
    setTimeout(() => setItems((s) => s.filter((x) => x.id !== id)), 3000)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 z-[100] flex flex-col items-center gap-2 px-4" style={{ top: 'calc(env(safe-area-inset-top) + 12px)' }}>
        {items.map((t) => (
          <div key={t.id} className="pointer-events-auto flex w-full max-w-sm animate-slideUp items-center gap-3 rounded-2xl bg-card/95 px-4 py-3 text-[13px] font-medium text-foreground shadow-float ring-1 ring-border/70 backdrop-blur-xl">
            <span className={cx('grid h-7 w-7 shrink-0 place-items-center rounded-full text-white', t.alert ? 'bg-coral-500' : 'bg-teal-500')}>{t.alert ? <AlertTriangle className="h-3.5 w-3.5" /> : <Check className="h-4 w-4" strokeWidth={3} />}</span>
            <span className="min-w-0">{t.text}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)

// Vidya Coin glyph (replaces emoji so it renders the same on every phone)
export function Coin({ size = 16, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={cx('inline-block shrink-0 align-[-0.15em]', className)} aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#f6b93b" /><circle cx="12" cy="12" r="8" fill="#fcdc8a" />
      <path d="M8.2 8.5l3.8 8 3.8-8" stroke="#c78310" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
