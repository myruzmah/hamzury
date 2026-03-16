/**
 * HAMZURY Invoice Payment Page — Bank Transfer (DVA)
 * Generates a dedicated virtual account number for the client to transfer to.
 * Route: /pay/:invoiceRef
 */
import { useState } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { CheckCircle, Loader2, AlertCircle, Copy, Building2, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const BRAND = "#1B4D3E";

function copyText(text: string, label: string) {
  navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied`));
}

export default function PayInvoice() {
  const { invoiceRef } = useParams<{ invoiceRef: string }>();
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"form" | "account">("form");
  const [acct, setAcct] = useState<{
    accountNumber: string;
    accountName: string;
    bankName: string;
    amountNaira: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const { data: invoice, isLoading, error } = trpc.finance.getInvoiceByRef.useQuery(
    { invoiceRef: invoiceRef || "" },
    { enabled: !!invoiceRef }
  );

  async function handleGenerate() {
    if (!customerName.trim()) { setFormError("Please enter your full name."); return; }
    if (!email.trim() || !email.includes("@")) { setFormError("Please enter a valid email address."); return; }
    setFormError("");
    setLoading(true);
    try {
      const res = await fetch("/api/paystack/dva/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceRef,
          customerName: customerName.trim(),
          email: email.trim(),
          amountNaira: invoice?.amount || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || "Could not generate account. Please contact HAMZURY.");
        setLoading(false);
        return;
      }
      setAcct({
        accountNumber: data.accountNumber,
        accountName: data.accountName,
        bankName: data.bankName,
        amountNaira: data.amountNaira,
      });
      setStep("account");
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setLoading(false);
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
        <p className="text-sm font-medium">Invoice not found.</p>
        <p className="text-xs text-muted-foreground">
          The reference <strong>{invoiceRef}</strong> does not exist or has been cancelled.
        </p>
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
  }).format(Number(invoice.amount || 0));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Header */}
      <header className="bg-white border-b border-border px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-semibold text-sm tracking-widest uppercase" style={{ color: BRAND }}>HAMZURY</span>
        </Link>
        <span className="text-xs text-muted-foreground">Secure Payment</span>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          {/* Invoice summary banner */}
          <div className="px-6 py-5 text-white" style={{ background: BRAND }}>
            <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Invoice</p>
            <p className="text-lg font-bold">{invoice.invoiceRef}</p>
            {invoice.clientName && (
              <p className="text-sm opacity-80 mt-0.5">For {invoice.clientName}</p>
            )}
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-bold">{formattedAmount}</span>
            </div>
          </div>

          <div className="px-6 py-6">
            {step === "form" && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 size={18} style={{ color: BRAND }} />
                  <h3 className="text-sm font-semibold" style={{ color: BRAND }}>Pay by Bank Transfer</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                  Enter your details below. We will generate a dedicated bank account number for you to transfer the exact amount to. Payment is confirmed automatically.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="e.g. Amina Ibrahim"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-green-800 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-gray-700">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. amina@example.com"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-green-800 bg-gray-50"
                    />
                  </div>

                  {formError && (
                    <p className="text-red-600 text-xs">{formError}</p>
                  )}

                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full py-3.5 text-sm font-semibold rounded-lg text-white disabled:opacity-50 transition-opacity"
                    style={{ background: BRAND }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 size={16} className="animate-spin" /> Generating account...
                      </span>
                    ) : (
                      "Get Bank Account Number"
                    )}
                  </button>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-5">
                  Powered by Paystack · Secured by HMAC-SHA512
                </p>
              </>
            )}

            {step === "account" && acct && (
              <>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Transfer the <strong>exact amount</strong> to the account below. Your payment will be confirmed automatically within minutes.
                </p>

                {/* Account details */}
                <div className="rounded-xl border border-green-100 bg-green-50 p-5 space-y-4 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase tracking-wider text-gray-500">Bank</span>
                    <span className="text-sm font-semibold" style={{ color: BRAND }}>{acct.bankName}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase tracking-wider text-gray-500">Account Number</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold tracking-widest" style={{ color: BRAND }}>
                        {acct.accountNumber}
                      </span>
                      <button
                        onClick={() => copyText(acct.accountNumber, "Account number")}
                        className="text-gray-400 hover:text-green-800 transition-colors"
                        title="Copy"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase tracking-wider text-gray-500">Account Name</span>
                    <span className="text-sm font-medium text-gray-800">{acct.accountName}</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-green-100 pt-4">
                    <span className="text-xs uppercase tracking-wider text-gray-500">Exact Amount</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold" style={{ color: BRAND }}>
                        {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(acct.amountNaira)}
                      </span>
                      <button
                        onClick={() => copyText(String(acct.amountNaira), "Amount")}
                        className="text-gray-400 hover:text-green-800 transition-colors"
                        title="Copy"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-5">
                  <p className="text-amber-800 text-xs font-semibold mb-1">Important</p>
                  <ul className="text-amber-700 text-xs space-y-1 list-disc list-inside">
                    <li>Transfer the <strong>exact amount</strong> shown above.</li>
                    <li>Use your name as the transfer narration.</li>
                    <li>Payment is confirmed automatically — no need to notify us.</li>
                  </ul>
                </div>

                {/* WhatsApp fallback */}
                <a
                  href={`https://wa.me/2349130700056?text=Hi%20HAMZURY%2C%20I%20have%20just%20transferred%20for%20invoice%20${invoiceRef}.%20Please%20confirm.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 rounded-lg py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle size={16} className="text-green-600" />
                  Confirm via WhatsApp
                </a>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Powered by Paystack · Secured by HMAC-SHA512
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="text-center py-4 text-xs text-muted-foreground">
        HAMZURY &copy; {new Date().getFullYear()} ·{" "}
        <Link href="/privacy" className="underline">Privacy Policy</Link>
      </div>
    </div>
  );
}
