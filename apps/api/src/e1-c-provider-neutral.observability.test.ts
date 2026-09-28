import { describe, expect, it } from "vitest";
import { seedStore } from "../src/app.js";
import { buildServer } from "../src/server.js";

describe("E1-C provider-neutral observability headers (Dev/Test)", () => {
  it("echoes x-correlation-id and x-request-id without claiming Production readiness", async () => {
    const app = buildServer({ store: seedStore("e1c-obs") });
    const res = await app.inject({
      method: "GET",
      url: "/health",
      headers: {
        "x-correlation-id": "corr-e1c-fixed",
        "x-request-id": "req-e1c-fixed",
      },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().productionReady).toBe(false);
    expect(res.headers["x-correlation-id"]).toBe("corr-e1c-fixed");
    expect(res.headers["x-request-id"]).toBe("req-e1c-fixed");
  });

  it("assigns request identifiers when callers omit them", async () => {
    const app = buildServer({ store: seedStore("e1c-obs-gen") });
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json().productionReady).toBe(false);
    expect(String(res.headers["x-correlation-id"] ?? "")).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(String(res.headers["x-request-id"] ?? "")).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });
});
