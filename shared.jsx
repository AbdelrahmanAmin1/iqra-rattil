import React from "react";
import { API_URL } from "./src/lib/api.js";
import { ACADEMY, BOOKS, CHANNEL_VIDEOS, CURRICULUM } from "./data.js";

const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

export function Icon({ name, size = 20, color = "currentColor", stroke = 2 }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true
  };
  const paths = {
    home: <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></>,
    book: <><path d="M4 4h7v16H4z" /><path d="M13 4h7v16h-7z" /></>,
    video: <><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3" /></>,
    quiz: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2.5-2.5 4" /><circle cx="12" cy="17" r="0.5" /></>,
    star: <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />,
    zoom: <><rect x="3" y="6" width="14" height="12" rx="2" /><path d="M17 10l5-3v10l-5-3" /></>,
    chat: <path d="M21 12a8 8 0 1 1-3-6.2L21 4v8z" />,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M17 8l-5-5-5 5" /><path d="M12 3v12" /></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a8 8 0 0 1 16 0v1" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.5 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7 4.5l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.5 7l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>,
    check: <path d="M20 6L9 17l-5-5" />,
    x: <><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>,
    arrow_l: <><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></>,
    arrow_r: <><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    play: <polygon points="6,4 20,12 6,20" fill={color} stroke="none" />,
    lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 1 1 8 0v4" /></>,
    bell: <><path d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2v1h16v-1z" /><path d="M10 21a2 2 0 0 0 4 0" /></>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></>,
    trophy: <><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" /><path d="M17 5H20v2a3 3 0 0 1-3 3" /><path d="M7 5H4v2a3 3 0 0 0 3 3" /></>,
    flame: <path d="M12 2s4 5 4 9a4 4 0 1 1-8 0c0-2 1-3 2-4-1 1-2 2-2 4a4 4 0 0 0 8 0c0-3-4-9-4-9z" />,
    pencil: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></>,
    grad: <><path d="M22 10L12 4 2 10l10 6 10-6z" /><path d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5" /></>,
    folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />,
    file: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /></>,
    eye: <><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />,
    youtube: <><path d="M22 8a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V8z" /><polygon points="10,9 16,12 10,15" fill={color} stroke="none" /></>,
    map: <><path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z" /><path d="M9 4v14M15 6v14" /></>
  };
  return <svg {...props}>{paths[name] || null}</svg>;
}

export function Logo({ size = 44 }) {
  return (
    <span className="logo" style={{ width: size, height: size, fontSize: size * 0.5 }}>
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 21c4-1 7-4 8-8" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M11 13l6-6 4 4-6 6-4-4z" fill="white" />
        <circle cx="19" cy="5" r="1.6" fill="white" />
      </svg>
    </span>
  );
}

export function Owl({ size = 64 }) {
  const rawId = React.useId().replace(/:/g, "");
  const bodyId = `owl-body-${rawId}`;
  const bellyId = `owl-belly-${rawId}`;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={bodyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a4ed4" />
          <stop offset="100%" stopColor="#4f6df5" />
        </linearGradient>
        <linearGradient id={bellyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff6e0" />
          <stop offset="100%" stopColor="#ffd57a" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="68" rx="42" ry="44" fill={`url(#${bodyId})`} />
      <ellipse cx="60" cy="78" rx="26" ry="28" fill={`url(#${bellyId})`} />
      <path d="M28 30c4-8 8-10 12-6l4 10z" fill="#5b3bb0" />
      <path d="M92 30c-4-8-8-10-12-6l-4 10z" fill="#5b3bb0" />
      <circle cx="44" cy="50" r="14" fill="#fff" />
      <circle cx="76" cy="50" r="14" fill="#fff" />
      <circle cx="46" cy="52" r="6" fill="#1f1a3d" />
      <circle cx="78" cy="52" r="6" fill="#1f1a3d" />
      <circle cx="48" cy="50" r="2" fill="#fff" />
      <circle cx="80" cy="50" r="2" fill="#fff" />
      <path d="M58 60l4 6 4-6h-8z" fill="#ffb547" />
      <path d="M48 108l-4 6M56 110v6M64 110v6M72 108l4 6" stroke="#ffb547" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 72c-4 12 0 22 12 24M102 72c4 12 0 22-12 24" stroke="#5b3bb0" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Companion({ message, show = true }) {
  const [open, setOpen] = React.useState(true);
  if (!show) return null;
  return (
    <>
      {open && message ? (
        <div className="companion-bubble anim-pop">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div>{message}</div>
            <button type="button" className="icon-button plain" onClick={() => setOpen(false)} aria-label="إغلاق">×</button>
          </div>
        </div>
      ) : null}
      <button type="button" className="companion-fab anim-float" onClick={() => setOpen((value) => !value)} aria-label="Iqraa companion">
        <Owl size={64} />
      </button>
    </>
  );
}

export function ProgressBar({ value = 0 }) {
  const width = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="progress-bar">
      <div style={{ width: `${width}%` }} />
    </div>
  );
}

export function Stars({ count = 3, max = 3, size = 18 }) {
  return (
    <div style={{ display: "inline-flex", gap: 2 }}>
      {Array.from({ length: max }).map((_, index) => (
        <span key={index} style={{ color: index < count ? "var(--accent)" : "var(--bg-alt)", fontSize: size, lineHeight: 1 }}>★</span>
      ))}
    </div>
  );
}

export function Avatar({ name, color = "var(--grad-1)", size = 40 }) {
  const initial = (name || "?").trim()[0] || "?";
  return (
    <div className="avatar" style={{ width: size, height: size, background: color, fontSize: size * 0.42 }}>
      {initial}
    </div>
  );
}

export function Modal({ open, onClose, title, children, footer, width = 520 }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel anim-pop" onClick={(event) => event.stopPropagation()} style={{ maxWidth: width }}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button type="button" className="icon-button plain" onClick={onClose} aria-label="إغلاق">×</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer ? <div className="modal-footer">{footer}</div> : null}
      </div>
    </div>
  );
}

export const roleLabel = { student: "طالب", teacher: "معلم", admin: "مشرف" };

export function assetUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function youtubeUrl(id) {
  return `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
}

export function mergeHomeContent(data) {
  return {
    academy: { ...ACADEMY, ...(data?.academy || {}) },
    curriculum: data?.curriculum?.length ? data.curriculum : CURRICULUM,
    books: data?.books?.length ? data.books : BOOKS,
    channelVideos: data?.channelVideos?.length ? data.channelVideos : CHANNEL_VIDEOS,
    packagePrice: data?.packagePrice || data?.academy?.packagePrice || ACADEMY.packagePrice
  };
}

export function Loading({ label = "جاري التحميل..." }) {
  return (
    <div className="app-shell" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div className="card elev">{label}</div>
    </div>
  );
}

export function ErrorBanner({ error }) {
  return error ? (
    <div className="card" style={{ borderColor: "var(--danger)", color: "var(--danger)", marginBottom: 14 }}>
      {error}
    </div>
  ) : null;
}

export function EmptyState({ title = "لا توجد بيانات بعد", body = "ستظهر البيانات هنا عند إضافتها من لوحة المشرف." }) {
  return (
    <div className="card flat" style={{ textAlign: "center", padding: 30 }}>
      <h3 className="f-20">{title}</h3>
      <p className="muted mt-8">{body}</p>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function BrandMark({ subtitle = ACADEMY.project, compact = false }) {
  return (
    <span className="brand-mark">
      <Logo size={compact ? 38 : 44} />
      <span>
        {compact ? "اقرأ ورتّل" : ACADEMY.name}
        <span className="subtitle">{subtitle}</span>
      </span>
    </span>
  );
}

export function PublicTopbar({ onLogin }) {
  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <a href="#home" aria-label="الرئيسية"><BrandMark /></a>
        <nav className="nav-links" aria-label="روابط الصفحة">
          <a className="active" href="#home">الرئيسية</a>
          <a href="#curriculum">المنهج</a>
          <a href="#books">الحقيبة</a>
          <a href="#channel">القناة</a>
          <a href="#contact">تواصل</a>
        </nav>
        <div className="topbar-actions">
          <button type="button" className="btn solid sm" onClick={onLogin}>دخول الطالب</button>
          <button type="button" className="btn primary sm" onClick={onLogin}>تسجيل الدخول</button>
        </div>
      </div>
    </div>
  );
}

export function SectionTitle({ eyebrow, title, body }) {
  return (
    <div className="page-head">
      <div>
        {eyebrow ? <span className="chip primary">{eyebrow}</span> : null}
        <h2 className="mt-16">{title}</h2>
        {body ? <p>{body}</p> : null}
      </div>
    </div>
  );
}

export function Stat({ value, label, delta }) {
  return (
    <div className="stat">
      <div className="v">{value}</div>
      <div className="l">{label}</div>
      {delta ? <div className="delta up mt-8">{delta}</div> : null}
    </div>
  );
}

export function DashboardTabs({ tabs, labels, tab, setTab }) {
  return (
    <div className="tabs" style={{ marginBottom: 18, flexWrap: "wrap" }}>
      {tabs.map((item) => (
        <button type="button" key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
          {labels[item]}
        </button>
      ))}
    </div>
  );
}

export function DashboardShell({ session, tab, setTab, tabs, labels, children }) {
  const icons = {
    home: "home",
    lessons: "book",
    sessions: "zoom",
    chat: "chat",
    books: "book",
    badges: "trophy",
    profile: "user",
    students: "users",
    materials: "upload",
    approvals: "check",
    users: "users",
    content: "folder",
    settings: "settings"
  };
  return (
    <div className="container dashboard">
      <aside className="sidebar">
        <div className="me">
          <Avatar name={session.user.fullName || "ا"} />
          <div>
            <div className="name">{session.user.fullName}</div>
            <div className="role">{roleLabel[session.user.role]}</div>
          </div>
        </div>
        {tabs.map((item) => (
          <button type="button" key={item} className={`side-link ${tab === item ? "active" : ""}`} onClick={() => setTab(item)}>
            <span className="ico"><Icon name={icons[item] || "star"} size={18} /></span>
            <span>{labels[item]}</span>
          </button>
        ))}
      </aside>
      <main>
        <DashboardTabs tabs={tabs} labels={labels} tab={tab} setTab={setTab} />
        {children}
      </main>
    </div>
  );
}

export function BookGrid({ books = [] }) {
  if (!books.length) return <EmptyState title="لا توجد كتب" body="أضف الكتب وملفاتها من لوحة المشرف." />;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 18 }}>
      {books.map((book) => {
        const link = book.externalUrl || assetUrl(book.filePath);
        const cover = assetUrl(book.coverPath);
        return (
          <article key={book.id || book.code} className="book-card">
            {cover ? (
              <img className="book-cover" src={cover} alt={book.title} style={{ padding: 0, objectFit: "cover" }} />
            ) : (
              <div className="book-cover" style={{ background: book.color || "var(--grad-1)" }}>{book.title}</div>
            )}
            <h3 className="f-20">{book.title}</h3>
            <p className="muted f-14 mt-8">{book.subtitle}</p>
            <div className="spread mt-16">
              <span className="chip">{book.level || "عام"}</span>
              <span className="bold">{book.price ? `${book.price} جنيه` : ""}</span>
            </div>
            <div className="mt-16">
              {book.soon ? (
                <span className="chip accent">قريبًا</span>
              ) : link ? (
                <a className="btn ghost sm" href={link} target="_blank" rel="noreferrer">فتح الكتاب</a>
              ) : (
                <span className="chip">بانتظار الملف</span>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function SessionList({ sessions = [], onEdit, onDelete }) {
  if (!sessions.length) return <EmptyState title="لا توجد حلقات" body="عند إنشاء المعلم للحلقات ستظهر هنا." />;
  return (
    <div className="col">
      {sessions.map((session) => {
        const link = session.link || session.meetingLink;
        return (
          <div key={session.id} className="card">
            <div className="spread">
              <div>
                <h3 className="f-22">{session.title}</h3>
                <p className="muted mt-8">{session.date || session.dateLabel} — {session.time || session.timeLabel} — {session.duration}</p>
                {session.teacher ? <span className="chip mt-8">{session.teacher}</span> : null}
              </div>
              <div className="row">
                {link ? (
                  <>
                    <a className="btn primary sm" href={link} target="_blank" rel="noreferrer">فتح الرابط</a>
                    <button type="button" className="btn ghost sm" onClick={() => navigator.clipboard?.writeText(link)}>نسخ</button>
                  </>
                ) : (
                  <span className="chip">لا يوجد رابط بعد</span>
                )}
                {onEdit ? <button type="button" className="btn ghost sm" onClick={() => onEdit(session)}>تعديل</button> : null}
                {onDelete ? <button type="button" className="btn ghost sm" onClick={() => onDelete(session.id)}>حذف</button> : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ChatWindow({ title, messages, text, setText, send, error }) {
  return (
    <div className="card">
      <div className="spread">
        <h3>{title}</h3>
        <span className="chip success">متصل بالمنصة</span>
      </div>
      <ErrorBanner error={error} />
      <div style={{ minHeight: 320, maxHeight: 420, overflow: "auto", padding: 16, borderRadius: 18, background: "var(--bg-soft)", marginTop: 12 }}>
        {messages?.length ? messages.map((message) => (
          <div key={message.id} style={{ margin: "8px 0", textAlign: message.from === "me" ? "start" : "end" }}>
            <span style={{ display: "inline-block", padding: "10px 14px", borderRadius: 14, background: message.from === "me" ? "var(--primary)" : "var(--surface)", color: message.from === "me" ? "white" : "var(--ink)" }}>
              {message.text}
            </span>
          </div>
        )) : <EmptyState title="لا توجد رسائل" body="ابدأ المحادثة من حقل الرسالة." />}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send()} placeholder="اكتب رسالة..." style={{ flex: 1 }} />
        <button type="button" className="btn primary" onClick={send} disabled={!text.trim()}>إرسال</button>
      </div>
    </div>
  );
}

export function asFormData(values, files = {}) {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  Object.entries(files).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });
  return formData;
}
