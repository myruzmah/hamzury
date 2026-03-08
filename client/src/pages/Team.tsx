import { Link } from "wouter";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const BRAND = "#1B4D3E";

const leadership = [
  {
    initials: "HM",
    name: "Haruna Muhammad",
    title: "Founder",
    department: "Office of the Founder",
    note: "Responsible for institutional vision, governing charter, and long-term direction.",
  },
];

const departmentLeads = [
  {
    initials: "FA",
    name: "Fatima Aliyu",
    title: "Chief Executive Officer",
    department: "Executive Office",
    note: "Responsible for operational leadership, cross-department coordination, and client outcomes.",
  },
  {
    initials: "AK",
    name: "Amina Kabir",
    title: "Chief Strategy Officer",
    department: "Strategy & Client Relations",
    note: "Responsible for client intake, business development, and strategic partnerships.",
  },
  {
    initials: "YB",
    name: "Yusuf Bello",
    title: "Head of Innovation Hub",
    department: "Innovation Hub",
    note: "Responsible for all training programmes, cohort management, and capability development.",
  },
  {
    initials: "ZM",
    name: "Zainab Musa",
    title: "Head of Studios",
    department: "Studios",
    note: "Responsible for brand identity, content strategy, social media, and creative production.",
  },
  {
    initials: "IA",
    name: "Ibrahim Abubakar",
    title: "Head of Systems",
    department: "Systems",
    note: "Responsible for all technology builds, web applications, and automation projects.",
  },
  {
    initials: "HI",
    name: "Hauwa Isa",
    title: "Head of Finance",
    department: "Finance & Compliance",
    note: "Responsible for financial management, reporting, and regulatory compliance.",
  },
  {
    initials: "SM",
    name: "Sadiya Muhammad",
    title: "Head of People",
    department: "People & Culture",
    note: "Responsible for staff development, onboarding, and institutional culture.",
  },
  {
    initials: "AU",
    name: "Abdullahi Umar",
    title: "Head of Growth",
    department: "Growth & Partnerships",
    note: "Responsible for market expansion, partnership development, and revenue growth.",
  },
];

function InitialsAvatar({ initials }: { initials: string }) {
  return (
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center text-white font-medium text-base shrink-0"
      style={{ background: BRAND }}
    >
      {initials}
    </div>
  );
}

export default function Team() {
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
            <Link href="/services" className="nav-link">Services</Link>
            <Link href="/ridi" className="nav-link">RIDI</Link>
            <a href="https://bizdoc.hamzury.com" target="_blank" rel="noopener noreferrer" className="nav-link">Bizdoc</a>
            <Link href="/portal" className="nav-link">Portal</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 border-b border-border">
        <div className="container">
          <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: BRAND }}>Our People</p>
          <h1 className="text-4xl font-light mb-4" style={{ color: "#1a1a1a" }}>The team.</h1>
          <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
            HAMZURY is led by a team of department leads who are responsible for specific outcomes. Every client engagement is managed by a named lead — not a generic team.
          </p>
        </div>
      </section>

      {/* Founder */}
      <section className="py-16 border-b border-border">
        <div className="container">
          <p className="text-xs tracking-[0.2em] uppercase mb-8" style={{ color: BRAND }}>Founder</p>
          {leadership.map((p) => (
            <div key={p.initials} className="flex items-start gap-6 max-w-2xl">
              <InitialsAvatar initials={p.initials} />
              <div>
                <h2 className="text-xl font-medium mb-1" style={{ color: "#1a1a1a" }}>{p.name}</h2>
                <p className="text-sm font-medium mb-1" style={{ color: BRAND }}>{p.title}</p>
                <p className="text-xs text-muted-foreground mb-3">{p.department}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Department Leads */}
      <section className="py-16">
        <div className="container">
          <p className="text-xs tracking-[0.2em] uppercase mb-8" style={{ color: BRAND }}>Department Leads</p>
          <div className="grid md:grid-cols-2 gap-8">
            {departmentLeads.map((p) => (
              <div key={p.initials} className="flex items-start gap-5 p-6 border border-border rounded-lg">
                <InitialsAvatar initials={p.initials} />
                <div>
                  <h3 className="font-medium mb-0.5" style={{ color: "#1a1a1a" }}>{p.name}</h3>
                  <p className="text-sm font-medium mb-0.5" style={{ color: BRAND }}>{p.title}</p>
                  <p className="text-xs text-muted-foreground mb-3">{p.department}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional note */}
      <section className="py-16 border-t border-border" style={{ background: "#FAFAF8" }}>
        <div className="container max-w-2xl">
          <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: BRAND }}>How we work</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            HAMZURY operates as a structured institution. Every department has a named lead who is accountable for the quality and delivery of work within their area. When you engage HAMZURY, you know exactly who is responsible for your project.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We do not use anonymous teams or rotating account managers. Accountability is built into how we are structured.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-7 w-7 object-contain rounded-sm" />
              <span className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: BRAND }}>HAMZURY</span>
            </Link>
            <p className="text-xs text-muted-foreground">Structure. Clarity. Calm authority.</p>
          </div>
          <div className="flex items-center gap-8 text-xs text-muted-foreground">
            <Link href="/services" className="hover:text-foreground transition-colors">Services</Link>
            <Link href="/ridi" className="hover:text-foreground transition-colors">RIDI</Link>
            <Link href="/policies" className="hover:text-foreground transition-colors">Policies</Link>
            <Link href="/track" className="hover:text-foreground transition-colors">Track Project</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
