import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { allPrincipals } from "./store.js";
import { recordNatsConsumerOffset } from "./persistence/nats-offsets.js";
import { getNatsConsumerLagMetrics } from "./events/nats-lag.js";

const P = TEST_BOOTSTRAP_SECRETS;

describe("I4.5 NATS consumer lag metrics", () => {
  const carol = (store: ReturnType<typeof seedStore>) =>
    allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;

  it("returns unavailable summary when NATS is not configured", async () => {
    const prevUrl = process.env.EOS_NATS_URL;
    delete process.env.EOS_NATS_URL;
    try {
      const store = seedStore("i45-lag", TEST_BOOTSTRAP_SECRETS);
      recordNatsConsumerOffset(store, {
        tenantId: carol(store).tenantId,
        consumer: "platform-observer",
        stream: "EOS_EVENTS",
        streamSeq: 5,
        eventId: "evt-5",
      });

      const result = await getNatsConsumerLagMetrics(store, carol(store));
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.metrics.increment).toBe("I4.5");
      expect(result.metrics.natsConfigured).toBe(false);
      expect(result.metrics.summary.status).toBe("unavailable");
      expect(result.metrics.offsets).toHaveLength(1);
      expect(result.metrics.offsets[0]!.stalenessMs).toBeGreaterThanOrEqual(0);
    } finally {
      if (prevUrl === undefined) delete process.env.EOS_NATS_URL;
      else process.env.EOS_NATS_URL = prevUrl;
    }
  });

  it("exposes HTTP lag route", async () => {
    const prevUrl = process.env.EOS_NATS_URL;
    delete process.env.EOS_NATS_URL;
    try {
      const store = seedStore("i45-http", TEST_BOOTSTRAP_SECRETS);
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
      expect(res.json().increment).toBe("I4.5");
      expect(res.json().summary.tenantsTracked).toBe(0);
    } finally {
      if (prevUrl === undefined) delete process.env.EOS_NATS_URL;
      else process.env.EOS_NATS_URL = prevUrl;
    }
  });
});
