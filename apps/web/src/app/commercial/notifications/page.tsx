"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import {
  dismissAllNotifications,
  dismissNotification,
  dispatchEmailDigest,
  listEmailOutbox,
  listNotifications,
  type EmailOutboxItem,
  type NotificationItem,
} from "@/lib/notifications-api";

export default function NotificationsPage() {
  const { token, ready } = useEosSession();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [outbox, setOutbox] = useState<EmailOutboxItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dispatchMsg, setDispatchMsg] = useState<string | null>(null);

  async function reload() {
    if (!token) return;
    const [inbox, emailOutbox] = await Promise.all([listNotifications(token), listEmailOutbox(token)]);
    setItems(inbox.items);
    setOutbox(emailOutbox.items);
  }

  useEffect(() => {
    if (!token) return;
    reload().catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, [token]);

  async function handleDispatch() {
    if (!token) return;
    setDispatchMsg(null);
    const res = await dispatchEmailDigest(token);
    setDispatchMsg(`Dispatched ${res.dispatched.length} email(s) via ${res.adapter}`);
    await reload();
  }

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view notifications.</p>;

  return (
    <>
      <PageHeader
        eyebrow="I3 · I3.1 · Notifications"
        title="Action Inbox"
        subtitle="Live alerts from RFP SLA, finance, field sync, approvals & handover — with email digest outbox"
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
    </>
  );
}
