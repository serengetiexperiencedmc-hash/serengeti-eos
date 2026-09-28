import {
  authorize,
  buildProgrammeCode,
  canTransitionRfpStage,
  isValidProgrammeCommercialVersionLabel,
  isValidProgrammeItemType,
  isValidProgrammeItemVisibility,
  newId,
  PROGRAMME_EVENT_TYPES,
  type Principal,
  type PrgDay,
  type PrgItem,
  type PrgProgramme,
  type PrgProgrammeVersion,
} from "@sedmc/kernel";
import {
  defaultProgrammePaymentMilestones,
  H203_DEFAULT_DEPOSIT_PERCENT,
  H203_DRIVER_GUIDE_MAX_GUESTS,
  H203_SAFARI_VEHICLE_MAX_PASSENGERS,
  H203_WON_LOST_OWNER,
  H203_WON_LOST_RECORD,
  isValidProgrammeRoomType,
  paymentMilestonesTotalOneHundred,
  programmeNightCount,
  requiredSafariVehicles,
  type ProgrammePaymentMilestone,
  type PrgRoomingEntry,
} from "@sedmc/kernel/h203-commercial-policy";
import type { Store } from "../store.js";
import { allowProgrammeAudit, denyProgrammeAudit } from "./audit.js";
import { ensureProgrammeCollections } from "./collections.js";
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
import { rejectPersonDomainContent } from "../personal-data-content-contract.js";
import {
  countDaysForProgramme,
  countItemsForDay,
  countProgrammes,
  dayNumberExists,
  getProgrammeById,
  getProgrammeByRfpId,
  getProgrammeDay,
  getProgrammeItem,
  insertProgramme,
  insertProgrammeDay,
  insertProgrammeItem,
  insertProgrammeVersion,
  listProgrammeDays,
  listProgrammeItems,
  listProgrammesByTenant,
  nextProgrammeVersionNumber,
  programmeCodeExists,
  updateProgrammeItem,
  updateProgrammeOptimistic,
  listProgrammeRooming,
  insertProgrammeRooming,
} from "../persistence/programme-repository.js";
import { loadRfp, persistRfpStageAdvanceInTx } from "../rfp/rfp.js";

function sanitizeProgramme(p: PrgProgramme) {
  const derivedNights = programmeNightCount(p.startDate, p.endDate);
  const nights =
    p.nightCountOverride !== undefined && p.nightCountOverrideReason
      ? p.nightCountOverride
      : derivedNights;
  const vehicleMax = p.safariVehicleMaxPassengers ?? H203_SAFARI_VEHICLE_MAX_PASSENGERS;
  const guests = p.paxCount ?? 0;
  const computedVehicles = requiredSafariVehicles(guests, vehicleMax);
  return {
    id: p.id,
    programmeCode: p.programmeCode,
    rfpId: p.rfpId,
    opportunityId: p.opportunityId,
    organizationId: p.organizationId,
    title: p.title,
    status: p.status,
    dayCount: p.dayCount,
    startDate: p.startDate,
    endDate: p.endDate,
    paxCount: p.paxCount,
    destinations: p.destinations,
    internalNotes: p.internalNotes,
    clientNotes: p.clientNotes,
    commercialVersionLabel: p.commercialVersionLabel ?? "draft",
    depositPercent: p.depositPercent ?? H203_DEFAULT_DEPOSIT_PERCENT,
    paymentMilestones: p.paymentMilestones ?? defaultProgrammePaymentMilestones(),
    inclusionsText: p.inclusionsText,
    exclusionsText: p.exclusionsText,
    nightCount: nights,
    nightCountDerived: derivedNights,
    nightCountOverride: p.nightCountOverride,
    commercialResponsibleRole: p.commercialResponsibleRole ?? "commercial_director",
    commercialResponsibility: {
      commercialRoles: ["ceo_md", "commercial_director"],
      wonLostOwner: H203_WON_LOST_OWNER,
      wonLostRecord: H203_WON_LOST_RECORD,
    },
    safariVehicleMaxPassengers: vehicleMax,
    driverGuideMaxGuests: p.driverGuideMaxGuests ?? H203_DRIVER_GUIDE_MAX_GUESTS,
    requiredVehicles: p.requiredVehiclesOverride ?? computedVehicles,
    createdByPrincipalId: p.createdByPrincipalId,
    classification: p.classification,
    version: p.version,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

function sanitizeDay(d: PrgDay) {
  return {
    id: d.id,
    programmeId: d.programmeId,
    dayNumber: d.dayNumber,
    title: d.title,
    location: d.location,
    calendarDate: d.calendarDate,
    description: d.description,
    sortOrder: d.sortOrder,
  };
}

function sanitizeItem(i: PrgItem) {
  return {
    id: i.id,
    dayId: i.dayId,
    sortOrder: i.sortOrder,
    startTime: i.startTime,
    title: i.title,
    description: i.description,
    supplierId: i.supplierId,
    supplierRateId: i.supplierRateId,
    supplierLabel: i.supplierLabel,
    itemType: i.itemType,
    quantity: i.quantity,
    unit: i.unit,
    notes: i.notes,
    visibility: i.visibility,
  };
}

function findProgrammeMemory(store: Store, tenantId: string, id: string): PrgProgramme | undefined {
  return store.prgProgrammes.find((p) => p.id === id && p.tenantId === tenantId && !p.archivedAt);
}

async function loadProgramme(store: Store, tenantId: string, id: string): Promise<PrgProgramme | undefined> {
  if (isMixedSqlDurable(store)) return getProgrammeById(store.dbPool, tenantId, id);
  ensureProgrammeCollections(store);
  return findProgrammeMemory(store, tenantId, id);
}

function isIsoDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = Date.parse(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed);
}

function programmeDateRangeValid(start?: string | null, end?: string | null): boolean {
  if (!start || !end) return true;
  return start <= end;
}

function rejectIfProgrammeLocked(programme: PrgProgramme) {
  if ((programme.commercialVersionLabel ?? "draft") === "final") {
    return { error: "conflict" as const, reason: "programme_version_locked" };
  }
  return undefined;
}

function invalidProgrammeDates(start?: string | null, end?: string | null) {
  if (start && !isIsoDateOnly(start)) return { error: "invalid_request" as const, reason: "invalid_start_date" };
  if (end && !isIsoDateOnly(end)) return { error: "invalid_request" as const, reason: "invalid_end_date" };
  if (!programmeDateRangeValid(start, end)) return { error: "invalid_request" as const, reason: "invalid_date_range" };
  return undefined;
}

async function loadProgrammeByRfp(store: Store, tenantId: string, rfpId: string): Promise<PrgProgramme | undefined> {
  if (isMixedSqlDurable(store)) return getProgrammeByRfpId(store.dbPool, tenantId, rfpId);
  ensureProgrammeCollections(store);
  return store.prgProgrammes.find((p) => p.rfpId === rfpId && p.tenantId === tenantId && !p.archivedAt);
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
    denyProgrammeAudit(store, principal, action, resourceType, correlationId, reason, resourceId);
  }
}

export async function getProgrammeModuleHealth(store: Store, principal: Principal) {
  ensureProgrammeCollections(store);
  const decision = authorize({
    principal,
    permission: "programme:read:programme",
    action: "read:prg_programme",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  if (isMixedSqlDurable(store)) {
    const counts = await countProgrammes(store.dbPool, principal.tenantId);
    return { module: "programme", increment: "C5", status: "ok" as const, ...counts };
  }
  const tenantId = principal.tenantId;
  const programmes = store.prgProgrammes.filter((p) => p.tenantId === tenantId && !p.archivedAt);
  const programmeIds = new Set(programmes.map((p) => p.id));
  return {
    module: "programme",
    increment: "C5",
    status: "ok" as const,
    programmes: programmes.length,
    days: store.prgDays.filter((d) => d.tenantId === tenantId && programmeIds.has(d.programmeId)).length,
    items: store.prgItems.filter((i) => i.tenantId === tenantId && programmeIds.has(i.programmeId)).length,
  };
}

export async function listProgrammes(
  store: Store,
  principal: Principal,
  query?: { rfpId?: string; status?: string },
) {
  ensureProgrammeCollections(store);
  const decision = authorize({
    principal,
    permission: "programme:read:programme",
    action: "read:prg_programme",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const items = isMixedSqlDurable(store)
    ? await listProgrammesByTenant(store.dbPool, principal.tenantId, query)
    : store.prgProgrammes
        .filter((p) => p.tenantId === principal.tenantId && !p.archivedAt)
        .filter((p) => (query?.rfpId ? p.rfpId === query.rfpId : true))
        .filter((p) => (query?.status ? p.status === query.status : true))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return { items: items.map(sanitizeProgramme) };
}

export async function getProgrammeDetail(store: Store, principal: Principal, id: string) {
  ensureProgrammeCollections(store);
  const programme = await loadProgramme(store, principal.tenantId, id);
  if (!programme) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "programme:read:programme",
    action: "read:prg_programme",
    resource: {
      tenantId: programme.tenantId,
      type: "programme",
      id: programme.id,
      classification: programme.classification,
    },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const days = isMixedSqlDurable(store)
    ? await listProgrammeDays(store.dbPool, programme.tenantId, id)
    : store.prgDays
        .filter((d) => d.programmeId === id && d.tenantId === programme.tenantId)
        .sort((a, b) => a.sortOrder - b.sortOrder || a.dayNumber - b.dayNumber);

  const items = isMixedSqlDurable(store)
    ? await listProgrammeItems(store.dbPool, programme.tenantId, id)
    : store.prgItems.filter((i) => i.programmeId === id && i.tenantId === programme.tenantId);

  const itemsByDay = new Map<string, ReturnType<typeof sanitizeItem>[]>();
  for (const day of days) {
    const dayItems = items
      .filter((i) => i.dayId === day.id)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(sanitizeItem);
    itemsByDay.set(day.id, dayItems);
  }

  const rooming = isMixedSqlDurable(store)
    ? await listProgrammeRooming(store.dbPool, programme.tenantId, id)
    : (store.prgRoomingEntries ?? []).filter((r) => r.programmeId === id && r.tenantId === programme.tenantId);

  return {
    programme: sanitizeProgramme(programme),
    days: days.map((d) => ({
      ...sanitizeDay(d),
      items: itemsByDay.get(d.id) ?? [],
    })),
    rooming: rooming.map((r) => ({
      id: r.id,
      roomType: r.roomType,
      roomCount: r.roomCount,
      occupancy: r.occupancy,
      complimentary: r.complimentary ?? false,
      supplementNotes: r.supplementNotes,
      notes: r.notes,
    })),
  };
}

export async function getProgrammeByRfp(store: Store, principal: Principal, rfpId: string) {
  ensureProgrammeCollections(store);
  const programme = await loadProgrammeByRfp(store, principal.tenantId, rfpId);
  if (!programme) return { error: "not_found" as const };
  return getProgrammeDetail(store, principal, programme.id);
}

export type CreateProgrammeInput = {
  rfpId: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  paxCount?: number;
  destinations?: string;
  days?: Array<{
    dayNumber: number;
    title: string;
    location?: string;
    calendarDate?: string;
    description?: string;
    items?: Array<{
      startTime?: string;
      title: string;
      description?: string;
      supplierId?: string;
      supplierRateId?: string;
      supplierLabel?: string;
      itemType?: string;
      quantity?: number;
      unit?: string;
    }>;
  }>;
};

function buildDay(
  programme: PrgProgramme,
  dayInput: NonNullable<CreateProgrammeInput["days"]>[number],
  sortOrder: number,
  now: string,
): { day: PrgDay; items: PrgItem[] } {
  const day: PrgDay = {
    id: newId(),
    tenantId: programme.tenantId,
    programmeId: programme.id,
    dayNumber: dayInput.dayNumber,
    title: dayInput.title.trim(),
    ...(dayInput.location !== undefined ? { location: dayInput.location } : {}),
    ...(dayInput.calendarDate !== undefined ? { calendarDate: dayInput.calendarDate } : {}),
    ...(dayInput.description !== undefined ? { description: dayInput.description } : {}),
    sortOrder,
    createdAt: now,
    updatedAt: now,
  };
  const items: PrgItem[] = [];
  if (dayInput.items?.length) {
    for (const [idx, itemInput] of dayInput.items.entries()) {
      items.push({
        id: newId(),
        tenantId: programme.tenantId,
        programmeId: programme.id,
        dayId: day.id,
        sortOrder: idx,
        ...(itemInput.startTime !== undefined ? { startTime: itemInput.startTime } : {}),
        title: itemInput.title.trim(),
        ...(itemInput.description !== undefined ? { description: itemInput.description } : {}),
        ...(itemInput.supplierId !== undefined ? { supplierId: itemInput.supplierId } : {}),
        ...(itemInput.supplierRateId !== undefined ? { supplierRateId: itemInput.supplierRateId } : {}),
        ...(itemInput.supplierLabel !== undefined ? { supplierLabel: itemInput.supplierLabel } : {}),
        ...(itemInput.itemType !== undefined && isValidProgrammeItemType(itemInput.itemType)
          ? { itemType: itemInput.itemType }
          : {}),
        ...(itemInput.quantity !== undefined ? { quantity: itemInput.quantity } : {}),
        ...(itemInput.unit !== undefined ? { unit: itemInput.unit } : {}),
        createdAt: now,
        updatedAt: now,
      });
    }
  }
  return { day, items };
}

export async function createProgramme(
  store: Store,
  principal: Principal,
  input: CreateProgrammeInput,
  correlationId: string,
) {
  ensureProgrammeCollections(store);
  const decision = authorize({
    principal,
    permission: "programme:write:programme",
    action: "create:prg_programme",
  });
  if (decision.result === "deny") {
    await deny(store, principal, "programme:write:programme", "prg_programme", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const personContent = rejectPersonDomainContent(input);
  if (personContent) return personContent;
  const dateError = invalidProgrammeDates(input.startDate ?? null, input.endDate ?? null);
  if (dateError) return dateError;

  const rfp = await loadRfp(store, principal.tenantId, input.rfpId);
  if (!rfp) return { error: "invalid_request" as const, reason: "invalid_rfp" };
  if (await loadProgrammeByRfp(store, principal.tenantId, input.rfpId)) {
    return { error: "conflict" as const, reason: "programme_exists_for_rfp" };
  }

  const programmeCode = buildProgrammeCode(rfp.rfpCode);
  if (isMixedSqlDurable(store)) {
    if (await programmeCodeExists(store.dbPool, principal.tenantId, programmeCode)) {
      return { error: "conflict" as const, reason: "duplicate_programme_code" };
    }
  } else if (store.prgProgrammes.some((p) => p.tenantId === principal.tenantId && p.programmeCode === programmeCode)) {
    return { error: "conflict" as const, reason: "duplicate_programme_code" };
  }

  const now = new Date().toISOString();
  const programme: PrgProgramme = {
    id: newId(),
    tenantId: principal.tenantId,
    programmeCode,
    rfpId: rfp.id,
    opportunityId: rfp.opportunityId,
    organizationId: rfp.organizationId,
    title: input.title?.trim() || rfp.title,
    status: "draft",
    dayCount: input.days?.length ?? 0,
    ...(input.startDate !== undefined ? { startDate: input.startDate } : {}),
    ...(input.endDate !== undefined ? { endDate: input.endDate } : {}),
    ...(input.paxCount !== undefined ? { paxCount: input.paxCount } : rfp.paxCount !== undefined ? { paxCount: rfp.paxCount } : {}),
    ...(input.destinations !== undefined ? { destinations: input.destinations } : rfp.destinations ? { destinations: rfp.destinations } : {}),
    commercialVersionLabel: "draft",
    depositPercent: H203_DEFAULT_DEPOSIT_PERCENT,
    paymentMilestones: defaultProgrammePaymentMilestones(),
    commercialResponsibleRole: "commercial_director",
    safariVehicleMaxPassengers: H203_SAFARI_VEHICLE_MAX_PASSENGERS,
    driverGuideMaxGuests: H203_DRIVER_GUIDE_MAX_GUESTS,
    classification: rfp.classification,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };

  const built = (input.days ?? []).map((dayInput, idx) => buildDay(programme, dayInput, idx, now));
  programme.dayCount = built.length;

  const advanceRfp = rfp.workflowStage === "intake" && canTransitionRfpStage("intake", "programme");
  const rfpExpected = rfp.version;
  if (advanceRfp) {
    rfp.workflowStage = "programme";
    rfp.updatedAt = now;
    rfp.version += 1;
    rfp.updatedByPrincipalId = principal.id;
  }

  if (isMixedSqlDurable(store)) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        await insertProgramme(client, programme);
        for (const { day, items } of built) {
          await insertProgrammeDay(client, day);
          for (const item of items) await insertProgrammeItem(client, item);
        }
        if (advanceRfp) await persistRfpStageAdvanceInTx(client, rfp, rfpExpected);
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(
            principal,
            "programme:write:programme",
            "prg_programme",
            programme.id,
            correlationId,
            sanitizeProgramme(programme),
          ),
        );
        const outbox = await insertDomainOutbox(client, {
          principal,
          eventType: PROGRAMME_EVENT_TYPES[0],
          payload: { programmeId: programme.id, rfpId: programme.rfpId },
          classification: programme.classification,
          correlationId,
          aggregateId: programme.id,
        });
        return { audit, outbox };
      });
      rememberPostCommit(store, committed.audit, committed.outbox);
    } catch (error) {
      if (isUniqueViolation(error)) return { error: "conflict" as const, reason: "duplicate_programme_code" };
      if (error instanceof OptimisticConcurrencyError) return { error: "conflict" as const, reason: "stale_version" };
      throw error;
    }
    return getProgrammeDetail(store, principal, programme.id);
  }

  store.prgProgrammes.push(programme);
  for (const { day, items } of built) {
    store.prgDays.push(day);
    store.prgItems.push(...items);
  }
  allowProgrammeAudit(
    store,
    principal,
    "programme:write:programme",
    "prg_programme",
    programme.id,
    correlationId,
    sanitizeProgramme(programme),
  );
  return getProgrammeDetail(store, principal, programme.id);
}

export type AddProgrammeDayInput = {
  dayNumber: number;
  title: string;
  location?: string;
  calendarDate?: string;
  description?: string;
};

export async function addProgrammeDay(
  store: Store,
  principal: Principal,
  programmeId: string,
  input: AddProgrammeDayInput,
  correlationId: string,
) {
  ensureProgrammeCollections(store);
  const programme = await loadProgramme(store, principal.tenantId, programmeId);
  if (!programme) return { error: "not_found" as const };
  const locked = rejectIfProgrammeLocked(programme);
  if (locked) return locked;

  const decision = authorize({
    principal,
    permission: "programme:write:day",
    action: "create:prg_day",
    resource: {
      tenantId: programme.tenantId,
      type: "programme",
      id: programme.id,
      classification: programme.classification,
    },
  });
  if (decision.result === "deny") {
    await deny(store, principal, "programme:write:day", "prg_day", correlationId, decision.reason, programmeId);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (!Number.isFinite(input.dayNumber) || input.dayNumber < 1) {
    return { error: "invalid_request" as const, reason: "day_number_required" };
  }
  if (!input.title?.trim()) {
    return { error: "invalid_request" as const, reason: "title_required" };
  }
  if (input.calendarDate !== undefined && input.calendarDate && !isIsoDateOnly(input.calendarDate)) {
    return { error: "invalid_request" as const, reason: "invalid_calendar_date" };
  }

  if (isMixedSqlDurable(store)) {
    if (await dayNumberExists(store.dbPool, programmeId, input.dayNumber)) {
      return { error: "conflict" as const, reason: "duplicate_day_number" };
    }
  } else if (store.prgDays.some((d) => d.programmeId === programmeId && d.dayNumber === input.dayNumber)) {
    return { error: "conflict" as const, reason: "duplicate_day_number" };
  }

  const now = new Date().toISOString();
  const sortOrder = isMixedSqlDurable(store)
    ? await countDaysForProgramme(store.dbPool, programmeId)
    : store.prgDays.filter((d) => d.programmeId === programmeId).length;
  const { day } = buildDay(programme, { ...input, items: [] }, sortOrder, now);
  const expectedVersion = programme.version;
  programme.dayCount += 1;
  programme.updatedAt = now;
  programme.version += 1;

  if (isMixedSqlDurable(store)) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        const updated = await updateProgrammeOptimistic(client, programme, expectedVersion);
        if (updated === 0) throw new OptimisticConcurrencyError("programme");
        await insertProgrammeDay(client, day);
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(principal, "programme:write:day", "prg_day", day.id, correlationId, sanitizeDay(day)),
        );
        const outbox = await insertDomainOutbox(client, {
          principal,
          eventType: PROGRAMME_EVENT_TYPES[2],
          payload: { programmeId, dayId: day.id, dayNumber: day.dayNumber },
          classification: programme.classification,
          correlationId,
          aggregateId: programme.id,
        });
        return { audit, outbox };
      });
      rememberPostCommit(store, committed.audit, committed.outbox);
    } catch (error) {
      if (error instanceof OptimisticConcurrencyError) return { error: "conflict" as const, reason: "stale_version" };
      if (isUniqueViolation(error)) return { error: "conflict" as const, reason: "duplicate_day_number" };
      throw error;
    }
    return { day: sanitizeDay(day) };
  }

  store.prgDays.push(day);
  allowProgrammeAudit(store, principal, "programme:write:day", "prg_day", day.id, correlationId, sanitizeDay(day));
  return { day: sanitizeDay(day) };
}

export type AddProgrammeItemInput = {
  startTime?: string;
  title: string;
  description?: string;
  supplierId?: string;
  supplierRateId?: string;
  supplierLabel?: string;
  itemType?: string;
  quantity?: number;
  unit?: string;
  notes?: string;
  visibility?: string;
};

export async function addProgrammeItem(
  store: Store,
  principal: Principal,
  programmeId: string,
  dayId: string,
  input: AddProgrammeItemInput,
  correlationId: string,
) {
  ensureProgrammeCollections(store);
  const programme = await loadProgramme(store, principal.tenantId, programmeId);
  if (!programme) return { error: "not_found" as const };
  const locked = rejectIfProgrammeLocked(programme);
  if (locked) return locked;

  const day = isMixedSqlDurable(store)
    ? await getProgrammeDay(store.dbPool, programme.tenantId, programmeId, dayId)
    : store.prgDays.find((d) => d.id === dayId && d.programmeId === programmeId && d.tenantId === programme.tenantId);
  if (!day) return { error: "not_found" as const, reason: "day_not_found" };

  const decision = authorize({
    principal,
    permission: "programme:write:item",
    action: "create:prg_item",
    resource: {
      tenantId: programme.tenantId,
      type: "programme",
      id: programme.id,
      classification: programme.classification,
    },
  });
  if (decision.result === "deny") {
    await deny(store, principal, "programme:write:item", "prg_item", correlationId, decision.reason, programmeId);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (!input.title?.trim()) {
    return { error: "invalid_request" as const, reason: "title_required" };
  }
  if (input.itemType !== undefined && !isValidProgrammeItemType(input.itemType)) {
    return { error: "invalid_request" as const, reason: "invalid_item_type" };
  }
  if (input.visibility !== undefined && !isValidProgrammeItemVisibility(input.visibility)) {
    return { error: "invalid_request" as const, reason: "invalid_visibility" };
  }
  if (input.quantity !== undefined && (typeof input.quantity !== "number" || input.quantity < 0)) {
    return { error: "invalid_request" as const, reason: "invalid_quantity" };
  }

  const now = new Date().toISOString();
  const sortOrder = isMixedSqlDurable(store)
    ? await countItemsForDay(store.dbPool, dayId)
    : store.prgItems.filter((i) => i.dayId === dayId).length;
  const item: PrgItem = {
    id: newId(),
    tenantId: programme.tenantId,
    programmeId: programme.id,
    dayId,
    sortOrder,
    ...(input.startTime !== undefined ? { startTime: input.startTime } : {}),
    title: input.title.trim(),
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.supplierId !== undefined ? { supplierId: input.supplierId } : {}),
    ...(input.supplierRateId !== undefined ? { supplierRateId: input.supplierRateId } : {}),
    ...(input.supplierLabel !== undefined ? { supplierLabel: input.supplierLabel } : {}),
    ...(input.itemType !== undefined ? { itemType: input.itemType } : {}),
    ...(input.quantity !== undefined ? { quantity: input.quantity } : {}),
    ...(input.unit !== undefined ? { unit: input.unit } : {}),
    ...(input.notes !== undefined ? { notes: input.notes } : {}),
    ...(input.visibility !== undefined ? { visibility: input.visibility } : {}),
    createdAt: now,
    updatedAt: now,
  };
  const expectedVersion = programme.version;
  programme.updatedAt = now;
  programme.version += 1;

  if (isMixedSqlDurable(store)) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        const updated = await updateProgrammeOptimistic(client, programme, expectedVersion);
        if (updated === 0) throw new OptimisticConcurrencyError("programme");
        await insertProgrammeItem(client, item);
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(principal, "programme:write:item", "prg_item", item.id, correlationId, sanitizeItem(item)),
        );
        const outbox = await insertDomainOutbox(client, {
          principal,
          eventType: PROGRAMME_EVENT_TYPES[3],
          payload: { programmeId, itemId: item.id, dayId },
          classification: programme.classification,
          correlationId,
          aggregateId: programme.id,
        });
        return { audit, outbox };
      });
      rememberPostCommit(store, committed.audit, committed.outbox);
    } catch (error) {
      if (error instanceof OptimisticConcurrencyError) return { error: "conflict" as const, reason: "stale_version" };
      throw error;
    }
    return { item: sanitizeItem(item) };
  }

  store.prgItems.push(item);
  allowProgrammeAudit(store, principal, "programme:write:item", "prg_item", item.id, correlationId, sanitizeItem(item));
  return { item: sanitizeItem(item) };
}

export type PatchProgrammeInput = {
  title?: string;
  internalNotes?: string | null;
  clientNotes?: string | null;
  destinations?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  paxCount?: number | null;
  commercialVersionLabel?: string;
  depositPercent?: number;
  paymentMilestones?: ProgrammePaymentMilestone[];
  inclusionsText?: string | null;
  exclusionsText?: string | null;
  nightCountOverride?: number | null;
  nightCountOverrideReason?: string | null;
  commercialResponsibleRole?: string;
  safariVehicleMaxPassengers?: number;
  driverGuideMaxGuests?: number;
  requiredVehiclesOverride?: number | null;
  requiredVehiclesOverrideReason?: string | null;
};

export async function patchProgramme(
  store: Store,
  principal: Principal,
  programmeId: string,
  input: PatchProgrammeInput,
  correlationId: string,
) {
  ensureProgrammeCollections(store);
  const programme = await loadProgramme(store, principal.tenantId, programmeId);
  if (!programme) return { error: "not_found" as const };
  const decision = authorize({
    principal,
    permission: "programme:write:programme",
    action: "patch:prg_programme",
    resource: {
      tenantId: programme.tenantId,
      type: "programme",
      id: programme.id,
      classification: programme.classification,
    },
  });
  if (decision.result === "deny") {
    await deny(store, principal, "programme:write:programme", "prg_programme", correlationId, decision.reason, programmeId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const personContent = rejectPersonDomainContent(input);
  if (personContent) return personContent;
  const mutatingStructure =
    input.title !== undefined ||
    input.internalNotes !== undefined ||
    input.clientNotes !== undefined ||
    input.destinations !== undefined ||
    input.startDate !== undefined ||
    input.endDate !== undefined ||
    input.paxCount !== undefined ||
    input.depositPercent !== undefined ||
    input.paymentMilestones !== undefined ||
    input.inclusionsText !== undefined ||
    input.exclusionsText !== undefined ||
    input.nightCountOverride !== undefined ||
    input.requiredVehiclesOverride !== undefined;
  if (mutatingStructure && rejectIfProgrammeLocked(programme)) {
    return { error: "conflict" as const, reason: "programme_version_locked" };
  }
  if (input.commercialVersionLabel !== undefined && !isValidProgrammeCommercialVersionLabel(input.commercialVersionLabel)) {
    return { error: "invalid_request" as const, reason: "invalid_commercial_version_label" };
  }

  const nextStart = input.startDate !== undefined ? input.startDate : (programme.startDate ?? null);
  const nextEnd = input.endDate !== undefined ? input.endDate : (programme.endDate ?? null);
  const dateError = invalidProgrammeDates(nextStart, nextEnd);
  if (dateError) return dateError;
  if (input.title !== undefined) {
    const title = input.title?.trim();
    if (!title) return { error: "invalid_request" as const, reason: "title_required" };
  }
  if (input.paxCount !== undefined && input.paxCount !== null && (typeof input.paxCount !== "number" || input.paxCount < 0)) {
    return { error: "invalid_request" as const, reason: "invalid_pax_count" };
  }
  if (input.depositPercent !== undefined) {
    if (typeof input.depositPercent !== "number" || input.depositPercent < 0 || input.depositPercent > 100) {
      return { error: "invalid_request" as const, reason: "invalid_deposit_percent" };
    }
  }
  if (input.paymentMilestones !== undefined) {
    if (!Array.isArray(input.paymentMilestones) || !paymentMilestonesTotalOneHundred(input.paymentMilestones)) {
      return { error: "invalid_request" as const, reason: "milestones_must_total_100" };
    }
  }
  if (input.nightCountOverride !== undefined && input.nightCountOverride !== null) {
    const derived = programmeNightCount(nextStart, nextEnd);
    if (derived !== undefined && input.nightCountOverride !== derived && !input.nightCountOverrideReason?.trim()) {
      return { error: "invalid_request" as const, reason: "night_count_override_requires_reason" };
    }
  }
  if (input.commercialResponsibleRole !== undefined) {
    if (input.commercialResponsibleRole !== "ceo_md" && input.commercialResponsibleRole !== "commercial_director") {
      return { error: "invalid_request" as const, reason: "invalid_commercial_responsible_role" };
    }
  }
  if (input.safariVehicleMaxPassengers !== undefined) {
    if (typeof input.safariVehicleMaxPassengers !== "number" || input.safariVehicleMaxPassengers < 1) {
      return { error: "invalid_request" as const, reason: "invalid_vehicle_capacity" };
    }
  }
  if (input.driverGuideMaxGuests !== undefined) {
    if (typeof input.driverGuideMaxGuests !== "number" || input.driverGuideMaxGuests < 1) {
      return { error: "invalid_request" as const, reason: "invalid_driver_guide_max" };
    }
  }
  if (input.requiredVehiclesOverride !== undefined && input.requiredVehiclesOverride !== null) {
    if (!input.requiredVehiclesOverrideReason?.trim()) {
      return { error: "invalid_request" as const, reason: "vehicle_override_requires_reason" };
    }
  }

  if (input.title !== undefined) programme.title = input.title.trim();
  if (input.internalNotes !== undefined) {
    const internalNotes = input.internalNotes?.trim();
    if (internalNotes) programme.internalNotes = internalNotes;
    else delete programme.internalNotes;
  }
  if (input.clientNotes !== undefined) {
    const clientNotes = input.clientNotes?.trim();
    if (clientNotes) programme.clientNotes = clientNotes;
    else delete programme.clientNotes;
  }
  if (input.destinations !== undefined) {
    const destinations = input.destinations?.trim();
    if (destinations) programme.destinations = destinations;
    else delete programme.destinations;
  }
  if (input.startDate !== undefined) {
    if (input.startDate) programme.startDate = input.startDate;
    else delete programme.startDate;
  }
  if (input.endDate !== undefined) {
    if (input.endDate) programme.endDate = input.endDate;
    else delete programme.endDate;
  }
  if (input.paxCount !== undefined) {
    if (input.paxCount === null) delete programme.paxCount;
    else programme.paxCount = input.paxCount;
  }
  if (input.depositPercent !== undefined) programme.depositPercent = input.depositPercent;
  if (input.paymentMilestones !== undefined) programme.paymentMilestones = input.paymentMilestones;
  if (input.inclusionsText !== undefined) {
    const text = input.inclusionsText?.trim();
    if (text) programme.inclusionsText = text;
    else delete programme.inclusionsText;
  }
  if (input.exclusionsText !== undefined) {
    const text = input.exclusionsText?.trim();
    if (text) programme.exclusionsText = text;
    else delete programme.exclusionsText;
  }
  if (input.nightCountOverride !== undefined) {
    if (input.nightCountOverride === null) {
      delete programme.nightCountOverride;
      delete programme.nightCountOverrideReason;
    } else {
      programme.nightCountOverride = input.nightCountOverride;
      if (input.nightCountOverrideReason?.trim()) {
        programme.nightCountOverrideReason = input.nightCountOverrideReason.trim();
      }
    }
  }
  if (input.commercialResponsibleRole !== undefined) {
    programme.commercialResponsibleRole = input.commercialResponsibleRole;
  }
  if (input.safariVehicleMaxPassengers !== undefined) {
    programme.safariVehicleMaxPassengers = input.safariVehicleMaxPassengers;
  }
  if (input.driverGuideMaxGuests !== undefined) {
    programme.driverGuideMaxGuests = input.driverGuideMaxGuests;
  }
  if (input.requiredVehiclesOverride !== undefined) {
    if (input.requiredVehiclesOverride === null) {
      delete programme.requiredVehiclesOverride;
      delete programme.requiredVehiclesOverrideReason;
    } else {
      programme.requiredVehiclesOverride = input.requiredVehiclesOverride;
      programme.requiredVehiclesOverrideReason = input.requiredVehiclesOverrideReason.trim();
    }
  }
  const previousLabel = programme.commercialVersionLabel ?? "draft";
  const becomingFinal =
    input.commercialVersionLabel === "final" && previousLabel !== "final";
  if (input.commercialVersionLabel !== undefined) {
    programme.commercialVersionLabel = input.commercialVersionLabel;
  }
  const now = new Date().toISOString();
  const expectedVersion = programme.version;
  programme.updatedAt = now;
  programme.updatedByPrincipalId = principal.id;
  programme.version += 1;

  if (isMixedSqlDurable(store)) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        const updated = await updateProgrammeOptimistic(client, programme, expectedVersion);
        if (updated === 0) throw new OptimisticConcurrencyError("programme");
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(
            principal,
            "programme:write:programme",
            "prg_programme",
            programme.id,
            correlationId,
            sanitizeProgramme(programme),
          ),
        );
        const outbox = await insertDomainOutbox(client, {
          principal,
          eventType: PROGRAMME_EVENT_TYPES[1],
          payload: { programmeId: programme.id },
          classification: programme.classification,
          correlationId,
          aggregateId: programme.id,
        });
        return { audit, outbox };
      });
      rememberPostCommit(store, committed.audit, committed.outbox);
    } catch (error) {
      if (error instanceof OptimisticConcurrencyError) return { error: "conflict" as const, reason: "stale_version" };
      throw error;
    }
  } else {
    allowProgrammeAudit(store, principal, "programme:write:programme", "prg_programme", programme.id, correlationId, sanitizeProgramme(programme));
  }

  if (becomingFinal) {
    await createProgrammeVersion(store, principal, programme.id, "Commercial version labelled final", correlationId);
  }
  return { programme: sanitizeProgramme(programme) };
}

export type PatchProgrammeItemInput = {
  title?: string;
  description?: string | null;
  startTime?: string | null;
  supplierId?: string | null;
  supplierRateId?: string | null;
  supplierLabel?: string | null;
  itemType?: string | null;
  quantity?: number | null;
  unit?: string | null;
  notes?: string | null;
  visibility?: string | null;
  sortOrder?: number;
};

export async function patchProgrammeItem(
  store: Store,
  principal: Principal,
  programmeId: string,
  itemId: string,
  input: PatchProgrammeItemInput,
  correlationId: string,
) {
  ensureProgrammeCollections(store);
  const programme = await loadProgramme(store, principal.tenantId, programmeId);
  if (!programme) return { error: "not_found" as const };
  const item = isMixedSqlDurable(store)
    ? await getProgrammeItem(store.dbPool, programme.tenantId, programmeId, itemId)
    : store.prgItems.find((i) => i.id === itemId && i.programmeId === programmeId && i.tenantId === programme.tenantId);
  if (!item) return { error: "not_found" as const };
  const locked = rejectIfProgrammeLocked(programme);
  if (locked) return locked;
  const decision = authorize({
    principal,
    permission: "programme:write:item",
    action: "patch:prg_item",
    resource: {
      tenantId: programme.tenantId,
      type: "programme",
      id: programme.id,
      classification: programme.classification,
    },
  });
  if (decision.result === "deny") {
    await deny(store, principal, "programme:write:item", "prg_item", correlationId, decision.reason, programmeId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const personContent = rejectPersonDomainContent(input);
  if (personContent) return personContent;
  if (input.title !== undefined) {
    const title = input.title?.trim();
    if (!title) return { error: "invalid_request" as const, reason: "title_required" };
    item.title = title;
  }
  if (input.description !== undefined) {
    const description = input.description?.trim();
    if (description) item.description = description;
    else delete item.description;
  }
  if (input.startTime !== undefined) {
    if (input.startTime) item.startTime = input.startTime;
    else delete item.startTime;
  }
  if (input.supplierId !== undefined) {
    if (input.supplierId) item.supplierId = input.supplierId;
    else delete item.supplierId;
  }
  if (input.supplierRateId !== undefined) {
    if (input.supplierRateId) item.supplierRateId = input.supplierRateId;
    else delete item.supplierRateId;
  }
  if (input.supplierLabel !== undefined) {
    const supplierLabel = input.supplierLabel?.trim();
    if (supplierLabel) item.supplierLabel = supplierLabel;
    else delete item.supplierLabel;
  }
  if (input.itemType !== undefined) {
    if (input.itemType !== null && !isValidProgrammeItemType(input.itemType)) {
      return { error: "invalid_request" as const, reason: "invalid_item_type" };
    }
    if (input.itemType) item.itemType = input.itemType;
    else delete item.itemType;
  }
  if (input.visibility !== undefined) {
    if (input.visibility !== null && !isValidProgrammeItemVisibility(input.visibility)) {
      return { error: "invalid_request" as const, reason: "invalid_visibility" };
    }
    if (input.visibility) item.visibility = input.visibility;
    else delete item.visibility;
  }
  if (input.quantity !== undefined) {
    if (input.quantity !== null && (typeof input.quantity !== "number" || input.quantity < 0)) {
      return { error: "invalid_request" as const, reason: "invalid_quantity" };
    }
    if (input.quantity === null) delete item.quantity;
    else item.quantity = input.quantity;
  }
  if (input.unit !== undefined) {
    const unit = input.unit?.trim();
    if (unit) item.unit = unit;
    else delete item.unit;
  }
  if (input.notes !== undefined) {
    const notes = input.notes?.trim();
    if (notes) item.notes = notes;
    else delete item.notes;
  }
  if (input.sortOrder !== undefined) {
    if (!Number.isFinite(input.sortOrder) || input.sortOrder < 0) {
      return { error: "invalid_request" as const, reason: "invalid_sort_order" };
    }
    item.sortOrder = input.sortOrder;
  }
  const now = new Date().toISOString();
  const expectedVersion = programme.version;
  item.updatedAt = now;
  programme.updatedAt = now;
  programme.version += 1;

  if (isMixedSqlDurable(store)) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        const updated = await updateProgrammeOptimistic(client, programme, expectedVersion);
        if (updated === 0) throw new OptimisticConcurrencyError("programme");
        await updateProgrammeItem(client, item);
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(principal, "programme:write:item", "prg_item", item.id, correlationId, sanitizeItem(item)),
        );
        return { audit };
      });
      rememberPostCommit(store, committed.audit);
    } catch (error) {
      if (error instanceof OptimisticConcurrencyError) return { error: "conflict" as const, reason: "stale_version" };
      throw error;
    }
    return { item: sanitizeItem(item) };
  }

  allowProgrammeAudit(store, principal, "programme:write:item", "prg_item", item.id, correlationId, sanitizeItem(item));
  return { item: sanitizeItem(item) };
}

export async function createProgrammeVersion(
  store: Store,
  principal: Principal,
  programmeId: string,
  summary: string,
  correlationId: string,
) {
  ensureProgrammeCollections(store);
  if (!store.prgProgrammeVersions) store.prgProgrammeVersions = [];
  const programme = await loadProgramme(store, principal.tenantId, programmeId);
  if (!programme) return { error: "not_found" as const };
  const decision = authorize({
    principal,
    permission: "programme:write:programme",
    action: "create:prg_programme_version",
    resource: {
      tenantId: programme.tenantId,
      type: "programme",
      id: programme.id,
      classification: programme.classification,
    },
  });
  if (decision.result === "deny") {
    await deny(store, principal, "programme:write:programme", "prg_programme_version", correlationId, decision.reason, programmeId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (!summary?.trim()) return { error: "invalid_request" as const, reason: "summary_required" };

  const days = isMixedSqlDurable(store)
    ? await listProgrammeDays(store.dbPool, programme.tenantId, programmeId)
    : store.prgDays.filter((d) => d.programmeId === programmeId);
  const items = isMixedSqlDurable(store)
    ? await listProgrammeItems(store.dbPool, programme.tenantId, programmeId)
    : store.prgItems.filter((i) => i.programmeId === programmeId);
  const versionNumber = isMixedSqlDurable(store)
    ? await nextProgrammeVersionNumber(store.dbPool, programmeId)
    : store.prgProgrammeVersions.filter((v) => v.programmeId === programmeId).reduce((m, v) => Math.max(m, v.versionNumber), 0) + 1;
  const now = new Date().toISOString();
  const version: PrgProgrammeVersion = {
    id: newId(),
    tenantId: principal.tenantId,
    programmeId,
    versionNumber,
    summary: summary.trim(),
    snapshot: {
      title: programme.title,
      dayCount: days.length,
      itemCount: items.length,
      ...(programme.destinations ? { destinations: programme.destinations } : {}),
      commercialVersionLabel: programme.commercialVersionLabel ?? "draft",
    },
    createdAt: now,
    createdByPrincipalId: principal.id,
  };
  const expectedVersion = programme.version;
  programme.updatedAt = now;
  programme.version += 1;

  if (isMixedSqlDurable(store)) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        const updated = await updateProgrammeOptimistic(client, programme, expectedVersion);
        if (updated === 0) throw new OptimisticConcurrencyError("programme");
        await insertProgrammeVersion(client, version);
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(principal, "programme:write:programme", "prg_programme_version", version.id, correlationId, {
            versionNumber,
            summary: version.summary,
          }),
        );
        return { audit };
      });
      rememberPostCommit(store, committed.audit);
    } catch (error) {
      if (error instanceof OptimisticConcurrencyError) return { error: "conflict" as const, reason: "stale_version" };
      if (isUniqueViolation(error)) return { error: "conflict" as const, reason: "duplicate_version" };
      throw error;
    }
  } else {
    store.prgProgrammeVersions.push(version);
    allowProgrammeAudit(store, principal, "programme:write:programme", "prg_programme_version", version.id, correlationId, {
      versionNumber,
      summary: version.summary,
    });
  }

  return {
    version: {
      id: version.id,
      programmeId: version.programmeId,
      versionNumber: version.versionNumber,
      summary: version.summary,
      snapshot: version.snapshot,
      createdAt: version.createdAt,
    },
  };
}

export type AddProgrammeRoomingInput = {
  roomType: string;
  roomCount: number;
  occupancy?: number;
  complimentary?: boolean;
  supplementNotes?: string;
  notes?: string;
};

export async function addProgrammeRooming(
  store: Store,
  principal: Principal,
  programmeId: string,
  input: AddProgrammeRoomingInput,
  correlationId: string,
) {
  ensureProgrammeCollections(store);
  const programme = await loadProgramme(store, principal.tenantId, programmeId);
  if (!programme) return { error: "not_found" as const };
  const decision = authorize({
    principal,
    permission: "programme:write:programme",
    action: "create:prg_rooming",
    resource: {
      tenantId: programme.tenantId,
      type: "programme",
      id: programme.id,
      classification: programme.classification,
    },
  });
  if (decision.result === "deny") {
    await deny(store, principal, "programme:write:programme", "prg_programme", correlationId, decision.reason, programmeId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (rejectIfProgrammeLocked(programme)) {
    return { error: "conflict" as const, reason: "programme_version_locked" };
  }
  if (!isValidProgrammeRoomType(input.roomType)) {
    return { error: "invalid_request" as const, reason: "invalid_room_type" };
  }
  if (typeof input.roomCount !== "number" || input.roomCount < 0) {
    return { error: "invalid_request" as const, reason: "invalid_room_count" };
  }
  const now = new Date().toISOString();
  const entry: PrgRoomingEntry = {
    id: newId(),
    tenantId: programme.tenantId,
    programmeId: programme.id,
    roomType: input.roomType,
    roomCount: input.roomCount,
    createdAt: now,
    updatedAt: now,
  };
  if (input.occupancy !== undefined) entry.occupancy = input.occupancy;
  if (input.complimentary) entry.complimentary = true;
  if (input.supplementNotes?.trim()) entry.supplementNotes = input.supplementNotes.trim();
  if (input.notes?.trim()) entry.notes = input.notes.trim();

  if (isMixedSqlDurable(store)) {
    await insertProgrammeRooming(store.dbPool, entry);
  } else {
    store.prgRoomingEntries.push(entry);
  }
  return getProgrammeDetail(store, principal, programmeId);
}
