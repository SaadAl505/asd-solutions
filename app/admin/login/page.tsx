"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/logo";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.");
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 22 }}>
      <form onSubmit={submit} className="admin-card" style={{ width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 18, textAlign: "center", alignItems: "center", padding: 34 }}>
        <LogoMark size={52} />
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>لوحة تحكم روائع الحلول</h1>
          <p style={{ fontSize: 13.5, color: "var(--ink-2)" }}>أدخل كلمة المرور للمتابعة</p>
        </div>
        <input
          className="input"
          type="password"
          dir="ltr"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}
        <button className="btn btn-dark" style={{ width: "100%" }} disabled={loading}>
          {loading ? "جارٍ التحقق..." : "تسجيل الدخول"}
        </button>
      </form>
    </main>
  );
}
