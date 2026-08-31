import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import type { Store } from "../store.js";
import { isHttpErrorResult, sendHttpError } from "../http-error.js";
import {
  createDsrCase,
  createProcessingActivity,
  getDsrCase,
  getPrivacyHealth,
  getProcessingActivity,
  listDsrCases,
  listProcessingActivities,
  patchDsrCase,
  patchProcessingActivity,
  retireProcessingActivity,
  transitionDsrCase,
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

export function registerPrivacyRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/privacy/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getPrivacyHealth(store, principal);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/privacy/activities", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listProcessingActivities(store, principal, req.query as { q?: string; status?: string });
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/privacy/activities", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = createProcessingActivity(
      store,
      principal,
      (req.body ?? {}) as Parameters<typeof createProcessingActivity>[2],
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/privacy/activities/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getProcessingActivity(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.patch("/v1/privacy/activities/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = patchProcessingActivity(
      store,
      principal,
      (req.params as { id: string }).id,
      (req.body ?? {}) as Parameters<typeof patchProcessingActivity>[3],
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/privacy/activities/:id/retire", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = retireProcessingActivity(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/privacy/dsrs", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listDsrCases(store, principal, req.query as { q?: string; status?: string });
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/privacy/dsrs", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = createDsrCase(store, principal, (req.body ?? {}) as Parameters<typeof createDsrCase>[2]);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/privacy/dsrs/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getDsrCase(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.patch("/v1/privacy/dsrs/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = patchDsrCase(
      store,
      principal,
      (req.params as { id: string }).id,
      (req.body ?? {}) as Parameters<typeof patchDsrCase>[3],
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  for (const action of ["start", "close"] as const) {
    app.post(`/v1/privacy/dsrs/:id/${action}`, async (req, reply) => {
      const principal = principalFromAuthHeader(store, req.headers.authorization);
      if (!principal) return reply.code(401).send({ error: "unauthenticated" });
      const result = transitionDsrCase(store, principal, (req.params as { id: string }).id, action);
      if (isHttpErrorResult(result)) return sendHttpError(reply, result);
      return result;
    });
  }
}
