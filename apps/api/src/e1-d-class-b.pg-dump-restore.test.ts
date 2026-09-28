import { describe, expect, it } from "vitest";
import {
  DISPOSABLE_PG_RECOVERY_UNAVAILABLE,
  isGovernedGateBDatabaseName,
  runDisposablePgDumpRestoreDrill,
} from "../src/persistence/disposable-pg-recovery.js";

describe("E1-D Class B disposable pg_dump/restore harness", () => {
  it("refuses the governed Gate-B database name", () => {
    expect(isGovernedGateBDatabaseName("eos_gateb")).toBe(true);
    expect(isGovernedGateBDatabaseName("eos_e1d_b5_tmp")).toBe(false);
  });

  it(
    "runs dump/restore on a disposable database or records the blocked reason",
    async () => {
    const result = await runDisposablePgDumpRestoreDrill();
    if ("blocked" in result && result.blocked) {
      expect(result.reason).toBe(DISPOSABLE_PG_RECOVERY_UNAVAILABLE);
      expect(result.detail.length).toBeGreaterThan(0);
      expect(result.label).toBe("DEV/TEST ONLY");
      expect(result.productionRtoClaimed).toBe(false);
      return;
    }
    expect(result.ok).toBe(true);
    expect(result.dumped).toBe(true);
    expect(result.restored).toBe(true);
    expect(result.verified).toBe(true);
    expect(result.productionRtoClaimed).toBe(false);
    expect(result.label).toBe("DEV/TEST ONLY");
    expect(result.method === "pg_dump" || result.method === "sql-logical").toBe(true);
    expect(result.elapsedMs).toBeGreaterThanOrEqual(0);
    expect(isGovernedGateBDatabaseName(result.databaseName)).toBe(false);
    },
    20_000,
  );
});
