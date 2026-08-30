import { eosFetch } from "./eos-client";

export type CommercialDocumentSummary = {
  id: string;
  kind: string;
  status: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  checksumSha256: string;
  version: number;
  rfpId?: string;
  supplierId?: string;
  contractId?: string;
  createdAt: string;
};

export async function listRfpDocuments(token: string, rfpId: string) {
  return eosFetch<{ items: CommercialDocumentSummary[] }>(`/v1/rfps/${rfpId}/documents`, { token });
}

export async function uploadRfpDocument(
  token: string,
  rfpId: string,
  input: { filename: string; mimeType: string; contentBase64: string },
) {
  return eosFetch<{ document: CommercialDocumentSummary }>(`/v1/rfps/${rfpId}/documents`, {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function patchRfp(
  token: string,
  rfpId: string,
  input: Record<string, unknown>,
) {
  return eosFetch<{ rfp: unknown }>(`/v1/rfps/${rfpId}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
