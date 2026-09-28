import { describe, expect, it, vi } from "vitest";
import { createLogger } from "../src/observability.js";

describe("E1-D Class A structured logging honesty", () => {
  it("emits productionReady false and redacts token/password fields", () => {
    const lines: string[] = [];
    const spy = vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      lines.push(String(args[0] ?? ""));
    });
    const logger = createLogger("info");
    logger.info("probe", {
      token: "super-secret-token",
      password: "super-secret-password",
      accessToken: "jwt-should-redact",
      EOS_TOKEN_SECRET: "must-redact",
      principalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    });
    spy.mockRestore();
    expect(lines.length).toBe(1);
    const parsed = JSON.parse(lines[0]!) as Record<string, unknown>;
    expect(parsed.productionReady).toBe(false);
    expect(parsed.msg).toBe("probe");
    expect(parsed.token).toBe("[REDACTED]");
    expect(parsed.password).toBe("[REDACTED]");
    expect(parsed.accessToken).toBe("[REDACTED]");
    expect(parsed.EOS_TOKEN_SECRET).toBe("[REDACTED]");
    expect(parsed.principalId).toBe("eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee");
    expect(JSON.stringify(parsed)).not.toContain("super-secret");
  });
});
