import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { MapView } from "@/components/Map";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const sendMutation = trpc.contact.send.useMutation({
    onSuccess: () => {
      toast.success("Message received. Our CSO team will respond within 24 hours.");
      setSent(true);
    },
    onError: (e) => toast.error(e.message || "Failed to send. Please try again."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    sendMutation.mutate({
      name: form.name,
      email: form.email,
      subject: form.subject || "General Enquiry",
      message: form.message,
    });
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-8 w-8 object-contain rounded-sm" />
            <span className="font-semibold text-sm tracking-widest uppercase" style={{ color: "var(--brand)" }}>HAMZURY</span>
          </Link>
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Home</Link>
        </div>
      </header>

      <section className="pt-32 pb-20 md:pt-40 md:pb-28" style={{ background: "var(--milk)" }}>
        <div className="container max-w-2xl">
          <span className="brand-rule" />
          <h1 className="text-4xl font-semibold mb-4" style={{ color: "var(--charcoal)", letterSpacing: "-0.02em" }}>
            Get in touch.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Whether you have a project in mind, a question about our services, or simply want to learn more about HAMZURY — we are here.
          </p>
        </div>
      </section>

      <section className="section-padding" style={{ background: "white" }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl">
            {/* Contact details */}
            <div>
              <h2 className="text-xl font-semibold mb-8" style={{ color: "var(--charcoal)" }}>Contact Details</h2>
              <div className="space-y-6">
                {[
                  { icon: <Mail size={16} />, label: "General Enquiries", value: "info@hamzury.com", href: "mailto:info@hamzury.com" },
                  { icon: <Mail size={16} />, label: "Innovation & Training", value: "innovation@hamzury.com", href: "mailto:innovation@hamzury.com" },
                  { icon: <Mail size={16} />, label: "Client Services", value: "cso@hamzury.com", href: "mailto:cso@hamzury.com" },
                  { icon: <MapPin size={16} />, label: "Headquarters", value: "Jos, Plateau State, Nigeria", href: undefined },
                  { icon: <MapPin size={16} />, label: "Operations", value: "Abuja, FCT, Nigeria", href: undefined },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0" style={{ background: "var(--brand-muted)", color: "var(--brand)" }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-medium hover:underline" style={{ color: "var(--charcoal)" }}>{item.value}</a>
                      ) : (
                        <p className="text-sm" style={{ color: "var(--charcoal)" }}>{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Google Map — Jos HQ */}
              <div className="mt-8 rounded-sm overflow-hidden border border-border" style={{ height: 200 }}>
                <MapView
                  initialCenter={{ lat: 9.9085, lng: 8.8921 }}
                  initialZoom={13}
                  onMapReady={(map) => {
                    new google.maps.marker.AdvancedMarkerElement({
                      map,
                      position: { lat: 9.9085, lng: 8.8921 },
                      title: "HAMZURY — Jos, Plateau State",
                    });
                  }}
                />
              </div>

              <div className="mt-10 pt-8 border-t border-border">
                <p className="text-xs text-muted-foreground mb-4">Prefer to start with a free assessment?</p>
                <a href="/diagnosis" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-sm" style={{ background: "var(--brand)", color: "white" }}>
                  Business Health Diagnosis <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Contact form */}
            <div>
              <h2 className="text-xl font-semibold mb-8" style={{ color: "var(--charcoal)" }}>Send a Message</h2>
              {sent ? (
                <div className="p-8 border border-border rounded-sm text-center">
                  <p className="text-sm font-semibold mb-2" style={{ color: "var(--brand)" }}>Message received.</p>
                  <p className="text-xs text-muted-foreground">Our CSO team will respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { key: "name", label: "Full Name", placeholder: "Your full name", required: true },
                    { key: "email", label: "Email Address", placeholder: "your@email.com", required: true },
                    { key: "subject", label: "Subject", placeholder: "What is this regarding?", required: false },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--charcoal)" }}>
                        {f.label} {f.required && <span style={{ color: "var(--brand)" }}>*</span>}
                      </label>
                      <input
                        type={f.key === "email" ? "email" : "text"}
                        placeholder={f.placeholder}
                        value={form[f.key as keyof typeof form]}
                        onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full px-4 py-3 text-sm border border-border rounded-sm focus:outline-none focus:border-primary/50"
                        style={{ color: "var(--charcoal)" }}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--charcoal)" }}>
                      Message <span style={{ color: "var(--brand)" }}>*</span>
                    </label>
                    <textarea
                      placeholder="Tell us about your project or enquiry..."
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      className="w-full px-4 py-3 text-sm border border-border rounded-sm focus:outline-none focus:border-primary/50 resize-none"
                      style={{ color: "var(--charcoal)" }}
                    />
                  </div>
                  <button type="submit" className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm" style={{ background: "var(--brand)", color: "white" }}>
                    Send Message <ArrowRight size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
