import {
  authorize,
  canTransitionSupplierConfirmation,
  newId,
  supplierConfirmationsReadyForHandover,
  type OpsSupplierConfirmation,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowOpsAudit, denyOpsAudit } from "./audit.js";
import { ensureOpsCollections } from "./collections.js";
import { autoCompleteHandoverTaskByKey } from "./handover-sync.js";

function sanitize(c: OpsSupplierConfirmation) {
  return {
    id: c.id,
    bookingId: c.bookingId,
    programmeId: c.programmeId,
    supplierId: c.supplierId,
    programmeItemId: c.programmeItemId,
    label: c.label,
    status: c.status,
    supplierReference: c.supplierReference,
    notes: c.notes,
    requestedAt: c.requestedAt,
    respondedAt: c.respondedAt,
  };
}

function findBooking(store: Store, tenantId: string, bookingId: string) {
  return store.bkgBookings.find((b) => b.id === bookingId && b.tenantId === tenantId && !b.archivedAt);
}

export function listSupplierConfirmations(
  store: Store,
  principal: Principal,
  query?: { bookingId?: string; status?: string },
) {
  ensureOpsCollections(store);
  const decision = authorize({ principal, permission: "ops:read:operations", action: "read:ops_supplier_confirmation" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = store.opsSupplierConfirmations.filter((c) => c.tenantId === principal.tenantId);
  if (query?.bookingId) items = items.filter((c) => c.bookingId === query.bookingId);
  if (query?.status) items = items.filter((c) => c.status === query.status);
  items.sort((a, b) => a.requestedAt.localeCompare(b.requestedAt));
  return { items: items.map(sanitize) };
}

export function generateSupplierConfirmations(
  store: Store,
  principal: Principal,
  bookingId: string,
  correlationId: string,
) {
  ensureOpsCollections(store);
  const decision = authorize({ principal, permission: "ops:write:operations", action: "create:ops_supplier_confirmation" });
  if (decision.result === "deny") {
    denyOpsAudit(store, principal, "ops:write:operations", "ops_supplier_confirmation", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const booking = findBooking(store, principal.tenantId, bookingId);
  if (!booking) return { error: "not_found" as const, reason: "booking_not_found" };

  const existing = store.opsSupplierConfirmations.filter((c) => c.bookingId === bookingId);
  if (existing.length > 0) return { error: "conflict" as const, reason: "confirmations_already_generated", items: existing.map(sanitize) };

  const items = store.prgItems.filter((i) => i.programmeId === booking.programmeId && i.supplierId);
  const seen = new Set<string>();
  const now = new Date().toISOString();
  const created: OpsSupplierConfirmation[] = [];

  for (const item of items) {
    if (!item.supplierId) continue;
    const key = `${item.supplierId}:${item.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const supplier = store.supSuppliers.find((s) => s.id === item.supplierId);
    const label = item.supplierLabel ?? supplier?.tradingName ?? supplier?.legalName ?? item.title;
    const row: OpsSupplierConfirmation = {
      id: newId(),
      tenantId: principal.tenantId,
      bookingId,
      programmeId: booking.programmeId,
      supplierId: item.supplierId,
      programmeItemId: item.id,
      label,
      status: "requested",
      requestedAt: now,
      classification: booking.classification,
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: principal.id,
      updatedByPrincipalId: principal.id,
    };
    store.opsSupplierConfirmations.push(row);
    created.push(row);
  }

  if (supplierConfirmationsReadyForHandover(created)) {
    autoCompleteHandoverTaskByKey(store, principal.tenantId, bookingId, "supplier_confirm", principal.id);
  }

  allowOpsAudit(store, principal, "ops:write:operations", "ops_supplier_confirmation", bookingId, correlationId, { count: created.length });
  return { items: created.map(sanitize) };
}

export function transitionSupplierConfirmation(
  store: Store,
  principal: Principal,
  id: string,
  toStatus: "confirmed" | "declined",
  input: { supplierReference?: string; notes?: string },
  correlationId: string,
) {
  ensureOpsCollections(store);
  const permission = toStatus === "confirmed" ? "ops:confirm:supplier" : "ops:write:operations";
  const row = store.opsSupplierConfirmations.find((c) => c.id === id && c.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission,
    action: `${toStatus}:ops_supplier_confirmation`,
    resource: { tenantId: row.tenantId, type: "ops_supplier_confirmation", id: row.id, classification: row.classification },
  });
  if (decision.result === "deny") {
    denyOpsAudit(store, principal, permission, "ops_supplier_confirmation", correlationId, decision.reason, id);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const gate = canTransitionSupplierConfirmation(row.status, toStatus);
  if (!gate.allowed) return { error: "conflict" as const, reason: gate.reason };

  const now = new Date().toISOString();
  row.status = toStatus;
  row.respondedAt = now;
  row.respondedByPrincipalId = principal.id;
  row.updatedAt = now;
  row.version += 1;
  row.updatedByPrincipalId = principal.id;
  if (input.supplierReference) row.supplierReference = input.supplierReference;
  if (input.notes) row.notes = input.notes;

  allowOpsAudit(store, principal, permission, "ops_supplier_confirmation", id, correlationId, sanitize(row));
  return { confirmation: sanitize(row) };
}
