import { describe, expect, it, vi } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { PERSON_DOMAIN_REMOVED } from "../src/personal-data-phase1.js";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { createLogger } from "../src/observability.js";
import { buildServer } from "../src/server.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  expect(res.statusCode).toBe(200);
  return res.json().accessToken as string;
}

describe("H-141 notification / logging / field-cache privacy (Dev/Test)", () => {
  it("does not add migration 126 and keeps migration 125 last", () => {
    const files = listMigrationFiles().map((file) => file.replace(/\\/g, "/"));
    expect(files[files.length - 1] ?? "").toContain("130_h203_issued_client_document_delivery");
    expect(files.some((file) => /\/131_/.test(file))).toBe(false);
  });

  it("requires authentication for notifications, email outbox, and field sync push", async () => {
    const app = buildServer({ store: seedStore("h141-auth") });
    expect((await app.inject({ method: "GET", url: "/v1/notifications" })).statusCode).toBe(401);
    expect((await app.inject({ method: "GET", url: "/v1/notifications/email/outbox" })).statusCode).toBe(401);
    expect(
      (await app.inject({ method: "POST", url: "/v1/ops/sync/push", payload: { sessionId: "x", deltas: [] } }))
        .statusCode,
    ).toBe(401);
  });

  it("lists in-app notifications and omits outbox bodyText while keeping commercial template upsert", async () => {
    const store = seedStore("h141-notif");
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const listed = await app.inject({
      method: "GET",
      url: "/v1/notifications",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.statusCode).toBe(200);
    expect(Array.isArray(listed.json().items)).toBe(true);

    const outbox = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/outbox",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(outbox.statusCode).toBe(200);
    for (const item of outbox.json().items as Record<string, unknown>[]) {
      expect(item).not.toHaveProperty("bodyText");
      expect(item).not.toHaveProperty("bodyHtml");
    }

    const put = await app.inject({
      method: "PUT",
      url: "/v1/notifications/email/templates/notif.rfp.urgent",
      headers: { authorization: `Bearer ${token}` },
      payload: { subject: "[H141] {{title}}", bodyText: "Commercial template {{body}}" },
    });
    expect(put.statusCode).toBe(200);
    expect(put.json().template.source).toBe("tenant");
  });

  it("rejects person-domain keys on allowlist, template upsert, and field sync push without persistence", async () => {
    const store = seedStore("h141-keys");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const allowBefore = (store.notifEmailAllowlist ?? []).length;
    const templatesBefore = (store.notifEmailTemplates ?? []).length;

    const allowlist = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/allowlist",
      headers: { authorization: `Bearer ${token}` },
      payload: { email: "ops-h141@example.com", givenName: "Jane" },
    });
    expect(allowlist.statusCode).toBe(400);
    expect(allowlist.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.notifEmailAllowlist ?? []).toHaveLength(allowBefore);

    const commercialAllow = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/allowlist",
      headers: { authorization: `Bearer ${token}` },
      payload: { email: "ops-h141@example.com", note: "Ops digest alias" },
    });
    expect(commercialAllow.statusCode).toBe(201);

    const template = await app.inject({
      method: "PUT",
      url: "/v1/notifications/email/templates/notif.finance.warning",
      headers: { authorization: `Bearer ${token}` },
      payload: { subject: "Keep commercial", bodyText: "Keep commercial", guestName: "Jane" },
    });
    expect(template.statusCode).toBe(400);
    expect(template.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.notifEmailTemplates ?? []).toHaveLength(templatesBefore);

    const push = await app.inject({
      method: "POST",
      url: "/v1/ops/sync/push",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        sessionId: "00000000-0000-4000-8000-000000000001",
        deltas: [
          {
            entityType: "field_task",
            entityId: "00000000-0000-4000-8000-000000000002",
            clientVersion: 1,
            payload: { status: "complete", guestName: "Jane" },
          },
        ],
      },
    });
    expect(push.statusCode).toBe(400);
    expect(push.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.opsSyncConflicts).toHaveLength(0);
  });

  it("redacts recipientEmail and bodyText when those keys are logged", () => {
    const lines: string[] = [];
    const spy = vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      lines.push(String(args[0] ?? ""));
    });
    createLogger("info").info("probe", {
      recipientEmail: "secret.person@example.com",
      bodyText: "Do not log this notification body",
      principalId: "p1",
    });
    spy.mockRestore();
    expect(lines[0]).toContain("[REDACTED]");
    expect(lines[0]).toContain("p1");
    expect(lines[0]).not.toContain("secret.person@example.com");
    expect(lines[0]).not.toContain("Do not log this notification body");
  });

  it("does not log query strings on request_completed and redacts whatsapp keys", async () => {
    const lines: string[] = [];
    const spy = vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      lines.push(String(args[0] ?? ""));
    });
    createLogger("info").info("probe", { whatsapp: "+255754000000", principalId: "p1" });
    const app = buildServer({ store: seedStore("h141-query-log") });
    const token = await loginCarol(app);
    await app.inject({
      method: "GET",
      url: "/v1/notifications?email=secret.person@example.com",
      headers: { authorization: `Bearer ${token}` },
    });
    spy.mockRestore();
    const joined = lines.join("\n");
    expect(joined).toContain("request_completed");
    expect(joined).toContain("/v1/notifications");
    expect(joined).not.toContain("secret.person@example.com");
    expect(joined).not.toContain("email=secret");
    expect(joined).toContain("[REDACTED]");
    expect(joined).not.toContain("+255754000000");
  });

  it("does not expose another tenant's allowlist through the authenticated list API", async () => {
    const store = seedStore("h141-tenant", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const carol = await loginCarol(app);
    const created = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/allowlist",
      headers: { authorization: `Bearer ${carol}` },
      payload: { email: "sedmc-ops-h141@example.com", note: "SEDMC ops" },
    });
    expect(created.statusCode).toBe(201);

    const partnerLogin = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "partner@external.local", password: P.partnerPassword, tenantSlug: "partner-demo" },
    });
    expect(partnerLogin.statusCode).toBe(200);
    const partnerToken = partnerLogin.json().accessToken as string;
    const listed = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist",
      headers: { authorization: `Bearer ${partnerToken}` },
    });
    expect([200, 403]).toContain(listed.statusCode);
    if (listed.statusCode === 200) {
      const emails = (listed.json().items as Array<{ email: string }>).map((row) => row.email);
      expect(emails).not.toContain("sedmc-ops-h141@example.com");
    } else {
      expect(JSON.stringify(listed.json())).not.toContain("sedmc-ops-h141@example.com");
    }
  });
});
