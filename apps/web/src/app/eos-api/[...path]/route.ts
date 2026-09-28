import type { NextRequest } from "next/server";
import { buildUpstreamUrl, filterProxyRequestHeaders, filterProxyResponseHeaders } from "@/lib/eos-proxy";

const API_ORIGIN = process.env.EOS_API_URL ?? "http://127.0.0.1:8080";

async function proxyRequest(req: NextRequest, pathSegments: string[]) {
  const url = buildUpstreamUrl(API_ORIGIN, pathSegments, req.nextUrl.searchParams);
  const headers = filterProxyRequestHeaders(req.headers);

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: "manual",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.arrayBuffer();
    // Node/undici requires duplex when a request body is present.
    (init as RequestInit & { duplex: "half" }).duplex = "half";
  }

  let upstream: Response;
  try {
    upstream = await fetch(url, init);
  } catch (err) {
    const cause = err instanceof Error && "cause" in err ? (err as Error & { cause?: { code?: string; message?: string } }).cause : undefined;
    const detail = [cause?.code, cause?.message, err instanceof Error ? err.message : undefined].filter(Boolean).join(" ");
    return Response.json(
      {
        error: "upstream_unavailable",
        reason: `EOS API not reachable at ${API_ORIGIN} — start apps/api (npm run dev:preview)`,
        detail: detail || undefined,
      },
      { status: 502 },
    );
  }

  // Buffer the body so clients always receive JSON error payloads (avoids empty 401 bodies).
  const body = await upstream.arrayBuffer();
  return new Response(body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: filterProxyResponseHeaders(upstream.headers),
  });
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(req, path);
}

export async function POST(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(req, path);
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(req, path);
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(req, path);
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(req, path);
}
