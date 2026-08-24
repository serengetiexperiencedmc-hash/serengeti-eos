"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import {
  BACKUP_JOB_STATUS_LABELS,
  createBackupJob,
  createRestoreProbe,
  getBcmHealth,
  listBackupJobs,
  listRestoreProbes,
  transitionBackupJob,
  type BcmBackupJob,
  type BcmRestoreProbe,
  type RestoreProbeOutcome,
} from "@/lib/bcm-api";

function jobBadge(job: BcmBackupJob) {
  if (job.status === "scheduled") return <Badge variant="review" label="Scheduled" />;
  if (job.status === "failed") return <Badge variant="draft" label="Failed" />;
  if (job.proven) return <Badge variant="won" label="Proven" />;
  return <Badge variant="progress" label="Unproven" />;
}

function probeBadge(outcome: BcmRestoreProbe["outcome"]) {
  return outcome === "passed" ? <Badge variant="won" label="Passed" /> : <Badge variant="draft" label="Failed" />;
}

export default function BcmBackupEvidencePage() {
  const { token, ready } = useEosSession();
  const [jobs, setJobs] = useState<BcmBackupJob[]>([]);
  const [probes, setProbes] = useState<BcmRestoreProbe[]>([]);
  const [health, setHealth] = useState<{ jobs: number; unprovenCompletedJobs: number; probes: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedIdRef = useRef<string | null>(null);
  selectedIdRef.current = selectedId;
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [backupDate, setBackupDate] = useState("");
  const [note, setNote] = useState("");
  const [probeOutcome, setProbeOutcome] = useState<RestoreProbeOutcome>("passed");
  const [probeNote, setProbeNote] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [list, h] = await Promise.all([listBackupJobs(token), getBcmHealth(token)]);
      setJobs(list.items);
      setHealth({
        jobs: h.jobs,
        unprovenCompletedJobs: h.unprovenCompletedJobs,
        probes: h.probes,
      });
    } catch (err) {
      setJobs([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load backup evidence");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const loadProbes = useCallback(
    async (jobId: string) => {
      if (!token) return;
      try {
        const list = await listRestoreProbes(token, jobId);
        setProbes(list.items);
      } catch (err) {
        setProbes([]);
        setError(err instanceof EosApiError ? err.message : "Failed to load restore probes");
      }
    },
    [token],
  );

  useEffect(() => {
    if (!token) return;
    void load();
  }, [token, load]);

  useEffect(() => {
    if (!token || !selectedId) {
      setProbes([]);
      return;
    }
    setProbes([]);
    void loadProbes(selectedId);
  }, [token, selectedId, loadProbes]);

  async function run(action: () => Promise<void>) {
    if (!token) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await action();
      await load();
      const id = selectedIdRef.current;
      if (id) await loadProbes(id);
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      if (statusFilter && job.status !== statusFilter) return false;
      if (!q) return true;
      return `${job.jobCode} ${job.backupDate}`.toLowerCase().includes(q);
    });
  }, [jobs, query, statusFilter]);

  const selected = jobs.find((job) => job.id === selectedId) ?? null;
  const probesForSelected = selected ? probes.filter((probe) => probe.jobId === selected.id) : [];

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view backup evidence.</p>;

  return (
    <>
      <PageHeader
        eyebrow="I17 · BCM"
        title="Backup evidence"
        subtitle="19:00 EAT job records and restore probes · not a backup product · job creator cannot record the probe"
        actions={
          <Btn variant="secondary" href="/commercial">
            ← Dashboard
          </Btn>
        }
      />

      {health && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card title="Jobs">
            <div className="font-display text-2xl font-semibold text-ink">{health.jobs}</div>
          </Card>
          <Card title="Unproven completed">
            <div className="font-display text-2xl font-semibold text-ink">{health.unprovenCompletedJobs}</div>
          </Card>
          <Card title="Probes">
            <div className="font-display text-2xl font-semibold text-ink">{health.probes}</div>
          </Card>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-800">{message}</p>}
      {loading && <p className="mb-4 text-sm text-muted">Loading backup evidence…</p>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-2">
          <Card title="Record 19:00 EAT job">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  const input: Parameters<typeof createBackupJob>[1] = { backupDate };
                  if (note.trim()) input.note = note.trim();
                  const created = await createBackupJob(token!, input);
                  selectedIdRef.current = created.job.id;
                  setSelectedId(created.job.id);
                  setBackupDate("");
                  setNote("");
                  setMessage("Job recorded for 19:00 EAT");
                });
              }}
            >
              <input
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                type="date"
                value={backupDate}
                onChange={(e) => setBackupDate(e.target.value)}
                required
              />
              <textarea
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                rows={3}
                placeholder="Note (optional — not a backup blob)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Btn type="submit" disabled={busy}>
                Record job
              </Btn>
            </form>
          </Card>

          <Card
            title="Queue"
            headerExtra={
              <div className="flex gap-2">
                <input
                  className="w-32 rounded-md border border-line px-2 py-1 text-xs"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <select
                  className="rounded-md border border-line px-2 py-1 text-xs"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {Object.entries(BACKUP_JOB_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            {visible.length === 0 && !loading ? (
              <p className="text-sm text-muted">No backup jobs match the current filter.</p>
            ) : (
              <div className="divide-y divide-line">
                {visible.map((job) => (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => setSelectedId(job.id)}
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 px-1 py-3 text-left ${selectedId === job.id ? "bg-sand/50" : ""}`}
                  >
                    <div>
                      <div className="font-medium text-ink">{job.backupDate}</div>
                      <div className="text-xs text-muted">
                        {job.jobCode} · {job.probeCount} probes
                      </div>
                    </div>
                    {jobBadge(job)}
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-5 xl:col-span-3">
          {!selected ? (
            <Card title="Job detail">
              <p className="text-sm text-muted">Select a job to complete, fail, or record a restore probe.</p>
            </Card>
          ) : (
            <>
              <Card title={selected.jobCode} headerExtra={jobBadge(selected)}>
                <p className="mb-4 text-sm text-muted">
                  {selected.backupDate} · scheduled {selected.scheduledFor} (19:00 EAT)
                  {` · ${selected.passedProbeCount} passed probes`}
                </p>
                {selected.note && <p className="mb-4 text-sm text-ink">{selected.note}</p>}
                <div className="flex flex-wrap gap-2">
                  {selected.status === "scheduled" && (
                    <>
                      <Btn
                        size="sm"
                        disabled={busy}
                        onClick={() =>
                          void run(async () => {
                            await transitionBackupJob(token!, selected.id, "complete");
                            setMessage("Job marked completed — still unproven until a passed probe");
                          })
                        }
                      >
                        Complete
                      </Btn>
                      <Btn
                        size="sm"
                        variant="secondary"
                        disabled={busy}
                        onClick={() =>
                          void run(async () => {
                            await transitionBackupJob(token!, selected.id, "fail");
                            setMessage("Job marked failed");
                          })
                        }
                      >
                        Fail
                      </Btn>
                    </>
                  )}
                </div>
              </Card>

              {selected.status === "completed" && (
                <Card title="Record restore probe">
                  <form
                    className="space-y-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void run(async () => {
                        const input: Parameters<typeof createRestoreProbe>[2] = { outcome: probeOutcome };
                        if (probeNote.trim()) input.note = probeNote.trim();
                        await createRestoreProbe(token!, selected.id, input);
                        setProbeNote("");
                        setMessage("Restore probe recorded");
                      });
                    }}
                  >
                    <select
                      className="w-full rounded-md border border-line px-3 py-2 text-sm"
                      value={probeOutcome}
                      onChange={(e) => setProbeOutcome(e.target.value as RestoreProbeOutcome)}
                    >
                      <option value="passed">Passed</option>
                      <option value="failed">Failed</option>
                    </select>
                    <textarea
                      className="w-full rounded-md border border-line px-3 py-2 text-sm"
                      rows={3}
                      placeholder="Notes (optional — not a live restore artefact)"
                      value={probeNote}
                      onChange={(e) => setProbeNote(e.target.value)}
                    />
                    <Btn type="submit" disabled={busy}>
                      Record probe
                    </Btn>
                    <p className="text-xs text-muted">Sign in as Bob to attest a job Carol recorded.</p>
                  </form>
                </Card>
              )}

              <Card title="Restore probes">
                {probesForSelected.length === 0 ? (
                  <p className="text-sm text-muted">No restore probes on this job.</p>
                ) : (
                  <div className="divide-y divide-line">
                    {probesForSelected.map((probe) => (
                      <div key={probe.id} className="flex items-center justify-between gap-3 py-3">
                        <div>
                          <div className="font-medium text-ink">{probe.probeCode}</div>
                          {probe.note && <p className="mt-1 text-sm text-ink">{probe.note}</p>}
                        </div>
                        {probeBadge(probe.outcome)}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </>
          )}
        </div>
      </div>
    </>
  );
}
