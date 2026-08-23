"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import {
  acceptAiDraft,
  acknowledgeAiRecommendStale,
  discardAiDraft,
  exportAiRecommendLastRun,
  exportAiRecommendStaleSuppression,
  getAiRecommendLastRun,
  listAiDrafts,
  snoozeAiRecommendStale,
  type AiDraft,
  type AiRecommendFreshness,
  type AiRecommendLastRun,
  type AiRecommendSuppression,
} from "@/lib/ai-api";
import { EosApiError } from "@/lib/eos-client";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "discarded", label: "Discarded" },
];

const TYPE_OPTIONS = [
  { value: "", label: "All types" },
  { value: "crm_task", label: "CRM task" },
  { value: "crm_activity", label: "CRM activity" },
];

function artefactLabel(type: string): string {
  return type === "crm_activity" ? "CRM activity" : "CRM task";
}

function freshnessLabel(freshness: AiRecommendFreshness): string {
  if (freshness.neverRun) return `Stale · never run (threshold ${freshness.thresholdHours}h)`;
  if (freshness.stale) return `Stale · ${freshness.ageHours ?? "?"}h (threshold ${freshness.thresholdHours}h)`;
  return `Fresh · ${freshness.ageHours ?? 0}h (threshold ${freshness.thresholdHours}h)`;
}

export default function AiDraftsPage() {
  const { token, ready } = useEosSession();
  const [status, setStatus] = useState("pending");
  const [artefactType, setArtefactType] = useState("");
  const [drafts, setDrafts] = useState<AiDraft[] | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastRun, setLastRun] = useState<AiRecommendLastRun | null>(null);
  const [freshness, setFreshness] = useState<AiRecommendFreshness | null>(null);
  const [suppression, setSuppression] = useState<AiRecommendSuppression | null>(null);
  const [suppressed, setSuppressed] = useState(false);
  const [runKeys, setRunKeys] = useState<string[]>([]);
  const [keyFilter, setKeyFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const reload = useCallback(
    (sessionToken: string) => {
      void listAiDrafts(sessionToken, {
        ...(status ? { status } : {}),
        ...(artefactType ? { artefactType } : {}),
      })
        .then((res) => {
          setDrafts(res.items);
          setPendingCount(res.pendingCount);
          setError(null);
        })
        .catch((err) => {
          setDrafts([]);
          setError(err instanceof EosApiError ? err.message : "Could not load drafts");
        });
    },
    [status, artefactType],
  );

  const reloadLastRun = useCallback(
    (sessionToken: string) => {
      void getAiRecommendLastRun(sessionToken, keyFilter || undefined)
        .then((res) => {
          setLastRun(res.lastRun);
          setFreshness(res.freshness);
          setSuppression(res.suppression);
          setSuppressed(res.suppressed);
          setRunKeys(res.keys);
        })
        .catch(() => {
          setLastRun(null);
          setFreshness(null);
          setSuppression(null);
          setSuppressed(false);
          setRunKeys([]);
        });
    },
    [keyFilter],
  );

  useEffect(() => {
    if (!token) {
      setDrafts(null);
      setLastRun(null);
      setFreshness(null);
      setSuppression(null);
      setSuppressed(false);
      setRunKeys([]);
      return;
    }
    reload(token);
    reloadLastRun(token);
  }, [token, reload, reloadLastRun]);

  if (ready && !token) {
    return <p className="text-sm text-muted">Sign in to review AI drafts. Nothing is applied until you accept.</p>;
  }

  return (
    <>
      <PageHeader
        eyebrow="I20.14 · Assistant"
        title="AI Drafts"
        subtitle="Filter unpublished assistant drafts. Export snooze/ack/clear audit. The assistant cannot merge, email, or approve."
      />
      <Card>
        <div className="mb-4 flex flex-wrap gap-3">
          <label className="text-xs text-muted">
            Status
            <select
              className="ml-2 rounded-md border border-line bg-paper px-2 py-1 text-sm text-ink"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value || "all-status"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-muted">
            Type
            <select
              className="ml-2 rounded-md border border-line bg-paper px-2 py-1 text-sm text-ink"
              value={artefactType}
              onChange={(event) => setArtefactType(event.target.value)}
            >
              {TYPE_OPTIONS.map((option) => (
                <option key={option.value || "all-type"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <p className="self-end text-xs text-muted">{pendingCount} pending</p>
          <label className="text-xs text-muted">
            Last-run key
            <input
              className="ml-2 rounded-md border border-line bg-paper px-2 py-1 text-sm text-ink"
              value={keyFilter}
              placeholder="crm. or events."
              onChange={(event) => setKeyFilter(event.target.value)}
            />
          </label>
          <p className="self-end text-xs text-muted">
            {lastRun
              ? `Last recommend ${new Date(lastRun.occurredAt).toLocaleString()} · ${runKeys.length}/${lastRun.count} keys · ${lastRun.provider}`
              : "No recommend run yet"}
            {freshness ? ` · ${freshnessLabel(freshness)}` : ""}
          </p>
          {freshness?.stale && !suppressed && (
            <p className="w-full rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
              {freshness.neverRun
                ? `Recommend last-run has never been recorded (stale after ${freshness.thresholdHours}h).`
                : `Recommend last-run is stale (${freshness.ageHours ?? "?"}h ≥ ${freshness.thresholdHours}h).`}
            </p>
          )}
          {freshness?.stale && suppressed && (
            <p className="w-full text-xs text-muted">
              {suppression?.acknowledgedAt
                ? "Stale recommend acknowledged until the next last-run."
                : suppression?.snoozedUntil
                  ? `Stale recommend snoozed until ${new Date(suppression.snoozedUntil).toLocaleString()}.`
                  : "Stale recommend suppressed."}
            </p>
          )}
          {token && freshness?.stale && !suppressed && (
            <>
              <Btn
                variant="secondary"
                size="sm"
                disabled={busy === "snooze"}
                onClick={() => {
                  setBusy("snooze");
                  setError(null);
                  void snoozeAiRecommendStale(token, 24)
                    .then(() => reloadLastRun(token))
                    .catch((err) => {
                      setError(err instanceof EosApiError ? err.message : "Could not snooze stale recommend");
                    })
                    .finally(() => setBusy(null));
                }}
              >
                {busy === "snooze" ? "Snoozing…" : "Snooze stale 24h"}
              </Btn>
              <Btn
                variant="secondary"
                size="sm"
                disabled={busy === "ack"}
                onClick={() => {
                  setBusy("ack");
                  setError(null);
                  void acknowledgeAiRecommendStale(token)
                    .then(() => reloadLastRun(token))
                    .catch((err) => {
                      setError(err instanceof EosApiError ? err.message : "Could not acknowledge stale recommend");
                    })
                    .finally(() => setBusy(null));
                }}
              >
                {busy === "ack" ? "Acknowledging…" : "Ack stale recommend"}
              </Btn>
            </>
          )}
          {token && (
            <Btn
              variant="secondary"
              size="sm"
              disabled={busy === "export"}
              onClick={() => {
                setBusy("export");
                setError(null);
                void exportAiRecommendLastRun(token, {
                  format: "csv",
                  ...(keyFilter ? { key: keyFilter } : {}),
                })
                  .then((res) => {
                    const blob = new Blob([res.csv ?? ""], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `ai-recommend-last-run-${res.generatedAt.slice(0, 10)}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  })
                  .catch((err) => {
                    setError(err instanceof EosApiError ? err.message : "Could not export last-run");
                  })
                  .finally(() => setBusy(null));
              }}
            >
              {busy === "export" ? "Exporting…" : "Export last-run"}
            </Btn>
          )}
          {token && (
            <Btn
              variant="secondary"
              size="sm"
              disabled={busy === "export-stale"}
              onClick={() => {
                setBusy("export-stale");
                setError(null);
                void exportAiRecommendStaleSuppression(token, "csv")
                  .then((res) => {
                    const blob = new Blob([res.csv ?? ""], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `ai-recommend-stale-audit-${res.generatedAt.slice(0, 10)}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  })
                  .catch((err) => {
                    setError(err instanceof EosApiError ? err.message : "Could not export stale audit");
                  })
                  .finally(() => setBusy(null));
              }}
            >
              {busy === "export-stale" ? "Exporting…" : "Export stale audit"}
            </Btn>
          )}
        </div>
        {error && <p className="mb-3 text-sm text-red-700">{error}</p>}
        {drafts === null ? (
          <p className="text-sm text-muted">Loading drafts…</p>
        ) : drafts.length === 0 ? (
          <p className="text-sm text-muted">No drafts match these filters.</p>
        ) : (
          <ul className="space-y-3">
            {drafts.map((draft) => (
              <li key={draft.id} className="rounded-md border border-line p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-ink">{draft.title}</p>
                  <span className="text-[0.65rem] uppercase tracking-wider text-muted">
                    {draft.status} · {artefactLabel(draft.artefactType)}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-xs text-muted">{draft.body}</p>
                {draft.status === "pending" && token && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Btn
                      variant="gold"
                      size="sm"
                      disabled={busy === `accept:${draft.id}`}
                      onClick={() => {
                        setBusy(`accept:${draft.id}`);
                        setError(null);
                        void acceptAiDraft(token, draft.id)
                          .then(() => reload(token))
                          .catch((err) => {
                            setError(err instanceof EosApiError ? err.message : "Could not accept draft");
                          })
                          .finally(() => setBusy(null));
                      }}
                    >
                      {busy === `accept:${draft.id}` ? "Accepting…" : "Accept"}
                    </Btn>
                    <Btn
                      variant="secondary"
                      size="sm"
                      disabled={busy === `discard:${draft.id}`}
                      onClick={() => {
                        setBusy(`discard:${draft.id}`);
                        setError(null);
                        void discardAiDraft(token, draft.id)
                          .then(() => reload(token))
                          .catch((err) => {
                            setError(err instanceof EosApiError ? err.message : "Could not discard draft");
                          })
                          .finally(() => setBusy(null));
                      }}
                    >
                      {busy === `discard:${draft.id}` ? "Discarding…" : "Discard"}
                    </Btn>
                  </div>
                )}
                {draft.status === "accepted" && draft.appliedEntityId && (
                  <p className="mt-2 text-xs text-muted">
                    Applied as {artefactLabel(draft.appliedEntityType ?? draft.artefactType)}
                    {draft.appliedHref ? (
                      <>
                        {" · "}
                        <Link href={draft.appliedHref} className="text-gold-deep underline">
                          Open in CRM
                        </Link>
                      </>
                    ) : (
                      <> · {draft.appliedEntityId}</>
                    )}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
