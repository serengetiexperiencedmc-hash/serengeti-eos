const API_BASE = process.env.NEXT_PUBLIC_EOS_API_BASE ?? "/eos-api";

export class EosApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = "EosApiError";
  }
}

export function getApiBase(): string {
  return API_BASE;
}

const SESSION_EXPIRED_EVENT = "sedmc:eos-session-expired";

/** Fired when an authenticated API call returns 401 so the session provider can clear local state. */
export function onSessionExpired(handler: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const listener = () => handler();
  window.addEventListener(SESSION_EXPIRED_EVENT, listener);
  return () => window.removeEventListener(SESSION_EXPIRED_EVENT, listener);
}

function notifySessionExpired(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}

export async function eosFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers: initHeaders, ...rest } = options;
  const headers = new Headers(initHeaders);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (rest.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${path}`, { ...rest, headers });
  const body = await res.json().catch(() => undefined);

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    if (typeof body?.reason === "string") {
      message = body.reason;
    } else if (res.status === 502 && body?.error === "upstream_unavailable") {
      message = "EOS API not reachable — run npm run dev:preview from the repo root";
    } else if (res.status === 401) {
      message =
        typeof body?.error === "string" && body.error !== "unauthenticated"
          ? body.error
          : "Session expired — sign in again";
      if (token) notifySessionExpired();
    } else if (typeof body?.error === "string") {
      message = body.error;
    }
    throw new EosApiError(message, res.status, body);
  }

  return body as T;
}
