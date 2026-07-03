// =====================================================
// admin.jsx — Superadmin dashboard
// =====================================================

function AdminDashboard({ onSignOut, onHome }) {
  const [tab, setTab] = useState("home");
  const admin = { name: "المشرف العام", role: "مشرف — أكاديمية اقرأ ورتل", color: "var(--grad-2)" };

  return (
    <div className="app-shell">
      <DashTopBar role="admin" user={admin} onSignOut={onSignOut} onHome={onHome} />
      <div className="container dashboard">
        <AdminSidebar tab={tab} setTab={setTab} user={admin} />
        <main>
          {tab === "home"      && <AdminHome setTab={setTab} />}
          {tab === "approvals" && <AdminApprovals />}
          {tab === "teachers"  && <AdminTeachers />}
          {tab === "students"  && <AdminStudents />}
          {tab === "content"   && <AdminContent />}
          {tab === "settings"  && <AdminSettings />}
        </main>
      </div>
    </div>
  );
}

function AdminSidebar({ tab, setTab, user }) {
  const items = [
    { k: "home",      icon: "home",     label: "نظرة عامة" },
    { k: "approvals", icon: "check",    label: "طلبات الانضمام", badge: PENDING_APPROVALS.length },
    { k: "teachers",  icon: "pencil",   label: "المعلمون" },
    { k: "students",  icon: "users",    label: "الطلاب" },
    { k: "content",   icon: "folder",   label: "المحتوى" },
    { k: "settings",  icon: "settings", label: "إعدادات المنصة" },
  ];
  return (
    <aside className="sidebar">
      <div className="me">
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: user.color, display: "grid", placeItems: "center", color: "white" }}>
          <Icon name="settings" size={22} color="white" />
        </div>
        <div>
          <div className="name">{user.name}</div>
          <div className="role">{user.role}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map(it => (
          <button key={it.k} className={cls("side-link", tab === it.k && "active")} onClick={() => setTab(it.k)}>
            <span className="ico"><Icon name={it.icon} size={18} /></span>
            <span style={{ flex: 1, textAlign: "start" }}>{it.label}</span>
            {it.badge ? <span style={{ background: "var(--accent)", color: "var(--ink)", fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 999 }}>{it.badge}</span> : null}
          </button>
        ))}
      </div>
    </aside>
  );
}

// ---------- HOME ----------
function AdminHome({ setTab }) {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>نظرة عامة على المنصة</h1>
          <p>إحصاءات وأنشطة كل الأكاديمية في مكان واحد</p>
        </div>
        <button className="btn primary" onClick={() => setTab("approvals")}>
          <Icon name="bell" size={16} color="white" /> {PENDING_APPROVALS.length} طلبات معلّقة
        </button>
      </div>

      <div className="stat-grid">
        <StatCard v={STUDENTS.length}        l="طلاب نشطون" delta="+5 هذا الأسبوع" c="var(--primary)" />
        <StatCard v={TEACHERS.length}        l="معلمون"      delta="3 يعلّمون اليوم" c="var(--secondary)" />
        <StatCard v="142"                     l="جلسات/شهر"  delta="+18%"           c="var(--accent-2)" />
        <StatCard v="٤٨٠ ر.س"                l="سعر الحقيبة" delta="32 طلب جديد"    c="var(--accent)" />
      </div>

      {/* charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18, marginTop: 24 }}>
        <div className="card">
          <div className="spread">
            <h3 style={{ fontSize: 18 }}>نشاط آخر 7 أيام</h3>
            <div className="tabs">
              <button className="active">جلسات</button>
              <button>طلاب جدد</button>
              <button>كويزات</button>
            </div>
          </div>
          <ActivityChart />
        </div>
        <div className="card">
          <h3 style={{ fontSize: 18 }}>توزيع المستويات</h3>
          <LevelDonut />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 18 }}>
        <div className="card">
          <div className="spread">
            <h3 style={{ fontSize: 18 }}>طلبات الانضمام الحديثة</h3>
            <button className="btn ghost sm" onClick={() => setTab("approvals")}>عرض الكل ←</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            {PENDING_APPROVALS.slice(0, 3).map(p => (
              <div key={p.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: 12, borderRadius: 12, background: "var(--bg-soft)" }}>
                <Avatar name={p.name} color={p.type === "teacher" ? "var(--grad-3)" : "var(--grad-1)"} size={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="bold f-14">{p.name}</div>
                  <div className="muted f-12">{p.detail}</div>
                </div>
                <span className="chip primary">{p.type === "teacher" ? "معلم" : "طالب"}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 18 }}>أعلى الطلاب أداءً</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            {[...STUDENTS].sort((a, b) => b.stars - a.stars).slice(0, 5).map((s, i) => (
              <div key={s.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: 10, borderRadius: 10, background: "var(--bg-soft)" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: i === 0 ? "var(--accent)" : i === 1 ? "var(--bg-alt)" : "var(--bg-soft)", display: "grid", placeItems: "center", fontWeight: 800, fontFamily: "var(--font-display)", color: i < 2 ? "var(--ink)" : "var(--muted)", border: "1px solid var(--line)" }}>{i + 1}</div>
                <Avatar name={s.name} color={s.color} size={32} />
                <div style={{ flex: 1 }}>
                  <div className="bold f-14">{s.name}</div>
                  <div className="muted f-12">{s.level}</div>
                </div>
                <span className="chip accent">⭐ {s.stars}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- charts (svg-based) ----------
function ActivityChart() {
  const data = [3, 5, 4, 8, 6, 9, 7];
  const max = Math.max(...data);
  const labels = ["السبت","الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة"];
  return (
    <svg viewBox="0 0 600 220" style={{ width: "100%", marginTop: 14 }}>
      <defs>
        <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff7a45" />
          <stop offset="100%" stopColor="#ffc847" />
        </linearGradient>
      </defs>
      {data.map((v, i) => {
        const w = 50; const gap = 32; const total = data.length;
        const x = 30 + i * (w + gap);
        const h = (v / max) * 150;
        const y = 180 - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} rx="8" fill="url(#barG)" />
            <text x={x + w/2} y={y - 6} textAnchor="middle" fill="var(--ink)" fontSize="13" fontWeight="700">{v}</text>
            <text x={x + w/2} y={205} textAnchor="middle" fill="var(--muted)" fontSize="12">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

function LevelDonut() {
  const data = [
    { l: "الروضة",        v: 24, c: "#ff7a45" },
    { l: "المستوى الأول", v: 48, c: "#6c63ff" },
    { l: "المستوى الثاني",v: 18, c: "#2bb673" },
    { l: "تجويد/أعاجم",   v: 10, c: "#ffc847" },
  ];
  const total = data.reduce((s, x) => s + x.v, 0);
  let acc = 0;
  const R = 70, C = 2 * Math.PI * R;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 14 }}>
      <svg viewBox="0 0 180 180" width="180" height="180">
        <circle cx="90" cy="90" r={R} fill="none" stroke="var(--bg-soft)" strokeWidth="22" />
        {data.map((d, i) => {
          const len = (d.v / total) * C;
          const off = -acc;
          acc += len;
          return <circle key={i} cx="90" cy="90" r={R} fill="none" stroke={d.c} strokeWidth="22"
                         strokeDasharray={`${len} ${C - len}`} strokeDashoffset={off} transform="rotate(-90 90 90)" strokeLinecap="butt" />;
        })}
        <text x="90" y="86" textAnchor="middle" fill="var(--ink)" fontSize="26" fontWeight="800" fontFamily="var(--font-display)">{total}</text>
        <text x="90" y="106" textAnchor="middle" fill="var(--muted)" fontSize="11" fontWeight="600">طالبًا</text>
      </svg>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        {data.map((d, i) => (
          <div key={i} className="spread" style={{ fontSize: 13 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: 4, background: d.c }} /> {d.l}
            </span>
            <span className="bold">{d.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- APPROVALS ----------
function AdminApprovals() {
  const [list, setList] = useState(PENDING_APPROVALS);
  const [filter, setFilter] = useState("all");
  const filtered = list.filter(p => filter === "all" || p.type === filter);
  const remove = (id) => setList(l => l.filter(x => x.id !== id));
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>طلبات الانضمام</h1>
          <p>{list.length} طلب بانتظار المراجعة</p>
        </div>
        <div className="tabs">
          <button className={filter === "all"     ? "active" : ""} onClick={() => setFilter("all")}>الكل ({list.length})</button>
          <button className={filter === "teacher" ? "active" : ""} onClick={() => setFilter("teacher")}>معلمون ({list.filter(x=>x.type==="teacher").length})</button>
          <button className={filter === "student" ? "active" : ""} onClick={() => setFilter("student")}>طلاب ({list.filter(x=>x.type==="student").length})</button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(p => (
          <div key={p.id} className="card" style={{ display: "flex", gap: 16, alignItems: "center", padding: 20 }}>
            <Avatar name={p.name} color={p.type === "teacher" ? "var(--grad-3)" : "var(--grad-1)"} size={56} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h3 style={{ fontSize: 17 }}>{p.name}</h3>
                <span className={`chip ${p.type === "teacher" ? "success" : "primary"}`}>{p.type === "teacher" ? "معلم" : "طالب"}</span>
                <span className="muted f-12">طُلب {p.submitted}</span>
              </div>
              <p className="muted f-14 mt-8">{p.detail}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn ghost"><Icon name="eye" size={14} /> الملف</button>
              <button className="btn" style={{ background: "color-mix(in oklab, var(--danger) 14%, var(--surface))", color: "var(--danger)" }} onClick={() => remove(p.id)}><Icon name="x" size={14} color="var(--danger)" /> رفض</button>
              <button className="btn success" onClick={() => remove(p.id)}><Icon name="check" size={14} color="white" /> قبول</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 56 }}>🎉</div>
            <h3 style={{ fontSize: 20, marginTop: 8 }}>لا توجد طلبات معلّقة</h3>
            <p className="muted">تم مراجعة كل الطلبات. شكرًا!</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ---------- TEACHERS ----------
function AdminTeachers() {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>المعلمون</h1>
          <p>إدارة فريق التعليم</p>
        </div>
        <button className="btn primary"><Icon name="plus" size={16} color="white" /> دعوة معلم</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
        {TEACHERS.map(t => (
          <div key={t.id} className="card">
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <Avatar name={t.name} color="var(--grad-3)" size={56} />
              <div>
                <h3 style={{ fontSize: 17 }}>{t.name}</h3>
                <div className="muted f-13">{t.role}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 16 }}>
              <Mini2 v={t.students} l="طالب" />
              <Mini2 v={t.sessionsWeek} l="جلسة/أس" />
              <Mini2 v={t.rating + "★"} l="تقييم" c="var(--accent)" />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button className="btn ghost sm" style={{ flex: 1 }}>الملف</button>
              <button className="btn ghost sm" style={{ flex: 1 }}><Icon name="chat" size={14} /> رسالة</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Mini2({ v, l, c }) {
  return (
    <div style={{ padding: 10, background: "var(--bg-soft)", borderRadius: 10, textAlign: "center" }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: c || "var(--ink)", fontFamily: "var(--font-display)" }}>{v}</div>
      <div className="muted f-12">{l}</div>
    </div>
  );
}

// ---------- STUDENTS (admin view) ----------
function AdminStudents() {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>كل الطلاب</h1>
          <p>{STUDENTS.length} طالب مسجل في المنصة</p>
        </div>
        <button className="btn primary"><Icon name="download" size={16} color="white" /> تصدير CSV</button>
      </div>
      <div className="card flat" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead><tr><th>الطالب</th><th>العمر</th><th>المستوى</th><th>المعلم</th><th>التقدم</th><th>النجوم</th><th>الحضور</th><th>الحالة</th></tr></thead>
          <tbody>
            {STUDENTS.map(s => (
              <tr key={s.id}>
                <td><div style={{ display: "flex", alignItems: "center", gap: 12 }}><Avatar name={s.name} color={s.color} size={36} /><div className="bold f-14">{s.name}</div></div></td>
                <td className="muted">{s.age}</td>
                <td>{s.level}</td>
                <td className="muted f-13">أ. عبد الرحمن</td>
                <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ flex: 1, maxWidth: 90 }}><ProgressBar value={s.progress} /></div><span className="bold f-13">{s.progress}%</span></div></td>
                <td><span className="chip accent">⭐ {s.stars}</span></td>
                <td><span className={`chip ${s.attendance === "ممتاز" ? "success" : "primary"}`}>{s.attendance}</span></td>
                <td><span className="chip success">نشط</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- CONTENT ----------
function AdminContent() {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>إدارة المحتوى</h1>
          <p>المنهج، الكتب، الفيديوهات، الكويزات</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {[
          { ico: "book",   label: "كتب الحقيبة",       n: BOOKS.length, c: "var(--primary)" },
          { ico: "video",  label: "دروس فيديو",        n: LESSONS.length + 12, c: "var(--accent-2)" },
          { ico: "quiz",   label: "كويزات",             n: 24, c: "var(--secondary)" },
          { ico: "folder", label: "أوراق عمل",          n: 87, c: "var(--accent)" },
        ].map((x, i) => (
          <div key={i} className="card" style={{ cursor: "pointer" }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: `color-mix(in oklab, ${x.c} 18%, transparent)`, color: x.c, display: "grid", placeItems: "center", marginBottom: 12 }}>
              <Icon name={x.ico} size={24} />
            </div>
            <div className="bold f-15">{x.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "var(--font-display)", marginTop: 4 }}>{x.n}</div>
            <button className="btn ghost sm mt-16">إدارة ←</button>
          </div>
        ))}
      </div>

      <div className="card mt-24">
        <h3 style={{ fontSize: 18 }}>المنهج المنشور</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
          {CURRICULUM.map(l => (
            <div key={l.id} style={{ padding: 16, borderRadius: 14, background: "var(--bg-soft)" }}>
              <div className="spread">
                <div className="bold f-16">{l.title}</div>
                <span className="chip success">منشور</span>
              </div>
              <div className="muted f-13 mt-8">{l.chapters.length} أبواب · {l.chapters.reduce((s, c) => s + c.lessons.length, 0)} درسًا</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- SETTINGS ----------
function AdminSettings() {
  return (
    <div>
      <div className="page-head"><div><h1>إعدادات المنصة</h1><p>التحكم العام بالأكاديمية</p></div></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div className="card">
          <h3 style={{ fontSize: 18 }}>معلومات الأكاديمية</h3>
          <div className="field mt-16"><label>اسم الأكاديمية</label><input defaultValue={ACADEMY.name} /></div>
          <div className="field"><label>المؤسس</label><input defaultValue={ACADEMY.author} /></div>
          <div className="field"><label>رقم الجوال</label><input defaultValue={ACADEMY.contact.phone} /></div>
          <div className="field"><label>البريد الإلكتروني</label><input defaultValue={ACADEMY.contact.emails[0]} /></div>
          <button className="btn primary">حفظ التغييرات</button>
        </div>
        <div className="card">
          <h3 style={{ fontSize: 18 }}>سياسات التسجيل</h3>
          <Toggle label="السماح بتسجيل طلاب جدد" on={true} />
          <Toggle label="السماح بتسجيل معلمين جدد" on={true} />
          <Toggle label="مطلوب موافقة المشرف يدويًا" on={true} />
          <Toggle label="إرسال إشعارات واتساب" on={true} />
          <Toggle label="الوضع التجريبي (بدون حفظ)" on={false} />
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, on }) {
  const [v, setV] = useState(on);
  return (
    <div className="spread" style={{ padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
      <span className="f-14">{label}</span>
      <button onClick={() => setV(x => !x)} style={{
        width: 44, height: 26, borderRadius: 999, border: 0,
        background: v ? "var(--secondary)" : "var(--bg-alt)",
        position: "relative", cursor: "pointer", transition: "background 0.2s",
      }}>
        <span style={{
          position: "absolute", top: 3, insetInlineStart: v ? 22 : 3,
          width: 20, height: 20, borderRadius: "50%", background: "white",
          transition: "inset-inline-start 0.2s",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        }} />
      </button>
    </div>
  );
}

Object.assign(window, { AdminDashboard });
