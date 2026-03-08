import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

// ─── Types ────────────────────────────────────────────────────────────────────
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

const PRIORITY_DOT: Record<string, string> = {
  urgent: "bg-red-500",
  normal: "bg-stone-300",
};

const DEPARTMENTS = ["All", "CSO", "Systems", "Studios", "Bizdoc", "Innovation", "Growth", "People", "Ledger", "RIDI"];

// ─── Assign Task Modal ────────────────────────────────────────────────────────
function AssignTaskModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    title: "",
    assignedToStaffId: "",
    department: "Studios",
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

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        <h2 className="text-xl font-semibold text-stone-900 mb-6">Assign New Task</h2>

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
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Department</label>
              <select
                className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/30"
                value={form.department}
                onChange={(e) => set("department", e.target.value)}
              >
                {DEPARTMENTS.filter((d) => d !== "All").map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Service Type</label>
              <select
                className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/30"
                value={form.serviceType}
                onChange={(e) => set("serviceType", e.target.value)}
              >
                <option value="">Select service type</option>
                {(serviceTypesQuery.data ?? []).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
                <option value="General Task">General Task</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Assign To</label>
            <select
              className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/30"
              value={form.assignedToStaffId}
              onChange={(e) => set("assignedToStaffId", e.target.value)}
            >
              <option value="">Select staff member</option>
              {(staffQuery.data ?? []).map((s) => (
                <option key={s.staffId} value={s.staffId}>
                  {s.name} — {s.primaryDepartment} ({s.institutionalRole})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Client Name (optional)</label>
              <input
                className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/30"
                value={form.clientName}
                onChange={(e) => set("clientName", e.target.value)}
                placeholder="Client or project name"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Priority</label>
              <select
                className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/30"
                value={form.priority}
                onChange={(e) => set("priority", e.target.value as "normal" | "urgent")}
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Deadline</label>
            <input
              type="date"
              className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/30"
              value={form.deadline}
              onChange={(e) => set("deadline", e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Brief / Notes</label>
            <textarea
              className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/30 resize-none"
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Task brief, instructions, or context"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-stone-200 text-stone-600 rounded-lg py-2 text-sm hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!form.title || !form.assignedToStaffId || !form.serviceType) return;
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
            className="flex-1 bg-[#1B4D3E] text-white rounded-lg py-2 text-sm hover:bg-[#163d30] transition-colors disabled:opacity-50"
          >
            {assignMutation.isPending ? "Assigning…" : "Assign Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CEO Dashboard ────────────────────────────────────────────────────────────
export default function CEODashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "team" | "clients" | "intakes" | "leadreports" | "report">("overview");
  const [deptFilter, setDeptFilter] = useState("All");
  const [showAssign, setShowAssign] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const allTasksQuery = trpc.institutional.allTasks.useQuery();
  const allStaffQuery = trpc.institutional.allStaff.useQuery();
  const allClientsQuery = trpc.admin.allClients.useQuery(undefined, { retry: false });
  const latestReportQuery = trpc.weeklyReport.latest.useQuery();
  const intakesQuery = trpc.intake.getAll.useQuery({});
  const leadReportsQuery = trpc.institutional.allLeadReports.useQuery();
  const utils = trpc.useUtils();
  const updateIntakeStatus = trpc.intake.updateStatus.useMutation({ onSuccess: () => utils.intake.getAll.invalidate() });

  // Friday report form state
  const [reportForm, setReportForm] = useState({
    goingWell1: "", goingWell2: "", goingWell3: "",
    toWatch1: "", toWatch2: "", toWatch3: "",
    keyInfo: "",
    revenueThisWeek: 0, newClients: 0, activeTasks: 0,
    overdueTasks: 0, staffPresent: 0, staffTotal: 0, pendingApprovals: 0,
  });
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const submitReportMutation = trpc.weeklyReport.submit.useMutation({
    onSuccess: () => { setReportSubmitted(true); utils.weeklyReport.latest.invalidate(); },
  });

  const tasks = allTasksQuery.data ?? [];
  const staff = allStaffQuery.data ?? [];
  const clients = allClientsQuery.data ?? [];

  const filteredTasks = deptFilter === "All" ? tasks : tasks.filter((t) => t.department === deptFilter);

  // Stats
  const activeTasks = tasks.filter((t) => !["closed", "approved"].includes(t.lifecycleStage)).length;
  const inReview = tasks.filter((t) => t.lifecycleStage === "review").length;
  const urgentTasks = tasks.filter((t) => t.priority === "urgent" && !["closed", "approved"].includes(t.lifecycleStage)).length;
  const completedTasks = tasks.filter((t) => ["closed", "approved"].includes(t.lifecycleStage)).length;

  const logout = trpc.auth.logout.useMutation({ onSuccess: () => navigate("/portal") });

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[#1B4D3E] rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">H</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-stone-900">CEO Command Centre</div>
              <div className="text-xs text-stone-400">Idris Ibrahim · Operational Command</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAssign(true)}
              className="bg-[#1B4D3E] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#163d30] transition-colors"
            >
              + Assign Task
            </button>
            <button
              onClick={() => logout.mutate()}
              className="text-stone-400 text-sm hover:text-stone-600 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white rounded-xl p-1 border border-stone-100 w-fit">
          {(["overview", "tasks", "team", "clients", "intakes", "leadreports", "report"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-[#1B4D3E] text-white"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {tab === "intakes" ? "Intakes" : tab === "leadreports" ? "Lead Reports" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Active Tasks", value: activeTasks, sub: "across all departments" },
                { label: "In Review", value: inReview, sub: "awaiting lead approval" },
                { label: "Urgent", value: urgentTasks, sub: "require immediate attention" },
                { label: "Completed", value: completedTasks, sub: "this cycle" },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white rounded-2xl p-6 border border-stone-100">
                  <div className="text-3xl font-light text-stone-900 mb-1">{kpi.value}</div>
                  <div className="text-sm font-medium text-stone-700">{kpi.label}</div>
                  <div className="text-xs text-stone-400 mt-1">{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* Department breakdown */}
            <div className="bg-white rounded-2xl border border-stone-100 p-6">
              <h3 className="text-sm font-semibold text-stone-900 mb-4">Department Activity</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DEPARTMENTS.filter((d) => d !== "All").map((dept) => {
                  const deptTasks = tasks.filter((t) => t.department === dept);
                  const active = deptTasks.filter((t) => !["closed", "approved"].includes(t.lifecycleStage)).length;
                  return (
                    <div key={dept} className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                      <div className="text-xs font-medium text-stone-500 mb-1">{dept}</div>
                      <div className="text-xl font-light text-stone-900">{active}</div>
                      <div className="text-xs text-stone-400">active tasks</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent tasks */}
            <div className="bg-white rounded-2xl border border-stone-100 p-6">
              <h3 className="text-sm font-semibold text-stone-900 mb-4">Recent Tasks</h3>
              {tasks.slice(0, 6).length === 0 ? (
                <p className="text-sm text-stone-400 text-center py-8">No tasks yet. Assign the first task to get started.</p>
              ) : (
                <div className="space-y-2">
                  {tasks.slice(0, 6).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 cursor-pointer transition-colors"
                      onClick={() => { setSelectedTask(task.taskRef); setActiveTab("tasks"); }}
                    >
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[task.priority]}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-stone-800 truncate">{task.title}</div>
                        <div className="text-xs text-stone-400">{task.department} · {task.taskRef}</div>
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
          <div className="space-y-6">
            {/* Dept filter */}
            <div className="flex gap-2 flex-wrap">
              {DEPARTMENTS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDeptFilter(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    deptFilter === d ? "bg-[#1B4D3E] text-white" : "bg-white text-stone-500 border border-stone-200 hover:border-stone-300"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {filteredTasks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
                <p className="text-stone-400 text-sm">No tasks in this department yet.</p>
                <button
                  onClick={() => setShowAssign(true)}
                  className="mt-4 text-[#1B4D3E] text-sm font-medium hover:underline"
                >
                  Assign the first task →
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="bg-white rounded-xl border border-stone-100 p-4 hover:border-stone-200 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${PRIORITY_DOT[task.priority]}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-stone-900">{task.title}</span>
                          {task.priority === "urgent" && (
                            <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">Urgent</span>
                          )}
                        </div>
                        <div className="text-xs text-stone-400 mt-1">
                          {task.taskRef} · {task.department} · {task.serviceType}
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
                      <div className="mt-2 ml-5 text-xs text-stone-500 bg-stone-50 rounded-lg px-3 py-2">
                        {task.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Team tab */}
        {activeTab === "team" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {staff.map((member) => {
                const memberTasks = tasks.filter((t) => t.assignedToStaffId === member.staffId && !["closed", "approved"].includes(t.lifecycleStage));
                return (
                  <div key={member.staffId} className="bg-white rounded-2xl border border-stone-100 p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-semibold text-stone-900">{member.name}</div>
                        <div className="text-xs text-stone-400 mt-0.5">{member.staffId} · {member.primaryDepartment}</div>
                        <div className="text-xs text-stone-500 mt-1 capitalize">{member.institutionalRole}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-light text-stone-900">{memberTasks.length}</div>
                        <div className="text-xs text-stone-400">active tasks</div>
                      </div>
                    </div>
                    {member.secondaryDepartments && JSON.parse(member.secondaryDepartments).length > 0 && (
                      <div className="mt-3 flex gap-1 flex-wrap">
                        {JSON.parse(member.secondaryDepartments).map((d: string) => (
                          <span key={d} className="text-xs bg-stone-50 text-stone-500 px-2 py-0.5 rounded-full border border-stone-100">{d}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Clients tab */}
        {activeTab === "clients" && (
          <div className="space-y-4">
            {clients.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
                <p className="text-stone-400 text-sm">No clients yet. Use the Admin Panel to add clients.</p>
                <Link href="/admin" className="mt-4 text-[#1B4D3E] text-sm font-medium hover:underline block">
                  Go to Admin Panel →
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stone-100">
                      <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Client</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Package</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((c) => (
                      <tr key={c.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-3">
                          <div className="font-medium text-stone-800">{c.name}</div>
                          <div className="text-xs text-stone-400">{c.clientRef}</div>
                        </td>
                        <td className="px-6 py-3 text-stone-600">{c.servicePackage ?? "—"}</td>
                        <td className="px-6 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            c.status === "Active" ? "bg-green-50 text-green-700" :
                            c.status === "Closed" ? "bg-gray-100 text-gray-500" :
                            "bg-amber-50 text-amber-700"
                          }`}>{c.status}</span>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            c.invoiceStatus === "Paid" ? "bg-green-50 text-green-700" :
                            c.invoiceStatus === "Overdue" ? "bg-red-50 text-red-700" :
                            "bg-stone-100 text-stone-500"
                          }`}>{c.invoiceStatus}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Friday Report Tab */}
        {activeTab === "report" && (
          <div className="space-y-6 max-w-7xl mx-auto px-6 py-8">
            {/* Approval Limits Banner */}
            <div className="bg-[#1B4D3E]/5 border border-[#1B4D3E]/20 rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="text-sm font-semibold text-[#1B4D3E] mb-1">Your Approval Authority</div>
                <div className="text-xs text-stone-600">You may approve expenditures and commitments up to <strong>NGN 200,000</strong>. Anything above this threshold requires Founder approval before proceeding.</div>
              </div>
              <div className="flex gap-3">
                <div className="bg-white rounded-xl px-5 py-3 border border-stone-100 text-center">
                  <div className="text-lg font-semibold text-[#1B4D3E]">NGN 200k</div>
                  <div className="text-xs text-stone-400">Your limit</div>
                </div>
                <div className="bg-white rounded-xl px-5 py-3 border border-stone-100 text-center">
                  <div className="text-lg font-semibold text-stone-400">Founder</div>
                  <div className="text-xs text-stone-400">Above limit</div>
                </div>
              </div>
            </div>

            {reportSubmitted ? (
              <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
                <div className="text-4xl mb-4">✅</div>
                <div className="text-lg font-semibold text-stone-900 mb-2">Friday Report Submitted</div>
                <div className="text-sm text-stone-500 mb-6">Your report has been sent to the Founder. They will receive a notification.</div>
                <button onClick={() => setReportSubmitted(false)} className="text-sm text-[#1B4D3E] hover:underline">Submit another report</button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-semibold text-stone-900">Friday CEO Report</h3>
                    <p className="text-xs text-stone-400 mt-1">Submit every Friday. Goes directly to the Founder.</p>
                  </div>
                  {latestReportQuery.data && (
                    <div className="text-xs text-stone-400">Last submitted: {new Date(latestReportQuery.data.createdAt).toLocaleDateString()}</div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Going Well */}
                  <div>
                    <label className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-3 block">3 Things Going Well This Week</label>
                    <div className="space-y-2">
                      {(["goingWell1", "goingWell2", "goingWell3"] as const).map((k, i) => (
                        <input key={k} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200" placeholder={`${i + 1}. Going well...`} value={reportForm[k]} onChange={(e) => setReportForm((p) => ({ ...p, [k]: e.target.value }))} />
                      ))}
                    </div>
                  </div>

                  {/* To Watch */}
                  <div>
                    <label className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-3 block">3 Things To Watch</label>
                    <div className="space-y-2">
                      {(["toWatch1", "toWatch2", "toWatch3"] as const).map((k, i) => (
                        <input key={k} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder={`${i + 1}. Watch this...`} value={reportForm[k]} onChange={(e) => setReportForm((p) => ({ ...p, [k]: e.target.value }))} />
                      ))}
                    </div>
                  </div>

                  {/* Key Info */}
                  <div>
                    <label className="text-xs font-semibold text-[#1B4D3E] uppercase tracking-wider mb-3 block">1 Thing the Founder Needs to Know</label>
                    <textarea className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 resize-none" rows={3} placeholder="The most important thing this week..." value={reportForm.keyInfo} onChange={(e) => setReportForm((p) => ({ ...p, keyInfo: e.target.value }))} />
                  </div>

                  {/* Key Numbers */}
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3 block">Key Numbers This Week</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {([
                        { key: "revenueThisWeek" as const, label: "Revenue (NGN)", placeholder: "0" },
                        { key: "newClients" as const, label: "New Clients", placeholder: "0" },
                        { key: "activeTasks" as const, label: "Active Tasks", placeholder: "0" },
                        { key: "overdueTasks" as const, label: "Overdue Tasks", placeholder: "0" },
                        { key: "staffPresent" as const, label: "Staff Present", placeholder: "0" },
                        { key: "staffTotal" as const, label: "Staff Total", placeholder: "0" },
                        { key: "pendingApprovals" as const, label: "Pending Approvals", placeholder: "0" },
                      ]).map(({ key, label, placeholder }) => (
                        <div key={key}>
                          <label className="text-xs text-stone-400 mb-1 block">{label}</label>
                          <input type="number" min={0} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20" placeholder={placeholder} value={reportForm[key] || ""} onChange={(e) => setReportForm((p) => ({ ...p, [key]: Number(e.target.value) }))} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => submitReportMutation.mutate(reportForm)}
                    disabled={submitReportMutation.isPending || !reportForm.goingWell1 || !reportForm.toWatch1 || !reportForm.keyInfo}
                    className="w-full bg-[#1B4D3E] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#163d30] transition-colors disabled:opacity-50"
                  >
                    {submitReportMutation.isPending ? "Submitting…" : "Submit Friday Report to Founder"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Intake Queue Tab */}
        {activeTab === "intakes" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-stone-900 mb-1">Client Intake Queue</h2>
              <p className="text-sm text-stone-400">All incoming briefs from the public /start form. Assign, review, and update status.</p>
            </div>
            {intakesQuery.isLoading ? (
              <div className="text-center py-12 text-stone-400">Loading intakes…</div>
            ) : (intakesQuery.data ?? []).length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
                <div className="text-stone-300 text-4xl mb-4">📥</div>
                <div className="text-stone-500 text-sm">No intakes yet.</div>
                <div className="text-stone-400 text-xs mt-2">New client briefs from /start will appear here.</div>
              </div>
            ) : (
              <div className="space-y-3">
                {(intakesQuery.data ?? []).map((intake: any) => (
                  <div key={intake.referenceCode} className="bg-white rounded-2xl border border-stone-100 p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-stone-900">{intake.referenceCode}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            intake.status === "new" ? "bg-amber-100 text-amber-700" :
                            intake.status === "reviewing" ? "bg-blue-100 text-blue-700" :
                            intake.status === "in_progress" ? "bg-green-100 text-green-700" :
                            "bg-stone-100 text-stone-500"
                          }`}>{intake.status}</span>
                        </div>
                        <div className="text-sm text-stone-700 font-medium">{intake.name}</div>
                        <div className="text-xs text-stone-400">{intake.department} · {intake.serviceType}</div>
                        <div className="text-xs text-stone-400 mt-0.5">{new Date(intake.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          className="text-xs border border-stone-200 rounded-lg px-2 py-1 focus:outline-none"
                          value={intake.status}
                          onChange={(e) => updateIntakeStatus.mutate({ referenceCode: intake.referenceCode, status: e.target.value as any })}
                        >
                          <option value="new">New</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Lead Reports Tab */}
        {activeTab === "leadreports" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-stone-900 mb-1">Lead Weekly Reports</h2>
              <p className="text-sm text-stone-400">Reports submitted by department leads. Read and track department health.</p>
            </div>
            {leadReportsQuery.isLoading ? (
              <div className="text-center py-12 text-stone-400">Loading reports…</div>
            ) : (leadReportsQuery.data ?? []).length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
                <div className="text-stone-300 text-4xl mb-4">📋</div>
                <div className="text-stone-500 text-sm">No lead reports yet.</div>
                <div className="text-stone-400 text-xs mt-2">Leads submit reports from their dashboards.</div>
              </div>
            ) : (
              <div className="space-y-4">
                {(leadReportsQuery.data ?? []).map((r: any) => (
                  <div key={r.id} className="bg-white rounded-2xl border border-stone-100 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-sm font-semibold text-stone-900">{r.department} — {r.submittedByName}</div>
                        <div className="text-xs text-stone-400">{new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                      <div className="bg-green-50 rounded-xl p-4">
                        <div className="text-xs font-semibold text-green-700 mb-2 uppercase tracking-wider">3 Wins</div>
                        <ol className="text-xs text-stone-700 space-y-1 list-decimal list-inside">
                          <li>{r.win1}</li>
                          <li>{r.win2}</li>
                          <li>{r.win3}</li>
                        </ol>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-4">
                        <div className="text-xs font-semibold text-amber-700 mb-2 uppercase tracking-wider">3 Blockers</div>
                        <ol className="text-xs text-stone-700 space-y-1 list-decimal list-inside">
                          <li>{r.blocker1}</li>
                          <li>{r.blocker2}</li>
                          <li>{r.blocker3 || "—"}</li>
                        </ol>
                      </div>
                    </div>
                    {r.keyInfo && <div className="bg-stone-50 rounded-xl p-4"><div className="text-xs font-semibold text-stone-600 mb-1 uppercase tracking-wider">Key Info</div><p className="text-xs text-stone-700">{r.keyInfo}</p></div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {showAssign && (
        <AssignTaskModal
          onClose={() => setShowAssign(false)}
          onSuccess={() => utils.institutional.allTasks.invalidate()}
        />
      )}
    </div>
  );
}
