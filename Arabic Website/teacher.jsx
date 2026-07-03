// =====================================================
// teacher.jsx — Teacher dashboard
// =====================================================

function TeacherDashboard({ onSignOut, onHome, tweaks, setTweak }) {
  const [tab, setTab] = useState("home");
  const teacher = { name: "أ. عبد الرحمن عبد الباقي", role: "معلم — مؤسس", avatar: "ع", color: "var(--grad-3)" };

  return (
    <div className="app-shell">
      <DashTopBar role="teacher" user={teacher} onSignOut={onSignOut} onHome={onHome} />
      <div className="container dashboard">
        <TeacherSidebar tab={tab} setTab={setTab} user={teacher} />
        <main>
          {tab === "home"        && <TeacherHome setTab={setTab} />}
          {tab === "students"    && <TeacherStudents />}
          {tab === "upload"      && <TeacherUpload />}
          {tab === "attendance"  && <TeacherAttendance />}
          {tab === "quizzes"     && <TeacherQuizzes />}
          {tab === "zoom"        && <TeacherZoom />}
          {tab === "chat"        && <TeacherChat />}
          {tab === "profile"     && <ProfilePage role="teacher" user={teacher} tweaks={tweaks} setTweak={setTweak} />}
        </main>
      </div>
    </div>
  );
}

function TeacherSidebar({ tab, setTab, user }) {
  const items = [
    { k: "home",       icon: "home",     label: "الرئيسية" },
    { k: "students",   icon: "users",    label: "الطلاب" },
    { k: "upload",     icon: "upload",   label: "رفع المواد" },
    { k: "attendance", icon: "check",    label: "الحضور" },
    { k: "quizzes",    icon: "quiz",     label: "الكويزات" },
    { k: "zoom",       icon: "zoom",     label: "جلسات Zoom" },
    { k: "chat",       icon: "chat",     label: "المحادثات" },
    { k: "profile",    icon: "user",     label: "الملف الشخصي" },
  ];
  return (
    <aside className="sidebar">
      <div className="me" onClick={() => setTab("profile")} style={{ cursor: "pointer" }}>
        <Avatar name={user.name} color={user.color} />
        <div>
          <div className="name">{user.name}</div>
          <div className="role">{user.role}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map(it => (
          <button key={it.k} className={cls("side-link", tab === it.k && "active")} onClick={() => setTab(it.k)}>
            <span className="ico"><Icon name={it.icon} size={18} /></span>
            <span>{it.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

// ---------- HOME ----------
function TeacherHome({ setTab }) {
  const totals = {
    students: STUDENTS.length,
    activeToday: STUDENTS.filter(s => s.lastActive === "اليوم").length,
    sessionsWeek: 6,
    avgProgress: Math.round(STUDENTS.reduce((s, x) => s + x.progress, 0) / STUDENTS.length),
  };
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>أهلاً بك، أ. عبد الرحمن</h1>
          <p>إليك نظرة سريعة على نشاط الحلقة</p>
        </div>
        <button className="btn primary" onClick={() => setTab("upload")}><Icon name="upload" size={16} color="white" /> رفع مادة جديدة</button>
      </div>

      <div className="stat-grid">
        <StatCard v={totals.students}    l="طلاب الحلقة"    delta="+2 هذا الأسبوع" c="var(--primary)" />
        <StatCard v={totals.activeToday} l="نشطون اليوم"    delta={`${Math.round(totals.activeToday/totals.students*100)}% من الحلقة`} c="var(--secondary)" />
        <StatCard v={totals.sessionsWeek + " جلسات"} l="هذا الأسبوع"   delta="3 أيام · بنين وبنات" c="var(--accent-2)" />
        <StatCard v={totals.avgProgress + "%"} l="متوسط التقدم"  delta="مستوى جيد" c="var(--accent)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18, marginTop: 24 }}>
        {/* recent students */}
        <div className="card">
          <div className="spread">
            <h3 style={{ fontSize: 18 }}>أحدث نشاط الطلاب</h3>
            <button className="btn ghost sm" onClick={() => setTab("students")}>عرض الكل ←</button>
          </div>
          <table className="table flat" style={{ marginTop: 12, border: 0 }}>
            <thead><tr><th>الطالب</th><th>المستوى</th><th>التقدم</th><th>آخر نشاط</th></tr></thead>
            <tbody>
              {STUDENTS.slice(0, 5).map(s => (
                <tr key={s.id}>
                  <td><div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={s.name} color={s.color} size={32} />
                    <div className="bold f-14">{s.name}</div>
                  </div></td>
                  <td className="muted f-13">{s.level}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ flex: 1, maxWidth: 100 }}><ProgressBar value={s.progress} /></div>
                      <span className="f-13 bold">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="muted f-13">{s.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* upcoming */}
        <div className="card">
          <h3 style={{ fontSize: 18 }}>جلسات قادمة</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
            {ZOOM_SESSIONS.map(z => (
              <div key={z.id} style={{ padding: 14, borderRadius: 14, background: "var(--bg-soft)" }}>
                <div className="bold f-14">{z.title}</div>
                <div className="muted f-12 mt-8">{z.date} · {z.time}</div>
                <div className="spread mt-8">
                  <span className="chip primary">{z.joined}/{z.total} طالب</span>
                  <button className="btn ghost sm">إدارة</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* recent uploads */}
      <div className="card mt-24">
        <div className="spread">
          <h3 style={{ fontSize: 18 }}>المواد المرفوعة حديثًا</h3>
          <button className="btn ghost sm" onClick={() => setTab("upload")}>إدارة المواد ←</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
          {RECENT_UPLOADS.map((u, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 14px", borderRadius: 12, background: "var(--bg-soft)" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--surface)", display: "grid", placeItems: "center", color: "var(--primary)" }}>
                <Icon name="file" size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="bold f-14">{u.name}</div>
                <div className="muted f-12">{u.size} · {u.when}</div>
              </div>
              <button className="btn ghost sm"><Icon name="download" size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ v, l, delta, c }) {
  return (
    <div className="stat">
      <div className="v" style={{ color: c }}>{v}</div>
      <div className="l">{l}</div>
      <div className="delta up mt-8">{delta}</div>
    </div>
  );
}

// ---------- STUDENTS list with detail view ----------
function TeacherStudents() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const list = STUDENTS.filter(s => !search || s.name.includes(search));

  if (selected) return <StudentDetail student={selected} onBack={() => setSelected(null)} />;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>الطلاب</h1>
          <p>{STUDENTS.length} طالبًا في حلقاتك</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--surface)", padding: "8px 14px", borderRadius: 999, border: "1px solid var(--line)" }}>
            <Icon name="search" size={16} color="var(--muted)" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث عن طالب..." style={{ border: 0, outline: 0, background: "transparent", fontFamily: "inherit", width: 180 }} />
          </div>
          <button className="btn primary"><Icon name="plus" size={16} color="white" /> إضافة طالب</button>
        </div>
      </div>

      <div className="card flat" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr>
              <th>الطالب</th>
              <th>العمر</th>
              <th>المستوى</th>
              <th>التقدم</th>
              <th>النجوم</th>
              <th>الحضور</th>
              <th>آخر نشاط</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map(s => (
              <tr key={s.id} style={{ cursor: "pointer" }} onClick={() => setSelected(s)}>
                <td><div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar name={s.name} color={s.color} size={38} />
                  <div className="bold f-14">{s.name}</div>
                </div></td>
                <td className="muted f-14">{s.age}</td>
                <td className="f-14">{s.level}</td>
                <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, maxWidth: 110 }}><ProgressBar value={s.progress} /></div>
                  <span className="bold f-13">{s.progress}%</span>
                </div></td>
                <td><span className="chip accent">⭐ {s.stars}</span></td>
                <td><span className={`chip ${s.attendance === "ممتاز" ? "success" : s.attendance === "جيد" ? "primary" : ""}`}>{s.attendance}</span></td>
                <td className="muted f-13">{s.lastActive}</td>
                <td><button className="btn ghost sm">عرض</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StudentDetail({ student, onBack }) {
  const detail = STUDENT_DETAIL.s1; // shared mock detail
  return (
    <div>
      <div className="page-head">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button className="btn ghost sm" onClick={onBack}>← العودة</button>
          <Avatar name={student.name} color={student.color} size={56} />
          <div>
            <h1>{student.name}</h1>
            <p>{student.age} سنوات · {student.level} · ⭐ {student.stars}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn ghost"><Icon name="chat" size={16} /> إرسال رسالة</button>
          <button className="btn primary"><Icon name="pencil" size={16} color="white" /> تعديل البيانات</button>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard v={student.progress + "%"} l="إكمال المنهج" delta="جيد جدًا" c="var(--primary)" />
        <StatCard v={detail.quizScores.filter(q => q.score !== null).length} l="كويزات محلولة" delta="من 8 دروس" c="var(--secondary)" />
        <StatCard v={Math.round(detail.quizScores.filter(q => q.score).reduce((s,q) => s + q.score, 0) / detail.quizScores.filter(q => q.score).length) + "%"} l="متوسط الدرجات" delta="ممتاز" c="var(--accent-2)" />
        <StatCard v={detail.attendanceLog.filter(a => a.status === "present").length} l="حضور" delta="من 6 حلقات" c="var(--accent)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18, marginTop: 24 }}>
        <div className="card">
          <h3 style={{ fontSize: 18 }}>درجات الكويزات</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            {detail.quizScores.map((q, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: 10, borderRadius: 12, background: "var(--bg-soft)" }}>
                <div style={{ flex: 1 }}>
                  <div className="bold f-14">{q.lesson}</div>
                  <div className="muted f-12">{q.score === null ? "لم يحلّه بعد" : "تم الحلّ"}</div>
                </div>
                {q.score !== null ? (
                  <div style={{ width: 60, textAlign: "center" }}>
                    <div className="bold" style={{ color: q.score >= 90 ? "var(--secondary)" : q.score >= 70 ? "var(--primary)" : "var(--danger)" }}>{q.score}%</div>
                  </div>
                ) : <span className="chip">معلّق</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 18 }}>سجل الحضور</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
            {detail.attendanceLog.map((a, i) => (
              <div key={i} className="spread" style={{ padding: "10px 14px", borderRadius: 10, background: "var(--bg-soft)" }}>
                <span className="bold f-14">{a.date}</span>
                <span className={`chip ${a.status === "present" ? "success" : a.status === "late" ? "accent" : ""}`} style={a.status === "absent" ? { background: "color-mix(in oklab, var(--danger) 18%, transparent)", color: "var(--danger)" } : {}}>
                  {a.status === "present" ? "حاضر" : a.status === "late" ? "متأخر" : "غائب"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mt-24">
        <div className="spread">
          <h3 style={{ fontSize: 18 }}>ملاحظات وتعليقات</h3>
          <button className="btn primary sm">+ إضافة ملاحظة</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          {detail.notes.map((n, i) => (
            <div key={i} style={{ padding: 16, borderRadius: 14, background: "var(--bg-soft)" }}>
              <div className="spread">
                <span className="bold f-14">{n.from}</span>
                <span className="muted f-12">{n.date}</span>
              </div>
              <p className="f-14 mt-8">{n.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- UPLOAD ----------
function TeacherUpload() {
  const [files, setFiles] = useState(RECENT_UPLOADS);
  const [over, setOver] = useState(false);
  const handle = (e) => {
    e.preventDefault();
    setOver(false);
    const fs = [...(e.dataTransfer?.files || e.target.files || [])];
    if (fs.length) setFiles(prev => fs.map(f => ({ name: f.name, size: (f.size/1024/1024).toFixed(1) + "MB", when: "الآن" })).concat(prev));
  };
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>رفع المواد التعليمية</h1>
          <p>فيديوهات، أوراق عمل، ملفات PDF — متاحة لطلاب حلقتك</p>
        </div>
      </div>

      <div className="card" onDragOver={e => { e.preventDefault(); setOver(true); }}
           onDragLeave={() => setOver(false)} onDrop={handle}
           style={{
             borderRadius: "var(--r-lg)",
             border: `3px dashed ${over ? "var(--primary)" : "var(--line)"}`,
             background: over ? "color-mix(in oklab, var(--primary) 8%, var(--surface))" : "var(--surface)",
             padding: 48, textAlign: "center",
           }}>
        <div style={{ fontSize: 56, color: "var(--primary)" }}><Icon name="upload" size={56} color="var(--primary)" /></div>
        <h3 style={{ fontSize: 22, marginTop: 12 }}>اسحب الملفات هنا</h3>
        <p className="muted mt-8">أو اضغط لاختيار الملفات من جهازك</p>
        <label className="btn primary mt-16" style={{ display: "inline-flex", cursor: "pointer" }}>
          <Icon name="folder" size={16} color="white" /> اختيار ملفات
          <input type="file" multiple style={{ display: "none" }} onChange={handle} />
        </label>
        <div className="muted f-13 mt-16">تدعم: PDF · MP4 · DOCX · MP3 · صور · حتى 200MB</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginTop: 24 }}>
        {[
          { ico: "video",   label: "ربط فيديو يوتيوب", c: "var(--primary)" },
          { ico: "quiz",    label: "إنشاء كويز",         c: "var(--secondary)" },
          { ico: "zoom",    label: "جدول حلقة Zoom",     c: "var(--accent-2)" },
          { ico: "file",    label: "ورقة عمل جديدة",     c: "var(--accent)" },
        ].map((x, i) => (
          <div key={i} className="card" style={{ cursor: "pointer", textAlign: "center", padding: 20 }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: `color-mix(in oklab, ${x.c} 18%, transparent)`, color: x.c, display: "grid", placeItems: "center", margin: "0 auto 12px" }}>
              <Icon name={x.ico} size={24} />
            </div>
            <div className="bold f-15">{x.label}</div>
          </div>
        ))}
      </div>

      <div className="card mt-24">
        <h3 style={{ fontSize: 18 }}>الملفات المرفوعة ({files.length})</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
          {files.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", borderRadius: 12, background: "var(--bg-soft)" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--surface)", display: "grid", placeItems: "center", color: "var(--primary)" }}>
                <Icon name="file" size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="bold f-14">{f.name}</div>
                <div className="muted f-12">{f.size} · {f.when}</div>
              </div>
              <select className="chip" style={{ border: 0, background: "var(--surface)", padding: "4px 10px", fontWeight: 600, color: "var(--ink-soft)" }}>
                <option>المستوى الأول</option><option>المستوى الثاني</option><option>عام</option>
              </select>
              <button className="btn ghost sm"><Icon name="eye" size={14} /></button>
              <button className="btn ghost sm"><Icon name="download" size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- ATTENDANCE ----------
function TeacherAttendance() {
  const [date] = useState("الخميس 22 — حلقة المستوى الأول");
  const [att, setAtt] = useState(() => Object.fromEntries(STUDENTS.map(s => [s.id, "present"])));

  const set = (id, v) => setAtt(a => ({ ...a, [id]: v }));

  const counts = {
    present: Object.values(att).filter(v => v === "present").length,
    late: Object.values(att).filter(v => v === "late").length,
    absent: Object.values(att).filter(v => v === "absent").length,
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>تسجيل الحضور</h1>
          <p>{date}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select className="btn ghost"><option>الخميس 22</option><option>الثلاثاء 20</option><option>الأحد 18</option></select>
          <button className="btn primary"><Icon name="check" size={16} color="white" /> حفظ الحضور</button>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard v={counts.present} l="حاضرون" delta={`${Math.round(counts.present/STUDENTS.length*100)}%`} c="var(--secondary)" />
        <StatCard v={counts.late} l="متأخرون" delta=" " c="var(--accent)" />
        <StatCard v={counts.absent} l="غائبون" delta=" " c="var(--danger)" />
        <StatCard v={STUDENTS.length} l="إجمالي" delta="طلاب الحلقة" c="var(--primary)" />
      </div>

      <div className="card mt-24" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead><tr><th>#</th><th>الطالب</th><th>المستوى</th><th>الحالة</th></tr></thead>
          <tbody>
            {STUDENTS.map((s, i) => (
              <tr key={s.id}>
                <td className="muted">{i + 1}</td>
                <td><div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar name={s.name} color={s.color} size={38} />
                  <div className="bold">{s.name}</div>
                </div></td>
                <td className="muted">{s.level}</td>
                <td>
                  <div className="att-toggle">
                    <button className={att[s.id] === "present" ? "present" : ""} onClick={() => set(s.id, "present")}>حاضر</button>
                    <button className={att[s.id] === "late"    ? "late"    : ""} onClick={() => set(s.id, "late")}>متأخر</button>
                    <button className={att[s.id] === "absent"  ? "absent"  : ""} onClick={() => set(s.id, "absent")}>غائب</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- QUIZZES (manage) ----------
function TeacherQuizzes() {
  const [modal, setModal] = useState(false);
  const quizzes = [
    { lesson: "حرف الألف", qCount: 4, attempts: 12, avg: 92, status: "نشط" },
    { lesson: "حرف الباء", qCount: 4, attempts: 11, avg: 88, status: "نشط" },
    { lesson: "حركة الفتح", qCount: 5, attempts: 10, avg: 95, status: "نشط" },
    { lesson: "المد بالألف", qCount: 4, attempts: 6, avg: null, status: "مسودة" },
    { lesson: "حركة الكسر", qCount: 0, attempts: 0, avg: null, status: "لم يُنشأ" },
  ];
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>الكويزات</h1>
          <p>كويز قصير بعد كل فيديو يفتح الدرس التالي</p>
        </div>
        <button className="btn primary" onClick={() => setModal(true)}><Icon name="plus" size={16} color="white" /> كويز جديد</button>
      </div>

      <div className="card flat" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead><tr><th>الدرس المرتبط</th><th>عدد الأسئلة</th><th>محاولات</th><th>متوسط الدرجة</th><th>الحالة</th><th></th></tr></thead>
          <tbody>
            {quizzes.map((q, i) => (
              <tr key={i}>
                <td className="bold">{q.lesson}</td>
                <td>{q.qCount}</td>
                <td className="muted">{q.attempts}</td>
                <td>{q.avg ? <span className="bold txt-primary">{q.avg}%</span> : "—"}</td>
                <td>
                  <span className={`chip ${q.status === "نشط" ? "success" : q.status === "مسودة" ? "accent" : ""}`}>{q.status}</span>
                </td>
                <td><button className="btn ghost sm" onClick={() => setModal(true)}>تعديل</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <QuizBuilderModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
}

function QuizBuilderModal({ open, onClose }) {
  const [qs, setQs] = useState([
    { type: "mcq", prompt: "ما الحرف الذي يمدّ به الحرف المفتوح؟", options: ["الألف", "الياء", "الواو", "الميم"], answer: 0 },
  ]);
  const add = () => setQs(prev => [...prev, { type: "mcq", prompt: "", options: ["", "", "", ""], answer: 0 }]);
  const setQ = (i, k, v) => setQs(prev => prev.map((q, j) => j === i ? { ...q, [k]: v } : q));
  const setOpt = (i, j, v) => setQs(prev => prev.map((q, qi) => qi === i ? { ...q, options: q.options.map((o, oi) => oi === j ? v : o) } : q));
  return (
    <Modal open={open} onClose={onClose} title="منشئ الكويز" width={720}
      footer={<><button className="btn ghost" onClick={onClose}>إلغاء</button><button className="btn primary" onClick={onClose}>حفظ ونشر</button></>}>
      <div className="field"><label>عنوان الكويز</label><input defaultValue="مراجعة درس: المد بالألف" /></div>
      <div className="field"><label>الدرس المرتبط</label>
        <select>{LESSONS.map(l => <option key={l.id}>{l.title}</option>)}</select>
      </div>
      {qs.map((q, i) => (
        <div key={i} style={{ padding: 16, borderRadius: 14, border: "1px solid var(--line)", marginBottom: 14 }}>
          <div className="spread"><div className="bold">السؤال {i + 1}</div>
            <select value={q.type} onChange={e => setQ(i, "type", e.target.value)} style={{ padding: "4px 10px", borderRadius: 8, border: "1px solid var(--line)", fontFamily: "inherit" }}>
              <option value="mcq">اختيار من متعدد</option>
              <option value="drag">سحب وإفلات</option>
            </select>
          </div>
          <div className="field mt-8"><input value={q.prompt} onChange={e => setQ(i, "prompt", e.target.value)} placeholder="نص السؤال..." /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {q.options.map((opt, j) => (
              <div key={j} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="radio" name={`ans-${i}`} checked={q.answer === j} onChange={() => setQ(i, "answer", j)} />
                <input value={opt} onChange={e => setOpt(i, j, e.target.value)} placeholder={`الخيار ${["أ","ب","ج","د"][j]}`} style={{ flex: 1, padding: "8px 10px", border: "1px solid var(--line)", borderRadius: 8, fontFamily: "inherit" }} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button className="btn ghost" onClick={add}><Icon name="plus" size={14} /> أضف سؤالاً</button>
    </Modal>
  );
}

// ---------- ZOOM ----------
function TeacherZoom() {
  const [modal, setModal] = useState(false);
  const [sessions, setSessions] = useState(ZOOM_SESSIONS);
  const [copied, setCopied] = useState(null);
  const copy = (link, id) => {
    navigator.clipboard?.writeText(link);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };
  const remove = (id) => setSessions(s => s.filter(x => x.id !== id));
  const add = (data) => setSessions(s => [{ id: "z" + Date.now(), joined: 0, ...data }, ...s]);
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>جلسات Zoom</h1>
          <p>أنشئ روابط حلقات لطلابك أو ألصق رابط Zoom جاهز</p>
        </div>
        <button className="btn primary" onClick={() => setModal(true)}><Icon name="plus" size={16} color="white" /> جلسة جديدة</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
        {sessions.map(s => (
          <div key={s.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: "var(--grad-2)", display: "grid", placeItems: "center" }}>
                <Icon name="zoom" size={24} color="white" />
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button className="btn ghost sm" title="تعديل"><Icon name="pencil" size={14} /></button>
                <button className="btn ghost sm" title="حذف" onClick={() => remove(s.id)}><Icon name="x" size={14} /></button>
              </div>
            </div>
            <h3 style={{ fontSize: 17 }}>{s.title}</h3>
            <div className="muted f-13 mt-8">{s.date} · {s.time} · {s.duration}</div>
            <div className="mt-16" style={{ background: "var(--bg-soft)", padding: 10, borderRadius: 10, fontFamily: "ui-monospace, monospace", fontSize: 12, color: "var(--ink-soft)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, direction: "ltr", textAlign: "start" }}>{s.link}</span>
              <button className="btn ghost sm" style={{ padding: "4px 10px", fontSize: 11 }} onClick={() => copy(s.link, s.id)}>
                {copied === s.id ? "✓ نُسخ" : "نسخ"}
              </button>
            </div>
            <div className="spread mt-16">
              <span className="chip primary">{s.total} طالب</span>
              <a href={s.link} target="_blank" rel="noopener" className="btn ghost sm">
                <Icon name="zoom" size={14} /> افتح
              </a>
            </div>
          </div>
        ))}
      </div>

      <NewZoomModal open={modal} onClose={() => setModal(false)} onAdd={(data) => { add(data); setModal(false); }} />
    </div>
  );
}

function NewZoomModal({ open, onClose, onAdd }) {
  const [data, setData] = useState({
    title: "حلقة المستوى الأول — درس جديد",
    date: "الأحد",
    time: "5:00م",
    duration: "45 د",
    group: "المستوى الأول · بنين",
    total: 14,
    link: "",
    mode: "paste", // 'paste' | 'generate'
  });
  const set = (k, v) => setData(d => ({ ...d, [k]: v }));
  const generateLink = () => {
    const id = Math.floor(Math.random() * 9_000_000_000) + 1_000_000_000;
    const pwd = Math.random().toString(36).substring(2, 10);
    set("link", `https://zoom.us/j/${id}?pwd=${pwd}`);
  };
  const submit = () => {
    if (!data.link) generateLink();
    onAdd({
      title: data.title, date: data.date, time: data.time, duration: data.duration,
      teacher: "أ. عبد الرحمن", total: parseInt(data.total) || 10,
      link: data.link || `https://zoom.us/j/${Math.floor(Math.random()*9e9)}`,
    });
  };
  return (
    <Modal open={open} onClose={onClose} title="إنشاء جلسة Zoom جديدة" width={580}
      footer={<><button className="btn ghost" onClick={onClose}>إلغاء</button><button className="btn primary" onClick={submit}>إنشاء وإرسال للطلاب</button></>}>
      <div className="field"><label>عنوان الجلسة</label>
        <input value={data.title} onChange={e => set("title", e.target.value)} placeholder="مثال: حلقة المستوى الأول — الحركات" />
      </div>

      <div className="field"><label>اليوم والوقت</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <select value={data.date} onChange={e => set("date", e.target.value)}>
            <option>السبت</option><option>الأحد</option><option>الإثنين</option>
            <option>الثلاثاء</option><option>الأربعاء</option><option>الخميس</option><option>الجمعة</option>
          </select>
          <input value={data.time} onChange={e => set("time", e.target.value)} placeholder="5:00م" />
          <input value={data.duration} onChange={e => set("duration", e.target.value)} placeholder="45 د" />
        </div>
      </div>

      <div className="field"><label>الحلقة</label>
        <select value={data.group} onChange={e => set("group", e.target.value)}>
          <option>المستوى الأول · بنين</option>
          <option>المستوى الأول · بنات</option>
          <option>المستوى الثاني · بنين</option>
          <option>المستوى الثاني · بنات</option>
          <option>الروضات</option>
        </select>
      </div>

      <div className="field"><label>عدد الطلاب المتوقع</label>
        <input type="number" value={data.total} onChange={e => set("total", e.target.value)} />
      </div>

      <div className="auth-section-label">رابط Zoom</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <button type="button" className={cls("auth-pill", data.mode === "paste" && "active")} onClick={() => set("mode", "paste")}>الصق رابط جاهز</button>
        <button type="button" className={cls("auth-pill", data.mode === "generate" && "active")} onClick={() => { set("mode", "generate"); generateLink(); }}>أنشئ رابطًا تلقائيًا</button>
      </div>

      <div className="field">
        <input value={data.link} onChange={e => set("link", e.target.value)}
               placeholder="https://zoom.us/j/xxxxxxxxxx?pwd=..."
               style={{ direction: "ltr", textAlign: "start", fontFamily: "ui-monospace, monospace", fontSize: 13 }} />
        {data.mode === "generate" ? (
          <div className="muted f-12 mt-8">سيتم توليد رابط جلسة جديد. يمكنك استبداله من حسابك في Zoom.</div>
        ) : (
          <div className="muted f-12 mt-8">انسخ الرابط من Zoom (Schedule Meeting → Copy Invitation Link) والصقه هنا.</div>
        )}
      </div>

      <div className="muted f-13" style={{ background: "var(--bg-soft)", padding: 12, borderRadius: 12, marginTop: 8 }}>
        💬 سيُرسل الرابط لجميع طلاب الحلقة عبر التطبيق وواتساب فور الإنشاء.
      </div>
    </Modal>
  );
}

// ---------- CHAT ----------
function TeacherChat() {
  const [active, setActive] = useState(STUDENTS[0]);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState({
    s1: [
      { from: "me",   text: "أحسنت في كويز الفتح! استمر يا بطل 💪",  time: "10:24ص" },
      { from: "them", text: "شكرًا يا أستاذ! أنا متحمس للدرس القادم.", time: "10:32ص" },
      { from: "me",   text: "اليوم سنبدأ بدرس المد بالألف، شاهد الفيديو أولاً.", time: "10:34ص" },
    ],
    s2: [
      { from: "them", text: "أستاذ، عندي سؤال في حرف الحاء.", time: "أمس" },
      { from: "me",   text: "تفضّلي بسؤالك يا نور.", time: "أمس" },
    ],
  });
  const send = () => {
    if (!msg.trim()) return;
    setMessages(m => ({ ...m, [active.id]: [...(m[active.id] || []), { from: "me", text: msg, time: "الآن" }] }));
    setMsg("");
  };
  return (
    <div>
      <div className="page-head"><div><h1>المحادثات</h1><p>تواصل مباشر مع طلابك وأولياء الأمور</p></div></div>
      <div className="card" style={{ padding: 0, overflow: "hidden", display: "grid", gridTemplateColumns: "260px 1fr", height: 540 }}>
        <div style={{ borderInlineEnd: "1px solid var(--line)", overflowY: "auto" }}>
          {STUDENTS.slice(0, 6).map(s => (
            <div key={s.id} onClick={() => setActive(s)} style={{
              padding: 14, display: "flex", gap: 12, alignItems: "center", cursor: "pointer",
              background: active.id === s.id ? "var(--bg-soft)" : "transparent",
              borderInlineStart: active.id === s.id ? "3px solid var(--primary)" : "3px solid transparent",
            }}>
              <Avatar name={s.name} color={s.color} size={42} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="bold f-14">{s.name}</div>
                <div className="muted f-12">{messages[s.id]?.slice(-1)[0]?.text || "لا توجد رسائل بعد"}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ padding: 14, borderBottom: "1px solid var(--line)", display: "flex", gap: 12, alignItems: "center" }}>
            <Avatar name={active.name} color={active.color} size={40} />
            <div>
              <div className="bold f-15">{active.name}</div>
              <div className="muted f-12">{active.level} · متصل</div>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 20, background: "var(--bg-soft)", display: "flex", flexDirection: "column", gap: 10 }}>
            {(messages[active.id] || []).map((m, i) => (
              <div key={i} style={{ alignSelf: m.from === "me" ? "flex-start" : "flex-end", maxWidth: "70%" }}>
                <div style={{
                  background: m.from === "me" ? "var(--primary)" : "var(--surface)",
                  color: m.from === "me" ? "white" : "var(--ink)",
                  padding: "10px 14px", borderRadius: 16,
                  borderBottomLeftRadius: m.from === "me" ? 4 : 16,
                  borderBottomRightRadius: m.from === "me" ? 16 : 4,
                  fontSize: 14,
                }}>{m.text}</div>
                <div className="muted f-12" style={{ textAlign: m.from === "me" ? "start" : "end", marginTop: 4 }}>{m.time}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: 14, borderTop: "1px solid var(--line)", display: "flex", gap: 8 }}>
            <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
                   placeholder="اكتب رسالتك..." style={{ flex: 1, padding: "10px 14px", border: "1px solid var(--line)", borderRadius: 999, fontFamily: "inherit" }} />
            <button className="btn primary" onClick={send}>إرسال</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TeacherDashboard });
