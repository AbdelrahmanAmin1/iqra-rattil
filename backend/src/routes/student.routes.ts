import { Router } from "express";
import { z } from "zod";
import { authenticate, authorize } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { prisma } from "../prisma.js";
import { notificationService } from "../services/notification.service.js";
import { emitToThread, emitToUser } from "../services/realtime.service.js";
import { HttpError, ok } from "../utils/http.js";

export const studentRouter = Router();

studentRouter.use(authenticate, authorize("STUDENT"));

const getStudentProfile = async (userId: string) => {
  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) throw new HttpError(404, "PROFILE_MISSING", "لم يتم العثور على ملف الطالب");
  return profile;
};

const mapSession = (session: any) => ({
  id: session.id,
  title: session.title,
  teacher: session.teacher?.fullName || "المعلم",
  date: session.dateLabel,
  dateLabel: session.dateLabel,
  time: session.timeLabel,
  timeLabel: session.timeLabel,
  duration: session.duration,
  link: session.meetingLink,
  meetingLink: session.meetingLink,
  joined: session.enrollments.length,
  total: session.totalSeats,
  totalSeats: session.totalSeats
});

const serializeMessage = (message: any, viewerId: string) => ({
  id: message.id,
  threadId: message.threadId,
  senderId: message.senderId,
  text: message.text,
  readAt: message.readAt,
  createdAt: message.createdAt,
  from: message.senderId === viewerId ? "me" : "them",
  sender: message.sender
    ? {
        id: message.sender.id,
        name: message.sender.fullName,
        role: message.sender.role.toLowerCase()
      }
    : null
});

const lessonWithProgress = async (studentId: string) => {
  const [lessons, progress] = await Promise.all([
    prisma.lesson.findMany({
      orderBy: [{ level: { order: "asc" } }, { order: "asc" }],
      include: { chapter: true, quiz: { include: { questions: { orderBy: { order: "asc" } } } } }
    }),
    prisma.studentLessonProgress.findMany({ where: { studentId } })
  ]);
  const byLesson = new Map(progress.map((item) => [item.lessonId, item]));
  return lessons.map((lesson, index) => {
    const p = byLesson.get(lesson.id);
    return {
      id: lesson.code,
      dbId: lesson.id,
      level: 1,
      idx: lesson.order,
      title: lesson.title,
      description: lesson.description,
      duration: lesson.duration,
      youtubeId: lesson.youtubeId,
      chapter: lesson.chapter?.title || "",
      completed: p?.completed || false,
      current: p?.current || (!p && index === 0),
      locked: p ? p.locked : index > 0,
      starsEarned: p?.starsEarned || 0,
      quiz: lesson.quiz
        ? {
            id: lesson.quiz.id,
            title: lesson.quiz.title,
            questions: lesson.quiz.questions.map((q) => ({
              type: q.type.toLowerCase(),
              prompt: q.prompt,
              options: q.options,
              target: q.target,
              answer: q.answerIndex
            }))
          }
        : null
    };
  });
};

studentRouter.get("/dashboard", async (req, res, next) => {
  try {
    const profile = await getStudentProfile(req.user!.id);
    const [lessons, sessions, badges, books] = await Promise.all([
      lessonWithProgress(req.user!.id),
      prisma.classSession.findMany({
        where: {
          OR: [
            ...(profile.teacherId ? [{ teacherId: profile.teacherId }] : []),
            { enrollments: { some: { studentId: req.user!.id } } }
          ]
        },
        orderBy: { createdAt: "desc" },
        include: { teacher: true, enrollments: true }
      }),
      prisma.badge.findMany({
        orderBy: { code: "asc" },
        include: { students: { where: { studentId: req.user!.id } } }
      }),
      prisma.book.findMany({ orderBy: { code: "asc" } })
    ]);
    const completed = lessons.filter((lesson) => lesson.completed).length;
    const currentLesson = lessons.find((lesson) => lesson.current) || lessons.find((lesson) => !lesson.locked) || lessons[0];
    res.json(
      ok({
        user: {
          name: req.user!.fullName,
          role: `طالب — ${profile.level || "المستوى الأول"}`,
          avatar: req.user!.fullName[0],
          color: req.user!.avatarColor || "var(--grad-1)",
          stars: profile.stars,
          streak: profile.streak
        },
        profile,
        lessons,
        currentLesson,
        progress: {
          completed,
          total: lessons.length,
          percent: lessons.length ? Math.round((completed / lessons.length) * 100) : 0
        },
        sessions: sessions.map(mapSession),
        badges: badges.map((badge) => ({
          id: badge.code,
          title: badge.title,
          icon: badge.icon,
          desc: badge.desc,
          unlocked: Boolean(badge.students[0]?.unlocked)
        })),
        books: books.map((book) => ({
          id: book.code,
          title: book.title,
          subtitle: book.subtitle,
          color: book.color,
          price: book.price,
          level: book.level,
          soon: book.soon,
          coverPath: book.coverPath,
          filePath: book.filePath,
          externalUrl: book.externalUrl
        }))
      })
    );
  } catch (error) {
    next(error);
  }
});

studentRouter.get("/lessons", async (req, res, next) => {
  try {
    res.json(ok({ lessons: await lessonWithProgress(req.user!.id) }));
  } catch (error) {
    next(error);
  }
});

const attemptSchema = z.object({
  answers: z.record(z.coerce.number().int())
});

studentRouter.post("/quizzes/:lessonId/attempts", validateBody(attemptSchema), async (req, res, next) => {
  try {
    const lessonId = String(req.params.lessonId);
    const lesson = await prisma.lesson.findFirst({
      where: { OR: [{ id: lessonId }, { code: lessonId }] },
      include: { quiz: { include: { questions: { orderBy: { order: "asc" } } } } }
    }) as any;
    if (!lesson?.quiz) throw new HttpError(404, "QUIZ_NOT_FOUND", "لا يوجد كويز لهذا الدرس");

    const answers = req.body.answers as Record<string, number>;
    const total = lesson.quiz.questions.length;
    const correct = lesson.quiz.questions.reduce((sum, question, index) => {
      return sum + (answers[String(index)] === question.answerIndex ? 1 : 0);
    }, 0);
    const score = total ? Math.round((correct / total) * 100) : 0;
    const passed = score >= 70;
    const stars = score >= 95 ? 3 : score >= 80 ? 2 : passed ? 1 : 0;

    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: lesson.quiz.id,
        studentId: req.user!.id,
        answers,
        score,
        correct,
        total,
        passed
      }
    });

    if (passed) {
      await prisma.studentLessonProgress.upsert({
        where: { studentId_lessonId: { studentId: req.user!.id, lessonId: lesson.id } },
        update: { completed: true, current: false, locked: false, starsEarned: stars, completedAt: new Date() },
        create: {
          studentId: req.user!.id,
          lessonId: lesson.id,
          completed: true,
          current: false,
          locked: false,
          starsEarned: stars,
          completedAt: new Date()
        }
      });
      const nextLesson = await prisma.lesson.findFirst({
        where: { levelId: lesson.levelId, order: { gt: lesson.order } },
        orderBy: { order: "asc" }
      });
      if (nextLesson) {
        await prisma.studentLessonProgress.upsert({
          where: { studentId_lessonId: { studentId: req.user!.id, lessonId: nextLesson.id } },
          update: { locked: false, current: true },
          create: { studentId: req.user!.id, lessonId: nextLesson.id, locked: false, current: true }
        });
      }
      await prisma.studentProfile.update({
        where: { userId: req.user!.id },
        data: { stars: { increment: stars } }
      });
    }

    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user!.id } });
    if (profile?.teacherId) {
      await notificationService.create({
        recipientId: profile.teacherId,
        actorId: req.user!.id,
        type: "quiz.submitted",
        title: "تم تسليم كويز",
        body: `${req.user!.fullName} حصل على ${score}% في ${lesson.title}`,
        link: "/teacher/students",
        metadata: { lessonId: lesson.id, attemptId: attempt.id, score }
      });
    }

    res.status(201).json(ok({ attempt, score, correct, total, passed, starsEarned: stars }));
  } catch (error) {
    next(error);
  }
});

studentRouter.get("/sessions", async (req, res, next) => {
  try {
    const profile = await getStudentProfile(req.user!.id);
    const sessions = await prisma.classSession.findMany({
      where: {
        OR: [
          ...(profile.teacherId ? [{ teacherId: profile.teacherId }] : []),
          { enrollments: { some: { studentId: req.user!.id } } }
        ]
      },
      orderBy: { createdAt: "desc" },
      include: { teacher: true, enrollments: true }
    });
    res.json(ok({ sessions: sessions.map(mapSession) }));
  } catch (error) {
    next(error);
  }
});

studentRouter.get("/badges", async (req, res, next) => {
  try {
    const badges = await prisma.badge.findMany({
      include: { students: { where: { studentId: req.user!.id } } }
    });
    res.json(ok({ badges }));
  } catch (error) {
    next(error);
  }
});

studentRouter.get("/messages", async (req, res, next) => {
  try {
    const profile = await getStudentProfile(req.user!.id);
    if (!profile.teacherId) {
      return res.json(ok({ thread: null, teacher: null, messages: [] }));
    }

    const teacher = await prisma.user.findFirst({
      where: { id: profile.teacherId, role: "TEACHER", status: "ACTIVE" },
      include: { teacherProfile: true }
    });
    if (!teacher) return res.json(ok({ thread: null, teacher: null, messages: [] }));

    const thread = await prisma.messageThread.upsert({
      where: { teacherId_studentId: { teacherId: teacher.id, studentId: req.user!.id } },
      update: {},
      create: { teacherId: teacher.id, studentId: req.user!.id },
      include: { messages: { include: { sender: true }, orderBy: { createdAt: "asc" } } }
    });

    await prisma.message.updateMany({
      where: { threadId: thread.id, senderId: { not: req.user!.id }, readAt: null },
      data: { readAt: new Date() }
    });

    const freshThread = await prisma.messageThread.findUniqueOrThrow({
      where: { id: thread.id },
      include: { messages: { include: { sender: true }, orderBy: { createdAt: "asc" } } }
    });

    res.json(
      ok({
        thread: { id: freshThread.id, teacherId: freshThread.teacherId, studentId: freshThread.studentId },
        teacher: {
          id: teacher.id,
          name: teacher.fullName,
          specialty: teacher.teacherProfile?.specialty || null,
          avatarColor: teacher.avatarColor
        },
        messages: freshThread.messages.map((message) => serializeMessage(message, req.user!.id))
      })
    );
  } catch (error) {
    next(error);
  }
});

const studentMessageSchema = z.object({ text: z.string().min(1).max(2000) });

studentRouter.post("/messages", validateBody(studentMessageSchema), async (req, res, next) => {
  try {
    const profile = await getStudentProfile(req.user!.id);
    if (!profile.teacherId) throw new HttpError(400, "TEACHER_NOT_ASSIGNED", "لم يتم تعيين معلم لهذا الطالب بعد");

    const teacher = await prisma.user.findFirst({
      where: { id: profile.teacherId, role: "TEACHER", status: "ACTIVE" }
    });
    if (!teacher) throw new HttpError(404, "TEACHER_NOT_FOUND", "لم يتم العثور على المعلم");

    const thread = await prisma.messageThread.upsert({
      where: { teacherId_studentId: { teacherId: teacher.id, studentId: req.user!.id } },
      update: {},
      create: { teacherId: teacher.id, studentId: req.user!.id }
    });
    const message = await prisma.message.create({
      data: { threadId: thread.id, senderId: req.user!.id, text: req.body.text },
      include: { sender: true }
    });
    await prisma.messageThread.update({ where: { id: thread.id }, data: { updatedAt: new Date() } });

    emitToThread(thread.id, "message:new", { threadId: thread.id, message: serializeMessage(message, req.user!.id) });
    emitToUser(teacher.id, "message:new", { threadId: thread.id, message: serializeMessage(message, teacher.id) });
    emitToUser(req.user!.id, "message:new", { threadId: thread.id, message: serializeMessage(message, req.user!.id) });
    await notificationService.create({
      recipientId: teacher.id,
      actorId: req.user!.id,
      type: "message.new",
      title: "رسالة جديدة من طالب",
      body: req.body.text,
      link: "/teacher/chat",
      metadata: { threadId: thread.id, studentId: req.user!.id }
    });

    res.status(201).json(ok({ thread: { id: thread.id, teacherId: thread.teacherId, studentId: thread.studentId }, message: serializeMessage(message, req.user!.id) }));
  } catch (error) {
    next(error);
  }
});

const profileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional(),
  age: z.coerce.number().int().min(3).max(100).optional(),
  level: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  studyMode: z.string().optional()
});

studentRouter.patch("/profile", validateBody(profileSchema), async (req, res, next) => {
  try {
    const { fullName, phone, ...profile } = req.body;
    const [user, studentProfile] = await prisma.$transaction([
      prisma.user.update({
        where: { id: req.user!.id },
        data: { fullName, phone }
      }),
      prisma.studentProfile.update({
        where: { userId: req.user!.id },
        data: profile
      })
    ]);
    res.json(ok({ user, profile: studentProfile, message: "تم حفظ الملف الشخصي" }));
  } catch (error) {
    next(error);
  }
});
