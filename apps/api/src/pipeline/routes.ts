import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import { getCorrelationId } from "../observability.js";
import type { Store } from "../store.js";
import {
  createOpportunity,
  getOpportunity,
  getPipelineBoard,
  getPipelineModuleHealth,
  listOpportunities,
  listPipelineStages,
  transitionOpportunityStage,
} from "./opportunity.js";

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

export function registerPipelineRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/pipeline/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    return getPipelineModuleHealth(store);
  });

  app.get("/v1/pipeline/stages", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    return listPipelineStages();
  });

  app.get("/v1/pipeline/board", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getPipelineBoard(store, principal);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.get("/v1/pipeline/opportunities", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { stage?: string; organizationId?: string; status?: string };
    const result = listOpportunities(store, principal, query);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/pipeline/opportunities", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = createOpportunity(
      store,
      principal,
      req.body as Parameters<typeof createOpportunity>[2],
      correlationId,
    );
    if ("error" in result) return sendError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/pipeline/opportunities/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getOpportunity(store, principal, (req.params as { id: string }).id);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/pipeline/opportunities/:id/transitions", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const body = req.body as { toStage: string; notes?: string };
    const result = transitionOpportunityStage(
      store,
      principal,
      (req.params as { id: string }).id,
      body.toStage,
      correlationId,
      body.notes,
    );
    if ("error" in result) return sendError(reply, result);
    return result;
  });
}
