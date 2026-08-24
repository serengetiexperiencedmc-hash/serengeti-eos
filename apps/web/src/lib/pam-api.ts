import { eosFetch } from "./eos-client";

export type PamSecretRef = {
  id: string;
  refCode: string;
  label: string;
  secretRef: string;
  status: "active" | "retired";
  purpose?: string;
};

export type PamJitGrant = {
  id: string;
  grantCode: string;
  subjectEmail: string;
  permissionKey: string;
  expiresAt: string;
  status: "active" | "expired" | "revoked";
  reason?: string;
};

export async function getPamHealth(token: string) {
  return eosFetch<{ increment: string; refs: number; activeRefs: number; activeGrants: number }>(
    "/v1/pam/health",
    { token },
  );
}

export async function listPamRefs(token: string) {
  return eosFetch<{ items: PamSecretRef[] }>("/v1/pam/refs", { token });
}

export async function createPamRef(token: string, input: { label: string; secretRef: string; purpose?: string }) {
  return eosFetch<{ ref: PamSecretRef }>("/v1/pam/refs", { token, method: "POST", body: JSON.stringify(input) });
}

export async function retirePamRef(token: string, id: string) {
  return eosFetch<{ ref: PamSecretRef }>(`/v1/pam/refs/${id}/retire`, { token, method: "POST", body: "{}" });
}

export async function listPamGrants(token: string) {
  return eosFetch<{ items: PamJitGrant[] }>("/v1/pam/grants", { token });
}

export async function createPamGrant(
  token: string,
  input: { subjectEmail: string; permissionKey: string; ttlSeconds: number; reason?: string },
) {
  return eosFetch<{ grant: PamJitGrant }>("/v1/pam/grants", { token, method: "POST", body: JSON.stringify(input) });
}

export async function revokePamGrant(token: string, id: string) {
  return eosFetch<{ grant: PamJitGrant }>(`/v1/pam/grants/${id}/revoke`, { token, method: "POST", body: "{}" });
}
