import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

// ─── Role → Dashboard routing ─────────────────────────────────────────────────
function getDashboardPath(institutionalRole: string): string {
  switch (institutionalRole) {
    case "founder":
      return "/founder-access-k8p1q";
    case "ceo":
      return "/ceo-access-7x9m4";
    case "lead":
      return "/lead-dashboard";
    case "staff":
    default:
      return "/my-tasks";
  }
}

export default function StaffLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = trpc.auth.staffLogin.useMutation({
    onSuccess: (data) => {
      const path = getDashboardPath(data.institutionalRole);
      navigate(path);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-[#F9F6F1] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#1B4D3E] rounded-xl mb-4">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <h1 className="text-xl font-semibold text-stone-900">HAMZURY Staff Portal</h1>
          <p className="text-sm text-stone-400 mt-1">Sign in with your institutional account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-100 p-8 shadow-sm space-y-5">
          <div>
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              autoComplete="email"
              className="mt-1.5 w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/30 transition-all"
              placeholder="you@hamzury.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loginMutation.isPending}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Password</label>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/30 transition-all pr-10"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginMutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-[#1B4D3E] text-white rounded-xl py-3 text-sm font-medium hover:bg-[#163d30] transition-colors disabled:opacity-50"
          >
            {loginMutation.isPending ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-stone-400 mt-6">
          Not a staff member?{" "}
          <a href="/portal" className="text-[#1B4D3E] hover:underline">
            Visit the client portal
          </a>
        </p>
      </div>
    </div>
  );
}
