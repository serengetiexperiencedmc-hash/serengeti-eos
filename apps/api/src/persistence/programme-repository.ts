import type {
  Classification,
  PrgDay,
  PrgItem,
  PrgProgramme,
  PrgProgrammeVersion,
  ProgrammeCommercialVersionLabel,
  ProgrammeItemType,
  ProgrammeItemVisibility,
  ProgrammeStatus,
  ProgrammePaymentMilestone,
  PrgRoomingEntry,
  ProgrammeRoomType,
} from "@sedmc/kernel";
import { asNumber, asNumberRequired, dateOnly, isoTimestamp, type Queryable } from "./durable.js";

function optionalString(value: unknown): string | undefined {
  if (value == null) return undefined;
  const s = String(value);
  return s.length > 0 ? s : undefined;
}

export function mapProgrammeRow(row: Record<string, unknown>): PrgProgramme {
  const p: PrgProgramme = {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    programmeCode: row.programme_code as string,
    rfpId: row.rfp_id as string,
    opportunityId: row.opportunity_id as string,
    organizationId: row.organization_id as string,
    title: row.title as string,
    status: row.status as ProgrammeStatus,
    dayCount: asNumberRequired(row.day_count),
    classification: row.classification as Classification,
    version: asNumberRequired(row.version),
    createdAt: isoTimestamp(row.created_at),
    updatedAt: isoTimestamp(row.updated_at),
    createdByPrincipalId: (row.created_by_principal_id as string) ?? "",
    updatedByPrincipalId: (row.updated_by_principal_id as string) ?? "",
  };
  const startDate = dateOnly(row.start_date);
  if (startDate) p.startDate = startDate;
  const endDate = dateOnly(row.end_date);
  if (endDate) p.endDate = endDate;
  const paxCount = asNumber(row.pax_count);
  if (paxCount !== undefined) p.paxCount = paxCount;
  const destinations = optionalString(row.destinations);
  if (destinations) p.destinations = destinations;
  const internalNotes = optionalString(row.internal_notes);
  if (internalNotes) p.internalNotes = internalNotes;
  const clientNotes = optionalString(row.client_notes);
  if (clientNotes) p.clientNotes = clientNotes;
  const commercialVersionLabel = optionalString(row.commercial_version_label);
  if (commercialVersionLabel) {
    p.commercialVersionLabel = commercialVersionLabel as ProgrammeCommercialVersionLabel;
  }
  const depositPercent = asNumber(row.deposit_percent);
  if (depositPercent !== undefined) p.depositPercent = depositPercent;
  if (row.payment_milestones) {
    const raw = typeof row.payment_milestones === "string" ? JSON.parse(row.payment_milestones) : row.payment_milestones;
    if (Array.isArray(raw)) p.paymentMilestones = raw as ProgrammePaymentMilestone[];
  }
  const inclusionsText = optionalString(row.inclusions_text);
  if (inclusionsText) p.inclusionsText = inclusionsText;
  const exclusionsText = optionalString(row.exclusions_text);
  if (exclusionsText) p.exclusionsText = exclusionsText;
  const nightCountOverride = asNumber(row.night_count_override);
  if (nightCountOverride !== undefined) p.nightCountOverride = nightCountOverride;
  const nightCountOverrideReason = optionalString(row.night_count_override_reason);
  if (nightCountOverrideReason) p.nightCountOverrideReason = nightCountOverrideReason;
  const commercialResponsibleRole = optionalString(row.commercial_responsible_role);
  if (commercialResponsibleRole === "ceo_md" || commercialResponsibleRole === "commercial_director") {
    p.commercialResponsibleRole = commercialResponsibleRole;
  }
  const safariVehicleMaxPassengers = asNumber(row.safari_vehicle_max_passengers);
  if (safariVehicleMaxPassengers !== undefined) p.safariVehicleMaxPassengers = safariVehicleMaxPassengers;
  const driverGuideMaxGuests = asNumber(row.driver_guide_max_guests);
  if (driverGuideMaxGuests !== undefined) p.driverGuideMaxGuests = driverGuideMaxGuests;
  const requiredVehiclesOverride = asNumber(row.required_vehicles_override);
  if (requiredVehiclesOverride !== undefined) p.requiredVehiclesOverride = requiredVehiclesOverride;
  const requiredVehiclesOverrideReason = optionalString(row.required_vehicles_override_reason);
  if (requiredVehiclesOverrideReason) p.requiredVehiclesOverrideReason = requiredVehiclesOverrideReason;
  if (row.archived_at) p.archivedAt = isoTimestamp(row.archived_at);
  return p;
}

export function mapDayRow(row: Record<string, unknown>): PrgDay {
  const d: PrgDay = {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    programmeId: row.programme_id as string,
    dayNumber: asNumberRequired(row.day_number),
    title: row.title as string,
    sortOrder: asNumberRequired(row.sort_order),
    createdAt: isoTimestamp(row.created_at),
    updatedAt: isoTimestamp(row.updated_at),
  };
  const location = optionalString(row.location);
  if (location) d.location = location;
  const calendarDate = dateOnly(row.calendar_date);
  if (calendarDate) d.calendarDate = calendarDate;
  const description = optionalString(row.description);
  if (description) d.description = description;
  return d;
}

export function mapItemRow(row: Record<string, unknown>): PrgItem {
  const i: PrgItem = {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    programmeId: row.programme_id as string,
    dayId: row.day_id as string,
    sortOrder: asNumberRequired(row.sort_order),
    title: row.title as string,
    createdAt: isoTimestamp(row.created_at),
    updatedAt: isoTimestamp(row.updated_at),
  };
  const startTime = optionalString(row.start_time);
  if (startTime) i.startTime = startTime;
  const description = optionalString(row.description);
  if (description) i.description = description;
  const supplierId = optionalString(row.supplier_id);
  if (supplierId) i.supplierId = supplierId;
  const supplierRateId = optionalString(row.supplier_rate_id);
  if (supplierRateId) i.supplierRateId = supplierRateId;
  const supplierLabel = optionalString(row.supplier_label);
  if (supplierLabel) i.supplierLabel = supplierLabel;
  const itemType = optionalString(row.item_type);
  if (itemType) i.itemType = itemType as ProgrammeItemType;
  const quantity = asNumber(row.quantity);
  if (quantity !== undefined) i.quantity = quantity;
  const unit = optionalString(row.unit);
  if (unit) i.unit = unit;
  const notes = optionalString(row.notes);
  if (notes) i.notes = notes;
  const visibility = optionalString(row.visibility);
  if (visibility) i.visibility = visibility as ProgrammeItemVisibility;
  return i;
}

export function mapProgrammeVersionRow(row: Record<string, unknown>): PrgProgrammeVersion {
  const snapshot = (row.snapshot ?? {}) as PrgProgrammeVersion["snapshot"];
  return {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    programmeId: row.programme_id as string,
    versionNumber: asNumberRequired(row.version_number),
    summary: row.summary as string,
    snapshot,
    createdAt: isoTimestamp(row.created_at),
    createdByPrincipalId: (row.created_by_principal_id as string) ?? "",
  };
}

export async function insertProgramme(client: Queryable, p: PrgProgramme): Promise<void> {
  await client.query(
    `INSERT INTO prg_programmes (
      id, tenant_id, programme_code, rfp_id, opportunity_id, organization_id, title, status,
      day_count, start_date, end_date, pax_count, destinations, internal_notes, client_notes,
      commercial_version_label, classification, version, archived_at, created_at, updated_at,
      created_by_principal_id, updated_by_principal_id, deposit_percent, payment_milestones,
      inclusions_text, exclusions_text, night_count_override, night_count_override_reason,
      commercial_responsible_role, safari_vehicle_max_passengers, driver_guide_max_guests,
      required_vehicles_override, required_vehicles_override_reason
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,
      $24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34
    )`,
    [
      p.id,
      p.tenantId,
      p.programmeCode,
      p.rfpId,
      p.opportunityId,
      p.organizationId,
      p.title,
      p.status,
      p.dayCount,
      p.startDate ?? null,
      p.endDate ?? null,
      p.paxCount ?? null,
      p.destinations ?? null,
      p.internalNotes ?? null,
      p.clientNotes ?? null,
      p.commercialVersionLabel ?? "draft",
      p.classification,
      p.version,
      p.archivedAt ?? null,
      p.createdAt,
      p.updatedAt,
      p.createdByPrincipalId,
      p.updatedByPrincipalId,
      p.depositPercent ?? 30,
      JSON.stringify(p.paymentMilestones ?? []),
      p.inclusionsText ?? null,
      p.exclusionsText ?? null,
      p.nightCountOverride ?? null,
      p.nightCountOverrideReason ?? null,
      p.commercialResponsibleRole ?? "commercial_director",
      p.safariVehicleMaxPassengers ?? 6,
      p.driverGuideMaxGuests ?? 6,
      p.requiredVehiclesOverride ?? null,
      p.requiredVehiclesOverrideReason ?? null,
    ],
  );
}

export async function insertProgrammeDay(client: Queryable, d: PrgDay): Promise<void> {
  await client.query(
    `INSERT INTO prg_days (
      id, tenant_id, programme_id, day_number, title, location, calendar_date, description, sort_order, created_at, updated_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [
      d.id,
      d.tenantId,
      d.programmeId,
      d.dayNumber,
      d.title,
      d.location ?? null,
      d.calendarDate ?? null,
      d.description ?? null,
      d.sortOrder,
      d.createdAt,
      d.updatedAt,
    ],
  );
}

export async function insertProgrammeItem(client: Queryable, i: PrgItem): Promise<void> {
  await client.query(
    `INSERT INTO prg_items (
      id, tenant_id, programme_id, day_id, sort_order, start_time, title, description,
      supplier_id, supplier_rate_id, supplier_label, item_type, quantity, unit, notes, visibility,
      created_at, updated_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
    [
      i.id,
      i.tenantId,
      i.programmeId,
      i.dayId,
      i.sortOrder,
      i.startTime ?? null,
      i.title,
      i.description ?? null,
      i.supplierId ?? null,
      i.supplierRateId ?? null,
      i.supplierLabel ?? null,
      i.itemType ?? null,
      i.quantity ?? null,
      i.unit ?? null,
      i.notes ?? null,
      i.visibility ?? null,
      i.createdAt,
      i.updatedAt,
    ],
  );
}

export async function insertProgrammeVersion(client: Queryable, v: PrgProgrammeVersion): Promise<void> {
  await client.query(
    `INSERT INTO prg_programme_versions (
      id, tenant_id, programme_id, version_number, summary, snapshot, created_at, created_by_principal_id
    ) VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8)`,
    [
      v.id,
      v.tenantId,
      v.programmeId,
      v.versionNumber,
      v.summary,
      JSON.stringify(v.snapshot),
      v.createdAt,
      v.createdByPrincipalId,
    ],
  );
}

export async function updateProgrammeOptimistic(
  client: Queryable,
  p: PrgProgramme,
  expectedVersion: number,
): Promise<number> {
  const result = await client.query(
    `UPDATE prg_programmes SET
      title = $3, status = $4, day_count = $5, start_date = $6, end_date = $7, pax_count = $8,
      destinations = $9, internal_notes = $10, client_notes = $11, commercial_version_label = $12,
      classification = $13, version = $14, archived_at = $15, updated_at = $16, updated_by_principal_id = $17,
      deposit_percent = $19, payment_milestones = $20, inclusions_text = $21, exclusions_text = $22,
      night_count_override = $23, night_count_override_reason = $24, commercial_responsible_role = $25,
      safari_vehicle_max_passengers = $26, driver_guide_max_guests = $27,
      required_vehicles_override = $28, required_vehicles_override_reason = $29
     WHERE id = $1 AND tenant_id = $2 AND version = $18 AND archived_at IS NULL`,
    [
      p.id,
      p.tenantId,
      p.title,
      p.status,
      p.dayCount,
      p.startDate ?? null,
      p.endDate ?? null,
      p.paxCount ?? null,
      p.destinations ?? null,
      p.internalNotes ?? null,
      p.clientNotes ?? null,
      p.commercialVersionLabel ?? "draft",
      p.classification,
      p.version,
      p.archivedAt ?? null,
      p.updatedAt,
      p.updatedByPrincipalId,
      expectedVersion,
      p.depositPercent ?? 30,
      JSON.stringify(p.paymentMilestones ?? []),
      p.inclusionsText ?? null,
      p.exclusionsText ?? null,
      p.nightCountOverride ?? null,
      p.nightCountOverrideReason ?? null,
      p.commercialResponsibleRole ?? "commercial_director",
      p.safariVehicleMaxPassengers ?? 6,
      p.driverGuideMaxGuests ?? 6,
      p.requiredVehiclesOverride ?? null,
      p.requiredVehiclesOverrideReason ?? null,
    ],
  );
  return result.rowCount ?? 0;
}

export async function updateProgrammeItem(client: Queryable, i: PrgItem): Promise<void> {
  await client.query(
    `UPDATE prg_items SET
      sort_order = $3, start_time = $4, title = $5, description = $6, supplier_id = $7,
      supplier_rate_id = $8, supplier_label = $9, item_type = $10, quantity = $11, unit = $12,
      notes = $13, visibility = $14, updated_at = $15
     WHERE id = $1 AND tenant_id = $2`,
    [
      i.id,
      i.tenantId,
      i.sortOrder,
      i.startTime ?? null,
      i.title,
      i.description ?? null,
      i.supplierId ?? null,
      i.supplierRateId ?? null,
      i.supplierLabel ?? null,
      i.itemType ?? null,
      i.quantity ?? null,
      i.unit ?? null,
      i.notes ?? null,
      i.visibility ?? null,
      i.updatedAt,
    ],
  );
}

export async function getProgrammeById(
  client: Queryable,
  tenantId: string,
  id: string,
): Promise<PrgProgramme | undefined> {
  const result = await client.query(
    `SELECT * FROM prg_programmes WHERE id = $1 AND tenant_id = $2 AND archived_at IS NULL`,
    [id, tenantId],
  );
  const row = result.rows[0] as Record<string, unknown> | undefined;
  return row ? mapProgrammeRow(row) : undefined;
}

export async function getProgrammeByRfpId(
  client: Queryable,
  tenantId: string,
  rfpId: string,
): Promise<PrgProgramme | undefined> {
  const result = await client.query(
    `SELECT * FROM prg_programmes WHERE tenant_id = $1 AND rfp_id = $2 AND archived_at IS NULL`,
    [tenantId, rfpId],
  );
  const row = result.rows[0] as Record<string, unknown> | undefined;
  return row ? mapProgrammeRow(row) : undefined;
}

export async function programmeCodeExists(client: Queryable, tenantId: string, code: string): Promise<boolean> {
  const result = await client.query(
    `SELECT 1 FROM prg_programmes WHERE tenant_id = $1 AND programme_code = $2`,
    [tenantId, code],
  );
  return (result.rowCount ?? 0) > 0;
}

export async function listProgrammesByTenant(
  client: Queryable,
  tenantId: string,
  query?: { rfpId?: string; status?: string },
): Promise<PrgProgramme[]> {
  const clauses = [`tenant_id = $1`, `archived_at IS NULL`];
  const params: unknown[] = [tenantId];
  if (query?.rfpId) {
    params.push(query.rfpId);
    clauses.push(`rfp_id = $${params.length}`);
  }
  if (query?.status) {
    params.push(query.status);
    clauses.push(`status = $${params.length}`);
  }
  const result = await client.query(
    `SELECT * FROM prg_programmes WHERE ${clauses.join(" AND ")} ORDER BY updated_at DESC`,
    params,
  );
  return (result.rows as Record<string, unknown>[]).map(mapProgrammeRow);
}

export async function countProgrammes(
  client: Queryable,
  tenantId: string,
): Promise<{ programmes: number; days: number; items: number }> {
  const programmes = await client.query(
    `SELECT COUNT(*)::int AS c FROM prg_programmes WHERE tenant_id = $1 AND archived_at IS NULL`,
    [tenantId],
  );
  const days = await client.query(`SELECT COUNT(*)::int AS c FROM prg_days WHERE tenant_id = $1`, [tenantId]);
  const items = await client.query(`SELECT COUNT(*)::int AS c FROM prg_items WHERE tenant_id = $1`, [tenantId]);
  return {
    programmes: asNumberRequired(programmes.rows[0]?.c),
    days: asNumberRequired(days.rows[0]?.c),
    items: asNumberRequired(items.rows[0]?.c),
  };
}

export async function listProgrammeDays(client: Queryable, tenantId: string, programmeId: string): Promise<PrgDay[]> {
  const result = await client.query(
    `SELECT * FROM prg_days WHERE tenant_id = $1 AND programme_id = $2 ORDER BY sort_order ASC, day_number ASC`,
    [tenantId, programmeId],
  );
  return (result.rows as Record<string, unknown>[]).map(mapDayRow);
}

export async function listProgrammeItems(client: Queryable, tenantId: string, programmeId: string): Promise<PrgItem[]> {
  const result = await client.query(
    `SELECT * FROM prg_items WHERE tenant_id = $1 AND programme_id = $2 ORDER BY sort_order ASC`,
    [tenantId, programmeId],
  );
  return (result.rows as Record<string, unknown>[]).map(mapItemRow);
}

export async function getProgrammeDay(
  client: Queryable,
  tenantId: string,
  programmeId: string,
  dayId: string,
): Promise<PrgDay | undefined> {
  const result = await client.query(
    `SELECT * FROM prg_days WHERE id = $1 AND programme_id = $2 AND tenant_id = $3`,
    [dayId, programmeId, tenantId],
  );
  const row = result.rows[0] as Record<string, unknown> | undefined;
  return row ? mapDayRow(row) : undefined;
}

export async function getProgrammeItem(
  client: Queryable,
  tenantId: string,
  programmeId: string,
  itemId: string,
): Promise<PrgItem | undefined> {
  const result = await client.query(
    `SELECT * FROM prg_items WHERE id = $1 AND programme_id = $2 AND tenant_id = $3`,
    [itemId, programmeId, tenantId],
  );
  const row = result.rows[0] as Record<string, unknown> | undefined;
  return row ? mapItemRow(row) : undefined;
}

export async function dayNumberExists(
  client: Queryable,
  programmeId: string,
  dayNumber: number,
): Promise<boolean> {
  const result = await client.query(`SELECT 1 FROM prg_days WHERE programme_id = $1 AND day_number = $2`, [
    programmeId,
    dayNumber,
  ]);
  return (result.rowCount ?? 0) > 0;
}

export async function countDaysForProgramme(client: Queryable, programmeId: string): Promise<number> {
  const result = await client.query(`SELECT COUNT(*)::int AS c FROM prg_days WHERE programme_id = $1`, [programmeId]);
  return asNumberRequired(result.rows[0]?.c);
}

export async function countItemsForDay(client: Queryable, dayId: string): Promise<number> {
  const result = await client.query(`SELECT COUNT(*)::int AS c FROM prg_items WHERE day_id = $1`, [dayId]);
  return asNumberRequired(result.rows[0]?.c);
}

export async function nextProgrammeVersionNumber(client: Queryable, programmeId: string): Promise<number> {
  const result = await client.query(
    `SELECT COALESCE(MAX(version_number), 0)::int AS c FROM prg_programme_versions WHERE programme_id = $1`,
    [programmeId],
  );
  return asNumberRequired(result.rows[0]?.c) + 1;
}

export async function listProgrammeVersions(
  client: Queryable,
  tenantId: string,
  programmeId: string,
): Promise<PrgProgrammeVersion[]> {
  const result = await client.query(
    `SELECT * FROM prg_programme_versions WHERE tenant_id = $1 AND programme_id = $2 ORDER BY version_number DESC`,
    [tenantId, programmeId],
  );
  return (result.rows as Record<string, unknown>[]).map(mapProgrammeVersionRow);
}

function mapRoomingRow(row: Record<string, unknown>): PrgRoomingEntry {
  const entry: PrgRoomingEntry = {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    programmeId: row.programme_id as string,
    roomType: row.room_type as ProgrammeRoomType,
    roomCount: asNumberRequired(row.room_count),
    createdAt: isoTimestamp(row.created_at),
    updatedAt: isoTimestamp(row.updated_at),
  };
  const occupancy = asNumber(row.occupancy);
  if (occupancy !== undefined) entry.occupancy = occupancy;
  if (row.complimentary === true) entry.complimentary = true;
  const supplementNotes = optionalString(row.supplement_notes);
  if (supplementNotes) entry.supplementNotes = supplementNotes;
  const notes = optionalString(row.notes);
  if (notes) entry.notes = notes;
  return entry;
}

export async function listProgrammeRooming(
  client: Queryable,
  tenantId: string,
  programmeId: string,
): Promise<PrgRoomingEntry[]> {
  const result = await client.query(
    `SELECT * FROM prg_rooming_entries WHERE tenant_id = $1 AND programme_id = $2 ORDER BY created_at ASC`,
    [tenantId, programmeId],
  );
  return (result.rows as Record<string, unknown>[]).map(mapRoomingRow);
}

export async function insertProgrammeRooming(client: Queryable, e: PrgRoomingEntry): Promise<void> {
  await client.query(
    `INSERT INTO prg_rooming_entries (
      id, tenant_id, programme_id, room_type, room_count, occupancy, complimentary,
      supplement_notes, notes, created_at, updated_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [
      e.id,
      e.tenantId,
      e.programmeId,
      e.roomType,
      e.roomCount,
      e.occupancy ?? null,
      e.complimentary ?? false,
      e.supplementNotes ?? null,
      e.notes ?? null,
      e.createdAt,
      e.updatedAt,
    ],
  );
}
