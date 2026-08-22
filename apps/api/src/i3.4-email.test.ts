import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";

describe("I3.4 email template editor", () => {
  it("upserts tenant template override via PUT", async () => {
    const store = seedStore("i3.4-test", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });

    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: {
        email: "carol.admin@sedmc.local",
        password: TEST_BOOTSTRAP_SECRETS.carolPassword,
        tenantSlug: "sedmc",
      },
    });
    const token = login.json().accessToken as string;

    const put = await app.inject({
      method: "PUT",
      url: "/v1/notifications/email/templates/notif.rfp.urgent",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        subject: "[Tenant] {{title}}",
        bodyText: "Custom: {{body}}\n{{href}}",
      },
    });
    expect(put.statusCode).toBe(200);
    expect(put.json().template.source).toBe("tenant");

    const list = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/templates",
      headers: { authorization: `Bearer ${token}` },
    });
    const item = list.json().items.find((t: { key: string }) => t.key === "notif.rfp.urgent");
    expect(item?.source).toBe("tenant");
    expect(item?.subject).toBe("[Tenant] {{title}}");

    const preview = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/templates/notif.rfp.urgent/preview",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(preview.statusCode).toBe(200);
    expect(preview.json().preview.subject).toContain("Sample");
  });
});
