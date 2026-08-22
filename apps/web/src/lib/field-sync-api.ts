import { eosFetch } from "./eos-client";

export type SyncPolicy = {
  policyVersion: number;
  cacheEncryption?: string;
  requireEncryptedCache?: boolean;
  cacheTtlHours: number;
  allowedEntities: string[];
  deniedOfflineEntities: string[];
  conflictRules: Record<string, string>;
};

export type SyncBundle = {
  bookingId: string;
  bookingCode: string;
  title: string;
  fieldTasks: Array<{
    id: string;
    title: string;
    status: string;
    version: number;
    dueDate?: string;
  }>;
  brief: { id: string; content: string; issuedAt?: string; version: number } | null;
};

export type SyncSession = {
  id: string;
  lastSyncAt: string;
  cacheExpiresAt: string;
  principalId: string;
};

export type SyncConflict = {
  id: string;
  bookingId: string;
  entityType: string;
  entityId: string;
  serverVersion: number;
  clientVersion: number;
  serverPayload?: Record<string, unknown>;
  clientPayload?: Record<string, unknown>;
};

export type SyncPushDelta = {
  entityType: "field_task";
  entityId: string;
  clientVersion: number;
  payload: { status?: string; title?: string };
};

export async function getSyncPolicy(token: string) {
  return eosFetch<{ policy: SyncPolicy }>("/v1/ops/sync/policy", { token });
}

export async function pullSyncBundle(token: string, bookingId: string, deviceId: string) {
  return eosFetch<{ session: SyncSession; bundle: SyncBundle }>("/v1/ops/sync/pull", {
    token,
    method: "POST",
    body: JSON.stringify({ bookingId, deviceId }),
  });
}

export async function pushSyncDeltas(token: string, sessionId: string, deltas: SyncPushDelta[]) {
  return eosFetch<{ applied: string[]; conflicts: SyncConflict[] }>("/v1/ops/sync/push", {
    token,
    method: "POST",
    body: JSON.stringify({ sessionId, deltas }),
  });
}

export async function listSyncConflicts(token: string, bookingId?: string) {
  const qs = bookingId ? `?bookingId=${bookingId}` : "";
  return eosFetch<{ items: SyncConflict[] }>(`/v1/ops/sync/conflicts${qs}`, { token });
}

export async function resolveSyncConflict(
  token: string,
  conflictId: string,
  resolution: "server_wins" | "client_wins",
) {
  return eosFetch<{ conflict: { id: string; resolution: string } }>(
    `/v1/ops/sync/conflicts/${conflictId}/resolve`,
    { token, method: "POST", body: JSON.stringify({ resolution }) },
  );
}
