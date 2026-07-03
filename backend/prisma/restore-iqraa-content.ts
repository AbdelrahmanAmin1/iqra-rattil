import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const academy = {
  name: "مناهج اقرأ ورتّل",
  tagline: "أكاديمية تأسيس اللغة العربية والقرآن الكريم",
  project: "مشروع الحافظ الصغير",
  channel: "قناة الكُتَّاب — مناهج اقرأ ورتل",
  author: "د/ عبد الرحمن عبد الباقي",
  description:
    "منهج يؤهّل الطالب لقراءة اللغة العربية قراءة صحيحة متقنة بطريقة سهلة مبسطة وفي فترة زمنية قصيرة؛ ينتقل بعدها للقراءة الصحيحة من المصحف الشريف، ثم لحفظ القرآن الكريم بمنهج منضبط بخطة زمنية مدروسة.",
  phone: "0593781376",
  whatsapp: "0593781376",
  emails: ["kttababdelbaky@gmail.com", "boda2010100@gmail.com"],
  countries: ["مصر", "السعودية", "الكويت"],
  modes: ["أون لاين", "حضوري"],
  groups: ["حلقات البنين", "حلقات البنات"],
  schedule: "ثلاثة أيام في الأسبوع",
  packagePrice: 480
};

const levels = [
  {
    code: "level-1",
    title: "المستوى الأول",
    subtitle: "الجزء الأول الخاص بالقراءة",
    color: "primary",
    order: 1,
    chapters: [
      {
        code: "c1",
        title: "الباب الأول: الحروف المجردة ورسمها",
        order: 1,
        lessons: ["الحروف المجردة وأسماؤها", "رسم الحرف في مواضع الكلمة"]
      },
      {
        code: "c2",
        title: "الباب الثاني: حركة الفتح والمد بالألف",
        order: 2,
        lessons: ["حركة الفتح والتدريبات عليها", "المد بالألف والتدريبات عليه"]
      },
      {
        code: "c3",
        title: "الباب الثالث: حركة الكسر والمد بالياء",
        order: 3,
        lessons: ["حركة الكسر والتدريبات عليها", "المد بالياء والتدريبات عليه"]
      },
      {
        code: "c4",
        title: "الباب الرابع: حركة الضم والمد بالواو",
        order: 4,
        lessons: ["حركة الضم والتدريبات عليها", "المد بالواو والتدريبات عليه"]
      },
      {
        code: "c5",
        title: "الباب الخامس: علامة السكون",
        order: 5,
        lessons: ["كيفية نطق السكون والتدريبات عليه", "أمثلة قرآنية على رسم السكون العثماني"]
      }
    ]
  },
  {
    code: "level-2",
    title: "المستوى الثاني",
    subtitle: "التنوين والشدّة ورسم الهمزات",
    color: "secondary",
    order: 2,
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
        title: "ثالثًا: همزة الوصل",
        order: 3,
        lessons: ["اللام الشمسية والقمرية", "همزة الوصل في الأسماء", "همزة الوصل في الأفعال"]
      },
      {
        code: "t4",
        title: "رابعًا: همزة القطع",
        order: 4,
        lessons: ["رسمها أول الكلمة", "رسمها وسط الكلمة", "رسمها آخر الكلمة"]
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
    levelCode: "level-1",
    chapterCode: "c1"
  },
  {
    code: "L02",
    title: "حرف الباء — ب",
    description: "حرف الباء بنقطته من الأسفل، ومواضعه في الكلمة.",
    duration: "7:50",
    order: 2,
    levelCode: "level-1",
    chapterCode: "c1"
  },
  {
    code: "L03",
    title: "حرف التاء — ت",
    description: "تمييز التاء عن الثاء، ومواضع كتابتها.",
    duration: "8:10",
    order: 3,
    levelCode: "level-1",
    chapterCode: "c1"
  },
  {
    code: "L04",
    title: "حركة الفتح",
    description: "تعرف على الحركة الأولى من الحركات الثلاث.",
    duration: "9:15",
    order: 4,
    levelCode: "level-1",
    chapterCode: "c2"
  },
  {
    code: "L05",
    title: "المد بالألف",
    description: "كيف يمد الحرف المفتوح بحرف الألف.",
    duration: "10:02",
    order: 5,
    levelCode: "level-1",
    chapterCode: "c2"
  },
  {
    code: "L06",
    title: "حركة الكسر",
    description: "نطق الحرف المكسور والتدريب عليه.",
    duration: "8:45",
    order: 6,
    levelCode: "level-1",
    chapterCode: "c3"
  },
  {
    code: "L07",
    title: "المد بالياء",
    description: "كيف يمد الحرف المكسور بحرف الياء.",
    duration: "9:30",
    order: 7,
    levelCode: "level-1",
    chapterCode: "c3"
  },
  {
    code: "L08",
    title: "حركة الضم",
    description: "نطق الحرف المضموم وأمثلة عليه.",
    duration: "8:55",
    order: 8,
    levelCode: "level-1",
    chapterCode: "c4"
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
    title: "كتاب المستوى الأول",
    subtitle: "الجزء الأول للقراءة",
    color: "var(--grad-1)",
    price: 90,
    level: "أساسي",
    soon: false
  },
  {
    code: "b2",
    title: "كتاب المستوى الثاني",
    subtitle: "التنوين والشدة والهمزات",
    color: "var(--grad-2)",
    price: 90,
    level: "متوسط",
    soon: false
  },
  {
    code: "b3",
    title: "دفتر الحروف المجردة",
    subtitle: "أوراق عمل المستوى الأول",
    color: "var(--grad-3)",
    price: 60,
    level: "تطبيق",
    soon: false
  },
  {
    code: "b4",
    title: "دفتر أشكال الحروف",
    subtitle: "أوراق عمل المستوى الأول",
    color: "linear-gradient(135deg,#6c63ff,#ff5e8a)",
    price: 60,
    level: "تطبيق",
    soon: false
  },
  {
    code: "b5",
    title: "الحركات والمدود والسكون",
    subtitle: "أوراق عمل المستوى الأول",
    color: "linear-gradient(135deg,#ffc847,#ff7a45)",
    price: 60,
    level: "تطبيق",
    soon: false
  },
  {
    code: "b6",
    title: "أوراق عمل المستوى الثاني",
    subtitle: "التنوين والشدة ورسم الهمزات",
    color: "linear-gradient(135deg,#2bb673,#4aa6ff)",
    price: 60,
    level: "تطبيق",
    soon: false
  },
  {
    code: "b7",
    title: "دليل المعلم",
    subtitle: "إرشادات وتوجيهات تربوية",
    color: "linear-gradient(135deg,#1f1a3d,#6c63ff)",
    price: 80,
    level: "للمعلم",
    soon: false
  },
  {
    code: "b8",
    title: "التجويد الميسر للأطفال",
    subtitle: "تحت الطبع — قريبًا",
    color: "linear-gradient(135deg,#b08a3e,#2e7d5b)",
    price: 100,
    level: "تجويد",
    soon: true
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
  { code: "v1", title: "افتتاح قناة الكُتَّاب — مناهج اقرأ ورتل", views: "12K", duration: "2:48" },
  { code: "v2", title: "كيف يبدأ تأسيس طفلك في اللغة العربية؟", views: "8.5K", duration: "5:12" },
  { code: "v3", title: "محتويات حقيبة مناهج اقرأ ورتل", views: "6.1K", duration: "4:30" },
  { code: "v4", title: "نموذج من شرح الحروف للأطفال", views: "9.7K", duration: "6:18" }
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
        soon: book.soon
      },
      create: {
        ...book,
        coverPath: null,
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
        duration: video.duration
      },
      create: {
        ...video,
        youtubeId: null
      }
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
