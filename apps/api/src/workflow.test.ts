import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";

const P = TEST_BOOTSTRAP_SECRETS;

const approvalGraph = {
  start: "manager_approval",
  nodes: [
    {
      key: "manager_approval",
      type: "human_approval",
      name: "Manager approval",
      slaMinutes: 60,
      nextOnApprove: "finance_check",
      nextOnReject: undefined,
    },
    {
      key: "finance_check",
      type: "human_approval",
      name: "Finance check",
    },
  ],
};

async function login(app: ReturnType<typeof buildServer>, email: string, password: string) {
  return app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email, password, tenantSlug: "sedmc" },
  });
}

describe("I2 workflow + rules", () => {
  it("runs definition → version → publish → instance → human approval with SoD", async () => {
    const app = buildServer({ store: seedStore("test-secret") });
    const carol = await login(app, "carol.admin@sedmc.local", P.carolPassword);
    const bob = await login(app, "bob.approver@sedmc.local", P.bobPassword);
    const carolToken = carol.json().accessToken;
    const bobToken = bob.json().accessToken;

    const def = await app.inject({
      method: "POST",
      url: "/v1/workflows/definitions",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { key: "config.change", name: "Config change approval" },
    });
    expect(def.statusCode).toBe(201);
    const definitionId = def.json().definition.id;

    const ver = await app.inject({
      method: "POST",
      url: `/v1/workflows/definitions/${definitionId}/versions`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { graph: approvalGraph },
    });
    expect(ver.statusCode).toBe(201);
    const versionId = ver.json().version.id;

    const published = await app.inject({
      method: "POST",
      url: `/v1/workflows/versions/${versionId}/publish`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {},
    });
    expect(published.statusCode).toBe(200);

    const started = await app.inject({
      method: "POST",
      url: "/v1/workflows/instances",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { definitionKey: "config.change", businessKey: "CFG-1" },
    });
    expect(started.statusCode).toBe(201);
    const taskId = started.json().task.id;

    const selfApprove = await app.inject({
      method: "POST",
      url: `/v1/workflows/tasks/${taskId}/complete`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { decision: "approved", idempotencyKey: "idem-1" },
    });
    expect(selfApprove.statusCode).toBe(403);

    const approved = await app.inject({
      method: "POST",
      url: `/v1/workflows/tasks/${taskId}/complete`,
      headers: { authorization: `Bearer ${bobToken}` },
      payload: { decision: "approved", idempotencyKey: "idem-2" },
    });
    expect(approved.statusCode).toBe(200);
    expect(approved.json().nextTask?.nodeKey).toBe("finance_check");

    const replay = await app.inject({
      method: "POST",
      url: `/v1/workflows/tasks/${taskId}/complete`,
      headers: { authorization: `Bearer ${bobToken}` },
      payload: { decision: "approved", idempotencyKey: "idem-2" },
    });
    expect(replay.statusCode).toBe(200);
    expect(replay.json().idempotent).toBe(true);
  });

  it("simulates workflow and rules without executing side effects", async () => {
    const app = buildServer({ store: seedStore("test-secret") });
    const carol = await login(app, "carol.admin@sedmc.local", P.carolPassword);
    const bob = await login(app, "bob.approver@sedmc.local", P.bobPassword);
    const carolToken = carol.json().accessToken;

    const def = await app.inject({
      method: "POST",
      url: "/v1/workflows/definitions",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { key: "sim.flow", name: "Sim" },
    });
    const version = await app.inject({
      method: "POST",
      url: `/v1/workflows/definitions/${def.json().definition.id}/versions`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { graph: approvalGraph },
    });
    await app.inject({
      method: "POST",
      url: `/v1/workflows/versions/${version.json().version.id}/publish`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {},
    });

    const sim = await app.inject({
      method: "POST",
      url: "/v1/workflows/simulate",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { definitionKey: "sim.flow", decisions: ["approved"] },
    });
    expect(sim.statusCode).toBe(200);
    expect(sim.json().executed).toBe(false);
    expect(sim.json().path).toEqual(["manager_approval", "finance_check"]);

    const rule = await app.inject({
      method: "POST",
      url: "/v1/rules",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        key: "margin.floor",
        name: "Margin floor",
        condition: { all: [{ path: "margin", op: "lte", value: 10 }] },
        result: { block: true },
      },
    });
    expect(rule.statusCode).toBe(201);
    const versionId = rule.json().version.id;

    const selfRule = await app.inject({
      method: "POST",
      url: `/v1/rules/versions/${versionId}/approve`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {},
    });
    expect(selfRule.statusCode).toBe(403);

    const approved = await app.inject({
      method: "POST",
      url: `/v1/rules/versions/${versionId}/approve`,
      headers: { authorization: `Bearer ${bob.json().accessToken}` },
      payload: {},
    });
    expect(approved.statusCode).toBe(200);
    expect(approved.json().version.status).toBe("effective");

    const ruleSim = await app.inject({
      method: "POST",
      url: `/v1/rules/versions/${versionId}/simulate`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { input: { margin: 8 } },
    });
    expect(ruleSim.statusCode).toBe(200);
    expect(ruleSim.json().executed).toBe(false);
    expect(ruleSim.json().matched).toBe(true);
  });
});
