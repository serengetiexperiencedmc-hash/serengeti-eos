import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import { getCorrelationId } from "../observability.js";
import type { Store } from "../store.js";
import {
  decideCommercialApproval,
  getCommercialApprovalModuleHealth,
  getCommercialApprovalRequest,
  listCommercialApprovalRequests,
  requestCommercialApproval,
} from "./approval.js";

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

export function registerCommercialApprovalRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/commercial-approvals/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    return getCommercialApprovalModuleHealth(store);
  });

  app.get("/v1/commercial-approvals", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { costSheetId?: string; rfpId?: string; status?: string };
    const result = listCommercialApprovalRequests(store, principal, query);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/commercial-approvals/request", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const body = req.body as { costSheetId: string; notes?: string };
    const result = requestCommercialApproval(store, principal, body.costSheetId, correlationId, body.notes);
    if ("error" in result) return sendError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/commercial-approvals/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getCommercialApprovalRequest(store, principal, (req.params as { id: string }).id);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/commercial-approvals/:id/decision", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const body = req.body as { outcome: "approved" | "rejected"; notes?: string };
    if (body.outcome !== "approved" && body.outcome !== "rejected") {
      return reply.code(400).send({ error: "invalid_request" });
    }
    const result = decideCommercialApproval(
      store,
      principal,
      (req.params as { id: string }).id,
      body.outcome,
      correlationId,
      body.notes,
    );
    if ("error" in result) return sendError(reply, result);
    return result;
  });
}
