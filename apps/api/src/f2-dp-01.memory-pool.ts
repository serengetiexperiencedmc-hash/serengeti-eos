import type { DbPool } from "@sedmc/db";

export const F2_DP01_DEVTEST_URL = "postgres://127.0.0.1/eos_devtest_f2_dp01";
export const F2_DP01_GATEB_URL = "postgres://127.0.0.1/eos_gateb";

type Row = { payload: unknown; version_identity?: number };

/** In-process stand-in for the F2-DP-01 sidecar tables. Not Production. Not eos_gateb. */
export function createF2Dp01MemoryPool(connectionString = F2_DP01_DEVTEST_URL): DbPool {
  const tables = new Map<string, Map<string, Row>>();
  const table = (name: string) => {
    let rows = tables.get(name);
    if (!rows) {
      rows = new Map();
      tables.set(name, rows);
    }
    return rows;
  };

  const query = (async (sql: string, params: unknown[] = []) => {
    const text = String(sql);
    if (/^\s*(BEGIN|COMMIT|ROLLBACK)\s*;?\s*$/i.test(text)) return { rows: [], rowCount: 0 };

    const insert = text.match(/INSERT INTO (f2_[a-z_]+)/i);
    if (insert?.[1]) {
      const name = insert[1];
      if (name === "f2_rate_identities") {
        const rateId = String(params[1]);
        const tenantId = String(params[2]);
        const versionIdentity = Number(params[4]);
        const payload = typeof params[5] === "string" ? JSON.parse(params[5] as string) : params[5];
        table(name).set(`${tenantId}:${rateId}:${versionIdentity}`, {
          payload,
          version_identity: versionIdentity,
        });
        return { rows: [], rowCount: 1 };
      }
      const id = String(params[0]);
      const tenantId = String(params[1]);
      const payload = typeof params[2] === "string" ? JSON.parse(params[2] as string) : params[2];
      table(name).set(`${tenantId}:${id}`, { payload });
      return { rows: [], rowCount: 1 };
    }

    const fromWhere = text.match(/FROM (f2_[a-z_]+)[\s\S]*WHERE/i);
    if (fromWhere?.[1]) {
      const name = fromWhere[1];
      if (name === "f2_rate_identities") {
        const tenantId = String(params[0]);
        const rateId = String(params[1]);
        const prefix = `${tenantId}:${rateId}:`;
        const rows = [...table(name).entries()]
          .filter(([key]) => key.startsWith(prefix))
          .sort((a, b) => (a[1].version_identity ?? 0) - (b[1].version_identity ?? 0))
          .map(([, row]) => row);
        return { rows, rowCount: rows.length };
      }
      const row = table(name).get(`${params[0]}:${params[1]}`);
      return { rows: row ? [row] : [], rowCount: row ? 1 : 0 };
    }

    const fromAll = text.match(/FROM (f2_[a-z_]+)/i);
    if (fromAll?.[1]) {
      const rows = [...table(fromAll[1]).values()];
      return { rows, rowCount: rows.length };
    }

    return { rows: [], rowCount: 0 };
  }) as DbPool["query"];

  return {
    query,
    connect: async () => ({ query, release() {} }),
    options: { connectionString },
  } as unknown as DbPool;
}
