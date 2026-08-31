import { describe, expect, it } from "vitest";
import {
  buildUpstreamUrl,
  filterProxyRequestHeaders,
  filterProxyResponseHeaders,
} from "../../web/src/lib/eos-proxy.ts";

describe("eos-api proxy helpers", () => {
  it("builds upstream URL with path and query", () => {
    const params = new URLSearchParams({ foo: "bar" });
    const url = buildUpstreamUrl("http://127.0.0.1:8080", ["v1", "auth", "login"], params);
    expect(url).toBe("http://127.0.0.1:8080/v1/auth/login?foo=bar");
  });

  it("strips hop-by-hop request headers including content-length", () => {
    const source = new Headers({
      host: "localhost:3001",
      connection: "keep-alive",
      "content-length": "42",
      expect: "100-continue",
      authorization: "Bearer x",
      "content-type": "application/json",
    });
    const filtered = filterProxyRequestHeaders(source);
    expect(filtered.has("host")).toBe(false);
    expect(filtered.has("content-length")).toBe(false);
    expect(filtered.has("expect")).toBe(false);
    expect(filtered.get("authorization")).toBe("Bearer x");
  });

  it("strips transfer-encoding from response headers", () => {
    const source = new Headers({ "content-type": "application/json", "transfer-encoding": "chunked" });
    const filtered = filterProxyResponseHeaders(source);
    expect(filtered.has("transfer-encoding")).toBe(false);
    expect(filtered.get("content-type")).toBe("application/json");
  });
});
