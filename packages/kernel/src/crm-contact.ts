import type { CrmContactStatus } from "./crm.js";

export const CRM_CONTACT_STATUSES = ["Active", "Inactive", "Archived"] as const satisfies readonly CrmContactStatus[];

export function normalizePersonName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Lightweight format check — not country-specific phone validation. */
export function isPlausibleEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isPlausiblePhone(phone: string): boolean {
  const trimmed = phone.trim();
  if (trimmed.length < 3 || trimmed.length > 32) return false;
  return /^[\d+\-().\s]+$/.test(trimmed);
}

export function isValidContactStatus(status: string): status is CrmContactStatus {
  return (CRM_CONTACT_STATUSES as readonly string[]).includes(status);
}

export const CRM_CONTACT_TRANSITIONS: Record<
  Exclude<CrmContactStatus, "Archived">,
  readonly Exclude<CrmContactStatus, "Archived">[]
> = {
  Active: ["Inactive"],
  Inactive: ["Active"],
};

export function canTransitionContact(from: CrmContactStatus, to: CrmContactStatus): boolean {
  if (from === "Archived" || to === "Archived") return false;
  return (CRM_CONTACT_TRANSITIONS[from] as readonly string[]).includes(to);
}

export function canArchiveContact(status: CrmContactStatus): boolean {
  return status === "Active" || status === "Inactive";
}
