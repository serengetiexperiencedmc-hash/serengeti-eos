"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { navItems, type NavBadgeKey } from "@/lib/mock-data";
import { getAiDraftSummary } from "@/lib/ai-api";
import { subscribeAiDraftsChanged } from "@/lib/ai-draft-events";
import { fetchNavBadges, type NavBadgeCounts } from "@/lib/nav-badges";
import { NotificationBell } from "@/components/commercial/NotificationBell";

function NavIcon({ name }: { name: string }) {
  const cls = "h-[18px] w-[18px] opacity-70";
  switch (name) {
    case "dashboard":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case "field":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    default:
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
  }
}

function badgeValue(counts: NavBadgeCounts | null, key?: NavBadgeKey): number | undefined {
  if (!counts || !key) return undefined;
  const value = counts[key];
  return value > 0 ? value : undefined;
}

function useClientMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { token } = useEosSession();
  const [badges, setBadges] = useState<NavBadgeCounts | null>(null);
  const mounted = useClientMounted();

  useEffect(() => {
    if (!token) {
      setBadges(null);
      return;
    }
    let cancelled = false;
    void fetchNavBadges(token)
      .then((counts) => {
        if (!cancelled) setBadges(counts);
      })
      .catch(() => {
        if (!cancelled) setBadges(null);
      });
    const unsubscribe = subscribeAiDraftsChanged(() => {
      void getAiDraftSummary(token)
        .then((summary) => {
          if (cancelled) return;
          setBadges((prev) =>
            prev
              ? { ...prev, aiDrafts: summary.pendingCount }
              : {
                  pipeline: 0,
                  activeRfps: 0,
                  reconciliationExceptions: 0,
                  fieldSyncConflicts: 0,
                  notifications: 0,
                  aiDrafts: summary.pendingCount,
                },
          );
        })
        .catch(() => undefined);
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [token]);
  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col bg-ink text-sand">
      <div className="border-b border-white/10 px-6 py-5">
        <div className="font-display text-xl font-semibold text-paper">Serengeti EOS</div>
        <div className="mt-1 text-[0.7rem] uppercase tracking-[0.12em] text-gold">Commercial Workspace</div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navItems.map((section) => (
          <div key={section.section} className="mb-6">
            <div className="mb-2 px-3 text-[0.65rem] uppercase tracking-wider text-muted">{section.section}</div>
            {section.items.map((item) => {
              const path = (pathname ?? "").replace(/\/$/, "") || "/";
              const active =
                mounted &&
                (path === item.href || (item.href !== "/commercial" && path.startsWith(`${item.href}/`)));
              const badge = mounted ? badgeValue(badges, "badgeKey" in item ? item.badgeKey : undefined) : undefined;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mb-0.5 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                    active ? "bg-gold/15 text-gold" : "text-sand hover:bg-white/5 hover:text-paper"
                  }`}
                >
                  <NavIcon name={item.icon} />
                  <span>{item.label}</span>
                  {badge !== undefined && (
                    <span className="ml-auto rounded-full bg-terracotta px-2 py-0.5 text-[0.65rem] font-semibold text-white">
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4 text-xs text-muted">
        Serengeti Experience DMC
        <br />
        v0.78 · Dev/Test
      </div>
    </aside>
  );
}

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-line bg-paper px-7">
      <div className="relative max-w-md flex-1">
        <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          placeholder="Search clients, RFPs, suppliers…"
          className="w-full rounded-full border border-line bg-ivory py-2 pl-9 pr-4 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
        />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <Link href="/commercial/rfps" className="rounded-md border border-gold bg-gold px-3 py-1.5 text-xs font-medium text-ink hover:bg-gold-deep hover:text-paper">
          + New RFP
        </Link>
        <Link href="/field" className="rounded-md border border-line bg-paper px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-gold">
          Field App
        </Link>
        <NotificationBell />
        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-gold text-xs font-semibold text-ink" title="Signed-in user">
          AO
        </div>
      </div>
    </header>
  );
}

export function MockupBanner() {
  return (
    <div className="bg-gold py-1.5 text-center text-[0.7rem] font-semibold uppercase tracking-wide text-ink">
      Serengeti EOS · C1–C10 · O1–O4 · I3.29 · I4.27 · PG.29 · I20.11 · J1–J2
    </div>
  );
}
