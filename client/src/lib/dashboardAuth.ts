/**
 * HAMZURY Dashboard Auth
 * ══════════════════════
 * Lightweight localStorage-based auth for internal dashboards.
 * Each role has its own session key so sessions are fully isolated.
 *
 * Authentication flow:
 *   1. User visits /[role]/login
 *   2. Submits email + password
 *   3. On success: session stored in localStorage, redirect to /[role]/dashboard
 *   4. ProtectedDashboardRoute reads session; if missing → redirect to /[role]/login
 *
 * Default credentials (first login forces password change):
 *   email = role email (e.g. cso@hamzury.com)
 *   password = email address itself (e.g. cso@hamzury.com)
 *
 * Session timeout:
 *   Mobile: 5 minutes of inactivity
 *   Desktop: 15 minutes of inactivity
 */

import type { DashboardRole } from "@/components/DashboardShell";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardSession {
  role: DashboardRole;
  email: string;
  name: string;
  loginTime: number;
  lastActivity: number;
  mustChangePassword: boolean;
}

// ─── Default credentials (demo / first-login) ─────────────────────────────────

const DEFAULT_CREDENTIALS: Record<DashboardRole, { email: string; name: string }> = {
  cso:       { email: "cso@hamzury.com",       name: "CSO Lead" },
  ceo:       { email: "ceo@hamzury.com",        name: "Chief Executive" },
  founder:   { email: "founder@hamzury.com",    name: "Founder" },
  finance:   { email: "finance@hamzury.com",    name: "Finance Lead" },
  hr:        { email: "hr@hamzury.com",          name: "HR Lead" },
  bizdev:    { email: "bizdev@hamzury.com",      name: "BizDev Lead" },
  affiliate: { email: "affiliate@hamzury.com",  name: "Affiliate" },
};

// ─── Session timeout (ms) ─────────────────────────────────────────────────────

const isMobile = () =>
  typeof window !== "undefined" && window.innerWidth < 768;

const SESSION_TIMEOUT_MS = () => (isMobile() ? 5 * 60 * 1000 : 15 * 60 * 1000);

// ─── Storage key ──────────────────────────────────────────────────────────────

const sessionKey = (role: DashboardRole) => `hamzury_dash_session_${role}`;

// ─── Auth helpers ─────────────────────────────────────────────────────────────

/**
 * Attempt login for a given role.
 * Default password = email address (first-login convention).
 * Returns the session on success, null on failure.
 */
export function dashboardLogin(
  role: DashboardRole,
  email: string,
  password: string
): DashboardSession | null {
  const creds = DEFAULT_CREDENTIALS[role];
  if (!creds) return null;

  // Accept: correct email + (password === email) OR (password === "hamzury2026")
  const emailMatch = email.trim().toLowerCase() === creds.email.toLowerCase();
  const passwordMatch =
    password === creds.email || password === "hamzury2026";

  if (!emailMatch || !passwordMatch) return null;

  const session: DashboardSession = {
    role,
    email: creds.email,
    name: creds.name,
    loginTime: Date.now(),
    lastActivity: Date.now(),
    mustChangePassword: password === creds.email, // force change if using default
  };

  localStorage.setItem(sessionKey(role), JSON.stringify(session));
  return session;
}

/**
 * Get the current session for a role.
 * Returns null if no session or session has timed out.
 */
export function getDashboardSession(role: DashboardRole): DashboardSession | null {
  try {
    const raw = localStorage.getItem(sessionKey(role));
    if (!raw) return null;

    const session: DashboardSession = JSON.parse(raw);

    // Check timeout
    const elapsed = Date.now() - session.lastActivity;
    if (elapsed > SESSION_TIMEOUT_MS()) {
      localStorage.removeItem(sessionKey(role));
      return null;
    }

    // Refresh last activity
    session.lastActivity = Date.now();
    localStorage.setItem(sessionKey(role), JSON.stringify(session));

    return session;
  } catch {
    return null;
  }
}

/**
 * Sign out of a dashboard role.
 */
export function dashboardLogout(role: DashboardRole): void {
  localStorage.removeItem(sessionKey(role));
}

/**
 * Check if a user is authenticated for a given role.
 */
export function isDashboardAuthenticated(role: DashboardRole): boolean {
  return getDashboardSession(role) !== null;
}
