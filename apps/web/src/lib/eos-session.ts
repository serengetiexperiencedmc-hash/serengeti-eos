const TOKEN_KEY = "sedmc.eos.accessToken";
const EMAIL_KEY = "sedmc.eos.email";

export type LoginResponse = {
  accessToken: string;
  expiresIn: number;
  principal: { id: string; email: string; displayName: string };
};

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getStoredEmail(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(EMAIL_KEY);
}

export function storeSession(token: string, email: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(EMAIL_KEY, email);
}

export function clearSession(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(EMAIL_KEY);
}

export async function login(
  email: string,
  password: string,
  tenantSlug = "sedmc",
): Promise<LoginResponse> {
  const { eosFetch } = await import("./eos-client");
  const result = await eosFetch<LoginResponse>("/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, tenantSlug }),
  });
  storeSession(result.accessToken, email);
  return result;
}
