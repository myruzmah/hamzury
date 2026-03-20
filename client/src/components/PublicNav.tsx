/**
 * HAMZURY PublicNav
 * ═════════════════
 * Desktop: Logo left | Links center | Portal CTA right
 * Mobile:  Logo left | Hamburger right → full-screen overlay menu
 *
 * Active state: Gold #C9A97E underline on current page
 * Portal button: Luxury Dark Green #0A1F1C, 4px radius
 * Touch targets: 44px minimum
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Navigation links ─────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "/services",    label: "Our Services" },
  { href: "/about",       label: "About Us" },
  { href: "/track",       label: "Track Project" },
  { href: "/affiliates",  label: "Affiliates" },
];

// ─── Logo ─────────────────────────────────────────────────────────────────────

function HamzuryLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 group", className)}>
      <img
        src="https://cdn.builder.io/api/v1/image/assets%2F1a5e3e8b1d4e4f5a9c2b7e3d6f8a0b1c%2Fhamzury-logo.png"
        alt="HAMZURY"
        className="h-8 w-auto"
        onError={(e) => {
          // Fallback to text logo if CDN image fails
          (e.target as HTMLImageElement).style.display = "none";
          const parent = (e.target as HTMLImageElement).parentElement;
          if (parent) {
            const span = document.createElement("span");
            span.className = "text-[15px] font-semibold tracking-[0.08em] text-[#0A1F1C]";
            span.textContent = "HAMZURY";
            parent.appendChild(span);
          }
        }}
      />
      <span className="text-[15px] font-semibold tracking-[0.08em] text-[#0A1F1C] group-hover:opacity-80 transition-opacity">
        HAMZURY
      </span>
    </Link>
  );
}

// ─── Desktop nav link ─────────────────────────────────────────────────────────

function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const [location] = useLocation();
  const isActive = href === "/" ? location === "/" : location.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative text-[13px] font-medium transition-colors duration-150",
        "min-h-[44px] flex items-center px-1",
        isActive
          ? "text-[#0A1F1C]"
          : "text-[#888888] hover:text-[#2C2C2C]"
      )}
    >
      {label}
      {/* Gold active underline */}
      {isActive && (
        <span
          className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
          style={{ background: "#C9A97E" }}
        />
      )}
    </Link>
  );
}

// ─── Portal CTA button ────────────────────────────────────────────────────────

function PortalButton({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/portal"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center",
        "h-11 px-5 text-[13px] font-semibold",
        "bg-[#0A1F1C] text-white rounded-[4px]",
        "border border-[#0A1F1C]",
        "transition-opacity duration-150 hover:opacity-88",
        "whitespace-nowrap"
      )}
    >
      Portal
    </Link>
  );
}

// ─── Main PublicNav component ─────────────────────────────────────────────────

interface PublicNavProps {
  /** Force transparent background (for hero sections with dark bg) */
  transparent?: boolean;
  className?: string;
}

export function PublicNav({ transparent = false, className }: PublicNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Add shadow on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* ── Nav bar ────────────────────────────────────────────────────────── */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40",
          "transition-all duration-200",
          transparent && !scrolled && !menuOpen
            ? "bg-transparent"
            : "bg-white/95 backdrop-blur-md",
          scrolled && !transparent && "shadow-[0_1px_0_rgba(0,0,0,0.06)]",
          className
        )}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <HamzuryLogo />

            {/* Desktop links */}
            <nav className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map(link => (
                <NavLink key={link.href} href={link.href} label={link.label} />
              ))}
            </nav>

            {/* Desktop Portal CTA */}
            <div className="hidden md:flex items-center gap-3">
              <PortalButton />
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg text-[#2C2C2C] hover:bg-[#F5F5F5] transition-colors"
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile full-screen overlay menu ───────────────────────────────── */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-white flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Header row */}
          <div className="flex items-center justify-between h-16 px-5 border-b border-[#EBEBEB]">
            <HamzuryLogo />
            <button
              className="flex items-center justify-center w-11 h-11 rounded-lg text-[#2C2C2C] hover:bg-[#F5F5F5] transition-colors"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Links */}
          <nav className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <MobileNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                onClose={() => setMenuOpen(false)}
              />
            ))}

            {/* Divider */}
            <div className="h-px bg-[#EBEBEB] my-4" />

            {/* Secondary links */}
            <MobileNavLink href="/careers"  label="Careers"  onClose={() => setMenuOpen(false)} secondary />
            <MobileNavLink href="/press"    label="Press"    onClose={() => setMenuOpen(false)} secondary />
            <MobileNavLink href="/contact"  label="Contact"  onClose={() => setMenuOpen(false)} secondary />
          </nav>

          {/* Portal CTA at bottom */}
          <div className="px-5 py-6 border-t border-[#EBEBEB]">
            <PortalButton onClick={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Spacer so content doesn't hide behind fixed nav */}
      <div className="h-16" />
    </>
  );
}

// ─── Mobile nav link ──────────────────────────────────────────────────────────

function MobileNavLink({
  href,
  label,
  onClose,
  secondary = false,
}: {
  href: string;
  label: string;
  onClose: () => void;
  secondary?: boolean;
}) {
  const [location] = useLocation();
  const isActive = href === "/" ? location === "/" : location.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClose}
      className={cn(
        "flex items-center justify-between",
        "min-h-[52px] px-3 rounded-lg",
        "transition-colors duration-150",
        secondary ? "text-[13px]" : "text-[16px] font-medium",
        isActive
          ? "bg-[#F0F5F4] text-[#0A1F1C]"
          : secondary
          ? "text-[#888888] hover:text-[#2C2C2C] hover:bg-[#F8F8F8]"
          : "text-[#2C2C2C] hover:bg-[#F8F8F8]"
      )}
    >
      {label}
      {isActive && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: "#C9A97E" }}
        />
      )}
    </Link>
  );
}

// ─── MobilePublicBottomNav ────────────────────────────────────────────────────
// Replaces the old MobileBottomNav for public pages

import { Home, Package, Users, MoreHorizontal } from "lucide-react";

const BOTTOM_NAV_ITEMS = [
  { href: "/",           label: "Home",      Icon: Home },
  { href: "/track",      label: "Track",     Icon: Package },
  { href: "/affiliates", label: "Affiliates",Icon: Users },
  { href: "/services",   label: "More",      Icon: MoreHorizontal },
];

export function MobilePublicBottomNav() {
  const [location] = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#EBEBEB] flex items-center"
      style={{ height: "56px", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {BOTTOM_NAV_ITEMS.map(({ href, label, Icon }) => {
        const isActive = href === "/" ? location === "/" : location.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[11px] transition-colors"
            style={{ color: isActive ? "#C9A97E" : "#888888" }}
          >
            <Icon
              size={18}
              strokeWidth={isActive ? 2.2 : 1.8}
              style={{ color: isActive ? "#0A1F1C" : "#888888" }}
            />
            <span
              className={isActive ? "font-semibold" : ""}
              style={{ color: isActive ? "#0A1F1C" : "#888888" }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
