import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { CSOAgent } from "@/components/CSOAgent";
import { BizdocAgent } from "@/components/BizdocAgent";
import { toast } from "sonner";
import TaskComments from "@/components/TaskComments";

// ─── Notification Bell ────────────────────────────────────────────────────────
function NotificationBell() {
  const [open, setOpen] = useState(false);
  const notifsQuery = trpc.institutional.myNotifications.useQuery();
  const markReadMutation = trpc.institutional.markNotificationRead.useMutation({ onSuccess: () => notifsQuery.refetch() });
  const markAllMutation = trpc.institutional.markAllNotificationsRead.useMutation({ onSuccess: () => notifsQuery.refetch() });
  const notifs = notifsQuery.data ?? [];
  const unread = notifs.filter((n: any) => !n.isRead).length;
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 text-stone-400 hover:text-stone-600 transition-colors">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-xl border border-stone-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
            <span className="text-sm font-semibold text-stone-900">Notifications</span>
            {unread > 0 && <button onClick={() => markAllMutation.mutate()} className="text-xs text-[#1B4D3E] hover:underline">Mark all read</button>}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="p-6 text-center text-sm text-stone-400">No notifications yet.</div>
            ) : notifs.map((n: any) => (
              <div key={n.id} onClick={() => !n.isRead && markReadMutation.mutate({ id: n.id })}
                className={`px-4 py-3 border-b border-stone-50 cursor-pointer hover:bg-stone-50 transition-colors ${!n.isRead ? "bg-[#1B4D3E]/5" : ""}`}>
                <div className="flex items-start gap-2">
                  {!n.isRead && <div className="w-2 h-2 bg-[#1B4D3E] rounded-full mt-1.5 flex-shrink-0" />}
                  <div className={!n.isRead ? "" : "ml-4"}>
                    <div className="text-xs font-semibold text-stone-800">{n.title}</div>
                    <div className="text-xs text-stone-500 mt-0.5">{n.message}</div>
                    <div className="text-xs text-stone-300 mt-1">{new Date(n.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  );
}

// ─── Password Change Modal ────────────────────────────────────────────────────
function PasswordChangeModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const changeMutation = trpc.auth.changePassword.useMutation({
    onSuccess: () => { toast.success("Password changed successfully."); onClose(); },
    onError: (e) => toast.error(e.message),
  });
  const submit = () => {
    if (next !== confirm) { toast.error("New passwords do not match."); return; }
    if (next.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    changeMutation.mutate({ currentPassword: current, newPassword: next });
  };
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-stone-900">Change Password</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl">×</button>
        </div>
        <div className="space-y-3">
          <div><label className="text-xs font-medium text-stone-600 block mb-1">Current password</label>
            <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E]" /></div>
          <div><label className="text-xs font-medium text-stone-600 block mb-1">New password</label>
            <input type="password" value={next} onChange={(e) => setNext(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E]" /></div>
          <div><label className="text-xs font-medium text-stone-600 block mb-1">Confirm new password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E]" /></div>
          <button onClick={submit} disabled={changeMutation.isPending || !current || !next || !confirm}
            className="w-full bg-[#1B4D3E] text-white rounded-xl py-3 text-sm font-medium hover:bg-[#163d30] transition-colors disabled:opacity-50 mt-2">
            {changeMutation.isPending ? "Changing…" : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── HR Onboarding Panel (People Lead only) ───────────────────────────────────
function HROnboardingPanel() {
  const [form, setForm] = useState({ name: "", email: "", department: "Studios", institutionalRole: "staff" as "staff" | "lead" });
  const [tempPassword, setTempPassword] = useState("");
  const allStaffQuery = trpc.institutional.allStaff.useQuery();
  const createMutation = trpc.institutional.createStaffMember.useMutation({
    onSuccess: (data: any) => {
      setTempPassword(data.tempPassword);
      setForm({ name: "", email: "", department: "Studios", institutionalRole: "staff" });
      allStaffQuery.refetch();
      toast.success("Staff member created.");
    },
    onError: (e) => toast.error(e.message),
  });
  const deactivateMutation = trpc.institutional.deactivateStaff.useMutation({
    onSuccess: () => { allStaffQuery.refetch(); toast.success("Staff member deactivated."); },
    onError: (e) => toast.error(e.message),
  });
  const resetMutation = trpc.institutional.resetStaffPassword.useMutation({
    onSuccess: (data: any) => { setTempPassword(data.tempPassword); toast.success("Password reset."); },
    onError: (e) => toast.error(e.message),
  });
  const DEPTS = ["CSO", "Systems", "Studios", "Bizdoc", "Innovation", "Growth", "People", "Ledger", "RIDI"];
  const allStaff = allStaffQuery.data ?? [];
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-100 p-6">
        <h3 className="text-sm font-semibold text-stone-900 mb-4">Onboard New Staff Member</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div><label className="text-xs font-medium text-stone-600 block mb-1">Full Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Amina Yusuf"
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E]" /></div>
          <div><label className="text-xs font-medium text-stone-600 block mb-1">Email Address</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="amina@hamzury.com"
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E]" /></div>
          <div><label className="text-xs font-medium text-stone-600 block mb-1">Department</label>
            <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E] bg-white">
              {DEPTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select></div>
          <div><label className="text-xs font-medium text-stone-600 block mb-1">Role</label>
            <select value={form.institutionalRole} onChange={(e) => setForm({ ...form, institutionalRole: e.target.value as "staff" | "lead" })}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E] bg-white">
              <option value="staff">Staff</option>
              <option value="lead">Lead</option>
            </select></div>
        </div>
        <button onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending || !form.name || !form.email}
          className="bg-[#1B4D3E] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#163d30] transition-colors disabled:opacity-50">
          {createMutation.isPending ? "Creating…" : "Create Staff Account"}
        </button>
        {tempPassword && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="text-xs font-semibold text-green-700 mb-1">Account Created — Share these credentials:</div>
            <div className="text-sm text-green-800 font-mono bg-white rounded-lg px-3 py-2 border border-green-200">
              Temporary Password: <strong>{tempPassword}</strong>
            </div>
            <div className="text-xs text-green-600 mt-2">Tell the staff member to log in at /portal and change their password immediately.</div>
            <button onClick={() => setTempPassword("")} className="mt-2 text-xs text-green-600 hover:underline">Dismiss</button>
          </div>
        )}
      </div>
      <div className="bg-white rounded-2xl border border-stone-100 p-6">
        <h3 className="text-sm font-semibold text-stone-900 mb-4">Staff Directory ({allStaff.length} members)</h3>
        <div className="space-y-2">
          {allStaff.map((s: any) => (
            <div key={s.staffId} className="flex items-center justify-between p-3 rounded-xl border border-stone-100 hover:border-stone-200 transition-colors">
              <div>
                <div className="text-sm font-medium text-stone-900">{s.name}</div>
                <div className="text-xs text-stone-400">{s.email} · {s.primaryDepartment} · {s.institutionalRole}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => resetMutation.mutate({ staffId: s.staffId })}
                  className="text-xs text-[#1B4D3E] border border-[#1B4D3E]/30 px-2 py-1 rounded-lg hover:bg-[#1B4D3E]/5 transition-colors">
                  Reset PW
                </button>
                {s.isActive && (
                  <button onClick={() => deactivateMutation.mutate({ staffId: s.staffId })}
                    className="text-xs text-red-600 border border-red-200 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Lead Weekly Report Form ──────────────────────────────────────────────────
function LeadReportForm({ department, staffId }: { department: string; staffId: string }) {
  const [form, setForm] = useState({ win1: "", win2: "", win3: "", blocker1: "", blocker2: "", keyInfo: "", tasksCompleted: 0, tasksInProgress: 0, tasksOverdue: 0 });
  const submitMutation = trpc.institutional.submitLeadReport.useMutation({
    onSuccess: () => { toast.success("Weekly report submitted."); setForm({ win1: "", win2: "", win3: "", blocker1: "", blocker2: "", keyInfo: "", tasksCompleted: 0, tasksInProgress: 0, tasksOverdue: 0 }); },
    onError: (e) => toast.error(e.message),
  });
  const submit = () => {
    if (!form.win1 || !form.blocker1) { toast.error("Please fill in at least one win and one blocker."); return; }
    submitMutation.mutate({
      win1: form.win1,
      win2: form.win2 || "N/A",
      win3: form.win3 || "N/A",
      blocker1: form.blocker1,
      blocker2: form.blocker2 || "N/A",
      keyInfo: form.keyInfo || "No additional info",
      tasksCompleted: form.tasksCompleted,
      tasksInProgress: form.tasksInProgress,
      tasksOverdue: form.tasksOverdue,
    });
  };
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-6 max-w-2xl">
      <h3 className="text-sm font-semibold text-stone-900 mb-1">Weekly Department Report</h3>
      <p className="text-xs text-stone-400 mb-5">Submit every Friday. This goes to the CEO and Founder.</p>
      <div className="space-y-4">
        <div>
          <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">3 Wins This Week</div>
          {(["win1", "win2", "win3"] as const).map((k, i) => (
            <input key={k} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              placeholder={`Win ${i + 1}${i === 0 ? " (required)" : " (optional)"}`}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E] mb-2" />
          ))}
        </div>
        <div>
          <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">Blockers / Challenges</div>
          {(["blocker1", "blocker2"] as const).map((k, i) => (
            <input key={k} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              placeholder={`Blocker ${i + 1}${i === 0 ? " (required)" : " (optional)"}`}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E] mb-2" />
          ))}
        </div>
        <div>
          <label className="text-xs font-medium text-stone-600 block mb-1">Key Info / Highlight</label>
          <input value={form.keyInfo} onChange={(e) => setForm({ ...form, keyInfo: e.target.value })} placeholder="e.g. 3 clients onboarded, revenue target hit"
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E]" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-stone-600 block mb-1">Completed</label>
            <input type="number" min={0} value={form.tasksCompleted} onChange={(e) => setForm({ ...form, tasksCompleted: parseInt(e.target.value) || 0 })}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E]" /></div>
          <div>
            <label className="text-xs font-medium text-stone-600 block mb-1">In Progress</label>
            <input type="number" min={0} value={form.tasksInProgress} onChange={(e) => setForm({ ...form, tasksInProgress: parseInt(e.target.value) || 0 })}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E]" /></div>
          <div>
            <label className="text-xs font-medium text-stone-600 block mb-1">Overdue</label>
            <input type="number" min={0} value={form.tasksOverdue} onChange={(e) => setForm({ ...form, tasksOverdue: parseInt(e.target.value) || 0 })}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E]" /></div>
        </div>
        <button onClick={submit} disabled={submitMutation.isPending}
          className="bg-[#1B4D3E] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#163d30] transition-colors disabled:opacity-50">
          {submitMutation.isPending ? "Submitting…" : "Submit Weekly Report"}
        </button>
      </div>
    </div>
  );
}

type TaskStage = "pre" | "during" | "post" | "review" | "approved" | "rejected" | "closed";

const STAGE_LABEL: Record<TaskStage, string> = {
  pre: "Pre-Task",
  during: "In Progress",
  post: "Post-Task",
  review: "In Review",
  approved: "Approved",
  rejected: "Returned",
  closed: "Closed",
};

const STAGE_COLOR: Record<TaskStage, string> = {
  pre: "bg-stone-100 text-stone-600",
  during: "bg-blue-50 text-blue-700",
  post: "bg-amber-50 text-amber-700",
  review: "bg-purple-50 text-purple-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
  closed: "bg-gray-100 text-gray-500",
};

const DEPARTMENTS = ["CSO", "Systems", "Studios", "Bizdoc", "Innovation", "Growth", "People", "Ledger", "RIDI"];

// ─── Department personalisation maps ─────────────────────────────────────────
const DEPT_DISPLAY_NAME: Record<string, string> = {
  Studios: "Studios Department",
  Bizdoc: "Bizdoc Department",
  Bizdev: "Business Development",
  Innovation: "Innovation Hub",
  Robotics: "Robotics Department",
  Growth: "Growth & Quality",
  People: "People & HR",
  Ledger: "Finance & Ledger",
  CSO: "Client Success Office",
  RIDI: "RIDI Department",
  Systems: "Systems Department",
  Executive: "Executive Office",
};

const DEPT_FOCUS_AREAS: Record<string, string[]> = {
  Studios: ["Brand Identity", "Visual Design", "Content Production", "Creative Assets", "Photography & Video"],
  Bizdoc: ["Business Plan", "Company Profile", "Policy Document", "Pitch Deck", "Feasibility Study", "SOP"],
  Bizdev: ["Market Research", "Partnership Outreach", "Agent Network", "Proposal Support", "Lead Nurture"],
  Innovation: ["Executive Class", "Young Innovators", "Tech Bootcamp", "Internship", "Corporate Training", "Robotics"],
  Robotics: ["Robotics Curriculum", "Cohort Management", "Equipment & Lab", "Student Assessment", "Competitions"],
  Growth: ["Quality Review", "Deliverable Audit", "Process Improvement", "Client Satisfaction", "Standards Compliance"],
  People: ["Staff Onboarding", "HR Policy", "Access Management", "Staff Welfare", "Performance Review"],
  Ledger: ["Invoice Management", "Expense Approval", "Commission Tracking", "RIDI Allocation", "Financial Reporting"],
  CSO: ["Lead Qualification", "Client Onboarding", "Clarity Report", "Client Follow-up", "Nurture Campaign"],
  RIDI: ["Scholarship Review", "Donation Management", "Rural Outreach", "Programme Placement", "Impact Reporting"],
  Systems: ["IT Infrastructure", "Software Setup", "System Maintenance", "Data Management", "Security"],
};

// ─── Assign Task Modal ─────────────────────────────────────────────────────────
function AssignTaskModal({
  department,
  onClose,
  onSuccess,
}: {
  department: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    title: "",
    assignedToStaffId: "",
    department,
    serviceType: "",
    clientName: "",
    priority: "normal" as "normal" | "urgent",
    deadline: "",
    notes: "",
  });

  const staffQuery = trpc.institutional.allStaff.useQuery();
  const serviceTypesQuery = trpc.institutional.serviceTypes.useQuery({ department: form.department });
  const assignMutation = trpc.institutional.assignTask.useMutation({
    onSuccess: () => { onSuccess(); onClose(); },
  });

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  // Filter staff to show own dept first
  const deptStaff = (staffQuery.data ?? []).filter((s) => s.primaryDepartment === department);
  const otherStaff = (staffQuery.data ?? []).filter((s) => s.primaryDepartment !== department);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        <h2 className="text-xl font-semibold text-stone-900 mb-6">Assign Task</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Task Title</label>
            <input
              className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/30"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Brand Identity Design for Acme Ltd"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Service Type</label>
              <select
                className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                value={form.serviceType}
                onChange={(e) => set("serviceType", e.target.value)}
              >
                <option value="">Select type</option>
                {(serviceTypesQuery.data ?? []).map((s) => <option key={s} value={s}>{s}</option>)}
                <option value="General Task">General Task</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Priority</label>
              <select
                className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                value={form.priority}
                onChange={(e) => set("priority", e.target.value as "normal" | "urgent")}
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Assign To</label>
            <select
              className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
              value={form.assignedToStaffId}
              onChange={(e) => set("assignedToStaffId", e.target.value)}
            >
              <option value="">Select team member</option>
              {deptStaff.length > 0 && (
                <optgroup label={`${department} Team`}>
                  {deptStaff.map((s) => (
                    <option key={s.staffId} value={s.staffId}>{s.name} ({s.institutionalRole})</option>
                  ))}
                </optgroup>
              )}
              {otherStaff.length > 0 && (
                <optgroup label="Other Departments">
                  {otherStaff.map((s) => (
                    <option key={s.staffId} value={s.staffId}>{s.name} — {s.primaryDepartment}</option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Client (optional)</label>
              <input
                className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                value={form.clientName}
                onChange={(e) => set("clientName", e.target.value)}
                placeholder="Client name"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Deadline</label>
              <input
                type="date"
                className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                value={form.deadline}
                onChange={(e) => set("deadline", e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Brief</label>
            <textarea
              className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Task brief or instructions"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 border border-stone-200 text-stone-600 rounded-lg py-2 text-sm hover:bg-stone-50">Cancel</button>
          <button
            onClick={() => {
              if (!form.title || !form.assignedToStaffId) return;
              assignMutation.mutate({
                title: form.title,
                assignedToStaffId: form.assignedToStaffId,
                department: form.department,
                serviceType: form.serviceType || "General Task",
                clientName: form.clientName || undefined,
                priority: form.priority,
                deadline: form.deadline || undefined,
                notes: form.notes || undefined,
              });
            }}
            disabled={assignMutation.isPending || !form.title || !form.assignedToStaffId}
            className="flex-1 bg-[#1B4D3E] text-white rounded-lg py-2 text-sm hover:bg-[#163d30] disabled:opacity-50"
          >
            {assignMutation.isPending ? "Assigning…" : "Assign Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Review Modal ─────────────────────────────────────────────────────────────
function ReviewModal({
  task,
  staffId,
  onClose,
  onDone,
}: {
  task: { taskRef: string; title: string; assignedToStaffId: string };
  staffId: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const [comment, setComment] = useState("");
  const checklistQuery = trpc.institutional.taskChecklist.useQuery({ taskRef: task.taskRef });
  const auditQuery = trpc.institutional.taskAudit.useQuery({ taskRef: task.taskRef });
  const advanceMutation = trpc.institutional.advanceStage.useMutation({
    onSuccess: () => { onDone(); onClose(); },
  });

  const checklist = checklistQuery.data ?? [];
  const audit = auditQuery.data ?? [];

  const preItems = checklist.filter((c) => c.stage === "pre");
  const duringItems = checklist.filter((c) => c.stage === "during");
  const postItems = checklist.filter((c) => c.stage === "post");

  const allCompleted = checklist.filter((c) => c.isRequired).every((c) => c.isCompleted);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-stone-900">{task.title}</h2>
            <div className="text-xs text-stone-400 mt-1">{task.taskRef} · Assigned to {task.assignedToStaffId}</div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl leading-none">×</button>
        </div>

        {/* Checklist review */}
        <div className="space-y-6 mb-6">
          {[
            { label: "Pre-Task", items: preItems },
            { label: "During Task", items: duringItems },
            { label: "Post-Task", items: postItems },
          ].map(({ label, items }) => items.length > 0 && (
            <div key={label}>
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">{label}</div>
              <div className="space-y-1.5">
                {items.map((item) => (
                  <div key={item.id} className={`flex items-start gap-2 p-2 rounded-lg ${item.isCompleted ? "bg-green-50" : "bg-red-50"}`}>
                    <div className={`w-4 h-4 rounded flex-shrink-0 mt-0.5 flex items-center justify-center text-xs ${item.isCompleted ? "bg-green-500 text-white" : "bg-red-200 text-red-500"}`}>
                      {item.isCompleted ? "✓" : "○"}
                    </div>
                    <span className={`text-xs ${item.isCompleted ? "text-green-800" : "text-red-700"}`}>{item.stepText}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Task Thread */}
        <div className="mb-6">
          <TaskComments taskRef={task.taskRef} compact />
        </div>
        {/* Audit trail */}
        {audit.length > 0 && (
          <div className="mb-6">
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Activity Log</div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {audit.map((entry) => (
                <div key={entry.id} className="text-xs text-stone-500 flex gap-2">
                  <span className="text-stone-300 flex-shrink-0">{new Date(entry.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                  <span>{entry.staffName}: {entry.action}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejection comment */}
        <div className="mb-6">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Comment (required for rejection)</label>
          <textarea
            className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Feedback for the staff member…"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              if (!comment) { alert("Please add a comment explaining what needs to be corrected."); return; }
              advanceMutation.mutate({ taskRef: task.taskRef, stage: "rejected", rejectionComment: comment });
            }}
            disabled={advanceMutation.isPending}
            className="flex-1 border border-red-200 text-red-600 rounded-lg py-2 text-sm hover:bg-red-50 disabled:opacity-50"
          >
            Return for Revision
          </button>
          <button
            onClick={() => advanceMutation.mutate({ taskRef: task.taskRef, stage: "approved" })}
            disabled={advanceMutation.isPending}
            className="flex-1 bg-[#1B4D3E] text-white rounded-lg py-2 text-sm hover:bg-[#163d30] disabled:opacity-50"
          >
            {advanceMutation.isPending ? "Processing…" : "Approve & Close"}
          </button>
        </div>

        {!allCompleted && (
          <p className="text-xs text-amber-600 text-center mt-3">
            Note: Some required checklist items are incomplete. Review carefully before approving.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Quality Gate Panel (Growth Lead only) ──────────────────────────────────
function QualityGatePanel({ gateApprove, utils }: { gateApprove: any; utils: any }) {
  const allTasksQuery = trpc.institutional.allTasks.useQuery();
  const allTasks = allTasksQuery.data ?? [];
  // Show tasks in review stage from any department
  const reviewTasks = allTasks.filter((t: any) => t.lifecycleStage === "review");
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-900 mb-1">Quality Gate</h2>
        <p className="text-sm text-stone-400">All tasks awaiting final approval before delivery. Nothing leaves HAMZURY without passing this gate.</p>
      </div>
      {allTasksQuery.isLoading ? (
        <div className="text-center py-12 text-stone-400">Loading gate queue…</div>
      ) : reviewTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
          <div className="text-stone-300 text-4xl mb-4">✓</div>
          <div className="text-stone-500 text-sm">Gate is clear. No tasks awaiting review.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {reviewTasks.map((task: any) => (
            <div key={task.taskRef} className="bg-white rounded-2xl border border-stone-100 p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-stone-400">{task.taskRef}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      task.priority === "urgent" ? "bg-red-100 text-red-700" :
                      task.priority === "high" ? "bg-orange-100 text-orange-700" :
                      "bg-stone-100 text-stone-600"
                    }`}>{task.priority}</span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">{task.department}</span>
                  </div>
                  <div className="text-sm font-semibold text-stone-900 mb-1">{task.title}</div>
                  {task.description && <div className="text-xs text-stone-500 mb-2">{task.description}</div>}
                  {task.deadline && <div className="text-xs text-stone-400">Deadline: {new Date(task.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => gateApprove.mutate({ taskRef: task.taskRef, action: "approve" })}
                    disabled={gateApprove.isPending}
                    className="bg-green-600 text-white text-xs px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                    Approve
                  </button>
                  <button
                    onClick={() => gateApprove.mutate({ taskRef: task.taskRef, action: "return" })}
                    disabled={gateApprove.isPending}
                    className="bg-amber-500 text-white text-xs px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50">
                    Return
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Lead Dashboard ───────────────────────────────────────────────────────────
export default function LeadDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "review" | "team" | "report" | "hr" | "agent" | "qualitygate">("overview");
  const [showAssign, setShowAssign] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [reviewingTask, setReviewingTask] = useState<{ taskRef: string; title: string; assignedToStaffId: string } | null>(null);

  // Get profile from session
  const profileQuery = trpc.institutional.myProfile.useQuery();
  const profile = profileQuery.data;
  const department = profile?.primaryDepartment ?? "Studios";
  const staffId = profile?.staffId ?? "";

  const deptTasksQuery = trpc.institutional.departmentTasks.useQuery();
  const reviewQueueQuery = trpc.institutional.reviewQueue.useQuery();
  const allStaffQuery = trpc.institutional.allStaff.useQuery();
  const allTasksForGateQuery = trpc.institutional.allTasks.useQuery(undefined, { enabled: false });
  const utils = trpc.useUtils();
  const gateApprove = trpc.institutional.advanceStage.useMutation({ onSuccess: () => { utils.institutional.allTasks.invalidate(); utils.institutional.departmentTasks.invalidate(); } });

  const deptTasks = deptTasksQuery.data ?? [];
  const reviewQueue = reviewQueueQuery.data ?? [];
  const allStaff = allStaffQuery.data ?? [];

  const deptStaff = allStaff.filter((s) => s.primaryDepartment === department);

  const activeTasks = deptTasks.filter((t) => !["closed", "approved"].includes(t.lifecycleStage)).length;
  const urgentTasks = deptTasks.filter((t) => t.priority === "urgent" && !["closed", "approved"].includes(t.lifecycleStage)).length;

  const logout = trpc.auth.logout.useMutation({ onSuccess: () => navigate("/portal") });

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Green human avatar */}
            <div className="w-11 h-11 bg-[#1B4D3E]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#1B4D3E]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
            <div>
              <div className="text-base font-bold text-[#1B4D3E] leading-tight">{DEPT_DISPLAY_NAME[department] ?? department + " Department"}</div>
              <div className="text-xs text-stone-400 mt-0.5">{profile?.name ?? "Lead"} · Department Lead</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {reviewQueue.length > 0 && (
              <button onClick={() => setActiveTab("review")}
                className="relative bg-purple-50 text-purple-700 text-sm px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors">
                Review Queue
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">{reviewQueue.length}</span>
              </button>
            )}
            <button onClick={() => setShowAssign(true)} className="bg-[#1B4D3E] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#163d30] transition-colors">
              + Assign Task
            </button>
            <NotificationBell />
            <div className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="text-stone-400 hover:text-stone-600 transition-colors p-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-stone-100 z-50 overflow-hidden">
                  <button onClick={() => { setShowPasswordChange(true); setShowProfileMenu(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors">Change Password</button>
                  <button onClick={() => logout.mutate()}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-stone-100">Sign Out</button>
                </div>
              )}
              {showProfileMenu && <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white rounded-xl p-1 border border-stone-100 flex-wrap">
          {([
            { id: "overview", label: "Overview" },
            { id: "tasks", label: "Tasks" },
            { id: "review", label: "Review" },
            { id: "team", label: "Team" },
            { id: "report", label: "Weekly Report" },
            ...(department === "People" ? [{ id: "hr", label: "HR / Onboarding" }] : []),
            ...(department === "Growth" ? [{ id: "qualitygate", label: "Quality Gate" }] : []),
            { id: "agent", label: "AI Agent" },
          ] as { id: string; label: string }[]).map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === tab.id ? "bg-[#1B4D3E] text-white" : "text-stone-500 hover:text-stone-700"
              }`}>
              {tab.label}
              {tab.id === "review" && reviewQueue.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">{reviewQueue.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Department identity banner */}
            <div className="bg-[#1B4D3E] rounded-2xl p-6 flex items-center gap-5">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-white font-bold text-lg leading-tight">{DEPT_DISPLAY_NAME[department] ?? department}</div>
                <div className="text-white/60 text-sm mt-0.5">Welcome, {profile?.name ?? "Lead"}</div>
                {(DEPT_FOCUS_AREAS[department] ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(DEPT_FOCUS_AREAS[department] ?? []).map((area) => (
                      <span key={area} className="text-xs bg-white/10 text-white/80 px-3 py-1 rounded-full">{area}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Active Tasks", value: activeTasks },
                { label: "Urgent", value: urgentTasks },
                { label: "In Review", value: reviewQueue.length },
                { label: "Team Members", value: deptStaff.length },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white rounded-2xl p-6 border border-stone-100">
                  <div className="text-3xl font-light text-stone-900 mb-1">{kpi.value}</div>
                  <div className="text-sm font-medium text-stone-700">{kpi.label}</div>
                </div>
              ))}
            </div>
            {/* Recent tasks */}
            <div className="bg-white rounded-2xl border border-stone-100 p-6">
              <h3 className="text-sm font-semibold text-stone-900 mb-4">Recent {DEPT_DISPLAY_NAME[department] ?? department} Tasks</h3>
              {deptTasks.slice(0, 5).length === 0 ? (
                <p className="text-sm text-stone-400 text-center py-6">No tasks yet. Assign the first task to your team.</p>
              ) : (
                <div className="space-y-2">
                  {deptTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.priority === "urgent" ? "bg-red-500" : "bg-stone-300"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-stone-800 truncate">{task.title}</div>
                        <div className="text-xs text-stone-400">{task.assignedToStaffId} · {task.taskRef}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STAGE_COLOR[task.lifecycleStage as TaskStage]}`}>
                        {STAGE_LABEL[task.lifecycleStage as TaskStage]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tasks tab */}
        {activeTab === "tasks" && (
          <div className="space-y-3">
            {deptTasks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
                <p className="text-stone-400 text-sm">No tasks in your department yet.</p>
                <button onClick={() => setShowAssign(true)} className="mt-4 text-[#1B4D3E] text-sm font-medium hover:underline">
                  Assign the first task →
                </button>
              </div>
            ) : (
              deptTasks.map((task) => (
                <div key={task.id} className="bg-white rounded-xl border border-stone-100 p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${task.priority === "urgent" ? "bg-red-500" : "bg-stone-300"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-stone-900">{task.title}</span>
                        {task.priority === "urgent" && (
                          <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">Urgent</span>
                        )}
                      </div>
                      <div className="text-xs text-stone-400 mt-1">
                        {task.taskRef} · {task.serviceType}
                        {task.clientName && ` · ${task.clientName}`}
                      </div>
                      <div className="text-xs text-stone-400 mt-0.5">
                        Assigned to: {task.assignedToStaffId}
                        {task.deadline && ` · Due: ${new Date(task.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${STAGE_COLOR[task.lifecycleStage as TaskStage]}`}>
                      {STAGE_LABEL[task.lifecycleStage as TaskStage]}
                    </span>
                  </div>
                  {task.notes && (
                    <div className="mt-2 ml-5 text-xs text-stone-500 bg-stone-50 rounded-lg px-3 py-2">{task.notes}</div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Review Queue */}
        {activeTab === "review" && (
          <div className="space-y-4">
            <div className="text-sm text-stone-500 mb-4">
              Tasks submitted by your team for approval. Review the checklist before approving or returning for revision.
            </div>
            {reviewQueue.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
                <p className="text-stone-400 text-sm">No tasks awaiting review.</p>
              </div>
            ) : (
              reviewQueue.map((task) => (
                <div key={task.id} className="bg-white rounded-xl border border-purple-100 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-stone-900">{task.title}</div>
                      <div className="text-xs text-stone-400 mt-1">
                        {task.taskRef} · {task.serviceType} · Submitted by {task.assignedToStaffId}
                      </div>
                      {task.clientName && <div className="text-xs text-stone-400">Client: {task.clientName}</div>}
                    </div>
                    <button
                      onClick={() => setReviewingTask({ taskRef: task.taskRef, title: task.title, assignedToStaffId: task.assignedToStaffId })}
                      className="bg-purple-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex-shrink-0"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Agent tab */}
        {activeTab === "agent" && (
          <div className="max-w-2xl space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-stone-700 mb-1">AI Assistant</h3>
              <p className="text-xs text-stone-400 mb-4">
                {department === "CSO"
                  ? "Draft client messages, qualify leads, and manage client communication in the HAMZURY voice."
                  : department === "Bizdoc"
                  ? "Research compliance requirements, CAC processes, tax obligations, and regulatory guidance."
                  : "Research, draft content, and get AI assistance for your department work."}
              </p>
              {department === "CSO" ? (
                <CSOAgent />
              ) : department === "Bizdoc" ? (
                <BizdocAgent />
              ) : (
                <CSOAgent />
              )}
            </div>
          </div>
        )}

        {/* Team tab */}
        {activeTab === "report" && <LeadReportForm department={department} staffId={staffId} />}
        {activeTab === "hr" && department === "People" && <HROnboardingPanel />}
        {activeTab === "qualitygate" && department === "Growth" && (
          <QualityGatePanel gateApprove={gateApprove} utils={utils} />
        )}
        {activeTab === "team" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deptStaff.map((member) => {
              const memberTasks = deptTasks.filter((t) => t.assignedToStaffId === member.staffId);
              const active = memberTasks.filter((t) => !["closed", "approved"].includes(t.lifecycleStage)).length;
              return (
                <div key={member.staffId} className="bg-white rounded-2xl border border-stone-100 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-semibold text-stone-900">{member.name}</div>
                      <div className="text-xs text-stone-400 mt-0.5">{member.email}</div>
                      <div className="text-xs text-stone-500 mt-1 capitalize">{member.institutionalRole}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-light text-stone-900">{active}</div>
                      <div className="text-xs text-stone-400">active tasks</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showPasswordChange && <PasswordChangeModal onClose={() => setShowPasswordChange(false)} />}
      {showAssign && (
        <AssignTaskModal
          department={department}
          onClose={() => setShowAssign(false)}
          onSuccess={() => {
            utils.institutional.departmentTasks.invalidate();
            utils.institutional.reviewQueue.invalidate();
          }}
        />
      )}

      {reviewingTask && (
        <ReviewModal
          task={reviewingTask}
          staffId={staffId}
          onClose={() => setReviewingTask(null)}
          onDone={() => {
            utils.institutional.reviewQueue.invalidate();
            utils.institutional.departmentTasks.invalidate();
          }}
        />
      )}
    </div>
  );
}
