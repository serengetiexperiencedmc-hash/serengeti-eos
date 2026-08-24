import {
  authorize,
  buildProgrammeCode,
  canTransitionRfpStage,
  newId,
  type Principal,
  type PrgDay,
  type PrgItem,
  type PrgProgramme,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowProgrammeAudit, denyProgrammeAudit } from "./audit.js";
import { ensureProgrammeCollections } from "./collections.js";

function sanitizeProgramme(p: PrgProgramme) {
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
  };
}

function findProgramme(store: Store, tenantId: string, id: string): PrgProgramme | undefined {
  return store.prgProgrammes.find((p) => p.id === id && p.tenantId === tenantId && !p.archivedAt);
}

function findProgrammeByRfp(store: Store, tenantId: string, rfpId: string): PrgProgramme | undefined {
  return store.prgProgrammes.find((p) => p.rfpId === rfpId && p.tenantId === tenantId && !p.archivedAt);
}

export function getProgrammeModuleHealth(store: Store, principal: Principal) {
  ensureProgrammeCollections(store);
  const decision = authorize({
    principal,
    permission: "programme:read:programme",
    action: "read:prg_programme",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
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

export function listProgrammes(
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

  let items = store.prgProgrammes.filter((p) => p.tenantId === principal.tenantId && !p.archivedAt);
  if (query?.rfpId) items = items.filter((p) => p.rfpId === query.rfpId);
  if (query?.status) items = items.filter((p) => p.status === query.status);
  items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return { items: items.map(sanitizeProgramme) };
}

export function getProgrammeDetail(store: Store, principal: Principal, id: string) {
  ensureProgrammeCollections(store);
  const programme = findProgramme(store, principal.tenantId, id);
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

  const days = store.prgDays
    .filter((d) => d.programmeId === id && d.tenantId === programme.tenantId)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.dayNumber - b.dayNumber);

  const itemsByDay = new Map<string, ReturnType<typeof sanitizeItem>[]>();
  for (const day of days) {
    const items = store.prgItems
      .filter((i) => i.dayId === day.id && i.tenantId === programme.tenantId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(sanitizeItem);
    itemsByDay.set(day.id, items);
  }

  return {
    programme: sanitizeProgramme(programme),
    days: days.map((d) => ({
      ...sanitizeDay(d),
      items: itemsByDay.get(d.id) ?? [],
    })),
  };
}

export function getProgrammeByRfp(store: Store, principal: Principal, rfpId: string) {
  ensureProgrammeCollections(store);
  const programme = findProgrammeByRfp(store, principal.tenantId, rfpId);
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
    items?: Array<{
      startTime?: string;
      title: string;
      description?: string;
      supplierId?: string;
      supplierRateId?: string;
      supplierLabel?: string;
    }>;
  }>;
};

export function createProgramme(
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
    denyProgrammeAudit(store, principal, "programme:write:programme", "prg_programme", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const rfp = store.rfpRfps.find(
    (r) => r.id === input.rfpId && r.tenantId === principal.tenantId && !r.archivedAt,
  );
  if (!rfp) return { error: "invalid_request" as const, reason: "invalid_rfp" };
  if (findProgrammeByRfp(store, principal.tenantId, input.rfpId)) {
    return { error: "conflict" as const, reason: "programme_exists_for_rfp" };
  }

  const programmeCode = buildProgrammeCode(rfp.rfpCode);
  if (store.prgProgrammes.some((p) => p.tenantId === principal.tenantId && p.programmeCode === programmeCode)) {
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
    ...(input.startDate !== undefined ? { startDate: input.startDate } : rfp.travelDates ? {} : {}),
    ...(input.endDate !== undefined ? { endDate: input.endDate } : {}),
    paxCount: input.paxCount ?? rfp.paxCount,
    destinations: input.destinations ?? rfp.destinations,
    classification: rfp.classification,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };

  store.prgProgrammes.push(programme);

  if (input.days?.length) {
    for (const [idx, dayInput] of input.days.entries()) {
      addDayInternal(store, programme, dayInput, idx, now);
    }
    programme.dayCount = input.days.length;
  }

  if (rfp.workflowStage === "intake" && canTransitionRfpStage("intake", "programme")) {
    rfp.workflowStage = "programme";
    rfp.updatedAt = now;
    rfp.version += 1;
    rfp.updatedByPrincipalId = principal.id;
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

function addDayInternal(
  store: Store,
  programme: PrgProgramme,
  dayInput: NonNullable<CreateProgrammeInput["days"]>[number],
  sortOrder: number,
  now: string,
): PrgDay {
  const day: PrgDay = {
    id: newId(),
    tenantId: programme.tenantId,
    programmeId: programme.id,
    dayNumber: dayInput.dayNumber,
    title: dayInput.title.trim(),
    ...(dayInput.location !== undefined ? { location: dayInput.location } : {}),
    ...(dayInput.calendarDate !== undefined ? { calendarDate: dayInput.calendarDate } : {}),
    sortOrder,
    createdAt: now,
    updatedAt: now,
  };
  store.prgDays.push(day);

  if (dayInput.items?.length) {
    for (const [idx, itemInput] of dayInput.items.entries()) {
      const item: PrgItem = {
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
        createdAt: now,
        updatedAt: now,
      };
      store.prgItems.push(item);
    }
  }

  return day;
}

export type AddProgrammeDayInput = {
  dayNumber: number;
  title: string;
  location?: string;
  calendarDate?: string;
};

export function addProgrammeDay(
  store: Store,
  principal: Principal,
  programmeId: string,
  input: AddProgrammeDayInput,
  correlationId: string,
) {
  ensureProgrammeCollections(store);
  const programme = findProgramme(store, principal.tenantId, programmeId);
  if (!programme) return { error: "not_found" as const };

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
    denyProgrammeAudit(store, principal, "programme:write:day", "prg_day", correlationId, decision.reason, programmeId);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (!Number.isFinite(input.dayNumber) || input.dayNumber < 1) {
    return { error: "invalid_request" as const, reason: "day_number_required" };
  }
  if (!input.title?.trim()) {
    return { error: "invalid_request" as const, reason: "title_required" };
  }

  if (store.prgDays.some((d) => d.programmeId === programmeId && d.dayNumber === input.dayNumber)) {
    return { error: "conflict" as const, reason: "duplicate_day_number" };
  }

  const now = new Date().toISOString();
  const sortOrder = store.prgDays.filter((d) => d.programmeId === programmeId).length;
  const day = addDayInternal(store, programme, { ...input, items: [] }, sortOrder, now);
  programme.dayCount += 1;
  programme.updatedAt = now;
  programme.version += 1;

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
};

export function addProgrammeItem(
  store: Store,
  principal: Principal,
  programmeId: string,
  dayId: string,
  input: AddProgrammeItemInput,
  correlationId: string,
) {
  ensureProgrammeCollections(store);
  const programme = findProgramme(store, principal.tenantId, programmeId);
  if (!programme) return { error: "not_found" as const };

  const day = store.prgDays.find(
    (d) => d.id === dayId && d.programmeId === programmeId && d.tenantId === programme.tenantId,
  );
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
    denyProgrammeAudit(store, principal, "programme:write:item", "prg_item", correlationId, decision.reason, programmeId);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (!input.title?.trim()) {
    return { error: "invalid_request" as const, reason: "title_required" };
  }

  const now = new Date().toISOString();
  const sortOrder = store.prgItems.filter((i) => i.dayId === dayId).length;
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
    createdAt: now,
    updatedAt: now,
  };
  store.prgItems.push(item);
  programme.updatedAt = now;
  programme.version += 1;

  allowProgrammeAudit(store, principal, "programme:write:item", "prg_item", item.id, correlationId, sanitizeItem(item));
  return { item: sanitizeItem(item) };
}
