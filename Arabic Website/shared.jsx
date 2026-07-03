// =====================================================
// shared.jsx — common UI: Icon, Logo, TopBar, Companion, etc.
// =====================================================

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ---------- Icons (line-style, currentColor) ----------
function Icon({ name, size = 20, color = "currentColor", stroke = 2 }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  const P = {
    home:    (<><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></>),
    book:    (<><path d="M4 4h7v16H4z" /><path d="M13 4h7v16h-7z" /><path d="M4 4c0-1 1-2 2-2" /></>),
    video:   (<><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3" /></>),
    quiz:    (<><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2.5-2.5 4" /><circle cx="12" cy="17" r="0.5" /></>),
    star:    (<path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />),
    zoom:    (<><rect x="3" y="6" width="14" height="12" rx="2" /><path d="M17 10l5-3v10l-5-3" /></>),
    chat:    (<><path d="M21 12a8 8 0 1 1-3-6.2L21 4v8z" /></>),
    upload:  (<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M17 8l-5-5-5 5" /><path d="M12 3v12" /></>),
    users:   (<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>),
    user:    (<><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a8 8 0 0 1 16 0v1" /></>),
    settings:(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.5 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7 4.5l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.5 7l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>),
    check:   (<path d="M20 6L9 17l-5-5" />),
    x:       (<><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>),
    arrow_l: (<><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></>),
    arrow_r: (<><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></>),
    chevron_d:(<path d="M6 9l6 6 6-6" />),
    plus:    (<><path d="M12 5v14" /><path d="M5 12h14" /></>),
    play:    (<polygon points="6,4 20,12 6,20" fill={color} />),
    lock:    (<><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 1 1 8 0v4" /></>),
    bell:    (<><path d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2v1h16v-1z" /><path d="M10 21a2 2 0 0 0 4 0" /></>),
    moon:    (<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />),
    sun:     (<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>),
    search:  (<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>),
    calendar:(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></>),
    download:(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></>),
    trophy:  (<><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" /><path d="M17 5h3a0 0 0 0 1 0 0v2a3 3 0 0 1-3 3" /><path d="M7 5H4a0 0 0 0 0 0 0v2a3 3 0 0 0 3 3" /></>),
    flame:   (<path d="M12 2s4 5 4 9a4 4 0 1 1-8 0c0-2 1-3 2-4-1 1-2 2-2 4a4 4 0 0 0 8 0c0-3-4-9-4-9z" />),
    pencil:  (<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></>),
    grad:    (<><path d="M22 10L12 4 2 10l10 6 10-6z" /><path d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5" /></>),
    folder:  (<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />),
    file:    (<><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /></>),
    eye:     (<><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></>),
    heart:   (<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />),
    whatsapp:(<path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.3A10 10 0 1 0 12 2zm5.7 14.2c-.3.8-1.6 1.5-2.2 1.6-.6.1-1.3.1-2.1-.1-.5-.1-1.2-.3-2-.7-3.5-1.5-5.8-5.1-6-5.3-.2-.3-1.4-1.9-1.4-3.6 0-1.7.9-2.5 1.2-2.9.3-.3.7-.4 1-.4h.7c.2 0 .5 0 .8.6l1.1 2.5c.1.2.1.4 0 .6-.1.2-.2.4-.3.5l-.4.5c-.1.1-.3.3-.1.6.1.3.7 1.1 1.5 1.8 1 .9 1.8 1.2 2.1 1.3.3.1.4.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.3.1 1.7.8 2 1 .3.2.5.2.6.4.1.2.1.9-.2 1.7z" fill={color} stroke="none" />),
    youtube: (<><path d="M22 8a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V8z" /><polygon points="10,9 16,12 10,15" fill={color} /></>),
    map:     (<><path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z" /><path d="M9 4v14M15 6v14" /></>),
  };
  return <svg {...props}>{P[name] || null}</svg>;
}

// ---------- Logo ----------
function Logo({ size = 44 }) {
  return (
    <div className="logo" style={{ width: size, height: size, fontSize: size * 0.5 }}>
      {/* stylised reed-pen + dot */}
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
        <path d="M3 21c4-1 7-4 8-8" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M11 13l6-6 4 4-6 6-4-4z" fill="white" />
        <circle cx="19" cy="5" r="1.6" fill="white" />
      </svg>
    </div>
  );
}

function BrandMark({ small = false }) {
  return (
    <div className="brand-mark">
      <Logo size={small ? 38 : 44} />
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}>
          مناهج اقرأ ورتّل
        </div>
        <div className="subtitle">مشروع الحافظ الصغير</div>
      </div>
    </div>
  );
}

// ---------- TopBar (landing) ----------
function TopBar({ onNavigate, currentRoute, onPickRole, onLogin, onRegister }) {
  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <a onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>
          <BrandMark />
        </a>
        <nav className="nav-links">
          <a className={currentRoute === "home" ? "active" : ""} onClick={() => onNavigate("home")}>الرئيسية</a>
          <a onClick={() => scrollToId("curriculum")}>المنهج</a>
          <a onClick={() => scrollToId("books")}>الحقيبة</a>
          <a onClick={() => scrollToId("channel")}>القناة</a>
          <a onClick={() => scrollToId("contact")}>تواصل</a>
        </nav>
        <div className="topbar-actions">
          <button className="btn ghost sm" onClick={onLogin || (() => onPickRole())}>تسجيل الدخول</button>
          <button className="btn primary sm" onClick={onRegister || (() => onPickRole())}>إنشاء حساب</button>
        </div>
      </div>
    </div>
  );
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---------- Dashboard TopBar ----------
function DashTopBar({ role, user, onSignOut, onHome }) {
  const labels = { student: "طالب", teacher: "معلم", admin: "مشرف" };
  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <a onClick={onHome} style={{ cursor: "pointer" }}>
          <BrandMark />
        </a>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span className="chip primary">{labels[role]}</span>
          <button className="btn ghost sm" onClick={onSignOut}>خروج</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Companion character (owl) ----------
function Owl({ size = 64, mood = "happy" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a4ed4" />
          <stop offset="100%" stopColor="#4f6df5" />
        </linearGradient>
        <linearGradient id="belly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff6e0" />
          <stop offset="100%" stopColor="#ffd57a" />
        </linearGradient>
      </defs>
      {/* body */}
      <ellipse cx="60" cy="68" rx="42" ry="44" fill="url(#body)" />
      {/* belly */}
      <ellipse cx="60" cy="78" rx="26" ry="28" fill="url(#belly)" />
      {/* head tufts */}
      <path d="M28 30c4-8 8-10 12-6l4 10z" fill="#5b3bb0" />
      <path d="M92 30c-4-8-8-10-12-6l-4 10z" fill="#5b3bb0" />
      {/* eyes */}
      <circle cx="44" cy="50" r="14" fill="#fff" />
      <circle cx="76" cy="50" r="14" fill="#fff" />
      <circle cx="46" cy="52" r="6" fill="#1f1a3d" />
      <circle cx="78" cy="52" r="6" fill="#1f1a3d" />
      <circle cx="48" cy="50" r="2" fill="#fff" />
      <circle cx="80" cy="50" r="2" fill="#fff" />
      {/* beak */}
      <path d="M58 60l4 6 4-6h-8z" fill="#ffb547" />
      {/* feet */}
      <path d="M48 108l-4 6M56 110v6M64 110v6M72 108l4 6" stroke="#ffb547" strokeWidth="3" strokeLinecap="round" />
      {/* book mark wing */}
      <path d="M18 72c-4 12 0 22 12 24M102 72c4 12 0 22-12 24" stroke="#5b3bb0" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function Companion({ message, show = true }) {
  const [open, setOpen] = useState(true);
  if (!show) return null;
  return (
    <>
      {open && message ? (
        <div className="companion-bubble anim-pop">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div>{message}</div>
            <button onClick={() => setOpen(false)} style={{ background: "transparent", border: 0, cursor: "pointer", color: "var(--muted)", fontSize: 16, lineHeight: 1 }}>×</button>
          </div>
        </div>
      ) : null}
      <div className="companion-fab anim-float" onClick={() => setOpen(o => !o)} title="حكمة (مرشدك)">
        <Owl size={64} />
      </div>
    </>
  );
}

// ---------- Progress bar ----------
function ProgressBar({ value }) {
  return (
    <div className="progress-bar">
      <div style={{ width: `${value}%` }} />
    </div>
  );
}

// ---------- Stars row ----------
function Stars({ count = 3, max = 3, size = 18 }) {
  const arr = Array.from({ length: max });
  return (
    <div style={{ display: "inline-flex", gap: 2 }}>
      {arr.map((_, i) => (
        <span key={i} style={{ color: i < count ? "var(--accent)" : "var(--bg-alt)", fontSize: size, lineHeight: 1 }}>★</span>
      ))}
    </div>
  );
}

// ---------- Avatar ----------
function Avatar({ name, color = "var(--grad-1)", size = 40 }) {
  const initial = (name || "?")[0];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color,
      display: "grid", placeItems: "center",
      color: "white", fontWeight: 800, fontSize: size * 0.42,
      flexShrink: 0,
    }}>{initial}</div>
  );
}

// ---------- Modal ----------
function Modal({ open, onClose, title, children, footer, width = 520 }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(15,10,30,0.5)", backdropFilter: "blur(4px)",
      display: "grid", placeItems: "center", zIndex: 1000, padding: 16,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "var(--surface)", borderRadius: "var(--r-lg)",
        width: "100%", maxWidth: width, maxHeight: "85vh", overflowY: "auto",
        boxShadow: "var(--shadow-lg)", border: "1px solid var(--line)",
      }} className="anim-pop">
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 20 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "transparent", border: 0, fontSize: 24, cursor: "pointer", color: "var(--muted)" }}>×</button>
        </div>
        <div style={{ padding: "22px" }}>{children}</div>
        {footer ? <div style={{ padding: "16px 22px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "flex-end", gap: 10 }}>{footer}</div> : null}
      </div>
    </div>
  );
}

// ---------- Helpers ----------
function cls(...args) { return args.filter(Boolean).join(" "); }

Object.assign(window, {
  Icon, Logo, BrandMark, TopBar, DashTopBar,
  Owl, Companion, ProgressBar, Stars, Avatar, Modal,
  cls, scrollToId,
});
