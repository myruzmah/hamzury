import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

function fmt(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
}
function statusColor(s: string) {
  const m: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Shortlisted: "bg-blue-100 text-blue-700",
    Accepted: "bg-green-100 text-green-700",
    Declined: "bg-red-100 text-red-600",
    Confirmed: "bg-green-100 text-green-700",
    Planning: "bg-stone-100 text-stone-500",
    Active: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    "On Hold": "bg-orange-100 text-orange-700",
  };
  return m[s] ?? "bg-stone-100 text-stone-600";
}

// ─── Expense Submit Modal ─────────────────────────────────────────────────────
function ExpenseModal({ onClose }: { onClose: () => void }) {
  const utils = trpc.useUtils();
  const [form, setForm] = useState({ department: "RIDI", description: "", amountNaira: "", category: "Operations" as const });
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

// ─── Main RIDI Dashboard ──────────────────────────────────────────────────────
export default function RidiDashboard() {
  const [tab, setTab] = useState<"scholarships" | "donations" | "programmes" | "impact">("scholarships");
  const [showExpense, setShowExpense] = useState(false);
  const utils = trpc.useUtils();

  const scholarshipsQ = trpc.ridiExt.getAllScholarships.useQuery();
  const donationsQ = trpc.ridiExt.getAllDonations.useQuery();
  const programsQ = trpc.ridi.programs.useQuery();
  const totalsQ = trpc.ridi.totals.useQuery();

  const updateScholarshipMut = trpc.ridiExt.updateScholarshipStatus.useMutation({
    onSuccess: () => utils.ridiExt.getAllScholarships.invalidate(),
    onError: (e) => toast.error(e.message),
  });
  const updateDonationMut = trpc.ridiExt.updateDonationStatus.useMutation({
    onSuccess: () => utils.ridiExt.getAllDonations.invalidate(),
    onError: (e) => toast.error(e.message),
  });

  const scholarships = scholarshipsQ.data ?? [];
  const donations = donationsQ.data ?? [];
  const programs = programsQ.data ?? [];
  const totals = totalsQ.data;

  const tabs = [
    { id: "scholarships", label: `Scholarships (${scholarships.length})` },
    { id: "donations", label: `Donations (${donations.length})` },
    { id: "programmes", label: "Programmes" },
    { id: "impact", label: "Impact Summary" },
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
            <div className="text-base font-bold text-[#1B4D3E] leading-tight">RIDI Department</div>
            <p className="text-xs text-stone-400 mt-0.5">Zainab Umar · RIDI Lead</p>
          </div>
        </div>
        <button onClick={() => setShowExpense(true)}
          className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-600 hover:bg-stone-50 transition-colors">
          Submit Expense
        </button>
      </div>

      {/* KPI Strip */}
      <div className="px-6 py-4 grid grid-cols-4 gap-4">
        {[
          { label: "Total Beneficiaries", value: totals?.totalBeneficiaries ?? 0 },
          { label: "Women Reached", value: totals?.women ?? 0 },
          { label: "Youth Reached", value: totals?.youth ?? 0 },
          { label: "Scholarship Applications", value: scholarships.length },
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
        {/* Scholarships Tab */}
        {tab === "scholarships" && (
          <div className="space-y-3">
            {scholarships.map(s => (
              <div key={s.id} className="bg-white rounded-xl border border-stone-100 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-stone-400">{s.applicationRef}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(s.status)}`}>{s.status}</span>
                    </div>
                    <p className="text-sm font-semibold text-stone-900">{s.name}</p>
                    <p className="text-xs text-stone-400">{s.gender} · Age {s.age} · {s.state}, {s.lga}</p>
                    <p className="text-xs text-stone-500 mt-1">Interest: {s.areaOfInterest}</p>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-2 italic">"{s.story}"</p>
                  </div>
                  <select
                    value={s.status}
                    onChange={e => updateScholarshipMut.mutate({ applicationRef: s.applicationRef, status: e.target.value as any })}
                    className="text-xs border border-stone-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-stone-900 shrink-0">
                    {["Pending","Shortlisted","Accepted","Declined"].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
            ))}
            {scholarships.length === 0 && (
              <div className="text-center py-16 text-stone-400">
                <div className="text-4xl mb-3">🎓</div>
                <p className="text-sm">No scholarship applications yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Donations Tab */}
        {tab === "donations" && (
          <div className="space-y-3">
            {donations.map(d => (
              <div key={d.id} className="bg-white rounded-xl border border-stone-100 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-stone-400">{d.donationRef}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(d.status)}`}>{d.status}</span>
                    </div>
                    <p className="text-sm font-semibold text-stone-900">{d.name}</p>
                    <p className="text-xs text-stone-400">{d.email} · {fmt(d.createdAt)}</p>
                    {d.message && <p className="text-xs text-stone-500 mt-1 italic">"{d.message}"</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-stone-900">{d.amount}</p>
                    {d.status === "Pending" && (
                      <button
                        onClick={() => updateDonationMut.mutate({ donationRef: d.donationRef, status: "Confirmed" })}
                        className="mt-1 text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors">
                        Confirm
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {donations.length === 0 && (
              <div className="text-center py-16 text-stone-400">
                <div className="text-4xl mb-3">💚</div>
                <p className="text-sm">No donations yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Programmes Tab */}
        {tab === "programmes" && (
          <div className="space-y-3">
            {programs.map((p: any) => (
              <div key={p.id} className="bg-white rounded-xl border border-stone-100 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-stone-400">{p.programRef}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(p.status)}`}>{p.status}</span>
                    </div>
                    <p className="text-sm font-semibold text-stone-900">{p.programName}</p>
                    <p className="text-xs text-stone-400">{p.programType} · {p.location}</p>
                    <p className="text-xs text-stone-400">{fmt(p.startDate)}{p.endDate ? ` → ${fmt(p.endDate)}` : ""}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-stone-900">{p.totalBeneficiaries}</p>
                    <p className="text-xs text-stone-400">beneficiaries</p>
                    <p className="text-xs text-stone-400">W: {p.women} · Y: {p.youth} · M: {p.men}</p>
                  </div>
                </div>
              </div>
            ))}
            {programs.length === 0 && (
              <div className="text-center py-16 text-stone-400">
                <div className="text-4xl mb-3">🌍</div>
                <p className="text-sm">No programmes recorded yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Impact Summary Tab */}
        {tab === "impact" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-stone-100 p-5">
                <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-3">Beneficiary Breakdown</p>
                <div className="space-y-2">
                  {[
                    { label: "Total Beneficiaries", value: totals?.totalBeneficiaries ?? 0, color: "text-stone-900" },
                    { label: "Women", value: totals?.women ?? 0, color: "text-pink-600" },
                    { label: "Youth", value: totals?.youth ?? 0, color: "text-blue-600" },
                    { label: "Men", value: totals?.men ?? 0, color: "text-stone-600" },
                    { label: "Referrals to HAMZURY", value: totals?.referrals ?? 0, color: "text-emerald-600" },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between">
                      <span className="text-sm text-stone-500">{row.label}</span>
                      <span className={`text-sm font-bold ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-stone-100 p-5">
                <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-3">Programme Status</p>
                <div className="space-y-2">
                  {["Planning","Active","Completed","On Hold"].map(s => {
                    const count = programs.filter((p: any) => p.status === s).length;
                    return (
                      <div key={s} className="flex items-center justify-between">
                        <span className="text-sm text-stone-500">{s}</span>
                        <span className="text-sm font-bold text-stone-900">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide mb-2">Scholarship Pipeline</p>
              <div className="grid grid-cols-4 gap-4">
                {["Pending","Shortlisted","Accepted","Declined"].map(s => (
                  <div key={s} className="text-center">
                    <p className="text-2xl font-bold text-emerald-700">{scholarships.filter(a => a.status === s).length}</p>
                    <p className="text-xs text-emerald-600">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showExpense && <ExpenseModal onClose={() => setShowExpense(false)} />}
    </div>
  );
}
