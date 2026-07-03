// =====================================================
// app.jsx — Router + role state + tweaks integration
// =====================================================

function App() {
  const TWEAK_DEFAULTS = window.__TWEAK_DEFAULTS;
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  // 'landing' | 'auth-login' | 'auth-register' | 'student' | 'teacher' | 'admin'
  const [route, setRoute] = useState("landing");

  // Apply theme + dark + font to <html> so CSS variables flip
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", t.theme);
    html.setAttribute("data-dark", t.dark ? "true" : "false");
    html.setAttribute("data-font", t.font);
  }, [t.theme, t.dark, t.font]);

  // helpers
  const goAuth = (mode = "login") => setRoute("auth-" + mode);
  const goRole = (role) => setRoute(role);
  const goHome = () => setRoute("landing");

  return (
    <div className="app-shell">
      {route === "landing" ? (
        <>
          <TopBar onNavigate={(r) => { if (r === "home") goHome(); }}
                  currentRoute="home"
                  onPickRole={(r) => r ? goRole(r) : goAuth("login")}
                  onLogin={() => goAuth("login")}
                  onRegister={() => goAuth("register")} />
          <LandingPage onPickRole={(r) => r ? goRole(r) : goAuth("login")}
                       onLogin={() => goAuth("login")}
                       onRegister={() => goAuth("register")} />
        </>
      ) : null}

      {route === "auth-login" ? (
        <AuthPage mode="login"
                  onAuth={(role) => goRole(role)}
                  onBack={goHome} />
      ) : null}
      {route === "auth-register" ? (
        <AuthPage mode="register"
                  onAuth={(role) => goRole(role)}
                  onBack={goHome} />
      ) : null}

      {route === "student" ? <StudentDashboard onSignOut={goHome} onHome={goHome} tweaks={t} setTweak={setTweak} /> : null}
      {route === "teacher" ? <TeacherDashboard onSignOut={goHome} onHome={goHome} tweaks={t} setTweak={setTweak} /> : null}
      {route === "admin"   ? <AdminDashboard   onSignOut={goHome} onHome={goHome} tweaks={t} setTweak={setTweak} /> : null}

      <TweaksPanel title="ضبط التصميم">
        <TweakSection label="المظهر" />
        <TweakRadio
          label="الثيم"
          value={t.theme}
          options={[
            { value: "playful", label: "طفولي" },
            { value: "refined", label: "راقٍ" },
            { value: "modern",  label: "حديث" },
          ]}
          onChange={(v) => setTweak("theme", v)}
        />
        <TweakToggle label="الوضع الداكن" value={t.dark} onChange={(v) => setTweak("dark", v)} />
        <TweakSelect
          label="الخط"
          value={t.font}
          options={[
            { value: "almarai", label: "Almarai" },
            { value: "cairo",   label: "Cairo" },
            { value: "tajawal", label: "Tajawal" },
            { value: "reem",    label: "Reem Kufi (عناوين)" },
            { value: "amiri",   label: "Amiri (تراثي)" },
          ]}
          onChange={(v) => setTweak("font", v)}
        />

        <TweakSection label="الواجهة" />
        <TweakToggle label="إظهار الشخصية المرافقة" value={t.showCompanion} onChange={(v) => setTweak("showCompanion", v)} />
        <TweakToggle label="عناصر التحفيز (نجوم، شارات)" value={t.gamification} onChange={(v) => setTweak("gamification", v)} />

        <TweakSection label="تنقّل سريع" />
        <TweakButton label="الصفحة الرئيسية" onClick={goHome} />
        <TweakButton label="صفحة تسجيل الدخول" onClick={() => goAuth("login")} />
        <TweakButton label="صفحة التسجيل" onClick={() => goAuth("register")} />
        <TweakButton label="لوحة الطالب"   onClick={() => goRole("student")} />
        <TweakButton label="لوحة المعلم"   onClick={() => goRole("teacher")} />
        <TweakButton label="لوحة المشرف"   onClick={() => goRole("admin")} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
