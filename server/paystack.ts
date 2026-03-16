/**
 * HAMZURY Paystack Integration
 * Handles invoice payment initialization and webhook verification.
 * Uses Paystack API v1 — https://paystack.com/docs/api
 */
import { Router, Request, Response } from "express";
import { getDb } from "./db";
import { invoices } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { notifyOwner } from "./_core/notification";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_BASE = "https://api.paystack.co";

async function paystackPost(path: string, body: object) {
  const res = await fetch(`${PAYSTACK_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function paystackGet(path: string) {
  const res = await fetch(`${PAYSTACK_BASE}${path}`, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
  });
  return res.json();
}

export const paystackRouter = Router();

/**
 * POST /api/paystack/initialize
 * Initialises a Paystack transaction for an invoice.
 * Body: { invoiceRef, email, amountNaira }
 */
paystackRouter.post("/initialize", async (req: Request, res: Response) => {
  try {
    const { invoiceRef, email, amountNaira } = req.body;
    if (!invoiceRef || !email || !amountNaira) {
      return res.status(400).json({ error: "invoiceRef, email, and amountNaira are required" });
    }

    // Amount in kobo (Paystack uses smallest currency unit)
    const amountKobo = Math.round(Number(amountNaira) * 100);

    const data = await paystackPost("/transaction/initialize", {
      email,
      amount: amountKobo,
      currency: "NGN",
      reference: `HZR-${invoiceRef}-${Date.now()}`,
      metadata: {
        invoiceRef,
        custom_fields: [
          { display_name: "Invoice Reference", variable_name: "invoice_ref", value: invoiceRef },
        ],
      },
      callback_url: `${req.headers.origin || "https://hamzury.com"}/pay/success?ref=${invoiceRef}`,
    });

    if (!data.status) {
      return res.status(500).json({ error: data.message || "Paystack initialization failed" });
    }

    // Save the Paystack reference and payment URL to the invoice
    const db = await getDb();
    if (db) {
      await db
        .update(invoices)
        .set({
          paystackRef: data.data.reference,
          paystackUrl: data.data.authorization_url,
          status: "Sent",
        })
        .where(eq(invoices.invoiceRef, invoiceRef));
    }

    return res.json({
      success: true,
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (err) {
    console.error("[Paystack] Initialize error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/paystack/webhook
 * Receives Paystack webhook events and marks invoices as paid.
 */
paystackRouter.post("/webhook", async (req: Request, res: Response) => {
  try {
    const crypto = await import("crypto");
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    const event = req.body;

    if (event.event === "charge.success") {
      const { reference, metadata } = event.data;
      const invoiceRef = metadata?.invoiceRef || metadata?.custom_fields?.[0]?.value;

      if (invoiceRef) {
        const db = await getDb();
        if (db) {
          await db
            .update(invoices)
            .set({ status: "Paid", paidAt: new Date(), paystackRef: reference })
            .where(eq(invoices.invoiceRef, invoiceRef));
        }

        // Notify owner
        await notifyOwner({
          title: `Invoice Paid — ${invoiceRef}`,
          content: `Invoice ${invoiceRef} has been paid via Paystack. Reference: ${reference}.`,
        });
      }
    }

    return res.json({ received: true });
  } catch (err) {
    console.error("[Paystack] Webhook error:", err);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
});

/**
 * GET /api/paystack/verify/:reference
 * Verifies a transaction by reference.
 */
paystackRouter.get("/verify/:reference", async (req: Request, res: Response) => {
  try {
    const data = await paystackGet(`/transaction/verify/${req.params.reference}`);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: "Verification failed" });
  }
});
