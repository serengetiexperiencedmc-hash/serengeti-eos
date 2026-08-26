export const IT_LICENSE_STATUSES = ["open", "done", "cancelled"] as const;
export type ItLicenseStatus = (typeof IT_LICENSE_STATUSES)[number];

export const IT_LICENSE_STATUS_LABELS: Record<ItLicenseStatus, string> = {
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
};

export function isValidItLicenseStatus(value: string): value is ItLicenseStatus {
  return (IT_LICENSE_STATUSES as readonly string[]).includes(value);
}

export function nextLicenseCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^LIC-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `LIC-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateItLicense(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canPatchItLicenseStatus(
  from: ItLicenseStatus,
  to: ItLicenseStatus,
): { allowed: true } | { allowed: false; reason: "done" | "cancelled" } {
  if (from === "done") return { allowed: false, reason: "done" };
  if (from === "cancelled") return { allowed: false, reason: "cancelled" };
  if (to === "open" || to === "done" || to === "cancelled") return { allowed: true };
  return { allowed: true };
}

export type ItLicense = {
  id: string;
  tenantId: string;
  licenseCode: string;
  title: string;
  status: ItLicenseStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
