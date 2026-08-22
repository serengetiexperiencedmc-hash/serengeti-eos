import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { allPrincipals } from "./store.js";
import { recordNatsConsumerOffset } from "./persistence/nats-offsets.js";
import { listNatsConsumerOffsets } from "./events/nats-replay.js";

const P = TEST_BOOTSTRAP_SECRETS;

describe("I4.4 NATS consumer offset persistence", () => {
  const carol = (store: ReturnType<typeof seedStore>) =>
    allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;

  it("records and lists offsets in memory", () => {
    const store = seedStore("i44-offset", TEST_BOOTSTRAP_SECRETS);
    recordNatsConsumerOffset(store, {
      tenantId: carol(store).tenantId,
      consumer: "platform-observer",
      stream: "EOS_EVENTS",
      streamSeq: 42,
      eventId: "evt-42",
    });
    recordNatsConsumerOffset(store, {
      tenantId: carol(store).tenantId,
      consumer: "platform-observer",
      stream: "EOS_EVENTS",
      streamSeq: 43,
      eventId: "evt-43",
    });

    const listed = listNatsConsumerOffsets(store, carol(store));
    expect(listed.ok).toBe(true);
    if (!listed.ok) return;
    expect(listed.items).toHaveLength(1);
    expect(listed.items[0]!.lastStreamSeq).toBe(43);
    expect(listed.items[0]!.lastEventId).toBe("evt-43");
  });

  it("exposes HTTP offset list route", async () => {
    const store = seedStore("i44-http", TEST_BOOTSTRAP_SECRETS);
    recordNatsConsumerOffset(store, {
      tenantId: carol(store).tenantId,
      consumer: "platform-observer",
      stream: "EOS_EVENTS",
      streamSeq: 10,
      eventId: "evt-10",
    });

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
      url: "/v1/events/consumers/nats/offsets",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().increment).toBe("I4.4");
    expect(res.json().items).toHaveLength(1);
  });

  it("returns 503 when NATS replay requested but not configured", async () => {
    const prevUrl = process.env.EOS_NATS_URL;
    delete process.env.EOS_NATS_URL;
    try {
      const store = seedStore("i44-replay", TEST_BOOTSTRAP_SECRETS);
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
        method: "POST",
        url: "/v1/events/consumers/nats/replay",
        headers: { authorization: `Bearer ${token}` },
        payload: { fromSeq: 1 },
      });
      expect(res.statusCode).toBe(503);
      expect(res.json().reason).toBe("nats_not_configured");
    } finally {
      if (prevUrl === undefined) delete process.env.EOS_NATS_URL;
      else process.env.EOS_NATS_URL = prevUrl;
    }
  });
});
