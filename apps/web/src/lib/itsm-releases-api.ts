import { eosFetch } from "./eos-client";

export type ItsmReleaseStatus = "open" | "done" | "cancelled";

export type ItsmRelease = {
  id: string;
  releaseCode: string;
  title: string;
  status: ItsmReleaseStatus;
  notes?: string;
  ciId?: string;
  ciCode?: string;
};

export const ITSM_RELEASE_STATUS_LABELS: Record<ItsmReleaseStatus, string> = {
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
};

export async function getItsmReleasesHealth(token: string) {
  return eosFetch<{ increment: string; releases: number; openReleases: number }>("/v1/itsm/releases/health", {
    token,
  });
}

export async function listItsmReleases(token: string) {
  return eosFetch<{ items: ItsmRelease[] }>("/v1/itsm/releases", { token });
}

export async function createItsmRelease(
  token: string,
  input: {
    title: string;
    ciId?: string;
    notes?: string;
  },
) {
  return eosFetch<{ release: ItsmRelease }>("/v1/itsm/releases", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function patchItsmRelease(
  token: string,
  id: string,
  input: {
    title?: string;
    notes?: string;
    status?: ItsmReleaseStatus;
  },
) {
  return eosFetch<{ release: ItsmRelease }>(`/v1/itsm/releases/${id}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
