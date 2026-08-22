import type { Classification } from "./types.js";
import type { EnterpriseEventEnvelope } from "./events.js";
import type { DlqLifecycleStatus } from "./events.js";

export type EventSchemaField = {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  description?: string;
};

export type EventSchemaDefinition = {
  eventType: string;
  schemaVersion: number;
  owner: string;
  purpose: string;
  producer: string;
  consumers: string[];
  classification: Classification;
  retentionDays: number;
  compatibility: "backward" | "forward" | "none";
  lifecycle: "draft" | "active" | "deprecated" | "retired";
  /** Per-aggregate ordering when set (e.g. aggregateId). No global ordering. */
  orderingKey?: "aggregateId" | "tenantId" | "none";
  requiredFields: EventSchemaField[];
  optionalFields: EventSchemaField[];
  /** Payload keys that must never appear (PII minimization). */
  forbiddenPayloadKeys: string[];
  maxPayloadBytes: number;
  sensitiveDataPolicy: "reference_only" | "minimal_embedded" | "restricted_embedded";
};

export type { DlqLifecycleStatus };

export type SchemaValidationResult =
  | { ok: true }
  | { ok: false; reason: string; code: SchemaErrorCode };

export type SchemaErrorCode =
  | "schema_not_registered"
  | "schema_version_mismatch"
  | "schema_deprecated"
  | "schema_retired"
  | "missing_required_field"
  | "forbidden_sensitive_field"
  | "payload_too_large"
  | "invalid_envelope"
  | "classification_too_low";

const SENSITIVE_KEYS = new Set([
  "email",
  "phone",
  "passport",
  "nationalId",
  "ssn",
  "password",
  "dateOfBirth",
  "address",
]);

export function payloadByteSize(payload: Record<string, unknown>): number {
  return new TextEncoder().encode(JSON.stringify(payload)).length;
}

export function validateEnvelopeSchema(
  schema: EventSchemaDefinition,
  envelope: EnterpriseEventEnvelope,
): SchemaValidationResult {
  if (schema.lifecycle === "retired") return { ok: false, reason: "schema_retired", code: "schema_retired" };
  if (schema.lifecycle === "deprecated" && envelope.schemaVersion < schema.schemaVersion) {
    return { ok: false, reason: "schema_deprecated", code: "schema_deprecated" };
  }
  if (envelope.schemaVersion !== schema.schemaVersion && schema.compatibility === "none") {
    return { ok: false, reason: "schema_version_mismatch", code: "schema_version_mismatch" };
  }
  if (envelope.eventType !== schema.eventType) {
    return { ok: false, reason: "invalid_envelope", code: "invalid_envelope" };
  }
  const rank: Record<Classification, number> = {
    Public: 0,
    Internal: 1,
    Confidential: 2,
    Restricted: 3,
    HighlyRestricted: 4,
  };
  if (rank[envelope.classification] < rank[schema.classification]) {
    return { ok: false, reason: "classification_too_low", code: "classification_too_low" };
  }
  const size = payloadByteSize(envelope.payload);
  if (size > schema.maxPayloadBytes) {
    return { ok: false, reason: "payload_too_large", code: "payload_too_large" };
  }
  for (const field of schema.requiredFields) {
    if (!(field.name in envelope.payload)) {
      return { ok: false, reason: `missing_required_field:${field.name}`, code: "missing_required_field" };
    }
  }
  for (const key of schema.forbiddenPayloadKeys) {
    if (key in envelope.payload) {
      return { ok: false, reason: `forbidden_sensitive_field:${key}`, code: "forbidden_sensitive_field" };
    }
  }
  if (schema.sensitiveDataPolicy === "reference_only") {
    for (const key of Object.keys(envelope.payload)) {
      if (SENSITIVE_KEYS.has(key)) {
        return { ok: false, reason: `forbidden_sensitive_field:${key}`, code: "forbidden_sensitive_field" };
      }
    }
  }
  return { ok: true };
}

export function assertSchemaCompatibility(
  current: EventSchemaDefinition,
  next: EventSchemaDefinition,
): { ok: true } | { ok: false; reason: string } {
  if (current.eventType !== next.eventType) return { ok: false, reason: "event_type_mismatch" };
  if (next.schemaVersion <= current.schemaVersion) return { ok: false, reason: "version_must_increment" };
  if (next.compatibility === "none") return { ok: true };
  const currentRequired = new Set(current.requiredFields.map((f) => f.name));
  for (const field of next.requiredFields) {
    if (!currentRequired.has(field.name) && next.compatibility === "backward") {
      return { ok: false, reason: `breaking_change:new_required_field:${field.name}` };
    }
  }
  return { ok: true };
}
