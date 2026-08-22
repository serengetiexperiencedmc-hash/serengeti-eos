import type { BookingStatus } from "./booking.js";

export type BookingCommandCenterTimelineEntry = {
  key: string;
  label: string;
  at?: string;
  status: "complete" | "pending";
};

export type BookingCommandCenterOpsSection = {
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

export type BookingCommandCenterFinanceSection = {
  contractValue: number;
  currency: string;
  invoicedTotal: number;
  paidTotal: number;
  outstandingTotal: number;
  quotesCount: number;
  invoicesCount: number;
  reconciliationExceptions: number;
};

export type BookingCommandCenterHandoverSection = {
  progressPercent: number;
  completedCount: number;
  totalCount: number;
};

export type BookingCommandCenterSnapshot = {
  bookingId: string;
  bookingCode: string;
  title: string;
  status: BookingStatus;
  handover: BookingCommandCenterHandoverSection;
  ops: BookingCommandCenterOpsSection;
  finance: BookingCommandCenterFinanceSection;
  timeline: BookingCommandCenterTimelineEntry[];
};

export function computeFinanceOutstanding(contractValue: number, paidTotal: number): number {
  return Math.round(Math.max(0, contractValue - paidTotal) * 100) / 100;
}
