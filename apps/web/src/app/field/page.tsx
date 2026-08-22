"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DevLoginPanel, useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn } from "@/components/commercial/ui";
import { listBookings, type BookingSummary } from "@/lib/booking-api";
import { EosApiError } from "@/lib/eos-client";
import {
  getOrCreateDeviceId,
  listCachedBookingIds,
  readFieldCache,
  writeFieldCache,
  type FieldOfflineCache,
} from "@/lib/field-offline-cache";
import { pullSyncBundle } from "@/lib/field-sync-api";

export default function FieldHomePage() {
  const { token, ready } = useEosSession();
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [cachedIds, setCachedIds] = useState<string[]>([]);
  const [cacheById, setCacheById] = useState<Record<string, FieldOfflineCache | null>>({});
  const [error, setError] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const deviceId = getOrCreateDeviceId();

  useEffect(() => {
    const ids = listCachedBookingIds();
    setCachedIds(ids);
    void Promise.all(ids.map(async (id) => [id, await readFieldCache(id)] as const)).then((entries) => {
      setCacheById(Object.fromEntries(entries));
    });
  }, []);

  useEffect(() => {
    if (!token) return;
    listBookings(token)
      .then((res) => setBookings(res.items))
      .catch((err) => setError(err instanceof EosApiError ? err.message : "Failed to load bookings"));
  }, [token]);

  async function handleDownload(bookingId: string) {
    if (!token) return;
    setSyncingId(bookingId);
    setError(null);
    try {
      const res = await pullSyncBundle(token, bookingId, deviceId);
      await writeFieldCache(bookingId, {
        session: res.session,
        bundle: res.bundle,
        pendingDeltas: [],
        cachedAt: new Date().toISOString(),
      });
      const ids = listCachedBookingIds();
      setCachedIds(ids);
      const refreshed = await readFieldCache(bookingId);
      setCacheById((prev) => ({ ...prev, [bookingId]: refreshed }));
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Download failed");
    } finally {
      setSyncingId(null);
    }
  }

  if (ready && !token) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-sand">Sign in to download assigned booking bundles for offline field work.</p>
        <DevLoginPanel />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="text-xs uppercase tracking-wide text-muted">Device</div>
        <div className="mt-1 font-mono text-sm text-gold">{deviceId}</div>
        <p className="mt-2 text-xs text-sand">
          Pull bundles while online. Offline cache is AES-GCM encrypted on this device (I9.2).
        </p>
      </div>

      {error && <p className="rounded-md bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>}

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">Assigned bookings</h2>
        <div className="space-y-2">
          {bookings.length === 0 ? (
            <p className="text-sm text-muted">No bookings loaded. Run demo seed or confirm a booking first.</p>
          ) : (
            bookings.map((bkg) => {
              const isCached = cachedIds.includes(bkg.id);
              const cached = cacheById[bkg.id];
              return (
                <div key={bkg.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="font-medium">{bkg.title}</div>
                  <div className="mt-1 text-xs text-muted">
                    {bkg.bookingCode} · {bkg.status.replace(/_/g, " ")}
                  </div>
                  {isCached && cached && (
                    <div className="mt-2 text-xs text-sand">
                      Encrypted cache · {cached.bundle.fieldTasks.length} tasks · {cached.pendingDeltas.length} pending
                    </div>
                  )}
                  <div className="mt-3 flex gap-2">
                    <Btn
                      variant="gold"
                      size="sm"
                      disabled={syncingId === bkg.id}
                      onClick={() => void handleDownload(bkg.id)}
                    >
                      {syncingId === bkg.id ? "Downloading…" : isCached ? "Refresh bundle" : "Download for offline"}
                    </Btn>
                    {isCached && (
                      <Link href={`/field/${bkg.id}`}>
                        <Btn variant="secondary" size="sm">
                          Open tasks
                        </Btn>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
