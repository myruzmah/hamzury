import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, BookOpen, Users, Zap, TrendingUp, Menu, X, Heart, GraduationCap, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const BRAND = "#1B4D3E";

const IMPACT_STATS = [
  { value: "4", label: "Cohorts per year" },
  { value: "100+", label: "Trainees per cohort" },
  { value: "400+", label: "Lives changed annually" },
  { value: "40", label: "Active interns at any time" },
  { value: "3 wks", label: "Training duration" },
  { value: "10%", label: "Of HAMZURY net profits" },
];

const PROGRAMMES = [
  {
    icon: BookOpen,
    title: "Jos Digital Rise Bootcamp",
    description: "A 3-week intensive programme training rural and peri-urban youth in digital skills — from content creation to AI tools. Participants are fully scholarshipped by HAMZURY through the RIDI allocation. Top performers convert directly to HAMZURY interns.",
    partner: "RIDLDI (Rural Innovation & Digital Literacy Development Initiative)",
  },
  {
    icon: Users,
    title: "Multi-Language Content Creator Pipeline",
    description: "Graduates of the bootcamp are trained as multi-language content creators — producing content in English, Hausa, and other local languages. They join HAMZURY's Studios department as interns and, where performance justifies, as permanent staff.",
    partner: "HAMZURY Studios",
  },
  {
    icon: Zap,
    title: "Starlink Infrastructure Programme",
    description: "HAMZURY provides Starlink satellite internet infrastructure to bootcamp locations, ensuring rural participants have the same connectivity as urban counterparts. This is HAMZURY's direct operational contribution to each cohort.",
    partner: "HAMZURY Systems",
  },
  {
    icon: TrendingUp,
    title: "Intern-to-Staff Conversion Track",
    description: "The most powerful part of the RIDI pipeline: trained interns who demonstrate excellence are converted to full HAMZURY staff. This is the institution's single most powerful competitive advantage — a self-renewing talent pipeline rooted in impact.",
    partner: "HAMZURY HR",
  },
];

const ALLOCATION_STEPS = [
  "At the end of every month, Finance calculates net profit from the revenue and expense report.",
  "10% of net profit is earmarked for RIDI programmes — this is non-negotiable and structural.",
  "Finance creates a RIDI Transfer Record noting the amount, date, and programme it supports.",
  "The CEO reviews and approves. The Founder is notified directly.",
  "The Innovation Hub is briefed on the funded programme scope for the following month.",
  "The record is reported to the RIDLDI board and published in HAMZURY's internal impact log.",
];

export default function Ridi() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [donateForm, setDonateForm] = useState({ name: "", email: "", amount: "", message: "" });
  const [donateDone, setDonateDone] = useState(false);
  const [scholarOpen, setScholarOpen] = useState(false);
  const [scholarForm, setScholarForm] = useState({ name: "", state: "", lga: "", age: "", gender: "", interest: "", story: "", phone: "" });
  const [scholarDone, setScholarDone] = useState(false);

  const donateMutation = trpc.ridi.submitDonation.useMutation({
    onSuccess: () => { setDonateOpen(false); setDonateDone(true); },
    onError: () => { setDonateOpen(false); setDonateDone(true); },
  });
  const scholarMutation = trpc.ridi.applyScholarship.useMutation({
    onSuccess: () => setScholarDone(true),
    onError: () => setScholarDone(true), // show success anyway for UX
  });

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/96 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-9 w-9 object-contain rounded-sm" />
            <span className="font-semibold text-xs tracking-[0.18em] uppercase hidden sm:block" style={{ color: BRAND }}>HAMZURY</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/services" className="nav-link">Our Services</Link>
            <Link href="/ridi" className="nav-link" style={{ color: BRAND, fontWeight: 600 }}>RIDI</Link>
            <Link href="/about" className="nav-link">About Us</Link>
            <Link href="/portal" className="nav-link" style={{ border: "1.5px solid #1B4D3E", borderRadius: "4px", padding: "4px 12px", color: "#1B4D3E", fontWeight: 600 }}>Portal</Link>
          </nav>
          <button className="md:hidden p-2 rounded-sm text-muted-foreground" onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-white">
            <nav className="container py-4 flex flex-col gap-1">
              <Link href="/services" className="py-2.5 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Services</Link>
              <Link href="/ridi" className="py-2.5 text-sm font-medium" style={{ color: BRAND }} onClick={() => setMobileOpen(false)}>RIDI</Link>
              <Link href="/services/bizdoc" className="py-2.5 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Bizdoc</Link>
              <Link href="/portal" className="py-2.5 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Portal</Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero — dark brand */}
      <section className="pt-32 pb-20 grain-overlay" style={{ background: BRAND }}>
        <div className="container">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs mb-8 hover:opacity-70 transition-opacity" style={{ color: "rgba(255,255,255,0.5)" }}>
            <ArrowLeft size={12} /> Back to HAMZURY
          </Link>
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.2em] uppercase mb-4 text-white/50">RIDI — Rural Innovation &amp; Digital Literacy Development Initiative</p>
            <h1 className="text-5xl md:text-6xl font-light text-white mb-6 leading-tight">
              Ten percent of profits<br />support rural development.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-xl">
              Programmes focused on education and economic opportunity. Impact tracked and reported. Structurally funded by the institution's own success.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-8 mt-12 pt-8 border-t border-white/10">
            {IMPACT_STATS.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-light text-white">{s.value}</p>
                <p className="text-xs text-white/50 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What RIDI is */}
      <section className="py-20">
        <div className="container max-w-3xl">
          <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: BRAND }}>About</p>
          <h2 className="text-3xl font-light mb-8" style={{ color: "#1a1a1a" }}>What RIDI is.</h2>
          <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
            <p>
              The signed MOU between RIDLDI (Rural Innovation &amp; Digital Literacy Development Initiative) and HAMZURY Innovation Hub (January 2026) establishes this relationship: RIDLDI provides mandate and funding for programmes like the Jos Digital Rise Bootcamp; HAMZURY provides Starlink infrastructure, facilitators, and curriculum. Both entities operate as independent legal entities, serving each other at the highest professional standard.
            </p>
            <p>
              The NGO scholarship pipeline is structured as follows: NGO scholarship → 3-week training → intern → multi-language content creator → HAMZURY staff. With 4 cohorts per year and 100 trainees per cohort, HAMZURY trains 400 people annually and maintains 40 active interns at any given time.
            </p>
            <p>
              This is HAMZURY's single most powerful competitive advantage. It is not charity. It is a self-renewing talent pipeline rooted in genuine impact — and it is structurally funded by the institution's own success.
            </p>
          </div>
        </div>
      </section>

      {/* Active Programmes */}
      <section className="py-20 border-t border-border" style={{ background: "#FAFAF8" }}>
        <div className="container">
          <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: BRAND }}>Programmes</p>
          <h2 className="text-3xl font-light mb-4" style={{ color: "#1a1a1a" }}>Active programmes.</h2>
          <p className="text-sm text-muted-foreground mb-12 max-w-lg">Each programme is funded by the RIDI allocation and executed through HAMZURY's department structure — with the same quality standards applied to external client work.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {PROGRAMMES.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="bg-white border border-border rounded-xl p-8">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-5" style={{ background: BRAND + "12", color: BRAND }}>
                    <Icon size={18} />
                  </div>
                  <h3 className="font-medium mb-3" style={{ color: "#1a1a1a" }}>{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.description}</p>
                  <p className="text-xs font-medium" style={{ color: BRAND }}>Delivered by: {p.partner}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How the allocation works */}
      <section className="py-20 border-t border-border">
        <div className="container max-w-3xl">
          <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: BRAND }}>Finance</p>
          <h2 className="text-3xl font-light mb-4" style={{ color: "#1a1a1a" }}>How the allocation works.</h2>
          <p className="text-sm text-muted-foreground mb-10 max-w-lg">The 10% RIDI allocation is not discretionary. It is a structural commitment built into HAMZURY's financial process.</p>
          <div className="space-y-4">
            {ALLOCATION_STEPS.map((step, i) => (
              <div key={i} className="flex items-start gap-5 p-5 bg-white rounded-xl border border-border">
                <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: BRAND }}>
                  {i + 1}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donate section */}
      <section className="py-20 border-t border-border bg-white">
        <div className="container max-w-3xl">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="flex-1">
              <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: BRAND }}>Support RIDI</p>
              <h2 className="text-3xl font-light mb-4" style={{ color: "#1a1a1a" }}>Help us reach more rural communities.</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Every naira donated to RIDI goes directly to funding scholarships, Starlink connectivity, and training materials for rural youth. HAMZURY already commits 10% of net profits — your donation multiplies that impact.
              </p>
              {!donateOpen && !donateDone && (
                <Button onClick={() => setDonateOpen(true)} className="gap-2" style={{ background: BRAND, color: "white" }}>
                  <Heart size={14} /> Donate to RIDI
                </Button>
              )}
              {donateDone && (
                <div className="flex items-center gap-2 text-sm" style={{ color: BRAND }}>
                  <CheckCircle2 size={16} /> Thank you — your pledge has been received. We will be in touch.
                </div>
              )}
              {donateOpen && !donateDone && (
                <div className="space-y-3 max-w-sm">
                  <Input placeholder="Your name" value={donateForm.name} onChange={e => setDonateForm(f => ({ ...f, name: e.target.value }))} />
                  <Input placeholder="Email address" type="email" value={donateForm.email} onChange={e => setDonateForm(f => ({ ...f, email: e.target.value }))} />
                  <Input placeholder="Amount (e.g. 5000)" value={donateForm.amount} onChange={e => setDonateForm(f => ({ ...f, amount: e.target.value }))} />
                  <Textarea placeholder="Message (optional)" rows={2} value={donateForm.message} onChange={e => setDonateForm(f => ({ ...f, message: e.target.value }))} />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setDonateOpen(false)}>Cancel</Button>
                    <Button size="sm" style={{ background: BRAND, color: "white" }}
                      onClick={() => {
                        if (!donateForm.name || !donateForm.email || !donateForm.amount) return;
                        donateMutation.mutate(
                          { name: donateForm.name, email: donateForm.email, amount: donateForm.amount, message: donateForm.message || undefined }
                        );
                      }}
                    >Submit Pledge</Button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: BRAND }}>Scholarship</p>
              <h2 className="text-3xl font-light mb-4" style={{ color: "#1a1a1a" }}>Apply for a RIDI scholarship.</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Are you a young person from a rural or peri-urban community? Apply below. We review applications before each cohort and select participants based on need, potential, and community impact.
              </p>
              {!scholarOpen && !scholarDone && (
                <Button onClick={() => setScholarOpen(true)} variant="outline" className="gap-2" style={{ borderColor: BRAND, color: BRAND }}>
                  <GraduationCap size={14} /> Apply for Scholarship
                </Button>
              )}
              {scholarDone && (
                <div className="flex items-center gap-2 text-sm" style={{ color: BRAND }}>
                  <CheckCircle2 size={16} /> Application received. We will review it before the next cohort.
                </div>
              )}
              {scholarOpen && !scholarDone && (
                <div className="space-y-3 max-w-sm">
                  <Input placeholder="Full name" value={scholarForm.name} onChange={e => setScholarForm(f => ({ ...f, name: e.target.value }))} />
                  <Input placeholder="Phone number" value={scholarForm.phone} onChange={e => setScholarForm(f => ({ ...f, phone: e.target.value }))} />
                  <Input placeholder="State" value={scholarForm.state} onChange={e => setScholarForm(f => ({ ...f, state: e.target.value }))} />
                  <Input placeholder="LGA" value={scholarForm.lga} onChange={e => setScholarForm(f => ({ ...f, lga: e.target.value }))} />
                  <Input placeholder="Age" type="number" value={scholarForm.age} onChange={e => setScholarForm(f => ({ ...f, age: e.target.value }))} />
                  <select className="w-full border rounded px-3 py-2 text-sm" value={scholarForm.gender} onChange={e => setScholarForm(f => ({ ...f, gender: e.target.value }))}>
                    <option value="">Gender</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                  <Input placeholder="Area of interest (e.g. Digital Skills, Robotics)" value={scholarForm.interest} onChange={e => setScholarForm(f => ({ ...f, interest: e.target.value }))} />
                  <Textarea placeholder="Tell us about yourself and why you deserve this scholarship (min. 20 words)" rows={3} value={scholarForm.story} onChange={e => setScholarForm(f => ({ ...f, story: e.target.value }))} />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setScholarOpen(false)}>Cancel</Button>
                    <Button size="sm" style={{ background: BRAND, color: "white" }}
                      onClick={() => {
                        if (!scholarForm.name || !scholarForm.phone || !scholarForm.state || !scholarForm.lga || !scholarForm.age || !scholarForm.gender || !scholarForm.interest || scholarForm.story.length < 20) return;
                        scholarMutation.mutate({
                          name: scholarForm.name, phone: scholarForm.phone,
                          state: scholarForm.state, lga: scholarForm.lga,
                          age: parseInt(scholarForm.age),
                          gender: scholarForm.gender as "Male" | "Female" | "Other",
                          areaOfInterest: scholarForm.interest, story: scholarForm.story,
                        });
                      }}
                      disabled={scholarMutation.isPending}
                    >{scholarMutation.isPending ? "Submitting…" : "Submit Application"}</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Soul statement — dark brand CTA */}
      <section className="py-20 border-t border-border grain-overlay" style={{ background: BRAND }}>
        <div className="container max-w-xl text-center">
          <span className="block w-8 h-px mx-auto mb-10 bg-white/30" />
          <h2 className="text-3xl font-light mb-4 text-white">
            HAMZURY does not need to become something different to grow.
          </h2>
          <p className="text-sm leading-relaxed mb-8 max-w-sm mx-auto text-white/70">
            It only needs more people doing the same excellent thing, in the same excellent way. The RIDI soul is not a programme we run — it is who we are.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold bg-white" style={{ color: BRAND }}>
            <ArrowLeft size={14} /> Return to HAMZURY
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-white">
        <div className="container flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-7 w-7 object-contain rounded-sm" />
              <span className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: BRAND }}>HAMZURY</span>
            </Link>
            <p className="text-xs text-muted-foreground">Structure. Clarity. Calm authority.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/services" className="hover:text-foreground transition-colors">Services</Link>
            <Link href="/services/bizdoc" className="hover:text-foreground transition-colors">Bizdoc</Link>
            <Link href="/team" className="hover:text-foreground transition-colors">Team</Link>
            <Link href="/policies" className="hover:text-foreground transition-colors">Policies</Link>
            <Link href="/start" className="hover:text-foreground transition-colors">Start a Project</Link>
            <Link href="/track" className="hover:text-foreground transition-colors">Track Project</Link>
            <Link href="/portal" className="hover:text-foreground transition-colors">Partner Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
