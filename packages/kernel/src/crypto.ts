import { createHash, randomUUID, scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import type { AuditRecord, ChainedAuditRecord } from "./types.js";
import { GENESIS_HASH } from "./types.js";

export function newId(): string {
  return randomUUID();
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function canonicalJson(value: unknown): string {
  if (value === undefined) return "null";
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  }
  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
    a.localeCompare(b),
  );
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`).join(",")}}`;
}

export function hashPassword(password: string, salt = randomBytes(16).toString("hex")): string {
  const hash = scryptSync(password, salt, 32).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [alg, salt, hash] = stored.split(":");
  if (alg !== "scrypt" || !salt || !hash) return false;
  const actual = scryptSync(password, salt, 32);
  const expected = Buffer.from(hash, "hex");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function chainAudit(
  record: AuditRecord,
  prevHash: string = GENESIS_HASH,
): ChainedAuditRecord {
  const rest = { ...record } as AuditRecord & { prevHash?: string; rowHash?: string };
  delete rest.prevHash;
  delete rest.rowHash;
  const payload = canonicalJson(rest);
  const rowHash = sha256(`${prevHash}|${payload}`);
  return { ...record, prevHash, rowHash };
}

export function verifyAuditChain(records: ChainedAuditRecord[]): {
  ok: boolean;
  brokenAt?: number;
} {
  let prev = GENESIS_HASH;
  for (let i = 0; i < records.length; i += 1) {
    const rec = records[i];
    if (!rec) continue;
    const expected = chainAudit(rec, prev);
    if (rec.prevHash !== prev || rec.rowHash !== expected.rowHash) {
      return { ok: false, brokenAt: i };
    }
    prev = rec.rowHash;
  }
  return { ok: true };
}
