/**
 * HAMZURY DashboardShell
 * ══════════════════════
 * Desktop: Fixed left sidebar (240px) with logo, nav links, user footer
 * Mobile:  Full-width content + fixed bottom nav (4-5 tabs)
 *
 * Role-aware: each role receives its own nav config
 * Active state: Gold #C9A97E left border + soft green bg
 * Touch targets: 44px minimum
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BarChart2,
  Settings,
  LogOut,
  Building2,
  DollarSign,
  UserCheck,
  Briefcase,
  TrendingUp,
  FileText,
  Calendar,
  Bell,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Role types ───────────────────────────────────────────────────────────────

export type DashboardRole =
  | "cso"
  | "ceo"
  | "founder"
  | "finance"
  | "hr"
  | "bizdev"
  | "affiliate";

// ─── Nav config per role ──────────────────────────────────────────────────────

interface NavItem {
  href: string;
  label: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  badge?: string;
}

const ROLE_NAV: Record<DashboardRole, { title: string; color: string; items: NavItem[] }> = {
  cso: {
    title: "Client Services",
    color: "#1B4D3E",
    items: [
      { href: "/cso/dashboard",            label: "Overview",       Icon: LayoutDashboard },
      { href: "/cso/dashboard?tab=leads",  label: "Lead Pipeline",  Icon: TrendingUp },
      { href: "/cso/dashboard?tab=assign", label: "Assignments",    Icon: ClipboardList },
      { href: "/cso/dashboard?tab=updates",label: "Updates",        Icon: Bell },
      { href: "/cso/dashboard?tab=attend", label: "Attendance",     Icon: UserCheck },
      { href: "/cso/dashboard?tab=kpis",   label: "KPIs",           Icon: BarChart2 },
    ],
  },
  ceo: {
    title: "CEO Command",
    color: "#0A1F1C",
    items: [
      { href: "/ceo/dashboard",              label: "Overview",      Icon: LayoutDashboard },
      { href: "/ceo/dashboard?tab=staff",    label: "Staff",         Icon: Users },
      { href: "/ceo/dashboard?tab=tasks",    label: "Tasks",         Icon: ClipboardList },
      { href: "/ceo/dashboard?tab=finance",  label: "Finance",       Icon: DollarSign },
      { href: "/ceo/dashboard?tab=clients",  label: "Clients",       Icon: Building2 },
      { href: "/ceo/dashboard?tab=reports",  label: "Reports",       Icon: FileText },
    ],
  },
  founder: {
    title: "Founder Suite",
    color: "#3E2723",
    items: [
      { href: "/founder/dashboard",              label: "Overview",    Icon: LayoutDashboard },
      { href: "/founder/dashboard?tab=depts",    label: "Departments", Icon: Building2 },
      { href: "/founder/dashboard?tab=team",     label: "Team",        Icon: Users },
      { href: "/founder/dashboard?tab=notes",    label: "Notes",       Icon: FileText },
      { href: "/founder/dashboard?tab=reports",  label: "Reports",     Icon: BarChart2 },
    ],
  },
  finance: {
    title: "Finance",
    color: "#0A1F1C",
    items: [
      { href: "/finance/dashboard",                label: "Overview",   Icon: LayoutDashboard },
      { href: "/finance/dashboard?tab=invoices",   label: "Invoices",   Icon: FileText },
      { href: "/finance/dashboard?tab=payments",   label: "Payments",   Icon: DollarSign },
      { href: "/finance/dashboard?tab=commission", label: "Commission", Icon: TrendingUp },
      { href: "/finance/dashboard?tab=reports",    label: "Reports",    Icon: BarChart2 },
    ],
  },
  hr: {
    title: "HR",
    color: "#0A1F1C",
    items: [
      { href: "/hr/dashboard",               label: "Overview",    Icon: LayoutDashboard },
      { href: "/hr/dashboard?tab=staff",     label: "Staff",       Icon: Users },
      { href: "/hr/dashboard?tab=recruit",   label: "Recruitment", Icon: UserCheck },
      { href: "/hr/dashboard?tab=attend",    label: "Attendance",  Icon: Calendar },
      { href: "/hr/dashboard?tab=reviews",   label: "Reviews",     Icon: ClipboardList },
    ],
  },
  bizdev: {
    title: "BizDev",
    color: "#1B4D3E",
    items: [
      { href: "/bizdev/dashboard",               label: "Overview",    Icon: LayoutDashboard },
      { href: "/bizdev/dashboard?tab=leads",     label: "Leads",       Icon: TrendingUp },
      { href: "/bizdev/dashboard?tab=partners",  label: "Partners",    Icon: Briefcase },
      { href: "/bizdev/dashboard?tab=campaigns", label: "Campaigns",   Icon: BarChart2 },
      { href: "/bizdev/dashboard?tab=reports",   label: "Reports",     Icon: FileText },
    ],
  },
  affiliate: {
    title: "Affiliate",
    color: "#C9A97E",
    items: [
      { href: "/affiliate/dashboard",               label: "Overview",   Icon: LayoutDashboard },
      { href: "/affiliate/dashboard?tab=referrals", label: "Referrals",  Icon: Users },
      { href: "/affiliate/dashboard?tab=earnings",  label: "Earnings",   Icon: DollarSign },
      { href: "/affiliate/dashboard?tab=resources", label: "Resources",  Icon: FileText },
    ],
  },
};

// ─── Sidebar nav link ─────────────────────────────────────────────────────────

function SidebarLink({ item, roleColor }: { item: NavItem; roleColor: string }) {
  const [location] = useLocation();
  // Match by path only (ignore query params for active check)
  const currentPath = location.split("?")[0];
  const itemPath = item.href.split("?")[0];
  const isActive = currentPath === itemPath;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 rounded-lg min-h-[44px]",
        "text-[13px] font-medium transition-all duration-150 relative",
        isActive
          ? "text-[#0A1F1C] bg-[#F0F5F4]"
          : "text-[#666666] hover:text-[#2C2C2C] hover:bg-[#F8F8F8]"
      )}
    >
      {/* Gold left accent bar */}
      {isActive && (
        <span
          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
          style={{ background: "#C9A97E" }}
        />
      )}
      <item.Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
      <span>{item.label}</span>
      {item.badge && (
        <span className="ml-auto text-[10px] font-semibold bg-[#0A1F1C] text-white px-1.5 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

// ─── Mobile bottom nav link ───────────────────────────────────────────────────

function BottomNavLink({ item }: { item: NavItem }) {
  const [location] = useLocation();
  const currentPath = location.split("?")[0];
  const itemPath = item.href.split("?")[0];
  const isActive = currentPath === itemPath;

  return (
    <Link
      href={item.href}
      className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[10px] transition-colors"
    >
      <item.Icon
        size={18}
        strokeWidth={isActive ? 2.2 : 1.8}
        className={isActive ? "text-[#0A1F1C]" : "text-[#888888]"}
      />
      <span
        className={isActive ? "font-semibold" : ""}
        style={{ color: isActive ? "#0A1F1C" : "#888888" }}
      >
        {item.label}
      </span>
      {isActive && (
        <span
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full"
          style={{ background: "#C9A97E" }}
        />
      )}
    </Link>
  );
}

// ─── DashboardShell ───────────────────────────────────────────────────────────

interface DashboardShellProps {
  role: DashboardRole;
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
  children: React.ReactNode;
}

export function DashboardShell({
  role,
  userName = "Staff Member",
  userEmail,
  onLogout,
  children,
}: DashboardShellProps) {
  const config = ROLE_NAV[role];
  // Show first 4-5 items in bottom nav
  const bottomItems = config.items.slice(0, 5);

  // Mobile sidebar overlay state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [location] = useLocation();

  // Close sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location]);

  // Prevent body scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = mobileSidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileSidebarOpen]);

  // Initials for avatar
  const initials = userName
    .split(" ")
    .map(w => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex">

      {/* ── Desktop sidebar ──────────────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-[240px] bg-white border-r border-[#EBEBEB] z-30"
        style={{ borderRightColor: "#EBEBEB" }}
      >
        {/* Logo + role title */}
        <div className="flex items-center gap-2.5 h-16 px-5 border-b border-[#EBEBEB] shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[13px] font-semibold tracking-[0.08em] text-[#0A1F1C]">
              HAMZURY
            </span>
          </Link>
          <span className="text-[#EBEBEB]">·</span>
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.06em]"
            style={{ color: config.color }}
          >
            {config.title}
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
          {config.items.map(item => (
            <SidebarLink key={item.href} item={item} roleColor={config.color} />
          ))}

          {/* Settings link */}
          <div className="mt-4 pt-4 border-t border-[#EBEBEB]">
            <SidebarLink
              item={{ href: `/${role}/settings`, label: "Settings", Icon: Settings }}
              roleColor={config.color}
            />
          </div>
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-[#EBEBEB] shrink-0">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#F8F8F8] transition-colors">
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
              style={{ background: config.color }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-[#2C2C2C] truncate">{userName}</p>
              {userEmail && (
                <p className="text-[11px] text-[#888888] truncate">{userEmail}</p>
              )}
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="text-[#888888] hover:text-[#2C2C2C] transition-colors p-1 rounded"
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── Mobile sidebar overlay ────────────────────────────────────────── */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-white flex flex-col"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between h-16 px-5 border-b border-[#EBEBEB] shrink-0">
            <span className="text-[13px] font-semibold tracking-[0.08em] text-[#0A1F1C]">
              HAMZURY · <span style={{ color: config.color }}>{config.title}</span>
            </span>
            <button
              className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-[#F5F5F5]"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
            {config.items.map(item => (
              <SidebarLink key={item.href} item={item} roleColor={config.color} />
            ))}
            <div className="mt-4 pt-4 border-t border-[#EBEBEB]">
              <SidebarLink
                item={{ href: `/${role}/settings`, label: "Settings", Icon: Settings }}
                roleColor={config.color}
              />
            </div>
          </nav>
          {onLogout && (
            <div className="px-5 py-4 border-t border-[#EBEBEB]">
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-[13px] text-[#888888] hover:text-[#2C2C2C] transition-colors min-h-[44px]"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Main content area ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:ml-[240px]">

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between h-14 px-4 bg-white border-b border-[#EBEBEB] sticky top-0 z-20">
          <button
            className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-[#F5F5F5] transition-colors"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <span className="text-[13px] font-semibold text-[#0A1F1C] tracking-[0.06em]">
            HAMZURY
          </span>
          <div className="w-11" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* ── Mobile bottom nav ─────────────────────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#EBEBEB] flex items-center relative"
        style={{ height: "56px", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {bottomItems.map(item => (
          <BottomNavLink key={item.href} item={item} />
        ))}
      </nav>
    </div>
  );
}
