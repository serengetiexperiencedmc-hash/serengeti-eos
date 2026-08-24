import { describe, expect, it } from "vitest";
import {
  buildHealthDependencyMap,
  correlationToTraceId,
  mapCiProbeKey,
  percentileNearestRank,
  rollupHealth,
  trimRing,
} from "./observability.js";

describe("observability kernel", () => {
  it("maps CI names to Dev/Test probes", () => {
    expect(mapCiProbeKey({ ciClass: "application", name: "EOS API" })).toBe("api");
    expect(mapCiProbeKey({ ciClass: "application", name: "EOS Web" })).toBe("web");
    expect(mapCiProbeKey({ ciClass: "database", name: "EOS OLTP" })).toBe("oltp");
    expect(mapCiProbeKey({ ciClass: "integration", name: "Email" })).toBeUndefined();
  });

  it("rolls up dependency degradation without inventing a second graph", () => {
    expect(rollupHealth("ok", ["ok"])).toBe("ok");
    expect(rollupHealth("ok", ["unavailable"])).toBe("degraded");
    expect(rollupHealth("unavailable", ["ok"])).toBe("unavailable");
    expect(rollupHealth("unknown", ["degraded"])).toBe("degraded");
  });

  it("builds a Web → API → OLTP map from depends_on edges", () => {
    const map = buildHealthDependencyMap(
      [
        { id: "web", ciCode: "CI-0001", name: "EOS Web", ciClass: "application", lifecycle: "active" },
        { id: "api", ciCode: "CI-0002", name: "EOS API", ciClass: "application", lifecycle: "active" },
        { id: "db", ciCode: "CI-0003", name: "EOS OLTP", ciClass: "database", lifecycle: "active" },
      ],
      [
        { fromCiId: "web", toCiId: "api", relType: "depends_on" },
        { fromCiId: "api", toCiId: "db", relType: "depends_on" },
        { fromCiId: "web", toCiId: "api", relType: "connects_to" },
      ],
      { api: "ok", web: "unknown", oltp: "unavailable" },
    );
    expect(map.edges).toHaveLength(2);
    const byCode = Object.fromEntries(map.nodes.map((n) => [n.ciCode, n]));
    expect(byCode["CI-0003"].status).toBe("unavailable");
    expect(byCode["CI-0002"].status).toBe("degraded");
    expect(byCode["CI-0001"].status).toBe("degraded");
  });

  it("converts correlation UUIDs to 32-hex trace ids and trims rings", () => {
    expect(correlationToTraceId("11111111-1111-4111-8111-111111111111")).toBe("11111111111141118111111111111111");
    expect(percentileNearestRank([10, 20, 30, 40], 95)).toBe(40);
    expect(trimRing([1, 2, 3, 4], 2)).toEqual([3, 4]);
  });
});
