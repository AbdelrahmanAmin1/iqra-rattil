import type { Role } from "@prisma/client";
import { prisma } from "../prisma.js";
import { emitToUser } from "./realtime.service.js";

export type NotificationInput = {
  recipientId: string;
  actorId?: string | null;
  type: string;
  title: string;
  body?: string | null;
  link?: string | null;
  metadata?: unknown;
};

const preferenceKeyForType = (type: string) => {
  if (type.startsWith("class.")) return "classes";
  if (type.startsWith("quiz.")) return "quizzes";
  if (type.startsWith("message.")) return "parentMessages";
  if (type.startsWith("content.")) return "newContent";
  if (type.startsWith("achievement.")) return "achievements";
  if (type.startsWith("report.")) return "weeklyReport";
  return null;
};

export const serializeNotification = (notification: any) => ({
  id: notification.id,
  type: notification.type,
  title: notification.title,
  body: notification.body,
  link: notification.link,
  metadata: notification.metadata,
  readAt: notification.readAt,
  createdAt: notification.createdAt,
  actor: notification.actor
    ? {
        id: notification.actor.id,
        name: notification.actor.fullName,
        role: notification.actor.role.toLowerCase()
      }
    : null
});

class NotificationService {
  async create(input: NotificationInput) {
    const preferenceKey = preferenceKeyForType(input.type);
    if (preferenceKey) {
      const preference = await prisma.notificationPreference.findUnique({
        where: { userId: input.recipientId }
      });
      if (preference && preference[preferenceKey as keyof typeof preference] === false) return null;
    }

    const notification = await prisma.notification.create({
      data: {
        recipientId: input.recipientId,
        actorId: input.actorId || null,
        type: input.type,
        title: input.title,
        body: input.body || null,
        link: input.link || null,
        metadata: input.metadata === undefined ? undefined : (input.metadata as any)
      },
      include: { actor: true }
    });

    const unreadCount = await prisma.notification.count({
      where: { recipientId: input.recipientId, readAt: null }
    });

    emitToUser(input.recipientId, "notification:new", {
      notification: serializeNotification(notification),
      unreadCount
    });

    return notification;
  }

  async createForUsers(userIds: string[], input: Omit<NotificationInput, "recipientId">) {
    const uniqueIds = [...new Set(userIds)];
    return Promise.all(uniqueIds.map((recipientId) => this.create({ ...input, recipientId })));
  }

  async createForRole(role: Role, input: Omit<NotificationInput, "recipientId">) {
    const users = await prisma.user.findMany({
      where: { role, status: "ACTIVE" },
      select: { id: true }
    });
    return this.createForUsers(users.map((user) => user.id), input);
  }

  async notifyLeadCreated(leadId: string) {
    return this.createForRole("ADMIN", {
      type: "content.lead",
      title: "طلب تواصل جديد",
      body: "وصل طلب تواصل جديد من الصفحة الرئيسية.",
      link: "/admin",
      metadata: { leadId }
    });
  }

  async notifyOrderCreated(orderId: string) {
    return this.createForRole("ADMIN", {
      type: "content.order",
      title: "طلب حقيبة جديد",
      body: "وصل طلب شراء أو استفسار عن الحقيبة التعليمية.",
      link: "/admin",
      metadata: { orderId }
    });
  }
}

export const notificationService = new NotificationService();
