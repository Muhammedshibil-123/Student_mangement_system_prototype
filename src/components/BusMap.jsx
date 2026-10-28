import { useEffect, useMemo, useState } from 'react'
import { useStore, TRIP_MS } from '../store/Store'
import { BUS } from '../data/seed'

// Route polyline across a stylised map of Edayur → Valanchery (viewBox 360 × 300)
const ROUTE = [[38, 42], [66, 50], [90, 66], [108, 92], [134, 106], [162, 114], [188, 134], [200, 158], [214, 182], [242, 192], [268, 202], [288, 222], [304, 244], [318, 260], [330, 274]]
const STOP_IDX = [0, 3, 6, 9, 12, 14]
const ROUTE_MIN = 45
// label offset [dx, dy, anchor] per stop so nothing is clipped at the map edges
const LABEL = [[2, -10, 'start'], [-11, 4, 'end'], [-12, 4, 'end'], [10, 4, 'start'], [-11, 4, 'end'], [-12, 3, 'end']]

const seg = ROUTE.slice(1).map((p, i) => Math.hypot(p[0] - ROUTE[i][0], p[1] - ROUTE[i][1]))
const cum = seg.reduce((a, l) => [...a, a[a.length - 1] + l], [0])
const TOTAL = cum[cum.length - 1]
export const STOP_FRAC = STOP_IDX.map((i) => cum[i] / TOTAL)

function pointAt(t) {
  const d = Math.max(0, Math.min(1, t)) * TOTAL
  let i = cum.findIndex((c) => c >= d) - 1
  if (i < 0) i = 0
  const f = seg[i] ? (d - cum[i]) / seg[i] : 0
  return [ROUTE[i][0] + (ROUTE[i + 1][0] - ROUTE[i][0]) * f, ROUTE[i][1] + (ROUTE[i + 1][1] - ROUTE[i][1]) * f]
}

export function useBus() {
  const { state } = useStore()
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i) }, [])
  return useMemo(() => {
    const trip = state.trip
    const idle = trip.status === 'idle'
    const p = idle ? 0 : Math.min(1, (now - trip.startedAt) / TRIP_MS)
    const arrived = !idle && p >= 1
    const nextIdx = STOP_FRAC.findIndex((f) => f > p + 0.0001)
    const eta = (idx) => Math.max(0, Math.round((STOP_FRAC[idx] - p) * ROUTE_MIN + (trip.delayMin || 0)))
    const speed = idle || arrived ? 0 : Math.round(30 + Math.sin(now / 6000) * 7)
    const homeIdx = BUS.stops.findIndex((s) => s.isHome)
    const passedHome = p >= STOP_FRAC[homeIdx]
    return { p, idle, arrived, nextIdx: nextIdx === -1 ? STOP_FRAC.length - 1 : nextIdx, eta, speed, homeIdx, passedHome, trip, now, pos: pointAt(p) }
  }, [state.trip, now])
}

export function BusMap({ bus, className, compact }) {
  const path = ROUTE.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ')
  const done = ROUTE.filter((_, i) => cum[i] / TOTAL <= bus.p).concat([bus.pos])
  const donePath = done.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ')
  return (
    <svg viewBox="0 0 360 300" className={className} role="img" aria-label="Live bus map">
      <defs>
        <pattern id="paddy" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <rect width="8" height="8" fill="#dcefd3" /><line x1="0" y1="0" x2="0" y2="8" stroke="#c8e4bb" strokeWidth="3" />
        </pattern>
        <filter id="sh" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="1.5" stdDeviation="2" floodOpacity=".25" /></filter>
      </defs>
      <rect width="360" height="300" fill="#eef3ea" />
      {/* paddy fields & groves */}
      <path d="M0 120 C40 110 60 150 40 190 C20 230 0 220 0 220Z" fill="url(#paddy)" />
      <path d="M210 20 C260 10 320 30 340 70 C300 90 250 80 220 60Z" fill="url(#paddy)" />
      <path d="M120 200 C150 190 180 220 170 260 C140 270 110 250 120 200Z" fill="url(#paddy)" />
      {[[60, 260], [80, 240], [250, 120], [270, 140], [300, 110], [140, 40], [160, 60], [30, 80]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="9" fill="#cfe5c3" />
      ))}
      {/* river Bharathapuzha */}
      <path d="M-10 285 C60 260 90 290 150 280 C200 272 220 300 260 300" stroke="#a9d4ee" strokeWidth="14" fill="none" strokeLinecap="round" />
      {!compact && <text x="40" y="292" fontSize="8" fill="#4a86d4" fontStyle="italic">Bharathapuzha</text>}
      {/* other roads */}
      <path d="M0 160 L120 150 L188 134 L300 90 L360 80" stroke="#ffffff" strokeWidth="7" fill="none" />
      <path d="M0 160 L120 150 L188 134 L300 90 L360 80" stroke="#e2e8f0" strokeWidth="1" fill="none" strokeDasharray="4 4" />
      <path d="M200 0 L214 182 L230 300" stroke="#ffffff" strokeWidth="5" fill="none" />
      {!compact && <text x="300" y="80" fontSize="8" fill="#94a3b8" fontWeight="600">NH 66</text>}
      {/* route */}
      <path d={path} stroke="#ffffff" strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={path} stroke="#9fb3cf" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 6" />
      <path d={donePath} stroke="#26a69a" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* stops */}
      {BUS.stops.map((s, i) => {
        const [x, y] = ROUTE[STOP_IDX[i]]
        const passed = bus.p >= STOP_FRAC[i]
        return (
          <g key={s.id} filter="url(#sh)">
            {s.isHome && <circle cx={x} cy={y} r="13" fill="#f6b93b" opacity=".25" />}
            <circle cx={x} cy={y} r={s.isSchool || s.isHome ? 7 : 5.5} fill={s.isSchool ? '#14253f' : passed ? '#26a69a' : '#ffffff'} stroke={s.isHome ? '#e9a21c' : passed ? '#ffffff' : '#9fb3cf'} strokeWidth="2.5" />
            {s.isHome && <text x={x} y={y + 3} fontSize="8" textAnchor="middle">🏠</text>}
            {!compact && (
              <text x={x + LABEL[i][0]} y={y + LABEL[i][1]} fontSize="9" fontWeight="700" fill="#14253f" textAnchor={LABEL[i][2]} stroke="#eef3ea" strokeWidth="3" paintOrder="stroke">
                {s.isSchool ? '🏫 School' : s.name.split(' ')[0]}
              </text>
            )}
          </g>
        )
      })}
      {/* bus */}
      <g transform={`translate(${bus.pos[0]},${bus.pos[1]})`}>
        {!bus.idle && !bus.arrived && <circle r="10" fill="#f6b93b" className="origin-center animate-pulseRing" style={{ transformBox: 'fill-box' }} />}
        <circle r="11" fill="#f6b93b" stroke="#ffffff" strokeWidth="3" filter="url(#sh)" />
        <text y="4" fontSize="11" textAnchor="middle">🚌</text>
      </g>
    </svg>
  )
}
