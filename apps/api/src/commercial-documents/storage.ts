import { createHash } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { DocumentStorage, DocumentStoragePutInput } from "@sedmc/kernel";

export class DocumentStorageCollisionError extends Error {
  readonly code = "storage_collision" as const;
  constructor(storageRef: string) {
    super(`document_storage_collision:${storageRef}`);
    this.name = "DocumentStorageCollisionError";
  }
}

/**
 * Dev/Test DocumentStorage — local filesystem under a root directory.
 * Does not bind ADR-0006 / Production object storage.
 */
export class LocalFsDocumentStorage implements DocumentStorage {
  readonly name = "local-fs";

  constructor(private readonly rootDir: string) {}

  async put(input: DocumentStoragePutInput): Promise<{ storageRef: string }> {
    const dir = join(this.rootDir, input.tenantId);
    await mkdir(dir, { recursive: true });
    const storageRef = `${input.tenantId}/${input.documentId}`;
    const path = join(this.rootDir, storageRef);
    try {
      await writeFile(path, input.bytes, { flag: "wx" });
    } catch (err) {
      const code = err && typeof err === "object" && "code" in err ? String((err as { code?: unknown }).code) : "";
      if (code === "EEXIST") throw new DocumentStorageCollisionError(storageRef);
      throw err;
    }
    return { storageRef };
  }

  async get(storageRef: string): Promise<Buffer | null> {
    if (!isSafeStorageRef(storageRef)) return null;
    try {
      return await readFile(join(this.rootDir, storageRef));
    } catch {
      return null;
    }
  }

  async delete(storageRef: string): Promise<void> {
    if (!isSafeStorageRef(storageRef)) return;
    try {
      await unlink(join(this.rootDir, storageRef));
    } catch {
      /* missing bytes are acceptable during compensation */
    }
  }
}

function isSafeStorageRef(storageRef: string): boolean {
  return !storageRef.includes("..") && !storageRef.startsWith("/") && !storageRef.includes("\\");
}

export function sha256Buffer(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

export function decodeContentBase64(value: string): Buffer | { error: "invalid_base64" } {
  try {
    const buf = Buffer.from(value, "base64");
    if (buf.length === 0 && value.trim().length > 0) return { error: "invalid_base64" };
    return buf;
  } catch {
    return { error: "invalid_base64" };
  }
}
