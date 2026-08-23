import { describe, expect, it } from "vitest";
import { authorize } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { acceptAiDraft } from "./ai/drafts.js";
import { allPrincipals } from "./store.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I20.2 AI draft accept / discard", () => {
  it("denies AiAgent accept at ABAC", () => {
    const decision = authorize({
      principal: {
        id: "agent-1",
        tenantId: "11111111-1111-4111-8111-111111111111",
        actorType: "AiAgent",
        displayName: "Agent",
        status: "active",
        classificationClearance: "Internal",
        roles: ["ai.agent"],
        permissions: ["ai:write:draft"],
      },
      permission: "ai:write:draft",
      action: "accept:ai_draft",
    });
    expect(decision.result).toBe("deny");
    expect(decision.reason).toBe("ai_cannot_approve");
  });

  it("requires ai:write:draft", async () => {
    const store = seedStore("i202-auth", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const alice = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "alice.finance@sedmc.local", password: P.alicePassword, tenantSlug: "sedmc" },
    });
    const token = alice.json().accessToken as string;
    const forbidden = await app.inject({
      method: "POST",
      url: "/v1/ai/drafts",
      headers: { authorization: `Bearer ${token}` },
      payload: { recommendationKey: "notifications.allowlist_digest.stale" },
    });
    expect(forbidden.statusCode).toBe(403);
  });

  it("creates a pending draft and applies a CRM task only after human accept", async () => {
    const store = seedStore("i202-draft", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const created = await app.inject({
      method: "POST",
      url: "/v1/ai/drafts",
      headers: { authorization: `Bearer ${token}` },
      payload: { recommendationKey: "notifications.allowlist_digest.stale" },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().increment).toBe("I20.12");
    expect(created.json().draft.status).toBe("pending");
    expect(created.json().draft.autonomyLevel).toBe(2);
    expect(created.json().draft.artefactType).toBe("crm_task");
    const draftId = created.json().draft.id as string;

    const listed = await app.inject({
      method: "GET",
      url: "/v1/ai/drafts?status=pending",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.json().items.some((d: { id: string }) => d.id === draftId)).toBe(true);
    expect(store.crmTasks.filter((t) => t.title.startsWith("Follow up:")).length).toBe(0);

    const agent = allPrincipals(store).find((p) => p.actorType === "AiAgent")!;
    agent.permissions = [...agent.permissions, "ai:write:draft"];
    const agentAccept = await acceptAiDraft(store, agent, draftId, "corr-agent");
    expect("error" in agentAccept && agentAccept.error === "forbidden").toBe(true);

    const accepted = await app.inject({
      method: "POST",
      url: `/v1/ai/drafts/${draftId}/accept`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(accepted.statusCode).toBe(200);
    expect(accepted.json().draft.status).toBe("accepted");
    expect(accepted.json().task.id).toBeTruthy();
    expect(store.crmTasks.some((t) => t.id === accepted.json().task.id)).toBe(true);

    const replay = await app.inject({
      method: "POST",
      url: `/v1/ai/drafts/${draftId}/accept`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(replay.statusCode).toBe(409);
  });

  it("discards a draft without creating a task", async () => {
    const store = seedStore("i202-discard", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const created = await app.inject({
      method: "POST",
      url: "/v1/ai/drafts",
      headers: { authorization: `Bearer ${token}` },
      payload: { recommendationKey: "events.dlq_digest.stale" },
    });
    const draftId = created.json().draft.id as string;
    const discarded = await app.inject({
      method: "POST",
      url: `/v1/ai/drafts/${draftId}/discard`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(discarded.statusCode).toBe(200);
    expect(discarded.json().draft.status).toBe("discarded");
    expect(store.crmTasks.filter((t) => t.title.startsWith("Follow up:")).length).toBe(0);
  });
});
