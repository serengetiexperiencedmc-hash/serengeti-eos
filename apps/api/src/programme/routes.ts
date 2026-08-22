import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import { getCorrelationId } from "../observability.js";
import type { Store } from "../store.js";
import {
  addProgrammeDay,
  addProgrammeItem,
  createProgramme,
  getProgrammeByRfp,
  getProgrammeDetail,
  getProgrammeModuleHealth,
  listProgrammes,
} from "./programme.js";

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

export function registerProgrammeRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/programmes/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    return getProgrammeModuleHealth(store);
  });

  app.get("/v1/programmes", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { rfpId?: string; status?: string };
    const result = listProgrammes(store, principal, query);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/programmes", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = createProgramme(
      store,
      principal,
      req.body as Parameters<typeof createProgramme>[2],
      correlationId,
    );
    if ("error" in result) return sendError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/programmes/by-rfp/:rfpId", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getProgrammeByRfp(store, principal, (req.params as { rfpId: string }).rfpId);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.get("/v1/programmes/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getProgrammeDetail(store, principal, (req.params as { id: string }).id);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/programmes/:id/days", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = addProgrammeDay(
      store,
      principal,
      (req.params as { id: string }).id,
      req.body as Parameters<typeof addProgrammeDay>[3],
      correlationId,
    );
    if ("error" in result) return sendError(reply, result);
    return reply.code(201).send(result);
  });

  app.post("/v1/programmes/:id/days/:dayId/items", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const params = req.params as { id: string; dayId: string };
    const result = addProgrammeItem(
      store,
      principal,
      params.id,
      params.dayId,
      req.body as Parameters<typeof addProgrammeItem>[4],
      correlationId,
    );
    if ("error" in result) return sendError(reply, result);
    return reply.code(201).send(result);
  });
}
