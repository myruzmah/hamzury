/**
 * HAMZURY Kanban Board — drag-and-drop task management
 * Used in lead-dashboard Tasks tab.
 * Uses @dnd-kit for accessible, smooth DnD.
 */
import { useState, useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, AlertCircle, Clock, CheckCircle2, Eye, Loader2, Play } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const BRAND = "#1B4D3E";

type TaskStage = "intake" | "in_progress" | "review" | "approved" | "closed";

const COLUMNS: { id: TaskStage; label: string; color: string; icon: React.ReactNode }[] = [
  { id: "intake", label: "To Do", color: "#6b7280", icon: <Clock size={13} /> },
  { id: "in_progress", label: "In Progress", color: "#3b82f6", icon: <Play size={13} /> },
  { id: "review", label: "In Review", color: "#8b5cf6", icon: <Eye size={13} /> },
  { id: "approved", label: "Approved", color: "#10b981", icon: <CheckCircle2 size={13} /> },
];

interface Task {
  id: number;
  taskRef: string;
  title: string;
  lifecycleStage: string;
  priority: string;
  assignedToStaffId: string | null;
  clientName: string | null;
  deadline: Date | null;
  serviceType: string;
}

function TaskCard({ task, isDragging = false }: { task: Task; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl border p-3 select-none ${isDragging ? "shadow-lg rotate-1" : "hover:border-gray-300"} transition-all`}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing shrink-0"
        >
          <GripVertical size={14} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-foreground leading-snug">{task.title}</span>
            {task.priority === "urgent" && (
              <span className="flex items-center gap-0.5 text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full shrink-0">
                <AlertCircle size={10} /> Urgent
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.taskRef} · {task.serviceType}</p>
          {task.clientName && <p className="text-xs text-muted-foreground truncate">{task.clientName}</p>}
          {task.deadline && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Due {new Date(task.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({
  column,
  tasks,
}: {
  column: typeof COLUMNS[0];
  tasks: Task[];
}) {
  const taskIds = useMemo(() => tasks.map(t => t.id), [tasks]);

  return (
    <div className="flex flex-col gap-2 min-w-[220px] flex-1">
      {/* Column header */}
      <div className="flex items-center gap-2 px-1 mb-1">
        <span style={{ color: column.color }}>{column.icon}</span>
        <span className="text-xs font-semibold text-foreground">{column.label}</span>
        <span
          className="ml-auto text-xs font-medium px-1.5 py-0.5 rounded-full"
          style={{ background: column.color + "18", color: column.color }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        className="flex flex-col gap-2 min-h-[120px] rounded-xl p-2 transition-colors"
        style={{ background: column.color + "08" }}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-6">
            <p className="text-xs text-muted-foreground">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard({ tasks, onStageChange }: {
  tasks: Task[];
  onStageChange: (taskRef: string, newStage: TaskStage) => void;
}) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  // Keep in sync with parent
  useMemo(() => setLocalTasks(tasks), [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const columns = useMemo(() =>
    COLUMNS.map(col => ({
      ...col,
      tasks: localTasks.filter(t => t.lifecycleStage === col.id),
    })),
    [localTasks]
  );

  function handleDragStart(event: DragStartEvent) {
    const task = localTasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id;

    // Check if over is a column id
    const overColumn = COLUMNS.find(c => c.id === overId);
    if (overColumn) {
      setLocalTasks(prev => prev.map(t =>
        t.id === activeId ? { ...t, lifecycleStage: overColumn.id } : t
      ));
      return;
    }

    // Check if over is a task — move to same column
    const overTask = localTasks.find(t => t.id === overId);
    if (overTask && overTask.lifecycleStage !== localTasks.find(t => t.id === activeId)?.lifecycleStage) {
      setLocalTasks(prev => prev.map(t =>
        t.id === activeId ? { ...t, lifecycleStage: overTask.lifecycleStage } : t
      ));
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id as number;
    const task = localTasks.find(t => t.id === activeId);
    if (!task) return;

    // Determine target column
    const overColumn = COLUMNS.find(c => c.id === over.id);
    const overTask = localTasks.find(t => t.id === over.id);
    const targetStage = overColumn?.id || overTask?.lifecycleStage;

    if (targetStage && targetStage !== task.lifecycleStage) {
      onStageChange(task.taskRef, targetStage as TaskStage);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 overflow-x-auto pb-4">
        {columns.map(col => (
          <KanbanColumn key={col.id} column={col} tasks={col.tasks} />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
