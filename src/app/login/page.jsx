"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import Navbar from "../../components/Navbar";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authChecking, setAuthChecking] = useState(true);

  // Fallback credentials for offline local development testing
  const OFFLINE_EMAIL = "admin@saini.com";
  const OFFLINE_PASSWORD = "Password123";

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          router.push("/admin");
        } else {
          // Check local storage mock fallback even if Firebase is active
          const mockAuth = localStorage.getItem("mock_admin_auth");
          if (mockAuth === "true") {
            router.push("/admin");
          } else {
            setAuthChecking(false);
          }
        }
      });
      return () => unsubscribe();
    } else {
      // If Firebase is not configured, check local storage mock auth
      const mockAuth = localStorage.getItem("mock_admin_auth");
      if (mockAuth === "true") {
        router.push("/admin");
      } else {
        setAuthChecking(false);
      }
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (email.toLowerCase() === OFFLINE_EMAIL && password === OFFLINE_PASSWORD) {
        // Fallback to local dev account (always allowed for testing and local environment ease)
        localStorage.setItem("mock_admin_auth", "true");
        router.push("/admin");
      } else if (auth) {
        // Authenticate with real Firebase Auth
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/admin");
      } else {
        throw new Error("विपरीत विवरण: Invalid email or password");
      }
    } catch (err) {
      console.error("Login failed:", err);
      let errMsg = err.message || "Authentication failed";
      if (errMsg.includes("auth/invalid-credential") || errMsg.includes("auth/user-not-found") || errMsg.includes("auth/wrong-password")) {
        errMsg = "अमान्य क्रेडेंशियल: Invalid email or password.";
      }
      setError(errMsg);
      setLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#EF9F27]/5 to-[#1D9E75]/5 -z-10" />
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#EF9F27] border-t-transparent animate-spin" />
          <span className="text-xs uppercase font-bold tracking-widest text-[#EF9F27] animate-pulse">सुरक्षित सत्यापन · Auth Guard</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#2C2C2A] font-sans antialiased relative overflow-hidden flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6 w-full relative">
        {/* Dynamic Background Blobs */}
        <div className="absolute w-[400px] h-[400px] bg-[#EF9F27]/10 blur-3xl -top-20 -left-20 rounded-full animate-pulse pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] bg-[#1D9E75]/10 blur-3xl -bottom-20 -right-20 rounded-full animate-pulse pointer-events-none" style={{ animationDelay: "2s" }} />

        <div className="w-full max-w-md relative z-10">
          {/* BJP / Nationalist Header Icon */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#EF9F27] to-[#BA7517] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-[#EF9F27]/25 mb-4 animate-float">
              RS
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#2C2C2A] text-center uppercase">
              {auth ? "Campaign Admin Portal" : "Campaign Portal (Local Dev)"}
            </h1>
            <p className="text-xs font-bold text-[#EF9F27] tracking-wider uppercase mt-1">
              राष्ट्र सेवा और जन कल्याण
            </p>
          </div>

          {/* Glassmorphic Login Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-[#e5e3dc] shadow-xl rounded-3xl p-8 relative overflow-hidden">
            {/* Accent line */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#EF9F27] to-[#1D9E75]" />

            {/* Info Banner when in offline mode */}
            {!auth && (
              <div className="mb-6 p-4 rounded-2xl bg-[#FAEEDA] border border-[#EF9F27]/20 text-left">
                <span className="text-[10px] uppercase font-black text-[#BA7517] block mb-1">
                  ℹ️ Local Development Fallback
                </span>
                <p className="text-xs text-[#5F5E5A] leading-relaxed">
                  Firebase is not configured in `.env.local`. Login using:<br />
                  <strong>Email:</strong> <code className="bg-white/60 px-1 py-0.5 rounded text-[#BA7517]">{OFFLINE_EMAIL}</code><br />
                  <strong>Password:</strong> <code className="bg-white/60 px-1 py-0.5 rounded text-[#BA7517]">{OFFLINE_PASSWORD}</code>
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center animate-shake">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-bold text-[#5F5E5A] block mb-2 uppercase tracking-wider">
                  Email Address / ईमेल
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@saini.com"
                  disabled={loading}
                  className="w-full text-sm border border-[#e5e3dc] rounded-xl px-4 py-3 outline-none focus:border-[#EF9F27] focus:ring-2 focus:ring-[#EF9F27]/10 transition-all bg-white/60 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5F5E5A] block mb-2 uppercase tracking-wider">
                  Password / पासवर्ड
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full text-sm border border-[#e5e3dc] rounded-xl px-4 py-3 outline-none focus:border-[#EF9F27] focus:ring-2 focus:ring-[#EF9F27]/10 transition-all bg-white/60 backdrop-blur-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#EF9F27] to-[#BA7517] text-white hover:from-[#BA7517] hover:to-[#8a5410] font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-[#EF9F27]/25 hover:-translate-y-0.5 hover:shadow-xl w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>प्रमाणित किया जा रहा है...</span>
                  </>
                ) : (
                  <span>सुरक्षित लॉगिन · Login</span>
                )}
              </button>
            </form>
          </div>

          {/* Footer text */}
          <p className="text-center text-[10px] uppercase font-bold tracking-wider text-[#888780] mt-8">
            © 2026 राघवेन्द्र सैनी · भारतीय जनता पार्टी कार्यकर्ता
          </p>
        </div>
      </div>
    </div>
  );
}
