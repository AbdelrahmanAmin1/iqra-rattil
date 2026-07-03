// =====================================================
// auth.jsx — Login + Register pages with role selection
// =====================================================

function AuthPage({ mode: initialMode = "login", onAuth, onBack }) {
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState("student"); // student | teacher | admin

  return (
    <div className="auth-page">
      {/* decorative side */}
      <div className="auth-art">
        <a onClick={onBack} style={{ cursor: "pointer", display: "inline-block" }}>
          <BrandMark />
        </a>
        <div style={{ flex: 1, display: "grid", placeItems: "center", position: "relative" }}>
          <div className="blob" style={{ width: 320, height: 320, background: "var(--primary)", top: 20, right: 20 }} />
          <div className="blob" style={{ width: 260, height: 260, background: "var(--accent-2)", bottom: 40, left: 0 }} />
          <div style={{ position: "relative", textAlign: "center", maxWidth: 380 }}>
            <div className="anim-wiggle"><Owl size={180} /></div>
            <h2 style={{ fontSize: 32, marginTop: 20, color: "white" }}>
              {mode === "login" ? "مرحبًا بعودتك!" : "أهلاً بك في رحلتك"}
            </h2>
            <p style={{ marginTop: 12, color: "rgba(255,255,255,0.85)", fontSize: 16 }}>
              {mode === "login"
                ? "ادخل لمتابعة دروسك، حفظ القرآن، ومتابعة تقدمك."
                : "سجّل الآن واحجز مقعدك. منهج متكامل من أوّل حرف إلى حفظ القرآن الكريم."}
            </p>
          </div>
        </div>
        <div className="muted f-13" style={{ color: "rgba(255,255,255,0.6)" }}>
          © مناهج اقرأ ورتّل — {ACADEMY.author}
        </div>
      </div>

      {/* form side */}
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

// ---------- role chooser (shared) ----------
function RolePicker({ role, setRole }) {
  const roles = [
    { k: "student", label: "طالب",       desc: "أتعلّم وأشارك في الحلقات",   color: "var(--grad-1)", icon: "grad" },
    { k: "teacher", label: "معلم",       desc: "أعلّم وأشرف على الطلاب",     color: "var(--grad-3)", icon: "pencil" },
    { k: "admin",   label: "مشرف عام",   desc: "إدارة المنصة كاملة",          color: "var(--grad-2)", icon: "settings" },
  ];
  return (
    <div className="auth-role-grid">
      {roles.map(r => (
        <button key={r.k} type="button" className={cls("auth-role", role === r.k && "active")} onClick={() => setRole(r.k)}>
          <div className="auth-role-ico" style={{ background: r.color }}>
            <Icon name={r.icon} size={20} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="bold f-15">{r.label}</div>
            <div className="muted f-12">{r.desc}</div>
          </div>
          <span className="auth-role-dot" />
        </button>
      ))}
    </div>
  );
}

// ---------- LOGIN ----------
function LoginForm({ role, setRole, onSwitch, onAuth, onBack }) {
  const [email, setEmail] = useState("demo@iqra-rattil.sa");
  const [pwd, setPwd] = useState("••••••••");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e?.preventDefault?.();
    setLoading(true);
    setTimeout(() => { setLoading(false); onAuth(role); }, 600);
  };

  return (
    <form onSubmit={submit}>
      <a onClick={onBack} style={{ cursor: "pointer", color: "var(--muted)", fontSize: 13, display: "inline-flex", gap: 6, alignItems: "center", marginBottom: 18 }}>
        <Icon name="arrow_r" size={14} /> العودة للصفحة الرئيسية
      </a>
      <h1 style={{ fontSize: 32 }}>تسجيل الدخول</h1>
      <p className="muted mt-8">اختر دورك في المنصة، ثم ادخل بيانات الدخول.</p>

      <div className="auth-section-label">أنت...</div>
      <RolePicker role={role} setRole={setRole} />

      <div className="field mt-24">
        <label>البريد الإلكتروني</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@iqra.sa" required />
      </div>
      <div className="field">
        <label>كلمة المرور</label>
        <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="••••••••" required />
      </div>

      <div className="spread" style={{ marginTop: 6 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--ink-soft)", fontWeight: 600 }}>
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> تذكّرني
        </label>
        <a className="muted f-13" style={{ cursor: "pointer" }}>هل نسيت كلمة المرور؟</a>
      </div>

      <button type="submit" className="btn primary lg mt-24" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
        {loading ? "جاري الدخول..." : "تسجيل الدخول"}
      </button>

      <div className="auth-divider">أو ادخل مباشرة بدون كلمة مرور (تجريبي)</div>

      <button type="button" className="btn ghost mt-8" style={{ width: "100%", justifyContent: "center" }} onClick={() => onAuth(role)}>
        ادخل كـ {{ student: "طالب", teacher: "معلم", admin: "مشرف" }[role]} — معاينة
      </button>

      <div className="muted f-14 mt-24" style={{ textAlign: "center" }}>
        ليس لديك حساب؟ <a onClick={onSwitch} style={{ color: "var(--primary)", cursor: "pointer", fontWeight: 700 }}>أنشئ حسابًا جديدًا</a>
      </div>
    </form>
  );
}

// ---------- REGISTER ----------
function RegisterForm({ role, setRole, onSwitch, onAuth, onBack }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", password: "",
    // student
    age: "", level: "المستوى الأول", mode: "أون لاين", parentName: "",
    // teacher
    experience: "", specialty: "تأسيس القراءة",
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const totalSteps = 2;

  const next = (e) => { e?.preventDefault?.(); if (step < totalSteps) setStep(s => s + 1); else submit(); };
  const back = () => setStep(s => Math.max(1, s - 1));

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const submit = () => {
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setDone(true); }, 700);
  };

  if (done) {
    const isInstant = role === "admin";
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div className="anim-pop" style={{ fontSize: 84 }}>{role === "teacher" ? "📝" : role === "admin" ? "✅" : "🌟"}</div>
        <h2 style={{ fontSize: 28, marginTop: 10 }}>
          {role === "teacher" ? "تم إرسال طلبك" : role === "admin" ? "تم إنشاء الحساب" : "تم تسجيلك بنجاح!"}
        </h2>
        <p className="muted mt-8">
          {role === "teacher"
            ? "طلب انضمامك كمعلم في طور المراجعة. سيتواصل معك المشرف خلال 24 ساعة."
            : role === "admin"
            ? "حسابك جاهز — يمكنك الدخول لإدارة المنصة الآن."
            : "حسابك جاهز — هيا نبدأ الحلقة الأولى!"}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 28 }}>
          <button className="btn ghost" onClick={onBack}>الصفحة الرئيسية</button>
          <button className="btn primary" onClick={() => onAuth(role)}>
            {role === "teacher" ? "معاينة لوحة المعلم" : "ادخل الآن"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={next}>
      <a onClick={onBack} style={{ cursor: "pointer", color: "var(--muted)", fontSize: 13, display: "inline-flex", gap: 6, alignItems: "center", marginBottom: 18 }}>
        <Icon name="arrow_r" size={14} /> العودة
      </a>
      <h1 style={{ fontSize: 32 }}>إنشاء حساب جديد</h1>
      <p className="muted mt-8">الخطوة {step} من {totalSteps}</p>
      <div className="progress-bar mt-16"><div style={{ width: `${(step / totalSteps) * 100}%` }} /></div>

      {step === 1 ? (
        <>
          <div className="auth-section-label">أريد التسجيل كـ...</div>
          <RolePicker role={role} setRole={setRole} />

          <div className="field mt-24">
            <label>الاسم الكامل</label>
            <input value={form.fullName} onChange={e => set("fullName", e.target.value)} placeholder="مثال: محمد ياسر" required />
          </div>
          <div className="field">
            <label>البريد الإلكتروني</label>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="example@email.com" required />
          </div>
          <div className="field">
            <label>رقم الجوال</label>
            <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="05xxxxxxxx" required />
          </div>
          <div className="field">
            <label>كلمة المرور</label>
            <input type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="6 أحرف على الأقل" minLength={6} required />
          </div>
        </>
      ) : (
        <>
          {role === "student" ? (
            <>
              <div className="auth-section-label">معلومات الطالب</div>
              <div className="field">
                <label>عمر الطالب</label>
                <input type="number" value={form.age} onChange={e => set("age", e.target.value)} placeholder="مثال: 7" min={3} max={70} required />
              </div>
              <div className="field">
                <label>المستوى</label>
                <select value={form.level} onChange={e => set("level", e.target.value)}>
                  <option>روضة</option><option>المستوى الأول</option><option>المستوى الثاني</option><option>تجويد</option><option>أعاجم / مبتدئون</option>
                </select>
              </div>
              <div className="field">
                <label>طريقة الدراسة المفضّلة</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["أون لاين", "حضوري", "الاثنان"].map(m => (
                    <button type="button" key={m} className={cls("auth-pill", form.mode === m && "active")} onClick={() => set("mode", m)}>{m}</button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label>اسم ولي الأمر (اختياري)</label>
                <input value={form.parentName} onChange={e => set("parentName", e.target.value)} placeholder="مثال: أ. أحمد" />
              </div>
            </>
          ) : role === "teacher" ? (
            <>
              <div className="auth-section-label">معلومات المعلم</div>
              <div className="field">
                <label>سنوات الخبرة</label>
                <input type="number" value={form.experience} onChange={e => set("experience", e.target.value)} placeholder="مثال: 8" min={0} max={50} required />
              </div>
              <div className="field">
                <label>التخصص</label>
                <select value={form.specialty} onChange={e => set("specialty", e.target.value)}>
                  <option>تأسيس القراءة</option><option>تحفيظ القرآن</option><option>التجويد</option><option>تأسيس الكتابة والإملاء</option><option>الروضات</option>
                </select>
              </div>
              <div className="muted f-13" style={{ background: "var(--bg-soft)", padding: 12, borderRadius: 12 }}>
                ℹ️ سيتم مراجعة طلبك من قبل المشرف العام قبل تفعيل حسابك.
              </div>
            </>
          ) : (
            <>
              <div className="auth-section-label">معلومات المشرف</div>
              <div className="muted f-13" style={{ background: "var(--bg-soft)", padding: 12, borderRadius: 12 }}>
                ⚠️ صلاحية المشرف العام محصورة — يجب التواصل مع مؤسس الأكاديمية لتفعيل الحساب.
              </div>
              <div className="field mt-16">
                <label>رمز التحقق</label>
                <input placeholder="••••••" maxLength={8} />
              </div>
            </>
          )}
        </>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 26 }}>
        {step > 1 ? <button type="button" className="btn ghost" onClick={back}>← السابق</button> : null}
        <button type="submit" className="btn primary lg" style={{ flex: 1, justifyContent: "center" }} disabled={submitting}>
          {submitting ? "جاري الإنشاء..." : step < totalSteps ? "التالي ←" : "إنشاء الحساب"}
        </button>
      </div>

      <div className="muted f-14 mt-24" style={{ textAlign: "center" }}>
        لديك حساب بالفعل؟ <a onClick={onSwitch} style={{ color: "var(--primary)", cursor: "pointer", fontWeight: 700 }}>سجّل الدخول</a>
      </div>
    </form>
  );
}

Object.assign(window, { AuthPage });
