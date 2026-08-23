import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import type { AiDraft } from "@sedmc/kernel";
import { loadAiDrafts, upsertAiDraft } from "./persistence/pg-repository.js";
import { hydrateAiDrafts, persistAiDraft } from "./persistence/ai-drafts.js";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I20.4 AI draft persistence", () => {
  it("lists I20.4 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("064_i204_ai_drafts"))).toBe(true);
  });

  it("dual-writes create and accept, then hydrates into an empty store", async () => {
    const store = seedStore("i204-persist", TEST_BOOTSTRAP_SECRETS);
    const writes: unknown[][] = [];
    store.dbPool = {
      query: async (sql: string, params?: unknown[]) => {
        const text = String(sql);
        if (text.includes("INSERT INTO ai_drafts")) {
          writes.push(params ?? []);
        }
        if (text.includes("FROM ai_drafts")) {
          const row = writes[0];
          return {
            rows: row
              ? [
                  {
                    id: row[0],
                    tenant_id: row[1],
                    recommendation_key: row[2],
                    artefact_type: row[3],
                    title: row[4],
                    body: row[5],
                    status: writes[writes.length - 1]![6],
                    autonomy_level: row[7],
                    created_at: row[8],
                    created_by_principal_id: row[9],
                    accepted_at: writes[writes.length - 1]![10],
                    accepted_by_principal_id: writes[writes.length - 1]![11],
                    discarded_at: null,
                    discarded_by_principal_id: null,
                    applied_entity_type: writes[writes.length - 1]![14],
                    applied_entity_id: writes[writes.length - 1]![15],
                    related_organization_id: null,
                    related_contact_id: null,
                  },
                ]
              : [],
            rowCount: writes.length ? 1 : 0,
          };
        }
        return { rows: [], rowCount: 0 };
      },
    } as never;

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
    expect(writes.length).toBeGreaterThanOrEqual(1);
    expect(writes[0]![6]).toBe("pending");

    const accepted = await app.inject({
      method: "POST",
      url: `/v1/ai/drafts/${created.json().draft.id}/accept`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(accepted.statusCode).toBe(200);
    expect(writes.some((w) => w[6] === "accepted")).toBe(true);

    const empty = seedStore("i204-hydrate", TEST_BOOTSTRAP_SECRETS);
    const merged = await hydrateAiDrafts(store.dbPool!, empty);
    expect(merged).toBe(1);
    expect(empty.aiDrafts[0]!.status).toBe("accepted");
    expect(empty.aiDrafts[0]!.appliedEntityType).toBe("crm_task");

    await persistAiDraft(store.dbPool, empty.aiDrafts[0] as AiDraft);
    expect(typeof upsertAiDraft).toBe("function");
    expect(typeof loadAiDrafts).toBe("function");
  });
});
