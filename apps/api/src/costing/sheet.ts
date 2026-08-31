import {
  authorize,
  buildCostSheetCode,
  canTransitionRfpStage,
  computeCostTotals,
  computeLineTotal,
  COST_LINE_CATEGORY_LABELS,
  isValidCostLineCategory,
  marginMeetsFloor,
  newId,
  type CostLineCategory,
  type CostLineItem,
  type CostSheet,
  type CostSheetVersion,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowCostingAudit, denyCostingAudit } from "./audit.js";
import { ensureCostingCollections } from "./collections.js";

function findSheet(store: Store, tenantId: string, id: string): CostSheet | undefined {
  return store.costSheets.find((s) => s.id === id && s.tenantId === tenantId && !s.archivedAt);
}

function findSheetByProgramme(store: Store, tenantId: string, programmeId: string): CostSheet | undefined {
  return store.costSheets.find(
    (s) => s.programmeId === programmeId && s.tenantId === tenantId && !s.archivedAt,
  );
}

function recalculateSheet(store: Store, sheet: CostSheet): void {
  const lines = store.costLineItems.filter((l) => l.costSheetId === sheet.id && l.tenantId === sheet.tenantId);
  const totals = computeCostTotals({
    lines: lines.map((l) => ({ category: l.category, lineTotal: l.lineTotal })),
    ...(sheet.markupPercent !== undefined ? { markupPercent: sheet.markupPercent } : {}),
    ...(sheet.sellPrice !== undefined ? { sellPriceOverride: sheet.sellPrice } : {}),
    ...(sheet.paxCount !== undefined ? { paxCount: sheet.paxCount } : {}),
  });
  sheet.totalCost = totals.totalCost;
  sheet.marginPercent = totals.marginPercent;
  sheet.marginAmount = totals.marginAmount;
  if (totals.perPerson !== undefined) sheet.perPerson = totals.perPerson;
}

function sanitizeLine(l: CostLineItem) {
  return {
    id: l.id,
    category: l.category,
    categoryLabel: COST_LINE_CATEGORY_LABELS[l.category],
    description: l.description,
    quantity: l.quantity,
    unitCost: l.unitCost,
    currency: l.currency,
    lineTotal: l.lineTotal,
    supplierId: l.supplierId,
    supplierRateId: l.supplierRateId,
    sortOrder: l.sortOrder,
  };
}

function sanitizeSheet(s: CostSheet, categoryTotals: Record<CostLineCategory, number>) {
  return {
    id: s.id,
    sheetCode: s.sheetCode,
    programmeId: s.programmeId,
    rfpId: s.rfpId,
    opportunityId: s.opportunityId,
    organizationId: s.organizationId,
    status: s.status,
    currency: s.currency,
    markupPercent: s.markupPercent,
    sellPrice: s.sellPrice,
    marginFloorPercent: s.marginFloorPercent,
    totalCost: s.totalCost,
    marginPercent: s.marginPercent,
    marginAmount: s.marginAmount,
    perPerson: s.perPerson,
    paxCount: s.paxCount,
    marginMeetsFloor: marginMeetsFloor(s.marginPercent, s.marginFloorPercent),
    currentVersion: s.currentVersion,
    categoryTotals,
    classification: s.classification,
    version: s.version,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}

function sanitizeVersion(v: CostSheetVersion) {
  return {
    id: v.id,
    costSheetId: v.costSheetId,
    versionNumber: v.versionNumber,
    summary: v.summary,
    totalCost: v.totalCost,
    sellPrice: v.sellPrice,
    marginPercent: v.marginPercent,
    lineCount: v.lineCount,
    createdAt: v.createdAt,
    createdByPrincipalId: v.createdByPrincipalId,
  };
}

function sheetDetail(store: Store, sheet: CostSheet) {
  recalculateSheet(store, sheet);
  const lines = store.costLineItems
    .filter((l) => l.costSheetId === sheet.id && l.tenantId === sheet.tenantId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const totals = computeCostTotals({
    lines: lines.map((l) => ({ category: l.category, lineTotal: l.lineTotal })),
    ...(sheet.markupPercent !== undefined ? { markupPercent: sheet.markupPercent } : {}),
    ...(sheet.sellPrice !== undefined ? { sellPriceOverride: sheet.sellPrice } : {}),
    ...(sheet.paxCount !== undefined ? { paxCount: sheet.paxCount } : {}),
  });
  return {
    sheet: sanitizeSheet(sheet, totals.categoryTotals),
    lineItems: lines.map(sanitizeLine),
  };
}

export function getCostingModuleHealth(store: Store, principal: Principal) {
  ensureCostingCollections(store);
  const decision = authorize({
    principal,
    permission: "costing:read:sheet",
    action: "read:cost_sheet",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const tenantId = principal.tenantId;
  const sheets = store.costSheets.filter((s) => s.tenantId === tenantId && !s.archivedAt);
  const sheetIds = new Set(sheets.map((s) => s.id));
  return {
    module: "costing",
    increment: "C6",
    status: "ok" as const,
    sheets: sheets.length,
    lineItems: store.costLineItems.filter((l) => l.tenantId === tenantId && sheetIds.has(l.costSheetId)).length,
    versions: store.costSheetVersions.filter((v) => v.tenantId === tenantId && sheetIds.has(v.costSheetId)).length,
  };
}

export function listCostSheets(
  store: Store,
  principal: Principal,
  query?: { programmeId?: string; rfpId?: string },
) {
  ensureCostingCollections(store);
  const decision = authorize({
    principal,
    permission: "costing:read:sheet",
    action: "read:cost_sheet",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = store.costSheets.filter((s) => s.tenantId === principal.tenantId && !s.archivedAt);
  if (query?.programmeId) items = items.filter((s) => s.programmeId === query.programmeId);
  if (query?.rfpId) items = items.filter((s) => s.rfpId === query.rfpId);
  items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return {
    items: items.map((s) => {
      recalculateSheet(store, s);
      const lines = store.costLineItems.filter((l) => l.costSheetId === s.id);
      const totals = computeCostTotals({
        lines: lines.map((l) => ({ category: l.category, lineTotal: l.lineTotal })),
        ...(s.markupPercent !== undefined ? { markupPercent: s.markupPercent } : {}),
        ...(s.sellPrice !== undefined ? { sellPriceOverride: s.sellPrice } : {}),
        ...(s.paxCount !== undefined ? { paxCount: s.paxCount } : {}),
      });
      return sanitizeSheet(s, totals.categoryTotals);
    }),
  };
}

export function getCostSheet(store: Store, principal: Principal, id: string) {
  ensureCostingCollections(store);
  const sheet = findSheet(store, principal.tenantId, id);
  if (!sheet) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "costing:read:sheet",
    action: "read:cost_sheet",
    resource: { tenantId: sheet.tenantId, type: "cost_sheet", id: sheet.id, classification: sheet.classification },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const versions = store.costSheetVersions
    .filter((v) => v.costSheetId === id && v.tenantId === sheet.tenantId)
    .sort((a, b) => b.versionNumber - a.versionNumber)
    .map(sanitizeVersion);

  return { ...sheetDetail(store, sheet), versions };
}

export function getCostSheetByProgramme(store: Store, principal: Principal, programmeId: string) {
  ensureCostingCollections(store);
  const sheet = findSheetByProgramme(store, principal.tenantId, programmeId);
  if (!sheet) return { error: "not_found" as const };
  return getCostSheet(store, principal, sheet.id);
}

export type CreateCostSheetInput = {
  programmeId: string;
  currency?: string;
  markupPercent?: number;
  sellPrice?: number;
  marginFloorPercent?: number;
  paxCount?: number;
  lineItems?: Array<{
    category: string;
    description: string;
    quantity?: number;
    unitCost: number;
    currency?: string;
    supplierId?: string;
    supplierRateId?: string;
  }>;
};

export function createCostSheet(
  store: Store,
  principal: Principal,
  input: CreateCostSheetInput,
  correlationId: string,
) {
  ensureCostingCollections(store);
  const decision = authorize({
    principal,
    permission: "costing:write:sheet",
    action: "create:cost_sheet",
  });
  if (decision.result === "deny") {
    denyCostingAudit(store, principal, "costing:write:sheet", "cost_sheet", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const programme = store.prgProgrammes.find(
    (p) => p.id === input.programmeId && p.tenantId === principal.tenantId && !p.archivedAt,
  );
  if (!programme) return { error: "invalid_request" as const, reason: "invalid_programme" };
  if (findSheetByProgramme(store, principal.tenantId, input.programmeId)) {
    return { error: "conflict" as const, reason: "cost_sheet_exists_for_programme" };
  }

  const sheetCode = buildCostSheetCode(programme.programmeCode);
  if (store.costSheets.some((s) => s.tenantId === principal.tenantId && s.sheetCode === sheetCode)) {
    return { error: "conflict" as const, reason: "duplicate_sheet_code" };
  }

  const now = new Date().toISOString();
  const sheet: CostSheet = {
    id: newId(),
    tenantId: principal.tenantId,
    sheetCode,
    programmeId: programme.id,
    rfpId: programme.rfpId,
    opportunityId: programme.opportunityId,
    organizationId: programme.organizationId,
    status: "draft",
    currency: input.currency ?? "USD",
    ...(input.markupPercent !== undefined ? { markupPercent: input.markupPercent } : {}),
    ...(input.sellPrice !== undefined ? { sellPrice: input.sellPrice } : {}),
    marginFloorPercent: input.marginFloorPercent ?? 20,
    totalCost: 0,
    marginPercent: 0,
    marginAmount: 0,
    ...((): object => {
      const paxCount = input.paxCount ?? programme.paxCount;
      return paxCount !== undefined ? { paxCount } : {};
    })(),
    currentVersion: 1,
    classification: programme.classification,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  store.costSheets.push(sheet);

  if (input.lineItems?.length) {
    for (const [idx, lineInput] of input.lineItems.entries()) {
      if (!isValidCostLineCategory(lineInput.category)) {
        return { error: "invalid_request" as const, reason: "invalid_line_category" };
      }
      const quantity = lineInput.quantity ?? 1;
      const line: CostLineItem = {
        id: newId(),
        tenantId: principal.tenantId,
        costSheetId: sheet.id,
        category: lineInput.category,
        description: lineInput.description.trim(),
        quantity,
        unitCost: lineInput.unitCost,
        currency: lineInput.currency ?? sheet.currency,
        lineTotal: computeLineTotal(quantity, lineInput.unitCost),
        ...(lineInput.supplierId !== undefined ? { supplierId: lineInput.supplierId } : {}),
        ...(lineInput.supplierRateId !== undefined ? { supplierRateId: lineInput.supplierRateId } : {}),
        sortOrder: idx,
        createdAt: now,
        updatedAt: now,
      };
      store.costLineItems.push(line);
    }
  }

  recalculateSheet(store, sheet);
  sheet.updatedAt = now;

  const rfp = store.rfpRfps.find((r) => r.id === programme.rfpId);
  if (rfp && rfp.workflowStage === "programme" && canTransitionRfpStage("programme", "costing")) {
    rfp.workflowStage = "costing";
    rfp.updatedAt = now;
    rfp.version += 1;
    rfp.updatedByPrincipalId = principal.id;
  }

  const version: CostSheetVersion = {
    id: newId(),
    tenantId: principal.tenantId,
    costSheetId: sheet.id,
    versionNumber: 1,
    summary: "Initial cost sheet",
    totalCost: sheet.totalCost,
    sellPrice: sheet.sellPrice ?? sheet.totalCost,
    marginPercent: sheet.marginPercent,
    lineCount: store.costLineItems.filter((l) => l.costSheetId === sheet.id).length,
    createdAt: now,
    createdByPrincipalId: principal.id,
  };
  store.costSheetVersions.push(version);

  allowCostingAudit(store, principal, "costing:write:sheet", "cost_sheet", sheet.id, correlationId, sheet);
  return sheetDetail(store, sheet);
}

export type AddCostLineItemInput = {
  category: string;
  description: string;
  quantity?: number;
  unitCost: number;
  currency?: string;
  supplierId?: string;
  supplierRateId?: string;
};

export function addCostLineItem(
  store: Store,
  principal: Principal,
  sheetId: string,
  input: AddCostLineItemInput,
  correlationId: string,
) {
  ensureCostingCollections(store);
  const sheet = findSheet(store, principal.tenantId, sheetId);
  if (!sheet) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "costing:write:line_item",
    action: "create:cost_line_item",
    resource: { tenantId: sheet.tenantId, type: "cost_sheet", id: sheet.id, classification: sheet.classification },
  });
  if (decision.result === "deny") {
    denyCostingAudit(store, principal, "costing:write:line_item", "cost_line_item", correlationId, decision.reason, sheetId);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (!isValidCostLineCategory(input.category)) {
    return { error: "invalid_request" as const, reason: "invalid_line_category" };
  }
  if (!input.description?.trim()) return { error: "invalid_request" as const, reason: "description_required" };

  const now = new Date().toISOString();
  const quantity = input.quantity ?? 1;
  const sortOrder = store.costLineItems.filter((l) => l.costSheetId === sheetId).length;
  const line: CostLineItem = {
    id: newId(),
    tenantId: principal.tenantId,
    costSheetId: sheetId,
    category: input.category,
    description: input.description.trim(),
    quantity,
    unitCost: input.unitCost,
    currency: input.currency ?? sheet.currency,
    lineTotal: computeLineTotal(quantity, input.unitCost),
    ...(input.supplierId !== undefined ? { supplierId: input.supplierId } : {}),
    ...(input.supplierRateId !== undefined ? { supplierRateId: input.supplierRateId } : {}),
    sortOrder,
    createdAt: now,
    updatedAt: now,
  };
  store.costLineItems.push(line);
  recalculateSheet(store, sheet);
  sheet.updatedAt = now;
  sheet.version += 1;
  sheet.updatedByPrincipalId = principal.id;

  allowCostingAudit(store, principal, "costing:write:line_item", "cost_line_item", line.id, correlationId, sanitizeLine(line));
  return { line: sanitizeLine(line), sheet: sheetDetail(store, sheet).sheet };
}

export function recalculateCostSheet(
  store: Store,
  principal: Principal,
  sheetId: string,
  correlationId: string,
  updates?: { markupPercent?: number; sellPrice?: number },
) {
  ensureCostingCollections(store);
  const sheet = findSheet(store, principal.tenantId, sheetId);
  if (!sheet) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "costing:write:sheet",
    action: "recalculate:cost_sheet",
    resource: { tenantId: sheet.tenantId, type: "cost_sheet", id: sheet.id, classification: sheet.classification },
  });
  if (decision.result === "deny") {
    denyCostingAudit(store, principal, "costing:write:sheet", "cost_sheet", correlationId, decision.reason, sheetId);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const now = new Date().toISOString();
  if (updates?.markupPercent !== undefined) sheet.markupPercent = updates.markupPercent;
  if (updates?.sellPrice !== undefined) sheet.sellPrice = updates.sellPrice;
  recalculateSheet(store, sheet);
  sheet.updatedAt = now;
  sheet.version += 1;
  sheet.updatedByPrincipalId = principal.id;

  allowCostingAudit(store, principal, "costing:write:sheet", "cost_sheet", sheet.id, correlationId, {
    totalCost: sheet.totalCost,
    sellPrice: sheet.sellPrice,
    marginPercent: sheet.marginPercent,
  });
  return sheetDetail(store, sheet);
}

export function createCostSheetVersion(
  store: Store,
  principal: Principal,
  sheetId: string,
  summary: string,
  correlationId: string,
) {
  ensureCostingCollections(store);
  const sheet = findSheet(store, principal.tenantId, sheetId);
  if (!sheet) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "costing:write:version",
    action: "create:cost_sheet_version",
    resource: { tenantId: sheet.tenantId, type: "cost_sheet", id: sheet.id, classification: sheet.classification },
  });
  if (decision.result === "deny") {
    denyCostingAudit(store, principal, "costing:write:version", "cost_sheet_version", correlationId, decision.reason, sheetId);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (!summary?.trim()) return { error: "invalid_request" as const, reason: "summary_required" };

  const now = new Date().toISOString();
  recalculateSheet(store, sheet);
  const versionNumber = sheet.currentVersion + 1;
  const lineCount = store.costLineItems.filter((l) => l.costSheetId === sheetId).length;
  const version: CostSheetVersion = {
    id: newId(),
    tenantId: principal.tenantId,
    costSheetId: sheet.id,
    versionNumber,
    summary: summary.trim(),
    totalCost: sheet.totalCost,
    sellPrice: sheet.sellPrice ?? sheet.totalCost,
    marginPercent: sheet.marginPercent,
    lineCount,
    createdAt: now,
    createdByPrincipalId: principal.id,
  };
  store.costSheetVersions.push(version);
  sheet.currentVersion = versionNumber;
  sheet.updatedAt = now;
  sheet.version += 1;

  allowCostingAudit(store, principal, "costing:write:version", "cost_sheet_version", version.id, correlationId, version);
  return { version, sheet: sheetDetail(store, sheet).sheet };
}
