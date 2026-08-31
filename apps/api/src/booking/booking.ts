import {
  authorize,
  buildBookingCode,
  canCreateBooking,
  DEFAULT_HANDOVER_TASKS,
  newId,
  type BkgBooking,
  type BkgHandoverTask,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowBookingAudit, denyBookingAudit } from "./audit.js";
import { ensureBookingCollections } from "./collections.js";

function sanitizeBooking(b: BkgBooking) {
  return {
    id: b.id,
    bookingCode: b.bookingCode,
    proposalId: b.proposalId,
    rfpId: b.rfpId,
    programmeId: b.programmeId,
    opportunityId: b.opportunityId,
    organizationId: b.organizationId,
    title: b.title,
    status: b.status,
    paxCount: b.paxCount,
    travelDates: b.travelDates,
    destinations: b.destinations,
    currency: b.currency,
    sellPrice: b.sellPrice,
    confirmedAt: b.confirmedAt,
    handoverCompletedAt: b.handoverCompletedAt,
    assignedOperationsPrincipalId: b.assignedOperationsPrincipalId,
    classification: b.classification,
    version: b.version,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  };
}

function sanitizeTask(t: BkgHandoverTask) {
  return {
    id: t.id,
    bookingId: t.bookingId,
    taskKey: t.taskKey,
    label: t.label,
    status: t.status,
    sortOrder: t.sortOrder,
    completedAt: t.completedAt,
    completedByPrincipalId: t.completedByPrincipalId,
  };
}

function findBooking(store: Store, tenantId: string, id: string): BkgBooking | undefined {
  return store.bkgBookings.find((b) => b.id === id && b.tenantId === tenantId && !b.archivedAt);
}

function findBookingByProposal(store: Store, tenantId: string, proposalId: string): BkgBooking | undefined {
  return store.bkgBookings.find(
    (b) => b.proposalId === proposalId && b.tenantId === tenantId && !b.archivedAt,
  );
}

function refreshBookingHandoverStatus(store: Store, booking: BkgBooking, now: string): void {
  const tasks = store.bkgHandoverTasks.filter((t) => t.bookingId === booking.id);
  const allComplete = tasks.length > 0 && tasks.every((t) => t.status === "complete");
  const anyComplete = tasks.some((t) => t.status === "complete");

  if (allComplete) {
    booking.status = "handed_over";
    booking.handoverCompletedAt = booking.handoverCompletedAt ?? now;
  } else if (anyComplete) {
    booking.status = "handover_pending";
  } else {
    booking.status = "confirmed";
  }
  booking.updatedAt = now;
}

export function getBookingModuleHealth(store: Store, principal: Principal) {
  ensureBookingCollections(store);
  const decision = authorize({
    principal,
    permission: "booking:read:booking",
    action: "read:bkg_booking",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const tenantId = principal.tenantId;
  const bookings = store.bkgBookings.filter((b) => b.tenantId === tenantId && !b.archivedAt);
  const ids = new Set(bookings.map((b) => b.id));
  return {
    module: "booking",
    increment: "C9-C10",
    status: "ok" as const,
    bookings: bookings.length,
    handoverTasks: store.bkgHandoverTasks.filter((t) => t.tenantId === tenantId && ids.has(t.bookingId)).length,
  };
}

export function listBookings(
  store: Store,
  principal: Principal,
  query?: { status?: string; organizationId?: string },
) {
  ensureBookingCollections(store);
  const decision = authorize({
    principal,
    permission: "booking:read:booking",
    action: "read:bkg_booking",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = store.bkgBookings.filter((b) => b.tenantId === principal.tenantId && !b.archivedAt);
  if (query?.status) items = items.filter((b) => b.status === query.status);
  if (query?.organizationId) items = items.filter((b) => b.organizationId === query.organizationId);
  items.sort((a, b) => b.confirmedAt.localeCompare(a.confirmedAt));
  return { items: items.map(sanitizeBooking) };
}

export function getBookingDetail(store: Store, principal: Principal, id: string) {
  ensureBookingCollections(store);
  const booking = findBooking(store, principal.tenantId, id);
  if (!booking) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "booking:read:booking",
    action: "read:bkg_booking",
    resource: {
      tenantId: booking.tenantId,
      type: "booking",
      id: booking.id,
      classification: booking.classification,
    },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const handoverTasks = store.bkgHandoverTasks
    .filter((t) => t.bookingId === id)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(sanitizeTask);

  return { booking: sanitizeBooking(booking), handoverTasks };
}

export function getBookingByProposal(store: Store, principal: Principal, proposalId: string) {
  ensureBookingCollections(store);
  const booking = findBookingByProposal(store, principal.tenantId, proposalId);
  if (!booking) return { error: "not_found" as const };
  return getBookingDetail(store, principal, booking.id);
}

export type CreateBookingInput = {
  proposalId: string;
  assignedOperationsPrincipalId?: string;
};

export function createBooking(
  store: Store,
  principal: Principal,
  input: CreateBookingInput,
  correlationId: string,
) {
  ensureBookingCollections(store);
  const decision = authorize({
    principal,
    permission: "booking:write:booking",
    action: "create:bkg_booking",
  });
  if (decision.result === "deny") {
    denyBookingAudit(store, principal, "booking:write:booking", "bkg_booking", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const proposal = store.propProposals.find(
    (p) => p.id === input.proposalId && p.tenantId === principal.tenantId && !p.archivedAt,
  );
  if (!proposal) return { error: "invalid_request" as const, reason: "invalid_proposal" };

  const gate = canCreateBooking(proposal.status);
  if (!gate.allowed) return { error: "conflict" as const, reason: gate.reason };

  if (findBookingByProposal(store, principal.tenantId, input.proposalId)) {
    return { error: "conflict" as const, reason: "booking_exists_for_proposal" };
  }

  const rfp = store.rfpRfps.find((r) => r.id === proposal.rfpId);
  const programme = store.prgProgrammes.find((p) => p.id === proposal.programmeId);
  const bookingCode = buildBookingCode(proposal.proposalCode);
  if (store.bkgBookings.some((b) => b.tenantId === principal.tenantId && b.bookingCode === bookingCode)) {
    return { error: "conflict" as const, reason: "duplicate_booking_code" };
  }

  const now = new Date().toISOString();
  const booking: BkgBooking = {
    id: newId(),
    tenantId: principal.tenantId,
    bookingCode,
    proposalId: proposal.id,
    rfpId: proposal.rfpId,
    programmeId: proposal.programmeId,
    opportunityId: rfp?.opportunityId ?? "",
    organizationId: proposal.organizationId,
    title: proposal.title,
    status: "confirmed",
    ...((): object => {
      const paxCount = proposal.paxCount ?? programme?.paxCount;
      return paxCount !== undefined ? { paxCount } : {};
    })(),
    ...(rfp?.travelDates ? { travelDates: rfp.travelDates } : {}),
    ...((): object => {
      const destinations = programme?.destinations ?? rfp?.destinations;
      return destinations !== undefined ? { destinations } : {};
    })(),
    currency: proposal.currency,
    sellPrice: proposal.sellPrice,
    confirmedAt: now,
    assignedOperationsPrincipalId: input.assignedOperationsPrincipalId ?? principal.id,
    classification: proposal.classification,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };

  store.bkgBookings.push(booking);

  for (const [idx, spec] of DEFAULT_HANDOVER_TASKS.entries()) {
    const task: BkgHandoverTask = {
      id: newId(),
      tenantId: principal.tenantId,
      bookingId: booking.id,
      taskKey: spec.key,
      label: spec.label,
      status: "pending",
      sortOrder: idx,
      createdAt: now,
      updatedAt: now,
    };
    store.bkgHandoverTasks.push(task);
  }

  const opp = store.oppOpportunities.find(
    (o) => o.id === booking.opportunityId && o.tenantId === principal.tenantId && !o.archivedAt,
  );
  if (opp && opp.stage !== "won" && opp.stage !== "lost") {
    const fromStage = opp.stage;
    opp.stage = "won";
    opp.status = "won";
    opp.updatedAt = now;
    opp.version += 1;
    store.oppStageHistory.push({
      id: newId(),
      tenantId: principal.tenantId,
      opportunityId: opp.id,
      fromStage,
      toStage: "won",
      changedAt: now,
      changedByPrincipalId: principal.id,
      notes: `Booking ${bookingCode} confirmed`,
    });
  }

  if (rfp && rfp.workflowStage !== "closed") {
    rfp.workflowStage = "closed";
    rfp.status = "closed";
    rfp.updatedAt = now;
    rfp.version += 1;
    rfp.updatedByPrincipalId = principal.id;
  }

  allowBookingAudit(
    store,
    principal,
    "booking:write:booking",
    "bkg_booking",
    booking.id,
    correlationId,
    sanitizeBooking(booking),
  );
  return getBookingDetail(store, principal, booking.id);
}

export function completeHandoverTask(
  store: Store,
  principal: Principal,
  bookingId: string,
  taskId: string,
  correlationId: string,
) {
  ensureBookingCollections(store);
  const booking = findBooking(store, principal.tenantId, bookingId);
  if (!booking) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "booking:complete:handover",
    action: "complete:bkg_handover_task",
    resource: {
      tenantId: booking.tenantId,
      type: "booking",
      id: booking.id,
      classification: booking.classification,
    },
  });
  if (decision.result === "deny") {
    denyBookingAudit(store, principal, "booking:complete:handover", "bkg_handover_task", correlationId, decision.reason, taskId);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const task = store.bkgHandoverTasks.find((t) => t.id === taskId && t.bookingId === bookingId);
  if (!task) return { error: "not_found" as const, reason: "task_not_found" };

  const now = new Date().toISOString();
  task.status = "complete";
  task.completedAt = now;
  task.completedByPrincipalId = principal.id;
  task.updatedAt = now;
  booking.version += 1;
  booking.updatedByPrincipalId = principal.id;
  refreshBookingHandoverStatus(store, booking, now);

  allowBookingAudit(store, principal, "booking:complete:handover", "bkg_handover_task", task.id, correlationId, sanitizeTask(task));
  return getBookingDetail(store, principal, bookingId);
}
