import { describe, expect, it } from "vitest";
import { listEmailTemplateKeys, resolveEmailTemplate } from "./notification-template.js";

describe("notification email templates", () => {
  it("resolves default template with variable substitution", () => {
    const resolved = resolveEmailTemplate("notif.rfp.urgent", {
      severity: "urgent",
      title: "RFP SLA breached",
      body: "RFP-001 · Test",
      href: "/commercial/rfps/abc",
    });
    expect(resolved.subject).toBe("[EOS URGENT] RFP SLA breached");
    expect(resolved.bodyText).toContain("RFP-001 · Test");
    expect(resolved.bodyText).toContain("/commercial/rfps/abc");
  });

  it("prefers tenant override templates", () => {
    const resolved = resolveEmailTemplate(
      "notif.rfp.urgent",
      { severity: "urgent", title: "Custom", body: "Body", href: "/x" },
      [{ key: "notif.rfp.urgent", subject: "CUSTOM {{title}}", bodyText: "{{body}}" }],
    );
    expect(resolved.subject).toBe("CUSTOM Custom");
    expect(resolved.bodyText).toBe("Body");
  });

  it("lists all template keys including overrides", () => {
    const keys = listEmailTemplateKeys([{ key: "notif.custom.info", subject: "x", bodyText: "y" }]);
    expect(keys).toContain("notif.custom.info");
    expect(keys).toContain("notif.rfp.urgent");
  });
});
