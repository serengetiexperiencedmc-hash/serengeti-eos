import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import { resolveEmailAdapterName } from "../src/notifications/email-config.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I3.3 SMTP email adapter", () => {
  it("selects smtp adapter when configured", () => {
    const prevAdapter = process.env.EOS_EMAIL_ADAPTER;
    const prevHost = process.env.EOS_SMTP_HOST;
    process.env.EOS_EMAIL_ADAPTER = "smtp";
    process.env.EOS_SMTP_HOST = "127.0.0.1";
    expect(resolveEmailAdapterName()).toBe("smtp");
    delete process.env.EOS_SMTP_HOST;
    expect(resolveEmailAdapterName()).toBe("smtp-stub");
    if (prevAdapter === undefined) delete process.env.EOS_EMAIL_ADAPTER;
    else process.env.EOS_EMAIL_ADAPTER = prevAdapter;
    if (prevHost === undefined) delete process.env.EOS_SMTP_HOST;
    else process.env.EOS_SMTP_HOST = prevHost;
  });

  it("reports smtp config in health", async () => {
    const prevHost = process.env.EOS_SMTP_HOST;
    process.env.EOS_SMTP_HOST = "mailhog.local";
    process.env.EOS_EMAIL_ADAPTER = "smtp";
    try {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const health = await app.inject({
        method: "GET",
        url: "/v1/notifications/email/health",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(health.json().smtpConfigured).toBe(true);
      expect(health.json().increment).toBe("I3.9");
    } finally {
      if (prevHost === undefined) delete process.env.EOS_SMTP_HOST;
      else process.env.EOS_SMTP_HOST = prevHost;
    }
  });
});
