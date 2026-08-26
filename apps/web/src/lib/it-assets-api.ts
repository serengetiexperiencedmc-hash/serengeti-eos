import { eosFetch } from "./eos-client";

export type ItAssetStatus = "open" | "done" | "cancelled";

export type ItAsset = {
  id: string;
  assetCode: string;
  title: string;
  status: ItAssetStatus;
  notes?: string;
};

export const IT_ASSET_STATUS_LABELS: Record<ItAssetStatus, string> = {
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
};

export async function getItAssetsHealth(token: string) {
  return eosFetch<{ increment: string; assets: number; openAssets: number }>("/v1/assets/health", {
    token,
  });
}

export async function listItAssets(token: string) {
  return eosFetch<{ items: ItAsset[] }>("/v1/assets", { token });
}

export async function createItAsset(
  token: string,
  input: {
    title: string;
    notes?: string;
  },
) {
  return eosFetch<{ asset: ItAsset }>("/v1/assets", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function patchItAsset(
  token: string,
  id: string,
  input: {
    title?: string;
    notes?: string;
    status?: ItAssetStatus;
  },
) {
  return eosFetch<{ asset: ItAsset }>(`/v1/assets/${id}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
