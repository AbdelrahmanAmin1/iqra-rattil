import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { Role, User } from "@prisma/client";
import { env } from "../config/env.js";

export const hashPassword = (password: string) => bcrypt.hash(password, 12);

export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);

export const issueToken = (user: Pick<User, "id" | "role">) => {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign({ role: user.role as Role }, env.JWT_SECRET, {
    ...options,
    subject: user.id
  });
};
