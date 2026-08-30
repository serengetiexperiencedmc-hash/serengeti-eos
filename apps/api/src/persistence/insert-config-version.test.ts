import { describe, expect, it } from "vitest";
import { insertConfigVersion } from "./pg-repository.js";

describe("insertConfigVersion", () => {
  it("does not bind a non-UUID seed id into config_versions.id", async () => {
    const statements: { sql: string; params: unknown[] }[] = [];
    const pool = {
      query: async (sql: string, params?: unknown[]) => {
        statements.push({ sql, params: params ?? [] });
        if (sql.includes("SELECT id FROM config_items")) {
          return { rows: [{ id: "11111111-1111-4111-8111-111111111111" }] };
        }
        return { rows: [] };
      },
    };

    await insertConfigVersion(pool as never, {
      id: "cfg-v1",
      tenantId: "11111111-1111-4111-8111-111111111111",
      key: "approval.payment.dual_control",
      version: 1,
      value: { enabled: true },
      status: "approved",
      createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      createdAt: "2026-01-01T00:00:00.000Z",
    });

    const versionInsert = statements.find((s) => s.sql.includes("INSERT INTO config_versions"));
    expect(versionInsert).toBeDefined();
    expect(versionInsert?.sql).not.toMatch(/INSERT INTO config_versions \(\s*id\b/);
    expect(versionInsert?.params).not.toContain("cfg-v1");
    expect(statements.flatMap((s) => s.params)).not.toContain("cfg-v1");
  });
});
