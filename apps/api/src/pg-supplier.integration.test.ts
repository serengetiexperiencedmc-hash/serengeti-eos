import { checkDatabaseHealth, createPool, migrate } from "@sedmc/db";
import { afterAll, describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import {
  createSupplierImportBatch,
  executeSupplierImportBatch,
  validateSupplierImportBatch,
} from "./supplier/import.js";
import { countSupImportBatches, countSupImportExecuteIdempotencies, countSupSuppliers } from "./persistence/pg-repository.js";
import {
  hydrateSupFromPostgres,
  hydrateSupImportBatchesFromPostgres,
  hydrateSupImportExecuteIdempotenciesFromPostgres,
} from "./persistence/supplier.js";
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
    expect(await countSupSuppliers(pool, tenantId)).toBeGreaterThan(0);
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

describePg("PG.6 supplier entity dual-write", () => {
  const pool = createPool(url!);
  const tenantId = "11111111-1111-4111-8111-111111111111";
  const carolId = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";

  afterAll(async () => {
    await pool.end();
  });

  it("hydrates supplier entities from Postgres", async () => {
    await migrate(pool);
    const store = seedStore("pg6-hydrate", TEST_BOOTSTRAP_SECRETS);
    store.dbPool = pool;
    await syncStoreToPostgres(pool, store);

    const principal = allPrincipals(store).find((p) => p.id === carolId)!;
    const created = createSupplierImportBatch(
      store,
      principal,
      { sourceSystem: "pg6-test", entityType: "supplier", csv: SUPPLIER_CSV.replace("PG5", "PG6") },
      "pg6-create",
    );
    expect("batch" in created).toBe(true);
    if (!("batch" in created)) return;
    validateSupplierImportBatch(store, principal, created.batch.id, "pg6-validate");
    executeSupplierImportBatch(store, principal, created.batch.id, "pg6-exec", "pg6-execute");
    await new Promise((r) => setTimeout(r, 100));

    const fresh = seedStore("pg6-fresh", TEST_BOOTSTRAP_SECRETS);
    fresh.dbPool = pool;
    const merged = await hydrateSupFromPostgres(pool, fresh);
    expect(merged.suppliers).toBeGreaterThan(0);
    expect(fresh.supSuppliers.some((s) => s.supplierCode.includes("PG6"))).toBe(true);
  });
});

describePg("PG.7 supplier import execute idempotency", () => {
  const pool = createPool(url!);
  const tenantId = "11111111-1111-4111-8111-111111111111";
  const carolId = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";

  afterAll(async () => {
    await pool.end();
  });

  it("persists and hydrates execute idempotency keys", async () => {
    await migrate(pool);
    const store = seedStore("pg7-idem", TEST_BOOTSTRAP_SECRETS);
    store.dbPool = pool;
    await syncStoreToPostgres(pool, store);

    const principal = allPrincipals(store).find((p) => p.id === carolId)!;
    const csv = SUPPLIER_CSV.replace("PG5", "PG7");
    const created = createSupplierImportBatch(
      store,
      principal,
      { sourceSystem: "pg7-test", entityType: "supplier", csv },
      "pg7-create",
    );
    expect("batch" in created).toBe(true);
    if (!("batch" in created)) return;

    validateSupplierImportBatch(store, principal, created.batch.id, "pg7-validate");
    const first = executeSupplierImportBatch(store, principal, created.batch.id, "pg7-exec", "pg7-idem-key");
    expect("batch" in first).toBe(true);
    await new Promise((r) => setTimeout(r, 100));
    expect(await countSupImportExecuteIdempotencies(pool, tenantId)).toBeGreaterThan(0);

    const replay = executeSupplierImportBatch(store, principal, created.batch.id, "pg7-exec-2", "pg7-idem-key");
    expect("batch" in replay).toBe(true);
    if ("batch" in replay) expect(replay.replay).toBe(true);

    const fresh = seedStore("pg7-fresh", TEST_BOOTSTRAP_SECRETS);
    fresh.dbPool = pool;
    const merged = await hydrateSupImportExecuteIdempotenciesFromPostgres(pool, fresh);
    expect(merged).toBeGreaterThan(0);
    expect(Object.keys(fresh.supImportExecuteIdempotency).length).toBeGreaterThan(0);
  });
});

describePg("PG.8 supplier CRUD dual-write", () => {
  const pool = createPool(url!);
  const tenantId = "11111111-1111-4111-8111-111111111111";
  const carolId = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";

  afterAll(async () => {
    await pool.end();
  });

  it("persists create and update via REST dual-write", async () => {
    await migrate(pool);
    const store = seedStore("pg8-dw", TEST_BOOTSTRAP_SECRETS);
    store.dbPool = pool;
    await syncStoreToPostgres(pool, store);

    const { createSupplier, updateSupplier } = await import("./supplier/supplier.js");
    const principal = allPrincipals(store).find((p) => p.id === carolId)!;
    const before = await countSupSuppliers(pool, tenantId);

    const created = createSupplier(
      store,
      principal,
      {
        supplierCode: "PG8-CRUD-001",
        legalName: "PG8 Dual Write Lodge",
        category: "accommodation",
        country: "TZ",
      },
      "pg8-create",
    );
    expect("supplier" in created).toBe(true);
    if (!("supplier" in created)) return;
    await new Promise((r) => setTimeout(r, 80));
    expect(await countSupSuppliers(pool, tenantId)).toBeGreaterThan(before);

    const updated = updateSupplier(
      store,
      principal,
      created.supplier.id,
      { legalName: "PG8 Dual Write Lodge Updated", status: "active" },
      "pg8-update",
    );
    expect("supplier" in updated).toBe(true);
    await new Promise((r) => setTimeout(r, 80));

    const row = await pool.query(`SELECT legal_name, status, version FROM sup_suppliers WHERE id = $1`, [
      created.supplier.id,
    ]);
    expect(row.rows[0]?.legal_name).toBe("PG8 Dual Write Lodge Updated");
    expect(row.rows[0]?.status).toBe("active");
    expect(Number(row.rows[0]?.version)).toBe(2);
  });
});
