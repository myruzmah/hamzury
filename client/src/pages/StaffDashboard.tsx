import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  Clock,
  FileText,
  GraduationCap,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type TaskStatus = "Not Started" | "In Progress" | "Completed" | "On Hold" | "Cancelled";

const STATUS_STYLES: Record<TaskStatus, string> = {
  "Not Started": "bg-gray-100 text-gray-600",
  "In Progress": "bg-blue-50 text-blue-700",
  "Completed": "bg-green-50 text-green-700",
  "On Hold": "bg-yellow-50 text-yellow-700",
  "Cancelled": "bg-red-50 text-red-600",
};

const navItems = [
  { id: "tasks", label: "My Tasks", icon: <CheckSquare size={16} /> },
  { id: "kpis", label: "My KPIs", icon: <Target size={16} /> },
  { id: "deadlines", label: "Upcoming Deadlines", icon: <Clock size={16} /> },
  { id: "deliverables", label: "Recent Deliverables", icon: <FileText size={16} /> },
  { id: "training", label: "Training Progress", icon: <GraduationCap size={16} /> },
];

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function isOverdue(deadline: Date | string | null | undefined) {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

export default function StaffDashboard() {
  const [activeSection, setActiveSection] = useState("tasks");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, navigate] = useLocation();

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => { toast.success("Signed out."); navigate("/portal"); },
  });

  return (
    <div className="min-h-screen bg-white flex">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:z-auto`}
        style={{ background: "oklch(98.5% 0.005 160)" }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-sm flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "var(--brand)" }}
            >
              H
            </div>
            <span className="font-semibold text-xs tracking-widest uppercase" style={{ color: "var(--brand)" }}>
              HAMZURY
            </span>
          </Link>
          <button className="ml-auto md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-5 border-b border-border">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold mb-3" style={{ background: "var(--brand)" }}>
            S
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--charcoal)" }}>Staff Member</p>
          <p className="text-xs text-muted-foreground">Studios Department</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors text-left"
              style={{
                background: activeSection === item.id ? "var(--brand-muted)" : "transparent",
                color: activeSection === item.id ? "var(--brand)" : "var(--muted-text)",
                fontWeight: activeSection === item.id ? 500 : 400,
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-border">
          <button
            onClick={() => logoutMutation.mutate()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-16 border-b border-border flex items-center px-6 gap-4">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={18} className="text-muted-foreground" />
          </button>
          <h1 className="text-sm font-semibold" style={{ color: "var(--charcoal)" }}>
            {navItems.find((n) => n.id === activeSection)?.label}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">Staff Portal</span>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: "var(--brand)" }}>
              S
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-10 overflow-auto">
          {activeSection === "tasks" && <TasksSection />}
          {activeSection === "kpis" && <KPIsSection />}
          {activeSection === "deadlines" && <DeadlinesSection />}
          {activeSection === "deliverables" && <DeliverablesSection />}
          {activeSection === "training" && <TrainingSection />}
        </div>
      </main>
    </div>
  );
}

// ─── Tasks Section ────────────────────────────────────────────────────────────
function TasksSection() {
  const { data: tasks, isLoading, refetch } = trpc.staff.myTasks.useQuery();
  const updateMutation = trpc.staff.updateTaskStatus.useMutation({
    onSuccess: () => { toast.success("Status updated."); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) return <SectionSkeleton />;

  return (
    <div>
      <SectionHeader title="My Active Tasks" subtitle="Tasks assigned to you across all active projects." />
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              {["Task ID", "Client", "Description", "Deadline", "Status"].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks?.map((task) => {
              const overdue = isOverdue(task.deadline) && task.status !== "Completed" && task.status !== "Cancelled";
              return (
                <tr
                  key={task.taskId}
                  className={`border-b border-border transition-colors hover:bg-muted/30 ${overdue ? "task-overdue" : ""}`}
                >
                  <td className="py-3.5 px-4 font-mono text-xs">{task.taskId}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-xs">{task.clientName}</div>
                    <div className="text-xs text-muted-foreground">{task.servicePackage}</div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <span className="line-clamp-2">{task.description ?? "—"}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-xs ${overdue ? "font-semibold" : ""}`}>
                      {overdue && <AlertTriangle size={12} className="inline mr-1" />}
                      {formatDate(task.deadline)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Select
                      value={task.status}
                      onValueChange={(val) =>
                        updateMutation.mutate({ taskId: task.taskId, status: val as TaskStatus })
                      }
                    >
                      <SelectTrigger className="h-7 text-xs w-36 rounded-sm border-0 p-0 gap-1 focus:ring-0" style={{ background: "transparent" }}>
                        <span className={`px-2 py-0.5 rounded-sm text-xs font-medium ${STATUS_STYLES[task.status as TaskStatus]}`}>
                          {task.status}
                        </span>
                        <ChevronDown size={10} className="text-muted-foreground" />
                      </SelectTrigger>
                      <SelectContent>
                        {(["Not Started", "In Progress", "Completed", "On Hold", "Cancelled"] as TaskStatus[]).map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              );
            })}
            {(!tasks || tasks.length === 0) && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                  No tasks assigned to you at this time.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── KPIs Section ─────────────────────────────────────────────────────────────
function KPIsSection() {
  const { data: kpis, isLoading } = trpc.staff.myKPIs.useQuery();
  if (isLoading) return <SectionSkeleton />;

  const metrics = [
    { label: "Tasks Completed", value: kpis?.tasksCompleted ?? 0, target: kpis?.tasksTarget ?? 0, unit: "" },
    { label: "On-Time Rate", value: kpis?.onTimeRate ?? 0, target: kpis?.onTimeTarget ?? 0, unit: "%" },
    { label: "QA Pass Rate", value: kpis?.qaPassRate ?? 0, target: kpis?.qaTarget ?? 0, unit: "%" },
  ];

  return (
    <div>
      <SectionHeader title="My KPIs" subtitle="Personal performance metrics against monthly targets." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {metrics.map((m) => {
          const pct = m.target > 0 ? Math.min(100, Math.round((m.value / m.target) * 100)) : 0;
          const good = pct >= 90;
          return (
            <div key={m.label} className="luxury-card">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">{m.label}</p>
              <p className="text-3xl font-semibold mb-1" style={{ color: good ? "var(--brand)" : "var(--overdue-text)" }}>
                {m.value}{m.unit}
              </p>
              <p className="text-xs text-muted-foreground mb-4">Target: {m.target}{m.unit}</p>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: good ? "var(--brand)" : "var(--overdue-text)" }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{pct}% of target</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Deadlines Section ────────────────────────────────────────────────────────
function DeadlinesSection() {
  const { data: tasks, isLoading } = trpc.staff.upcomingDeadlines.useQuery();
  if (isLoading) return <SectionSkeleton />;

  return (
    <div>
      <SectionHeader title="Upcoming Deadlines" subtitle="Tasks due in the next 7 days, sorted by urgency." />
      <div className="space-y-3">
        {tasks?.map((task) => {
          const daysLeft = task.deadline
            ? Math.ceil((new Date(task.deadline).getTime() - Date.now()) / 86400000)
            : null;
          const urgent = daysLeft !== null && daysLeft <= 2;
          return (
            <div
              key={task.taskId}
              className="flex items-center justify-between p-5 rounded-sm border border-border hover:border-primary/30 transition-colors"
              style={{ background: urgent ? "var(--overdue-bg)" : "white" }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--charcoal)" }}>{task.description ?? task.taskId}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{task.clientName} · {task.taskId}</p>
              </div>
              <div className="text-right ml-4">
                <p className="text-xs font-semibold" style={{ color: urgent ? "var(--overdue-text)" : "var(--brand)" }}>
                  {daysLeft === 0 ? "Due today" : daysLeft === 1 ? "Due tomorrow" : `${daysLeft}d left`}
                </p>
                <p className="text-xs text-muted-foreground">{formatDate(task.deadline)}</p>
              </div>
            </div>
          );
        })}
        {(!tasks || tasks.length === 0) && (
          <div className="py-16 text-center">
            <p className="text-sm text-muted-foreground">No deadlines in the next 7 days.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Deliverables Section ─────────────────────────────────────────────────────
function DeliverablesSection() {
  const { data: deliverables, isLoading } = trpc.staff.recentDeliverables.useQuery();
  if (isLoading) return <SectionSkeleton />;

  return (
    <div>
      <SectionHeader title="Recent Deliverables" subtitle="Files recently completed and placed in the deliverables folder." />
      <div className="space-y-3">
        {deliverables?.map((d) => (
          <div key={d.id} className="flex items-center justify-between p-5 rounded-sm border border-border">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-sm flex items-center justify-center" style={{ background: "var(--brand-muted)" }}>
                <FileText size={16} style={{ color: "var(--brand)" }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--charcoal)" }}>{d.title}</p>
                <p className="text-xs text-muted-foreground">{d.clientRef} · {formatDate(d.uploadedAt)}</p>
              </div>
            </div>
            {d.driveUrl && (
              <a
                href={d.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                style={{ color: "var(--brand)" }}
              >
                Open <ExternalLink size={12} />
              </a>
            )}
          </div>
        ))}
        {(!deliverables || deliverables.length === 0) && (
          <div className="py-16 text-center">
            <p className="text-sm text-muted-foreground">No recent deliverables.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Training Section ─────────────────────────────────────────────────────────
function TrainingSection() {
  const modules = [
    { title: "HAMZURY Brand Kit & Quality Standards", progress: 100, status: "Completed" },
    { title: "Central Master Tracker & Placeholder System", progress: 85, status: "In Progress" },
    { title: "5-Point Quality Gate Checklist", progress: 100, status: "Completed" },
    { title: "Internal Request Form & Handoff Protocols", progress: 60, status: "In Progress" },
    { title: "RIDI Soul & Institutional Philosophy", progress: 100, status: "Completed" },
    { title: "BizDev QA Process & Delivery Dossier", progress: 20, status: "In Progress" },
  ];

  return (
    <div>
      <SectionHeader title="Training Progress" subtitle="Your learning progress through HAMZURY's institutional training programme." />
      <div className="space-y-4">
        {modules.map((m) => (
          <div key={m.title} className="luxury-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium" style={{ color: "var(--charcoal)" }}>{m.title}</p>
              <span className={`text-xs px-2 py-0.5 rounded-sm font-medium ${STATUS_STYLES[m.status as TaskStatus]}`}>
                {m.status}
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${m.progress}%`, background: "var(--brand)" }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{m.progress}% complete</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Shared components ────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <span className="brand-rule" />
      <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--charcoal)" }}>{title}</h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-48 bg-muted rounded" />
      <div className="h-4 w-72 bg-muted rounded" />
      <div className="mt-8 space-y-3">
        {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-muted rounded" />)}
      </div>
    </div>
  );
}
