"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import {
  AUTHORITY_STATE_LABELS,
  createKnowledgeDocument,
  DOCUMENT_TYPE_LABELS,
  getKnowledgeHealth,
  listKnowledgeDocuments,
  transitionKnowledgeDocument,
  type KnowledgeDocument,
  type KnowledgeDocumentType,
} from "@/lib/knowledge-api";

function stateBadge(state: KnowledgeDocument["authorityState"]) {
  if (state === "draft") return <Badge variant="review" label="Draft" />;
  if (state === "authoritative") return <Badge variant="won" label="Authoritative" />;
  return <Badge variant="draft" label="Retired" />;
}

export default function KnowledgePage() {
  const { token, ready } = useEosSession();
  const [docs, setDocs] = useState<KnowledgeDocument[]>([]);
  const [health, setHealth] = useState<{ documents: number; authoritative: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [documentType, setDocumentType] = useState<KnowledgeDocumentType>("note");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const listQuery: { q?: string; type?: string; state?: string } = {};
      if (query.trim()) listQuery.q = query.trim();
      if (typeFilter) listQuery.type = typeFilter;
      if (stateFilter) listQuery.state = stateFilter;
      const [list, h] = await Promise.all([listKnowledgeDocuments(token, listQuery), getKnowledgeHealth(token)]);
      setDocs(list.items);
      setHealth({ documents: h.documents, authoritative: h.authoritative });
    } catch (err) {
      setDocs([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load knowledge");
    } finally {
      setLoading(false);
    }
  }, [token, query, typeFilter, stateFilter]);

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

  const selected = docs.find((doc) => doc.id === selectedId) ?? null;

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view knowledge.</p>;

  return (
    <>
      <PageHeader
        eyebrow="I19 · Knowledge"
        title="Documents"
        subtitle="Tenant-scoped search over title and body · not a graph database · no autonomous publishing"
        actions={
          <Btn variant="secondary" href="/commercial">
            ← Dashboard
          </Btn>
        }
      />

      {health && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card title="Documents">
            <div className="font-display text-2xl font-semibold text-ink">{health.documents}</div>
          </Card>
          <Card title="Authoritative">
            <div className="font-display text-2xl font-semibold text-ink">{health.authoritative}</div>
          </Card>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-800">{message}</p>}
      {loading && <p className="mb-4 text-sm text-muted">Loading knowledge…</p>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-2">
          <Card title="Create document">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  const input: Parameters<typeof createKnowledgeDocument>[1] = { title, documentType };
                  if (body.trim()) input.body = body.trim();
                  const created = await createKnowledgeDocument(token!, input);
                  setSelectedId(created.document.id);
                  setTitle("");
                  setBody("");
                  setDocumentType("note");
                  setMessage("Document created as draft");
                });
              }}
            >
              <input className="w-full rounded-md border border-line px-3 py-2 text-sm" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <select className="w-full rounded-md border border-line px-3 py-2 text-sm" value={documentType} onChange={(e) => setDocumentType(e.target.value as KnowledgeDocumentType)}>
                {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <textarea className="w-full rounded-md border border-line px-3 py-2 text-sm" rows={4} placeholder="Body (optional, searchable)" value={body} onChange={(e) => setBody(e.target.value)} />
              <Btn type="submit" disabled={busy}>
                Create draft
              </Btn>
            </form>
          </Card>

          <Card
            title="Search"
            headerExtra={
              <div className="flex gap-2">
                <select className="rounded-md border border-line px-2 py-1 text-xs" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="">All types</option>
                  {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <select className="rounded-md border border-line px-2 py-1 text-xs" value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
                  <option value="">All states</option>
                  {Object.entries(AUTHORITY_STATE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            <input
              className="mb-3 w-full rounded-md border border-line px-3 py-2 text-sm"
              placeholder="Search title and body (q)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {docs.length === 0 && !loading ? (
              <p className="text-sm text-muted">No documents match the current search.</p>
            ) : (
              <div className="divide-y divide-line">
                {docs.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedId(doc.id)}
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 px-1 py-3 text-left ${selectedId === doc.id ? "bg-sand/50" : ""}`}
                  >
                    <div>
                      <div className="font-medium text-ink">{doc.title}</div>
                      <div className="text-xs text-muted">
                        {doc.docCode} · {DOCUMENT_TYPE_LABELS[doc.documentType]}
                      </div>
                    </div>
                    {stateBadge(doc.authorityState)}
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="xl:col-span-3">
          {!selected ? (
            <Card title="Document detail">
              <p className="text-sm text-muted">Select a document to publish or retire. Publishing is human-only.</p>
            </Card>
          ) : (
            <Card title={selected.title} headerExtra={stateBadge(selected.authorityState)}>
              <p className="mb-4 text-sm text-muted">
                {selected.docCode} · {DOCUMENT_TYPE_LABELS[selected.documentType]}
              </p>
              {selected.body && <p className="mb-4 whitespace-pre-wrap text-sm text-ink">{selected.body}</p>}
              <div className="flex flex-wrap gap-2">
                {selected.authorityState === "draft" && (
                  <Btn size="sm" disabled={busy} onClick={() => void run(async () => { await transitionKnowledgeDocument(token!, selected.id, "publish"); setMessage("Published as authoritative"); })}>
                    Publish
                  </Btn>
                )}
                {selected.authorityState !== "retired" && (
                  <Btn size="sm" variant="secondary" disabled={busy} onClick={() => void run(async () => { await transitionKnowledgeDocument(token!, selected.id, "retire"); setMessage("Retired"); })}>
                    Retire
                  </Btn>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
