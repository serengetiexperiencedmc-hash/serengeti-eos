import type { Principal } from "./types.js";

export function hasPermission(principal: Principal, permission: string): boolean {
  if (principal.status !== "active") return false;
  return principal.permissions.includes(permission);
}
