// =====================================================
// landing.jsx — Public marketing landing page
// =====================================================

function LandingPage({ onPickRole, onLogin, onRegister }) {
  return (
    <>
      <LandingHero onPickRole={onPickRole} onLogin={onLogin} onRegister={onRegister} />
      <FeaturesStrip />
      <ProjectIntro />
      <CurriculumSection />
      <BooksSection />
      <ChannelSection />
      <RoleLoginSection onPickRole={onPickRole} onLogin={onLogin} onRegister={onRegister} />
      <ContactSection />
      <Footer />
    </>
  );
}

// ---------- HERO ----------
function LandingHero({ onPickRole, onLogin, onRegister }) {
  return (
    <section style={{ position: "relative", overflow: "hidden", padding: "60px 0 80px" }}>
      {/* blobs */}
      <div className="blob" style={{ width: 380, height: 380, background: "var(--primary)", top: -120, right: -100 }} />
      <div className="blob" style={{ width: 320, height: 320, background: "var(--accent-2)", bottom: -120, left: -80 }} />
      <div className="blob" style={{ width: 260, height: 260, background: "var(--accent)", top: 80, left: "30%" }} />

      <div className="container" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 50, alignItems: "center" }}>
        <div>
          <span className="chip primary anim-pop">قناة تعليمية لتأسيس اللغة العربية والقرآن</span>
          <h1 style={{ fontSize: "clamp(36px, 5.5vw, 64px)", lineHeight: 1.05, marginTop: 14 }}>
            تأسيس صحيح في{" "}
            <span style={{ background: "var(--grad-1)", WebkitBackgroundClip: "text", color: "transparent" }}>اللغة العربية</span>{" "}
            وحفظ متقن{" "}
            <span style={{ background: "var(--grad-2)", WebkitBackgroundClip: "text", color: "transparent" }}>للقرآن الكريم</span>
          </h1>
          <p style={{ fontSize: 18, marginTop: 20, maxWidth: 540 }}>
            منهجٌ يؤهّل الطالب الصغير للقراءة الصحيحة المتقنة بطريقة سهلة ومبسطة، يبدأ من
            الحروف المجردة ولا ينتهي إلا بحفظ القرآن الكريم. للأطفال والروضات والمبتدئين والأعاجم.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
            <button className="btn primary lg" onClick={() => onRegister ? onRegister() : onPickRole("student")}>ابدأ كطالب الآن</button>
            <button className="btn ghost lg" onClick={() => scrollToId("curriculum")}>تعرّف على المنهج</button>
          </div>

          <div style={{ display: "flex", gap: 28, marginTop: 36, alignItems: "center" }}>
            <Stat n="+20" l="عامًا خبرة" />
            <div style={{ width: 1, height: 36, background: "var(--line)" }} />
            <Stat n="7" l="أجزاء بالحقيبة" />
            <div style={{ width: 1, height: 36, background: "var(--line)" }} />
            <Stat n="3" l="دول معتمدة" sub="مصر · السعودية · الكويت" />
          </div>
        </div>

        {/* visual: stack of arabic letter cards floating + sample student card */}
        <HeroVisual />
      </div>
    </section>
  );
}

function Stat({ n, l, sub }) {
  return (
    <div>
      <div style={{ fontSize: 34, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--ink)" }}>{n}</div>
      <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>{l}</div>
      {sub ? <div style={{ fontSize: 11, color: "var(--muted)" }}>{sub}</div> : null}
    </div>
  );
}

function HeroVisual() {
  const letters = ["ا","ب","ت","ث","ج","ح","خ","د","ذ"];
  return (
    <div style={{ position: "relative", minHeight: 480 }}>
      {/* big tile */}
      <div style={{
        position: "absolute", inset: "10% 5% 20% 10%",
        background: "var(--surface)",
        borderRadius: 36,
        boxShadow: "var(--shadow-lg)",
        padding: 28,
        border: "1px solid var(--line)",
        display: "flex", flexDirection: "column", gap: 16,
      }} className="anim-float">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="chip primary">الدرس الحالي</span>
          <span className="muted f-13">المستوى الأول · باب الحركات</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {letters.map((L, i) => (
            <div key={i} className="arabic-tile" style={{
              width: "100%", height: 78, fontSize: 42,
              transform: `rotate(${(i % 2 ? -1 : 1) * (i + 1) * 0.6}deg)`,
              background: i === 4 ? "var(--grad-1)" : "var(--surface)",
              color: i === 4 ? "white" : "var(--ink)",
              borderColor: i === 4 ? "transparent" : "var(--line)",
            }}>{L}</div>
          ))}
        </div>
        <div className="spread" style={{ paddingTop: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Stars count={3} />
            <span className="f-13 muted">3/3 نجوم</span>
          </div>
          <button className="btn primary sm" onClick={() => scrollToId("curriculum")}>التالي</button>
        </div>
      </div>

      {/* floating badge */}
      <div className="anim-float" style={{
        position: "absolute", top: 30, left: 0,
        background: "var(--surface)", padding: 12, borderRadius: 18,
        boxShadow: "var(--shadow-md)", display: "flex", gap: 10, alignItems: "center",
        animationDelay: "-1s", border: "1px solid var(--line)",
      }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--grad-3)", display: "grid", placeItems: "center", fontSize: 22 }}>🏆</div>
        <div>
          <div className="bold f-14">شارة جديدة!</div>
          <div className="muted f-12">بطل الحروف</div>
        </div>
      </div>

      {/* zoom badge */}
      <div className="anim-float" style={{
        position: "absolute", bottom: 30, right: 0,
        background: "var(--surface)", padding: 12, borderRadius: 18,
        boxShadow: "var(--shadow-md)", display: "flex", gap: 10, alignItems: "center",
        animationDelay: "-2.5s", border: "1px solid var(--line)",
      }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--grad-2)", display: "grid", placeItems: "center", color: "white" }}>
          <Icon name="zoom" size={22} color="white" />
        </div>
        <div>
          <div className="bold f-14">حلقة اليوم</div>
          <div className="muted f-12">تبدأ خلال 12 دقيقة</div>
        </div>
      </div>

      {/* small companion */}
      <div style={{ position: "absolute", bottom: -10, left: 60 }} className="anim-wiggle">
        <Owl size={84} />
      </div>
    </div>
  );
}

// ---------- FEATURES STRIP ----------
function FeaturesStrip() {
  const features = [
    { icon: "book",   title: "قراءة وكتابة وإملاء", text: "تأسيس متقن للحروف، الحركات، التنوين، الشدة، والهمزات بمنهج مدروس." },
    { icon: "video",  title: "فيديوهات شرح",          text: "كل درس مرفق بفيديو شرح من قناة الكُتَّاب، يرجع إليه الطالب وقتما شاء." },
    { icon: "quiz",   title: "تقييم بعد كل درس",     text: "كويز قصير بعد كل فيديو لتأكيد الفهم قبل الانتقال للدرس التالي." },
    { icon: "users",  title: "حلقات أون لاين",        text: "ثلاث جلسات أسبوعيًا للبنين والبنات مع متابعة فردية من المعلم." },
  ];
  return (
    <section style={{ padding: "30px 0", background: "var(--bg-soft)" }}>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--surface)", display: "grid", placeItems: "center", color: "var(--primary)", flexShrink: 0, boxShadow: "var(--shadow-sm)" }}>
              <Icon name={f.icon} size={22} />
            </div>
            <div>
              <div className="bold f-15">{f.title}</div>
              <div className="muted f-13" style={{ marginTop: 2 }}>{f.text}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- PROJECT INTRO ----------
function ProjectIntro() {
  return (
    <section style={{ padding: "80px 0" }}>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <div>
          <span className="chip purple">مشروع الحافظ الصغير</span>
          <h2 style={{ fontSize: 42, marginTop: 12, lineHeight: 1.1 }}>
            من أوّل حرف… إلى حفظ القرآن الكريم
          </h2>
          <p style={{ marginTop: 16, fontSize: 16 }}>
            في الطريقة التقليدية يُلقَّن الطفل القرآنَ تلقينًا، فيحفظ سطرًا أو سطرين بعد جهدٍ كبير. أما بعد دراسة منهجنا — بتوفيق الله — فالطالب يتأهل ليقرأ من المصحف بنفسه، ثم يوضع له منهجٌ منضبط لحفظ القرآن الكريم، فلا يخرج من المرحلة الابتدائية إلا وقد حفظ القرآن الكريم كله أو أكثره.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 26 }}>
            <Bullet n="١" title="التأسيس في القراءة والكتابة والإملاء" />
            <Bullet n="٢" title="القراءة الصحيحة من المصحف الشريف" />
            <Bullet n="٣" title="حفظ القرآن بخطة زمنية مدروسة" />
          </div>
        </div>

        <PathDiagram />
      </div>
    </section>
  );
}

function Bullet({ n, title }) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg-soft)", color: "var(--primary)", display: "grid", placeItems: "center", fontWeight: 800, fontFamily: "var(--font-display)" }}>{n}</div>
      <div className="bold f-16">{title}</div>
    </div>
  );
}

function PathDiagram() {
  const steps = [
    { n: "1", title: "الحروف", c: "var(--primary)" },
    { n: "2", title: "الحركات", c: "var(--accent)" },
    { n: "3", title: "المدود", c: "var(--accent-2)" },
    { n: "4", title: "التنوين والشدة", c: "var(--info)" },
    { n: "5", title: "الهمزات", c: "var(--secondary)" },
    { n: "6", title: "حفظ القرآن", c: "var(--primary)" },
  ];
  return (
    <div style={{ position: "relative", padding: "20px 20px 30px", background: "var(--surface)", borderRadius: 32, border: "1px solid var(--line)", boxShadow: "var(--shadow-md)" }}>
      <svg viewBox="0 0 400 380" style={{ width: "100%", height: "auto" }}>
        <defs>
          <linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff7a45" />
            <stop offset="100%" stopColor="#2bb673" />
          </linearGradient>
        </defs>
        <path d="M50 40 Q 250 70 100 160 Q -50 250 250 280 Q 400 310 200 360"
              stroke="url(#pathGrad)" strokeWidth="4" fill="none" strokeDasharray="6 6" strokeLinecap="round" />
        {steps.map((s, i) => {
          const positions = [
            [60, 40], [260, 80], [110, 160], [320, 220], [180, 290], [320, 360],
          ];
          const [x, y] = positions[i];
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="22" fill={s.c} />
              <text x={x} y={y + 6} textAnchor="middle" fill="white" fontWeight="800" fontSize="18" fontFamily="var(--font-display)">{s.n}</text>
              <text x={x} y={y + 44} textAnchor="middle" fill="var(--ink)" fontWeight="700" fontSize="13">{s.title}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ---------- CURRICULUM SECTION ----------
function CurriculumSection() {
  const [activeLevel, setActiveLevel] = useState(CURRICULUM[0].id);
  const level = CURRICULUM.find(l => l.id === activeLevel);
  return (
    <section id="curriculum" style={{ padding: "70px 0", background: "var(--bg-soft)" }}>
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
          <span className="chip primary">المنهج التفصيلي</span>
          <h2 style={{ fontSize: 42, marginTop: 12 }}>خطة دروس واضحة، بابًا بابًا</h2>
          <p style={{ marginTop: 12 }}>المستوى الأول للقراءة من الحرف إلى السكون، والمستوى الثاني للتنوين والشدة والهمزات.</p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
          <div className="tabs">
            {CURRICULUM.map(l => (
              <button key={l.id} className={activeLevel === l.id ? "active" : ""} onClick={() => setActiveLevel(l.id)}>{l.title}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, marginTop: 30 }}>
          {level.chapters.map((c, i) => (
            <div key={c.id} className="card elev" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--grad-1)", color: "white", display: "grid", placeItems: "center", fontWeight: 800, fontFamily: "var(--font-display)" }}>{i + 1}</div>
                <h3 style={{ fontSize: 16, lineHeight: 1.3 }}>{c.title}</h3>
              </div>
              <ul style={{ margin: 0, paddingInlineStart: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {c.lessons.map((ln, j) => (
                  <li key={j} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, color: "var(--ink-soft)" }}>
                    <span style={{ color: "var(--secondary)" }}>✓</span>
                    {ln}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- BOOKS SECTION ----------
function BooksSection() {
  const [modalBook, setModalBook] = useState(null);
  return (
    <section id="books" style={{ padding: "80px 0" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 30, alignItems: "end", marginBottom: 28 }}>
          <div>
            <span className="chip accent">الحقيبة التعليمية</span>
            <h2 style={{ fontSize: 42, marginTop: 12 }}>حقيبة مناهج اقرأ ورتل</h2>
            <p style={{ marginTop: 8, maxWidth: 600 }}>
              سبعة أجزاء: المستوى الأول، المستوى الثاني، دليل المعلم، وأربعة دفاتر لأوراق العمل
              مرفقة للقراءة، الكتابة، والإملاء.
            </p>
          </div>
          <div style={{ textAlign: "center", padding: "16px 28px", background: "var(--invert-bg)", color: "var(--invert-text)", borderRadius: 22 }}>
            <div className="f-13" style={{ opacity: 0.7 }}>سعر الحقيبة كاملة</div>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)" }}>{PACKAGE_PRICE} ر.س</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 18 }}>
          {BOOKS.map(b => (
            <div key={b.id} className="book-card" onClick={() => setModalBook(b)} style={{ cursor: "pointer" }}>
              <div className="book-cover" style={{ background: b.color }}>
                <div style={{ position: "absolute", top: 12, right: 12, fontSize: 10, padding: "3px 8px", background: "rgba(255,255,255,0.25)", borderRadius: 999 }}>{b.level}</div>
                {b.title}
              </div>
              <div className="bold f-15">{b.title}</div>
              <div className="muted f-13" style={{ marginTop: 2 }}>{b.subtitle}</div>
              <div className="spread" style={{ marginTop: 12 }}>
                <span className="bold txt-primary">{b.price} ر.س</span>
                {b.soon ? <span className="chip">قريبًا</span> : <span className="f-13 muted">عرض التفاصيل ←</span>}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 30, padding: 26, borderRadius: 24, background: "var(--grad-1)", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div className="bold" style={{ fontSize: 22 }}>اشترِ الحقيبة الكاملة بسعر مخفّض</div>
            <div style={{ opacity: 0.9, marginTop: 4 }}>سبعة كتب + شحن داخل المملكة + متابعة ولي الأمر</div>
          </div>
          <OrderButton color="white" textColor="var(--primary)" />
        </div>
      </div>

      <BookModal book={modalBook} onClose={() => setModalBook(null)} />
    </section>
  );
}

function OrderButton({ color = "var(--primary)", textColor = "white" }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="btn lg" style={{ background: color, color: textColor }} onClick={() => setOpen(true)}>
        <Icon name="whatsapp" size={20} color={textColor} /> اطلب عبر واتساب
      </button>
      <OrderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function BookModal({ book, onClose }) {
  if (!book) return null;
  return (
    <Modal open={!!book} onClose={onClose} title={book.title} width={560}
      footer={<><button className="btn ghost" onClick={onClose}>إلغاء</button><OrderButton /></>}>
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 18 }}>
        <div className="book-cover" style={{ background: book.color, aspectRatio: "3/4", marginBottom: 0 }}>{book.title}</div>
        <div>
          <div className="chip primary">{book.level}</div>
          <h3 style={{ fontSize: 22, marginTop: 10 }}>{book.title}</h3>
          <div className="muted" style={{ marginTop: 4 }}>{book.subtitle}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "var(--primary)", marginTop: 14 }}>{book.price} ر.س</div>
          <div className="muted f-13" style={{ marginTop: 14 }}>
            {book.soon ? "هذا الكتاب تحت الطبع، يمكنك تسجيل اهتمامك ليصلك عند توفره." : "يمكن طلب هذا الجزء منفردًا أو ضمن الحقيبة الكاملة بخصم خاص."}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function OrderModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", city: "", note: "" });
  const [sent, setSent] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = () => {
    // Build whatsapp message
    const msg = encodeURIComponent(
      `طلب حقيبة مناهج اقرأ ورتل\nالاسم: ${form.name}\nالهاتف: ${form.phone}\nالمدينة: ${form.city}\nملاحظات: ${form.note}`
    );
    setSent(true);
    // open in new tab — using anchor click
    setTimeout(() => {
      window.open(`https://wa.me/${ACADEMY.contact.whatsapp}?text=${msg}`, "_blank");
    }, 500);
  };
  return (
    <Modal open={open} onClose={() => { setSent(false); onClose(); }} title="نموذج طلب الحقيبة"
      footer={
        sent ? <button className="btn ghost" onClick={() => { setSent(false); onClose(); }}>إغلاق</button>
             : <><button className="btn ghost" onClick={onClose}>إلغاء</button>
                 <button className="btn primary" onClick={submit} disabled={!form.name || !form.phone}>إرسال عبر واتساب</button></>
      }>
      {sent ? (
        <div style={{ textAlign: "center", padding: 20 }}>
          <div style={{ fontSize: 56 }}>📨</div>
          <h3 style={{ fontSize: 22, marginTop: 10 }}>تم تجهيز طلبك</h3>
          <p className="muted" style={{ marginTop: 6 }}>سيُفتح واتساب لإرسال طلبك إلى فريق المتابعة.</p>
        </div>
      ) : (
        <>
          <div className="field"><label>الاسم الكامل</label><input value={form.name} onChange={e => set("name", e.target.value)} placeholder="مثال: محمد أحمد" /></div>
          <div className="field"><label>رقم الجوال</label><input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="05xxxxxxxx" /></div>
          <div className="field"><label>المدينة</label><input value={form.city} onChange={e => set("city", e.target.value)} placeholder="الرياض / القاهرة / الكويت..." /></div>
          <div className="field"><label>ملاحظات (اختياري)</label><textarea rows={3} value={form.note} onChange={e => set("note", e.target.value)} placeholder="هل ترغب بالحقيبة كاملة أم جزء منها؟" /></div>
        </>
      )}
    </Modal>
  );
}

// ---------- CHANNEL SECTION ----------
function ChannelSection() {
  return (
    <section id="channel" style={{ padding: "80px 0", background: "var(--bg-soft)" }}>
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
          <span className="chip purple">قناة الكُتَّاب</span>
          <h2 style={{ fontSize: 42, marginTop: 12 }}>تابع شروحاتنا على يوتيوب</h2>
          <p style={{ marginTop: 12 }}>قناة تعليمية كاملة لشرح المنهج درسًا درسًا، يرجع إليها الطالب وقتما شاء.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18, marginTop: 30 }}>
          {CHANNEL_VIDEOS.map(v => (
            <div key={v.id} className="video-card">
              <div className="video-thumb" style={{ background: `linear-gradient(135deg, #${(v.id.charCodeAt(1)*1234 % 0xffffff).toString(16).padStart(6,'0')}, #1f1a3d)` }}>
                <div className="play">
                  <div className="btn-play"><Icon name="play" size={26} color="var(--primary)" /></div>
                </div>
                <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.7)", color: "white", padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{v.duration}</div>
              </div>
              <div style={{ padding: 16 }}>
                <div className="bold f-15">{v.title}</div>
                <div className="muted f-13" style={{ marginTop: 4 }}>{v.views} مشاهدة</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <a className="btn ghost lg" href="https://www.youtube.com/@QuranKids" target="_blank" rel="noopener">
            <Icon name="youtube" size={22} color="#ff0000" /> اشترك في القناة
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------- ROLE LOGIN SECTION ----------
function RoleLoginSection({ onPickRole, onLogin, onRegister }) {
  return (
    <section id="login" style={{ padding: "80px 0" }}>
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
          <span className="chip success">دخول مباشر</span>
          <h2 style={{ fontSize: 42, marginTop: 12 }}>اختر دورك في المنصة</h2>
          <p style={{ marginTop: 12 }}>سجّل دخولك أو أنشئ حسابًا جديدًا بحسب دورك، أو ادخل مباشرة لمعاينة كل لوحة.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 22 }}>
            <button className="btn primary" onClick={onLogin}>تسجيل الدخول</button>
            <button className="btn ghost" onClick={onRegister}>إنشاء حساب جديد</button>
          </div>
        </div>
        <div className="role-grid" style={{ marginTop: 36 }}>
          <RoleCard role="student" title="طالب" icon="grad"
            desc="حضور الحلقات، مشاهدة الفيديوهات، حل الكويزات، تتبع التقدم وكسب الشارات."
            cta="ادخل كطالب" onClick={() => onPickRole("student")} />
          <RoleCard role="teacher" title="معلم" icon="pencil"
            desc="رفع المواد، تسجيل الحضور، إنشاء كويزات، عرض تقدم كل طالب، إنشاء روابط Zoom."
            cta="ادخل كمعلم" onClick={() => onPickRole("teacher")} />
          <RoleCard role="admin" title="مشرف عام" icon="settings"
            desc="قبول الطلاب والمعلمين، إدارة المحتوى، الإشراف على كل ما يجري في المنصة."
            cta="ادخل كمشرف" onClick={() => onPickRole("admin")} />
        </div>
        <div className="muted f-13" style={{ textAlign: "center", marginTop: 18 }}>
          * هذه الأزرار للعرض المباشر بدون كلمة مرور — استخدم نموذج الدخول لتجربة كاملة.
        </div>
      </div>
    </section>
  );
}

function RoleCard({ role, title, icon, desc, cta, onClick }) {
  return (
    <div className={`role-card ${role}`} onClick={onClick}>
      <div className="role-icon"><Icon name={icon} size={26} color="white" /></div>
      <h3>{title}</h3>
      <p style={{ minHeight: 60 }}>{desc}</p>
      <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="bold txt-primary">{cta}</span>
        <Icon name="arrow_l" size={18} color="var(--primary)" />
      </div>
    </div>
  );
}

// ---------- CONTACT ----------
function ContactSection() {
  return (
    <section id="contact" style={{ padding: "80px 0", background: "var(--invert-bg)", color: "var(--invert-text)" }}>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <div>
          <div className="chip" style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>تواصل معنا</div>
          <h2 style={{ fontSize: 42, marginTop: 12, color: "white" }}>بادر بالحجز، فالمقاعد محدودة</h2>
          <p style={{ marginTop: 12, color: "rgba(255,255,255,0.75)", fontSize: 17 }}>
            فريقٌ تعليميٌ تربويٌ متخصص بخبرة تزيد عن عشرين عامًا، حلقات للبنين والبنات، حضوريًا وأون لاين، ثلاثة أيام في الأسبوع.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 30 }}>
            <ContactRow icon="chat" label="الهاتف / واتساب" value={ACADEMY.contact.phone} />
            <ContactRow icon="bell" label="البريد الإلكتروني" value={ACADEMY.contact.emails[0]} />
            <ContactRow icon="map"  label="الدول المعتمدة" value={ACADEMY.countries.join("  ·  ")} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
            <a className="btn" style={{ background: "#25D366", color: "white" }} href={`https://wa.me/${ACADEMY.contact.whatsapp}`} target="_blank" rel="noopener">
              <Icon name="whatsapp" size={20} color="white" /> راسلنا على واتساب
            </a>
            <OrderButton color="white" textColor="var(--ink)" />
          </div>
        </div>
        <InterestForm />
      </div>
    </section>
  );
}

function InterestForm() {
  const [form, setForm] = useState({ name: "", age: "", mode: "أون لاين" });
  const [sent, setSent] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.age) return;
    setSent(true);
  };
  return (
    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 28, padding: 30, border: "1px solid rgba(255,255,255,0.1)" }}>
      <h3 style={{ color: "white", fontSize: 22 }}>سجّل اهتمامك</h3>
      <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 6, fontSize: 14 }}>سنتواصل معك خلال 24 ساعة لتأكيد المقعد.</p>
      {sent ? (
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <div style={{ fontSize: 56 }}>✅</div>
          <h3 style={{ color: "white", fontSize: 20, marginTop: 12 }}>تم استلام طلبك</h3>
          <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 6, fontSize: 14 }}>سيتواصل معك فريقنا قريبًا على رقم {ACADEMY.contact.phone}</p>
          <button type="button" className="btn ghost mt-16" style={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }} onClick={() => { setSent(false); setForm({ name: "", age: "", mode: "أون لاين" }); }}>تسجيل طلب آخر</button>
        </div>
      ) : (
      <form onSubmit={submit} className="mt-16">
        <div className="field"><label style={{ color: "rgba(255,255,255,0.8)" }}>اسم الطالب</label>
          <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="مثال: محمد ياسر"
                 style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.15)", color: "white" }} required />
        </div>
        <div className="field"><label style={{ color: "rgba(255,255,255,0.8)" }}>عمر الطالب</label>
          <input value={form.age} onChange={e => set("age", e.target.value)} placeholder="مثال: 7 سنوات"
                 style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.15)", color: "white" }} required />
        </div>
        <div className="field"><label style={{ color: "rgba(255,255,255,0.8)" }}>طريقة الدراسة المفضّلة</label>
          <select value={form.mode} onChange={e => set("mode", e.target.value)}
                  style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.15)", color: "white" }}>
            <option style={{ color: "var(--ink)" }}>أون لاين</option>
            <option style={{ color: "var(--ink)" }}>حضوري</option>
            <option style={{ color: "var(--ink)" }}>الاثنان</option>
          </select>
        </div>
        <button type="submit" className="btn primary" style={{ width: "100%" }}>إرسال الطلب</button>
      </form>
      )}
    </div>
  );
}

function ContactRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.1)", display: "grid", placeItems: "center" }}>
        <Icon name={icon} size={20} color="white" />
      </div>
      <div>
        <div className="f-13" style={{ color: "rgba(255,255,255,0.6)" }}>{label}</div>
        <div className="bold f-16" style={{ color: "white" }}>{value}</div>
      </div>
    </div>
  );
}

// ---------- FOOTER ----------
function Footer() {
  return (
    <footer style={{ padding: "30px 0", background: "var(--invert-bg)", color: "var(--invert-text-soft)", borderTop: "1px solid var(--invert-line)" }}>
      <div className="container spread">
        <div className="f-13">© 2026 مناهج اقرأ ورتّل — مشروع الحافظ الصغير · جميع الحقوق محفوظة</div>
        <div className="f-13">{ACADEMY.author}</div>
      </div>
    </footer>
  );
}

Object.assign(window, { LandingPage });
