export type NotifSeverity = "info" | "warning" | "urgent";

export type NotifCategory = "rfp" | "finance" | "operations" | "approval" | "handover";

export type NotifItem = {
  key: string;
  category: NotifCategory;
  severity: NotifSeverity;
  title: string;
  body: string;
  href: string;
  createdAt: string;
};

export function notifSeverityRank(severity: NotifSeverity): number {
  if (severity === "urgent") return 3;
  if (severity === "warning") return 2;
  return 1;
}

export type NotifDismissal = {
  id: string;
  tenantId: string;
  principalId: string;
  notificationKey: string;
  dismissedAt: string;
};

export function sortNotifications(items: NotifItem[]): NotifItem[] {
  return [...items].sort((a, b) => {
    const sev = notifSeverityRank(b.severity) - notifSeverityRank(a.severity);
    if (sev !== 0) return sev;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
