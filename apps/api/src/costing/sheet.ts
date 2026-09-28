import {
  authorize,
  buildCostSheetCode,
  canTransitionRfpStage,
  computeLineTotal,
  COST_LINE_CATEGORY_LABELS,
  COSTING_EVENT_TYPES,
  isValidCostLineCategory,
  marginMeetsFloor,
  newId,
  programmeFinancialSummaryFromTotals,
  type CostLineCategory,
  type CostLineItem,
  type CostSheet,
  type CostSheetVersion,
  type Principal,
} from "@sedmc/kernel";
import {
  composeH203ClientPrice,
  H203_APPROVED_MARGIN_FLOOR_PERCENT,
  H203_DEFAULT_MARKUP_PERCENT,
  h203MarginMeetsApprovedFloor,
  principalMayAuthorizeMarginFloorException,
  resolveH203FileFeeAmount,
  toClientFacingCommercialView,
  type H203PriceComposition,
} from "@sedmc/kernel/h203-commercial-policy";
import type { Store } from "../store.js";
import { allowCostingAudit, denyCostingAudit } from "./audit.js";
import { rejectPersonDomainContent } from "../personal-data-content-contract.js";
import { ensureCostingCollections } from "./collections.js";
import {
  allowAuditRecord,
  denyAuditRecord,
  insertChainedAudit,
  insertDomainOutbox,
  isMixedSqlDurable,
  isUniqueViolation,
  OptimisticConcurrencyError,
  persistDenyAudit,
  rememberPostCommit,
  runDurableTx,
} from "../persistence/durable.js";
import {
  countCostSheets,
  countLinesForSheet,
  getCostSheetById,
  getCostSheetByProgrammeId,
  insertCostLineItem,
  insertCostSheet,
  insertCostSheetVersion,
  listCostLineItems,
  listCostSheetsByTenant,
  listCostSheetVersions,
  sheetCodeExists,
  updateCostSheetOptimistic,
} from "../persistence/costing-repository.js";
import { getProgrammeById, getProgrammeItem } from "../persistence/programme-repository.js";
import { loadRfp, persistRfpStageAdvanceInTx } from "../rfp/rfp.js";

function compositionInput(sheet: CostSheet, lines: CostLineItem[]) {
  return {
    lines: lines.map((l) => ({ category: l.category, lineTotal: l.lineTotal })),
    currency: sheet.currency,
    ...(sheet.markupPercent !== undefined ? { markupPercent: sheet.markupPercent } : {}),
    ...(sheet.sellPrice !== undefined ? { sellPriceOverride: sheet.sellPrice } : {}),
    ...(sheet.paxCount !== undefined ? { paxCount: sheet.paxCount } : {}),
    ...(sheet.fileFeeAmount !== undefined ? { fileFeeAmount: sheet.fileFeeAmount } : {}),
    ...(sheet.taxMode !== undefined ? { taxMode: sheet.taxMode } : {}),
    ...(sheet.taxRatePercent !== undefined ? { taxRatePercent: sheet.taxRatePercent } : {}),
    ...(sheet.taxMode === "amount" && sheet.taxAmount !== undefined ? { taxAmountEntered: sheet.taxAmount } : {}),
  };
}

function applyTotals(sheet: CostSheet, lines: CostLineItem[]): H203PriceComposition {
  const composed = composeH203ClientPrice(compositionInput(sheet, lines));
  sheet.totalCost = composed.totalCost;
  sheet.marginPercent = composed.marginPercent;
  sheet.marginAmount = composed.marginAmount;
  sheet.taxAmount = composed.taxAmount;
  if (composed.markupPercentApplied !== undefined && sheet.markupPercent === undefined && sheet.sellPrice === undefined) {
    sheet.markupPercent = composed.markupPercentApplied;
  }
  if (composed.perPerson !== undefined) sheet.perPerson = composed.perPerson;
  return composed;
}

function belowFloorError(sheet: CostSheet, composed: H203PriceComposition, principal: Principal) {
  if (composed.totalCost <= 0) return null;
  const floor = Math.max(sheet.marginFloorPercent, H203_APPROVED_MARGIN_FLOOR_PERCENT);
  if (h203MarginMeetsApprovedFloor(composed.marginPercent, floor)) return null;
  if (sheet.marginFloorExceptionReason && sheet.marginFloorExceptionByPrincipalId) return null;
  if (
    sheet.marginFloorExceptionReason &&
    principalMayAuthorizeMarginFloorException(principal)
  ) {
    return null;
  }
  return { error: "invalid_request" as const, reason: "margin_below_authorized_floor" as const };
}

function findSheet(store: Store, tenantId: string, id: string): CostSheet | undefined {
  return store.costSheets.find((s) => s.id === id && s.tenantId === tenantId && !s.archivedAt);
}

function findSheetByProgramme(store: Store, tenantId: string, programmeId: string): CostSheet | undefined {
  return store.costSheets.find(
    (s) => s.programmeId === programmeId && s.tenantId === tenantId && !s.archivedAt,
  );
}

async function loadSheet(store: Store, tenantId: string, id: string): Promise<CostSheet | undefined> {
  if (isMixedSqlDurable(store)) return getCostSheetById(store.dbPool, tenantId, id);
  ensureCostingCollections(store);
  return findSheet(store, tenantId, id);
}

async function loadSheetByProgramme(store: Store, tenantId: string, programmeId: string): Promise<CostSheet | undefined> {
  if (isMixedSqlDurable(store)) return getCostSheetByProgrammeId(store.dbPool, tenantId, programmeId);
  ensureCostingCollections(store);
  return findSheetByProgramme(store, tenantId, programmeId);
}

async function loadLines(store: Store, tenantId: string, sheetId: string): Promise<CostLineItem[]> {
  if (isMixedSqlDurable(store)) return listCostLineItems(store.dbPool, tenantId, sheetId);
  return store.costLineItems.filter((l) => l.costSheetId === sheetId && l.tenantId === tenantId);
}

async function deny(
  store: Store,
  principal: Principal,
  action: string,
  resourceType: string,
  correlationId: string,
  reason: string,
  resourceId?: string,
) {
  if (isMixedSqlDurable(store)) {
    await persistDenyAudit(store, denyAuditRecord(principal, action, resourceType, correlationId, reason, resourceId));
  } else {
    denyCostingAudit(store, principal, action, resourceType, correlationId, reason, resourceId);
  }
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
    programmeItemId: l.programmeItemId,
    sortOrder: l.sortOrder,
  };
}

function sanitizeSheet(
  s: CostSheet,
  categoryTotals: Record<CostLineCategory, number>,
  composed: H203PriceComposition,
) {
  const summary = programmeFinancialSummaryFromTotals(s, composed);
  summary.clientSellingPrice = composed.clientSellingPrice;
  summary.grossProfit = composed.marginAmount;
  summary.grossMarginPercent = composed.marginPercent;
  summary.sellPriceSource = composed.sellPriceSource;
  if (composed.markupPercentApplied !== undefined) summary.markupPercentApplied = composed.markupPercentApplied;
  summary.fileFeeAmount = composed.fileFeeAmount;
  summary.taxAmount = composed.taxAmount;
  summary.taxMode = composed.taxMode;
  return {
    id: s.id,
    sheetCode: s.sheetCode,
    programmeId: s.programmeId,
    rfpId: s.rfpId,
    opportunityId: s.opportunityId,
    organizationId: s.organizationId,
    status: s.status,
    currency: s.currency,
    markupPercent: s.markupPercent ?? composed.markupPercentApplied,
    sellPrice: s.sellPrice,
    clientSellingPrice: composed.clientSellingPrice,
    marginFloorPercent: s.marginFloorPercent,
    totalCost: s.totalCost,
    marginPercent: s.marginPercent,
    marginAmount: s.marginAmount,
    perPerson: s.perPerson,
    paxCount: s.paxCount,
    fileFeeAmount: composed.fileFeeAmount,
    taxMode: s.taxMode ?? composed.taxMode,
    taxRatePercent: s.taxRatePercent,
    taxAmount: composed.taxAmount,
    fxCurrencyPair: s.fxCurrencyPair,
    fxRate: s.fxRate,
    fxAsOfDate: s.fxAsOfDate,
    fxSourceReference: s.fxSourceReference,
    marginFloorExceptionReason: s.marginFloorExceptionReason,
    marginMeetsFloor: marginMeetsFloor(s.marginPercent, s.marginFloorPercent),
    currentVersion: s.currentVersion,
    categoryTotals,
    financialSummary: summary,
    clientFacing: toClientFacingCommercialView({
      currency: s.currency,
      clientSellingPrice: composed.clientSellingPrice,
    }),
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

function sheetDetailFrom(sheet: CostSheet, lines: CostLineItem[]) {
  const composed = applyTotals(sheet, lines);
  const sorted = [...lines].sort((a, b) => a.sortOrder - b.sortOrder);
  return {
    sheet: sanitizeSheet(sheet, composed.categoryTotals, composed),
    lineItems: sorted.map(sanitizeLine),
  };
}

function sheetDetail(store: Store, sheet: CostSheet) {
  const lines = store.costLineItems
    .filter((l) => l.costSheetId === sheet.id && l.tenantId === sheet.tenantId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  return sheetDetailFrom(sheet, lines);
}

export async function getCostingModuleHealth(store: Store, principal: Principal) {
  ensureCostingCollections(store);
  const decision = authorize({
    principal,
    permission: "costing:read:sheet",
    action: "read:cost_sheet",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  if (isMixedSqlDurable(store)) {
    const sheets = await countCostSheets(store.dbPool, principal.tenantId);
    return { module: "costing", increment: "C6", status: "ok" as const, sheets, lineItems: 0, versions: 0 };
  }
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

export async function listCostSheets(
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

  const items = isMixedSqlDurable(store)
    ? await listCostSheetsByTenant(store.dbPool, principal.tenantId, query)
    : store.costSheets
        .filter((s) => s.tenantId === principal.tenantId && !s.archivedAt)
        .filter((s) => (query?.programmeId ? s.programmeId === query.programmeId : true))
        .filter((s) => (query?.rfpId ? s.rfpId === query.rfpId : true))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const sanitized = [];
  for (const s of items) {
    const lines = await loadLines(store, principal.tenantId, s.id);
    const composed = applyTotals(s, lines);
    sanitized.push(sanitizeSheet(s, composed.categoryTotals, composed));
  }
  return { items: sanitized };
}

export async function getCostSheet(store: Store, principal: Principal, id: string) {
  ensureCostingCollections(store);
  const sheet = await loadSheet(store, principal.tenantId, id);
  if (!sheet) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "costing:read:sheet",
    action: "read:cost_sheet",
    resource: { tenantId: sheet.tenantId, type: "cost_sheet", id: sheet.id, classification: sheet.classification },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const lines = await loadLines(store, sheet.tenantId, id);
  const versions = isMixedSqlDurable(store)
    ? (await listCostSheetVersions(store.dbPool, sheet.tenantId, id)).map(sanitizeVersion)
    : store.costSheetVersions
        .filter((v) => v.costSheetId === id && v.tenantId === sheet.tenantId)
        .sort((a, b) => b.versionNumber - a.versionNumber)
        .map(sanitizeVersion);

  return { ...sheetDetailFrom(sheet, lines), versions };
}

export async function getCostSheetByProgramme(store: Store, principal: Principal, programmeId: string) {
  ensureCostingCollections(store);
  const sheet = await loadSheetByProgramme(store, principal.tenantId, programmeId);
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
  fileFeeAmount?: number;
  taxMode?: "none" | "rate" | "amount";
  taxRatePercent?: number;
  taxAmount?: number;
  fxCurrencyPair?: string;
  fxRate?: number;
  fxAsOfDate?: string;
  fxSourceReference?: string;
  marginFloorExceptionReason?: string;
  lineItems?: Array<{
    category: string;
    description: string;
    quantity?: number;
    unitCost: number;
    currency?: string;
    supplierId?: string;
    supplierRateId?: string;
    programmeItemId?: string;
  }>;
};

export async function createCostSheet(
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
    await deny(store, principal, "costing:write:sheet", "cost_sheet", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const personContent = rejectPersonDomainContent(input);
  if (personContent) return personContent;

  const programme = isMixedSqlDurable(store)
    ? await getProgrammeById(store.dbPool, principal.tenantId, input.programmeId)
    : store.prgProgrammes.find((p) => p.id === input.programmeId && p.tenantId === principal.tenantId && !p.archivedAt);
  if (!programme) return { error: "invalid_request" as const, reason: "invalid_programme" };
  if (await loadSheetByProgramme(store, principal.tenantId, input.programmeId)) {
    return { error: "conflict" as const, reason: "cost_sheet_exists_for_programme" };
  }

  const sheetCode = buildCostSheetCode(programme.programmeCode);
  if (isMixedSqlDurable(store)) {
    if (await sheetCodeExists(store.dbPool, principal.tenantId, sheetCode)) {
      return { error: "conflict" as const, reason: "duplicate_sheet_code" };
    }
  } else if (store.costSheets.some((s) => s.tenantId === principal.tenantId && s.sheetCode === sheetCode)) {
    return { error: "conflict" as const, reason: "duplicate_sheet_code" };
  }

  const now = new Date().toISOString();
  const currency = input.currency ?? "USD";
  const requestedFloor = input.marginFloorPercent ?? H203_APPROVED_MARGIN_FLOOR_PERCENT;
  if (requestedFloor < H203_APPROVED_MARGIN_FLOOR_PERCENT && !input.marginFloorExceptionReason) {
    return { error: "invalid_request" as const, reason: "margin_floor_below_authorized_policy" };
  }
  if (input.marginFloorExceptionReason && !principalMayAuthorizeMarginFloorException(principal)) {
    return { error: "forbidden" as const, reason: "margin_floor_exception_requires_commercial_director_or_ceo_md" };
  }
  const sheet: CostSheet = {
    id: newId(),
    tenantId: principal.tenantId,
    sheetCode,
    programmeId: programme.id,
    rfpId: programme.rfpId,
    opportunityId: programme.opportunityId,
    organizationId: programme.organizationId,
    status: "draft",
    currency,
    ...(input.markupPercent !== undefined
      ? { markupPercent: input.markupPercent }
      : input.sellPrice === undefined
        ? { markupPercent: H203_DEFAULT_MARKUP_PERCENT }
        : {}),
    ...(input.sellPrice !== undefined ? { sellPrice: input.sellPrice } : {}),
    marginFloorPercent: Math.max(requestedFloor, H203_APPROVED_MARGIN_FLOOR_PERCENT),
    fileFeeAmount: resolveH203FileFeeAmount(currency, input.fileFeeAmount),
    taxMode: input.taxMode ?? "none",
    ...(input.taxRatePercent !== undefined ? { taxRatePercent: input.taxRatePercent } : {}),
    taxAmount: input.taxAmount ?? 0,
    ...(input.fxCurrencyPair !== undefined ? { fxCurrencyPair: input.fxCurrencyPair } : {}),
    ...(input.fxRate !== undefined ? { fxRate: input.fxRate } : {}),
    ...(input.fxAsOfDate !== undefined ? { fxAsOfDate: input.fxAsOfDate } : {}),
    ...(input.fxSourceReference !== undefined ? { fxSourceReference: input.fxSourceReference } : {}),
    ...(input.marginFloorExceptionReason
      ? {
          marginFloorExceptionReason: input.marginFloorExceptionReason,
          marginFloorExceptionByPrincipalId: principal.id,
          marginFloorExceptionAt: now,
        }
      : {}),
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

  const lines: CostLineItem[] = [];
  if (input.lineItems?.length) {
    for (const [idx, lineInput] of input.lineItems.entries()) {
      if (!isValidCostLineCategory(lineInput.category)) {
        return { error: "invalid_request" as const, reason: "invalid_line_category" };
      }
      const quantity = lineInput.quantity ?? 1;
      if (typeof quantity !== "number" || quantity < 0) {
        return { error: "invalid_request" as const, reason: "invalid_quantity" };
      }
      if (typeof lineInput.unitCost !== "number" || lineInput.unitCost < 0) {
        return { error: "invalid_request" as const, reason: "invalid_unit_cost" };
      }
      if (lineInput.programmeItemId) {
        const linked = isMixedSqlDurable(store)
          ? await getProgrammeItem(store.dbPool, principal.tenantId, programme.id, lineInput.programmeItemId)
          : store.prgItems.find(
              (i) =>
                i.id === lineInput.programmeItemId &&
                i.programmeId === programme.id &&
                i.tenantId === principal.tenantId,
            );
        if (!linked) return { error: "invalid_request" as const, reason: "invalid_programme_item" };
      }
      lines.push({
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
        ...(lineInput.programmeItemId !== undefined ? { programmeItemId: lineInput.programmeItemId } : {}),
        sortOrder: idx,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  const composed = applyTotals(sheet, lines);
  const floorError = belowFloorError(sheet, composed, principal);
  if (floorError) return floorError;
  sheet.updatedAt = now;

  const rfp = await loadRfp(store, principal.tenantId, programme.rfpId);
  const advanceRfp = Boolean(rfp && rfp.workflowStage === "programme" && canTransitionRfpStage("programme", "costing"));
  const rfpExpected = rfp?.version ?? 0;
  if (advanceRfp && rfp) {
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
    lineCount: lines.length,
    createdAt: now,
    createdByPrincipalId: principal.id,
  };

  if (isMixedSqlDurable(store)) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        await insertCostSheet(client, sheet);
        for (const line of lines) await insertCostLineItem(client, line);
        await insertCostSheetVersion(client, version);
        if (advanceRfp && rfp) await persistRfpStageAdvanceInTx(client, rfp, rfpExpected);
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(principal, "costing:write:sheet", "cost_sheet", sheet.id, correlationId, sheet),
        );
        const outbox = await insertDomainOutbox(client, {
          principal,
          eventType: COSTING_EVENT_TYPES[0],
          payload: { costSheetId: sheet.id, programmeId: sheet.programmeId },
          classification: sheet.classification,
          correlationId,
          aggregateId: sheet.id,
        });
        return { audit, outbox };
      });
      rememberPostCommit(store, committed.audit, committed.outbox);
    } catch (error) {
      if (isUniqueViolation(error)) return { error: "conflict" as const, reason: "duplicate_sheet_code" };
      if (error instanceof OptimisticConcurrencyError) return { error: "conflict" as const, reason: "stale_version" };
      throw error;
    }
    return sheetDetailFrom(sheet, lines);
  }

  store.costSheets.push(sheet);
  store.costLineItems.push(...lines);
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
  programmeItemId?: string;
};

export async function addCostLineItem(
  store: Store,
  principal: Principal,
  sheetId: string,
  input: AddCostLineItemInput,
  correlationId: string,
) {
  ensureCostingCollections(store);
  const sheet = await loadSheet(store, principal.tenantId, sheetId);
  if (!sheet) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "costing:write:line_item",
    action: "create:cost_line_item",
    resource: { tenantId: sheet.tenantId, type: "cost_sheet", id: sheet.id, classification: sheet.classification },
  });
  if (decision.result === "deny") {
    await deny(store, principal, "costing:write:line_item", "cost_line_item", correlationId, decision.reason, sheetId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const personContent = rejectPersonDomainContent(input);
  if (personContent) return personContent;

  if (!isValidCostLineCategory(input.category)) {
    return { error: "invalid_request" as const, reason: "invalid_line_category" };
  }
  if (!input.description?.trim()) return { error: "invalid_request" as const, reason: "description_required" };

  const now = new Date().toISOString();
  const quantity = input.quantity ?? 1;
  if (typeof quantity !== "number" || quantity < 0) {
    return { error: "invalid_request" as const, reason: "invalid_quantity" };
  }
  if (typeof input.unitCost !== "number" || input.unitCost < 0) {
    return { error: "invalid_request" as const, reason: "invalid_unit_cost" };
  }
  if (input.programmeItemId) {
    const linked = isMixedSqlDurable(store)
      ? await getProgrammeItem(store.dbPool, sheet.tenantId, sheet.programmeId, input.programmeItemId)
      : store.prgItems.find(
          (i) =>
            i.id === input.programmeItemId &&
            i.programmeId === sheet.programmeId &&
            i.tenantId === sheet.tenantId,
        );
    if (!linked) return { error: "invalid_request" as const, reason: "invalid_programme_item" };
  }
  const existing = await loadLines(store, sheet.tenantId, sheetId);
  const sortOrder = isMixedSqlDurable(store) ? await countLinesForSheet(store.dbPool, sheetId) : existing.length;
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
    ...(input.programmeItemId !== undefined ? { programmeItemId: input.programmeItemId } : {}),
    sortOrder,
    createdAt: now,
    updatedAt: now,
  };
  const nextLines = [...existing, line];
  const expectedVersion = sheet.version;
  const composed = applyTotals(sheet, nextLines);
  const floorError = belowFloorError(sheet, composed, principal);
  if (floorError) return floorError;
  sheet.updatedAt = now;
  sheet.version += 1;
  sheet.updatedByPrincipalId = principal.id;

  if (isMixedSqlDurable(store)) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        const updated = await updateCostSheetOptimistic(client, sheet, expectedVersion);
        if (updated === 0) throw new OptimisticConcurrencyError("cost_sheet");
        await insertCostLineItem(client, line);
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(principal, "costing:write:line_item", "cost_line_item", line.id, correlationId, sanitizeLine(line)),
        );
        return { audit };
      });
      rememberPostCommit(store, committed.audit);
    } catch (error) {
      if (error instanceof OptimisticConcurrencyError) return { error: "conflict" as const, reason: "stale_version" };
      throw error;
    }
    return { line: sanitizeLine(line), sheet: sheetDetailFrom(sheet, nextLines).sheet };
  }

  store.costLineItems.push(line);
  allowCostingAudit(store, principal, "costing:write:line_item", "cost_line_item", line.id, correlationId, sanitizeLine(line));
  return { line: sanitizeLine(line), sheet: sheetDetail(store, sheet).sheet };
}

export async function recalculateCostSheet(
  store: Store,
  principal: Principal,
  sheetId: string,
  correlationId: string,
  updates?: {
    markupPercent?: number;
    sellPrice?: number;
    fileFeeAmount?: number;
    taxMode?: "none" | "rate" | "amount";
    taxRatePercent?: number;
    taxAmount?: number;
    fxCurrencyPair?: string;
    fxRate?: number;
    fxAsOfDate?: string;
    fxSourceReference?: string;
    marginFloorExceptionReason?: string;
  },
) {
  ensureCostingCollections(store);
  const sheet = await loadSheet(store, principal.tenantId, sheetId);
  if (!sheet) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "costing:write:sheet",
    action: "recalculate:cost_sheet",
    resource: { tenantId: sheet.tenantId, type: "cost_sheet", id: sheet.id, classification: sheet.classification },
  });
  if (decision.result === "deny") {
    await deny(store, principal, "costing:write:sheet", "cost_sheet", correlationId, decision.reason, sheetId);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (updates?.marginFloorExceptionReason) {
    if (!principalMayAuthorizeMarginFloorException(principal)) {
      return { error: "forbidden" as const, reason: "margin_floor_exception_requires_commercial_director_or_ceo_md" };
    }
    if (!updates.marginFloorExceptionReason.trim()) {
      return { error: "invalid_request" as const, reason: "margin_floor_exception_reason_required" };
    }
    sheet.marginFloorExceptionReason = updates.marginFloorExceptionReason.trim();
    sheet.marginFloorExceptionByPrincipalId = principal.id;
    sheet.marginFloorExceptionAt = new Date().toISOString();
  }

  const now = new Date().toISOString();
  const lines = await loadLines(store, sheet.tenantId, sheetId);
  if (updates?.markupPercent !== undefined) sheet.markupPercent = updates.markupPercent;
  if (updates?.sellPrice !== undefined) sheet.sellPrice = updates.sellPrice;
  if (updates?.fileFeeAmount !== undefined) sheet.fileFeeAmount = updates.fileFeeAmount;
  if (updates?.taxMode !== undefined) sheet.taxMode = updates.taxMode;
  if (updates?.taxRatePercent !== undefined) sheet.taxRatePercent = updates.taxRatePercent;
  if (updates?.taxAmount !== undefined) sheet.taxAmount = updates.taxAmount;
  if (updates?.fxCurrencyPair !== undefined) sheet.fxCurrencyPair = updates.fxCurrencyPair;
  if (updates?.fxRate !== undefined) sheet.fxRate = updates.fxRate;
  if (updates?.fxAsOfDate !== undefined) sheet.fxAsOfDate = updates.fxAsOfDate;
  if (updates?.fxSourceReference !== undefined) sheet.fxSourceReference = updates.fxSourceReference;
  const composed = applyTotals(sheet, lines);
  const floorError = belowFloorError(sheet, composed, principal);
  if (floorError) return floorError;
  const expectedVersion = sheet.version;
  sheet.updatedAt = now;
  sheet.version += 1;
  sheet.updatedByPrincipalId = principal.id;

  if (isMixedSqlDurable(store)) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        const updated = await updateCostSheetOptimistic(client, sheet, expectedVersion);
        if (updated === 0) throw new OptimisticConcurrencyError("cost_sheet");
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(principal, "costing:write:sheet", "cost_sheet", sheet.id, correlationId, {
            totalCost: sheet.totalCost,
            sellPrice: sheet.sellPrice,
            marginPercent: sheet.marginPercent,
          }),
        );
        return { audit };
      });
      rememberPostCommit(store, committed.audit);
    } catch (error) {
      if (error instanceof OptimisticConcurrencyError) return { error: "conflict" as const, reason: "stale_version" };
      throw error;
    }
    return sheetDetailFrom(sheet, lines);
  }

  allowCostingAudit(store, principal, "costing:write:sheet", "cost_sheet", sheet.id, correlationId, {
    totalCost: sheet.totalCost,
    sellPrice: sheet.sellPrice,
    marginPercent: sheet.marginPercent,
  });
  return sheetDetail(store, sheet);
}

export async function createCostSheetVersion(
  store: Store,
  principal: Principal,
  sheetId: string,
  summary: string,
  correlationId: string,
) {
  ensureCostingCollections(store);
  const sheet = await loadSheet(store, principal.tenantId, sheetId);
  if (!sheet) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "costing:write:version",
    action: "create:cost_sheet_version",
    resource: { tenantId: sheet.tenantId, type: "cost_sheet", id: sheet.id, classification: sheet.classification },
  });
  if (decision.result === "deny") {
    await deny(store, principal, "costing:write:version", "cost_sheet_version", correlationId, decision.reason, sheetId);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (!summary?.trim()) return { error: "invalid_request" as const, reason: "summary_required" };

  const now = new Date().toISOString();
  const lines = await loadLines(store, sheet.tenantId, sheetId);
  applyTotals(sheet, lines);
  const versionNumber = sheet.currentVersion + 1;
  const version: CostSheetVersion = {
    id: newId(),
    tenantId: principal.tenantId,
    costSheetId: sheet.id,
    versionNumber,
    summary: summary.trim(),
    totalCost: sheet.totalCost,
    sellPrice: sheet.sellPrice ?? sheet.totalCost,
    marginPercent: sheet.marginPercent,
    lineCount: lines.length,
    createdAt: now,
    createdByPrincipalId: principal.id,
  };
  const expectedVersion = sheet.version;
  sheet.currentVersion = versionNumber;
  sheet.updatedAt = now;
  sheet.version += 1;

  if (isMixedSqlDurable(store)) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        const updated = await updateCostSheetOptimistic(client, sheet, expectedVersion);
        if (updated === 0) throw new OptimisticConcurrencyError("cost_sheet");
        await insertCostSheetVersion(client, version);
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(principal, "costing:write:version", "cost_sheet_version", version.id, correlationId, version),
        );
        return { audit };
      });
      rememberPostCommit(store, committed.audit);
    } catch (error) {
      if (error instanceof OptimisticConcurrencyError) return { error: "conflict" as const, reason: "stale_version" };
      throw error;
    }
    return { version, sheet: sheetDetailFrom(sheet, lines).sheet };
  }

  store.costSheetVersions.push(version);
  allowCostingAudit(store, principal, "costing:write:version", "cost_sheet_version", version.id, correlationId, version);
  return { version, sheet: sheetDetail(store, sheet).sheet };
}

export async function getProgrammeFinancialSummary(store: Store, principal: Principal, programmeId: string) {
  const result = await getCostSheetByProgramme(store, principal, programmeId);
  if ("error" in result) return result;
  return {
    financialSummary: result.sheet.financialSummary,
    sheet: result.sheet,
  };
}

