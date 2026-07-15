export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_URL.replace(/\/api\/?$/, "");

const contentRoute = /^\/admin\/(?:books|channel-videos|lessons|curriculum(?:\/|$)|settings$)/;

function broadcastContentUpdate() {
  if (typeof window === "undefined") return;

  const updatedAt = String(Date.now());
  localStorage.setItem("iqra_content_updated", updatedAt);
  window.dispatchEvent(new Event("iqra:content-updated"));
}

export function subscribeToContentUpdates(handler) {
  if (typeof window === "undefined") return () => {};

  const onStorage = (event) => {
    if (event.key === "iqra_content_updated") handler();
  };
  window.addEventListener("iqra:content-updated", handler);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("iqra:content-updated", handler);
    window.removeEventListener("storage", onStorage);
  };
}

export const sessionStore = {
  get() {
    try {
      const raw = localStorage.getItem("iqra_session");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set(session) {
    localStorage.setItem("iqra_session", JSON.stringify(session));
  },
  clear() {
    localStorage.removeItem("iqra_session");
  },
  token() {
    return this.get()?.token || null;
  }
};

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const token = sessionStore.token();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, { ...options, headers, cache: "no-store" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || "تعذر الاتصال بالخادم";
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  if (options.method && contentRoute.test(path)) broadcastContentUpdate();
  return payload.data;
}

const body = (value) => JSON.stringify(value || {});

export const api = {
  get: (path) => request(path),
  post: (path, value) => request(path, { method: "POST", body: body(value) }),
  patch: (path, value) => request(path, { method: "PATCH", body: body(value) }),
  put: (path, value) => request(path, { method: "PUT", body: body(value) }),
  delete: (path) => request(path, { method: "DELETE" }),
  upload: (path, formData, method = "POST") => request(path, { method, body: formData }),
  auth: {
    login: (value) => api.post("/auth/login", value),
    register: (value) => api.post("/auth/register", value),
    me: () => api.get("/auth/me")
  },
  notifications: {
    list: () => api.get("/notifications"),
    unreadCount: () => api.get("/notifications/unread-count"),
    markRead: (id) => api.patch(`/notifications/${id}/read`, {}),
    markAllRead: () => api.post("/notifications/mark-all-read", {}),
    preferences: () => api.get("/notifications/preferences"),
    updatePreferences: (value) => api.patch("/notifications/preferences", value)
  },
  student: {
    dashboard: () => api.get("/student/dashboard"),
    sessions: () => api.get("/student/sessions"),
    messages: () => api.get("/student/messages"),
    sendMessage: (text) => api.post("/student/messages", { text }),
    submitQuiz: (lessonId, answers) => api.post(`/student/quizzes/${lessonId}/attempts`, { answers }),
    updateProfile: (value) => api.patch("/student/profile", value)
  },
  teacher: {
    dashboard: () => api.get("/teacher/dashboard"),
    students: () => api.get("/teacher/students"),
    student: (id) => api.get(`/teacher/students/${id}`),
    assignStudent: (id) => api.post(`/teacher/students/${id}/assign`, {}),
    unassignStudent: (id) => api.delete(`/teacher/students/${id}/assign`),
    uploadMaterials: (formData) => api.upload("/teacher/materials", formData),
    saveAttendance: (value) => api.post("/teacher/attendance", value),
    sessions: () => api.get("/teacher/sessions"),
    createSession: (value) => api.post("/teacher/sessions", value),
    updateSession: (id, value) => api.patch(`/teacher/sessions/${id}`, value),
    deleteSession: (id) => api.delete(`/teacher/sessions/${id}`),
    threads: () => api.get("/teacher/messages"),
    thread: (studentId) => api.get(`/teacher/messages/${studentId}`),
    sendMessage: (studentId, text) => api.post(`/teacher/messages/${studentId}`, { text })
  },
  admin: {
    dashboard: () => api.get("/admin/dashboard"),
    settings: () => api.get("/admin/settings"),
    approvals: () => api.get("/admin/approvals"),
    approve: (id) => api.post(`/admin/approvals/${id}/approve`, {}),
    reject: (id) => api.post(`/admin/approvals/${id}/reject`, {}),
    users: (role) => api.get(`/admin/users${role ? `?role=${encodeURIComponent(role)}` : ""}`),
    createUser: (value) => api.post("/admin/users", value),
    updateUser: (id, value) => api.patch(`/admin/users/${id}`, value),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    content: () => api.get("/admin/content"),
    books: () => api.get("/admin/books"),
    createBook: (formData) => api.upload("/admin/books", formData),
    updateBook: (id, formData) => api.upload(`/admin/books/${id}`, formData, "PATCH"),
    moveBook: (id, direction) => api.post(`/admin/books/${id}/move`, { direction }),
    deleteBook: (id) => api.delete(`/admin/books/${id}`),
    videos: () => api.get("/admin/channel-videos"),
    createVideo: (value) => api.post("/admin/channel-videos", value),
    updateVideo: (id, value) => api.patch(`/admin/channel-videos/${id}`, value),
    deleteVideo: (id) => api.delete(`/admin/channel-videos/${id}`),
    lessons: () => api.get("/admin/lessons"),
    createLesson: (value) => api.post("/admin/lessons", value),
    updateLesson: (id, value) => api.patch(`/admin/lessons/${id}`, value),
    deleteLesson: (id) => api.delete(`/admin/lessons/${id}`),
    curriculum: () => api.get("/admin/curriculum"),
    createLevel: (value) => api.post("/admin/curriculum/levels", value),
    updateLevel: (id, value) => api.patch(`/admin/curriculum/levels/${id}`, value),
    deleteLevel: (id) => api.delete(`/admin/curriculum/levels/${id}`),
    createChapter: (value) => api.post("/admin/curriculum/chapters", value),
    updateChapter: (id, value) => api.patch(`/admin/curriculum/chapters/${id}`, value),
    deleteChapter: (id) => api.delete(`/admin/curriculum/chapters/${id}`),
    updateSettings: (value) => api.patch("/admin/settings", value)
  },
  public: {
    home: () => api.get("/public/home"),
    lead: (value) => api.post("/contact/leads", value),
    order: (value) => api.post("/orders", value)
  }
};
