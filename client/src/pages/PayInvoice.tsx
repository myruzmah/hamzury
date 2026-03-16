/**
 * HAMZURY Invoice Payment Page — /pay/:invoiceRef
 * Clients use this page to pay their invoices via Paystack.
 */
import { useState } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight, CheckCircle, Loader2, AlertCircle, CreditCard } from "lucide-react";
import { toast } from "sonner";

const BRAND = "#1B4D3E";
const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

export default function PayInvoice() {
  const { invoiceRef } = useParams<{ invoiceRef: string }>();
  const [email, setEmail] = useState("");
  const [paying, setPaying] = useState(false);

  const { data: invoice, isLoading, error } = trpc.finance.getInvoiceByRef.useQuery(
    { invoiceRef: invoiceRef || "" },
    { enabled: !!invoiceRef }
  );

  async function handlePay() {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!invoice) return;
    setPaying(true);
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceRef: invoice.invoiceRef,
          email,
          amountNaira: invoice.amountNaira,
        }),
      });
      const data = await res.json();
      if (data.authorizationUrl) {
        toast.success("Redirecting to secure payment...");
        window.location.href = data.authorizationUrl;
      } else {
        toast.error(data.error || "Payment initialization failed. Please try again.");
      }
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setPaying(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin" style={{ color: BRAND }} />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertCircle size={32} className="text-red-500" />
        <p className="text-sm font-medium text-foreground">Invoice not found.</p>
        <p className="text-xs text-muted-foreground">The invoice reference <strong>{invoiceRef}</strong> does not exist or has been cancelled.</p>
        <Link href="/" className="text-xs underline text-muted-foreground mt-2">Return to HAMZURY</Link>
      </div>
    );
  }

  if (invoice.status === "Paid") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <CheckCircle size={40} style={{ color: BRAND }} />
        <p className="text-lg font-semibold" style={{ color: BRAND }}>Invoice already paid.</p>
        <p className="text-xs text-muted-foreground">This invoice has been settled. Thank you.</p>
        <Link href="/track" className="text-xs underline text-muted-foreground mt-2">Track your project</Link>
      </div>
    );
  }

  if (invoice.status === "Cancelled") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertCircle size={32} className="text-red-500" />
        <p className="text-sm font-medium">This invoice has been cancelled.</p>
        <p className="text-xs text-muted-foreground">Please contact your account manager for assistance.</p>
      </div>
    );
  }

  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(invoice.amountNaira);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Header */}
      <header className="bg-white border-b border-border px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-7 w-7 object-contain rounded-sm" />
          <span className="font-semibold text-sm tracking-widest uppercase" style={{ color: BRAND }}>HAMZURY</span>
        </Link>
        <span className="text-xs text-muted-foreground">Secure Payment</span>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          {/* Invoice summary */}
          <div className="px-6 py-5 border-b border-border" style={{ background: BRAND + "08" }}>
            <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Invoice</p>
            <p className="text-lg font-bold" style={{ color: BRAND }}>{invoice.invoiceRef}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{invoice.clientName}</p>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Description */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Description</p>
              <p className="text-sm text-foreground leading-relaxed">{invoice.description}</p>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between py-3 border-t border-b border-border">
              <p className="text-sm font-medium text-foreground">Amount Due</p>
              <p className="text-xl font-bold" style={{ color: BRAND }}>{formattedAmount}</p>
            </div>

            {/* Due date */}
            {invoice.dueDate && (
              <p className="text-xs text-muted-foreground">
                Due: {new Date(invoice.dueDate).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}

            {/* Email input */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
                Your Email Address <span style={{ color: BRAND }}>*</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email to receive receipt"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-border rounded-lg focus:outline-none"
                style={{ borderColor: "#d1d5db" }}
              />
            </div>

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={paying || !email}
              className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-semibold rounded-lg text-white disabled:opacity-50 transition-opacity"
              style={{ background: BRAND }}
            >
              {paying ? (
                <><Loader2 size={16} className="animate-spin" /> Processing...</>
              ) : (
                <><CreditCard size={16} /> Pay {formattedAmount} via Paystack</>
              )}
            </button>

            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              You will be redirected to Paystack's secure payment page. Your card details are never stored by HAMZURY.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs text-muted-foreground">
        HAMZURY &copy; {new Date().getFullYear()} · <Link href="/privacy" className="underline">Privacy Policy</Link>
      </div>
    </div>
  );
}
