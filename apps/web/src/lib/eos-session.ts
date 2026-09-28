import { clearFieldCaches } from "./field-offline-cache";

const TOKEN_KEY = "sedmc.eos.accessToken";
const EMAIL_KEY = "sedmc.eos.email";
const PRINCIPAL_KEY = "sedmc.eos.principalId";

/** Documented Development preview login (never UAT/Production). */
export const DEV_PREVIEW_LOGIN = {
  email: "carol.admin@sedmc.local",
  password: "test-carol-not-for-prod",
  tenantSlug: "sedmc",
} as const;

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

export function getStoredPrincipalId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(PRINCIPAL_KEY);
}

export function storeSession(token: string, email: string, principalId?: string): void {
  clearFieldCaches();
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(EMAIL_KEY, email);
  if (principalId) sessionStorage.setItem(PRINCIPAL_KEY, principalId);
  else sessionStorage.removeItem(PRINCIPAL_KEY);
}

export function clearSession(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(EMAIL_KEY);
  sessionStorage.removeItem(PRINCIPAL_KEY);
  clearFieldCaches();
}

export async function login(
  email: string,
  password: string,
  tenantSlug = DEV_PREVIEW_LOGIN.tenantSlug,
): Promise<LoginResponse> {
  const { eosFetch } = await import("./eos-client");
  const result = await eosFetch<LoginResponse>("/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: email.trim(),
      password: password.trim(),
      tenantSlug: tenantSlug.trim() || DEV_PREVIEW_LOGIN.tenantSlug,
    }),
  });
  storeSession(result.accessToken, email.trim(), result.principal.id);
  return result;
}
