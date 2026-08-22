"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { dismissAllNotifications, dismissNotification, listNotifications, type NotificationItem } from "@/lib/notifications-api";

const severityStyles: Record<NotificationItem["severity"], string> = {
  info: "border-line bg-paper",
  warning: "border-warning/40 bg-warning-bg/30",
  urgent: "border-danger/40 bg-danger-bg/30",
};

export function NotificationBell() {
  const { token } = useEosSession();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) {
      setItems([]);
      setUnread(0);
      return;
    }
    void listNotifications(token)
      .then((res) => {
        setItems(res.items);
        setUnread(res.unreadCount);
      })
      .catch(() => {
        setItems([]);
        setUnread(0);
      });
  }, [token, open]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  async function handleDismiss(key: string) {
    if (!token) return;
    await dismissNotification(token, key);
    const res = await listNotifications(token);
    setItems(res.items);
    setUnread(res.unreadCount);
  }

  async function handleDismissAll() {
    if (!token) return;
    await dismissAllNotifications(token);
    setItems([]);
    setUnread(0);
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-md border border-line bg-paper text-ink-soft hover:border-gold"
        aria-label="Notifications"
      >
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 text-[0.6rem] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
        🔔
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-[360px] rounded-lg border border-line bg-paper shadow-lg">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div className="text-sm font-semibold text-ink">Notifications</div>
            {items.length > 0 && (
              <button type="button" onClick={() => void handleDismissAll()} className="text-xs text-gold-deep hover:underline">
                Dismiss all
              </button>
            )}
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {!token ? (
              <p className="px-4 py-6 text-sm text-muted">Sign in to see notifications.</p>
            ) : items.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted">No actionable alerts.</p>
            ) : (
              items.map((item) => (
                <div key={item.key} className={`border-b border-line px-4 py-3 last:border-0 ${severityStyles[item.severity]}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium text-ink">{item.title}</div>
                      <div className="mt-0.5 text-xs text-muted">{item.body}</div>
                      <Link href={item.href} className="mt-2 inline-block text-xs text-gold-deep hover:underline" onClick={() => setOpen(false)}>
                        Open →
                      </Link>
                    </div>
                    <button type="button" onClick={() => void handleDismiss(item.key)} className="text-xs text-muted hover:text-ink">
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-line px-4 py-2 text-center">
            <Link href="/commercial/notifications" className="text-xs text-gold-deep hover:underline" onClick={() => setOpen(false)}>
              View all
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
