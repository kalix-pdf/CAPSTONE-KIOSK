import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { Lock, User, AlertCircle, Shield, UserCircle } from "lucide-react";
import { loginService } from "../../services/admin/login.api";
import { useAuth } from "./AuthContext";

export const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try { 
      const result = await loginService(username, password);

      if (!result.success) {
        setError(result.message);
        return;
      }

      login({userId: result.user.id, role: result.user.role});

    } catch(error) {
      setError("Something went wrong. Please try again");
    } finally {
      setIsLoading(false);
    }

  };

  return (
   <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{minHeight: "100vh", background: "#080c14",
      fontFamily: "'Sora', 'DM Sans', sans-serif", padding: 24}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
        .fade-up-1 { animation: fadeUp 0.5s 0.05s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-up-2 { animation: fadeUp 0.5s 0.12s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-up-3 { animation: fadeUp 0.5s 0.19s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-up-4 { animation: fadeUp 0.5s 0.26s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-up-5 { animation: fadeUp 0.5s 0.33s cubic-bezier(0.16,1,0.3,1) both; }
        .shake { animation: shake 0.4s ease; }
        .input-field {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px; padding: 13px 16px 13px 44px;
          color: #fff; font-size: 14px; font-family: 'Sora', sans-serif;
          outline: none; transition: all 0.2s ease; box-sizing: border-box;
        }
        .input-field::placeholder { color: rgba(255,255,255,0.2); }
        .input-field:focus { border-color: rgba(96,165,250,0.5); background: rgba(96,165,250,0.05); box-shadow: 0 0 0 3px rgba(96,165,250,0.08); }
        .login-btn {
          width: 100%; padding: 14px; border-radius: 12px; border: none;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #fff; font-size: 14px; font-weight: 600;
          font-family: 'Sora', sans-serif; cursor: pointer;
          transition: all 0.2s ease; letter-spacing: 0.01em;
        }
        .login-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(59,130,246,0.35); background: linear-gradient(135deg, #60a5fa, #3b82f6); }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .eye-btn { background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; }
      `}</style>

      {/* Background orbs */}
      <div style={{ position: "fixed", top: -200, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)", pointerEvents: "none", animation: "pulseGlow 6s ease-in-out infinite" }} />
      <div style={{ position: "fixed", bottom: -200, left: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.05) 0%, transparent 70%)", pointerEvents: "none", animation: "pulseGlow 8s ease-in-out infinite reverse" }} />

      {/* Grid texture */}
      <div className="fixed" style={{ inset: 0, pointerEvents: "none", opacity: 0.015,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
        backgroundSize: "48px 48px"}} />

      {/* Card */}
      <div className="w-50 relative overflow-hidden"
       style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #013a37",
        borderRadius: 28, padding: "48px 40px",backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.5), transparent)" }} />

        <div className="fade-up flex flex-col items-center"  style={{ marginBottom: 36 }}>
          <div className="flex items-center justify-center text-lg"
           style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(59,130,246,0.1)",
            border: "1px solid rgba(59,130,246,0.25)", marginBottom: 20, fontSize: 28}}>
            <img src="/images/logo-white.png" alt="Logo" style={{ width: 44, height: 44, objectFit: "contain" }} />
          </div>

          <h1 className="font-bold mr-6"  style={{ color: "#fff", fontSize: 20, letterSpacing: "-0.02em" }}>
            Staff Login </h1>
          <p className="text-center m-0 text-base" style={{ color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>
            Enter your credentials to access<br />the pharmacy system </p>
        </div>

        {/* Error */}
        {error && (
          <div className="shake flex items-center" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 12, padding: "12px 16px", marginBottom: 20, gap: 10 }}>
            <span style={{ fontSize: 15 }}>⚠️</span>
            <p style={{ color: "#f87171" }} className="text-base">{error}</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Username */}
          <div className="fade-up-2">
            <label className="font-bold text-sm uppercase mb-9 block"
              style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.15em", fontFamily: "'DM Mono', monospace" }}>
              Username </label>
            <div className="relative">
              <span className="absolute" 
                style={{ left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.2)", fontSize: 15, pointerEvents: "none" }}>
                👤 </span>
              <input type="text" className="input-field" placeholder="Enter your username"
                value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
          </div>

          {/* Password */}
          <div className="fade-up-3">
            <label className="font-bold uppercase block mb-0"
             style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, letterSpacing: "0.15em", fontFamily: "'DM Mono', monospace" }}>
              Password </label>
            <div className="relative">
              <span className="absolute" 
                style={{ left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.2)", fontSize: 15, pointerEvents: "none" }}>
                🔒 </span>
              <input type={showPassword ? "text" : "password"} className="input-field"
                placeholder="Enter your password" value={password}
                onChange={(e) => setPassword(e.target.value)} style={{ paddingRight: 44 }} required />
              <button type="button" className="eye-btn absolute" onClick={() => setShowPassword(v => !v)}
                style={{ right: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)", fontSize: 15 }}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="fade-up-4" style={{ marginTop: 8 }}>
            <button className="login-btn" onClick={handleSubmit} disabled={isLoading} >
              {isLoading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                  Authenticating...
                </span>
              ) : "Sign In"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="fade-up-5" style={{ marginTop: 28, textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.1)", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}>
            PHARMACY MANAGEMENT SYSTEM
          </p>
        </div>
      </div>
    </div>
  );
}
