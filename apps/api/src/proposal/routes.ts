import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import { getCorrelationId } from "../observability.js";
import type { Store } from "../store.js";
import {
  generateProposal,
  createProposalVersion,
  getProposalByRfp,
  getProposalDetail,
  getProposalModuleHealth,
  listProposals,
  transitionProposalStatus,
} from "./proposal.js";

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

export function registerProposalRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/proposals/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getProposalModuleHealth(store, principal);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.get("/v1/proposals", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { rfpId?: string; status?: string; organizationId?: string };
    const result = listProposals(store, principal, query);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/proposals", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = generateProposal(
      store,
      principal,
      req.body as Parameters<typeof generateProposal>[2],
      correlationId,
    );
    if ("error" in result) return sendError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/proposals/by-rfp/:rfpId", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getProposalByRfp(store, principal, (req.params as { rfpId: string }).rfpId);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.get("/v1/proposals/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getProposalDetail(store, principal, (req.params as { id: string }).id);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/proposals/:id/transitions", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const body = req.body as { toStatus: string };
    const result = transitionProposalStatus(
      store,
      principal,
      (req.params as { id: string }).id,
      body.toStatus,
      correlationId,
    );
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/proposals/:id/versions", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const body = req.body as { summary: string };
    const result = createProposalVersion(
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
