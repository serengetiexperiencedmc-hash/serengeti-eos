import { describe, expect, it } from "vitest";
import {
  decryptFieldCachePayload,
  encryptFieldCachePayload,
  FIELD_CACHE_POLICY_VERSION,
  isEncryptedFieldCacheBlob,
} from "./field-cache-crypto.js";

describe("field cache crypto", () => {
  it("round-trips encrypted payload", async () => {
    const plaintext = JSON.stringify({ bookingId: "abc", tasks: [1, 2, 3] });
    const blob = await encryptFieldCachePayload(plaintext, "dev-test", "principal-1", "salt-xyz");
    expect(isEncryptedFieldCacheBlob(blob)).toBe(true);
    const decrypted = await decryptFieldCachePayload(blob, "dev-test", "principal-1", "salt-xyz");
    expect(decrypted).toBe(plaintext);
  });

  it("rejects wrong principal", async () => {
    const blob = await encryptFieldCachePayload("secret", "dev-test", "principal-1", "salt-xyz");
    const decrypted = await decryptFieldCachePayload(blob, "dev-test", "principal-2", "salt-xyz");
    expect(decrypted).toBeNull();
  });

  it("exports policy version 2", () => {
    expect(FIELD_CACHE_POLICY_VERSION).toBe(2);
  });
});
