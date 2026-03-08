import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

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

// ─── Assign Task Modal ────────────────────────────────────────────────────────
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

// ─── Lead Dashboard ───────────────────────────────────────────────────────────
export default function LeadDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "review" | "team">("overview");
  const [showAssign, setShowAssign] = useState(false);
  const [reviewingTask, setReviewingTask] = useState<{ taskRef: string; title: string; assignedToStaffId: string } | null>(null);

  // Get profile from session
  const profileQuery = trpc.institutional.myProfile.useQuery();
  const profile = profileQuery.data;
  const department = profile?.primaryDepartment ?? "Studios";
  const staffId = profile?.staffId ?? "";

  const deptTasksQuery = trpc.institutional.departmentTasks.useQuery();
  const reviewQueueQuery = trpc.institutional.reviewQueue.useQuery();
  const allStaffQuery = trpc.institutional.allStaff.useQuery();
  const utils = trpc.useUtils();

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
            <div className="w-8 h-8 bg-[#1B4D3E] rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">{department[0]}</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-stone-900">{department} Department</div>
              <div className="text-xs text-stone-400">{profile?.name ?? "Lead"} · Department Lead</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {reviewQueue.length > 0 && (
              <button
                onClick={() => setActiveTab("review")}
                className="relative bg-purple-50 text-purple-700 text-sm px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors"
              >
                Review Queue
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                  {reviewQueue.length}
                </span>
              </button>
            )}
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
          {(["overview", "tasks", "review", "team"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === tab ? "bg-[#1B4D3E] text-white" : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "review" && reviewQueue.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                  {reviewQueue.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
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
              <h3 className="text-sm font-semibold text-stone-900 mb-4">Recent Department Tasks</h3>
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

        {/* Team tab */}
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
