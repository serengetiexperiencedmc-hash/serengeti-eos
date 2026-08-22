import {
  authorize,
  FIELD_CACHE_ENCRYPTION_ALG,
  FIELD_CACHE_POLICY_VERSION,
  manifestEntryRequiresManualMerge,
  newId,
  shouldAcceptClientFieldTaskUpdate,
  type OpsFieldSyncSession,
  type OpsSyncConflict,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureOpsCollections } from "./collections.js";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function findBooking(store: Store, tenantId: string, bookingId: string) {
  return store.bkgBookings.find((b) => b.id === bookingId && b.tenantId === tenantId && !b.archivedAt);
}

export function getSyncPolicy(store: Store, principal: Principal) {
  ensureOpsCollections(store);
  const decision = authorize({ principal, permission: "ops:read:operations", action: "read:ops_sync_policy" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  return {
    policy: {
      policyVersion: FIELD_CACHE_POLICY_VERSION,
      cacheEncryption: FIELD_CACHE_ENCRYPTION_ALG,
      requireEncryptedCache: true,
      cacheTtlHours: 24,
      allowedEntities: ["field_task", "brief"],
      deniedOfflineEntities: ["fin_invoice", "fin_payment", "manifest_entry"],
      conflictRules: {
        field_task: "version_lww",
        brief: "server_wins_after_issue",
        manifest_entry: "manual_merge",
      },
    },
  };
}

export function pullSyncBundle(
  store: Store,
  principal: Principal,
  input: { bookingId: string; deviceId: string },
) {
  ensureOpsCollections(store);
  const decision = authorize({ principal, permission: "ops:read:operations", action: "pull:ops_sync" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const booking = findBooking(store, principal.tenantId, input.bookingId);
  if (!booking) return { error: "not_found" as const, reason: "booking_not_found" };

  const now = new Date().toISOString();
  const expires = new Date(Date.now() + CACHE_TTL_MS).toISOString();
  let session = store.opsFieldSyncSessions.find(
    (s) =>
      s.tenantId === principal.tenantId &&
      s.principalId === principal.id &&
      s.deviceId === input.deviceId &&
      s.bookingId === input.bookingId,
  );
  if (!session) {
    session = {
      id: newId(),
      tenantId: principal.tenantId,
      principalId: principal.id,
      deviceId: input.deviceId,
      bookingId: input.bookingId,
      lastSyncAt: now,
      cacheExpiresAt: expires,
      policyVersion: FIELD_CACHE_POLICY_VERSION,
      createdAt: now,
      updatedAt: now,
    };
    store.opsFieldSyncSessions.push(session);
  } else {
    session.lastSyncAt = now;
    session.cacheExpiresAt = expires;
    session.updatedAt = now;
  }

  const fieldTasks = store.opsFieldTasks
    .filter((t) => t.bookingId === input.bookingId)
    .map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      version: t.version,
      dueDate: t.dueDate,
    }));
  const brief = store.opsBriefs.find((b) => b.bookingId === input.bookingId);

  return {
    session: {
      id: session.id,
      lastSyncAt: session.lastSyncAt,
      cacheExpiresAt: session.cacheExpiresAt,
      principalId: session.principalId,
    },
    bundle: {
      bookingId: input.bookingId,
      bookingCode: booking.bookingCode,
      title: booking.title,
      fieldTasks,
      brief: brief ? { id: brief.id, content: brief.content, issuedAt: brief.issuedAt, version: brief.version } : null,
    },
  };
}

export type SyncPushDelta = {
  entityType: "field_task";
  entityId: string;
  clientVersion: number;
  payload: { status?: string; title?: string };
};

export function pushSyncDeltas(
  store: Store,
  principal: Principal,
  input: { sessionId: string; deltas: SyncPushDelta[] },
) {
  ensureOpsCollections(store);
  const decision = authorize({ principal, permission: "ops:write:operations", action: "push:ops_sync" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const session = store.opsFieldSyncSessions.find((s) => s.id === input.sessionId && s.tenantId === principal.tenantId);
  if (!session) return { error: "not_found" as const, reason: "session_not_found" };

  const applied: string[] = [];
  const conflicts: OpsSyncConflict[] = [];
  const now = new Date().toISOString();

  for (const delta of input.deltas) {
    if (delta.entityType === "field_task") {
      const task = store.opsFieldTasks.find((t) => t.id === delta.entityId && t.bookingId === session.bookingId);
      if (!task) continue;
      const clientStatus = (delta.payload.status as string) ?? task.status;
      const gate = shouldAcceptClientFieldTaskUpdate(task.status, clientStatus, task.version, delta.clientVersion);
      if (gate.accept) {
        if (delta.payload.status) task.status = delta.payload.status as typeof task.status;
        if (delta.payload.title) task.title = delta.payload.title;
        task.version += 1;
        task.updatedAt = now;
        applied.push(task.id);
      } else {
        const conflict: OpsSyncConflict = {
          id: newId(),
          tenantId: principal.tenantId,
          sessionId: session.id,
          bookingId: session.bookingId,
          entityType: "field_task",
          entityId: task.id,
          serverVersion: task.version,
          clientVersion: delta.clientVersion,
          serverPayload: { status: task.status, title: task.title },
          clientPayload: delta.payload as Record<string, unknown>,
          createdAt: now,
          updatedAt: now,
        };
        store.opsSyncConflicts.push(conflict);
        conflicts.push(conflict);
      }
    }
    if (manifestEntryRequiresManualMerge() && delta.entityType === ("manifest_entry" as SyncPushDelta["entityType"])) {
      // manifest offline edits always conflict — manual merge required
    }
  }

  session.lastSyncAt = now;
  session.updatedAt = now;
  return {
    applied,
    conflicts: conflicts.map((c) => ({
      id: c.id,
      entityType: c.entityType,
      entityId: c.entityId,
      serverVersion: c.serverVersion,
      clientVersion: c.clientVersion,
    })),
  };
}

export function listSyncConflicts(store: Store, principal: Principal, query?: { bookingId?: string }) {
  ensureOpsCollections(store);
  const decision = authorize({ principal, permission: "ops:read:operations", action: "read:ops_sync_conflicts" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = store.opsSyncConflicts.filter((c) => c.tenantId === principal.tenantId && !c.resolution);
  if (query?.bookingId) items = items.filter((c) => c.bookingId === query.bookingId);
  return {
    items: items.map((c) => ({
      id: c.id,
      bookingId: c.bookingId,
      entityType: c.entityType,
      entityId: c.entityId,
      serverVersion: c.serverVersion,
      clientVersion: c.clientVersion,
      serverPayload: c.serverPayload,
      clientPayload: c.clientPayload,
    })),
  };
}

export function resolveSyncConflict(
  store: Store,
  principal: Principal,
  conflictId: string,
  resolution: "server_wins" | "client_wins",
) {
  ensureOpsCollections(store);
  const conflict = store.opsSyncConflicts.find((c) => c.id === conflictId && c.tenantId === principal.tenantId);
  if (!conflict) return { error: "not_found" as const };

  const decision = authorize({ principal, permission: "ops:write:operations", action: "resolve:ops_sync_conflict" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const now = new Date().toISOString();
  if (resolution === "client_wins" && conflict.entityType === "field_task") {
    const task = store.opsFieldTasks.find((t) => t.id === conflict.entityId);
    if (task) {
      const payload = conflict.clientPayload;
      if (typeof payload.status === "string") task.status = payload.status as typeof task.status;
      if (typeof payload.title === "string") task.title = payload.title;
      task.version += 1;
      task.updatedAt = now;
    }
  }

  conflict.resolution = resolution;
  conflict.resolvedAt = now;
  conflict.resolvedByPrincipalId = principal.id;
  conflict.updatedAt = now;
  return { conflict: { id: conflict.id, resolution: conflict.resolution } };
}

export function getSyncHealth(store: Store) {
  ensureOpsCollections(store);
  return {
    module: "ops-sync",
    increment: "I9-I9.2",
    status: "ok" as const,
    sessions: store.opsFieldSyncSessions.length,
    openConflicts: store.opsSyncConflicts.filter((c) => !c.resolution).length,
  };
}
