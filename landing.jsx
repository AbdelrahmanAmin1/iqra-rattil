import React, { useCallback, useEffect, useState } from "react";
import { api, subscribeToContentUpdates } from "./src/lib/api.js";
import { LETTERS } from "./data.js";
import { BookGrid, ClickToPlayVideo, ErrorBanner, Icon, Owl, PublicTopbar, SectionTitle, Stars, mergeHomeContent } from "./shared.jsx";

const HERO_CHIPS = [
  "مشروع الحافظ الصغير",
  "سلسلة لتعليم القراءة والكتابة والإملاء وتحسين الخط وحفظ القرآن الكريم",
  "حقيبة تعليمية متكاملة"
];

export default function LandingPage({ onLogin }) {
  const [remote, setRemote] = useState(null);
  const [error, setError] = useState("");
  const [lead, setLead] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState("");

  const loadHome = useCallback(async () => {
    try {
      setRemote(await api.public.home());
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    void loadHome();
    const interval = window.setInterval(() => void loadHome(), 30_000);
    const onFocus = () => void loadHome();
    window.addEventListener("focus", onFocus);
    const unsubscribe = subscribeToContentUpdates(loadHome);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      unsubscribe();
    };
  }, [loadHome]);

  const home = mergeHomeContent(remote);
  const academy = home.academy;
  const chips = [academy.project, academy.schedule, HERO_CHIPS[2]].filter(Boolean);
  const packageBooks = home.books || [];
  const curriculumLevels = home.curriculum || [];
  const videosFor = (placement) => (home.channelVideos || []).filter((video) => video.placement === placement);

  const sendLead = async (event) => {
    event.preventDefault();
    setError("");
    setSent("");
    try {
      await api.public.lead({ ...lead, source: "landing" });
      setLead({ name: "", phone: "", message: "" });
      setSent("تم إرسال الطلب بنجاح.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-shell" dir="rtl">
      <PublicTopbar onLogin={onLogin} academy={academy} />
      <main>
        <section id="home" className="container landing-hero">
          <span className="blob" style={{ width: 260, height: 260, background: "var(--accent)", top: 90, insetInlineStart: "20%" }} />
          <span className="blob" style={{ width: 230, height: 230, background: "var(--primary)", bottom: 20, insetInlineEnd: "12%" }} />
          <div className="hero-art">
            <div className="card elev lesson-device">
              <div className="spread">
                <span className="chip primary">الدرس الحالي</span>
                <span className="muted f-13">المستوى الأول — باب الحروف</span>
              </div>
              <div className="letter-grid">
                {LETTERS.map((letter, index) => (
                  <div key={letter} className={`arabic-tile ${index === 4 ? "active-letter" : ""}`}>{letter}</div>
                ))}
              </div>
            </div>
            <div className="card anim-float achievement-card">
              <span className="badge-pill">🏆</span>
              <div>
                <div className="bold f-14">شارة جديدة</div>
                <div className="muted f-13">بطل الحروف</div>
                <Stars count={3} size={13} />
              </div>
            </div>
            <div className="card anim-float hero-zoom-card">
              <span className="hero-zoom-icon"><Icon name="zoom" size={22} color="white" /></span>
              <div>
                <div className="bold f-14">حلقة اليوم</div>
                <div className="muted f-12">تظهر من جدول المعلم عند إضافتها</div>
              </div>
            </div>
            <div className="hero-owl anim-wiggle"><Owl size={84} /></div>
          </div>
          <div>
            <div className="row">
              {chips.map((chip) => <span key={chip} className="chip accent">{chip}</span>)}
            </div>
            <h1 className="landing-title mt-16">
              تأسيس صحيح في <span className="txt-primary">اللغة العربية</span> وحفظ متقن <span style={{ color: "var(--info)" }}>للقرآن الكريم</span>
            </h1>
            <p className="landing-copy mt-16">{academy.description}</p>
            <div className="row mt-24">
              <button type="button" className="btn primary lg" onClick={onLogin}>ابدأ الآن</button>
              <a className="btn ghost lg" href="#curriculum">استعرض المنهج</a>
            </div>
          </div>
        </section>

        <section className="container landing-section">
          <div className="feature-strip">
            <article className="card flat deco-dots">
              <span className="chip primary">01</span>
              <h3 className="mt-16">تأسيس القراءة والإملاء</h3>
              <p className="mt-8">الحروف، الحركات، المدود، السكون، الشدة، والتنوين والشدة وهمزة الوصل واللام الشمسية والقمرية ورسم الهمزات</p>
            </article>
            <article className="card flat deco-geo">
              <span className="chip success">02</span>
              <h3 className="mt-16">انتقال للمصحف</h3>
              <p className="mt-8">بعد ضبط القراءة ينتقل الطالب للقراءة الصحيحة من المصحف الشريف ومن ثم حفظه في سن مبكرة.</p>
            </article>
            <article className="card flat">
              <span className="chip purple">03</span>
              <h3 className="mt-16">خطة حفظ منضبطة</h3>
              <p className="mt-8">حلقات للبنين والبنات على أيدي متخصصين محترفين</p>
            </article>
          </div>
        </section>

        <div className="container"><ErrorBanner error={error} /></div>

        <LandingVideoSection id="outcomes" eyebrow="المنهج" title="ثمرة مناهج اقرأ ورتل" videos={videosFor("outcomes")} />

        <section id="curriculum" className="container landing-section">
          <SectionTitle eyebrow="المنهج" title="المستويات التعليمية لمشروع اقرأ و رتل" />
          <div className="curriculum-grid curriculum-grid-three">
            {curriculumLevels.map((level, index) => (
              <article key={level.id} className="card elev curriculum-summary-card">
                <span className={`chip ${["primary", "success", "purple"][index % 3]}`}>{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-16 f-24">{level.title}</h3>
                <p className="mt-16">{level.subtitle || level.chapters?.map((chapter) => chapter.title).join(" — ") || "بانتظار المحتوى"}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="books" className="container landing-section">
          <div className="page-head">
            <div>
              <span className="chip primary">الحقيبة</span>
              <h2 className="mt-16">{`تتكون من ${packageBooks.length} كتب`}</h2>
            </div>
          </div>
          <BookGrid books={packageBooks} />
        </section>

        <LandingVideoSection id="bag-video" eyebrow="الحقيبة" title="محتويات الحقيبة والكتب" videos={videosFor("bag")} />

        <LandingVideoSection id="testimonials" eyebrow="آراء وتجارب" title="قالوا عن المنهج" videos={videosFor("testimonials")} />

        <RoleLoginSection onLogin={onLogin} />

        <section id="contact" className="contact-band">
          <div className="container contact-grid">
            <div>
              <span className="chip accent">تواصل</span>
              <h2 className="mt-16">احجز مكان طفلك أو اطلب الحقيبة</h2>
              <p className="mt-16">الهاتف: {academy.phone} — واتساب: {academy.whatsapp}</p>
              <div className="row mt-16">
                {(academy.modes || []).map((item) => <span className="chip success" key={item}>{item}</span>)}
                {(academy.groups || []).map((item) => <span className="chip primary" key={item}>{item}</span>)}
              </div>
            </div>
            <form className="card" onSubmit={sendLead}>
              <h2 className="f-24">تواصل معنا</h2>
              <label className="field"><span>الاسم</span><input value={lead.name} onChange={(event) => setLead({ ...lead, name: event.target.value })} required /></label>
              <label className="field"><span>الهاتف</span><input value={lead.phone} onChange={(event) => setLead({ ...lead, phone: event.target.value })} /></label>
              <label className="field"><span>الرسالة</span><textarea rows={3} value={lead.message} onChange={(event) => setLead({ ...lead, message: event.target.value })} /></label>
              <button className="btn primary">إرسال</button>
              {sent ? <span className="chip success mt-8">{sent}</span> : null}
            </form>
          </div>
        </section>
        <footer className="site-footer">
          <div className="container spread">
            <div>
              <div className="bold">{academy.name}</div>
              <div className="muted f-13">{academy.project} — {academy.author}</div>
            </div>
            <div className="row">
              {(academy.emails || []).map((email) => <a key={email} className="chip" href={`mailto:${email}`}>{email}</a>)}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function LandingVideoSection({ id, eyebrow, title, videos }) {
  if (!videos.length) return null;
  return (
    <section id={id} className="container landing-section landing-video-section">
      <SectionTitle eyebrow={eyebrow} title={title} />
      <div className={`landing-video-grid ${videos.length === 1 ? "single" : ""}`}>
        {videos.map((video) => <ClickToPlayVideo key={video.id} video={video} />)}
      </div>
    </section>
  );
}

function RoleLoginSection({ onLogin }) {
  const roles = [
    { id: "student", icon: "book", title: "دخول الطالب", desc: "الدروس، الحلقات، الكتب، المحادثة، والشارات." },
    { id: "teacher", icon: "grad", title: "دخول المعلم", desc: "إدارة الطلاب والحلقات والمواد والمحادثات." },
    { id: "admin", icon: "settings", title: "دخول المشرف", desc: "الموافقات والمحتوى والمستخدمون والإعدادات." }
  ];
  return (
    <section className="container landing-section role-login-section">
      <SectionTitle eyebrow="الدخول" title="اختر بوابتك داخل منصة اقرأ ورتل" body="كل بطاقة تفتح صفحة تسجيل الدخول نفسها، ثم يوجهك النظام تلقائيا حسب الدور." />
      <div className="login-roles">
        {roles.map((role) => (
          <button type="button" key={role.id} className="role-card" onClick={onLogin}>
            <span className="role-icon"><Icon name={role.icon} size={28} /></span>
            <span>
              <strong>{role.title}</strong>
              <small>{role.desc}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
