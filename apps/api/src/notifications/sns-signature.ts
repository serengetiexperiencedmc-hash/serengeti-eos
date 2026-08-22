import { createVerify, X509Certificate } from "node:crypto";

const CERT_CACHE = new Map<string, { pem: string; expiresAt: number }>();
const CERT_CACHE_TTL_MS = 60 * 60 * 1000;

export type SnsVerifyDeps = {
  fetchCert?: (url: string) => Promise<string>;
  now?: () => number;
};

function snsVerifySkipped(): boolean {
  return process.env.EOS_SES_WEBHOOK_SKIP_SNS_VERIFY === "1";
}

function signingCertUrlAllowed(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    return /^sns\.[a-zA-Z0-9-]{3,}\.amazonaws\.com(\.cn)?$/.test(parsed.hostname);
  } catch {
    return false;
  }
}

export function buildSnsStringToSign(message: Record<string, unknown>): string {
  const type = message.Type as string;
  const fields: string[] = [];

  if (type === "Notification") {
    fields.push("Message", "MessageId");
    if (typeof message.Subject === "string") fields.push("Subject");
    fields.push("Timestamp", "TopicArn", "Type");
  } else if (type === "SubscriptionConfirmation") {
    fields.push("Message", "MessageId", "SubscribeURL", "Timestamp", "Token", "TopicArn", "Type");
  } else if (type === "UnsubscribeConfirmation") {
    fields.push("Message", "MessageId", "Timestamp", "Token", "TopicArn", "Type");
  } else {
    throw new Error("unsupported_sns_type");
  }

  return fields.map((key) => `${message[key] as string}\n`).join("");
}

async function defaultFetchCert(url: string): Promise<string> {
  const cached = CERT_CACHE.get(url);
  const now = Date.now();
  if (cached && cached.expiresAt > now) return cached.pem;

  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error("cert_fetch_failed");
  const pem = await res.text();
  new X509Certificate(pem);
  CERT_CACHE.set(url, { pem, expiresAt: now + CERT_CACHE_TTL_MS });
  return pem;
}

export function verifySnsSignatureWithCert(
  message: Record<string, unknown>,
  certPem: string,
): boolean {
  const signature = message.Signature;
  const version = message.SignatureVersion;
  if (typeof signature !== "string" || typeof version !== "string") return false;

  const algorithm = version === "2" ? "RSA-SHA256" : version === "1" ? "RSA-SHA1" : null;
  if (!algorithm) return false;

  const stringToSign = buildSnsStringToSign(message);
  const verifier = createVerify(algorithm);
  verifier.update(stringToSign, "utf8");
  verifier.end();
  return verifier.verify(certPem, signature, "base64");
}

export async function verifySnsMessage(
  message: Record<string, unknown>,
  deps: SnsVerifyDeps = {},
): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (snsVerifySkipped()) return { ok: true };

  const hasSnsEnvelope =
    typeof message.Type === "string" &&
    typeof message.Signature === "string" &&
    typeof message.SigningCertURL === "string";

  if (!hasSnsEnvelope) {
    // Dev/direct payload mode (no SNS envelope).
    return { ok: true };
  }

  const certUrl = message.SigningCertURL as string;
  if (!signingCertUrlAllowed(certUrl)) return { ok: false, reason: "invalid_signing_cert_url" };

  try {
    const fetchCert = deps.fetchCert ?? defaultFetchCert;
    const certPem = await fetchCert(certUrl);
    if (!verifySnsSignatureWithCert(message, certPem)) {
      return { ok: false, reason: "invalid_sns_signature" };
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: "sns_verification_failed" };
  }
}

export function isSnsSignatureVerificationEnabled(): boolean {
  return !snsVerifySkipped();
}
