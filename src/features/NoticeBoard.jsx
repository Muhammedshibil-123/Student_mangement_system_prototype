import { useState } from 'react'
import { Download, FileText, HandHeart, Landmark, MessageCircleQuestion, Pin, School, Scale, Users } from 'lucide-react'
import { Badge, Button, Card, Empty, Sheet, Tabs, Verified, useToast } from '../components/ui'
import { ListenButton } from './Voice'
import { useSession, useStore } from '../store/Store'
import { translate } from '../i18n'
import { cx, timeAgo } from '../lib/utils'

export const SOURCE_META = {
  school: { label: 'School', color: 'sky', icon: School, tint: 'bg-sky-50 text-sky-600' },
  govt: { label: 'Govt', color: 'navy', icon: Landmark, tint: 'bg-slate-100 text-slate-700' },
  civic: { label: 'Rights', color: 'violet', icon: Scale, tint: 'bg-violet-50 text-violet-600' },
  community: { label: 'Community', color: 'coral', icon: HandHeart, tint: 'bg-coral-50 text-coral-600' },
}

export const nTitle = (n, lang) => (lang === 'ml' && n.titleMl ? n.titleMl : n.title)
export const nBody = (n, lang) => (lang === 'ml' && n.bodyMl ? n.bodyMl : n.body)

export function NoticeCard({ n, onOpen, compact }) {
  const { state } = useStore()
  const { user } = useSession()
  const lang = state.lang
  const read = n.readBy?.[user.id]
  const m = SOURCE_META[n.source]
  return (
    <Card onClick={onOpen} className={cx('p-3.5', !read && 'ring-teal-500/30')}>
      <div className="flex items-start gap-3">
        <div className={cx('grid h-11 w-11 shrink-0 place-items-center rounded-2xl', m.tint)}><m.icon className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <Badge color={m.color}>{translate(n.source === 'school' ? 'official' : n.source, lang)}</Badge>
            {n.urgent && <Badge color="red">Important</Badge>}
            {n.pinned && <Pin className="h-3 w-3 text-slate-400" />}
            {!read && <span className="h-2 w-2 rounded-full bg-teal-500" />}
          </div>
          <div className={cx('text-[13.5px] font-semibold leading-snug text-foreground', compact && 'line-clamp-2')}>{nTitle(n, lang)}</div>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-slate-400">
              <Verified label="" /> <span className="truncate">{n.author} · {timeAgo(n.at)}</span>
            </div>
            {!compact && <ListenButton text={nTitle(n, lang) + '. ' + nBody(n, lang)} lang={lang} label={false} />}
          </div>
        </div>
      </div>
    </Card>
  )
}

export function NoticeDetail({ n, onClose, onAsk }) {
  const { state, mutate } = useStore()
  const { user } = useSession()
  const toast = useToast()
  const lang = state.lang
  if (!n) return null
  const read = n.readBy?.[user.id]
  const m = SOURCE_META[n.source]
  return (
    <Sheet open={!!n} onClose={onClose} title={`${m.label} notice`}
      footer={
        <div className="grid grid-cols-2 gap-2">
          <Button variant="soft" icon={MessageCircleQuestion} onClick={() => { onClose(); onAsk && onAsk(n) }}>Ask a question</Button>
          <Button variant={read ? 'outline' : 'teal'} disabled={read} onClick={() => { mutate((d) => { const x = d.notices.find((k) => k.id === n.id); x.readBy[user.id] = true; x.reads += 1 }); toast('Marked as read. Your school can see this.') }}>{read ? '✓ ' + translate('understood', lang) : translate('markRead', lang)}</Button>
        </div>
      }>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge color={m.color}>{m.label}</Badge><Badge>{n.category}</Badge>{n.urgent && <Badge color="red">Important</Badge>}
      </div>
      <h2 className="mt-3 font-display text-lg font-bold leading-snug text-foreground">{nTitle(n, lang)}</h2>
      {lang !== 'ml' && n.titleMl && <div className="mt-1 text-sm text-slate-500">{n.titleMl}</div>}
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-2 text-xs text-teal-800">
        <Verified label="" /> <span>Verified by <b>{n.author}</b> ({n.authorRole}) · {timeAgo(n.at)}</span>
      </div>
      <p className="mt-4 whitespace-pre-line text-[14px] leading-relaxed text-slate-700">{nBody(n, lang)}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <ListenButton text={nTitle(n, lang) + '. ' + nBody(n, lang)} lang={lang} />
        {lang === 'en' && n.bodyMl && <ListenButton text={n.bodyMl} lang="ml" className="!bg-sun-50 !text-sun-700" label={false} />}
        {lang === 'en' && n.bodyMl && <span className="text-[11px] text-slate-400">← listen in Malayalam</span>}
      </div>
      {n.attachment && (
        <button onClick={() => toast(`${n.attachment} saved for offline use`)} className="mt-4 flex w-full items-center gap-3 rounded-xl bg-slate-50 p-3 text-left ring-1 ring-slate-200">
          <FileText className="h-8 w-8 text-coral-500" />
          <div className="flex-1"><div className="text-sm font-semibold text-foreground">{n.attachment}</div><div className="text-[11px] text-slate-500">PDF · 184 KB · low-data</div></div>
          <Download className="h-4 w-4 text-slate-500" />
        </button>
      )}
      <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-400"><Users className="h-3.5 w-3.5" /> Sent to {n.audience} · {n.reads} of {n.reach} have read</div>
    </Sheet>
  )
}

export default function NoticeBoard({ onAsk, sources = ['all', 'school', 'govt', 'civic', 'community'] }) {
  const { state } = useStore()
  const lang = state.lang
  const [tab, setTab] = useState('all')
  const [open, setOpen] = useState(null)
  const list = state.notices.filter((n) => n.status === 'verified' && (tab === 'all' || n.source === tab))
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || new Date(b.at) - new Date(a.at))
  const counts = (s) => state.notices.filter((n) => n.status === 'verified' && (s === 'all' || n.source === s)).length
  return (
    <div>
      <Tabs className="mb-3 px-4" value={tab} onChange={setTab} tabs={sources.map((s) => ({ value: s, label: translate(s === 'school' ? 'official' : s, lang), count: counts(s) }))} />
      <div className="space-y-2.5 px-4">
        {list.length === 0 && <Empty title="No notices here yet" />}
        {list.map((n) => <NoticeCard key={n.id} n={n} onOpen={() => setOpen(n)} />)}
      </div>
      <NoticeDetail n={open && state.notices.find((x) => x.id === open.id)} onClose={() => setOpen(null)} onAsk={onAsk} />
    </div>
  )
}
