/**
 * Google Sheets Integration
 *
 * Reads from and writes to Google Sheets using the Sheets API v4.
 * Credentials are provided via environment variables:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL
 *   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
 *   GOOGLE_SHEETS_MASTER_TRACKER_ID
 *   GOOGLE_SHEETS_DEPT_TRACKER_ID
 *
 * When credentials are not configured, the module returns mock/demo data
 * so the application remains functional during development.
 */

import { google } from "googleapis";
import { upsertClient, upsertTask } from "./db";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.readonly",
];

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !key) return null;
  return new google.auth.JWT({ email, key, scopes: SCOPES });
}

function getSheetsClient() {
  const auth = getAuth();
  if (!auth) return null;
  return google.sheets({ version: "v4", auth });
}

// ─── Read Central Master Tracker ─────────────────────────────────────────────
export async function syncMasterTracker(): Promise<{ synced: number; error?: string }> {
  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEETS_MASTER_TRACKER_ID;

  if (!sheets || !spreadsheetId) {
    console.warn("[Sheets] Google Sheets not configured – skipping master tracker sync");
    return { synced: 0, error: "Google Sheets not configured" };
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Master Tracker!A2:J",
    });

    const rows = response.data.values ?? [];
    let synced = 0;

    for (const row of rows) {
      const [taskId, clientName, servicePackage, csoStatus, studiosStatus, systemsStatus, deadline, qualityGate, clientRef] = row;
      if (!taskId) continue;

      await upsertTask({
        taskId: String(taskId),
        clientRef: clientRef ? String(clientRef) : null,
        clientName: clientName ? String(clientName) : null,
        servicePackage: servicePackage ? String(servicePackage) : null,
        status: (csoStatus as "Not Started" | "In Progress" | "Completed" | "On Hold" | "Cancelled") ?? "Not Started",
        deadline: deadline ? new Date(deadline) : null,
        qualityGatePassed: qualityGate === "TRUE" || qualityGate === true,
      });
      synced++;
    }

    return { synced };
  } catch (err) {
    console.error("[Sheets] Master tracker sync failed:", err);
    return { synced: 0, error: String(err) };
  }
}

// ─── Read Department Performance Tracker ─────────────────────────────────────
export async function syncDeptTracker(sheetId: string, department: string): Promise<{ synced: number; error?: string }> {
  const sheets = getSheetsClient();
  if (!sheets || !sheetId) {
    console.warn("[Sheets] Dept tracker not configured");
    return { synced: 0, error: "Google Sheets not configured" };
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "A2:H",
    });

    const rows = response.data.values ?? [];
    let synced = 0;

    for (const row of rows) {
      const [taskId, description, assignedTo, receivedDate, completedDate, status, deadline] = row;
      if (!taskId) continue;

      await upsertTask({
        taskId: String(taskId),
        description: description ? String(description) : null,
        assignedTo: assignedTo ? String(assignedTo) : null,
        department,
        receivedDate: receivedDate ? new Date(receivedDate) : null,
        completedDate: completedDate ? new Date(completedDate) : null,
        status: (status as "Not Started" | "In Progress" | "Completed" | "On Hold" | "Cancelled") ?? "Not Started",
        deadline: deadline ? new Date(deadline) : null,
      });
      synced++;
    }

    return { synced };
  } catch (err) {
    console.error("[Sheets] Dept tracker sync failed:", err);
    return { synced: 0, error: String(err) };
  }
}

// ─── Write task status back to Google Sheets ─────────────────────────────────
export async function writeTaskStatusToSheet(
  spreadsheetId: string,
  taskId: string,
  newStatus: string
): Promise<boolean> {
  const sheets = getSheetsClient();
  if (!sheets || !spreadsheetId) {
    console.warn("[Sheets] Cannot write status – Google Sheets not configured");
    return false;
  }

  try {
    // Find the row with this taskId
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "A:A",
    });

    const rows = response.data.values ?? [];
    const rowIndex = rows.findIndex((r) => r[0] === taskId);
    if (rowIndex === -1) {
      console.warn(`[Sheets] Task ${taskId} not found in sheet`);
      return false;
    }

    // Status is in column F (index 5), rows are 1-indexed, header is row 1
    const range = `F${rowIndex + 1}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: { values: [[newStatus]] },
    });

    return true;
  } catch (err) {
    console.error("[Sheets] Failed to write task status:", err);
    return false;
  }
}

// ─── Demo / Mock data for development ────────────────────────────────────────
export function getMockTasks(assignedTo: string) {
  const now = new Date();
  const addDays = (d: number) => new Date(now.getTime() + d * 86400000);

  return [
    {
      id: 1,
      taskId: "TSK-2026-031",
      clientRef: "CLT-001",
      clientName: "Acme Ltd",
      servicePackage: "Full Build",
      description: "Brand Identity Design",
      assignedTo,
      department: "Studios",
      deadline: addDays(3),
      status: "In Progress" as const,
      qualityGatePassed: false,
      receivedDate: addDays(-7),
      completedDate: null,
      sheetsRowId: null,
      createdAt: addDays(-7),
      updatedAt: now,
    },
    {
      id: 2,
      taskId: "TSK-2026-032",
      clientRef: "CLT-002",
      clientName: "Zenith Corp",
      servicePackage: "Systems Package",
      description: "SOP Documentation",
      assignedTo,
      department: "Systems",
      deadline: addDays(-1),
      status: "Not Started" as const,
      qualityGatePassed: false,
      receivedDate: addDays(-3),
      completedDate: null,
      sheetsRowId: null,
      createdAt: addDays(-3),
      updatedAt: now,
    },
    {
      id: 3,
      taskId: "TSK-2026-033",
      clientRef: "CLT-003",
      clientName: "Nova Ventures",
      servicePackage: "Bizdoc",
      description: "Business Proposal Writing",
      assignedTo,
      department: "Bizdoc",
      deadline: addDays(10),
      status: "Completed" as const,
      qualityGatePassed: true,
      receivedDate: addDays(-14),
      completedDate: addDays(-2),
      sheetsRowId: null,
      createdAt: addDays(-14),
      updatedAt: addDays(-2),
    },
    {
      id: 4,
      taskId: "TSK-2026-034",
      clientRef: "CLT-001",
      clientName: "Acme Ltd",
      servicePackage: "Full Build",
      description: "Website Wireframes",
      assignedTo,
      department: "Studios",
      deadline: addDays(5),
      status: "In Progress" as const,
      qualityGatePassed: false,
      receivedDate: addDays(-5),
      completedDate: null,
      sheetsRowId: null,
      createdAt: addDays(-5),
      updatedAt: now,
    },
  ];
}

export function getMockKPIs(name: string) {
  return {
    tasksCompleted: 12,
    tasksTarget: 20,
    onTimeRate: 83,
    onTimeTarget: 90,
    qaPassRate: 91,
    qaTarget: 95,
    name,
  };
}

export function getMockDeliverables(assignedTo: string) {
  const now = new Date();
  const addDays = (d: number) => new Date(now.getTime() + d * 86400000);
  return [
    { id: 1, taskId: "TSK-2026-033", clientRef: "CLT-003", title: "Business Proposal v2.pdf", driveFileId: null, driveUrl: "https://drive.google.com", uploadedAt: addDays(-2), createdAt: addDays(-2) },
    { id: 2, taskId: "TSK-2026-030", clientRef: "CLT-004", title: "Brand Guidelines.pdf", driveFileId: null, driveUrl: "https://drive.google.com", uploadedAt: addDays(-5), createdAt: addDays(-5) },
  ];
}

export function getMockReferrals(agentId: string) {
  const now = new Date();
  const addDays = (d: number) => new Date(now.getTime() + d * 86400000);
  return [
    { id: 1, agentId, clientName: "Bright Future Ltd", clientEmail: "hello@brightfuture.ng", referralDate: addDays(-30), pipelineStage: "Closed Won" as const, commissionEstimate: 150000, commissionStatus: "Paid" as const, notes: null, createdAt: addDays(-30), updatedAt: addDays(-10) },
    { id: 2, agentId, clientName: "Pinnacle Group", clientEmail: null, referralDate: addDays(-14), pipelineStage: "Proposal" as const, commissionEstimate: 75000, commissionStatus: "Pending" as const, notes: null, createdAt: addDays(-14), updatedAt: addDays(-14) },
    { id: 3, agentId, clientName: "Meridian Holdings", clientEmail: "info@meridian.ng", referralDate: addDays(-7), pipelineStage: "Qualified" as const, commissionEstimate: 50000, commissionStatus: "Pending" as const, notes: null, createdAt: addDays(-7), updatedAt: addDays(-7) },
    { id: 4, agentId, clientName: "Solaris Tech", clientEmail: null, referralDate: addDays(-3), pipelineStage: "Lead" as const, commissionEstimate: 0, commissionStatus: "Pending" as const, notes: null, createdAt: addDays(-3), updatedAt: addDays(-3) },
  ];
}
