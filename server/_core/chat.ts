/**
 * Chat API Handler
 *
 * Express endpoint for AI SDK streaming chat with tool calling support.
 * Uses patched fetch to fix OpenAI-compatible proxy issues.
 */

import { streamText, stepCountIs } from "ai";
import type { ModelMessage } from "ai";
import { tool } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import type { Express } from "express";
import { z } from "zod/v4";
import { ENV } from "./env";
import { createPatchedFetch } from "./patchedFetch";

/**
 * Creates an OpenAI-compatible provider with patched fetch.
 */
function createLLMProvider() {
  const baseURL = ENV.forgeApiUrl.endsWith("/v1")
    ? ENV.forgeApiUrl
    : `${ENV.forgeApiUrl}/v1`;

  return createOpenAI({
    baseURL,
    apiKey: ENV.forgeApiKey,
    fetch: createPatchedFetch(fetch),
  });
}

/**
 * Example tool registry - customize these for your app.
 */
const tools = {
  getWeather: tool({
    description: "Get the current weather for a location",
    inputSchema: z.object({
      location: z
        .string()
        .describe("The city and country, e.g. 'Tokyo, Japan'"),
      unit: z.enum(["celsius", "fahrenheit"]).optional().default("celsius"),
    }),
    execute: async ({ location, unit }) => {
      const temp = Math.floor(Math.random() * 30) + 5;
      const conditions = ["sunny", "cloudy", "rainy", "partly cloudy"][
        Math.floor(Math.random() * 4)
      ] as string;
      return {
        location,
        temperature: unit === "fahrenheit" ? Math.round(temp * 1.8 + 32) : temp,
        unit,
        conditions,
        humidity: Math.floor(Math.random() * 50) + 30,
      };
    },
  }),

  calculate: tool({
    description: "Perform a mathematical calculation",
    inputSchema: z.object({
      expression: z
        .string()
        .describe("The math expression to evaluate, e.g. '2 + 2'"),
    }),
    execute: async ({ expression }) => {
      try {
        const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, "");
        const result = Function(
          `"use strict"; return (${sanitized})`
        )() as number;
        return { expression, result };
      } catch {
        return { expression, error: "Invalid expression" };
      }
    },
  }),
};

const HAMZURY_SYSTEM_PROMPT = `You are HAMZURY's institutional knowledge assistant. Answer questions about HAMZURY's services, processes, and how to get started.

HAMZURY is a multi-unit institution based in Jos, Nigeria with four service departments:
1. Bizdoc — CAC registration, annual returns, tax (TIN/VAT), PENCOM compliance, industry licensing, compliance advisory.
2. Studios — Brand identity, social media management, video production, podcast production, content strategy, content subscriptions.
3. Systems — Business websites, web applications, custom dashboards, automation workflows, AI agent development, CRM systems, maintenance subscriptions.
4. Innovation Hub — AI Entrepreneurship (3 weeks), AI Productivity (2 weeks), AI Creative (2 weeks), Kids Innovation Program (Thu–Sat 10am–12pm), Executive Workshops (3 days).

RIDI is HAMZURY's social impact arm. 10% of every naira earned funds community education, rural scholarships, and digital access programs.

Client journey: Inquiry → Qualify → Clarity Report → Payment → Production → Quality Gate → Delivery → Payment Confirmed → Nurture.
Reference numbers: HZR-YYMMDD-XXX. Clients track projects at hamzuryos.biz/track.

Affiliates earn commissions for referring clients. The program is invite-only. Apply at hamzuryos.biz/affiliates.

Keep responses calm, clear, and concise. No hype. No exclamation marks. Always end with a helpful next step.
When a user seems ready to start a project, guide them to /start.
When they want to track a project, guide them to /track.
When they want to learn about affiliates, guide them to /affiliates.`;

/**
 * Registers the /api/chat and /api/ask endpoints for streaming AI responses.
 */
export function registerChatRoutes(app: Express) {
  const openai = createLLMProvider();

  // General chat endpoint (AI SDK default)
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "messages array is required" });
        return;
      }

      const result = streamText({
        model: openai.chat("gpt-4o"),
        system:
          "You are a helpful assistant. You have access to tools for getting weather and doing calculations. Use them when appropriate.",
        messages: messages as ModelMessage[],
        tools,
        stopWhen: stepCountIs(5),
      });

      result.pipeUIMessageStreamToResponse(res);
    } catch (error) {
      console.error("[/api/chat] Error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // HAMZURY Knowledge Assistant endpoint (/ask page)
  app.post("/api/ask", async (req, res) => {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "messages array is required" });
        return;
      }

      const result = streamText({
        model: openai.chat("gpt-4o"),
        system: HAMZURY_SYSTEM_PROMPT,
        messages: messages as ModelMessage[],
      });

      result.pipeUIMessageStreamToResponse(res);
    } catch (error) {
      console.error("[/api/ask] Error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });
}

export { tools };
