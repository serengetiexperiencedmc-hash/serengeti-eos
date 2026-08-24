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
    case "hr":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m8-4a4 4 0 11-8 0 4 4 0 018 0zM7 8a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "itsm":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case "cmdb":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      );
    case "observability":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12h3l3-7 4 14 3-7h5" />
        </svg>
      );
    case "soc":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3l8 4v5c0 5-3.5 8.5-8 9.5C7.5 20.5 4 17 4 12V7l8-4z" />
        </svg>
      );
    case "pam":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      );
    case "erm":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM4.26 17.126a9 9 0 1115.48 0L13.74 5.874a2.25 2.25 0 00-3.48 0L4.26 17.126z" />
        </svg>
      );
    case "knowledge":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25A8.966 8.966 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      );
    case "audit":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    case "bcm":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "crisis":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      );
    case "compliance":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25V6.75zM7.5 8.25h9M7.5 12h9M7.5 15.75h5.25" />
        </svg>
      );
    case "controls":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "findings":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      );
    case "campaigns":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5A2.25 2.25 0 015.25 5.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      );
    case "mappings":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
      );
    case "privacy":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
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
        v1.04 · Dev/Test
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
      Serengeti EOS · C1–C10 · O1–O5 · I8.4 · J1–J3 · I3.37 · I4.34 · PG.29 · I20.22
    </div>
  );
}
