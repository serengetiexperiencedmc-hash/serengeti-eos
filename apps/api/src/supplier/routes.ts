import type { FastifyInstance } from "fastify";
import type { Store } from "../store.js";
import { principalFromAuthHeader } from "../app.js";
import { getCorrelationId } from "../observability.js";
import {
  createSupplierImportBatch,
  executeSupplierImportBatch,
  getSupplierImportBatch,
  validateSupplierImportBatch,
} from "./import.js";
import {
  createSupplier,
  getSupplier,
  getSupplierModuleHealth,
  listSupplierCategories,
  listSuppliers,
  updateSupplier,
} from "./supplier.js";
import { archiveSupplierContact, createSupplierContact, updateSupplierContact } from "./contacts.js";
import { archiveSupplierRate, createSupplierRate, updateSupplierRate } from "./rates.js";

function sendSupplierError(
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

export function registerSupplierRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/suppliers/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    void getCorrelationId(req);
    return getSupplierModuleHealth(store);
  });

  app.get("/v1/suppliers/categories", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    return listSupplierCategories();
  });

  app.post("/v1/suppliers/imports", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = createSupplierImportBatch(
      store,
      principal,
      req.body as Parameters<typeof createSupplierImportBatch>[2],
      correlationId,
    );
    if ("error" in result) return sendSupplierError(reply, result);
    return reply.code(201).send(result);
  });

  app.post("/v1/suppliers/imports/:id/validate", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = validateSupplierImportBatch(store, principal, (req.params as { id: string }).id, correlationId);
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.get("/v1/suppliers/imports/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getSupplierImportBatch(store, principal, (req.params as { id: string }).id);
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.post("/v1/suppliers/imports/:id/execute", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const idempotencyKey = req.headers["idempotency-key"];
    const result = executeSupplierImportBatch(
      store,
      principal,
      (req.params as { id: string }).id,
      correlationId,
      typeof idempotencyKey === "string" ? idempotencyKey : undefined,
    );
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.get("/v1/suppliers", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { category?: string; status?: string; q?: string };
    const result = listSuppliers(store, principal, query);
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.post("/v1/suppliers", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = createSupplier(
      store,
      principal,
      req.body as Parameters<typeof createSupplier>[2],
      correlationId,
    );
    if ("error" in result) return sendSupplierError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/suppliers/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getSupplier(store, principal, (req.params as { id: string }).id);
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.patch("/v1/suppliers/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = updateSupplier(
      store,
      principal,
      (req.params as { id: string }).id,
      req.body as Parameters<typeof updateSupplier>[3],
      correlationId,
    );
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.post("/v1/suppliers/:id/contacts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = createSupplierContact(
      store,
      principal,
      (req.params as { id: string }).id,
      req.body as Parameters<typeof createSupplierContact>[3],
      correlationId,
    );
    if ("error" in result) return sendSupplierError(reply, result);
    return reply.code(201).send(result);
  });

  app.patch("/v1/suppliers/:id/contacts/:contactId", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const params = req.params as { id: string; contactId: string };
    const result = updateSupplierContact(
      store,
      principal,
      params.id,
      params.contactId,
      req.body as Parameters<typeof updateSupplierContact>[4],
      correlationId,
    );
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.delete("/v1/suppliers/:id/contacts/:contactId", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const params = req.params as { id: string; contactId: string };
    const result = archiveSupplierContact(store, principal, params.id, params.contactId, correlationId);
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.post("/v1/suppliers/:id/rates", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = createSupplierRate(
      store,
      principal,
      (req.params as { id: string }).id,
      req.body as Parameters<typeof createSupplierRate>[3],
      correlationId,
    );
    if ("error" in result) return sendSupplierError(reply, result);
    return reply.code(201).send(result);
  });

  app.patch("/v1/suppliers/:id/rates/:rateId", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const params = req.params as { id: string; rateId: string };
    const result = updateSupplierRate(
      store,
      principal,
      params.id,
      params.rateId,
      req.body as Parameters<typeof updateSupplierRate>[4],
      correlationId,
    );
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.delete("/v1/suppliers/:id/rates/:rateId", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const params = req.params as { id: string; rateId: string };
    const result = archiveSupplierRate(store, principal, params.id, params.rateId, correlationId);
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });
}
