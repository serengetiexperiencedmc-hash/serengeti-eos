import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import type { Store } from "../store.js";
import {
  getAnalyticsModuleHealth,
  getCommercialAnalyticsSummary,
  getCommercialMarginRollup,
  getCommercialPipelineRollup,
} from "./commercial.js";
import { getOperationsAnalyticsSummary, getOperationsBookingReadiness } from "./operations.js";

function sendError(
  reply: { code: (n: number) => { send: (b: unknown) => unknown } },
  result: { error: string; reason?: string },
) {
  if (result.error === "forbidden") return reply.code(403).send(result);
  return reply.code(400).send(result);
}

export function registerAnalyticsRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/analytics/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    return getAnalyticsModuleHealth(store);
  });

  app.get("/v1/analytics/commercial/summary", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getCommercialAnalyticsSummary(store, principal);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.get("/v1/analytics/commercial/pipeline", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getCommercialPipelineRollup(store, principal);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.get("/v1/analytics/commercial/margins", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getCommercialMarginRollup(store, principal);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.get("/v1/analytics/operations/summary", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getOperationsAnalyticsSummary(store, principal);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.get("/v1/analytics/operations/bookings", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getOperationsBookingReadiness(store, principal);
    if ("error" in result) return sendError(reply, result);
    return result;
  });
}
