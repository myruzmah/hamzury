import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

// Mock the database helpers so tests don't need a real DB
vi.mock("./db", () => ({
  getUserByEmail: vi.fn(async (email: string) => {
    if (email === "staff@hamzury.com") {
      return {
        id: 1,
        openId: "staff-openid",
        name: "Test Staff",
        email,
        role: "staff",
        department: "Studios",
        staffId: "STF-001",
        loginMethod: "password",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      };
    }
    return undefined;
  }),
  getAgentByEmail: vi.fn(async () => undefined),
  getClientByRef: vi.fn(async (ref: string) => {
    if (ref === "CLT-001") {
      return {
        id: 1,
        clientRef: "CLT-001",
        name: "Acme Ltd",
        email: "acme@example.com",
        accessToken: "test-token-abc",
        servicePackage: "Full Build",
        startDate: new Date("2026-01-01"),
        deadline: new Date("2026-06-30"),
        status: "Active",
        invoiceStatus: "Sent",
        sheetsRowId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return undefined;
  }),
  getAgentByOpenId: vi.fn(async () => undefined),
  getAllClients: vi.fn(async () => []),
  getAllTasks: vi.fn(async () => []),
  getTasksByAssignee: vi.fn(async () => []),
  getUpcomingTasks: vi.fn(async () => []),
  updateTaskStatus: vi.fn(async () => {}),
  upsertClient: vi.fn(async () => {}),
  getReferralsByAgent: vi.fn(async () => []),
  getDeliverablesByClientRef: vi.fn(async () => []),
  getCommunicationsByClientRef: vi.fn(async () => []),
  getTasksByClientRef: vi.fn(async () => []),
  upsertUser: vi.fn(async () => {}),
  getUserByOpenId: vi.fn(async () => undefined),
}));

vi.mock("./sheets", () => ({
  getMockTasks: vi.fn(() => []),
  getMockKPIs: vi.fn(() => ({ tasksCompleted: 5, tasksTarget: 10, onTimeRate: 80, onTimeTarget: 90, qaPassRate: 85, qaTarget: 95, name: "Test" })),
  getMockDeliverables: vi.fn(() => []),
  getMockReferrals: vi.fn(() => []),
  writeTaskStatusToSheet: vi.fn(async () => true),
  syncMasterTracker: vi.fn(async () => ({ synced: 0 })),
}));

function createCtx(): TrpcContext {
  const cookies: Record<string, unknown> = {};
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
      cookie: vi.fn((name: string, value: unknown, opts: unknown) => {
        cookies[name] = value;
      }),
    } as unknown as TrpcContext["res"],
  };
}

describe("auth.logout", () => {
  it("clears the session cookie and returns success", async () => {
    const ctx = createCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(ctx.res.clearCookie).toHaveBeenCalledWith(COOKIE_NAME, expect.objectContaining({ maxAge: -1 }));
  });
});

describe("auth.staffLogin", () => {
  it("rejects unknown email", async () => {
    const ctx = createCtx();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.auth.staffLogin({ email: "unknown@example.com", password: "demo" })
    ).rejects.toThrow();
  });

  it("rejects wrong password for known staff", async () => {
    const ctx = createCtx();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.auth.staffLogin({ email: "staff@hamzury.com", password: "wrongpassword" })
    ).rejects.toThrow();
  });

  it("allows demo staff login with correct password", async () => {
    const ctx = createCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.staffLogin({ email: "staff@hamzury.com", password: "demo" });
    expect(result.success).toBe(true);
    expect(result.role).toBe("staff");
  });

  it("allows demo mode for @hamzury.com emails", async () => {
    const ctx = createCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.staffLogin({ email: "newstaff@hamzury.com", password: "demo" });
    expect(result.success).toBe(true);
  });
});

describe("auth.clientLookup", () => {
  it("returns client ref for known client", async () => {
    const ctx = createCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.clientLookup({ clientRef: "CLT-001" });
    expect(result.clientRef).toBe("CLT-001");
    expect(result.name).toBe("Acme Ltd");
  });

  it("returns demo data for CLT- prefixed refs not in DB", async () => {
    const ctx = createCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.clientLookup({ clientRef: "CLT-999" });
    expect(result.clientRef).toBe("CLT-999");
  });

  it("throws NOT_FOUND for invalid refs", async () => {
    const ctx = createCtx();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.auth.clientLookup({ clientRef: "INVALID" })).rejects.toThrow();
  });
});

describe("staff.updateTaskStatus", () => {
  it("updates task status successfully", async () => {
    const ctx = createCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.staff.updateTaskStatus({ taskId: "TSK-2026-031", status: "Completed" });
    expect(result.success).toBe(true);
  });
});

describe("agent.commissionSummary", () => {
  it("returns commission summary with correct structure", async () => {
    const ctx = createCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.agent.commissionSummary();
    expect(result).toHaveProperty("paid");
    expect(result).toHaveProperty("pending");
    expect(result).toHaveProperty("approved");
    expect(result).toHaveProperty("total");
  });
});
