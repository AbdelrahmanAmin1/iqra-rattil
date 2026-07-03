import type { User } from "@prisma/client";

export const serializeUser = (user: User) => ({
  id: user.id,
  email: user.email,
  fullName: user.fullName,
  phone: user.phone,
  role: user.role.toLowerCase(),
  status: user.status.toLowerCase(),
  avatarColor: user.avatarColor,
  createdAt: user.createdAt
});

export const roleToPrisma = (role: string) => {
  const normalized = role.toUpperCase();
  if (!["STUDENT", "TEACHER", "ADMIN"].includes(normalized)) return null;
  return normalized as "STUDENT" | "TEACHER" | "ADMIN";
};

export const statusAr = (status: string) => {
  if (status === "PRESENT") return "حاضر";
  if (status === "LATE") return "متأخر";
  if (status === "ABSENT") return "غائب";
  return status;
};
