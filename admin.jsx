import React, { useEffect, useState } from "react";
import { api } from "./src/lib/api.js";
import { asFormData, Avatar, DashboardShell, EmptyState, ErrorBanner, Field, Icon, Loading, Stat, roleLabel } from "./shared.jsx";

const tabs = ["home", "approvals", "users", "content", "settings"];
const labels = { home: "الرئيسية", approvals: "الطلبات", users: "المستخدمون", content: "المحتوى", settings: "الإعدادات" };

export default function AdminDashboard({ session, homeResetKey }) {
  const [tab, setTab] = useState("home");
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const load = () => api.admin.dashboard().then(setDashboard).catch((err) => setError(err.message));
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => setTab("home"), [homeResetKey]);

  if (!dashboard && !error) return <Loading />;

  return (
    <DashboardShell session={session} tab={tab} setTab={setTab} tabs={tabs} labels={labels}>
      <ErrorBanner error={error} />
      {tab === "home" && <AdminHome data={dashboard} setTab={setTab} />}
      {tab === "approvals" && <AdminApprovals onChanged={load} />}
      {tab === "users" && <AdminUsers />}
      {tab === "content" && <AdminContent />}
      {tab === "settings" && <AdminSettings />}
    </DashboardShell>
  );
}

function AdminHome({ data, setTab }) {
  const totals = data?.totals || {};
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>لوحة المشرف</h1>
          <p>الأرقام والرسوم الآن من قاعدة البيانات، والواجهة القديمة عادت.</p>
        </div>
        <button type="button" className="btn primary" onClick={() => setTab("approvals")}>
          <Icon name="bell" size={16} color="white" /> {totals.pending || 0} طلبات معلقة
        </button>
      </div>
      <div className="stat-grid">
        <Stat value={totals.students || 0} label="طلاب نشطون" />
        <Stat value={totals.teachers || 0} label="معلمون" />
        <Stat value={totals.monthlySessions || totals.sessions || 0} label="جلسات/شهر" />
        <Stat value={totals.packagePrice ? `${totals.packagePrice} جنيه` : 0} label="سعر الحقيبة" />
        <Stat value={totals.orders || 0} label="طلبات جديدة" />
        <Stat value={totals.pending || 0} label="طلبات معلقة" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }} className="mt-24">
        <div className="card elev">
          <h2>نشاط آخر 7 أيام</h2>
          {(data?.activity || []).length ? <ActivityChart data={data.activity} /> : <EmptyState title="لا يوجد نشاط بعد" />}
          <div className="activity-bars mt-16">
            {(data?.activity || []).map((item) => (
              <div key={item.date}>
                <div className="spread f-13">
                  <span>{item.date}</span>
                  <span>{item.newStudents + item.newTeachers + item.sessions + item.quizzes}</span>
                </div>
                <div className="progress-bar mt-8">
                  <div style={{ width: `${Math.min(100, (item.newStudents + item.newTeachers + item.sessions + item.quizzes) * 18)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card elev">
          <h2>إجراءات سريعة</h2>
          <div className="admin-quick-actions mt-16">
            <button type="button" className="btn ghost" onClick={() => setTab("approvals")}><Icon name="bell" size={16} /> الطلبات</button>
            <button type="button" className="btn ghost" onClick={() => setTab("users")}><Icon name="users" size={16} /> المستخدمون</button>
            <button type="button" className="btn ghost" onClick={() => setTab("content")}><Icon name="folder" size={16} /> المحتوى</button>
            <button type="button" className="btn ghost" onClick={() => setTab("settings")}><Icon name="settings" size={16} /> الإعدادات</button>
          </div>
        </div>
        <div className="card elev">
          <h2>توزيع المستويات</h2>
          {(data?.levelDistribution || []).length ? <LevelDonut data={data.levelDistribution} /> : null}
          {(data?.levelDistribution || []).length ? data.levelDistribution.map((level) => (
            <div key={level.level} className="mt-16">
              <div className="spread f-13">
                <span>{level.level}</span>
                <span>{level.count}</span>
              </div>
              <div className="progress-bar mt-8">
                <div style={{ width: `${Math.min(100, level.count * 20)}%` }} />
              </div>
            </div>
          )) : <EmptyState title="لا يوجد توزيع مستويات" />}
        </div>
      </div>
      <div className="admin-home-grid mt-24">
        <div className="card">
          <div className="spread">
            <h3 className="f-18">طلبات الانضمام الحديثة</h3>
            <button type="button" className="btn ghost sm" onClick={() => setTab("approvals")}>عرض الكل</button>
          </div>
          <div className="admin-list mt-16">
            {(data?.recentApprovals || []).length ? data.recentApprovals.slice(0, 4).map((item) => (
              <div key={item.id} className="admin-person-row">
                <Avatar name={item.name} color={item.role === "teacher" ? "var(--grad-3)" : "var(--grad-1)"} size={38} />
                <div>
                  <div className="bold f-14">{item.name}</div>
                  <div className="muted f-12">{item.email}</div>
                </div>
                <span className="chip primary">{roleLabel[item.role] || item.role}</span>
              </div>
            )) : <EmptyState title="لا توجد طلبات حديثة" />}
          </div>
        </div>
        <div className="card">
          <h3 className="f-18">أعلى الطلاب أداءً</h3>
          <div className="admin-list mt-16">
            {(data?.topStudents || []).length ? data.topStudents.slice(0, 5).map((student, index) => (
              <div key={student.id} className="admin-person-row">
                <span className="admin-rank">{index + 1}</span>
                <Avatar name={student.name} color="var(--grad-1)" size={34} />
                <div>
                  <div className="bold f-14">{student.name}</div>
                  <div className="muted f-12">{student.level || "مستوى غير محدد"}</div>
                </div>
                <span className="chip accent">★ {student.stars || 0}</span>
              </div>
            )) : <EmptyState title="لا يوجد طلاب" />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityChart({ data }) {
  const values = data.map((item) => item.newStudents + item.newTeachers + item.sessions + item.quizzes);
  const max = Math.max(1, ...values);
  return (
    <svg className="activity-chart" viewBox="0 0 420 210" role="img" aria-label="Activity chart">
      <line x1="30" y1="180" x2="400" y2="180" />
      {values.map((value, index) => {
        const width = 34;
        const gap = 17;
        const x = 42 + index * (width + gap);
        const height = (value / max) * 140;
        const y = 180 - height;
        return (
          <g key={data[index].date}>
            <rect className={`s${index % 3}`} x={x} y={y} width={width} height={height || 4} rx="9" />
            <text x={x + width / 2} y="199" textAnchor="middle">{data[index].date.slice(-2)}</text>
          </g>
        );
      })}
    </svg>
  );
}

function LevelDonut({ data }) {
  const total = data.reduce((sum, item) => sum + item.count, 0) || 1;
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div className="level-donut">
      <svg viewBox="0 0 160 160" role="img" aria-label="Level distribution">
        <circle cx="80" cy="80" r={radius} className="donut-bg" />
        {data.map((item, index) => {
          const length = (item.count / total) * circumference;
          const currentOffset = offset;
          offset += length;
          return (
            <circle
              key={item.level}
              cx="80"
              cy="80"
              r={radius}
              className={`donut-segment s${index % 4}`}
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-currentOffset}
            />
          );
        })}
        <text x="80" y="76" textAnchor="middle" className="donut-total">{total}</text>
        <text x="80" y="96" textAnchor="middle" className="donut-label">طالب</text>
      </svg>
    </div>
  );
}

function AdminApprovals({ onChanged }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const load = () => api.admin.approvals().then((data) => setItems(data.approvals || [])).catch((err) => setError(err.message));
  useEffect(() => {
    void load();
  }, []);
  const review = async (id, action) => {
    setError("");
    try {
      if (action === "approve") await api.admin.approve(id);
      else await api.admin.reject(id);
      await load();
      onChanged?.();
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div>
      <ErrorBanner error={error} />
      {items.length ? items.map((item) => (
        <div key={item.id} className="card spread">
          <div>
            <div className="bold">{item.name}</div>
            <div className="muted f-13">{roleLabel[item.role]} — {item.email}</div>
          </div>
          <div className="row">
            <button type="button" className="btn ghost sm" onClick={() => review(item.id, "reject")}>رفض</button>
            <button type="button" className="btn success sm" onClick={() => review(item.id, "approve")}>قبول</button>
          </div>
        </div>
      )) : <EmptyState title="لا توجد طلبات معلقة" />}
    </div>
  );
}

function AdminUsers() {
  const [role, setRole] = useState("");
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ role: "student", fullName: "", email: "", phone: "", password: "", level: "", specialty: "" });
  const [error, setError] = useState("");
  const load = () => api.admin.users(role).then((data) => setUsers(data.users || [])).catch((err) => setError(err.message));
  useEffect(() => {
    void load();
  }, [role]);
  const create = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api.admin.createUser(form);
      setForm({ role: "student", fullName: "", email: "", phone: "", password: "", level: "", specialty: "" });
      load();
    } catch (err) {
      setError(err.message);
    }
  };
  const remove = async (id) => {
    setError("");
    try {
      await api.admin.deleteUser(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div>
      <div className="tabs">
        {["", "student", "teacher", "admin"].map((item) => <button type="button" key={item || "all"} className={role === item ? "active" : ""} onClick={() => setRole(item)}>{item ? roleLabel[item] : "الكل"}</button>)}
      </div>
      <ErrorBanner error={error} />
      <form className="card elev mt-16" onSubmit={create}>
        <h2>إضافة مستخدم</h2>
        <Field label="الدور"><select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option value="student">طالب</option><option value="teacher">معلم</option><option value="admin">مشرف</option></select></Field>
        <Field label="الاسم"><input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required /></Field>
        <Field label="البريد"><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></Field>
        <Field label="كلمة المرور"><input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></Field>
        <button className="btn primary">إضافة</button>
      </form>
      <div className="card flat mt-16" style={{ padding: 0, overflow: "auto" }}>
        <table className="table">
          <thead><tr><th>الاسم</th><th>الدور</th><th>الحالة</th><th></th></tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}<div className="muted f-12">{user.email}</div></td>
                <td>{roleLabel[user.role]}</td>
                <td>{user.status}</td>
                <td><button type="button" className="btn ghost sm" onClick={() => remove(user.id)}>حذف</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminContent() {
  const [content, setContent] = useState(null);
  const [error, setError] = useState("");
  const load = async () => {
    try {
      const [summary, books, videos, lessons, curriculum] = await Promise.all([api.admin.content(), api.admin.books(), api.admin.videos(), api.admin.lessons(), api.admin.curriculum()]);
      setContent({ summary, books: books.books || [], videos: videos.videos || [], lessons: lessons.lessons || [], levels: curriculum.levels || [] });
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => { load(); }, []);
  if (!content && !error) return <Loading />;
  return (
    <div className="admin-content-grid">
      <ErrorBanner error={error} />
      <ContentSummary summary={content?.summary} />
      <BookAdmin books={content?.books || []} reload={load} />
      <VideoAdmin videos={content?.videos || []} reload={load} />
      <LessonAdmin lessons={content?.lessons || []} levels={content?.levels || []} reload={load} />
      <CurriculumAdmin levels={content?.levels || []} reload={load} />
    </div>
  );
}

function ContentSummary({ summary }) {
  return (
    <section className="card elev">
      <h2>ملخص المحتوى</h2>
      <div className="stat-grid mt-16">
        <Stat value={summary?.levels?.length || 0} label="مستويات" />
        <Stat value={summary?.lessons || 0} label="دروس" />
        <Stat value={summary?.quizzes || 0} label="كويزات" />
        <Stat value={summary?.materials || 0} label="مواد" />
      </div>
    </section>
  );
}

function BookAdmin({ books, reload }) {
  const emptyForm = { title: "", level: "", subtitle: "", soon: false, externalUrl: "" };
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [cover, setCover] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const reset = () => {
    setForm(emptyForm);
    setEditing(null);
    setCover(null);
    setFile(null);
  };
  const startEditing = (book) => {
    setError("");
    setEditing(book);
    setForm({
      title: book.title || "",
      level: book.level || "",
      subtitle: book.subtitle || "",
      soon: Boolean(book.soon),
      externalUrl: book.externalUrl || ""
    });
    setCover(null);
    setFile(null);
  };
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const payload = asFormData(form, { cover, file });
      if (editing) await api.admin.updateBook(editing.id, payload);
      else await api.admin.createBook(payload);
      reset();
      await reload();
    } catch (err) {
      setError(err.message);
    }
  };
  const move = async (book, direction) => {
    setError("");
    try {
      await api.admin.moveBook(book.id, direction);
      await reload();
    } catch (err) {
      setError(err.message);
    }
  };
  const remove = async (book) => {
    setError("");
    try {
      await api.admin.deleteBook(book.id);
      if (editing?.id === book.id) reset();
      await reload();
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <section className="card elev">
      <h2>{editing ? "تعديل الكتاب" : "الكتب"}</h2>
      <ErrorBanner error={error} />
      <form onSubmit={submit}>
        <Field label="العنوان"><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></Field>
        <Field label="المستوى أو الفئة"><input value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })} /></Field>
        <Field label="وصف مختصر أو حالة النشر"><input value={form.subtitle} onChange={(event) => setForm({ ...form, subtitle: event.target.value })} /></Field>
        <Field label="رابط الكتاب الخارجي"><input dir="ltr" value={form.externalUrl} onChange={(event) => setForm({ ...form, externalUrl: event.target.value })} /></Field>
        <label className="check-row"><input type="checkbox" checked={form.soon} onChange={(event) => setForm({ ...form, soon: event.target.checked })} /> تحت الطبع</label>
        <Field label="ملف الكتاب"><input type="file" disabled={form.soon} onChange={(event) => setFile(event.target.files[0])} /></Field>
        <Field label="الغلاف"><input type="file" accept="image/*" onChange={(event) => setCover(event.target.files[0])} /></Field>
        <div className="row">
          <button className="btn primary">{editing ? "حفظ التعديلات" : "إضافة كتاب"}</button>
          {editing ? <button type="button" className="btn ghost" onClick={reset}>إلغاء</button> : null}
        </div>
      </form>
      <div className="col mt-16">
        {books.map((book, index) => (
          <div key={book.id} className="spread" style={{ padding: 10, borderBottom: "1px solid var(--line)", gap: 8 }}>
            <div>
              <div className="bold">{index + 1}. {book.title}</div>
              <div className="muted f-12">{book.subtitle || book.level || "بدون تصنيف"}</div>
            </div>
            <div className="row" style={{ gap: 6 }}>
              <button type="button" className="btn ghost sm icon-btn" title="نقل للأعلى" aria-label="نقل للأعلى" disabled={index === 0} onClick={() => move(book, "up")}><Icon name="arrow-up" size={16} /></button>
              <button type="button" className="btn ghost sm icon-btn" title="نقل للأسفل" aria-label="نقل للأسفل" disabled={index === books.length - 1} onClick={() => move(book, "down")}><Icon name="arrow-down" size={16} /></button>
              <button type="button" className="btn ghost sm icon-btn" title="تعديل الكتاب" aria-label="تعديل الكتاب" onClick={() => startEditing(book)}><Icon name="edit" size={16} /></button>
              <button type="button" className="btn ghost sm icon-btn" title="حذف الكتاب" aria-label="حذف الكتاب" onClick={() => remove(book)}><Icon name="trash" size={16} /></button>
            </div>
          </div>
        ))}
        {!books.length ? <EmptyState title="لا توجد كتب" /> : null}
      </div>
    </section>
  );
}

function VideoAdmin({ videos, reload }) {
  const emptyForm = { title: "", youtubeUrl: "", placement: "library" };
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const reset = () => {
    setForm(emptyForm);
    setEditing(null);
  };
  const startEditing = (video) => {
    setError("");
    setEditing(video);
    setForm({ title: video.title || "", youtubeUrl: video.youtubeId ? `https://www.youtube.com/watch?v=${video.youtubeId}` : "", placement: video.placement || "library" });
  };
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (editing) await api.admin.updateVideo(editing.id, form);
      else await api.admin.createVideo(form);
      reset();
      await reload();
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <section className="card elev">
      <h2>{editing ? "تعديل الفيديو" : "فيديوهات الصفحة"}</h2>
      <ErrorBanner error={error} />
      <form onSubmit={submit}>
        <Field label="العنوان"><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></Field>
        <Field label="رابط يوتيوب"><input dir="ltr" value={form.youtubeUrl} onChange={(event) => setForm({ ...form, youtubeUrl: event.target.value })} required /></Field>
        <Field label="مكان العرض"><select value={form.placement} onChange={(event) => setForm({ ...form, placement: event.target.value })}>
          <option value="testimonials">قالوا عن المنهج</option>
          <option value="bag">محتويات الحقيبة والكتب</option>
          <option value="outcomes">ثمرة مناهج اقرأ ورتل</option>
          <option value="library">مكتبة الفيديوهات (غير معروض)</option>
        </select></Field>
        <div className="row">
          <button className="btn primary">{editing ? "حفظ التعديلات" : "إضافة فيديو"}</button>
          {editing ? <button type="button" className="btn ghost" onClick={reset}>إلغاء</button> : null}
        </div>
      </form>
      <div className="col mt-16">
        {videos.map((video) => (
          <div key={video.id} className="spread" style={{ padding: 10, borderBottom: "1px solid var(--line)", gap: 8 }}>
            <div>
              <div className="bold">{video.title}</div>
              <div className="muted f-12">{{ testimonials: "قالوا عن المنهج", bag: "محتويات الحقيبة والكتب", outcomes: "ثمرة مناهج اقرأ ورتل", library: "مكتبة الفيديوهات" }[video.placement] || "مكتبة الفيديوهات"}</div>
            </div>
            <div className="row" style={{ gap: 6 }}>
              <button type="button" className="btn ghost sm icon-btn" title="تعديل الفيديو" aria-label="تعديل الفيديو" onClick={() => startEditing(video)}><Icon name="edit" size={16} /></button>
              <button type="button" className="btn ghost sm icon-btn" title="حذف الفيديو" aria-label="حذف الفيديو" onClick={() => api.admin.deleteVideo(video.id).then(reload).catch((err) => setError(err.message))}><Icon name="trash" size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LessonAdmin({ lessons, levels, reload }) {
  const firstLevel = levels[0]?.id || "";
  const [form, setForm] = useState({ title: "", levelId: firstLevel, chapterId: "", youtubeUrl: "", duration: "", order: 0 });
  const [error, setError] = useState("");
  useEffect(() => {
    if (!form.levelId && firstLevel) setForm((current) => ({ ...current, levelId: firstLevel }));
  }, [firstLevel, form.levelId]);
  const chapters = levels.find((level) => level.id === form.levelId)?.chapters || [];
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api.admin.createLesson(form);
      setForm({ title: "", levelId: firstLevel, chapterId: "", youtubeUrl: "", duration: "", order: 0 });
      reload();
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <section className="card elev">
      <h2>الدروس وروابط يوتيوب</h2>
      <ErrorBanner error={error} />
      {levels.length ? (
        <form onSubmit={submit}>
          <Field label="العنوان"><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></Field>
          <Field label="المستوى"><select value={form.levelId} onChange={(event) => setForm({ ...form, levelId: event.target.value, chapterId: "" })}>{levels.map((level) => <option key={level.id} value={level.id}>{level.title}</option>)}</select></Field>
          <Field label="الباب"><select value={form.chapterId} onChange={(event) => setForm({ ...form, chapterId: event.target.value })}><option value="">بدون باب</option>{chapters.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.title}</option>)}</select></Field>
          <Field label="رابط يوتيوب"><input dir="ltr" value={form.youtubeUrl} onChange={(event) => setForm({ ...form, youtubeUrl: event.target.value })} /></Field>
          <button className="btn primary">إضافة درس</button>
        </form>
      ) : <EmptyState title="أضف مستوى أولًا" body="لا يمكن إنشاء درس قبل إنشاء مستوى." />}
      <SimpleList items={lessons} label={(lesson) => lesson.title} onDelete={(lesson) => api.admin.deleteLesson(lesson.id).then(reload)} />
    </section>
  );
}

function CurriculumAdmin({ levels, reload }) {
  const [levelTitle, setLevelTitle] = useState("");
  const [chapter, setChapter] = useState({ title: "", levelId: levels[0]?.id || "" });
  const [error, setError] = useState("");
  useEffect(() => {
    if (!chapter.levelId && levels[0]?.id) setChapter((current) => ({ ...current, levelId: levels[0].id }));
  }, [levels, chapter.levelId]);
  const addLevel = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api.admin.createLevel({ title: levelTitle, order: levels.length + 1 });
      setLevelTitle("");
      reload();
    } catch (err) {
      setError(err.message);
    }
  };
  const addChapter = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api.admin.createChapter({ ...chapter, order: 0 });
      setChapter({ ...chapter, title: "" });
      reload();
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <section className="card elev">
      <h2>المنهج</h2>
      <ErrorBanner error={error} />
      <form onSubmit={addLevel} style={{ marginBottom: 14 }}>
        <Field label="مستوى جديد"><input value={levelTitle} onChange={(event) => setLevelTitle(event.target.value)} required /></Field>
        <button className="btn primary">إضافة مستوى</button>
      </form>
      {levels.length ? (
        <form onSubmit={addChapter}>
          <Field label="باب جديد"><input value={chapter.title} onChange={(event) => setChapter({ ...chapter, title: event.target.value })} required /></Field>
          <Field label="المستوى"><select value={chapter.levelId} onChange={(event) => setChapter({ ...chapter, levelId: event.target.value })}>{levels.map((level) => <option key={level.id} value={level.id}>{level.title}</option>)}</select></Field>
          <button className="btn primary">إضافة باب</button>
        </form>
      ) : null}
      <SimpleList items={levels} label={(level) => `${level.title} (${level.chapters?.length || 0})`} onDelete={(level) => api.admin.deleteLevel(level.id).then(reload)} />
    </section>
  );
}

function SimpleList({ items, label, onDelete }) {
  const [error, setError] = useState("");
  const remove = async (item) => {
    setError("");
    try {
      await onDelete(item);
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="col mt-16">
      <ErrorBanner error={error} />
      {items.length ? items.map((item) => (
        <div key={item.id || item.code} className="spread" style={{ padding: 10, borderBottom: "1px solid var(--line)" }}>
          <span>{label(item)}</span>
          <button type="button" className="btn ghost sm" onClick={() => remove(item)}>حذف</button>
        </div>
      )) : <EmptyState title="لا توجد عناصر" />}
    </div>
  );
}

function AdminSettings() {
  const [form, setForm] = useState({ name: "", author: "", phone: "", packagePrice: 0, emails: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api.admin.settings()
      .then(({ settings }) => {
        if (!active || !settings) return;
        setForm({
          name: settings.name || "",
          author: settings.author || "",
          phone: settings.phone || "",
          packagePrice: settings.packagePrice ?? 0,
          emails: Array.isArray(settings.emails) ? settings.emails.join(", ") : ""
        });
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, []);
  const save = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.admin.updateSettings({ ...form, emails: form.emails ? form.emails.split(",").map((item) => item.trim()).filter(Boolean) : [] });
      setMessage("تم الحفظ");
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <form className="card elev" onSubmit={save}>
      <h2>إعدادات المنصة</h2>
      <ErrorBanner error={error} />
      <Field label="اسم الأكاديمية"><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></Field>
      <Field label="المؤسس"><input value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} /></Field>
      <Field label="الهاتف"><input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></Field>
      <Field label="السعر"><input type="number" value={form.packagePrice} onChange={(event) => setForm({ ...form, packagePrice: event.target.value })} /></Field>
      <Field label="الإيميلات مفصولة بفاصلة"><input value={form.emails} onChange={(event) => setForm({ ...form, emails: event.target.value })} /></Field>
      <button className="btn primary">حفظ</button>
      {message ? <span className="chip success mt-8">{message}</span> : null}
    </form>
  );
}
