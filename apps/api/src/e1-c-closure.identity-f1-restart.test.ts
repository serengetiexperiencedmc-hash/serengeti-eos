import { describe, expect, it } from "vitest";
import { localPasswordIdentityForbiddenReason } from "../src/ports/identity.js";
import { seedStore, TEST_BOOTSTRAP_SECRETS, login } from "../src/app.js";
import { shouldApplyStartupMigrations } from "../src/persistence/startup-migrations.js";
import { newProcessAgainstPool } from "../src/persistence/gate-b-recovery-harness.js";
import type { Store } from "../src/store.js";

describe("E1-C closure identity boundary (Dev/Test vs Production-like)", () => {
  it("allows local-password-dev when Production-like flags are absent", () => {
    expect(localPasswordIdentityForbiddenReason({ NODE_ENV: "test", EOS_ENV: "development" })).toBeUndefined();
  });

  it("forbids local-password-dev when Production-like flags are set", () => {
    expect(localPasswordIdentityForbiddenReason({ EOS_ENV: "production" })).toMatch(/GAP-IDN-02/);
    expect(localPasswordIdentityForbiddenReason({ EOS_ENV: "uat" })).toMatch(/IdP is unselected/);
    expect(localPasswordIdentityForbiddenReason({ NODE_ENV: "production" })).toMatch(/MFA not implemented/);
  });

  it("refuses login when Production-like env is supplied without selecting an IdP", async () => {
    const store = seedStore("e1c-idn-prod", TEST_BOOTSTRAP_SECRETS);
    const result = await login(
      store,
      {
        email: "carol.admin@sedmc.local",
        password: TEST_BOOTSTRAP_SECRETS.carolPassword,
        tenantSlug: "sedmc",
      },
      { EOS_ENV: "production" },
    );
    expect(result).toEqual({ error: "identity_not_production_ready" });
  });
});

describe("E1-C closure F1 startup migrate guard", () => {
  it("does not apply startup migrations to eos_gateb or Production-like env", () => {
    expect(shouldApplyStartupMigrations(undefined).apply).toBe(false);
    expect(shouldApplyStartupMigrations("postgres://eos_gateb:x@127.0.0.1:5434/eos_gateb")).toEqual({
      apply: false,
      reason: "gate_b_already_provisioned",
    });
    expect(
      shouldApplyStartupMigrations("postgres://eos@127.0.0.1:5432/eos", { EOS_ENV: "production" }),
    ).toEqual({ apply: false, reason: "production_gate_c_not_authorized" });
  });

  it("allows startup migrate on a non-Gate-B Dev/Test URL", () => {
    expect(shouldApplyStartupMigrations("postgres://eos@127.0.0.1:5432/eos_devtest", { NODE_ENV: "test" })).toEqual({
      apply: true,
    });
  });
});

describe("E1-C closure application restart harness (Dev/Test)", () => {
  it("new process against the same pool does not carry process-local SoR rows", () => {
    const pool = { query: async () => ({ rows: [], rowCount: 0 }) } as NonNullable<Store["dbPool"]>;
    const restarted = newProcessAgainstPool(pool, "e1c-restart");
    expect(restarted.oppOpportunities).toHaveLength(0);
    expect(restarted.crmOrganizations).toHaveLength(0);
    expect(restarted.dbPool).toBe(pool);
  });
});
