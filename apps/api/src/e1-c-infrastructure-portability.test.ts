import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { newId } from "@sedmc/kernel";
import { validateDeploymentConfig } from "../src/deployment-config.js";
import { LocalFsDocumentStorage } from "../src/commercial-documents/storage.js";
import {
  resolveDatabasePoolOptions,
  resolveDocumentRoot,
  resolveDocumentStorageKind,
  resolveInfrastructureTarget,
} from "../src/infrastructure-contract.js";
import { LOCAL_PASSWORD_IDP_NAME } from "../src/ports/identity.js";
import { resolveEmailAdapterName } from "../src/notifications/email-config.js";

const API_SRC = join(process.cwd(), "src");

const BUSINESS_DIRS = [
  "crm",
  "pipeline",
  "rfp",
  "programme",
  "costing",
  "commercial-approval",
  "commercial-documents",
];

const CLOUD_SDK_MARKERS = [
  "@aws-sdk/",
  "@azure/",
  "@google-cloud/",
  "aws-sdk",
  "CloudWatch",
  "ServiceBusClient",
];

function listTsFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...listTsFiles(path));
    else if (name.endsWith(".ts") && !name.endsWith(".test.ts")) out.push(path);
  }
  return out;
}

describe("E1-C infrastructure portability (Dev/Test)", () => {
  it("labels the local machine as DEV/TEST ONLY and not Production ready", () => {
    const resolved = resolveInfrastructureTarget({ EOS_ENV: "development" });
    expect(resolved.target).toBe("local-devtest");
    expect(resolved.label).toBe("DEV/TEST ONLY");
    expect(resolved.productionReady).toBe(false);
    expect(resolveDocumentStorageKind({})).toBe("local-fs");
    expect(resolveDatabasePoolOptions({}).tlsMode).toBe("disable");
    expect(resolveDocumentRoot({ EOS_DOCUMENT_ROOT: "C:/eos-docs" }).replace(/\\/g, "/")).toMatch(/eos-docs$/);
  });

  it("DocumentStorage put/get/exists/stat/delete works through the local-fs adapter", async () => {
    const root = join(tmpdir(), `eos-e1c-port-${newId()}`);
    const storage = new LocalFsDocumentStorage(root);
    expect(storage.name).toBe("local-fs");
    const put = await storage.put({
      tenantId: newId(),
      documentId: newId(),
      bytes: Buffer.from("%PDF-1.4 portability"),
      mimeType: "application/pdf",
    });
    expect(await storage.exists(put.storageRef)).toBe(true);
    const meta = await storage.stat(put.storageRef);
    expect(meta?.sizeBytes).toBeGreaterThan(0);
    expect(meta?.checksumSha256).toMatch(/^[0-9a-f]{64}$/);
    expect(await storage.get(put.storageRef)).not.toBeNull();
    await storage.delete(put.storageRef);
    expect(await storage.exists(put.storageRef)).toBe(false);
    expect(await storage.stat(put.storageRef)).toBeNull();
  });

  it("refuses to treat local-fs / local-devtest / disable TLS as Production", () => {
    const result = validateDeploymentConfig({
      EOS_ENV: "production",
      EOS_TOKEN_SECRET: "a-non-placeholder-secret-value",
      EOS_DATABASE_URL: "postgres://example.invalid/eos",
      EOS_DATABASE_TLS_MODE: "disable",
      EOS_INFRASTRUCTURE_TARGET: "local-devtest",
      EOS_DOCUMENT_STORAGE: "local-fs",
      EOS_EVENT_TRANSPORT: "nats-jetstream",
      EOS_NATS_URL: "nats://example.invalid:4222",
      EOS_EMAIL_ADAPTER: "smtp",
      EOS_SMTP_HOST: "example.invalid",
    });
    expect(result.productionReady).toBe(false);
    expect(result.fatal.some((f) => f.includes("TLS_MODE"))).toBe(true);
    expect(result.fatal.some((f) => f.includes("local-devtest"))).toBe(true);
    expect(result.fatal.some((f) => f.includes("local-fs"))).toBe(true);
    expect(result.fatal.some((f) => f.includes("IdP") || f.includes("local-password"))).toBe(true);
  });

  it("keeps identity and email behind ports (Dev/Test adapters named as such)", () => {
    expect(LOCAL_PASSWORD_IDP_NAME).toBe("local-password-dev");
    expect(resolveEmailAdapterName()).toMatch(/dev-outbox|smtp|ses/);
  });

  it("does not import cloud SDKs from Commercial/CRM/RFP/Programme business modules", () => {
    const hits: string[] = [];
    for (const dir of BUSINESS_DIRS) {
      const root = join(API_SRC, dir);
      for (const file of listTsFiles(root)) {
        const text = readFileSync(file, "utf8");
        for (const marker of CLOUD_SDK_MARKERS) {
          if (text.includes(marker)) hits.push(`${file} contains ${marker}`);
        }
      }
    }
    expect(hits).toEqual([]);
  });
});
