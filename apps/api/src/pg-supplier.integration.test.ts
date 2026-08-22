import { checkDatabaseHealth, createPool, migrate } from "@sedmc/db";
import { afterAll, describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import {
  createSupplierImportBatch,
  executeSupplierImportBatch,
  validateSupplierImportBatch,
} from "./supplier/import.js";
import { countSupImportBatches } from "./persistence/pg-repository.js";
import { hydrateSupImportBatchesFromPostgres } from "./persistence/supplier.js";
import { syncStoreToPostgres } from "./persistence/sync.js";
import { allPrincipals } from "./store.js";

const url = process.env.EOS_DATABASE_URL;
const enabled = process.env.EOS_RUN_PG_TESTS === "1" && Boolean(url);
const describePg = enabled ? describe : describe.skip;

const SUPPLIER_CSV = [
  "supplierCode,legalName,category,country,status,tradingName,preferredPartner,defaultCurrency",
  "PG5-LOD-001,PG5 Test Lodge,accommodation,TZ,active,PG5 Lodge,true,USD",
].join("\n");

describePg("PG.5 supplier import batch dual-write", () => {
  const pool = createPool(url!);
  const tenantId = "11111111-1111-4111-8111-111111111111";
  const carolId = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";

  afterAll(async () => {
    await pool.end();
  });

  it("persists import batches through validate and execute", async () => {
    await migrate(pool);
    expect((await checkDatabaseHealth(pool)).ok).toBe(true);

    const store = seedStore("pg5-secret", TEST_BOOTSTRAP_SECRETS);
    store.dbPool = pool;
    await syncStoreToPostgres(pool, store);

    const principal = allPrincipals(store).find((p) => p.id === carolId)!;
    const before = await countSupImportBatches(pool, tenantId);

    const created = createSupplierImportBatch(
      store,
      principal,
      { sourceSystem: "pg5-test", entityType: "supplier", csv: SUPPLIER_CSV },
      "pg5-create",
    );
    expect("batch" in created).toBe(true);
    if (!("batch" in created)) return;
    await new Promise((r) => setTimeout(r, 50));
    expect(await countSupImportBatches(pool, tenantId)).toBeGreaterThan(before);

    const validated = validateSupplierImportBatch(store, principal, created.batch.id, "pg5-validate");
    expect("batch" in validated).toBe(true);
    await new Promise((r) => setTimeout(r, 50));

    const executed = executeSupplierImportBatch(
      store,
      principal,
      created.batch.id,
      "pg5-exec-key",
      "pg5-execute",
    );
    expect("batch" in executed).toBe(true);
    if (!("batch" in executed)) return;
    expect(executed.batch.status).toBe("committed");
    await new Promise((r) => setTimeout(r, 50));

    const row = await pool.query(
      `SELECT status, committed_count FROM sup_import_batches WHERE id = $1`,
      [created.batch.id],
    );
    expect(row.rows[0]?.status).toBe("committed");
    expect(Number(row.rows[0]?.committed_count)).toBe(1);
  });

  it("hydrates import batches from Postgres on startup", async () => {
    await migrate(pool);
    const store = seedStore("pg5-hydrate", TEST_BOOTSTRAP_SECRETS);
    store.dbPool = pool;
    await syncStoreToPostgres(pool, store);

    const principal = allPrincipals(store).find((p) => p.id === carolId)!;
    const created = createSupplierImportBatch(
      store,
      principal,
      { sourceSystem: "pg5-hydrate", entityType: "supplier", csv: SUPPLIER_CSV },
      "pg5-hydrate-create",
    );
    expect("batch" in created).toBe(true);
    if (!("batch" in created)) return;
    await new Promise((r) => setTimeout(r, 50));

    const fresh = seedStore("pg5-hydrate-fresh", TEST_BOOTSTRAP_SECRETS);
    fresh.dbPool = pool;
    const merged = await hydrateSupImportBatchesFromPostgres(pool, fresh);
    expect(merged).toBeGreaterThan(0);
    expect(fresh.supImportBatches.some((b) => b.id === created.batch.id)).toBe(true);
  });
});
