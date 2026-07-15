import React, { useEffect, useState } from "react";
import { api } from "./src/lib/api.js";
import { getSocket } from "./src/lib/realtime.js";
import ProfileForm from "./profile.jsx";
import { Avatar, ChatWindow, DashboardShell, EmptyState, ErrorBanner, Field, Icon, Loading, ProgressBar, SessionList, Stat } from "./shared.jsx";

const tabs = ["home", "students", "sessions", "chat", "materials", "profile"];
const labels = { home: "الرئيسية", students: "الطلاب", sessions: "الحلقات", chat: "المحادثات", materials: "المواد", profile: "الملف" };

export default function TeacherDashboard({ session, homeResetKey }) {
  const [tab, setTab] = useState("home");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const load = () => api.teacher.dashboard().then(setData).catch((err) => setError(err.message));
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => setTab("home"), [homeResetKey]);

  if (!data && !error) return <Loading />;

  return (
    <DashboardShell session={session} tab={tab} setTab={setTab} tabs={tabs} labels={labels}>
      <ErrorBanner error={error} />
      {tab === "home" && <TeacherHome data={data} setTab={setTab} />}
      {tab === "students" && <StudentAssignmentPanel students={data?.students || []} availableStudents={data?.availableStudents || []} onChanged={load} />}
      {tab === "sessions" && <TeacherSessions initial={data?.sessions || []} students={data?.students || []} />}
      {tab === "chat" && <TeacherChat />}
      {tab === "materials" && <MaterialUpload materials={data?.materials || []} onUploaded={load} />}
      {tab === "profile" && <ProfileForm role="teacher" session={session} profile={data?.profile} />}
    </DashboardShell>
  );
}

function TeacherHome({ data, setTab }) {
  const totals = data?.totals || {};
  const students = data?.students || [];
  const sessions = data?.sessions || [];
  const materials = data?.materials || [];
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>أهلًا بك، أستاذنا</h1>
          <p>نظرة سريعة على نشاط الطلاب والحلقات والمواد من الخادم الحقيقي.</p>
        </div>
        <button type="button" className="btn primary" onClick={() => setTab("materials")}><Icon name="upload" size={16} color="white" /> رفع مادة جديدة</button>
      </div>
      <div className="stat-grid">
        <Stat value={totals.students || 0} label="طلابك" delta="طلاب مسندون إليك" />
        <Stat value={totals.availableStudents || 0} label="طلاب متاحون" delta="يمكنك إسنادهم من تبويب الطلاب" />
        <Stat value={`${totals.sessionsWeek || 0} جلسات`} label="هذا الأسبوع" delta="من جدول الحلقات" />
        <Stat value={`${totals.avgProgress || 0}%`} label="متوسط التقدم" delta="مستوى الطلاب" />
      </div>

      <div className="teacher-home-grid mt-24">
        <div className="card">
          <div className="spread">
            <h3 className="f-18">أحدث نشاط الطلاب</h3>
            <button type="button" className="btn ghost sm" onClick={() => setTab("students")}>عرض الكل</button>
          </div>
          {students.length ? (
            <div className="teacher-student-list mt-16">
              {students.slice(0, 5).map((student) => (
                <div key={student.id} className="teacher-student-row">
                  <Avatar name={student.name} color={student.color || "var(--grad-1)"} size={34} />
                  <div className="teacher-student-main">
                    <div className="bold f-14">{student.name}</div>
                    <div className="muted f-12">{student.level || "مستوى غير محدد"}</div>
                  </div>
                  <div className="teacher-progress-cell">
                    <ProgressBar value={student.progress || 0} />
                    <span className="f-12 bold">{student.progress || 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : <EmptyState title="لا يوجد طلاب مسندون بعد" body="افتح تبويب الطلاب واختر الطلاب المتاحين لإسنادهم إليك." />}
        </div>

        <div className="card">
          <div className="spread">
            <h3 className="f-18">جلسات قادمة</h3>
            <button type="button" className="btn ghost sm" onClick={() => setTab("sessions")}>إدارة</button>
          </div>
          <div className="teacher-session-list mt-16">
            {sessions.length ? sessions.slice(0, 4).map((session) => (
              <div key={session.id} className="teacher-session-mini">
                <div className="bold f-14">{session.title}</div>
                <div className="muted f-12 mt-8">{session.date || session.dateLabel || "-"} · {session.time || session.timeLabel || "-"}</div>
                <div className="spread mt-8">
                  <span className="chip primary">{session.joined || 0}/{session.total || session.totalSeats || 0} طالب</span>
                  <button type="button" className="btn ghost sm" onClick={() => setTab("sessions")}>فتح</button>
                </div>
              </div>
            )) : <EmptyState title="لا توجد جلسات" body="أنشئ حلقة من تبويب الحلقات." />}
          </div>
        </div>
      </div>

      <div className="card mt-24">
        <div className="spread">
          <h3 className="f-18">المواد المرفوعة حديثًا</h3>
          <button type="button" className="btn ghost sm" onClick={() => setTab("materials")}>إدارة المواد</button>
        </div>
        <div className="teacher-material-list mt-16">
          {materials.length ? materials.slice(0, 5).map((material) => (
            <div key={material.id} className="teacher-material-row">
              <span><Icon name="file" size={18} /></span>
              <div>
                <div className="bold f-14">{material.title || material.name}</div>
                <div className="muted f-12">{material.category || material.type || "ملف"}</div>
              </div>
            </div>
          )) : <EmptyState title="لا توجد مواد" body="ارفع الملفات من تبويب المواد." />}
        </div>
      </div>
    </div>
  );
}

function StudentAssignmentPanel({ students, availableStudents, onChanged }) {
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const assign = async (student) => {
    setBusyId(student.id);
    setError("");
    try {
      await api.teacher.assignStudent(student.id);
      await onChanged?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  };

  const unassign = async (student) => {
    setBusyId(student.id);
    setError("");
    try {
      await api.teacher.unassignStudent(student.id);
      await onChanged?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  };

  return (
    <div>
      <ErrorBanner error={error} />
      <StudentAssignmentTable
        title="طلابي"
        emptyTitle="لا يوجد طلاب مسندون إليك"
        emptyBody="اختر طالبًا من قائمة الطلاب المتاحين بالأسفل."
        students={students}
        action={(student) => (
          <button type="button" className="btn ghost sm" onClick={() => unassign(student)} disabled={busyId === student.id}>
            {busyId === student.id ? "جارٍ..." : "إلغاء الإسناد"}
          </button>
        )}
      />
      <div className="mt-24">
        <StudentAssignmentTable
          title="طلاب متاحون للإسناد"
          emptyTitle="لا يوجد طلاب متاحون"
          emptyBody="الطلاب غير المسندين إلى أي معلم سيظهرون هنا."
          students={availableStudents}
          action={(student) => (
            <button type="button" className="btn primary sm" onClick={() => assign(student)} disabled={busyId === student.id}>
              {busyId === student.id ? "جارٍ..." : "إسناد إليّ"}
            </button>
          )}
        />
      </div>
    </div>
  );
}

function StudentAssignmentTable({ title, emptyTitle, emptyBody, students, action }) {
  const availableLayer = title.includes("متاح");
  return (
    <div className="card flat" style={{ padding: 0, overflow: "visible", position: "relative", zIndex: availableLayer ? 2 : 1 }}>
      <div className="spread" style={{ padding: "18px 18px 0" }}>
        <h2 className="f-20">{title}</h2>
        <span className="chip primary">{students.length}</span>
      </div>
      {students.length ? (
        <div className="col" style={{ padding: 18 }}>
          {students.map((student) => (
            <div key={student.id} style={{ display: "grid", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
                <Avatar name={student.name} color={student.color || "var(--grad-1)"} size={34} />
                <div>
                  <div className="bold f-14">{student.name}</div>
                  <div className="muted f-12">{student.level || "مستوى غير محدد"} · العمر {student.age || "-"}</div>
                </div>
              </div>
              <div>
                <ProgressBar value={student.progress || 0} />
                <div className="muted f-12 mt-8">التقدم {student.progress || 0}% · النجوم {student.stars || 0}</div>
              </div>
              <div style={{ position: "relative", zIndex: 3 }}>{action(student)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: 30 }}>
          <h3 className="f-20">{emptyTitle}</h3>
          <p className="muted mt-8">{emptyBody}</p>
        </div>
      )}
    </div>
  );
}

function TeacherSessions({ initial, students }) {
  const [sessions, setSessions] = useState(initial || []);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", date: "", time: "", duration: "", group: "", total: 0, link: "" });
  const [error, setError] = useState("");

  const reset = () => {
    setEditing(null);
    setForm({ title: "", date: "", time: "", duration: "", group: "", total: 0, link: "" });
  };
  const edit = (session) => {
    setEditing(session);
    setForm({
      title: session.title || "",
      date: session.date || session.dateLabel || "",
      time: session.time || session.timeLabel || "",
      duration: session.duration || "",
      group: session.groupName || "",
      total: session.total || session.totalSeats || 0,
      link: session.link || session.meetingLink || ""
    });
  };
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const result = editing ? await api.teacher.updateSession(editing.id, form) : await api.teacher.createSession(form);
      setSessions((current) => editing ? current.map((item) => item.id === editing.id ? result.session : item) : [result.session, ...current]);
      reset();
    } catch (err) {
      setError(err.message);
    }
  };
  const remove = async (id) => {
    setError("");
    try {
      await api.teacher.deleteSession(id);
      setSessions((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <form className="card elev" onSubmit={submit}>
        <h2>{editing ? "تعديل حلقة" : "حلقة جديدة"}</h2>
        <ErrorBanner error={error} />
        <Field label="العنوان"><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></Field>
        <Field label="اليوم/التاريخ"><input value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} required /></Field>
        <Field label="الوقت"><input value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} required /></Field>
        <Field label="المدة"><input value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} required /></Field>
        <Field label="المجموعة"><input value={form.group} onChange={(event) => setForm({ ...form, group: event.target.value })} /></Field>
        <Field label="عدد الطلاب"><input type="number" value={form.total} onChange={(event) => setForm({ ...form, total: event.target.value })} /></Field>
        <Field label="رابط Zoom أو Meet"><input dir="ltr" value={form.link} onChange={(event) => setForm({ ...form, link: event.target.value })} /></Field>
        <button className="btn primary">{editing ? "حفظ التعديل" : "إنشاء الحلقة"}</button>
        {editing ? <button type="button" className="btn ghost" onClick={reset} style={{ marginInlineStart: 8 }}>إلغاء</button> : null}
      </form>
      <AttendanceBoard sessions={sessions} students={students || []} />
      <div className="mt-24"><SessionList sessions={sessions} onEdit={edit} onDelete={remove} /></div>
    </div>
  );
}

function AttendanceBoard({ sessions, students }) {
  const [sessionId, setSessionId] = useState(sessions[0]?.id || "");
  const [records, setRecords] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (!sessionId && sessions[0]?.id) setSessionId(sessions[0].id);
  }, [sessions, sessionId]);

  if (!sessions.length || !students.length) return null;

  const save = async () => {
    setError("");
    setMessage("");
    try {
      await api.teacher.saveAttendance({
        sessionId,
        dateLabel: new Date().toISOString().slice(0, 10),
        records: students.map((student) => ({ studentId: student.id, status: records[student.id] || "present" }))
      });
      setMessage("تم حفظ الحضور");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card mt-24">
      <div className="spread">
        <div>
          <h2>الحضور السريع</h2>
          <p className="muted mt-8">اختر حالة كل طالب للحلقة المحددة.</p>
        </div>
        <select value={sessionId} onChange={(event) => setSessionId(event.target.value)}>
          {sessions.map((session) => <option key={session.id} value={session.id}>{session.title}</option>)}
        </select>
      </div>
      <ErrorBanner error={error} />
      <div className="col mt-16">
        {students.map((student) => {
          const value = records[student.id] || "present";
          return (
            <div key={student.id} className="spread">
              <span className="bold">{student.name}</span>
              <span className="att-toggle">
                {["present", "late", "absent"].map((status) => (
                  <button type="button" key={status} className={value === status ? status : ""} onClick={() => setRecords({ ...records, [student.id]: status })}>
                    {status === "present" ? "حاضر" : status === "late" ? "متأخر" : "غائب"}
                  </button>
                ))}
              </span>
            </div>
          );
        })}
      </div>
      <button type="button" className="btn primary mt-16" onClick={save}>حفظ الحضور</button>
      {message ? <span className="chip success mt-8">{message}</span> : null}
    </div>
  );
}

function TeacherChat() {
  const [data, setData] = useState(null);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const threadId = active?.thread?.id;

  useEffect(() => {
    api.teacher.threads().then(setData).catch((err) => setError(err.message));
  }, []);
  useEffect(() => {
    const socket = getSocket();
    const onMessage = (payload) => {
      if (!threadId || payload.threadId !== threadId) return;
      setMessages((current) => [...current.filter((message) => message.id !== payload.message.id), payload.message]);
    };
    socket?.on("message:new", onMessage);
    return () => socket?.off("message:new", onMessage);
  }, [threadId]);

  const open = async (student) => {
    setError("");
    try {
      const result = await api.teacher.thread(student.id);
      setActive({ student, thread: result.thread });
      setMessages(result.messages || []);
    } catch (err) {
      setError(err.message);
    }
  };
  const send = async () => {
    if (!text.trim() || !active?.student) return;
    setError("");
    try {
      const result = await api.teacher.sendMessage(active.student.id, text.trim());
      setMessages((current) => [...current, result.message]);
      setText("");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!data && !error) return <Loading />;
  return (
    <div className="teacher-chat-grid">
      <div className="card">
        <h3>الطلاب</h3>
        <ErrorBanner error={error} />
        {(data?.students || []).length ? data.students.map((student) => (
          <button type="button" key={student.id} className="side-link" onClick={() => open(student)}>
            <span className="ico">{student.name?.[0]}</span>
            <span>{student.name}</span>
          </button>
        )) : (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <h3 className="f-16">لا يوجد طلاب مسندون</h3>
            <p className="muted f-13 mt-8">أسند الطلاب إليك أولًا من تبويب الطلاب.</p>
          </div>
        )}
      </div>
      {active ? <ChatWindow title={active.student.name} messages={messages} text={text} setText={setText} send={send} error={error} /> : <EmptyState title="اختر طالبًا" body="اختر طالبًا من القائمة لفتح المحادثة." />}
    </div>
  );
}

function MaterialUpload({ materials, onUploaded }) {
  const [files, setFiles] = useState([]);
  const [over, setOver] = useState(false);
  const [error, setError] = useState("");
  const pickFiles = (fileList) => setFiles(Array.from(fileList || []));
  const drop = (event) => {
    event.preventDefault();
    setOver(false);
    pickFiles(event.dataTransfer.files);
  };
  const upload = async (event) => {
    event.preventDefault();
    if (!files.length) return;
    const form = new FormData();
    files.forEach((file) => form.append("files", file));
    try {
      await api.teacher.uploadMaterials(form);
      setFiles([]);
      onUploaded?.();
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div>
      <form className="card elev" onSubmit={upload}>
        <h2>رفع المواد</h2>
        <ErrorBanner error={error} />
        <label
          className={`upload-zone ${over ? "over" : ""}`}
          onDragOver={(event) => { event.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={drop}
        >
          <input type="file" multiple onChange={(event) => pickFiles(event.target.files)} />
          <span className="upload-icon"><Icon name="upload" size={30} /></span>
          <strong>اسحب الملفات هنا أو اخترها من الجهاز</strong>
          <small>{files.length ? `${files.length} ملف جاهز للرفع` : "PDF، صور، أو ملفات تدريب"}</small>
        </label>
        {files.length ? (
          <div className="upload-list mt-16">
            {files.map((file) => (
              <span key={`${file.name}-${file.size}`} className="chip">{file.name}</span>
            ))}
          </div>
        ) : null}
        <button className="btn primary mt-16" disabled={!files.length}>رفع</button>
      </form>
      <div className="col mt-24">
        {materials?.length ? materials.map((material) => (
          <div key={material.id} className="card flat">
            <div className="bold">{material.title}</div>
            <div className="muted f-13">{material.category || "ملف"}</div>
          </div>
        )) : <EmptyState title="لا توجد مواد" />}
      </div>
    </div>
  );
}
