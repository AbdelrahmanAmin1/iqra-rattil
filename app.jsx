import React, { useEffect, useState } from "react";
import LandingPage from "./landing.jsx";
import AuthPage from "./auth.jsx";
import StudentDashboard from "./student.jsx";
import TeacherDashboard from "./teacher.jsx";
import AdminDashboard from "./admin.jsx";
import TweaksPanel from "./tweaks-panel.jsx";
import { api, sessionStore } from "./src/lib/api.js";
import { closeSocket, getSocket } from "./src/lib/realtime.js";
import { BrandMark, Companion, EmptyState, ErrorBanner, Loading, roleLabel } from "./shared.jsx";

export default function App() {
  const [session, setSession] = useState(() => sessionStore.get());
  const [checked, setChecked] = useState(false);
  const [screen, setScreen] = useState("home");
  const [homeResetKey, setHomeResetKey] = useState(0);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const current = sessionStore.get();
    if (!current?.token) {
      setChecked(true);
      return;
    }
    api.auth.me()
      .then((result) => {
        const next = { token: current.token, user: result.user, profile: result.profile || null };
        sessionStore.set(next);
        setSession(next);
        setScreen(result.user.role);
      })
      .catch(() => {
        sessionStore.clear();
        setSession(null);
      })
      .finally(() => setChecked(true));
  }, []);

  useEffect(() => {
    if (!session?.token) {
      closeSocket();
      return;
    }
    api.notifications.unreadCount().then((data) => setUnread(data.unreadCount || 0)).catch(() => {});
    const socket = getSocket();
    socket?.on("notification:new", (payload) => setUnread(payload.unreadCount || 0));
    return () => socket?.off("notification:new");
  }, [session?.token]);

  const completeAuth = (result) => {
    const next = { token: result.token, user: result.user, profile: result.profile || null };
    sessionStore.set(next);
    setSession(next);
    setScreen(result.user.role);
  };

  const signOut = () => {
    sessionStore.clear();
    closeSocket();
    setSession(null);
    setScreen("home");
  };

  const goToRoleHome = () => {
    if (!session?.user?.role) return;
    setScreen(session.user.role);
    setHomeResetKey((key) => key + 1);
  };

  if (!checked) return <Loading />;

  if (!session && screen === "auth") {
    return (
      <>
        <AuthPage onBack={() => setScreen("home")} onAuth={completeAuth} />
        <TweaksPanel />
      </>
    );
  }

  if (!session) {
    return (
      <>
        <LandingPage onLogin={() => setScreen("auth")} />
        <Companion message="مرحبًا بك في اقرأ ورتل. ابدأ من تسجيل الدخول أو استعرض المنهج." />
        <TweaksPanel />
      </>
    );
  }

  const companionMessage = {
    student: "مرحبًا يا بطل! تابع درسك وحلقتك من هنا.",
    teacher: "لوحة المعلم جاهزة للحلقات والطلاب والمحادثات.",
    admin: "كل أرقام المشرف هنا من الخادم الحقيقي."
  }[session.user.role];
  const activeScreen = screen === session.user.role ? screen : session.user.role;

  return (
    <div className="app-shell" dir="rtl">
      <LoggedTopbar session={session} onDashboardClick={goToRoleHome} onSignOut={signOut} unread={unread} setUnread={setUnread} />
      {activeScreen === "student" && <StudentDashboard session={session} homeResetKey={homeResetKey} />}
      {activeScreen === "teacher" && <TeacherDashboard session={session} homeResetKey={homeResetKey} />}
      {activeScreen === "admin" && <AdminDashboard session={session} homeResetKey={homeResetKey} />}
      <Companion message={companionMessage} />
      <TweaksPanel />
    </div>
  );
}

function LoggedTopbar({ session, onDashboardClick, onSignOut, unread, setUnread }) {
  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <button type="button" onClick={onDashboardClick} style={{ background: "transparent", border: 0, padding: 0 }}>
          <BrandMark compact subtitle={`لوحة ${roleLabel[session.user.role]}`} />
        </button>
        <div className="topbar-actions">
          <button type="button" className="btn ghost sm" onClick={onDashboardClick}>لوحة {roleLabel[session.user.role]}</button>
          <NotificationBell unread={unread} setUnread={setUnread} />
          <span className="chip primary">{session.user.fullName}</span>
          <button type="button" className="btn ghost sm" onClick={onSignOut}>تسجيل الخروج</button>
        </div>
      </div>
    </div>
  );
}

function NotificationBell({ unread, setUnread }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const data = await api.notifications.list();
      setItems(data.notifications || []);
      setUnread(data.unreadCount || 0);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const socket = getSocket();
    const onNew = (payload) => {
      setItems((current) => [payload.notification, ...current.filter((item) => item.id !== payload.notification.id)]);
      setUnread(payload.unreadCount || 0);
    };
    socket?.on("notification:new", onNew);
    return () => socket?.off("notification:new", onNew);
  }, [setUnread]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) load();
  };

  const markAll = async () => {
    setError("");
    try {
      await api.notifications.markAllRead();
      setItems((current) => current.map((item) => ({ ...item, readAt: item.readAt || new Date().toISOString() })));
      setUnread(0);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button type="button" className="btn ghost sm" onClick={toggle}>الإشعارات {unread ? `(${unread})` : ""}</button>
      {open ? (
        <div className="card elev notification-popover">
          <div className="spread">
            <h3 className="f-16">الإشعارات</h3>
            <button type="button" className="btn ghost sm" onClick={markAll} disabled={!items.length}>قراءة الكل</button>
          </div>
          <ErrorBanner error={error} />
          {items.length ? items.map((item) => (
            <div key={item.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
              <div className="bold f-14">{item.title}</div>
              {item.body ? <div className="muted f-13 mt-8">{item.body}</div> : null}
              <div className="muted f-12 mt-8">{item.readAt ? "مقروء" : "جديد"}</div>
            </div>
          )) : <EmptyState title="لا توجد إشعارات" body="ستظهر هنا إشعارات المحادثات والحلقات والمحتوى." />}
        </div>
      ) : null}
    </div>
  );
}
