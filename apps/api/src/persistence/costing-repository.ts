import type {
  Classification,
  CostLineCategory,
  CostLineItem,
  CostSheet,
  CostSheetStatus,
  CostSheetVersion,
} from "@sedmc/kernel";
import { asNumber, asNumberRequired, dateOnly, isoTimestamp, type Queryable } from "./durable.js";

function optionalString(value: unknown): string | undefined {
  if (value == null) return undefined;
  const s = String(value);
  return s.length > 0 ? s : undefined;
}

export function mapCostSheetRow(row: Record<string, unknown>): CostSheet {
  const s: CostSheet = {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    sheetCode: row.sheet_code as string,
    programmeId: row.programme_id as string,
    rfpId: row.rfp_id as string,
    opportunityId: row.opportunity_id as string,
    organizationId: row.organization_id as string,
    status: row.status as CostSheetStatus,
    currency: (row.currency as string) ?? "USD",
    marginFloorPercent: asNumberRequired(row.margin_floor_percent),
    totalCost: asNumberRequired(row.total_cost),
    marginPercent: asNumberRequired(row.margin_percent),
    marginAmount: asNumberRequired(row.margin_amount),
    currentVersion: asNumberRequired(row.current_version),
    classification: row.classification as Classification,
    version: asNumberRequired(row.version),
    createdAt: isoTimestamp(row.created_at),
    updatedAt: isoTimestamp(row.updated_at),
    createdByPrincipalId: (row.created_by_principal_id as string) ?? "",
    updatedByPrincipalId: (row.updated_by_principal_id as string) ?? "",
  };
  const markupPercent = asNumber(row.markup_percent);
  if (markupPercent !== undefined) s.markupPercent = markupPercent;
  const sellPrice = asNumber(row.sell_price);
  if (sellPrice !== undefined) s.sellPrice = sellPrice;
  const perPerson = asNumber(row.per_person);
  if (perPerson !== undefined) s.perPerson = perPerson;
  const paxCount = asNumber(row.pax_count);
  if (paxCount !== undefined) s.paxCount = paxCount;
  const fileFeeAmount = asNumber(row.file_fee_amount);
  if (fileFeeAmount !== undefined) s.fileFeeAmount = fileFeeAmount;
  const taxMode = optionalString(row.tax_mode);
  if (taxMode === "none" || taxMode === "rate" || taxMode === "amount") s.taxMode = taxMode;
  const taxRatePercent = asNumber(row.tax_rate_percent);
  if (taxRatePercent !== undefined) s.taxRatePercent = taxRatePercent;
  const taxAmount = asNumber(row.tax_amount);
  if (taxAmount !== undefined) s.taxAmount = taxAmount;
  const fxCurrencyPair = optionalString(row.fx_currency_pair);
  if (fxCurrencyPair) s.fxCurrencyPair = fxCurrencyPair;
  const fxRate = asNumber(row.fx_rate);
  if (fxRate !== undefined) s.fxRate = fxRate;
  const fxAsOfDate = dateOnly(row.fx_as_of_date);
  if (fxAsOfDate) s.fxAsOfDate = fxAsOfDate;
  const fxSourceReference = optionalString(row.fx_source_reference);
  if (fxSourceReference) s.fxSourceReference = fxSourceReference;
  const marginFloorExceptionReason = optionalString(row.margin_floor_exception_reason);
  if (marginFloorExceptionReason) s.marginFloorExceptionReason = marginFloorExceptionReason;
  const marginFloorExceptionByPrincipalId = optionalString(row.margin_floor_exception_by_principal_id);
  if (marginFloorExceptionByPrincipalId) s.marginFloorExceptionByPrincipalId = marginFloorExceptionByPrincipalId;
  if (row.margin_floor_exception_at) s.marginFloorExceptionAt = isoTimestamp(row.margin_floor_exception_at);
  if (row.archived_at) s.archivedAt = isoTimestamp(row.archived_at);
  return s;
}

export function mapCostLineRow(row: Record<string, unknown>): CostLineItem {
  const l: CostLineItem = {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    costSheetId: row.cost_sheet_id as string,
    category: row.category as CostLineCategory,
    description: row.description as string,
    quantity: asNumberRequired(row.quantity),
    unitCost: asNumberRequired(row.unit_cost),
    currency: (row.currency as string) ?? "USD",
    lineTotal: asNumberRequired(row.line_total),
    sortOrder: asNumberRequired(row.sort_order),
    createdAt: isoTimestamp(row.created_at),
    updatedAt: isoTimestamp(row.updated_at),
  };
  const supplierId = optionalString(row.supplier_id);
  if (supplierId) l.supplierId = supplierId;
  const supplierRateId = optionalString(row.supplier_rate_id);
  if (supplierRateId) l.supplierRateId = supplierRateId;
  const programmeItemId = optionalString(row.programme_item_id);
  if (programmeItemId) l.programmeItemId = programmeItemId;
  return l;
}

export function mapCostVersionRow(row: Record<string, unknown>): CostSheetVersion {
  return {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    costSheetId: row.cost_sheet_id as string,
    versionNumber: asNumberRequired(row.version_number),
    summary: row.summary as string,
    totalCost: asNumberRequired(row.total_cost),
    sellPrice: asNumberRequired(row.sell_price),
    marginPercent: asNumberRequired(row.margin_percent),
    lineCount: asNumberRequired(row.line_count),
    createdAt: isoTimestamp(row.created_at),
    createdByPrincipalId: (row.created_by_principal_id as string) ?? "",
  };
}

export async function insertCostSheet(client: Queryable, s: CostSheet): Promise<void> {
  await client.query(
    `INSERT INTO cost_sheets (
      id, tenant_id, sheet_code, programme_id, rfp_id, opportunity_id, organization_id, status,
      currency, markup_percent, sell_price, margin_floor_percent, total_cost, margin_percent,
      margin_amount, per_person, pax_count, current_version, classification, version, archived_at,
      created_at, updated_at, created_by_principal_id, updated_by_principal_id,
      file_fee_amount, tax_mode, tax_rate_percent, tax_amount, fx_currency_pair, fx_rate,
      fx_as_of_date, fx_source_reference, margin_floor_exception_reason,
      margin_floor_exception_by_principal_id, margin_floor_exception_at
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,
      $26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36
    )`,
    [
      s.id,
      s.tenantId,
      s.sheetCode,
      s.programmeId,
      s.rfpId,
      s.opportunityId,
      s.organizationId,
      s.status,
      s.currency,
      s.markupPercent ?? null,
      s.sellPrice ?? null,
      s.marginFloorPercent,
      s.totalCost,
      s.marginPercent,
      s.marginAmount,
      s.perPerson ?? null,
      s.paxCount ?? null,
      s.currentVersion,
      s.classification,
      s.version,
      s.archivedAt ?? null,
      s.createdAt,
      s.updatedAt,
      s.createdByPrincipalId,
      s.updatedByPrincipalId,
      s.fileFeeAmount ?? null,
      s.taxMode ?? "none",
      s.taxRatePercent ?? null,
      s.taxAmount ?? 0,
      s.fxCurrencyPair ?? null,
      s.fxRate ?? null,
      s.fxAsOfDate ?? null,
      s.fxSourceReference ?? null,
      s.marginFloorExceptionReason ?? null,
      s.marginFloorExceptionByPrincipalId ?? null,
      s.marginFloorExceptionAt ?? null,
    ],
  );
}

export async function insertCostLineItem(client: Queryable, l: CostLineItem): Promise<void> {
  await client.query(
    `INSERT INTO cost_line_items (
      id, tenant_id, cost_sheet_id, category, description, quantity, unit_cost, currency,
      line_total, supplier_id, supplier_rate_id, programme_item_id, sort_order, created_at, updated_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
    [
      l.id,
      l.tenantId,
      l.costSheetId,
      l.category,
      l.description,
      l.quantity,
      l.unitCost,
      l.currency,
      l.lineTotal,
      l.supplierId ?? null,
      l.supplierRateId ?? null,
      l.programmeItemId ?? null,
      l.sortOrder,
      l.createdAt,
      l.updatedAt,
    ],
  );
}

export async function insertCostSheetVersion(client: Queryable, v: CostSheetVersion): Promise<void> {
  await client.query(
    `INSERT INTO cost_sheet_versions (
      id, tenant_id, cost_sheet_id, version_number, summary, total_cost, sell_price,
      margin_percent, line_count, created_at, created_by_principal_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [
      v.id,
      v.tenantId,
      v.costSheetId,
      v.versionNumber,
      v.summary,
      v.totalCost,
      v.sellPrice,
      v.marginPercent,
      v.lineCount,
      v.createdAt,
      v.createdByPrincipalId,
    ],
  );
}

export async function updateCostSheetOptimistic(
  client: Queryable,
  s: CostSheet,
  expectedVersion: number,
): Promise<number> {
  const result = await client.query(
    `UPDATE cost_sheets SET
      status = $3, currency = $4, markup_percent = $5, sell_price = $6, margin_floor_percent = $7,
      total_cost = $8, margin_percent = $9, margin_amount = $10, per_person = $11, pax_count = $12,
      current_version = $13, version = $14, archived_at = $15, updated_at = $16, updated_by_principal_id = $17,
      file_fee_amount = $19, tax_mode = $20, tax_rate_percent = $21, tax_amount = $22,
      fx_currency_pair = $23, fx_rate = $24, fx_as_of_date = $25, fx_source_reference = $26,
      margin_floor_exception_reason = $27, margin_floor_exception_by_principal_id = $28,
      margin_floor_exception_at = $29
     WHERE id = $1 AND tenant_id = $2 AND version = $18 AND archived_at IS NULL`,
    [
      s.id,
      s.tenantId,
      s.status,
      s.currency,
      s.markupPercent ?? null,
      s.sellPrice ?? null,
      s.marginFloorPercent,
      s.totalCost,
      s.marginPercent,
      s.marginAmount,
      s.perPerson ?? null,
      s.paxCount ?? null,
      s.currentVersion,
      s.version,
      s.archivedAt ?? null,
      s.updatedAt,
      s.updatedByPrincipalId,
      expectedVersion,
      s.fileFeeAmount ?? null,
      s.taxMode ?? "none",
      s.taxRatePercent ?? null,
      s.taxAmount ?? 0,
      s.fxCurrencyPair ?? null,
      s.fxRate ?? null,
      s.fxAsOfDate ?? null,
      s.fxSourceReference ?? null,
      s.marginFloorExceptionReason ?? null,
      s.marginFloorExceptionByPrincipalId ?? null,
      s.marginFloorExceptionAt ?? null,
    ],
  );
  return result.rowCount ?? 0;
}

export async function getCostSheetById(
  client: Queryable,
  tenantId: string,
  id: string,
): Promise<CostSheet | undefined> {
  const result = await client.query(
    `SELECT * FROM cost_sheets WHERE id = $1 AND tenant_id = $2 AND archived_at IS NULL`,
    [id, tenantId],
  );
  const row = result.rows[0] as Record<string, unknown> | undefined;
  return row ? mapCostSheetRow(row) : undefined;
}

export async function getCostSheetByProgrammeId(
  client: Queryable,
  tenantId: string,
  programmeId: string,
): Promise<CostSheet | undefined> {
  const result = await client.query(
    `SELECT * FROM cost_sheets WHERE tenant_id = $1 AND programme_id = $2 AND archived_at IS NULL`,
    [tenantId, programmeId],
  );
  const row = result.rows[0] as Record<string, unknown> | undefined;
  return row ? mapCostSheetRow(row) : undefined;
}

export async function listCostSheetsByTenant(
  client: Queryable,
  tenantId: string,
  query?: { programmeId?: string; rfpId?: string },
): Promise<CostSheet[]> {
  const clauses = [`tenant_id = $1`, `archived_at IS NULL`];
  const params: unknown[] = [tenantId];
  if (query?.programmeId) {
    params.push(query.programmeId);
    clauses.push(`programme_id = $${params.length}`);
  }
  if (query?.rfpId) {
    params.push(query.rfpId);
    clauses.push(`rfp_id = $${params.length}`);
  }
  const result = await client.query(
    `SELECT * FROM cost_sheets WHERE ${clauses.join(" AND ")} ORDER BY updated_at DESC`,
    params,
  );
  return (result.rows as Record<string, unknown>[]).map(mapCostSheetRow);
}

export async function listCostLineItems(
  client: Queryable,
  tenantId: string,
  costSheetId: string,
): Promise<CostLineItem[]> {
  const result = await client.query(
    `SELECT * FROM cost_line_items WHERE tenant_id = $1 AND cost_sheet_id = $2 ORDER BY sort_order ASC`,
    [tenantId, costSheetId],
  );
  return (result.rows as Record<string, unknown>[]).map(mapCostLineRow);
}

export async function countCostSheets(client: Queryable, tenantId: string): Promise<number> {
  const result = await client.query(
    `SELECT COUNT(*)::int AS c FROM cost_sheets WHERE tenant_id = $1 AND archived_at IS NULL`,
    [tenantId],
  );
  return asNumberRequired(result.rows[0]?.c);
}

export async function countLinesForSheet(client: Queryable, costSheetId: string): Promise<number> {
  const result = await client.query(`SELECT COUNT(*)::int AS c FROM cost_line_items WHERE cost_sheet_id = $1`, [
    costSheetId,
  ]);
  return asNumberRequired(result.rows[0]?.c);
}

export async function listCostSheetVersions(
  client: Queryable,
  tenantId: string,
  costSheetId: string,
): Promise<CostSheetVersion[]> {
  const result = await client.query(
    `SELECT * FROM cost_sheet_versions WHERE tenant_id = $1 AND cost_sheet_id = $2 ORDER BY version_number DESC`,
    [tenantId, costSheetId],
  );
  return (result.rows as Record<string, unknown>[]).map(mapCostVersionRow);
}

export async function sheetCodeExists(client: Queryable, tenantId: string, code: string): Promise<boolean> {
  const result = await client.query(`SELECT 1 FROM cost_sheets WHERE tenant_id = $1 AND sheet_code = $2`, [
    tenantId,
    code,
  ]);
  return (result.rowCount ?? 0) > 0;
}
