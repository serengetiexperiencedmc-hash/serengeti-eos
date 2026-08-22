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
const TOKEN_STORAGE_KEY = "sedmc.eos.accessToken";

export type SessionExpiredDetail = { token?: string };

/** Fired when an authenticated API call returns 401 so the session provider can clear local state. */
export function onSessionExpired(handler: (detail: SessionExpiredDetail) => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const listener = (event: Event) => {
    const detail = (event as CustomEvent<SessionExpiredDetail>).detail ?? {};
    handler(detail);
  };
  window.addEventListener(SESSION_EXPIRED_EVENT, listener);
  return () => window.removeEventListener(SESSION_EXPIRED_EVENT, listener);
}

function notifySessionExpired(token?: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<SessionExpiredDetail>(SESSION_EXPIRED_EVENT, { detail: { token } }));
}

export async function eosFetch<T>(
  path: string,
  options: RequestInit & { token?: string; suppressSessionExpired?: boolean } = {},
): Promise<T> {
  const { token, suppressSessionExpired, headers: initHeaders, ...rest } = options;
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
      const apiError = typeof body?.error === "string" ? body.error : undefined;
      message =
        apiError && apiError !== "unauthenticated"
          ? apiError
          : "Session expired — sign in again";
      // Never treat login 401 as a session wipe; and ignore stale tokens after a newer login.
      if (token && !suppressSessionExpired) {
        const stored =
          typeof window !== "undefined" ? window.sessionStorage.getItem(TOKEN_STORAGE_KEY) : null;
        if (!stored || stored === token) {
          notifySessionExpired(token);
        }
      }
    } else if (typeof body?.error === "string") {
      message = body.error;
    }
    throw new EosApiError(message, res.status, body);
  }

  return body as T;
}
