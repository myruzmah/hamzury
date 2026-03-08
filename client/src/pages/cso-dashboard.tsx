import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
}
function statusColor(s: string) {
  const m: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    reviewing: "bg-yellow-100 text-yellow-700",
    in_progress: "bg-orange-100 text-orange-700",
    completed: "bg-green-100 text-green-700",
    closed: "bg-stone-100 text-stone-500",
    Submitted: "bg-blue-100 text-blue-700",
    Reviewed: "bg-yellow-100 text-yellow-700",
    "Clarity Sent": "bg-purple-100 text-purple-700",
    Converted: "bg-green-100 text-green-700",
    Lost: "bg-red-100 text-red-600",
  };
  return m[s] ?? "bg-stone-100 text-stone-600";
}

// ─── UCC Form Modal ───────────────────────────────────────────────────────────
function UccModal({ intakeRef, onClose }: { intakeRef?: string; onClose: () => void }) {
  const [form, setForm] = useState({
    businessName: "", contactName: "", contactEmail: "", contactPhone: "",
    industry: "", businessGoals: "", currentChallenges: "", targetAudience: "",
    budgetRange: "₦100k–₦500k" as const,
    timeline: "1 month" as const,
    preferredContact: "WhatsApp" as const,
    additionalNotes: "",
  });
  const createMut = trpc.cso.createUcc.useMutation({
    onSuccess: (d) => {
      toast.success(`Client ID: ${d.clientId}`);
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });
  const utils = trpc.useUtils();
  const qualifyMut = trpc.cso.qualifyLead.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMut.mutate({ ...form, intakeRef });
    utils.cso.getAllUcc.invalidate();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Understanding Client Context</h2>
            <p className="text-sm text-stone-400 mt-0.5">Qualification form — generates Client ID</p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl font-light">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Business Name</label>
              <input required className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                value={form.businessName} onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Contact Name</label>
              <input required className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Email</label>
              <input required type="email" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Phone</label>
              <input required className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                value={form.contactPhone} onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Industry</label>
            <input required className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Business Goals</label>
            <textarea required rows={3} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              value={form.businessGoals} onChange={e => setForm(f => ({ ...f, businessGoals: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Current Challenges</label>
            <textarea required rows={3} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              value={form.currentChallenges} onChange={e => setForm(f => ({ ...f, currentChallenges: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Target Audience</label>
            <input className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              value={form.targetAudience} onChange={e => setForm(f => ({ ...f, targetAudience: e.target.value }))} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Budget Range</label>
              <select className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                value={form.budgetRange} onChange={e => setForm(f => ({ ...f, budgetRange: e.target.value as typeof form.budgetRange }))}>
                {["Under ₦100k","₦100k–₦500k","₦500k–₦1m","₦1m–₦5m","Above ₦5m"].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Timeline</label>
              <select className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                value={form.timeline} onChange={e => setForm(f => ({ ...f, timeline: e.target.value as typeof form.timeline }))}>
                {["Urgent (under 2 weeks)","1 month","2–3 months","3–6 months","Flexible"].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Preferred Contact</label>
              <select className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                value={form.preferredContact} onChange={e => setForm(f => ({ ...f, preferredContact: e.target.value as typeof form.preferredContact }))}>
                {["Email","WhatsApp","Phone","Any"].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Additional Notes</label>
            <textarea rows={2} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              value={form.additionalNotes} onChange={e => setForm(f => ({ ...f, additionalNotes: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={createMut.isPending}
              className="flex-1 bg-stone-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50">
              {createMut.isPending ? "Creating…" : "Create UCC Record"}
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

// ─── Expense Submit Modal ─────────────────────────────────────────────────────
function ExpenseModal({ onClose }: { onClose: () => void }) {
  const utils = trpc.useUtils();
  const [form, setForm] = useState({ department: "CSO", description: "", amountNaira: "", category: "Operations" as const });
  const mut = trpc.finance.submitExpense.useMutation({
    onSuccess: (d) => {
      toast.success(`Ref: ${d.expenseRef}`);
      utils.finance.getMyExpenses.invalidate();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900">Submit Expense</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl font-light">✕</button>
        </div>
        <form onSubmit={e => { e.preventDefault(); mut.mutate({ ...form, amountNaira: Number(form.amountNaira) }); }} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Description</label>
            <input required className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Amount (₦)</label>
              <input required type="number" min="1" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                value={form.amountNaira} onChange={e => setForm(f => ({ ...f, amountNaira: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Category</label>
              <select className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as typeof form.category }))}>
                {["Operations","Travel","Equipment","Software","Training","Marketing","Other"].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={mut.isPending}
              className="flex-1 bg-stone-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50">
              {mut.isPending ? "Submitting…" : "Submit Expense"}
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

// ─── Main CSO Dashboard ───────────────────────────────────────────────────────
export default function CSODashboard() {
  const [tab, setTab] = useState<"pipeline" | "ucc" | "nurture" | "expenses">("pipeline");
  const [showUcc, setShowUcc] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [selectedIntakeRef, setSelectedIntakeRef] = useState<string | undefined>();
  const [clarityResult, setClarityResult] = useState<Record<string, string>>({});
  const utils = trpc.useUtils();

  const intakesQ = trpc.intake.getAll.useQuery({ status: undefined });
  const uccQ = trpc.cso.getAllUcc.useQuery();
  const myExpensesQ = trpc.finance.getMyExpenses.useQuery();

  const updateIntakeMut = trpc.intake.updateStatus.useMutation({
    onSuccess: () => utils.intake.getAll.invalidate(),
  });
  const updateUccMut = trpc.cso.updateUccStatus.useMutation({
    onSuccess: () => utils.cso.getAllUcc.invalidate(),
  });
  const clarityMut = trpc.cso.generateClarityReport.useMutation({
    onSuccess: (d, vars) => {
      setClarityResult(prev => ({ ...prev, [vars.clientId]: d.report }));
    },
    onError: (e) => toast.error(e.message),
  });

  const tabs = [
    { id: "pipeline", label: "Client Pipeline" },
    { id: "ucc", label: "UCC Forms" },
    { id: "nurture", label: "Nurture" },
    { id: "expenses", label: "My Expenses" },
  ] as const;

  const intakes = intakesQ.data ?? [];
  const uccForms = uccQ.data ?? [];
  const myExpenses = myExpensesQ.data ?? [];

  // Pipeline stages
  const stages = ["new", "reviewing", "in_progress", "completed", "closed"];
  const stageLabels: Record<string, string> = {
    new: "New Inquiry", reviewing: "Reviewing", in_progress: "In Progress",
    completed: "Completed", closed: "Closed",
  };

  // Nurture = completed intakes
  const nurtureClients = intakes.filter(i => i.status === "completed");

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
            <div className="text-base font-bold text-[#1B4D3E] leading-tight">Client Success Office</div>
            <p className="text-xs text-stone-400 mt-0.5">Amina Ibrahim Musa · CSO Lead</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowExpense(true)}
            className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-600 hover:bg-stone-50 transition-colors">
            Submit Expense
          </button>
          <button onClick={() => { setSelectedIntakeRef(undefined); setShowUcc(true); }}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors">
            + New UCC Form
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="px-6 py-4 grid grid-cols-4 gap-4">
        {[
          { label: "Total Intakes", value: intakes.length },
          { label: "New / Unreviewed", value: intakes.filter(i => i.status === "new").length },
          { label: "UCC Forms", value: uccForms.length },
          { label: "In Nurture", value: nurtureClients.length },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-stone-100 px-4 py-3">
            <div className="text-2xl font-bold text-stone-900">{k.value}</div>
            <div className="text-xs text-stone-400 mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="flex gap-1 border-b border-stone-100">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === t.id ? "border-stone-900 text-stone-900" : "border-transparent text-stone-400 hover:text-stone-600"
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Pipeline Tab */}
        {tab === "pipeline" && (
          <div className="space-y-6">
            {stages.map(stage => {
              const items = intakes.filter(i => i.status === stage);
              if (items.length === 0) return null;
              return (
                <div key={stage}>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-sm font-semibold text-stone-700">{stageLabels[stage]}</h3>
                    <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{items.length}</span>
                  </div>
                  <div className="space-y-2">
                    {items.map(intake => (
                      <div key={intake.id} className="bg-white rounded-xl border border-stone-100 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-stone-400">{intake.referenceCode}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(intake.status)}`}>{stageLabels[intake.status]}</span>
                            </div>
                            <p className="text-sm font-medium text-stone-900">{intake.name}</p>
                            <p className="text-xs text-stone-400 mt-0.5">{intake.department} · {intake.serviceType}</p>
                            <p className="text-xs text-stone-400">{intake.email} · {fmt(intake.createdAt)}</p>
                          </div>
                          <div className="flex flex-col gap-1.5 shrink-0">
                            <select
                              value={intake.status}
                              onChange={e => updateIntakeMut.mutate({ referenceCode: intake.referenceCode, status: e.target.value as any })}
                              className="text-xs border border-stone-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-stone-900">
                              {stages.map(s => <option key={s} value={s}>{stageLabels[s]}</option>)}
                            </select>
                            <button
                              onClick={() => { setSelectedIntakeRef(intake.referenceCode); setShowUcc(true); }}
                              className="text-xs bg-stone-100 text-stone-600 px-2 py-1.5 rounded-lg hover:bg-stone-200 transition-colors">
                              Create UCC
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {intakes.length === 0 && (
              <div className="text-center py-16 text-stone-400">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-sm">No client intakes yet.</p>
              </div>
            )}
          </div>
        )}

        {/* UCC Forms Tab */}
        {tab === "ucc" && (
          <div className="space-y-4">
            {uccForms.map(f => (
              <div key={f.id} className="bg-white rounded-xl border border-stone-100 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-stone-700">{f.clientId}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(f.status)}`}>{f.status}</span>
                    </div>
                    <p className="text-sm font-semibold text-stone-900">{f.businessName}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{f.contactName} · {f.contactEmail}</p>
                    <p className="text-xs text-stone-400">{f.industry} · Budget: {f.budgetRange} · Timeline: {f.timeline}</p>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-2">{f.businessGoals}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <select
                      value={f.status}
                      onChange={e => updateUccMut.mutate({ clientId: f.clientId, status: e.target.value as any })}
                      className="text-xs border border-stone-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-stone-900">
                      {["Submitted","Reviewed","Clarity Sent","Converted","Lost"].map(s => <option key={s}>{s}</option>)}
                    </select>
                    <button
                      onClick={() => clarityMut.mutate({ clientId: f.clientId })}
                      disabled={clarityMut.isPending}
                      className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50">
                      {clarityMut.isPending ? "Drafting…" : "AI Clarity Report"}
                    </button>
                  </div>
                </div>
                {clarityResult[f.clientId] && (
                  <div className="mt-4 p-4 bg-stone-50 rounded-lg border border-stone-100">
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">AI Clarity Report Draft</p>
                    <p className="text-sm text-stone-700 whitespace-pre-wrap leading-relaxed">{clarityResult[f.clientId]}</p>
                  </div>
                )}
              </div>
            ))}
            {uccForms.length === 0 && (
              <div className="text-center py-16 text-stone-400">
                <div className="text-4xl mb-3">📝</div>
                <p className="text-sm">No UCC forms yet. Create one from the pipeline view or the button above.</p>
              </div>
            )}
          </div>
        )}

        {/* Nurture Tab */}
        {tab === "nurture" && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
              <strong>Nurture queue</strong> — clients who have completed a project. Check in every 30 days. Offer next engagement.
            </div>
            {nurtureClients.map(c => (
              <div key={c.id} className="bg-white rounded-xl border border-stone-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-stone-900">{c.name}</p>
                    <p className="text-xs text-stone-400">{c.email} · {c.department} · Completed {fmt(c.updatedAt)}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Completed</span>
                </div>
              </div>
            ))}
            {nurtureClients.length === 0 && (
              <div className="text-center py-16 text-stone-400">
                <div className="text-4xl mb-3">🌱</div>
                <p className="text-sm">No clients in nurture yet.</p>
              </div>
            )}
          </div>
        )}

        {/* My Expenses Tab */}
        {tab === "expenses" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={() => setShowExpense(true)}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors">
                + Submit Expense
              </button>
            </div>
            {myExpenses.map(e => (
              <div key={e.id} className="bg-white rounded-xl border border-stone-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-stone-400">{e.expenseRef}</span>
                    <p className="text-sm font-medium text-stone-900 mt-0.5">{e.description}</p>
                    <p className="text-xs text-stone-400">{e.category} · {fmt(e.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-stone-900">₦{e.amountNaira.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      e.status === "Approved" ? "bg-green-100 text-green-700" :
                      e.status === "Rejected" ? "bg-red-100 text-red-600" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{e.status}</span>
                  </div>
                </div>
                {e.rejectionReason && (
                  <p className="text-xs text-red-500 mt-2 bg-red-50 rounded p-2">{e.rejectionReason}</p>
                )}
              </div>
            ))}
            {myExpenses.length === 0 && (
              <div className="text-center py-16 text-stone-400">
                <div className="text-4xl mb-3">💸</div>
                <p className="text-sm">No expenses submitted yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showUcc && <UccModal intakeRef={selectedIntakeRef} onClose={() => { setShowUcc(false); setSelectedIntakeRef(undefined); }} />}
      {showExpense && <ExpenseModal onClose={() => setShowExpense(false)} />}
    </div>
  );
}
