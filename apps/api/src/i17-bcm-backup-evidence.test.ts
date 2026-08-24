import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { BCM_SEED } from "../src/bcm/collections.js";
import { buildServer } from "../src/server.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function login(
  app: ReturnType<typeof buildServer>,
  email: string,
  password: string,
  tenantSlug: string,
) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email, password, tenantSlug },
  });
  return res.json().accessToken as string;
}

function assertNoSecrets(body: unknown) {
  const raw = JSON.stringify(body);
  expect(raw).not.toContain("tenantId");
  expect(raw).not.toContain("principalId");
}

describe("I17 BCM backup evidence", () => {
  it("lists I17 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("089_i17_bcm_backup_evidence"))).toBe(true);
  });

  it("enforces auth and tenant isolation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/bcm/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/bcm/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/bcm/jobs",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/bcm/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("I17");
    expect(health.json().jobs).toBe(1);
    expect(health.json().probes).toBe(0);
    assertNoSecrets(health.json());

    const missing = await app.inject({
      method: "GET",
      url: `/v1/bcm/jobs/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);
    expect(store.roles.find((r) => r.key === "bcm.member")?.permissionKeys).toEqual([
      "bcm:read:job",
      "bcm:write:job",
      "bcm:read:probe",
      "bcm:write:probe",
    ]);
  });

  it("runs job and restore-probe lifecycle with SoD", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const bobToken = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/bcm/jobs",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { backupDate: "2026-08-21" },
        })
      ).statusCode,
    ).toBe(403);

    const created = await app.inject({
      method: "POST",
      url: "/v1/bcm/jobs",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { backupDate: "2026-08-21", note: "Dev/Test slot" },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().job.jobCode).toBe("JOB-0002");
    expect(created.json().job.status).toBe("scheduled");
    expect(created.json().job.scheduledFor).toBe("2026-08-21T16:00:00.000Z");
    expect(created.json().job.proven).toBe(false);
    assertNoSecrets(created.json());
    const jobId = created.json().job.id as string;

    const duplicate = await app.inject({
      method: "POST",
      url: "/v1/bcm/jobs",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { backupDate: "2026-08-21" },
    });
    expect(duplicate.statusCode).toBe(409);
    expect(duplicate.json().reason).toBe("duplicate_date");

    const probeTooSoon = await app.inject({
      method: "POST",
      url: `/v1/bcm/jobs/${jobId}/probes`,
      headers: { authorization: `Bearer ${bobToken}` },
      payload: { outcome: "passed" },
    });
    expect(probeTooSoon.statusCode).toBe(409);
    expect(probeTooSoon.json().reason).toBe("not_completed");

    const completed = await app.inject({
      method: "POST",
      url: `/v1/bcm/jobs/${jobId}/complete`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(completed.json().job.status).toBe("completed");
    expect(completed.json().job.proven).toBe(false);

    const selfProbe = await app.inject({
      method: "POST",
      url: `/v1/bcm/jobs/${jobId}/probes`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { outcome: "passed" },
    });
    expect(selfProbe.statusCode).toBe(403);
    expect(selfProbe.json().reason).toBe("sod");

    const bobProbe = await app.inject({
      method: "POST",
      url: `/v1/bcm/jobs/${jobId}/probes`,
      headers: { authorization: `Bearer ${bobToken}` },
      payload: { outcome: "passed", note: "Checksum probe recorded — not a live restore." },
    });
    expect(bobProbe.statusCode).toBe(201);
    expect(bobProbe.json().probe.probeCode).toBe("PRP-0001");
    expect(bobProbe.json().probe.outcome).toBe("passed");

    const proven = await app.inject({
      method: "GET",
      url: `/v1/bcm/jobs/${jobId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(proven.json().job.proven).toBe(true);

    const failSeed = await app.inject({
      method: "POST",
      url: `/v1/bcm/jobs/${BCM_SEED.sampleJobId}/fail`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(failSeed.json().job.status).toBe("failed");

    const probeFailed = await app.inject({
      method: "POST",
      url: `/v1/bcm/jobs/${BCM_SEED.sampleJobId}/probes`,
      headers: { authorization: `Bearer ${bobToken}` },
      payload: { outcome: "passed" },
    });
    expect(probeFailed.statusCode).toBe(409);

    expect("bcmHotSites" in store).toBe(false);
  });
});
