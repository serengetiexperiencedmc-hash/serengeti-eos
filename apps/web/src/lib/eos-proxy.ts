// `expect` is dropped as well: undici rejects it outright, which would surface as a bogus 502.
const HOP_BY_HOP = new Set([
  "host",
  "connection",
  "content-length",
  "transfer-encoding",
  "keep-alive",
  "upgrade",
  "proxy-connection",
  "expect",
]);

export function buildUpstreamUrl(apiOrigin: string, pathSegments: string[], searchParams: URLSearchParams): string {
  const path = pathSegments.join("/");
  const url = new URL(`${apiOrigin.replace(/\/$/, "")}/${path}`);
  searchParams.forEach((value, key) => url.searchParams.set(key, value));
  return url.toString();
}

export function filterProxyRequestHeaders(source: Headers): Headers {
  const headers = new Headers();
  source.forEach((value, key) => {
    if (HOP_BY_HOP.has(key.toLowerCase())) return;
    headers.set(key, value);
  });
  return headers;
}

export function filterProxyResponseHeaders(source: Headers): Headers {
  const headers = new Headers();
  source.forEach((value, key) => {
    if (key.toLowerCase() === "transfer-encoding") return;
    headers.set(key, value);
  });
  return headers;
}
