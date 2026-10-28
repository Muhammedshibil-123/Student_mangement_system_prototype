// All data in this prototype is fictional demo data.
import { daysFromNow, hoursAgo } from '../lib/utils'

export const DEMO_PASSWORD = '1234'

export const SCHOOL = {
  name: 'Vidyanagar Govt. Higher Secondary School',
  short: 'Vidyanagar GHSS',
  place: 'Valanchery, Malappuram',
  code: 'KL-MLP-19042',
  district: 'Malappuram',
  type: 'Government',
  students: 1184,
  teachers: 46,
}

// ---------- People ----------
export const USERS = {
  ananya: { id: 'ananya', role: 'student', name: 'Ananya Rajesh', short: 'Ananya', className: '9-B', grade: 9, roll: 14, age: 14, avatar: '👧🏽', color: '#26a69a', parentId: 'rajesh', house: 'Nila House' },
  aarav: { id: 'aarav', role: 'student', name: 'Aarav Rajesh', short: 'Aarav', className: '4-A', grade: 4, roll: 7, age: 9, avatar: '👦🏽', color: '#f6b93b', parentId: 'rajesh', house: 'Kadalundi House' },
  rajesh: { id: 'rajesh', role: 'parent', name: 'Rajesh Kumar', short: 'Rajesh', relation: 'Father', phone: '9847012345', avatar: '👨🏽', color: '#2f6bbf', children: ['ananya', 'aarav'], occupation: 'Auto-rickshaw driver' },
  sreeja: { id: 'sreeja', role: 'parent', name: 'Sreeja Rajesh', short: 'Sreeja', relation: 'Mother', phone: '9746054321', avatar: '👩🏽', color: '#ec7563', children: ['ananya', 'aarav'], occupation: 'Kudumbashree unit member' },
  fathima: { id: 'fathima', role: 'teacher', name: 'Fathima Nasrin', short: 'Fathima', subject: 'Mathematics', classTeacherOf: '9-B', avatar: '👩🏽‍🏫', color: '#26a69a' },
  principal: { id: 'principal', role: 'school', name: 'Dr. Mini Thomas', short: 'Dr. Mini', title: 'Principal', avatar: '👩🏽‍💼', color: '#14253f' },
  shaji: { id: 'shaji', role: 'driver', name: 'Shaji Varghese', short: 'Shaji', phone: '9895067812', license: 'KL10 2011 0045821', exp: '14 yrs', avatar: '👨🏽‍✈️', color: '#f6b93b' },
  ngo: { id: 'ngo', role: 'ngo', name: 'Nila Shiksha Foundation', short: 'KSF', contact: 'Arun Das', title: 'Programme Lead', avatar: '🤝', color: '#ec7563', csr1: 'CSR00012345' },
  counselor: { id: 'counselor', role: 'counselor', name: 'Dr. Lakshmi Prabha', short: 'Dr. Lakshmi', title: 'School Counsellor (M.Phil Clinical Psy.)', avatar: '🧑🏽‍⚕️', color: '#8b5cf6' },
  admin: { id: 'admin', role: 'admin', name: 'Programme Admin', short: 'Admin', title: 'Vidya Sethu Pilot Team', avatar: '🛰️', color: '#14253f' },
}

export const LOGINS = [
  { role: 'student', username: 'ananya', label: 'Student', hint: 'Ananya · Class 9-B', home: '/student' },
  { role: 'student', username: 'aarav', label: 'Student (Class 4)', hint: 'Aarav · Class 4-A', home: '/student' },
  { role: 'parent', username: 'rajesh', label: 'Parent', hint: 'Rajesh · father of 2', home: '/parent' },
  { role: 'teacher', username: 'fathima', label: 'Teacher', hint: 'Fathima · Class teacher 9-B', home: '/teacher' },
  { role: 'school', username: 'principal', label: 'School Admin', hint: 'Dr. Mini Thomas · Principal', home: '/school' },
  { role: 'driver', username: 'shaji', label: 'Bus Driver', hint: 'Shaji · Route 3', home: '/driver' },
  { role: 'ngo', username: 'ngo', label: 'NGO / CSR Partner', hint: 'Nila Shiksha Foundation', home: '/ngo' },
  { role: 'counselor', username: 'counselor', label: 'Counsellor', hint: 'Dr. Lakshmi Prabha', home: '/counselor' },
  { role: 'admin', username: 'admin', label: 'Platform Admin', hint: 'District pilot command centre', home: '/admin' },
]

export const FAMILY_PROFILES = ['rajesh', 'sreeja', 'ananya', 'aarav']

export const TEACHERS = [
  { id: 'fathima', name: 'Fathima Nasrin', subject: 'Mathematics', role: 'Class Teacher · 9-B', avatar: '👩🏽‍🏫', window: '4:00 PM – 7:00 PM', online: true },
  { id: 't-anil', name: 'Anil Kumar P.', subject: 'Physics & Chemistry', role: 'Science', avatar: '👨🏽‍🔬', window: '5:00 PM – 6:30 PM', online: false },
  { id: 't-deepa', name: 'Deepa Menon', subject: 'English', role: 'English', avatar: '👩🏽‍💼', window: '4:30 PM – 6:00 PM', online: true },
  { id: 't-rahman', name: 'Abdul Rahman K.', subject: 'Malayalam', role: 'Malayalam', avatar: '👨🏽‍🏫', window: '4:00 PM – 5:30 PM', online: false },
  { id: 't-priya', name: 'Priya Nair', subject: 'Social Science', role: 'Social Science', avatar: '👩🏽', window: '6:00 PM – 7:30 PM', online: false },
]

export const CLASS_9B = [
  ['Aadil Muhammed', 'M'], ['Abhinav S.', 'M'], ['Afna Sherin', 'F'], ['Akhil Krishna', 'M'], ['Aleena Joseph', 'F'],
  ['Amal Dev', 'M'], ['Amina Thasni', 'F'], ['Anagha P.', 'F'], ['Anandu V.', 'M'], ['Anjali Suresh', 'F'],
  ['Ansar Ali', 'M'], ['Anu Mol', 'F'], ['Anaswara K.', 'F'], ['Ananya Rajesh', 'F'], ['Arjun Das', 'M'],
  ['Asna Fathima', 'F'], ['Athira Mohan', 'F'], ['Basil Eldho', 'M'], ['Devananda', 'F'], ['Fidha Nasrin', 'F'],
  ['Gokul Raj', 'M'], ['Hiba Fathima', 'F'], ['Irfan K.', 'M'], ['Jishnu Prasad', 'M'], ['Keerthana R.', 'F'],
  ['Midhun Lal', 'M'], ['Muhammed Shamil', 'M'], ['Nandana S.', 'F'], ['Nihal Ahammed', 'M'], ['Riya Rose', 'F'],
  ['Rohan Thomas', 'M'], ['Sanjay Kumar (from Bihar)', 'M'], ['Shifa Mol', 'F'], ['Vishnu Narayanan', 'M'],
].map(([name, g], i) => ({ id: 's' + (i + 1), roll: i + 1, name, gender: g, guardianApp: i % 7 !== 3, bus: i % 3 === 0 ? 'Route 3' : i % 3 === 1 ? 'Route 1' : 'Walks' }))

// ---------- Timetable & class updates ----------
export const TIMETABLE = [
  { time: '9:30', end: '10:15', subject: 'Mathematics', teacher: 'Fathima N.', topic: 'Quadratic equations – discriminant', room: '9-B' },
  { time: '10:15', end: '11:00', subject: 'English', teacher: 'Deepa M.', topic: 'Poem: “The Road Not Taken”', room: '9-B' },
  { time: '11:15', end: '12:00', subject: 'Physics', teacher: 'Anil K.', topic: 'Laws of motion – momentum', room: 'Lab 2' },
  { time: '1:30', end: '2:15', subject: 'Malayalam', teacher: 'Abdul Rahman', topic: 'കേശവന്റെ വിലാപങ്ങൾ – പാഠം 4', room: '9-B' },
  { time: '2:15', end: '3:00', subject: 'Social Science', teacher: 'Priya N.', topic: 'Kerala renaissance leaders', room: '9-B' },
  { time: '3:00', end: '3:45', subject: 'IT (KITE)', teacher: 'Anil K.', topic: 'Python – loops', room: 'IT Lab' },
]

export const TIMETABLE_4A = [
  { time: '9:30', end: '10:15', subject: 'EVS', teacher: 'Smitha K.', topic: 'The water cycle – where rain comes from', room: '4-A' },
  { time: '10:15', end: '11:00', subject: 'Maths', teacher: 'Smitha K.', topic: 'Fractions – halves & quarters', room: '4-A' },
  { time: '11:15', end: '12:00', subject: 'English', teacher: 'Deepa M.', topic: 'Story: The Thirsty Crow', room: '4-A' },
  { time: '1:30', end: '2:15', subject: 'Malayalam', teacher: 'Abdul Rahman', topic: 'കുട്ടിക്കവിതകൾ', room: '4-A' },
  { time: '2:15', end: '3:00', subject: 'Art & Craft', teacher: 'Smitha K.', topic: 'Paper boats 🚤', room: '4-A' },
]

export const HOMEWORK = [
  { id: 'hw1', subject: 'Mathematics', title: 'Exercise 4.3 – Q1 to Q8', due: daysFromNow(1), done: false, coins: 10 },
  { id: 'hw2', subject: 'English', title: 'Write a 150-word diary entry', due: daysFromNow(2), done: true, coins: 10 },
  { id: 'hw3', subject: 'Physics', title: 'Lab record – Newton’s 2nd law', due: daysFromNow(3), done: false, coins: 15 },
]

// ---------- Notices ----------
export const NOTICES = [
  {
    id: 'n1', source: 'school', category: 'Exam', status: 'verified', urgent: true, pinned: true,
    title: 'Second Terminal Exam timetable published',
    titleMl: 'രണ്ടാം പാദവാർഷിക പരീക്ഷാ ടൈംടേബിൾ പ്രസിദ്ധീകരിച്ചു',
    body: 'Second terminal examinations for Classes 5–10 begin on 10 December. Students must report by 9:15 AM. Hall tickets will be issued by class teachers on 5 December. Download the full timetable below.',
    bodyMl: 'ക്ലാസ് 5 മുതൽ 10 വരെയുള്ള രണ്ടാം പാദവാർഷിക പരീക്ഷകൾ ഡിസംബർ 10-ന് ആരംഭിക്കും. വിദ്യാർത്ഥികൾ രാവിലെ 9:15-ന് മുമ്പ് എത്തണം. ഹാൾ ടിക്കറ്റുകൾ ഡിസംബർ 5-ന് ക്ലാസ് ടീച്ചർമാർ വിതരണം ചെയ്യും.',
    author: 'Dr. Mini Thomas', authorRole: 'Principal', at: hoursAgo(3), audience: 'Classes 5–10', reach: 1043, reads: 812, attachment: 'Timetable_2nd_Term.pdf',
  },
  {
    id: 'n2', source: 'school', category: 'Transport', status: 'verified', urgent: false,
    title: 'Route 3 bus timing change from Monday',
    titleMl: 'റൂട്ട് 3 ബസ് സമയത്തിൽ തിങ്കളാഴ്ച മുതൽ മാറ്റം',
    body: 'Due to road work near Athavanad junction, Route 3 morning pickup will start 10 minutes earlier (7:50 AM from Edayur). Track the bus live on Vidya Sethu.',
    bodyMl: 'ആതവനാട് ജംഗ്ഷനിലെ റോഡ് പണി കാരണം റൂട്ട് 3 ബസ് രാവിലെ 10 മിനിറ്റ് നേരത്തെ (എടയൂരിൽ നിന്ന് 7:50-ന്) പുറപ്പെടും.',
    author: 'Transport Cell', authorRole: 'School Office', at: hoursAgo(20), audience: 'Route 3 families', reach: 86, reads: 79,
  },
  {
    id: 'n3', source: 'govt', category: 'Scholarship', status: 'verified', urgent: true,
    title: 'Pre-Matric Scholarship 2026-27: apply before deadline',
    titleMl: 'പ്രീ-മെട്രിക് സ്കോളർഷിപ്പ് 2026-27: അവസാന തീയതിക്ക് മുമ്പ് അപേക്ഷിക്കുക',
    body: 'Students of Classes 1–10 from eligible families can apply for the Pre-Matric Scholarship through the National Scholarship Portal. Required: Aadhaar, income certificate, bank passbook. The school helpdesk will assist on Saturdays 10 AM – 1 PM.',
    bodyMl: 'യോഗ്യരായ കുടുംബങ്ങളിലെ 1 മുതൽ 10 വരെ ക്ലാസുകളിലെ വിദ്യാർത്ഥികൾക്ക് നാഷണൽ സ്കോളർഷിപ്പ് പോർട്ടൽ വഴി അപേക്ഷിക്കാം. ആധാർ, വരുമാന സർട്ടിഫിക്കറ്റ്, ബാങ്ക് പാസ്ബുക്ക് ആവശ്യമാണ്.',
    author: 'General Education Dept.', authorRole: 'Govt. of Kerala (relayed)', at: hoursAgo(30), audience: 'All families', reach: 1184, reads: 640,
  },
  {
    id: 'n4', source: 'civic', category: 'Rights', status: 'verified',
    title: 'Know your rights: free textbooks & uniforms under RTE',
    titleMl: 'നിങ്ങളുടെ അവകാശങ്ങൾ അറിയുക: RTE പ്രകാരം സൗജന്യ പാഠപുസ്തകങ്ങളും യൂണിഫോമും',
    body: 'Under the Right to Education Act, students up to Class 8 in government and aided schools are entitled to free textbooks and uniforms. If your child has not received them, raise a request in the Help Desk and our team will follow up with the school.',
    bodyMl: 'വിദ്യാഭ്യാസ അവകാശ നിയമപ്രകാരം സർക്കാർ/എയ്ഡഡ് സ്കൂളുകളിലെ 8-ാം ക്ലാസ് വരെയുള്ള വിദ്യാർത്ഥികൾക്ക് സൗജന്യ പാഠപുസ്തകങ്ങൾക്കും യൂണിഫോമിനും അർഹതയുണ്ട്.',
    author: 'Vidya Sethu Rights Desk', authorRole: 'Community partner', at: hoursAgo(52), audience: 'All families', reach: 1184, reads: 402,
  },
  {
    id: 'n5', source: 'community', category: 'Health', status: 'verified',
    title: 'Free eye-check camp at school – Saturday',
    titleMl: 'സൗജന്യ നേത്ര പരിശോധനാ ക്യാമ്പ് – ശനിയാഴ്ച',
    body: 'Nila Shiksha Foundation with the PHC Valanchery is conducting a free eye-check camp in the school auditorium on Saturday 9 AM – 1 PM. Spectacles will be provided free for students who need them.',
    bodyMl: 'കേരള ശിക്ഷാ ഫൗണ്ടേഷനും വളാഞ്ചേരി PHC-യും ചേർന്ന് ശനിയാഴ്ച രാവിലെ 9 മുതൽ 1 വരെ സ്കൂൾ ഓഡിറ്റോറിയത്തിൽ സൗജന്യ നേത്ര പരിശോധനാ ക്യാമ്പ് നടത്തുന്നു.',
    author: 'Nila Shiksha Foundation', authorRole: 'NGO partner', at: hoursAgo(70), audience: 'All students', reach: 1184, reads: 515,
  },
  {
    id: 'n6', source: 'school', category: 'Event', status: 'verified',
    title: 'Parent–Teacher Meeting for Class 9 on Friday',
    titleMl: 'ക്ലാസ് 9 രക്ഷാകർതൃ യോഗം വെള്ളിയാഴ്ച',
    body: 'PTM for all Class 9 divisions on Friday at 2:30 PM in respective classrooms. First terminal answer sheets and progress cards will be shared. Parents who cannot attend may book a call slot in the app.',
    bodyMl: 'എല്ലാ 9-ാം ക്ലാസ് ഡിവിഷനുകളുടെയും PTA യോഗം വെള്ളിയാഴ്ച ഉച്ചയ്ക്ക് 2:30-ന് അതത് ക്ലാസ് മുറികളിൽ.',
    author: 'Fathima Nasrin', authorRole: 'Class Teacher 9-B', at: hoursAgo(96), audience: 'Class 9 parents', reach: 182, reads: 151,
  },
  {
    id: 'n7', source: 'school', category: 'Holiday', status: 'pending',
    title: 'School closed on account of local festival (Nercha)',
    titleMl: 'പ്രാദേശിക നേർച്ച പ്രമാണിച്ച് സ്കൂളിന് അവധി',
    body: 'The school will remain closed next Tuesday on account of the local Nercha festival as per DDE order. Classes will be compensated on the following Saturday.',
    bodyMl: 'DDE ഉത്തരവ് പ്രകാരം പ്രാദേശിക നേർച്ച പ്രമാണിച്ച് അടുത്ത ചൊവ്വാഴ്ച സ്കൂളിന് അവധിയായിരിക്കും.',
    author: 'School Office', authorRole: 'Clerk', at: hoursAgo(1), audience: 'All families', reach: 0, reads: 0,
  },
  {
    id: 'n8', source: 'community', category: 'Opportunity', status: 'pending',
    title: 'Weekend coding club for girls – Classes 8 to 10',
    titleMl: 'പെൺകുട്ടികൾക്കായി വാരാന്ത്യ കോഡിങ് ക്ലബ്',
    body: 'A free 8-week Scratch & Python club every Saturday at the panchayat library, supported by BrightFuture CSR. 30 seats. Laptops provided.',
    bodyMl: 'പഞ്ചായത്ത് ലൈബ്രറിയിൽ എല്ലാ ശനിയാഴ്ചയും 8 ആഴ്ചത്തെ സൗജന്യ Scratch & Python ക്ലബ്.',
    author: 'BrightFuture CSR', authorRole: 'CSR partner', at: hoursAgo(5), audience: 'Girls, Classes 8–10', reach: 0, reads: 0,
  },
]

// ---------- Exams ----------
export const EXAMS = [
  { id: 'e1', date: daysFromNow(43), subject: 'Malayalam I', time: '9:30 AM – 12:15 PM', type: 'Terminal' },
  { id: 'e2', date: daysFromNow(44), subject: 'English', time: '9:30 AM – 12:15 PM', type: 'Terminal' },
  { id: 'e3', date: daysFromNow(46), subject: 'Mathematics', time: '9:30 AM – 12:15 PM', type: 'Terminal' },
  { id: 'e4', date: daysFromNow(47), subject: 'Physics', time: '9:30 AM – 11:15 AM', type: 'Terminal' },
  { id: 'e5', date: daysFromNow(48), subject: 'Social Science', time: '9:30 AM – 12:15 PM', type: 'Terminal' },
  { id: 'e6', date: daysFromNow(6), subject: 'Mathematics – Unit Test 3', time: '10:15 AM – 11:00 AM', type: 'Unit test' },
  { id: 'e7', date: daysFromNow(13), subject: 'Physics – Practical', time: '2:15 PM – 3:45 PM', type: 'Practical' },
]

export const CALENDAR_EVENTS = [
  { date: daysFromNow(2), title: 'Class 9 PTM', kind: 'meeting' },
  { date: daysFromNow(3), title: 'Free eye-check camp', kind: 'community' },
  { date: daysFromNow(6), title: 'Maths unit test', kind: 'exam' },
  { date: daysFromNow(7), title: 'Holiday – Nercha', kind: 'holiday' },
  { date: daysFromNow(13), title: 'Physics practical', kind: 'exam' },
  { date: daysFromNow(20), title: 'School Kalolsavam', kind: 'event' },
  { date: daysFromNow(38), title: 'Hall tickets issued', kind: 'exam' },
  { date: daysFromNow(43), title: '2nd Terminal begins', kind: 'exam' },
]

// ---------- Learning: audio pods & resources ----------
export const AUDIO_PODS = [
  { id: 'p1', subject: 'Mathematics', title: 'Quadratic equations in 6 minutes', titleMl: 'ദ്വിമാന സമവാക്യങ്ങൾ 6 മിനിറ്റിൽ', lang: 'ml', mins: 6, size: '2.1 MB', grade: 9, emoji: '📐', color: '#26a69a',
    script: 'Namaskaram! Today we learn quadratic equations. A quadratic equation looks like a x squared plus b x plus c equals zero. The discriminant, b squared minus four a c, tells us how many real roots there are. If it is positive, two roots. If zero, one root. If negative, no real roots. Let us try: x squared minus five x plus six equals zero. Here a is one, b is minus five, c is six. The discriminant is twenty five minus twenty four, which is one. So two roots: two and three.' },
  { id: 'p2', subject: 'Physics', title: 'Newton’s laws with a cricket ball', titleMl: 'ന്യൂട്ടന്റെ നിയമങ്ങൾ ക്രിക്കറ്റ് ബോളിലൂടെ', lang: 'en', mins: 8, size: '2.9 MB', grade: 9, emoji: '🏏', color: '#2f6bbf',
    script: 'Imagine Sanju Samson hitting a cricket ball. The ball stays still until the bat pushes it. That is Newton’s first law, inertia. The harder he hits, the faster it goes. Force equals mass times acceleration. That is the second law. And when the bat hits the ball, the ball pushes back on the bat. That is the third law, action and reaction.' },
  { id: 'p3', subject: 'English', title: 'The Road Not Taken – explained', titleMl: 'ദി റോഡ് നോട്ട് ടേക്കൺ – വിശദീകരണം', lang: 'en', mins: 7, size: '2.4 MB', grade: 9, emoji: '🌲', color: '#ec7563',
    script: 'Robert Frost’s poem is about choices. Two roads divided in a yellow wood, and the poet could travel only one. He chose the one less travelled, and that made all the difference. Think about a choice you made this year.' },
  { id: 'p4', subject: 'Social Science', title: 'Sree Narayana Guru & Kerala renaissance', titleMl: 'ശ്രീനാരായണ ഗുരുവും കേരള നവോത്ഥാനവും', lang: 'ml', mins: 9, size: '3.2 MB', grade: 9, emoji: '🕊️', color: '#f6b93b',
    script: 'Sree Narayana Guru taught one caste, one religion, one god for humanity. He opened temples and schools for everyone and inspired the Kerala renaissance along with Ayyankali, Chattampi Swamikal and Vakkom Moulavi.' },
  { id: 'p5', subject: 'Malayalam', title: 'കവിത ആസ്വാദനം – എങ്ങനെ എഴുതാം', titleMl: 'കവിത ആസ്വാദനം – എങ്ങനെ എഴുതാം', lang: 'ml', mins: 5, size: '1.8 MB', grade: 9, emoji: '✍️', color: '#8b5cf6',
    script: 'Writing a poem appreciation: first, the theme. Second, the imagery and words. Third, the rhythm. Finally, your own feeling about the poem.' },
  { id: 'p6', subject: 'Hindi', title: 'हिंदी व्याकरण: संज्ञा और सर्वनाम', titleMl: 'ഹിന്ദി വ്യാകരണം: സംജ്ഞയും സർവനാമവും', lang: 'hi', mins: 6, size: '2.0 MB', grade: 9, emoji: '🔤', color: '#0ea5e9',
    script: 'Sangya means noun, the name of a person, place or thing. Sarvanam means pronoun, a word used in place of a noun, like main, tum, vah.' },
  { id: 'p7', subject: 'EVS', title: 'Where does rain come from?', titleMl: 'മഴ എവിടെ നിന്ന് വരുന്നു?', lang: 'ml', mins: 4, size: '1.4 MB', grade: 4, emoji: '🌧️', color: '#26a69a',
    script: 'The sun warms the sea. Water becomes vapour and goes up. Up in the sky it cools and becomes clouds. When clouds become heavy, it rains! That is the water cycle.' },
  { id: 'p8', subject: 'Maths', title: 'Fun with fractions – pizza time!', titleMl: 'ഭിന്നസംഖ്യകൾ – പിസ്സ സമയം!', lang: 'en', mins: 5, size: '1.7 MB', grade: 4, emoji: '🍕', color: '#ec7563',
    script: 'If you cut a pizza into four equal pieces and eat one, you ate one fourth. Two pieces is two fourths, which is the same as one half!' },
]

export const RESOURCES = [
  { id: 'r1', title: 'SCERT Mathematics Textbook – Class 9 Part 1', type: 'Textbook', size: '8.4 MB', subject: 'Mathematics', icon: '📘' },
  { id: 'r2', title: 'Physics formula sheet (bilingual)', type: 'Notes', size: '420 KB', subject: 'Physics', icon: '📄' },
  { id: 'r3', title: 'Previous year questions – 2nd Terminal (5 yrs)', type: 'Question bank', size: '3.1 MB', subject: 'All', icon: '🗂️' },
  { id: 'r4', title: 'KITE Victers – recorded class: Chemical bonding', type: 'Video (low-data 144p)', size: '22 MB', subject: 'Chemistry', icon: '🎬' },
  { id: 'r5', title: 'English grammar workbook', type: 'Workbook', size: '1.9 MB', subject: 'English', icon: '📗' },
]

export const COMPETITIVE = [
  { id: 'c1', name: 'NMMS Scholarship Exam', for: 'Class 8', desc: 'National Means-cum-Merit Scholarship – ₹12,000/yr', lessons: 24, done: 9, color: '#26a69a' },
  { id: 'c2', name: 'USS / LSS Prep', for: 'Class 4 & 7', desc: 'Kerala govt. scholarship exams', lessons: 18, done: 0, color: '#f6b93b' },
  { id: 'c3', name: 'Kerala PSC Foundation', for: 'Class 10+', desc: 'GK, Renaissance, Constitution basics', lessons: 40, done: 4, color: '#2f6bbf' },
  { id: 'c4', name: 'SSC / Banking Basics', for: 'Class 12+', desc: 'Quant, reasoning & English', lessons: 36, done: 0, color: '#ec7563' },
  { id: 'c5', name: 'Intro to CA / CMA', for: 'Class 11–12', desc: 'Is commerce right for you?', lessons: 12, done: 0, color: '#8b5cf6' },
]

// ---------- Performance ----------
export const MARKS = {
  ananya: [
    { exam: 'Unit 1', Mathematics: 72, Physics: 68, English: 81, Malayalam: 88, 'Social Sci.': 74 },
    { exam: '1st Term', Mathematics: 64, Physics: 71, English: 84, Malayalam: 90, 'Social Sci.': 78 },
    { exam: 'Unit 2', Mathematics: 78, Physics: 75, English: 86, Malayalam: 87, 'Social Sci.': 80 },
    { exam: 'Unit 3*', Mathematics: 83, Physics: 79, English: 85, Malayalam: 91, 'Social Sci.': 82 },
  ],
  aarav: [
    { exam: 'Term 1', Maths: 'A', EVS: 'A+', English: 'B+', Malayalam: 'A' },
  ],
}

export const SKILLS_RADAR = [
  { skill: 'Problem solving', v: 78 }, { skill: 'Reading', v: 88 }, { skill: 'Writing', v: 82 },
  { skill: 'Science', v: 74 }, { skill: 'Creativity', v: 91 }, { skill: 'Teamwork', v: 85 },
]

export const ASSIGNMENTS = [
  { name: 'Assignments', submitted: 18, total: 20 },
  { name: 'Seminars', submitted: 3, total: 3 },
  { name: 'Projects', submitted: 2, total: 3 },
]

// attendance for last ~5 weeks (P / A / L / H)
export const ATTENDANCE_HISTORY = (() => {
  const out = []
  for (let i = 34; i >= 1; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const dow = d.getDay()
    let s = 'P'
    if (dow === 0 || dow === 6) s = 'H'
    else if (i === 9 || i === 22) s = 'A'
    else if (i === 15) s = 'L'
    out.push({ date: d.toISOString().slice(0, 10), s })
  }
  return out
})()

// ---------- Bus ----------
export const BUS = {
  id: 'KL-10-AX-4521', route: 'Route 3', name: 'Edayur – Athavanad – Valanchery', capacity: 40,
  driver: 'shaji', attender: 'Sainaba K.', attenderPhone: '9605043210', gps: 'Vidya Vahan-compatible GPS', speedLimit: 40,
  stops: [
    { id: 'st1', name: 'Edayur Junction', ml: 'എടയൂർ ജംഗ്ഷൻ', t: '7:50', students: 6 },
    { id: 'st2', name: 'Pookkattiri', ml: 'പൂക്കാട്ടിരി', t: '7:58', students: 5 },
    { id: 'st3', name: 'Athavanad Market', ml: 'ആതവനാട് മാർക്കറ്റ്', t: '8:07', students: 8, isHome: true },
    { id: 'st4', name: 'Karippol Temple', ml: 'കരിപ്പോൾ ക്ഷേത്രം', t: '8:15', students: 4 },
    { id: 'st5', name: 'Valanchery Bus Stand', ml: 'വളാഞ്ചേരി ബസ് സ്റ്റാൻഡ്', t: '8:24', students: 7 },
    { id: 'st6', name: 'Vidyanagar GHSS', ml: 'വിദ്യാനഗർ GHSS', t: '8:35', students: 0, isSchool: true },
  ],
  boardList: [
    { name: 'Ananya Rajesh', cls: '9-B', stop: 'st3' }, { name: 'Aarav Rajesh', cls: '4-A', stop: 'st3' },
    { name: 'Aadil Muhammed', cls: '9-B', stop: 'st1' }, { name: 'Anjali Suresh', cls: '9-B', stop: 'st1' },
    { name: 'Hiba Fathima', cls: '9-B', stop: 'st2' }, { name: 'Sanjay Kumar', cls: '9-B', stop: 'st3' },
    { name: 'Riya Rose', cls: '9-B', stop: 'st4' }, { name: 'Nihal Ahammed', cls: '9-B', stop: 'st5' },
    { name: 'Devika M.', cls: '7-A', stop: 'st2' }, { name: 'Faris P.', cls: '6-C', stop: 'st1' },
    { name: 'Gopika S.', cls: '8-B', stop: 'st4' }, { name: 'Haris K.', cls: '10-A', stop: 'st5' },
  ],
}

export const FLEET = [
  { id: 'KL-10-AX-4521', route: 'Route 3', driver: 'Shaji Varghese', status: 'On route', load: 31, cap: 40, delay: 0, speed: 32 },
  { id: 'KL-10-AB-1102', route: 'Route 1', driver: 'Muhammed Ali', status: 'On route', load: 36, cap: 40, delay: 6, speed: 28 },
  { id: 'KL-10-AC-7788', route: 'Route 2', driver: 'Biju Paul', status: 'Arrived', load: 0, cap: 32, delay: 0, speed: 0 },
  { id: 'KL-55-Q-3021', route: 'Route 4', driver: 'Unnikrishnan', status: 'Not started', load: 0, cap: 40, delay: 0, speed: 0 },
]

// ---------- Chat ----------
export const CHATS = {
  fathima: [
    { from: 'fathima', text: 'Good evening Ananya. Did you understand today’s discriminant problems?', at: hoursAgo(26) },
    { from: 'ananya', text: 'Yes miss, but Q6 in exercise 4.3 is confusing. b² is negative?', at: hoursAgo(25.8) },
    { from: 'fathima', text: 'b² can never be negative 🙂 Check the sign of b again — it is −7, so b² = 49. Try once more and send your answer.', at: hoursAgo(25.7) },
    { from: 'ananya', text: 'Got it! Discriminant = 49 − 40 = 9. Two roots 🎉', at: hoursAgo(25.5) },
    { from: 'fathima', text: 'Excellent! +5 Vidya Coins for asking a good doubt.', at: hoursAgo(25.4), system: false },
  ],
  't-deepa': [
    { from: 't-deepa', text: 'Reminder: diary entry is due Friday. Use past tense throughout.', at: hoursAgo(50) },
  ],
  'parent-fathima': [
    { from: 'fathima', text: 'Namaskaram Rajesh sir. Ananya has improved a lot in Maths this month — 83 in unit test 3!', at: hoursAgo(48) },
    { from: 'rajesh', text: 'Thank you teacher. Can she attend the extra class on Saturday?', at: hoursAgo(47) },
    { from: 'fathima', text: 'Yes, 10 AM to 12 in room 9-B. The bus will not run, please arrange drop.', at: hoursAgo(46.5) },
  ],
}

// ---------- AI tutor canned answers (age adaptive) ----------
export const AI_ANSWERS = [
  {
    keys: ['photosynthesis', 'plant', 'food', 'leaf', 'പ്രകാശസംശ്ലേഷണം'],
    g4: 'Plants make their own food! 🌱 Leaves take sunlight ☀️, water 💧 from the roots and air. They mix it all like a kitchen and make sugar (food). They also give us fresh oxygen to breathe. Cool, right?',
    g9: 'Photosynthesis: 6CO₂ + 6H₂O → (light, chlorophyll) → C₆H₁₂O₆ + 6O₂. It happens in chloroplasts in two stages — the light reactions (in thylakoids, producing ATP & NADPH and releasing O₂) and the Calvin cycle (in the stroma, fixing CO₂ into glucose). Limiting factors: light intensity, CO₂ concentration and temperature.',
  },
  {
    keys: ['gandhi', 'freedom', 'independence', 'ഗാന്ധി'],
    g4: 'Mahatma Gandhi was a kind leader who helped India become free in 1947 🇮🇳. He never used fighting — he used truth and peace. We call him “Bapu”, which means father.',
    g9: 'Gandhi led three mass movements — Non-Cooperation (1920–22), Civil Disobedience incl. the Salt March (1930) and Quit India (1942). His methods of satyagraha and ahimsa turned the freedom struggle into a mass movement. In Kerala, the Vaikom Satyagraha (1924–25) drew his support for temple-road entry.',
  },
  {
    keys: ['quadratic', 'discriminant', 'equation', 'root'],
    g4: 'That is a big-class topic! 😊 For now, remember: an equation is like a balance 🏋️ — both sides must be equal. If 3 + ☐ = 5, then ☐ = 2!',
    g9: 'For ax² + bx + c = 0, the discriminant D = b² − 4ac. D > 0 → two distinct real roots; D = 0 → two equal roots; D < 0 → no real roots. Roots = (−b ± √D) / 2a. Example: x² − 5x + 6 = 0 → D = 1 → x = 2 or 3.',
  },
  {
    keys: ['rain', 'water cycle', 'cloud', 'മഴ'],
    g4: 'The sun heats water in seas and rivers 🌊. It turns into vapour and flies up ☁️. Up high it cools and makes clouds. When clouds get heavy — rain! 🌧️ Kerala gets lots of rain in the monsoon.',
    g9: 'The hydrological cycle: evaporation and transpiration move water vapour into the atmosphere; it cools adiabatically, condenses on aerosols to form clouds; precipitation returns it as rain. Kerala’s south-west monsoon (June–Sept) is driven by differential heating of land and sea and the Western Ghats cause orographic rainfall.',
  },
]

// ---------- Vidya Coins & Store ----------
export const COIN_HISTORY = [
  { id: 'ch1', label: 'Perfect attendance – week 42', amt: 20, at: hoursAgo(30) },
  { id: 'ch2', label: 'Doubt asked in Maths chat', amt: 5, at: hoursAgo(25) },
  { id: 'ch3', label: 'Quiz: Kerala Renaissance – 9/10', amt: 30, at: hoursAgo(50) },
  { id: 'ch4', label: 'Redeemed: Geometry box', amt: -120, at: hoursAgo(200) },
  { id: 'ch5', label: 'Homework streak 7 days', amt: 25, at: hoursAgo(220) },
]

export const STORE_ITEMS = [
  { id: 'i1', name: 'School bag (water-resistant)', price: 640, coins: 300, discount: '₹150 off', emoji: '🎒', stock: 24, by: 'BrightFuture CSR' },
  { id: 'i2', name: 'Notebook pack (6 × 200 pages)', price: 240, coins: 80, discount: '₹60 off', emoji: '📒', stock: 120, by: 'Local stationer' },
  { id: 'i3', name: 'Geometry box', price: 180, coins: 120, discount: 'FREE', emoji: '📐', stock: 40, by: 'Nila Shiksha Foundation' },
  { id: 'i4', name: 'Uniform set (2 pairs)', price: 900, coins: 400, discount: '₹300 off', emoji: '👕', stock: 18, by: 'Kudumbashree tailoring unit' },
  { id: 'i5', name: 'Scientific calculator', price: 750, coins: 350, discount: '₹250 off', emoji: '🧮', stock: 12, by: 'BrightFuture CSR' },
  { id: 'i6', name: 'English–Malayalam dictionary', price: 320, coins: 150, discount: '₹100 off', emoji: '📕', stock: 30, by: 'Local bookstore' },
]

// ---------- Talent wall ----------
export const TALENT = [
  { id: 'tw1', by: 'Ananya R.', cls: '9-B', type: 'Art', title: 'Monsoon over Bharathapuzha', likes: 42, hue: 190, comments: 6 },
  { id: 'tw2', by: 'Hiba F.', cls: '9-B', type: 'Poem', title: 'അമ്മയുടെ കൈകൾ', text: 'വിണ്ടുകീറിയ ആ കൈകളിൽ\nഎന്റെ ബാല്യത്തിന്റെ മണം,\nഓരോ ചുളിവിലും ഒരു\nകഥ പറയാത്ത സ്നേഹം.', likes: 67, comments: 12 },
  { id: 'tw3', by: 'Sanjay K.', cls: '9-B', type: 'Art', title: 'My village in Bihar & my school in Kerala', likes: 88, hue: 30, comments: 19 },
  { id: 'tw4', by: 'Aarav R.', cls: '4-A', type: 'Art', title: 'Elephant at Guruvayur', likes: 35, hue: 280, comments: 4 },
  { id: 'tw5', by: 'Riya R.', cls: '9-B', type: 'Story', title: 'The last bus home', text: 'The bus was late again. But this time, Amma did not worry — the little blue dot on her phone was moving closer…', likes: 51, comments: 8 },
  { id: 'tw6', by: 'Gokul R.', cls: '9-B', type: 'Art', title: 'Theyyam', hue: 0, likes: 73, comments: 9 },
]

// ---------- Peer tutors ----------
export const PEER_TUTORS = [
  { id: 'pt1', name: 'Nihala Sherin', cls: 'Plus Two Science', subjects: ['Maths', 'Physics'], rating: 4.9, sessions: 46, fee: 'Free (CSR)', avatar: '👩🏽‍🎓' },
  { id: 'pt2', name: 'Adarsh M.', cls: 'B.Sc Maths, 2nd yr', subjects: ['Maths'], rating: 4.8, sessions: 31, fee: '₹30/hr', avatar: '👨🏽‍🎓' },
  { id: 'pt3', name: 'Shahana P.', cls: 'Plus Two Humanities', subjects: ['English', 'Social Sci.'], rating: 4.7, sessions: 22, fee: 'Free (CSR)', avatar: '👩🏽‍🎓' },
]

// ---------- Scholarships / CSR ----------
export const SCHOLARSHIPS = [
  { id: 'sc1', name: 'Pre-Matric Scholarship (NSP)', by: 'Govt. of India', amount: '₹3,500 / year', deadline: daysFromNow(18), eligibility: 'Classes 1–10, family income < ₹1 lakh', status: 'Documents pending', step: 1 },
  { id: 'sc2', name: 'NMMS Merit Scholarship', by: 'MoE, Govt. of India', amount: '₹12,000 / year', deadline: daysFromNow(32), eligibility: 'Class 8, 55% marks, income < ₹3.5 lakh', status: 'Not started', step: 0 },
  { id: 'sc3', name: 'Vidya Sethu Bright Girl Fund', by: 'BrightFuture CSR', amount: 'Books + ₹5,000', deadline: daysFromNow(10), eligibility: 'Girls, Classes 8–10, school-verified', status: 'Under review', step: 2 },
  { id: 'sc4', name: 'Kerala Margadeepam Scholarship', by: 'Govt. of Kerala', amount: '₹1,500 / year', deadline: daysFromNow(-5), eligibility: 'Minority communities, Classes 1–8', status: 'Approved – ₹1,500 credited', step: 4 },
]

export const RESOURCE_KITS = [
  { id: 'k1', name: 'Exam-prep book kit (Class 9)', by: 'Nila Shiksha Foundation', status: 'Out for delivery', eta: 'Tomorrow', steps: ['Requested', 'School verified', 'Packed', 'Out for delivery', 'Delivered'], step: 3 },
  { id: 'k2', name: 'Stationery kit (Class 4)', by: 'BrightFuture CSR', status: 'Delivered', eta: 'Delivered 12 Oct', steps: ['Requested', 'School verified', 'Packed', 'Out for delivery', 'Delivered'], step: 4 },
]

// ---------- Help requests ----------
export const REQUESTS = [
  { id: 'REQ-1042', by: 'rajesh', byName: 'Rajesh Kumar (parent)', child: 'Aarav · 4-A', category: 'Resources', title: 'Aarav has not received Malayalam textbook', detail: 'Term 2 Malayalam reader not received yet.', status: 'Resolved', assigned: 'School Office', createdAt: hoursAgo(120), timeline: [
    { s: 'Submitted', at: hoursAgo(120) }, { s: 'Assigned to School Office', at: hoursAgo(118) }, { s: 'Responded: textbook sent with class teacher', at: hoursAgo(97) }, { s: 'Resolved', at: hoursAgo(72) }] },
  { id: 'REQ-1057', by: 'ananya', byName: 'Ananya Rajesh (student)', child: 'Ananya · 9-B', category: 'Academic', title: 'Need extra help in Physics numericals', detail: 'Momentum problems are difficult. Can I get a peer tutor?', status: 'In progress', assigned: 'Fathima Nasrin', createdAt: hoursAgo(28), timeline: [
    { s: 'Submitted', at: hoursAgo(28) }, { s: 'Assigned to Fathima Nasrin', at: hoursAgo(26) }] },
  { id: 'REQ-1061', by: 'other', byName: 'Parent of Sanjay K. (Hindi)', child: 'Sanjay · 9-B', category: 'Language', title: 'Need PTA notice in Hindi', detail: 'हमें मलयालम नोटिस समझ नहीं आता।', status: 'New', assigned: 'Unassigned', createdAt: hoursAgo(4), timeline: [{ s: 'Submitted', at: hoursAgo(4) }] },
]

// ---------- Counselling ----------
export const COUNSEL_QUERIES = [
  { id: 'cq1', anon: 'Student #A-219', cls: 'Class 10', topic: 'Exam stress', text: 'I study all night but I forget everything in the exam hall. My parents expect A+ in all subjects. I feel like crying every day.', at: hoursAgo(6), risk: 'medium', status: 'New' },
  { id: 'cq2', anon: 'Student #A-147', cls: 'Class 9', topic: 'Friendship', text: 'My friends stopped talking to me after a fight. Lunch time is very lonely.', at: hoursAgo(20), risk: 'low', status: 'Replied' },
  { id: 'cq3', anon: 'Student #A-305', cls: 'Class 8', topic: 'Home', text: 'There is a lot of shouting at home at night and I cannot sleep or study.', at: hoursAgo(30), risk: 'high', status: 'Escalated' },
]

export const SESSIONS = [
  { id: 'ss1', who: 'Group: Class 10-A', title: 'Beating exam anxiety – breathing & planning', at: daysFromNow(1, 14, 15), mode: 'In school · Seminar hall', seats: '42/45' },
  { id: 'ss2', who: 'Student #A-219', title: '1:1 session (requested via app)', at: daysFromNow(1, 15, 30), mode: 'Counsellor room', seats: '1:1' },
  { id: 'ss3', who: 'Parents of Class 9', title: 'Talking to teens about pressure', at: daysFromNow(2, 15, 0), mode: 'Online (low-data audio)', seats: '63 registered' },
]

// ---------- NGO / CSR ----------
export const NOMINATIONS = [
  { id: 'NV-301', code: 'STU-9B-•••4', cls: '9-B', need: 'Exam-prep books + uniform', reason: 'Father is daily-wage worker; mother unwell', verifiedBy: 'Fathima N. & Principal', amount: 2400, status: 'Sponsored', sponsor: 'Nila Shiksha Foundation' },
  { id: 'NV-302', code: 'STU-9B-•••8', cls: '9-B', need: 'Bus fee for 6 months', reason: 'Migrant family from Bihar, new admission', verifiedBy: 'Fathima N. & Principal', amount: 3600, status: 'Verified', sponsor: null },
  { id: 'NV-303', code: 'STU-7A-•••2', cls: '7-A', need: 'Spectacles + eye test', reason: 'Identified in screening; cannot see board', verifiedBy: 'Health club & Principal', amount: 900, status: 'Verified', sponsor: null },
  { id: 'NV-304', code: 'STU-4A-•••6', cls: '4-A', need: 'Stationery kit + school bag', reason: 'Orphan, living with grandmother', verifiedBy: 'Class teacher 4-A & Principal', amount: 1200, status: 'Verified', sponsor: null },
  { id: 'NV-305', code: 'STU-10B-•••1', cls: '10-B', need: 'Tablet for KITE online classes', reason: 'No smartphone at home', verifiedBy: 'Pending principal', amount: 8500, status: 'Pending school verification', sponsor: null },
  { id: 'NV-306', code: 'STU-8C-•••9', cls: '8-C', need: 'NMMS coaching fee', reason: 'Top 5% in class, family income < ₹60k', verifiedBy: 'Fathima N. & Principal', amount: 1500, status: 'Sponsored', sponsor: 'BrightFuture CSR' },
]

export const CSR_PROJECTS = [
  { id: 'pr1', name: 'Book kits for 2nd Terminal – Malappuram', budget: 450000, used: 312000, students: 640, schools: 8, status: 'Active' },
  { id: 'pr2', name: 'Bright Girl Fund – Classes 8–10', budget: 300000, used: 145000, students: 58, schools: 5, status: 'Active' },
  { id: 'pr3', name: 'Eye-care camps', budget: 120000, used: 120000, students: 1320, schools: 6, status: 'Completed' },
]

// ---------- Pilot / platform ----------
export const PILOT_SCHOOLS = [
  { name: 'Vidyanagar GHSS', type: 'Govt', students: 1184, adoption: 82, notices: 64, resp: 3.2, buses: 4, status: 'Live' },
  { name: 'Riverside GUPS', type: 'Govt', students: 420, adoption: 71, notices: 31, resp: 4.8, buses: 1, status: 'Live' },
  { name: 'Palmgrove AUPS', type: 'Aided', students: 610, adoption: 66, notices: 27, resp: 6.1, buses: 2, status: 'Live' },
  { name: 'Hillview GHSS', type: 'Govt', students: 1320, adoption: 58, notices: 22, resp: 5.4, buses: 3, status: 'Live' },
  { name: 'Sunrise AMLPS', type: 'Aided', students: 260, adoption: 74, notices: 18, resp: 2.9, buses: 0, status: 'Live' },
  { name: 'Greenfield HSS', type: 'Aided', students: 980, adoption: 39, notices: 9, resp: 9.7, buses: 2, status: 'Onboarding' },
  { name: 'Lakeside GVHSS', type: 'Govt', students: 870, adoption: 0, notices: 0, resp: 0, buses: 2, status: 'Training' },
]

export const WEEKLY_METRICS = [
  { w: 'W1', families: 410, requests: 22, resp: 11.2, reads: 48 },
  { w: 'W2', families: 760, requests: 41, resp: 9.4, reads: 55 },
  { w: 'W3', families: 1210, requests: 58, resp: 7.9, reads: 61 },
  { w: 'W4', families: 1690, requests: 66, resp: 6.1, reads: 66 },
  { w: 'W5', families: 2140, requests: 71, resp: 5.2, reads: 71 },
  { w: 'W6', families: 2580, requests: 64, resp: 4.6, reads: 74 },
  { w: 'W7', families: 2930, requests: 69, resp: 4.1, reads: 77 },
  { w: 'W8', families: 3260, requests: 73, resp: 3.6, reads: 79 },
]

export const CAREER_QUIZ = [
  { q: 'On a free Saturday, you would rather…', opts: [['Build or fix something', 'tech'], ['Draw, write or make music', 'arts'], ['Help someone with a problem', 'care'], ['Sell something or plan an event', 'biz']] },
  { q: 'Your favourite school period is…', opts: [['Maths / IT', 'tech'], ['Malayalam / English / Art', 'arts'], ['Biology / Social Science', 'care'], ['Any group project', 'biz']] },
  { q: 'Friends usually come to you for…', opts: [['Fixing phones / maths doubts', 'tech'], ['Ideas & creativity', 'arts'], ['Advice & listening', 'care'], ['Organising trips & money', 'biz']] },
  { q: 'Which news headline excites you?', opts: [['ISRO launches new rocket', 'tech'], ['Kerala film wins national award', 'arts'], ['New hospital opens in village', 'care'], ['Local startup gets funding', 'biz']] },
  { q: 'In 15 years you see yourself…', opts: [['In a lab or tech company', 'tech'], ['On stage, in a studio or newsroom', 'arts'], ['Serving people – doctor, teacher, officer', 'care'], ['Running your own business', 'biz']] },
]

export const CAREER_RESULTS = {
  tech: { title: 'The Builder 🔧', paths: ['Engineering (KEAM / JEE)', 'Data science & AI', 'ITI → Electrician / Technician', 'Polytechnic Diploma'], subjects: 'Plus One: Science (Computer Science / Maths)', color: '#2f6bbf' },
  arts: { title: 'The Creator 🎨', paths: ['Journalism & Mass Comm.', 'Design (NID / NIFT)', 'Fine Arts (Thrissur College of FA)', 'Film & animation'], subjects: 'Plus One: Humanities or any stream + portfolio', color: '#ec7563' },
  care: { title: 'The Helper 💚', paths: ['Nursing / MBBS (NEET)', 'Teaching (B.Ed / TTC)', 'Social Work (BSW / MSW)', 'Civil Services (Kerala PSC / UPSC)'], subjects: 'Plus One: Biology Science or Humanities', color: '#26a69a' },
  biz: { title: 'The Leader 📈', paths: ['Commerce → CA / CMA', 'BBA / Hotel Management', 'Banking (IBPS / SBI)', 'Entrepreneurship (KSUM)'], subjects: 'Plus One: Commerce', color: '#f6b93b' },
}
