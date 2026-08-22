export const FIELD_CACHE_ENCRYPTION_ALG = "aes-gcm-v1" as const;
export const FIELD_CACHE_POLICY_VERSION = 2;

export function fieldCacheKeyMaterial(deviceId: string, principalId: string, salt: string): string {
  return `${deviceId}:${principalId}:${salt}`;
}

function bytesToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(encoded: string): Uint8Array {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(encoded, "base64"));
  }
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function deriveFieldCacheKey(
  deviceId: string,
  principalId: string,
  salt: string,
): Promise<CryptoKey> {
  const material = new TextEncoder().encode(fieldCacheKeyMaterial(deviceId, principalId, salt));
  const hash = await crypto.subtle.digest("SHA-256", material);
  return crypto.subtle.importKey("raw", hash, { name: "AES-GCM", length: 256 }, false, [
    "encrypt",
    "decrypt",
  ]);
}

export async function encryptFieldCachePayload(
  plaintext: string,
  deviceId: string,
  principalId: string,
  salt: string,
): Promise<string> {
  const key = await deriveFieldCacheKey(deviceId, principalId, salt);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plaintext));
  return `${FIELD_CACHE_ENCRYPTION_ALG}:${bytesToBase64(iv)}:${bytesToBase64(new Uint8Array(ciphertext))}`;
}

export async function decryptFieldCachePayload(
  blob: string,
  deviceId: string,
  principalId: string,
  salt: string,
): Promise<string | null> {
  const parts = blob.split(":");
  if (parts.length !== 3 || parts[0] !== FIELD_CACHE_ENCRYPTION_ALG) return null;
  const iv = base64ToBytes(parts[1]!);
  const ciphertext = base64ToBytes(parts[2]!);
  const ivBytes = new Uint8Array(iv);
  const cipherBytes = new Uint8Array(ciphertext);
  try {
    const key = await deriveFieldCacheKey(deviceId, principalId, salt);
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: ivBytes }, key, cipherBytes);
    return new TextDecoder().decode(decrypted);
  } catch {
    return null;
  }
}

export function isEncryptedFieldCacheBlob(value: string): boolean {
  return value.startsWith(`${FIELD_CACHE_ENCRYPTION_ALG}:`);
}
