import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { newId } from "@sedmc/kernel";
import { LocalFsDocumentStorage } from "../src/commercial-documents/storage.js";
import { E1D_CLASS_B_SOR_INVENTORY } from "../src/persistence/sor-inventory.js";

describe("E1-D Class B SoR inventory (not expansion)", () => {
  it("records inventory-only map and does not claim Production SoR", () => {
    expect(E1D_CLASS_B_SOR_INVENTORY.kind).toBe("inventory");
    expect(E1D_CLASS_B_SOR_INVENTORY.notExpansion).toBe(true);
    expect(E1D_CLASS_B_SOR_INVENTORY.productionReady).toBe(false);
    expect(E1D_CLASS_B_SOR_INVENTORY.postgresqlAuthoritativeWhenPoolSet).toContain("opportunity");
    expect(E1D_CLASS_B_SOR_INVENTORY.postgresqlAuthoritativeWhenPoolSet).toContain("rfp");
    expect(E1D_CLASS_B_SOR_INVENTORY.processLocalAuthoritative).toContain("crm");
    expect(E1D_CLASS_B_SOR_INVENTORY.documentBytes).toBe("local-fs");
  });
});

describe("E1-D Class B DocumentStorage.delete", () => {
  it("puts, gets, deletes, and returns null after delete", async () => {
    const root = join(tmpdir(), `eos-e1d-b-docs-${newId()}`);
    const storage = new LocalFsDocumentStorage(root);
    const put = await storage.put({
      tenantId: newId(),
      documentId: newId(),
      bytes: Buffer.from("%PDF-1.4 class-b-delete"),
      mimeType: "application/pdf",
    });
    expect(await storage.get(put.storageRef)).not.toBeNull();
    await storage.delete(put.storageRef);
    expect(await storage.get(put.storageRef)).toBeNull();
    await storage.delete(put.storageRef);
    expect(await storage.get("missing/ref")).toBeNull();
    expect(await storage.exists("missing/ref")).toBe(false);
    expect(await storage.stat("missing/ref")).toBeNull();
  });
});
