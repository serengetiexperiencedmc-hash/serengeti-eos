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
  }

  let upstream: Response;
  try {
    upstream = await fetch(url, init);
  } catch {
    return Response.json(
      { error: "upstream_unavailable", reason: "EOS API not reachable — start apps/api on port 8080" },
      { status: 502 },
    );
  }

  return new Response(upstream.body, {
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
