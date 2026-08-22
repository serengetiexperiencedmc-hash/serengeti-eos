import type { Classification } from "./types.js";

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
  createdAt: string;
  updatedAt: string;
};

export function buildProgrammeCode(rfpCode: string): string {
  return rfpCode.replace(/^RFP-/i, "PRG-");
}
