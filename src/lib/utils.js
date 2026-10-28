export const cx = (...c) => c.filter(Boolean).join(' ')

const DAY = 86400000

export function daysFromNow(n, hour = 9, min = 0) {
  const d = new Date()
  d.setHours(hour, min, 0, 0)
  return new Date(d.getTime() + n * DAY).toISOString()
}

export function hoursAgo(h) {
  return new Date(Date.now() - h * 3600000).toISOString()
}

export function fmtDate(iso, opts = { day: 'numeric', month: 'short' }) {
  return new Date(iso).toLocaleDateString('en-IN', opts)
}

export function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
}

export function timeAgo(iso) {
  const s = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000))
  if (s < 60) return 'just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} hr ago`
  const d = Math.round(h / 24)
  if (d < 7) return `${d} day${d > 1 ? 's' : ''} ago`
  return fmtDate(iso)
}

export function daysUntil(iso) {
  const a = new Date(); a.setHours(0, 0, 0, 0)
  const b = new Date(iso); b.setHours(0, 0, 0, 0)
  return Math.round((b - a) / DAY)
}

export const inr = (n) => '₹' + Number(n).toLocaleString('en-IN')

export const uid = (p = 'id') => p + '-' + Math.random().toString(36).slice(2, 8)

export function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'goodMorning'
  if (h < 17) return 'goodAfternoon'
  return 'goodEvening'
}

export function maskPhone(p) {
  return p.slice(0, 3) + ' ••••• ' + p.slice(-2)
}

export const todayKey = () => new Date().toISOString().slice(0, 10)
