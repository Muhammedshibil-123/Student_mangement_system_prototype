import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Heart, MessageCircle, Plus, RotateCcw, Upload } from 'lucide-react'
import { Avatar, Badge, Button, Card, Field, SectionTitle, Sheet, Tabs, Toggle, inputCls, useToast } from '../../components/ui'
import { MobileHeader, HeaderActions } from '../../components/MobileShell'
import { useSession, useStore } from '../../store/Store'
import { CAREER_QUIZ, CAREER_RESULTS, FAMILY_PROFILES, STORE_ITEMS, USERS } from '../../data/seed'
import { LANGS, translate } from '../../i18n'
import { cx, inr, timeAgo, uid } from '../../lib/utils'

// ---------- Coins & Store ----------
export function CoinsStore() {
  const { state, mutate } = useStore()
  const { user } = useSession()
  const toast = useToast()
  const [tab, setTab] = useState('store')
  const [buy, setBuy] = useState(null)
  const coins = state.coins[user.id]
  const redeem = (item) => {
    mutate((d, { notify }) => {
      d.coins[user.id] -= item.coins
      d.coinHistory[user.id].unshift({ id: uid('c'), label: `Redeemed: ${item.name}`, amt: -item.coins, at: new Date().toISOString() })
      d.orders.unshift({ id: 'ORD-' + (5100 + d.orders.length), item: item.name, by: user.name, coins: item.coins, pay: item.price - (item.discount === 'FREE' ? item.price : parseInt(item.discount.replace(/\D/g, ''), 10)), status: 'Ready for pickup at school office', at: new Date().toISOString() })
      notify(user.parentId, `${user.short} redeemed ${item.coins} coins for ${item.name}`, '🛍️')
    })
    toast(`Order placed! Collect “${item.name}” from the school office.`, '🛍️')
    setBuy(null)
  }
  return (
    <div>
      <MobileHeader back="/student" title={translate('coinsStore', state.lang)} right={<HeaderActions userId={user.id} />} />
      <div className="space-y-4 px-4">
        <Card className="overflow-hidden bg-gradient-to-br from-sun-300 via-sun-400 to-sun-500 p-4 ring-0">
          <div className="text-xs font-semibold text-navy-800/70">My balance</div>
          <div className="font-display text-4xl font-extrabold text-navy-900">🪙 {coins}</div>
          <div className="mt-1 text-xs text-navy-800/80">Earn coins for attendance, homework, quizzes & good questions</div>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[10px] font-semibold text-navy-900">
            {[['📅', 'Attendance', '+20/wk'], ['📝', 'Homework', '+10'], ['🧠', 'Quiz', '+30'], ['🎧', 'Audio pod', '+10']].map(([e, l, v]) => <div key={l} className="rounded-xl bg-white/40 py-2"><div className="text-lg">{e}</div>{l}<div className="text-navy-800/70">{v}</div></div>)}
          </div>
        </Card>
        <Tabs value={tab} onChange={setTab} tabs={[{ value: 'store', label: '🛍️ Store' }, { value: 'history', label: '📜 History' }, { value: 'orders', label: `📦 Orders (${state.orders.filter((o) => o.by === user.name).length})` }]} />
        {tab === 'store' && (
          <div className="grid grid-cols-2 gap-3">
            {STORE_ITEMS.map((it) => (
              <Card key={it.id} onClick={() => setBuy(it)} className="p-3">
                <div className="grid h-20 place-items-center rounded-xl bg-slate-50 text-4xl">{it.emoji}</div>
                <div className="mt-2 line-clamp-2 text-[12.5px] font-semibold leading-snug text-navy-800">{it.name}</div>
                <div className="mt-1 flex items-center justify-between"><span className="text-xs font-bold text-sun-600">🪙 {it.coins}</span><Badge color="green">{it.discount}</Badge></div>
                <div className="text-[10px] text-slate-400 line-through">{inr(it.price)}</div>
              </Card>
            ))}
          </div>
        )}
        {tab === 'history' && (
          <Card className="divide-y divide-slate-100">
            {state.coinHistory[user.id].map((h) => (
              <div key={h.id} className="flex items-center justify-between p-3.5">
                <div><div className="text-[13px] font-medium text-navy-800">{h.label}</div><div className="text-[11px] text-slate-400">{timeAgo(h.at)}</div></div>
                <span className={cx('font-bold', h.amt > 0 ? 'text-teal-600' : 'text-coral-500')}>{h.amt > 0 ? '+' : ''}{h.amt}</span>
              </div>
            ))}
          </Card>
        )}
        {tab === 'orders' && (
          <div className="space-y-2">
            {state.orders.filter((o) => o.by === user.name).length === 0 && <div className="py-8 text-center text-sm text-slate-500">No orders yet. Redeem your coins in the store!</div>}
            {state.orders.filter((o) => o.by === user.name).map((o) => (
              <Card key={o.id} className="p-3.5"><div className="flex justify-between"><b className="text-sm text-navy-800">{o.item}</b><span className="text-xs text-slate-400">{o.id}</span></div><div className="text-[11px] text-slate-500">🪙 {o.coins} + {inr(o.pay)} · {o.status}</div></Card>
            ))}
          </div>
        )}
      </div>
      <Sheet open={!!buy} onClose={() => setBuy(null)} title="Redeem coins"
        footer={buy && <Button className="w-full" variant="sun" disabled={coins < buy.coins} onClick={() => redeem(buy)}>{coins < buy.coins ? `Need ${buy.coins - coins} more coins` : `Redeem 🪙 ${buy.coins}`}</Button>}>
        {buy && (
          <div className="text-center">
            <div className="mx-auto grid h-28 w-28 place-items-center rounded-3xl bg-slate-50 text-6xl">{buy.emoji}</div>
            <div className="mt-3 font-display text-lg font-bold text-navy-800">{buy.name}</div>
            <div className="text-xs text-slate-500">Supported by {buy.by} · {buy.stock} in stock</div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-xl bg-slate-50 p-2"><div className="text-slate-400">MRP</div><b className="text-navy-800">{inr(buy.price)}</b></div>
              <div className="rounded-xl bg-emerald-50 p-2"><div className="text-emerald-600">Coins give</div><b className="text-emerald-700">{buy.discount}</b></div>
              <div className="rounded-xl bg-sun-50 p-2"><div className="text-sun-700">You pay</div><b className="text-navy-800">{buy.discount === 'FREE' ? '₹0' : inr(buy.price - parseInt(buy.discount.replace(/\D/g, ''), 10))}</b></div>
            </div>
            <p className="mt-3 text-[11px] text-slate-400">Pickup at the school office, or doorstep delivery with the next CSR kit run.</p>
          </div>
        )}
      </Sheet>
    </div>
  )
}

// ---------- Talent wall ----------
function Art({ hue, title }) {
  return (
    <svg viewBox="0 0 160 120" className="h-full w-full">
      <defs><linearGradient id={'g' + hue} x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor={`hsl(${hue},70%,72%)`} /><stop offset="1" stopColor={`hsl(${(hue + 60) % 360},65%,48%)`} /></linearGradient></defs>
      <rect width="160" height="120" fill={'url(#g' + hue + ')'} />
      <circle cx="120" cy="30" r="16" fill={`hsl(${(hue + 30) % 360},90%,85%)`} opacity=".9" />
      <path d="M0 90 Q40 60 80 85 T160 80 V120 H0Z" fill={`hsl(${(hue + 120) % 360},45%,35%)`} opacity=".75" />
      <path d="M0 100 Q50 85 90 100 T160 98 V120 H0Z" fill={`hsl(${(hue + 150) % 360},40%,25%)`} opacity=".8" />
      <text x="8" y="16" fontSize="8" fill="#fff" opacity=".8">{title.slice(0, 26)}</text>
    </svg>
  )
}

export function TalentWall() {
  const { state, mutate } = useStore()
  const { user } = useSession()
  const toast = useToast()
  const [filter, setFilter] = useState('All')
  const [post, setPost] = useState(false)
  const [form, setForm] = useState({ type: 'Poem', title: '', text: '' })
  const list = state.talent.filter((t) => filter === 'All' || t.type === filter)
  const like = (id) => mutate((d) => { const p = d.talent.find((x) => x.id === id); const k = user.id + id; if (d.liked[k]) { p.likes--; delete d.liked[k] } else { p.likes++; d.liked[k] = true } })
  const submit = () => {
    mutate((d, { notify }) => {
      d.talent.unshift({ id: uid('tw'), by: user.short + ' ' + user.name.split(' ')[1][0] + '.', cls: user.className, type: form.type, title: form.title || 'Untitled', text: form.text, hue: Math.floor(Math.random() * 360), likes: 0, comments: 0, pending: true })
      notify('fathima', `${user.short} submitted a ${form.type} to the Talent Wall for approval`, '🎨')
    })
    toast('Submitted! Your teacher will approve it before it appears to everyone.', '🎨')
    setPost(false); setForm({ type: 'Poem', title: '', text: '' })
  }
  return (
    <div>
      <MobileHeader back="/student" title={translate('talentWall', state.lang)} sub="Art, poems & stories by students" right={<button onClick={() => setPost(true)} className="grid h-9 w-9 place-items-center rounded-full bg-navy-800 text-white" aria-label="New post"><Plus className="h-4 w-4" /></button>}>
        <Tabs className="mt-3" value={filter} onChange={setFilter} tabs={['All', 'Art', 'Poem', 'Story']} />
      </MobileHeader>
      <div className="columns-2 gap-3 px-4 [&>*]:mb-3">
        {list.map((t) => (
          <Card key={t.id} className="break-inside-avoid overflow-hidden">
            {t.type === 'Art' ? <div className="aspect-[4/3]"><Art hue={t.hue} title={t.title} /></div>
              : <div className={cx('p-3 text-[12.5px] leading-relaxed', t.type === 'Poem' ? 'bg-violet-50 text-violet-900' : 'bg-sky-50 text-sky-900')}><div className="mb-1 font-bold">{t.title}</div><div className="whitespace-pre-line">{t.text}</div></div>}
            <div className="p-2.5">
              {t.type === 'Art' && <div className="text-[12px] font-semibold leading-snug text-navy-800">{t.title}</div>}
              <div className="mt-0.5 text-[10.5px] text-slate-500">{t.by} · {t.cls} {t.pending && <Badge color="sun">Awaiting approval</Badge>}</div>
              <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-500">
                <button onClick={() => like(t.id)} className={cx('flex items-center gap-1', state.liked[user.id + t.id] && 'text-coral-500')}><Heart className={cx('h-3.5 w-3.5', state.liked[user.id + t.id] && 'fill-coral-500')} />{t.likes}</button>
                <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{t.comments}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Sheet open={post} onClose={() => setPost(false)} title="Share your talent" footer={<Button className="w-full" variant="teal" onClick={submit}>Submit for approval</Button>}>
        <Field label="Type"><Tabs value={form.type} onChange={(v) => setForm({ ...form, type: v })} tabs={['Poem', 'Story', 'Art']} /></Field>
        <Field label="Title"><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Give it a name" /></Field>
        {form.type === 'Art' ? (
          <button className="mb-3 flex w-full flex-col items-center gap-1 rounded-2xl border-2 border-dashed border-slate-300 p-6 text-sm text-slate-500"><Upload className="h-6 w-6" /> Take a photo of your drawing</button>
        ) : <Field label="Your writing"><textarea className={cx(inputCls, 'h-32 resize-none')} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="Write in any language…" /></Field>}
        <p className="text-[11px] text-slate-400">🛡️ Only first name + class is shown. Teachers approve every post. No comments from outside the school.</p>
      </Sheet>
    </div>
  )
}

// ---------- Career path ----------
export function CareerPath() {
  const { mutate } = useStore()
  const { user } = useSession()
  const toast = useToast()
  const [i, setI] = useState(-1)
  const [ans, setAns] = useState([])
  const pick = (k) => {
    const next = [...ans, k]
    setAns(next)
    if (i + 1 >= CAREER_QUIZ.length) {
      setI(99)
      mutate((d) => { d.coins[user.id] += 30; d.coinHistory[user.id].unshift({ id: uid('c'), label: 'Career interest quiz completed', amt: 30, at: new Date().toISOString() }) })
      toast('+30 Vidya Coins for completing the career quiz', '🪙')
    } else setI(i + 1)
  }
  const counts = ans.reduce((a, k) => ({ ...a, [k]: (a[k] || 0) + 1 }), {})
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const res = top[0] && CAREER_RESULTS[top[0][0]]
  return (
    <div>
      <MobileHeader back="/student" title="AI Career Path" sub="Gamified interest discovery" />
      <div className="px-4">
        {i === -1 && (
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-sky-500 to-navy-800 p-6 text-center text-white">
              <div className="text-5xl">🧭</div>
              <div className="mt-2 font-display text-xl font-extrabold">Discover your path</div>
              <p className="mt-1 text-xs text-white/80">5 fun questions · 2 minutes · no wrong answers</p>
            </div>
            <div className="p-4">
              <ul className="space-y-2 text-[13px] text-slate-600">
                <li>✅ Builds a long-term roadmap from your interests</li>
                <li>✅ Suggests Plus One streams & Kerala colleges</li>
                <li>✅ Links scholarships & entrance exams</li>
              </ul>
              <Button className="mt-4 w-full" variant="primary" onClick={() => setI(0)}>Start the quiz</Button>
            </div>
          </Card>
        )}
        {i >= 0 && i < 99 && (
          <div>
            <div className="mb-3 flex gap-1.5">{CAREER_QUIZ.map((_, k) => <div key={k} className={cx('h-1.5 flex-1 rounded-full', k <= i ? 'bg-teal-500' : 'bg-slate-200')} />)}</div>
            <div className="text-xs font-semibold text-slate-400">Question {i + 1} of {CAREER_QUIZ.length}</div>
            <div className="mt-1 font-display text-xl font-extrabold text-navy-800">{CAREER_QUIZ[i].q}</div>
            <div className="mt-4 space-y-2.5">
              {CAREER_QUIZ[i].opts.map(([label, k]) => (
                <button key={label} onClick={() => pick(k)} className="w-full rounded-2xl bg-white p-4 text-left text-[14px] font-semibold text-navy-800 shadow-card ring-1 ring-slate-900/5 transition hover:ring-2 hover:ring-teal-500 active:scale-[.99]">{label}</button>
              ))}
            </div>
          </div>
        )}
        {i === 99 && res && (
          <div className="space-y-3">
            <Card className="p-5 text-center" style={{ background: res.color + '18' }}>
              <div className="text-xs font-semibold text-slate-500">You are…</div>
              <div className="font-display text-2xl font-extrabold text-navy-800">{res.title}</div>
              <div className="mt-2 flex justify-center gap-1.5">{top.map(([k, v]) => <Badge key={k} color="slate">{CAREER_RESULTS[k].title.split(' ')[1]} {Math.round((v / ans.length) * 100)}%</Badge>)}</div>
            </Card>
            <Card className="p-4">
              <SectionTitle>Your roadmap</SectionTitle>
              <ol className="space-y-2 text-[13px]">
                <li className="flex gap-2"><span className="font-bold text-teal-600">Class 10</span><span className="text-slate-600">Strengthen Maths & English · try NMMS / Kalolsavam</span></li>
                <li className="flex gap-2"><span className="font-bold text-teal-600">Plus One</span><span className="text-slate-600">{res.subjects}</span></li>
                <li className="flex gap-2"><span className="font-bold text-teal-600">After 12</span><span className="text-slate-600">{res.paths.join(' · ')}</span></li>
              </ol>
            </Card>
            <Card className="p-4 text-[13px] text-slate-600">💡 Premium AI career report (₹50–100) adds aptitude tests and a mentor call. <b>Free for CSR-sponsored students.</b></Card>
            <Button variant="outline" className="w-full" icon={RotateCcw} onClick={() => { setAns([]); setI(-1) }}>Retake quiz</Button>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------- More / settings (shared by student & parent) ----------
export function MoreMenu({ items, base }) {
  const { state, mutate } = useStore()
  const { user } = useSession()
  const nav = useNavigate()
  const family = FAMILY_PROFILES.map((id) => USERS[id]).filter((u) => u.id !== user.id)
  return (
    <div>
      <MobileHeader title={translate('more', state.lang)} right={<HeaderActions userId={user.id} />} />
      <div className="space-y-4 px-4">
        <Card className="flex items-center gap-3 p-4">
          <Avatar emoji={user.avatar} color={user.color} size={52} />
          <div className="min-w-0 flex-1">
            <div className="font-display text-lg font-extrabold text-navy-800">{user.name}</div>
            <div className="text-xs text-slate-500">{user.role === 'student' ? `Class ${user.className} · Vidyanagar GHSS` : user.role === 'parent' ? `${user.relation} of Ananya & Aarav` : 'Route 3 driver'}</div>
          </div>
        </Card>
        {items && (
          <div className="grid grid-cols-3 gap-2">
            {items.map((it) => (
              <Card key={it.to} onClick={() => nav(it.to)} className="flex flex-col items-center gap-1 p-3 text-center">
                <span className="text-2xl">{it.emoji}</span><span className="text-[11px] font-semibold leading-tight text-navy-800">{it.label}</span>
              </Card>
            ))}
          </div>
        )}
        {user.role !== 'driver' && (
          <Card className="p-4">
            <SectionTitle>{translate('switchProfile', state.lang)} · family phone</SectionTitle>
            <div className="flex gap-3">
              {family.map((f) => (
                <button key={f.id} onClick={() => nav('/family?pick=' + f.id)} className="flex flex-col items-center gap-1">
                  <Avatar emoji={f.avatar} color={f.color} size={48} /><span className="text-[11px] font-semibold text-navy-800">{f.short}</span>
                </button>
              ))}
            </div>
          </Card>
        )}
        <Card className="p-4">
          <SectionTitle>Settings</SectionTitle>
          <div className="mb-2 text-xs font-semibold text-slate-500">{translate('language', state.lang)} (screens & voice prompts)</div>
          <div className="grid grid-cols-3 gap-2">
            {LANGS.map((l) => <button key={l.code} onClick={() => mutate((d) => { d.lang = l.code })} className={cx('rounded-xl py-2.5 text-sm font-bold ring-1', state.lang === l.code ? 'bg-teal-50 text-teal-700 ring-teal-500' : 'bg-white text-navy-800 ring-slate-200')}>{l.native}</button>)}
          </div>
          <div className="mt-2 divide-y divide-slate-100">
            <Toggle checked={state.dataSaver} onChange={(v) => mutate((d) => { d.dataSaver = v })} label={translate('dataSaver', state.lang)} sub="Text-first, compressed audio, images on tap" />
            <Toggle checked={state.consent.voice} onChange={(v) => mutate((d) => { d.consent.voice = v })} label="Voice prompts" sub="Read screens aloud for low-literacy users" />
          </div>
        </Card>
        <button onClick={() => { mutate((d) => { d.session = null }); nav('/login') }} className="flex w-full items-center justify-between rounded-2xl bg-white p-4 text-sm font-semibold text-coral-600 shadow-card ring-1 ring-slate-900/5">{translate('logout', state.lang)} <ChevronRight className="h-4 w-4" /></button>
        <p className="pb-2 text-center text-[10px] text-slate-400">Vidya Sethu prototype v0.1 · demo data only · DPDP Act 2023 aligned design</p>
      </div>
    </div>
  )
}

export function SimplePage({ title, back, children, sub }) {
  const { user } = useSession()
  return (
    <div>
      <MobileHeader back={back} title={title} sub={sub} right={<HeaderActions userId={user.id} />} />
      <div className="px-4">{children}</div>
    </div>
  )
}
