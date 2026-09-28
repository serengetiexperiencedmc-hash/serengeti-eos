import { authorize, isValidCertificationStatus, type CertificationStatus, type Principal } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureHrCertificationCollections } from "./collections.js";
import { personDomainRemoved } from "../personal-data-phase1.js";

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

export type HrCertificationView = {
  id: string;
  certificationCode: string;
  name: string;
  status: CertificationStatus;
  issuerLabel?: string;
  issuedOn?: string;
  expiresOn?: string;
  notes?: string;
  employeeId: string;
  employeeCode?: string;
};

export function getHrCertificationsHealth(store: Store, principal: Principal) {
  ensureHrCertificationCollections(store);
  const decision = authorize({
    principal,
    permission: "hr:read:certification",
    action: "read:hr_certifications_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  return {
    module: "hr-certifications" as const,
    increment: "H1" as const,
    status: "ok" as const,
    certifications: 0,
    heldCertifications: 0,
  };
}

export function listHrCertifications(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string; employeeId?: string },
) {
  ensureHrCertificationCollections(store);
  void query;
  const auth = authorize({
    principal,
    permission: "hr:read:certification",
    action: "list:hr_certification",
  });
  if (auth.result === "deny") return deny(auth.reason);
  if (query?.status && !isValidCertificationStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  return personDomainRemoved();
}

export function getHrCertification(store: Store, principal: Principal, id: string) {
  ensureHrCertificationCollections(store);
  void id;
  const auth = authorize({
    principal,
    permission: "hr:read:certification",
    action: "get:hr_certification",
  });
  if (auth.result === "deny") return deny(auth.reason);
  return personDomainRemoved();
}

export function createHrCertification(
  store: Store,
  principal: Principal,
  input: {
    name?: string;
    employeeId?: string;
    issuerLabel?: string;
    issuedOn?: string;
    expiresOn?: string;
    notes?: string;
    status?: string;
  },
) {
  ensureHrCertificationCollections(store);
  void input;
  const auth = authorize({
    principal,
    permission: "hr:write:certification",
    action: "create:hr_certification",
  });
  if (auth.result === "deny") return deny(auth.reason);
  return personDomainRemoved();
}

export function patchHrCertification(
  store: Store,
  principal: Principal,
  id: string,
  input: {
    name?: string;
    employeeId?: string;
    issuerLabel?: string;
    issuedOn?: string;
    expiresOn?: string;
    notes?: string;
    status?: string;
  },
) {
  ensureHrCertificationCollections(store);
  void id;
  void input;
  const auth = authorize({
    principal,
    permission: "hr:write:certification",
    action: "patch:hr_certification",
  });
  if (auth.result === "deny") return deny(auth.reason);
  return personDomainRemoved();
}
