import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import { getCorrelationId } from "../observability.js";
import type { Store } from "../store.js";
import {
  createRfp,
  createRfpVersion,
  getRfp,
  getRfpModuleHealth,
  listRfpWorkflowStages,
  listRfps,
  transitionRfpStage,
} from "./rfp.js";

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

export function registerRfpRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/rfps/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    return getRfpModuleHealth(store);
  });

  app.get("/v1/rfps/workflow-stages", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    return listRfpWorkflowStages();
  });

  app.get("/v1/rfps", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { opportunityId?: string; workflowStage?: string; status?: string };
    const result = listRfps(store, principal, query);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/rfps", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = createRfp(store, principal, req.body as Parameters<typeof createRfp>[2], correlationId);
    if ("error" in result) return sendError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/rfps/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getRfp(store, principal, (req.params as { id: string }).id);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/rfps/:id/transitions", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const body = req.body as { toStage: string };
    const result = transitionRfpStage(
      store,
      principal,
      (req.params as { id: string }).id,
      body.toStage,
      correlationId,
    );
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/rfps/:id/versions", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const body = req.body as { summary: string };
    const result = createRfpVersion(
      store,
      principal,
      (req.params as { id: string }).id,
      body.summary,
      correlationId,
    );
    if ("error" in result) return sendError(reply, result);
    return reply.code(201).send(result);
  });
}
