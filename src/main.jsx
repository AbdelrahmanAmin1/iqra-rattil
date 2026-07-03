import React from "react";
import ReactDOM from "react-dom/client";
import "../styles.css";
import App from "../app.jsx";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("App crashed", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    const reload = () => window.location.reload();
    const clearSession = () => {
      localStorage.removeItem("iqra_session");
      window.location.reload();
    };

    return (
      <div className="app-shell" dir="rtl" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
        <div className="card elev" style={{ maxWidth: 520 }}>
          <h1 className="f-24">حدث خطأ في الواجهة</h1>
          <p className="muted mt-8">لم نترك الصفحة فارغة. جرّب إعادة التحميل، أو امسح الجلسة وسجّل الدخول مرة أخرى.</p>
          <div className="row mt-24">
            <button type="button" className="btn primary" onClick={reload}>إعادة التحميل</button>
            <button type="button" className="btn ghost" onClick={clearSession}>مسح الجلسة</button>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);
