/**
 * HAMZURY Branded PDF Generation
 * Generates branded invoices and delivery dossiers using jsPDF
 */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── Brand Tokens ─────────────────────────────────────────────────────────────
const GREEN = [10, 31, 28] as [number, number, number];
const GOLD = [201, 169, 126] as [number, number, number];
const CHARCOAL = [44, 44, 44] as [number, number, number];
const MUTED = [120, 120, 120] as [number, number, number];
const LIGHT = [248, 245, 240] as [number, number, number];
const WHITE = [255, 255, 255] as [number, number, number];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCurrency(amount: number, currency: "NGN" | "USD" = "NGN") {
  if (currency === "NGN") return `₦${amount.toLocaleString("en-NG")}`;
  return `$${amount.toLocaleString("en-US")}`;
}

function formatDate(d: string | Date | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-NG", { day: "2-digit", month: "long", year: "numeric" });
}

function drawHeader(doc: jsPDF, title: string) {
  const w = doc.internal.pageSize.getWidth();

  // Dark green header bar
  doc.setFillColor(...GREEN);
  doc.rect(0, 0, w, 42, "F");

  // Gold accent line
  doc.setFillColor(...GOLD);
  doc.rect(0, 42, w, 2, "F");

  // HAMZURY wordmark
  doc.setTextColor(...WHITE);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("HAMZURY", 14, 20);

  // Tagline
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(201, 169, 126);
  doc.text("Build an institution that lasts.", 14, 29);

  // Document title (right-aligned)
  doc.setTextColor(...WHITE);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(title, w - 14, 20, { align: "right" });

  // Contact info
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 200, 195);
  doc.text("info@hamzury.com  ·  www.hamzury.com  ·  +234 913 070 0056", w - 14, 30, { align: "right" });
}

function drawFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Footer bar
  doc.setFillColor(...LIGHT);
  doc.rect(0, h - 16, w, 16, "F");

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text("HAMZURY · Registered in Nigeria · This document is confidential.", 14, h - 6);
  doc.text(`Page ${pageNum} of ${totalPages}`, w - 14, h - 6, { align: "right" });
}

// ─── Invoice PDF ──────────────────────────────────────────────────────────────
export interface InvoiceData {
  invoiceRef: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  description: string;
  amountNaira: number;
  currency?: "NGN" | "USD";
  status: string;
  issuedAt?: string | Date | null;
  dueDate?: string | Date | null;
  paidAt?: string | Date | null;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  paymentMethod?: string;
  notes?: string;
}

export function generateInvoicePDF(invoice: InvoiceData): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const isPaid = invoice.status === "paid";

  drawHeader(doc, "INVOICE");

  let y = 54;

  // Invoice meta block
  doc.setFillColor(...WHITE);
  doc.setDrawColor(...LIGHT);
  doc.roundedRect(14, y, w - 28, 32, 3, 3, "FD");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...CHARCOAL);
  doc.text("Invoice Number", 20, y + 8);
  doc.text("Issue Date", 80, y + 8);
  doc.text("Due Date", 130, y + 8);
  doc.text("Status", 175, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(invoice.invoiceRef, 20, y + 17);
  doc.text(formatDate(invoice.issuedAt), 80, y + 17);
  doc.text(formatDate(invoice.dueDate), 130, y + 17);

  // Status badge
  const statusColor = isPaid ? [5, 150, 105] as [number, number, number] : [217, 119, 6] as [number, number, number];
  doc.setFillColor(...statusColor);
  doc.roundedRect(173, y + 11, 20, 7, 2, 2, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(invoice.status.toUpperCase(), 183, y + 16.5, { align: "center" });

  y += 42;

  // Bill To / Bill From
  doc.setTextColor(...CHARCOAL);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...MUTED);
  doc.text("BILL TO", 14, y);
  doc.text("FROM", w / 2 + 10, y);

  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...CHARCOAL);
  doc.text(invoice.clientName, 14, y);
  doc.text("HAMZURY", w / 2 + 10, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  if (invoice.clientEmail) doc.text(invoice.clientEmail, 14, y + 6);
  if (invoice.clientPhone) doc.text(invoice.clientPhone, 14, y + 12);
  doc.text("info@hamzury.com", w / 2 + 10, y + 6);
  doc.text("+234 913 070 0056", w / 2 + 10, y + 12);

  y += 26;

  // Divider
  doc.setDrawColor(...LIGHT);
  doc.line(14, y, w - 14, y);
  y += 8;

  // Services table
  autoTable(doc, {
    startY: y,
    head: [["Description", "Amount"]],
    body: [[invoice.description, formatCurrency(invoice.amountNaira, invoice.currency ?? "NGN")]],
    foot: [["Total Due", formatCurrency(invoice.amountNaira, invoice.currency ?? "NGN")]],
    theme: "plain",
    headStyles: {
      fillColor: GREEN,
      textColor: WHITE,
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: { top: 5, bottom: 5, left: 6, right: 6 },
    },
    bodyStyles: {
      textColor: CHARCOAL,
      fontSize: 9,
      cellPadding: { top: 6, bottom: 6, left: 6, right: 6 },
    },
    footStyles: {
      fillColor: LIGHT,
      textColor: CHARCOAL,
      fontStyle: "bold",
      fontSize: 10,
      cellPadding: { top: 6, bottom: 6, left: 6, right: 6 },
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 45, halign: "right" },
    },
    margin: { left: 14, right: 14 },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // Payment details
  if (!isPaid) {
    doc.setFillColor(...LIGHT);
    doc.roundedRect(14, y, w - 28, 36, 3, 3, "F");

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...GREEN);
    doc.text("Payment Instructions", 20, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...CHARCOAL);
    doc.setFontSize(8.5);
    doc.text(`Bank: ${invoice.bankName ?? "Zenith Bank"}`, 20, y + 16);
    doc.text(`Account Name: ${invoice.accountName ?? "HAMZURY ENTERPRISES"}`, 20, y + 23);
    doc.text(`Account Number: ${invoice.accountNumber ?? "2234567890"}`, 20, y + 30);

    doc.setTextColor(...MUTED);
    doc.text("After payment, upload your receipt at hamzury.com/pay/" + invoice.invoiceRef, w - 14, y + 30, { align: "right" });

    y += 44;
  } else {
    // PAID stamp
    doc.setTextColor(5, 150, 105);
    doc.setFontSize(36);
    doc.setFont("helvetica", "bold");
    doc.setGState(new (doc as any).GState({ opacity: 0.12 }));
    doc.text("PAID", w / 2, y + 20, { align: "center" });
    doc.setGState(new (doc as any).GState({ opacity: 1 }));

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text(`Payment received on ${formatDate(invoice.paidAt)}`, w / 2, y + 30, { align: "center" });
    y += 44;
  }

  // Notes
  if (invoice.notes) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...MUTED);
    doc.text(`Note: ${invoice.notes}`, 14, y);
    y += 10;
  }

  // Footer
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, i, totalPages);
  }

  doc.save(`HAMZURY-Invoice-${invoice.invoiceRef}.pdf`);
}

// ─── Delivery Dossier PDF ─────────────────────────────────────────────────────
export interface DossierData {
  clientName: string;
  clientEmail?: string;
  projectRef: string;
  service: string;
  department: string;
  deliverables: { title: string; description: string; url?: string }[];
  completedDate?: string | Date | null;
  leadName?: string;
  founderNote?: string;
}

export function generateDossierPDF(dossier: DossierData): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();

  drawHeader(doc, "DELIVERY DOSSIER");

  let y = 54;

  // Project summary block
  doc.setFillColor(...LIGHT);
  doc.roundedRect(14, y, w - 28, 28, 3, 3, "F");

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...MUTED);
  doc.text("CLIENT", 20, y + 7);
  doc.text("PROJECT REF", 80, y + 7);
  doc.text("SERVICE", 130, y + 7);
  doc.text("COMPLETED", 175, y + 7);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...CHARCOAL);
  doc.text(dossier.clientName, 20, y + 16);
  doc.text(dossier.projectRef, 80, y + 16);
  doc.text(dossier.service, 130, y + 16);
  doc.text(formatDate(dossier.completedDate), 175, y + 16);

  y += 36;

  // Intro message
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...CHARCOAL);
  doc.text(`Dear ${dossier.clientName},`, 14, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  const intro = `We are pleased to present the completed deliverables for your ${dossier.service} project. This dossier contains everything produced by the HAMZURY ${dossier.department} team on your behalf. Please review each item carefully.`;
  const introLines = doc.splitTextToSize(intro, w - 28);
  doc.text(introLines, 14, y);
  y += introLines.length * 5 + 8;

  // Divider
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.line(14, y, w - 14, y);
  y += 8;

  // Deliverables
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...GREEN);
  doc.text("Deliverables", 14, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    head: [["#", "Deliverable", "Description", "Access"]],
    body: dossier.deliverables.map((d, i) => [
      (i + 1).toString(),
      d.title,
      d.description,
      d.url ? d.url : "Provided separately",
    ]),
    theme: "plain",
    headStyles: {
      fillColor: GREEN,
      textColor: WHITE,
      fontStyle: "bold",
      fontSize: 8.5,
      cellPadding: { top: 5, bottom: 5, left: 6, right: 6 },
    },
    bodyStyles: {
      textColor: CHARCOAL,
      fontSize: 8.5,
      cellPadding: { top: 5, bottom: 5, left: 6, right: 6 },
    },
    alternateRowStyles: { fillColor: LIGHT },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 45, fontStyle: "bold" },
      2: { cellWidth: "auto" },
      3: { cellWidth: 50 },
    },
    margin: { left: 14, right: 14 },
  });

  y = (doc as any).lastAutoTable.finalY + 12;

  // Founder note
  if (dossier.founderNote) {
    doc.setFillColor(...GREEN);
    doc.roundedRect(14, y, w - 28, 2, 1, 1, "F");
    y += 8;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...GREEN);
    doc.text("A Note from the Founder", 14, y);
    y += 6;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...CHARCOAL);
    const noteLines = doc.splitTextToSize(`"${dossier.founderNote}"`, w - 28);
    doc.text(noteLines, 14, y);
    y += noteLines.length * 5 + 6;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);
    doc.text("— Haruna Muhammad, Founder, HAMZURY", 14, y);
    y += 10;
  }

  // Lead sign-off
  if (dossier.leadName) {
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text(`Delivered by: ${dossier.leadName} · ${dossier.department} Lead, HAMZURY`, 14, y);
    doc.text(formatDate(dossier.completedDate), w - 14, y, { align: "right" });
    y += 10;
  }

  // Closing
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text("Thank you for trusting HAMZURY. We look forward to continuing to build with you.", 14, y);

  // Footer
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, i, totalPages);
  }

  doc.save(`HAMZURY-Dossier-${dossier.projectRef}.pdf`);
}
