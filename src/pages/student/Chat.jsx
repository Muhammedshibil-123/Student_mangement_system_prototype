import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, Clock, ShieldCheck } from 'lucide-react'
import { Avatar, Badge, Card } from '../../components/ui'
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
          <p className="text-xs text-teal-900">Your phone number stays private. Teachers reply during their chat hours.</p>
        </Card>
        {TEACHERS.map((t) => {
          const msgs = state.chats[t.id] || []
          const last = msgs[msgs.length - 1]
          return (
            <Card key={t.id} onClick={() => nav(`/student/chat/${t.id}`)} className="flex items-center gap-3 p-3">
              <div className="relative shrink-0"><Avatar name={t.name} color={["#26a69a", "#2f6bbf", "#ec7563", "#8b5cf6", "#e9a21c"][TEACHERS.indexOf(t) % 5]} size={48} />{t.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-card" />}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2"><span className="truncate text-sm font-bold text-foreground">{t.name}</span>{last && <span className="shrink-0 text-[10px] text-slate-400">{timeAgo(last.at)}</span>}</div>
                <div className="truncate text-[12px] text-slate-500">{last ? (last.from === user.id ? 'You: ' : '') + last.text : t.role}</div>
                <div className="mt-0.5 flex items-center gap-1.5"><Badge color="slate">{t.subject}</Badge><span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Clock className="h-3 w-3" />{t.window}</span></div>
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
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileHeader back={`${base}/chat`} title={t.name} sub={`${t.subject} · ${t.online ? 'Online' : 'Chat hours ' + t.window}`} />
      <SecureChat threadId={threadPrefix + t.id} me={user} other={{ ...t, role: 'teacher' }} height="min-h-0 flex-1" />
    </div>
  )
}
