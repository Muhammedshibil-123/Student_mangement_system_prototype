import { Navigate, Route, Routes } from 'react-router-dom'
import { BarChart3, Bell, BookOpen, Bus, ClipboardCheck, FileCheck2, Gauge, GraduationCap, HandCoins, HandHeart, Home, LayoutDashboard, LifeBuoy, ListChecks, Map, Megaphone, MessageSquare, MessagesSquare, Rocket, School, Settings2, ShieldCheck, Siren, Truck, UserPlus, Users, Wallet } from 'lucide-react'
import { MobileShell } from './components/MobileShell'
import { DashShell } from './components/DashShell'
import { useSession, useStore } from './store/Store'
import Landing from './pages/Landing'
import Login from './pages/Login'
import FamilyGateway from './pages/FamilyGateway'
import StudentHome from './pages/student/Home'
import Learn from './pages/student/Learn'
import Tutor from './pages/student/Tutor'
import { ChatList, ChatThreadPage } from './pages/student/Chat'
import { CareerPath, CoinsStore, MoreMenu, SimplePage, TalentWall } from './pages/student/Extras'
import BusRadar from './features/BusRadar'
import NoticeBoard from './features/NoticeBoard'
import ExamCalendar from './features/ExamCalendar'
import Performance from './features/Performance'
import Wellbeing from './features/Wellbeing'
import HelpDesk from './features/HelpDesk'
import { SupportSection } from './features/Support'
import { ParentChat, ParentChild, ParentHome, ParentNotices, ParentSupport } from './pages/parent/Parent'
import { DriverChecklist, DriverStudents, DriverTrip } from './pages/driver/Driver'
import * as Teacher from './pages/teacher/Teacher'
import * as SchoolAdmin from './pages/school/School'
import * as Ngo from './pages/ngo/Ngo'
import * as Counselor from './pages/counselor/Counselor'
import * as Admin from './pages/admin/Admin'
import { translate } from './i18n'

function Guard({ role, children }) {
  const { session } = useSession()
  if (!session) return <Navigate to="/login" replace />
  if (role && session.role !== role) return <Navigate to={'/' + (session.role === 'school' ? 'school' : session.role)} replace />
  return children
}

const STUDENT_GUIDE = [
  { to: '/student', end: true, label: 'Student home', desc: 'Attendance, next class, bus, homework, coins' },
  { to: '/student/learn', label: 'Audio Learning Hub', desc: 'Multilingual audio pods, offline downloads' },
  { to: '/student/tutor', label: 'AI Tutor', desc: 'Age-adaptive answers (Class 4 vs Class 9)' },
  { to: '/student/bus', label: 'Bus Radar', desc: 'Live GPS, ETA, driver, SOS' },
  { to: '/student/chat', label: 'Secure teacher chat', desc: 'Masked numbers, safety filter, chat hours' },
  { to: '/student/exams', label: 'Exam calendar', desc: 'Verified timetable & countdown' },
  { to: '/student/wellbeing', label: 'Wellbeing', desc: 'Mood check-in, anonymous counselling' },
  { to: '/student/store', label: 'Vidya Coins store', desc: 'Earn coins, redeem school supplies' },
  { to: '/student/talent', label: 'Talent wall', desc: 'Art, poems & stories' },
  { to: '/student/career', label: 'Career path', desc: 'Gamified interest quiz & roadmap' },
  { to: '/student/help', label: 'Help desk', desc: 'Ask for guidance & track requests' },
]

const PARENT_GUIDE = [
  { to: '/parent', end: true, label: 'Parent home', desc: 'Voice summary, child switcher, today' },
  { to: '/parent/bus', label: 'Live Bus Radar', desc: 'ETA, 5-min alert, boarding, SOS' },
  { to: '/parent/notices', label: 'Notice board', desc: 'Verified school, govt & civic notices' },
  { to: '/parent/child', label: 'Child progress', desc: 'Marks graphs, attendance, remarks' },
  { to: '/parent/support', label: 'Community support', desc: 'Help desk, scholarships, CSR kits, privacy' },
  { to: '/parent/chat', label: 'Teacher chat', desc: 'Masked messaging + PTM call booking' },
]

const DRIVER_GUIDE = [
  { to: '/driver', end: true, label: 'Trip control', desc: 'Start/end trip, next stop, delay, SOS' },
  { to: '/driver/students', label: 'Boarding list', desc: 'Mark students on board → parents notified' },
  { to: '/driver/checklist', label: 'Safety checklist', desc: 'Pre-trip inspection & documents' },
]

function StudentMore() {
  return <MoreMenu items={[
    { to: '/student/exams', emoji: '📅', label: 'Exam calendar' }, { to: '/student/progress', emoji: '📈', label: 'My progress' }, { to: '/student/wellbeing', emoji: '💚', label: 'Wellbeing' },
    { to: '/student/store', emoji: '🪙', label: 'Coins & store' }, { to: '/student/talent', emoji: '🎨', label: 'Talent wall' }, { to: '/student/career', emoji: '🧭', label: 'Career path' },
    { to: '/student/help', emoji: '🙋', label: 'Help desk' }, { to: '/student/notices', emoji: '📢', label: 'Notices' }, { to: '/student/scholarships', emoji: '🎓', label: 'Scholarships' },
  ]} />
}

function StudentRoutes() {
  const { state } = useStore()
  const { user } = useSession()
  const L = (k) => translate(k, state.lang)
  return (
    <Routes>
      <Route element={<MobileShell roleLabel="Student" accent="#26a69a" guide={STUDENT_GUIDE} tabs={[{ to: '/student', end: true, icon: Home, label: 'home' }, { to: '/student/learn', icon: BookOpen, label: 'learn' }, { to: '/student/bus', icon: Bus, label: 'bus' }, { to: '/student/chat', icon: MessageSquare, label: 'chat' }, { to: '/student/more', icon: LayoutDashboard, label: 'more' }]} />}>
        <Route index element={<StudentHome />} />
        <Route path="learn" element={<Learn />} />
        <Route path="tutor" element={<Tutor />} />
        <Route path="bus" element={<BusRadar role="student" />} />
        <Route path="chat" element={<ChatList />} />
        <Route path="chat/:id" element={<ChatThreadPage />} />
        <Route path="more" element={<StudentMore />} />
        <Route path="exams" element={<SimplePage back="/student" title={L('examCalendar')}><ExamCalendar /></SimplePage>} />
        <Route path="progress" element={<SimplePage back="/student/more" title={L('progress')}><Performance studentId={user?.id} /></SimplePage>} />
        <Route path="wellbeing" element={<SimplePage back="/student" title={L('wellbeing')} sub="You are not alone 💚"><Wellbeing /></SimplePage>} />
        <Route path="store" element={<CoinsStore />} />
        <Route path="talent" element={<TalentWall />} />
        <Route path="career" element={<CareerPath />} />
        <Route path="help" element={<SimplePage back="/student" title={L('helpDesk')}><HelpDesk /></SimplePage>} />
        <Route path="notices" element={<SimplePage back="/student" title={L('notices')} sub="Verified only"><div className="-mx-4"><NoticeBoard /></div></SimplePage>} />
        <Route path="scholarships" element={<SimplePage back="/student/more" title={L('scholarships')}><SupportSection /></SimplePage>} />
      </Route>
    </Routes>
  )
}

function ParentRoutes() {
  return (
    <Routes>
      <Route element={<MobileShell roleLabel="Parent" accent="#2f6bbf" guide={PARENT_GUIDE} tabs={[{ to: '/parent', end: true, icon: Home, label: 'home' }, { to: '/parent/bus', icon: Bus, label: 'bus' }, { to: '/parent/notices', icon: Bell, label: 'notices' }, { to: '/parent/child', icon: GraduationCap, label: 'child' }, { to: '/parent/support', icon: LifeBuoy, label: 'support' }]} />}>
        <Route index element={<ParentHome />} />
        <Route path="bus" element={<BusRadar role="parent" />} />
        <Route path="notices" element={<ParentNotices />} />
        <Route path="child" element={<ParentChild />} />
        <Route path="support" element={<ParentSupport />} />
        <Route path="chat" element={<ParentChat />} />
        <Route path="more" element={<MoreMenu />} />
      </Route>
    </Routes>
  )
}

function DriverRoutes() {
  return (
    <Routes>
      <Route element={<MobileShell roleLabel="Bus driver" accent="#e9a21c" guide={DRIVER_GUIDE} tabs={[{ to: '/driver', end: true, icon: Map, label: 'trip' }, { to: '/driver/students', icon: Users, label: 'students' }, { to: '/driver/checklist', icon: ListChecks, label: 'more' }]} />}>
        <Route index element={<DriverTrip />} />
        <Route path="students" element={<DriverStudents />} />
        <Route path="checklist" element={<DriverChecklist />} />
      </Route>
    </Routes>
  )
}

function TeacherRoutes() {
  const { state } = useStore()
  const reqs = state.requests.filter((r) => r.assigned === 'Fathima Nasrin' && r.status !== 'Resolved').length
  const nav = [
    { to: '/teacher', end: true, label: 'Dashboard', icon: LayoutDashboard },
    { to: '/teacher/attendance', label: 'Attendance', icon: ClipboardCheck },
    { to: '/teacher/notices', label: 'Class notices', icon: Megaphone },
    { to: '/teacher/messages', label: 'Messages', icon: MessagesSquare },
    { to: '/teacher/gradebook', label: 'Gradebook', icon: BarChart3 },
    { to: '/teacher/requests', label: 'Help requests', icon: LifeBuoy, badge: reqs },
    { to: '/teacher/onboarding', label: 'Student onboarding', icon: UserPlus },
    { to: '/teacher/support', label: 'NGO nominations', icon: HandHeart },
  ]
  return (
    <Routes>
      <Route element={<DashShell nav={nav} roleLabel="Teacher workspace" />}>
        <Route index element={<Teacher.Dashboard />} />
        <Route path="attendance" element={<Teacher.Attendance />} />
        <Route path="notices" element={<Teacher.Notices />} />
        <Route path="messages" element={<Teacher.Messages />} />
        <Route path="gradebook" element={<Teacher.Gradebook />} />
        <Route path="requests" element={<Teacher.Requests />} />
        <Route path="onboarding" element={<Teacher.Onboarding />} />
        <Route path="support" element={<Teacher.Nominations />} />
      </Route>
    </Routes>
  )
}

function SchoolRoutes() {
  const { state } = useStore()
  const pending = state.notices.filter((n) => n.status === 'pending').length
  const sos = state.sos.filter((s) => s.status === 'Active').length
  const nav = [
    { to: '/school', end: true, label: 'Overview', icon: Gauge },
    { to: '/school/verify', label: 'Verify notices', icon: FileCheck2, badge: pending },
    { to: '/school/broadcast', label: 'Broadcast', icon: Megaphone },
    { to: '/school/transport', label: 'Transport & SOS', icon: Truck, badge: sos },
    { to: '/school/requests', label: 'Requests & safeguarding', icon: ShieldCheck },
    { to: '/school/sponsorship', label: 'NGO verification', icon: HandHeart },
    { to: '/school/users', label: 'Users & roles', icon: Users },
    { to: '/school/reports', label: 'Impact reports', icon: BarChart3 },
  ]
  return (
    <Routes>
      <Route element={<DashShell nav={nav} roleLabel="School admin" />}>
        <Route index element={<SchoolAdmin.Overview />} />
        <Route path="verify" element={<SchoolAdmin.Verify />} />
        <Route path="broadcast" element={<SchoolAdmin.Broadcast />} />
        <Route path="transport" element={<SchoolAdmin.Transport />} />
        <Route path="requests" element={<SchoolAdmin.Requests />} />
        <Route path="sponsorship" element={<SchoolAdmin.Sponsorship />} />
        <Route path="users" element={<SchoolAdmin.UsersRoles />} />
        <Route path="reports" element={<SchoolAdmin.Reports />} />
      </Route>
    </Routes>
  )
}

function NgoRoutes() {
  const nav = [
    { to: '/ngo', end: true, label: 'Impact overview', icon: Gauge },
    { to: '/ngo/students', label: 'Verified needs', icon: HandCoins },
    { to: '/ngo/projects', label: 'CSR projects', icon: Wallet },
    { to: '/ngo/deliveries', label: 'Kit deliveries', icon: Truck },
    { to: '/ngo/report', label: 'Impact report', icon: FileCheck2 },
  ]
  return (
    <Routes>
      <Route element={<DashShell nav={nav} roleLabel="NGO / CSR partner" orgLine="Nila Shiksha Foundation" />}>
        <Route index element={<Ngo.Overview />} />
        <Route path="students" element={<Ngo.Needs />} />
        <Route path="projects" element={<Ngo.Projects />} />
        <Route path="deliveries" element={<Ngo.Deliveries />} />
        <Route path="report" element={<Ngo.Report />} />
      </Route>
    </Routes>
  )
}

function CounselorRoutes() {
  const { state } = useStore()
  const nav = [
    { to: '/counselor', end: true, label: 'Anonymous inbox', icon: MessagesSquare, badge: state.counselQueries.filter((c) => c.status === 'New').length },
    { to: '/counselor/sessions', label: 'Sessions', icon: ClipboardCheck },
    { to: '/counselor/trends', label: 'Wellbeing trends', icon: BarChart3 },
  ]
  return (
    <Routes>
      <Route element={<DashShell nav={nav} roleLabel="Counsellor" />}>
        <Route index element={<Counselor.Inbox />} />
        <Route path="sessions" element={<Counselor.Sessions />} />
        <Route path="trends" element={<Counselor.Trends />} />
      </Route>
    </Routes>
  )
}

function AdminRoutes() {
  const nav = [
    { to: '/admin', end: true, label: 'Pilot command centre', icon: Gauge },
    { to: '/admin/schools', label: 'Schools', icon: School },
    { to: '/admin/exam-crisis', label: 'Exam crisis desk', icon: Siren },
    { to: '/admin/partners', label: 'Partners & revenue', icon: HandCoins },
    { to: '/admin/roadmap', label: 'Go-to-market', icon: Rocket },
    { to: '/admin/settings', label: 'Platform settings', icon: Settings2 },
  ]
  return (
    <Routes>
      <Route element={<DashShell nav={nav} roleLabel="Platform admin" orgLine="Vidya Sethu · Malappuram pilot" />}>
        <Route index element={<Admin.Command />} />
        <Route path="schools" element={<Admin.Schools />} />
        <Route path="exam-crisis" element={<Admin.ExamCrisis />} />
        <Route path="partners" element={<Admin.Partners />} />
        <Route path="roadmap" element={<Admin.Roadmap />} />
        <Route path="settings" element={<Admin.Settings />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/family" element={<FamilyGateway />} />
      <Route path="/student/*" element={<Guard role="student"><StudentRoutes /></Guard>} />
      <Route path="/parent/*" element={<Guard role="parent"><ParentRoutes /></Guard>} />
      <Route path="/driver/*" element={<Guard role="driver"><DriverRoutes /></Guard>} />
      <Route path="/teacher/*" element={<Guard role="teacher"><TeacherRoutes /></Guard>} />
      <Route path="/school/*" element={<Guard role="school"><SchoolRoutes /></Guard>} />
      <Route path="/ngo/*" element={<Guard role="ngo"><NgoRoutes /></Guard>} />
      <Route path="/counselor/*" element={<Guard role="counselor"><CounselorRoutes /></Guard>} />
      <Route path="/admin/*" element={<Guard role="admin"><AdminRoutes /></Guard>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
