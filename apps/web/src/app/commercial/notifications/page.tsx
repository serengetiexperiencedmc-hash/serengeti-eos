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
  listEmailOutbox,
  listEmailSuppressions,
  listEmailTemplates,
  listNotifications,
  liftEmailSuppression,
  previewEmailTemplate,
  saveEmailTemplate,
  type EmailOutboxItem,
  type EmailSuppressionItem,
  type EmailTemplateItem,
  type NotificationItem,
} from "@/lib/notifications-api";

export default function NotificationsPage() {
  const { token, ready } = useEosSession();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [outbox, setOutbox] = useState<EmailOutboxItem[]>([]);
  const [suppressions, setSuppressions] = useState<EmailSuppressionItem[]>([]);
  const [templates, setTemplates] = useState<EmailTemplateItem[]>([]);
  const [adapter, setAdapter] = useState("dev-outbox");
  const [error, setError] = useState<string | null>(null);
  const [dispatchMsg, setDispatchMsg] = useState<string | null>(null);

  const [selectedKey, setSelectedKey] = useState<string>("");
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editorMsg, setEditorMsg] = useState<string | null>(null);
  const [editorBusy, setEditorBusy] = useState(false);
  const [preview, setPreview] = useState<{ subject: string; bodyText: string } | null>(null);

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.key === selectedKey),
    [templates, selectedKey],
  );

  async function reload() {
    if (!token) return;
    const [inbox, emailOutbox, tmpl, health, suppressed] = await Promise.all([
      listNotifications(token),
      listEmailOutbox(token),
      listEmailTemplates(token),
      getEmailAdapterHealth(token),
      listEmailSuppressions(token),
    ]);
    setItems(inbox.items);
    setOutbox(emailOutbox.items);
    setTemplates(tmpl.items);
    setAdapter(health.adapter);
    setSuppressions(suppressed.items);
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
        eyebrow="I3 · I3.9 · Notifications"
        title="Action Inbox"
        subtitle={`Live alerts + email digest · adapter: ${adapter}`}
        actions={
          token ? (
            <div className="flex gap-2">
              <Btn variant="secondary" onClick={() => void handleDispatch()}>
                Dispatch email digest
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
        <Card title={`Email suppressions (${suppressions.length})`}>
          <p className="mb-3 text-sm text-muted">
            Bounce, complaint, and reject events block further sends until lifted (I3.9).
          </p>
          <div className="space-y-2">
            {suppressions.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 rounded border border-line px-3 py-3">
                <div>
                  <div className="font-medium text-ink">{s.email}</div>
                  <div className="text-xs capitalize text-muted">
                    {s.reason} · {new Date(s.createdAt).toLocaleString()}
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
