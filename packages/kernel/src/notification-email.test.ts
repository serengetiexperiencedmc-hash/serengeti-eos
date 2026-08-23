import { describe, expect, it } from "vitest";
import {
  buildEmailFromNotification,
  filterNotifDlqSlaDigestStaleSuppressionAudits,
  parseNotifDlqSlaDigestStaleAuditExportFilter,
  sanitizeNotifAllowlistDualDigestStaleAuditExportLastFilter,
  sanitizeNotifDlqSlaDigestStaleAuditExportLastFilter,
  shouldEmailNotification,
} from "./notification-email.js";
import type { NotifItem } from "./notification.js";

const sample: NotifItem = {
  key: "rfp-sla:abc",
  category: "rfp",
  severity: "urgent",
  title: "RFP SLA breached",
  body: "RFP-001 · Test programme",
  href: "/commercial/rfps/abc",
  createdAt: new Date().toISOString(),
};

describe("notification email kernel", () => {
  it("builds email from notification item", () => {
    const email = buildEmailFromNotification(sample, "ops@sedmc.local");
    expect(email.to).toBe("ops@sedmc.local");
    expect(email.subject).toContain("URGENT");
    expect(email.subject).toContain("RFP SLA breached");
    expect(email.notificationKey).toBe("rfp-sla:abc");
    expect(email.templateKey).toBe("notif.rfp.urgent");
  });

  it("filters urgent and warning for email dispatch", () => {
    expect(shouldEmailNotification(sample)).toBe(true);
    expect(shouldEmailNotification({ ...sample, severity: "warning" })).toBe(true);
    expect(shouldEmailNotification({ ...sample, severity: "info" })).toBe(false);
  });

  it("filters stale DLQ digest audit by action and createdAt window", () => {
    expect(parseNotifDlqSlaDigestStaleAuditExportFilter({ action: "merge" })).toEqual({ error: "invalid_action" });
    expect(parseNotifDlqSlaDigestStaleAuditExportFilter({ since: "not-a-date" })).toEqual({ error: "invalid_window" });
    expect(
      parseNotifDlqSlaDigestStaleAuditExportFilter({
        since: "2026-08-24T00:00:00.000Z",
        until: "2026-08-23T00:00:00.000Z",
      }),
    ).toEqual({ error: "invalid_window" });
    const parsed = parseNotifDlqSlaDigestStaleAuditExportFilter({
      action: "ack",
      since: "2026-08-23T10:00:00.000Z",
    });
    expect("error" in parsed).toBe(false);
    const rows = [
      { action: "snooze", createdAt: "2026-08-23T09:00:00.000Z" },
      { action: "ack", createdAt: "2026-08-23T11:00:00.000Z" },
      { action: "ack", createdAt: "2026-08-23T08:00:00.000Z" },
      { action: "cleared", createdAt: "2026-08-23T12:00:00.000Z" },
    ];
    expect(
      filterNotifDlqSlaDigestStaleSuppressionAudits(rows, parsed as Extract<typeof parsed, { action: unknown }>),
    ).toEqual([{ action: "ack", createdAt: "2026-08-23T11:00:00.000Z" }]);
  });

  it("sanitizes last-used allowlist stale-audit export filter", () => {
    const view = sanitizeNotifAllowlistDualDigestStaleAuditExportLastFilter({
      tenantId: "t1",
      principalId: "p1",
      action: "snooze",
      since: "2026-08-23T00:00:00.000Z",
      updatedAt: "2026-08-23T12:00:00.000Z",
    });
    expect(view.action).toBe("snooze");
    expect(view.since).toBe("2026-08-23T00:00:00.000Z");
    expect(view).not.toHaveProperty("tenantId");
  });

  it("sanitizes last-used DLQ stale-audit export filter", () => {
    const view = sanitizeNotifDlqSlaDigestStaleAuditExportLastFilter({
      tenantId: "t1",
      principalId: "p1",
      action: "snooze",
      since: "2026-08-23T00:00:00.000Z",
      updatedAt: "2026-08-23T12:00:00.000Z",
    });
    expect(view.action).toBe("snooze");
    expect(view.since).toBe("2026-08-23T00:00:00.000Z");
    expect(view).not.toHaveProperty("tenantId");
  });
});
