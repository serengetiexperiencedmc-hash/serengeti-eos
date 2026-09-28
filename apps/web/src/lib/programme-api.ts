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
  itemType?: string;
  quantity?: number;
  unit?: string;
  notes?: string;
};

export type ProgrammeDay = {
  id: string;
  programmeId: string;
  dayNumber: number;
  title: string;
  location?: string;
  calendarDate?: string;
  description?: string;
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
    internalNotes?: string;
    clientNotes?: string;
    commercialVersionLabel?: string;
    depositPercent?: number;
    paymentMilestones?: Array<{ code: string; label: string; percent: number }>;
    inclusionsText?: string;
    exclusionsText?: string;
    nightCount?: number;
    nightCountDerived?: number;
    safariVehicleMaxPassengers?: number;
    driverGuideMaxGuests?: number;
    requiredVehicles?: number;
    commercialResponsibility?: {
      commercialRoles: string[];
      wonLostOwner: string;
      wonLostRecord: string;
    };
    createdByPrincipalId?: string;
  };
  days: ProgrammeDay[];
  rooming?: Array<{
    id: string;
    roomType: string;
    roomCount: number;
    occupancy?: number;
    complimentary?: boolean;
    supplementNotes?: string;
    notes?: string;
  }>;
};

export const PROGRAMME_ITEM_TYPE_OPTIONS = [
  ["accommodation", "Accommodation"],
  ["activity", "Activity"],
  ["experience", "Experience"],
  ["transport", "Transport"],
  ["flight", "Flight"],
  ["meal", "Meal"],
  ["meeting_event", "Meeting / Event"],
  ["excursion", "Excursion"],
  ["guide", "Guide / host"],
  ["equipment", "Equipment"],
  ["other", "Other service"],
] as const;

export const PROGRAMME_COMMERCIAL_VERSION_OPTIONS = [
  ["draft", "Draft"],
  ["revised", "Revised"],
  ["client", "Client Version"],
  ["final", "Final"],
] as const;

export async function getProgrammeByRfp(token: string, rfpId: string) {
  return eosFetch<ProgrammeDetail>(`/v1/programmes/by-rfp/${rfpId}`, { token });
}

export async function getProgramme(token: string, id: string) {
  return eosFetch<ProgrammeDetail>(`/v1/programmes/${id}`, { token });
}

export async function createProgramme(token: string, input: { rfpId: string; title?: string }) {
  return eosFetch<ProgrammeDetail>("/v1/programmes", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function addProgrammeDay(
  token: string,
  programmeId: string,
  input: { dayNumber: number; title: string; location?: string; calendarDate?: string; description?: string },
) {
  return eosFetch<{ day: { id: string; dayNumber: number; title: string; location?: string; calendarDate?: string; description?: string } }>(
    `/v1/programmes/${programmeId}/days`,
    { token, method: "POST", body: JSON.stringify(input) },
  );
}

export async function addProgrammeItem(
  token: string,
  programmeId: string,
  dayId: string,
  input: {
    title: string;
    startTime?: string;
    supplierId?: string;
    supplierLabel?: string;
    itemType?: string;
    quantity?: number;
    unit?: string;
    description?: string;
  },
) {
  return eosFetch<{ item: ProgrammeItem }>(
    `/v1/programmes/${programmeId}/days/${dayId}/items`,
    { token, method: "POST", body: JSON.stringify(input) },
  );
}

export async function patchProgramme(
  token: string,
  programmeId: string,
  input: {
    title?: string;
    startDate?: string | null;
    endDate?: string | null;
    paxCount?: number | null;
    destinations?: string | null;
    internalNotes?: string | null;
    clientNotes?: string | null;
    commercialVersionLabel?: string;
    depositPercent?: number;
    inclusionsText?: string | null;
    exclusionsText?: string | null;
    paymentMilestones?: Array<{ code: string; label: string; percent: number }>;
  },
) {
  return eosFetch<{ programme: ProgrammeDetail["programme"] }>(`/v1/programmes/${programmeId}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function addProgrammeRooming(
  token: string,
  programmeId: string,
  input: { roomType: string; roomCount: number; occupancy?: number; complimentary?: boolean; notes?: string },
) {
  return eosFetch<ProgrammeDetail>(`/v1/programmes/${programmeId}/rooming`, {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchProgrammeHealth(token: string) {
  return eosFetch<{ increment: string; programmes: number; days: number; items: number }>(
    "/v1/programmes/health",
    { token },
  );
}
