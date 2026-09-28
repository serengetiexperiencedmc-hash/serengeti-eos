import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import type { Store } from "../src/store.js";

const P = TEST_BOOTSTRAP_SECRETS;

describe("E1-D Class B Dev/Test /ready honesty", () => {
  it("reports memory-ok when no pool and no dbHealth, with productionReady false", async () => {
    const app = buildServer({ store: seedStore("ready-memory", P) });
    const res = await app.inject({ method: "GET", url: "/ready" });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.productionReady).toBe(false);
    expect(body.applicationReady).toBe(true);
    expect(body.database).toEqual({ ok: true, mode: "memory" });
  });

  it("reports ready when dbHealth succeeds and productionReady remains false", async () => {
    const store = seedStore("ready-db-ok", P);
    const app = buildServer({
      store,
      dbHealth: async () => ({ ok: true }),
    });
    const res = await app.inject({ method: "GET", url: "/ready" });
    expect(res.statusCode).toBe(200);
    expect(res.json().productionReady).toBe(false);
    expect(res.json().applicationReady).toBe(true);
  });

  it("returns 503 when dbPool is set and the probe fails", async () => {
    const store = seedStore("ready-db-fail", P);
    store.dbPool = {
      query: async () => {
        throw new Error("db_unreachable");
      },
    } as Store["dbPool"];
    const app = buildServer({ store });
    const res = await app.inject({ method: "GET", url: "/ready" });
    expect(res.statusCode).toBe(503);
    const body = res.json();
    expect(body.productionReady).toBe(false);
    expect(body.status).toBe("not_ready");
    expect(body.applicationReady).toBe(false);
  });
});
