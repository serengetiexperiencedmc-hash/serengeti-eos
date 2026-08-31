import { authorize, newId, SUPPLIER_EVENT_TYPES, type Principal, type SupSeason } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowSupplierAudit, denySupplierAudit } from "./audit.js";
import { ensureSupplierCollections } from "./collections.js";
import { persistSupEntityAfterCommit } from "../persistence/supplier.js";
import { assertRateWithinSeason, buildSeasonExpandBackfill, buildSeasonShrinkImpact, findLinkedRatesOutsideSeasonBounds } from "./season-bounds.js";

const SEASON_CODE_PATTERN = /^[A-Z0-9_-]{2,32}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type SeasonPatchInput = {
  label?: string;
  validFrom?: string | null;
  validTo?: string | null;
  monthFrom?: number | null;
  monthTo?: number | null;
};

function sanitizeSeason(s: SupSeason) {
  return {
    id: s.id,
    seasonCode: s.seasonCode,
    label: s.label,
    validFrom: s.validFrom,
    validTo: s.validTo,
    monthFrom: s.monthFrom,
    monthTo: s.monthTo,
    version: s.version,
    archivedAt: s.archivedAt,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}

function validateSeasonPatch(
  current: Pick<SupSeason, "label" | "validFrom" | "validTo" | "monthFrom" | "monthTo">,
  input: SeasonPatchInput,
):
  | { ok: true; next: Pick<SupSeason, "label" | "validFrom" | "validTo" | "monthFrom" | "monthTo"> }
  | { ok: false; reason: string } {
  const next: Pick<SupSeason, "label" | "validFrom" | "validTo" | "monthFrom" | "monthTo"> = {
    label: current.label,
    ...(current.validFrom ? { validFrom: current.validFrom } : {}),
    ...(current.validTo ? { validTo: current.validTo } : {}),
    ...(current.monthFrom !== undefined ? { monthFrom: current.monthFrom } : {}),
    ...(current.monthTo !== undefined ? { monthTo: current.monthTo } : {}),
  };
  if (input.label !== undefined) {
    const label = input.label.trim();
    if (!label) return { ok: false, reason: "label_required" };
    next.label = label;
  }
  if (input.validFrom !== undefined) {
    if (input.validFrom === null || input.validFrom === "") delete next.validFrom;
    else if (!ISO_DATE_PATTERN.test(input.validFrom)) {
      return { ok: false, reason: "invalid_valid_from" };
    } else next.validFrom = input.validFrom;
  }
  if (input.validTo !== undefined) {
    if (input.validTo === null || input.validTo === "") delete next.validTo;
    else if (!ISO_DATE_PATTERN.test(input.validTo)) {
      return { ok: false, reason: "invalid_valid_to" };
    } else next.validTo = input.validTo;
  }
  if (next.validFrom && next.validTo && next.validFrom > next.validTo) {
    return { ok: false, reason: "from_after_to" };
  }
  if (input.monthFrom !== undefined) {
    if (input.monthFrom === null) delete next.monthFrom;
    else if (input.monthFrom < 1 || input.monthFrom > 12) {
      return { ok: false, reason: "invalid_month_from" };
    } else next.monthFrom = input.monthFrom;
  }
  if (input.monthTo !== undefined) {
    if (input.monthTo === null) delete next.monthTo;
    else if (input.monthTo < 1 || input.monthTo > 12) {
      return { ok: false, reason: "invalid_month_to" };
    } else next.monthTo = input.monthTo;
  }
  return { ok: true, next };
}

export function listSupplierSeasons(
  store: Store,
  principal: Principal,
  query: { archived?: boolean } = {},
) {
  ensureSupplierCollections(store);
  const decision = authorize({
    principal,
    permission: "supplier:read:supplier",
    action: "read:sup_season",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const items = (store.supSeasons ?? [])
    .filter((s) => {
      if (s.tenantId !== principal.tenantId) return false;
      if (query.archived) return Boolean(s.archivedAt);
      return !s.archivedAt;
    })
    .map(sanitizeSeason)
    .sort((a, b) => a.seasonCode.localeCompare(b.seasonCode));

  return { items, count: items.length, increment: "PG.28" as const };
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replaceAll("\"", "\"\"")}"`;
  return value;
}

/** PG.27 — CSV/JSON export of the season catalogue. */
export function exportSupplierSeasons(
  store: Store,
  principal: Principal,
  query: { archived?: boolean; format?: "json" | "csv" } = {},
) {
  const listed = listSupplierSeasons(
    store,
    principal,
    query.archived !== undefined ? { archived: query.archived } : {},
  );
  if ("error" in listed) return listed;
  const generatedAt = new Date().toISOString();
  const format = query.format === "csv" ? "csv" : "json";
  if (format === "csv") {
    const csv = [
      "id,seasonCode,label,validFrom,validTo,monthFrom,monthTo,version,archivedAt,createdAt,updatedAt",
      ...listed.items.map((row) =>
        [
          row.id,
          row.seasonCode,
          row.label,
          row.validFrom ?? "",
          row.validTo ?? "",
          row.monthFrom === undefined ? "" : String(row.monthFrom),
          row.monthTo === undefined ? "" : String(row.monthTo),
          String(row.version),
          row.archivedAt ?? "",
          row.createdAt,
          row.updatedAt,
        ]
          .map(csvEscape)
          .join(","),
      ),
    ].join("\n");
    return { format, csv, items: listed.items, count: listed.count, generatedAt, increment: "PG.28" as const };
  }
  return { format, items: listed.items, count: listed.count, generatedAt, increment: "PG.28" as const };
}

export function createSupplierSeason(
  store: Store,
  principal: Principal,
  input: {
    seasonCode: string;
    label: string;
    validFrom?: string;
    validTo?: string;
    monthFrom?: number;
    monthTo?: number;
  },
  correlationId: string,
) {
  ensureSupplierCollections(store);
  const decision = authorize({
    principal,
    permission: "supplier:write:supplier",
    action: "create:sup_season",
  });
  if (decision.result === "deny") {
    denySupplierAudit(store, principal, "supplier:write:supplier", "sup_season", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const seasonCode = (input.seasonCode ?? "").trim().toUpperCase();
  const label = (input.label ?? "").trim();
  if (!SEASON_CODE_PATTERN.test(seasonCode)) {
    return { error: "invalid_request" as const, reason: "invalid_season_code" };
  }
  if (!label) return { error: "invalid_request" as const, reason: "label_required" };
  if (input.validFrom && !ISO_DATE_PATTERN.test(input.validFrom)) {
    return { error: "invalid_request" as const, reason: "invalid_valid_from" };
  }
  if (input.validTo && !ISO_DATE_PATTERN.test(input.validTo)) {
    return { error: "invalid_request" as const, reason: "invalid_valid_to" };
  }
  if (input.validFrom && input.validTo && input.validFrom > input.validTo) {
    return { error: "invalid_request" as const, reason: "from_after_to" };
  }
  if (input.monthFrom != null && (input.monthFrom < 1 || input.monthFrom > 12)) {
    return { error: "invalid_request" as const, reason: "invalid_month_from" };
  }
  if (input.monthTo != null && (input.monthTo < 1 || input.monthTo > 12)) {
    return { error: "invalid_request" as const, reason: "invalid_month_to" };
  }

  const dup = (store.supSeasons ?? []).find(
    (s) =>
      s.tenantId === principal.tenantId &&
      !s.archivedAt &&
      s.seasonCode.toLowerCase() === seasonCode.toLowerCase(),
  );
  if (dup) return { error: "conflict" as const, reason: "season_code_exists" };

  const now = new Date().toISOString();
  const season: SupSeason = {
    id: newId(),
    tenantId: principal.tenantId,
    seasonCode,
    label,
    ...(input.validFrom ? { validFrom: input.validFrom } : {}),
    ...(input.validTo ? { validTo: input.validTo } : {}),
    ...(input.monthFrom != null ? { monthFrom: input.monthFrom } : {}),
    ...(input.monthTo != null ? { monthTo: input.monthTo } : {}),
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  store.supSeasons.push(season);
  void persistSupEntityAfterCommit(store.dbPool, store, "supplier_season", season.id);
  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_season", season.id, correlationId, {
    seasonCode,
    eventType: "supplier.season.created.v1",
  });
  return { season: sanitizeSeason(season), increment: "PG.28" as const };
}

/** PG.20 — dry-run season shrink impact without mutating. */
export function previewSeasonShrinkImpact(
  store: Store,
  principal: Principal,
  id: string,
  input: SeasonPatchInput,
) {
  ensureSupplierCollections(store);
  const season = (store.supSeasons ?? []).find(
    (s) => s.id === id && s.tenantId === principal.tenantId && !s.archivedAt,
  );
  if (!season) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "supplier:write:supplier",
    action: "update:sup_season",
  });
  if (decision.result === "deny") {
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const validated = validateSeasonPatch(season, input);
  if (!validated.ok) return { error: "invalid_request" as const, reason: validated.reason };

  const proposed = {
    ...sanitizeSeason(season),
    ...validated.next,
  };
  const impact = buildSeasonShrinkImpact(
    store.supRates ?? [],
    { id: season.id, ...validated.next },
    principal.tenantId,
  );
  const expandBackfill = buildSeasonExpandBackfill(
    store.supRates ?? [],
    { id: season.id, ...validated.next },
    principal.tenantId,
  );
  return {
    proposedSeason: proposed,
    impact,
    expandBackfill,
    increment: "PG.22" as const,
  };
}

export function updateSupplierSeason(
  store: Store,
  principal: Principal,
  id: string,
  input: SeasonPatchInput,
  correlationId: string,
) {
  ensureSupplierCollections(store);
  const season = (store.supSeasons ?? []).find(
    (s) => s.id === id && s.tenantId === principal.tenantId && !s.archivedAt,
  );
  if (!season) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "supplier:write:supplier",
    action: "update:sup_season",
  });
  if (decision.result === "deny") {
    denySupplierAudit(store, principal, "supplier:write:supplier", "sup_season", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const validated = validateSeasonPatch(season, input);
  if (!validated.ok) return { error: "invalid_request" as const, reason: validated.reason };

  season.label = validated.next.label;
  if (validated.next.validFrom) season.validFrom = validated.next.validFrom;
  else delete season.validFrom;
  if (validated.next.validTo) season.validTo = validated.next.validTo;
  else delete season.validTo;
  if (validated.next.monthFrom !== undefined) season.monthFrom = validated.next.monthFrom;
  else delete season.monthFrom;
  if (validated.next.monthTo !== undefined) season.monthTo = validated.next.monthTo;
  else delete season.monthTo;

  season.version += 1;
  season.updatedAt = new Date().toISOString();
  season.updatedByPrincipalId = principal.id;
  // PG.20/PG.22 — warn-only shrink impact + expand backfill suggestions.
  const impact = buildSeasonShrinkImpact(store.supRates ?? [], season, principal.tenantId);
  const expandBackfill = buildSeasonExpandBackfill(store.supRates ?? [], season, principal.tenantId);
  void persistSupEntityAfterCommit(store.dbPool, store, "supplier_season", season.id);
  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_season", season.id, correlationId, {
    eventType: "supplier.season.updated.v1",
    outsideCount: impact.outsideCount,
    suggestionCount: expandBackfill.suggestionCount,
  });
  return { season: sanitizeSeason(season), impact, expandBackfill, increment: "PG.28" as const };
}

export function archiveSupplierSeason(
  store: Store,
  principal: Principal,
  id: string,
  correlationId: string,
) {
  ensureSupplierCollections(store);
  const season = (store.supSeasons ?? []).find(
    (s) => s.id === id && s.tenantId === principal.tenantId && !s.archivedAt,
  );
  if (!season) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "supplier:write:supplier",
    action: "archive:sup_season",
  });
  if (decision.result === "deny") {
    denySupplierAudit(store, principal, "supplier:write:supplier", "sup_season", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  season.archivedAt = new Date().toISOString();
  season.version += 1;
  season.updatedAt = season.archivedAt;
  season.updatedByPrincipalId = principal.id;
  void persistSupEntityAfterCommit(store.dbPool, store, "supplier_season", season.id);
  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_season", season.id, correlationId, {
    eventType: "supplier.season.archived.v1",
  });
  return { season: sanitizeSeason(season), increment: "PG.28" as const };
}

/**
 * PG.21 — bulk clear or move rates that fall outside the season’s current bounds.
 * `rateIds` optional; when omitted, all outside linked rates are targeted.
 */
export function reassignOutsideSeasonRates(
  store: Store,
  principal: Principal,
  seasonId: string,
  input: { mode: "clear" | "move"; targetSeasonId?: string; rateIds?: string[] },
  correlationId: string,
) {
  ensureSupplierCollections(store);
  const season = (store.supSeasons ?? []).find(
    (s) => s.id === seasonId && s.tenantId === principal.tenantId && !s.archivedAt,
  );
  if (!season) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "supplier:write:supplier",
    action: "reassign:sup_season_rates",
  });
  if (decision.result === "deny") {
    denySupplierAudit(store, principal, "supplier:write:supplier", "sup_season", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (input.mode !== "clear" && input.mode !== "move") {
    return { error: "invalid_request" as const, reason: "invalid_mode" };
  }

  let target: SupSeason | undefined;
  if (input.mode === "move") {
    const targetId = (input.targetSeasonId ?? "").trim();
    if (!targetId) return { error: "invalid_request" as const, reason: "target_season_required" };
    if (targetId === seasonId) {
      return { error: "invalid_request" as const, reason: "target_same_as_source" };
    }
    target = (store.supSeasons ?? []).find(
      (s) => s.id === targetId && s.tenantId === principal.tenantId && !s.archivedAt,
    );
    if (!target) return { error: "invalid_request" as const, reason: "target_season_not_found" };
  }

  const outside = findLinkedRatesOutsideSeasonBounds(store.supRates ?? [], season, {
    tenantId: principal.tenantId,
    seasonId,
  });
  const wanted = input.rateIds?.length ? new Set(input.rateIds) : null;
  const candidates = wanted ? outside.filter((r) => wanted.has(r.id)) : outside;
  if (wanted) {
    for (const id of wanted) {
      if (!outside.some((r) => r.id === id)) {
        return { error: "invalid_request" as const, reason: "rate_not_outside_bounds", rateId: id };
      }
    }
  }

  const now = new Date().toISOString();
  const updated: Array<{ id: string; rateCode: string; supplierId: string; action: "cleared" | "moved" }> = [];
  const skipped: Array<{ id: string; rateCode: string; reason: string }> = [];

  for (const row of candidates) {
    const rate = (store.supRates ?? []).find((r) => r.id === row.id);
    if (!rate || rate.archivedAt) continue;

    if (input.mode === "clear") {
      delete rate.seasonId;
      rate.version += 1;
      rate.updatedAt = now;
      rate.updatedByPrincipalId = principal.id;
      void persistSupEntityAfterCommit(store.dbPool, store, "supplier_rate", rate.id);
      updated.push({ id: rate.id, rateCode: rate.rateCode, supplierId: rate.supplierId, action: "cleared" });
      continue;
    }

    const bounds = assertRateWithinSeason(
      { validFrom: rate.validFrom, validTo: rate.validTo },
      target!,
    );
    if (!bounds.ok) {
      skipped.push({ id: rate.id, rateCode: rate.rateCode, reason: bounds.error });
      continue;
    }
    rate.seasonId = target!.id;
    rate.seasonLabel = target!.label;
    rate.version += 1;
    rate.updatedAt = now;
    rate.updatedByPrincipalId = principal.id;
    void persistSupEntityAfterCommit(store.dbPool, store, "supplier_rate", rate.id);
    updated.push({ id: rate.id, rateCode: rate.rateCode, supplierId: rate.supplierId, action: "moved" });
  }

  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_season", season.id, correlationId, {
    eventType: SUPPLIER_EVENT_TYPES.RATE_UPDATED,
    mode: input.mode,
    updatedCount: updated.length,
    skippedCount: skipped.length,
    ...(target ? { targetSeasonId: target.id } : {}),
  });

  const remainingImpact = buildSeasonShrinkImpact(store.supRates ?? [], season, principal.tenantId);
  return {
    mode: input.mode,
    updated,
    skipped,
    updatedCount: updated.length,
    skippedCount: skipped.length,
    remainingImpact,
    increment: "PG.21" as const,
  };
}

/** PG.22 — dry-run: unlinked rates that fit proposed (or current) season bounds. */
export function previewSeasonExpandBackfill(
  store: Store,
  principal: Principal,
  id: string,
  input: SeasonPatchInput = {},
) {
  ensureSupplierCollections(store);
  const season = (store.supSeasons ?? []).find(
    (s) => s.id === id && s.tenantId === principal.tenantId && !s.archivedAt,
  );
  if (!season) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "supplier:write:supplier",
    action: "update:sup_season",
  });
  if (decision.result === "deny") {
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const validated = validateSeasonPatch(season, input);
  if (!validated.ok) return { error: "invalid_request" as const, reason: validated.reason };

  const proposed = {
    ...sanitizeSeason(season),
    ...validated.next,
  };
  const expandBackfill = buildSeasonExpandBackfill(
    store.supRates ?? [],
    { id: season.id, ...validated.next },
    principal.tenantId,
  );
  return {
    proposedSeason: proposed,
    expandBackfill,
    increment: "PG.22" as const,
  };
}

/** PG.22 — link unlinked rates that fit this season (optional rateIds subset). */
export function backfillSeasonRates(
  store: Store,
  principal: Principal,
  seasonId: string,
  input: { rateIds?: string[] } = {},
  correlationId: string,
) {
  ensureSupplierCollections(store);
  const season = (store.supSeasons ?? []).find(
    (s) => s.id === seasonId && s.tenantId === principal.tenantId && !s.archivedAt,
  );
  if (!season) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "supplier:write:supplier",
    action: "backfill:sup_season_rates",
  });
  if (decision.result === "deny") {
    denySupplierAudit(store, principal, "supplier:write:supplier", "sup_season", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const suggestions = buildSeasonExpandBackfill(store.supRates ?? [], season, principal.tenantId).suggestions;
  const wanted = input.rateIds?.length ? new Set(input.rateIds) : null;
  const candidates = wanted ? suggestions.filter((s) => wanted.has(s.id)) : suggestions;
  if (wanted) {
    for (const id of wanted) {
      if (!suggestions.some((s) => s.id === id)) {
        return { error: "invalid_request" as const, reason: "rate_not_backfill_candidate", rateId: id };
      }
    }
  }

  const now = new Date().toISOString();
  const linked: Array<{ id: string; rateCode: string; supplierId: string }> = [];
  for (const row of candidates) {
    const rate = (store.supRates ?? []).find((r) => r.id === row.id);
    if (!rate || rate.archivedAt || rate.seasonId) continue;
    rate.seasonId = season.id;
    rate.seasonLabel = season.label;
    rate.version += 1;
    rate.updatedAt = now;
    rate.updatedByPrincipalId = principal.id;
    void persistSupEntityAfterCommit(store.dbPool, store, "supplier_rate", rate.id);
    linked.push({ id: rate.id, rateCode: rate.rateCode, supplierId: rate.supplierId });
  }

  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_season", season.id, correlationId, {
    eventType: SUPPLIER_EVENT_TYPES.RATE_UPDATED,
    backfilledCount: linked.length,
  });

  const expandBackfill = buildSeasonExpandBackfill(store.supRates ?? [], season, principal.tenantId);
  return {
    linked,
    linkedCount: linked.length,
    expandBackfill,
    increment: "PG.22" as const,
  };
}

export function findSeasonLabel(store: Store, tenantId: string, seasonId: string): string | undefined {
  return (store.supSeasons ?? []).find((s) => s.id === seasonId && s.tenantId === tenantId && !s.archivedAt)?.label;
}
