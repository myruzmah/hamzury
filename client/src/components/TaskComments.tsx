import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface TaskCommentsProps {
  taskRef: string;
  compact?: boolean;
}

function timeAgo(d: Date | string) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function roleColor(role: string) {
  const m: Record<string, string> = {
    founder: "bg-amber-100 text-amber-700",
    ceo: "bg-purple-100 text-purple-700",
    lead: "bg-blue-100 text-blue-700",
    staff: "bg-stone-100 text-stone-600",
    client: "bg-emerald-100 text-emerald-700",
  };
  return m[role] ?? "bg-stone-100 text-stone-600";
}

export default function TaskComments({ taskRef, compact = false }: TaskCommentsProps) {
  const utils = trpc.useUtils();
  const [message, setMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const commentsQ = trpc.comments.getByTask.useQuery({ taskRef }, {
    refetchInterval: 15000, // poll every 15s
  });
  const addMut = trpc.comments.add.useMutation({
    onSuccess: () => {
      setMessage("");
      utils.comments.getByTask.invalidate({ taskRef });
    },
    onError: (e) => toast.error(e.message),
  });

  const comments = commentsQ.data ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    addMut.mutate({ taskRef, message: message.trim() });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (message.trim()) addMut.mutate({ taskRef, message: message.trim() });
    }
  };

  return (
    <div className={`flex flex-col ${compact ? "h-64" : "h-96"} bg-white rounded-xl border border-stone-100`}>
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-stone-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-stone-700">Thread</span>
          <span className="text-xs text-stone-400 font-mono">{taskRef}</span>
        </div>
        {commentsQ.isFetching && (
          <span className="text-xs text-stone-300 animate-pulse">syncing…</span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {comments.length === 0 && (
          <div className="text-center py-8 text-stone-300">
            <p className="text-xs">No messages yet. Start the thread.</p>
          </div>
        )}
        {comments.map(c => (
          <div key={c.id} className="flex gap-2.5">
            <div className="shrink-0 w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-600">
              {c.authorName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-semibold text-stone-800">{c.authorName}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${roleColor(c.authorRole)}`}>{c.authorRole}</span>
                <span className="text-xs text-stone-300">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="text-sm text-stone-700 whitespace-pre-wrap break-words leading-relaxed">{c.message}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-stone-100 shrink-0">
        <div className="flex gap-2">
          <textarea
            rows={2}
            placeholder="Write a message… (Ctrl+Enter to send)"
            className="flex-1 resize-none border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 placeholder:text-stone-300"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            disabled={!message.trim() || addMut.isPending}
            className="px-3 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-40 self-end">
            {addMut.isPending ? "…" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
