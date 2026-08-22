"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import { listSyncConflicts, resolveSyncConflict, type SyncConflict } from "@/lib/field-sync-api";

export default function SyncConflictsPage() {
  const { token, ready } = useEosSession();
  const [conflicts, setConflicts] = useState<SyncConflict[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadConflicts() {
    if (!token) return;
    const res = await listSyncConflicts(token);
    setConflicts(res.items);
  }

  useEffect(() => {
    if (!token) return;
    loadConflicts().catch((err) => setError(err instanceof EosApiError ? err.message : "Failed to load conflicts"));
  }, [token]);

  async function handleResolve(conflictId: string, resolution: "server_wins" | "client_wins") {
    if (!token) return;
    setBusyId(conflictId);
    setError(null);
    try {
      await resolveSyncConflict(token, conflictId, resolution);
      await loadConflicts();
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to resolve conflict");
    } finally {
      setBusyId(null);
    }
  }

  if (ready && !token) {
    return <p className="text-sm text-muted">Sign in to resolve field sync conflicts.</p>;
  }

  return (
    <>
      <PageHeader
        eyebrow="I9 · Field Sync"
        title="Sync Conflicts"
        subtitle="Resolve stale offline edits from field devices"
        actions={
          <Link href="/field">
            <Btn variant="secondary">Field App →</Btn>
          </Link>
        }
      />

      {error && <p className="mb-4 text-sm text-danger">{error}</p>}

      <Card title={`Open conflicts (${conflicts.length})`}>
        {conflicts.length === 0 ? (
          <p className="text-sm text-muted">No unresolved sync conflicts.</p>
        ) : (
          <div className="space-y-4">
            {conflicts.map((c) => (
              <div key={c.id} className="rounded-md border border-line p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="font-medium text-ink">{c.entityType.replace(/_/g, " ")}</div>
                    <div className="mt-1 text-xs text-muted">
                      Booking {c.bookingId.slice(0, 8)}… · entity {c.entityId.slice(0, 8)}…
                    </div>
                    <div className="mt-1 text-xs text-muted">
                      Server v{c.serverVersion} vs client v{c.clientVersion}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Btn
                      variant="secondary"
                      size="sm"
                      disabled={busyId === c.id}
                      onClick={() => void handleResolve(c.id, "server_wins")}
                    >
                      Keep server
                    </Btn>
                    <Btn
                      variant="gold"
                      size="sm"
                      disabled={busyId === c.id}
                      onClick={() => void handleResolve(c.id, "client_wins")}
                    >
                      Accept field
                    </Btn>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded bg-sand/50 p-3 text-sm">
                    <div className="text-xs font-semibold uppercase text-muted">Server</div>
                    <pre className="mt-1 whitespace-pre-wrap font-mono text-xs">{JSON.stringify(c.serverPayload ?? {}, null, 2)}</pre>
                  </div>
                  <div className="rounded bg-warning-bg/50 p-3 text-sm">
                    <div className="text-xs font-semibold uppercase text-muted">Field device</div>
                    <pre className="mt-1 whitespace-pre-wrap font-mono text-xs">{JSON.stringify(c.clientPayload ?? {}, null, 2)}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
