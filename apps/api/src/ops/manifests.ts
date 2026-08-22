import {
  authorize,
  canPublishManifest,
  newId,
  type OpsManifest,
  type OpsManifestEntry,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowOpsAudit, denyOpsAudit } from "./audit.js";
import { ensureOpsCollections } from "./collections.js";
import { autoCompleteHandoverTaskByKey } from "./handover-sync.js";

function sanitizeManifest(m: OpsManifest) {
  return {
    id: m.id,
    bookingId: m.bookingId,
    programmeId: m.programmeId,
    status: m.status,
    version: m.version,
    publishedAt: m.publishedAt,
  };
}

function sanitizeEntry(e: OpsManifestEntry) {
  return {
    id: e.id,
    manifestId: e.manifestId,
    guestName: e.guestName,
    email: e.email,
    rooming: e.rooming,
    dietary: e.dietary,
    mobility: e.mobility,
    flightReference: e.flightReference,
    sortOrder: e.sortOrder,
  };
}

function findBooking(store: Store, tenantId: string, bookingId: string) {
  return store.bkgBookings.find((b) => b.id === bookingId && b.tenantId === tenantId && !b.archivedAt);
}

export function getManifestByBooking(store: Store, principal: Principal, bookingId: string) {
  ensureOpsCollections(store);
  const decision = authorize({ principal, permission: "ops:read:operations", action: "read:ops_manifest" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const manifest = store.opsManifests.find((m) => m.bookingId === bookingId && m.tenantId === principal.tenantId);
  if (!manifest) return { error: "not_found" as const };

  const entries = store.opsManifestEntries
    .filter((e) => e.manifestId === manifest.id)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(sanitizeEntry);

  return { manifest: sanitizeManifest(manifest), entries };
}

export function createOrGetManifest(store: Store, principal: Principal, bookingId: string, correlationId: string) {
  ensureOpsCollections(store);
  const manifest = store.opsManifests.find((m) => m.bookingId === bookingId && m.tenantId === principal.tenantId);
  if (manifest) return getManifestByBooking(store, principal, bookingId);

  const decision = authorize({ principal, permission: "ops:write:manifest", action: "create:ops_manifest" });
  if (decision.result === "deny") {
    denyOpsAudit(store, principal, "ops:write:manifest", "ops_manifest", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const booking = findBooking(store, principal.tenantId, bookingId);
  if (!booking) return { error: "not_found" as const, reason: "booking_not_found" };

  const now = new Date().toISOString();
  const row: OpsManifest = {
    id: newId(),
    tenantId: principal.tenantId,
    bookingId,
    programmeId: booking.programmeId,
    status: "draft",
    version: 1,
    classification: booking.classification,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  store.opsManifests.push(row);
  allowOpsAudit(store, principal, "ops:write:manifest", "ops_manifest", row.id, correlationId);
  return { manifest: sanitizeManifest(row), entries: [] as ReturnType<typeof sanitizeEntry>[] };
}

export type ManifestEntryInput = {
  guestName: string;
  email?: string;
  rooming?: string;
  dietary?: string;
  mobility?: string;
  flightReference?: string;
  sortOrder?: number;
};

export function addManifestEntry(
  store: Store,
  principal: Principal,
  manifestId: string,
  input: ManifestEntryInput,
  correlationId: string,
) {
  ensureOpsCollections(store);
  const manifest = store.opsManifests.find((m) => m.id === manifestId && m.tenantId === principal.tenantId);
  if (!manifest) return { error: "not_found" as const };
  if (manifest.status === "published") return { error: "conflict" as const, reason: "manifest_published" };

  const decision = authorize({ principal, permission: "ops:write:manifest", action: "write:ops_manifest_entry" });
  if (decision.result === "deny") {
    denyOpsAudit(store, principal, "ops:write:manifest", "ops_manifest_entry", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const now = new Date().toISOString();
  const sortOrder =
    input.sortOrder ??
    store.opsManifestEntries.filter((e) => e.manifestId === manifestId).length;
  const entry: OpsManifestEntry = {
    id: newId(),
    tenantId: principal.tenantId,
    manifestId,
    guestName: input.guestName,
    email: input.email,
    rooming: input.rooming,
    dietary: input.dietary,
    mobility: input.mobility,
    flightReference: input.flightReference,
    sortOrder,
    createdAt: now,
    updatedAt: now,
  };
  store.opsManifestEntries.push(entry);
  manifest.updatedAt = now;
  manifest.version += 1;
  allowOpsAudit(store, principal, "ops:write:manifest", "ops_manifest_entry", entry.id, correlationId);
  return { entry: sanitizeEntry(entry) };
}

export function publishManifest(store: Store, principal: Principal, manifestId: string, correlationId: string) {
  ensureOpsCollections(store);
  const manifest = store.opsManifests.find((m) => m.id === manifestId && m.tenantId === principal.tenantId);
  if (!manifest) return { error: "not_found" as const };

  const decision = authorize({ principal, permission: "ops:publish:manifest", action: "publish:ops_manifest" });
  if (decision.result === "deny") {
    denyOpsAudit(store, principal, "ops:publish:manifest", "ops_manifest", correlationId, decision.reason, manifestId);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const entryCount = store.opsManifestEntries.filter((e) => e.manifestId === manifestId).length;
  const gate = canPublishManifest(manifest.status, entryCount);
  if (!gate.allowed) return { error: "conflict" as const, reason: gate.reason };

  const now = new Date().toISOString();
  manifest.status = "published";
  manifest.publishedAt = now;
  manifest.publishedByPrincipalId = principal.id;
  manifest.updatedAt = now;
  manifest.version += 1;
  manifest.updatedByPrincipalId = principal.id;

  autoCompleteHandoverTaskByKey(store, principal.tenantId, manifest.bookingId, "guest_manifest", principal.id);
  allowOpsAudit(store, principal, "ops:publish:manifest", "ops_manifest", manifestId, correlationId);
  return getManifestByBooking(store, principal, manifest.bookingId);
}
