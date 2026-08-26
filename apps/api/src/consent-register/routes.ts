import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import type { Store } from "../store.js";
import {
  createConsent,
  getConsent,
  getConsentsHealth,
  listConsents,
  patchConsent,
} from "./service.js";

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

export function registerConsentRegisterRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/consents/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getConsentsHealth(store, principal);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.get("/v1/consents", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listConsents(store, principal, req.query as { q?: string; status?: string });
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/consents", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = createConsent(store, principal, (req.body ?? {}) as Parameters<typeof createConsent>[2]);
    if ("error" in result) return sendError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/consents/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getConsent(store, principal, (req.params as { id: string }).id);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.patch("/v1/consents/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = patchConsent(
      store,
      principal,
      (req.params as { id: string }).id,
      (req.body ?? {}) as Parameters<typeof patchConsent>[3],
    );
    if ("error" in result) return sendError(reply, result);
    return result;
  });
}
