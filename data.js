export const ACADEMY = {
  name: "مناهج اقرأ ورتّل",
  tagline: "أكاديمية تأسيس اللغة العربية والقرآن الكريم",
  project: "مشروع الحافظ الصغير",
  channel: "قناة الكُتَّاب — مناهج اقرأ ورتل",
  author: "د/ عبدالرحمن عبدالباقي",
  description:
    "منهج يؤهّل الطالب لقراءة اللغة العربية قراءة صحيحة متقنة بطريقة سهلة مبسطة وفي فترة زمنية قصيرة؛ ينتقل بعدها للقراءة الصحيحة من المصحف الشريف، ثم لحفظ القرآن الكريم بمنهج منضبط بخطة زمنية مدروسة.",
  phone: "0593781376",
  whatsapp: "0593781376",
  emails: ["kttababdelbaky@gmail.com", "boda2010100@gmail.com"],
  countries: [],
  modes: ["أون لاين", "حضوري"],
  groups: ["حلقات البنين", "حلقات البنات"],
  schedule: "سلسلة لتعليم القراءة والكتابة والإملاء وتحسين الخط وحفظ القرآن الكريم",
  packagePrice: 0
};

export const CURRICULUM = [
  {
    id: "pre-level",
    title: "المستوى التمهيدي",
    subtitle: "الحروف المجردة وأشكالها",
    color: "primary",
    chapters: [
      { id: "p1", title: "الحروف المجردة وأشكالها", lessons: ["تعرف الحروف", "أشكال الحروف في مواضع الكلمة"] }
    ]
  },
  {
    id: "level-1",
    title: "المستوى الأول",
    subtitle: "الحركات والمدود والسكون",
    color: "secondary",
    chapters: [
      { id: "c1", title: "حركة الفتح والمد بالألف", lessons: ["حركة الفتح", "المد بالألف"] },
      { id: "c2", title: "حركة الكسر والمد بالياء", lessons: ["حركة الكسر", "المد بالياء"] },
      { id: "c3", title: "حركة الضم والمد بالواو", lessons: ["حركة الضم", "المد بالواو"] },
      { id: "c4", title: "السكون", lessons: ["نطق السكون", "التدريب على السكون"] }
    ]
  },
  {
    id: "level-2",
    title: "المستوى الثاني",
    subtitle: "التنوين والشدّة ورسم الهمزات",
    color: "accent",
    chapters: [
      { id: "t1", title: "أولًا: التنوين بأنواعه الثلاثة", lessons: ["التنوين المفتوح", "التنوين المكسور", "التنوين المضموم"] },
      { id: "t2", title: "ثانيًا: الشدّة بدروسها التسعة", lessons: ["الشدّة مع الفتح/الكسر/الضم", "الشدّة مع المدود الثلاثة", "الشدّة مع التنوين"] },
      { id: "t3", title: "ثالثًا: رسم الهمزات", lessons: ["همزة الوصل", "همزة القطع"] }
    ]
  }
];

export const BOOKS = [
  { id: "b1", title: "دفتر حروف الهجاء", subtitle: "", color: "var(--grad-1)", level: "المستوى التمهيدي ١", displayOrder: 1 },
  { id: "b2", title: "دفتر حروف الهجاء وأشكالها", subtitle: "", color: "var(--grad-2)", level: "المستوى التمهيدي ٢", displayOrder: 2 },
  { id: "b3", title: "كتاب المستوى الأول", subtitle: "", color: "var(--grad-3)", level: "المستوى الأول", displayOrder: 3 },
  { id: "b4", title: "أوراق عمل المستوى الأول", subtitle: "", color: "linear-gradient(135deg,#6c63ff,#ff5e8a)", level: "المستوى الأول", displayOrder: 4 },
  { id: "b5", title: "المستوى الثاني", subtitle: "", color: "linear-gradient(135deg,#ffc847,#ff7a45)", level: "المستوى الثاني", displayOrder: 5 },
  { id: "b6", title: "أوراق عمل المستوى الثاني", subtitle: "", color: "linear-gradient(135deg,#2bb673,#4aa6ff)", level: "المستوى الثاني", displayOrder: 6 },
  { id: "b7", title: "دليل المعلم", subtitle: "", color: "linear-gradient(135deg,#1f1a3d,#6c63ff)", level: "للمعلم", displayOrder: 7 },
  { id: "b8", title: "التجويد الميسر", subtitle: "تحت الطبع", color: "linear-gradient(135deg,#2bb673,#4aa6ff)", level: "", soon: true, displayOrder: 8 },
];

export const CHANNEL_VIDEOS = [
  { id: "v1", title: "افتتاح قناة الكُتَّاب — مناهج اقرأ ورتل", views: "12K", duration: "2:48", placement: "library" },
  { id: "v2", title: "كيف يبدأ تأسيس طفلك في اللغة العربية؟", views: "8.5K", duration: "5:12", placement: "library" },
  { id: "v3", title: "محتويات حقيبة مناهج اقرأ ورتل", views: "6.1K", duration: "4:30", placement: "library" },
  { id: "v4", title: "نموذج من شرح الحروف للأطفال", views: "9.7K", duration: "6:18", placement: "library" },
  { id: "video-testimonials", title: "قالوا عن المنهج", youtubeId: "ZMCmG-N7_Gs", placement: "testimonials" },
  { id: "video-bag", title: "محتويات الحقيبة والكتب", youtubeId: "IfI31N2bhHA", placement: "bag" },
  { id: "video-outcomes", title: "ثمرة مناهج اقرأ ورتل", youtubeId: "EkaqnwrdUo0", placement: "outcomes" }
];

export const BADGES = [
  { id: "b-letters", title: "بطل الحروف", icon: "🎯", desc: "أتقن الحروف المجردة" },
  { id: "b-fath", title: "نجم الفتح", icon: "⭐", desc: "أتم درس حركة الفتح" },
  { id: "b-streak", title: "مواظب", icon: "🔥", desc: "حضور 7 أيام متتالية" },
  { id: "b-mad", title: "أمير المدود", icon: "🌊", desc: "إتقان المدود الثلاثة" },
  { id: "b-quran", title: "صاحب القرآن", icon: "📖", desc: "حفظ أول جزء من القرآن" },
  { id: "b-perfect", title: "العلامة الكاملة", icon: "💯", desc: "100% في خمسة كويزات" }
];

export const LETTERS = ["ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ"];
