import { describe, expect, it } from "vitest";
import { buildEmailFromNotification, shouldEmailNotification } from "./notification-email.js";
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
});
