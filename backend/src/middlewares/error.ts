import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { HttpError } from "../utils/http.js";

export const notFound: RequestHandler = (req, _res, next) => {
  next(new HttpError(404, "NOT_FOUND", `Route not found: ${req.method} ${req.path}`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "البيانات المرسلة غير صحيحة",
        fields: err.flatten()
      }
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        fields: err.fields
      }
    });
  }

  console.error(err);
  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "حدث خطأ غير متوقع"
    }
  });
};
