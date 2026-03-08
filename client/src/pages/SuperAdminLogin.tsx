import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "../../../server/routers";

/**
 * Super Admin Login — hidden page, not linked anywhere on the public site.
 * Accessible only via the secret URL known to the owner.
 */
export default function SuperAdminLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginMutation = trpc.superAdmin.login.useMutation({
    onSuccess: () => {
      navigate("/admin");
    },
    onError: (err: TRPCClientErrorLike<AppRouter>) => {
      setError(err.message || "Invalid credentials.");
      setLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    loginMutation.mutate({ email, password });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--milk)" }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "white",
          border: "1px solid var(--hairline)",
          borderRadius: "2px",
          padding: "2.5rem",
          boxShadow: "0 1px 2px oklch(0% 0 0 / 0.04), 0 4px 16px oklch(0% 0 0 / 0.025)",
        }}
      >
        {/* Logo mark */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              width: "32px",
              height: "2px",
              background: "var(--brand)",
              marginBottom: "1.5rem",
            }}
          />
          <p
            style={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted-text)",
              marginBottom: "0.5rem",
            }}
          >
            HAMZURY
          </p>
          <h1
            style={{
              fontSize: "1.25rem",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "var(--charcoal)",
              margin: 0,
            }}
          >
            System Access
          </h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.6875rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--muted-text)",
                marginBottom: "0.4rem",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              style={{
                width: "100%",
                padding: "0.625rem 0.75rem",
                fontSize: "0.875rem",
                border: "1px solid var(--hairline)",
                borderRadius: "2px",
                outline: "none",
                background: "white",
                color: "var(--charcoal)",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--brand)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--hairline)")}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.6875rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--muted-text)",
                marginBottom: "0.4rem",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "0.625rem 0.75rem",
                fontSize: "0.875rem",
                border: "1px solid var(--hairline)",
                borderRadius: "2px",
                outline: "none",
                background: "white",
                color: "var(--charcoal)",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--brand)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--hairline)")}
            />
          </div>

          {error && (
            <p
              style={{
                fontSize: "0.8125rem",
                color: "oklch(50% 0.14 25)",
                margin: 0,
                padding: "0.5rem 0.75rem",
                background: "oklch(97.5% 0.025 25)",
                borderRadius: "2px",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}
          >
            {loading ? "Verifying..." : "Access System"}
          </button>
        </form>
      </div>
    </div>
  );
}
