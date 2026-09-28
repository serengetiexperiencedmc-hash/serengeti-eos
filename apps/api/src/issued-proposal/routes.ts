import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import { getCorrelationId } from "../observability.js";
import type { Store } from "../store.js";
import { isHttpErrorResult, sendHttpError } from "../http-error.js";
import { getIssuedProposal, issueProposal, listIssuedProposals } from "./issued-proposal.js";

export function registerIssuedProposalRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/issued-proposals", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { programmeId?: string };
    const result = await listIssuedProposals(store, principal, query);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/issued-proposals", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const body = (req.body ?? {}) as { programmeId?: string; c8ProposalId?: string };
    if (!body.programmeId) return reply.code(400).send({ error: "invalid_request", reason: "programme_id_required" });
    const result = await issueProposal(
      store,
      principal,
      {
        programmeId: body.programmeId,
        ...(body.c8ProposalId !== undefined ? { c8ProposalId: body.c8ProposalId } : {}),
      },
      correlationId,
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/issued-proposals/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await getIssuedProposal(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });
}
