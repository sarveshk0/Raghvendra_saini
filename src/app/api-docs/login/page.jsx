"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/api-docs";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/swagger-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push(from);
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials.");
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a18 0%, #2C2C2A 50%, #1a1a18 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, system-ui, sans-serif",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Background decoration */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(239,159,39,0.08) 0%, transparent 70%)"
      }} />
      <div style={{
        position: "absolute", width: 400, height: 400,
        borderRadius: "50%", background: "rgba(239,159,39,0.04)",
        top: -100, right: -100, pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", width: 300, height: 300,
        borderRadius: "50%", background: "rgba(29,158,117,0.04)",
        bottom: -80, left: -80, pointerEvents: "none"
      }} />

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 420,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(239,159,39,0.2)",
        borderRadius: 20,
        padding: "40px 36px",
        backdropFilter: "blur(20px)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(239,159,39,0.08)",
        animation: shake ? "shake 0.5s ease" : "none",
        position: "relative",
      }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(135deg, #EF9F27, #BA7517)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, margin: "0 auto 16px",
            boxShadow: "0 4px 20px rgba(239,159,39,0.4)",
          }}>🪷</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#F8F7F2", letterSpacing: "-0.01em" }}>
            API Documentation
          </div>
          <div style={{ fontSize: 12, color: "#EF9F27", marginTop: 6, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Raghvendra Saini Campaign Portal
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>
            Restricted access — authorized personnel only
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(239,159,39,0.3), transparent)", marginBottom: 28 }} />

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
              Username
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, opacity: 0.5 }}>👤</span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${error ? "rgba(192,57,43,0.6)" : "rgba(255,255,255,0.12)"}`,
                  borderRadius: 10, padding: "12px 14px 12px 42px",
                  fontSize: 14, color: "#F8F7F2", outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(239,159,39,0.6)"}
                onBlur={e => e.target.style.borderColor = error ? "rgba(192,57,43,0.6)" : "rgba(255,255,255,0.12)"}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, opacity: 0.5 }}>🔒</span>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${error ? "rgba(192,57,43,0.6)" : "rgba(255,255,255,0.12)"}`,
                  borderRadius: 10, padding: "12px 44px 12px 42px",
                  fontSize: 14, color: "#F8F7F2", outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(239,159,39,0.6)"}
                onBlur={e => e.target.style.borderColor = error ? "rgba(192,57,43,0.6)" : "rgba(255,255,255,0.12)"}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", fontSize: 15, opacity: 0.5,
                  color: "#F8F7F2", padding: 0,
                }}
              >{showPass ? "🙈" : "👁"}</button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(192,57,43,0.15)", border: "1px solid rgba(192,57,43,0.4)",
              borderRadius: 8, padding: "10px 14px", marginBottom: 16,
              fontSize: 12, color: "#e74c3c", fontWeight: 600,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "13px 0",
              background: loading ? "rgba(239,159,39,0.4)" : "linear-gradient(135deg, #EF9F27, #BA7517)",
              border: "none", borderRadius: 10,
              fontSize: 14, fontWeight: 700, color: "#fff",
              cursor: loading ? "default" : "pointer",
              letterSpacing: "0.02em",
              boxShadow: loading ? "none" : "0 4px 16px rgba(239,159,39,0.4)",
              transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff", borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }} />
                Verifying...
              </>
            ) : (
              <> 🔓 Access API Docs</>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <a href="/" style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textDecoration: "none", fontWeight: 500 }}>
            ← Back to website
          </a>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px rgba(42,42,40,0.9) inset !important;
          -webkit-text-fill-color: #F8F7F2 !important;
        }
      `}</style>
    </div>
  );
}

export default function SwaggerLoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#1a1a18" }} />}>
      <LoginForm />
    </Suspense>
  );
}
