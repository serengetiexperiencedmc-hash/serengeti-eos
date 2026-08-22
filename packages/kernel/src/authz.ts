import { abacAllows } from "./abac.js";
import { hasPermission } from "./rbac.js";
import type { AuthzDecision, AuthzRequest } from "./types.js";

export function authorize(req: AuthzRequest): AuthzDecision {
  if (req.principal.status !== "active") {
    return { result: "deny", reason: "principal_inactive" };
  }
  if (!hasPermission(req.principal, req.permission)) {
    return { result: "deny", reason: "rbac" };
  }
  const abac = abacAllows(req);
  if (!abac.allow) {
    return { result: "deny", reason: abac.reason };
  }
  return { result: "allow", reason: "ok" };
}
