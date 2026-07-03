// =====================================================
// data.js — Curriculum data, demo accounts, videos, quizzes
// All content drawn from the PPT decks.
// =====================================================

const ACADEMY = {
  name: "مناهج اقرأ ورتّل",
  tagline: "أكاديمية تأسيس اللغة العربية والقرآن الكريم",
  project: "مشروع الحافظ الصغير",
  channel: "قناة الكُتَّاب — مناهج اقرأ ورتل",
  author: "د/ عبد الرحمن عبد الباقي",
  description:
    "منهج يؤهّل الطالب لقراءة اللغة العربية قراءة صحيحة متقنة بطريقة سهلة مبسطة وفي فترة زمنية قصيرة؛ ينتقل بعدها للقراءة الصحيحة من المصحف الشريف، ثم لحفظ القرآن الكريم بمنهج منضبط بخطة زمنية مدروسة.",
  audience: ["الروضات", "المرحلة الابتدائية", "الأميون والأعاجم"],
  experience: "خبرة أكثر من عشرين عامًا",
  countries: ["مصر", "السعودية", "الكويت"],
  contact: {
    phone: "0593781376",
    emails: ["kttababdelbaky@gmail.com", "boda2010100@gmail.com"],
    whatsapp: "0593781376",
  },
  modes: ["أون لاين", "حضوري"],
  schedule: "ثلاثة أيام في الأسبوع",
  groups: ["حلقات البنين", "حلقات البنات"],
};

// ----- المنهج / المستويات -----
const CURRICULUM = [
  {
    id: "level-1",
    title: "المستوى الأول",
    subtitle: "الجزء الأول الخاص بالقراءة",
    color: "primary",
    chapters: [
      { id: "c1", title: "الباب الأول: الحروف المجردة ورسمها", lessons: ["الحروف المجردة وأسماؤها", "رسم الحرف في مواضع الكلمة"] },
      { id: "c2", title: "الباب الثاني: حركة الفتح والمد بالألف",       lessons: ["حركة الفتح والتدريبات عليها", "المد بالألف والتدريبات عليه"] },
      { id: "c3", title: "الباب الثالث: حركة الكسر والمد بالياء",        lessons: ["حركة الكسر والتدريبات عليها", "المد بالياء والتدريبات عليه"] },
      { id: "c4", title: "الباب الرابع: حركة الضم والمد بالواو",         lessons: ["حركة الضم والتدريبات عليها", "المد بالواو والتدريبات عليه"] },
      { id: "c5", title: "الباب الخامس: علامة السكون",                   lessons: ["كيفية نطق السكون والتدريبات عليه", "أمثلة قرآنية على رسم السكون العثماني"] },
    ],
  },
  {
    id: "level-2",
    title: "المستوى الثاني",
    subtitle: "التنوين والشدّة ورسم الهمزات",
    color: "secondary",
    chapters: [
      { id: "t1", title: "أولًا: التنوين بأنواعه الثلاثة", lessons: ["التنوين المفتوح", "التنوين المكسور", "التنوين المضموم"] },
      { id: "t2", title: "ثانيًا: الشدّة بدروسها التسعة",    lessons: ["الشدّة مع الفتح/الكسر/الضم", "الشدّة مع المدود الثلاثة", "الشدّة مع التنوين"] },
      { id: "t3", title: "ثالثًا: همزة الوصل",               lessons: ["اللام الشمسية والقمرية", "همزة الوصل في الأسماء", "همزة الوصل في الأفعال"] },
      { id: "t4", title: "رابعًا: همزة القطع",                lessons: ["رسمها أول الكلمة", "رسمها وسط الكلمة", "رسمها آخر الكلمة"] },
    ],
  },
];

// ----- كتب الحقيبة -----
const BOOKS = [
  { id: "b1", title: "كتاب المستوى الأول",          subtitle: "الجزء الأول للقراءة", color: "var(--grad-1)", price: 90, level: "أساسي" },
  { id: "b2", title: "كتاب المستوى الثاني",         subtitle: "التنوين والشدة والهمزات", color: "var(--grad-2)", price: 90, level: "متوسط" },
  { id: "b3", title: "دفتر الحروف المجردة",         subtitle: "أوراق عمل المستوى الأول", color: "var(--grad-3)", price: 60, level: "تطبيق" },
  { id: "b4", title: "دفتر أشكال الحروف",           subtitle: "أوراق عمل المستوى الأول", color: "linear-gradient(135deg,#6c63ff,#ff5e8a)", price: 60, level: "تطبيق" },
  { id: "b5", title: "الحركات والمدود والسكون",    subtitle: "أوراق عمل المستوى الأول", color: "linear-gradient(135deg,#ffc847,#ff7a45)", price: 60, level: "تطبيق" },
  { id: "b6", title: "أوراق عمل المستوى الثاني",   subtitle: "التنوين والشدة ورسم الهمزات", color: "linear-gradient(135deg,#2bb673,#4aa6ff)", price: 60, level: "تطبيق" },
  { id: "b7", title: "دليل المعلم",                  subtitle: "إرشادات وتوجيهات تربوية", color: "linear-gradient(135deg,#1f1a3d,#6c63ff)", price: 80, level: "للمعلم" },
  { id: "b8", title: "التجويد الميسر للأطفال",      subtitle: "تحت الطبع — قريبًا", color: "linear-gradient(135deg,#b08a3e,#2e7d5b)", price: 100, level: "تجويد", soon: true },
];

const PACKAGE_PRICE = 480; // باقة الحقيبة الكاملة

// ----- فيديوهات الدروس (placeholders؛ ستستبدل بروابط يوتيوب الحقيقية) -----
const LESSONS = [
  {
    id: "L01", level: 1, idx: 1,
    title: "حرف الألف — أ",
    description: "تعرّف على الحرف الأول من الحروف الهجائية، شكله ونطقه.",
    duration: "8:24",
    youtubeId: "dQw4w9WgXcQ",
    chapter: "الحروف المجردة",
    completed: true,
    starsEarned: 3,
  },
  {
    id: "L02", level: 1, idx: 2,
    title: "حرف الباء — ب",
    description: "حرف الباء بنقطته من الأسفل، ومواضعه في الكلمة.",
    duration: "7:50",
    youtubeId: "dQw4w9WgXcQ",
    chapter: "الحروف المجردة",
    completed: true,
    starsEarned: 3,
  },
  {
    id: "L03", level: 1, idx: 3,
    title: "حرف التاء — ت",
    description: "تمييز التاء عن الثاء، ومواضع كتابتها.",
    duration: "8:10",
    youtubeId: "dQw4w9WgXcQ",
    chapter: "الحروف المجردة",
    completed: true,
    starsEarned: 2,
  },
  {
    id: "L04", level: 1, idx: 4,
    title: "حركة الفتح",
    description: "تعرف على الحركة الأولى من الحركات الثلاث.",
    duration: "9:15",
    youtubeId: "dQw4w9WgXcQ",
    chapter: "الحركات",
    completed: true,
    starsEarned: 3,
  },
  {
    id: "L05", level: 1, idx: 5,
    title: "المد بالألف",
    description: "كيف يمد الحرف المفتوح بحرف الألف.",
    duration: "10:02",
    youtubeId: "dQw4w9WgXcQ",
    chapter: "الحركات",
    completed: false,
    current: true,
    starsEarned: 0,
  },
  {
    id: "L06", level: 1, idx: 6,
    title: "حركة الكسر",
    description: "نطق الحرف المكسور والتدريب عليه.",
    duration: "8:45",
    youtubeId: "dQw4w9WgXcQ",
    chapter: "الحركات",
    completed: false,
    locked: true,
  },
  {
    id: "L07", level: 1, idx: 7,
    title: "المد بالياء",
    description: "كيف يمد الحرف المكسور بحرف الياء.",
    duration: "9:30",
    youtubeId: "dQw4w9WgXcQ",
    chapter: "الحركات",
    completed: false,
    locked: true,
  },
  {
    id: "L08", level: 1, idx: 8,
    title: "حركة الضم",
    description: "نطق الحرف المضموم وأمثلة عليه.",
    duration: "8:55",
    youtubeId: "dQw4w9WgXcQ",
    chapter: "الحركات",
    completed: false,
    locked: true,
  },
];

// ----- كويزات بعد كل فيديو -----
// نوعان: mcq (اختيار من متعدد) و drag (سحب وإفلات لاختيار الحرف الصحيح)
const QUIZZES = {
  L05: {
    title: "مراجعة درس: المد بالألف",
    questions: [
      {
        type: "mcq",
        prompt: "ما الحرف الذي يمدّ به الحرف المفتوح؟",
        options: ["الألف", "الياء", "الواو", "الميم"],
        answer: 0,
      },
      {
        type: "mcq",
        prompt: "كم زمن النطق بحرف المد؟",
        options: ["زمن حركة واحدة", "زمن حركتين", "زمن أربع حركات", "بدون زمن"],
        answer: 1,
      },
      {
        type: "drag",
        prompt: "اسحب الحرف الذي يمدّ به (ـَ) ليصبح مدًا بالألف:",
        options: ["و", "ا", "ي", "ن"],
        target: "ـَ → ـَ ___",
        answer: 1,
      },
      {
        type: "mcq",
        prompt: "أيّ كلمة تحوي مدًا بالألف؟",
        options: ["كَتَبَ", "قَالَ", "كُتُب", "بِنْت"],
        answer: 1,
      },
    ],
  },
  L04: {
    title: "مراجعة درس: حركة الفتح",
    questions: [
      { type: "mcq", prompt: "شكل حركة الفتح؟", options: ["ـَ", "ـِ", "ـُ", "ـْ"], answer: 0 },
      { type: "drag", prompt: "اسحب الحركة الصحيحة فوق الحرف:", options: ["ـَ", "ـِ", "ـُ", "ـْ"], target: "ب___", answer: 0 },
    ],
  },
};

// ----- الإنجازات / الشارات -----
const BADGES = [
  { id: "b-letters", title: "بطل الحروف", icon: "🎯", desc: "أتقن الحروف المجردة", unlocked: true },
  { id: "b-fath",     title: "نجم الفتح", icon: "⭐", desc: "أتم درس حركة الفتح",   unlocked: true },
  { id: "b-streak",   title: "مواظب",      icon: "🔥", desc: "حضور 7 أيام متتالية",  unlocked: true },
  { id: "b-mad",      title: "أمير المدود", icon: "🌊", desc: "إتقان المدود الثلاثة", unlocked: false },
  { id: "b-quran",    title: "صاحب القرآن", icon: "📖", desc: "حفظ أول جزء من القرآن", unlocked: false },
  { id: "b-perfect",  title: "العلامة الكاملة", icon: "💯", desc: "100% في خمسة كويزات", unlocked: false },
];

// ----- زوم / جلسات قادمة -----
const ZOOM_SESSIONS = [
  { id: "z1", title: "حلقة المستوى الأول — أساسيات الحروف", teacher: "أ. عبد الرحمن", date: "الأحد", time: "5:00م", duration: "45 د",  link: "https://zoom.us/j/0000000000", joined: 12, total: 14 },
  { id: "z2", title: "حلقة المستوى الأول — الحركات",         teacher: "أ. عبد الرحمن", date: "الثلاثاء", time: "5:00م", duration: "45 د", link: "https://zoom.us/j/0000000000", joined: 0,  total: 14 },
  { id: "z3", title: "حلقة المستوى الثاني — الشدّة",          teacher: "أ. سُهى",        date: "الخميس", time: "6:30م", duration: "45 د", link: "https://zoom.us/j/0000000000", joined: 0,  total: 10 },
];

// ----- الطلاب (للمعلم/المشرف) -----
const STUDENTS = [
  { id: "s1", name: "محمد ياسر",      age: 7, level: "المستوى الأول", progress: 62, stars: 124, status: "active",  lastActive: "اليوم",     attendance: "ممتاز",    avatar: "م", color: "var(--grad-1)" },
  { id: "s2", name: "نور فتحي",       age: 6, level: "المستوى الأول", progress: 84, stars: 198, status: "active",  lastActive: "اليوم",     attendance: "ممتاز",    avatar: "ن", color: "var(--grad-3)" },
  { id: "s3", name: "أحمد عبد الله",   age: 8, level: "المستوى الأول", progress: 41, stars: 78,  status: "active",  lastActive: "أمس",       attendance: "جيد",      avatar: "أ", color: "var(--grad-2)" },
  { id: "s4", name: "مريم سامي",       age: 5, level: "روضة",            progress: 22, stars: 35,  status: "active",  lastActive: "اليوم",     attendance: "متوسط",    avatar: "م", color: "linear-gradient(135deg,#ff5e8a,#ffc847)" },
  { id: "s5", name: "خالد رضا",        age: 9, level: "المستوى الثاني", progress: 70, stars: 215, status: "active",  lastActive: "اليوم",     attendance: "ممتاز",    avatar: "خ", color: "linear-gradient(135deg,#00bfa6,#4f6df5)" },
  { id: "s6", name: "هاجر إبراهيم",   age: 7, level: "المستوى الأول", progress: 38, stars: 65,  status: "review",   lastActive: "منذ يومين", attendance: "متوسط",    avatar: "ه", color: "linear-gradient(135deg,#b08a3e,#2e7d5b)" },
  { id: "s7", name: "زيد محمود",       age: 8, level: "المستوى الأول", progress: 55, stars: 102, status: "active",  lastActive: "اليوم",     attendance: "جيد",      avatar: "ز", color: "linear-gradient(135deg,#4aa6ff,#6c63ff)" },
  { id: "s8", name: "سارة طارق",       age: 6, level: "روضة",            progress: 18, stars: 28,  status: "active",  lastActive: "أمس",       attendance: "جيد",      avatar: "س", color: "linear-gradient(135deg,#ffc847,#2bb673)" },
];

const PENDING_APPROVALS = [
  { id: "p1", type: "teacher", name: "أ. عمر الحارثي",   detail: "خبرة 10 سنوات، حفظ كامل للقرآن",            submitted: "منذ ساعتين" },
  { id: "p2", type: "student", name: "ليلى ماجد",          detail: "5 سنوات — تأسيس روضة — أون لاين",            submitted: "اليوم" },
  { id: "p3", type: "student", name: "يوسف عبد العزيز",   detail: "7 سنوات — مستوى أول — حضوري",                submitted: "اليوم" },
  { id: "p4", type: "teacher", name: "أ. هند الزهراني",   detail: "متخصصة في تأسيس الروضات، خبرة 6 سنوات",        submitted: "أمس" },
  { id: "p5", type: "student", name: "إبراهيم شوقي",      detail: "9 سنوات — مستوى ثاني — أون لاين",            submitted: "أمس" },
];

const TEACHERS = [
  { id: "t1", name: "د. عبد الرحمن عبد الباقي", role: "مؤسس ومؤلف المنهج", students: 86, sessionsWeek: 6, rating: 4.9 },
  { id: "t2", name: "أ. سُهى عبد الرحمن",         role: "معلمة المستوى الثاني", students: 32, sessionsWeek: 4, rating: 4.8 },
  { id: "t3", name: "أ. أحمد يوسف",                role: "معلم الروضات",         students: 24, sessionsWeek: 3, rating: 4.7 },
];

// progress detail rows for one student (used in teacher view)
const STUDENT_DETAIL = {
  s1: {
    quizScores: [
      { lesson: "حرف الألف",   score: 100 },
      { lesson: "حرف الباء",   score: 90 },
      { lesson: "حرف التاء",   score: 80 },
      { lesson: "حركة الفتح",  score: 100 },
      { lesson: "المد بالألف", score: null },
    ],
    attendanceLog: [
      { date: "الأحد 11", status: "present" },
      { date: "الثلاثاء 13", status: "present" },
      { date: "الخميس 15", status: "late" },
      { date: "الأحد 18", status: "present" },
      { date: "الثلاثاء 20", status: "absent" },
      { date: "الخميس 22", status: "present" },
    ],
    notes: [
      { from: "أ. عبد الرحمن", text: "تطور ممتاز في إتقان الحروف، يحتاج تركيز في زمن المد.", date: "أمس" },
      { from: "ولي الأمر",      text: "شكرًا لمتابعتكم، يتدرب يوميًا قبل النوم.", date: "منذ 3 أيام" },
    ],
  },
};

const RECENT_UPLOADS = [
  { name: "ورقة عمل — حرف الألف.pdf",            size: "1.2MB",  when: "اليوم 10:24ص" },
  { name: "فيديو شرح: المد بالألف.mp4",            size: "84.6MB", when: "أمس 8:10م" },
  { name: "بطاقات الحروف الملونة.pdf",            size: "3.4MB",  when: "أمس 2:33م" },
  { name: "تمارين الحركات الثلاث.pdf",            size: "780KB",  when: "منذ 3 أيام" },
];

const CHANNEL_VIDEOS = [
  { id: "v1", title: "افتتاح قناة الكُتَّاب — مناهج اقرأ ورتل", views: "12K", duration: "2:48" },
  { id: "v2", title: "كيف يبدأ تأسيس طفلك في اللغة العربية؟",   views: "8.5K", duration: "5:12" },
  { id: "v3", title: "محتويات حقيبة مناهج اقرأ ورتل",            views: "6.1K", duration: "4:30" },
  { id: "v4", title: "نموذج من شرح الحروف للأطفال",              views: "9.7K", duration: "6:18" },
];

Object.assign(window, {
  ACADEMY, CURRICULUM, BOOKS, PACKAGE_PRICE, LESSONS, QUIZZES,
  BADGES, ZOOM_SESSIONS, STUDENTS, PENDING_APPROVALS, TEACHERS,
  STUDENT_DETAIL, RECENT_UPLOADS, CHANNEL_VIDEOS,
});
