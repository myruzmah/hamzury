/**
 * CSO Login — HAMZURY Institutional Access
 * Mock authentication with localStorage session
 */
import { useState } from "react";
import { useLocation } from "wouter";

export default function CSOLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (email === "cso@hamzury.com" && password === "cso@hamzury.com") {
        localStorage.setItem("cso_session", JSON.stringify({ name: "Amina Ibrahim Musa", role: "CSO Lead", email }));
        navigate("/cso/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8F5F0" }}>
      <div className="w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: "#0A1F1C" }}>
            <span className="text-white font-bold text-xl tracking-tight">H</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: "#0A1F1C" }}>HAMZURY</h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>Institutional Access</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: "#E5E5E5" }}>
          <h2 className="text-lg font-semibold mb-6" style={{ color: "#2C2C2C" }}>Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#0A1F1C" }}>
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@hamzury.com"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all"
                style={{ borderColor: "#E5E5E5", color: "#2C2C2C", background: "#FAFAFA" }}
                onFocus={e => (e.target.style.borderColor = "#0A1F1C")}
                onBlur={e => (e.target.style.borderColor = "#E5E5E5")}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#0A1F1C" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all"
                style={{ borderColor: "#E5E5E5", color: "#2C2C2C", background: "#FAFAFA" }}
                onFocus={e => (e.target.style.borderColor = "#0A1F1C")}
                onBlur={e => (e.target.style.borderColor = "#E5E5E5")}
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-60"
              style={{ background: "#0A1F1C" }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#9CA3AF" }}>
          HAMZURY Institutional Access
        </p>
      </div>
    </div>
  );
}
