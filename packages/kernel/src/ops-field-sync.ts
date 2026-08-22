export type OpsSyncEntityType = "field_task" | "brief" | "manifest_entry";

export type OpsSyncConflictResolution = "server_wins" | "client_wins" | "manual";

export type OpsFieldSyncSession = {
  id: string;
  tenantId: string;
  principalId: string;
  deviceId: string;
  bookingId: string;
  lastSyncAt: string;
  cacheExpiresAt: string;
  policyVersion: number;
  createdAt: string;
  updatedAt: string;
};

export type OpsSyncConflict = {
  id: string;
  tenantId: string;
  sessionId: string;
  bookingId: string;
  entityType: OpsSyncEntityType;
  entityId: string;
  serverVersion: number;
  clientVersion: number;
  serverPayload: Record<string, unknown>;
  clientPayload: Record<string, unknown>;
  resolution?: OpsSyncConflictResolution;
  resolvedAt?: string;
  resolvedByPrincipalId?: string;
  createdAt: string;
  updatedAt: string;
};

export function shouldAcceptClientFieldTaskUpdate(
  serverStatus: string,
  clientStatus: string,
  serverVersion: number,
  clientVersion: number,
): { accept: boolean; reason?: string } {
  if (clientVersion < serverVersion) return { accept: false, reason: "stale_client_version" };
  if (serverStatus === "complete" && clientStatus !== "complete") {
    return { accept: false, reason: "server_terminal" };
  }
  return { accept: true };
}

export function manifestEntryRequiresManualMerge(): boolean {
  return true;
}
