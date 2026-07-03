import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const email = process.env.ADMIN_BOOTSTRAP_EMAIL || process.env.SEED_ADMIN_EMAIL;
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD || process.env.SEED_ADMIN_PASSWORD;
const fullName = process.env.ADMIN_BOOTSTRAP_NAME || "المشرف العام";

async function main() {
  if (!email || !password) {
    throw new Error("ADMIN_BOOTSTRAP_EMAIL and ADMIN_BOOTSTRAP_PASSWORD are required");
  }
  if (password.length < 8) {
    throw new Error("ADMIN_BOOTSTRAP_PASSWORD must be at least 8 characters");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {
      fullName,
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
      avatarColor: "var(--grad-2)"
    },
    create: {
      email: email.toLowerCase(),
      passwordHash,
      fullName,
      role: "ADMIN",
      status: "ACTIVE",
      avatarColor: "var(--grad-2)"
    }
  });

  console.log(`Admin bootstrap complete: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
