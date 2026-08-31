import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import { getCorrelationId } from "../observability.js";
import type { Store } from "../store.js";
import { isHttpErrorResult, sendHttpError } from "../http-error.js";
import {
  completeFieldTask,
  createAssignment,
  createFieldTask,
  createOrUpdateBrief,
  getBriefByBooking,
  getOpsModuleHealth,
  issueOpsBrief,
  listAssignments,
  listFieldTasks,
} from "./field-ops.js";
import {
  addManifestEntry,
  createOrGetManifest,
  getManifestByBooking,
  publishManifest,
} from "./manifests.js";
import {
  generateSupplierConfirmations,
  listSupplierConfirmations,
  transitionSupplierConfirmation,
} from "./supplier-confirmations.js";
import {
  getSyncHealth,
  getSyncPolicy,
  listSyncConflicts,
  pullSyncBundle,
  pushSyncDeltas,
  resolveSyncConflict,
} from "./field-sync.js";
import {
  generateVouchersFromManifest,
  issueAllVouchers,
  issueVoucher,
  listVouchers,
} from "./vouchers.js";
import { listOpsWorkbench } from "./workbench.js";

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

export function registerOpsRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/ops/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getOpsModuleHealth(store, principal);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/ops/workbench", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { attention?: string; status?: string; q?: string };
    const result = listOpsWorkbench(store, principal, query);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/ops/supplier-confirmations", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { bookingId?: string; status?: string };
    const result = listSupplierConfirmations(store, principal, query);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/ops/supplier-confirmations/generate", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { bookingId } = req.body as { bookingId: string };
    const result = generateSupplierConfirmations(store, principal, bookingId, getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.post("/v1/ops/supplier-confirmations/:id/confirm", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = transitionSupplierConfirmation(
      store,
      principal,
      (req.params as { id: string }).id,
      "confirmed",
      req.body as { supplierReference?: string; notes?: string },
      getCorrelationId(req),
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/ops/supplier-confirmations/:id/decline", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = transitionSupplierConfirmation(
      store,
      principal,
      (req.params as { id: string }).id,
      "declined",
      req.body as { notes?: string },
      getCorrelationId(req),
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/ops/manifests/by-booking/:bookingId", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getManifestByBooking(store, principal, (req.params as { bookingId: string }).bookingId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/ops/manifests/by-booking/:bookingId", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = createOrGetManifest(store, principal, (req.params as { bookingId: string }).bookingId, getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.post("/v1/ops/manifests/:id/entries", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = addManifestEntry(
      store,
      principal,
      (req.params as { id: string }).id,
      req.body as Parameters<typeof addManifestEntry>[3],
      getCorrelationId(req),
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.post("/v1/ops/manifests/:id/publish", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = publishManifest(store, principal, (req.params as { id: string }).id, getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/ops/assignments", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { bookingId?: string };
    const result = listAssignments(store, principal, query);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/ops/assignments", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = createAssignment(store, principal, req.body as Parameters<typeof createAssignment>[2], getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/ops/field-tasks", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { bookingId?: string };
    const result = listFieldTasks(store, principal, query);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/ops/field-tasks", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = createFieldTask(store, principal, req.body as Parameters<typeof createFieldTask>[2], getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.post("/v1/ops/field-tasks/:id/complete", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = completeFieldTask(store, principal, (req.params as { id: string }).id, getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/ops/briefs/by-booking/:bookingId", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getBriefByBooking(store, principal, (req.params as { bookingId: string }).bookingId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.put("/v1/ops/briefs/by-booking/:bookingId", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { content } = req.body as { content: string };
    const result = createOrUpdateBrief(store, principal, (req.params as { bookingId: string }).bookingId, content, getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/ops/briefs/by-booking/:bookingId/issue", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = issueOpsBrief(store, principal, (req.params as { bookingId: string }).bookingId, getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/ops/vouchers", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { bookingId?: string; status?: string };
    const result = listVouchers(store, principal, query);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/ops/vouchers/generate", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { bookingId } = req.body as { bookingId: string };
    const result = generateVouchersFromManifest(store, principal, bookingId, getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.post("/v1/ops/vouchers/:id/issue", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = issueVoucher(store, principal, (req.params as { id: string }).id, getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/ops/vouchers/issue-all", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { bookingId } = req.body as { bookingId: string };
    const result = issueAllVouchers(store, principal, bookingId, getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/ops/sync/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    return getSyncHealth(store);
  });

  app.get("/v1/ops/sync/policy", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getSyncPolicy(store, principal);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/ops/sync/pull", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = pullSyncBundle(store, principal, req.body as Parameters<typeof pullSyncBundle>[2]);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/ops/sync/push", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = pushSyncDeltas(store, principal, req.body as Parameters<typeof pushSyncDeltas>[2]);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/ops/sync/conflicts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { bookingId?: string };
    const result = listSyncConflicts(store, principal, query);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/ops/sync/conflicts/:id/resolve", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { resolution } = req.body as { resolution: "server_wins" | "client_wins" };
    const result = resolveSyncConflict(store, principal, (req.params as { id: string }).id, resolution);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });
}
