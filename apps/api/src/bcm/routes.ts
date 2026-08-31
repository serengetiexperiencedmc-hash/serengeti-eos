import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import type { Store } from "../store.js";
import { isHttpErrorResult, sendHttpError } from "../http-error.js";
import {
  createBackupJob,
  createRestoreProbe,
  getBackupJob,
  getBcmHealth,
  getRestoreProbe,
  listBackupJobs,
  listRestoreProbes,
  patchBackupJob,
  transitionBackupJob,
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

export function registerBcmRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/bcm/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getBcmHealth(store, principal);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/bcm/jobs", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listBackupJobs(store, principal, req.query as { q?: string; status?: string });
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/bcm/jobs", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = createBackupJob(store, principal, (req.body ?? {}) as Parameters<typeof createBackupJob>[2]);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/bcm/jobs/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getBackupJob(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.patch("/v1/bcm/jobs/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = patchBackupJob(
      store,
      principal,
      (req.params as { id: string }).id,
      (req.body ?? {}) as Parameters<typeof patchBackupJob>[3],
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  for (const action of ["complete", "fail"] as const) {
    app.post(`/v1/bcm/jobs/:id/${action}`, async (req, reply) => {
      const principal = principalFromAuthHeader(store, req.headers.authorization);
      if (!principal) return reply.code(401).send({ error: "unauthenticated" });
      const result = transitionBackupJob(store, principal, (req.params as { id: string }).id, action);
      if (isHttpErrorResult(result)) return sendHttpError(reply, result);
      return result;
    });
  }

  app.get("/v1/bcm/jobs/:id/probes", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listRestoreProbes(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/bcm/jobs/:id/probes", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = createRestoreProbe(
      store,
      principal,
      (req.params as { id: string }).id,
      (req.body ?? {}) as Parameters<typeof createRestoreProbe>[3],
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/bcm/probes/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getRestoreProbe(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });
}
