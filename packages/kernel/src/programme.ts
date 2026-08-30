import type { Classification } from "./types.js";
import type { ProgrammeItemType, ProgrammeItemVisibility } from "./supplier-contract.js";

export type ProgrammeStatus = "draft" | "active" | "archived";

export type PrgProgramme = {
  id: string;
  tenantId: string;
  programmeCode: string;
  rfpId: string;
  opportunityId: string;
  organizationId: string;
  title: string;
  status: ProgrammeStatus;
  dayCount: number;
  startDate?: string;
  endDate?: string;
  paxCount?: number;
  destinations?: string;
  /** CD Phase 1 — internal operational notes. */
  internalNotes?: string;
  /** CD Phase 1 — client-facing notes. */
  clientNotes?: string;
  classification: Classification;
  version: number;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type PrgDay = {
  id: string;
  tenantId: string;
  programmeId: string;
  dayNumber: number;
  title: string;
  location?: string;
  calendarDate?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type PrgItem = {
  id: string;
  tenantId: string;
  programmeId: string;
  dayId: string;
  sortOrder: number;
  startTime?: string;
  title: string;
  description?: string;
  supplierId?: string;
  supplierRateId?: string;
  supplierLabel?: string;
  /** CD Phase 1 — typed itinerary component. */
  itemType?: ProgrammeItemType;
  quantity?: number;
  unit?: string;
  notes?: string;
  visibility?: ProgrammeItemVisibility;
  createdAt: string;
  updatedAt: string;
};

export type PrgProgrammeVersion = {
  id: string;
  tenantId: string;
  programmeId: string;
  versionNumber: number;
  summary: string;
  snapshot: {
    title: string;
    dayCount: number;
    itemCount: number;
    destinations?: string;
  };
  createdAt: string;
  createdByPrincipalId: string;
};

export function buildProgrammeCode(rfpCode: string): string {
  return rfpCode.replace(/^RFP-/i, "PRG-");
}
