import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import { getCorrelationId } from "../observability.js";
import type { Store } from "../store.js";
import { isHttpErrorResult, sendHttpError } from "../http-error.js";
import {
  generateIssuedClientDocument,
  getIssuedClientDocument,
  getIssuedClientDocumentContent,
  listIssuedClientDocuments,
} from "./client-document.js";

export function registerIssuedClientDocumentRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/issued-proposal-documents", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { issuedProposalId?: string };
    const result = await listIssuedClientDocuments(store, principal, query);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/issued-proposal-documents", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const body = (req.body ?? {}) as { issuedProposalId?: string; programmeId?: string };
    const result = await generateIssuedClientDocument(store, principal, body, correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/issued-proposal-documents/:id/content", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await getIssuedClientDocumentContent(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/issued-proposal-documents/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await getIssuedClientDocument(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });
}
