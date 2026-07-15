import React, { useEffect, useMemo, useState } from "react";
import { api } from "./src/lib/api.js";
import { getSocket } from "./src/lib/realtime.js";
import ProfileForm from "./profile.jsx";
import { BADGES } from "./data.js";
import { BookGrid, ChatWindow, DashboardShell, EmptyState, ErrorBanner, Icon, Loading, ProgressBar, SessionList, Stat, Stars, youtubeUrl } from "./shared.jsx";

const tabs = ["home", "lessons", "sessions", "chat", "books", "badges", "profile"];
const labels = { home: "الرئيسية", lessons: "الدروس", sessions: "الحلقات", chat: "المحادثة", books: "الكتب", badges: "الشارات", profile: "الملف" };

export default function StudentDashboard({ session, homeResetKey }) {
  const [tab, setTab] = useState("home");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const load = () => api.student.dashboard().then(setData).catch((err) => setError(err.message));
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    const socket = getSocket();
    const refresh = () => void load();
    socket?.on("content:updated", refresh);
    return () => socket?.off("content:updated", refresh);
  }, []);
  useEffect(() => setTab("home"), [homeResetKey]);

  if (!data && !error) return <Loading />;

  return (
    <DashboardShell session={session} tab={tab} setTab={setTab} tabs={tabs} labels={labels}>
      <ErrorBanner error={error} />
      {tab === "home" && <StudentHome data={data} setTab={setTab} />}
      {tab === "lessons" && <LessonsView lessons={data?.lessons || []} />}
      {tab === "sessions" && <SessionList sessions={data?.sessions || []} />}
      {tab === "chat" && <StudentChat />}
      {tab === "books" && <BookGrid books={data?.books || []} />}
      {tab === "badges" && <BadgesView badges={data?.badges || []} />}
      {tab === "profile" && <ProfileForm role="student" session={session} profile={data?.profile} onSaved={load} />}
    </DashboardShell>
  );
}

function StudentHome({ data, setTab }) {
  const current = data?.currentLesson;
  const badges = data?.badges?.length ? data.badges : BADGES;
  const user = data?.user || {};
  const progress = data?.progress || { completed: 0, total: 0, percent: 0 };
  const next = data?.sessions?.[0];
  const firstName = (user.name || "يا بطل").split(" ")[0];
  return (
    <div>
      <div className="student-home-top">
        <div className="card elev student-welcome">
          <div className="student-welcome-star">★</div>
          <span className="chip student-chip">أهلًا بعودتك</span>
          <h1>مرحبًا، {firstName}!</h1>
          <p>استمرارك في التعلم رائع. افتح درسك الحالي أو راجع خريطة الدروس.</p>
          <div className="row mt-24">
            <button type="button" className="btn student-white" onClick={() => setTab("lessons")} disabled={!current}>
              <Icon name="play" size={16} color="var(--primary)" /> ابدأ الدرس
            </button>
            <button type="button" className="btn student-soft" onClick={() => setTab("lessons")}>الخريطة الكاملة</button>
          </div>
        </div>

        <div className="card elev">
          <div className="spread">
            <h3 className="f-18">تقدمك في المستوى</h3>
            <span className="chip primary">{progress.percent}%</span>
          </div>
          <div className="mt-16"><ProgressBar value={progress.percent} /></div>
          <div className="muted f-13 mt-8">{progress.completed} من {progress.total} دروس مكتملة</div>
          <div className="student-mini-grid mt-16">
            <StudentMini value={user.stars ?? 0} label="نجوم" color="var(--accent)" onClick={() => setTab("badges")} />
            <StudentMini value={badges.filter((badge) => badge.unlocked !== false).length} label="شارات" color="var(--accent-2)" onClick={() => setTab("badges")} />
            <StudentMini value={user.streak ?? 0} label="أيام متتالية" color="var(--primary)" onClick={() => setTab("badges")} />
          </div>
        </div>
      </div>

      <div className="student-home-top mt-24">
        <div className="card">
          <div className="spread">
            <span className="chip success">الدرس الحالي</span>
            <span className="muted f-13">{current?.chapter || "المسار"}</span>
          </div>
          <h3 className="mt-16 f-22">{current?.title || "لا يوجد درس حالي"}</h3>
          <p className="mt-8">{current?.description || "سيظهر الدرس الحالي عند إضافة المنهج من لوحة المشرف."}</p>
          <div className="student-video-preview mt-16">
            <div>
              <Icon name="video" size={42} color="white" />
              <span>{current?.youtubeId ? "اضغط من تبويب الدروس للمشاهدة" : "بانتظار رابط الفيديو"}</span>
            </div>
          </div>
          <div className="spread mt-16">
            <span className="muted f-13">{current?.duration ? `المدة: ${current.duration}` : "درس متدرج"}</span>
            <button type="button" className="btn primary" onClick={() => setTab("lessons")} disabled={!current}>افتح الدرس</button>
          </div>
        </div>

        <div className="card student-session-card">
          <span className="chip student-chip">الحلقة القادمة</span>
          <h3>{next?.title || "لا توجد حلقة مجدولة"}</h3>
          {next ? (
            <div className="student-session-rows">
              <StudentSessionRow icon="calendar" text={`${next.date || next.dateLabel || "-"} · ${next.time || next.timeLabel || "-"}`} />
              <StudentSessionRow icon="user" text={next.teacher || "المعلم"} />
              <StudentSessionRow icon="users" text={`${next.joined || 0}/${next.total || next.totalSeats || 0} طلاب مسجلين`} />
            </div>
          ) : (
            <p>عندما يضيف المعلم حلقة ستظهر هنا مباشرة.</p>
          )}
          <button type="button" className="btn student-white mt-16" onClick={() => setTab("sessions")} disabled={!next}>
            <Icon name="zoom" size={18} color="var(--primary)" /> عرض الحلقات
          </button>
        </div>
      </div>

      <div className="stat-grid mt-24">
        <Stat value={`${progress.percent}%`} label="نسبة التقدم" />
        <Stat value={user.stars ?? 0} label="النجوم" />
        <Stat value={data?.sessions?.length ?? 0} label="الحلقات" />
        <Stat value={data?.books?.length ?? 0} label="الكتب" />
      </div>

      <div className="card mt-24">
        <div className="spread">
          <h2>آخر شاراتك</h2>
          <button type="button" className="btn ghost sm" onClick={() => setTab("badges")}>الكل</button>
        </div>
        <div className="student-badge-row">
          {badges.slice(0, 6).map((badge) => (
            <button key={badge.id} type="button" className="student-badge-item" onClick={() => setTab("badges")}>
              <div className={`badge-pill ${badge.unlocked === false ? "locked" : ""}`}>{badge.icon}</div>
              <div className="f-12 bold mt-8">{badge.title}</div>
              <Stars count={badge.unlocked === false ? 0 : 3} size={13} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentMini({ value, label, color, onClick }) {
  return (
    <button type="button" className="student-mini" onClick={onClick}>
      <span style={{ color }}>{value}</span>
      <small>{label}</small>
    </button>
  );
}

function StudentSessionRow({ icon, text }) {
  return (
    <div>
      <Icon name={icon} size={16} color="rgba(255,255,255,0.85)" />
      <span>{text}</span>
    </div>
  );
}

function LessonsView({ lessons }) {
  const [selectedId, setSelectedId] = useState(lessons[0]?.id || "");
  const selected = useMemo(() => lessons.find((lesson) => lesson.id === selectedId) || lessons[0], [lessons, selectedId]);

  useEffect(() => {
    if (!selectedId && lessons[0]) setSelectedId(lessons[0].id);
  }, [lessons, selectedId]);

  if (!lessons.length) return <EmptyState title="لا توجد دروس" body="أضف الدروس وروابط يوتيوب من لوحة المشرف." />;

  return (
    <div className="progress-path">
      <div className="page-head">
        <div>
          <h1>مسار الدروس</h1>
          <p>تابع الدروس والكويزات كما في واجهة الطالب القديمة.</p>
        </div>
      </div>
      <StudentPathMap lessons={lessons} selectedId={selected?.id} onSelect={setSelectedId} />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 320px) 1fr", gap: 18 }}>
        <div className="card">
          {lessons.map((lesson) => (
            <button type="button" key={lesson.id} className={`side-link ${selected?.id === lesson.id ? "active" : ""}`} onClick={() => setSelectedId(lesson.id)} disabled={lesson.locked}>
              <span className="ico">{lesson.completed ? "✓" : lesson.locked ? "ق" : "د"}</span>
              <span>{lesson.title}</span>
            </button>
          ))}
        </div>
        <div className="card elev">
          <span className="chip primary">{selected?.chapter || "درس"}</span>
          <h2 className="mt-16">{selected?.title}</h2>
          <p className="mt-8">{selected?.description}</p>
          {selected?.youtubeId ? (
            <div className="video-card mt-24">
              <div className="video-thumb">
                <iframe title={selected.title} src={`https://www.youtube.com/embed/${selected.youtubeId}`} style={{ width: "100%", height: "100%", border: 0 }} allowFullScreen />
              </div>
            </div>
          ) : (
            <EmptyState title="لا يوجد رابط فيديو" body="أضف رابط يوتيوب الحقيقي من لوحة المشرف." />
          )}
          {selected?.quiz ? <QuizCard lesson={selected} /> : null}
          {selected?.youtubeId ? <a className="btn ghost mt-16" href={youtubeUrl(selected.youtubeId)} target="_blank" rel="noreferrer">فتح في يوتيوب</a> : null}
        </div>
      </div>
    </div>
  );
}

function StudentPathMap({ lessons, selectedId, onSelect }) {
  const visible = lessons.slice(0, 8);
  const positions = [
    [8, 62], [22, 34], [38, 58], [52, 30],
    [66, 54], [78, 28], [88, 50], [94, 24]
  ];
  if (!visible.length) return null;
  return (
    <div className="card elev lesson-path-map">
      <svg viewBox="0 0 100 78" preserveAspectRatio="none" aria-hidden="true">
        <path d="M8 62 C18 20 28 20 38 58 S56 24 66 54 S82 20 94 24" />
      </svg>
      {visible.map((lesson, index) => {
        const [x, y] = positions[index] || [50, 50];
        const done = lesson.completed;
        const current = selectedId === lesson.id || lesson.current;
        const locked = lesson.locked;
        return (
          <button
            type="button"
            key={lesson.id}
            className={`lesson-node ${done ? "done" : ""} ${current ? "current" : ""} ${locked ? "locked" : ""}`}
            style={{ insetInlineStart: `${x}%`, top: `${y}%` }}
            onClick={() => !locked && onSelect(lesson.id)}
            disabled={locked}
            title={lesson.title}
          >
            <span>{done ? <Icon name="check" size={18} /> : locked ? <Icon name="lock" size={17} /> : index + 1}</span>
            <small>{lesson.title}</small>
          </button>
        );
      })}
    </div>
  );
}

function QuizCard({ lesson }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    try {
      const response = await api.student.submitQuiz(lesson.id, answers);
      setResult(response);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card flat mt-24">
      <h3>{lesson.quiz.title}</h3>
      <ErrorBanner error={error} />
      {lesson.quiz.questions.map((question, index) => (
        <div key={index} className="mt-16">
          <div className="bold">{question.prompt}</div>
          {question.target ? (
            <div className={`drop-slot ${answers[index] !== undefined ? "filled" : ""} mt-8`} style={{ width: "100%", minHeight: 74 }}>
              {question.target}
            </div>
          ) : null}
          <div className="col mt-8">
            {(question.options || []).map((option, optionIndex) => {
              const answered = result && answers[index] === optionIndex;
              const correct = result && optionIndex === question.answer;
              const wrong = answered && optionIndex !== question.answer;
              return (
                <button type="button" key={option} className={`quiz-opt ${answers[index] === optionIndex ? "selected" : ""} ${correct ? "correct" : ""} ${wrong ? "wrong" : ""}`} onClick={() => setAnswers({ ...answers, [index]: optionIndex })}>
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <button type="button" className="btn primary mt-16" onClick={submit}>تسليم الكويز</button>
      {result ? <span className="chip success mt-16">النتيجة: {result.score}%</span> : null}
    </div>
  );
}

function StudentChat() {
  const [data, setData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const threadId = data?.thread?.id;

  useEffect(() => {
    api.student.messages().then((result) => {
      setData(result);
      setMessages(result.messages || []);
    }).catch((err) => setError(err.message));
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

  const send = async () => {
    if (!text.trim()) return;
    setError("");
    try {
      const result = await api.student.sendMessage(text.trim());
      setMessages((current) => [...current, result.message]);
      setText("");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!data && !error) return <Loading />;
  if (!data?.teacher) return <EmptyState title="لم يتم تعيين معلم بعد" body="عند تعيين معلم ستظهر المحادثة هنا." />;
  return <ChatWindow title={`المعلم: ${data.teacher.name}`} messages={messages} text={text} setText={setText} send={send} error={error} />;
}

function BadgesView({ badges }) {
  const items = badges.length ? badges : BADGES;
  return (
    <div className="card elev">
      <h1>الشارات والإنجازات</h1>
      <div className="row mt-24">
        {items.map((badge) => (
          <div key={badge.id} className="card flat" style={{ width: 170, textAlign: "center" }}>
            <div className={`badge-pill ${badge.unlocked === false ? "locked" : ""}`} style={{ marginInline: "auto" }}>{badge.icon}</div>
            <h3 className="f-16 mt-16">{badge.title}</h3>
            <p className="f-13">{badge.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
