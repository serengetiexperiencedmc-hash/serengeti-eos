import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I3.2 email templates and SMTP stub", () => {
  it("lists I3.2 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("034_i3_email_templates"))).toBe(true);
  });

  it("lists templates and previews resolved content", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const templates = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/templates",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(templates.statusCode).toBe(200);
    expect(templates.json().items.length).toBeGreaterThanOrEqual(5);
    expect(templates.json().adapter).toBe("dev-outbox");

    const preview = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/templates/notif.rfp.urgent/preview",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(preview.statusCode).toBe(200);
    expect(preview.json().preview.subject).toContain("URGENT");
  });

  it("uses smtp-stub adapter when EOS_EMAIL_ADAPTER=smtp-stub", async () => {
    const prev = process.env.EOS_EMAIL_ADAPTER;
    process.env.EOS_EMAIL_ADAPTER = "smtp-stub";
    try {
      const store = seedStore("test-secret");
      const tenantId = "11111111-1111-4111-8111-111111111111";
      const now = new Date().toISOString();
      store.rfpRfps.push({
        id: newId(),
        tenantId,
        rfpCode: "RFP-SMTP-001",
        opportunityId: newId(),
        organizationId: newId(),
        title: "SMTP stub test",
        workflowStage: "costing",
        status: "active",
        currency: "USD",
        slaStatus: "breached",
        slaDueAt: now,
        currentVersion: 1,
        classification: "Internal",
        version: 1,
        createdAt: now,
        updatedAt: now,
        createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
        updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      });

      const app = buildServer({ store });
      const token = await loginCarol(app);

      const health = await app.inject({
        method: "GET",
        url: "/v1/notifications/email/health",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(health.json().adapter).toBe("smtp-stub");

      const dispatch = await app.inject({
        method: "POST",
        url: "/v1/notifications/email/dispatch-digest",
        headers: { authorization: `Bearer ${token}` },
        payload: {},
      });
      expect(dispatch.statusCode).toBe(200);
      expect(dispatch.json().adapter).toBe("smtp-stub");
    } finally {
      if (prev === undefined) delete process.env.EOS_EMAIL_ADAPTER;
      else process.env.EOS_EMAIL_ADAPTER = prev;
    }
  });
});
