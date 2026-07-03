import React, { useState } from "react";
import { api } from "./src/lib/api.js";
import { ErrorBanner, Field } from "./shared.jsx";

export default function ProfileForm({ role, session, profile, onSaved }) {
  const [form, setForm] = useState({
    fullName: session.user.fullName || "",
    phone: session.user.phone || "",
    age: profile?.age || "",
    level: profile?.level || "",
    parentName: profile?.parentName || "",
    parentPhone: profile?.parentPhone || "",
    studyMode: profile?.studyMode || "",
    specialty: profile?.specialty || "",
    bio: profile?.bio || ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const save = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      if (role === "student") await api.student.updateProfile(form);
      setMessage("تم الحفظ");
      onSaved?.();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={save}>
      <div className="profile-grid">
        <div className="card elev">
          <div className="profile-pic" style={{ background: session.user.avatarColor || "var(--grad-1)" }}>
            {form.fullName?.[0] || "ا"}
            <span className="profile-pic-edit">✎</span>
          </div>
          <h1 className="mt-24">الملف الشخصي</h1>
          <p className="mt-8">تعديل البيانات الأساسية التي تظهر داخل المنصة.</p>
          <div className="row mt-24">
            <span className="chip primary">{role === "student" ? "طالب" : "معلم"}</span>
            {form.level ? <span className="chip">{form.level}</span> : null}
            {form.specialty ? <span className="chip success">{form.specialty}</span> : null}
          </div>
        </div>
        <div className="card elev">
          <ErrorBanner error={error} />
          <Field label="الاسم">
            <input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
          </Field>
          <Field label="الهاتف">
            <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          </Field>
          {role === "student" ? (
            <>
              <Field label="العمر">
                <input type="number" value={form.age} onChange={(event) => setForm({ ...form, age: event.target.value })} />
              </Field>
              <Field label="المستوى">
                <input value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })} />
              </Field>
              <Field label="ولي الأمر">
                <input value={form.parentName} onChange={(event) => setForm({ ...form, parentName: event.target.value })} />
              </Field>
              <Field label="هاتف ولي الأمر">
                <input value={form.parentPhone} onChange={(event) => setForm({ ...form, parentPhone: event.target.value })} />
              </Field>
            </>
          ) : (
            <>
              <Field label="التخصص">
                <input value={form.specialty} onChange={(event) => setForm({ ...form, specialty: event.target.value })} />
              </Field>
              <Field label="نبذة">
                <textarea rows={4} value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} />
              </Field>
            </>
          )}
          <button className="btn primary">حفظ</button>
          {message ? <span className="chip success mt-8">{message}</span> : null}
        </div>
      </div>
    </form>
  );
}
