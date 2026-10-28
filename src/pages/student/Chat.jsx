import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, ShieldCheck } from 'lucide-react'
import { Badge, Card } from '../../components/ui'
import { MobileHeader, HeaderActions } from '../../components/MobileShell'
import SecureChat from '../../features/SecureChat'
import { useSession, useStore } from '../../store/Store'
import { TEACHERS } from '../../data/seed'
import { translate } from '../../i18n'
import { timeAgo } from '../../lib/utils'

export function ChatList() {
  const { state } = useStore()
  const { user } = useSession()
  const nav = useNavigate()
  return (
    <div>
      <MobileHeader title={translate('chat', state.lang)} sub="Secure teacher chat · no phone numbers shared" right={<HeaderActions userId={user.id} />} />
      <div className="space-y-2 px-4">
        <Card className="flex items-start gap-3 bg-teal-50 p-3.5 ring-teal-500/20">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
          <p className="text-xs text-teal-900">Instead of WhatsApp groups that expose phone numbers, students chat with teachers inside Vidya Sethu. Teachers set chat hours and a safety filter blocks personal info.</p>
        </Card>
        {TEACHERS.map((t) => {
          const msgs = state.chats[t.id] || []
          const last = msgs[msgs.length - 1]
          return (
            <Card key={t.id} onClick={() => nav(`/student/chat/${t.id}`)} className="flex items-center gap-3 p-3">
              <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-slate-100 text-2xl">{t.avatar}{t.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2"><span className="truncate text-sm font-bold text-navy-800">{t.name}</span>{last && <span className="shrink-0 text-[10px] text-slate-400">{timeAgo(last.at)}</span>}</div>
                <div className="truncate text-[12px] text-slate-500">{last ? (last.from === user.id ? 'You: ' : '') + last.text : t.role}</div>
                <div className="mt-0.5 flex items-center gap-1.5"><Badge color="slate">{t.subject}</Badge><span className="text-[10px] text-slate-400">🕓 {t.window}</span></div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export function ChatThreadPage({ base = '/student', threadPrefix = '' }) {
  const { id } = useParams()
  const { user } = useSession()
  const t = TEACHERS.find((x) => x.id === id) || TEACHERS[0]
  return (
    <div className="flex h-full flex-col">
      <MobileHeader back={`${base}/chat`} title={t.name} sub={`${t.subject} · ${t.online ? 'online' : 'chat hours ' + t.window}`} />
      <div className="flex-1">
        <SecureChat threadId={threadPrefix + t.id} me={user} other={{ ...t, role: 'teacher' }} height="h-[calc(100dvh-210px)] md:h-[640px]" />
      </div>
    </div>
  )
}
