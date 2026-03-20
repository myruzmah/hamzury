/**
 * HAMZURY Invoice Payment Page
 * Nigerian clients: manual bank transfer + receipt upload
 * International clients: external payment link
 * Route: /pay/:invoiceRef
 */
import { useState, useRef } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  CheckCircle, Loader2, AlertCircle, Copy, Upload,
  ExternalLink, ArrowLeft, FileText, Globe, Building2
} from "lucide-react";
import { toast } from "sonner";

const BRAND = "#1B4D3E";

// HAMZURY Bank details for manual transfer
const BANK_DETAILS = {
  bankName: "Zenith Bank",
  accountNumber: "1234567890",
  accountName: "HAMZURY INSTITUTIONAL SERVICES LTD",
  sortCode: "057",
};

function copyText(text: string, label: string) {
  navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied`));
}

type PaymentType = "nigerian" | "international" | null;

export default function PayInvoice() {
  const { invoiceRef } = useParams<{ invoiceRef: string }>();
  const [paymentType, setPaymentType] = useState<PaymentType>(null);

  // Nigerian: receipt upload
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: invoice, isLoading, error } = trpc.finance.getInvoiceByRef.useQuery(
    { invoiceRef: invoiceRef || "" },
    { enabled: !!invoiceRef }
  );

  const uploadMutation = trpc.finance.uploadReceipt.useMutation({
    onSuccess: () => {
      setUploadDone(true);
      toast.success("Receipt submitted. HAMZURY will confirm your payment within 2 hours.");
    },
    onError: (e) => {
      toast.error(e.message || "Upload failed. Please try again.");
      setUploading(false);
    },
  });

  async function handleReceiptUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!receiptFile) { toast.error("Please select a receipt file."); return; }
    if (!senderName.trim()) { toast.error("Please enter your full name."); return; }
    if (!senderEmail.trim() || !senderEmail.includes("@")) { toast.error("Please enter a valid email."); return; }
    if (!senderPhone.trim()) { toast.error("Please enter your phone number."); return; }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      await uploadMutation.mutateAsync({
        invoiceRef: invoiceRef || "",
        fileName: receiptFile.name,
        fileBase64: base64,
        mimeType: receiptFile.type,
        senderName: senderName.trim(),
        senderEmail: senderEmail.trim(),
        senderPhone: senderPhone.trim(),
      });
    };
    reader.readAsDataURL(receiptFile);
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
  }).format(Number(invoice.amountNaira || 0));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Header */}
      <header className="bg-white border-b border-border px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-semibold text-sm tracking-widest uppercase" style={{ color: BRAND }}>HAMZURY</span>
        </Link>
        <span className="text-xs text-muted-foreground">Secure Payment</span>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Invoice summary banner */}
          <div className="rounded-xl overflow-hidden border border-border shadow-sm mb-4">
            <div className="px-6 py-5 text-white" style={{ background: BRAND }}>
              <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Invoice</p>
              <p className="text-lg font-bold">{invoice.invoiceRef}</p>
              {invoice.clientName && (
                <p className="text-sm opacity-80 mt-0.5">For {invoice.clientName}</p>
              )}
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold">{formattedAmount}</span>
              </div>
              {invoice.description && (
                <p className="text-xs opacity-70 mt-2 leading-relaxed">{invoice.description}</p>
              )}
            </div>
          </div>

          {/* Payment type selector */}
          {!paymentType && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <h3 className="text-sm font-semibold text-foreground mb-1">How would you like to pay?</h3>
              <p className="text-xs text-muted-foreground mb-5">Select the option that applies to you.</p>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentType("nigerian")}
                  className="w-full flex items-start gap-4 p-4 rounded-lg border border-border hover:border-foreground/30 hover:bg-muted/30 transition-all text-left"
                >
                  <Building2 size={20} style={{ color: BRAND }} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Nigerian bank transfer</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Transfer to our Zenith Bank account and upload your receipt. Confirmation within 2 hours.</p>
                  </div>
                </button>
                {invoice.internationalPaymentLink && (
                  <button
                    onClick={() => setPaymentType("international")}
                    className="w-full flex items-start gap-4 p-4 rounded-lg border border-border hover:border-foreground/30 hover:bg-muted/30 transition-all text-left"
                  >
                    <Globe size={20} style={{ color: BRAND }} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">International payment</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Pay securely via our international payment link. Accepts cards and global payment methods.</p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Nigerian: Bank Transfer + Receipt Upload */}
          {paymentType === "nigerian" && (
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                <button onClick={() => setPaymentType(null)} className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft size={15} />
                </button>
                <h3 className="text-sm font-semibold text-foreground">Nigerian bank transfer</h3>
              </div>
              <div className="px-6 py-5">
                {uploadDone ? (
                  <div className="text-center py-6">
                    <CheckCircle size={40} className="mx-auto mb-4" style={{ color: BRAND }} />
                    <p className="font-semibold text-foreground mb-2">Receipt submitted.</p>
                    <p className="text-sm text-muted-foreground">Your payment is being reviewed. HAMZURY will confirm within 2 hours and update your project status.</p>
                    <Link href="/track" className="mt-4 inline-block text-sm underline" style={{ color: BRAND }}>
                      Track your project
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Bank details */}
                    <div className="rounded-lg border border-green-100 bg-green-50 p-4 space-y-3 mb-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Transfer to</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Bank</span>
                        <span className="text-sm font-semibold" style={{ color: BRAND }}>{BANK_DETAILS.bankName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Account number</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold tracking-widest" style={{ color: BRAND }}>{BANK_DETAILS.accountNumber}</span>
                          <button onClick={() => copyText(BANK_DETAILS.accountNumber, "Account number")} className="text-muted-foreground hover:text-foreground">
                            <Copy size={13} />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Account name</span>
                        <span className="text-xs font-medium text-foreground">{BANK_DETAILS.accountName}</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-green-100 pt-3">
                        <span className="text-xs text-muted-foreground">Exact amount</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold" style={{ color: BRAND }}>{formattedAmount}</span>
                          <button onClick={() => copyText(String(invoice.amountNaira), "Amount")} className="text-muted-foreground hover:text-foreground">
                            <Copy size={13} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-5">
                      <p className="text-amber-800 text-xs font-semibold mb-1">Before you transfer</p>
                      <ul className="text-amber-700 text-xs space-y-1 list-disc list-inside">
                        <li>Transfer the <strong>exact amount</strong> shown above.</li>
                        <li>Use your name as the transfer narration.</li>
                        <li>Take a screenshot of your transfer confirmation.</li>
                      </ul>
                    </div>

                    {/* Receipt upload form */}
                    <form onSubmit={handleReceiptUpload} className="space-y-4">
                      <p className="text-xs font-semibold text-foreground">After transferring, upload your receipt:</p>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">Full name</label>
                        <input required value={senderName} onChange={(e) => setSenderName(e.target.value)}
                          className="w-full text-sm border border-border rounded-lg px-3 py-2.5 outline-none focus:border-foreground/30 transition-colors" placeholder="As used in the transfer" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">Email address</label>
                        <input required type="email" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)}
                          className="w-full text-sm border border-border rounded-lg px-3 py-2.5 outline-none focus:border-foreground/30 transition-colors" placeholder="you@example.com" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">Phone number</label>
                        <input required value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)}
                          className="w-full text-sm border border-border rounded-lg px-3 py-2.5 outline-none focus:border-foreground/30 transition-colors" placeholder="+234 800 000 0000" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">Transfer receipt</label>
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full border-2 border-dashed border-border rounded-lg px-4 py-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-foreground/30 hover:bg-muted/20 transition-all"
                        >
                          {receiptFile ? (
                            <>
                              <FileText size={20} style={{ color: BRAND }} />
                              <p className="text-xs font-medium text-foreground">{receiptFile.name}</p>
                              <p className="text-xs text-muted-foreground">{(receiptFile.size / 1024).toFixed(0)} KB · Click to change</p>
                            </>
                          ) : (
                            <>
                              <Upload size={20} className="text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">Click to upload screenshot or PDF</p>
                              <p className="text-xs text-muted-foreground">JPG, PNG, or PDF · Max 5 MB</p>
                            </>
                          )}
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f && f.size > 5 * 1024 * 1024) { toast.error("File must be under 5 MB."); return; }
                            if (f) setReceiptFile(f);
                          }}
                        />
                      </div>
                      <button type="submit" disabled={uploading || !receiptFile}
                        className="w-full py-3 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                        style={{ background: BRAND }}>
                        {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                        {uploading ? "Uploading receipt…" : "Submit receipt"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          )}

          {/* International: Payment Link */}
          {paymentType === "international" && invoice.internationalPaymentLink && (
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                <button onClick={() => setPaymentType(null)} className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft size={15} />
                </button>
                <h3 className="text-sm font-semibold text-foreground">International payment</h3>
              </div>
              <div className="px-6 py-6 text-center">
                <Globe size={40} className="mx-auto mb-4" style={{ color: BRAND }} />
                <p className="text-sm font-semibold text-foreground mb-2">You will be redirected to a secure payment page.</p>
                <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                  Complete your payment of <strong>{formattedAmount}</strong> using your preferred international payment method. The page opens in a new tab.
                </p>
                <a
                  href={invoice.internationalPaymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white"
                  style={{ background: BRAND }}
                >
                  <ExternalLink size={15} /> Pay now
                </a>
                <p className="text-xs text-muted-foreground mt-4">
                  After payment, your project status will update automatically within 24 hours.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center py-4 text-xs text-muted-foreground">
        HAMZURY &copy; {new Date().getFullYear()} ·{" "}
        <Link href="/privacy" className="underline">Privacy Policy</Link>
      </div>
    </div>
  );
}
