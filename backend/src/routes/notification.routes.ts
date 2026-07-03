import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { prisma } from "../prisma.js";
import { serializeNotification } from "../services/notification.service.js";
import { HttpError, ok } from "../utils/http.js";

export const notificationRouter = Router();

notificationRouter.use(authenticate);

const preferenceSchema = z.object({
  classes: z.boolean().optional(),
  quizzes: z.boolean().optional(),
  weeklyReport: z.boolean().optional(),
  parentMessages: z.boolean().optional(),
  newContent: z.boolean().optional(),
  achievements: z.boolean().optional()
});

const ensurePreferences = (userId: string) =>
  prisma.notificationPreference.upsert({
    where: { userId },
    update: {},
    create: { userId }
  });

notificationRouter.get("/", async (req, res, next) => {
  try {
    const [notifications, unreadCount, preferences] = await Promise.all([
      prisma.notification.findMany({
        where: { recipientId: req.user!.id },
        include: { actor: true },
        orderBy: { createdAt: "desc" },
        take: 50
      }),
      prisma.notification.count({ where: { recipientId: req.user!.id, readAt: null } }),
      ensurePreferences(req.user!.id)
    ]);
    res.json(ok({ notifications: notifications.map(serializeNotification), unreadCount, preferences }));
  } catch (error) {
    next(error);
  }
});

notificationRouter.get("/unread-count", async (req, res, next) => {
  try {
    const unreadCount = await prisma.notification.count({
      where: { recipientId: req.user!.id, readAt: null }
    });
    res.json(ok({ unreadCount }));
  } catch (error) {
    next(error);
  }
});

notificationRouter.get("/preferences", async (req, res, next) => {
  try {
    const preferences = await ensurePreferences(req.user!.id);
    res.json(ok({ preferences }));
  } catch (error) {
    next(error);
  }
});

notificationRouter.patch("/preferences", validateBody(preferenceSchema), async (req, res, next) => {
  try {
    const preferences = await prisma.notificationPreference.upsert({
      where: { userId: req.user!.id },
      update: req.body,
      create: { userId: req.user!.id, ...req.body }
    });
    res.json(ok({ preferences, message: "تم حفظ إعدادات الإشعارات" }));
  } catch (error) {
    next(error);
  }
});

notificationRouter.post("/mark-all-read", async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { recipientId: req.user!.id, readAt: null },
      data: { readAt: new Date() }
    });
    res.json(ok({ success: true, unreadCount: 0 }));
  } catch (error) {
    next(error);
  }
});

notificationRouter.patch("/:id/read", async (req, res, next) => {
  try {
    const existing = await prisma.notification.findFirst({
      where: { id: req.params.id, recipientId: req.user!.id }
    });
    if (!existing) throw new HttpError(404, "NOTIFICATION_NOT_FOUND", "لم يتم العثور على الإشعار");
    const notification = await prisma.notification.update({
      where: { id: existing.id },
      data: { readAt: new Date() },
      include: { actor: true }
    });
    const unreadCount = await prisma.notification.count({
      where: { recipientId: req.user!.id, readAt: null }
    });
    res.json(ok({ notification: serializeNotification(notification), unreadCount }));
  } catch (error) {
    next(error);
  }
});
