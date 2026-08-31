import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import type { Store } from "../store.js";
import { isHttpErrorResult, sendHttpError } from "../http-error.js";
import {
  createPrivacyDpia,
  getPrivacyDpia,
  getPrivacyDpiasHealth,
  listPrivacyDpias,
  patchPrivacyDpia,
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

export function registerPrivacyDpiaRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/privacy/dpias/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getPrivacyDpiasHealth(store, principal);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/privacy/dpias", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listPrivacyDpias(store, principal, req.query as { q?: string; status?: string });
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/privacy/dpias", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = createPrivacyDpia(store, principal, (req.body ?? {}) as Parameters<typeof createPrivacyDpia>[2]);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/privacy/dpias/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getPrivacyDpia(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.patch("/v1/privacy/dpias/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = patchPrivacyDpia(
      store,
      principal,
      (req.params as { id: string }).id,
      (req.body ?? {}) as Parameters<typeof patchPrivacyDpia>[3],
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });
}
