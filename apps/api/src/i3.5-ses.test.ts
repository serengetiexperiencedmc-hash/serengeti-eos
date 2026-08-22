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

describe("I3.5 SES email adapter", () => {
  it("selects ses-stub when region missing", () => {
    const prev = process.env.EOS_EMAIL_ADAPTER;
    process.env.EOS_EMAIL_ADAPTER = "ses";
    delete process.env.EOS_SES_REGION;
    expect(resolveEmailAdapterName()).toBe("ses-stub");
    if (prev === undefined) delete process.env.EOS_EMAIL_ADAPTER;
    else process.env.EOS_EMAIL_ADAPTER = prev;
  });

  it("reports ses config in health", async () => {
    const prevAdapter = process.env.EOS_EMAIL_ADAPTER;
    const prevRegion = process.env.EOS_SES_REGION;
    process.env.EOS_EMAIL_ADAPTER = "ses";
    process.env.EOS_SES_REGION = "eu-west-1";
    try {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const health = await app.inject({
        method: "GET",
        url: "/v1/notifications/email/health",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(health.json().sesConfigured).toBe(true);
      expect(health.json().increment).toBe("I3.10");
      expect(health.json().snsAutoConfirmSubscription).toBe(true);
      expect(health.json()).toHaveProperty("sesConfigurationSet");
      expect(health.json()).toHaveProperty("suppressionCount");
      expect(health.json().adapter).toBe("ses");
    } finally {
      if (prevAdapter === undefined) delete process.env.EOS_EMAIL_ADAPTER;
      else process.env.EOS_EMAIL_ADAPTER = prevAdapter;
      if (prevRegion === undefined) delete process.env.EOS_SES_REGION;
      else process.env.EOS_SES_REGION = prevRegion;
    }
  });
});
