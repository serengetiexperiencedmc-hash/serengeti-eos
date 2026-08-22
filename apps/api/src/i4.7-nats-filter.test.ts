import { describe, expect, it } from "vitest";
import {
  buildNatsEventSubject,
  buildNatsTenantFilterSubject,
  parseTenantIdFromNatsSubject,
  tenantDurableConsumerName,
} from "./events/nats-transport.js";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { getNatsConsumerLagMetrics } from "./events/nats-lag.js";
import { allPrincipals } from "./store.js";

const P = TEST_BOOTSTRAP_SECRETS;

describe("I4.7 per-tenant NATS filter subjects", () => {
  it("builds tenant-scoped publish and filter subjects", () => {
    const tenantId = "11111111-1111-4111-8111-111111111111";
    expect(buildNatsEventSubject("eos.events", tenantId, "crm.organization.created.v1")).toBe(
      `eos.events.${tenantId}.crm_organization_created_v1`,
    );
    expect(buildNatsTenantFilterSubject("eos.events", tenantId)).toBe(`eos.events.${tenantId}.>`);
    expect(parseTenantIdFromNatsSubject(`eos.events.${tenantId}.crm_organization_created_v1`, "eos.events")).toBe(
      tenantId,
    );
    expect(tenantDurableConsumerName(tenantId)).toBe("EOS_TENANT_1111111111114111");
  });

  it("exposes tenantFilter on lag metrics when NATS is offline", async () => {
    const prevUrl = process.env.EOS_NATS_URL;
    delete process.env.EOS_NATS_URL;
    try {
      const store = seedStore("i47-lag", TEST_BOOTSTRAP_SECRETS);
      const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
      const result = await getNatsConsumerLagMetrics(store, carol);
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.metrics.increment).toBe("I4.7");
      expect(result.metrics.tenantFilter?.subject).toBe(`eos.events.${carol.tenantId}.>`);
      expect(result.metrics.tenantFilter?.durableName).toBe(tenantDurableConsumerName(carol.tenantId));
      expect(result.metrics.summary.tenantBrokerLag).toBeNull();
    } finally {
      if (prevUrl === undefined) delete process.env.EOS_NATS_URL;
      else process.env.EOS_NATS_URL = prevUrl;
    }
  });

  it("exposes HTTP lag route with I4.7 increment", async () => {
    const prevUrl = process.env.EOS_NATS_URL;
    delete process.env.EOS_NATS_URL;
    try {
      const store = seedStore("i47-http", TEST_BOOTSTRAP_SECRETS);
      const app = buildServer({ store });
      const login = await app.inject({
        method: "POST",
        url: "/v1/auth/login",
        payload: {
          email: "carol.admin@sedmc.local",
          password: P.carolPassword,
          tenantSlug: "sedmc",
        },
      });
      const token = login.json().accessToken as string;
      const res = await app.inject({
        method: "GET",
        url: "/v1/events/consumers/nats/lag",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(res.statusCode).toBe(200);
      expect(res.json().increment).toBe("I4.7");
      expect(res.json().tenantFilter.subject).toContain(".>");
    } finally {
      if (prevUrl === undefined) delete process.env.EOS_NATS_URL;
      else process.env.EOS_NATS_URL = prevUrl;
    }
  });
});
