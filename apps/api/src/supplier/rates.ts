import {
  authorize,
  newId,
  SUPPLIER_EVENT_TYPES,
  SUPPLIER_RATE_STATUSES,
  SUPPLIER_RATE_TYPES,
  type Principal,
  type SupRate,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowSupplierAudit, denySupplierAudit } from "./audit.js";
import { ensureSupplierCollections } from "./collections.js";
import { persistSupEntityAfterCommit } from "../persistence/supplier.js";
import { assertRateWithinSeason } from "./season-bounds.js";

const ISO_CURRENCY_PATTERN = /^[A-Z]{3}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const RATE_CODE_PATTERN = /^[A-Z0-9_-]{2,32}$/;

function sanitizeRate(r: SupRate) {
  return {
    id: r.id,
    supplierId: r.supplierId,
    rateCode: r.rateCode,
    rateName: r.rateName,
    rateType: r.rateType,
    unitDescription: r.unitDescription,
    amount: r.amount,
    currency: r.currency,
    validFrom: r.validFrom,
    validTo: r.validTo,
    seasonLabel: r.seasonLabel,
    seasonId: r.seasonId,
    includesTax: r.includesTax,
    taxPercent: r.taxPercent,
    status: r.status,
    preferredInConflict: Boolean(r.preferredInConflict),
    version: r.version,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

function findSupplier(store: Store, tenantId: string, supplierId: string) {
  return store.supSuppliers.find((s) => s.id === supplierId && s.tenantId === tenantId && !s.archivedAt);
}

function authorizeWrite(store: Store, principal: Principal, supplierId: string, correlationId: string, action: string) {
  const supplier = findSupplier(store, principal.tenantId, supplierId);
  if (!supplier) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "supplier:write:supplier",
    action,
    resource: {
      tenantId: supplier.tenantId,
      type: "supplier",
      id: supplier.id,
      classification: supplier.classification,
    },
  });
  if (decision.result === "deny") {
    denySupplierAudit(store, principal, "supplier:write:supplier", "sup_rate", correlationId, decision.reason, supplierId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  return { supplier };
}

export type CreateRateInput = {
  rateCode: string;
  rateName: string;
  rateType: string;
  amount: number;
  currency: string;
  validFrom: string;
  validTo: string;
  unitDescription?: string;
  seasonLabel?: string;
  seasonId?: string;
  includesTax?: boolean;
  taxPercent?: number;
  status?: string;
  notes?: string;
  preferredInConflict?: boolean;
};

export type UpdateRateInput = {
  rateName?: string;
  rateType?: string;
  amount?: number;
  currency?: string;
  validFrom?: string;
  validTo?: string;
  unitDescription?: string | null;
  seasonLabel?: string | null;
  seasonId?: string | null;
  includesTax?: boolean;
  taxPercent?: number | null;
  status?: string;
  notes?: string | null;
  preferredInConflict?: boolean;
};

export function createSupplierRate(
  store: Store,
  principal: Principal,
  supplierId: string,
  input: CreateRateInput,
  correlationId: string,
) {
  ensureSupplierCollections(store);
  const auth = authorizeWrite(store, principal, supplierId, correlationId, "write:sup_rate");
  if ("error" in auth) return auth;

  const rateCode = (input.rateCode ?? "").trim().toUpperCase();
  if (!RATE_CODE_PATTERN.test(rateCode)) return { error: "invalid_request" as const, reason: "invalid_rate_code" };
  if (!input.rateName?.trim()) return { error: "invalid_request" as const, reason: "rate_name_required" };
  if (!(SUPPLIER_RATE_TYPES as readonly string[]).includes(input.rateType)) {
    return { error: "invalid_request" as const, reason: "invalid_rate_type" };
  }
  if (typeof input.amount !== "number" || Number.isNaN(input.amount) || input.amount < 0) {
    return { error: "invalid_request" as const, reason: "invalid_amount" };
  }
  const currency = (input.currency ?? "").trim().toUpperCase();
  if (!ISO_CURRENCY_PATTERN.test(currency)) return { error: "invalid_request" as const, reason: "invalid_currency" };
  if (!ISO_DATE_PATTERN.test(input.validFrom ?? "") || !ISO_DATE_PATTERN.test(input.validTo ?? "")) {
    return { error: "invalid_request" as const, reason: "invalid_validity_dates" };
  }
  const status = input.status?.trim() || "draft";
  if (!(SUPPLIER_RATE_STATUSES as readonly string[]).includes(status)) {
    return { error: "invalid_request" as const, reason: "invalid_status" };
  }

  const duplicate = store.supRates.some(
    (r) => r.tenantId === principal.tenantId && r.supplierId === supplierId && !r.archivedAt && r.rateCode === rateCode,
  );
  if (duplicate) return { error: "conflict" as const, reason: "rate_code_exists" };

  let seasonLabel = input.seasonLabel?.trim() || undefined;
  let seasonId = input.seasonId?.trim() || undefined;
  if (seasonId) {
    const season = (store.supSeasons ?? []).find(
      (s) => s.id === seasonId && s.tenantId === principal.tenantId && !s.archivedAt,
    );
    if (!season) return { error: "invalid_request" as const, reason: "season_not_found" };
    seasonLabel = season.label;
    const bounds = assertRateWithinSeason(
      { validFrom: input.validFrom, validTo: input.validTo },
      season,
    );
    if (!bounds.ok) return { error: "invalid_request" as const, reason: bounds.error };
  }

  const now = new Date().toISOString();
  const rate: SupRate = {
    id: newId(),
    tenantId: principal.tenantId,
    supplierId,
    rateCode,
    rateName: input.rateName.trim(),
    rateType: input.rateType,
    ...(input.unitDescription?.trim() ? { unitDescription: input.unitDescription.trim() } : {}),
    amount: input.amount,
    currency,
    validFrom: input.validFrom,
    validTo: input.validTo,
    ...(seasonLabel ? { seasonLabel } : {}),
    ...(seasonId ? { seasonId } : {}),
    includesTax: input.includesTax ?? false,
    ...(input.taxPercent !== undefined ? { taxPercent: input.taxPercent } : {}),
    ...(input.notes?.trim() ? { notes: input.notes.trim() } : {}),
    status,
    ...(input.preferredInConflict ? { preferredInConflict: true } : {}),
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };

  store.supRates.push(rate);
  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_rate", rate.id, correlationId, {
    supplierId,
    rateCode: rate.rateCode,
    eventType: SUPPLIER_EVENT_TYPES.RATE_CREATED,
  });
  void persistSupEntityAfterCommit(store.dbPool, store, "supplier_rate", rate.id);
  return { rate: sanitizeRate(rate) };
}

export function updateSupplierRate(
  store: Store,
  principal: Principal,
  supplierId: string,
  rateId: string,
  input: UpdateRateInput,
  correlationId: string,
) {
  ensureSupplierCollections(store);
  const auth = authorizeWrite(store, principal, supplierId, correlationId, "write:sup_rate");
  if ("error" in auth) return auth;

  const rate = store.supRates.find(
    (r) => r.id === rateId && r.supplierId === supplierId && r.tenantId === principal.tenantId && !r.archivedAt,
  );
  if (!rate) return { error: "not_found" as const };

  if (input.rateName !== undefined) {
    if (!input.rateName.trim()) return { error: "invalid_request" as const, reason: "rate_name_required" };
    rate.rateName = input.rateName.trim();
  }
  if (input.rateType !== undefined) {
    if (!(SUPPLIER_RATE_TYPES as readonly string[]).includes(input.rateType)) {
      return { error: "invalid_request" as const, reason: "invalid_rate_type" };
    }
    rate.rateType = input.rateType;
  }
  if (input.amount !== undefined) {
    if (Number.isNaN(input.amount) || input.amount < 0) {
      return { error: "invalid_request" as const, reason: "invalid_amount" };
    }
    rate.amount = input.amount;
  }
  if (input.currency !== undefined) {
    const currency = input.currency.trim().toUpperCase();
    if (!ISO_CURRENCY_PATTERN.test(currency)) return { error: "invalid_request" as const, reason: "invalid_currency" };
    rate.currency = currency;
  }
  if (input.validFrom !== undefined) {
    if (!ISO_DATE_PATTERN.test(input.validFrom)) return { error: "invalid_request" as const, reason: "invalid_validity_dates" };
    rate.validFrom = input.validFrom;
  }
  if (input.validTo !== undefined) {
    if (!ISO_DATE_PATTERN.test(input.validTo)) return { error: "invalid_request" as const, reason: "invalid_validity_dates" };
    rate.validTo = input.validTo;
  }
  if (input.unitDescription !== undefined) {
    if (input.unitDescription === null || input.unitDescription.trim() === "") delete rate.unitDescription;
    else rate.unitDescription = input.unitDescription.trim();
  }
  if (input.seasonLabel !== undefined) {
    if (input.seasonLabel === null || input.seasonLabel.trim() === "") delete rate.seasonLabel;
    else rate.seasonLabel = input.seasonLabel.trim();
  }
  if (input.seasonId !== undefined) {
    if (input.seasonId === null || input.seasonId.trim() === "") {
      delete rate.seasonId;
    } else {
      const season = (store.supSeasons ?? []).find(
        (s) => s.id === input.seasonId && s.tenantId === principal.tenantId && !s.archivedAt,
      );
      if (!season) return { error: "invalid_request" as const, reason: "season_not_found" };
      rate.seasonId = season.id;
      rate.seasonLabel = season.label;
    }
  }
  if (input.includesTax !== undefined) rate.includesTax = input.includesTax;
  if (input.taxPercent !== undefined) {
    if (input.taxPercent === null) delete rate.taxPercent;
    else rate.taxPercent = input.taxPercent;
  }
  if (input.status !== undefined) {
    if (!(SUPPLIER_RATE_STATUSES as readonly string[]).includes(input.status)) {
      return { error: "invalid_request" as const, reason: "invalid_status" };
    }
    rate.status = input.status;
  }
  if (input.notes !== undefined) {
    if (input.notes === null || input.notes.trim() === "") delete rate.notes;
    else rate.notes = input.notes.trim();
  }
  if (input.preferredInConflict !== undefined) {
    rate.preferredInConflict = input.preferredInConflict;
  }

  if (rate.seasonId) {
    const season = (store.supSeasons ?? []).find(
      (s) => s.id === rate.seasonId && s.tenantId === principal.tenantId && !s.archivedAt,
    );
    if (!season) return { error: "invalid_request" as const, reason: "season_not_found" };
    const bounds = assertRateWithinSeason(
      { validFrom: rate.validFrom, validTo: rate.validTo },
      season,
    );
    if (!bounds.ok) return { error: "invalid_request" as const, reason: bounds.error };
  }

  rate.version += 1;
  rate.updatedAt = new Date().toISOString();
  rate.updatedByPrincipalId = principal.id;

  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_rate", rate.id, correlationId, {
    supplierId,
    version: rate.version,
    eventType: SUPPLIER_EVENT_TYPES.RATE_UPDATED,
  });
  void persistSupEntityAfterCommit(store.dbPool, store, "supplier_rate", rate.id);
  return { rate: sanitizeRate(rate) };
}

const ISO_DATE_PATTERN_CAL = /^\d{4}-\d{2}-\d{2}$/;

type HeatmapFilters = {
  unresolvedOnly?: boolean;
  seasonLabel?: string;
  seasonId?: string;
};

function seasonMatchesRate(
  rate: { seasonLabel?: string; seasonId?: string },
  query: HeatmapFilters,
  catalogue: Array<{ id: string; label: string }>,
): boolean {
  if (query.seasonId) {
    if (rate.seasonId === query.seasonId) return true;
    const season = catalogue.find((s) => s.id === query.seasonId);
    if (season && (rate.seasonLabel ?? "").toLowerCase() === season.label.toLowerCase()) return true;
    return false;
  }
  if (query.seasonLabel) {
    return (rate.seasonLabel ?? "").toLowerCase() === query.seasonLabel.trim().toLowerCase();
  }
  return true;
}

function conflictMatchesSeason(
  conflict: { a: { seasonLabel?: string; seasonId?: string }; b: { seasonLabel?: string; seasonId?: string } },
  query: HeatmapFilters,
  catalogue: Array<{ id: string; label: string }>,
): boolean {
  if (!query.seasonId && !query.seasonLabel) return true;
  return seasonMatchesRate(conflict.a, query, catalogue) || seasonMatchesRate(conflict.b, query, catalogue);
}

/** PG.14 — rates overlapping a date window, grouped by season and month. */
export function getSupplierRateCalendar(
  store: Store,
  principal: Principal,
  query: { from: string; to: string; supplierId?: string; seasonLabel?: string; seasonId?: string; unresolvedOnly?: boolean },
) {
  ensureSupplierCollections(store);
  const decision = authorize({
    principal,
    permission: "supplier:read:supplier",
    action: "read:sup_rate_calendar",
  });
  if (decision.result === "deny") {
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (!ISO_DATE_PATTERN_CAL.test(query.from) || !ISO_DATE_PATTERN_CAL.test(query.to)) {
    return { error: "invalid_request" as const, reason: "invalid_date_range" };
  }
  if (query.from > query.to) {
    return { error: "invalid_request" as const, reason: "from_after_to" };
  }

  const catalogue = (store.supSeasons ?? [])
    .filter((s) => s.tenantId === principal.tenantId && !s.archivedAt)
    .map((s) => ({ id: s.id, label: s.label }));
  const windowRates = store.supRates.filter((r) => {
    if (r.tenantId !== principal.tenantId || r.archivedAt) return false;
    if (query.supplierId && r.supplierId !== query.supplierId) return false;
    if (r.validTo < query.from || r.validFrom > query.to) return false;
    return true;
  });
  const overlapping = windowRates.filter((r) => seasonMatchesRate(r, query, catalogue));

  const items = overlapping.map(sanitizeRate);
  const seasonMap = new Map<string, typeof items>();
  for (const rate of items) {
    const label = rate.seasonLabel?.trim() || "Unlabeled";
    const bucket = seasonMap.get(label) ?? [];
    bucket.push(rate);
    seasonMap.set(label, bucket);
  }
  const seasons = [...seasonMap.entries()]
    .map(([label, rates]) => ({ label, count: rates.length, rates }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const monthMap = new Map<string, typeof items>();
  for (const rate of items) {
    const start = rate.validFrom > query.from ? rate.validFrom : query.from;
    const end = rate.validTo < query.to ? rate.validTo : query.to;
    let cursor = start.slice(0, 7);
    const endMonth = end.slice(0, 7);
    while (cursor <= endMonth) {
      const bucket = monthMap.get(cursor) ?? [];
      if (!bucket.some((x) => x.id === rate.id)) bucket.push(rate);
      monthMap.set(cursor, bucket);
      const [y, m] = cursor.split("-").map(Number);
      const next = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
      cursor = next;
    }
  }
  const months = [...monthMap.entries()]
    .map(([month, rates]) => ({ month, count: rates.length, rates }))
    .sort((a, b) => a.month.localeCompare(b.month));

  let conflicts = mapConflictViews(detectRateConflictsAmong(windowRates));
  if (query.unresolvedOnly) conflicts = conflicts.filter((c) => !c.resolved);
  conflicts = conflicts.filter((c) => conflictMatchesSeason(c, query, catalogue));
  const heatmap = buildConflictHeatmap(conflicts, query.from, query.to);
  return {
    from: query.from,
    to: query.to,
    items,
    seasons,
    months,
    conflicts,
    heatmap,
    unresolvedConflictCount: conflicts.filter((c) => !c.resolved).length,
    filters: {
      unresolvedOnly: Boolean(query.unresolvedOnly),
      ...(query.seasonLabel ? { seasonLabel: query.seasonLabel } : {}),
      ...(query.seasonId ? { seasonId: query.seasonId } : {}),
    },
    increment: "PG.25" as const,
  };
}

function datesOverlap(aFrom: string, aTo: string, bFrom: string, bTo: string): boolean {
  return aFrom <= bTo && bFrom <= aTo;
}

function mapConflictViews(
  raw: Array<{
    supplierId: string;
    rateType: string;
    overlapFrom: string;
    overlapTo: string;
    a: import("@sedmc/kernel").SupRate;
    b: import("@sedmc/kernel").SupRate;
  }>,
) {
  return raw.map((c) => {
    const aPref = Boolean(c.a.preferredInConflict);
    const bPref = Boolean(c.b.preferredInConflict);
    const resolved = aPref !== bPref;
    return {
      supplierId: c.supplierId,
      rateType: c.rateType,
      overlapFrom: c.overlapFrom,
      overlapTo: c.overlapTo,
      a: sanitizeRate(c.a),
      b: sanitizeRate(c.b),
      preferredRateId: aPref ? c.a.id : bPref ? c.b.id : null,
      resolved,
    };
  });
}

/** Same supplier + rateType with overlapping validity windows. */
function detectRateConflictsAmong(rates: import("@sedmc/kernel").SupRate[]) {
  const conflicts: Array<{
    supplierId: string;
    rateType: string;
    overlapFrom: string;
    overlapTo: string;
    a: import("@sedmc/kernel").SupRate;
    b: import("@sedmc/kernel").SupRate;
  }> = [];
  for (let i = 0; i < rates.length; i += 1) {
    for (let j = i + 1; j < rates.length; j += 1) {
      const a = rates[i]!;
      const b = rates[j]!;
      if (a.supplierId !== b.supplierId) continue;
      if (a.rateType !== b.rateType) continue;
      if (!datesOverlap(a.validFrom, a.validTo, b.validFrom, b.validTo)) continue;
      const overlapFrom = a.validFrom > b.validFrom ? a.validFrom : b.validFrom;
      const overlapTo = a.validTo < b.validTo ? a.validTo : b.validTo;
      conflicts.push({
        supplierId: a.supplierId,
        rateType: a.rateType,
        overlapFrom,
        overlapTo,
        a,
        b,
      });
    }
  }
  return conflicts;
}

/** PG.15/PG.17 — detect overlapping rate cards (same supplier + rateType). */
export function getSupplierRateConflicts(
  store: Store,
  principal: Principal,
  query: { supplierId?: string; from?: string; to?: string; unresolvedOnly?: boolean; seasonLabel?: string; seasonId?: string } = {},
) {
  ensureSupplierCollections(store);
  const decision = authorize({
    principal,
    permission: "supplier:read:supplier",
    action: "read:sup_rate_conflicts",
  });
  if (decision.result === "deny") {
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (query.from && !ISO_DATE_PATTERN_CAL.test(query.from)) {
    return { error: "invalid_request" as const, reason: "invalid_date_range" };
  }
  if (query.to && !ISO_DATE_PATTERN_CAL.test(query.to)) {
    return { error: "invalid_request" as const, reason: "invalid_date_range" };
  }
  if (query.from && query.to && query.from > query.to) {
    return { error: "invalid_request" as const, reason: "from_after_to" };
  }

  const candidates = store.supRates.filter((r) => {
    if (r.tenantId !== principal.tenantId || r.archivedAt) return false;
    if (query.supplierId && r.supplierId !== query.supplierId) return false;
    if (query.from && query.to && (r.validTo < query.from || r.validFrom > query.to)) return false;
    return true;
  });

  const catalogue = (store.supSeasons ?? [])
    .filter((s) => s.tenantId === principal.tenantId && !s.archivedAt)
    .map((s) => ({ id: s.id, label: s.label }));

  let conflicts = mapConflictViews(detectRateConflictsAmong(candidates));
  if (query.unresolvedOnly) conflicts = conflicts.filter((c) => !c.resolved);
  conflicts = conflicts.filter((c) => conflictMatchesSeason(c, query, catalogue));

  const windowFrom = query.from ?? (conflicts.length ? minDate(conflicts.map((c) => c.overlapFrom)) : undefined);
  const windowTo = query.to ?? (conflicts.length ? maxDate(conflicts.map((c) => c.overlapTo)) : undefined);
  const heatmap =
    windowFrom && windowTo ? buildConflictHeatmap(conflicts, windowFrom, windowTo) : emptyHeatmap();

  return {
    conflicts,
    count: conflicts.length,
    unresolvedCount: conflicts.filter((c) => !c.resolved).length,
    heatmap,
    filters: {
      unresolvedOnly: Boolean(query.unresolvedOnly),
      ...(query.seasonLabel ? { seasonLabel: query.seasonLabel } : {}),
      ...(query.seasonId ? { seasonId: query.seasonId } : {}),
    },
    increment: "PG.25" as const,
  };
}

function minDate(values: string[]): string {
  return values.reduce((min, v) => (v < min ? v : min));
}

function maxDate(values: string[]): string {
  return values.reduce((max, v) => (v > max ? v : max));
}

function emptyHeatmap() {
  return {
    months: [] as Array<{ month: string; conflictCount: number; unresolvedCount: number }>,
    seasons: [] as Array<{ label: string; conflictCount: number; unresolvedCount: number }>,
    cells: [] as Array<{
      month: string;
      seasonLabel: string;
      conflictCount: number;
      unresolvedCount: number;
    }>,
    maxConflictCount: 0,
  };
}

function eachMonth(from: string, to: string): string[] {
  const months: string[] = [];
  let cursor = from.slice(0, 7);
  const endMonth = to.slice(0, 7);
  while (cursor <= endMonth) {
    months.push(cursor);
    const [y, m] = cursor.split("-").map(Number);
    cursor = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
  }
  return months;
}

/** PG.23 — conflict counts by month and season label for calendar heatmap. */
function buildConflictHeatmap(
  conflicts: Array<{
    overlapFrom: string;
    overlapTo: string;
    resolved: boolean;
    a: { seasonLabel?: string };
    b: { seasonLabel?: string };
  }>,
  from: string,
  to: string,
) {
  const monthMap = new Map<string, { conflictCount: number; unresolvedCount: number }>();
  const seasonMap = new Map<string, { conflictCount: number; unresolvedCount: number }>();
  const cellMap = new Map<string, { month: string; seasonLabel: string; conflictCount: number; unresolvedCount: number }>();

  const windowMonths = new Set(eachMonth(from, to));

  for (const conflict of conflicts) {
    const labels = new Set([
      conflict.a.seasonLabel?.trim() || "Unlabeled",
      conflict.b.seasonLabel?.trim() || "Unlabeled",
    ]);
    const months = eachMonth(conflict.overlapFrom, conflict.overlapTo).filter((m) => windowMonths.has(m));
    const unresolvedInc = conflict.resolved ? 0 : 1;

    for (const month of months) {
      const bucket = monthMap.get(month) ?? { conflictCount: 0, unresolvedCount: 0 };
      bucket.conflictCount += 1;
      bucket.unresolvedCount += unresolvedInc;
      monthMap.set(month, bucket);

      for (const label of labels) {
        const season = seasonMap.get(label) ?? { conflictCount: 0, unresolvedCount: 0 };
        season.conflictCount += 1;
        season.unresolvedCount += unresolvedInc;
        seasonMap.set(label, season);

        const key = `${month}|${label}`;
        const cell = cellMap.get(key) ?? { month, seasonLabel: label, conflictCount: 0, unresolvedCount: 0 };
        cell.conflictCount += 1;
        cell.unresolvedCount += unresolvedInc;
        cellMap.set(key, cell);
      }
    }
  }

  const months = [...monthMap.entries()]
    .map(([month, counts]) => ({ month, ...counts }))
    .sort((a, b) => a.month.localeCompare(b.month));
  const seasons = [...seasonMap.entries()]
    .map(([label, counts]) => ({ label, ...counts }))
    .sort((a, b) => a.label.localeCompare(b.label));
  const cells = [...cellMap.values()].sort(
    (a, b) => a.month.localeCompare(b.month) || a.seasonLabel.localeCompare(b.seasonLabel),
  );
  const maxConflictCount = months.reduce((max, m) => Math.max(max, m.conflictCount), 0);

  return { months, seasons, cells, maxConflictCount };
}

/** PG.23 — dedicated heatmap endpoint (same filters as conflicts). */
export function getSupplierRateConflictHeatmap(
  store: Store,
  principal: Principal,
  query: { supplierId?: string; from?: string; to?: string; unresolvedOnly?: boolean; seasonLabel?: string; seasonId?: string } = {},
) {
  const listed = getSupplierRateConflicts(store, principal, query);
  if ("error" in listed) return listed;
  return {
    from: query.from ?? null,
    to: query.to ?? null,
    heatmap: listed.heatmap,
    conflictCount: listed.count,
    unresolvedCount: listed.unresolvedCount,
    filters: listed.filters,
    increment: "PG.25" as const,
  };
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replaceAll("\"", "\"\"")}"`;
  return value;
}

/** PG.25 — CSV/JSON export of heatmap cells (same filters as conflicts). */
export function exportSupplierRateConflictHeatmap(
  store: Store,
  principal: Principal,
  query: {
    supplierId?: string;
    from?: string;
    to?: string;
    unresolvedOnly?: boolean;
    seasonLabel?: string;
    seasonId?: string;
    format?: "json" | "csv";
  } = {},
) {
  const listed = getSupplierRateConflictHeatmap(store, principal, query);
  if ("error" in listed) return listed;

  const generatedAt = new Date().toISOString();
  const format = query.format === "csv" ? "csv" : "json";
  const rows = listed.heatmap.cells.map((cell) => ({
    month: cell.month,
    seasonLabel: cell.seasonLabel,
    conflictCount: cell.conflictCount,
    unresolvedCount: cell.unresolvedCount,
  }));

  if (format === "csv") {
    const header = "month,seasonLabel,conflictCount,unresolvedCount";
    const csv = [
      header,
      ...rows.map((row) =>
        [row.month, row.seasonLabel, String(row.conflictCount), String(row.unresolvedCount)].map(csvEscape).join(","),
      ),
    ].join("\n");
    return {
      format,
      csv,
      count: rows.length,
      conflictCount: listed.conflictCount,
      unresolvedCount: listed.unresolvedCount,
      filters: listed.filters,
      generatedAt,
      increment: "PG.25" as const,
    };
  }

  return {
    format,
    items: rows,
    count: rows.length,
    heatmap: listed.heatmap,
    conflictCount: listed.conflictCount,
    unresolvedCount: listed.unresolvedCount,
    filters: listed.filters,
    generatedAt,
    increment: "PG.25" as const,
  };
}

/**
 * PG.17 — mark one rate as preferred in its conflict set; clear preferred on overlapping peers
 * of the same rateType for that supplier.
 */
export function preferSupplierRate(
  store: Store,
  principal: Principal,
  supplierId: string,
  rateId: string,
  correlationId: string,
) {
  ensureSupplierCollections(store);
  const auth = authorizeWrite(store, principal, supplierId, correlationId, "prefer:sup_rate");
  if ("error" in auth) return auth;

  const rate = store.supRates.find(
    (r) => r.id === rateId && r.supplierId === supplierId && r.tenantId === principal.tenantId && !r.archivedAt,
  );
  if (!rate) return { error: "not_found" as const };

  const peers = store.supRates.filter(
    (r) =>
      r.tenantId === principal.tenantId &&
      !r.archivedAt &&
      r.supplierId === supplierId &&
      r.rateType === rate.rateType &&
      r.id !== rate.id &&
      datesOverlap(rate.validFrom, rate.validTo, r.validFrom, r.validTo),
  );

  rate.preferredInConflict = true;
  rate.version += 1;
  rate.updatedAt = new Date().toISOString();
  rate.updatedByPrincipalId = principal.id;
  void persistSupEntityAfterCommit(store.dbPool, store, "supplier_rate", rate.id);

  let cleared = 0;
  for (const peer of peers) {
    if (peer.preferredInConflict) {
      peer.preferredInConflict = false;
      peer.version += 1;
      peer.updatedAt = rate.updatedAt;
      peer.updatedByPrincipalId = principal.id;
      void persistSupEntityAfterCommit(store.dbPool, store, "supplier_rate", peer.id);
      cleared += 1;
    }
  }

  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_rate", rate.id, correlationId, {
    supplierId,
    preferredInConflict: true,
    clearedPeers: cleared,
    eventType: SUPPLIER_EVENT_TYPES.RATE_UPDATED,
  });

  return {
    rate: sanitizeRate(rate),
    clearedPeers: cleared,
    increment: "PG.21" as const,
  };
}

export function archiveSupplierRate(
  store: Store,
  principal: Principal,
  supplierId: string,
  rateId: string,
  correlationId: string,
) {
  ensureSupplierCollections(store);
  const auth = authorizeWrite(store, principal, supplierId, correlationId, "archive:sup_rate");
  if ("error" in auth) return auth;

  const rate = store.supRates.find(
    (r) => r.id === rateId && r.supplierId === supplierId && r.tenantId === principal.tenantId && !r.archivedAt,
  );
  if (!rate) return { error: "not_found" as const };

  rate.archivedAt = new Date().toISOString();
  rate.version += 1;
  rate.updatedAt = rate.archivedAt;
  rate.updatedByPrincipalId = principal.id;

  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_rate", rate.id, correlationId, {
    supplierId,
    eventType: SUPPLIER_EVENT_TYPES.RATE_ARCHIVED,
  });
  void persistSupEntityAfterCommit(store.dbPool, store, "supplier_rate", rate.id);
  return { rate: sanitizeRate(rate) };
}
