import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { env, frontendOrigins } from "./config/env.js";
import { notFound, errorHandler } from "./middlewares/error.js";
import { adminRouter } from "./routes/admin.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { notificationRouter } from "./routes/notification.routes.js";
import { publicRouter } from "./routes/public.routes.js";
import { studentRouter } from "./routes/student.routes.js";
import { teacherRouter } from "./routes/teacher.routes.js";

export const createApp = () => {
  const app = express();

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })
  );
  app.use(
    cors({
      origin: frontendOrigins(),
      credentials: true
    })
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan("dev"));
  app.use("/uploads", express.static(path.resolve(env.UPLOAD_DIR)));

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    standardHeaders: true,
    legacyHeaders: false
  });

  app.use("/api/auth", authLimiter, authRouter);
  app.use("/api", publicRouter);
  app.use("/api/notifications", notificationRouter);
  app.use("/api/student", studentRouter);
  app.use("/api/teacher", teacherRouter);
  app.use("/api/admin", adminRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
