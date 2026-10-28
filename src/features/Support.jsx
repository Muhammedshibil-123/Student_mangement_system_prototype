import { useState } from 'react'
import { CalendarClock, Package } from 'lucide-react'
import { Badge, Button, Card, Progress, SectionTitle, Sheet, Steps, useToast } from '../components/ui'
import { useStore } from '../store/Store'
import { daysUntil, fmtDate } from '../lib/utils'

const SCH_STEPS = ['Eligibility checked', 'Documents uploaded', 'School verified', 'Submitted to portal', 'Amount credited']

export function ScholarshipTracker() {
  const { state, mutate } = useStore()
  const toast = useToast()
  const [open, setOpen] = useState(null)
  const sc = open && state.scholarships.find((s) => s.id === open)
  return (
    <div className="space-y-2.5">
      {state.scholarships.map((s) => {
        const left = daysUntil(s.deadline)
        return (
          <Card key={s.id} onClick={() => setOpen(s.id)} className="p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[13.5px] font-semibold text-navy-800">{s.name}</div>
                <div className="text-[11px] text-slate-500">{s.by} · <b className="text-teal-700">{s.amount}</b></div>
              </div>
              <Badge color={s.step >= 4 ? 'green' : s.step === 0 ? 'slate' : 'sun'}>{s.step >= 4 ? 'Approved' : s.step === 0 ? 'Eligible' : 'In progress'}</Badge>
            </div>
            <Progress className="mt-2.5" value={(s.step / 4) * 100} h={6} color={s.step >= 4 ? '#10b981' : '#26a69a'} />
            <div className="mt-1.5 flex justify-between text-[11px] text-slate-500"><span>{s.status}</span><span className={left <= 10 && left >= 0 ? 'font-semibold text-coral-600' : ''}><CalendarClock className="mr-0.5 inline h-3 w-3" />{left >= 0 ? `${left} days left` : 'Closed'}</span></div>
          </Card>
        )
      })}
      <Sheet open={!!sc} onClose={() => setOpen(null)} title={sc?.name}
        footer={sc && sc.step < 4 && <Button className="w-full" variant="teal" onClick={() => { mutate((d) => { const x = d.scholarships.find((k) => k.id === sc.id); x.step = Math.min(4, x.step + 1); x.status = SCH_STEPS[x.step] + (x.step < 4 ? ' ✓' : '') }); toast('Progress updated — school helpdesk notified', '🎓') }}>{sc.step === 0 ? 'Start application' : sc.step === 1 ? 'Upload documents (camera)' : 'Mark next step done'}</Button>}>
        {sc && (
          <>
            <div className="rounded-xl bg-teal-50 p-3 text-sm text-teal-900"><b>{sc.amount}</b> · by {sc.by}<br /><span className="text-xs">Eligibility: {sc.eligibility}</span></div>
            <div className="mt-2 text-xs text-slate-500">Deadline: {fmtDate(sc.deadline, { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div className="mt-4"><Steps steps={SCH_STEPS} current={sc.step} /></div>
            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">📋 Needed: Aadhaar, income certificate (Village Office), bank passbook, previous mark list. The school scholarship helpdesk helps every Saturday 10 AM – 1 PM.</div>
          </>
        )}
      </Sheet>
    </div>
  )
}

export function KitTracker() {
  const { state } = useStore()
  return (
    <div className="space-y-2.5">
      {state.kits.map((k) => (
        <Card key={k.id} className="p-3.5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-sun-50"><Package className="h-5 w-5 text-sun-600" /></div>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-semibold text-navy-800">{k.name}</div>
              <div className="text-[11px] text-slate-500">Sponsored by {k.by}</div>
            </div>
            <Badge color={k.step >= 4 ? 'green' : 'sun'}>{k.status}</Badge>
          </div>
          <div className="mt-3 flex items-center gap-1">
            {k.steps.map((s, i) => <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= k.step ? 'bg-teal-500' : 'bg-slate-200'}`} title={s} />)}
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] text-slate-400"><span>{k.steps[0]}</span><span className="font-semibold text-slate-600">{k.eta}</span><span>{k.steps[4]}</span></div>
        </Card>
      ))}
    </div>
  )
}

export function SupportSection() {
  return (
    <div className="space-y-5">
      <div><SectionTitle>CSR & government scholarships</SectionTitle><ScholarshipTracker /></div>
      <div><SectionTitle>Book & stationery kits (doorstep delivery)</SectionTitle><KitTracker /></div>
    </div>
  )
}
