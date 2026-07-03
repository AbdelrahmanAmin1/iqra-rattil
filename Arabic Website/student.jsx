// =====================================================
// student.jsx — Student dashboard (lessons + quizzes + zoom + badges)
// =====================================================

function StudentDashboard({ onSignOut, onHome, tweaks, setTweak }) {
  const [tab, setTab] = useState("home");
  const user = { name: "محمد ياسر", role: "طالب — المستوى الأول", avatar: "م", color: "var(--grad-1)", stars: 124, streak: 7 };

  return (
    <div className="app-shell">
      <DashTopBar role="student" user={user} onSignOut={onSignOut} onHome={onHome} />
      <div className="container dashboard">
        <StudentSidebar tab={tab} setTab={setTab} user={user} />
        <main>
          {tab === "home"      && <StudentHome user={user} setTab={setTab} />}
          {tab === "path"      && <StudentPath setTab={setTab} />}
          {tab === "lesson"    && <StudentLesson setTab={setTab} />}
          {tab === "quiz"      && <StudentQuiz setTab={setTab} />}
          {tab === "zoom"      && <StudentZoom />}
          {tab === "badges"    && <StudentBadges />}
          {tab === "books"     && <StudentBooks />}
          {tab === "profile"   && <ProfilePage role="student" user={user} tweaks={tweaks} setTweak={setTweak} />}
        </main>
      </div>
      {tweaks.showCompanion && <Companion message="مرحبًا يا بطل! اليوم درسنا (المد بالألف) 🌟" />}
    </div>
  );
}

function StudentSidebar({ tab, setTab, user }) {
  const items = [
    { k: "home",    icon: "home",   label: "الرئيسية" },
    { k: "path",    icon: "map",    label: "خريطة الدروس" },
    { k: "lesson",  icon: "video",  label: "الدرس الحالي" },
    { k: "quiz",    icon: "quiz",   label: "الكويز" },
    { k: "zoom",    icon: "zoom",   label: "حلقات Zoom" },
    { k: "badges",  icon: "trophy", label: "إنجازاتي" },
    { k: "books",   icon: "book",   label: "الحقيبة" },
    { k: "profile", icon: "user",   label: "الملف الشخصي" },
  ];
  return (
    <aside className="sidebar">
      <div className="me" onClick={() => setTab("profile")} style={{ cursor: "pointer" }}>
        <Avatar name={user.name} color={user.color} size={44} />
        <div>
          <div className="name">{user.name}</div>
          <div className="role">{user.role}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button className="chip accent" style={{ flex: 1, justifyContent: "center", border: 0, cursor: "pointer", fontFamily: "inherit" }} onClick={() => setTab("badges")}>⭐ {user.stars}</button>
        <button className="chip primary" style={{ flex: 1, justifyContent: "center", border: 0, cursor: "pointer", fontFamily: "inherit" }} onClick={() => setTab("badges")}>🔥 {user.streak}</button>
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
function StudentHome({ user, setTab }) {
  const completed = LESSONS.filter(l => l.completed).length;
  const total = LESSONS.length;
  const current = LESSONS.find(l => l.current);
  const next = ZOOM_SESSIONS[0];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, marginBottom: 24 }}>
        {/* welcome hero */}
        <div className="card elev" style={{ background: "var(--grad-1)", color: "white", border: 0, padding: 30, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, fontSize: 140, opacity: 0.15 }}>🌟</div>
          <div className="chip" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>أهلاً بعودتك</div>
          <h1 style={{ color: "white", fontSize: 30, marginTop: 12 }}>مرحبًا، {user.name.split(" ")[0]}!</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", marginTop: 8, fontSize: 15 }}>
            استمرارك في التعلم رائع. اليوم درس جديد بانتظارك.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button className="btn" style={{ background: "white", color: "var(--primary)" }} onClick={() => setTab("lesson")}>
              <Icon name="play" size={16} color="var(--primary)" /> ابدأ الدرس
            </button>
            <button className="btn" style={{ background: "rgba(255,255,255,0.15)", color: "white" }} onClick={() => setTab("path")}>الخريطة الكاملة</button>
          </div>
        </div>

        {/* progress card */}
        <div className="card elev">
          <div className="spread">
            <h3 style={{ fontSize: 18 }}>تقدمك في المستوى الأول</h3>
            <span className="chip primary">{Math.round(completed/total*100)}%</span>
          </div>
          <ProgressBar value={completed/total*100} />
          <div className="muted f-13 mt-8">{completed} من {total} دروس مكتملة</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 18 }}>
            <Mini v={user.stars} l="نجوم" c="var(--accent)" onClick={() => setTab("badges")} />
            <Mini v="3" l="شارات" c="var(--accent-2)" onClick={() => setTab("badges")} />
            <Mini v={user.streak} l="أيام متتالية" c="var(--primary)" onClick={() => setTab("badges")} />
          </div>
        </div>
      </div>

      {/* current lesson preview + next zoom */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, marginBottom: 24 }}>
        <div className="card">
          <div className="spread">
            <span className="chip success">الدرس الحالي</span>
            <span className="muted f-13">{current.chapter}</span>
          </div>
          <h3 style={{ marginTop: 10, fontSize: 22 }}>{current.title}</h3>
          <p className="mt-8">{current.description}</p>
          <div className="video-thumb mt-16" style={{ borderRadius: 18, background: "linear-gradient(135deg,#1f1a3d,#6c63ff)", aspectRatio: "16/8" }}>
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 56, color: "white" }}>🎬</div>
                <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 4 }}>اضغط لمشاهدة الفيديو</div>
              </div>
            </div>
          </div>
          <div className="spread mt-16">
            <span className="muted f-13">المدة: {current.duration}</span>
            <button className="btn primary" onClick={() => setTab("lesson")}>افتح الدرس</button>
          </div>
        </div>

        <div className="card" style={{ background: "var(--grad-2)", color: "white", border: 0 }}>
          <div className="chip" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>الحلقة القادمة</div>
          <h3 style={{ marginTop: 10, fontSize: 20, color: "white" }}>{next.title}</h3>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
            <Row icon="calendar" txt={`${next.date} · ${next.time}`} />
            <Row icon="user" txt={next.teacher} />
            <Row icon="users" txt={`${next.joined}/${next.total} طلاب مسجلين`} />
          </div>
          <button className="btn mt-16" style={{ background: "white", color: "var(--primary)", width: "100%" }} onClick={() => setTab("zoom")}>
            <Icon name="zoom" size={18} color="var(--primary)" /> انضم للحلقة
          </button>
        </div>
      </div>

      {/* mini badge row */}
      <div className="card">
        <div className="spread">
          <h3 style={{ fontSize: 18 }}>آخر شاراتك</h3>
          <button className="btn ghost sm" onClick={() => setTab("badges")}>الكل ←</button>
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 16, overflowX: "auto", paddingBottom: 4 }}>
          {BADGES.map(b => (
            <button key={b.id} type="button" onClick={() => setTab("badges")} style={{
              textAlign: "center", minWidth: 90, background: "transparent", border: 0,
              cursor: "pointer", fontFamily: "inherit", padding: 0,
            }}>
              <div className={cls("badge-pill", !b.unlocked && "locked")}>{b.icon}</div>
              <div className="bold f-13" style={{ marginTop: 8 }}>{b.title}</div>
              <div className="muted f-12">{b.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ icon, txt }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <Icon name={icon} size={16} color="rgba(255,255,255,0.85)" />
      <span style={{ color: "rgba(255,255,255,0.92)" }}>{txt}</span>
    </div>
  );
}

function Mini({ v, l, c, onClick }) {
  const baseStyle = { padding: 14, background: "var(--bg-soft)", borderRadius: "var(--r-md)", textAlign: "center" };
  if (onClick) {
    return (
      <button type="button" onClick={onClick} style={{ ...baseStyle, border: 0, cursor: "pointer", fontFamily: "inherit", transition: "transform 0.15s" }}
        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
        <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)", color: c }}>{v}</div>
        <div className="muted f-12">{l}</div>
      </button>
    );
  }
  return (
    <div style={baseStyle}>
      <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)", color: c }}>{v}</div>
      <div className="muted f-12">{l}</div>
    </div>
  );
}

// ---------- PATH (progress map) ----------
function StudentPath({ setTab }) {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>خريطة دروسك</h1>
          <p>كل دائرة درس — أكمل الدرس وحلّ الكويز لفتح التالي 🌟</p>
        </div>
        <div className="chip primary">المستوى الأول · باب الحركات</div>
      </div>

      <div className="card" style={{ padding: 30, position: "relative", overflow: "hidden" }}>
        <div className="blob" style={{ width: 220, height: 220, background: "var(--accent)", top: -80, right: -60 }} />
        <PathMap setTab={setTab} />
      </div>
    </div>
  );
}

function PathMap({ setTab }) {
  // Render lessons as nodes along a winding path
  return (
    <div style={{ position: "relative", padding: "10px 20px" }}>
      <svg viewBox="0 0 800 760" style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          <linearGradient id="pathGrad2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff7a45" />
            <stop offset="100%" stopColor="#6c63ff" />
          </linearGradient>
        </defs>
        {/* curvy path */}
        <path d="M100 60 C 250 60, 250 180, 400 180 S 550 300, 700 300 S 550 420, 400 420 S 250 540, 100 540 S 250 680, 400 680 S 700 760, 700 760"
              stroke="url(#pathGrad2)" strokeWidth="6" fill="none" strokeDasharray="2 12" strokeLinecap="round" />
        {LESSONS.map((l, i) => {
          const positions = [
            [100, 60], [400, 180], [700, 300], [400, 420], [100, 540], [400, 680], [700, 760], [550, 780],
          ];
          const [x, y] = positions[i] || [100, 100];
          const state = l.completed ? "done" : l.current ? "current" : "locked";
          const fill = state === "done" ? "#2bb673" : state === "current" ? "#ff7a45" : "#cfc8e0";
          return (
            <g key={l.id} style={{ cursor: state !== "locked" ? "pointer" : "default" }}
               onClick={() => state !== "locked" && setTab("lesson")}>
              <circle cx={x} cy={y} r="34" fill="white" stroke={fill} strokeWidth="4" />
              <circle cx={x} cy={y} r="26" fill={fill} />
              <text x={x} y={y + 7} textAnchor="middle" fill="white" fontWeight="800" fontSize="22" fontFamily="var(--font-display)">
                {state === "done" ? "✓" : state === "current" ? "▶" : "🔒"}
              </text>
              <text x={x} y={y + 64} textAnchor="middle" fill="var(--ink)" fontWeight="700" fontSize="15">{l.title}</text>
              {state !== "locked" ? (
                <g>
                  {[0,1,2].map(s => (
                    <text key={s} x={x - 18 + s * 18} y={y + 84} textAnchor="middle" fontSize="14" fill={s < l.starsEarned ? "#ffc847" : "#e6e3f0"}>★</text>
                  ))}
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ---------- LESSON page ----------
function StudentLesson({ setTab }) {
  const lesson = LESSONS.find(l => l.current);
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{lesson.title}</h1>
          <p>{lesson.chapter} · {lesson.duration}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn ghost sm" onClick={() => setTab("path")}>← الخريطة</button>
          <button className="btn primary sm" onClick={() => setTab("quiz")}>تخطّى للكويز ←</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18 }}>
        <div className="card">
          {/* Embedded YouTube iframe — using a real Arabic educational video as placeholder */}
          <div style={{ aspectRatio: "16/9", borderRadius: 16, overflow: "hidden", background: "var(--ink)" }}>
            <iframe
              width="100%" height="100%"
              src={`https://www.youtube.com/embed/${lesson.youtubeId}?rel=0`}
              title={lesson.title}
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ display: "block" }}
            />
          </div>
          <div className="spread mt-16">
            <div>
              <div className="bold f-18">{lesson.title}</div>
              <div className="muted f-13">{lesson.description}</div>
            </div>
            <span className="chip success">ضع كاملاً</span>
          </div>
          <div className="mt-16" style={{ background: "var(--bg-soft)", padding: 16, borderRadius: 14 }}>
            <div className="bold f-14">💡 نصيحة المعلم</div>
            <p className="f-14 mt-8">ركّز على زمن المد بحرف الألف — حركتان فقط، لا أقل ولا أكثر. كرّر النطق ثلاث مرات بصوت مرتفع.</p>
          </div>
          <button className="btn primary lg mt-16" style={{ width: "100%" }} onClick={() => setTab("quiz")}>
            أنهيت الفيديو — هيا نحلّ الكويز
          </button>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 18 }}>دروس الباب</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
            {LESSONS.filter(l => l.chapter === lesson.chapter || true).map(l => (
              <div key={l.id} style={{
                display: "flex", gap: 12, alignItems: "center",
                padding: 10, borderRadius: 12,
                background: l.current ? "var(--bg-soft)" : "transparent",
                border: l.current ? "1.5px solid var(--primary)" : "1px solid var(--line)",
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: l.completed ? "var(--secondary)" : l.current ? "var(--primary)" : "var(--bg-alt)", color: "white", display: "grid", placeItems: "center", flexShrink: 0, fontWeight: 700 }}>
                  {l.completed ? "✓" : l.locked ? "🔒" : l.idx}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="bold f-14" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</div>
                  <div className="muted f-12">{l.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- QUIZ page ----------
function StudentQuiz({ setTab }) {
  const lessonId = LESSONS.find(l => l.current).id;
  const quiz = QUIZZES[lessonId] || QUIZZES.L05;
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const q = quiz.questions[idx];
  const answered = answers[idx] !== undefined;

  const choose = (val) => {
    if (answered) return;
    setAnswers(a => ({ ...a, [idx]: val }));
  };

  const next = () => {
    if (idx < quiz.questions.length - 1) setIdx(i => i + 1);
    else setShowResult(true);
  };

  if (showResult) {
    const correct = quiz.questions.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0);
    const total = quiz.questions.length;
    const pct = Math.round(correct / total * 100);
    const passed = pct >= 70;
    return (
      <div className="card elev" style={{ textAlign: "center", padding: 40, maxWidth: 600, margin: "30px auto" }}>
        <div className="anim-pop" style={{ fontSize: 84 }}>{passed ? "🌟" : "💪"}</div>
        <h2 style={{ fontSize: 32, marginTop: 10 }}>{passed ? "أحسنت يا بطل!" : "محاولة طيبة!"}</h2>
        <p className="mt-8">حصلت على {correct} من {total} ({pct}%)</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 14 }}>
          <Stars count={passed ? 3 : 1} size={28} />
        </div>
        <p className="muted mt-16">{passed ? "تم فتح الدرس التالي 🎉" : "أعد المحاولة لإكمال الدرس وفتح الدرس التالي"}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24 }}>
          <button className="btn ghost" onClick={() => { setIdx(0); setAnswers({}); setShowResult(false); }}>أعد الكويز</button>
          <button className="btn primary" onClick={() => setTab("path")}>{passed ? "ادخل للدرس التالي" : "عُد للخريطة"}</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{quiz.title}</h1>
          <p>السؤال {idx + 1} من {quiz.questions.length}</p>
        </div>
        <div className="chip primary">الكويز</div>
      </div>

      <ProgressBar value={(idx) / quiz.questions.length * 100} />

      <div className="card mt-24" style={{ padding: 30 }}>
        <h2 style={{ fontSize: 24, lineHeight: 1.3 }}>{q.prompt}</h2>

        {q.type === "mcq" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 24 }}>
            {q.options.map((opt, i) => {
              let cls_ = "quiz-opt";
              if (answered) {
                if (i === q.answer) cls_ += " correct";
                else if (answers[idx] === i) cls_ += " wrong";
              } else if (answers[idx] === i) cls_ += " selected";
              return (
                <div key={i} className={cls_} onClick={() => choose(i)}>
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: "var(--bg-soft)", display: "grid", placeItems: "center", fontSize: 14 }}>{["أ","ب","ج","د"][i]}</span>
                  <span style={{ flex: 1 }}>{opt}</span>
                  {answered && i === q.answer ? <span style={{ color: "var(--secondary)" }}>✓</span> : null}
                  {answered && answers[idx] === i && i !== q.answer ? <span style={{ color: "var(--danger)" }}>✗</span> : null}
                </div>
              );
            })}
          </div>
        ) : (
          <DragQuestion q={q} answered={answered} answer={answers[idx]} onAnswer={choose} />
        )}

        {answered ? (
          <div className="mt-24" style={{ padding: 16, borderRadius: 14, background: answers[idx] === q.answer ? "color-mix(in oklab, var(--secondary) 12%, var(--surface))" : "color-mix(in oklab, var(--danger) 12%, var(--surface))" }}>
            <div className="bold f-15">{answers[idx] === q.answer ? "✓ إجابة صحيحة!" : "✗ الإجابة الصحيحة: " + q.options[q.answer]}</div>
          </div>
        ) : null}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
          <button className="btn ghost" onClick={() => setTab("lesson")}>← عد للفيديو</button>
          <button className="btn primary" disabled={!answered} onClick={next}>
            {idx === quiz.questions.length - 1 ? "إنهاء الكويز" : "السؤال التالي ←"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DragQuestion({ q, answered, answer, onAnswer }) {
  const [over, setOver] = useState(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setOver(false);
    const val = parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (!isNaN(val)) onAnswer(val);
  };
  const dropped = answer !== undefined ? q.options[answer] : null;
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 30, padding: 24, background: "var(--bg-soft)", borderRadius: 18 }}>
        <div className="arabic-tile" style={{ width: 100, height: 100, fontSize: 56 }}>ب</div>
        <div onDragOver={e => { e.preventDefault(); setOver(true); }}
             onDragLeave={() => setOver(false)}
             onDrop={handleDrop}
             className={cls("drop-slot", over && "over", dropped && "filled")}
             style={{ width: 100, height: 100 }}>
          {dropped ? <div className="arabic-tile" style={{ width: "100%", height: "100%", fontSize: 56, border: 0 }}>{dropped}</div> : "ضع هنا"}
        </div>
      </div>
      <div className="muted f-13 mt-8" style={{ textAlign: "center" }}>اسحب الحركة أو الحرف الصحيح إلى المكان الفارغ</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20 }}>
        {q.options.map((opt, i) => {
          const placed = answered && i === answer;
          return (
            <div key={i}
                 draggable={!answered}
                 onDragStart={e => e.dataTransfer.setData("text/plain", String(i))}
                 className="arabic-tile"
                 style={{
                   width: 80, height: 80, fontSize: 44,
                   cursor: answered ? "default" : "grab",
                   opacity: placed ? 0.5 : 1,
                   background: answered && i === q.answer ? "color-mix(in oklab, var(--secondary) 16%, var(--surface))" : "var(--surface)",
                   borderColor: answered && i === q.answer ? "var(--secondary)" : "var(--line)",
                 }}>{opt}</div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- ZOOM page ----------
function StudentZoom() {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>حلقات Zoom</h1>
          <p>الحلقات الأسبوعية مع المعلم — للبنين والبنات بشكل منفصل</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
        {ZOOM_SESSIONS.map((s, i) => (
          <div key={s.id} className="card" style={{ position: "relative", overflow: "hidden" }}>
            {i === 0 && <div style={{ position: "absolute", top: 14, left: 14, background: "var(--secondary)", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999 }}>قريبًا</div>}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: "var(--grad-2)", color: "white", display: "grid", placeItems: "center" }}>
                <Icon name="zoom" size={24} color="white" />
              </div>
              <span className="muted f-13">{s.duration}</span>
            </div>
            <h3 style={{ fontSize: 17, lineHeight: 1.35 }}>{s.title}</h3>
            <div className="muted f-13 mt-8">مع {s.teacher}</div>
            <div className="spread mt-16">
              <div className="chip primary">{s.date} · {s.time}</div>
              <span className="muted f-13">{s.joined}/{s.total}</span>
            </div>
            <a href={s.link} target="_blank" className="btn primary mt-16" style={{ width: "100%", justifyContent: "center" }}>
              <Icon name="zoom" size={16} color="white" /> انضم الآن
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- BADGES page ----------
function StudentBadges() {
  const [modal, setModal] = useState(null);
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>إنجازاتك</h1>
          <p>الشارات والنجوم التي حصلت عليها</p>
        </div>
        <span className="chip accent">⭐ 124 نجمة</span>
      </div>

      {/* gamification quick-stats — clickable */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 20 }}>
        <ClickStat icon="⭐" v="124" l="نجوم مجمَّعة" c="var(--accent)"   onClick={() => setModal({ kind: "stars" })} />
        <ClickStat icon="🔥" v="7"   l="أيام متتالية" c="var(--primary)"  onClick={() => setModal({ kind: "streak" })} />
        <ClickStat icon="🏆" v={BADGES.filter(b => b.unlocked).length} l="شارات مفتوحة" c="var(--accent-2)" onClick={() => setModal({ kind: "rank" })} />
        <ClickStat icon="🎯" v="4/8" l="دروس مكتملة" c="var(--secondary)" onClick={() => setModal({ kind: "completion" })} />
      </div>

      <div className="card">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, padding: 10 }}>
          {BADGES.map(b => (
            <button key={b.id} type="button" onClick={() => setModal({ kind: "badge", badge: b })}
                    className="anim-pop"
                    style={{
                      textAlign: "center", padding: 16, borderRadius: 16,
                      background: b.unlocked ? "var(--bg-soft)" : "transparent",
                      border: b.unlocked ? "1.5px solid transparent" : "1.5px dashed var(--line)",
                      cursor: "pointer", fontFamily: "inherit",
                      transition: "transform 0.15s, border-color 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = "var(--primary)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = b.unlocked ? "transparent" : "var(--line)"; }}>
              <div className={cls("badge-pill", !b.unlocked && "locked")} style={{ margin: "0 auto", width: 80, height: 80, fontSize: 36 }}>{b.icon}</div>
              <div className="bold f-15" style={{ marginTop: 12 }}>{b.title}</div>
              <div className="muted f-13" style={{ marginTop: 4 }}>{b.desc}</div>
              {b.unlocked ? <div className="chip success" style={{ marginTop: 10 }}>تم الفتح</div> : <div className="chip" style={{ marginTop: 10 }}>مقفل</div>}
            </button>
          ))}
        </div>
      </div>

      <BadgeModal modal={modal} onClose={() => setModal(null)} />
    </div>
  );
}

function ClickStat({ icon, v, l, c, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{
      display: "flex", gap: 14, alignItems: "center",
      padding: 16, borderRadius: 16,
      background: "var(--surface)", border: "1px solid var(--line)",
      cursor: "pointer", fontFamily: "inherit", textAlign: "start",
      transition: "transform 0.15s, box-shadow 0.15s",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
      <div style={{ width: 50, height: 50, borderRadius: 14, background: `color-mix(in oklab, ${c} 20%, transparent)`, color: c, display: "grid", placeItems: "center", fontSize: 24 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-display)", color: c }}>{v}</div>
        <div className="muted f-13">{l}</div>
      </div>
    </button>
  );
}

function BadgeModal({ modal, onClose }) {
  if (!modal) return null;
  const content = modal.kind === "badge" ? (
    <div style={{ textAlign: "center" }}>
      <div className={cls("badge-pill", !modal.badge.unlocked && "locked")} style={{ width: 110, height: 110, fontSize: 50, margin: "0 auto" }}>{modal.badge.icon}</div>
      <h2 style={{ fontSize: 24, marginTop: 14 }}>{modal.badge.title}</h2>
      <p className="muted mt-8">{modal.badge.desc}</p>
      {modal.badge.unlocked ? (
        <>
          <div className="chip success" style={{ marginTop: 14 }}>✓ مفتوح</div>
          <p className="muted f-13 mt-16">حصلت عليها بمجهودك في الدروس السابقة. واصل العمل لفتح المزيد!</p>
        </>
      ) : (
        <>
          <div className="chip" style={{ marginTop: 14 }}>🔒 مقفل</div>
          <p className="muted f-13 mt-16">أكمل المزيد من الدروس والكويزات لفتح هذه الشارة.</p>
        </>
      )}
    </div>
  ) : modal.kind === "stars" ? (
    <div>
      <h3 style={{ fontSize: 22 }}>كيف تحصل على النجوم؟ ⭐</h3>
      <p className="muted mt-8">احصل على نجوم بإتقان دروسك وكويزاتك.</p>
      <div className="mt-16" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Rule s={3} t="100% في الكويز — 3 نجوم" />
        <Rule s={2} t="80% فأكثر — نجمتان" />
        <Rule s={1} t="إكمال الفيديو — نجمة" />
        <Rule s={3} t="حضور حلقة Zoom — 3 نجوم إضافية" />
      </div>
    </div>
  ) : modal.kind === "streak" ? (
    <div>
      <h3 style={{ fontSize: 22 }}>سلسلة المواظبة 🔥</h3>
      <p className="muted mt-8">أنت الآن في يومك السابع المتتالي! استمر لتفتح شارة "نار المواظبة 🔥🔥".</p>
      <div style={{ display: "flex", gap: 6, marginTop: 18, flexWrap: "wrap" }}>
        {["س","ح","ن","ث","ر","خ","ج"].map((d, i) => (
          <div key={i} style={{
            width: 50, textAlign: "center", padding: 10, borderRadius: 12,
            background: i < 5 ? "var(--primary)" : i === 5 ? "var(--accent)" : "var(--bg-alt)",
            color: i < 5 ? "white" : i === 5 ? "var(--ink)" : "var(--muted)", fontWeight: 700,
          }}>
            <div style={{ fontSize: 20 }}>{i < 5 ? "🔥" : i === 5 ? "★" : "○"}</div>
            <div className="f-12 mt-8">{d}</div>
          </div>
        ))}
      </div>
    </div>
  ) : modal.kind === "rank" ? (
    <div>
      <h3 style={{ fontSize: 22 }}>ترتيبك بين الطلاب 🏆</h3>
      <p className="muted mt-8">المركز <b style={{ color: "var(--primary)" }}>الثالث</b> من بين 14 طالبًا في حلقتك هذا الأسبوع.</p>
      <div className="mt-16" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[{n:"نور فتحي",s:198,r:1},{n:"خالد رضا",s:215,r:2},{n:"محمد ياسر (أنت)",s:124,r:3,you:true},{n:"زيد محمود",s:102,r:4}].map(r => (
          <div key={r.r} style={{ display: "flex", gap: 10, alignItems: "center", padding: 10, borderRadius: 10, background: r.you ? "color-mix(in oklab, var(--primary) 10%, var(--surface))" : "var(--bg-soft)", border: r.you ? "1.5px solid var(--primary)" : "1px solid transparent" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: r.r === 1 ? "var(--accent)" : "var(--surface)", display: "grid", placeItems: "center", fontWeight: 800 }}>{r.r}</div>
            <div className="bold f-14" style={{ flex: 1 }}>{r.n}</div>
            <span className="chip accent">⭐ {r.s}</span>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div>
      <h3 style={{ fontSize: 22 }}>تقدّمك في المنهج 🎯</h3>
      <p className="muted mt-8">أكملت <b>4 من 8</b> دروس في المستوى الأول.</p>
      <div className="mt-16"><ProgressBar value={50} /></div>
      <div className="mt-16" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {LESSONS.slice(0, 5).map(l => (
          <div key={l.id} className="spread" style={{ padding: 10, borderRadius: 10, background: "var(--bg-soft)" }}>
            <span className="bold f-14">{l.title}</span>
            <span className={`chip ${l.completed ? "success" : l.current ? "primary" : ""}`}>{l.completed ? "✓ مكتمل" : l.current ? "حالي" : "مقفل"}</span>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <Modal open={!!modal} onClose={onClose} title={modal.kind === "badge" ? "تفاصيل الشارة" : "تفاصيل الإنجاز"} width={500}>
      {content}
    </Modal>
  );
}

function Rule({ s, t }) {
  return (
    <div className="spread" style={{ padding: 10, borderRadius: 10, background: "var(--bg-soft)" }}>
      <span className="f-14">{t}</span>
      <Stars count={s} max={3} />
    </div>
  );
}

// ---------- BOOKS page (student view) ----------
function StudentBooks() {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>الحقيبة التعليمية</h1>
          <p>تصفّح الكتب المطلوبة لمنهجك</p>
        </div>
        <OrderButton />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18 }}>
        {BOOKS.map(b => (
          <div key={b.id} className="book-card">
            <div className="book-cover" style={{ background: b.color }}>{b.title}</div>
            <div className="bold f-15">{b.title}</div>
            <div className="muted f-13">{b.subtitle}</div>
            <div className="spread mt-16">
              <span className="bold txt-primary">{b.price} ر.س</span>
              {b.soon ? <span className="chip">قريبًا</span> : <span className="chip success">متوفر</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { StudentDashboard });
