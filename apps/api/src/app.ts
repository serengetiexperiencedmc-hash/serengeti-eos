import {
  authorize,
  canDecide,
  newId,
  signToken,
  sodViolation,
  verifyAuditChain,
  verifyToken,
  type Principal,
} from "@sedmc/kernel";
import { createLocalPasswordIdentityProvider } from "./ports/identity.js";
import { createEnvSecretsProvider } from "./ports/secrets.js";
import {
  allPrincipals,
  principalById,
  recordAudit,
  seedStore,
  type Payment,
  type Store,
} from "./store.js";

export {
  seedStore,
  TEST_BOOTSTRAP_SECRETS,
  bootstrapSecretsFromEnv,
  type BootstrapSecrets,
  type Store,
  type Payment,
} from "./store.js";
export * from "./admin.js";
export * from "./workflow.js";
export * from "./outbox.js";
export * from "./crm/index.js";
export * from "./supplier/index.js";

export function recordAuditEvent(
  store: Store,
  record: Parameters<typeof recordAudit>[1],
) {
  return recordAudit(store, record);
}

export async function login(
  store: Store,
  input: { email: string; password: string; tenantSlug: string },
): Promise<{ token: string; principal: Principal } | { error: "invalid_credentials" }> {
  const secrets = createEnvSecretsProvider();
  void secrets.get("EOS_TOKEN_SECRET");

  const idp = createLocalPasswordIdentityProvider(
    (email, tenantSlug) => {
      const tenant = [...store.tenants.values()].find((t) => t.slug === tenantSlug);
      if (!tenant) return undefined;
      const match = allPrincipals(store).find(
        (p) =>
          p.tenantId === tenant.id &&
          p.email !== undefined &&
          p.email.toLowerCase() === email.toLowerCase(),
      );
      return match;
    },
    (tenantId) => store.tenants.get(tenantId)?.slug,
  );

  if (!idp.authenticatePassword) return { error: "invalid_credentials" };
  const auth = await idp.authenticatePassword(input);
  if ("error" in auth) return auth;

  const principal = principalById(store, auth.principalId);
  if (!principal) return { error: "invalid_credentials" };

  const now = Math.floor(Date.now() / 1000);
  const jti = newId();
  const expiresIn = 3600;
  const token = signToken(
    {
      sub: principal.id,
      tid: principal.tenantId,
      act: principal.actorType,
      jti,
      iat: now,
      exp: now + expiresIn,
    },
    store.tokenSecret,
  );
  store.sessions.push({
    id: newId(),
    tenantId: principal.tenantId,
    principalId: principal.id,
    tokenId: jti,
    issuedAt: new Date(now * 1000).toISOString(),
    expiresAt: new Date((now + expiresIn) * 1000).toISOString(),
  });
  return { token, principal };
}

export function principalFromAuthHeader(store: Store, header?: string): Principal | undefined {
  if (!header?.startsWith("Bearer ")) return undefined;
  const claims = verifyToken(header.slice(7), store.tokenSecret);
  if (!claims) return undefined;
  const session = store.sessions.find((s) => s.tokenId === claims.jti);
  if (!session || session.revokedAt) return undefined;
  if (new Date(session.expiresAt).getTime() < Date.now()) return undefined;
  return principalById(store, claims.sub);
}

export function listOrgUnits(store: Store, principal: Principal) {
  const decision = authorize({
    principal,
    permission: "org:read:unit",
    action: "read:org_unit",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return { items: store.orgUnits.filter((u) => u.tenantId === principal.tenantId) };
}

export function createPayment(
  store: Store,
  principal: Principal,
  input: { amount: number; currency: string; beneficiary: string },
  correlationId: string,
) {
  const resource = {
    tenantId: principal.tenantId,
    type: "payment",
    id: "new",
    classification: "Confidential" as const,
  };
  const decision = authorize({
    principal,
    permission: "finance:create:payment",
    action: "create:payment",
    resource,
  });
  if (decision.result === "deny") {
    recordAudit(store, {
      tenantId: principal.tenantId,
      occurredAt: new Date().toISOString(),
      actorType: principal.actorType,
      actorPrincipalId: principal.id,
      action: "finance:create:payment",
      resourceType: "payment",
      correlationId,
      authorization: "deny",
      evidence: { reason: decision.reason },
    });
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const id = newId();
  const payment: Payment = {
    id,
    tenantId: principal.tenantId,
    amount: input.amount,
    currency: input.currency,
    beneficiary: input.beneficiary,
    status: "pending_approval",
    createdBy: principal.id,
  };
  store.payments.set(id, payment);
  const approvalId = newId();
  store.approvals.set(approvalId, {
    id: approvalId,
    tenantId: principal.tenantId,
    actionClass: "payment.release",
    resourceType: "payment",
    resourceId: id,
    status: "pending",
    requestedByPrincipalId: principal.id,
  });
  store.actions.push({ principalId: principal.id, action: "finance:create:payment", objectId: id });
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "finance:create:payment",
    resourceType: "payment",
    resourceId: id,
    correlationId,
    authorization: "allow",
    newState: { status: payment.status, approvalId },
  });
  return { payment, approvalId };
}

export function getPayment(store: Store, principal: Principal, id: string) {
  const payment = store.payments.get(id);
  if (!payment) return { error: "not_found" as const };
  const decision = authorize({
    principal,
    permission: "finance:read:payment",
    action: "read:payment",
    resource: {
      tenantId: payment.tenantId,
      type: "payment",
      id: payment.id,
      classification: "Confidential",
      ownerPrincipalId: payment.createdBy,
    },
  });
  if (decision.result === "deny") return { error: "not_found" as const };
  return { payment };
}

export function decideApproval(
  store: Store,
  principal: Principal,
  approvalId: string,
  outcome: "approved" | "rejected",
  correlationId: string,
) {
  const task = store.approvals.get(approvalId);
  if (!task) return { error: "not_found" as const };
  if (task.tenantId !== principal.tenantId) return { error: "not_found" as const };
  const payment = store.payments.get(task.resourceId);
  if (!payment) return { error: "not_found" as const };

  const rbac = authorize({
    principal,
    permission: "finance:approve:payment",
    action: "approve:payment",
    resource: {
      tenantId: payment.tenantId,
      type: "payment",
      id: payment.id,
      classification: "Confidential",
      ownerPrincipalId: payment.createdBy,
    },
  });
  if (rbac.result === "deny") {
    recordAudit(store, {
      tenantId: principal.tenantId,
      occurredAt: new Date().toISOString(),
      actorType: principal.actorType,
      actorPrincipalId: principal.id,
      action: "finance:approve:payment",
      resourceType: "payment",
      resourceId: payment.id,
      correlationId,
      authorization: "deny",
      evidence: { reason: rbac.reason },
    });
    return { error: "forbidden" as const, reason: rbac.reason };
  }

  const gate = canDecide({
    task,
    actorPrincipalId: principal.id,
    actorType: principal.actorType,
    outcome,
  });
  if (!gate.allow) {
    recordAudit(store, {
      tenantId: principal.tenantId,
      occurredAt: new Date().toISOString(),
      actorType: principal.actorType,
      actorPrincipalId: principal.id,
      action: "finance:approve:payment",
      resourceType: "payment",
      resourceId: payment.id,
      correlationId,
      authorization: "deny",
      evidence: { reason: gate.reason },
    });
    return { error: "forbidden" as const, reason: gate.reason };
  }

  const sod = sodViolation(store.sodRules, store.actions, {
    principalId: principal.id,
    action: "finance:approve:payment",
    objectId: payment.id,
  });
  if (sod) {
    recordAudit(store, {
      tenantId: principal.tenantId,
      occurredAt: new Date().toISOString(),
      actorType: principal.actorType,
      actorPrincipalId: principal.id,
      action: "finance:approve:payment",
      resourceType: "payment",
      resourceId: payment.id,
      correlationId,
      authorization: "deny",
      evidence: { reason: "sod", rule: sod.key },
    });
    return { error: "forbidden" as const, reason: "sod" };
  }

  task.status = outcome;
  payment.status = outcome === "approved" ? "approved" : "rejected";
  store.actions.push({
    principalId: principal.id,
    action: "finance:approve:payment",
    objectId: payment.id,
  });
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "finance:approve:payment",
    resourceType: "payment",
    resourceId: payment.id,
    correlationId,
    authorization: "allow",
    newState: { status: payment.status },
  });
  return { payment, task };
}

export function listAudit(store: Store, principal: Principal) {
  const decision = authorize({
    principal,
    permission: "audit:read:event",
    action: "read:audit",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return { items: store.audit.filter((e) => e.tenantId === principal.tenantId) };
}

export function verifyChain(store: Store, principal: Principal) {
  const decision = authorize({
    principal,
    permission: "audit:verify:chain",
    action: "verify:audit",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return verifyAuditChain(store.audit.filter((e) => e.tenantId === principal.tenantId));
}

export function getConfig(store: Store, principal: Principal, key: string) {
  const decision = authorize({
    principal,
    permission: "config:read:item",
    action: "read:config",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const item = store.configVersions
    .filter((c) => c.tenantId === principal.tenantId && c.key === key && c.status === "approved")
    .sort((a, b) => b.version - a.version)[0];
  if (!item) return { error: "not_found" as const };
  return { item };
}

export { authorize, newId };
