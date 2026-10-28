import { Bar, BarChart, CartesianGrid, Line, LineChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge, Card, Progress, SectionTitle } from '../components/ui'
import { ASSIGNMENTS, ATTENDANCE_HISTORY, MARKS, SKILLS_RADAR } from '../data/seed'
import { useStore } from '../store/Store'
import { cx, todayKey } from '../lib/utils'

const SUBJ_COLORS = { Mathematics: '#26a69a', Physics: '#2f6bbf', English: '#ec7563', Malayalam: '#f6b93b', 'Social Sci.': '#8b5cf6' }

export function useAttendance(studentId) {
  const { state } = useStore()
  const today = state.attendance[todayKey()]
  // Ananya is roll 14 → s14 in class register
  const todayMark = studentId === 'ananya' ? today?.marks?.s14 : studentId === 'aarav' ? (today ? 'P' : undefined) : undefined
  const hist = ATTENDANCE_HISTORY.concat(todayMark ? [{ date: todayKey(), s: todayMark }] : [])
  const working = hist.filter((h) => h.s !== 'H')
  const present = working.filter((h) => h.s === 'P' || h.s === 'L').length
  return { hist, todayMark, pct: Math.round((present / working.length) * 100), submittedAt: today?.submittedAt, present, total: working.length }
}

export function AttendanceHeatmap({ studentId }) {
  const { hist, pct, present, total } = useAttendance(studentId)
  const color = { P: 'bg-teal-500', A: 'bg-coral-500', L: 'bg-sun-400', H: 'bg-slate-200' }
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <SectionTitle className="!mb-0">Attendance</SectionTitle>
        <div className="text-right"><span className="font-display text-xl font-extrabold text-navy-800">{pct}%</span><div className="text-[10px] text-slate-500">{present}/{total} days</div></div>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {hist.slice(-35).map((h) => <div key={h.date} title={`${h.date}: ${h.s}`} className={cx('aspect-square rounded-md', color[h.s])} />)}
      </div>
      <div className="mt-2 flex gap-3 text-[10px] text-slate-500">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-teal-500" />Present</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-coral-500" />Absent</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-sun-400" />Late</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-slate-200" />Holiday</span>
      </div>
    </Card>
  )
}

export default function Performance({ studentId = 'ananya' }) {
  if (studentId === 'aarav') return <JuniorProgress />
  const data = MARKS.ananya
  const latest = data[data.length - 1]
  const subjects = Object.keys(SUBJ_COLORS)
  const avg = Math.round(subjects.reduce((a, s) => a + latest[s], 0) / subjects.length)
  const prev = data[data.length - 2]
  const prevAvg = Math.round(subjects.reduce((a, s) => a + prev[s], 0) / subjects.length)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 text-center"><div className="text-[10px] font-semibold text-slate-500">Average</div><div className="font-display text-xl font-extrabold text-navy-800">{avg}%</div><div className="text-[10px] font-semibold text-emerald-600">▲ {avg - prevAvg} pts</div></Card>
        <Card className="p-3 text-center"><div className="text-[10px] font-semibold text-slate-500">Class rank</div><div className="font-display text-xl font-extrabold text-navy-800">6<span className="text-xs text-slate-400">/34</span></div><div className="text-[10px] font-semibold text-emerald-600">▲ 3 places</div></Card>
        <Card className="p-3 text-center"><div className="text-[10px] font-semibold text-slate-500">Best subject</div><div className="font-display text-sm font-extrabold leading-7 text-navy-800">Malayalam</div><div className="text-[10px] font-semibold text-slate-500">91%</div></Card>
      </div>

      <Card className="p-4">
        <SectionTitle>Marks trend</SectionTitle>
        <div className="h-48">
          <ResponsiveContainer>
            <LineChart data={data} margin={{ left: -24, right: 6, top: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="exam" tick={{ fontSize: 10 }} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              {subjects.map((s) => <Line key={s} dataKey={s} stroke={SUBJ_COLORS[s]} strokeWidth={2.5} dot={{ r: 3 }} />)}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">{subjects.map((s) => <span key={s} className="flex items-center gap-1 text-[10px] text-slate-500"><span className="h-2 w-2 rounded-full" style={{ background: SUBJ_COLORS[s] }} />{s}</span>)}</div>
        <div className="mt-2 text-[10px] text-slate-400">* Unit 3 marks entered by teachers this week</div>
      </Card>

      <Card className="p-4">
        <SectionTitle>Latest: Unit test 3</SectionTitle>
        <div className="h-40">
          <ResponsiveContainer>
            <BarChart data={subjects.map((s) => ({ s: s.replace('Mathematics', 'Maths'), v: latest[s], c: SUBJ_COLORS[s] }))} margin={{ left: -24, right: 6 }}>
              <XAxis dataKey="s" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="v" radius={[6, 6, 0, 0]} fill="#26a69a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        <Card className="p-4">
          <SectionTitle>Skills snapshot</SectionTitle>
          <div className="h-52">
            <ResponsiveContainer>
              <RadarChart data={SKILLS_RADAR} outerRadius="72%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 9, fill: '#475569' }} />
                <Radar dataKey="v" stroke="#2f6bbf" fill="#2f6bbf" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4">
          <SectionTitle>Assignments & seminars</SectionTitle>
          <div className="space-y-3">
            {ASSIGNMENTS.map((a) => (
              <div key={a.name}>
                <div className="mb-1 flex justify-between text-xs"><span className="font-semibold text-navy-800">{a.name}</span><span className="text-slate-500">{a.submitted}/{a.total}</span></div>
                <Progress value={(a.submitted / a.total) * 100} />
              </div>
            ))}
          </div>
        </Card>
      </div>
      <AttendanceHeatmap studentId={studentId} />
      <Card className="p-4">
        <SectionTitle>Teacher remarks</SectionTitle>
        <div className="space-y-2.5 text-[13px]">
          <div className="rounded-xl bg-slate-50 p-3"><b className="text-navy-800">Fathima N. (Maths):</b> <span className="text-slate-600">Big improvement since 1st term. Practise word problems daily for 20 minutes.</span></div>
          <div className="rounded-xl bg-slate-50 p-3"><b className="text-navy-800">Deepa M. (English):</b> <span className="text-slate-600">Creative writer! Her diary entry was read out in class.</span></div>
        </div>
      </Card>
    </div>
  )
}

function JuniorProgress() {
  const grades = [['Maths', 'A', 86, '🔢'], ['EVS', 'A+', 94, '🌱'], ['English', 'B+', 74, '🔤'], ['Malayalam', 'A', 88, '📖'], ['Art & Craft', 'A+', 96, '🎨'], ['Health & PE', 'A', 90, '⚽']]
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-sun-300 to-sun-400 p-4 ring-0">
        <div className="text-sm font-semibold text-navy-800">Term 1 report card · Class 4 uses grades, not marks</div>
        <div className="mt-1 font-display text-3xl font-extrabold text-navy-900">⭐ Overall A</div>
      </Card>
      <div className="grid grid-cols-2 gap-2">
        {grades.map(([s, g, v, e]) => (
          <Card key={s} className="p-3">
            <div className="flex items-center justify-between"><span className="text-2xl">{e}</span><Badge color={g.includes('+') ? 'green' : 'teal'}>{g}</Badge></div>
            <div className="mt-1 text-sm font-semibold text-navy-800">{s}</div>
            <Progress className="mt-2" value={v} h={6} color="#f6b93b" />
          </Card>
        ))}
      </div>
      <AttendanceHeatmap studentId="aarav" />
      <Card className="p-4 text-[13px] text-slate-600"><b className="text-navy-800">Class teacher (Smitha K.):</b> Aarav is curious and loves EVS experiments. Encourage reading 10 minutes of English story books every day.</Card>
    </div>
  )
}
