import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import TaskComments from "@/components/TaskComments";

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

const NEXT_STAGE: Partial<Record<TaskStage, TaskStage>> = {
  pre: "during",
  during: "post",
  post: "review",
};

const NEXT_STAGE_LABEL: Partial<Record<TaskStage, string>> = {
  pre: "Start Task →",
  during: "Move to Post-Task →",
  post: "Submit for Review →",
};

// ─── Checklist Stage ──────────────────────────────────────────────────────────
function ChecklistStage({
  stage, items, staffId, staffName, taskRef, isCurrentStage, onTick,
}: {
  stage: "pre" | "during" | "post";
  items: Array<{ id: number; stepText: string; isCompleted: boolean; isRequired: boolean; completedAt: Date | null }>;
  staffId: string; staffName: string; taskRef: string; isCurrentStage: boolean; onTick: () => void;
}) {
  const tickMutation = trpc.institutional.tickItem.useMutation({ onSuccess: onTick });
  if (items.length === 0) return null;
  const completed = items.filter((i) => i.isCompleted).length;
  const pct = Math.round((completed / items.length) * 100);
  return (
    <div className={`rounded-xl border p-4 ${isCurrentStage ? "border-[#1B4D3E]/30 bg-[#1B4D3E]/5" : "border-stone-100 bg-white"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
          {stage === "pre" ? "Pre-Task" : stage === "during" ? "During Task" : "Post-Task"}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 bg-stone-200 rounded-full h-1">
            <div className="bg-[#1B4D3E] h-1 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs text-stone-400">{completed}/{items.length}</span>
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <label key={item.id} className="flex items-start gap-3 cursor-pointer group"
            onClick={() => tickMutation.mutate({ itemId: item.id, completed: !item.isCompleted, taskRef, stepText: item.stepText, stage })}>
            <div className="flex-shrink-0 mt-0.5">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                item.isCompleted ? "bg-[#1B4D3E] border-[#1B4D3E]" : "border-stone-300 group-hover:border-[#1B4D3E]"
              }`}>
                {item.isCompleted && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <div className="flex-1">
              <span className={`text-sm ${item.isCompleted ? "text-stone-400 line-through" : "text-stone-700"}`}>{item.stepText}</span>
              {item.isRequired && !item.isCompleted && <span className="ml-1 text-xs text-red-400">*</span>}
              {item.completedAt && (
                <div className="text-xs text-stone-300 mt-0.5">
                  {new Date(item.completedAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

// ─── File Upload Panel ────────────────────────────────────────────────────────
function FileUploadPanel({ taskRef }: { taskRef: string }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const filesQuery = trpc.institutional.getTaskFiles.useQuery({ taskRef });
  const uploadMutation = trpc.institutional.uploadTaskFile.useMutation({
    onSuccess: () => { filesQuery.refetch(); toast.success("File uploaded."); },
    onError: (e) => toast.error(e.message),
  });

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 16 * 1024 * 1024) { toast.error("File must be under 16 MB."); return; }
    setUploading(true);
    try {
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
      const base64 = btoa(binary);
      await uploadMutation.mutateAsync({ taskRef, fileName: file.name, mimeType: file.type, fileBase64: base64, fileSizeBytes: file.size });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const files = filesQuery.data ?? [];

  return (
    <div className="bg-white rounded-xl border border-stone-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Deliverables</div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="text-xs bg-[#1B4D3E] text-white px-3 py-1.5 rounded-lg hover:bg-[#163d30] transition-colors disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "+ Attach File"}
        </button>
        <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />
      </div>
      {files.length === 0 ? (
        <p className="text-xs text-stone-400">No files attached yet. Upload logos, documents, or designs here.</p>
      ) : (
        <div className="space-y-2">
          {files.map((f: any) => (
            <a key={f.id} href={f.fileUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 text-xs text-stone-700 hover:text-[#1B4D3E] transition-colors group">
              <div className="w-7 h-7 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#1B4D3E]/10">
                <svg className="w-3.5 h-3.5 text-stone-500 group-hover:text-[#1B4D3E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium">{f.fileName}</div>
                <div className="text-stone-400">{new Date(f.uploadedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// CommentThread — now uses shared TaskComments component

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
            {unread > 0 && (
              <button onClick={() => markAllMutation.mutate()} className="text-xs text-[#1B4D3E] hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="p-6 text-center text-sm text-stone-400">No notifications yet.</div>
            ) : (
              notifs.map((n: any) => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && markReadMutation.mutate({ id: n.id })}
                  className={`px-4 py-3 border-b border-stone-50 cursor-pointer hover:bg-stone-50 transition-colors ${!n.isRead ? "bg-[#1B4D3E]/5" : ""}`}
                >
                  <div className="flex items-start gap-2">
                    {!n.isRead && <div className="w-2 h-2 bg-[#1B4D3E] rounded-full mt-1.5 flex-shrink-0" />}
                    <div className={!n.isRead ? "" : "ml-4"}>
                      <div className="text-xs font-semibold text-stone-800">{n.title}</div>
                      <div className="text-xs text-stone-500 mt-0.5">{n.message}</div>
                      <div className="text-xs text-stone-300 mt-1">
                        {new Date(n.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  );
}

// ─── Task Detail Panel ────────────────────────────────────────────────────────
function TaskDetail({ taskRef, staffId, staffName, onClose, onUpdate }: {
  taskRef: string; staffId: string; staffName: string; onClose: () => void; onUpdate: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"checklist" | "files" | "comments" | "audit">("checklist");
  const taskQuery = trpc.institutional.taskDetail.useQuery({ taskRef });
  const checklistQuery = trpc.institutional.taskChecklist.useQuery({ taskRef });
  const auditQuery = trpc.institutional.taskAudit.useQuery({ taskRef });
  const utils = trpc.useUtils();

  const advanceMutation = trpc.institutional.advanceStage.useMutation({
    onSuccess: () => {
      utils.institutional.taskDetail.invalidate({ taskRef });
      utils.institutional.taskChecklist.invalidate({ taskRef });
      utils.institutional.taskAudit.invalidate({ taskRef });
      onUpdate();
    },
  });

  const task = taskQuery.data;
  const checklist = checklistQuery.data ?? [];
  const audit = auditQuery.data ?? [];

  if (!task) return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 text-stone-400 text-sm">Loading…</div>
    </div>
  );

  const currentStage = task.lifecycleStage as TaskStage;
  const preItems = checklist.filter((c: any) => c.stage === "pre");
  const duringItems = checklist.filter((c: any) => c.stage === "during");
  const postItems = checklist.filter((c: any) => c.stage === "post");
  const currentItems = currentStage === "pre" ? preItems : currentStage === "during" ? duringItems : postItems;
  const requiredComplete = currentItems.filter((i: any) => i.isRequired).every((i: any) => i.isCompleted);
  const nextStage = NEXT_STAGE[currentStage];
  const nextLabel = NEXT_STAGE_LABEL[currentStage];

  const refreshChecklist = () => {
    utils.institutional.taskChecklist.invalidate({ taskRef });
    utils.institutional.taskAudit.invalidate({ taskRef });
  };

  const tabs = [
    { id: "checklist", label: "Checklist" },
    { id: "files", label: "Files" },
    { id: "comments", label: "Comments" },
    { id: "audit", label: "Activity" },
  ] as const;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-[#F9F6F1] rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex items-start justify-between rounded-t-2xl">
          <div>
            <div className="text-base font-semibold text-stone-900">{task.title}</div>
            <div className="text-xs text-stone-400 mt-0.5">
              {task.taskRef} · {task.department} · {task.serviceType}
              {task.clientName && ` · ${task.clientName}`}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${STAGE_COLOR[currentStage]}`}>
              {STAGE_LABEL[currentStage]}
            </span>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl leading-none ml-2">×</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-stone-100 px-6 flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs font-medium px-3 py-3 border-b-2 transition-colors ${
                activeTab === tab.id ? "border-[#1B4D3E] text-[#1B4D3E]" : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {/* Brief & status info always visible */}
          {task.notes && (
            <div className="bg-white rounded-xl border border-stone-100 p-4">
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Brief</div>
              <p className="text-sm text-stone-700">{task.notes}</p>
            </div>
          )}
          {currentStage === "rejected" && task.rejectionComment && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <div className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">Returned for Revision</div>
              <p className="text-sm text-red-700">{task.rejectionComment}</p>
            </div>
          )}
          {task.deadline && (
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <span className="text-stone-400 text-xs">Deadline:</span>
              <span className="font-medium">
                {new Date(task.deadline).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
          )}

          {/* Tab content */}
          {activeTab === "checklist" && (
            <div className="space-y-3">
              <ChecklistStage stage="pre" items={preItems} staffId={staffId} staffName={staffName} taskRef={taskRef} isCurrentStage={currentStage === "pre"} onTick={refreshChecklist} />
              <ChecklistStage stage="during" items={duringItems} staffId={staffId} staffName={staffName} taskRef={taskRef} isCurrentStage={currentStage === "during"} onTick={refreshChecklist} />
              <ChecklistStage stage="post" items={postItems} staffId={staffId} staffName={staffName} taskRef={taskRef} isCurrentStage={currentStage === "post"} onTick={refreshChecklist} />

              {nextStage && !["review", "approved", "closed", "rejected"].includes(currentStage) && (
                <div>
                  {!requiredComplete && <p className="text-xs text-amber-600 mb-2">Complete all required items (*) before advancing.</p>}
                  <button
                    onClick={() => advanceMutation.mutate({ taskRef, stage: nextStage })}
                    disabled={advanceMutation.isPending || !requiredComplete}
                    className="w-full bg-[#1B4D3E] text-white rounded-xl py-3 text-sm font-medium hover:bg-[#163d30] transition-colors disabled:opacity-50"
                  >
                    {advanceMutation.isPending ? "Updating…" : nextLabel}
                  </button>
                </div>
              )}
              {currentStage === "rejected" && (
                <button onClick={() => advanceMutation.mutate({ taskRef, stage: "post" })} disabled={advanceMutation.isPending}
                  className="w-full border border-[#1B4D3E] text-[#1B4D3E] rounded-xl py-3 text-sm font-medium hover:bg-[#1B4D3E]/5 transition-colors">
                  Revise & Resubmit
                </button>
              )}
              {currentStage === "review" && (
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-purple-700">Submitted for review. Awaiting your Lead's approval.</p>
                </div>
              )}
              {(currentStage === "approved" || currentStage === "closed") && (
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-green-700">This task has been approved and closed.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "files" && <FileUploadPanel taskRef={taskRef} />}

          {activeTab === "comments" && <TaskComments taskRef={taskRef} />}

          {activeTab === "audit" && (
            <div className="bg-white rounded-xl border border-stone-100 p-4">
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Activity Log</div>
              {audit.length === 0 ? (
                <p className="text-xs text-stone-400">No activity yet.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {audit.map((entry: any) => (
                    <div key={entry.id} className="flex gap-3 text-xs">
                      <span className="text-stone-300 flex-shrink-0 whitespace-nowrap">
                        {new Date(entry.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="text-stone-500">{entry.action}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
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
          <div>
            <label className="text-xs font-medium text-stone-600 block mb-1">Current password</label>
            <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E]" />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-600 block mb-1">New password</label>
            <input type="password" value={next} onChange={(e) => setNext(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E]" />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-600 block mb-1">Confirm new password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E]" />
          </div>
          <button onClick={submit} disabled={changeMutation.isPending || !current || !next || !confirm}
            className="w-full bg-[#1B4D3E] text-white rounded-xl py-3 text-sm font-medium hover:bg-[#163d30] transition-colors disabled:opacity-50 mt-2">
            {changeMutation.isPending ? "Changing…" : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Staff My Tasks Dashboard ─────────────────────────────────────────────────
export default function MyTasksDashboard() {
  const [, navigate] = useLocation();
  const [selectedTaskRef, setSelectedTaskRef] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<TaskStage | "all">("all");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileQuery = trpc.institutional.myProfile.useQuery();
  const myTasksQuery = trpc.institutional.myTasks.useQuery();
  const utils = trpc.useUtils();

  const profile = profileQuery.data;
  const tasks = myTasksQuery.data ?? [];
  const filteredTasks = stageFilter === "all" ? tasks : tasks.filter((t: any) => t.lifecycleStage === stageFilter);

  const activeTasks = tasks.filter((t: any) => !["closed", "approved"].includes(t.lifecycleStage)).length;
  const urgentTasks = tasks.filter((t: any) => t.priority === "urgent" && !["closed", "approved"].includes(t.lifecycleStage)).length;
  const reviewTasks = tasks.filter((t: any) => t.lifecycleStage === "review").length;
  const completedTasks = tasks.filter((t: any) => ["closed", "approved"].includes(t.lifecycleStage)).length;

  const logout = trpc.auth.logout.useMutation({ onSuccess: () => navigate("/portal") });

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[#1B4D3E] rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">{(profile?.name ?? "S")[0]}</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-stone-900">{profile?.name ?? "My Tasks"}</div>
              <div className="text-xs text-stone-400">{profile?.primaryDepartment ?? ""} · {profile?.staffId ?? ""}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <div className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="text-stone-400 hover:text-stone-600 transition-colors p-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-stone-100 z-50 overflow-hidden">
                  <button onClick={() => { setShowPasswordChange(true); setShowProfileMenu(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors">
                    Change Password
                  </button>
                  <button onClick={() => logout.mutate()}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-stone-100">
                    Sign Out
                  </button>
                </div>
              )}
              {showProfileMenu && <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Active", value: activeTasks },
            { label: "Urgent", value: urgentTasks },
            { label: "In Review", value: reviewTasks },
            { label: "Completed", value: completedTasks },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-2xl p-4 border border-stone-100">
              <div className="text-2xl font-light text-stone-900 mb-0.5">{kpi.value}</div>
              <div className="text-xs font-medium text-stone-600">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Stage filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {(["all", "pre", "during", "post", "review", "rejected", "approved"] as const).map((s) => (
            <button key={s} onClick={() => setStageFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                stageFilter === s ? "bg-[#1B4D3E] text-white" : "bg-white text-stone-500 border border-stone-200 hover:border-stone-300"
              }`}>
              {s === "all" ? "All Tasks" : STAGE_LABEL[s]}
            </button>
          ))}
        </div>

        {/* Task list */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
            <p className="text-stone-400 text-sm">
              {stageFilter === "all" ? "No tasks assigned yet. Your Lead will assign tasks to you." : `No tasks in ${STAGE_LABEL[stageFilter as TaskStage]} stage.`}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map((task: any) => (
              <div key={task.id}
                className="bg-white rounded-xl border border-stone-100 p-4 cursor-pointer hover:border-stone-200 hover:shadow-sm transition-all"
                onClick={() => setSelectedTaskRef(task.taskRef)}>
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
                    {task.deadline && (
                      <div className="text-xs text-stone-400 mt-0.5">
                        Due: {new Date(task.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    )}
                    {task.lifecycleStage === "rejected" && task.rejectionComment && (
                      <div className="text-xs text-red-600 mt-1 bg-red-50 rounded px-2 py-1">
                        Returned: {task.rejectionComment}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STAGE_COLOR[task.lifecycleStage as TaskStage]}`}>
                      {STAGE_LABEL[task.lifecycleStage as TaskStage]}
                    </span>
                    <svg className="w-4 h-4 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTaskRef && (
        <TaskDetail
          taskRef={selectedTaskRef}
          staffId={profile?.staffId ?? ""}
          staffName={profile?.name ?? ""}
          onClose={() => setSelectedTaskRef(null)}
          onUpdate={() => utils.institutional.myTasks.invalidate()}
        />
      )}

      {showPasswordChange && <PasswordChangeModal onClose={() => setShowPasswordChange(false)} />}
    </div>
  );
}
