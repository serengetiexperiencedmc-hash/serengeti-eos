import { eosFetch } from "./eos-client";
import { formatCost } from "./costing-api";

export type BookingSummary = {
  id: string;
  bookingCode: string;
  proposalId: string;
  rfpId: string;
  organizationId: string;
  title: string;
  status: string;
  paxCount?: number;
  travelDates?: string;
  destinations?: string;
  currency: string;
  sellPrice: number;
  confirmedAt: string;
  handoverCompletedAt?: string;
};

export type HandoverTask = {
  id: string;
  bookingId: string;
  taskKey: string;
  label: string;
  status: "pending" | "complete";
  sortOrder: number;
  completedAt?: string;
};

export type BookingDetail = {
  booking: BookingSummary;
  handoverTasks: HandoverTask[];
};

export type BookingCommandCenterTimelineEntry = {
  key: string;
  label: string;
  at?: string;
  status: "complete" | "pending";
};

export type BookingCommandCenterSnapshot = {
  bookingId: string;
  bookingCode: string;
  title: string;
  status: string;
  handover: {
    progressPercent: number;
    completedCount: number;
    totalCount: number;
  };
  ops: {
    supplierConfirmationsTotal: number;
    supplierConfirmationsPending: number;
    supplierConfirmationsConfirmed: number;
    manifestStatus?: string;
    manifestGuestCount: number;
    manifestPublishedAt?: string;
    vouchersDraft: number;
    vouchersIssued: number;
    fieldTasksOpen: number;
    fieldTasksComplete: number;
    briefIssued: boolean;
    syncConflicts: number;
  };
  finance: {
    contractValue: number;
    currency: string;
    invoicedTotal: number;
    paidTotal: number;
    outstandingTotal: number;
    quotesCount: number;
    invoicesCount: number;
    reconciliationExceptions: number;
  };
  timeline: BookingCommandCenterTimelineEntry[];
};

export type BookingCommandCenter = BookingDetail & {
  snapshot: BookingCommandCenterSnapshot;
  invoices: Array<{
    id: string;
    invoiceCode: string;
    invoiceType: string;
    status: string;
    amount: number;
    amountPaid: number;
    currency: string;
  }>;
  quotes: Array<{
    id: string;
    quoteCode: string;
    status: string;
    amount: number;
    currency: string;
  }>;
};

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmed",
  handover_pending: "Handover In Progress",
  handed_over: "Handed Over",
  cancelled: "Cancelled",
};

export function bookingStatusBadge(status: string): "draft" | "progress" | "review" | "won" {
  if (status === "handed_over") return "won";
  if (status === "handover_pending") return "progress";
  if (status === "confirmed") return "review";
  return "draft";
}

export function formatBookingValue(booking: BookingSummary): string {
  return formatCost(booking.sellPrice, booking.currency);
}

export async function listBookings(token: string, query?: { status?: string }) {
  const params = new URLSearchParams();
  if (query?.status) params.set("status", query.status);
  const qs = params.toString();
  return eosFetch<{ items: BookingSummary[] }>(`/v1/bookings${qs ? `?${qs}` : ""}`, { token });
}

export async function getBooking(token: string, id: string) {
  return eosFetch<BookingDetail>(`/v1/bookings/${id}`, { token });
}

export async function getBookingCommandCenter(token: string, id: string) {
  return eosFetch<BookingCommandCenter>(`/v1/bookings/${id}/command-center`, { token });
}

export async function getBookingByProposal(token: string, proposalId: string) {
  return eosFetch<BookingDetail>(`/v1/bookings/by-proposal/${proposalId}`, { token });
}

export async function createBooking(token: string, proposalId: string) {
  return eosFetch<BookingDetail>("/v1/bookings", {
    token,
    method: "POST",
    body: JSON.stringify({ proposalId }),
  });
}

export async function completeHandoverTask(token: string, bookingId: string, taskId: string) {
  return eosFetch<BookingDetail>(`/v1/bookings/${bookingId}/handover-tasks/${taskId}/complete`, {
    token,
    method: "POST",
    body: JSON.stringify({}),
  });
}
