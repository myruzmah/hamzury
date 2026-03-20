/**
 * CSO Dashboard — HAMZURY
 * Complete dashboard with 7 sections, mock data, HAMZURY brand
 * Mobile-first, Apple-level simplicity
 */
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  LayoutDashboard, Users, ClipboardList, MessageSquare,
  Clock, TrendingUp, Zap, Bell, LogOut, Menu, X,
  Plus, ChevronRight, CheckCircle2, Circle, AlertCircle,
  ExternalLink, FileText, Calculator, Database, ArrowLeft
} from "lucide-react";

// ─── Brand Tokens ─────────────────────────────────────────────────────────────
const B = {
  green: "#0A1F1C",
  milk: "#F8F5F0",
  gold: "#C9A97E",
  charcoal: "#2C2C2C",
  border: "#E5E5E5",
  muted: "#9CA3AF",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_LEADS = [
  { id: "LD-001", name: "Tilz Spa", source: "Social", service: "BizDoc", status: "Converted", date: "2026-03-18" },
  { id: "LD-002", name: "Abuja Tech Hub", source: "Referral", service: "Systemise", status: "Assigned", date: "2026-03-17" },
  { id: "LD-003", name: "Nour Boutique", source: "Physical", service: "Studios", status: "Qualified", date: "2026-03-16" },
  { id: "LD-004", name: "Sahara Logistics", source: "Social", service: "BizDoc", status: "Contacted", date: "2026-03-15" },
  { id: "LD-005", name: "Kano Agri Co.", source: "Referral", service: "Systemise", status: "New", date: "2026-03-14" },
  { id: "LD-006", name: "Bright Minds Academy", source: "Social", service: "Innovation", status: "Converted", date: "2026-03-13" },
  { id: "LD-007", name: "Zenith Consulting", source: "Physical", service: "Studios", status: "Completed", date: "2026-03-12" },
  { id: "LD-008", name: "Arewa Foods", source: "Referral", service: "BizDoc", status: "New", date: "2026-03-11" },
];

const MOCK_ASSIGNMENTS = [
  { id: "AS-001", client: "Tilz Spa", department: "Bizdoc", service: "CAC Registration", instructions: "Complete BN registration, provide all docs to client by Friday.", deadline: "2026-03-22", status: "In Progress" },
  { id: "AS-002", client: "Abuja Tech Hub", department: "Systems", service: "Web Application", instructions: "Build client portal with dashboard. Wireframes approved.", deadline: "2026-04-01", status: "Not Started" },
  { id: "AS-003", client: "Nour Boutique", department: "Studios", service: "Brand Identity", instructions: "Full brand identity: logo, colours, typography, brand guide.", deadline: "2026-03-28", status: "In Progress" },
  { id: "AS-004", client: "Bright Minds Academy", department: "Innovation", service: "Corporate Training", instructions: "2-day digital skills bootcamp for 20 staff members.", deadline: "2026-03-25", status: "Completed" },
  { id: "AS-005", client: "Sahara Logistics", department: "Bizdoc", service: "Tax Registration", instructions: "TIN and VAT registration with FIRS. Collect all required docs.", deadline: "2026-03-30", status: "Not Started" },
];

const MOCK_UPDATES = [
  { id: 1, timestamp: "2026-03-20 09:15", department: "Systems", update: "Abuja Tech Hub wireframes approved by client. Development starting Monday.", status: "On Track", nextStep: "Begin frontend build" },
  { id: 2, timestamp: "2026-03-20 08:30", department: "Bizdoc", update: "Tilz Spa CAC documents submitted. Awaiting CACIMS confirmation.", status: "Pending", nextStep: "Follow up with CAC portal in 48h" },
  { id: 3, timestamp: "2026-03-19 16:45", department: "Studios", update: "Nour Boutique brand concepts presented. Client reviewing 3 options.", status: "Awaiting Client", nextStep: "Client feedback by Thursday" },
  { id: 4, timestamp: "2026-03-19 14:00", department: "Innovation", update: "Bright Minds Academy training completed. Certificates issued.", status: "Completed", nextStep: "Send feedback form" },
  { id: 5, timestamp: "2026-03-18 11:20", department: "Finance", update: "March invoices reconciled. 4 outstanding payments flagged.", status: "Action Required", nextStep: "CSO to follow up with clients" },
];

const MOCK_ATTENDANCE = [
  { name: "Amina Ibrahim Musa", role: "CSO Lead", checkIn: "08:45", checkOut: "—", status: "Present" },
  { name: "Idris Ibrahim", role: "Systems Lead", checkIn: "09:02", checkOut: "—", status: "Present" },
  { name: "Aisha Musa", role: "Studios Lead", checkIn: "09:30", checkOut: "—", status: "Late" },
  { name: "Fatima Yusuf", role: "Bizdoc Lead", checkIn: "08:55", checkOut: "—", status: "Present" },
  { name: "Ahmad Lawal", role: "Growth Lead", checkIn: "—", checkOut: "—", status: "Absent" },
  { name: "Maryam Sani", role: "People Lead", checkIn: "09:10", checkOut: "—", status: "Present" },
  { name: "Ibrahim Hassan", role: "Innovation Lead", checkIn: "09:00", checkOut: "—", status: "Present" },
];

const MOCK_ACTIVITY = [
  { time: "09:45", text: "Lead LD-008 (Arewa Foods) created from referral", type: "lead" },
  { time: "09:20", text: "Assignment AS-004 marked as Completed by Innovation Lead", type: "complete" },
  { time: "08:55", text: "Department update logged by Finance Lead", type: "update" },
  { time: "08:30", text: "Lead LD-003 (Nour Boutique) qualified and assigned to Studios", type: "assign" },
  { time: "08:10", text: "Attendance check-in: 6 of 14 staff present", type: "attendance" },
];

const LEADS_BY_SOURCE = [
  { name: "Social", value: 38 },
  { name: "Referral", value: 29 },
  { name: "Physical", value: 19 },
];

const CONVERSIONS_OVER_TIME = [
  { month: "Oct", leads: 12, converted: 4 },
  { month: "Nov", leads: 18, converted: 7 },
  { month: "Dec", leads: 14, converted: 6 },
  { month: "Jan", leads: 22, converted: 9 },
  { month: "Feb", leads: 28, converted: 11 },
  { month: "Mar", leads: 34, converted: 14 },
];

const DEPT_WORKLOAD = [
  { name: "Systems", value: 32 },
  { name: "Studios", value: 28 },
  { name: "Bizdoc", value: 24 },
  { name: "Innovation", value: 16 },
];

const PIE_COLORS = ["#0A1F1C", "#C9A97E", "#6B7280", "#D1FAE5"];

const QUICK_ACCESS = [
  { icon: FileText, title: "Bizdoc SOP", desc: "Standard operating procedures", action: "#" },
  { icon: Database, title: "Leads Sheet", desc: "Google Sheet: lead tracker", action: "#" },
  { icon: FileText, title: "Client Docs", desc: "Drive: client documentation", action: "#" },
  { icon: Calculator, title: "Commission Calc", desc: "Calculate agent commissions", action: "#" },
];

// ─── Nav Items ────────────────────────────────────────────────────────────────
const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "leads", label: "Lead Pipeline", icon: Users },
  { id: "assignments", label: "Assignments", icon: ClipboardList },
  { id: "updates", label: "Dept Updates", icon: MessageSquare },
  { id: "attendance", label: "Attendance", icon: Clock },
  { id: "kpis", label: "KPIs", icon: TrendingUp },
  { id: "quick", label: "Quick Access", icon: Zap },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "New": "bg-blue-100 text-blue-700",
    "Contacted": "bg-yellow-100 text-yellow-700",
    "Qualified": "bg-purple-100 text-purple-700",
    "Converted": "bg-green-100 text-green-700",
    "Assigned": "bg-orange-100 text-orange-700",
    "Completed": "bg-[#0A1F1C] text-white",
    "Not Started": "bg-gray-100 text-gray-600",
    "In Progress": "bg-blue-100 text-blue-700",
    "Present": "bg-green-100 text-green-700",
    "Late": "bg-yellow-100 text-yellow-700",
    "Absent": "bg-red-100 text-red-600",
    "On Track": "bg-green-100 text-green-700",
    "Pending": "bg-yellow-100 text-yellow-700",
    "Awaiting Client": "bg-purple-100 text-purple-700",
    "Action Required": "bg-red-100 text-red-600",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

// ─── Create Assignment Modal ──────────────────────────────────────────────────
function AssignmentModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ client: "", department: "", service: "", instructions: "", deadline: "" });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: B.border }}>
          <h3 className="text-base font-semibold" style={{ color: B.charcoal }}>Create Assignment</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "#FEF9F0", color: B.gold, border: `1px solid ${B.gold}20` }}>
            Include all details so the department can start immediately — no back-and-forth needed.
          </p>
          {[
            { label: "Client Name", key: "client", type: "text", placeholder: "e.g. Tilz Spa" },
            { label: "Service", key: "service", type: "text", placeholder: "e.g. CAC Registration" },
            { label: "Deadline", key: "deadline", type: "date", placeholder: "" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium mb-1" style={{ color: B.green }}>{f.label}</label>
              <input
                type={f.type}
                value={(form as any)[f.key]}
                onChange={e => set(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                style={{ borderColor: B.border, color: B.charcoal }}
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: B.green }}>Department</label>
            <select
              value={form.department}
              onChange={e => set("department", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
              style={{ borderColor: B.border, color: B.charcoal }}
            >
              <option value="">Select department</option>
              {["Bizdoc", "Systems", "Studios", "Innovation Hub", "Finance", "HR", "RIDI"].map(d => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: B.green }}>Instructions</label>
            <textarea
              value={form.instructions}
              onChange={e => set("instructions", e.target.value)}
              rows={4}
              placeholder="Describe exactly what needs to be done, what the client expects, and any relevant context."
              className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none resize-none"
              style={{ borderColor: B.border, color: B.charcoal }}
            />
          </div>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border text-sm font-medium" style={{ borderColor: B.border, color: B.charcoal }}>
            Cancel
          </button>
          <button
            onClick={() => { alert("Assignment created (mock)."); onClose(); }}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ background: B.green }}
          >
            Create Assignment
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function CSODashboard() {
  const [, navigate] = useLocation();
  const [section, setSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [leadFilter, setLeadFilter] = useState({ source: "", service: "", status: "" });
  const [checkedIn, setCheckedIn] = useState(false);

  // Auth guard
  useEffect(() => {
    const session = localStorage.getItem("cso_session");
    if (!session) navigate("/cso/login");
  }, [navigate]);

  const session = (() => {
    try { return JSON.parse(localStorage.getItem("cso_session") || "{}"); }
    catch { return {}; }
  })();

  const logout = () => {
    localStorage.removeItem("cso_session");
    navigate("/cso/login");
  };

  const filteredLeads = MOCK_LEADS.filter(l => {
    if (leadFilter.source && l.source !== leadFilter.source) return false;
    if (leadFilter.service && l.service !== leadFilter.service) return false;
    if (leadFilter.status && l.status !== leadFilter.status) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex" style={{ background: B.milk, fontFamily: "Inter, sans-serif" }}>
      {/* ── Sidebar (Desktop) ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}
        style={{ width: 220, background: B.green, minHeight: "100vh" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: B.gold }}>
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-tight">HAMZURY</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>CSO Portal</div>
          </div>
          <button className="ml-auto lg:hidden text-white" onClick={() => setSidebarOpen(false)}>
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setSection(item.id); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-colors"
                style={{
                  color: active ? B.gold : "rgba(255,255,255,0.6)",
                  background: active ? "rgba(201,169,126,0.1)" : "transparent",
                  borderLeft: active ? `2px solid ${B.gold}` : "2px solid transparent",
                }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-5 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: B.gold }}>
              {session.name?.charAt(0) ?? "A"}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-white truncate">{session.name ?? "CSO"}</div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>CSO Lead</div>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-xs w-full" style={{ color: "rgba(255,255,255,0.4)" }}>
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </aside>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white border-b flex items-center justify-between px-4 lg:px-6 py-3.5" style={{ borderColor: B.border }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
              <Menu size={18} />
            </button>
            <div>
              <h1 className="text-sm font-semibold" style={{ color: B.charcoal }}>
                {NAV.find(n => n.id === section)?.label ?? "Overview"}
              </h1>
              <p className="text-xs hidden sm:block" style={{ color: B.muted }}>
                Welcome, {session.name?.split(" ")[0] ?? "CSO"} · {new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <Bell size={17} style={{ color: B.charcoal }} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: B.gold }} />
            </button>
            <button onClick={logout} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ color: B.muted }}>
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6 overflow-auto">

          {/* ── OVERVIEW ── */}
          {section === "overview" && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Total Leads", value: "86", delta: "+12%", up: true },
                  { label: "Converted", value: "34", delta: "+8%", up: true },
                  { label: "Active Assignments", value: "12", delta: null, up: null },
                  { label: "Pending Follow-ups", value: "5", delta: null, up: null },
                ].map(k => (
                  <div key={k.label} className="bg-white rounded-xl border p-4" style={{ borderColor: B.border }}>
                    <div className="text-2xl font-bold mb-1" style={{ color: B.charcoal }}>{k.value}</div>
                    <div className="text-xs" style={{ color: B.muted }}>{k.label}</div>
                    {k.delta && (
                      <div className="text-xs font-medium mt-1" style={{ color: k.up ? "#059669" : "#DC2626" }}>
                        {k.delta} this month
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border p-4" style={{ borderColor: B.border }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: B.charcoal }}>Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: "New Lead", action: () => setSection("leads") },
                    { label: "Assign Work", action: () => { setSection("assignments"); setShowAssignModal(true); } },
                    { label: "Log Attendance", action: () => setSection("attendance") },
                    { label: "View Reports", action: () => setSection("kpis") },
                  ].map(a => (
                    <button
                      key={a.label}
                      onClick={a.action}
                      className="py-2.5 px-3 rounded-lg text-xs font-medium border flex items-center justify-between gap-1 hover:opacity-80 transition-opacity"
                      style={{ borderColor: B.green, color: B.green }}
                    >
                      {a.label} <ChevronRight size={13} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Feed */}
              <div className="bg-white rounded-xl border p-4" style={{ borderColor: B.border }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: B.charcoal }}>Recent Activity</h3>
                <div className="space-y-3">
                  {MOCK_ACTIVITY.map((a, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: B.gold }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs" style={{ color: B.charcoal }}>{a.text}</p>
                        <p className="text-xs mt-0.5" style={{ color: B.muted }}>{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── LEAD PIPELINE ── */}
          {section === "leads" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold" style={{ color: B.charcoal }}>Lead Pipeline</h2>
                <button
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white"
                  style={{ background: B.green }}
                  onClick={() => alert("New lead form (mock)")}
                >
                  <Plus size={13} /> New Lead
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl border p-3 flex flex-wrap gap-2" style={{ borderColor: B.border }}>
                {[
                  { label: "Source", key: "source", opts: ["Social", "Physical", "Referral"] },
                  { label: "Service", key: "service", opts: ["BizDoc", "Systemise", "Studios", "Innovation"] },
                  { label: "Status", key: "status", opts: ["New", "Contacted", "Qualified", "Converted", "Assigned", "Completed"] },
                ].map(f => (
                  <select
                    key={f.key}
                    value={(leadFilter as any)[f.key]}
                    onChange={e => setLeadFilter(p => ({ ...p, [f.key]: e.target.value }))}
                    className="text-xs px-2.5 py-1.5 rounded-lg border outline-none"
                    style={{ borderColor: B.border, color: B.charcoal }}
                  >
                    <option value="">All {f.label}s</option>
                    {f.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                ))}
                {(leadFilter.source || leadFilter.service || leadFilter.status) && (
                  <button
                    onClick={() => setLeadFilter({ source: "", service: "", status: "" })}
                    className="text-xs px-2.5 py-1.5 rounded-lg"
                    style={{ color: B.muted }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: B.border }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ background: "#FAFAFA", borderBottom: `1px solid ${B.border}` }}>
                        {["ID", "Name", "Source", "Service", "Status", "Date", "Actions"].map(h => (
                          <th key={h} className="text-left px-4 py-3 font-medium" style={{ color: B.muted }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((l, i) => (
                        <tr key={l.id} style={{ borderBottom: i < filteredLeads.length - 1 ? `1px solid ${B.border}` : "none" }}>
                          <td className="px-4 py-3 font-mono" style={{ color: B.muted }}>{l.id}</td>
                          <td className="px-4 py-3 font-medium" style={{ color: B.charcoal }}>{l.name}</td>
                          <td className="px-4 py-3" style={{ color: B.charcoal }}>{l.source}</td>
                          <td className="px-4 py-3" style={{ color: B.charcoal }}>{l.service}</td>
                          <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                          <td className="px-4 py-3" style={{ color: B.muted }}>{l.date}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5">
                              <button className="px-2 py-1 rounded text-xs border" style={{ borderColor: B.border, color: B.charcoal }}>View</button>
                              <button className="px-2 py-1 rounded text-xs border" style={{ borderColor: B.green, color: B.green }}>Convert</button>
                              <button className="px-2 py-1 rounded text-xs text-white" style={{ background: B.gold }}>Assign</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredLeads.length === 0 && (
                    <div className="text-center py-12 text-xs" style={{ color: B.muted }}>No leads match the selected filters.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── ASSIGNMENTS ── */}
          {section === "assignments" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold" style={{ color: B.charcoal }}>Assignments</h2>
                <button
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white"
                  style={{ background: B.green }}
                  onClick={() => setShowAssignModal(true)}
                >
                  <Plus size={13} /> New Assignment
                </button>
              </div>

              <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: B.border }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ background: "#FAFAFA", borderBottom: `1px solid ${B.border}` }}>
                        {["Client", "Department", "Service", "Instructions", "Deadline", "Status", "Actions"].map(h => (
                          <th key={h} className="text-left px-4 py-3 font-medium" style={{ color: B.muted }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_ASSIGNMENTS.map((a, i) => (
                        <tr key={a.id} style={{ borderBottom: i < MOCK_ASSIGNMENTS.length - 1 ? `1px solid ${B.border}` : "none" }}>
                          <td className="px-4 py-3 font-medium" style={{ color: B.charcoal }}>{a.client}</td>
                          <td className="px-4 py-3" style={{ color: B.charcoal }}>{a.department}</td>
                          <td className="px-4 py-3" style={{ color: B.charcoal }}>{a.service}</td>
                          <td className="px-4 py-3 max-w-[200px]">
                            <p className="truncate" style={{ color: B.muted }}>{a.instructions}</p>
                          </td>
                          <td className="px-4 py-3" style={{ color: B.charcoal }}>{a.deadline}</td>
                          <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5">
                              <button className="px-2 py-1 rounded text-xs border" style={{ borderColor: B.border, color: B.charcoal }}>View</button>
                              <button className="px-2 py-1 rounded text-xs border" style={{ borderColor: B.green, color: B.green }}>Update</button>
                              {a.status !== "Completed" && (
                                <button className="px-2 py-1 rounded text-xs text-white" style={{ background: B.green }}>
                                  <CheckCircle2 size={11} className="inline mr-0.5" />Done
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── DEPARTMENT UPDATES ── */}
          {section === "updates" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold" style={{ color: B.charcoal }}>Department Updates</h2>
                <div className="flex gap-2">
                  <select className="text-xs px-2.5 py-1.5 rounded-lg border outline-none" style={{ borderColor: B.border, color: B.charcoal }}>
                    <option value="">All Departments</option>
                    {["Systems", "Studios", "Bizdoc", "Innovation", "Finance", "HR"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {MOCK_UPDATES.map(u => (
                  <div key={u.id} className="bg-white rounded-xl border p-4" style={{ borderColor: B.border }}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: `${B.green}15`, color: B.green }}>
                          {u.department}
                        </span>
                        <StatusBadge status={u.status} />
                      </div>
                      <span className="text-xs flex-shrink-0" style={{ color: B.muted }}>{u.timestamp}</span>
                    </div>
                    <p className="text-sm mb-2" style={{ color: B.charcoal }}>{u.update}</p>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: B.muted }}>
                      <ChevronRight size={12} />
                      <span>Next: {u.nextStep}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ATTENDANCE ── */}
          {section === "attendance" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold" style={{ color: B.charcoal }}>
                  Attendance — {new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" })}
                </h2>
              </div>

              {/* CSO Check-in */}
              <div className="bg-white rounded-xl border p-4 flex items-center justify-between" style={{ borderColor: B.border }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: B.charcoal }}>Your Attendance</p>
                  <p className="text-xs mt-0.5" style={{ color: B.muted }}>
                    {checkedIn ? "Checked in at 08:45" : "Not yet checked in"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCheckedIn(true)}
                    disabled={checkedIn}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-40"
                    style={{ background: B.green }}
                  >
                    Check In
                  </button>
                  <button
                    disabled={!checkedIn}
                    className="px-3 py-2 rounded-lg text-xs font-semibold border disabled:opacity-40"
                    style={{ borderColor: B.border, color: B.charcoal }}
                  >
                    Check Out
                  </button>
                </div>
              </div>

              {/* Staff Table */}
              <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: B.border }}>
                <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: B.border }}>
                  <span className="text-sm font-semibold" style={{ color: B.charcoal }}>Team Attendance</span>
                  <div className="flex gap-3 text-xs">
                    <span style={{ color: "#059669" }}>● Present: {MOCK_ATTENDANCE.filter(a => a.status === "Present").length}</span>
                    <span style={{ color: "#D97706" }}>● Late: {MOCK_ATTENDANCE.filter(a => a.status === "Late").length}</span>
                    <span style={{ color: "#DC2626" }}>● Absent: {MOCK_ATTENDANCE.filter(a => a.status === "Absent").length}</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ background: "#FAFAFA", borderBottom: `1px solid ${B.border}` }}>
                        {["Staff Name", "Role", "Check-in", "Check-out", "Status"].map(h => (
                          <th key={h} className="text-left px-4 py-3 font-medium" style={{ color: B.muted }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_ATTENDANCE.map((a, i) => (
                        <tr key={i} style={{ borderBottom: i < MOCK_ATTENDANCE.length - 1 ? `1px solid ${B.border}` : "none" }}>
                          <td className="px-4 py-3 font-medium" style={{ color: B.charcoal }}>{a.name}</td>
                          <td className="px-4 py-3" style={{ color: B.muted }}>{a.role}</td>
                          <td className="px-4 py-3" style={{ color: B.charcoal }}>{a.checkIn}</td>
                          <td className="px-4 py-3" style={{ color: B.charcoal }}>{a.checkOut}</td>
                          <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── KPIs & ANALYTICS ── */}
          {section === "kpis" && (
            <div className="space-y-6">
              <h2 className="text-base font-semibold" style={{ color: B.charcoal }}>KPIs & Analytics</h2>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Conversion Rate", value: "39.5%", sub: "Leads → Clients" },
                  { label: "Assignment Speed", value: "2.3h", sub: "Avg time to assign" },
                  { label: "Completion Rate", value: "92%", sub: "Assignments done" },
                  { label: "Revenue (March)", value: "₦4.2M", sub: "Confirmed payments" },
                ].map(k => (
                  <div key={k.label} className="bg-white rounded-xl border p-4" style={{ borderColor: B.border }}>
                    <div className="text-2xl font-bold mb-1" style={{ color: B.green }}>{k.value}</div>
                    <div className="text-xs font-medium" style={{ color: B.charcoal }}>{k.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: B.muted }}>{k.sub}</div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Bar: Leads by Source */}
                <div className="bg-white rounded-xl border p-4" style={{ borderColor: B.border }}>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: B.charcoal }}>Leads by Source</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={LEADS_BY_SOURCE} barSize={36}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: B.muted }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: B.muted }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${B.border}` }} />
                      <Bar dataKey="value" fill={B.green} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Line: Conversions over time */}
                <div className="bg-white rounded-xl border p-4" style={{ borderColor: B.border }}>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: B.charcoal }}>Conversions Over Time</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={CONVERSIONS_OVER_TIME}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: B.muted }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: B.muted }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${B.border}` }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="leads" stroke={B.muted} strokeWidth={2} dot={false} name="Leads" />
                      <Line type="monotone" dataKey="converted" stroke={B.green} strokeWidth={2} dot={false} name="Converted" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie: Department workload */}
                <div className="bg-white rounded-xl border p-4" style={{ borderColor: B.border }}>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: B.charcoal }}>Department Workload</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={DEPT_WORKLOAD} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {DEPT_WORKLOAD.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${B.border}` }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ── QUICK ACCESS ── */}
          {section === "quick" && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold" style={{ color: B.charcoal }}>Quick Access</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {QUICK_ACCESS.map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="bg-white rounded-xl border p-5 flex flex-col gap-3" style={{ borderColor: B.border }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${B.green}10` }}>
                        <Icon size={20} style={{ color: B.green }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: B.charcoal }}>{item.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: B.muted }}>{item.desc}</p>
                      </div>
                      <a
                        href={item.action}
                        className="flex items-center gap-1.5 text-xs font-medium mt-auto"
                        style={{ color: B.green }}
                      >
                        Open <ExternalLink size={11} />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t lg:hidden" style={{ borderColor: B.border }}>
        <div className="flex">
          {NAV.slice(0, 5).map(item => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className="flex-1 flex flex-col items-center py-2.5 gap-0.5 min-h-[56px]"
                style={{ color: active ? B.green : B.muted }}
              >
                <Icon size={18} />
                <span className="text-[10px] font-medium">{item.label.split(" ")[0]}</span>
                {active && <span className="w-1 h-1 rounded-full" style={{ background: B.gold }} />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Assignment Modal */}
      {showAssignModal && <AssignmentModal onClose={() => setShowAssignModal(false)} />}
    </div>
  );
}
