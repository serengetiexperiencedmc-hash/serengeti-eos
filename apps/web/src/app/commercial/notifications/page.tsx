"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import {
  dismissAllNotifications,
  dismissNotification,
  dispatchEmailDigest,
  getEmailAdapterHealth,
  getEmailDeliveryAnalytics,
  listEmailDeliveryEvents,
  listEmailOutbox,
  listEmailSuppressions,
  listEmailTemplates,
  listNotifications,
  liftEmailSuppression,
  previewEmailTemplate,
  saveEmailTemplate,
  syncEmailSuppressions,
  exportEmailSuppressions,
  bulkLiftEmailSuppressions,
  importEmailSuppressions,
  listEmailAllowlist,
  addEmailAllowlist,
  revokeEmailAllowlist,
  approveSesNotedAllowlist,
  exportEmailAllowlist,
  dispatchAllowlistDualDigest,
  dispatchAllowlistDualDigestStaleAlert,
  getAllowlistDualDigestStatus,
  snoozeAllowlistDualDigestStale,
  acknowledgeAllowlistDualDigestStale,
  exportAllowlistDualDigestStaleSuppression,
  upsertAllowlistDualDigestStaleAuditExportPreset,
  type AllowlistStaleAuditExportPreset,
  type DigestLastRun,
  type EmailDeliveryAnalytics,
  type EmailDeliveryEventItem,
  type EmailOutboxItem,
  type EmailSuppressionItem,
  type EmailAllowlistItem,
  type EmailTemplateItem,
  type NotificationItem,
} from "@/lib/notifications-api";

export default function NotificationsPage() {
  const { token, ready } = useEosSession();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [outbox, setOutbox] = useState<EmailOutboxItem[]>([]);
  const [suppressions, setSuppressions] = useState<EmailSuppressionItem[]>([]);
  const [allowlist, setAllowlist] = useState<EmailAllowlistItem[]>([]);
  const [allowlistEmail, setAllowlistEmail] = useState("");
  const [allowlistNote, setAllowlistNote] = useState("");
  const [allowlistExpires, setAllowlistExpires] = useState("");
  const [selectedSuppressions, setSelectedSuppressions] = useState<Set<string>>(new Set());
  const [importCsv, setImportCsv] = useState("");
  const [deliveryEvents, setDeliveryEvents] = useState<EmailDeliveryEventItem[]>([]);
  const [analytics, setAnalytics] = useState<EmailDeliveryAnalytics | null>(null);
  const [templates, setTemplates] = useState<EmailTemplateItem[]>([]);
  const [adapter, setAdapter] = useState("dev-outbox");
  const [error, setError] = useState<string | null>(null);
  const [dispatchMsg, setDispatchMsg] = useState<string | null>(null);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const [staleAuditAction, setStaleAuditAction] = useState("");
  const [staleAuditSince, setStaleAuditSince] = useState("");
  const [staleAuditUntil, setStaleAuditUntil] = useState("");
  const [staleAuditHydrated, setStaleAuditHydrated] = useState(false);
  const [staleAuditPresets, setStaleAuditPresets] = useState<AllowlistStaleAuditExportPreset[]>([]);
  const [staleAuditPresetId, setStaleAuditPresetId] = useState("");
  const [staleAuditPresetName, setStaleAuditPresetName] = useState("");
  const [presetBusy, setPresetBusy] = useState(false);

  const [selectedKey, setSelectedKey] = useState<string>("");
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editorMsg, setEditorMsg] = useState<string | null>(null);
  const [editorBusy, setEditorBusy] = useState(false);
  const [preview, setPreview] = useState<{ subject: string; bodyText: string } | null>(null);
  const [allowlistDigest, setAllowlistDigest] = useState<{
    lastRun: DigestLastRun | null;
    outboxDigestCount: number;
    freshness?: { stale: boolean; neverRun: boolean; ageHours: number | null; thresholdHours: number };
  } | null>(null);

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.key === selectedKey),
    [templates, selectedKey],
  );

  async function reload() {
    if (!token) return;
    const [inbox, emailOutbox, tmpl, health, suppressed, events, stats, allowed, dualStatus] = await Promise.all([
      listNotifications(token),
      listEmailOutbox(token),
      listEmailTemplates(token),
      getEmailAdapterHealth(token),
      listEmailSuppressions(token),
      listEmailDeliveryEvents(token, 15),
      getEmailDeliveryAnalytics(token),
      listEmailAllowlist(token),
      getAllowlistDualDigestStatus(token).catch(() => null),
    ]);
    setItems(inbox.items);
    setOutbox(emailOutbox.items);
    setTemplates(tmpl.items);
    setAdapter(health.adapter);
    setSuppressions(suppressed.items);
    setAllowlist(allowed.items);
    setDeliveryEvents(events.items);
    setAnalytics(stats.analytics);
    setAllowlistDigest(
      dualStatus
        ? {
            lastRun: dualStatus.lastRun,
            outboxDigestCount: dualStatus.analytics.outboxDigestCount,
            freshness: dualStatus.freshness,
          }
        : health.allowlistDualDigestLastRun
          ? { lastRun: health.allowlistDualDigestLastRun, outboxDigestCount: 0 }
          : null,
    );
    if (dualStatus?.presets) setStaleAuditPresets(dualStatus.presets);
    if (dualStatus?.lastFilter && !staleAuditHydrated) {
      setStaleAuditAction(dualStatus.lastFilter.action ?? "");
      setStaleAuditSince(dualStatus.lastFilter.since ?? "");
      setStaleAuditUntil(dualStatus.lastFilter.until ?? "");
      setStaleAuditHydrated(true);
    }
    if (tmpl.items.length > 0 && !selectedKey) {
      const first = tmpl.items[0];
      setSelectedKey(first.key);
      setEditSubject(first.subject);
      setEditBody(first.bodyText);
    }
  }

  useEffect(() => {
    if (!token) return;
    reload().catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, [token]);

  useEffect(() => {
    if (!selectedTemplate) return;
    setEditSubject(selectedTemplate.subject);
    setEditBody(selectedTemplate.bodyText);
    setPreview(null);
    setEditorMsg(null);
  }, [selectedKey, selectedTemplate]);

  async function handleDispatch() {
    if (!token) return;
    setDispatchMsg(null);
    const res = await dispatchEmailDigest(token);
    setDispatchMsg(`Dispatched ${res.dispatched.length} email(s) via ${res.adapter}`);
    await reload();
  }

  async function handleAllowlistDualDigest() {
    if (!token) return;
    setDispatchMsg(null);
    const res = await dispatchAllowlistDualDigest(token);
    setDispatchMsg(
      `Allowlist dual digest: ${res.dispatched.length} sent · pending ${res.pendingCount}${
        res.lastRun ? ` · last run ${res.lastRun.day}` : ""
      }`,
    );
    await reload();
  }

  async function handleSyncSuppressions() {
    if (!token) return;
    setSyncMsg(null);
    try {
      const res = await syncEmailSuppressions(token);
      const noted = res.allowlistSesNoted ?? 0;
      setSyncMsg(
        `Synced SES suppressions · imported ${res.imported}, updated ${res.updated}` +
          (noted > 0 ? `, allowlist SES notes ${noted}` : ""),
      );
      await reload();
    } catch (err) {
      setSyncMsg(err instanceof Error ? err.message : "SES sync unavailable");
    }
  }

  async function handleExportSuppressions() {
    if (!token) return;
    setSyncMsg(null);
    try {
      const res = await exportEmailSuppressions(token, { format: "csv" });
      const blob = new Blob([res.csv ?? ""], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `email-suppressions-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setSyncMsg(`Exported ${res.count} suppression(s)`);
    } catch (err) {
      setSyncMsg(err instanceof Error ? err.message : "Export failed");
    }
  }

  async function handleBulkLift() {
    if (!token || selectedSuppressions.size === 0) return;
    setSyncMsg(null);
    try {
      const res = await bulkLiftEmailSuppressions(token, { ids: [...selectedSuppressions] });
      setSyncMsg(`Lifted ${res.lifted} suppression(s)`);
      setSelectedSuppressions(new Set());
      await reload();
    } catch (err) {
      setSyncMsg(err instanceof Error ? err.message : "Bulk lift failed");
    }
  }

  async function handleImportSuppressions() {
    if (!token || !importCsv.trim()) return;
    setSyncMsg(null);
    try {
      const res = await importEmailSuppressions(token, { csv: importCsv });
      setSyncMsg(`Imported ${res.imported}, updated ${res.updated}, skipped ${res.skipped}`);
      setImportCsv("");
      await reload();
    } catch (err) {
      setSyncMsg(err instanceof Error ? err.message : "Import failed");
    }
  }

  async function handleSaveTemplate() {
    if (!token || !selectedKey) return;
    setEditorBusy(true);
    setEditorMsg(null);
    try {
      const res = await saveEmailTemplate(token, selectedKey, {
        subject: editSubject,
        bodyText: editBody,
      });
      setEditorMsg(`Saved tenant override for ${res.template.key}`);
      await reload();
    } catch (err) {
      setEditorMsg(err instanceof Error ? err.message : "Save failed");
    } finally {
      setEditorBusy(false);
    }
  }

  async function handlePreview() {
    if (!token || !selectedKey) return;
    setEditorBusy(true);
    setEditorMsg(null);
    try {
      const res = await previewEmailTemplate(token, selectedKey);
      setPreview(res.preview);
    } catch (err) {
      setEditorMsg(err instanceof Error ? err.message : "Preview failed");
    } finally {
      setEditorBusy(false);
    }
  }

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view notifications.</p>;

  return (
    <>
      <PageHeader
        eyebrow="I3 · I3.33 · Notifications"
        title="Action Inbox"
        subtitle={`Live alerts + email digest · adapter: ${adapter}`}
        actions={
          token ? (
            <div className="flex gap-2">
              <Btn variant="secondary" onClick={() => void handleDispatch()}>
                Dispatch email digest
              </Btn>
              <Btn variant="secondary" onClick={() => void handleAllowlistDualDigest()}>
                Dispatch allowlist digest
              </Btn>
              {items.length > 0 && (
                <Btn variant="secondary" onClick={() => void dismissAllNotifications(token).then(reload)}>
                  Dismiss all
                </Btn>
              )}
            </div>
          ) : undefined
        }
      />
      {error && <p className="mb-4 text-sm text-danger">{error}</p>}
      {dispatchMsg && <p className="mb-4 text-sm text-gold-deep">{dispatchMsg}</p>}
      {syncMsg && <p className="mb-4 text-sm text-gold-deep">{syncMsg}</p>}
      {analytics && (
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card title="Active suppressions">
            <p className="text-2xl font-semibold text-ink">{analytics.activeSuppressions}</p>
            <p className="text-xs text-muted">{analytics.liftedSuppressions} lifted</p>
          </Card>
          <Card title={`Events (${analytics.windowHours}h)`}>
            <p className="text-2xl font-semibold text-ink">{analytics.recentDeliveryEvents}</p>
            <p className="text-xs text-muted">
              {Object.entries(analytics.deliveryEventsByType)
                .map(([k, v]) => `${k}: ${v}`)
                .join(" · ") || "No events yet"}
            </p>
          </Card>
          <Card title="Suppression reasons">
            <p className="text-sm text-muted">
              {Object.entries(analytics.suppressionsByReason)
                .map(([k, v]) => `${k}: ${v}`)
                .join(" · ") || "None active"}
            </p>
          </Card>
          <Card title="Outbox status">
            <p className="text-sm text-muted">
              {Object.entries(analytics.outboxByStatus)
                .map(([k, v]) => `${k}: ${v}`)
                .join(" · ") || "Empty"}
            </p>
          </Card>
        </div>
      )}
      <Card title={`${items.length} notification(s)`}>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.key} className="flex items-start justify-between gap-3 rounded border border-line px-3 py-3">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted">{item.category}</div>
                <div className="font-medium text-ink">{item.title}</div>
                <div className="text-sm text-muted">{item.body}</div>
                <Link href={item.href} className="mt-1 inline-block text-sm text-gold-deep hover:underline">
                  Open →
                </Link>
              </div>
              {token && (
                <Btn variant="ghost" size="sm" onClick={() => void dismissNotification(token, item.key).then(reload)}>
                  Dismiss
                </Btn>
              )}
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-muted">No actionable alerts right now.</p>}
        </div>
      </Card>
      <div className="mt-4">
        <Card title={`Email outbox (${outbox.length})`}>
          <p className="mb-3 text-sm text-muted">
            Dev/Test adapter records urgent and warning alerts as email messages (no SMTP). Idempotent per notification key.
          </p>
          <div className="space-y-2">
            {outbox.map((entry) => (
              <div key={entry.id} className="rounded border border-line px-3 py-3">
                <div className="text-xs uppercase tracking-wide text-muted">{entry.templateKey}</div>
                <div className="font-medium text-ink">{entry.subject}</div>
                <div className="text-sm text-muted">
                  To {entry.to} · {entry.status} · {entry.adapter}
                </div>
              </div>
            ))}
            {outbox.length === 0 && <p className="text-sm text-muted">No emails dispatched yet.</p>}
          </div>
        </Card>
      </div>
      <div className="mt-4">
        <Card title={`Delivery events (${deliveryEvents.length})`}>
          <p className="mb-3 text-sm text-muted">SES webhook audit trail — recent delivery lifecycle events (I3.12).</p>
          <div className="space-y-2">
            {deliveryEvents.map((e) => (
              <div key={e.id} className="rounded border border-line px-3 py-3">
                <div className="text-xs uppercase tracking-wide text-muted">{e.eventType}</div>
                <div className="font-medium text-ink">{e.recipientEmail ?? "—"}</div>
                <div className="text-xs text-muted">{new Date(e.receivedAt).toLocaleString()}</div>
              </div>
            ))}
            {deliveryEvents.length === 0 && <p className="text-sm text-muted">No delivery events yet.</p>}
          </div>
        </Card>
      </div>
      <div className="mt-4">
        <Card title={`Email suppressions (${suppressions.length})`}>
          <p className="mb-3 text-sm text-muted">
            Bounce, complaint, reject, and SES account suppressions block further sends until lifted — unless allowlisted (I3.14).
          </p>
          {token && (
            <div className="mb-3 flex flex-wrap gap-2">
              <Btn variant="secondary" size="sm" onClick={() => void handleSyncSuppressions()}>
                Sync from SES
              </Btn>
              <Btn variant="secondary" size="sm" onClick={() => void handleExportSuppressions()}>
                Export CSV
              </Btn>
              {selectedSuppressions.size > 0 && (
                <Btn variant="secondary" size="sm" onClick={() => void handleBulkLift()}>
                  Lift selected ({selectedSuppressions.size})
                </Btn>
              )}
            </div>
          )}
          {token && (
            <div className="mb-3 space-y-2 rounded border border-line bg-sand/20 p-3">
              <div className="text-xs uppercase tracking-wide text-muted">Import CSV (email,reason)</div>
              <textarea
                rows={3}
                value={importCsv}
                onChange={(e) => setImportCsv(e.target.value)}
                placeholder={"email,reason\nbad@example.com,bounce"}
                className="w-full rounded border border-line bg-paper px-2 py-1.5 font-mono text-xs"
              />
              <Btn variant="secondary" size="sm" disabled={!importCsv.trim()} onClick={() => void handleImportSuppressions()}>
                Import suppressions
              </Btn>
            </div>
          )}
          <div className="space-y-2">
            {suppressions.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 rounded border border-line px-3 py-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={selectedSuppressions.has(s.id)}
                    onChange={() => {
                      setSelectedSuppressions((prev) => {
                        const next = new Set(prev);
                        if (next.has(s.id)) next.delete(s.id);
                        else next.add(s.id);
                        return next;
                      });
                    }}
                  />
                  <div>
                    <div className="font-medium text-ink">{s.email}</div>
                    <div className="text-xs capitalize text-muted">
                      {s.reason} · {new Date(s.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                {token && (
                  <Btn
                    variant="secondary"
                    size="sm"
                    onClick={() => void liftEmailSuppression(token, s.id).then(reload)}
                  >
                    Lift
                  </Btn>
                )}
              </div>
            ))}
            {suppressions.length === 0 && <p className="text-sm text-muted">No active suppressions.</p>}
          </div>
        </Card>
      </div>
      <div className="mt-4">
        <Card title={`Transactional allowlist (${allowlist.length})`}>
          <p className="mb-3 text-sm text-muted">
            Allowlisted addresses bypass suppressions until expiry or revoke; SES sync stamps overlap notes (I3.16).
          </p>
          {allowlistDigest && (
            <p className="mb-3 text-xs text-muted">
              Dual-control digest last run:{" "}
              {allowlistDigest.lastRun
                ? `${allowlistDigest.lastRun.day} · pending ${allowlistDigest.lastRun.pendingCount ?? 0} · sent ${allowlistDigest.lastRun.dispatchedCount} · outbox ${allowlistDigest.outboxDigestCount}`
                : "never"}
              {allowlistDigest.freshness?.stale ? " · stale" : ""}
            </p>
          )}
          {allowlistDigest?.freshness?.stale && (
            <p className="mb-3 rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
              {allowlistDigest.freshness.neverRun
                ? `Allowlist dual digest has never run (stale after ${allowlistDigest.freshness.thresholdHours}h).`
                : `Allowlist dual digest is stale (${allowlistDigest.freshness.ageHours ?? "?"}h ≥ ${allowlistDigest.freshness.thresholdHours}h).`}
            </p>
          )}
          {token && (
            <div className="mb-3 flex flex-wrap gap-2">
              <Btn
                variant="secondary"
                size="sm"
                disabled={!allowlistDigest?.freshness?.stale}
                onClick={() =>
                  void dispatchAllowlistDualDigestStaleAlert(token)
                    .then((res) => {
                      setSyncMsg(
                        res.dispatched.length > 0
                          ? `Stale allowlist digest alert: ${res.dispatched.length} sent`
                          : `Stale allowlist alert skipped (${res.skipped[0]?.reason ?? "none"})`,
                      );
                      return reload();
                    })
                    .catch((err) => setError(err instanceof Error ? err.message : "Stale alert failed"))
                }
              >
                Escalate stale digest
              </Btn>
              <Btn
                variant="secondary"
                size="sm"
                disabled={!allowlistDigest?.freshness?.stale}
                onClick={() =>
                  void snoozeAllowlistDualDigestStale(token, 24)
                    .then(() => {
                      setSyncMsg("Stale allowlist digest snoozed 24h");
                      return reload();
                    })
                    .catch((err) => setError(err instanceof Error ? err.message : "Snooze failed"))
                }
              >
                Snooze stale 24h
              </Btn>
              <Btn
                variant="secondary"
                size="sm"
                disabled={!allowlistDigest?.freshness?.stale}
                onClick={() =>
                  void acknowledgeAllowlistDualDigestStale(token)
                    .then(() => {
                      setSyncMsg("Stale allowlist digest acknowledged");
                      return reload();
                    })
                    .catch((err) => setError(err instanceof Error ? err.message : "Ack failed"))
                }
              >
                Ack stale digest
              </Btn>
              <label className="text-xs text-muted">
                Audit preset
                <select
                  className="ml-2 rounded-md border border-line bg-paper px-2 py-1 text-sm text-ink"
                  value={staleAuditPresetId}
                  onChange={(event) => {
                    const nextId = event.target.value;
                    setStaleAuditPresetId(nextId);
                    const preset = staleAuditPresets.find((row) => row.id === nextId);
                    if (!preset) return;
                    setStaleAuditAction(preset.action ?? "");
                    setStaleAuditSince(preset.since ?? "");
                    setStaleAuditUntil(preset.until ?? "");
                    setStaleAuditPresetName(preset.name);
                  }}
                >
                  <option value="">No preset</option>
                  {staleAuditPresets.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-muted">
                Preset name
                <input
                  className="ml-2 rounded-md border border-line bg-paper px-2 py-1 text-sm text-ink"
                  value={staleAuditPresetName}
                  placeholder="Last 24h snoozes"
                  onChange={(event) => setStaleAuditPresetName(event.target.value)}
                />
              </label>
              <Btn
                variant="secondary"
                size="sm"
                disabled={presetBusy || !staleAuditPresetName.trim()}
                onClick={() => {
                  setPresetBusy(true);
                  void upsertAllowlistDualDigestStaleAuditExportPreset(token, {
                    name: staleAuditPresetName.trim(),
                    ...(staleAuditAction ? { action: staleAuditAction } : {}),
                    ...(staleAuditSince.trim() ? { since: staleAuditSince.trim() } : {}),
                    ...(staleAuditUntil.trim() ? { until: staleAuditUntil.trim() } : {}),
                  })
                    .then((res) => {
                      setStaleAuditPresets(res.presets);
                      setStaleAuditPresetId(res.preset.id);
                      setStaleAuditPresetName(res.preset.name);
                      setSyncMsg(`Saved preset ${res.preset.name}`);
                    })
                    .catch((err) => setError(err instanceof Error ? err.message : "Could not save audit preset"))
                    .finally(() => setPresetBusy(false));
                }}
              >
                {presetBusy ? "Saving…" : "Save preset"}
              </Btn>
              <label className="text-xs text-muted">
                Action
                <select
                  className="ml-2 rounded-md border border-line bg-paper px-2 py-1 text-sm text-ink"
                  value={staleAuditAction}
                  onChange={(event) => setStaleAuditAction(event.target.value)}
                >
                  <option value="">All actions</option>
                  <option value="snooze">Snooze</option>
                  <option value="ack">Ack</option>
                  <option value="cleared">Cleared</option>
                </select>
              </label>
              <label className="text-xs text-muted">
                Since
                <input
                  className="ml-2 rounded-md border border-line bg-paper px-2 py-1 text-sm text-ink"
                  value={staleAuditSince}
                  placeholder="2026-08-23T00:00:00Z"
                  onChange={(event) => setStaleAuditSince(event.target.value)}
                />
              </label>
              <label className="text-xs text-muted">
                Until
                <input
                  className="ml-2 rounded-md border border-line bg-paper px-2 py-1 text-sm text-ink"
                  value={staleAuditUntil}
                  placeholder="2026-08-24T00:00:00Z"
                  onChange={(event) => setStaleAuditUntil(event.target.value)}
                />
              </label>
              <Btn
                variant="secondary"
                size="sm"
                onClick={() => {
                  void exportAllowlistDualDigestStaleSuppression(token, "csv", {
                    ...(staleAuditAction ? { action: staleAuditAction } : {}),
                    ...(staleAuditSince.trim() ? { since: staleAuditSince.trim() } : {}),
                    ...(staleAuditUntil.trim() ? { until: staleAuditUntil.trim() } : {}),
                    ...(staleAuditPresetId ? { presetId: staleAuditPresetId } : {}),
                  }).then((res) => {
                    const blob = new Blob([res.csv ?? ""], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `allowlist-dual-digest-stale-${res.generatedAt.slice(0, 10)}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                    setSyncMsg(`Exported stale-digest audit (${res.count} row${res.count === 1 ? "" : "s"})`);
                  });
                }}
              >
                Export stale audit
              </Btn>
              <Btn
                variant="secondary"
                size="sm"
                onClick={() =>
                  void exportEmailAllowlist(token, { format: "csv", includeExpired: true, includeRevoked: true })
                    .then((res) => {
                      const blob = new Blob([res.csv ?? ""], { type: "text/csv" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `allowlist-${res.generatedAt.slice(0, 10)}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                      setSyncMsg(`Exported ${res.count} allowlist row(s)`);
                    })
                    .catch((err) => setError(err instanceof Error ? err.message : "Export failed"))
                }
              >
                Export audit CSV
              </Btn>
            </div>
          )}
          {token && (
            <form
              className="mb-3 flex flex-wrap gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!allowlistEmail.trim()) return;
                void addEmailAllowlist(token, {
                  email: allowlistEmail.trim(),
                  ...(allowlistNote.trim() ? { note: allowlistNote.trim() } : {}),
                  ...(allowlistExpires.trim()
                    ? { expiresAt: new Date(allowlistExpires).toISOString() }
                    : {}),
                })
                  .then(() => {
                    setAllowlistEmail("");
                    setAllowlistNote("");
                    setAllowlistExpires("");
                    return reload();
                  })
                  .catch((err) => setError(err instanceof Error ? err.message : "Allowlist failed"));
              }}
            >
              <input
                required
                type="email"
                placeholder="email@example.com"
                value={allowlistEmail}
                onChange={(e) => setAllowlistEmail(e.target.value)}
                className="min-w-[12rem] flex-1 rounded border border-line bg-paper px-2 py-1.5 text-sm"
              />
              <input
                placeholder="Note (optional)"
                value={allowlistNote}
                onChange={(e) => setAllowlistNote(e.target.value)}
                className="min-w-[8rem] flex-1 rounded border border-line bg-paper px-2 py-1.5 text-sm"
              />
              <input
                type="datetime-local"
                value={allowlistExpires}
                onChange={(e) => setAllowlistExpires(e.target.value)}
                className="rounded border border-line bg-paper px-2 py-1.5 text-sm"
                title="Optional expiry"
              />
              <Btn type="submit" size="sm" variant="secondary">
                Add
              </Btn>
            </form>
          )}
          <div className="space-y-2">
            {allowlist.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 rounded border border-line px-3 py-3">
                <div>
                  <div className="font-medium text-ink">{a.email}</div>
                  <div className="text-xs text-muted">
                    {a.note ? `${a.note} · ` : ""}
                    {a.expiresAt ? `expires ${new Date(a.expiresAt).toLocaleString()} · ` : ""}
                    {a.sesDualControlStatus === "pending" ? "SES dual-control pending · " : ""}
                    {a.sesDualControlStatus === "approved" ? "SES dual-control approved · " : ""}
                    {a.sesSyncNote ? `${a.sesSyncNote} · ` : ""}
                    {new Date(a.createdAt).toLocaleString()}
                  </div>
                </div>
                {token && (
                  <div className="flex gap-2">
                    {a.sesDualControlStatus === "pending" && (
                      <Btn
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          void approveSesNotedAllowlist(token, a.id)
                            .then(reload)
                            .catch((err) => setError(err instanceof Error ? err.message : "Approve failed"))
                        }
                      >
                        Approve SES
                      </Btn>
                    )}
                    <Btn
                      variant="secondary"
                      size="sm"
                      onClick={() => void revokeEmailAllowlist(token, a.id).then(reload)}
                    >
                      Revoke
                    </Btn>
                  </div>
                )}
              </div>
            ))}
            {allowlist.length === 0 && <p className="text-sm text-muted">No allowlist entries.</p>}
          </div>
        </Card>
      </div>
      <div className="mt-4">
        <Card title={`Email templates (${templates.length})`}>
          <p className="mb-3 text-sm text-muted">
            Kernel defaults with optional tenant overrides. Variables: title, body, href, severity.
          </p>
          {templates.length > 0 && token && (
            <div className="mb-4 space-y-3 rounded border border-line bg-sand/20 p-4">
              <div className="text-sm font-medium text-ink">Tenant template editor (I3.4)</div>
              <label className="block text-xs uppercase tracking-wide text-muted">
                Template
                <select
                  className="mt-1 w-full rounded border border-line bg-white px-3 py-2 text-sm"
                  value={selectedKey}
                  onChange={(e) => setSelectedKey(e.target.value)}
                >
                  {templates.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.key} ({t.source})
                    </option>
                  ))}
                </select>
              </label>
              {selectedTemplate && (
                <p className="text-xs text-muted">
                  Current source: {selectedTemplate.source} · subject: {selectedTemplate.subject}
                </p>
              )}
              <label className="block text-xs uppercase tracking-wide text-muted">
                Subject
                <input
                  className="mt-1 w-full rounded border border-line px-3 py-2 text-sm"
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                />
              </label>
              <label className="block text-xs uppercase tracking-wide text-muted">
                Body (plain text)
                <textarea
                  className="mt-1 min-h-[120px] w-full rounded border border-line px-3 py-2 text-sm"
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <Btn variant="gold" disabled={editorBusy || !editSubject.trim()} onClick={() => void handleSaveTemplate()}>
                  Save tenant override
                </Btn>
                <Btn variant="secondary" disabled={editorBusy} onClick={() => void handlePreview()}>
                  Preview with sample data
                </Btn>
              </div>
              {editorMsg && <p className="text-sm text-gold-deep">{editorMsg}</p>}
              {preview && (
                <div className="rounded border border-line bg-white p-3">
                  <div className="text-xs uppercase tracking-wide text-muted">Preview</div>
                  <div className="mt-1 font-medium text-ink">{preview.subject}</div>
                  <pre className="mt-2 whitespace-pre-wrap text-sm text-muted">{preview.bodyText}</pre>
                </div>
              )}
            </div>
          )}
          <div className="space-y-2">
            {templates.slice(0, 8).map((t) => (
              <button
                key={t.key}
                type="button"
                className={`w-full rounded border px-3 py-2 text-left text-sm transition-colors ${
                  t.key === selectedKey ? "border-gold-deep bg-gold/10" : "border-line hover:bg-sand/30"
                }`}
                onClick={() => setSelectedKey(t.key)}
              >
                <div className="font-medium">{t.key}</div>
                <div className="text-xs text-muted">
                  {t.source} · {t.subject}
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
