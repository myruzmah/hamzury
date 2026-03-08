import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

// ─── Founder Boardroom ────────────────────────────────────────────────────────
// Strategic oversight: see everything, assign to anyone, private notes

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
        <h2 className="text-xl font-semibold text-stone-900 mb-6">Assign Task</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Task Title</label>
            <input
              className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/30"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Q2 Growth Strategy Review"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Department</label>
              <select
                className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                value={form.department}
                onChange={(e) => set("department", e.target.value)}
              >
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
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
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Assign To</label>
            <select
              className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
              value={form.assignedToStaffId}
              onChange={(e) => set("assignedToStaffId", e.target.value)}
            >
              <option value="">Select person</option>
              {(staffQuery.data ?? []).map((s) => (
                <option key={s.staffId} value={s.staffId}>
                  {s.name} — {s.primaryDepartment} ({s.institutionalRole})
                </option>
              ))}
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
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Deadline</label>
            <input
              type="date"
              className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
              value={form.deadline}
              onChange={(e) => set("deadline", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Brief</label>
            <textarea
              className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Strategic brief or instructions"
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

// ─── Note Editor ──────────────────────────────────────────────────────────────
function NoteEditor({ note, onSave, onCancel }: {
  note?: { id: number; title: string; content: string };
  onSave: (title: string, content: string, id?: number) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        <h2 className="text-xl font-semibold text-stone-900 mb-6">{note ? "Edit Note" : "New Private Note"}</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Title</label>
            <input
              className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/30"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Content</label>
            <textarea
              className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/30 resize-none"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Your private notes, strategic observations, or directives…"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 border border-stone-200 text-stone-600 rounded-lg py-2 text-sm hover:bg-stone-50">Cancel</button>
          <button
            onClick={() => { if (title && content) onSave(title, content, note?.id); }}
            disabled={!title || !content}
            className="flex-1 bg-[#1B4D3E] text-white rounded-lg py-2 text-sm hover:bg-[#163d30] disabled:opacity-50"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FounderDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"boardroom" | "tasks" | "team" | "notes" | "reports" | "leadreports" | "intakes" | "ridi">("boardroom");
  const [showAssign, setShowAssign] = useState(false);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<{ id: number; title: string; content: string } | undefined>();

  const allTasksQuery = trpc.institutional.allTasks.useQuery();
  const allStaffQuery = trpc.institutional.allStaff.useQuery();
  const allClientsQuery = trpc.admin.allClients.useQuery(undefined, { retry: false });
  const notesQuery = trpc.institutional.founderNotes.useQuery();
  const weeklyReportsQuery = trpc.weeklyReport.all.useQuery();
  const leadReportsQuery = trpc.institutional.allLeadReports.useQuery();
  const intakesQuery = trpc.intake.getAll.useQuery({});
  const ridiProgramsQuery = trpc.ridi.programs.useQuery();
  const ridiTotalsQuery = trpc.ridi.totals.useQuery();
  const utils = trpc.useUtils();
  const markReportRead = trpc.weeklyReport.markRead.useMutation({
    onSuccess: () => utils.weeklyReport.all.invalidate(),
  });

  const createNote = trpc.institutional.createFounderNote.useMutation({
    onSuccess: () => { utils.institutional.founderNotes.invalidate(); setShowNoteEditor(false); },
  });
  const updateNote = trpc.institutional.updateFounderNote.useMutation({
    onSuccess: () => { utils.institutional.founderNotes.invalidate(); setShowNoteEditor(false); setEditingNote(undefined); },
  });

  const tasks = allTasksQuery.data ?? [];
  const staff = allStaffQuery.data ?? [];
  const clients = allClientsQuery.data ?? [];
  const notes = notesQuery.data ?? [];

  const logout = trpc.auth.logout.useMutation({ onSuccess: () => navigate("/portal") });

  // Stats
  const activeTasks = tasks.filter((t) => !["closed", "approved"].includes(t.lifecycleStage)).length;
  const urgentTasks = tasks.filter((t) => t.priority === "urgent" && !["closed", "approved"].includes(t.lifecycleStage)).length;
  const inReview = tasks.filter((t) => t.lifecycleStage === "review").length;
  const activeClients = clients.filter((c) => c.status === "Active").length;

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">F</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-stone-900">Founder Boardroom</div>
              <div className="text-xs text-stone-400">Haruna Muhammad · Strategic Oversight</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAssign(true)}
              className="bg-stone-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-stone-800 transition-colors"
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
          {(["boardroom", "tasks", "team", "notes", "reports", "leadreports", "intakes", "ridi"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-stone-900 text-white"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {tab === "leadreports" ? "Lead Reports" : tab === "intakes" ? "Intakes" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Lead Reports Tab */}
        {activeTab === "leadreports" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-stone-900 mb-1">Lead Weekly Reports</h2>
              <p className="text-sm text-stone-400">Reports submitted by department leads. Track department health across HAMZURY.</p>
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
                          <li>{r.win1}</li><li>{r.win2}</li><li>{r.win3}</li>
                        </ol>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-4">
                        <div className="text-xs font-semibold text-amber-700 mb-2 uppercase tracking-wider">3 Blockers</div>
                        <ol className="text-xs text-stone-700 space-y-1 list-decimal list-inside">
                          <li>{r.blocker1}</li><li>{r.blocker2}</li><li>{r.blocker3 || "—"}</li>
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
        {/* Intakes Tab */}
        {activeTab === "intakes" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-stone-900 mb-1">Client Intake Queue</h2>
              <p className="text-sm text-stone-400">All incoming briefs from the public /start form.</p>
            </div>
            {intakesQuery.isLoading ? (
              <div className="text-center py-12 text-stone-400">Loading intakes…</div>
            ) : (intakesQuery.data ?? []).length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
                <div className="text-stone-300 text-4xl mb-4">📥</div>
                <div className="text-stone-500 text-sm">No intakes yet.</div>
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
                            "bg-green-100 text-green-700"
                          }`}>{intake.status}</span>
                        </div>
                        <div className="text-sm text-stone-700 font-medium">{intake.name}</div>
                        <div className="text-xs text-stone-400">{intake.department} · {intake.serviceType}</div>
                        <div className="text-xs text-stone-400 mt-0.5">{new Date(intake.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Boardroom Overview */}
        {activeTab === "boardroom" && (
          <div className="space-y-8">
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Active Tasks", value: activeTasks, note: "organisation-wide" },
                { label: "Urgent", value: urgentTasks, note: "require attention" },
                { label: "In Review", value: inReview, note: "awaiting approval" },
                { label: "Active Clients", value: activeClients, note: "current engagements" },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white rounded-2xl p-6 border border-stone-100">
                  <div className="text-3xl font-light text-stone-900 mb-1">{kpi.value}</div>
                  <div className="text-sm font-medium text-stone-700">{kpi.label}</div>
                  <div className="text-xs text-stone-400 mt-1">{kpi.note}</div>
                </div>
              ))}
            </div>

            {/* Team summary */}
            <div className="bg-white rounded-2xl border border-stone-100 p-6">
              <h3 className="text-sm font-semibold text-stone-900 mb-4">Team ({staff.length} members)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {staff.map((member) => {
                  const memberTasks = tasks.filter(
                    (t) => t.assignedToStaffId === member.staffId && !["closed", "approved"].includes(t.lifecycleStage)
                  );
                  return (
                    <div key={member.staffId} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                      <div>
                        <div className="text-sm font-medium text-stone-800">{member.name}</div>
                        <div className="text-xs text-stone-400 capitalize">{member.institutionalRole} · {member.primaryDepartment}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-light text-stone-900">{memberTasks.length}</div>
                        <div className="text-xs text-stone-400">tasks</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Department health */}
            <div className="bg-white rounded-2xl border border-stone-100 p-6">
              <h3 className="text-sm font-semibold text-stone-900 mb-4">Department Health</h3>
              <div className="space-y-3">
                {DEPARTMENTS.map((dept) => {
                  const deptTasks = tasks.filter((t) => t.department === dept);
                  const active = deptTasks.filter((t) => !["closed", "approved"].includes(t.lifecycleStage)).length;
                  const total = deptTasks.length;
                  const pct = total > 0 ? Math.round(((total - active) / total) * 100) : 0;
                  return (
                    <div key={dept} className="flex items-center gap-4">
                      <div className="w-24 text-xs font-medium text-stone-600">{dept}</div>
                      <div className="flex-1 bg-stone-100 rounded-full h-1.5">
                        <div
                          className="bg-[#1B4D3E] h-1.5 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-xs text-stone-400 w-20 text-right">{active} active / {total} total</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tasks tab */}
        {activeTab === "tasks" && (
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
                <p className="text-stone-400 text-sm">No tasks have been assigned yet.</p>
                <button
                  onClick={() => setShowAssign(true)}
                  className="mt-4 text-stone-900 text-sm font-medium hover:underline"
                >
                  Assign the first task →
                </button>
              </div>
            ) : (
              tasks.map((task) => (
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
                        {task.taskRef} · {task.department} · {task.serviceType}
                        {task.clientName && ` · ${task.clientName}`}
                      </div>
                      <div className="text-xs text-stone-400 mt-0.5">
                        Assigned to: {task.assignedToStaffId}
                        {task.deadline && ` · Due: ${new Date(task.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`}
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

        {/* Team tab */}
        {activeTab === "team" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staff.map((member) => {
              const memberTasks = tasks.filter((t) => t.assignedToStaffId === member.staffId);
              const active = memberTasks.filter((t) => !["closed", "approved"].includes(t.lifecycleStage)).length;
              const completed = memberTasks.filter((t) => ["closed", "approved"].includes(t.lifecycleStage)).length;
              return (
                <div key={member.staffId} className="bg-white rounded-2xl border border-stone-100 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-sm font-semibold text-stone-900">{member.name}</div>
                      <div className="text-xs text-stone-400 mt-0.5">{member.email}</div>
                      <div className="text-xs text-stone-500 mt-1 capitalize">{member.institutionalRole} · {member.primaryDepartment}</div>
                    </div>
                    <div className="text-xs text-stone-400 bg-stone-50 px-3 py-1.5 rounded-lg">{member.staffId}</div>
                  </div>
                  <div className="flex gap-4 text-center">
                    <div>
                      <div className="text-xl font-light text-stone-900">{active}</div>
                      <div className="text-xs text-stone-400">active</div>
                    </div>
                    <div>
                      <div className="text-xl font-light text-stone-900">{completed}</div>
                      <div className="text-xs text-stone-400">completed</div>
                    </div>
                    <div>
                      <div className="text-xl font-light text-stone-900">{memberTasks.length}</div>
                      <div className="text-xs text-stone-400">total</div>
                    </div>
                  </div>
                  {member.secondaryDepartments && JSON.parse(member.secondaryDepartments).length > 0 && (
                    <div className="mt-3 flex gap-1 flex-wrap">
                      <span className="text-xs text-stone-400">Also:</span>
                      {JSON.parse(member.secondaryDepartments).map((d: string) => (
                        <span key={d} className="text-xs bg-stone-50 text-stone-500 px-2 py-0.5 rounded-full border border-stone-100">{d}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Notes tab */}
        {activeTab === "notes" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-stone-900">Private Notes</h3>
              <button
                onClick={() => { setEditingNote(undefined); setShowNoteEditor(true); }}
                className="bg-stone-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-stone-800 transition-colors"
              >
                + New Note
              </button>
            </div>

            {notes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
                <p className="text-stone-400 text-sm">No private notes yet.</p>
                <p className="text-stone-300 text-xs mt-1">Your strategic observations and directives are visible only to you.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white rounded-2xl border border-stone-100 p-5 cursor-pointer hover:border-stone-200 transition-colors"
                    onClick={() => { setEditingNote(note); setShowNoteEditor(true); }}
                  >
                    <div className="text-sm font-semibold text-stone-900 mb-2">{note.title}</div>
                    <div className="text-xs text-stone-500 line-clamp-4 whitespace-pre-wrap">{note.content}</div>
                    <div className="text-xs text-stone-300 mt-3">
                      {new Date(note.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CEO Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            {/* Approval Limits Banner */}
            <div className="bg-stone-900/5 border border-stone-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="text-sm font-semibold text-stone-900 mb-1">Approval Authority Reference</div>
                <div className="text-xs text-stone-600">CEO (Idris) may approve up to <strong>NGN 200,000</strong>. Any expenditure or commitment above this requires your direct approval before proceeding.</div>
              </div>
              <div className="flex gap-3">
                <div className="bg-white rounded-xl px-5 py-3 border border-stone-100 text-center">
                  <div className="text-lg font-semibold text-stone-900">NGN 200k</div>
                  <div className="text-xs text-stone-400">CEO limit</div>
                </div>
                <div className="bg-white rounded-xl px-5 py-3 border border-stone-100 text-center">
                  <div className="text-lg font-semibold text-[#1B4D3E]">You</div>
                  <div className="text-xs text-stone-400">Above limit</div>
                </div>
              </div>
            </div>

            {weeklyReportsQuery.isLoading ? (
              <div className="text-center py-12 text-stone-400">Loading reports…</div>
            ) : (weeklyReportsQuery.data ?? []).length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
                <div className="text-stone-300 text-4xl mb-4">📥</div>
                <div className="text-stone-500 text-sm">No Friday reports submitted yet.</div>
                <div className="text-stone-400 text-xs mt-2">Idris will submit the first one this Friday.</div>
              </div>
            ) : (
              <div className="space-y-4">
                {(weeklyReportsQuery.data ?? []).map((r: any) => (
                  <div key={r.id} className={`bg-white rounded-2xl border p-6 transition-all ${r.readByFounder ? "border-stone-100" : "border-[#1B4D3E]/30 shadow-sm"}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-stone-900">{r.reportRef}</span>
                          {!r.readByFounder && <span className="bg-[#1B4D3E] text-white text-xs px-2 py-0.5 rounded-full">New</span>}
                        </div>
                        <div className="text-xs text-stone-400 mt-0.5">From {r.submittedByName} · Week ending {new Date(r.weekEnding).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                      </div>
                      {!r.readByFounder && (
                        <button onClick={() => markReportRead.mutate({ id: r.id })} className="text-xs text-stone-400 hover:text-stone-600 border border-stone-200 rounded-lg px-3 py-1">Mark read</button>
                      )}
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-green-50 rounded-xl p-4">
                        <div className="text-xs font-semibold text-green-700 mb-2 uppercase tracking-wider">Going Well</div>
                        <ol className="text-xs text-stone-700 space-y-1 list-decimal list-inside">
                          <li>{r.goingWell1}</li>
                          <li>{r.goingWell2}</li>
                          <li>{r.goingWell3}</li>
                        </ol>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-4">
                        <div className="text-xs font-semibold text-amber-700 mb-2 uppercase tracking-wider">To Watch</div>
                        <ol className="text-xs text-stone-700 space-y-1 list-decimal list-inside">
                          <li>{r.toWatch1}</li>
                          <li>{r.toWatch2}</li>
                          <li>{r.toWatch3}</li>
                        </ol>
                      </div>
                      <div className="bg-stone-50 rounded-xl p-4">
                        <div className="text-xs font-semibold text-stone-600 mb-2 uppercase tracking-wider">Key Info</div>
                        <p className="text-xs text-stone-700">{r.keyInfo}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                      {[
                        { label: "Revenue", value: `NGN ${(r.revenueThisWeek ?? 0).toLocaleString()}` },
                        { label: "New Clients", value: r.newClients ?? 0 },
                        { label: "Active Tasks", value: r.activeTasks ?? 0 },
                        { label: "Overdue", value: r.overdueTasks ?? 0 },
                        { label: "Present", value: `${r.staffPresent ?? 0}/${r.staffTotal ?? 0}` },
                        { label: "Approvals", value: r.pendingApprovals ?? 0 },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-stone-50 rounded-lg p-2 text-center">
                          <div className="text-xs font-medium text-stone-800">{value}</div>
                          <div className="text-xs text-stone-400">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RIDI Impact Tab */}
        {activeTab === "ridi" && (
          <div className="space-y-6">
            {/* Totals */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ridiTotalsQuery.isLoading ? null : [
                { label: "Total Beneficiaries", value: ridiTotalsQuery.data?.totalBeneficiaries ?? 0 },
                { label: "Women Reached", value: ridiTotalsQuery.data?.women ?? 0 },
                { label: "Youth Reached", value: ridiTotalsQuery.data?.youth ?? 0 },
                { label: "Referrals to HAMZURY", value: ridiTotalsQuery.data?.referrals ?? 0 },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white rounded-2xl p-6 border border-stone-100">
                  <div className="text-3xl font-light text-stone-900 mb-1">{kpi.value.toLocaleString()}</div>
                  <div className="text-sm font-medium text-stone-700">{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Programs List */}
            <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-stone-900">RIDI Programs</h3>
                <span className="text-xs text-stone-400">{(ridiProgramsQuery.data ?? []).length} programs</span>
              </div>
              {(ridiProgramsQuery.data ?? []).length === 0 ? (
                <div className="p-12 text-center text-stone-400 text-sm">No programs recorded yet. The RIDI Lead will add programs here.</div>
              ) : (
                <div className="divide-y divide-stone-50">
                  {(ridiProgramsQuery.data ?? []).map((p: any) => (
                    <div key={p.id} className="px-6 py-4 flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-stone-900">{p.programName}</div>
                        <div className="text-xs text-stone-400 mt-0.5">{p.programType} · {p.location} {p.communityPartner ? `· Partner: ${p.communityPartner}` : ""}</div>
                        {p.impactStory && <div className="text-xs text-stone-600 mt-2 italic">“{p.impactStory}”</div>}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          p.status === "Active" ? "bg-green-50 text-green-700" :
                          p.status === "Completed" ? "bg-blue-50 text-blue-700" :
                          p.status === "Planning" ? "bg-amber-50 text-amber-700" :
                          "bg-stone-100 text-stone-500"
                        }`}>{p.status}</span>
                        <div className="text-xs text-stone-400">{p.totalBeneficiaries ?? 0} beneficiaries</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showAssign && (
        <AssignTaskModal
          onClose={() => setShowAssign(false)}
          onSuccess={() => utils.institutional.allTasks.invalidate()}
        />
      )}

      {showNoteEditor && (
        <NoteEditor
          note={editingNote}
          onSave={(title, content, id) => {
            if (id) {
              updateNote.mutate({ id, title, content });
            } else {
              createNote.mutate({ title, content });
            }
          }}
          onCancel={() => { setShowNoteEditor(false); setEditingNote(undefined); }}
        />
      )}
    </div>
  );
}
