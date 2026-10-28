import { useEffect, useState } from 'react'
import { Mic, Square, Volume2 } from 'lucide-react'
import { listen, speak, stopSpeaking } from '../lib/speech'
import { translate } from '../i18n'
import { cx } from '../lib/utils'

export function ListenButton({ text, lang = 'en', className, label = true, dark }) {
  const [on, setOn] = useState(false)
  useEffect(() => () => on && stopSpeaking(), [on])
  const toggle = (e) => {
    e.stopPropagation()
    if (on) { stopSpeaking(); setOn(false); return }
    setOn(true)
    speak(text, lang, { onEnd: () => setOn(false) })
  }
  return (
    <button onClick={toggle} className={cx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition', dark ? 'bg-white/15 text-white hover:bg-white/25' : on ? 'bg-teal-500 text-white' : 'bg-teal-50 text-teal-700 hover:bg-teal-100', className)} aria-label="Listen">
      {on ? <span className="flex h-3.5 items-end gap-[2px]">{[0, 1, 2].map((i) => <span key={i} className="w-[3px] animate-wave rounded bg-current" style={{ height: '100%', animationDelay: `${i * 0.15}s` }} />)}</span> : <Volume2 className="h-3.5 w-3.5" />}
      {label && (on ? translate('stop', lang) : translate('listen', lang))}
    </button>
  )
}

export function MicButton({ lang = 'en', onText, fallback, size = 40, className }) {
  const [on, setOn] = useState(false)
  const go = () => {
    if (on) return
    setOn(true)
    listen(lang, { fallback, onResult: (t) => onText && onText(t), onEnd: () => setOn(false) })
  }
  return (
    <button type="button" onClick={go} className={cx('relative grid shrink-0 place-items-center rounded-full text-white transition', on ? 'bg-coral-500' : 'bg-navy-800 hover:bg-navy-700', className)} style={{ width: size, height: size }} aria-label="Speak">
      {on && <span className="absolute inset-0 animate-pulseRing rounded-full bg-coral-500" />}
      {on ? <Square className="relative h-4 w-4 fill-white" /> : <Mic className="relative h-[18px] w-[18px]" />}
    </button>
  )
}
