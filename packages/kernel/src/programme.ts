import type { Classification } from "./types.js";
import type { ProgrammeItemType, ProgrammeItemVisibility } from "./supplier-contract.js";

export type ProgrammeStatus = "draft" | "active" | "archived";

/** Commercial snapshot labels (H-203). Distinct from programme status and numeric version snapshots. */
export const PROGRAMME_COMMERCIAL_VERSION_LABELS = ["draft", "revised", "client", "final"] as const;
export type ProgrammeCommercialVersionLabel = (typeof PROGRAMME_COMMERCIAL_VERSION_LABELS)[number];

export const PROGRAMME_COMMERCIAL_VERSION_LABEL_LABELS: Record<ProgrammeCommercialVersionLabel, string> = {
  draft: "Draft",
  revised: "Revised",
  client: "Client Version",
  final: "Final",
};

export function isValidProgrammeCommercialVersionLabel(
  value: string,
): value is ProgrammeCommercialVersionLabel {
  return (PROGRAMME_COMMERCIAL_VERSION_LABELS as readonly string[]).includes(value);
}

export function programmeIsCommerciallyLocked(
  label: ProgrammeCommercialVersionLabel | undefined,
): boolean {
  return label === "final";
}

export function isIsoDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = Date.parse(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed);
}

export function programmeDateRangeValid(start?: string | null, end?: string | null): boolean {
  if (!start || !end) return true;
  return start <= end;
}

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
  /** H-203 commercial version label; numeric snapshots remain on PrgProgrammeVersion. */
  commercialVersionLabel?: ProgrammeCommercialVersionLabel;
  depositPercent?: number;
  paymentMilestones?: import("./h203-commercial-policy.js").ProgrammePaymentMilestone[];
  inclusionsText?: string;
  exclusionsText?: string;
  nightCountOverride?: number;
  nightCountOverrideReason?: string;
  commercialResponsibleRole?: import("./h203-commercial-policy.js").H203CommercialResponsibleRole;
  safariVehicleMaxPassengers?: number;
  driverGuideMaxGuests?: number;
  requiredVehiclesOverride?: number;
  requiredVehiclesOverrideReason?: string;
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
  description?: string;
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
    commercialVersionLabel?: string;
  };
  createdAt: string;
  createdByPrincipalId: string;
};

export function buildProgrammeCode(rfpCode: string): string {
  return rfpCode.replace(/^RFP-/i, "PRG-");
}
