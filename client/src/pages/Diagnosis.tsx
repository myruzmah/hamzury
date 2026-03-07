import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

type Step = {
  id: string;
  question: string;
  subtitle?: string;
  options: { value: string; label: string; desc?: string }[];
};

const STEPS: Step[] = [
  {
    id: "stage",
    question: "What stage is your business at?",
    subtitle: "This helps us calibrate the right recommendations for you.",
    options: [
      { value: "idea", label: "Idea Stage", desc: "I have a concept but haven't launched yet" },
      { value: "startup", label: "Startup", desc: "I've launched but I'm still finding my footing" },
      { value: "growth", label: "Growth", desc: "I'm operational and actively growing" },
      { value: "established", label: "Established", desc: "I have a stable business and want to scale" },
    ],
  },
  {
    id: "challenges",
    question: "What is your biggest challenge right now?",
    subtitle: "Select the area that needs the most attention.",
    options: [
      { value: "operations", label: "Operations & Systems", desc: "Things are disorganised or manual" },
      { value: "brand", label: "Brand & Visibility", desc: "People don't know who we are" },
      { value: "compliance", label: "Compliance & Documentation", desc: "Legal and regulatory gaps" },
      { value: "tech", label: "Technology", desc: "We need better digital tools" },
      { value: "training", label: "Team & Training", desc: "My team needs development" },
      { value: "revenue", label: "Revenue & Growth", desc: "We need more clients and income" },
    ],
  },
  {
    id: "systems",
    question: "How would you describe your current business systems?",
    subtitle: "Be honest — this is a diagnosis, not a test.",
    options: [
      { value: "none", label: "None", desc: "Everything is in my head or on WhatsApp" },
      { value: "basic", label: "Basic", desc: "I use spreadsheets and some apps" },
      { value: "moderate", label: "Moderate", desc: "I have some processes but they're inconsistent" },
      { value: "advanced", label: "Advanced", desc: "I have documented systems and workflows" },
    ],
  },
  {
    id: "timeline",
    question: "When do you want to see improvements?",
    options: [
      { value: "1-3", label: "1–3 months", desc: "I need results quickly" },
      { value: "3-6", label: "3–6 months", desc: "I can invest time in proper setup" },
      { value: "6+", label: "6+ months", desc: "I'm planning for the long term" },
    ],
  },
  {
    id: "budget",
    question: "What is your approximate budget for business improvement?",
    subtitle: "Optional — helps us recommend the right packages.",
    options: [
      { value: "under-100k", label: "Under ₦100,000" },
      { value: "100k-500k", label: "₦100,000 – ₦500,000" },
      { value: "500k-1m", label: "₦500,000 – ₦1,000,000" },
      { value: "over-1m", label: "Over ₦1,000,000" },
      { value: "prefer-not", label: "Prefer not to say" },
    ],
  },
];

type ContactInfo = {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
};

export default function Diagnosis() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contact, setContact] = useState<ContactInfo>({ name: "", email: "", phone: "", whatsapp: "" });
  const [submitted, setSubmitted] = useState(false);
  const [clientId, setClientId] = useState("");

  const submitMutation = trpc.diagnosis.submit.useMutation({
    onSuccess: (data) => {
      setClientId(data.clientId);
      setSubmitted(true);
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const totalSteps = STEPS.length + 1; // +1 for contact step
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);

  const handleSelect = (stepId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [stepId]: value }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = () => {
    if (!contact.name || !contact.email) {
      toast.error("Please provide your name and email.");
      return;
    }
    submitMutation.mutate({ answers, contact });
  };

  const isContactStep = currentStep === STEPS.length;
  const currentStepData = STEPS[currentStep];
  const currentAnswer = currentStepData ? answers[currentStepData.id] : null;

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--milk)" }}>
        <div className="max-w-lg w-full text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "var(--brand-muted)" }}
          >
            <CheckCircle size={28} style={{ color: "var(--brand)" }} />
          </div>
          <h1 className="text-2xl font-semibold mb-4" style={{ color: "var(--charcoal)" }}>
            Your diagnosis is being prepared.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Your personalised Business Health Report will be sent to{" "}
            <strong>{contact.email}</strong> within the next few minutes.
          </p>
          {clientId && (
            <p className="text-xs text-muted-foreground mb-8">
              Your Client Reference: <strong style={{ color: "var(--brand)" }}>{clientId}</strong>
            </p>
          )}
          <p className="text-xs text-muted-foreground mb-8 leading-relaxed">
            A member of our CSO team will follow up within 24 hours to discuss your results
            and recommend the right HAMZURY services for your situation.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm"
              style={{ background: "var(--brand)", color: "white" }}
            >
              Back to Home <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--milk)" }}>
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-8 w-8 object-contain rounded-sm" />
            <span className="font-semibold text-sm tracking-widest uppercase" style={{ color: "var(--brand)" }}>
              HAMZURY
            </span>
          </Link>
          <span className="text-xs text-muted-foreground">Business Health Diagnosis</span>
        </div>
      </header>

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto">
          {/* Progress */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span className="text-xs font-semibold" style={{ color: "var(--brand)" }}>
                {progress}%
              </span>
            </div>
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: "var(--brand)" }}
              />
            </div>
          </div>

          {/* Question card */}
          <div className="bg-white border border-border rounded-sm p-8 md:p-10">
            {!isContactStep && currentStepData ? (
              <>
                <span className="brand-rule" />
                <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--charcoal)" }}>
                  {currentStepData.question}
                </h2>
                {currentStepData.subtitle && (
                  <p className="text-sm text-muted-foreground mb-6">{currentStepData.subtitle}</p>
                )}

                <div className="space-y-3 mb-8">
                  {currentStepData.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(currentStepData.id, opt.value)}
                      className="w-full text-left p-4 rounded-sm border transition-all"
                      style={{
                        borderColor: currentAnswer === opt.value ? "var(--brand)" : "var(--border)",
                        background: currentAnswer === opt.value ? "var(--brand-muted)" : "white",
                      }}
                    >
                      <span className="text-sm font-semibold block" style={{ color: "var(--charcoal)" }}>
                        {opt.label}
                      </span>
                      {opt.desc && (
                        <span className="text-xs text-muted-foreground mt-0.5 block">{opt.desc}</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 text-xs font-medium text-muted-foreground disabled:opacity-30 hover:text-foreground transition-colors"
                  >
                    <ArrowLeft size={12} /> Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!currentAnswer}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-sm transition-opacity disabled:opacity-40"
                    style={{ background: "var(--brand)", color: "white" }}
                  >
                    Continue <ArrowRight size={14} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="brand-rule" />
                <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--charcoal)" }}>
                  Where should we send your report?
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Your personalised Business Health Report will be delivered to your email and WhatsApp.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    { key: "name", label: "Full Name", placeholder: "Your full name", required: true },
                    { key: "email", label: "Email Address", placeholder: "your@email.com", required: true },
                    { key: "phone", label: "Phone Number", placeholder: "+234 800 000 0000", required: false },
                    { key: "whatsapp", label: "WhatsApp Number", placeholder: "+234 800 000 0000 (if different)", required: false },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--charcoal)" }}>
                        {field.label} {field.required && <span style={{ color: "var(--brand)" }}>*</span>}
                      </label>
                      <input
                        type={field.key === "email" ? "email" : "text"}
                        placeholder={field.placeholder}
                        value={contact[field.key as keyof ContactInfo]}
                        onChange={(e) =>
                          setContact((prev) => ({ ...prev, [field.key]: e.target.value }))
                        }
                        className="w-full px-4 py-3 text-sm border border-border rounded-sm focus:outline-none focus:border-primary/50 bg-white"
                        style={{ color: "var(--charcoal)" }}
                      />
                    </div>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                  By submitting, you agree to receive your Business Health Report and a follow-up from
                  HAMZURY's CSO team. We do not share your information with third parties.
                </p>

                <div className="flex items-center justify-between">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft size={12} /> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitMutation.isPending || !contact.name || !contact.email}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-sm transition-opacity disabled:opacity-40"
                    style={{ background: "var(--brand)", color: "white" }}
                  >
                    {submitMutation.isPending ? (
                      <><Loader2 size={14} className="animate-spin" /> Generating Report...</>
                    ) : (
                      <>Get My Report <ArrowRight size={14} /></>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Trust signals */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Free · No obligation · Report delivered within minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
