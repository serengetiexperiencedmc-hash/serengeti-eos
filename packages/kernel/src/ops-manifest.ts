import type { Classification } from "./types.js";

export type OpsManifestStatus = "draft" | "published";

export const OPS_MANIFEST_STATUSES = ["draft", "published"] as const satisfies readonly OpsManifestStatus[];

export function canPublishManifest(status: OpsManifestStatus, entryCount: number): { allowed: boolean; reason?: string } {
  if (status === "published") return { allowed: false, reason: "already_published" };
  if (entryCount < 1) return { allowed: false, reason: "manifest_empty" };
  return { allowed: true };
}

export type OpsManifest = {
  id: string;
  tenantId: string;
  bookingId: string;
  programmeId: string;
  status: OpsManifestStatus;
  version: number;
  publishedAt?: string;
  publishedByPrincipalId?: string;
  classification: Classification;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type OpsManifestEntry = {
  id: string;
  tenantId: string;
  manifestId: string;
  guestName: string;
  email?: string;
  rooming?: string;
  dietary?: string;
  mobility?: string;
  flightReference?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};
