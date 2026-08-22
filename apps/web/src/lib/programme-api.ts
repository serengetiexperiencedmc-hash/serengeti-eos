import { eosFetch } from "./eos-client";

export type ProgrammeItem = {
  id: string;
  dayId: string;
  sortOrder: number;
  startTime?: string;
  title: string;
  description?: string;
  supplierId?: string;
  supplierRateId?: string;
  supplierLabel?: string;
};

export type ProgrammeDay = {
  id: string;
  programmeId: string;
  dayNumber: number;
  title: string;
  location?: string;
  calendarDate?: string;
  sortOrder: number;
  items: ProgrammeItem[];
};

export type ProgrammeDetail = {
  programme: {
    id: string;
    programmeCode: string;
    rfpId: string;
    opportunityId: string;
    organizationId: string;
    title: string;
    status: string;
    dayCount: number;
    startDate?: string;
    endDate?: string;
    paxCount?: number;
    destinations?: string;
  };
  days: ProgrammeDay[];
};

export async function getProgrammeByRfp(token: string, rfpId: string) {
  return eosFetch<ProgrammeDetail>(`/v1/programmes/by-rfp/${rfpId}`, { token });
}

export async function getProgramme(token: string, id: string) {
  return eosFetch<ProgrammeDetail>(`/v1/programmes/${id}`, { token });
}

export async function fetchProgrammeHealth(token: string) {
  return eosFetch<{ programmes: number; days: number; items: number }>("/v1/programmes/health", { token });
}
