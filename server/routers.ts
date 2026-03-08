import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";
import {
  addCommunication,
  createAgentRecord,
  getAgentByEmail,
  getAgentByOpenId,
  getAllAgents,
  getAllClients,
  getAllStaff,
  getAllTasks,
  getClientByRef,
  getCommunicationsByClientRef,
  getDeliverablesByClientRef,
  getReferralsByAgent,
  getTasksByAssignee,
  getUpcomingTasks,
  getUserByEmail,
  updateClientStatusDb,
  updateTaskStatus,
  upsertClient,
  upsertStaffUser,
  upsertUser,
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

      // Ensure user exists in DB so context.authenticateRequest can find them
      await upsertUser({
        openId: staffUser.openId,
        name: staffUser.name ?? null,
        email: staffUser.email ?? null,
        loginMethod: "password",
        role: (staffUser.role === "admin" ? "admin" : "user") as "admin" | "user",
        lastSignedIn: new Date(),
      });

      // Set a simple session cookie with user info
      const { SignJWT } = await import("jose");
      const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "fallback-secret");
      const token = await new SignJWT({ sub: staffUser.openId, openId: staffUser.openId, appId: ENV.appId, role: staffUser.role ?? "staff", email: staffUser.email, name: staffUser.name })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("8h")
        .sign(secret);

      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 8 * 60 * 60 * 1000 });

      return { success: true, role: staffUser.role ?? "staff", name: staffUser.name };
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

      // Ensure agent user exists in DB
      await upsertUser({
        openId: `agent-${agentData.email}`,
        name: agentData.name ?? null,
        email: agentData.email ?? null,
        loginMethod: "password",
        role: "user",
        lastSignedIn: new Date(),
      });

      const { SignJWT } = await import("jose");
      const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "fallback-secret");
      const token = await new SignJWT({ sub: `agent-${agentData.email}`, openId: `agent-${agentData.email}`, appId: ENV.appId, role: "agent", email: agentData.email, name: agentData.name, agentId: agentData.agentId })
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
function requireAdmin(role: string) {
  if (role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required." });
}

const adminRouter = router({
  // ── Overview stats ──────────────────────────────────────────────────────────
  stats: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user.role);
    const [allC, allT] = await Promise.all([getAllClients(), getAllTasks()]);
    const allStaff = await getAllStaff();
    const allAgents = await getAllAgents();
    return {
      totalClients: allC.length,
      activeClients: allC.filter((c) => c.status === "Active").length,
      totalTasks: allT.length,
      completedTasks: allT.filter((t) => t.status === "Completed").length,
      totalStaff: allStaff.length,
      totalAgents: allAgents.length,
    };
  }),

  // ── Clients ─────────────────────────────────────────────────────────────────
  allClients: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user.role);
    return getAllClients();
  }),

  createClient: protectedProcedure
    .input(z.object({
      clientRef: z.string().min(1),
      name: z.string().min(1),
      email: z.string().email().optional(),
      servicePackage: z.string().optional(),
      status: z.enum(["Inquiry", "Proposal", "Active", "Delivery", "Closed"]).optional(),
      startDate: z.string().optional(),
      deadline: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      requireAdmin(ctx.user.role);
      const accessToken = nanoid(32);
      await upsertClient({
        clientRef: input.clientRef,
        name: input.name,
        email: input.email,
        servicePackage: input.servicePackage,
        accessToken,
        status: (input.status ?? "Inquiry") as "Inquiry" | "Proposal" | "Active" | "Delivery" | "Closed",
        invoiceStatus: "Not Sent",
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        deadline: input.deadline ? new Date(input.deadline) : undefined,
      });
      return { accessToken, clientRef: input.clientRef, accessUrl: `/client/${input.clientRef}` };
    }),

  updateClientStatus: protectedProcedure
    .input(z.object({
      clientRef: z.string(),
      status: z.enum(["Inquiry", "Proposal", "Active", "Delivery", "Closed"]),
      invoiceStatus: z.enum(["Not Sent", "Sent", "Paid", "Overdue"]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      requireAdmin(ctx.user.role);
      await updateClientStatusDb(input.clientRef, input.status, input.invoiceStatus);
      return { success: true };
    }),

  // ── Communications ──────────────────────────────────────────────────────────
  postCommunication: protectedProcedure
    .input(z.object({
      clientRef: z.string().min(1),
      message: z.string().min(1),
      author: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      requireAdmin(ctx.user.role);
      await addCommunication(input.clientRef, input.message, input.author ?? ctx.user.name ?? "Admin");
      return { success: true };
    }),

  // ── Staff ───────────────────────────────────────────────────────────────────
  allStaff: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user.role);
    return getAllStaff();
  }),

  createStaff: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
      department: z.string().optional(),
      staffId: z.string().optional(),
      role: z.enum(["staff", "admin"]).default("staff"),
    }))
    .mutation(async ({ input, ctx }) => {
      requireAdmin(ctx.user.role);
      const staffId = input.staffId ?? `STF-${nanoid(6).toUpperCase()}`;
      await upsertStaffUser({
        openId: `staff-${input.email}`,
        name: input.name,
        email: input.email,
        department: input.department,
        staffId,
        role: input.role,
        loginMethod: "password",
        lastSignedIn: new Date(),
      });
      return { success: true, staffId };
    }),

  // ── Agents ──────────────────────────────────────────────────────────────────
  allAgents: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user.role);
    return getAllAgents();
  }),

  createAgent: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      requireAdmin(ctx.user.role);
      const agentId = `AGT-${nanoid(6).toUpperCase()}`;
      await createAgentRecord({ agentId, name: input.name, email: input.email, phone: input.phone });
      return { success: true, agentId };
    }),

  // ── Tasks overview ──────────────────────────────────────────────────────────
  allTasks: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user.role);
    return getAllTasks();
  }),
});

// ─── Super Admin router (secret URL, not exposed on public portal) ───────────
const SUPER_ADMIN_EMAIL = "hamzury.superadmin@hamzury.com";
const SUPER_ADMIN_PASSWORD = "H@mzury$ysAdmin2026!";

const superAdminRouter = router({
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      if (input.email !== SUPER_ADMIN_EMAIL || input.password !== SUPER_ADMIN_PASSWORD) {
        // Intentional delay to slow brute force
        await new Promise((r) => setTimeout(r, 1200));
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials." });
      }
      // Ensure superadmin user exists in DB with admin role
      await upsertUser({
        openId: "superadmin",
        name: "Super Admin",
        email: SUPER_ADMIN_EMAIL,
        loginMethod: "password",
        role: "admin",
        lastSignedIn: new Date(),
      });

      const { SignJWT } = await import("jose");
      const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "fallback-secret");
      const token = await new SignJWT({
        sub: "superadmin",
        openId: "superadmin",
        appId: ENV.appId,
        role: "admin",
        email: SUPER_ADMIN_EMAIL,
        name: "Super Admin",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("12h")
        .sign(secret);
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 12 * 60 * 60 * 1000 });
      return { success: true };
    }),
});

// ─── App router ───────────────────────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  staff: staffRouter,
  clientPortal: clientRouter,
  agent: agentRouter,
  admin: adminRouter,
  diagnosis: diagnosisRouter,
  superAdmin: superAdminRouter,
});

export type AppRouter = typeof appRouter;
