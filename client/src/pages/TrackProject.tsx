/**
 * HAMZURY Project Tracker
 * Client enters their reference code and sees their project status with milestone tracker.
 * No login required.
 */
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useSearch } from "wouter";
import { CheckCircle2, Clock, AlertCircle, ArrowRight, Circle } from "lucide-react";

const BRAND = "#1B4D3E";
const MILK = "#FDF5E6";

const MILESTONES = [
  { id: "new", label: "Brief Received", description: "Your request has been received and logged in our system." },
  { id: "reviewing", label: "Under Review", description: "Our team is reviewing your brief and preparing a response." },
  { id: "in_progress", label: "In Progress", description: "Work has begun on your project." },
  { id: "completed", label: "Delivered", description: "Your project has been completed and delivered." },
  { id: "closed", label: "Closed", description: "This engagement has been closed and archived." },
];

const STATUS_ORDER = ["new", "reviewing", "in_progress", "completed", "closed"];

const DEPT_LABELS: Record<string, string> = {
  Studios: "Studios — Creative & Media",
  Bizdoc: "Bizdoc — Business Documentation",
  Systems: "Systems — Technology",
  Innovation: "Innovation Hub",
  Growth: "Growth — Business Development",
  People: "People — HR",
  Ledger: "Ledger — Finance",
  RIDI: "RIDI — Community Impact",
  Robotics: "Robotics",
  CSO: "General Enquiry",
};

function MilestoneTracker({ status }: { status: string }) {
  const currentIdx = STATUS_ORDER.indexOf(status);

  return (
    <div className="px-6 py-6 border-b" style={{ borderColor: "#e5e7eb" }}>
      <p className="text-xs font-medium uppercase tracking-wider mb-5 text-muted-foreground">Project Lifecycle</p>
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute top-4 left-4 right-4 h-px" style={{ background: "#e5e7eb" }} />
        <div
          className="absolute top-4 left-4 h-px transition-all duration-700"
          style={{
            background: BRAND,
            width: currentIdx <= 0 ? "0%" : `${Math.min((currentIdx / (MILESTONES.length - 1)) * 100, 100)}%`,
          }}
        />

        {/* Milestone dots */}
        <div className="relative flex justify-between">
          {MILESTONES.map((m, i) => {
            const isCompleted = i < currentIdx;
            const isCurrent = i === currentIdx;
            const isPending = i > currentIdx;

            return (
              <div key={m.id} className="flex flex-col items-center gap-2" style={{ width: `${100 / MILESTONES.length}%` }}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white"
                  style={{
                    borderColor: isCompleted || isCurrent ? BRAND : "#d1d5db",
                    background: isCompleted ? BRAND : isCurrent ? BRAND + "15" : "white",
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={14} color="white" />
                  ) : isCurrent ? (
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: BRAND }} />
                  ) : (
                    <Circle size={10} color="#d1d5db" />
                  )}
                </div>
                <div className="text-center">
                  <p
                    className="text-xs font-medium leading-tight"
                    style={{ color: isCompleted || isCurrent ? BRAND : "#9ca3af" }}
                  >
                    {m.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current stage description */}
      <div className="mt-6 p-4 rounded-lg" style={{ background: BRAND + "08" }}>
        <p className="text-xs font-medium mb-1" style={{ color: BRAND }}>
          Current stage: {MILESTONES[currentIdx]?.label ?? "Unknown"}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {MILESTONES[currentIdx]?.description}
        </p>
      </div>
    </div>
  );
}

export default function TrackProject() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const prefilled = params.get("ref") ?? "";

  const [refInput, setRefInput] = useState(prefilled);
  const [submitted, setSubmitted] = useState(!!prefilled);

  const { data, isLoading, error, refetch } = trpc.intake.checkStatus.useQuery(
    { referenceCode: refInput.trim().toUpperCase() },
    { enabled: submitted && refInput.trim().length > 0 }
  );

  useEffect(() => {
    if (prefilled) setSubmitted(true);
  }, [prefilled]);

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: MILK }}>

      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b bg-white" style={{ borderColor: "#e5e7eb" }}>
        <Link href="/">
          <span className="font-semibold text-sm tracking-[0.15em] uppercase" style={{ color: BRAND }}>HAMZURY</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/start">
            <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Start a new request</span>
          </Link>
          <Link href="/">
            <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Home</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-16">
        <div className="w-full max-w-lg">

          {!submitted || (!data && !isLoading) ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: BRAND }}>
                Project Tracker
              </p>
              <h1 className="text-3xl font-light mb-2" style={{ color: "#1a1a1a" }}>
                Track your project.
              </h1>
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                Enter the reference code you received when you submitted your request. Your reference code looks like <span className="font-mono">HMZ-2026-0001</span>.
              </p>
              <div className="flex gap-2 mb-4">
                <Input
                  value={refInput}
                  onChange={e => setRefInput(e.target.value.toUpperCase())}
                  placeholder="HMZ-2026-0001"
                  className="font-mono tracking-widest bg-white"
                  style={{ borderColor: "#d1d5db" }}
                  onKeyDown={e => { if (e.key === "Enter") setSubmitted(true); }}
                />
                <Button
                  onClick={() => setSubmitted(true)}
                  style={{ background: BRAND, color: "white" }}
                >
                  Track
                </Button>
              </div>
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg border text-sm" style={{ borderColor: "#fca5a5", background: "#fef2f2", color: "#dc2626" }}>
                  <AlertCircle size={14} />
                  Reference code not found. Please check and try again.
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-5">
                Don&apos;t have a reference code?{" "}
                <Link href="/start">
                  <span className="underline cursor-pointer" style={{ color: BRAND }}>Submit a new request</span>
                </Link>
              </p>
            </div>

          ) : isLoading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: BRAND }} />
              <p className="text-sm text-muted-foreground">Looking up your project…</p>
            </div>

          ) : data ? (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <div className="rounded-xl border overflow-hidden bg-white" style={{ borderColor: "#e5e7eb" }}>

                {/* Reference header */}
                <div className="px-6 py-5" style={{ background: BRAND }}>
                  <p className="text-xs font-medium tracking-widest uppercase text-white/50 mb-1">Reference</p>
                  <p className="text-2xl font-light tracking-widest text-white">{data.referenceCode}</p>
                </div>

                {/* Milestone Tracker */}
                <MilestoneTracker status={data.status} />

                {/* Project Details */}
                <div className="px-6 py-5">
                  <p className="text-xs font-medium uppercase tracking-wider mb-4 text-muted-foreground">Project Details</p>
                  <div className="space-y-3">
                    {[
                      { label: "Name", value: data.name },
                      { label: "Department", value: DEPT_LABELS[data.department] ?? data.department },
                      { label: "Service", value: data.serviceType },
                      { label: "Submitted", value: new Date(data.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }) },
                      { label: "Last Updated", value: new Date(data.updatedAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }) },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex gap-4">
                        <span className="text-xs text-muted-foreground w-28 shrink-0 pt-0.5">{label}</span>
                        <span className="text-sm" style={{ color: "#1a1a1a" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deliverables / contact section when completed */}
                {(data.status === "completed" || data.status === "closed") && (
                  <div className="px-6 py-5 border-t" style={{ borderColor: "#e5e7eb" }}>
                    <p className="text-xs font-medium uppercase tracking-wider mb-3 text-muted-foreground">Next Steps</p>
                    <div className="p-4 rounded-lg" style={{ background: BRAND + "08" }}>
                      <p className="text-sm leading-relaxed" style={{ color: BRAND }}>Your project has been completed. Contact your project lead to receive your deliverables and final files.</p>
                      <a
                        href={`https://wa.me/2348000000000?text=Hi%20HAMZURY%2C%20my%20reference%20is%20${data.referenceCode}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium px-3 py-2 rounded-lg text-white"
                        style={{ background: "#25D366" }}
                      >
                        Contact on WhatsApp
                      </a>
                    </div>
                  </div>
                )}

                <div className="px-6 pb-5 flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setSubmitted(false); setRefInput(""); }}
                    style={{ borderColor: "#d1d5db" }}
                  >
                    Track another
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => refetch()}
                    style={{ background: BRAND, color: "white" }}
                  >
                    <ArrowRight size={13} className="mr-1.5" /> Refresh status
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-5">
                Questions? Contact us at{" "}
                <a href="mailto:hello@hamzury.com" style={{ color: BRAND }}>hello@hamzury.com</a>
              </p>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
