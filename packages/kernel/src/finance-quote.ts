import type { Classification } from "./types.js";

export type FinQuoteStatus = "draft" | "sent" | "accepted" | "expired";

export const FIN_QUOTE_STATUSES = ["draft", "sent", "accepted", "expired"] as const satisfies readonly FinQuoteStatus[];

export function buildQuoteCode(bookingCode: string): string {
  return bookingCode.replace(/^BKG-/i, "QTE-");
}

export function isQuoteExpired(validUntil: string, asOf = new Date()): boolean {
  return new Date(validUntil).getTime() < asOf.getTime();
}

export function canAcceptQuote(status: FinQuoteStatus, validUntil: string): { allowed: boolean; reason?: string } {
  if (status !== "sent") return { allowed: false, reason: "not_sent" };
  if (isQuoteExpired(validUntil)) return { allowed: false, reason: "expired" };
  return { allowed: true };
}

export type FinQuote = {
  id: string;
  tenantId: string;
  quoteCode: string;
  bookingId: string;
  organizationId: string;
  status: FinQuoteStatus;
  currency: string;
  amount: number;
  validUntil: string;
  sentAt?: string;
  acceptedAt?: string;
  classification: Classification;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
