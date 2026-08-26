import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import type { Store } from "../store.js";
import {
  createItAsset,
  getItAsset,
  getItAssetsHealth,
  listItAssets,
  patchItAsset,
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

export function registerItAssetRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/assets/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getItAssetsHealth(store, principal);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.get("/v1/assets", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listItAssets(store, principal, req.query as { q?: string; status?: string });
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/assets", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = createItAsset(store, principal, (req.body ?? {}) as Parameters<typeof createItAsset>[2]);
    if ("error" in result) return sendError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/assets/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getItAsset(store, principal, (req.params as { id: string }).id);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.patch("/v1/assets/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = patchItAsset(
      store,
      principal,
      (req.params as { id: string }).id,
      (req.body ?? {}) as Parameters<typeof patchItAsset>[3],
    );
    if ("error" in result) return sendError(reply, result);
    return result;
  });
}
