import { eosFetch } from "./eos-client";

export type NotificationItem = {
  key: string;
  category: "rfp" | "finance" | "operations" | "approval" | "handover";
  severity: "info" | "warning" | "urgent";
  title: string;
  body: string;
  href: string;
  createdAt: string;
};

export async function listNotifications(token: string) {
  return eosFetch<{ items: NotificationItem[]; unreadCount: number }>("/v1/notifications", { token });
}

export async function getUnreadCount(token: string) {
  return eosFetch<{ unreadCount: number }>("/v1/notifications/unread-count", { token });
}

export async function dismissNotification(token: string, key: string) {
  return eosFetch<{ dismissed: string }>(`/v1/notifications/${encodeURIComponent(key)}/dismiss`, {
    token,
    method: "POST",
    body: "{}",
  });
}

export async function dismissAllNotifications(token: string) {
  return eosFetch<{ dismissed: number }>("/v1/notifications/dismiss-all", { token, method: "POST", body: "{}" });
}

export type EmailOutboxItem = {
  id: string;
  notificationKey: string;
  to: string;
  subject: string;
  templateKey: string;
  status: "queued" | "sent" | "failed";
  adapter: string;
  sentAt?: string;
  createdAt: string;
};

export async function listEmailOutbox(token: string) {
  return eosFetch<{ items: EmailOutboxItem[] }>("/v1/notifications/email/outbox", { token });
}

export async function dispatchEmailDigest(token: string) {
  return eosFetch<{ dispatched: string[]; skipped: { key: string; reason?: string }[]; adapter: string }>(
    "/v1/notifications/email/dispatch-digest",
    { token, method: "POST", body: "{}" },
  );
}

export type DigestFreshness = {
  stale: boolean;
  neverRun: boolean;
  ageHours: number | null;
  thresholdHours: number;
};

export type DigestLastRun = {
  tenantId: string;
  day: string;
  lastRunAt: string;
  lastRunByPrincipalId: string;
  dispatchedCount: number;
  skippedCount: number;
  recipientCount: number;
  pendingCount?: number;
  breachedCount?: number;
};

export async function getEmailAdapterHealth(token: string) {
  return eosFetch<{
    module: string;
    increment: string;
    adapter: string;
    status: string;
    outboxCount: number;
    suppressionCount?: number;
    templateCount?: number;
    smtpConfigured?: boolean;
    allowlistDualDigestLastRun?: DigestLastRun | null;
    allowlistDualDigestFreshness?: DigestFreshness;
    dlqSlaDigestLastRun?: DigestLastRun | null;
    dlqSlaDigestFreshness?: DigestFreshness;
  }>("/v1/notifications/email/health", { token });
}

export async function dispatchAllowlistDualDigest(token: string) {
  return eosFetch<{
    dispatched: string[];
    skipped: { key: string; reason?: string }[];
    pendingCount: number;
    lastRun?: DigestLastRun;
    increment: string;
  }>("/v1/notifications/email/dispatch-allowlist-dual-digest", { token, method: "POST", body: "{}" });
}

export async function dispatchAllowlistDualDigestStaleAlert(token: string) {
  return eosFetch<{
    dispatched: string[];
    skipped: { key: string; reason?: string }[];
    freshness: DigestFreshness;
    increment: string;
  }>("/v1/notifications/email/dispatch-allowlist-dual-digest-stale", { token, method: "POST", body: "{}" });
}

export async function getAllowlistDualDigestStatus(token: string) {
  return eosFetch<{
    lastRun: DigestLastRun | null;
    freshness: DigestFreshness;
    analytics: { outboxDigestCount: number; outboxByStatus: Record<string, number> };
    suppression: { snoozedUntil?: string; acknowledgedAt?: string } | null;
    increment: string;
  }>("/v1/notifications/email/allowlist-dual-digest-status", { token });
}

export async function snoozeAllowlistDualDigestStale(token: string, hours = 24) {
  return eosFetch<{ suppression: { snoozedUntil?: string; acknowledgedAt?: string }; increment: string }>(
    "/v1/notifications/email/allowlist-dual-digest-stale/snooze",
    { token, method: "POST", body: JSON.stringify({ hours }) },
  );
}

export async function acknowledgeAllowlistDualDigestStale(token: string) {
  return eosFetch<{ suppression: { snoozedUntil?: string; acknowledgedAt?: string }; increment: string }>(
    "/v1/notifications/email/allowlist-dual-digest-stale/ack",
    { token, method: "POST", body: "{}" },
  );
}

export type EmailSuppressionItem = {
  id: string;
  email: string;
  reason: string;
  createdAt: string;
};

export async function listEmailSuppressions(token: string) {
  return eosFetch<{ items: EmailSuppressionItem[]; increment: string }>(
    "/v1/notifications/email/suppressions",
    { token },
  );
}

export async function liftEmailSuppression(token: string, id: string) {
  return eosFetch<{ suppression: EmailSuppressionItem & { liftedAt?: string }; increment: string }>(
    `/v1/notifications/email/suppressions/${id}/lift`,
    { token, method: "POST", body: "{}" },
  );
}

export async function syncEmailSuppressions(token: string) {
  return eosFetch<{
    imported: number;
    updated: number;
    activeCount: number;
    allowlistSesNoted?: number;
    allowlistSesNotes?: Array<{ email: string; sesSyncNote: string }>;
    increment: string;
  }>("/v1/notifications/email/suppressions/sync", { token, method: "POST", body: "{}" });
}

export type EmailDeliveryEventItem = {
  id: string;
  eventType: string;
  recipientEmail?: string;
  receivedAt: string;
  sesMessageId?: string;
};

export async function listEmailDeliveryEvents(token: string, limit = 20) {
  return eosFetch<{ items: EmailDeliveryEventItem[]; increment: string }>(
    `/v1/notifications/email/delivery-events?limit=${limit}`,
    { token },
  );
}

export async function exportEmailSuppressions(
  token: string,
  options: { format?: "json" | "csv"; includeLifted?: boolean } = {},
) {
  const params = new URLSearchParams();
  params.set("format", options.format ?? "json");
  if (options.includeLifted) params.set("includeLifted", "1");
  return eosFetch<{
    format: "json" | "csv";
    items?: EmailSuppressionItem[];
    csv?: string;
    count: number;
    generatedAt: string;
    increment: string;
  }>(`/v1/notifications/email/suppressions/export?${params.toString()}`, { token });
}

export async function bulkLiftEmailSuppressions(token: string, input: { ids?: string[]; emails?: string[] }) {
  return eosFetch<{ lifted: number; notFound: number; increment: string }>(
    "/v1/notifications/email/suppressions/bulk-lift",
    { token, method: "POST", body: JSON.stringify(input) },
  );
}

export async function importEmailSuppressions(
  token: string,
  input: { items?: Array<{ email: string; reason?: string }>; csv?: string },
) {
  return eosFetch<{
    imported: number;
    updated: number;
    skipped: number;
    errors: Array<{ row: number; reason: string }>;
    increment: string;
  }>("/v1/notifications/email/suppressions/import", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export type EmailAllowlistItem = {
  id: string;
  email: string;
  note?: string;
  createdAt: string;
  expiresAt?: string;
  revokedAt?: string;
  sesNotedAt?: string;
  sesSyncNote?: string;
  sesDualControlStatus?: "not_required" | "pending" | "approved";
  sesApprovedAt?: string;
};

export async function listEmailAllowlist(token: string, options: { includeExpired?: boolean } = {}) {
  const params = new URLSearchParams();
  if (options.includeExpired) params.set("includeExpired", "1");
  const qs = params.toString();
  return eosFetch<{ items: EmailAllowlistItem[]; increment: string }>(
    `/v1/notifications/email/allowlist${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function addEmailAllowlist(
  token: string,
  input: { email: string; note?: string; expiresAt?: string | null },
) {
  return eosFetch<{ entry: EmailAllowlistItem; updated: boolean; increment: string }>(
    "/v1/notifications/email/allowlist",
    { token, method: "POST", body: JSON.stringify(input) },
  );
}

export async function revokeEmailAllowlist(token: string, id: string) {
  return eosFetch<{ entry: EmailAllowlistItem & { revokedAt?: string }; increment: string }>(
    `/v1/notifications/email/allowlist/${id}/revoke`,
    { token, method: "POST", body: "{}" },
  );
}

export async function approveSesNotedAllowlist(token: string, id: string) {
  return eosFetch<{ entry: EmailAllowlistItem; increment: string }>(
    `/v1/notifications/email/allowlist/${id}/approve-ses`,
    { token, method: "POST", body: "{}" },
  );
}

export async function exportEmailAllowlist(
  token: string,
  options: { format?: "json" | "csv"; includeExpired?: boolean; includeRevoked?: boolean } = {},
) {
  const params = new URLSearchParams();
  params.set("format", options.format ?? "csv");
  if (options.includeExpired) params.set("includeExpired", "1");
  if (options.includeRevoked) params.set("includeRevoked", "1");
  return eosFetch<{
    format: "json" | "csv";
    items?: EmailAllowlistItem[];
    csv?: string;
    count: number;
    generatedAt: string;
    increment: string;
  }>(`/v1/notifications/email/allowlist/export?${params.toString()}`, { token });
}

export type EmailDeliveryAnalytics = {
  deliveryEventsByType: Record<string, number>;
  suppressionsByReason: Record<string, number>;
  activeSuppressions: number;
  liftedSuppressions: number;
  outboxByStatus: Record<string, number>;
  recentDeliveryEvents: number;
  windowHours: number;
};

export async function getEmailDeliveryAnalytics(token: string, windowHours = 168) {
  return eosFetch<{ analytics: EmailDeliveryAnalytics; increment: string }>(
    `/v1/notifications/email/analytics?windowHours=${windowHours}`,
    { token },
  );
}

export type EmailTemplateItem = {
  key: string;
  subject: string;
  bodyText: string;
  source: "default" | "tenant";
};

export async function listEmailTemplates(token: string) {
  return eosFetch<{ items: EmailTemplateItem[]; adapter: string }>("/v1/notifications/email/templates", { token });
}

export async function saveEmailTemplate(
  token: string,
  templateKey: string,
  input: { subject: string; bodyText: string; bodyHtml?: string },
) {
  return eosFetch<{ template: EmailTemplateItem }>(
    `/v1/notifications/email/templates/${encodeURIComponent(templateKey)}`,
    { token, method: "PUT", body: JSON.stringify(input) },
  );
}

export async function previewEmailTemplate(token: string, templateKey: string) {
  return eosFetch<{ preview: { subject: string; bodyText: string; templateKey: string } }>(
    `/v1/notifications/email/templates/${encodeURIComponent(templateKey)}/preview`,
    { token },
  );
}
