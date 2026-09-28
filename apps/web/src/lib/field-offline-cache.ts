import { findPersonDomainObjectKeys } from "@sedmc/kernel/personal-data-content-contract";
import {
  decryptFieldCachePayload,
  encryptFieldCachePayload,
  isEncryptedFieldCacheBlob,
} from "@sedmc/kernel/field-cache-crypto";
import type { SyncBundle, SyncPushDelta, SyncSession } from "./field-sync-api";

const DEVICE_KEY = "sedmc-field-device-id";
const CACHE_PREFIX = "sedmc-field-cache:";
const META_PREFIX = "sedmc-field-cache-meta:";
const SALT_KEY = "sedmc-field-cache-salt";

export type FieldOfflineCache = {
  session: SyncSession;
  bundle: SyncBundle;
  pendingDeltas: SyncPushDelta[];
  cachedAt: string;
};

export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = `dev-${crypto.randomUUID().slice(0, 8)}`;
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

function getOrCreateCacheSalt(): string {
  if (typeof window === "undefined") return "server-salt";
  let salt = localStorage.getItem(SALT_KEY);
  if (!salt) {
    salt = crypto.randomUUID();
    localStorage.setItem(SALT_KEY, salt);
  }
  return salt;
}

function cacheKey(bookingId: string): string {
  return `${CACHE_PREFIX}${bookingId}`;
}

function cacheMetaKey(bookingId: string): string {
  return `${META_PREFIX}${bookingId}`;
}

function readCachePrincipalId(bookingId: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(cacheMetaKey(bookingId));
}

function writeCachePrincipalId(bookingId: string, principalId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(cacheMetaKey(bookingId), principalId);
}

function parseLegacyCache(raw: string): FieldOfflineCache | null {
  try {
    return JSON.parse(raw) as FieldOfflineCache;
  } catch {
    return null;
  }
}

/** Removes encrypted field-ops blobs and principal meta. Device id/salt are not person-domain data. */
export function clearFieldCaches(): void {
  if (typeof window === "undefined") return;
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX) || key?.startsWith(META_PREFIX)) keys.push(key);
  }
  for (const key of keys) localStorage.removeItem(key);
}

export async function readFieldCache(
  bookingId: string,
  currentPrincipalId?: string | null,
): Promise<FieldOfflineCache | null> {
  if (typeof window === "undefined") return null;
  if (!currentPrincipalId) return null;
  const raw = localStorage.getItem(cacheKey(bookingId));
  if (!raw) return null;

  if (isEncryptedFieldCacheBlob(raw)) {
    const storedPrincipalId = readCachePrincipalId(bookingId);
    if (!storedPrincipalId || storedPrincipalId !== currentPrincipalId) return null;
    const deviceId = getOrCreateDeviceId();
    const salt = getOrCreateCacheSalt();
    const decrypted = await decryptFieldCachePayload(raw, deviceId, currentPrincipalId, salt);
    if (!decrypted) return null;
    try {
      const parsed = JSON.parse(decrypted) as FieldOfflineCache;
      if (parsed.session.principalId !== currentPrincipalId) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  const legacy = parseLegacyCache(raw);
  if (!legacy || legacy.session.principalId !== currentPrincipalId) return null;
  await writeFieldCache(bookingId, legacy);
  return legacy;
}

export async function writeFieldCache(bookingId: string, cache: FieldOfflineCache): Promise<void> {
  if (typeof window === "undefined") return;
  if (!cache.session.principalId) {
    throw new Error("field_cache_missing_principal");
  }
  if (findPersonDomainObjectKeys(cache).length > 0) {
    throw new Error("person_domain_removed");
  }
  const deviceId = getOrCreateDeviceId();
  const salt = getOrCreateCacheSalt();
  const plaintext = JSON.stringify(cache);
  const encrypted = await encryptFieldCachePayload(plaintext, deviceId, cache.session.principalId, salt);
  localStorage.setItem(cacheKey(bookingId), encrypted);
  writeCachePrincipalId(bookingId, cache.session.principalId);
}

export async function queueFieldDelta(
  bookingId: string,
  delta: SyncPushDelta,
  currentPrincipalId?: string | null,
): Promise<FieldOfflineCache | null> {
  if (findPersonDomainObjectKeys(delta).length > 0) return null;
  const cache = await readFieldCache(bookingId, currentPrincipalId);
  if (!cache) return null;
  cache.pendingDeltas = [...cache.pendingDeltas, delta];
  cache.bundle.fieldTasks = cache.bundle.fieldTasks.map((task) => {
    if (task.id !== delta.entityId) return task;
    return {
      ...task,
      status: delta.payload.status ?? task.status,
      title: delta.payload.title ?? task.title,
    };
  });
  await writeFieldCache(bookingId, cache);
  return cache;
}

export async function clearPendingDeltas(
  bookingId: string,
  currentPrincipalId?: string | null,
): Promise<void> {
  const cache = await readFieldCache(bookingId, currentPrincipalId);
  if (!cache) return;
  cache.pendingDeltas = [];
  await writeFieldCache(bookingId, cache);
}

export function listCachedBookingIds(): string[] {
  if (typeof window === "undefined") return [];
  const ids: string[] = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      ids.push(key.slice(CACHE_PREFIX.length));
    }
  }
  return ids;
}
