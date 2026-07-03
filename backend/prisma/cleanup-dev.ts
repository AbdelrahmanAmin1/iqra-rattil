import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { env } from "../src/config/env.js";

const prisma = new PrismaClient();

const isDryRun = process.argv.includes("--dry-run");

const disposableUserWhere = {
  OR: [
    { email: { startsWith: "verify." } },
    { email: { endsWith: "@iqra.local" } }
  ]
};

const testMaterialWhere = {
  OR: [
    { originalName: "package.json" },
    { title: "package.json" },
    { storagePath: { contains: "package.json" } },
    { publicPath: { contains: "package.json" } }
  ]
};

const smokeLeadWhere = {
  OR: [
    { AND: [{ source: "codex" }, { message: "integration smoke" }] },
    { AND: [{ name: { startsWith: "Lead " } }, { message: "integration smoke" }] }
  ]
};

const smokeOrderWhere = {
  AND: [{ name: { startsWith: "Order " } }, { note: "integration smoke" }]
};

const insideDirectory = (candidate: string, root: string) => {
  const relative = path.relative(root, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
};

const unique = <T>(items: T[]) => Array.from(new Set(items));

async function removeLocalTestFiles(materials: Array<{ storagePath: string | null; publicPath: string | null }>) {
  const uploadRoot = path.resolve(env.UPLOAD_DIR);
  const candidates = unique(
    materials.flatMap((material) => {
      const paths: string[] = [];
      if (material.storagePath) paths.push(path.resolve(material.storagePath));
      if (material.publicPath) paths.push(path.resolve(uploadRoot, path.basename(material.publicPath)));
      return paths;
    })
  );

  const summary = {
    deleted: [] as string[],
    missing: [] as string[],
    skipped: [] as string[],
    errors: [] as Array<{ file: string; message: string }>
  };

  for (const filePath of candidates) {
    const fileName = path.basename(filePath).toLowerCase();
    if (!insideDirectory(filePath, uploadRoot) || !fileName.includes("package.json")) {
      summary.skipped.push(filePath);
      continue;
    }

    if (isDryRun) {
      summary.skipped.push(`${filePath} (dry run)`);
      continue;
    }

    try {
      await fs.unlink(filePath);
      summary.deleted.push(filePath);
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === "ENOENT") {
        summary.missing.push(filePath);
      } else {
        summary.errors.push({ file: filePath, message: (error as Error).message });
      }
    }
  }

  return summary;
}

async function main() {
  const disposableUsers = await prisma.user.findMany({
    where: disposableUserWhere,
    select: { id: true, email: true }
  });
  const disposableUserIds = disposableUsers.map((user) => user.id);

  const smokeSessionWhere =
    disposableUserIds.length > 0
      ? {
          OR: [
            { title: { startsWith: "Smoke Session " } },
            { teacherId: { in: disposableUserIds } },
            { createdById: { in: disposableUserIds } }
          ]
        }
      : { title: { startsWith: "Smoke Session " } };

  const [
    materials,
    smokeSessions,
    smokeLeads,
    smokeOrders,
    dependentProfiles,
    dependentQuizAttempts,
    dependentProgress,
    dependentThreads
  ] = await Promise.all([
    prisma.material.findMany({
      where: testMaterialWhere,
      select: { id: true, title: true, originalName: true, storagePath: true, publicPath: true }
    }),
    prisma.classSession.count({ where: smokeSessionWhere }),
    prisma.contactLead.count({ where: smokeLeadWhere }),
    prisma.orderRequest.count({ where: smokeOrderWhere }),
    Promise.all([
      prisma.studentProfile.count({ where: { userId: { in: disposableUserIds } } }),
      prisma.teacherProfile.count({ where: { userId: { in: disposableUserIds } } })
    ]),
    prisma.quizAttempt.count({ where: { studentId: { in: disposableUserIds } } }),
    prisma.studentLessonProgress.count({ where: { studentId: { in: disposableUserIds } } }),
    prisma.messageThread.count({
      where: { OR: [{ teacherId: { in: disposableUserIds } }, { studentId: { in: disposableUserIds } }] }
    })
  ]);

  const summary = {
    disposableUsers: disposableUsers.length,
    disposableEmails: disposableUsers.map((user) => user.email).sort(),
    packageJsonMaterials: materials.length,
    smokeSessions,
    smokeLeads,
    smokeOrders,
    dependentProfiles: dependentProfiles[0] + dependentProfiles[1],
    dependentQuizAttempts,
    dependentLessonProgress: dependentProgress,
    dependentMessageThreads: dependentThreads
  };

  if (isDryRun) {
    console.log("Development cleanup dry run. No database rows or files were deleted.");
    console.log(JSON.stringify(summary, null, 2));
    await removeLocalTestFiles(materials);
    return;
  }

  const deleted = await prisma.$transaction(async (tx) => {
    const deletedMaterials = await tx.material.deleteMany({ where: testMaterialWhere });
    const deletedSessions = await tx.classSession.deleteMany({ where: smokeSessionWhere });
    const deletedLeads = await tx.contactLead.deleteMany({ where: smokeLeadWhere });
    const deletedOrders = await tx.orderRequest.deleteMany({ where: smokeOrderWhere });
    const deletedUsers = await tx.user.deleteMany({ where: disposableUserWhere });

    return {
      packageJsonMaterials: deletedMaterials.count,
      smokeSessions: deletedSessions.count,
      smokeLeads: deletedLeads.count,
      smokeOrders: deletedOrders.count,
      disposableUsers: deletedUsers.count
    };
  });

  const files = await removeLocalTestFiles(materials);

  console.log("Development cleanup complete.");
  console.log(
    JSON.stringify(
      {
        ...deleted,
        disposableEmails: summary.disposableEmails,
        cascadeOwnedDependents: {
          profiles: summary.dependentProfiles,
          quizAttempts: summary.dependentQuizAttempts,
          lessonProgress: summary.dependentLessonProgress,
          messageThreads: summary.dependentMessageThreads
        },
        files
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error("Development cleanup failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
