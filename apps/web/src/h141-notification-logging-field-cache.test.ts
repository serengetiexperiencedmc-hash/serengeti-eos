import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  clearFieldCaches,
  listCachedBookingIds,
  queueFieldDelta,
  readFieldCache,
  writeFieldCache,
} from "./lib/field-offline-cache";
import { clearSession, getStoredPrincipalId, storeSession } from "./lib/eos-session";

function memoryStorage() {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    key(index: number) {
      return [...data.keys()][index] ?? null;
    },
    getItem(key: string) {
      return data.has(key) ? data.get(key)! : null;
    },
    setItem(key: string, value: string) {
      data.set(key, String(value));
    },
    removeItem(key: string) {
      data.delete(key);
    },
    clear() {
      data.clear();
    },
  };
}

function installBrowserStorage() {
  const local = memoryStorage();
  const session = memoryStorage();
  Object.defineProperty(globalThis, "localStorage", { value: local, configurable: true });
  Object.defineProperty(globalThis, "sessionStorage", { value: session, configurable: true });
  Object.defineProperty(globalThis, "window", { value: globalThis, configurable: true });
}

const commercialCache = {
  session: {
    id: "sess-1",
    lastSyncAt: "2026-09-22T00:00:00.000Z",
    cacheExpiresAt: "2026-09-23T00:00:00.000Z",
    principalId: "principal-a",
  },
  bundle: {
    bookingId: "booking-1",
    bookingCode: "BKG-H141-1",
    title: "Serengeti commercial field bundle",
    fieldTasks: [{ id: "task-1", title: "Check radios", status: "pending", version: 1 }],
    brief: { id: "brief-1", content: "Commercial ops brief", version: 1 },
  },
  pendingDeltas: [],
  cachedAt: "2026-09-22T00:00:00.000Z",
};

describe("H-141 field-ops cache and session privacy", () => {
  beforeEach(() => {
    installBrowserStorage();
  });

  afterEach(() => {
    clearFieldCaches();
    sessionStorage.clear();
  });

  it("does not decrypt another principal's cache and clears blobs on logout", async () => {
    await writeFieldCache("booking-1", commercialCache);
    expect(listCachedBookingIds()).toEqual(["booking-1"]);
    expect(await readFieldCache("booking-1", "principal-a")).not.toBeNull();
    expect(await readFieldCache("booking-1", "principal-b")).toBeNull();
    expect(await readFieldCache("booking-1", null)).toBeNull();

    storeSession("token-a", "carol.admin@sedmc.local", "principal-a");
    expect(getStoredPrincipalId()).toBe("principal-a");
    clearSession();
    expect(getStoredPrincipalId()).toBeNull();
    expect(listCachedBookingIds()).toEqual([]);
    expect(await readFieldCache("booking-1", "principal-a")).toBeNull();
  });

  it("rejects person-domain keys in cache writes and queued deltas", async () => {
    await expect(
      writeFieldCache("booking-1", {
        ...commercialCache,
        bundle: {
          ...commercialCache.bundle,
          brief: { id: "brief-1", content: "ops", version: 1, guestName: "Jane" } as (typeof commercialCache)["bundle"]["brief"],
        },
      }),
    ).rejects.toThrow("person_domain_removed");
    expect(listCachedBookingIds()).toEqual([]);

    await writeFieldCache("booking-1", commercialCache);
    const queued = await queueFieldDelta(
      "booking-1",
      {
        entityType: "field_task",
        entityId: "task-1",
        clientVersion: 1,
        payload: { status: "complete", guestName: "Jane" } as { status: string; guestName: string },
      },
      "principal-a",
    );
    expect(queued).toBeNull();
    const reread = await readFieldCache("booking-1", "principal-a");
    expect(reread?.pendingDeltas).toHaveLength(0);
    expect(reread?.bundle.fieldTasks[0]?.status).toBe("pending");
  });

  it("clears previous principal field cache on account switch via storeSession", async () => {
    await writeFieldCache("booking-1", commercialCache);
    expect(await readFieldCache("booking-1", "principal-a")).not.toBeNull();
    storeSession("token-b", "alice.finance@sedmc.local", "principal-b");
    expect(getStoredPrincipalId()).toBe("principal-b");
    expect(listCachedBookingIds()).toEqual([]);
    expect(await readFieldCache("booking-1", "principal-a")).toBeNull();
    expect(await readFieldCache("booking-1", "principal-b")).toBeNull();
  });

  it("keeps sessionStorage to token/email/principalId and does not add person-domain cache labels", () => {
    const session = readFileSync(new URL("./lib/eos-session.ts", import.meta.url), "utf8");
    expect(session).toContain("sedmc.eos.accessToken");
    expect(session).toContain("sedmc.eos.email");
    expect(session).toContain("sedmc.eos.principalId");
    expect(session).toContain("clearFieldCaches");
    const fieldCache = readFileSync(new URL("./lib/field-offline-cache.ts", import.meta.url), "utf8");
    expect(fieldCache).toContain("clearFieldCaches");
    expect(fieldCache).not.toMatch(/crmContact|hrEmployee|supplierContact/);
  });
});
