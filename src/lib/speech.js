// Browser text-to-speech / speech-to-text helpers. Everything degrades gracefully
// when the browser has no speech support (the UI still animates).
const SPEECH_LANG = { en: 'en-IN', ml: 'ml-IN', hi: 'hi-IN' }

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window

export function speak(text, lang = 'en', { rate = 0.95, onEnd, onBoundary } = {}) {
  if (!canSpeak()) {
    // fake a duration so UI progress still works
    const t = setTimeout(() => onEnd && onEnd(), Math.min(12000, text.length * 55))
    return () => clearTimeout(t)
  }
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  const want = SPEECH_LANG[lang] || 'en-IN'
  const voices = window.speechSynthesis.getVoices()
  const voice = voices.find((v) => v.lang === want) || voices.find((v) => v.lang.startsWith(want.slice(0, 2))) || voices.find((v) => v.lang === 'en-IN')
  if (voice) u.voice = voice
  u.lang = voice ? voice.lang : want
  u.rate = rate
  u.onend = () => onEnd && onEnd()
  u.onerror = () => onEnd && onEnd()
  if (onBoundary) u.onboundary = onBoundary
  window.speechSynthesis.speak(u)
  return () => window.speechSynthesis.cancel()
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel()
}

export function listen(lang = 'en', { onResult, onEnd, fallback = '' } = {}) {
  const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)
  if (!SR) {
    // Simulated recognition for browsers without speech input
    const t = setTimeout(() => { onResult && onResult(fallback); onEnd && onEnd() }, 1800)
    return () => clearTimeout(t)
  }
  const r = new SR()
  r.lang = SPEECH_LANG[lang] || 'en-IN'
  r.interimResults = false
  r.maxAlternatives = 1
  let got = false
  r.onresult = (e) => { got = true; onResult && onResult(e.results[0][0].transcript) }
  r.onerror = () => { if (!got && fallback) onResult && onResult(fallback) }
  r.onend = () => onEnd && onEnd()
  try { r.start() } catch { onResult && onResult(fallback); onEnd && onEnd() }
  return () => { try { r.abort() } catch { /* ignore */ } }
}
