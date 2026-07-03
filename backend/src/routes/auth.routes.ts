import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { prisma } from "../prisma.js";
import { hashPassword, issueToken, verifyPassword } from "../services/auth.service.js";
import { roleToPrisma, serializeUser } from "../services/serializers.js";
import { HttpError, ok } from "../utils/http.js";

export const authRouter = Router();

const optionalNumber = (schema: z.ZodNumber) =>
  z.preprocess(
    (value) => (value === null || (typeof value === "string" && value.trim() === "") ? undefined : value),
    schema.optional()
  );

const registerSchema = z.object({
  role: z.enum(["student", "teacher", "admin"]),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5).optional().or(z.literal("")),
  password: z.string().min(6),
  age: optionalNumber(z.coerce.number().int().min(3).max(100)),
  level: z.string().optional(),
  mode: z.string().optional(),
  parentName: z.string().optional(),
  experience: optionalNumber(z.coerce.number().int().min(0).max(70)),
  specialty: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  role: z.enum(["student", "teacher", "admin"]).optional(),
  remember: z.boolean().optional()
});

authRouter.post("/register", validateBody(registerSchema), async (req, res, next) => {
  try {
    const body = req.body as z.infer<typeof registerSchema>;
    if (body.role === "admin") {
      throw new HttpError(403, "ADMIN_REGISTRATION_DISABLED", "يتم إنشاء حساب المشرف من خلال التهيئة فقط");
    }

    const existing = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (existing) throw new HttpError(409, "EMAIL_EXISTS", "هذا البريد مستخدم بالفعل");

    const role = roleToPrisma(body.role);
    const status = role === "TEACHER" ? "PENDING" : "ACTIVE";
    const user = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        passwordHash: await hashPassword(body.password),
        fullName: body.fullName,
        phone: body.phone || null,
        role,
        status,
        avatarColor: role === "TEACHER" ? "var(--grad-3)" : "var(--grad-1)",
        studentProfile:
          role === "STUDENT"
            ? {
                create: {
                  age: body.age,
                  level: body.level || null,
                  studyMode: body.mode || null,
                  parentName: body.parentName || null,
                  stars: 0,
                  streak: 0
                }
              }
            : undefined,
        teacherProfile:
          role === "TEACHER"
            ? {
                create: {
                  experienceYears: body.experience,
                  specialty: body.specialty || null,
                  rating: 0
                }
              }
            : undefined
      }
    });

    if (status === "PENDING") {
      return res.status(201).json(
        ok({
          user: serializeUser(user),
          pending: true,
          message: "تم إرسال طلبك للمراجعة. سيقوم المشرف بتفعيله قريبا."
        })
      );
    }

    return res.status(201).json(ok({ user: serializeUser(user), token: issueToken(user) }));
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", validateBody(loginSchema), async (req, res, next) => {
  try {
    const body = req.body as z.infer<typeof loginSchema>;
    const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      throw new HttpError(401, "INVALID_CREDENTIALS", "البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
    if (body.role && user.role !== roleToPrisma(body.role)) {
      throw new HttpError(403, "ROLE_MISMATCH", "هذا الحساب لا يطابق الدور المحدد");
    }
    if (user.status !== "ACTIVE") {
      throw new HttpError(403, "ACCOUNT_PENDING", "الحساب بانتظار موافقة المشرف");
    }
    res.json(ok({ user: serializeUser(user), token: issueToken(user) }));
  } catch (error) {
    next(error);
  }
});

authRouter.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { studentProfile: true, teacherProfile: true }
    });
    res.json(ok({ user: serializeUser(user!), profile: user!.studentProfile || user!.teacherProfile || null }));
  } catch (error) {
    next(error);
  }
});

authRouter.post("/logout", (_req, res) => {
  res.json(ok({ success: true }));
});
