import { eosFetch } from "./eos-client";

export type ItLicenseStatus = "open" | "done" | "cancelled";

export type ItLicense = {
  id: string;
  licenseCode: string;
  title: string;
  status: ItLicenseStatus;
  notes?: string;
};

export const IT_LICENSE_STATUS_LABELS: Record<ItLicenseStatus, string> = {
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
};

export async function getItLicensesHealth(token: string) {
  return eosFetch<{ increment: string; licenses: number; openLicenses: number }>("/v1/licenses/health", {
    token,
  });
}

export async function listItLicenses(token: string) {
  return eosFetch<{ items: ItLicense[] }>("/v1/licenses", { token });
}

export async function createItLicense(
  token: string,
  input: {
    title: string;
    notes?: string;
  },
) {
  return eosFetch<{ license: ItLicense }>("/v1/licenses", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function patchItLicense(
  token: string,
  id: string,
  input: {
    title?: string;
    notes?: string;
    status?: ItLicenseStatus;
  },
) {
  return eosFetch<{ license: ItLicense }>(`/v1/licenses/${id}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
