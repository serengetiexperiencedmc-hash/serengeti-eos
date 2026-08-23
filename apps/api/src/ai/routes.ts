import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import { getCorrelationId } from "../observability.js";
import type { Store } from "../store.js";
import { acceptAiDraft, createAiDraft, discardAiDraft, getAiDraftSummary, listAiDrafts } from "./drafts.js";
import {
  acknowledgeAiRecommendStale,
  exportAiRecommendLastRun,
  getAiRecommendLastRun,
  listAiRecommendations,
  snoozeAiRecommendStale,
} from "./recommend.js";

function sendError(
  reply: { code: (n: number) => { send: (b: unknown) => unknown } },
  result: { error: string; reason?: string },
) {
  switch (result.error) {
    case "forbidden":
      return reply.code(403).send(result);
    case "not_found":
      return reply.code(404).send(result);
    case "conflict":
      return reply.code(409).send(result);
    default:
      return reply.code(400).send(result);
  }
}

export function registerAiRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/ai/recommendations", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = await listAiRecommendations(store, principal, correlationId);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/ai/recommendations/last-run/stale/snooze", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = (req.body ?? {}) as { hours?: number };
    const result = snoozeAiRecommendStale(store, principal, body);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/ai/recommendations/last-run/stale/ack", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = acknowledgeAiRecommendStale(store, principal);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.get("/v1/ai/recommendations/last-run/export", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { key?: string; format?: string };
    const result = exportAiRecommendLastRun(store, principal, query);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.get("/v1/ai/recommendations/last-run", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { key?: string };
    const result = getAiRecommendLastRun(store, principal, query);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.get("/v1/ai/drafts/summary", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getAiDraftSummary(store, principal);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.get("/v1/ai/drafts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { status?: string; artefactType?: string };
    const result = listAiDrafts(store, principal, query);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/ai/drafts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const body = (req.body ?? {}) as { recommendationKey?: string };
    const result = await createAiDraft(store, principal, body, correlationId);
    if ("error" in result) return sendError(reply, result);
    return reply.code(201).send(result);
  });

  app.post("/v1/ai/drafts/:id/accept", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = await acceptAiDraft(store, principal, (req.params as { id: string }).id, correlationId);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/ai/drafts/:id/discard", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = await discardAiDraft(store, principal, (req.params as { id: string }).id, correlationId);
    if ("error" in result) return sendError(reply, result);
    return result;
  });
}
