import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

async function importSeasons(
  app: ReturnType<typeof buildServer>,
  token: string,
  csv: string,
  mode: "create_only" | "upsert",
  idempotencyKey: string,
) {
  const created = await app.inject({
    method: "POST",
    url: "/v1/suppliers/imports",
    headers: { authorization: `Bearer ${token}` },
    payload: { sourceSystem: "pg29-test", entityType: "supplier_season", csv, mode },
  });
  expect(created.statusCode).toBe(201);
  expect(created.json().batch.increment).toBe("PG.29");
  const batchId = created.json().batch.id as string;

  const validated = await app.inject({
    method: "POST",
    url: `/v1/suppliers/imports/${batchId}/validate`,
    headers: { authorization: `Bearer ${token}` },
  });
  const executed =
    validated.json().batch.status === "validated"
      ? await app.inject({
          method: "POST",
          url: `/v1/suppliers/imports/${batchId}/execute`,
          headers: { authorization: `Bearer ${token}`, "idempotency-key": idempotencyKey },
        })
      : undefined;
  return { created, validated, executed, batchId };
}

describe("PG.29 season catalogue import / idempotent upsert", () => {
  it("creates then updates a season on upsert", async () => {
    const store = seedStore("pg29-upsert", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const csv = [
      "seasonCode,label,validFrom,validTo",
      "HIGH-2029,High Season 2029,2029-07-01,2029-10-31",
    ].join("\n");

    const first = await importSeasons(app, token, csv, "upsert", "pg29-1");
    expect(first.validated.statusCode).toBe(200);
    expect(first.validated.json().batch.status).toBe("validated");
    expect(first.executed?.statusCode).toBe(200);

    const createdSeason = store.supSeasons.find((s) => s.seasonCode === "HIGH-2029");
    expect(createdSeason?.label).toBe("High Season 2029");
    expect(createdSeason?.validFrom).toBe("2029-07-01");

    const updatedCsv = [
      "seasonCode,label,validFrom,validTo",
      "HIGH-2029,High Season 2029 (revised),2029-06-15,2029-10-31",
    ].join("\n");
    const second = await importSeasons(app, token, updatedCsv, "upsert", "pg29-2");
    expect(second.validated.json().batch.status).toBe("validated");
    expect(second.executed?.statusCode).toBe(200);

    const seasons = store.supSeasons.filter((s) => s.seasonCode === "HIGH-2029" && !s.archivedAt);
    expect(seasons).toHaveLength(1);
    expect(seasons[0]!.label).toBe("High Season 2029 (revised)");
    expect(seasons[0]!.validFrom).toBe("2029-06-15");
    expect(seasons[0]!.id).toBe(createdSeason?.id);
  });

  it("rejects an existing seasonCode in create_only mode", async () => {
    const store = seedStore("pg29-create-only", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const csv = [
      "seasonCode,label,validFrom,validTo",
      "HIGH-2029,High Season 2029,2029-07-01,2029-10-31",
    ].join("\n");

    const first = await importSeasons(app, token, csv, "create_only", "pg29-3");
    expect(first.executed?.statusCode).toBe(200);

    const second = await importSeasons(app, token, csv, "create_only", "pg29-4");
    expect(second.validated.json().batch.status).toBe("failed");
    expect(second.validated.json().batch.validationResults[0].errors).toContain("existing_record_conflict");
    expect(second.executed).toBeUndefined();
  });
});
