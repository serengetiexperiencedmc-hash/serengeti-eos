import { authorize, newId, type Principal, type SupSeason } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowSupplierAudit, denySupplierAudit } from "./audit.js";
import { ensureSupplierCollections } from "./collections.js";

const SEASON_CODE_PATTERN = /^[A-Z0-9_-]{2,32}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

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

  return { items, count: items.length, increment: "PG.17" as const };
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
  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_season", season.id, correlationId, {
    seasonCode,
    eventType: "supplier.season.created.v1",
  });
  return { season: sanitizeSeason(season), increment: "PG.17" as const };
}

export function updateSupplierSeason(
  store: Store,
  principal: Principal,
  id: string,
  input: {
    label?: string;
    validFrom?: string | null;
    validTo?: string | null;
    monthFrom?: number | null;
    monthTo?: number | null;
  },
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

  if (input.label !== undefined) {
    const label = input.label.trim();
    if (!label) return { error: "invalid_request" as const, reason: "label_required" };
    season.label = label;
  }
  if (input.validFrom !== undefined) {
    if (input.validFrom === null || input.validFrom === "") delete season.validFrom;
    else if (!ISO_DATE_PATTERN.test(input.validFrom)) {
      return { error: "invalid_request" as const, reason: "invalid_valid_from" };
    } else season.validFrom = input.validFrom;
  }
  if (input.validTo !== undefined) {
    if (input.validTo === null || input.validTo === "") delete season.validTo;
    else if (!ISO_DATE_PATTERN.test(input.validTo)) {
      return { error: "invalid_request" as const, reason: "invalid_valid_to" };
    } else season.validTo = input.validTo;
  }
  if (season.validFrom && season.validTo && season.validFrom > season.validTo) {
    return { error: "invalid_request" as const, reason: "from_after_to" };
  }
  if (input.monthFrom !== undefined) {
    if (input.monthFrom === null) delete season.monthFrom;
    else if (input.monthFrom < 1 || input.monthFrom > 12) {
      return { error: "invalid_request" as const, reason: "invalid_month_from" };
    } else season.monthFrom = input.monthFrom;
  }
  if (input.monthTo !== undefined) {
    if (input.monthTo === null) delete season.monthTo;
    else if (input.monthTo < 1 || input.monthTo > 12) {
      return { error: "invalid_request" as const, reason: "invalid_month_to" };
    } else season.monthTo = input.monthTo;
  }

  season.version += 1;
  season.updatedAt = new Date().toISOString();
  season.updatedByPrincipalId = principal.id;
  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_season", season.id, correlationId, {
    eventType: "supplier.season.updated.v1",
  });
  return { season: sanitizeSeason(season), increment: "PG.17" as const };
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
  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_season", season.id, correlationId, {
    eventType: "supplier.season.archived.v1",
  });
  return { season: sanitizeSeason(season), increment: "PG.17" as const };
}

export function findSeasonLabel(store: Store, tenantId: string, seasonId: string): string | undefined {
  return (store.supSeasons ?? []).find((s) => s.id === seasonId && s.tenantId === tenantId && !s.archivedAt)?.label;
}
