import { CLASSIFICATION_RANK, type Classification } from "./types.js";
import { DEFAULT_CRM_ACTIVITY_TYPE_KEYS } from "./crm.js";

export function isValidActivityTypeKey(key: string): boolean {
  return (DEFAULT_CRM_ACTIVITY_TYPE_KEYS as readonly string[]).includes(key);
}

export function parseOccurredAt(value: string): { ok: true; iso: string } | { ok: false } {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return { ok: false };
  return { ok: true, iso: new Date(parsed).toISOString() };
}

export function maxClassification(a: Classification, b: Classification): Classification {
  return CLASSIFICATION_RANK[a] >= CLASSIFICATION_RANK[b] ? a : b;
}

export function activitySubjectValid(subject: string): boolean {
  return subject.trim().length > 0 && subject.trim().length <= 500;
}
