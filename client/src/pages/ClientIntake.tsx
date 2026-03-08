/**
 * HAMZURY Frictionless Client Intake
 * One question at a time. No login. No friction.
 * On completion: generates a reference code and shows it clearly.
 */
import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ArrowRight, ArrowLeft, Upload, X } from "lucide-react";
import { Link } from "wouter";

// ── Department → services map ─────────────────────────────────────────────────
const DEPT_SERVICES: Record<string, string[]> = {
  Studios: [
    "Brand Identity Design",
    "Social Media Management",
    "Content Strategy",
    "Podcast Production",
    "Event Media Coverage",
    "Faceless Channel Creation",
  ],
  Bizdoc: [
    "CAC Business Name Registration",
    "CAC Company Incorporation",
    "Annual Returns Filing",
    "Tax Registration (FIRS/LIRS)",
    "PENCOM Registration",
    "Industry Licensing",
    "Compliance Advisory",
    "Trademark Registration",
  ],
  Systems: [
    "Business Website",
    "Web Application",
    "Client Dashboard",
    "Automation System",
    "AI-Powered Workflow",
    "CRM System",
  ],
  Innovation: [
    "Executive Leadership Training",
    "Robotics & Technology Training",
    "Internship Programme",
    "Digital Skills Training",
    "Professional Development Workshop",
  ],
  Growth: [
    "Lead Generation",
    "Strategic Partnership",
    "Grant Application",
    "Campaign Management",
    "Market Research",
  ],
  People: [
    "Recruitment",
    "Staff Onboarding",
    "Performance Review System",
    "Attendance Tracking",
    "Staff Welfare Programme",
  ],
  Ledger: [
    "Bookkeeping",
    "Financial Reporting",
    "Commission Processing",
    "Expense Management",
    "Payroll",
  ],
  RIDI: [
    "Digital Skills Programme",
    "Entrepreneurship Training",
    "Climate Education",
    "Community Partnership",
  ],
  Robotics: [
    "Robotics Education Programme",
    "Technology Demonstration",
    "Innovation Workshop",
  ],
  CSO: [
    "General Enquiry",
    "Service Recommendation",
    "Client Onboarding Support",
  ],
};

const DEPT_LABELS: Record<string, string> = {
  Studios: "Studios — Creative & Media",
  Bizdoc: "Bizdoc — Business Documentation & Compliance",
  Systems: "Systems — Technology & Digital",
  Innovation: "Innovation Hub — Training & Development",
  Growth: "Growth — Business Development",
  People: "People — Human Resources",
  Ledger: "Ledger — Finance & Accounting",
  RIDI: "RIDI — Community Impact",
  Robotics: "Robotics — Technology Education",
  CSO: "General Enquiry",
};

type Step = "department" | "service" | "describe" | "contact" | "upload" | "confirm" | "done";

interface FormData {
  department: string;
  serviceType: string;
  description: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

const STEPS: Step[] = ["department", "service", "describe", "contact", "upload", "confirm", "done"];

export default function ClientIntake() {
  const [step, setStep] = useState<Step>("department");
  const [form, setForm] = useState<FormData>({
    department: "",
    serviceType: "",
    description: "",
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
  });
  const [referenceCode, setReferenceCode] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const submitMutation = trpc.intake.submit.useMutation({
    onSuccess: (data) => {
      setReferenceCode(data.referenceCode);
      setStep("done");
    },
    onError: (e) => setError(e.message),
  });

  const stepIndex = STEPS.indexOf(step);
  const progress = Math.round((stepIndex / (STEPS.length - 1)) * 100);

  function next(s?: Step) {
    setError("");
    if (s) { setStep(s); return; }
    setStep(STEPS[stepIndex + 1]);
  }
  function back() {
    setError("");
    setStep(STEPS[stepIndex - 1]);
  }

  function handleSubmit() {
    submitMutation.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone,
      whatsapp: form.whatsapp || undefined,
      department: form.department as "Studios" | "Bizdoc" | "Systems" | "Innovation" | "Growth" | "People" | "Ledger" | "RIDI" | "Robotics" | "CSO",
      serviceType: form.serviceType,
      description: form.description,
      attachmentUrl: form.attachmentUrl,
      attachmentName: form.attachmentName,
    });
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FDF5E6" }}>
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: "#d4c9b0" }}>
        <Link href="/">
          <span className="font-semibold text-sm tracking-wide" style={{ color: "#1B4D3E" }}>HAMZURY</span>
        </Link>
        {step !== "done" && (
          <span className="text-xs text-muted-foreground">
            Step {stepIndex + 1} of {STEPS.length - 1}
          </span>
        )}
      </header>

      {/* Progress bar */}
      {step !== "done" && (
        <div className="h-0.5 w-full" style={{ background: "#d4c9b0" }}>
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "#1B4D3E" }}
          />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">

          {/* ── Step: Department ── */}
          {step === "department" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#1B4D3E" }}>
                Start Here
              </p>
              <h1 className="text-2xl font-light mb-2" style={{ color: "#333333" }}>
                What do you need help with?
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                Select the area that best describes your need. We will guide you from here.
              </p>
              <div className="grid gap-2">
                {Object.entries(DEPT_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => { setForm(f => ({ ...f, department: key, serviceType: "" })); next("service"); }}
                    className="text-left px-4 py-3 rounded border text-sm transition-all hover:border-[#1B4D3E] hover:bg-white"
                    style={{ borderColor: "#d4c9b0", background: "white", color: "#333333" }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step: Service ── */}
          {step === "service" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#1B4D3E" }}>
                {DEPT_LABELS[form.department]}
              </p>
              <h1 className="text-2xl font-light mb-2" style={{ color: "#333333" }}>
                Which service do you need?
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                Choose the specific service. You can add more detail in the next step.
              </p>
              <div className="grid gap-2 mb-6">
                {(DEPT_SERVICES[form.department] ?? []).map((svc) => (
                  <button
                    key={svc}
                    onClick={() => { setForm(f => ({ ...f, serviceType: svc })); next("describe"); }}
                    className="text-left px-4 py-3 rounded border text-sm transition-all hover:border-[#1B4D3E] hover:bg-white"
                    style={{ borderColor: "#d4c9b0", background: "white", color: "#333333" }}
                  >
                    {svc}
                  </button>
                ))}
              </div>
              <button onClick={back} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <ArrowLeft size={12} /> Back
              </button>
            </div>
          )}

          {/* ── Step: Describe ── */}
          {step === "describe" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#1B4D3E" }}>
                {form.serviceType}
              </p>
              <h1 className="text-2xl font-light mb-2" style={{ color: "#333333" }}>
                Tell us about your project.
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                Describe what you need, your timeline, and any important context. The more detail you provide, the faster we can begin.
              </p>
              <Textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="e.g. We are a new company that needs to register with CAC. We have a proposed name already. We want to complete this within 2 weeks."
                rows={5}
                className="mb-6 resize-none"
                style={{ background: "white", borderColor: "#d4c9b0" }}
              />
              {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
              <div className="flex items-center justify-between">
                <button onClick={back} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <ArrowLeft size={12} /> Back
                </button>
                <Button
                  onClick={() => {
                    if (form.description.trim().length < 10) { setError("Please describe your project in at least a few words."); return; }
                    next();
                  }}
                  style={{ background: "#1B4D3E", color: "white" }}
                >
                  Continue <ArrowRight size={14} className="ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Step: Contact ── */}
          {step === "contact" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#1B4D3E" }}>
                Your Details
              </p>
              <h1 className="text-2xl font-light mb-2" style={{ color: "#333333" }}>
                How do we reach you?
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                Your project reference and updates will be sent to these contacts.
              </p>
              <div className="grid gap-3 mb-6">
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "#333333" }}>Full Name *</label>
                  <Input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your full name"
                    style={{ background: "white", borderColor: "#d4c9b0" }}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "#333333" }}>Email Address *</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com"
                    style={{ background: "white", borderColor: "#d4c9b0" }}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "#333333" }}>Phone Number *</label>
                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+234 800 000 0000"
                    style={{ background: "white", borderColor: "#d4c9b0" }}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "#333333" }}>WhatsApp Number <span className="text-muted-foreground font-normal">(if different from phone)</span></label>
                  <Input
                    type="tel"
                    value={form.whatsapp}
                    onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                    placeholder="+234 800 000 0000"
                    style={{ background: "white", borderColor: "#d4c9b0" }}
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
              <div className="flex items-center justify-between">
                <button onClick={back} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <ArrowLeft size={12} /> Back
                </button>
                <Button
                  onClick={() => {
                    if (!form.name.trim()) { setError("Please enter your name."); return; }
                    if (!form.email.includes("@")) { setError("Please enter a valid email address."); return; }
                    if (form.phone.trim().length < 7) { setError("Please enter a valid phone number."); return; }
                    next();
                  }}
                  style={{ background: "#1B4D3E", color: "white" }}
                >
                  Continue <ArrowRight size={14} className="ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Step: Upload ── */}
          {step === "upload" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#1B4D3E" }}>
                Optional
              </p>
              <h1 className="text-2xl font-light mb-2" style={{ color: "#333333" }}>
                Do you have a brief or reference file?
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                You can attach a brief, existing logo, document, or any reference material. This is optional — you can always send files later.
              </p>
              {form.attachmentName ? (
                <div className="flex items-center gap-3 p-3 rounded border mb-6" style={{ borderColor: "#1B4D3E", background: "white" }}>
                  <CheckCircle2 size={16} style={{ color: "#1B4D3E" }} />
                  <span className="text-sm flex-1 truncate" style={{ color: "#333333" }}>{form.attachmentName}</span>
                  <button onClick={() => setForm(f => ({ ...f, attachmentUrl: undefined, attachmentName: undefined }))}>
                    <X size={14} className="text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed rounded p-8 text-center mb-6 hover:border-[#1B4D3E] transition-colors"
                  style={{ borderColor: "#d4c9b0", background: "white" }}
                >
                  <Upload size={20} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to attach a file</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, Word, PNG, JPG — up to 10MB</p>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Store file name for display; actual upload happens on confirm
                    setForm(f => ({ ...f, attachmentName: file.name, attachmentUrl: `pending:${file.name}` }));
                  }
                }}
              />
              <div className="flex items-center justify-between">
                <button onClick={back} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <ArrowLeft size={12} /> Back
                </button>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => next("confirm")} style={{ borderColor: "#d4c9b0" }}>
                    Skip for now
                  </Button>
                  <Button onClick={() => next("confirm")} style={{ background: "#1B4D3E", color: "white" }}>
                    Continue <ArrowRight size={14} className="ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ── Step: Confirm ── */}
          {step === "confirm" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#1B4D3E" }}>
                Review & Submit
              </p>
              <h1 className="text-2xl font-light mb-6" style={{ color: "#333333" }}>
                Everything looks right?
              </h1>
              <div className="rounded border divide-y mb-6" style={{ borderColor: "#d4c9b0", background: "white" }}>
                {[
                  { label: "Department", value: DEPT_LABELS[form.department] },
                  { label: "Service", value: form.serviceType },
                  { label: "Name", value: form.name },
                  { label: "Email", value: form.email },
                  { label: "Phone", value: form.phone },
                  ...(form.whatsapp ? [{ label: "WhatsApp", value: form.whatsapp }] : []),
                  ...(form.attachmentName ? [{ label: "Attachment", value: form.attachmentName }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex px-4 py-3 gap-4">
                    <span className="text-xs text-muted-foreground w-24 shrink-0">{label}</span>
                    <span className="text-sm" style={{ color: "#333333" }}>{value}</span>
                  </div>
                ))}
                <div className="px-4 py-3">
                  <span className="text-xs text-muted-foreground block mb-1">Description</span>
                  <p className="text-sm" style={{ color: "#333333" }}>{form.description}</p>
                </div>
              </div>
              {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
              <div className="flex items-center justify-between">
                <button onClick={back} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <ArrowLeft size={12} /> Back
                </button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitMutation.isPending}
                  style={{ background: "#1B4D3E", color: "white" }}
                >
                  {submitMutation.isPending ? "Submitting…" : "Submit Request"}
                </Button>
              </div>
            </div>
          )}

          {/* ── Step: Done ── */}
          {step === "done" && (
            <div className="animate-in fade-in zoom-in-95 duration-400 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "#1B4D3E" }}>
                <CheckCircle2 size={28} color="white" />
              </div>
              <h1 className="text-2xl font-light mb-3" style={{ color: "#333333" }}>
                Your request has been received.
              </h1>
              <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
                Your project reference is below. Save it — you will use it to check your project status at any time.
              </p>
              <div className="inline-block px-8 py-4 rounded border-2 mb-6" style={{ borderColor: "#1B4D3E", background: "white" }}>
                <p className="text-xs text-muted-foreground mb-1">Your Reference Code</p>
                <p className="text-3xl font-light tracking-widest" style={{ color: "#1B4D3E" }}>{referenceCode}</p>
              </div>
              <p className="text-xs text-muted-foreground mb-8">
                A confirmation has been sent to <strong>{form.email}</strong>.<br />
                Our team will review your request and reach out within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={`/track?ref=${referenceCode}`}>
                  <Button variant="outline" style={{ borderColor: "#1B4D3E", color: "#1B4D3E" }}>
                    Track My Project
                  </Button>
                </Link>
                <Link href="/">
                  <Button style={{ background: "#1B4D3E", color: "white" }}>
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
