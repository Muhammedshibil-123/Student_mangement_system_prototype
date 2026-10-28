import { useState } from 'react'
import { flushSync } from 'react-dom'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Delete, Fingerprint, Lock, Plus, Volume2 } from 'lucide-react'
import { Avatar, Logo, useToast } from '../components/ui'
import { persistSession, useStore } from '../store/Store'
import { DEMO_PASSWORD, FAMILY_PROFILES, USERS } from '../data/seed'
import { LANGS, translate } from '../i18n'
import { speak } from '../lib/speech'
import { cx } from '../lib/utils'

const PROMPT = {
  en: 'Who is using the phone? Tap your photo, then enter your PIN.',
  ml: 'ആരാണ് ഫോൺ ഉപയോഗിക്കുന്നത്? നിങ്ങളുടെ ചിത്രത്തിൽ തൊടുക, ശേഷം PIN നൽകുക.',
  hi: 'फ़ोन कौन इस्तेमाल कर रहा है? अपनी फ़ोटो पर टैप करें, फिर PIN डालें।',
}

export default function FamilyGateway() {
  const { state, mutate } = useStore()
  const nav = useNavigate()
  const toast = useToast()
  const [params] = useSearchParams()
  const [who, setWho] = useState(params.get('pick'))
  const [pin, setPin] = useState('')
  const [shake, setShake] = useState(false)
  const lang = state.lang
  const u = who && USERS[who]

  const check = (full) => {
    if (full === DEMO_PASSWORD) {
      const session = { userId: u.id, role: u.role, via: 'pin' }
      persistSession(session)
      flushSync(() => mutate((d) => { d.session = session; if (u.role === 'parent') d.activeChild = 'ananya' }))
      toast(`${translate('namaskaram', lang)}, ${u.short}!`, u.avatar)
      nav(u.role === 'parent' ? '/parent' : '/student')
    } else {
      setShake(true); setTimeout(() => { setShake(false); setPin('') }, 500)
    }
  }

  const press = (k) => {
    if (k === 'del') return setPin(pin.slice(0, -1))
    if (pin.length >= 6) return
    const next = pin + k
    setPin(next)
    if (next.length === 6) check(next)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(900px_500px_at_0%_0%,#c6eae5,transparent),radial-gradient(700px_400px_at_100%_100%,#feedc4,transparent)] bg-slate-50 p-0 md:p-6">
      <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-white/70 backdrop-blur md:h-[820px] md:w-[400px] md:rounded-[48px] md:border-[12px] md:border-navy-900 md:shadow-[0_30px_80px_rgba(14,26,46,.35)]">
        <div className="flex items-center justify-between px-5 pt-6">
          {who ? <button onClick={() => { setWho(null); setPin('') }} className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-card" aria-label="Back"><ArrowLeft className="h-4 w-4" /></button> : <Link to="/login" className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-card" aria-label="Back to login"><ArrowLeft className="h-4 w-4" /></Link>}
          <Logo size={30} />
          <span className="w-9" />
        </div>

        {!who ? (
          <div className="flex flex-1 flex-col px-6 pb-8 pt-8">
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-teal-600">Family device · Rajesh’s phone</div>
              <h1 className="mt-2 font-display text-2xl font-extrabold text-navy-800">{translate('whoIsUsing', lang)}</h1>
              <button onClick={() => speak(PROMPT[lang], lang)} className="mx-auto mt-3 flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700"><Volume2 className="h-3.5 w-3.5" /> Voice guide</button>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {FAMILY_PROFILES.map((id) => {
                const p = USERS[id]
                return (
                  <button key={id} onClick={() => { setWho(id); speak(`${p.short}. ${translate('enterPin', lang)}`, lang) }} className="group flex flex-col items-center rounded-3xl bg-white p-4 shadow-card ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-float">
                    <div className="relative">
                      <Avatar emoji={p.avatar} color={p.color} size={72} />
                      <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-white shadow"><Lock className="h-3 w-3 text-slate-500" /></span>
                    </div>
                    <div className="mt-2 font-display text-base font-bold text-navy-800">{p.short}</div>
                    <div className="text-[11px] text-slate-500">{p.role === 'parent' ? p.relation : `Class ${p.className}`}</div>
                  </button>
                )
              })}
            </div>
            <button className="mx-auto mt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-500"><Plus className="h-3.5 w-3.5" /> Add family member</button>
            <div className="mt-auto">
              <div className="mb-2 text-center text-[11px] font-semibold text-slate-400">Voice & screen language</div>
              <div className="grid grid-cols-3 gap-2">
                {LANGS.map((l) => <button key={l.code} onClick={() => { mutate((d) => { d.lang = l.code }); speak(PROMPT[l.code], l.code) }} className={cx('rounded-2xl py-3 text-sm font-bold ring-1', lang === l.code ? 'bg-navy-800 text-white ring-navy-800' : 'bg-white text-navy-800 ring-slate-200')}>{l.native}</button>)}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center px-6 pb-8 pt-6">
            <Avatar emoji={u.avatar} color={u.color} size={84} />
            <div className="mt-3 font-display text-xl font-extrabold text-navy-800">{u.short}</div>
            <div className="text-sm text-slate-500">{translate('enterPin', lang)}</div>
            <div className="mt-6 flex gap-3" style={shake ? { animation: 'shake .4s' } : undefined}>
              {Array.from({ length: 6 }).map((_, i) => <span key={i} className={cx('h-3.5 w-3.5 rounded-full transition', i < pin.length ? (shake ? 'bg-coral-500' : 'bg-navy-800') : 'bg-slate-200')} />)}
            </div>
            <div className="mt-2 h-4 text-[11px] font-semibold text-slate-400">Demo PIN: 123456</div>
            <div className="mt-auto grid w-full max-w-[280px] grid-cols-3 gap-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'bio', '0', 'del'].map((k) => (
                <button key={k} onClick={() => (k === 'bio' ? (setPin(DEMO_PASSWORD), check(DEMO_PASSWORD)) : press(k))} className="grid h-16 place-items-center rounded-2xl bg-white font-display text-2xl font-bold text-navy-800 shadow-card ring-1 ring-slate-900/5 active:scale-95" aria-label={k === 'bio' ? 'Fingerprint' : k === 'del' ? 'Delete' : k}>
                  {k === 'del' ? <Delete className="h-6 w-6" /> : k === 'bio' ? <Fingerprint className="h-6 w-6 text-teal-600" /> : k}
                </button>
              ))}
            </div>
            <p className="mt-4 text-center text-[11px] text-slate-400">Each family member has a separate PIN, so children can’t see parents’ chats and parents see only their own children.</p>
          </div>
        )}
      </div>
    </div>
  )
}
