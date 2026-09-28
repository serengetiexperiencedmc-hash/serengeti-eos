import { describe, expect, it } from "vitest";
import { bootstrapSecretsFromEnv, TEST_BOOTSTRAP_SECRETS, seedStore } from "../src/app.js";
import {
  DEV_ONLY_TOKEN_SECRET_FALLBACK,
  resolveDevTestTokenSecret,
} from "../src/devtest-token-secret.js";

describe("E1-D Class A token fallback and bootstrap boundary", () => {
  it("uses the labelled Dev/Test fallback only when Production-like flags are absent", () => {
    expect(
      resolveDevTestTokenSecret(() => undefined, { EOS_ENV: "development", NODE_ENV: "test" }),
    ).toBe(DEV_ONLY_TOKEN_SECRET_FALLBACK);
    expect(
      resolveDevTestTokenSecret(() => "from-env-not-committed", { NODE_ENV: "test" }),
    ).toBe("from-env-not-committed");
  });

  it("refuses the Dev/Test token fallback when Production-like env flags are set", () => {
    expect(() =>
      resolveDevTestTokenSecret(() => undefined, { EOS_ENV: "production" }),
    ).toThrow(/EOS_TOKEN_SECRET is required/);
    expect(() =>
      resolveDevTestTokenSecret(() => undefined, { EOS_ENV: "uat" }),
    ).toThrow(/EOS_TOKEN_SECRET is required/);
    expect(() =>
      resolveDevTestTokenSecret(() => undefined, { NODE_ENV: "production" }),
    ).toThrow(/EOS_TOKEN_SECRET is required/);
  });

  it("keeps bootstrap users synthetic and Dev/Test-only", () => {
    expect(TEST_BOOTSTRAP_SECRETS.alicePassword).toContain("not-for-prod");
    expect(TEST_BOOTSTRAP_SECRETS.carolPassword).toContain("not-for-prod");
    const store = seedStore("e1d-bootstrap");
    const emails = [...store.principals.values()].map((p) => p.email).filter(Boolean) as string[];
    expect(emails.length).toBeGreaterThan(0);
    expect(emails.every((e) => e.endsWith(".local"))).toBe(true);
    expect(emails.some((e) => e.includes("@sedmc.local"))).toBe(true);
  });

  it("fails closed when bootstrap env refs are missing", () => {
    expect(() => bootstrapSecretsFromEnv(() => undefined)).toThrow(/Missing development bootstrap secret ref/);
  });
});
