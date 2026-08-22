import { describe, expect, it } from "vitest";
import {
  isAutoTenantDurablesEnabled,
  tenantDurableConsumerName,
  buildNatsTenantFilterSubject,
} from "./events/nats-transport.js";

describe("I4.8 auto-provision tenant durables", () => {
  it("is enabled by default", () => {
    const prev = process.env.EOS_NATS_AUTO_TENANT_DURABLES;
    delete process.env.EOS_NATS_AUTO_TENANT_DURABLES;
    expect(isAutoTenantDurablesEnabled()).toBe(true);
    process.env.EOS_NATS_AUTO_TENANT_DURABLES = "0";
    expect(isAutoTenantDurablesEnabled()).toBe(false);
    if (prev === undefined) delete process.env.EOS_NATS_AUTO_TENANT_DURABLES;
    else process.env.EOS_NATS_AUTO_TENANT_DURABLES = prev;
  });

  it("derives stable durable names for tenant filters", () => {
    const tenantId = "11111111-1111-4111-8111-111111111111";
    expect(tenantDurableConsumerName(tenantId)).toBe("EOS_TENANT_1111111111114111");
    expect(buildNatsTenantFilterSubject("eos.events", tenantId)).toBe(`eos.events.${tenantId}.>`);
  });
});
