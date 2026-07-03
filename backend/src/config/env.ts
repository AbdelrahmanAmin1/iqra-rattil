import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  FRONTEND_URL: z.string().default("http://localhost:5173"),
  PORT: z.coerce.number().int().positive().default(4000),
  UPLOAD_DIR: z.string().default("./uploads"),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().positive().default(50),
  ADMIN_BOOTSTRAP_EMAIL: z.string().email().optional(),
  ADMIN_BOOTSTRAP_PASSWORD: z.string().optional(),
  ADMIN_BOOTSTRAP_NAME: z.string().optional(),
  SEED_ADMIN_EMAIL: z.string().email().optional(),
  SEED_ADMIN_PASSWORD: z.string().optional()
});

export const env = envSchema.parse(process.env);

export const frontendOrigins = () => {
  const origins = new Set<string>();

  for (const value of env.FRONTEND_URL.split(",").map((url) => url.trim()).filter(Boolean)) {
    try {
      const parsed = new URL(value);
      origins.add(parsed.origin);

      if (parsed.hostname === "localhost") {
        parsed.hostname = "127.0.0.1";
        origins.add(parsed.origin);
      } else if (parsed.hostname === "127.0.0.1") {
        parsed.hostname = "localhost";
        origins.add(parsed.origin);
      }
    } catch {
      origins.add(value);
    }
  }

  return [...origins];
};
