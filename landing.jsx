import React, { useEffect, useState } from "react";
import { api } from "./src/lib/api.js";
import { LETTERS } from "./data.js";
import { BookGrid, EmptyState, ErrorBanner, Icon, Owl, PublicTopbar, SectionTitle, Stars, assetUrl, mergeHomeContent, youtubeUrl } from "./shared.jsx";

export default function LandingPage({ onLogin }) {
  const [remote, setRemote] = useState(null);
  const [error, setError] = useState("");
  const [lead, setLead] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState("");

  useEffect(() => {
    api.public.home().then(setRemote).catch((err) => setError(err.message));
  }, []);

  const home = mergeHomeContent(remote);
  const academy = home.academy;
  const chips = [academy.project, academy.author, academy.schedule, home.packagePrice ? `الحقيبة ${home.packagePrice} جنيه` : null].filter(Boolean);

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
      <PublicTopbar onLogin={onLogin} />
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
              <h3 className="mt-16">تأسيس القراءة</h3>
              <p className="mt-8">الحروف، الحركات، المدود، السكون، الشدة، والتنوين بتدرج واضح.</p>
            </article>
            <article className="card flat deco-geo">
              <span className="chip success">02</span>
              <h3 className="mt-16">انتقال للمصحف</h3>
              <p className="mt-8">بعد ضبط القراءة ينتقل الطالب للقراءة الصحيحة من المصحف الشريف.</p>
            </article>
            <article className="card flat">
              <span className="chip purple">03</span>
              <h3 className="mt-16">خطة حفظ منضبطة</h3>
              <p className="mt-8">حلقات بنين وبنات، أون لاين أو حضوري، ثلاثة أيام في الأسبوع.</p>
            </article>
          </div>
        </section>

        <ProjectIntro academy={academy} levels={home.curriculum} />

        <div className="container"><ErrorBanner error={error} /></div>

        <section id="curriculum" className="container landing-section">
          <SectionTitle eyebrow="المنهج" title="المستويات التعليمية لمشروع اقرأ" body="نفس مستويات اقرأ ورتّل الأصلية، وتُقرأ الآن من قاعدة البيانات عند توفرها." />
          <div className="curriculum-grid">
            {home.curriculum.map((level) => (
              <article key={level.id} className="card elev">
                <span className={`chip ${level.color === "secondary" ? "success" : "primary"}`}>{level.subtitle || level.title}</span>
                <h3 className="mt-16 f-24">{level.title}</h3>
                <div className="col mt-16">
                  {(level.chapters || []).map((chapter) => (
                    <div key={chapter.id} className="card flat chapter-card">
                      <div className="bold">{chapter.title}</div>
                      <div className="muted f-13 mt-8">{(chapter.lessons || []).join("، ")}</div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="books" className="container landing-section">
          <SectionTitle eyebrow="الحقيبة" title="كتب وأوراق عمل مناهج اقرأ ورتّل" body="تبقى بيانات المشروع كما هي، وعند رفع الملفات أو إضافة الروابط تصبح متاحة للطلاب." />
          <div className="package-summary">
            <div>
              <span className="chip accent">سعر الحقيبة</span>
              <h3>{home.packagePrice} جنيه</h3>
              <p>تشمل كتب المستويات وأوراق العمل والتدريبات، مع إمكانية طلب الملفات أو النسخ المطبوعة.</p>
            </div>
            <div className="row">
              {(academy.modes || []).map((item) => <span className="chip success" key={item}>{item}</span>)}
              {(academy.groups || []).map((item) => <span className="chip primary" key={item}>{item}</span>)}
              {(academy.countries || []).map((item) => <span className="chip" key={item}>{item}</span>)}
            </div>
          </div>
          <BookGrid books={home.books} />
        </section>

        <section id="channel" className="container landing-section">
          <SectionTitle eyebrow="القناة" title={academy.channel} body="عناوين القناة محفوظة كما كانت، وروابط يوتيوب الحقيقية تضاف من لوحة المشرف." />
          {home.channelVideos.length ? (
            <div className="video-grid">
              {home.channelVideos.map((video) => {
                const thumb = video.youtubeId ? `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg` : "";
                return (
                  <article key={video.id} className="video-card">
                    <div className="video-thumb" style={thumb ? { backgroundImage: `url(${thumb})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
                      <div className="play">
                        {video.youtubeId ? (
                          <a className="btn-play" href={youtubeUrl(video.youtubeId)} target="_blank" rel="noreferrer" aria-label={`مشاهدة ${video.title}`}>▶</a>
                        ) : (
                          <span className="btn-play" style={{ color: "var(--muted)" }}>…</span>
                        )}
                      </div>
                    </div>
                    <div style={{ padding: 16 }}>
                      <h3 className="f-18">{video.title}</h3>
                      <div className="row mt-8">
                        <span className="chip">{video.duration || "بدون مدة"}</span>
                        {video.views ? <span className="chip">{video.views} مشاهدة</span> : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : <EmptyState title="لا توجد فيديوهات" />}
        </section>

        <RoleLoginSection onLogin={onLogin} />

        <section id="contact" className="contact-band">
          <div className="container contact-grid">
            <div>
              <span className="chip accent">تواصل</span>
              <h2 className="mt-16">احجز مكان طفلك أو اطلب الحقيبة</h2>
              <p className="mt-16">الهاتف: {academy.phone} — واتساب: {academy.whatsapp}</p>
              <div className="row mt-16">
                {(academy.countries || []).map((item) => <span className="chip" key={item}>{item}</span>)}
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

function ProjectIntro({ academy, levels }) {
  const steps = (levels || []).slice(0, 4).map((level, index) => ({
    id: level.id || index,
    title: level.title,
    subtitle: level.subtitle || level.description || academy.project
  }));
  const fallback = [
    { id: "letters", title: "تأسيس الحروف", subtitle: "تعلم الحرف والحركة والصوت" },
    { id: "reading", title: "القراءة", subtitle: "تدرج حتى قراءة الكلمات والجمل" },
    { id: "quran", title: "المصحف", subtitle: "انتقال آمن للمصحف الشريف" },
    { id: "hifz", title: "الحفظ", subtitle: "خطة حفظ ومراجعة منظمة" }
  ];
  const items = steps.length ? steps : fallback;
  return (
    <section className="container landing-section project-intro">
      <div>
        <span className="chip primary">{academy.project}</span>
        <h2 className="mt-16">رحلة الطفل من الحرف إلى التلاوة</h2>
        <p className="mt-16">{academy.description}</p>
        <div className="intro-bullets mt-24">
          <Bullet n="1" title="تأسيس لغوي متدرج" />
          <Bullet n="2" title="حلقات أونلاين أو حضوري" />
          <Bullet n="3" title="متابعة للقرآن والحفظ" />
        </div>
      </div>
      <div className="card elev path-diagram">
        {items.map((item, index) => (
          <div key={item.id} className="path-step">
            <span>{index + 1}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Bullet({ n, title }) {
  return (
    <div className="intro-bullet">
      <span>{n}</span>
      <strong>{title}</strong>
    </div>
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
