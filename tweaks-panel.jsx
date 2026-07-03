import React, { useEffect, useState } from "react";
import { Icon } from "./shared.jsx";

const themes = [
  { id: "playful", label: "مرح", colors: ["#ff7a45", "#ffc847", "#2bb673"] },
  { id: "refined", label: "قرآني", colors: ["#2e7d5b", "#b08a3e", "#5a4a7a"] },
  { id: "modern", label: "حديث", colors: ["#4f6df5", "#00bfa6", "#ff5e8a"] }
];

const fonts = [
  { id: "almarai", label: "المراعي" },
  { id: "cairo", label: "القاهرة" },
  { id: "tajawal", label: "تجوال" },
  { id: "amiri", label: "أميري" }
];

export default function TweaksPanel() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("iqra_theme") || "playful");
  const [font, setFont] = useState(() => localStorage.getItem("iqra_font") || "almarai");
  const [dark, setDark] = useState(() => localStorage.getItem("iqra_dark") === "true");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.font = font;
    document.documentElement.dataset.dark = String(dark);
    localStorage.setItem("iqra_theme", theme);
    localStorage.setItem("iqra_font", font);
    localStorage.setItem("iqra_dark", String(dark));
  }, [theme, font, dark]);

  return (
    <>
      <button type="button" className="tweaks-fab" onClick={() => setOpen((value) => !value)} aria-label="تخصيص الواجهة">
        <Icon name="settings" size={24} />
      </button>
      {open ? (
        <div className="tweaks-bubble" style={{ width: 300, maxWidth: "calc(100vw - 48px)" }}>
          <div className="bold">تخصيص الواجهة</div>
          <div className="muted f-13 mt-8">استرجاع أدوات التصميم القديمة للثيم والخط.</div>
          <div className="mt-16">
            <div className="f-13 bold">الثيم</div>
            <div className="profile-grid mt-8" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {themes.map((item) => (
                <button type="button" key={item.id} className={`theme-swatch ${theme === item.id ? "active" : ""}`} onClick={() => setTheme(item.id)}>
                  <span className="swatch-circles">{item.colors.map((color) => <span key={color} style={{ background: color }} />)}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-16">
            <div className="f-13 bold">الخط</div>
            <div className="row mt-8">
              {fonts.map((item) => (
                <button type="button" key={item.id} className={`btn sm ${font === item.id ? "primary" : "ghost"}`} onClick={() => setFont(item.id)}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <button type="button" className={`btn sm mt-16 ${dark ? "dark" : "ghost"}`} onClick={() => setDark((value) => !value)}>
            {dark ? "الوضع الفاتح" : "الوضع الداكن"}
          </button>
        </div>
      ) : null}
    </>
  );
}
