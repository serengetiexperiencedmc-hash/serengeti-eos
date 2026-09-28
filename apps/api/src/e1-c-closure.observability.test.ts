import { describe, expect, it, vi } from "vitest";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import { createLogger } from "../src/observability.js";
import { ensureCrmCollections } from "../src/crm/collections.js";
import type { Store } from "../src/store.js";

function seedOrg(store: Store): string {
  ensureCrmCollections(store);
  const id = newId();
  const now = new Date().toISOString();
  store.crmOrganizations.push({
    id,
    tenantId: "11111111-1111-4111-8111-111111111111",
    legalName: "Obs Persist Org",
    organizationTypeId: newId(),
    status: "Active",
    dataQualityStatus: "Verified",
    classification: "Internal",
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
  });
  return id;
}

describe("E1-C closure observability honesty (Dev/Test)", () => {
  it("keeps /health process-ok and /ready productionReady false with MFA not enabled", async () => {
    const app = buildServer({ store: seedStore("e1c-obs-ready", TEST_BOOTSTRAP_SECRETS) });
    const health = await app.inject({ method: "GET", url: "/health" });
    expect(health.statusCode).toBe(200);
    expect(health.json().productionReady).toBe(false);
    expect(health.json().identity.mfaEnabled).toBe(false);
    expect(health.json().identity.productionIdpSelected).toBe(false);

    const ready = await app.inject({ method: "GET", url: "/ready" });
    expect(ready.statusCode).toBe(200);
    expect(ready.json().productionReady).toBe(false);
    expect(ready.json().identity.mfaEnabled).toBe(false);
  });

  it("does not log raw email on authentication failure", async () => {
    const lines: string[] = [];
    const spy = vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      lines.push(String(args[0] ?? ""));
    });
    const app = buildServer({ store: seedStore("e1c-obs-auth", TEST_BOOTSTRAP_SECRETS) });
    await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "secret-user@example.com", password: "wrong", tenantSlug: "sedmc" },
    });
    spy.mockRestore();
    const joined = lines.join("\n");
    expect(joined).toContain("authentication_failed");
    expect(joined).not.toContain("secret-user@example.com");
  });

  it("logs persistence_failed without claiming Production readiness", async () => {
    const lines: string[] = [];
    const errSpy = vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
      lines.push(String(args[0] ?? ""));
    });
    const store = seedStore("e1c-obs-persist", TEST_BOOTSTRAP_SECRETS);
    const orgId = seedOrg(store);
    store.dbPool = {
      query: async (text: string) => {
        if (String(text).includes("SELECT 1 FROM opp_opportunities")) return { rows: [], rowCount: 0 };
        throw new Error("db_unreachable");
      },
      connect: async () => {
        throw new Error("db_unreachable");
      },
    } as Store["dbPool"];
    const app = buildServer({ store });
    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: {
        email: "carol.admin@sedmc.local",
        password: TEST_BOOTSTRAP_SECRETS.carolPassword,
        tenantSlug: "sedmc",
      },
    });
    const token = login.json().accessToken as string;
    await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        opportunityCode: "OPP-2026-OBS",
        title: "Must fail closed",
        organizationId: orgId,
      },
    });
    errSpy.mockRestore();
    const joined = lines.join("\n");
    expect(joined).toContain("persistence_failed");
    expect(joined).toContain("\"productionReady\":false");
  });

  it("redacts passwordHash in structured logs", () => {
    const lines: string[] = [];
    const spy = vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      lines.push(String(args[0] ?? ""));
    });
    createLogger("info").info("probe", { passwordHash: "scrypt-secret", principalId: "p1" });
    spy.mockRestore();
    expect(lines[0]).toContain("[REDACTED]");
    expect(lines[0]).not.toContain("scrypt-secret");
  });
});
