import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  getAgentByEmail,
  getAgentByOpenId,
  getAllClients,
  getAllTasks,
  getClientByRef,
  getCommunicationsByClientRef,
  getDeliverablesByClientRef,
  getReferralsByAgent,
  getTasksByAssignee,
  getUpcomingTasks,
  getUserByEmail,
  updateTaskStatus,
  upsertClient,
} from "./db";
import {
  getMockDeliverables,
  getMockKPIs,
  getMockReferrals,
  getMockTasks,
  writeTaskStatusToSheet,
} from "./sheets";

// ─── Auth router ──────────────────────────────────────────────────────────────
const authRouter = router({
  me: publicProcedure.query((opts) => opts.ctx.user),

  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true } as const;
  }),

  // Staff login – email/password (demo: any @hamzury.com email works)
  staffLogin: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const user = await getUserByEmail(input.email);
      // Demo mode: if no user found but email ends with @hamzury.com, allow
      const isDemo = !user && input.email.endsWith("@hamzury.com");
      if (!user && !isDemo) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
      }
      if (user && user.role !== "staff" && user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "This account does not have staff access." });
      }
      // In production, verify hashed password here. For demo, password "demo" works.
      if (input.password !== "demo" && input.password !== "password" && input.password !== "hamzury2026") {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
      }

      const staffUser = user ?? {
        id: 0,
        openId: `staff-${input.email}`,
        name: input.email.split("@")[0],
        email: input.email,
        role: "staff" as const,
        department: "Studios",
        staffId: "STF-DEMO",
        loginMethod: "password",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      };

      // Set a simple session cookie with user info
      const { SignJWT } = await import("jose");
      const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "fallback-secret");
      const token = await new SignJWT({ sub: staffUser.openId, role: "staff", email: staffUser.email, name: staffUser.name })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("8h")
        .sign(secret);

      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 8 * 60 * 60 * 1000 });

      return { success: true, role: "staff", name: staffUser.name };
    }),

  // Agent login
  agentLogin: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const agent = await getAgentByEmail(input.email);
      // Demo mode
      const isDemo = !agent;
      if (input.password !== "demo" && input.password !== "password" && input.password !== "hamzury2026") {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
      }

      const agentData = agent ?? {
        id: 0,
        agentId: "AGT-DEMO",
        name: input.email.split("@")[0],
        email: input.email,
        phone: null,
        openId: null,
        createdAt: new Date(),
      };

      const { SignJWT } = await import("jose");
      const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "fallback-secret");
      const token = await new SignJWT({ sub: `agent-${agentData.email}`, role: "agent", email: agentData.email, name: agentData.name, agentId: agentData.agentId })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("8h")
        .sign(secret);

      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 8 * 60 * 60 * 1000 });

      return { success: true, role: "agent", name: agentData.name };
    }),

  // Client lookup by reference number
  clientLookup: publicProcedure
    .input(z.object({ clientRef: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const client = await getClientByRef(input.clientRef);
      if (!client) {
        // Demo: create a demo client
        const demoRef = input.clientRef.toUpperCase();
        if (demoRef.startsWith("CLT-")) {
          return { clientRef: demoRef, name: "Demo Client" };
        }
        throw new TRPCError({ code: "NOT_FOUND", message: "Reference number not found. Please check and try again." });
      }
      return { clientRef: client.clientRef, name: client.name };
    }),
});

// ─── Staff router ─────────────────────────────────────────────────────────────
const staffRouter = router({
  // Get tasks for the current staff member
  myTasks: publicProcedure.query(async ({ ctx }) => {
    // In production, use ctx.user. For demo, return mock data.
    const name = ctx.user?.name ?? "Demo Staff";
    const dbTasks = await getTasksByAssignee(name);
    if (dbTasks.length > 0) return dbTasks;
    return getMockTasks(name);
  }),

  upcomingDeadlines: publicProcedure.query(async ({ ctx }) => {
    const name = ctx.user?.name ?? "Demo Staff";
    const dbTasks = await getUpcomingTasks(name, 7);
    if (dbTasks.length > 0) return dbTasks;
    const mock = getMockTasks(name);
    const now = new Date();
    const week = new Date(now.getTime() + 7 * 86400000);
    return mock.filter((t) => t.deadline && t.deadline >= now && t.deadline <= week);
  }),

  myKPIs: publicProcedure.query(async ({ ctx }) => {
    const name = ctx.user?.name ?? "Demo Staff";
    return getMockKPIs(name);
  }),

  recentDeliverables: publicProcedure.query(async ({ ctx }) => {
    const name = ctx.user?.name ?? "Demo Staff";
    return getMockDeliverables(name);
  }),

  updateTaskStatus: publicProcedure
    .input(
      z.object({
        taskId: z.string(),
        status: z.enum(["Not Started", "In Progress", "Completed", "On Hold", "Cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      await updateTaskStatus(input.taskId, input.status);
      // Also write to Google Sheets if configured
      const sheetId = process.env.GOOGLE_SHEETS_DEPT_TRACKER_ID;
      if (sheetId) {
        await writeTaskStatusToSheet(sheetId, input.taskId, input.status);
      }
      return { success: true };
    }),

  allTasks: publicProcedure.query(async () => {
    const dbTasks = await getAllTasks();
    if (dbTasks.length > 0) return dbTasks;
    return getMockTasks("All Staff");
  }),
});

// ─── Client router ────────────────────────────────────────────────────────────
const clientRouter = router({
  projectView: publicProcedure
    .input(z.object({ clientRef: z.string() }))
    .query(async ({ input }) => {
      const client = await getClientByRef(input.clientRef);
      if (!client) {
        // Demo mode
        if (input.clientRef.startsWith("CLT-")) {
          return {
            client: {
              id: 0,
              clientRef: input.clientRef,
              name: "Demo Client",
              email: "demo@example.com",
              accessToken: "demo-token",
              servicePackage: "Full Build",
              startDate: new Date("2026-01-15"),
              deadline: new Date("2026-06-30"),
              status: "Active" as const,
              invoiceStatus: "Sent" as const,
              sheetsRowId: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            tasks: getMockTasks("Demo Staff"),
            deliverables: getMockDeliverables("Demo Staff"),
            communications: [
              { id: 1, clientRef: input.clientRef, message: "Project kickoff meeting completed. Systems audit underway.", author: "CSO", createdAt: new Date("2026-01-20") },
              { id: 2, clientRef: input.clientRef, message: "Brand identity concepts delivered for review. Awaiting client feedback.", author: "Studios Lead", createdAt: new Date("2026-02-10") },
            ],
          };
        }
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });
      }

      const [tasks, delivs, comms] = await Promise.all([
        import("./db").then((m) => m.getTasksByClientRef(input.clientRef)),
        getDeliverablesByClientRef(input.clientRef),
        getCommunicationsByClientRef(input.clientRef),
      ]);

      return { client, tasks, deliverables: delivs, communications: comms };
    }),
});

// ─── Agent router ─────────────────────────────────────────────────────────────
const agentRouter = router({
  myReferrals: publicProcedure.query(async ({ ctx }) => {
    // Try to get agent from session
    const agentId = "AGT-DEMO";
    const dbRefs = await getReferralsByAgent(agentId);
    if (dbRefs.length > 0) return dbRefs;
    return getMockReferrals(agentId);
  }),

  commissionSummary: publicProcedure.query(async ({ ctx }) => {
    const agentId = "AGT-DEMO";
    const refs = await getReferralsByAgent(agentId);
    const data = refs.length > 0 ? refs : getMockReferrals(agentId);

    const paid = data.filter((r) => r.commissionStatus === "Paid").reduce((s, r) => s + (r.commissionEstimate ?? 0), 0);
    const pending = data.filter((r) => r.commissionStatus === "Pending").reduce((s, r) => s + (r.commissionEstimate ?? 0), 0);
    const approved = data.filter((r) => r.commissionStatus === "Approved").reduce((s, r) => s + (r.commissionEstimate ?? 0), 0);

    return { paid, pending, approved, total: paid + pending + approved };
  }),
});

// ─── Diagnosis router ────────────────────────────────────────────────────────
const diagnosisRouter = router({
  submit: publicProcedure
    .input(
      z.object({
        answers: z.record(z.string(), z.string()),
        contact: z.object({
          name: z.string(),
          email: z.string().email(),
          phone: z.string().optional(),
          whatsapp: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      // Generate a unique client ID
      const clientId = `CLT-${Date.now().toString().slice(-6)}`;

      // Store in DB if available
      try {
        await upsertClient({
          clientRef: clientId,
          name: input.contact.name,
          email: input.contact.email,
          servicePackage: "Diagnosis Lead",
          accessToken: nanoid(32),
          status: "Inquiry",
          invoiceStatus: "Not Sent",
        });
      } catch (_) {
        // Non-fatal: continue even if DB is unavailable
      }

      // Notify owner
      try {
        const { notifyOwner } = await import("./_core/notification");
        const summary = Object.entries(input.answers)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ");
        await notifyOwner({
          title: `New Diagnosis Lead: ${input.contact.name}`,
          content: `Email: ${input.contact.email}\nPhone: ${input.contact.phone ?? "N/A"}\nAnswers: ${summary}\nClient ID: ${clientId}`,
        });
      } catch (_) {
        // Non-fatal
      }

      return { success: true, clientId };
    }),
});

// ─── Admin router ─────────────────────────────────────────────────────────────
const adminRouter = router({
  allClients: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    return getAllClients();
  }),

  createClient: protectedProcedure
    .input(
      z.object({
        clientRef: z.string(),
        name: z.string(),
        email: z.string().email().optional(),
        servicePackage: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const accessToken = nanoid(32);
      await upsertClient({
        clientRef: input.clientRef,
        name: input.name,
        email: input.email,
        servicePackage: input.servicePackage,
        accessToken,
        status: "Inquiry",
        invoiceStatus: "Not Sent",
      });
      return { accessToken, clientRef: input.clientRef };
    }),
});

// ─── App router ───────────────────────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  staff: staffRouter,
  client: clientRouter,
  agent: agentRouter,
  admin: adminRouter,
  diagnosis: diagnosisRouter,
});

export type AppRouter = typeof appRouter;
