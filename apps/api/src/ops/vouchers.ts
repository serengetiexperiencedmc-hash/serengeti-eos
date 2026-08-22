import {
  authorize,
  buildVoucherCode,
  canIssueVoucher,
  newId,
  type OpsVoucher,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureOpsCollections } from "./collections.js";
import { autoCompleteHandoverTaskByKey } from "./handover-sync.js";

function sanitizeVoucher(v: OpsVoucher) {
  return {
    id: v.id,
    bookingId: v.bookingId,
    manifestEntryId: v.manifestEntryId,
    voucherCode: v.voucherCode,
    voucherType: v.voucherType,
    guestName: v.guestName,
    supplierLabel: v.supplierLabel,
    status: v.status,
    issuedAt: v.issuedAt,
    notes: v.notes,
  };
}

function findBooking(store: Store, tenantId: string, bookingId: string) {
  return store.bkgBookings.find((b) => b.id === bookingId && b.tenantId === tenantId && !b.archivedAt);
}

export function listVouchers(store: Store, principal: Principal, query?: { bookingId?: string; status?: string }) {
  ensureOpsCollections(store);
  const decision = authorize({ principal, permission: "ops:read:operations", action: "read:ops_voucher" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = store.opsVouchers.filter((v) => v.tenantId === principal.tenantId);
  if (query?.bookingId) items = items.filter((v) => v.bookingId === query.bookingId);
  if (query?.status) items = items.filter((v) => v.status === query.status);
  return { items: items.map(sanitizeVoucher) };
}

export function generateVouchersFromManifest(
  store: Store,
  principal: Principal,
  bookingId: string,
  correlationId: string,
) {
  ensureOpsCollections(store);
  const decision = authorize({ principal, permission: "ops:write:operations", action: "generate:ops_voucher" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const booking = findBooking(store, principal.tenantId, bookingId);
  if (!booking) return { error: "not_found" as const, reason: "booking_not_found" };

  const manifest = store.opsManifests.find((m) => m.bookingId === bookingId && m.tenantId === principal.tenantId);
  if (!manifest) return { error: "not_found" as const, reason: "manifest_not_found" };
  if (manifest.status !== "published") return { error: "conflict" as const, reason: "manifest_not_published" };

  const entries = store.opsManifestEntries.filter((e) => e.manifestId === manifest.id);
  if (entries.length === 0) return { error: "conflict" as const, reason: "manifest_empty" };

  const existingEntryIds = new Set(
    store.opsVouchers.filter((v) => v.bookingId === bookingId && v.status !== "void").map((v) => v.manifestEntryId),
  );

  const now = new Date().toISOString();
  const created: OpsVoucher[] = [];
  let seq =
    store.opsVouchers.filter((v) => v.bookingId === bookingId).length + 1;

  for (const entry of entries) {
    if (existingEntryIds.has(entry.id)) continue;
    const voucher: OpsVoucher = {
      id: newId(),
      tenantId: principal.tenantId,
      bookingId,
      manifestEntryId: entry.id,
      voucherCode: buildVoucherCode(booking.bookingCode, seq),
      voucherType: "guest_activity",
      guestName: entry.guestName,
      supplierLabel: "Programme supplier",
      status: "draft",
      notes: entry.dietary ? `Dietary: ${entry.dietary}` : undefined,
      classification: booking.classification,
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: principal.id,
      updatedByPrincipalId: principal.id,
    };
    store.opsVouchers.push(voucher);
    created.push(voucher);
    seq += 1;
  }

  void correlationId;
  if (created.length === 0) {
    return { error: "conflict" as const, reason: "vouchers_already_generated" };
  }
  return { items: created.map(sanitizeVoucher) };
}

export function issueVoucher(store: Store, principal: Principal, voucherId: string, correlationId: string) {
  ensureOpsCollections(store);
  const voucher = store.opsVouchers.find((v) => v.id === voucherId && v.tenantId === principal.tenantId);
  if (!voucher) return { error: "not_found" as const };

  const decision = authorize({ principal, permission: "ops:write:operations", action: "issue:ops_voucher" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const gate = canIssueVoucher(voucher.status);
  if (!gate.allowed) return { error: "conflict" as const, reason: gate.reason };

  const now = new Date().toISOString();
  voucher.status = "issued";
  voucher.issuedAt = now;
  voucher.issuedByPrincipalId = principal.id;
  voucher.updatedAt = now;
  voucher.version += 1;

  const allIssued = store.opsVouchers
    .filter((v) => v.bookingId === voucher.bookingId && v.status !== "void")
    .every((v) => v.status === "issued");
  if (allIssued) {
    autoCompleteHandoverTaskByKey(store, principal.tenantId, voucher.bookingId, "guest_vouchers", principal.id);
  }

  void correlationId;
  return { voucher: sanitizeVoucher(voucher) };
}

export function issueAllVouchers(store: Store, principal: Principal, bookingId: string, correlationId: string) {
  ensureOpsCollections(store);
  const decision = authorize({ principal, permission: "ops:write:operations", action: "issue:ops_voucher" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const drafts = store.opsVouchers.filter(
    (v) => v.bookingId === bookingId && v.tenantId === principal.tenantId && v.status === "draft",
  );
  if (drafts.length === 0) return { error: "not_found" as const, reason: "no_draft_vouchers" };

  const issued = [];
  for (const voucher of drafts) {
    const result = issueVoucher(store, principal, voucher.id, correlationId);
    if (!("error" in result) && result.voucher) issued.push(result.voucher);
  }
  return { items: issued };
}
