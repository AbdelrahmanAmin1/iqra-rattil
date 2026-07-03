// =====================================================
// profile.jsx — Shared Profile page for student/teacher
// =====================================================

function ProfilePage({ role, user, tweaks, setTweak }) {
  const [form, setForm] = useState({
    fullName: user.name,
    email: role === "student" ? "muhammad.yaser@iqra.sa" : "abdulrahman@iqra.sa",
    phone: "0593781376",
    age: role === "student" ? 7 : null,
    level: role === "student" ? "المستوى الأول" : null,
    parentName: role === "student" ? "أ. ياسر محمود" : null,
    parentPhone: role === "student" ? "05xxxxxxxx" : null,
    bio: role === "teacher" ? "مؤسس مناهج اقرأ ورتل، خبرة أكثر من عشرين عامًا في تأسيس الطلاب." : null,
    specialty: role === "teacher" ? "تأسيس القراءة والكتابة + تحفيظ القرآن" : null,
    experience: role === "teacher" ? 22 : null,
  });
  const [notifications, setNotifications] = useState({
    classes: true,
    quizzes: true,
    weeklyReport: role === "teacher",
    parentMessages: role === "student",
    newContent: true,
    achievements: true,
  });
  const [saved, setSaved] = useState(false);

  const set = (k, v) => { setSaved(false); setForm(f => ({ ...f, [k]: v })); };
  const setNotif = (k, v) => { setSaved(false); setNotifications(n => ({ ...n, [k]: v })); };

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>الملف الشخصي</h1>
          <p>تحكّم في بياناتك ومظهر المنصة وإشعاراتك</p>
        </div>
        <button className="btn primary" onClick={save}>
          <Icon name="check" size={16} color="white" /> {saved ? "تم الحفظ ✓" : "حفظ التغييرات"}
        </button>
      </div>

      {/* identity card */}
      <div className="card" style={{ display: "flex", gap: 22, alignItems: "center", marginBottom: 18, padding: 24 }}>
        <div className="profile-pic" style={{ background: user.color }}>
          {form.fullName?.[0] || "?"}
          <div className="profile-pic-edit" title="تغيير الصورة"><Icon name="pencil" size={14} /></div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 26 }}>{form.fullName}</h2>
          <div className="muted f-14 mt-8">{role === "student" ? `طالب · ${form.level}` : "معلم · " + (form.specialty || "")}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <span className="chip primary">{form.email}</span>
            <span className="chip">{form.phone}</span>
            {role === "student" ? <span className="chip accent">⭐ {user.stars || 124} نجمة</span> : null}
          </div>
        </div>
      </div>

      <div className="profile-grid">
        {/* basic info */}
        <div className="card">
          <h3 style={{ fontSize: 18 }}>المعلومات الأساسية</h3>
          <div className="mt-16">
            <div className="field"><label>الاسم الكامل</label>
              <input value={form.fullName} onChange={e => set("fullName", e.target.value)} />
            </div>
            <div className="field"><label>البريد الإلكتروني</label>
              <input type="email" value={form.email} onChange={e => set("email", e.target.value)} />
            </div>
            <div className="field"><label>رقم الجوال</label>
              <input value={form.phone} onChange={e => set("phone", e.target.value)} />
            </div>
            {role === "student" ? (
              <>
                <div className="field"><label>العمر</label>
                  <input type="number" value={form.age} onChange={e => set("age", e.target.value)} />
                </div>
                <div className="field"><label>المستوى</label>
                  <select value={form.level} onChange={e => set("level", e.target.value)}>
                    <option>روضة</option><option>المستوى الأول</option><option>المستوى الثاني</option><option>تجويد</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="field"><label>التخصص</label>
                  <input value={form.specialty} onChange={e => set("specialty", e.target.value)} />
                </div>
                <div className="field"><label>سنوات الخبرة</label>
                  <input type="number" value={form.experience} onChange={e => set("experience", e.target.value)} />
                </div>
                <div className="field"><label>نبذة عنك</label>
                  <textarea rows={3} value={form.bio} onChange={e => set("bio", e.target.value)} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* parent or extra */}
        <div className="card">
          {role === "student" ? (
            <>
              <h3 style={{ fontSize: 18 }}>بيانات ولي الأمر</h3>
              <div className="mt-16">
                <div className="field"><label>اسم ولي الأمر</label>
                  <input value={form.parentName} onChange={e => set("parentName", e.target.value)} />
                </div>
                <div className="field"><label>رقم ولي الأمر</label>
                  <input value={form.parentPhone} onChange={e => set("parentPhone", e.target.value)} />
                </div>
                <div className="field"><label>طريقة الدراسة المفضّلة</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["أون لاين", "حضوري", "الاثنان"].map(m => (
                      <button type="button" key={m} className={cls("auth-pill", (form.studyMode || "أون لاين") === m && "active")} onClick={() => set("studyMode", m)}>{m}</button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 style={{ fontSize: 18 }}>ساعات التدريس</h3>
              <div className="mt-16">
                <div className="muted f-13" style={{ marginBottom: 10 }}>اختر الأيام التي تتاح فيها للحلقات:</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["السبت","الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة"].map((d, i) => (
                    <button type="button" key={i} className={cls("auth-pill", [1,3,5].includes(i) && "active")} style={{ flex: "0 1 auto" }}>{d}</button>
                  ))}
                </div>
                <div className="field mt-16"><label>الحصص اليومية</label>
                  <select><option>1 حصة</option><option>2 حصص</option><option>3 حصص</option><option>أكثر من 3</option></select>
                </div>
                <div className="field"><label>الجلسة الافتراضية (دقائق)</label>
                  <input type="number" defaultValue={45} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* appearance */}
        <div className="card">
          <h3 style={{ fontSize: 18 }}>المظهر</h3>
          <div className="muted f-13 mt-8">اختر الثيم الذي يناسبك — يُحفظ تلقائيًا.</div>

          <div className="auth-section-label" style={{ marginTop: 16 }}>الثيم</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <ThemeSwatch active={tweaks.theme === "playful"} onClick={() => setTweak("theme", "playful")}
              colors={["#ff7a45","#ffc847","#6c63ff"]} label="طفولي" />
            <ThemeSwatch active={tweaks.theme === "refined"} onClick={() => setTweak("theme", "refined")}
              colors={["#2e7d5b","#d4af6a","#5a4a7a"]} label="راقٍ" />
            <ThemeSwatch active={tweaks.theme === "modern"} onClick={() => setTweak("theme", "modern")}
              colors={["#4f6df5","#00bfa6","#ff5e8a"]} label="حديث" />
          </div>

          <div className="auth-section-label" style={{ marginTop: 16 }}>الخط</div>
          <select className="auth-pill" style={{ width: "100%" }} value={tweaks.font} onChange={e => setTweak("font", e.target.value)}>
            <option value="almarai">Almarai — صديق للأطفال</option>
            <option value="cairo">Cairo — متوازن</option>
            <option value="tajawal">Tajawal — حديث</option>
            <option value="reem">Reem Kufi (عناوين)</option>
            <option value="amiri">Amiri — تراثي</option>
          </select>

          <div className="spread" style={{ marginTop: 18, padding: "12px 0", borderTop: "1px solid var(--line)" }}>
            <div>
              <div className="bold f-15">الوضع الداكن</div>
              <div className="muted f-12">أرحم لعينيك في الليل</div>
            </div>
            <ToggleSwitch on={tweaks.dark} onChange={v => setTweak("dark", v)} />
          </div>
          {role === "student" ? (
            <div className="spread" style={{ padding: "12px 0", borderTop: "1px solid var(--line)" }}>
              <div>
                <div className="bold f-15">الشخصية المرافقة (البومة حكمة)</div>
                <div className="muted f-12">تظهر للتشجيع والنصائح</div>
              </div>
              <ToggleSwitch on={tweaks.showCompanion} onChange={v => setTweak("showCompanion", v)} />
            </div>
          ) : null}
          {role === "student" ? (
            <div className="spread" style={{ padding: "12px 0", borderTop: "1px solid var(--line)" }}>
              <div>
                <div className="bold f-15">عناصر التحفيز</div>
                <div className="muted f-12">نجوم، شارات، خرائط تقدم</div>
              </div>
              <ToggleSwitch on={tweaks.gamification} onChange={v => setTweak("gamification", v)} />
            </div>
          ) : null}
        </div>

        {/* notifications */}
        <div className="card">
          <h3 style={{ fontSize: 18 }}>الإشعارات</h3>
          <div className="muted f-13 mt-8">اختر ما تريد أن يصلك عبر التطبيق وواتساب.</div>
          <div className="mt-16">
            {role === "student" ? (
              <>
                <NotifRow label="موعد الحلقات القادمة" sub="تذكير قبل ساعة من الحلقة" v={notifications.classes} on={(v) => setNotif("classes", v)} />
                <NotifRow label="كويزات جديدة"             sub="عند فتح درس جديد"            v={notifications.quizzes} on={(v) => setNotif("quizzes", v)} />
                <NotifRow label="رسائل من المعلم"          sub="رد على سؤالك أو ملاحظة"     v={notifications.parentMessages} on={(v) => setNotif("parentMessages", v)} />
                <NotifRow label="إنجازات وشارات جديدة"    sub="عند فتح شارة أو إكمال درس"  v={notifications.achievements} on={(v) => setNotif("achievements", v)} />
                <NotifRow label="محتوى جديد على القناة"   sub="فيديوهات أو دروس جديدة"     v={notifications.newContent} on={(v) => setNotif("newContent", v)} />
              </>
            ) : (
              <>
                <NotifRow label="حلقاتي القادمة"           sub="تذكير قبل بدء الحلقة"             v={notifications.classes} on={(v) => setNotif("classes", v)} />
                <NotifRow label="حل الطلاب للكويزات"       sub="إشعار فوري عند تقديم كويز"         v={notifications.quizzes} on={(v) => setNotif("quizzes", v)} />
                <NotifRow label="رسائل من الطلاب والأهالي" sub="رد أو سؤال جديد"                  v={notifications.parentMessages} on={(v) => setNotif("parentMessages", v)} />
                <NotifRow label="تقرير أسبوعي للأداء"      sub="ملخّص تقدّم طلاب الحلقة"          v={notifications.weeklyReport} on={(v) => setNotif("weeklyReport", v)} />
                <NotifRow label="محتوى جديد من الإدارة"   sub="مواد جديدة أو إعلانات إدارية"     v={notifications.newContent} on={(v) => setNotif("newContent", v)} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* danger zone */}
      <div className="card mt-24" style={{ border: "1.5px dashed color-mix(in oklab, var(--danger) 40%, var(--line))" }}>
        <div className="spread">
          <div>
            <h3 style={{ fontSize: 17, color: "var(--danger)" }}>المنطقة الحساسة</h3>
            <p className="muted f-13 mt-8">تغيير كلمة المرور أو حذف الحساب.</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn ghost">تغيير كلمة المرور</button>
            <button className="btn" style={{ background: "color-mix(in oklab, var(--danger) 14%, transparent)", color: "var(--danger)" }}>حذف الحساب</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemeSwatch({ active, onClick, colors, label }) {
  return (
    <div className={cls("theme-swatch", active && "active")} onClick={onClick}>
      <div className="swatch-circles">
        {colors.map((c, i) => <span key={i} style={{ background: c }} />)}
      </div>
      <div className="bold f-13">{label}</div>
      {active ? <span className="chip success" style={{ padding: "2px 8px", fontSize: 11 }}>الحالي</span> : null}
    </div>
  );
}

function NotifRow({ label, sub, v, on }) {
  return (
    <div className="spread" style={{ padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
      <div>
        <div className="bold f-14">{label}</div>
        <div className="muted f-12">{sub}</div>
      </div>
      <ToggleSwitch on={v} onChange={on} />
    </div>
  );
}

function ToggleSwitch({ on, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!on)} style={{
      width: 44, height: 26, borderRadius: 999, border: 0,
      background: on ? "var(--secondary)" : "var(--bg-alt)",
      position: "relative", cursor: "pointer", transition: "background 0.2s",
      flexShrink: 0,
    }}>
      <span style={{
        position: "absolute", top: 3, insetInlineStart: on ? 22 : 3,
        width: 20, height: 20, borderRadius: "50%", background: "white",
        transition: "inset-inline-start 0.2s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
      }} />
    </button>
  );
}

Object.assign(window, { ProfilePage, ThemeSwatch, ToggleSwitch });
