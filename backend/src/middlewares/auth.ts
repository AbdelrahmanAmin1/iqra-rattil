import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import type { Role, User } from "@prisma/client";
import { env } from "../config/env.js";
import { prisma } from "../prisma.js";
import { HttpError } from "../utils/http.js";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

type JwtPayload = {
  sub: string;
  role: Role;
};

export const authenticate: RequestHandler = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) throw new HttpError(401, "UNAUTHENTICATED", "يرجى تسجيل الدخول أولاً");

    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new HttpError(401, "UNAUTHENTICATED", "جلسة الدخول غير صالحة");
    if (user.status !== "ACTIVE") {
      throw new HttpError(403, "ACCOUNT_INACTIVE", "الحساب غير مفعل بعد");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof HttpError) return next(error);
    next(new HttpError(401, "UNAUTHENTICATED", "جلسة الدخول غير صالحة"));
  }
};

export const authorize = (...roles: Role[]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) return next(new HttpError(401, "UNAUTHENTICATED", "يرجى تسجيل الدخول أولاً"));
    if (!roles.includes(req.user.role)) {
      return next(new HttpError(403, "FORBIDDEN", "ليست لديك صلاحية لتنفيذ هذا الإجراء"));
    }
    next();
  };
};
