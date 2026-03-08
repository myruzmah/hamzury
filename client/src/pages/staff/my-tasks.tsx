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
  stage,
  items,
  staffId,
  staffName,
  taskRef,
  isCurrentStage,
  onTick,
}: {
  stage: "pre" | "during" | "post";
  items: Array<{ id: number; stepText: string; isCompleted: boolean; isRequired: boolean; completedAt: Date | null }>;
  staffId: string;
  staffName: string;
  taskRef: string;
  isCurrentStage: boolean;
  onTick: () => void;
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
          <label
            key={item.id}
            className={`flex items-start gap-3 cursor-pointer group ${!isCurrentStage && !item.isCompleted ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={item.isCompleted}
                disabled={!isCurrentStage && !item.isCompleted}
                onChange={(e) => {
                  tickMutation.mutate({
                    itemId: item.id,
                    completed: e.target.checked,
                    taskRef,
                    stepText: item.stepText,
                    stage,
                  });
                }}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                item.isCompleted
                  ? "bg-[#1B4D3E] border-[#1B4D3E]"
                  : "border-stone-300 group-hover:border-[#1B4D3E]"
              }`}>
                {item.isCompleted && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <div className="flex-1">
              <span className={`text-sm ${item.isCompleted ? "text-stone-400 line-through" : "text-stone-700"}`}>
                {item.stepText}
              </span>
              {item.isRequired && !item.isCompleted && (
                <span className="ml-1 text-xs text-red-400">*</span>
              )}
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

// ─── Task Detail Panel ────────────────────────────────────────────────────────
function TaskDetail({
  taskRef,
  staffId,
  staffName,
  onClose,
  onUpdate,
}: {
  taskRef: string;
  staffId: string;
  staffName: string;
  onClose: () => void;
  onUpdate: () => void;
}) {
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
  const preItems = checklist.filter((c) => c.stage === "pre");
  const duringItems = checklist.filter((c) => c.stage === "during");
  const postItems = checklist.filter((c) => c.stage === "post");

  const currentItems = currentStage === "pre" ? preItems : currentStage === "during" ? duringItems : postItems;
  const requiredComplete = currentItems.filter((i) => i.isRequired).every((i) => i.isCompleted);
  const nextStage = NEXT_STAGE[currentStage];
  const nextLabel = NEXT_STAGE_LABEL[currentStage];

  const refreshChecklist = () => {
    utils.institutional.taskChecklist.invalidate({ taskRef });
    utils.institutional.taskAudit.invalidate({ taskRef });
  };

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

        <div className="p-6 space-y-4">
          {/* Brief */}
          {task.notes && (
            <div className="bg-white rounded-xl border border-stone-100 p-4">
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Brief</div>
              <p className="text-sm text-stone-700">{task.notes}</p>
            </div>
          )}

          {/* Rejection comment */}
          {currentStage === "rejected" && task.rejectionComment && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <div className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">Returned for Revision</div>
              <p className="text-sm text-red-700">{task.rejectionComment}</p>
            </div>
          )}

          {/* Deadline */}
          {task.deadline && (
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <span className="text-stone-400 text-xs">Deadline:</span>
              <span className="font-medium">
                {new Date(task.deadline).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
          )}

          {/* Checklists */}
          <div className="space-y-3">
            <ChecklistStage
              stage="pre"
              items={preItems}
              staffId={staffId}
              staffName={staffName}
              taskRef={taskRef}
              isCurrentStage={currentStage === "pre"}
              onTick={refreshChecklist}
            />
            <ChecklistStage
              stage="during"
              items={duringItems}
              staffId={staffId}
              staffName={staffName}
              taskRef={taskRef}
              isCurrentStage={currentStage === "during"}
              onTick={refreshChecklist}
            />
            <ChecklistStage
              stage="post"
              items={postItems}
              staffId={staffId}
              staffName={staffName}
              taskRef={taskRef}
              isCurrentStage={currentStage === "post"}
              onTick={refreshChecklist}
            />
          </div>

          {/* Advance stage button */}
          {nextStage && !["review", "approved", "closed", "rejected"].includes(currentStage) && (
            <div>
              {!requiredComplete && (
                <p className="text-xs text-amber-600 mb-2">
                  Complete all required items (*) before advancing.
                </p>
              )}
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
            <button
              onClick={() => advanceMutation.mutate({ taskRef, stage: "post" })}
              disabled={advanceMutation.isPending}
              className="w-full border border-[#1B4D3E] text-[#1B4D3E] rounded-xl py-3 text-sm font-medium hover:bg-[#1B4D3E]/5 transition-colors"
            >
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

          {/* Audit trail */}
          {audit.length > 0 && (
            <div className="bg-white rounded-xl border border-stone-100 p-4">
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Activity Log</div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {audit.map((entry) => (
                  <div key={entry.id} className="flex gap-3 text-xs">
                    <span className="text-stone-300 flex-shrink-0 whitespace-nowrap">
                      {new Date(entry.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="text-stone-500">{entry.action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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

  const profileQuery = trpc.institutional.myProfile.useQuery();
  const myTasksQuery = trpc.institutional.myTasks.useQuery();
  const utils = trpc.useUtils();

  const profile = profileQuery.data;
  const tasks = myTasksQuery.data ?? [];

  const filteredTasks = stageFilter === "all" ? tasks : tasks.filter((t) => t.lifecycleStage === stageFilter);

  const activeTasks = tasks.filter((t) => !["closed", "approved"].includes(t.lifecycleStage)).length;
  const urgentTasks = tasks.filter((t) => t.priority === "urgent" && !["closed", "approved"].includes(t.lifecycleStage)).length;
  const reviewTasks = tasks.filter((t) => t.lifecycleStage === "review").length;
  const completedTasks = tasks.filter((t) => ["closed", "approved"].includes(t.lifecycleStage)).length;

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
          <button
            onClick={() => logout.mutate()}
            className="text-stone-400 text-sm hover:text-stone-600 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Active", value: activeTasks, stage: "during" as TaskStage },
            { label: "Urgent", value: urgentTasks, stage: "pre" as TaskStage },
            { label: "In Review", value: reviewTasks, stage: "review" as TaskStage },
            { label: "Completed", value: completedTasks, stage: "approved" as TaskStage },
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
            <button
              key={s}
              onClick={() => setStageFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                stageFilter === s
                  ? "bg-[#1B4D3E] text-white"
                  : "bg-white text-stone-500 border border-stone-200 hover:border-stone-300"
              }`}
            >
              {s === "all" ? "All Tasks" : STAGE_LABEL[s]}
            </button>
          ))}
        </div>

        {/* Task list */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
            <p className="text-stone-400 text-sm">
              {stageFilter === "all"
                ? "No tasks assigned yet. Your Lead will assign tasks to you."
                : `No tasks in ${STAGE_LABEL[stageFilter as TaskStage]} stage.`}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl border border-stone-100 p-4 cursor-pointer hover:border-stone-200 hover:shadow-sm transition-all"
                onClick={() => setSelectedTaskRef(task.taskRef)}
              >
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
    </div>
  );
}
