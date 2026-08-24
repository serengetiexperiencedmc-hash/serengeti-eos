"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import {
  createPamGrant,
  createPamRef,
  getPamHealth,
  listPamGrants,
  listPamRefs,
  revokePamGrant,
  retirePamRef,
  type PamJitGrant,
  type PamSecretRef,
} from "@/lib/pam-api";

function refBadge(status: PamSecretRef["status"]) {
  return status === "active" ? <Badge variant="progress" label="Active" /> : <Badge variant="draft" label="Retired" />;
}

function grantBadge(status: PamJitGrant["status"]) {
  if (status === "active") return <Badge variant="urgent" label="Active" />;
  if (status === "revoked") return <Badge variant="draft" label="Revoked" />;
  return <Badge variant="review" label="Expired" />;
}

export default function PamPage() {
  const { token, ready } = useEosSession();
  const [refs, setRefs] = useState<PamSecretRef[]>([]);
  const [grants, setGrants] = useState<PamJitGrant[]>([]);
  const [health, setHealth] = useState<{ refs: number; activeRefs: number; activeGrants: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [secretRef, setSecretRef] = useState("ref://devtest/");
  const [purpose, setPurpose] = useState("");
  const [subjectEmail, setSubjectEmail] = useState("alice.finance@sedmc.local");
  const [permissionKey, setPermissionKey] = useState("itsm:read:ticket");
  const [ttlSeconds, setTtlSeconds] = useState("600");
  const [reason, setReason] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [refList, grantList, h] = await Promise.all([listPamRefs(token), listPamGrants(token), getPamHealth(token)]);
      setRefs(refList.items);
      setGrants(grantList.items);
      setHealth({ refs: h.refs, activeRefs: h.activeRefs, activeGrants: h.activeGrants });
    } catch (err) {
      setRefs([]);
      setGrants([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load PAM");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    void load();
  }, [token, load]);

  async function run(action: () => Promise<void>) {
    if (!token) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await action();
      await load();
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view PAM.</p>;

  return (
    <>
      <PageHeader
        eyebrow="I14 · Security"
        title="PAM"
        subtitle="Opaque secret references and time-bounded JIT grants · not a production vault"
        actions={
          <Btn variant="secondary" href="/commercial">
            ← Dashboard
          </Btn>
        }
      />

      {health && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card title="Refs">
            <div className="font-display text-2xl font-semibold text-ink">{health.refs}</div>
          </Card>
          <Card title="Active refs">
            <div className="font-display text-2xl font-semibold text-ink">{health.activeRefs}</div>
          </Card>
          <Card title="Active JIT">
            <div className="font-display text-2xl font-semibold text-ink">{health.activeGrants}</div>
          </Card>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-800">{message}</p>}
      {loading && <p className="mb-4 text-sm text-muted">Loading PAM…</p>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card title="Register opaque ref">
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              void run(async () => {
                const input: Parameters<typeof createPamRef>[1] = { label, secretRef };
                if (purpose.trim()) input.purpose = purpose.trim();
                await createPamRef(token!, input);
                setLabel("");
                setSecretRef("ref://devtest/");
                setPurpose("");
                setMessage("Reference registered");
              });
            }}
          >
            <input className="w-full rounded-md border border-line px-3 py-2 text-sm" placeholder="Label" value={label} onChange={(e) => setLabel(e.target.value)} required />
            <input className="w-full rounded-md border border-line px-3 py-2 text-sm" placeholder="ref://devtest/…" value={secretRef} onChange={(e) => setSecretRef(e.target.value)} required />
            <input className="w-full rounded-md border border-line px-3 py-2 text-sm" placeholder="Purpose (optional)" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
            <Btn type="submit" disabled={busy}>
              Register ref
            </Btn>
          </form>
        </Card>

        <Card title="Issue JIT grant">
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              void run(async () => {
                const input: Parameters<typeof createPamGrant>[1] = {
                  subjectEmail,
                  permissionKey,
                  ttlSeconds: Number(ttlSeconds),
                };
                if (reason.trim()) input.reason = reason.trim();
                await createPamGrant(token!, input);
                setReason("");
                setMessage("JIT grant issued");
              });
            }}
          >
            <input className="w-full rounded-md border border-line px-3 py-2 text-sm" placeholder="Subject email" value={subjectEmail} onChange={(e) => setSubjectEmail(e.target.value)} required />
            <input className="w-full rounded-md border border-line px-3 py-2 text-sm" placeholder="Permission key" value={permissionKey} onChange={(e) => setPermissionKey(e.target.value)} required />
            <input className="w-full rounded-md border border-line px-3 py-2 text-sm" placeholder="TTL seconds" value={ttlSeconds} onChange={(e) => setTtlSeconds(e.target.value)} required />
            <input className="w-full rounded-md border border-line px-3 py-2 text-sm" placeholder="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} />
            <Btn type="submit" disabled={busy}>
              Issue grant
            </Btn>
          </form>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card title="Secret references">
          {refs.length === 0 && !loading ? (
            <p className="text-sm text-muted">No secret references.</p>
          ) : (
            <div className="divide-y divide-line">
              {refs.map((ref) => (
                <div key={ref.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <div className="font-medium text-ink">{ref.label}</div>
                    <div className="text-xs text-muted">
                      {ref.refCode} · {ref.secretRef}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {refBadge(ref.status)}
                    {ref.status === "active" && (
                      <Btn size="sm" variant="secondary" disabled={busy} onClick={() => void run(async () => { await retirePamRef(token!, ref.id); setMessage("Retired"); })}>
                        Retire
                      </Btn>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="JIT grants">
          {grants.length === 0 && !loading ? (
            <p className="text-sm text-muted">No JIT grants.</p>
          ) : (
            <div className="divide-y divide-line">
              {grants.map((grant) => (
                <div key={grant.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <div className="font-medium text-ink">{grant.permissionKey}</div>
                    <div className="text-xs text-muted">
                      {grant.grantCode} · {grant.subjectEmail}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {grantBadge(grant.status)}
                    {grant.status === "active" && (
                      <Btn size="sm" variant="secondary" disabled={busy} onClick={() => void run(async () => { await revokePamGrant(token!, grant.id); setMessage("Revoked"); })}>
                        Revoke
                      </Btn>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
