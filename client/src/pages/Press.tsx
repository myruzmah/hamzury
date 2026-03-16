import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ExternalLink, Menu, X } from "lucide-react";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const BRAND_ASSETS = [
  { name: "HAMZURY Logo (PNG, white background)", size: "512×512px", note: "Use on light backgrounds" },
  { name: "HAMZURY Logo (PNG, transparent)", size: "512×512px", note: "Use on coloured or dark backgrounds" },
  { name: "HAMZURY Wordmark (horizontal)", size: "1200×300px", note: "For headers and banners" },
  { name: "Brand colour palette", size: "PDF", note: "Primary green #1A5C38, secondary tones" },
];

const BOILERPLATE = `HAMZURY is a multi-unit institution based in Jos, Nigeria. It provides business registration and compliance services (Bizdoc), brand and content production (Studios), digital systems and AI development (Systems), and innovation training programmes (Innovation Hub). HAMZURY's social impact arm, RIDI, directs 10% of all revenue to community education, rural scholarships, and digital access programmes. Founded by Haruna Muhammad, HAMZURY operates on the principle that institutions build nations.`;

export default function Press() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyBoilerplate = () => {
    navigator.clipboard.writeText(BOILERPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/96 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-10 w-10 object-contain rounded-sm" />
            <span className="font-semibold text-xs tracking-[0.18em] uppercase hidden sm:block" style={{ color: "var(--brand)" }}>HAMZURY</span>
          </Link>
          <Link href="/" className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={14} /> Back
          </Link>
          <button className="md:hidden p-2 text-muted-foreground" onClick={() => setMobileOpen((o) => !o)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <main className="pt-16 pb-20">
        {/* Hero */}
        <section className="py-20 border-b border-border">
          <div className="container max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6" style={{ background: "var(--brand-muted)", color: "var(--brand)" }}>
              Press & Media
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground leading-tight mb-6">
              Press resources
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
              For media enquiries, interview requests, or editorial coverage, contact our communications team. We respond within 24 hours on working days.
            </p>
            <div className="mt-8">
              <a
                href="mailto:press@hamzury.com"
                className="btn-primary inline-flex items-center gap-2"
              >
                Contact press team <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* About HAMZURY */}
        <section className="py-16 border-b border-border">
          <div className="container max-w-3xl">
            <h2 className="text-lg font-semibold text-foreground mb-4">About HAMZURY</h2>
            <div className="bg-gray-50 rounded-xl p-5 border border-border mb-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{BOILERPLATE}</p>
            </div>
            <button
              onClick={copyBoilerplate}
              className="text-sm font-medium transition-colors"
              style={{ color: "var(--brand)" }}
            >
              {copied ? "Copied." : "Copy boilerplate text"}
            </button>
          </div>
        </section>

        {/* Key facts */}
        <section className="py-16 border-b border-border" style={{ background: "var(--brand-muted)" }}>
          <div className="container max-w-3xl">
            <h2 className="text-lg font-semibold text-foreground mb-8">Key facts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: "Founded", value: "2024" },
                { label: "Headquarters", value: "Jos, Plateau State, Nigeria" },
                { label: "Founder", value: "Haruna Muhammad" },
                { label: "Service units", value: "4 (Bizdoc, Studios, Systems, Innovation Hub)" },
                { label: "Social impact arm", value: "RIDI — 10% of revenue to community impact" },
                { label: "Operating model", value: "AI-assisted, system-first institution" },
              ].map((f) => (
                <div key={f.label} className="bg-white rounded-xl px-5 py-4 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-foreground">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand assets */}
        <section className="py-16 border-b border-border">
          <div className="container max-w-3xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Brand assets</h2>
            <p className="text-sm text-muted-foreground mb-8">
              To request brand assets, email <a href="mailto:press@hamzury.com" className="underline underline-offset-2" style={{ color: "var(--brand)" }}>press@hamzury.com</a> with your publication name and intended use. We will send a download link within 24 hours.
            </p>
            <div className="space-y-3">
              {BRAND_ASSETS.map((a) => (
                <div key={a.name} className="flex items-center justify-between gap-4 border border-border rounded-xl px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.note}</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{a.size}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Usage guidelines */}
        <section className="py-16">
          <div className="container max-w-3xl">
            <h2 className="text-lg font-semibold text-foreground mb-6">Usage guidelines</h2>
            <div className="space-y-4">
              {[
                "Always spell the name as HAMZURY — all capitals, no spaces.",
                "Do not alter, distort, or recolour the HAMZURY logo.",
                "Do not use HAMZURY branding to imply endorsement without written approval.",
                "For editorial use, the boilerplate text above is the approved description.",
                "For interview requests, allow a minimum of 5 working days for scheduling.",
              ].map((rule, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-xs font-mono font-medium flex-shrink-0 mt-0.5" style={{ color: "var(--brand)" }}>0{i + 1}</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
