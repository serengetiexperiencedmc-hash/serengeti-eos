"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import {
  clearPendingDeltas,
  getOrCreateDeviceId,
  queueFieldDelta,
  readFieldCache,
  writeFieldCache,
  type FieldOfflineCache,
} from "@/lib/field-offline-cache";
import { pullSyncBundle, pushSyncDeltas } from "@/lib/field-sync-api";

export default function FieldBookingPage() {
  const params = useParams<{ bookingId: string }>();
  const { token } = useEosSession();
  const bookingId = params.bookingId;
  const [cache, setCache] = useState<FieldOfflineCache | null>(null);
  const [online, setOnline] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const deviceId = getOrCreateDeviceId();

  useEffect(() => {
    setOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    void readFieldCache(bookingId).then(setCache);
  }, [bookingId]);

  async function handleSync() {
    if (!token || !cache) return;
    setSyncing(true);
    setError(null);
    setMessage(null);
    try {
      const sessionId = cache.session.id;
      if (cache.pendingDeltas.length > 0) {
        const pushed = await pushSyncDeltas(token, sessionId, cache.pendingDeltas);
        if (pushed.conflicts.length > 0) {
          setMessage(`${pushed.conflicts.length} conflict(s) — resolve in Commercial → Sync Conflicts`);
        } else {
          setMessage(`Synced ${pushed.applied.length} change(s)`);
        }
        await clearPendingDeltas(bookingId);
      }
      const pulled = await pullSyncBundle(token, bookingId, deviceId);
      await writeFieldCache(bookingId, {
        session: pulled.session,
        bundle: pulled.bundle,
        pendingDeltas: [],
        cachedAt: new Date().toISOString(),
      });
      setCache(await readFieldCache(bookingId));
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  async function toggleTask(taskId: string, currentStatus: string, version: number) {
    const nextStatus = currentStatus === "complete" ? "pending" : "complete";
    const updated = await queueFieldDelta(bookingId, {
      entityType: "field_task",
      entityId: taskId,
      clientVersion: version,
      payload: { status: nextStatus },
    });
    setCache(updated);
    if (!online) {
      setMessage("Saved offline (encrypted) — sync when back online");
    }
  }

  if (!cache) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-sand">No offline bundle for this booking.</p>
        <Link href="/field">
          <Btn variant="secondary" size="sm">
            ← Back to downloads
          </Btn>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link href="/field" className="text-xs text-gold hover:underline">
        ← All bookings
      </Link>

      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="font-display text-xl text-paper">{cache.bundle.title}</div>
        <div className="mt-1 text-sm text-gold">{cache.bundle.bookingCode}</div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className={`rounded-full px-2 py-0.5 ${online ? "bg-success-bg text-success" : "bg-warning-bg text-warning"}`}>
            {online ? "Online" : "Offline"}
          </span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-sand">AES-GCM cache</span>
          {cache.pendingDeltas.length > 0 && (
            <span className="text-sand">{cache.pendingDeltas.length} pending change(s)</span>
          )}
        </div>
        {online && token && (
          <Btn variant="gold" size="sm" className="mt-3" disabled={syncing} onClick={() => void handleSync()}>
            {syncing ? "Syncing…" : "Sync now"}
          </Btn>
        )}
      </div>

      {message && <p className="text-sm text-success">{message}</p>}
      {error && <p className="text-sm text-danger">{error}</p>}

      {cache.bundle.brief && (
        <section className="rounded-lg border border-white/10 bg-white/5 p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gold">Ops brief</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-sand">{cache.bundle.brief.content}</p>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">Field tasks</h2>
        <div className="space-y-2">
          {cache.bundle.fieldTasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => void toggleTask(task.id, task.status, task.version)}
              className="flex w-full items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-left transition-colors hover:border-gold/40"
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                  task.status === "complete" ? "border-success bg-success text-white" : "border-muted"
                }`}
              >
                {task.status === "complete" ? "✓" : ""}
              </span>
              <div>
                <div className={task.status === "complete" ? "text-muted line-through" : "text-paper"}>{task.title}</div>
                {task.dueDate && <div className="mt-1 text-xs text-muted">Due {task.dueDate}</div>}
              </div>
            </button>
          ))}
          {cache.bundle.fieldTasks.length === 0 && <p className="text-sm text-muted">No field tasks in bundle.</p>}
        </div>
      </section>
    </div>
  );
}
