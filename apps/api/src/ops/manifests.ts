import { authorize, type Principal } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { denyOpsAudit } from "./audit.js";
import { ensureOpsCollections } from "./collections.js";
import { personDomainRemoved } from "../personal-data-phase1.js";

export function getManifestByBooking(store: Store, principal: Principal, bookingId: string) {
  ensureOpsCollections(store);
  void bookingId;
  const decision = authorize({ principal, permission: "ops:read:operations", action: "read:ops_manifest" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return personDomainRemoved();
}

export function createOrGetManifest(store: Store, principal: Principal, bookingId: string, correlationId: string) {
  ensureOpsCollections(store);
  void bookingId;
  const decision = authorize({ principal, permission: "ops:write:manifest", action: "create:ops_manifest" });
  if (decision.result === "deny") {
    denyOpsAudit(store, principal, "ops:write:manifest", "ops_manifest", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  return personDomainRemoved();
}

export function addManifestEntry(
  store: Store,
  principal: Principal,
  manifestId: string,
  input: Record<string, unknown>,
  correlationId: string,
) {
  ensureOpsCollections(store);
  void manifestId;
  void input;
  const decision = authorize({ principal, permission: "ops:write:manifest", action: "write:ops_manifest_entry" });
  if (decision.result === "deny") {
    denyOpsAudit(store, principal, "ops:write:manifest", "ops_manifest_entry", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  return personDomainRemoved();
}

export function publishManifest(store: Store, principal: Principal, manifestId: string, correlationId: string) {
  ensureOpsCollections(store);
  void manifestId;
  const decision = authorize({ principal, permission: "ops:publish:manifest", action: "publish:ops_manifest" });
  if (decision.result === "deny") {
    denyOpsAudit(store, principal, "ops:publish:manifest", "ops_manifest", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  return personDomainRemoved();
}
