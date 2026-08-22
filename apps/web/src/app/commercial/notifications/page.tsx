"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { dismissAllNotifications, dismissNotification, listNotifications, type NotificationItem } from "@/lib/notifications-api";

export default function NotificationsPage() {
  const { token, ready } = useEosSession();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    if (!token) return;
    const res = await listNotifications(token);
    setItems(res.items);
  }

  useEffect(() => {
    if (!token) return;
    reload().catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, [token]);

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view notifications.</p>;

  return (
    <>
      <PageHeader
        eyebrow="I3 · Notifications"
        title="Action Inbox"
        subtitle="Live alerts from RFP SLA, finance, field sync, approvals & handover"
        actions={
          items.length > 0 && token ? (
            <Btn variant="secondary" onClick={() => void dismissAllNotifications(token).then(reload)}>
              Dismiss all
            </Btn>
          ) : undefined
        }
      />
      {error && <p className="mb-4 text-sm text-danger">{error}</p>}
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
    </>
  );
}
