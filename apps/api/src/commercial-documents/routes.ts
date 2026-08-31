import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import { getCorrelationId } from "../observability.js";
import type { Store } from "../store.js";
import { isHttpErrorResult, sendHttpError } from "../http-error.js";
import {
  getCommercialDocument,
  getCommercialDocumentContent,
  listRfpDocuments,
  uploadCommercialDocument,
} from "./service.js";

function isErrorResult(result: object): result is { error: string; reason?: string } {
  return "error" in result && typeof (result as { error?: unknown }).error === "string";
}

function sendError(
  reply: { code: (n: number) => { send: (b: unknown) => unknown } },
  result: { error: string; reason?: string },
) {
  const body: { error: string; reason?: string } = { error: result.error };
  if (result.reason !== undefined) body.reason = result.reason;
  switch (result.error) {
    case "forbidden":
      return reply.code(403).send(body);
    case "not_found":
      return reply.code(404).send(body);
    case "conflict":
      return reply.code(409).send(body);
    default:
      return reply.code(400).send(body);
  }
}

export function registerCommercialDocumentRoutes(app: FastifyInstance, store: Store): void {
  app.post("/v1/rfps/:id/documents", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const body = (req.body ?? {}) as Omit<Parameters<typeof uploadCommercialDocument>[2], "rfpId">;
    const result = await uploadCommercialDocument(
      store,
      principal,
      { ...body, rfpId: (req.params as { id: string }).id, kind: body.kind ?? "rfp" },
      correlationId,
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/rfps/:id/documents", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listRfpDocuments(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/commercial-documents/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getCommercialDocument(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/commercial-documents/:id/content", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await getCommercialDocumentContent(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });
}
