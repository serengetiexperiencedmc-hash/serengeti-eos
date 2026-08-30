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
  getSupplierFacets,
  updateSupplier,
  archiveSupplier,
  restoreSupplier,
} from "./supplier.js";
import { archiveSupplierContact, createSupplierContact, updateSupplierContact } from "./contacts.js";
import { archiveSupplierRate, createSupplierRate, getSupplierRateCalendar, getSupplierRateConflicts, getSupplierRateConflictHeatmap, exportSupplierRateConflictHeatmap, getHeatmapRollupStatus, preferSupplierRate, updateSupplierRate } from "./rates.js";
import {
  archiveSupplierSeason,
  backfillSeasonRates,
  createSupplierSeason,
  exportSupplierSeasons,
  listSupplierSeasons,
  previewSeasonExpandBackfill,
  previewSeasonShrinkImpact,
  reassignOutsideSeasonRates,
  updateSupplierSeason,
} from "./seasons.js";
import {
  archiveSupplierContentBlock,
  createSupplierContentBlock,
  updateSupplierContentBlock,
} from "./content-blocks.js";
import {
  attachContractDocument,
  createContractVersion,
  createSupplierContract,
  getHotelProfile,
  getSupplierContract,
  listSupplierContracts,
  upsertHotelProfile,
} from "./contracts.js";

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

function isPhase1ServiceError(result: object): result is { error: string; reason?: string } {
  return "error" in result && typeof (result as { error?: unknown }).error === "string";
}

export function registerSupplierRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/suppliers/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    void getCorrelationId(req);
    const result = getSupplierModuleHealth(store, principal);
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.get("/v1/suppliers/seasons/export", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { archived?: string; format?: string };
    const result = exportSupplierSeasons(store, principal, {
      ...(query.archived === "1" || query.archived === "true" ? { archived: true } : {}),
      format: query.format === "csv" ? "csv" : "json",
    });
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.get("/v1/suppliers/seasons", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { archived?: string };
    const result = listSupplierSeasons(store, principal, {
      ...(query.archived === "1" || query.archived === "true" ? { archived: true } : {}),
    });
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.post("/v1/suppliers/seasons", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = (req.body ?? {}) as {
      seasonCode?: string;
      label?: string;
      validFrom?: string;
      validTo?: string;
      monthFrom?: number;
      monthTo?: number;
    };
    if (!body.seasonCode || !body.label) {
      return reply.code(400).send({ error: "invalid_request", reason: "season_code_and_label_required" });
    }
    const result = createSupplierSeason(
      store,
      principal,
      {
        seasonCode: body.seasonCode,
        label: body.label,
        ...(body.validFrom !== undefined ? { validFrom: body.validFrom } : {}),
        ...(body.validTo !== undefined ? { validTo: body.validTo } : {}),
        ...(body.monthFrom !== undefined ? { monthFrom: body.monthFrom } : {}),
        ...(body.monthTo !== undefined ? { monthTo: body.monthTo } : {}),
      },
      getCorrelationId(req),
    );
    if ("error" in result) return sendSupplierError(reply, result);
    return reply.code(201).send(result);
  });

  app.post("/v1/suppliers/seasons/:id/impact-preview", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = previewSeasonShrinkImpact(
      store,
      principal,
      (req.params as { id: string }).id,
      (req.body ?? {}) as Parameters<typeof previewSeasonShrinkImpact>[3],
    );
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.post("/v1/suppliers/seasons/:id/reassign-outside-rates", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = (req.body ?? {}) as {
      mode?: "clear" | "move";
      targetSeasonId?: string;
      rateIds?: string[];
    };
    if (body.mode !== "clear" && body.mode !== "move") {
      return reply.code(400).send({ error: "invalid_request", reason: "invalid_mode" });
    }
    const result = reassignOutsideSeasonRates(
      store,
      principal,
      (req.params as { id: string }).id,
      {
        mode: body.mode,
        ...(body.targetSeasonId !== undefined ? { targetSeasonId: body.targetSeasonId } : {}),
        ...(body.rateIds !== undefined ? { rateIds: body.rateIds } : {}),
      },
      getCorrelationId(req),
    );
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.post("/v1/suppliers/seasons/:id/expand-backfill-preview", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = previewSeasonExpandBackfill(
      store,
      principal,
      (req.params as { id: string }).id,
      (req.body ?? {}) as Parameters<typeof previewSeasonExpandBackfill>[3],
    );
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.post("/v1/suppliers/seasons/:id/backfill-rates", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = (req.body ?? {}) as { rateIds?: string[] };
    const result = backfillSeasonRates(
      store,
      principal,
      (req.params as { id: string }).id,
      body,
      getCorrelationId(req),
    );
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.patch("/v1/suppliers/seasons/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = updateSupplierSeason(
      store,
      principal,
      (req.params as { id: string }).id,
      (req.body ?? {}) as Parameters<typeof updateSupplierSeason>[3],
      getCorrelationId(req),
    );
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.delete("/v1/suppliers/seasons/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = archiveSupplierSeason(
      store,
      principal,
      (req.params as { id: string }).id,
      getCorrelationId(req),
    );
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.get("/v1/suppliers/categories", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listSupplierCategories(store, principal);
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.get("/v1/suppliers/facets", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as {
      category?: string;
      status?: string;
      country?: string;
      preferredPartner?: string;
      q?: string;
      archived?: string;
    };
    const result = getSupplierFacets(store, principal, {
      ...(query.category !== undefined ? { category: query.category } : {}),
      ...(query.status !== undefined ? { status: query.status } : {}),
      ...(query.country !== undefined ? { country: query.country } : {}),
      ...(query.preferredPartner === "1" || query.preferredPartner === "true"
        ? { preferredPartner: true }
        : query.preferredPartner === "0" || query.preferredPartner === "false"
          ? { preferredPartner: false }
          : {}),
      ...(query.q !== undefined ? { q: query.q } : {}),
      ...(query.archived === "1" || query.archived === "true" ? { archived: true } : {}),
    });
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.get("/v1/suppliers/rates/calendar", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as {
      from?: string;
      to?: string;
      supplierId?: string;
      seasonLabel?: string;
      seasonId?: string;
      unresolvedOnly?: string;
    };
    if (!query.from || !query.to) {
      return reply.code(400).send({ error: "invalid_request", reason: "from_and_to_required" });
    }
    const result = getSupplierRateCalendar(store, principal, {
      from: query.from,
      to: query.to,
      ...(query.supplierId ? { supplierId: query.supplierId } : {}),
      ...(query.seasonLabel ? { seasonLabel: query.seasonLabel } : {}),
      ...(query.seasonId ? { seasonId: query.seasonId } : {}),
      ...(query.unresolvedOnly === "1" || query.unresolvedOnly === "true" ? { unresolvedOnly: true } : {}),
    });
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.get("/v1/suppliers/rates/conflicts/heatmap/rollup-status", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getHeatmapRollupStatus(store, principal);
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.get("/v1/suppliers/rates/conflicts/heatmap/export", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as {
      supplierId?: string;
      from?: string;
      to?: string;
      unresolvedOnly?: string;
      seasonLabel?: string;
      seasonId?: string;
      format?: string;
      view?: string;
    };
    const result = exportSupplierRateConflictHeatmap(store, principal, {
      ...(query.supplierId ? { supplierId: query.supplierId } : {}),
      ...(query.from ? { from: query.from } : {}),
      ...(query.to ? { to: query.to } : {}),
      ...(query.unresolvedOnly === "1" || query.unresolvedOnly === "true" ? { unresolvedOnly: true } : {}),
      ...(query.seasonLabel ? { seasonLabel: query.seasonLabel } : {}),
      ...(query.seasonId ? { seasonId: query.seasonId } : {}),
      format: query.format === "csv" ? "csv" : "json",
      view: query.view === "suppliers" ? "suppliers" : "cells",
    });
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.get("/v1/suppliers/rates/conflicts/heatmap", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as {
      supplierId?: string;
      from?: string;
      to?: string;
      unresolvedOnly?: string;
      seasonLabel?: string;
      seasonId?: string;
    };
    const result = getSupplierRateConflictHeatmap(store, principal, {
      ...(query.supplierId ? { supplierId: query.supplierId } : {}),
      ...(query.from ? { from: query.from } : {}),
      ...(query.to ? { to: query.to } : {}),
      ...(query.unresolvedOnly === "1" || query.unresolvedOnly === "true" ? { unresolvedOnly: true } : {}),
      ...(query.seasonLabel ? { seasonLabel: query.seasonLabel } : {}),
      ...(query.seasonId ? { seasonId: query.seasonId } : {}),
    });
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.get("/v1/suppliers/rates/conflicts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as {
      supplierId?: string;
      from?: string;
      to?: string;
      unresolvedOnly?: string;
      seasonLabel?: string;
      seasonId?: string;
    };
    const result = getSupplierRateConflicts(store, principal, {
      ...(query.supplierId ? { supplierId: query.supplierId } : {}),
      ...(query.from ? { from: query.from } : {}),
      ...(query.to ? { to: query.to } : {}),
      ...(query.unresolvedOnly === "1" || query.unresolvedOnly === "true" ? { unresolvedOnly: true } : {}),
      ...(query.seasonLabel ? { seasonLabel: query.seasonLabel } : {}),
      ...(query.seasonId ? { seasonId: query.seasonId } : {}),
    });
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
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
    const query = req.query as {
      category?: string;
      status?: string;
      country?: string;
      preferredPartner?: string;
      q?: string;
      archived?: string;
      limit?: string;
      offset?: string;
    };
    const result = listSuppliers(store, principal, {
      ...(query.category !== undefined ? { category: query.category } : {}),
      ...(query.status !== undefined ? { status: query.status } : {}),
      ...(query.country !== undefined ? { country: query.country } : {}),
      ...(query.preferredPartner === "1" || query.preferredPartner === "true"
        ? { preferredPartner: true }
        : query.preferredPartner === "0" || query.preferredPartner === "false"
          ? { preferredPartner: false }
          : {}),
      ...(query.q !== undefined ? { q: query.q } : {}),
      ...(query.archived === "1" || query.archived === "true" ? { archived: true } : {}),
      ...(query.limit ? { limit: Number(query.limit) } : {}),
      ...(query.offset ? { offset: Number(query.offset) } : {}),
    });
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

  app.delete("/v1/suppliers/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = archiveSupplier(store, principal, (req.params as { id: string }).id, correlationId);
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.post("/v1/suppliers/:id/restore", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = restoreSupplier(store, principal, (req.params as { id: string }).id, correlationId);
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

  app.post("/v1/suppliers/:id/rates/:rateId/prefer", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const params = req.params as { id: string; rateId: string };
    const result = preferSupplierRate(store, principal, params.id, params.rateId, correlationId);
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

  app.post("/v1/suppliers/:id/content-blocks", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = createSupplierContentBlock(
      store,
      principal,
      (req.params as { id: string }).id,
      req.body as Parameters<typeof createSupplierContentBlock>[3],
      correlationId,
    );
    if ("error" in result) return sendSupplierError(reply, result);
    return reply.code(201).send(result);
  });

  app.patch("/v1/suppliers/:id/content-blocks/:blockId", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const params = req.params as { id: string; blockId: string };
    const result = updateSupplierContentBlock(
      store,
      principal,
      params.id,
      params.blockId,
      req.body as Parameters<typeof updateSupplierContentBlock>[4],
      correlationId,
    );
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  app.delete("/v1/suppliers/:id/content-blocks/:blockId", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const params = req.params as { id: string; blockId: string };
    const result = archiveSupplierContentBlock(store, principal, params.id, params.blockId, correlationId);
    if ("error" in result) return sendSupplierError(reply, result);
    return result;
  });

  // CD Phase 1 — contracts & hotel profiles
  app.post("/v1/suppliers/:id/contracts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = createSupplierContract(
      store,
      principal,
      (req.params as { id: string }).id,
      (req.body ?? {}) as Parameters<typeof createSupplierContract>[3],
      correlationId,
    );
    if (isPhase1ServiceError(result)) return sendSupplierError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/suppliers/:id/contracts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listSupplierContracts(store, principal, (req.params as { id: string }).id);
    if (isPhase1ServiceError(result)) return sendSupplierError(reply, result);
    return result;
  });

  app.get("/v1/suppliers/:id/contracts/:contractId", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const params = req.params as { id: string; contractId: string };
    const result = getSupplierContract(store, principal, params.id, params.contractId);
    if (isPhase1ServiceError(result)) return sendSupplierError(reply, result);
    return result;
  });

  app.post("/v1/suppliers/:id/contracts/:contractId/versions", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const params = req.params as { id: string; contractId: string };
    const result = createContractVersion(
      store,
      principal,
      params.id,
      params.contractId,
      (req.body ?? {}) as Parameters<typeof createContractVersion>[4],
      correlationId,
    );
    if (isPhase1ServiceError(result)) return sendSupplierError(reply, result);
    return reply.code(201).send(result);
  });

  app.post("/v1/suppliers/:id/contracts/:contractId/documents", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const params = req.params as { id: string; contractId: string };
    const result = await attachContractDocument(
      store,
      principal,
      params.id,
      params.contractId,
      (req.body ?? {}) as Parameters<typeof attachContractDocument>[4],
      correlationId,
    );
    if (isPhase1ServiceError(result)) return sendSupplierError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/suppliers/:id/hotel-profile", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getHotelProfile(store, principal, (req.params as { id: string }).id);
    if (isPhase1ServiceError(result)) return sendSupplierError(reply, result);
    return result;
  });

  app.put("/v1/suppliers/:id/hotel-profile", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = upsertHotelProfile(
      store,
      principal,
      (req.params as { id: string }).id,
      (req.body ?? {}) as Parameters<typeof upsertHotelProfile>[3],
      correlationId,
    );
    if (isPhase1ServiceError(result)) return sendSupplierError(reply, result);
    return result;
  });
}
