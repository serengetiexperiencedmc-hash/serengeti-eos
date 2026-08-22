import { describe, expect, it } from "vitest";
import { isSmtpConfigured, parseSmtpConfigFromEnv } from "./notification-smtp.js";

describe("notification smtp config", () => {
  it("returns null when host missing", () => {
    expect(parseSmtpConfigFromEnv({})).toBeNull();
    expect(isSmtpConfigured({})).toBe(false);
  });

  it("parses smtp config from env", () => {
    const cfg = parseSmtpConfigFromEnv({
      EOS_SMTP_HOST: "mailhog",
      EOS_SMTP_PORT: "1025",
      EOS_SMTP_FROM: "eos@sedmc.local",
    });
    expect(cfg?.host).toBe("mailhog");
    expect(cfg?.port).toBe(1025);
    expect(cfg?.from).toBe("eos@sedmc.local");
    expect(isSmtpConfigured({ EOS_SMTP_HOST: "x" })).toBe(true);
  });
});
