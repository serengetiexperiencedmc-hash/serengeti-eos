import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function login(
  app: Awaited<ReturnType<typeof buildServer>>,
  email: string,
  password: string,
  tenant = "sedmc",
) {
  return app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email, password, tenantSlug: tenant },
  });
}

describe("kernel API (I0 regression)", () => {
  it("reports not production-ready", async () => {
    const app = buildServer(seedStore("test-secret"));
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json().productionReady).toBe(false);
  });

  it("issues a session for valid development credentials", async () => {
    const app = buildServer(seedStore("test-secret"));
    const res = await login(app, "alice.finance@sedmc.local", P.alicePassword);
    expect(res.statusCode).toBe(200);
    expect(res.json().principal.roles).toContain("finance.member");
  });

  it("hides other-tenant payments as not found", async () => {
    const store = seedStore("test-secret");
    const app = buildServer(store);
    const alice = await login(app, "alice.finance@sedmc.local", P.alicePassword);
    const created = await app.inject({
      method: "POST",
      url: "/v1/payments",
      headers: { authorization: `Bearer ${alice.json().accessToken}` },
      payload: { amount: 1500, currency: "USD", beneficiary: "Lodge Ltd" },
    });
    expect(created.statusCode).toBe(201);
    const paymentId = created.json().payment.id;
    const partner = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");
    const peek = await app.inject({
      method: "GET",
      url: `/v1/payments/${paymentId}`,
      headers: { authorization: `Bearer ${partner.json().accessToken}` },
    });
    expect(peek.statusCode).toBe(404);
  });

  it("blocks self-approval of a payment", async () => {
    const app = buildServer(seedStore("test-secret"));
    const alice = await login(app, "alice.finance@sedmc.local", P.alicePassword);
    const created = await app.inject({
      method: "POST",
      url: "/v1/payments",
      headers: { authorization: `Bearer ${alice.json().accessToken}` },
      payload: { amount: 900, currency: "USD", beneficiary: "Transport Co" },
    });
    const approvalId = created.json().approvalId;
    const self = await app.inject({
      method: "POST",
      url: `/v1/approvals/${approvalId}/decision`,
      headers: { authorization: `Bearer ${alice.json().accessToken}` },
      payload: { outcome: "approved" },
    });
    expect(self.statusCode).toBe(403);
    expect(self.json().reason).toBe("self_approval_forbidden");
  });

  it("allows a different human approver and verifies the audit chain", async () => {
    const app = buildServer(seedStore("test-secret"));
    const alice = await login(app, "alice.finance@sedmc.local", P.alicePassword);
    const bob = await login(app, "bob.approver@sedmc.local", P.bobPassword);
    const created = await app.inject({
      method: "POST",
      url: "/v1/payments",
      headers: { authorization: `Bearer ${alice.json().accessToken}` },
      payload: { amount: 2200, currency: "USD", beneficiary: "Camp Operator" },
    });
    const approvalId = created.json().approvalId;
    const decision = await app.inject({
      method: "POST",
      url: `/v1/approvals/${approvalId}/decision`,
      headers: { authorization: `Bearer ${bob.json().accessToken}` },
      payload: { outcome: "approved" },
    });
    expect(decision.statusCode).toBe(200);
    expect(decision.json().payment.status).toBe("approved");
    const chain = await app.inject({
      method: "GET",
      url: "/v1/audit-events/verify",
      headers: { authorization: `Bearer ${bob.json().accessToken}` },
    });
    expect(chain.statusCode).toBe(200);
    expect(chain.json().ok).toBe(true);
  });

  it("does not let finance members read the audit log", async () => {
    const app = buildServer(seedStore("test-secret"));
    const alice = await login(app, "alice.finance@sedmc.local", P.alicePassword);
    const res = await app.inject({
      method: "GET",
      url: "/v1/audit-events",
      headers: { authorization: `Bearer ${alice.json().accessToken}` },
    });
    expect(res.statusCode).toBe(403);
  });
});

describe("I1 Admin Shell", () => {
  it("lets platform admin create org unit, location and cost center with audit", async () => {
    const app = buildServer(seedStore("test-secret"));
    const carol = await login(app, "carol.admin@sedmc.local", P.carolPassword);
    const token = carol.json().accessToken;
    const orgs = await app.inject({
      method: "GET",
      url: "/v1/organisations",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(orgs.statusCode).toBe(200);
    const organisationId = orgs.json().items[0].id;

    const loc = await app.inject({
      method: "POST",
      url: "/v1/locations",
      headers: { authorization: `Bearer ${token}` },
      payload: { code: "ZNZ", name: "Zanzibar Ops", countryCode: "TZ", city: "Stone Town" },
    });
    expect(loc.statusCode).toBe(201);

    const cc = await app.inject({
      method: "POST",
      url: "/v1/cost-centers",
      headers: { authorization: `Bearer ${token}` },
      payload: { code: "CC-MICE", name: "MICE" },
    });
    expect(cc.statusCode).toBe(201);

    const unit = await app.inject({
      method: "POST",
      url: "/v1/org-units",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        organisationId,
        code: "MICE",
        name: "MICE",
        departmentKey: "mice",
        unitType: "department",
        locationId: loc.json().location.id,
        costCenterId: cc.json().costCenter.id,
      },
    });
    expect(unit.statusCode).toBe(201);

    const audit = await app.inject({
      method: "GET",
      url: "/v1/audit-events",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(audit.statusCode).toBe(200);
    const actions = audit.json().items.map((i: { action: string }) => i.action);
    expect(actions).toContain("org:write:location");
    expect(actions).toContain("org:write:unit");
  });

  it("denies non-admin from creating principals", async () => {
    const app = buildServer(seedStore("test-secret"));
    const alice = await login(app, "alice.finance@sedmc.local", P.alicePassword);
    const res = await app.inject({
      method: "POST",
      url: "/v1/principals",
      headers: { authorization: `Bearer ${alice.json().accessToken}` },
      payload: {
        actorType: "Human",
        displayName: "Should Fail",
        classificationClearance: "Internal",
        email: "fail@sedmc.local",
      },
    });
    expect(res.statusCode).toBe(403);
  });

  it("blocks admin self-approval of config drafts (SoD)", async () => {
    const app = buildServer(seedStore("test-secret"));
    const carol = await login(app, "carol.admin@sedmc.local", P.carolPassword);
    const draft = await app.inject({
      method: "POST",
      url: "/v1/config/margin.floor/drafts",
      headers: { authorization: `Bearer ${carol.json().accessToken}` },
      payload: { value: { percent: 18 } },
    });
    expect(draft.statusCode).toBe(201);
    const versionId = draft.json().version.id;
    const selfApprove = await app.inject({
      method: "POST",
      url: `/v1/config/versions/${versionId}/approve`,
      headers: { authorization: `Bearer ${carol.json().accessToken}` },
      payload: {},
    });
    expect(selfApprove.statusCode).toBe(403);
    expect(["self_approval_forbidden", "sod", "rbac"]).toContain(selfApprove.json().reason);
  });

  it("allows a different approver to approve config draft", async () => {
    const app = buildServer(seedStore("test-secret"));
    const carol = await login(app, "carol.admin@sedmc.local", P.carolPassword);
    const bob = await login(app, "bob.approver@sedmc.local", P.bobPassword);
    const draft = await app.inject({
      method: "POST",
      url: "/v1/config/margin.floor/drafts",
      headers: { authorization: `Bearer ${carol.json().accessToken}` },
      payload: { value: { percent: 20 } },
    });
    const versionId = draft.json().version.id;
    const approved = await app.inject({
      method: "POST",
      url: `/v1/config/versions/${versionId}/approve`,
      headers: { authorization: `Bearer ${bob.json().accessToken}` },
      payload: {},
    });
    expect(approved.statusCode).toBe(200);
    expect(approved.json().version.status).toBe("approved");
  });

  it("blocks self privilege escalation to platform.admin", async () => {
    const app = buildServer(seedStore("test-secret"));
    const carol = await login(app, "carol.admin@sedmc.local", P.carolPassword);
    const me = carol.json().principal.id;
    const res = await app.inject({
      method: "POST",
      url: "/v1/role-grants",
      headers: { authorization: `Bearer ${carol.json().accessToken}` },
      payload: { principalId: me, roleKey: "platform.admin" },
    });
    expect(res.statusCode).toBe(403);
    expect(res.json().reason).toBe("self_privilege_escalation");
  });

  it("revokes sessions and rejects revoked tokens", async () => {
    const app = buildServer(seedStore("test-secret"));
    const carol = await login(app, "carol.admin@sedmc.local", P.carolPassword);
    const alice = await login(app, "alice.finance@sedmc.local", P.alicePassword);
    const aliceToken = alice.json().accessToken;
    const aliceId = alice.json().principal.id;
    const sessions = await app.inject({
      method: "GET",
      url: `/v1/principals/${aliceId}/sessions`,
      headers: { authorization: `Bearer ${carol.json().accessToken}` },
    });
    expect(sessions.statusCode).toBe(200);
    const sessionId = sessions.json().items[0].id;
    const revoked = await app.inject({
      method: "POST",
      url: `/v1/sessions/${sessionId}/revoke`,
      headers: { authorization: `Bearer ${carol.json().accessToken}` },
      payload: {},
    });
    expect(revoked.statusCode).toBe(200);
    const after = await app.inject({
      method: "GET",
      url: "/v1/me",
      headers: { authorization: `Bearer ${aliceToken}` },
    });
    expect(after.statusCode).toBe(401);
  });

  it("enforces tenant isolation on principal listing", async () => {
    const app = buildServer(seedStore("test-secret"));
    const carol = await login(app, "carol.admin@sedmc.local", P.carolPassword);
    const list = await app.inject({
      method: "GET",
      url: "/v1/principals",
      headers: { authorization: `Bearer ${carol.json().accessToken}` },
    });
    expect(list.statusCode).toBe(200);
    const emails = list.json().items.map((p: { email?: string }) => p.email);
    expect(emails).not.toContain("partner@external.local");
  });

  it("creates human and service principals without IdP hard-wiring", async () => {
    const app = buildServer(seedStore("test-secret"));
    const carol = await login(app, "carol.admin@sedmc.local", P.carolPassword);
    const human = await app.inject({
      method: "POST",
      url: "/v1/principals",
      headers: { authorization: `Bearer ${carol.json().accessToken}` },
      payload: {
        actorType: "Human",
        email: "guide.ops@sedmc.local",
        displayName: "Ops Guide",
        classificationClearance: "Internal",
        attributes: { department: "operations" },
      },
    });
    expect(human.statusCode).toBe(201);
    const service = await app.inject({
      method: "POST",
      url: "/v1/principals",
      headers: { authorization: `Bearer ${carol.json().accessToken}` },
      payload: {
        actorType: "Service",
        displayName: "outbox-publisher",
        classificationClearance: "Internal",
      },
    });
    expect(service.statusCode).toBe(201);
    expect(service.json().principal.actorType).toBe("Service");
  });
});
