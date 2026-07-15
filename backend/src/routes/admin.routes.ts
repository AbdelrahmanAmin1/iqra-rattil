import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { authenticate, authorize } from "../middlewares/auth.js";
import { validateBody, validateQuery } from "../middlewares/validate.js";
import { env } from "../config/env.js";
import { prisma } from "../prisma.js";
import { hashPassword } from "../services/auth.service.js";
import { notificationService } from "../services/notification.service.js";
import { emitContentUpdated } from "../services/realtime.service.js";
import { storageService } from "../services/storage.service.js";
import { HttpError, ok } from "../utils/http.js";

export const adminRouter = Router();

adminRouter.use(authenticate, authorize("ADMIN"));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.MAX_UPLOAD_SIZE_MB * 1024 * 1024 }
});

const mapUser = (user: any) => ({
  id: user.id,
  name: user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role.toLowerCase(),
  status: user.status.toLowerCase(),
  age: user.studentProfile?.age,
  level: user.studentProfile?.level,
  stars: user.studentProfile?.stars,
  specialty: user.teacherProfile?.specialty,
  experienceYears: user.teacherProfile?.experienceYears,
  rating: user.teacherProfile?.rating,
  teacherId: user.studentProfile?.teacherId,
  bio: user.teacherProfile?.bio
});

const mapBook = (book: any) => ({
  id: book.id,
  code: book.code,
  title: book.title,
  subtitle: book.subtitle,
  color: book.color,
  level: book.level,
  soon: book.soon,
  displayOrder: book.displayOrder,
  coverPath: book.coverPath,
  filePath: book.filePath,
  externalUrl: book.externalUrl,
  createdAt: book.createdAt,
  updatedAt: book.updatedAt
});

const mapVideo = (video: any) => ({
  id: video.id,
  code: video.code,
  title: video.title,
  views: video.views,
  duration: video.duration,
  youtubeId: video.youtubeId,
  placement: video.placement,
  createdAt: video.createdAt,
  updatedAt: video.updatedAt
});

const boolish = z.preprocess((value) => {
  if (value === "true" || value === true) return true;
  if (value === "false" || value === false) return false;
  return value;
}, z.boolean());

const optionalUrl = z.string().url().optional().or(z.literal(""));

adminRouter.get("/dashboard", async (_req, res, next) => {
  try {
    const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dayStarts = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      return date;
    });
    const [students, teachers, sessions, monthlySessions, orders, pending, topStudents, levelDistribution, settings, recentApprovals] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT", status: "ACTIVE" } }),
      prisma.user.count({ where: { role: "TEACHER", status: "ACTIVE" } }),
      prisma.classSession.count(),
      prisma.classSession.count({ where: { createdAt: { gte: since30 } } }),
      prisma.orderRequest.count({ where: { status: "NEW" } }),
      prisma.user.count({ where: { status: "PENDING" } }),
      prisma.user.findMany({
        where: { role: "STUDENT", status: "ACTIVE" },
        include: { studentProfile: true },
        orderBy: { studentProfile: { stars: "desc" } },
        take: 5
      }),
      prisma.studentProfile.groupBy({ by: ["level"], _count: { _all: true } }),
      prisma.academySettings.findUnique({ where: { id: "default" } }),
      prisma.user.findMany({
        where: { status: "PENDING" },
        include: { studentProfile: true, teacherProfile: true },
        orderBy: { createdAt: "desc" },
        take: 5
      })
    ]);
    const activity = await Promise.all(
      dayStarts.map(async (start) => {
        const end = new Date(start);
        end.setDate(end.getDate() + 1);
        const [newStudents, newTeachers, classSessions, quizAttempts] = await Promise.all([
          prisma.user.count({ where: { role: "STUDENT", createdAt: { gte: start, lt: end } } }),
          prisma.user.count({ where: { role: "TEACHER", createdAt: { gte: start, lt: end } } }),
          prisma.classSession.count({ where: { createdAt: { gte: start, lt: end } } }),
          prisma.quizAttempt.count({ where: { createdAt: { gte: start, lt: end } } })
        ]);
        return {
          date: start.toISOString().slice(0, 10),
          newStudents,
          newTeachers,
          sessions: classSessions,
          quizzes: quizAttempts
        };
      })
    );
    res.json(
      ok({
        totals: {
          students,
          teachers,
          sessions,
          monthlySessions,
          orders,
          pending,
          packagePrice: settings?.packagePrice || 0
        },
        activity,
        levelDistribution: levelDistribution.map((item) => ({
          level: item.level || "غير محدد",
          count: item._count._all
        })),
        recentApprovals: recentApprovals.map(mapUser),
        topStudents: topStudents.map(mapUser)
      })
    );
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/approvals", async (_req, res, next) => {
  try {
    const approvals = await prisma.user.findMany({
      where: { status: "PENDING" },
      include: { studentProfile: true, teacherProfile: true },
      orderBy: { createdAt: "desc" }
    });
    res.json(ok({ approvals: approvals.map(mapUser) }));
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/approvals/:userId/approve", async (req, res, next) => {
  try {
    const target = await prisma.user.findUnique({ where: { id: req.params.userId } });
    if (!target) throw new HttpError(404, "USER_NOT_FOUND", "لم يتم العثور على المستخدم");
    const user = await prisma.user.update({
      where: { id: req.params.userId },
      data: {
        status: "ACTIVE",
        approvedAt: new Date(),
        approvedById: req.user!.id,
        teacherProfile:
          target.role === "TEACHER"
            ? { update: { approvedAt: new Date() } }
            : undefined
      },
      include: { studentProfile: true, teacherProfile: true }
    });
    await notificationService.create({
      recipientId: user.id,
      actorId: req.user!.id,
      type: "account.approved",
      title: "تم تفعيل حسابك",
      body: "وافق المشرف على طلب الانضمام ويمكنك تسجيل الدخول الآن.",
      link: "/login"
    });
    res.json(ok({ user: mapUser(user), message: "تم قبول الطلب" }));
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/approvals/:userId/reject", async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.userId },
      data: { status: "REJECTED", approvedById: req.user!.id },
      include: { studentProfile: true, teacherProfile: true }
    });
    await notificationService.create({
      recipientId: user.id,
      actorId: req.user!.id,
      type: "account.rejected",
      title: "تم رفض طلب الانضمام",
      body: "راجع بياناتك أو تواصل مع إدارة الأكاديمية.",
      link: "/login"
    });
    res.json(ok({ user: mapUser(user), message: "تم رفض الطلب" }));
  } catch (error) {
    next(error);
  }
});

const usersQuery = z.object({
  role: z.enum(["student", "teacher", "admin"]).optional()
});

adminRouter.get("/users", validateQuery(usersQuery), async (req, res, next) => {
  try {
    const query = res.locals.query as z.infer<typeof usersQuery>;
    const role = query.role ? query.role.toUpperCase() : undefined;
    const users = await prisma.user.findMany({
      where: role ? { role: role as any } : {},
      include: { studentProfile: true, teacherProfile: true },
      orderBy: { createdAt: "desc" }
    });
    res.json(ok({ users: users.map(mapUser) }));
  } catch (error) {
    next(error);
  }
});

const adminUserSchema = z.object({
  role: z.enum(["student", "teacher", "admin"]),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().or(z.literal("")),
  password: z.string().min(6).optional(),
  status: z.enum(["active", "pending", "rejected", "suspended"]).optional(),
  age: z.coerce.number().int().min(3).max(100).optional(),
  level: z.string().optional(),
  studyMode: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  teacherId: z.string().optional().or(z.literal("")),
  specialty: z.string().optional(),
  experienceYears: z.coerce.number().int().min(0).max(70).optional(),
  bio: z.string().optional()
});

const roleMap = { student: "STUDENT", teacher: "TEACHER", admin: "ADMIN" } as const;
const statusMap = { active: "ACTIVE", pending: "PENDING", rejected: "REJECTED", suspended: "SUSPENDED" } as const;

adminRouter.post("/users", validateBody(adminUserSchema.extend({ password: z.string().min(6) })), async (req, res, next) => {
  try {
    const body = req.body as z.infer<typeof adminUserSchema> & { password: string };
    const existing = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (existing) throw new HttpError(409, "EMAIL_EXISTS", "هذا البريد مستخدم بالفعل");

    const role = roleMap[body.role];
    const user = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        passwordHash: await hashPassword(body.password),
        fullName: body.fullName,
        phone: body.phone || null,
        role,
        status: body.status ? statusMap[body.status] : "ACTIVE",
        avatarColor: role === "TEACHER" ? "var(--grad-3)" : role === "ADMIN" ? "var(--grad-2)" : "var(--grad-1)",
        studentProfile:
          role === "STUDENT"
            ? {
                create: {
                  age: body.age,
                  level: body.level || null,
                  studyMode: body.studyMode || null,
                  parentName: body.parentName || null,
                  parentPhone: body.parentPhone || null,
                  teacherId: body.teacherId || null
                }
              }
            : undefined,
        teacherProfile:
          role === "TEACHER"
            ? {
                create: {
                  specialty: body.specialty || null,
                  experienceYears: body.experienceYears,
                  bio: body.bio || null,
                  approvedAt: body.status === "active" || !body.status ? new Date() : null
                }
              }
            : undefined
      },
      include: { studentProfile: true, teacherProfile: true }
    });
    res.status(201).json(ok({ user: mapUser(user), message: "تم إنشاء المستخدم" }));
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/users/:id", validateBody(adminUserSchema.partial()), async (req, res, next) => {
  try {
    const target = await prisma.user.findUnique({
      where: { id: String(req.params.id) },
      include: { studentProfile: true, teacherProfile: true }
    });
    if (!target) throw new HttpError(404, "USER_NOT_FOUND", "لم يتم العثور على المستخدم");
    const body = req.body as z.infer<typeof adminUserSchema>;
    const passwordHash = body.password ? await hashPassword(body.password) : undefined;

    const user = await prisma.user.update({
      where: { id: target.id },
      data: {
        fullName: body.fullName,
        email: body.email?.toLowerCase(),
        phone: body.phone === "" ? null : body.phone,
        status: body.status ? statusMap[body.status] : undefined,
        passwordHash,
        studentProfile:
          target.role === "STUDENT"
            ? {
                upsert: {
                  update: {
                    age: body.age,
                    level: body.level,
                    studyMode: body.studyMode,
                    parentName: body.parentName,
                    parentPhone: body.parentPhone,
                    teacherId: body.teacherId === "" ? null : body.teacherId
                  },
                  create: {
                    age: body.age,
                    level: body.level,
                    studyMode: body.studyMode,
                    parentName: body.parentName,
                    parentPhone: body.parentPhone,
                    teacherId: body.teacherId || null
                  }
                }
              }
            : undefined,
        teacherProfile:
          target.role === "TEACHER"
            ? {
                upsert: {
                  update: {
                    specialty: body.specialty,
                    experienceYears: body.experienceYears,
                    bio: body.bio,
                    approvedAt: body.status === "active" ? new Date() : undefined
                  },
                  create: {
                    specialty: body.specialty,
                    experienceYears: body.experienceYears,
                    bio: body.bio,
                    approvedAt: body.status === "active" ? new Date() : null
                  }
                }
              }
            : undefined
      },
      include: { studentProfile: true, teacherProfile: true }
    });
    res.json(ok({ user: mapUser(user), message: "تم تحديث المستخدم" }));
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/users/:id", async (req, res, next) => {
  try {
    if (req.params.id === req.user!.id) throw new HttpError(400, "CANNOT_DELETE_SELF", "لا يمكنك حذف حسابك الحالي");
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json(ok({ success: true }));
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/content", async (_req, res, next) => {
  try {
    const [levels, lessons, quizzes, books, materials, videos] = await Promise.all([
      prisma.curriculumLevel.findMany({
        include: { chapters: { include: { lessons: true }, orderBy: { order: "asc" } } },
        orderBy: { order: "asc" }
      }),
      prisma.lesson.count(),
      prisma.quiz.count(),
      prisma.book.findMany({ orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] }),
      prisma.material.count(),
      prisma.channelVideo.findMany({ orderBy: { code: "asc" } })
    ]);
    res.json(ok({ levels, lessons, quizzes, books: books.map(mapBook), materials, videos: videos.map(mapVideo) }));
  } catch (error) {
    next(error);
  }
});

const contentNotice = async (actorId: string, title: string, body?: string) => {
  await Promise.all([
    notificationService.createForRole("STUDENT", {
      actorId,
      type: "content.updated",
      title,
      body,
      link: "/student/books"
    }),
    notificationService.createForRole("TEACHER", {
      actorId,
      type: "content.updated",
      title,
      body,
      link: "/teacher"
    })
  ]);
  emitContentUpdated({ title, body, updatedAt: new Date().toISOString() });
};

const findBook = async (idOrCode: string) => {
  const book = await prisma.book.findFirst({ where: { OR: [{ id: idOrCode }, { code: idOrCode }] } });
  if (!book) throw new HttpError(404, "BOOK_NOT_FOUND", "لم يتم العثور على الكتاب");
  return book;
};

const bookSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional().or(z.literal("")),
  color: z.string().optional().or(z.literal("")),
  level: z.string().optional().or(z.literal("")),
  soon: boolish.default(false),
  externalUrl: optionalUrl
});

adminRouter.get("/books", async (_req, res, next) => {
  try {
    const books = await prisma.book.findMany({ orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] });
    res.json(ok({ books: books.map(mapBook) }));
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/books", upload.fields([{ name: "cover", maxCount: 1 }, { name: "file", maxCount: 1 }]), async (req, res, next) => {
  try {
    const body = bookSchema.parse(req.body);
    const files = req.files as Record<string, Express.Multer.File[]>;
    const cover = files?.cover?.[0] ? await storageService.saveFile(files.cover[0]) : null;
    const file = files?.file?.[0] ? await storageService.saveFile(files.file[0]) : null;
    const lastBook = await prisma.book.aggregate({ _max: { displayOrder: true } });
    const book = await prisma.book.create({
      data: {
        code: `book-${Date.now()}`,
        title: body.title,
        subtitle: body.subtitle || null,
        color: body.color || null,
        price: 0,
        level: body.level || null,
        soon: body.soon,
        displayOrder: (lastBook._max.displayOrder || 0) + 1,
        externalUrl: body.soon ? null : body.externalUrl || null,
        coverPath: cover?.publicPath || null,
        filePath: body.soon ? null : file?.publicPath || null
      }
    });
    await contentNotice(req.user!.id, "تمت إضافة كتاب جديد", book.title);
    res.status(201).json(ok({ book: mapBook(book), message: "تم إنشاء الكتاب" }));
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/books/:id", upload.fields([{ name: "cover", maxCount: 1 }, { name: "file", maxCount: 1 }]), async (req, res, next) => {
  try {
    const existing = await findBook(String(req.params.id));
    const body = bookSchema.partial().parse(req.body);
    const files = req.files as Record<string, Express.Multer.File[]>;
    const cover = files?.cover?.[0] ? await storageService.saveFile(files.cover[0]) : null;
    const file = files?.file?.[0] ? await storageService.saveFile(files.file[0]) : null;
    const isSoon = body.soon ?? existing.soon;
    const book = await prisma.book.update({
      where: { id: existing.id },
      data: {
        title: body.title,
        subtitle: body.subtitle === "" ? null : body.subtitle,
        color: body.color === "" ? null : body.color,
        price: 0,
        level: body.level === "" ? null : body.level,
        soon: isSoon,
        externalUrl: isSoon ? null : body.externalUrl === "" ? null : body.externalUrl,
        coverPath: cover?.publicPath,
        filePath: isSoon ? null : file?.publicPath
      }
    });
    await contentNotice(req.user!.id, "تم تحديث كتاب", book.title);
    res.json(ok({ book: mapBook(book), message: "تم تحديث الكتاب" }));
  } catch (error) {
    next(error);
  }
});

const bookMoveSchema = z.object({ direction: z.enum(["up", "down"]) });

adminRouter.post("/books/:id/move", async (req, res, next) => {
  try {
    const existing = await findBook(req.params.id);
    const { direction } = bookMoveSchema.parse(req.body);
    const books = await prisma.book.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }]
    });
    const index = books.findIndex((book) => book.id === existing.id);
    const neighbor = books[direction === "up" ? index - 1 : index + 1];

    if (!neighbor) {
      return res.json(ok({ book: mapBook(existing), moved: false }));
    }

    const [book] = await prisma.$transaction([
      prisma.book.update({ where: { id: existing.id }, data: { displayOrder: neighbor.displayOrder } }),
      prisma.book.update({ where: { id: neighbor.id }, data: { displayOrder: existing.displayOrder } })
    ]);
    await contentNotice(req.user!.id, "تم تغيير ترتيب الكتب", book.title);
    res.json(ok({ book: mapBook(book), moved: true }));
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/books/:id", async (req, res, next) => {
  try {
    const existing = await findBook(req.params.id);
    await prisma.$transaction([
      prisma.book.delete({ where: { id: existing.id } }),
      prisma.book.updateMany({
        where: { displayOrder: { gt: existing.displayOrder } },
        data: { displayOrder: { decrement: 1 } }
      })
    ]);
    await contentNotice(req.user!.id, "تم حذف كتاب", existing.title);
    res.json(ok({ success: true }));
  } catch (error) {
    next(error);
  }
});

const videoSchema = z.object({
  code: z.string().optional().or(z.literal("")),
  title: z.string().min(2),
  views: z.string().optional().or(z.literal("")),
  duration: z.string().optional().or(z.literal("")),
  youtubeId: z.string().optional().or(z.literal("")),
  youtubeUrl: z.string().optional().or(z.literal("")),
  placement: z.enum(["testimonials", "bag", "outcomes", "library"]).default("library")
});

const extractYoutubeId = (value?: string | null) => {
  if (!value) return null;
  const trimmed = value.trim();
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/);
  return match?.[1] || trimmed;
};

const findVideo = async (idOrCode: string) => {
  const video = await prisma.channelVideo.findFirst({ where: { OR: [{ id: idOrCode }, { code: idOrCode }] } });
  if (!video) throw new HttpError(404, "VIDEO_NOT_FOUND", "لم يتم العثور على الفيديو");
  return video;
};

adminRouter.get("/channel-videos", async (_req, res, next) => {
  try {
    const videos = await prisma.channelVideo.findMany({ orderBy: [{ placement: "asc" }, { code: "asc" }] });
    res.json(ok({ videos: videos.map(mapVideo) }));
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/channel-videos", validateBody(videoSchema), async (req, res, next) => {
  try {
    const video = await prisma.channelVideo.create({
      data: {
        code: req.body.code || `video-${Date.now()}`,
        title: req.body.title,
        views: req.body.views || null,
        duration: req.body.duration || null,
        youtubeId: extractYoutubeId(req.body.youtubeUrl || req.body.youtubeId),
        placement: req.body.placement
      }
    });
    await contentNotice(req.user!.id, "تمت إضافة فيديو جديد", video.title);
    res.status(201).json(ok({ video: mapVideo(video), message: "تم إنشاء الفيديو" }));
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/channel-videos/:id", validateBody(videoSchema.partial()), async (req, res, next) => {
  try {
    const existing = await findVideo(String(req.params.id));
    const video = await prisma.channelVideo.update({
      where: { id: existing.id },
      data: {
        code: req.body.code || undefined,
        title: req.body.title,
        views: req.body.views === "" ? null : req.body.views,
        duration: req.body.duration === "" ? null : req.body.duration,
        youtubeId: Object.prototype.hasOwnProperty.call(req.body, "youtubeUrl") || Object.prototype.hasOwnProperty.call(req.body, "youtubeId")
          ? extractYoutubeId(req.body.youtubeUrl || req.body.youtubeId)
          : undefined,
        placement: req.body.placement
      }
    });
    await contentNotice(req.user!.id, "تم تحديث فيديو", video.title);
    res.json(ok({ video: mapVideo(video), message: "تم تحديث الفيديو" }));
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/channel-videos/:id", async (req, res, next) => {
  try {
    const existing = await findVideo(req.params.id);
    await prisma.channelVideo.delete({ where: { id: existing.id } });
    await contentNotice(req.user!.id, "تم حذف فيديو", existing.title);
    res.json(ok({ success: true }));
  } catch (error) {
    next(error);
  }
});

const lessonSchema = z.object({
  code: z.string().optional().or(z.literal("")),
  title: z.string().min(2),
  description: z.string().optional().or(z.literal("")),
  duration: z.string().optional().or(z.literal("")),
  youtubeId: z.string().optional().or(z.literal("")),
  youtubeUrl: z.string().optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).default(0),
  published: boolish.default(true),
  levelId: z.string().min(1),
  chapterId: z.string().optional().or(z.literal(""))
});

const findLevel = async (idOrCode: string) => {
  const level = await prisma.curriculumLevel.findFirst({ where: { OR: [{ id: idOrCode }, { code: idOrCode }] } });
  if (!level) throw new HttpError(404, "LEVEL_NOT_FOUND", "لم يتم العثور على المستوى");
  return level;
};

const findChapter = async (idOrCode?: string | null) => {
  if (!idOrCode) return null;
  const chapter = await prisma.chapter.findFirst({ where: { OR: [{ id: idOrCode }, { code: idOrCode }] } });
  if (!chapter) throw new HttpError(404, "CHAPTER_NOT_FOUND", "لم يتم العثور على الباب");
  return chapter;
};

const mapLesson = (lesson: any) => ({
  id: lesson.id,
  code: lesson.code,
  title: lesson.title,
  description: lesson.description,
  duration: lesson.duration,
  youtubeId: lesson.youtubeId,
  order: lesson.order,
  published: lesson.published,
  levelId: lesson.levelId,
  chapterId: lesson.chapterId,
  level: lesson.level ? { id: lesson.level.id, code: lesson.level.code, title: lesson.level.title } : null,
  chapter: lesson.chapter ? { id: lesson.chapter.id, code: lesson.chapter.code, title: lesson.chapter.title } : null,
  quiz: lesson.quiz || null
});

const findLesson = async (idOrCode: string) => {
  const lesson = await prisma.lesson.findFirst({ where: { OR: [{ id: idOrCode }, { code: idOrCode }] } });
  if (!lesson) throw new HttpError(404, "LESSON_NOT_FOUND", "لم يتم العثور على الدرس");
  return lesson;
};

adminRouter.get("/lessons", async (_req, res, next) => {
  try {
    const lessons = await prisma.lesson.findMany({
      include: { level: true, chapter: true, quiz: { include: { questions: { orderBy: { order: "asc" } } } } },
      orderBy: [{ level: { order: "asc" } }, { order: "asc" }]
    });
    res.json(ok({ lessons: lessons.map(mapLesson) }));
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/lessons", validateBody(lessonSchema), async (req, res, next) => {
  try {
    const level = await findLevel(req.body.levelId);
    const chapter = await findChapter(req.body.chapterId);
    const lesson = await prisma.lesson.create({
      data: {
        code: req.body.code || `lesson-${Date.now()}`,
        title: req.body.title,
        description: req.body.description || null,
        duration: req.body.duration || null,
        youtubeId: extractYoutubeId(req.body.youtubeUrl || req.body.youtubeId),
        order: req.body.order,
        published: req.body.published,
        levelId: level.id,
        chapterId: chapter?.id || null
      },
      include: { level: true, chapter: true, quiz: true }
    });
    await contentNotice(req.user!.id, "تمت إضافة درس جديد", lesson.title);
    res.status(201).json(ok({ lesson: mapLesson(lesson), message: "تم إنشاء الدرس" }));
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/lessons/:id", validateBody(lessonSchema.partial()), async (req, res, next) => {
  try {
    const existing = await findLesson(String(req.params.id));
    const level = req.body.levelId ? await findLevel(req.body.levelId) : null;
    const chapter = Object.prototype.hasOwnProperty.call(req.body, "chapterId") ? await findChapter(req.body.chapterId) : undefined;
    const lesson = await prisma.lesson.update({
      where: { id: existing.id },
      data: {
        code: req.body.code || undefined,
        title: req.body.title,
        description: req.body.description === "" ? null : req.body.description,
        duration: req.body.duration === "" ? null : req.body.duration,
        youtubeId: Object.prototype.hasOwnProperty.call(req.body, "youtubeUrl") || Object.prototype.hasOwnProperty.call(req.body, "youtubeId")
          ? extractYoutubeId(req.body.youtubeUrl || req.body.youtubeId)
          : undefined,
        order: req.body.order,
        published: req.body.published,
        levelId: level?.id,
        chapterId: chapter === undefined ? undefined : chapter?.id || null
      },
      include: { level: true, chapter: true, quiz: true }
    });
    await contentNotice(req.user!.id, "تم تحديث درس", lesson.title);
    res.json(ok({ lesson: mapLesson(lesson), message: "تم تحديث الدرس" }));
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/lessons/:id", async (req, res, next) => {
  try {
    const existing = await findLesson(req.params.id);
    await prisma.lesson.delete({ where: { id: existing.id } });
    await contentNotice(req.user!.id, "تم حذف درس", existing.title);
    res.json(ok({ success: true }));
  } catch (error) {
    next(error);
  }
});

const levelSchema = z.object({
  code: z.string().optional().or(z.literal("")),
  title: z.string().min(2),
  subtitle: z.string().optional().or(z.literal("")),
  color: z.string().optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).default(0)
});

const chapterSchema = z.object({
  code: z.string().optional().or(z.literal("")),
  title: z.string().min(2),
  order: z.coerce.number().int().min(0).default(0),
  levelId: z.string().min(1)
});

adminRouter.get("/curriculum", async (_req, res, next) => {
  try {
    const levels = await prisma.curriculumLevel.findMany({
      orderBy: { order: "asc" },
      include: { chapters: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } }
    });
    res.json(ok({ levels }));
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/curriculum/levels", validateBody(levelSchema), async (req, res, next) => {
  try {
    const level = await prisma.curriculumLevel.create({
      data: {
        code: req.body.code || `level-${Date.now()}`,
        title: req.body.title,
        subtitle: req.body.subtitle || null,
        color: req.body.color || null,
        order: req.body.order
      }
    });
    await contentNotice(req.user!.id, "تمت إضافة مستوى", level.title);
    res.status(201).json(ok({ level, message: "تم إنشاء المستوى" }));
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/curriculum/levels/:id", validateBody(levelSchema.partial()), async (req, res, next) => {
  try {
    const existing = await findLevel(String(req.params.id));
    const level = await prisma.curriculumLevel.update({
      where: { id: existing.id },
      data: {
        code: req.body.code || undefined,
        title: req.body.title,
        subtitle: req.body.subtitle === "" ? null : req.body.subtitle,
        color: req.body.color === "" ? null : req.body.color,
        order: req.body.order
      }
    });
    await contentNotice(req.user!.id, "تم تحديث مستوى", level.title);
    res.json(ok({ level, message: "تم تحديث المستوى" }));
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/curriculum/levels/:id", async (req, res, next) => {
  try {
    const existing = await findLevel(req.params.id);
    await prisma.curriculumLevel.delete({ where: { id: existing.id } });
    await contentNotice(req.user!.id, "تم حذف مستوى", existing.title);
    res.json(ok({ success: true }));
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/curriculum/chapters", validateBody(chapterSchema), async (req, res, next) => {
  try {
    const level = await findLevel(req.body.levelId);
    const chapter = await prisma.chapter.create({
      data: {
        code: req.body.code || `chapter-${Date.now()}`,
        title: req.body.title,
        order: req.body.order,
        levelId: level.id
      }
    });
    await contentNotice(req.user!.id, "تمت إضافة باب", chapter.title);
    res.status(201).json(ok({ chapter, message: "تم إنشاء الباب" }));
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/curriculum/chapters/:id", validateBody(chapterSchema.partial()), async (req, res, next) => {
  try {
    const existing = await findChapter(String(req.params.id));
    if (!existing) throw new HttpError(404, "CHAPTER_NOT_FOUND", "لم يتم العثور على الباب");
    const level = req.body.levelId ? await findLevel(req.body.levelId) : null;
    const chapter = await prisma.chapter.update({
      where: { id: existing.id },
      data: {
        code: req.body.code || undefined,
        title: req.body.title,
        order: req.body.order,
        levelId: level?.id
      }
    });
    await contentNotice(req.user!.id, "تم تحديث باب", chapter.title);
    res.json(ok({ chapter, message: "تم تحديث الباب" }));
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/curriculum/chapters/:id", async (req, res, next) => {
  try {
    const existing = await findChapter(req.params.id);
    if (!existing) throw new HttpError(404, "CHAPTER_NOT_FOUND", "لم يتم العثور على الباب");
    await prisma.chapter.delete({ where: { id: existing.id } });
    await contentNotice(req.user!.id, "تم حذف باب", existing.title);
    res.json(ok({ success: true }));
  } catch (error) {
    next(error);
  }
});

const settingsSchema = z.object({
  name: z.string().min(2).optional(),
  tagline: z.string().optional(),
  project: z.string().optional(),
  channel: z.string().optional(),
  author: z.string().optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  emails: z.array(z.string().email()).optional(),
  countries: z.array(z.string()).optional(),
  modes: z.array(z.string()).optional(),
  groups: z.array(z.string()).optional(),
  schedule: z.string().optional(),
  packagePrice: z.coerce.number().int().min(0).optional()
});

adminRouter.get("/settings", async (_req, res, next) => {
  try {
    const settings = await prisma.academySettings.findUnique({ where: { id: "default" } });
    res.json(ok({ settings }));
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/settings", validateBody(settingsSchema), async (req, res, next) => {
  try {
    const settings = await prisma.academySettings.upsert({
      where: { id: "default" },
      update: req.body,
      create: {
        id: "default",
        name: req.body.name || "مناهج اقرأ ورتّل",
        tagline: req.body.tagline || null,
        project: req.body.project || null,
        channel: req.body.channel || null,
        author: req.body.author || null,
        description: req.body.description || null,
        phone: req.body.phone || null,
        whatsapp: req.body.whatsapp || null,
        emails: req.body.emails || [],
        countries: req.body.countries || [],
        modes: req.body.modes || [],
        groups: req.body.groups || [],
        schedule: req.body.schedule || null,
        packagePrice: req.body.packagePrice || 0
      }
    });
    await contentNotice(req.user!.id, "تم تحديث إعدادات المنصة", settings.name);
    res.json(ok({ settings, message: "تم حفظ الإعدادات" }));
  } catch (error) {
    next(error);
  }
});
