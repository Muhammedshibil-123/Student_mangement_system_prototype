import { Navigate, Route, Routes } from 'react-router-dom'
import { BarChart3, Bell, BookOpen, Bus, CalendarDays, ClipboardCheck, Compass, FileCheck2, Gauge, GraduationCap, HandCoins, HandHeart, HeartHandshake, Home, LayoutDashboard, LifeBuoy, ListChecks, Map, Megaphone, MessageSquare, MessagesSquare, Palette, Rocket, School, Settings2, ShieldCheck, ShoppingBag, Siren, TrendingUp, Truck, UserPlus, Users, Wallet } from 'lucide-react'
import { MobileShell } from './components/MobileShell'
import { DashShell } from './components/DashShell'
import { useSession, useStore } from './store/Store'
import Login from './pages/Login'
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
  if (role && session.role !== role) return <Navigate to={HOME[session.role]} replace />
  return children
}

function StudentMore() {
  return <MoreMenu items={[
    { to: '/student/exams', icon: CalendarDays, tint: 'bg-coral-50 text-coral-500', label: 'Exam calendar' }, { to: '/student/progress', icon: TrendingUp, tint: 'bg-teal-50 text-teal-600', label: 'My progress' }, { to: '/student/wellbeing', icon: HeartHandshake, tint: 'bg-violet-50 text-violet-600', label: 'Wellbeing' },
    { to: '/student/store', icon: ShoppingBag, tint: 'bg-sun-50 text-sun-600', label: 'Coins & store' }, { to: '/student/talent', icon: Palette, tint: 'bg-coral-50 text-coral-600', label: 'Talent wall' }, { to: '/student/career', icon: Compass, tint: 'bg-sky-50 text-sky-600', label: 'Career path' },
    { to: '/student/help', icon: LifeBuoy, tint: 'bg-teal-50 text-teal-600', label: 'Help desk' }, { to: '/student/notices', icon: Megaphone, tint: 'bg-sky-50 text-sky-600', label: 'Notices' }, { to: '/student/scholarships', icon: GraduationCap, tint: 'bg-sun-50 text-sun-700', label: 'Scholarships' },
  ]} />
}

function StudentRoutes() {
  const { state } = useStore()
  const { user } = useSession()
  const L = (k) => translate(k, state.lang)
  return (
    <Routes>
      <Route element={<MobileShell tabs={[{ to: '/student', end: true, icon: Home, label: 'home' }, { to: '/student/learn', icon: BookOpen, label: 'learn' }, { to: '/student/bus', icon: Bus, label: 'bus' }, { to: '/student/chat', icon: MessageSquare, label: 'chat' }, { to: '/student/more', icon: LayoutDashboard, label: 'more' }]} />}>
        <Route index element={<StudentHome />} />
        <Route path="learn" element={<Learn />} />
        <Route path="tutor" element={<Tutor />} />
        <Route path="bus" element={<BusRadar role="student" />} />
        <Route path="chat" element={<ChatList />} />
        <Route path="chat/:id" element={<ChatThreadPage />} />
        <Route path="more" element={<StudentMore />} />
        <Route path="exams" element={<SimplePage back="/student" title={L('examCalendar')}><ExamCalendar /></SimplePage>} />
        <Route path="progress" element={<SimplePage back="/student/more" title={L('progress')}><Performance studentId={user?.id} /></SimplePage>} />
        <Route path="wellbeing" element={<SimplePage back="/student" title={L('wellbeing')} sub="Support for how you feel"><Wellbeing /></SimplePage>} />
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
      <Route element={<MobileShell tabs={[{ to: '/parent', end: true, icon: Home, label: 'home' }, { to: '/parent/bus', icon: Bus, label: 'bus' }, { to: '/parent/notices', icon: Bell, label: 'notices' }, { to: '/parent/child', icon: GraduationCap, label: 'child' }, { to: '/parent/support', icon: LifeBuoy, label: 'support' }]} />}>
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
      <Route element={<MobileShell tabs={[{ to: '/driver', end: true, icon: Map, label: 'trip' }, { to: '/driver/students', icon: Users, label: 'students' }, { to: '/driver/checklist', icon: ListChecks, label: 'more' }]} />}>
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
    { to: '/teacher', end: true, label: 'Dashboard', short: 'Today', icon: LayoutDashboard },
    { to: '/teacher/attendance', label: 'Attendance', icon: ClipboardCheck },
    { to: '/teacher/messages', label: 'Messages', icon: MessagesSquare },
    { to: '/teacher/notices', label: 'Class notices', short: 'Notices', icon: Megaphone },
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
    { to: '/school/verify', label: 'Verify notices', short: 'Verify', icon: FileCheck2, badge: pending },
    { to: '/school/transport', label: 'Transport & SOS', short: 'Transport', icon: Truck, badge: sos },
    { to: '/school/requests', label: 'Requests & safeguarding', short: 'Requests', icon: ShieldCheck },
    { to: '/school/broadcast', label: 'Broadcast', icon: Megaphone },
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
    { to: '/ngo', end: true, label: 'Impact overview', short: 'Impact', icon: Gauge },
    { to: '/ngo/students', label: 'Verified needs', short: 'Needs', icon: HandCoins },
    { to: '/ngo/projects', label: 'CSR projects', short: 'Projects', icon: Wallet },
    { to: '/ngo/deliveries', label: 'Kit deliveries', short: 'Deliveries', icon: Truck },
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
    { to: '/counselor', end: true, label: 'Anonymous inbox', short: 'Inbox', icon: MessagesSquare, badge: state.counselQueries.filter((c) => c.status === 'New').length },
    { to: '/counselor/sessions', label: 'Sessions', icon: ClipboardCheck },
    { to: '/counselor/trends', label: 'Wellbeing trends', short: 'Trends', icon: BarChart3 },
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
    { to: '/admin', end: true, label: 'District overview', short: 'Overview', icon: Gauge },
    { to: '/admin/schools', label: 'Schools', icon: School },
    { to: '/admin/exam-crisis', label: 'Exam crisis desk', short: 'Exam desk', icon: Siren },
    { to: '/admin/partners', label: 'Partners & revenue', short: 'Partners', icon: HandCoins },
    { to: '/admin/roadmap', label: 'Roadmap', icon: Rocket },
    { to: '/admin/settings', label: 'Settings', icon: Settings2 },
  ]
  return (
    <Routes>
      <Route element={<DashShell nav={nav} roleLabel="District admin" orgLine="Malappuram district" />}>
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

const HOME = { student: '/student', parent: '/parent', driver: '/driver', teacher: '/teacher', school: '/school', ngo: '/ngo', counselor: '/counselor', admin: '/admin' }

// Opening the app goes to the signed-in home screen, or to sign-in
function Entry() {
  const { session } = useSession()
  return <Navigate to={session ? HOME[session.role] : '/login'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Entry />} />
      <Route path="/login" element={<Login />} />
      <Route path="/family" element={<Login mode="family" />} />
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
