import { isIsoDate } from "./hr.js";

export const CERTIFICATION_STATUSES = ["held", "revoked"] as const;
export type CertificationStatus = (typeof CERTIFICATION_STATUSES)[number];

export const CERTIFICATION_STATUS_LABELS: Record<CertificationStatus, string> = {
  held: "Held",
  revoked: "Revoked",
};

export function isValidCertificationStatus(value: string): value is CertificationStatus {
  return (CERTIFICATION_STATUSES as readonly string[]).includes(value);
}

export function nextCertificationCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^CRT-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `CRT-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateHrCertification(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canPatchCertificationStatus(
  from: CertificationStatus,
  to: CertificationStatus,
): { allowed: true } | { allowed: false; reason: "revoked" } {
  if (from === "revoked") return { allowed: false, reason: "revoked" };
  if (to === "held" || to === "revoked") return { allowed: true };
  return { allowed: true };
}

export function validateCertificationDates(
  issuedOn?: string,
  expiresOn?: string,
): { ok: true } | { ok: false; reason: "invalid_dates" } {
  if (issuedOn && !isIsoDate(issuedOn)) return { ok: false, reason: "invalid_dates" };
  if (expiresOn && !isIsoDate(expiresOn)) return { ok: false, reason: "invalid_dates" };
  if (issuedOn && expiresOn && issuedOn > expiresOn) return { ok: false, reason: "invalid_dates" };
  return { ok: true };
}

export type HrCertification = {
  id: string;
  tenantId: string;
  certificationCode: string;
  name: string;
  status: CertificationStatus;
  issuerLabel?: string;
  issuedOn?: string;
  expiresOn?: string;
  notes?: string;
  employeeId: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
