import type { Classification } from "./types.js";

export type BookingStatus = "confirmed" | "handover_pending" | "handed_over" | "cancelled";

export type HandoverTaskStatus = "pending" | "complete";

export const BOOKING_STATUSES = [
  "confirmed",
  "handover_pending",
  "handed_over",
  "cancelled",
] as const satisfies readonly BookingStatus[];

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  confirmed: "Confirmed",
  handover_pending: "Handover In Progress",
  handed_over: "Handed Over",
  cancelled: "Cancelled",
};

export const DEFAULT_HANDOVER_TASKS = [
  { key: "ops_brief", label: "Operations brief issued to field team" },
  { key: "supplier_confirm", label: "Supplier confirmations requested" },
  { key: "guest_manifest", label: "Guest manifest prepared" },
  { key: "deposit_invoice", label: "Deposit invoice raised (reference only — no live banking)" },
  { key: "guest_vouchers", label: "Guest vouchers issued to suppliers" },
] as const;

export function buildBookingCode(proposalCode: string): string {
  return proposalCode.replace(/^PROP-/i, "BKG-");
}

export function canCreateBooking(proposalStatus: string): { allowed: boolean; reason?: string } {
  if (proposalStatus !== "accepted") {
    return { allowed: false, reason: "proposal_must_be_accepted" };
  }
  return { allowed: true };
}

export type BkgBooking = {
  id: string;
  tenantId: string;
  bookingCode: string;
  proposalId: string;
  rfpId: string;
  programmeId: string;
  opportunityId: string;
  organizationId: string;
  title: string;
  status: BookingStatus;
  paxCount?: number;
  travelDates?: string;
  destinations?: string;
  currency: string;
  sellPrice: number;
  confirmedAt: string;
  handoverCompletedAt?: string;
  assignedOperationsPrincipalId?: string;
  classification: Classification;
  version: number;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type BkgHandoverTask = {
  id: string;
  tenantId: string;
  bookingId: string;
  taskKey: string;
  label: string;
  status: HandoverTaskStatus;
  sortOrder: number;
  completedAt?: string;
  completedByPrincipalId?: string;
  createdAt: string;
  updatedAt: string;
};
