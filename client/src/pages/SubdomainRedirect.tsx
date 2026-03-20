/**
 * HAMZURY SubdomainRedirect
 * ═════════════════════════
 * Used for /bizdoc, /systemise, /skills routes.
 * Shows a branded transition screen and redirects to the
 * appropriate subdomain within 2 seconds.
 */

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface SubdomainRedirectProps {
  name: string;
  tagline: string;
  subdomain: string;
  color: string;
}

export function SubdomainRedirect({
  name,
  tagline,
  subdomain,
  color,
}: SubdomainRedirectProps) {
  const [countdown, setCountdown] = useState(2);
  const url = `https://${subdomain}.hamzury.com`;

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          window.location.href = url;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [url]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5"
      style={{ background: color }}
    >
      {/* Logo */}
      <div className="mb-8 text-center">
        <span className="text-[12px] font-semibold tracking-[0.12em] text-white/50 uppercase">
          HAMZURY
        </span>
        <div className="mt-1 mx-auto w-8 h-[2px] rounded-full bg-[#C9A97E]" />
      </div>

      {/* Name + tagline */}
      <h1 className="text-[32px] md:text-[48px] font-bold text-white text-center leading-tight">
        {name}
      </h1>
      <p className="mt-3 text-[14px] text-white/60 text-center max-w-[320px]">
        {tagline}
      </p>

      {/* Redirect notice */}
      <div className="mt-12 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-[13px] text-white/70">
          <span className="w-4 h-4 border-2 border-white/40 border-t-white/90 rounded-full animate-spin" />
          Redirecting to {subdomain}.hamzury.com in {countdown}s…
        </div>

        <a
          href={url}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white underline underline-offset-4 hover:text-white/80 transition-colors"
        >
          Go now
          <ArrowUpRight size={14} />
        </a>
      </div>

      {/* Back link */}
      <a
        href="/"
        className="mt-8 text-[12px] text-white/40 hover:text-white/70 transition-colors"
      >
        ← Back to hamzury.com
      </a>
    </div>
  );
}

// ─── Named exports for each subdomain ─────────────────────────────────────────

export function BizdocRedirect() {
  return (
    <SubdomainRedirect
      name="BizDoc Consult"
      tagline="Compliance architecture for Nigerian businesses. CAC, tax, PENCOM, and beyond."
      subdomain="bizdoc"
      color="#0A1F1C"
    />
  );
}

export function SystemiseRedirect() {
  return (
    <SubdomainRedirect
      name="Systemise"
      tagline="Websites, web apps, automation systems, and AI workflows — built to last."
      subdomain="systemise"
      color="#1E3A5F"
    />
  );
}

export function SkillsRedirect() {
  return (
    <SubdomainRedirect
      name="HAMZURY Skills"
      tagline="Executive training, robotics, digital skills, and internship programmes."
      subdomain="skills"
      color="#DAA520"
    />
  );
}
