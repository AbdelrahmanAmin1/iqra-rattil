import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const demoEmails = [
  "demo.student@iqra-rattil.local",
  "demo.teacher@iqra-rattil.local",
  "demo.admin@iqra-rattil.local",
  "noor.student@iqra-rattil.local",
  "ahmad.student@iqra-rattil.local",
  "pending.teacher@iqra-rattil.local"
];

async function main() {
  await prisma.$transaction([
    prisma.messageThread.deleteMany({
      where: {
        OR: [
          { teacher: { email: { in: demoEmails } } },
          { student: { email: { in: demoEmails } } }
        ]
      }
    }),
    prisma.classSession.deleteMany({
      where: {
        OR: [
          { meetingLink: "https://zoom.us/j/0000000000" },
          { teacher: { is: { email: { in: demoEmails } } } },
          { createdBy: { is: { email: { in: demoEmails } } } }
        ]
      }
    }),
    prisma.material.deleteMany({
      where: { uploadedBy: { is: { email: { in: demoEmails } } } }
    }),
    prisma.user.deleteMany({ where: { email: { in: demoEmails } } })
  ]);

  console.log("Known demo accounts, fake sessions, and their uploaded materials removed. Iqraa project content was preserved.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
