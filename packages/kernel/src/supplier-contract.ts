import type { Classification } from "./types.js";

/** CD Phase 1 — versioned supplier/hotel contracts (metadata; documents via CommercialDocument). */

export const SUP_CONTRACT_TYPES = ["rate_agreement", "allotment", "service", "other"] as const;
export type SupContractType = (typeof SUP_CONTRACT_TYPES)[number];

export const SUP_CONTRACT_STATUSES = ["draft", "active", "expired", "superseded"] as const;
export type SupContractStatus = (typeof SUP_CONTRACT_STATUSES)[number];

export function isValidSupContractType(value: string): value is SupContractType {
  return (SUP_CONTRACT_TYPES as readonly string[]).includes(value);
}

export function isValidSupContractStatus(value: string): value is SupContractStatus {
  return (SUP_CONTRACT_STATUSES as readonly string[]).includes(value);
}

export function canMutateSupplierContract(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export type SupContract = {
  id: string;
  tenantId: string;
  supplierId: string;
  contractRef: string;
  contractType: SupContractType;
  status: SupContractStatus;
  effectiveFrom?: string;
  effectiveTo?: string;
  currency?: string;
  notes?: string;
  currentVersion: number;
  classification: Classification;
  version: number;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type SupContractVersion = {
  id: string;
  tenantId: string;
  contractId: string;
  versionNumber: number;
  summary: string;
  documentId?: string;
  createdAt: string;
  createdByPrincipalId: string;
};

export type SupHotelProfile = {
  id: string;
  tenantId: string;
  supplierId: string;
  propertyName?: string;
  starRating?: number;
  roomCategories: string[];
  mealPlans: string[];
  destinationLabel?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  status: "active" | "inactive";
  classification: Classification;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export const PROGRAMME_ITEM_TYPES = [
  "accommodation",
  "activity",
  "experience",
  "transport",
  "flight",
  "meal",
  "meeting_event",
  "other",
] as const;
export type ProgrammeItemType = (typeof PROGRAMME_ITEM_TYPES)[number];

export function isValidProgrammeItemType(value: string): value is ProgrammeItemType {
  return (PROGRAMME_ITEM_TYPES as readonly string[]).includes(value);
}

export const PROGRAMME_ITEM_VISIBILITIES = ["internal", "client", "both"] as const;
export type ProgrammeItemVisibility = (typeof PROGRAMME_ITEM_VISIBILITIES)[number];

export function isValidProgrammeItemVisibility(value: string): value is ProgrammeItemVisibility {
  return (PROGRAMME_ITEM_VISIBILITIES as readonly string[]).includes(value);
}
