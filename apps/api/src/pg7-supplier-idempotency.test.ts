import { describe, expect, it } from "vitest";
import {
  supImportExecutePgKey,
  supImportExecuteStoreKey,
} from "./persistence/pg-repository.js";

describe("PG.7 supplier import execute idempotency keys", () => {
  it("encodes batch-scoped idempotency for PG and memory store", () => {
    const tenantId = "11111111-1111-4111-8111-111111111111";
    const batchId = "22222222-2222-4222-8222-222222222222";
    const clientKey = "import-exec-1";

    expect(supImportExecutePgKey(batchId, clientKey)).toBe(`${batchId}:${clientKey}`);
    expect(supImportExecuteStoreKey(tenantId, batchId, clientKey)).toBe(
      `${tenantId}:${batchId}:${clientKey}`,
    );
  });
});
