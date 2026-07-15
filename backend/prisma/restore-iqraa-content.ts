import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const academy = {
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

const levels = [
  {
    code: "pre-level",
    title: "المستوى التمهيدي",
    subtitle: "الحروف المجردة وأشكالها",
    color: "primary",
    order: 1,
    chapters: [
      {
        code: "p1",
        title: "الحروف المجردة وأشكالها",
        order: 1,
        lessons: ["تعرف الحروف", "أشكال الحروف في مواضع الكلمة"]
      }
    ]
  },
  {
    code: "level-1",
    title: "المستوى الأول",
    subtitle: "الحركات والمدود والسكون",
    color: "secondary",
    order: 2,
    chapters: [
      {
        code: "c1",
        title: "حركة الفتح والمد بالألف",
        order: 1,
        lessons: ["حركة الفتح", "المد بالألف"]
      },
      {
        code: "c2",
        title: "حركة الكسر والمد بالياء",
        order: 2,
        lessons: ["حركة الكسر", "المد بالياء"]
      },
      {
        code: "c3",
        title: "حركة الضم والمد بالواو",
        order: 3,
        lessons: ["حركة الضم", "المد بالواو"]
      },
      {
        code: "c4",
        title: "السكون",
        order: 4,
        lessons: ["نطق السكون", "التدريب على السكون"]
      }
    ]
  },
  {
    code: "level-2",
    title: "المستوى الثاني",
    subtitle: "التنوين والشدّة ورسم الهمزات",
    color: "accent",
    order: 3,
    chapters: [
      {
        code: "t1",
        title: "أولًا: التنوين بأنواعه الثلاثة",
        order: 1,
        lessons: ["التنوين المفتوح", "التنوين المكسور", "التنوين المضموم"]
      },
      {
        code: "t2",
        title: "ثانيًا: الشدّة بدروسها التسعة",
        order: 2,
        lessons: ["الشدّة مع الفتح/الكسر/الضم", "الشدّة مع المدود الثلاثة", "الشدّة مع التنوين"]
      },
      {
        code: "t3",
        title: "ثالثًا: رسم الهمزات",
        order: 3,
        lessons: ["همزة الوصل", "همزة القطع"]
      }
    ]
  }
];

const lessons = [
  {
    code: "L01",
    title: "حرف الألف — أ",
    description: "تعرّف على الحرف الأول من الحروف الهجائية، شكله ونطقه.",
    duration: "8:24",
    order: 1,
    levelCode: "pre-level",
    chapterCode: "p1"
  },
  {
    code: "L02",
    title: "حرف الباء — ب",
    description: "حرف الباء بنقطته من الأسفل، ومواضعه في الكلمة.",
    duration: "7:50",
    order: 2,
    levelCode: "pre-level",
    chapterCode: "p1"
  },
  {
    code: "L03",
    title: "حرف التاء — ت",
    description: "تمييز التاء عن الثاء، ومواضع كتابتها.",
    duration: "8:10",
    order: 3,
    levelCode: "pre-level",
    chapterCode: "p1"
  },
  {
    code: "L04",
    title: "حركة الفتح",
    description: "تعرف على الحركة الأولى من الحركات الثلاث.",
    duration: "9:15",
    order: 4,
    levelCode: "level-1",
    chapterCode: "c1"
  },
  {
    code: "L05",
    title: "المد بالألف",
    description: "كيف يمد الحرف المفتوح بحرف الألف.",
    duration: "10:02",
    order: 5,
    levelCode: "level-1",
    chapterCode: "c1"
  },
  {
    code: "L06",
    title: "حركة الكسر",
    description: "نطق الحرف المكسور والتدريب عليه.",
    duration: "8:45",
    order: 6,
    levelCode: "level-1",
    chapterCode: "c2"
  },
  {
    code: "L07",
    title: "المد بالياء",
    description: "كيف يمد الحرف المكسور بحرف الياء.",
    duration: "9:30",
    order: 7,
    levelCode: "level-1",
    chapterCode: "c2"
  },
  {
    code: "L08",
    title: "حركة الضم",
    description: "نطق الحرف المضموم وأمثلة عليه.",
    duration: "8:55",
    order: 8,
    levelCode: "level-1",
    chapterCode: "c3"
  }
];

const quizSeeds = {
  L04: {
    title: "مراجعة درس: حركة الفتح",
    questions: [
      {
        type: "MCQ",
        prompt: "شكل حركة الفتح؟",
        options: ["ـَ", "ـِ", "ـُ", "ـْ"],
        answerIndex: 0
      },
      {
        type: "DRAG",
        prompt: "اسحب الحركة الصحيحة فوق الحرف:",
        options: ["ـَ", "ـِ", "ـُ", "ـْ"],
        target: "ب___",
        answerIndex: 0
      }
    ]
  },
  L05: {
    title: "مراجعة درس: المد بالألف",
    questions: [
      {
        type: "MCQ",
        prompt: "ما الحرف الذي يمدّ به الحرف المفتوح؟",
        options: ["الألف", "الياء", "الواو", "الميم"],
        answerIndex: 0
      },
      {
        type: "MCQ",
        prompt: "كم زمن النطق بحرف المد؟",
        options: ["زمن حركة واحدة", "زمن حركتين", "زمن أربع حركات", "بدون زمن"],
        answerIndex: 1
      },
      {
        type: "DRAG",
        prompt: "اسحب الحرف الذي يمدّ به (ـَ) ليصبح مدًا بالألف:",
        options: ["و", "ا", "ي", "ن"],
        target: "ـَ → ـَ ___",
        answerIndex: 1
      },
      {
        type: "MCQ",
        prompt: "أيّ كلمة تحوي مدًا بالألف؟",
        options: ["كَتَبَ", "قَالَ", "كُتُب", "بِنْت"],
        answerIndex: 1
      }
    ]
  }
} as const;

const books = [
  {
    code: "b1",
    title: "دفتر حروف الهجاء",
    subtitle: "",
    color: "var(--grad-1)",
    price: 0,
    level: "المستوى التمهيدي ١",
    soon: false,
    displayOrder: 1
  },
  {
    code: "b2",
    title: "دفتر حروف الهجاء وأشكالها",
    subtitle: "",
    color: "var(--grad-2)",
    price: 0,
    level: "المستوى التمهيدي ٢",
    soon: false,
    displayOrder: 2
  },
  {
    code: "b3",
    title: "كتاب المستوى الأول",
    subtitle: "",
    color: "var(--grad-3)",
    price: 0,
    level: "المستوى الأول",
    soon: false,
    displayOrder: 3
  },
  {
    code: "b4",
    title: "أوراق عمل المستوى الأول",
    subtitle: "",
    color: "linear-gradient(135deg,#6c63ff,#ff5e8a)",
    price: 0,
    level: "المستوى الأول",
    soon: false,
    displayOrder: 4
  },
  {
    code: "b5",
    title: "المستوى الثاني",
    subtitle: "",
    color: "linear-gradient(135deg,#ffc847,#ff7a45)",
    price: 0,
    level: "المستوى الثاني",
    soon: false,
    displayOrder: 5
  },
  {
    code: "b6",
    title: "أوراق عمل المستوى الثاني",
    subtitle: "",
    color: "linear-gradient(135deg,#2bb673,#4aa6ff)",
    price: 0,
    level: "المستوى الثاني",
    soon: false,
    displayOrder: 6
  },
  {
    code: "b7",
    title: "دليل المعلم",
    subtitle: "",
    color: "linear-gradient(135deg,#1f1a3d,#6c63ff)",
    price: 0,
    level: "للمعلم",
    soon: false,
    displayOrder: 7
  },
  {
    code: "b8",
    title: "التجويد الميسر",
    subtitle: "تحت الطبع",
    color: "linear-gradient(135deg,#2bb673,#4aa6ff)",
    price: 0,
    level: "",
    soon: true,
    displayOrder: 8,
    coverPath: "/uploads/catalog-tajweed.jfif"
  }
];

const badges = [
  { code: "b-letters", title: "بطل الحروف", icon: "🎯", desc: "أتقن الحروف المجردة" },
  { code: "b-fath", title: "نجم الفتح", icon: "⭐", desc: "أتم درس حركة الفتح" },
  { code: "b-streak", title: "مواظب", icon: "🔥", desc: "حضور 7 أيام متتالية" },
  { code: "b-mad", title: "أمير المدود", icon: "🌊", desc: "إتقان المدود الثلاثة" },
  { code: "b-quran", title: "صاحب القرآن", icon: "📖", desc: "حفظ أول جزء من القرآن" },
  { code: "b-perfect", title: "العلامة الكاملة", icon: "💯", desc: "100% في خمسة كويزات" }
];

const channelVideos = [
  { code: "v1", title: "افتتاح قناة الكُتَّاب — مناهج اقرأ ورتل", views: "12K", duration: "2:48", youtubeId: null, placement: "library" },
  { code: "v2", title: "كيف يبدأ تأسيس طفلك في اللغة العربية؟", views: "8.5K", duration: "5:12", youtubeId: null, placement: "library" },
  { code: "v3", title: "محتويات حقيبة مناهج اقرأ ورتل", views: "6.1K", duration: "4:30", youtubeId: null, placement: "library" },
  { code: "v4", title: "نموذج من شرح الحروف للأطفال", views: "9.7K", duration: "6:18", youtubeId: null, placement: "library" },
  { code: "video-testimonials", title: "قالوا عن المنهج", views: null, duration: null, youtubeId: "ZMCmG-N7_Gs", placement: "testimonials" },
  { code: "video-bag", title: "محتويات الحقيبة والكتب", views: null, duration: null, youtubeId: "IfI31N2bhHA", placement: "bag" },
  { code: "video-outcomes", title: "ثمرة مناهج اقرأ ورتل", views: null, duration: null, youtubeId: "EkaqnwrdUo0", placement: "outcomes" }
];

async function restoreAcademySettings() {
  await prisma.academySettings.upsert({
    where: { id: "default" },
    update: academy,
    create: { id: "default", ...academy }
  });
}

async function restoreCurriculum() {
  const levelIds = new Map<string, string>();
  const chapterIds = new Map<string, string>();

  for (const level of levels) {
    const savedLevel = await prisma.curriculumLevel.upsert({
      where: { code: level.code },
      update: {
        title: level.title,
        subtitle: level.subtitle,
        color: level.color,
        order: level.order
      },
      create: {
        code: level.code,
        title: level.title,
        subtitle: level.subtitle,
        color: level.color,
        order: level.order
      }
    });
    levelIds.set(level.code, savedLevel.id);

    for (const chapter of level.chapters) {
      const savedChapter = await prisma.chapter.upsert({
        where: { code: chapter.code },
        update: {
          title: chapter.title,
          order: chapter.order,
          levelId: savedLevel.id
        },
        create: {
          code: chapter.code,
          title: chapter.title,
          order: chapter.order,
          levelId: savedLevel.id
        }
      });
      chapterIds.set(chapter.code, savedChapter.id);
    }
  }

  for (const lesson of lessons) {
    const levelId = levelIds.get(lesson.levelCode);
    const chapterId = chapterIds.get(lesson.chapterCode);
    if (!levelId) throw new Error(`Missing level ${lesson.levelCode}`);

    await prisma.lesson.upsert({
      where: { code: lesson.code },
      update: {
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        order: lesson.order,
        published: true,
        levelId,
        chapterId: chapterId || null
      },
      create: {
        code: lesson.code,
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        youtubeId: null,
        order: lesson.order,
        published: true,
        levelId,
        chapterId: chapterId || null
      }
    });
  }

  for (const [lessonCode, seed] of Object.entries(quizSeeds)) {
    const lesson = await prisma.lesson.findUniqueOrThrow({ where: { code: lessonCode } });
    const quiz = await prisma.quiz.upsert({
      where: { lessonId: lesson.id },
      update: { title: seed.title, status: "PUBLISHED" },
      create: { title: seed.title, status: "PUBLISHED", lessonId: lesson.id }
    });

    await prisma.quizQuestion.deleteMany({ where: { quizId: quiz.id } });
    await prisma.quizQuestion.createMany({
      data: seed.questions.map((question, index) => ({
        quizId: quiz.id,
        type: question.type,
        prompt: question.prompt,
        options: question.options,
        target: "target" in question ? question.target : null,
        answerIndex: question.answerIndex,
        order: index + 1
      }))
    });
  }
}

async function restoreBooks() {
  for (const book of books) {
    await prisma.book.upsert({
      where: { code: book.code },
      update: {
        title: book.title,
        subtitle: book.subtitle,
        color: book.color,
        price: book.price,
        level: book.level,
        soon: book.soon,
        displayOrder: book.displayOrder,
        coverPath: book.coverPath
      },
      create: {
        ...book,
        coverPath: book.coverPath || null,
        filePath: null,
        externalUrl: null
      }
    });
  }
}

async function restoreBadges() {
  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { code: badge.code },
      update: {
        title: badge.title,
        icon: badge.icon,
        desc: badge.desc
      },
      create: badge
    });
  }
}

async function restoreChannelVideos() {
  for (const video of channelVideos) {
    await prisma.channelVideo.upsert({
      where: { code: video.code },
      update: {
        title: video.title,
        views: video.views,
        duration: video.duration,
        youtubeId: video.youtubeId,
        placement: video.placement
      },
      create: video
    });
  }
}

async function main() {
  await restoreAcademySettings();
  await restoreCurriculum();
  await restoreBooks();
  await restoreBadges();
  await restoreChannelVideos();

  console.log("Iqraa project content restored: academy settings, curriculum, lessons, quizzes, books, badges, and channel video titles.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
