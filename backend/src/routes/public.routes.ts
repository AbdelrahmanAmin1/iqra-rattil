import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { validateBody } from "../middlewares/validate.js";
import { notificationService } from "../services/notification.service.js";
import { paymentService } from "../services/payment.service.js";
import { ok } from "../utils/http.js";

export const publicRouter = Router();

publicRouter.get("/health", (_req, res) => {
  res.json(ok({ status: "ok", service: "iqra-rattil-api" }));
});

publicRouter.get("/public/home", async (_req, res, next) => {
  try {
    const [settings, curriculum, books, channelVideos] = await Promise.all([
      prisma.academySettings.findUnique({ where: { id: "default" } }),
      prisma.curriculumLevel.findMany({
        orderBy: { order: "asc" },
        include: {
          chapters: {
            orderBy: { order: "asc" },
            include: { lessons: { orderBy: { order: "asc" } } }
          }
        }
      }),
      prisma.book.findMany({ orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] }),
      prisma.channelVideo.findMany({ orderBy: [{ placement: "asc" }, { code: "asc" }] })
    ]);

    res.json(
      ok({
        academy: settings,
        curriculum: curriculum.map((level) => ({
          id: level.code,
          title: level.title,
          subtitle: level.subtitle,
          color: level.color,
          chapters: level.chapters.map((chapter) => ({
            id: chapter.code,
            title: chapter.title,
            lessons: chapter.lessons.map((lesson) => lesson.title)
          }))
        })),
        books: books.map((book) => ({
          id: book.code,
          title: book.title,
          subtitle: book.subtitle,
          color: book.color,
          level: book.level,
          soon: book.soon,
          displayOrder: book.displayOrder,
          coverPath: book.coverPath,
          filePath: book.filePath,
          externalUrl: book.externalUrl
        })),
        packagePrice: settings?.packagePrice || 0,
        channelVideos: channelVideos.map((video) => ({
          id: video.code,
          title: video.title,
          views: video.views,
          duration: video.duration,
          youtubeId: video.youtubeId,
          placement: video.placement
        }))
      })
    );
  } catch (error) {
    next(error);
  }
});

const leadSchema = z.object({
  name: z.string().min(2),
  age: z.string().optional(),
  phone: z.string().optional(),
  mode: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional()
});

publicRouter.post("/contact/leads", validateBody(leadSchema), async (req, res, next) => {
  try {
    const lead = await prisma.contactLead.create({ data: req.body });
    await notificationService.notifyLeadCreated(lead.id);
    res.status(201).json(ok({ lead, message: "تم استلام طلبك بنجاح" }));
  } catch (error) {
    next(error);
  }
});

const orderSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(5),
  city: z.string().optional(),
  note: z.string().optional(),
  items: z.unknown().optional()
});

publicRouter.post("/orders", validateBody(orderSchema), async (req, res, next) => {
  try {
    const order = await prisma.orderRequest.create({
      data: {
        name: req.body.name,
        phone: req.body.phone,
        city: req.body.city || null,
        note: req.body.note || null,
        items: req.body.items || undefined
      }
    });
    const payment = await paymentService.prepareOrderPayment(order.id);
    await notificationService.notifyOrderCreated(order.id);
    res.status(201).json(ok({ order, payment, message: "تم حفظ الطلب وسيتواصل معك الفريق" }));
  } catch (error) {
    next(error);
  }
});
