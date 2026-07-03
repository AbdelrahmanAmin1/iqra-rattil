import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { env } from "../config/env.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { prisma } from "../prisma.js";
import { notificationService } from "../services/notification.service.js";
import { emitToThread, emitToUser } from "../services/realtime.service.js";
import { storageService } from "../services/storage.service.js";
import { videoMeetingService } from "../services/videoMeeting.service.js";
import { HttpError, ok } from "../utils/http.js";

export const teacherRouter = Router();

teacherRouter.use(authenticate, authorize("TEACHER"));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.MAX_UPLOAD_SIZE_MB * 1024 * 1024 }
});

const studentInclude = {
  studentProfile: true,
  progress: { include: { lesson: true } },
  quizAttempts: { include: { quiz: { include: { lesson: true } } }, orderBy: { createdAt: "desc" } },
  attendance: { include: { session: true }, orderBy: { createdAt: "desc" } }
} as const;

const mapStudent = (student: any) => {
  const progressItems = student.progress || [];
  const completed = progressItems.filter((p: any) => p.completed).length;
  const total = Math.max(progressItems.length, 8);
  const profile = student.studentProfile;
  return {
    id: student.id,
    name: student.fullName,
    age: profile?.age,
    level: profile?.level || "المستوى الأول",
    progress: total ? Math.round((completed / total) * 100) : 0,
    stars: profile?.stars || 0,
    status: student.status.toLowerCase(),
    teacherId: profile?.teacherId || null,
    lastActive: "اليوم",
    attendance: "جيد",
    avatar: student.fullName?.[0],
    color: student.avatarColor || "var(--grad-1)"
  };
};

const mapSession = (session: any) => ({
  id: session.id,
  title: session.title,
  dateLabel: session.dateLabel,
  date: session.dateLabel,
  timeLabel: session.timeLabel,
  time: session.timeLabel,
  duration: session.duration,
  groupName: session.groupName,
  meetingLink: session.meetingLink,
  link: session.meetingLink,
  meetingProvider: session.meetingProvider,
  totalSeats: session.totalSeats,
  total: session.totalSeats,
  teacherId: session.teacherId,
  teacher: session.teacher?.fullName || null,
  joined: session.enrollments?.length || 0,
  enrollments: session.enrollments || [],
  createdAt: session.createdAt
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

const getTeacherStudentIds = async (teacherId: string) => {
  const profiles = await prisma.studentProfile.findMany({
    where: { teacherId },
    select: { userId: true }
  });
  return profiles.map((profile) => profile.userId);
};

const assignedStudentWhere = (teacherId: string) => ({
  role: "STUDENT" as const,
  status: "ACTIVE" as const,
  studentProfile: { is: { teacherId } }
});

const availableStudentWhere = {
  role: "STUDENT" as const,
  status: "ACTIVE" as const,
  studentProfile: { is: { teacherId: null } }
};

const getTeacherStudents = async (teacherId: string) => {
  const [students, availableStudents] = await Promise.all([
    prisma.user.findMany({
      where: assignedStudentWhere(teacherId),
      include: studentInclude,
      orderBy: { createdAt: "asc" }
    }),
    prisma.user.findMany({
      where: availableStudentWhere,
      include: studentInclude,
      orderBy: { createdAt: "asc" }
    })
  ]);
  return {
    students: students.map(mapStudent),
    availableStudents: availableStudents.map(mapStudent)
  };
};

const findAssignedStudent = async (teacherId: string, studentId: string) => {
  const student = await prisma.user.findFirst({
    where: { id: studentId, ...assignedStudentWhere(teacherId) },
    include: studentInclude
  });
  if (!student) throw new HttpError(404, "STUDENT_NOT_ASSIGNED", "هذا الطالب غير مسند إليك");
  return student;
};

teacherRouter.get("/dashboard", async (req, res, next) => {
  try {
    const [studentData, sessions, materials] = await Promise.all([
      getTeacherStudents(req.user!.id),
      prisma.classSession.findMany({
        where: { OR: [{ teacherId: req.user!.id }, { createdById: req.user!.id }] },
        include: { enrollments: true },
        orderBy: { createdAt: "desc" }
      }),
      prisma.material.findMany({
        where: { uploadedById: req.user!.id },
        orderBy: { createdAt: "desc" },
        take: 10
      })
    ]);
    const mapped = studentData.students;
    const avgProgress = mapped.length
      ? Math.round(mapped.reduce((sum, item) => sum + item.progress, 0) / mapped.length)
      : 0;
    res.json(
      ok({
        totals: {
          students: mapped.length,
          activeToday: mapped.length,
          sessionsWeek: sessions.length,
          avgProgress,
          availableStudents: studentData.availableStudents.length
        },
        students: mapped,
        availableStudents: studentData.availableStudents,
        sessions: sessions.map(mapSession),
        materials
      })
    );
  } catch (error) {
    next(error);
  }
});

teacherRouter.get("/students", async (req, res, next) => {
  try {
    res.json(ok(await getTeacherStudents(req.user!.id)));
  } catch (error) {
    next(error);
  }
});

teacherRouter.get("/students/:id", async (req, res, next) => {
  try {
    const student = await findAssignedStudent(req.user!.id, String(req.params.id));
    res.json(
      ok({
        student: mapStudent(student),
        quizScores: student.quizAttempts.map((attempt) => ({
          lesson: attempt.quiz.lesson.title,
          score: attempt.score,
          createdAt: attempt.createdAt
        })),
        attendanceLog: student.attendance.map((record) => ({
          date: record.dateLabel,
          status: record.status.toLowerCase(),
          session: record.session.title
        })),
        notes: []
      })
    );
  } catch (error) {
    next(error);
  }
});

teacherRouter.post("/students/:id/assign", async (req, res, next) => {
  try {
    const student = await prisma.user.findFirst({
      where: { id: String(req.params.id), role: "STUDENT", status: "ACTIVE" },
      include: { studentProfile: true }
    });
    if (!student) throw new HttpError(404, "STUDENT_NOT_FOUND", "لم يتم العثور على الطالب");
    if (!student.studentProfile) throw new HttpError(400, "STUDENT_PROFILE_MISSING", "ملف الطالب غير مكتمل");
    if (student.studentProfile.teacherId && student.studentProfile.teacherId !== req.user!.id) {
      throw new HttpError(409, "STUDENT_ALREADY_ASSIGNED", "هذا الطالب مسند إلى معلم آخر");
    }

    await prisma.studentProfile.update({
      where: { userId: student.id },
      data: { teacherId: req.user!.id }
    });
    const assigned = await prisma.user.findUniqueOrThrow({
      where: { id: student.id },
      include: studentInclude
    });
    await notificationService.create({
      recipientId: student.id,
      actorId: req.user!.id,
      type: "teacher.assigned",
      title: "تم تعيين معلم لك",
      body: `تم تعيين ${req.user!.fullName} لمتابعتك داخل المنصة.`,
      link: "/student/chat",
      metadata: { teacherId: req.user!.id }
    });
    res.status(201).json(ok({ student: mapStudent(assigned), message: "تم إسناد الطالب" }));
  } catch (error) {
    next(error);
  }
});

teacherRouter.delete("/students/:id/assign", async (req, res, next) => {
  try {
    const student = await findAssignedStudent(req.user!.id, String(req.params.id));
    await prisma.studentProfile.update({
      where: { userId: student.id },
      data: { teacherId: null }
    });
    const unassigned = await prisma.user.findUniqueOrThrow({
      where: { id: student.id },
      include: studentInclude
    });
    await notificationService.create({
      recipientId: student.id,
      actorId: req.user!.id,
      type: "teacher.unassigned",
      title: "تم إلغاء تعيين المعلم",
      body: "سيقوم المشرف أو أحد المعلمين بتعيين معلم جديد عند الحاجة.",
      link: "/student/profile",
      metadata: { teacherId: req.user!.id }
    });
    res.json(ok({ student: mapStudent(unassigned), message: "تم إلغاء إسناد الطالب" }));
  } catch (error) {
    next(error);
  }
});

teacherRouter.post("/materials", upload.array("files"), async (req, res, next) => {
  try {
    const files = (req.files || []) as Express.Multer.File[];
    if (!files.length) throw new HttpError(400, "NO_FILES", "يرجى اختيار ملف واحد على الأقل");
    const materials = [];
    for (const file of files) {
      const stored = await storageService.saveFile(file);
      const material = await prisma.material.create({
        data: {
          type: "FILE",
          title: stored.title,
          originalName: stored.originalName,
          mimeType: stored.mimeType,
          sizeBytes: stored.sizeBytes,
          storagePath: stored.storagePath,
          publicPath: stored.publicPath,
          level: req.body.level || "عام",
          category: req.body.category || "ملف",
          uploadedById: req.user!.id
        }
      });
      materials.push(material);
    }
    const studentIds = await getTeacherStudentIds(req.user!.id);
    await notificationService.createForUsers(studentIds, {
      actorId: req.user!.id,
      type: "content.material",
      title: "تم رفع مادة جديدة",
      body: materials.map((material) => material.title).join("، "),
      link: "/student/books",
      metadata: { materialIds: materials.map((material) => material.id) }
    });
    res.status(201).json(ok({ materials, message: "تم رفع الملفات بنجاح" }));
  } catch (error) {
    next(error);
  }
});

teacherRouter.get("/materials", async (req, res, next) => {
  try {
    const materials = await prisma.material.findMany({
      where: { uploadedById: req.user!.id },
      orderBy: { createdAt: "desc" }
    });
    res.json(ok({ materials }));
  } catch (error) {
    next(error);
  }
});

const attendanceSchema = z.object({
  sessionId: z.string().min(1),
  dateLabel: z.string().min(1),
  records: z.array(
    z.object({
      studentId: z.string().min(1),
      status: z.enum(["present", "late", "absent"])
    })
  )
});

teacherRouter.post("/attendance", validateBody(attendanceSchema), async (req, res, next) => {
  try {
    const studentIds = req.body.records.map((record: any) => record.studentId);
    const assignedCount = await prisma.studentProfile.count({
      where: { teacherId: req.user!.id, userId: { in: studentIds } }
    });
    if (assignedCount !== new Set(studentIds).size) {
      throw new HttpError(403, "STUDENTS_NOT_ASSIGNED", "يمكن حفظ حضور الطلاب المسندين إليك فقط");
    }

    const statusMap = { present: "PRESENT", late: "LATE", absent: "ABSENT" } as const;
    const saved = await prisma.$transaction(
      req.body.records.map((record: any) =>
        prisma.attendanceRecord.upsert({
          where: {
            sessionId_studentId_dateLabel: {
              sessionId: req.body.sessionId,
              studentId: record.studentId,
              dateLabel: req.body.dateLabel
            }
          },
          update: { status: statusMap[record.status as keyof typeof statusMap] },
          create: {
            sessionId: req.body.sessionId,
            studentId: record.studentId,
            dateLabel: req.body.dateLabel,
            status: statusMap[record.status as keyof typeof statusMap]
          }
        })
      )
    );
    res.json(ok({ attendance: saved, message: "تم حفظ الحضور" }));
  } catch (error) {
    next(error);
  }
});

const quizSchema = z.object({
  lessonId: z.string().min(1),
  title: z.string().min(2),
  status: z.enum(["draft", "published"]).default("published"),
  questions: z.array(
    z.object({
      type: z.enum(["mcq", "drag"]),
      prompt: z.string().min(1),
      options: z.array(z.string()).min(2),
      target: z.string().optional(),
      answer: z.coerce.number().int().min(0)
    })
  )
});

teacherRouter.post("/quizzes", validateBody(quizSchema), async (req, res, next) => {
  try {
    const lesson = await prisma.lesson.findFirst({ where: { OR: [{ id: req.body.lessonId }, { code: req.body.lessonId }] } });
    if (!lesson) throw new HttpError(404, "LESSON_NOT_FOUND", "لم يتم العثور على الدرس");
    const quiz = await prisma.quiz.upsert({
      where: { lessonId: lesson.id },
      update: {
        title: req.body.title,
        status: req.body.status === "draft" ? "DRAFT" : "PUBLISHED",
        questions: {
          deleteMany: {},
          create: req.body.questions.map((q: any, index: number) => ({
            type: q.type.toUpperCase(),
            prompt: q.prompt,
            options: q.options,
            target: q.target || null,
            answerIndex: q.answer,
            order: index + 1
          }))
        }
      },
      create: {
        title: req.body.title,
        status: req.body.status === "draft" ? "DRAFT" : "PUBLISHED",
        lessonId: lesson.id,
        questions: {
          create: req.body.questions.map((q: any, index: number) => ({
            type: q.type.toUpperCase(),
            prompt: q.prompt,
            options: q.options,
            target: q.target || null,
            answerIndex: q.answer,
            order: index + 1
          }))
        }
      },
      include: { questions: true }
    });
    res.status(201).json(ok({ quiz, message: "تم حفظ الكويز" }));
  } catch (error) {
    next(error);
  }
});

teacherRouter.put("/quizzes/:id", validateBody(quizSchema), async (req, res, next) => {
  try {
    const quiz = await prisma.quiz.update({
      where: { id: String(req.params.id) },
      data: {
        title: req.body.title,
        status: req.body.status === "draft" ? "DRAFT" : "PUBLISHED",
        questions: {
          deleteMany: {},
          create: req.body.questions.map((q: any, index: number) => ({
            type: q.type.toUpperCase(),
            prompt: q.prompt,
            options: q.options,
            target: q.target || null,
            answerIndex: q.answer,
            order: index + 1
          }))
        }
      },
      include: { questions: true }
    });
    res.json(ok({ quiz, message: "تم تحديث الكويز" }));
  } catch (error) {
    next(error);
  }
});

const sessionSchema = z.object({
  title: z.string().min(2),
  date: z.string().min(1),
  time: z.string().min(1),
  duration: z.string().min(1),
  group: z.string().optional(),
  total: z.coerce.number().int().min(0).default(0),
  link: z.string().url().optional().or(z.literal(""))
});

teacherRouter.get("/sessions", async (req, res, next) => {
  try {
    const sessions = await prisma.classSession.findMany({
      where: { OR: [{ teacherId: req.user!.id }, { createdById: req.user!.id }] },
      include: { teacher: true, enrollments: true },
      orderBy: { createdAt: "desc" }
    });
    res.json(ok({ sessions: sessions.map(mapSession) }));
  } catch (error) {
    next(error);
  }
});

teacherRouter.post("/sessions", validateBody(sessionSchema), async (req, res, next) => {
  try {
    const meeting = await videoMeetingService.prepareMeeting({
      title: req.body.title,
      meetingLink: req.body.link || null
    });
    const session = await prisma.classSession.create({
      data: {
        title: req.body.title,
        dateLabel: req.body.date,
        timeLabel: req.body.time,
        duration: req.body.duration,
        groupName: req.body.group || null,
        totalSeats: req.body.total,
        meetingLink: meeting.meetingLink,
        meetingProvider: meeting.meetingProvider,
        teacherId: req.user!.id,
        createdById: req.user!.id
      }
    });
    const studentIds = await getTeacherStudentIds(req.user!.id);
    await notificationService.createForUsers(studentIds, {
      actorId: req.user!.id,
      type: "class.created",
      title: "تمت إضافة حلقة جديدة",
      body: session.title,
      link: "/student/zoom",
      metadata: { sessionId: session.id }
    });
    res.status(201).json(ok({ session: mapSession(session), message: "تم إنشاء الجلسة" }));
  } catch (error) {
    next(error);
  }
});

teacherRouter.patch("/sessions/:id", validateBody(sessionSchema.partial()), async (req, res, next) => {
  try {
    const existing = await prisma.classSession.findFirst({
      where: {
        id: String(req.params.id),
        OR: [{ teacherId: req.user!.id }, { createdById: req.user!.id }]
      }
    });
    if (!existing) throw new HttpError(404, "SESSION_NOT_FOUND", "لم يتم العثور على الجلسة");

    const meetingLink = Object.prototype.hasOwnProperty.call(req.body, "link") ? req.body.link || null : existing.meetingLink;
    const session = await prisma.classSession.update({
      where: { id: existing.id },
      data: {
        title: req.body.title ?? existing.title,
        dateLabel: req.body.date ?? existing.dateLabel,
        timeLabel: req.body.time ?? existing.timeLabel,
        duration: req.body.duration ?? existing.duration,
        groupName: req.body.group ?? existing.groupName,
        totalSeats: req.body.total ?? existing.totalSeats,
        meetingLink,
        meetingProvider: meetingLink ? "manual" : null
      },
      include: { teacher: true, enrollments: true }
    });

    const studentIds = await getTeacherStudentIds(req.user!.id);
    await notificationService.createForUsers(studentIds, {
      actorId: req.user!.id,
      type: "class.updated",
      title: "تم تحديث بيانات الحلقة",
      body: session.title,
      link: "/student/zoom",
      metadata: { sessionId: session.id }
    });

    res.json(ok({ session: mapSession(session), message: "تم تحديث الجلسة" }));
  } catch (error) {
    next(error);
  }
});

teacherRouter.delete("/sessions/:id", async (req, res, next) => {
  try {
    const existing = await prisma.classSession.findFirst({
      where: {
        id: String(req.params.id),
        OR: [{ teacherId: req.user!.id }, { createdById: req.user!.id }]
      }
    });
    if (!existing) throw new HttpError(404, "SESSION_NOT_FOUND", "لم يتم العثور على الجلسة");
    await prisma.classSession.delete({ where: { id: existing.id } });
    const studentIds = await getTeacherStudentIds(req.user!.id);
    await notificationService.createForUsers(studentIds, {
      actorId: req.user!.id,
      type: "class.deleted",
      title: "تم حذف حلقة",
      body: existing.title,
      link: "/student/zoom",
      metadata: { sessionId: existing.id }
    });
    res.json(ok({ success: true }));
  } catch (error) {
    next(error);
  }
});

teacherRouter.get("/messages", async (req, res, next) => {
  try {
    const [threads, students] = await Promise.all([
      prisma.messageThread.findMany({
        where: { teacherId: req.user!.id },
        include: {
          student: { include: studentInclude },
          messages: { include: { sender: true }, orderBy: { createdAt: "desc" }, take: 1 }
        },
        orderBy: { updatedAt: "desc" }
      }),
      prisma.user.findMany({
        where: assignedStudentWhere(req.user!.id),
        include: studentInclude,
        orderBy: { createdAt: "asc" }
      })
    ]);
    const assignedThreads = threads.filter((thread) => thread.student?.studentProfile?.teacherId === req.user!.id);
    const unreadCounts = await prisma.message.groupBy({
      by: ["threadId"],
      where: {
        threadId: { in: assignedThreads.map((thread) => thread.id) },
        senderId: { not: req.user!.id },
        readAt: null
      },
      _count: { _all: true }
    });
    const unreadByThread = new Map(unreadCounts.map((item) => [item.threadId, item._count._all]));
    res.json(
      ok({
        threads: assignedThreads.map((thread) => ({
          id: thread.id,
          teacherId: thread.teacherId,
          studentId: thread.studentId,
          student: mapStudent(thread.student),
          lastMessage: thread.messages[0] ? serializeMessage(thread.messages[0], req.user!.id) : null,
          unreadCount: unreadByThread.get(thread.id) || 0,
          updatedAt: thread.updatedAt
        })),
        students: students.map(mapStudent)
      })
    );
  } catch (error) {
    next(error);
  }
});

teacherRouter.get("/messages/:studentId", async (req, res, next) => {
  try {
    const studentId = String(req.params.studentId);
    const student = await findAssignedStudent(req.user!.id, studentId);
    const thread = await prisma.messageThread.upsert({
      where: { teacherId_studentId: { teacherId: req.user!.id, studentId } },
      update: {},
      create: { teacherId: req.user!.id, studentId },
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
        student: mapStudent(student),
        messages: freshThread.messages.map((message) => serializeMessage(message, req.user!.id))
      })
    );
  } catch (error) {
    next(error);
  }
});

const messageSchema = z.object({ text: z.string().min(1).max(2000) });

teacherRouter.post("/messages/:studentId", validateBody(messageSchema), async (req, res, next) => {
  try {
    const studentId = String(req.params.studentId);
    const student = await findAssignedStudent(req.user!.id, studentId);
    const thread = await prisma.messageThread.upsert({
      where: { teacherId_studentId: { teacherId: req.user!.id, studentId } },
      update: {},
      create: { teacherId: req.user!.id, studentId }
    });
    const message = await prisma.message.create({
      data: { threadId: thread.id, senderId: req.user!.id, text: req.body.text },
      include: { sender: true }
    });
    await prisma.messageThread.update({ where: { id: thread.id }, data: { updatedAt: new Date() } });
    const payload = {
      threadId: thread.id,
      message: serializeMessage(message, req.user!.id),
      rawMessage: serializeMessage(message, studentId)
    };
    emitToThread(thread.id, "message:new", payload);
    emitToUser(studentId, "message:new", { threadId: thread.id, message: serializeMessage(message, studentId) });
    emitToUser(req.user!.id, "message:new", { threadId: thread.id, message: serializeMessage(message, req.user!.id) });
    await notificationService.create({
      recipientId: studentId,
      actorId: req.user!.id,
      type: "message.new",
      title: "رسالة جديدة من المعلم",
      body: req.body.text,
      link: "/student/chat",
      metadata: { threadId: thread.id }
    });
    res.status(201).json(ok({ thread: { id: thread.id, teacherId: thread.teacherId, studentId }, message: serializeMessage(message, req.user!.id) }));
  } catch (error) {
    next(error);
  }
});
