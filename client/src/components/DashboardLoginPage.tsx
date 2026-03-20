/**
 * HAMZURY DashboardLoginPage
 * ══════════════════════════
 * Shared login UI used by all internal dashboard login pages.
 * Each role passes its own config (title, color, email hint).
 *
 * Design: Split layout (left brand panel + right form) on desktop.
 *         Single column on mobile.
 * Auth: calls trpc.auth.staffLogin, handles mustChangePassword flow
 */

import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, ArrowLeft, Lock, Mail, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardRole } from "@/components/DashboardShell";
import { trpc } from "@/lib/trpc";

// ─── Role config ──────────────────────────────────────────────────────────────

interface RoleConfig {
  role: DashboardRole;
  title: string;
  subtitle: string;
  color: string;
  emailHint: string;
  dashboardPath: string;
}

export const ROLE_CONFIGS: Record<DashboardRole, RoleConfig> = {
  cso: {
    role: "cso",
    title: "Client Services",
    subtitle: "Operations Dashboard",
    color: "#1B4D3E",
    emailHint: "cso@hamzury.com",
    dashboardPath: "/cso/dashboard",
  },
  ceo: {
    role: "ceo",
    title: "CEO",
    subtitle: "Command Centre",
    color: "#0A1F1C",
    emailHint: "ceo@hamzury.com",
    dashboardPath: "/ceo/dashboard",
  },
  founder: {
    role: "founder",
    title: "Founder",
    subtitle: "Strategic Suite",
    color: "#3E2723",
    emailHint: "founder@hamzury.com",
    dashboardPath: "/founder/dashboard",
  },
  finance: {
    role: "finance",
    title: "Finance",
    subtitle: "Financial Operations",
    color: "#0A1F1C",
    emailHint: "finance@hamzury.com",
    dashboardPath: "/finance/dashboard",
  },
  hr: {
    role: "hr",
    title: "Human Resources",
    subtitle: "People Operations",
    color: "#0A1F1C",
    emailHint: "hr@hamzury.com",
    dashboardPath: "/hr/dashboard",
  },
  bizdev: {
    role: "bizdev",
    title: "Business Development",
    subtitle: "Growth Dashboard",
    color: "#1B4D3E",
    emailHint: "bizdev@hamzury.com",
    dashboardPath: "/bizdev/dashboard",
  },
  affiliate: {
    role: "affiliate",
    title: "Affiliate",
    subtitle: "Partner Dashboard",
    color: "#C9A97E",
    emailHint: "affiliate@hamzury.com",
    dashboardPath: "/affiliate/dashboard",
  },
};

// ─── ForcePasswordChange inline form ─────────────────────────────────────────

interface ForcePasswordChangeProps {
  email: string;
  staffId: string;
  onSuccess: (dashboardPath: string) => void;
}

function ForcePasswordChange({ email, staffId, onSuccess }: ForcePasswordChangeProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const changePasswordMutation = trpc.auth.changePassword.useMutation({
    onSuccess: () => {
      setSuccess(true);
      // Re-login with new password to get a proper session
      setTimeout(() => {
        onSuccess("/");
      }, 1500);
    },
    onError: (err) => {
      setError(err.message || "Failed to change password. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Use email as current password (default credential)
    changePasswordMutation.mutate({
      currentPassword: email,
      newPassword,
    });
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <CheckCircle size={40} className="text-[#1B4D3E]" />
        <p className="text-[15px] font-semibold text-[#0A1F1C]">Password updated.</p>
        <p className="text-[13px] text-[#888888]">Redirecting you now…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-[4px] px-4 py-3">
        <p className="text-[12px] text-amber-800 font-medium">
          Welcome to HAMZURY. For your security, please set a new password before continuing.
        </p>
      </div>

      {/* New password */}
      <div>
        <label className="block text-[12px] font-semibold text-[#2C2C2C] mb-1.5 uppercase tracking-[0.06em]">
          New Password
        </label>
        <div className="relative">
          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AAAAAA] pointer-events-none" />
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={e => { setNewPassword(e.target.value); setError(""); }}
            placeholder="At least 8 characters"
            required
            minLength={8}
            className="w-full h-11 pl-10 pr-11 text-[13px] bg-white border border-[#DEDEDE] rounded-[4px] text-[#2C2C2C] placeholder:text-[#BBBBBB] outline-none focus:border-[#0A1F1C] focus:ring-2 focus:ring-[#0A1F1C]/10 transition-all"
          />
          <button type="button" onClick={() => setShowNew(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] hover:text-[#555555] transition-colors p-1">
            {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {/* Confirm password */}
      <div>
        <label className="block text-[12px] font-semibold text-[#2C2C2C] mb-1.5 uppercase tracking-[0.06em]">
          Confirm Password
        </label>
        <div className="relative">
          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AAAAAA] pointer-events-none" />
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={e => { setConfirmPassword(e.target.value); setError(""); }}
            placeholder="Repeat your new password"
            required
            className="w-full h-11 pl-10 pr-11 text-[13px] bg-white border border-[#DEDEDE] rounded-[4px] text-[#2C2C2C] placeholder:text-[#BBBBBB] outline-none focus:border-[#0A1F1C] focus:ring-2 focus:ring-[#0A1F1C]/10 transition-all"
          />
          <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] hover:text-[#555555] transition-colors p-1">
            {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-[12px] text-red-500 bg-red-50 border border-red-200 rounded-[4px] px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={changePasswordMutation.isPending || !newPassword || !confirmPassword}
        className="w-full h-11 text-[13px] font-semibold rounded-[4px] text-white bg-[#0A1F1C] hover:bg-[#1B4D3E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {changePasswordMutation.isPending ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving…
          </>
        ) : (
          "Set New Password"
        )}
      </button>
    </form>
  );
}

// ─── DashboardLoginPage ───────────────────────────────────────────────────────

interface DashboardLoginPageProps {
  role: DashboardRole;
}

export function DashboardLoginPage({ role }: DashboardLoginPageProps) {
  const config = ROLE_CONFIGS[role];
  const [, setLocation] = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // After successful login with mustChangePassword=true
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const [loggedInStaffId, setLoggedInStaffId] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);

  // Focus email on mount
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const loginMutation = trpc.auth.staffLogin.useMutation({
    onSuccess: (data) => {
      if (data.mustChangePassword) {
        // Show force-change-password form
        setLoggedInEmail(email);
        setLoggedInStaffId(data.staffId);
        setMustChangePassword(true);
      } else {
        // Determine redirect path based on dashboardRole
        const dashRole = (data as any).dashboardRole ?? role;
        const targetConfig = ROLE_CONFIGS[dashRole as DashboardRole] ?? config;
        setLocation(targetConfig.dashboardPath);
      }
    },
    onError: (err) => {
      setError(err.message || "Incorrect email or password. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex flex-col md:flex-row">

      {/* ── Left brand panel (desktop only) ─────────────────────────────── */}
      <div
        className="hidden md:flex flex-col justify-between w-[420px] shrink-0 p-12"
        style={{ background: config.color }}
      >
        {/* Logo */}
        <div>
          <span className="text-[13px] font-semibold tracking-[0.1em] text-white/90">
            HAMZURY
          </span>
          <div className="mt-1 w-8 h-[2px] rounded-full" style={{ background: "#C9A97E" }} />
        </div>

        {/* Title block */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50 mb-3">
            {config.subtitle}
          </p>
          <h1 className="text-[36px] font-bold text-white leading-tight">
            {config.title}
          </h1>
          <p className="mt-4 text-[14px] text-white/60 leading-relaxed max-w-[280px]">
            Secure access to the HAMZURY internal operations platform.
          </p>
        </div>

        {/* Footer note */}
        <p className="text-[11px] text-white/30">
          © {new Date().getFullYear()} HAMZURY Institution
        </p>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col">

        {/* Mobile header */}
        <div
          className="md:hidden flex items-center justify-between h-14 px-5 border-b border-[#EBEBEB]"
          style={{ background: config.color }}
        >
          <span className="text-[13px] font-semibold tracking-[0.08em] text-white">
            HAMZURY · {config.title}
          </span>
          <a href="/" className="text-white/70 hover:text-white transition-colors text-[12px]">
            ← Home
          </a>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-5 py-12">
          <div className="w-full max-w-[380px]">

            {/* Back link (desktop) */}
            <a
              href="/"
              className="hidden md:inline-flex items-center gap-1.5 text-[12px] text-[#888888] hover:text-[#2C2C2C] transition-colors mb-10"
            >
              <ArrowLeft size={14} />
              Back to hamzury.com
            </a>

            {mustChangePassword ? (
              <>
                {/* Force password change heading */}
                <div className="mb-8">
                  <h2 className="text-[24px] font-bold text-[#0A1F1C]">
                    Set your password
                  </h2>
                  <p className="mt-1 text-[13px] text-[#888888]">
                    First login — choose a secure password to continue.
                  </p>
                </div>
                <ForcePasswordChange
                  email={loggedInEmail}
                  staffId={loggedInStaffId}
                  onSuccess={(path) => setLocation(path)}
                />
              </>
            ) : (
              <>
                {/* Sign in heading */}
                <div className="mb-8">
                  <h2 className="text-[24px] font-bold text-[#0A1F1C]">
                    Sign in
                  </h2>
                  <p className="mt-1 text-[13px] text-[#888888]">
                    {config.title} · {config.subtitle}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate className="space-y-4">

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[12px] font-semibold text-[#2C2C2C] mb-1.5 uppercase tracking-[0.06em]"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AAAAAA] pointer-events-none" />
                      <input
                        ref={emailRef}
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setError(""); }}
                        placeholder={config.emailHint}
                        required
                        className={cn(
                          "w-full h-11 pl-10 pr-4 text-[13px]",
                          "bg-white border rounded-[4px]",
                          "text-[#2C2C2C] placeholder:text-[#BBBBBB]",
                          "outline-none transition-all",
                          error
                            ? "border-red-400 focus:ring-2 focus:ring-red-200"
                            : "border-[#DEDEDE] focus:border-[#0A1F1C] focus:ring-2 focus:ring-[#0A1F1C]/10"
                        )}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-[12px] font-semibold text-[#2C2C2C] mb-1.5 uppercase tracking-[0.06em]"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AAAAAA] pointer-events-none" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={e => { setPassword(e.target.value); setError(""); }}
                        placeholder="Enter your password"
                        required
                        className={cn(
                          "w-full h-11 pl-10 pr-11 text-[13px]",
                          "bg-white border rounded-[4px]",
                          "text-[#2C2C2C] placeholder:text-[#BBBBBB]",
                          "outline-none transition-all",
                          error
                            ? "border-red-400 focus:ring-2 focus:ring-red-200"
                            : "border-[#DEDEDE] focus:border-[#0A1F1C] focus:ring-2 focus:ring-[#0A1F1C]/10"
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] hover:text-[#555555] transition-colors p-1"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Error message */}
                  {error && (
                    <p className="text-[12px] text-red-500 bg-red-50 border border-red-200 rounded-[4px] px-3 py-2">
                      {error}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loginMutation.isPending || !email || !password}
                    className={cn(
                      "w-full h-11 text-[13px] font-semibold rounded-[4px]",
                      "text-white transition-all duration-150",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "flex items-center justify-center gap-2"
                    )}
                    style={{ background: loginMutation.isPending ? "#888888" : config.color }}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Signing in…
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </button>
                </form>

                {/* Hint */}
                <p className="mt-6 text-[11px] text-[#AAAAAA] text-center leading-relaxed">
                  Default password is your email address.
                  <br />
                  Contact your administrator if you need access.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
