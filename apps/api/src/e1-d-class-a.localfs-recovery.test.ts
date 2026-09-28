import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { newId } from "@sedmc/kernel";
import { LocalFsDocumentStorage } from "../src/commercial-documents/storage.js";

describe("E1-D Class A LocalFs document recovery (Dev/Test)", () => {
  it("recovers bytes from disk after a new storage instance (process restart stand-in)", async () => {
    const root = join(tmpdir(), `eos-e1d-localfs-${newId()}`);
    const first = new LocalFsDocumentStorage(root);
    const tenantId = newId();
    const documentId = newId();
    const bytes = Buffer.from("%PDF-1.4 synthetic-e1d-localfs");
    const put = await first.put({
      tenantId,
      documentId,
      bytes,
      mimeType: "application/pdf",
    });
    const restarted = new LocalFsDocumentStorage(root);
    const got = await restarted.get(put.storageRef);
    expect(got?.equals(bytes)).toBe(true);
  });

  it("returns null after delete compensation on the same root", async () => {
    const root = join(tmpdir(), `eos-e1d-localfs-del-${newId()}`);
    const storage = new LocalFsDocumentStorage(root);
    const tenantId = newId();
    const documentId = newId();
    const put = await storage.put({
      tenantId,
      documentId,
      bytes: Buffer.from("synthetic"),
      mimeType: "application/pdf",
    });
    await storage.delete(put.storageRef);
    expect(await storage.get(put.storageRef)).toBeNull();
  });
});
