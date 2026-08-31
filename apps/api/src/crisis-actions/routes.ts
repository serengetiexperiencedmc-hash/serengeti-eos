import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import type { Store } from "../store.js";
import { isHttpErrorResult, sendHttpError } from "../http-error.js";
import {
  createCrisisAction,
  getCrisisAction,
  getCrisisActionsHealth,
  listCrisisActions,
  patchCrisisAction,
  transitionCrisisAction,
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

export function registerCrisisActionRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/crisis/actions/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getCrisisActionsHealth(store, principal);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crisis/actions", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listCrisisActions(
      store,
      principal,
      req.query as { q?: string; status?: string; crisisId?: string },
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crisis/actions", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = createCrisisAction(store, principal, (req.body ?? {}) as Parameters<typeof createCrisisAction>[2]);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/crisis/actions/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getCrisisAction(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.patch("/v1/crisis/actions/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = patchCrisisAction(
      store,
      principal,
      (req.params as { id: string }).id,
      (req.body ?? {}) as Parameters<typeof patchCrisisAction>[3],
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  for (const action of ["complete", "cancel"] as const) {
    app.post(`/v1/crisis/actions/:id/${action}`, async (req, reply) => {
      const principal = principalFromAuthHeader(store, req.headers.authorization);
      if (!principal) return reply.code(401).send({ error: "unauthenticated" });
      const result = transitionCrisisAction(store, principal, (req.params as { id: string }).id, action);
      if (isHttpErrorResult(result)) return sendHttpError(reply, result);
      return result;
    });
  }
}
