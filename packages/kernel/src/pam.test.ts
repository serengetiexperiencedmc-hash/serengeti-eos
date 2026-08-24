import { describe, expect, it } from "vitest";
import {
  isProtectedPamGrantKey,
  isValidJitTtl,
  isValidSecretRefString,
  jitGrantStatus,
  nextJitGrantCode,
  nextSecretRefCode,
} from "./pam.js";

describe("I14 PAM kernel", () => {
  it("accepts opaque ref:// pointers and sequential codes", () => {
    expect(isValidSecretRefString("ref://devtest/oltp/credentials")).toBe(true);
    expect(isValidSecretRefString("password")).toBe(false);
    expect(isValidSecretRefString("vault:secret")).toBe(false);
    expect(nextSecretRefCode(["SRF-0001"])).toBe("SRF-0002");
    expect(nextJitGrantCode([])).toBe("JIT-0001");
  });

  it("bounds TTL and blocks PAM-admin JIT targets", () => {
    expect(isValidJitTtl(60)).toBe(true);
    expect(isValidJitTtl(59)).toBe(false);
    expect(isValidJitTtl(28_801)).toBe(false);
    expect(isProtectedPamGrantKey("pam:write:grant")).toBe(true);
    expect(isProtectedPamGrantKey("itsm:read:ticket")).toBe(false);
    expect(jitGrantStatus({ expiresAt: "2099-01-01T00:00:00.000Z" })).toBe("active");
    expect(jitGrantStatus({ expiresAt: "2000-01-01T00:00:00.000Z" })).toBe("expired");
    expect(jitGrantStatus({ expiresAt: "2099-01-01T00:00:00.000Z", revokedAt: "2026-01-01T00:00:00.000Z" })).toBe(
      "revoked",
    );
  });
});
