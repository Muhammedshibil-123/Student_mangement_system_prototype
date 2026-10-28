import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import * as S from '../data/seed'
import { hoursAgo, todayKey, uid } from '../lib/utils'

const KEY = 'vidya-sethu-proto-v3'
export const TRIP_MS = 6 * 60 * 1000 // demo: a 45-minute route plays in 6 minutes

function seedAttendance() {
  const day = {}
  S.CLASS_9B.forEach((s) => { day[s.id] = [9, 22].includes(s.roll) ? 'A' : 'P' })
  const d = new Date(); d.setHours(9, 12, 0, 0)
  return { [todayKey()]: { marks: day, submittedAt: d.toISOString(), by: 'Fathima Nasrin' } }
}

export function makeSeed() {
  return {
    lang: 'en',
    dataSaver: true,
    session: null,
    activeChild: 'ananya',
    notices: S.NOTICES.map((n) => ({ ...n, readBy: {} })),
    attendance: seedAttendance(),
    chats: S.CHATS,
    chatWindow: { enabled: true, start: '16:00', end: '19:00' },
    requests: S.REQUESTS,
    coins: { ananya: 485, aarav: 160 },
    coinHistory: { ananya: S.COIN_HISTORY, aarav: [{ id: 'a1', label: 'Read 3 story books', amt: 30, at: hoursAgo(40) }, { id: 'a2', label: 'Perfect attendance – week 42', amt: 20, at: hoursAgo(30) }] },
    orders: [],
    downloads: { p1: true, p3: true, p7: true, r1: true },
    homework: { ananya: S.HOMEWORK, aarav: [{ id: 'hwa', subject: 'EVS', title: 'Draw the water cycle', due: S.HOMEWORK[0].due, done: false, coins: 10 }] },
    sos: [],
    trip: { status: 'running', startedAt: Date.now() - 95 * 1000, delayMin: 0, delayReason: '', boarded: { 'Aadil Muhammed': true, 'Anjali Suresh': true, 'Faris P.': true, 'Hiba Fathima': true, 'Devika M.': true } },
    alertsSent: {},
    nominations: S.NOMINATIONS,
    projects: S.CSR_PROJECTS,
    counselQueries: S.COUNSEL_QUERIES,
    sessions: S.SESSIONS,
    talent: S.TALENT,
    liked: {},
    scholarships: S.SCHOLARSHIPS,
    kits: S.RESOURCE_KITS,
    onboarded: [
      { name: 'Sanjay Kumar', cls: '9-B', username: 'sanjay.9b', temp: 'VS-4821', guardian: '98•••••210', status: 'Password changed', at: hoursAgo(300) },
      { name: 'Riya Rose', cls: '9-B', username: 'riya.9b', temp: 'VS-1937', guardian: '97•••••118', status: 'Password changed', at: hoursAgo(300) },
      { name: 'Midhun Lal', cls: '9-B', username: 'midhun.9b', temp: 'VS-7710', guardian: '94•••••502', status: 'First login pending', at: hoursAgo(48) },
    ],
    mood: [],
    bookings: [],
    consent: { location: true, voice: true, analytics: true, photos: false, ngoShare: false },
    notifications: [
      { id: 'nt1', to: 'rajesh', icon: '✅', text: 'Ananya marked Present at 9:12 AM', at: hoursAgo(2) },
      { id: 'nt2', to: 'rajesh', icon: '📢', text: 'New verified notice: Second Terminal timetable', at: hoursAgo(3) },
      { id: 'nt3', to: 'ananya', icon: '🪙', text: '+20 Vidya Coins for perfect attendance', at: hoursAgo(30) },
      { id: 'nt4', to: 'principal', icon: '🕒', text: '2 notices waiting for verification', at: hoursAgo(1) },
      { id: 'nt5', to: 'fathima', icon: '🙋', text: 'New help request from Ananya (Physics)', at: hoursAgo(28) },
    ],
  }
}

// the logged-in user is kept per browser tab, so two tabs can be two different roles
function loadSession() {
  try { return JSON.parse(sessionStorage.getItem(KEY + '-session')) } catch { return null }
}

// called by sign-in screens before navigating, so a reload right after signing in keeps the login
export function persistSession(session) {
  try { sessionStorage.setItem(KEY + '-session', JSON.stringify(session)) } catch { /* ignore */ }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const s = JSON.parse(raw)
      // keep the demo bus moving when someone opens the prototype later
      if (s.trip && s.trip.status !== 'idle' && Date.now() - s.trip.startedAt > TRIP_MS + 3 * 60 * 1000) {
        s.trip = { ...s.trip, status: 'running', startedAt: Date.now() - 60 * 1000, delayMin: 0, delayReason: '' }
        s.alertsSent = {}
      }
      return { ...makeSeed(), ...s, session: loadSession() }
    }
  } catch { /* storage unavailable */ }
  return { ...makeSeed(), session: loadSession() }
}

function reducer(state, action) {
  if (action.type === 'reset') return { ...makeSeed(), session: state.session, lang: state.lang }
  if (action.type === 'mutate') {
    const draft = structuredClone(state)
    action.fn(draft, {
      notify: (to, text, icon = '🔔') => draft.notifications.unshift({ id: uid('nt'), to, text, icon, at: new Date().toISOString() }),
    })
    return draft
  }
  return state
}

const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      const { session, ...shared } = state
      localStorage.setItem(KEY, JSON.stringify(shared))
      sessionStorage.setItem(KEY + '-session', JSON.stringify(session))
    } catch { /* ignore */ }
  }, [state])

  // sync between tabs (e.g. Parent in one tab, Driver in another)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY && e.newValue) {
        try { const s = JSON.parse(e.newValue); dispatch({ type: 'mutate', fn: (d) => Object.assign(d, s, { session: d.session }) }) } catch { /* ignore */ }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const mutate = useCallback((fn) => dispatch({ type: 'mutate', fn }), [])
  const reset = useCallback(() => dispatch({ type: 'reset' }), [])
  const value = useMemo(() => ({ state, mutate, reset }), [state, mutate, reset])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  return useContext(Ctx)
}

export function useSession() {
  const { state } = useStore()
  const user = state.session ? S.USERS[state.session.userId] : null
  return { session: state.session, user }
}

export function useT() {
  const { state } = useStore()
  return state.lang
}
