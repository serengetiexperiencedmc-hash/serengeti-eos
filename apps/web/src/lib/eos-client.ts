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
    throw new EosApiError(
      typeof body?.reason === "string" ? body.reason : `Request failed (${res.status})`,
      res.status,
      body,
    );
  }

  return body as T;
}
