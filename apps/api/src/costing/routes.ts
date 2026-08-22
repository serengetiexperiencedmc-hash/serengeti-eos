import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import { getCorrelationId } from "../observability.js";
import type { Store } from "../store.js";
import {
  addCostLineItem,
  createCostSheet,
  createCostSheetVersion,
  getCostSheet,
  getCostSheetByProgramme,
  getCostingModuleHealth,
  listCostSheets,
  recalculateCostSheet,
} from "./sheet.js";

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

export function registerCostingRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/costing/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    return getCostingModuleHealth(store);
  });

  app.get("/v1/costing/sheets", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { programmeId?: string; rfpId?: string };
    const result = listCostSheets(store, principal, query);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/costing/sheets", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = createCostSheet(
      store,
      principal,
      req.body as Parameters<typeof createCostSheet>[2],
      correlationId,
    );
    if ("error" in result) return sendError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/costing/sheets/by-programme/:programmeId", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getCostSheetByProgramme(store, principal, (req.params as { programmeId: string }).programmeId);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.get("/v1/costing/sheets/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getCostSheet(store, principal, (req.params as { id: string }).id);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/costing/sheets/:id/line-items", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = addCostLineItem(
      store,
      principal,
      (req.params as { id: string }).id,
      req.body as Parameters<typeof addCostLineItem>[3],
      correlationId,
    );
    if ("error" in result) return sendError(reply, result);
    return reply.code(201).send(result);
  });

  app.post("/v1/costing/sheets/:id/recalculate", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const body = (req.body ?? {}) as { markupPercent?: number; sellPrice?: number };
    const result = recalculateCostSheet(
      store,
      principal,
      (req.params as { id: string }).id,
      correlationId,
      body,
    );
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/costing/sheets/:id/versions", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const body = req.body as { summary: string };
    const result = createCostSheetVersion(
      store,
      principal,
      (req.params as { id: string }).id,
      body.summary,
      correlationId,
    );
    if ("error" in result) return sendError(reply, result);
    return reply.code(201).send(result);
  });
}
