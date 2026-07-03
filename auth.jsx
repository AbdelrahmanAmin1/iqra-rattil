import React, { useState } from "react";
import { api } from "./src/lib/api.js";
import { ACADEMY } from "./data.js";
import { BrandMark, EmptyState, ErrorBanner, Icon, Owl, ProgressBar, roleLabel } from "./shared.jsx";

const roles = [
  { key: "student", label: "طالب", desc: "أتعلم وأشارك في الحلقات", color: "var(--grad-1)", icon: "grad" },
  { key: "teacher", label: "معلم", desc: "أعلم وأشرف على الطلاب", color: "var(--grad-3)", icon: "pencil" },
  { key: "admin", label: "مشرف عام", desc: "إدارة المنصة كاملة", color: "var(--grad-2)", icon: "settings" }
];

export default function AuthPage({ mode: initialMode = "login", onAuth, onBack }) {
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState("student");

  return (
    <div className="auth-page" dir="rtl">
      <div className="auth-art">
        <button type="button" className="auth-brand-button" onClick={onBack}>
          <BrandMark subtitle={ACADEMY.project} />
        </button>
        <div className="auth-art-center">
          <div className="blob" style={{ width: 320, height: 320, background: "var(--primary)", top: 20, right: 20 }} />
          <div className="blob" style={{ width: 260, height: 260, background: "var(--accent-2)", bottom: 40, left: 0 }} />
          <div className="auth-owl-card">
            <div className="anim-wiggle"><Owl size={180} /></div>
            <h2>{mode === "login" ? "مرحبًا بعودتك!" : "أهلًا بك في رحلتك"}</h2>
            <p>
              {mode === "login"
                ? "ادخل لمتابعة دروسك، حلقاتك، كتبك، ومحادثاتك داخل منصة اقرأ ورتل."
                : "سجل الآن واحجز مقعدك. منهج متكامل من أول حرف إلى تلاوة القرآن الكريم."}
            </p>
          </div>
        </div>
        <div className="auth-copy">© {ACADEMY.name} - {ACADEMY.author}</div>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-form">
          {mode === "login" ? (
            <LoginForm role={role} setRole={setRole} onSwitch={() => setMode("register")} onAuth={onAuth} onBack={onBack} />
          ) : (
            <RegisterForm role={role} setRole={setRole} onSwitch={() => setMode("login")} onAuth={onAuth} onBack={onBack} />
          )}
        </div>
      </div>
    </div>
  );
}

function RolePicker({ role, setRole, allowAdmin = true }) {
  return (
    <div className="auth-role-grid">
      {roles.map((item) => {
        const disabled = item.key === "admin" && !allowAdmin;
        return (
          <button
            key={item.key}
            type="button"
            className={`auth-role ${role === item.key ? "active" : ""} ${disabled ? "disabled" : ""}`}
            onClick={() => !disabled && setRole(item.key)}
            disabled={disabled}
          >
            <span className="auth-role-ico" style={{ background: item.color }}>
              <Icon name={item.icon} size={20} color="white" />
            </span>
            <span style={{ flex: 1 }}>
              <span className="bold f-15">{item.label}</span>
              <span className="muted f-12" style={{ display: "block" }}>{item.desc}</span>
            </span>
            <span className="auth-role-dot" />
          </button>
        );
      })}
    </div>
  );
}

function LoginForm({ role, setRole, onSwitch, onAuth, onBack }) {
  const [login, setLogin] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await api.auth.login({ ...login, role });
      onAuth(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <button type="button" className="auth-back" onClick={onBack}>
        <Icon name="arrow_r" size={14} /> العودة للصفحة الرئيسية
      </button>
      <h1 className="auth-title">تسجيل الدخول</h1>
      <p className="muted mt-8">اختر دورك في المنصة، ثم ادخل بيانات الدخول.</p>

      <div className="auth-section-label">أنت...</div>
      <RolePicker role={role} setRole={setRole} />

      <label className="field mt-24">
        <span>البريد الإلكتروني</span>
        <input type="email" value={login.email} onChange={(event) => setLogin({ ...login, email: event.target.value })} placeholder="example@email.com" required />
      </label>
      <label className="field">
        <span>كلمة المرور</span>
        <input type="password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} placeholder="••••••••" required />
      </label>

      <div className="spread auth-options">
        <label>
          <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> تذكرني
        </label>
        <span className="muted f-13">استعادة كلمة المرور ستضاف من المشرف لاحقًا</span>
      </div>

      <ErrorBanner error={error} />
      <button type="submit" className="btn primary lg mt-24 auth-submit" disabled={loading}>
        {loading ? "جاري الدخول..." : "دخول"}
      </button>

      <div className="auth-divider">ليس لديك حساب؟</div>
      <button type="button" className="btn ghost auth-submit" onClick={onSwitch}>تسجيل</button>
    </form>
  );
}

function RegisterForm({ role, setRole, onSwitch, onAuth, onBack }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    age: "",
    level: "المستوى الأول",
    mode: "أون لاين",
    parentName: "",
    experience: "",
    specialty: "تأسيس القراءة"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const optionalNumber = (value) => (value === null || value === undefined || String(value).trim() === "" ? undefined : Number(value));
  const registrationPayload = () => {
    const payload = {
      role,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      password: form.password
    };

    if (role === "student") {
      return {
        ...payload,
        age: optionalNumber(form.age),
        level: form.level,
        mode: form.mode,
        parentName: form.parentName
      };
    }

    if (role === "teacher") {
      return {
        ...payload,
        experience: optionalNumber(form.experience),
        specialty: form.specialty
      };
    }

    return payload;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (role === "admin") return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const result = await api.auth.register(registrationPayload());
      if (result.pending) {
        setMessage(result.message || "تم إرسال طلب المعلم للمراجعة بنجاح.");
        setRole("teacher");
      } else if (result.token) {
        onAuth(result);
      } else {
        setMessage(result.message || "تم إنشاء الحساب بنجاح.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <button type="button" className="auth-back" onClick={onBack}>
        <Icon name="arrow_r" size={14} /> العودة
      </button>
      <h1 className="auth-title">إنشاء حساب جديد</h1>
      <p className="muted mt-8">نفس واجهة التسجيل الأصلية، مع حفظ البيانات في الخادم الحقيقي.</p>
      <div className="mt-16"><ProgressBar value={role === "admin" ? 50 : 100} /></div>

      <div className="auth-section-label">أريد التسجيل كـ...</div>
      <RolePicker role={role} setRole={setRole} />

      <label className="field mt-24">
        <span>الاسم الكامل</span>
        <input value={form.fullName} onChange={(event) => set("fullName", event.target.value)} placeholder="مثال: محمد ياسر" required />
      </label>
      <label className="field">
        <span>البريد الإلكتروني</span>
        <input type="email" value={form.email} onChange={(event) => set("email", event.target.value)} placeholder="example@email.com" required />
      </label>
      <label className="field">
        <span>رقم الجوال</span>
        <input value={form.phone} onChange={(event) => set("phone", event.target.value)} placeholder="05xxxxxxxx" />
      </label>
      <label className="field">
        <span>كلمة المرور</span>
        <input type="password" minLength={6} value={form.password} onChange={(event) => set("password", event.target.value)} placeholder="6 أحرف على الأقل" required />
      </label>

      {role === "student" ? (
        <div className="auth-extra-panel">
          <div className="auth-section-label">معلومات الطالب</div>
          <label className="field">
            <span>عمر الطالب</span>
            <input type="number" min={3} max={70} value={form.age} onChange={(event) => set("age", event.target.value)} placeholder="مثال: 7" />
          </label>
          <label className="field">
            <span>المستوى</span>
            <select value={form.level} onChange={(event) => set("level", event.target.value)}>
              <option>روضة</option>
              <option>المستوى الأول</option>
              <option>المستوى الثاني</option>
              <option>تجويد</option>
              <option>أعاجم / مبتدئون</option>
            </select>
          </label>
          <label className="field">
            <span>طريقة الدراسة المفضلة</span>
            <span className="auth-segment">
              {["أون لاين", "حضوري", "الاثنان"].map((item) => (
                <button key={item} type="button" className={form.mode === item ? "active" : ""} onClick={() => set("mode", item)}>{item}</button>
              ))}
            </span>
          </label>
          <label className="field">
            <span>اسم ولي الأمر (اختياري)</span>
            <input value={form.parentName} onChange={(event) => set("parentName", event.target.value)} placeholder="مثال: أ. أحمد" />
          </label>
        </div>
      ) : role === "teacher" ? (
        <div className="auth-extra-panel">
          <div className="auth-section-label">معلومات المعلم</div>
          <label className="field">
            <span>سنوات الخبرة</span>
            <input type="number" min={0} max={50} value={form.experience} onChange={(event) => set("experience", event.target.value)} placeholder="مثال: 8" />
          </label>
          <label className="field">
            <span>التخصص</span>
            <select value={form.specialty} onChange={(event) => set("specialty", event.target.value)}>
              <option>تأسيس القراءة</option>
              <option>تحفيظ القرآن</option>
              <option>التجويد</option>
              <option>تأسيس الكتابة والإملاء</option>
              <option>الروضات</option>
            </select>
          </label>
          <div className="auth-note">سيتم إرسال طلب انضمامك للمشرف العام للمراجعة قبل تفعيل الحساب.</div>
        </div>
      ) : (
        <div className="auth-extra-panel">
          <EmptyState title="تسجيل المشرف غير متاح للعامة" body="اضبط ADMIN_BOOTSTRAP_EMAIL و ADMIN_BOOTSTRAP_PASSWORD و ADMIN_BOOTSTRAP_NAME ثم شغّل npm run admin:bootstrap من مجلد backend." />
        </div>
      )}

      <ErrorBanner error={error} />
      {message ? <div className="auth-success anim-pop">{message}</div> : null}

      <button type="submit" className="btn primary lg mt-24 auth-submit" disabled={loading || role === "admin"}>
        {loading ? "جاري التسجيل..." : "إنشاء الحساب"}
      </button>

      <div className="auth-divider">لديك حساب بالفعل؟</div>
      <button type="button" className="btn ghost auth-submit" onClick={onSwitch}>سجل الدخول</button>
    </form>
  );
}
