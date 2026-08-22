import { describe, expect, it } from "vitest";
import { authorize } from "./authz.js";
import { canDecide } from "./approval.js";
import { chainAudit, hashPassword, verifyAuditChain, verifyPassword } from "./crypto.js";
import { sodViolation } from "./sod.js";
import { signToken, verifyToken } from "./token.js";
import type { Principal, Resource } from "./types.js";
import { GENESIS_HASH } from "./types.js";

const human: Principal = {
  id: "p-alice",
  tenantId: "t-internal",
  actorType: "Human",
  displayName: "Alice",
  status: "active",
  classificationClearance: "Confidential",
  roles: ["finance.member"],
  permissions: ["finance:create:payment"],
};

const payment: Resource = {
  tenantId: "t-internal",
  type: "payment",
  id: "pay-1",
  classification: "Confidential",
  ownerPrincipalId: "p-alice",
};

describe("passwords", () => {
  it("verifies scrypt hashes", () => {
    const stored = hashPassword("correct-horse");
    expect(verifyPassword("correct-horse", stored)).toBe(true);
    expect(verifyPassword("wrong", stored)).toBe(false);
  });
});

describe("audit chain", () => {
  it("detects tampering", () => {
    const a = chainAudit({
      tenantId: "t-internal",
      occurredAt: "2026-08-21T18:00:00.000Z",
      actorType: "Human",
      actorPrincipalId: "p-alice",
      action: "finance:create:payment",
      resourceType: "payment",
      resourceId: "pay-1",
      correlationId: "c1",
      authorization: "allow",
    });
    const b = chainAudit(
      {
        tenantId: "t-internal",
        occurredAt: "2026-08-21T18:01:00.000Z",
        actorType: "Human",
        actorPrincipalId: "p-bob",
        action: "finance:approve:payment",
        resourceType: "payment",
        resourceId: "pay-1",
        correlationId: "c1",
        authorization: "allow",
      },
      a.rowHash,
    );
    expect(verifyAuditChain([a, b]).ok).toBe(true);
    const tampered = { ...b, action: "finance:approve:payment", newState: { forged: true } };
    expect(verifyAuditChain([a, tampered]).ok).toBe(false);
    expect(a.prevHash).toBe(GENESIS_HASH);
  });
});

describe("authorisation", () => {
  it("denies missing RBAC permission", () => {
    const d = authorize({
      principal: human,
      permission: "finance:approve:payment",
      action: "approve:payment",
      resource: payment,
    });
    expect(d.result).toBe("deny");
    expect(d.reason).toBe("rbac");
  });

  it("denies cross-tenant resource even with permission", () => {
    const d = authorize({
      principal: { ...human, permissions: ["finance:read:payment"] },
      permission: "finance:read:payment",
      action: "read:payment",
      resource: { ...payment, tenantId: "t-partner" },
    });
    expect(d.result).toBe("deny");
    expect(d.reason).toBe("tenant_isolation");
  });

  it("denies AI access to restricted data", () => {
    const agent: Principal = {
      ...human,
      id: "agent-1",
      actorType: "AiAgent",
      permissions: ["finance:read:payment"],
      classificationClearance: "HighlyRestricted",
    };
    const d = authorize({
      principal: agent,
      permission: "finance:read:payment",
      action: "read:payment",
      resource: { ...payment, classification: "Restricted" },
    });
    expect(d.result).toBe("deny");
    expect(d.reason).toBe("ai_restricted_data");
  });
});

describe("segregation of duties", () => {
  it("blocks creator from approving the same payment", () => {
    const rule = {
      key: "payment-create-approve",
      actionA: "finance:create:payment",
      actionB: "finance:approve:payment",
      sameObject: true,
    };
    const v = sodViolation(
      [rule],
      [{ principalId: "p-alice", action: "finance:create:payment", objectId: "pay-1" }],
      { principalId: "p-alice", action: "finance:approve:payment", objectId: "pay-1" },
    );
    expect(v?.key).toBe("payment-create-approve");
  });
});

describe("approval gates", () => {
  it("forbids self-approval and AI approval", () => {
    const task = {
      id: "appr-1",
      tenantId: "t-internal",
      actionClass: "payment.release",
      resourceType: "payment",
      resourceId: "pay-1",
      status: "pending" as const,
      requestedByPrincipalId: "p-alice",
    };
    expect(
      canDecide({ task, actorPrincipalId: "p-alice", actorType: "Human", outcome: "approved" }).allow,
    ).toBe(false);
    expect(
      canDecide({ task, actorPrincipalId: "agent-1", actorType: "AiAgent", outcome: "approved" }).allow,
    ).toBe(false);
    expect(
      canDecide({ task, actorPrincipalId: "p-bob", actorType: "Human", outcome: "approved" }).allow,
    ).toBe(true);
  });
});

describe("tokens", () => {
  it("rejects expired and tampered tokens", () => {
    const secret = "dev-secret";
    const token = signToken(
      {
        sub: "p-alice",
        tid: "t-internal",
        act: "Human",
        jti: "j1",
        iat: 1,
        exp: Math.floor(Date.now() / 1000) + 60,
      },
      secret,
    );
    expect(verifyToken(token, secret)?.sub).toBe("p-alice");
    expect(verifyToken(token, "other")).toBeNull();
    const expired = signToken(
      {
        sub: "p-alice",
        tid: "t-internal",
        act: "Human",
        jti: "j2",
        iat: 1,
        exp: 1,
      },
      secret,
    );
    expect(verifyToken(expired, secret)).toBeNull();
  });
});
