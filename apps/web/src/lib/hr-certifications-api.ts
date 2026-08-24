import { eosFetch } from "./eos-client";

export type HrCertificationStatus = "held" | "revoked";

export type HrCertification = {
  id: string;
  certificationCode: string;
  name: string;
  status: HrCertificationStatus;
  issuerLabel?: string;
  issuedOn?: string;
  expiresOn?: string;
  notes?: string;
  employeeId: string;
  employeeCode?: string;
};

export const CERTIFICATION_STATUS_LABELS: Record<HrCertificationStatus, string> = {
  held: "Held",
  revoked: "Revoked",
};

export async function getHrCertificationsHealth(token: string) {
  return eosFetch<{ increment: string; certifications: number; heldCertifications: number }>(
    "/v1/hr/certifications/health",
    { token },
  );
}

export async function listHrCertifications(token: string) {
  return eosFetch<{ items: HrCertification[] }>("/v1/hr/certifications", { token });
}

export async function createHrCertification(
  token: string,
  input: {
    name: string;
    employeeId: string;
    issuerLabel?: string;
    issuedOn?: string;
    expiresOn?: string;
    notes?: string;
  },
) {
  return eosFetch<{ certification: HrCertification }>("/v1/hr/certifications", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function patchHrCertification(
  token: string,
  id: string,
  input: {
    name?: string;
    issuerLabel?: string;
    issuedOn?: string;
    expiresOn?: string;
    notes?: string;
    status?: HrCertificationStatus;
  },
) {
  return eosFetch<{ certification: HrCertification }>(`/v1/hr/certifications/${id}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
