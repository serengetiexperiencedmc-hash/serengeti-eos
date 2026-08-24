import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import type { Store } from "../store.js";
import {
  createOperationalIssue,
  getOperationalIssue,
  getOperationalIssuesHealth,
  listOperationalIssues,
  patchOperationalIssue,
  transitionOperationalIssue,
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

export function registerOperationalIssueRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/ops/issues/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getOperationalIssuesHealth(store, principal);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.get("/v1/ops/issues", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listOperationalIssues(
      store,
      principal,
      req.query as { q?: string; status?: string; bookingId?: string },
    );
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/ops/issues", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = createOperationalIssue(
      store,
      principal,
      (req.body ?? {}) as Parameters<typeof createOperationalIssue>[2],
    );
    if ("error" in result) return sendError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/ops/issues/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getOperationalIssue(store, principal, (req.params as { id: string }).id);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.patch("/v1/ops/issues/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = patchOperationalIssue(
      store,
      principal,
      (req.params as { id: string }).id,
      (req.body ?? {}) as Parameters<typeof patchOperationalIssue>[3],
    );
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  for (const action of ["start", "close"] as const) {
    app.post(`/v1/ops/issues/:id/${action}`, async (req, reply) => {
      const principal = principalFromAuthHeader(store, req.headers.authorization);
      if (!principal) return reply.code(401).send({ error: "unauthenticated" });
      const result = transitionOperationalIssue(store, principal, (req.params as { id: string }).id, action);
      if ("error" in result) return sendError(reply, result);
      return result;
    });
  }
}
