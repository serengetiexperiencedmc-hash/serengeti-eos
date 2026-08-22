import { describe, expect, it } from "vitest";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";

const P = TEST_BOOTSTRAP_SECRETS;
const SAMPLE_SIZE = 20;

function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)]!;
}

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

async function orgTypeId(app: ReturnType<typeof buildServer>, token: string) {
  const types = await app.inject({
    method: "GET",
    url: "/v1/crm/organization-types",
    headers: { authorization: `Bearer ${token}` },
  });
  return types.json().items[0].id as string;
}

describe("C1.11 CRM performance baseline", () => {
  it("captures Dev/Test p50/p95 latency samples", async () => {
    const store = seedStore("perf-baseline");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const typeId = await orgTypeId(app, token);

    const org = await app.inject({
      method: "POST",
      url: "/v1/crm/organizations",
      headers: { authorization: `Bearer ${token}` },
      payload: { legalName: "Perf Baseline Org", organizationTypeId: typeId },
    });
    const orgId = org.json().organization.id as string;

    await app.inject({
      method: "POST",
      url: "/v1/crm/contacts",
      headers: { authorization: `Bearer ${token}` },
      payload: { givenName: "Perf", familyName: "Contact", email: "perf.baseline@example.com" },
    });

    await app.inject({
      method: "POST",
      url: "/v1/crm/tasks",
      headers: { authorization: `Bearer ${token}` },
      payload: { title: "Perf baseline task" },
    });

    const operations: Array<{ name: string; samples: number[] }> = [
      { name: "organization_get", samples: [] },
      { name: "organization_create", samples: [] },
      { name: "contact_list", samples: [] },
      { name: "search_unified", samples: [] },
      { name: "duplicate_list", samples: [] },
      { name: "account_list", samples: [] },
      { name: "task_list", samples: [] },
      { name: "activity_list", samples: [] },
      { name: "tag_list", samples: [] },
      { name: "external_id_lookup_miss", samples: [] },
    ];

    for (let i = 0; i < SAMPLE_SIZE; i++) {
      const t0 = performance.now();
      await app.inject({
        method: "GET",
        url: `/v1/crm/organizations/${orgId}`,
        headers: { authorization: `Bearer ${token}` },
      });
      operations[0]!.samples.push(performance.now() - t0);

      const t1 = performance.now();
      await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: `Perf Org ${i}`, organizationTypeId: typeId },
      });
      operations[1]!.samples.push(performance.now() - t1);

      const t2 = performance.now();
      await app.inject({ method: "GET", url: "/v1/crm/contacts", headers: { authorization: `Bearer ${token}` } });
      operations[2]!.samples.push(performance.now() - t2);

      const t3 = performance.now();
      await app.inject({
        method: "GET",
        url: "/v1/crm/search?q=Perf&types=organization&types=contact&types=task",
        headers: { authorization: `Bearer ${token}` },
      });
      operations[3]!.samples.push(performance.now() - t3);

      const t4 = performance.now();
      await app.inject({
        method: "GET",
        url: "/v1/crm/duplicates?entityType=organization",
        headers: { authorization: `Bearer ${token}` },
      });
      operations[4]!.samples.push(performance.now() - t4);

      const t5 = performance.now();
      await app.inject({ method: "GET", url: "/v1/crm/accounts", headers: { authorization: `Bearer ${token}` } });
      operations[5]!.samples.push(performance.now() - t5);

      const t6 = performance.now();
      await app.inject({ method: "GET", url: "/v1/crm/tasks", headers: { authorization: `Bearer ${token}` } });
      operations[6]!.samples.push(performance.now() - t6);

      const t7 = performance.now();
      await app.inject({ method: "GET", url: "/v1/crm/activities", headers: { authorization: `Bearer ${token}` } });
      operations[7]!.samples.push(performance.now() - t7);

      const t8 = performance.now();
      await app.inject({ method: "GET", url: "/v1/crm/tags", headers: { authorization: `Bearer ${token}` } });
      operations[8]!.samples.push(performance.now() - t8);

      const t9 = performance.now();
      await app.inject({
        method: "GET",
        url: "/v1/crm/external-identifiers/lookup/perf_system/missing-id",
        headers: { authorization: `Bearer ${token}` },
      });
      operations[9]!.samples.push(performance.now() - t9);
    }

    const baseline = operations.map((op) => ({
      operation: op.name,
      sampleSize: op.samples.length,
      p50Ms: Math.round(percentile(op.samples, 50) * 100) / 100,
      p95Ms: Math.round(percentile(op.samples, 95) * 100) / 100,
    }));

    expect(baseline.every((b) => b.p50Ms >= 0 && b.p95Ms >= 0)).toBe(true);
    expect(baseline.length).toBe(10);
    expect(baseline.find((b) => b.operation === "search_unified")!.p95Ms).toBeLessThan(5000);

    const doc = [
      "# C1 CRM Performance Baseline",
      "",
      "| Field | Value |",
      "| --- | --- |",
      `| Captured | ${new Date().toISOString()} |`,
      "| Environment | Development/Test |",
      "| Runtime mode | in-memory CRM store |",
      "| PostgreSQL | schema-only; CRM API not persisted to PG |",
      `| Sample size | ${SAMPLE_SIZE} per operation |`,
      "",
      "| Operation | p50 (ms) | p95 (ms) |",
      "| --- | ---: | ---: |",
      ...baseline.map((b) => `| ${b.operation} | ${b.p50Ms} | ${b.p95Ms} |`),
      "",
      "Not a production SLA. Dev/Test baseline evidence for C1 Gate.",
      "",
    ].join("\n");
    writeFileSync(join(process.cwd(), "..", "..", "docs", "architecture", "c1", "performance-baseline.md"), doc);
  });
});
