"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import {
  CI_CLASS_LABELS,
  createCi,
  createRelationship,
  deleteRelationship,
  getCi,
  getCmdbHealth,
  listCis,
  patchCi,
  type CmdbCi,
  type CmdbRelationship,
} from "@/lib/it-api";

const CI_CLASSES = Object.keys(CI_CLASS_LABELS);
const REL_TYPES = ["runs_on", "depends_on", "connects_to", "backed_up_by", "monitored_by", "owned_by", "provides"];

function lifecycleBadge(lifecycle: CmdbCi["lifecycle"]) {
  if (lifecycle === "active") return <Badge variant="won" label="Active" />;
  if (lifecycle === "maintenance") return <Badge variant="progress" label="Maintenance" />;
  if (lifecycle === "planned") return <Badge variant="review" label="Planned" />;
  return <Badge variant="draft" label="Retired" />;
}

export default function CmdbPage() {
  const { token, ready } = useEosSession();
  const [cis, setCis] = useState<CmdbCi[]>([]);
  const [health, setHealth] = useState<{ cis: number; relationships: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<{
    ci: CmdbCi;
    relationships: CmdbRelationship[];
    tickets: Array<{ ticketId: string; ticketCode: string; title: string; status: string }>;
  } | null>(null);
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [ciClass, setCiClass] = useState("application");
  const [lifecycle, setLifecycle] = useState<CmdbCi["lifecycle"]>("active");
  const [ownerName, setOwnerName] = useState("");
  const [editLifecycle, setEditLifecycle] = useState<CmdbCi["lifecycle"]>("active");
  const [editOwner, setEditOwner] = useState("");
  const [toCiId, setToCiId] = useState("");
  const [relType, setRelType] = useState("depends_on");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [list, h] = await Promise.all([listCis(token), getCmdbHealth(token)]);
      setCis(list.items);
      setHealth({ cis: h.cis, relationships: h.relationships });
      setToCiId((current) => current || list.items[1]?.id || list.items[0]?.id || "");
    } catch (err) {
      setCis([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load CMDB");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    void load();
  }, [token, load]);

  useEffect(() => {
    if (!token || !selectedId) {
      setDetail(null);
      return;
    }
    getCi(token, selectedId)
      .then((next) => {
        setDetail(next);
        setEditLifecycle(next.ci.lifecycle);
        setEditOwner(next.ci.ownerName ?? "");
      })
      .catch((err) => setError(err instanceof EosApiError ? err.message : "Failed to load CI"));
  }, [token, selectedId]);

  async function run(action: () => Promise<void>) {
    if (!token) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await action();
      await load();
      if (selectedId) {
        const next = await getCi(token, selectedId);
        setDetail(next);
        setEditLifecycle(next.ci.lifecycle);
        setEditOwner(next.ci.ownerName ?? "");
      }
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cis.filter((ci) => {
      if (classFilter && ci.ciClass !== classFilter) return false;
      if (!q) return true;
      return `${ci.ciCode} ${ci.name} ${ci.ciClass}`.toLowerCase().includes(q);
    });
  }, [cis, query, classFilter]);

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view the CMDB.</p>;

  return (
    <>
      <PageHeader
        eyebrow="I11 · IT"
        title="Configuration Items"
        subtitle="CMDB classes, lifecycle, and relationships"
        actions={
          <div className="flex gap-2">
            <Btn variant="secondary" href="/commercial/itsm">
              Service Desk
            </Btn>
            <Btn variant="secondary" href="/commercial/itsm/changes">
              Changes
            </Btn>
            <Btn variant="secondary" href="/commercial/itsm/problems">
              Problems
            </Btn>
            <Btn variant="secondary" href="/commercial/itsm/releases">
              Releases
            </Btn>
            <Btn variant="secondary" href="/commercial">
              ← Dashboard
            </Btn>
          </div>
        }
      />

      {health && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card title="CIs">
            <div className="font-display text-2xl font-semibold text-ink">{health.cis}</div>
          </Card>
          <Card title="Relationships">
            <div className="font-display text-2xl font-semibold text-ink">{health.relationships}</div>
          </Card>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-800">{message}</p>}
      {loading && <p className="mb-4 text-sm text-muted">Loading CMDB…</p>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-2">
          <Card title="Register CI">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  const input: Parameters<typeof createCi>[1] = { name, ciClass, lifecycle };
                  if (ownerName.trim()) input.ownerName = ownerName.trim();
                  await createCi(token!, input);
                  setName("");
                  setOwnerName("");
                  setMessage("CI created");
                });
              }}
            >
              <input className="w-full rounded-md border border-line px-3 py-2 text-sm" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <select className="w-full rounded-md border border-line px-3 py-2 text-sm" value={ciClass} onChange={(e) => setCiClass(e.target.value)}>
                {CI_CLASSES.map((value) => (
                  <option key={value} value={value}>
                    {CI_CLASS_LABELS[value]}
                  </option>
                ))}
              </select>
              <select className="w-full rounded-md border border-line px-3 py-2 text-sm" value={lifecycle} onChange={(e) => setLifecycle(e.target.value as CmdbCi["lifecycle"])}>
                <option value="planned">Planned</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
              </select>
              <input className="w-full rounded-md border border-line px-3 py-2 text-sm" placeholder="Owner name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
              <Btn type="submit" disabled={busy}>
                Create CI
              </Btn>
            </form>
          </Card>

          <Card
            title="Catalogue"
            headerExtra={
              <div className="flex gap-2">
                <input className="w-32 rounded-md border border-line px-2 py-1 text-xs" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
                <select className="rounded-md border border-line px-2 py-1 text-xs" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
                  <option value="">All classes</option>
                  {CI_CLASSES.map((value) => (
                    <option key={value} value={value}>
                      {CI_CLASS_LABELS[value]}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            {visible.length === 0 && !loading ? (
              <p className="text-sm text-muted">No configuration items match the current filter.</p>
            ) : (
              <div className="divide-y divide-line">
                {visible.map((ci) => (
                  <button
                    key={ci.id}
                    type="button"
                    onClick={() => setSelectedId(ci.id)}
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 px-1 py-3 text-left ${selectedId === ci.id ? "bg-sand/50" : ""}`}
                  >
                    <div>
                      <div className="font-medium text-ink">{ci.name}</div>
                      <div className="text-xs text-muted">
                        {ci.ciCode} · {CI_CLASS_LABELS[ci.ciClass] ?? ci.ciClass}
                      </div>
                    </div>
                    {lifecycleBadge(ci.lifecycle)}
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="xl:col-span-3">
          {!detail ? (
            <Card title="CI detail">
              <p className="text-sm text-muted">Select a configuration item to edit lifecycle, relationships, and related tickets.</p>
            </Card>
          ) : (
            <div className="space-y-5">
              <Card title={detail.ci.name} headerExtra={lifecycleBadge(detail.ci.lifecycle)}>
                <p className="mb-4 text-sm text-muted">
                  {detail.ci.ciCode} · {CI_CLASS_LABELS[detail.ci.ciClass] ?? detail.ci.ciClass} · {detail.ci.environment} · {detail.ci.criticality}
                </p>
                <form
                  className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void run(async () => {
                      const input: Parameters<typeof patchCi>[2] = { lifecycle: editLifecycle };
                      if (editOwner.trim()) input.ownerName = editOwner.trim();
                      else input.ownerName = "";
                      await patchCi(token!, detail.ci.id, input);
                      setMessage("CI updated");
                    });
                  }}
                >
                  <select className="rounded-md border border-line px-3 py-2 text-sm" value={editLifecycle} onChange={(e) => setEditLifecycle(e.target.value as CmdbCi["lifecycle"])}>
                    <option value="planned">Planned</option>
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="retired">Retired</option>
                  </select>
                  <input className="rounded-md border border-line px-3 py-2 text-sm" placeholder="Owner name" value={editOwner} onChange={(e) => setEditOwner(e.target.value)} />
                  <div className="sm:col-span-2">
                    <Btn type="submit" disabled={busy}>
                      Save CI
                    </Btn>
                  </div>
                </form>
              </Card>

              <Card title="Relationships">
                <form
                  className="mb-4 flex flex-wrap items-end gap-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void run(async () => {
                      await createRelationship(token!, {
                        fromCiId: detail.ci.id,
                        toCiId,
                        relType,
                      });
                      setMessage("Relationship created");
                    });
                  }}
                >
                  <select className="rounded-md border border-line px-3 py-2 text-sm" value={toCiId} onChange={(e) => setToCiId(e.target.value)}>
                    {cis
                      .filter((ci) => ci.id !== detail.ci.id)
                      .map((ci) => (
                        <option key={ci.id} value={ci.id}>
                          {ci.ciCode} · {ci.name}
                        </option>
                      ))}
                  </select>
                  <select className="rounded-md border border-line px-3 py-2 text-sm" value={relType} onChange={(e) => setRelType(e.target.value)}>
                    {REL_TYPES.map((value) => (
                      <option key={value} value={value}>
                        {value.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                  <Btn type="submit" disabled={busy || !toCiId}>
                    Add relationship
                  </Btn>
                </form>
                {detail.relationships.length === 0 ? (
                  <p className="text-sm text-muted">No relationships recorded.</p>
                ) : (
                  <div className="space-y-2">
                    {detail.relationships.map((rel) => (
                      <div key={rel.id} className="flex items-center justify-between rounded border border-line px-3 py-2 text-sm">
                        <span>
                          {rel.fromCiCode} {rel.relType.replaceAll("_", " ")} {rel.toCiCode}
                        </span>
                        <Btn size="sm" variant="ghost" disabled={busy} onClick={() => void run(async () => { await deleteRelationship(token!, rel.id); setMessage("Relationship removed"); })}>
                          Remove
                        </Btn>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card title="Related tickets">
                {detail.tickets.length === 0 ? (
                  <p className="text-sm text-muted">No service-desk tickets linked to this CI.</p>
                ) : (
                  <div className="space-y-2">
                    {detail.tickets.map((ticket) => (
                      <Link key={ticket.ticketId} href="/commercial/itsm" className="block rounded border border-line px-3 py-2 text-sm text-gold-deep underline">
                        {ticket.ticketCode} · {ticket.title} · {ticket.status}
                      </Link>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
