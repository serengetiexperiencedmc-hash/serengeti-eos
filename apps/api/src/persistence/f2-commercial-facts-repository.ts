import type {
  F2AccountFacts,
  F2OpportunityFacts,
  F2PathBApproval,
  F2ProgrammeFacts,
  F2RateIdentity,
  F2RfpFacts,
} from "../commercial-facts/memory.js";
import type { Queryable } from "./durable.js";

function parsePayload<T>(value: unknown): T {
  if (typeof value === "string") return JSON.parse(value) as T;
  return value as T;
}

export async function selectF2OpportunityFacts(
  client: Queryable,
  tenantId: string,
  opportunityId: string,
): Promise<F2OpportunityFacts | undefined> {
  const result = await client.query(
    `SELECT payload FROM f2_opportunity_facts WHERE tenant_id = $1 AND opportunity_id = $2`,
    [tenantId, opportunityId],
  );
  const payload = result.rows[0]?.payload;
  return payload === undefined ? undefined : parsePayload<F2OpportunityFacts>(payload);
}

export async function upsertF2OpportunityFacts(client: Queryable, facts: F2OpportunityFacts): Promise<void> {
  await client.query(
    `INSERT INTO f2_opportunity_facts (
      opportunity_id, tenant_id, payload, updated_at, updated_by_principal_id
    ) VALUES ($1, $2, $3::jsonb, $4, $5)
    ON CONFLICT (tenant_id, opportunity_id) DO UPDATE SET
      payload = EXCLUDED.payload,
      updated_at = EXCLUDED.updated_at,
      updated_by_principal_id = EXCLUDED.updated_by_principal_id`,
    [facts.opportunityId, facts.tenantId, JSON.stringify(facts), facts.updatedAt, facts.updatedByPrincipalId],
  );
}

export async function selectF2RfpFacts(
  client: Queryable,
  tenantId: string,
  rfpId: string,
): Promise<F2RfpFacts | undefined> {
  const result = await client.query(`SELECT payload FROM f2_rfp_facts WHERE tenant_id = $1 AND rfp_id = $2`, [
    tenantId,
    rfpId,
  ]);
  const payload = result.rows[0]?.payload;
  return payload === undefined ? undefined : parsePayload<F2RfpFacts>(payload);
}

export async function upsertF2RfpFacts(client: Queryable, facts: F2RfpFacts): Promise<void> {
  await client.query(
    `INSERT INTO f2_rfp_facts (
      rfp_id, tenant_id, payload, updated_at, updated_by_principal_id
    ) VALUES ($1, $2, $3::jsonb, $4, $5)
    ON CONFLICT (tenant_id, rfp_id) DO UPDATE SET
      payload = EXCLUDED.payload,
      updated_at = EXCLUDED.updated_at,
      updated_by_principal_id = EXCLUDED.updated_by_principal_id`,
    [facts.rfpId, facts.tenantId, JSON.stringify(facts), facts.updatedAt, facts.updatedByPrincipalId],
  );
}

export async function selectF2PathB(
  client: Queryable,
  tenantId: string,
  rfpId: string,
): Promise<F2PathBApproval | undefined> {
  const result = await client.query(`SELECT payload FROM f2_path_b WHERE tenant_id = $1 AND rfp_id = $2`, [
    tenantId,
    rfpId,
  ]);
  const payload = result.rows[0]?.payload;
  return payload === undefined ? undefined : parsePayload<F2PathBApproval>(payload);
}

export async function upsertF2PathB(client: Queryable, facts: F2PathBApproval): Promise<void> {
  await client.query(
    `INSERT INTO f2_path_b (
      rfp_id, tenant_id, payload, updated_at, updated_by_principal_id
    ) VALUES ($1, $2, $3::jsonb, $4, $5)
    ON CONFLICT (tenant_id, rfp_id) DO UPDATE SET
      payload = EXCLUDED.payload,
      updated_at = EXCLUDED.updated_at,
      updated_by_principal_id = EXCLUDED.updated_by_principal_id`,
    [facts.rfpId, facts.tenantId, JSON.stringify(facts), facts.updatedAt, facts.updatedByPrincipalId],
  );
}

export async function selectF2AccountFacts(
  client: Queryable,
  tenantId: string,
  accountId: string,
): Promise<F2AccountFacts | undefined> {
  const result = await client.query(
    `SELECT payload FROM f2_account_facts WHERE tenant_id = $1 AND account_id = $2`,
    [tenantId, accountId],
  );
  const payload = result.rows[0]?.payload;
  return payload === undefined ? undefined : parsePayload<F2AccountFacts>(payload);
}

export async function upsertF2AccountFacts(client: Queryable, facts: F2AccountFacts): Promise<void> {
  await client.query(
    `INSERT INTO f2_account_facts (
      account_id, tenant_id, payload, updated_at, updated_by_principal_id
    ) VALUES ($1, $2, $3::jsonb, $4, $5)
    ON CONFLICT (tenant_id, account_id) DO UPDATE SET
      payload = EXCLUDED.payload,
      updated_at = EXCLUDED.updated_at,
      updated_by_principal_id = EXCLUDED.updated_by_principal_id`,
    [facts.accountId, facts.tenantId, JSON.stringify(facts), facts.updatedAt, facts.updatedByPrincipalId],
  );
}

export async function selectF2RateIdentities(
  client: Queryable,
  tenantId: string,
  rateId: string,
): Promise<F2RateIdentity[]> {
  const result = await client.query(
    `SELECT payload FROM f2_rate_identities WHERE tenant_id = $1 AND rate_id = $2 ORDER BY version_identity ASC`,
    [tenantId, rateId],
  );
  return result.rows.map((row) => parsePayload<F2RateIdentity>(row.payload));
}

export async function upsertF2RateIdentity(client: Queryable, identity: F2RateIdentity): Promise<void> {
  await client.query(
    `INSERT INTO f2_rate_identities (
      identity_id, rate_id, tenant_id, supplier_id, version_identity, payload, updated_at, updated_by_principal_id
    ) VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8)
    ON CONFLICT (tenant_id, rate_id, version_identity) DO UPDATE SET
      payload = EXCLUDED.payload,
      updated_at = EXCLUDED.updated_at,
      updated_by_principal_id = EXCLUDED.updated_by_principal_id`,
    [
      identity.identityId,
      identity.rateId,
      identity.tenantId,
      identity.supplierId,
      identity.versionIdentity,
      JSON.stringify(identity),
      identity.updatedAt,
      identity.updatedByPrincipalId,
    ],
  );
}

export async function selectF2ProgrammeFacts(
  client: Queryable,
  tenantId: string,
  programmeId: string,
): Promise<F2ProgrammeFacts | undefined> {
  const result = await client.query(
    `SELECT payload FROM f2_programme_facts WHERE tenant_id = $1 AND programme_id = $2`,
    [tenantId, programmeId],
  );
  const payload = result.rows[0]?.payload;
  return payload === undefined ? undefined : parsePayload<F2ProgrammeFacts>(payload);
}

export async function upsertF2ProgrammeFacts(client: Queryable, facts: F2ProgrammeFacts): Promise<void> {
  await client.query(
    `INSERT INTO f2_programme_facts (
      programme_id, tenant_id, payload, updated_at, updated_by_principal_id
    ) VALUES ($1, $2, $3::jsonb, $4, $5)
    ON CONFLICT (tenant_id, programme_id) DO UPDATE SET
      payload = EXCLUDED.payload,
      updated_at = EXCLUDED.updated_at,
      updated_by_principal_id = EXCLUDED.updated_by_principal_id`,
    [facts.programmeId, facts.tenantId, JSON.stringify(facts), facts.updatedAt, facts.updatedByPrincipalId],
  );
}

export async function listAllF2OpportunityFacts(client: Queryable): Promise<F2OpportunityFacts[]> {
  const result = await client.query(`SELECT payload FROM f2_opportunity_facts`);
  return result.rows.map((row) => parsePayload<F2OpportunityFacts>(row.payload));
}

export async function listAllF2RfpFacts(client: Queryable): Promise<F2RfpFacts[]> {
  const result = await client.query(`SELECT payload FROM f2_rfp_facts`);
  return result.rows.map((row) => parsePayload<F2RfpFacts>(row.payload));
}

export async function listAllF2PathB(client: Queryable): Promise<F2PathBApproval[]> {
  const result = await client.query(`SELECT payload FROM f2_path_b`);
  return result.rows.map((row) => parsePayload<F2PathBApproval>(row.payload));
}

export async function listAllF2AccountFacts(client: Queryable): Promise<F2AccountFacts[]> {
  const result = await client.query(`SELECT payload FROM f2_account_facts`);
  return result.rows.map((row) => parsePayload<F2AccountFacts>(row.payload));
}

export async function listAllF2RateIdentities(client: Queryable): Promise<F2RateIdentity[]> {
  const result = await client.query(`SELECT payload FROM f2_rate_identities ORDER BY rate_id, version_identity`);
  return result.rows.map((row) => parsePayload<F2RateIdentity>(row.payload));
}

export async function listAllF2ProgrammeFacts(client: Queryable): Promise<F2ProgrammeFacts[]> {
  const result = await client.query(`SELECT payload FROM f2_programme_facts`);
  return result.rows.map((row) => parsePayload<F2ProgrammeFacts>(row.payload));
}
