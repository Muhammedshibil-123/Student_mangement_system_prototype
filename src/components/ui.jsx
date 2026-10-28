import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { BadgeCheck, Check, ChevronRight, X } from 'lucide-react'
import { cx } from '../lib/utils'

export function Logo({ size = 36, light = false, withText = true, sub }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill={light ? '#ffffff' : '#14253f'} />
        <path d="M10 41c9-15 35-15 44 0" stroke="#f6b93b" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M18 40v10M32 32v18M46 40v10" stroke="#26a69a" strokeWidth="5" strokeLinecap="round" />
        <path d="M8 50h48" stroke={light ? '#14253f' : '#ffffff'} strokeWidth="4" strokeLinecap="round" />
      </svg>
      {withText && (
        <div className="leading-tight">
          <div className={cx('font-display font-extrabold tracking-tight', light ? 'text-white' : 'text-navy-800')} style={{ fontSize: size * 0.5 }}>Vidya Sethu</div>
          {sub && <div className={cx('text-[11px] font-medium', light ? 'text-white/70' : 'text-slate-500')}>{sub}</div>}
        </div>
      )}
    </div>
  )
}

export function Card({ className, children, onClick, as: As = 'div', ...rest }) {
  return (
    <As onClick={onClick} className={cx('rounded-2xl bg-white shadow-card ring-1 ring-slate-900/5', onClick && 'cursor-pointer transition hover:shadow-float hover:-translate-y-0.5', className)} {...rest}>
      {children}
    </As>
  )
}

const BTN = {
  primary: 'bg-navy-800 text-white hover:bg-navy-700',
  teal: 'bg-teal-500 text-white hover:bg-teal-600',
  sun: 'bg-sun-400 text-navy-900 hover:bg-sun-300',
  coral: 'bg-coral-500 text-white hover:bg-coral-600',
  ghost: 'bg-transparent text-navy-800 hover:bg-slate-100',
  soft: 'bg-slate-100 text-navy-800 hover:bg-slate-200',
  outline: 'bg-white text-navy-800 ring-1 ring-slate-200 hover:bg-slate-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

export function Button({ variant = 'primary', size = 'md', className, children, icon: Icon, ...rest }) {
  const sz = size === 'sm' ? 'h-8 px-3 text-xs gap-1.5' : size === 'lg' ? 'h-12 px-6 text-base gap-2' : 'h-10 px-4 text-sm gap-2'
  return (
    <button className={cx('inline-flex items-center justify-center rounded-xl font-semibold transition active:scale-[.98] disabled:opacity-50 disabled:pointer-events-none', BTN[variant], sz, className)} {...rest}>
      {Icon && <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />}
      {children}
    </button>
  )
}

const BADGE = {
  slate: 'bg-slate-100 text-slate-700',
  teal: 'bg-teal-50 text-teal-700 ring-teal-600/20',
  sun: 'bg-sun-50 text-sun-700 ring-sun-500/30',
  coral: 'bg-coral-50 text-coral-600 ring-coral-500/20',
  sky: 'bg-sky-50 text-sky-600 ring-sky-500/20',
  navy: 'bg-navy-800 text-white',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  violet: 'bg-violet-50 text-violet-700 ring-violet-600/20',
}

export function Badge({ color = 'slate', className, children }) {
  return <span className={cx('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ring-transparent whitespace-nowrap', BADGE[color], className)}>{children}</span>
}

export function Verified({ className, label = 'Verified' }) {
  return (
    <span className={cx('inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700', className)}>
      <BadgeCheck className="h-3.5 w-3.5 fill-teal-500 text-white" /> {label}
    </span>
  )
}

export function Avatar({ emoji, name, color = '#26a69a', size = 40, className, ring }) {
  const initials = name ? name.split(' ').map((p) => p[0]).slice(0, 2).join('') : '?'
  return (
    <div className={cx('grid shrink-0 place-items-center rounded-full font-semibold text-white', ring && 'ring-2 ring-white', className)} style={{ width: size, height: size, background: emoji ? color + '22' : color, fontSize: emoji ? size * 0.55 : size * 0.38 }}>
      {emoji || initials}
    </div>
  )
}

export function SectionTitle({ children, action, onAction, className }) {
  return (
    <div className={cx('mb-2.5 flex items-center justify-between', className)}>
      <h3 className="font-display text-[15px] font-bold text-navy-800">{children}</h3>
      {action && <button onClick={onAction} className="flex items-center text-xs font-semibold text-teal-600">{action}<ChevronRight className="h-3.5 w-3.5" /></button>}
    </div>
  )
}

export function Stat({ label, value, sub, icon: Icon, tone = 'teal', trend, className }) {
  const tones = { teal: 'bg-teal-50 text-teal-600', sun: 'bg-sun-50 text-sun-600', coral: 'bg-coral-50 text-coral-500', sky: 'bg-sky-50 text-sky-500', navy: 'bg-navy-50 text-navy-700', violet: 'bg-violet-50 text-violet-600' }
  return (
    <Card className={cx('p-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium text-slate-500">{label}</div>
          <div className="mt-1 font-display text-2xl font-extrabold tracking-tight text-navy-800">{value}</div>
          {sub && <div className="mt-0.5 text-xs text-slate-500">{sub}</div>}
        </div>
        {Icon && <div className={cx('grid h-10 w-10 shrink-0 place-items-center rounded-xl', tones[tone])}><Icon className="h-5 w-5" /></div>}
      </div>
      {trend && <div className={cx('mt-2 text-xs font-semibold', trend.startsWith('-') || trend.startsWith('▼') ? 'text-emerald-600' : 'text-emerald-600')}>{trend}</div>}
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

export function Tabs({ tabs, value, onChange, className, size = 'md' }) {
  return (
    <div className={cx('no-scrollbar flex gap-1.5 overflow-x-auto', className)}>
      {tabs.map((t) => {
        const key = typeof t === 'string' ? t : t.value
        const label = typeof t === 'string' ? t : t.label
        const active = key === value
        return (
          <button key={key} onClick={() => onChange(key)} className={cx('shrink-0 rounded-full font-semibold transition', size === 'sm' ? 'px-3 py-1 text-xs' : 'px-3.5 py-1.5 text-[13px]', active ? 'bg-navy-800 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50')}>
            {label}{t.count != null && <span className={cx('ml-1.5 rounded-full px-1.5 text-[10px]', active ? 'bg-white/20' : 'bg-slate-100')}>{t.count}</span>}
          </button>
        )
      })}
    </div>
  )
}

export function Toggle({ checked, onChange, label, sub }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-2">
      {(label || sub) && (
        <span className="min-w-0">
          <span className="block text-sm font-medium text-navy-800">{label}</span>
          {sub && <span className="block text-xs text-slate-500">{sub}</span>}
        </span>
      )}
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={cx('relative h-6 w-11 shrink-0 rounded-full transition', checked ? 'bg-teal-500' : 'bg-slate-300')}>
        <span className={cx('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition', checked ? 'left-[22px]' : 'left-0.5')} />
      </button>
    </label>
  )
}

export function Empty({ icon = '📭', title, sub }) {
  return (
    <div className="py-10 text-center">
      <div className="text-4xl">{icon}</div>
      <div className="mt-2 font-semibold text-navy-800">{title}</div>
      {sub && <div className="mt-1 text-sm text-slate-500">{sub}</div>}
    </div>
  )
}

// Bottom sheet (mobile) / centered dialog (desktop dashboards)
export function Sheet({ open, onClose, title, children, wide, footer, fixed }) {
  useEffect(() => {
    if (!open) return
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open, onClose])
  if (!open) return null
  // inside a phone frame the sheet is portalled to cover the phone screen; elsewhere it is a fixed dialog
  const phone = !fixed && document.getElementById('phone-root')
  const isFixed = !phone
  const node = (
    <div className={cx(isFixed ? 'fixed p-4 items-center' : 'absolute items-end', 'inset-0 z-50 flex justify-center')}>
      <div className="absolute inset-0 animate-fadeIn bg-navy-900/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className={cx('relative flex max-h-[92%] w-full animate-slideUp flex-col bg-white shadow-float', isFixed ? 'rounded-3xl' : 'rounded-t-3xl', isFixed && (wide ? 'max-w-2xl' : 'max-w-md'))}>
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <h3 className="font-display text-base font-bold text-navy-800">{title}</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="border-t border-slate-100 px-5 py-3">{footer}</div>}
      </div>
    </div>
  )
  return createPortal(node, phone || document.body)
}

export function Field({ label, children, hint }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-slate-400">{hint}</span>}
    </label>
  )
}

export const inputCls = 'w-full rounded-xl border-0 bg-slate-50 px-3.5 py-2.5 text-sm text-navy-800 ring-1 ring-slate-200 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500'

export function Steps({ steps, current }) {
  return (
    <ol className="relative ml-2 border-l-2 border-slate-100">
      {steps.map((s, i) => {
        const done = i <= current
        return (
          <li key={i} className="mb-3 ml-4 last:mb-0">
            <span className={cx('absolute -left-[9px] grid h-4 w-4 place-items-center rounded-full', done ? 'bg-teal-500' : 'bg-slate-200')}>
              {done && <Check className="h-2.5 w-2.5 text-white" strokeWidth={4} />}
            </span>
            <div className={cx('text-[13px]', done ? 'font-semibold text-navy-800' : 'text-slate-400')}>{typeof s === 'string' ? s : s.label}</div>
            {s.sub && <div className="text-[11px] text-slate-400">{s.sub}</div>}
          </li>
        )
      })}
    </ol>
  )
}

// ---------- Toasts ----------
const ToastCtx = createContext(() => {})

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const push = useCallback((text, icon = '✅') => {
    const id = Math.random()
    setItems((s) => [...s, { id, text, icon }])
    setTimeout(() => setItems((s) => s.filter((x) => x.id !== id)), 3200)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4">
        {items.map((t) => (
          <div key={t.id} className="pointer-events-auto flex max-w-sm animate-slideUp items-center gap-2.5 rounded-2xl bg-navy-800 px-4 py-3 text-sm font-medium text-white shadow-float">
            <span className="text-base">{t.icon}</span><span>{t.text}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
