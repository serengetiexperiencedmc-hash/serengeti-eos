import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rewriteTrailingSlashPathname } from "./lib/trailing-slash";

export function proxy(request: NextRequest) {
  const rawPath = new URL(request.url).pathname;
  if (rawPath === "/eos-api" || rawPath.startsWith("/eos-api/")) {
    return NextResponse.next();
  }
  const stripped = rewriteTrailingSlashPathname(rawPath);
  if (!stripped) return NextResponse.next();

  const dest = new URL(request.url);
  dest.pathname = stripped;
  if (dest.href === request.url) return NextResponse.next();
  return NextResponse.rewrite(dest);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|eos-api|.*\\..*).*)"],
};
