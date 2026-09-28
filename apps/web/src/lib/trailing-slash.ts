/**
 * Next App Router treats `/commercial/` as segments `["", "commercial", ""]`.
 * The empty child does not match `page.tsx`, so the layout hydrates a 404.
 * Strip the trailing slash so the real page is served without a 308 redirect
 * (Simple Browser / some preview clients do not follow that redirect).
 */
export function rewriteTrailingSlashPathname(pathname: string): string | null {
  if (pathname.length <= 1 || !pathname.endsWith("/")) return null;
  const stripped = pathname.replace(/\/+$/, "");
  return stripped.length > 0 ? stripped : "/";
}
