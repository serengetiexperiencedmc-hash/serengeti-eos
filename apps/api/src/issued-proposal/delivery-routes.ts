import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import { getCorrelationId } from "../observability.js";
import type { Store } from "../store.js";
import { isHttpErrorResult, sendHttpError } from "../http-error.js";
import {
  authorizeIssuedClientDocumentDelivery,
  executeIssuedClientDocumentDeliveryAttempt,
  getIssuedClientDocumentDelivery,
  listIssuedClientDocumentDeliveries,
} from "./delivery.js";

export function registerIssuedClientDocumentDeliveryRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/issued-proposal-document-deliveries", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await listIssuedClientDocumentDeliveries(store, principal);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/issued-proposal-document-deliveries", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const body = (req.body ?? {}) as {
      issuedClientDocumentId?: string;
      recipientEmail?: string;
      recipientConfirmed?: boolean;
      relatedOrganizationId?: string;
      clientIdempotencyKey?: string;
      authorizeSupersededDocument?: boolean;
      execute?: boolean;
      cc?: unknown;
      bcc?: unknown;
      additionalTo?: unknown;
    };
    const result = await authorizeIssuedClientDocumentDelivery(store, principal, body, correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/issued-proposal-document-deliveries/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await getIssuedClientDocumentDelivery(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/issued-proposal-document-deliveries/:id/attempts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = await executeIssuedClientDocumentDeliveryAttempt(
      store,
      principal,
      (req.params as { id: string }).id,
      correlationId,
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });
}
