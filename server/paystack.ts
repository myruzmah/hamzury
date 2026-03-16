/**
 * HAMZURY Paystack Integration — Dedicated Virtual Accounts (DVA)
 * Generates a unique bank account number per invoice.
 * Clients transfer directly to the account; webhook confirms payment automatically.
 * Paystack API v1 — https://paystack.com/docs/api/dedicated-virtual-accounts
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
 * POST /api/paystack/dva/create
 * Creates a Paystack customer and assigns a Dedicated Virtual Account (DVA).
 * Returns bank name, account number, and account name for the client to transfer to.
 * Body: { invoiceRef, customerName, email, amountNaira }
 */
paystackRouter.post("/dva/create", async (req: Request, res: Response) => {
  try {
    const { invoiceRef, customerName, email, amountNaira } = req.body;

    if (!invoiceRef || !customerName || !email || !amountNaira) {
      return res.status(400).json({
        error: "invoiceRef, customerName, email, and amountNaira are required",
      });
    }

    // Step 1: Create or retrieve a Paystack customer
    const customerData = await paystackPost("/customer", {
      email,
      first_name: customerName.split(" ")[0] || customerName,
      last_name: customerName.split(" ").slice(1).join(" ") || "Client",
      metadata: { invoiceRef },
    });

    if (!customerData.status && !customerData.data?.customer_code) {
      // Customer may already exist — try fetching by email
      const existing = await paystackGet(`/customer/${email}`);
      if (!existing.status) {
        return res.status(500).json({ error: "Could not create Paystack customer" });
      }
      customerData.data = existing.data;
    }

    const customerCode = customerData.data?.customer_code;
    if (!customerCode) {
      return res.status(500).json({ error: "Paystack customer code not returned" });
    }

    // Step 2: Assign a Dedicated Virtual Account to the customer
    // preferred_bank: "wema-bank" or "titan-paystack" (Paystack supported banks for DVA)
    const dvaData = await paystackPost("/dedicated_account", {
      customer: customerCode,
      preferred_bank: "wema-bank",
    });

    if (!dvaData.status || !dvaData.data?.account_number) {
      // If DVA already exists for this customer, fetch it
      const existingDva = await paystackGet(`/dedicated_account?customer=${customerCode}`);
      if (existingDva.status && existingDva.data?.length > 0) {
        const acct = existingDva.data[0];
        // Save to invoice
        const db = await getDb();
        if (db) {
          await db
            .update(invoices)
            .set({
              paystackRef: acct.account_number,
              paystackUrl: null,
              status: "Sent",
            })
            .where(eq(invoices.invoiceRef, invoiceRef));
        }
        return res.json({
          success: true,
          accountNumber: acct.account_number,
          accountName: acct.account_name,
          bankName: acct.bank?.name || "Wema Bank",
          amountNaira: Number(amountNaira),
          invoiceRef,
        });
      }
      return res.status(500).json({
        error: dvaData.message || "Could not assign virtual account. Ensure DVA is enabled on your Paystack account.",
      });
    }

    const acct = dvaData.data;

    // Step 3: Save the virtual account details to the invoice
    const db = await getDb();
    if (db) {
      await db
        .update(invoices)
        .set({
          paystackRef: acct.account_number,
          paystackUrl: null,
          status: "Sent",
        })
        .where(eq(invoices.invoiceRef, invoiceRef));
    }

    return res.json({
      success: true,
      accountNumber: acct.account_number,
      accountName: acct.account_name,
      bankName: acct.bank?.name || "Wema Bank",
      amountNaira: Number(amountNaira),
      invoiceRef,
    });
  } catch (err) {
    console.error("[Paystack DVA] Create error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/paystack/dva/details/:invoiceRef
 * Returns the existing DVA details for an invoice (for re-displaying the account number).
 */
paystackRouter.get("/dva/details/:invoiceRef", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database unavailable" });

    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.invoiceRef, req.params.invoiceRef))
      .limit(1);

    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    return res.json({
      invoiceRef: invoice.invoiceRef,
      accountNumber: invoice.paystackRef || null,
      status: invoice.status,
      amountNaira: invoice.amount,
      clientName: invoice.clientName,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch invoice details" });
  }
});

/**
 * POST /api/paystack/webhook
 * Receives Paystack webhook events.
 * Handles: dedicatedaccount.assign.success, charge.success, transfer.success
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
    const eventType: string = event.event || "";

    // Handle successful bank transfer payment
    if (
      eventType === "charge.success" ||
      eventType === "transfer.success" ||
      eventType === "dedicatedaccount.assign.success"
    ) {
      const accountNumber =
        event.data?.dedicated_account?.account_number ||
        event.data?.account_number ||
        event.data?.recipient?.details?.account_number;

      const customerEmail = event.data?.customer?.email;
      const reference = event.data?.reference || event.data?.transfer_code;

      // Find invoice by account number (paystackRef) or email
      const db = await getDb();
      if (db && accountNumber) {
        const [matchedInvoice] = await db
          .select()
          .from(invoices)
          .where(eq(invoices.paystackRef, accountNumber))
          .limit(1);

        if (matchedInvoice) {
          await db
            .update(invoices)
            .set({
              status: "Paid",
              paidAt: new Date(),
            })
            .where(eq(invoices.invoiceRef, matchedInvoice.invoiceRef));

          await notifyOwner({
            title: `Payment Received — ${matchedInvoice.invoiceRef}`,
            content: `Invoice ${matchedInvoice.invoiceRef} for ${matchedInvoice.clientName} has been paid via bank transfer. Amount: ₦${matchedInvoice.amount?.toLocaleString()}. Reference: ${reference}.`,
          });
        }
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
 * Verifies a transaction by reference (kept for manual verification).
 */
paystackRouter.get("/verify/:reference", async (req: Request, res: Response) => {
  try {
    const data = await paystackGet(`/transaction/verify/${req.params.reference}`);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: "Verification failed" });
  }
});
