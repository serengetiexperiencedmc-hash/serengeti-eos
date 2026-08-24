export const SECRET_REF_STATUSES = ["active", "retired"] as const;
export type SecretRefStatus = (typeof SECRET_REF_STATUSES)[number];

export const JIT_GRANT_STATUSES = ["active", "expired", "revoked"] as const;
export type JitGrantStatus = (typeof JIT_GRANT_STATUSES)[number];

export const PAM_PROTECTED_GRANT_KEYS = [
  "pam:write:ref",
  "pam:write:grant",
  "pam:revoke:grant",
] as const;

export const JIT_TTL_MIN_SECONDS = 60;
export const JIT_TTL_MAX_SECONDS = 28_800;

const SECRET_REF_PATTERN = /^ref:\/\/[A-Za-z0-9._:/-]{1,120}$/;

export function isValidSecretRefStatus(value: string): value is SecretRefStatus {
  return (SECRET_REF_STATUSES as readonly string[]).includes(value);
}

export function isValidSecretRefString(value: string): boolean {
  return SECRET_REF_PATTERN.test(value.trim());
}

export function isProtectedPamGrantKey(permissionKey: string): boolean {
  return (PAM_PROTECTED_GRANT_KEYS as readonly string[]).includes(permissionKey);
}

export function isValidJitTtl(seconds: number): boolean {
  return Number.isInteger(seconds) && seconds >= JIT_TTL_MIN_SECONDS && seconds <= JIT_TTL_MAX_SECONDS;
}

export function nextSecretRefCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^SRF-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `SRF-${String(max + 1).padStart(4, "0")}`;
}

export function nextJitGrantCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^JIT-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `JIT-${String(max + 1).padStart(4, "0")}`;
}

export function jitGrantStatus(grant: { expiresAt: string; revokedAt?: string }, now = Date.now()): JitGrantStatus {
  if (grant.revokedAt) return "revoked";
  if (new Date(grant.expiresAt).getTime() <= now) return "expired";
  return "active";
}

export type PamSecretRef = {
  id: string;
  tenantId: string;
  refCode: string;
  label: string;
  secretRef: string;
  status: SecretRefStatus;
  purpose?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type PamJitGrant = {
  id: string;
  tenantId: string;
  grantCode: string;
  subjectPrincipalId: string;
  permissionKey: string;
  expiresAt: string;
  reason?: string;
  revokedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
