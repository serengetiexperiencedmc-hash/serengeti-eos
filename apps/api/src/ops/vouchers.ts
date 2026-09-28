import { authorize, type Principal } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureOpsCollections } from "./collections.js";
import { personDomainRemoved } from "../personal-data-phase1.js";

export function listVouchers(store: Store, principal: Principal, query?: { bookingId?: string; status?: string }) {
  ensureOpsCollections(store);
  void query;
  const decision = authorize({ principal, permission: "ops:read:operations", action: "read:ops_voucher" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return personDomainRemoved();
}

export function generateVouchersFromManifest(
  store: Store,
  principal: Principal,
  bookingId: string,
  correlationId: string,
) {
  ensureOpsCollections(store);
  void bookingId;
  void correlationId;
  const decision = authorize({ principal, permission: "ops:write:operations", action: "generate:ops_voucher" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return personDomainRemoved();
}

export function issueVoucher(store: Store, principal: Principal, voucherId: string, correlationId: string) {
  ensureOpsCollections(store);
  void voucherId;
  void correlationId;
  const decision = authorize({ principal, permission: "ops:write:operations", action: "issue:ops_voucher" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return personDomainRemoved();
}

export function issueAllVouchers(store: Store, principal: Principal, bookingId: string, correlationId: string) {
  ensureOpsCollections(store);
  void bookingId;
  void correlationId;
  const decision = authorize({ principal, permission: "ops:write:operations", action: "issue:ops_voucher" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return personDomainRemoved();
}
