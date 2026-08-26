import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import type { Store } from "../store.js";
import {
  createItEndpoint,
  getItEndpoint,
  getItEndpointsHealth,
  listItEndpoints,
  patchItEndpoint,
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

export function registerItEndpointRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/endpoints/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getItEndpointsHealth(store, principal);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.get("/v1/endpoints", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listItEndpoints(store, principal, req.query as { q?: string; status?: string });
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/endpoints", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = createItEndpoint(store, principal, (req.body ?? {}) as Parameters<typeof createItEndpoint>[2]);
    if ("error" in result) return sendError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/endpoints/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getItEndpoint(store, principal, (req.params as { id: string }).id);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.patch("/v1/endpoints/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = patchItEndpoint(
      store,
      principal,
      (req.params as { id: string }).id,
      (req.body ?? {}) as Parameters<typeof patchItEndpoint>[3],
    );
    if ("error" in result) return sendError(reply, result);
    return result;
  });
}
