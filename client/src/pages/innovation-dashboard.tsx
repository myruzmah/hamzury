import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

function fmt(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
}
function statusColor(s: string) {
  const m: Record<string, string> = {
    Applied: "bg-blue-100 text-blue-700",
    Shortlisted: "bg-yellow-100 text-yellow-700",
    Enrolled: "bg-green-100 text-green-700",
    Completed: "bg-stone-100 text-stone-500",
    Withdrawn: "bg-red-100 text-red-600",
  };
  return m[s] ?? "bg-stone-100 text-stone-600";
}

// ─── Enrolment Modal ──────────────────────────────────────────────────────────
function EnrolmentModal({ onClose }: { onClose: () => void }) {
  const utils = trpc.useUtils();
  const [form, setForm] = useState({
    participantName: "", participantEmail: "", participantPhone: "",
    programmeType: "Executive Class" as const,
    cohort: "", source: "Direct" as const, notes: "",
  });
  const mut = trpc.innovation.createEnrolment.useMutation({
    onSuccess: (d) => {
      toast.success(`Ref: ${d.enrolmentRef}`);
      utils.innovation.getAllEnrolments.invalidate();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900">Add Enrolment</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl font-light">✕</button>
        </div>
        <form onSubmit={e => { e.preventDefault(); mut.mutate(form); }} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Full Name</label>
              <input required className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                value={form.participantName} onChange={e => setForm(f => ({ ...f, participantName: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Email</label>
              <input required type="email" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                value={form.participantEmail} onChange={e => setForm(f => ({ ...f, participantEmail: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Phone</label>
              <input className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                value={form.participantPhone} onChange={e => setForm(f => ({ ...f, participantPhone: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Programme</label>
              <select className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                value={form.programmeType} onChange={e => setForm(f => ({ ...f, programmeType: e.target.value as typeof form.programmeType }))}>
                {["Executive Class","Young Innovators","Tech Bootcamp","Internship","Corporate Training","Robotics"].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Cohort</label>
              <input placeholder="e.g. Cohort 1 — March 2026" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                value={form.cohort} onChange={e => setForm(f => ({ ...f, cohort: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Source</label>
              <select className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value as typeof form.source }))}>
                {["Direct","RIDI Scholarship","Corporate","Agent Referral"].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Notes</label>
            <textarea rows={2} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={mut.isPending}
              className="flex-1 bg-stone-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50">
              {mut.isPending ? "Adding…" : "Add Enrolment"}
            </button>
            <button type="button" onClick={onClose}
              className="px-4 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-600 hover:bg-stone-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Innovation Hub Dashboard ───────────────────────────────────────────
export default function InnovationDashboard() {
  const [tab, setTab] = useState<"enrolments" | "cohorts" | "robotics" | "hackathon" | "ventures" | "alumni">("enrolments");
  const [showEnrolment, setShowEnrolment] = useState(false);
  const [filterProgramme, setFilterProgramme] = useState("all");
  const utils = trpc.useUtils();

  const enrolmentsQ = trpc.innovation.getAllEnrolments.useQuery();
  const updateStatusMut = trpc.innovation.updateStatus.useMutation({
    onSuccess: () => utils.innovation.getAllEnrolments.invalidate(),
    onError: (e) => toast.error(e.message),
  });

  const enrolments = enrolmentsQ.data ?? [];
  const filtered = filterProgramme === "all" ? enrolments : enrolments.filter(e => e.programmeType === filterProgramme);

  const programmes = ["Executive Class","Young Innovators","Tech Bootcamp","Internship","Corporate Training","Robotics"];

  const tabs = [
    { id: "enrolments", label: "Enrolments" },
    { id: "cohorts", label: "Cohorts" },
    { id: "robotics", label: "Robotics" },
    { id: "hackathon", label: "Hackathon" },
    { id: "ventures", label: "Ventures" },
    { id: "alumni", label: "Alumni" },
  ] as const;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-[#1B4D3E]/10 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-[#1B4D3E]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
          <div>
            <div className="text-base font-bold text-[#1B4D3E] leading-tight">Innovation Hub</div>
            <p className="text-xs text-stone-400 mt-0.5">Habiba Shuaibu Dajot · Innovation Hub Lead</p>
          </div>
        </div>
        <button onClick={() => setShowEnrolment(true)}
          className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors">
          + Add Enrolment
        </button>
      </div>

      {/* KPI Strip */}
      <div className="px-6 py-4 grid grid-cols-4 gap-4">
        {[
          { label: "Total Enrolments", value: enrolments.length },
          { label: "Active (Enrolled)", value: enrolments.filter(e => e.status === "Enrolled").length },
          { label: "Completed", value: enrolments.filter(e => e.status === "Completed").length },
          { label: "Pending Review", value: enrolments.filter(e => e.status === "Applied").length },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-stone-100 px-4 py-3">
            <div className="text-2xl font-bold text-stone-900">{k.value}</div>
            <div className="text-xs text-stone-400 mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="flex gap-1 border-b border-stone-100 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                tab === t.id ? "border-stone-900 text-stone-900" : "border-transparent text-stone-400 hover:text-stone-600"
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Enrolments Tab */}
        {tab === "enrolments" && (
          <div className="space-y-4">
            {/* Programme filter */}
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setFilterProgramme("all")}
                className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${filterProgramme === "all" ? "bg-stone-900 text-white" : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"}`}>
                All
              </button>
              {programmes.map(p => (
                <button key={p} onClick={() => setFilterProgramme(p)}
                  className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${filterProgramme === p ? "bg-stone-900 text-white" : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"}`}>
                  {p}
                </button>
              ))}
            </div>
            {filtered.map(e => (
              <div key={e.id} className="bg-white rounded-xl border border-stone-100 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-stone-400">{e.enrolmentRef}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(e.status)}`}>{e.status}</span>
                    </div>
                    <p className="text-sm font-semibold text-stone-900">{e.participantName}</p>
                    <p className="text-xs text-stone-400">{e.participantEmail}{e.participantPhone ? ` · ${e.participantPhone}` : ""}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{e.programmeType}{e.cohort ? ` · ${e.cohort}` : ""} · {e.source}</p>
                    <p className="text-xs text-stone-400">{fmt(e.createdAt)}</p>
                  </div>
                  <select
                    value={e.status}
                    onChange={ev => updateStatusMut.mutate({ enrolmentRef: e.enrolmentRef, status: ev.target.value as any })}
                    className="text-xs border border-stone-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-stone-900 shrink-0">
                    {["Applied","Shortlisted","Enrolled","Completed","Withdrawn"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-stone-400">
                <div className="text-4xl mb-3">🎓</div>
                <p className="text-sm">No enrolments yet. Add one using the button above.</p>
              </div>
            )}
          </div>
        )}

        {/* Cohorts Tab */}
        {tab === "cohorts" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-stone-100 p-5">
              <p className="text-sm font-semibold text-stone-700 mb-3">Cohort Summary</p>
              <div className="space-y-2">
                {programmes.map(p => {
                  const count = enrolments.filter(e => e.programmeType === p && e.status === "Enrolled").length;
                  const cohorts = Array.from(new Set(enrolments.filter(e => e.programmeType === p && e.cohort).map(e => e.cohort)));
                  if (count === 0 && cohorts.length === 0) return null;
                  return (
                    <div key={p} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-stone-800">{p}</p>
                        {cohorts.length > 0 && <p className="text-xs text-stone-400">{cohorts.join(", ")}</p>}
                      </div>
                      <span className="text-sm font-bold text-stone-900">{count} enrolled</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Robotics Tab */}
        {tab === "robotics" && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
              <strong>Robotics Lead:</strong> Abdulmalik Abdullahi Muhammad — manages robotics training and projects under Innovation Hub.
            </div>
            {enrolments.filter(e => e.programmeType === "Robotics").map(e => (
              <div key={e.id} className="bg-white rounded-xl border border-stone-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{e.participantName}</p>
                    <p className="text-xs text-stone-400">{e.participantEmail}{e.cohort ? ` · ${e.cohort}` : ""}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(e.status)}`}>{e.status}</span>
                </div>
              </div>
            ))}
            {enrolments.filter(e => e.programmeType === "Robotics").length === 0 && (
              <div className="text-center py-12 text-stone-400">
                <div className="text-4xl mb-3">🤖</div>
                <p className="text-sm">No robotics enrolments yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Placeholder tabs */}
        {(tab === "hackathon" || tab === "ventures" || tab === "alumni") && (
          <div className="text-center py-20 text-stone-400">
            <div className="text-5xl mb-4">
              {tab === "hackathon" ? "🏆" : tab === "ventures" ? "🚀" : "🎓"}
            </div>
            <p className="text-base font-medium text-stone-600 capitalize">{tab}</p>
            <p className="text-sm mt-2 max-w-sm mx-auto">
              {tab === "hackathon" && "Hackathon management — track teams, submissions, and results. Coming in the next build."}
              {tab === "ventures" && "Ventures pipeline — track startup ideas, mentorship, and funding. Coming in the next build."}
              {tab === "alumni" && "Alumni directory — track graduates, placements, and success stories. Coming in the next build."}
            </p>
          </div>
        )}
      </div>

      {showEnrolment && <EnrolmentModal onClose={() => setShowEnrolment(false)} />}
    </div>
  );
}
