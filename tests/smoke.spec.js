import { expect, test } from "@playwright/test";

test("home renders restored backend-driven Iqraa content without crashing", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /تأسيس صحيح/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "كتاب المستوى الأول" })).toBeVisible();
  await expect(page.getByRole("button", { name: "تسجيل الدخول" })).toBeVisible();
});

test("auth screen exposes login and teacher registration path", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "تسجيل الدخول" }).click();
  await expect(page.getByRole("heading", { name: "تسجيل الدخول" })).toBeVisible();
  await page.getByRole("button", { name: "تسجيل" }).click();
  await page.getByRole("button", { name: "معلم" }).click();
  await expect(page.getByLabel("سنوات الخبرة")).toBeVisible();
  await expect(page.getByRole("button", { name: "إنشاء الحساب" })).toBeEnabled();
});

test("teacher registration sends only teacher fields and omits blank numbers", async ({ page }) => {
  await page.route("**/api/auth/register", (route) =>
    route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        data: {
          pending: true,
          message: "ok",
          user: { id: "teacher-1", role: "teacher", fullName: "Teacher Test" }
        }
      })
    })
  );

  await page.goto("/");
  await page.getByRole("button", { name: "تسجيل الدخول" }).click();
  await page.getByRole("button", { name: "تسجيل" }).click();
  await page.getByRole("button", { name: "معلم" }).click();
  await page.getByLabel("الاسم الكامل").fill("Teacher Test");
  await page.getByLabel("البريد الإلكتروني").fill("teacher.payload@example.com");
  await page.getByLabel("كلمة المرور").fill("secret123");

  const requestPromise = page.waitForRequest("**/api/auth/register");
  await page.getByRole("button", { name: "إنشاء الحساب" }).click();
  const payload = (await requestPromise).postDataJSON();

  expect(payload).toMatchObject({
    role: "teacher",
    fullName: "Teacher Test",
    email: "teacher.payload@example.com",
    phone: "",
    password: "secret123",
    specialty: "تأسيس القراءة"
  });
  expect("age" in payload).toBe(false);
  expect("experience" in payload).toBe(false);
  expect("level" in payload).toBe(false);
  expect("mode" in payload).toBe(false);
  expect("parentName" in payload).toBe(false);
});

test("student registration omits blank age and teacher fields", async ({ page }) => {
  await page.route("**/api/auth/register", (route) =>
    route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        data: {
          token: "student-token",
          user: { id: "student-1", role: "student", fullName: "Student Test" }
        }
      })
    })
  );

  await page.goto("/");
  await page.getByRole("button", { name: "تسجيل الدخول" }).click();
  await page.getByRole("button", { name: "تسجيل" }).click();
  await page.getByLabel("الاسم الكامل").fill("Student Test");
  await page.getByLabel("البريد الإلكتروني").fill("student.payload@example.com");
  await page.getByLabel("كلمة المرور").fill("secret123");

  const requestPromise = page.waitForRequest("**/api/auth/register");
  await page.getByRole("button", { name: "إنشاء الحساب" }).click();
  const payload = (await requestPromise).postDataJSON();

  expect(payload).toMatchObject({
    role: "student",
    fullName: "Student Test",
    email: "student.payload@example.com",
    phone: "",
    password: "secret123",
    level: "المستوى الأول",
    mode: "أون لاين",
    parentName: ""
  });
  expect("age" in payload).toBe(false);
  expect("experience" in payload).toBe(false);
  expect("specialty" in payload).toBe(false);
});

test("teacher can assign an available student without blanking the app", async ({ page }, testInfo) => {
  const teacher = { id: "teacher-1", role: "teacher", fullName: "Teacher Test", avatarColor: "var(--grad-3)" };
  const assigned = { id: "assigned-1", name: "Assigned Student", age: 8, level: "المستوى الأول", progress: 25, stars: 2, status: "active" };
  const available = { id: "available-1", name: "Available Student", age: 9, level: "المستوى الثاني", progress: 0, stars: 0, status: "active" };
  let assignedNow = false;

  await page.addInitScript((session) => localStorage.setItem("iqra_session", JSON.stringify(session)), {
    token: "teacher-token",
    user: teacher,
    profile: {}
  });

  await page.route("**/api/auth/me", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: { user: teacher, profile: {} } }) })
  );
  await page.route("**/api/notifications/unread-count", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: { unreadCount: 0 } }) })
  );
  await page.route("**/api/teacher/dashboard", (route) => {
    const students = assignedNow ? [assigned, available] : [assigned];
    const availableStudents = assignedNow ? [] : [available];
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: {
          totals: { students: students.length, activeToday: students.length, sessionsWeek: 0, avgProgress: 13, availableStudents: availableStudents.length },
          students,
          availableStudents,
          sessions: [],
          materials: []
        }
      })
    });
  });
  await page.route("**/api/teacher/students/available-1/assign", (route) => {
    assignedNow = true;
    route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ data: { student: available, message: "تم إسناد الطالب" } })
    });
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "أهلًا بك، أستاذنا" })).toBeVisible();
  await page.getByRole("button", { name: /^الطلاب$/ }).first().click();
  await expect(page.getByRole("heading", { name: "طلاب متاحون للإسناد" })).toBeVisible();
  await expect(page.getByRole("button", { name: "إسناد إليّ" })).toBeVisible();

  const assignButton = page.getByRole("button", { name: "إسناد إليّ" });
  if (testInfo.project.name === "mobile") await assignButton.dispatchEvent("click");
  else await assignButton.click();
  await expect(page.getByRole("button", { name: "إسناد إليّ" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "إلغاء الإسناد" })).toHaveCount(2);

  await page.getByRole("button", { name: /^الحلقات$/ }).first().click();
  await page.getByRole("button", { name: /^المواد$/ }).first().click();
  await page.getByRole("button", { name: /^الطلاب$/ }).first().click();
  await expect(page.locator("#root")).toContainText("Teacher Test");
});

test("teacher assignment conflict shows an error", async ({ page }, testInfo) => {
  const teacher = { id: "teacher-1", role: "teacher", fullName: "Teacher Test", avatarColor: "var(--grad-3)" };
  const available = { id: "available-2", name: "Busy Student", age: 9, level: "المستوى الثاني", progress: 0, stars: 0, status: "active" };

  await page.addInitScript((session) => localStorage.setItem("iqra_session", JSON.stringify(session)), {
    token: "teacher-token",
    user: teacher,
    profile: {}
  });

  await page.route("**/api/auth/me", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: { user: teacher, profile: {} } }) })
  );
  await page.route("**/api/notifications/unread-count", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: { unreadCount: 0 } }) })
  );
  await page.route("**/api/teacher/dashboard", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: {
          totals: { students: 0, activeToday: 0, sessionsWeek: 0, avgProgress: 0, availableStudents: 1 },
          students: [],
          availableStudents: [available],
          sessions: [],
          materials: []
        }
      })
    })
  );
  await page.route("**/api/teacher/students/available-2/assign", (route) =>
    route.fulfill({
      status: 409,
      contentType: "application/json",
      body: JSON.stringify({ error: { code: "STUDENT_ALREADY_ASSIGNED", message: "هذا الطالب مسند إلى معلم آخر" } })
    })
  );

  await page.goto("/");
  await page.getByRole("button", { name: /^الطلاب$/ }).first().click();
  const assignButton = page.getByRole("button", { name: "إسناد إليّ" });
  if (testInfo.project.name === "mobile") await assignButton.dispatchEvent("click");
  else await assignButton.click();
  await expect(page.getByText("هذا الطالب مسند إلى معلم آخر")).toBeVisible();
});
