import { Link, useLocation } from "wouter";
import { Home, Search, Package, Handshake, Menu } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/ask", label: "Ask", Icon: Search },
  { href: "/track", label: "Track", Icon: Package },
  { href: "/affiliates", label: "Affiliates", Icon: Handshake },
  { href: "/services", label: "More", Icon: Menu },
];

export function MobileBottomNav() {
  const [location] = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border flex items-center justify-around"
      style={{ height: "56px", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        const isActive = href === "/" ? location === "/" : location.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs transition-colors"
            style={{ color: isActive ? "var(--brand)" : "var(--muted-foreground)" }}
          >
            <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
            <span className={isActive ? "font-semibold" : ""}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default MobileBottomNav;
