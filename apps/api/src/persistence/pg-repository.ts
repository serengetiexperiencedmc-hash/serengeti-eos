import type { DbPool } from "@sedmc/db";
import type { ChainedAuditRecord, Classification, OutboxRecord, StoredPrincipal } from "@sedmc/kernel";

export async function withTransaction<T>(
  pool: DbPool,
  fn: (client: { query: DbPool["query"] }) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function upsertTenant(
  pool: DbPool,
  tenant: { id: string; slug: string; name: string; kind: "internal" | "partner" },
): Promise<void> {
  await pool.query(
    `INSERT INTO tenants (id, slug, name, kind)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name`,
    [tenant.id, tenant.slug, tenant.name, tenant.kind],
  );
}

export async function insertAuditEvent(pool: DbPool, event: ChainedAuditRecord): Promise<void> {
  await pool.query(
    `INSERT INTO audit_events (
      id, tenant_id, occurred_at, actor_type, actor_principal_id, action,
      resource_type, resource_id, correlation_id, authorization,
      previous_state, new_state, evidence, prev_hash, row_hash
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12::jsonb,$13::jsonb,$14,$15
    )`,
    [
      event.resourceId ? cryptoRandomUuid() : cryptoRandomUuid(),
      event.tenantId,
      event.occurredAt,
      event.actorType,
      event.actorPrincipalId ?? null,
      event.action,
      event.resourceType,
      event.resourceId ?? null,
      event.correlationId,
      event.authorization,
      event.previousState ? JSON.stringify(event.previousState) : null,
      event.newState ? JSON.stringify(event.newState) : null,
      event.evidence ? JSON.stringify(event.evidence) : null,
      event.prevHash,
      event.rowHash,
    ],
  );
}

function cryptoRandomUuid(): string {
  return globalThis.crypto.randomUUID();
}

export async function countAuditEvents(pool: DbPool, tenantId: string): Promise<number> {
  const result = await pool.query(`SELECT COUNT(*)::int AS c FROM audit_events WHERE tenant_id = $1`, [
    tenantId,
  ]);
  return result.rows[0]?.c ?? 0;
}

export async function insertSession(
  pool: DbPool,
  session: {
    id: string;
    tenantId: string;
    principalId: string;
    tokenId: string;
    issuedAt: string;
    expiresAt: string;
    revokedAt?: string;
  },
): Promise<void> {
  await pool.query(
    `INSERT INTO sessions (id, tenant_id, principal_id, issued_at, expires_at, revoked_at, token_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT (token_id) DO NOTHING`,
    [
      session.id,
      session.tenantId,
      session.principalId,
      session.issuedAt,
      session.expiresAt,
      session.revokedAt ?? null,
      session.tokenId,
    ],
  );
}

export async function revokeSessionDb(pool: DbPool, sessionId: string, tenantId: string): Promise<boolean> {
  const result = await pool.query(
    `UPDATE sessions SET revoked_at = now()
     WHERE id = $1 AND tenant_id = $2 AND revoked_at IS NULL`,
    [sessionId, tenantId],
  );
  return (result.rowCount ?? 0) > 0;
}

export async function getSessionByTokenId(
  pool: DbPool,
  tokenId: string,
): Promise<{ id: string; tenantId: string; principalId: string; revokedAt: string | null; expiresAt: string } | null> {
  const result = await pool.query(
    `SELECT id, tenant_id AS "tenantId", principal_id AS "principalId",
            revoked_at AS "revokedAt", expires_at AS "expiresAt"
     FROM sessions WHERE token_id = $1`,
    [tokenId],
  );
  return result.rows[0] ?? null;
}

export async function upsertOrganisation(
  pool: DbPool,
  org: { id: string; tenantId: string; name: string; legalName?: string },
): Promise<void> {
  await pool.query(
    `INSERT INTO organisations (id, tenant_id, name, legal_name)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, legal_name = EXCLUDED.legal_name, updated_at = now()`,
    [org.id, org.tenantId, org.name, org.legalName ?? null],
  );
}

export async function upsertLocation(
  pool: DbPool,
  loc: { id: string; tenantId: string; code: string; name: string; countryCode?: string; city?: string },
): Promise<void> {
  await pool.query(
    `INSERT INTO locations (id, tenant_id, code, name, country_code, city)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (tenant_id, code) DO UPDATE SET name = EXCLUDED.name, updated_at = now()`,
    [loc.id, loc.tenantId, loc.code, loc.name, loc.countryCode ?? null, loc.city ?? null],
  );
}

export async function upsertCostCenter(
  pool: DbPool,
  cc: { id: string; tenantId: string; code: string; name: string },
): Promise<void> {
  await pool.query(
    `INSERT INTO cost_centers (id, tenant_id, code, name)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (tenant_id, code) DO UPDATE SET name = EXCLUDED.name, updated_at = now()`,
    [cc.id, cc.tenantId, cc.code, cc.name],
  );
}

export async function upsertOrgUnit(
  pool: DbPool,
  unit: {
    id: string;
    tenantId: string;
    organisationId: string;
    parentId?: string;
    code: string;
    name: string;
    departmentKey: string;
    unitType: string;
    locationId?: string;
    costCenterId?: string;
  },
): Promise<void> {
  await pool.query(
    `INSERT INTO org_units (
      id, tenant_id, organisation_id, parent_id, code, name, department_key, unit_type, location_id, cost_center_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    ON CONFLICT (tenant_id, code) DO UPDATE SET
      name = EXCLUDED.name, unit_type = EXCLUDED.unit_type, updated_at = now()`,
    [
      unit.id,
      unit.tenantId,
      unit.organisationId,
      unit.parentId ?? null,
      unit.code,
      unit.name,
      unit.departmentKey,
      unit.unitType,
      unit.locationId ?? null,
      unit.costCenterId ?? null,
    ],
  );
}

export async function upsertPrincipal(
  pool: DbPool,
  principal: StoredPrincipal & { passwordHash?: string },
): Promise<void> {
  await pool.query(
    `INSERT INTO principals (
      id, tenant_id, actor_type, email, display_name, status, org_unit_id,
      classification_clearance, attributes
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb)
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      display_name = EXCLUDED.display_name,
      status = EXCLUDED.status,
      classification_clearance = EXCLUDED.classification_clearance,
      attributes = EXCLUDED.attributes,
      updated_at = now()`,
    [
      principal.id,
      principal.tenantId,
      principal.actorType,
      principal.email ?? null,
      principal.displayName,
      principal.status,
      principal.orgUnitId ?? null,
      principal.classificationClearance as Classification,
      JSON.stringify(principal.attributes ?? {}),
    ],
  );
  if (principal.passwordHash) {
    await pool.query(
      `INSERT INTO principal_credentials (principal_id, password_hash)
       VALUES ($1,$2)
       ON CONFLICT (principal_id) DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = now()`,
      [principal.id, principal.passwordHash],
    );
  }
}

export async function insertConfigVersion(
  pool: DbPool,
  version: {
    id: string;
    tenantId: string;
    key: string;
    version: number;
    value: unknown;
    status: string;
    createdByPrincipalId: string;
    createdAt: string;
    approvedByPrincipalId?: string;
    approvedAt?: string;
  },
): Promise<void> {
  await pool.query(
    `INSERT INTO config_items (id, tenant_id, key, classification)
     VALUES ($1,$2,$3,'Confidential')
     ON CONFLICT (tenant_id, key) DO NOTHING`,
    [cryptoRandomUuid(), version.tenantId, version.key],
  );
  const item = await pool.query(`SELECT id FROM config_items WHERE tenant_id = $1 AND key = $2`, [
    version.tenantId,
    version.key,
  ]);
  const configItemId = item.rows[0]?.id as string;
  await pool.query(
    `INSERT INTO config_versions (
      id, config_item_id, version, value, status, created_at, created_by_principal_id,
      approved_by_principal_id, approved_at
    ) VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7,$8,$9)
    ON CONFLICT (config_item_id, version) DO UPDATE SET
      status = EXCLUDED.status,
      approved_by_principal_id = EXCLUDED.approved_by_principal_id,
      approved_at = EXCLUDED.approved_at`,
    [
      version.id,
      configItemId,
      version.version,
      JSON.stringify(version.value),
      version.status,
      version.createdAt,
      version.createdByPrincipalId,
      version.approvedByPrincipalId ?? null,
      version.approvedAt ?? null,
    ],
  );
}

export async function assertTenantIsolation(
  pool: DbPool,
  tenantA: string,
  tenantB: string,
): Promise<{ ok: boolean }> {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS c FROM locations WHERE tenant_id = $1 AND code IN (
       SELECT code FROM locations WHERE tenant_id = $2
     )`,
    [tenantA, tenantB],
  );
  // Shared codes across tenants are allowed; isolation is by tenant_id filter.
  void result;
  const cross = await pool.query(
    `SELECT COUNT(*)::int AS c FROM sessions s
     JOIN principals p ON p.id = s.principal_id
     WHERE s.tenant_id = $1 AND p.tenant_id = $2`,
    [tenantA, tenantB],
  );
  return { ok: (cross.rows[0]?.c ?? 0) === 0 };
}

export async function insertNotifDismissal(
  pool: DbPool,
  entry: { id: string; tenantId: string; principalId: string; notificationKey: string; dismissedAt: string },
): Promise<void> {
  await pool.query(
    `INSERT INTO notif_dismissals (id, tenant_id, principal_id, notification_key, dismissed_at)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (tenant_id, principal_id, notification_key) DO NOTHING`,
    [entry.id, entry.tenantId, entry.principalId, entry.notificationKey, entry.dismissedAt],
  );
}

export async function insertNotifEmailOutbox(
  pool: DbPool,
  entry: {
    id: string;
    tenantId: string;
    principalId: string;
    notificationKey: string;
    to: string;
    subject: string;
    bodyText: string;
    templateKey: string;
    status: string;
    adapter: string;
    sentAt?: string;
    createdAt: string;
  },
): Promise<void> {
  await pool.query(
    `INSERT INTO notif_email_outbox (
      id, tenant_id, principal_id, notification_key, recipient_email,
      subject, body_text, template_key, status, adapter, sent_at, created_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     ON CONFLICT (tenant_id, principal_id, notification_key) DO NOTHING`,
    [
      entry.id,
      entry.tenantId,
      entry.principalId,
      entry.notificationKey,
      entry.to,
      entry.subject,
      entry.bodyText,
      entry.templateKey,
      entry.status,
      entry.adapter,
      entry.sentAt ?? null,
      entry.createdAt,
    ],
  );
}

export async function countNotifEmailOutbox(pool: DbPool, tenantId: string): Promise<number> {
  const result = await pool.query(`SELECT COUNT(*)::int AS c FROM notif_email_outbox WHERE tenant_id = $1`, [tenantId]);
  return result.rows[0]?.c ?? 0;
}

export async function countNotifDismissals(pool: DbPool, tenantId: string): Promise<number> {
  const result = await pool.query(`SELECT COUNT(*)::int AS c FROM notif_dismissals WHERE tenant_id = $1`, [tenantId]);
  return result.rows[0]?.c ?? 0;
}

function mapOutboxRow(row: Record<string, unknown>): OutboxRecord {
  const envelope = row.envelope as OutboxRecord["envelope"];
  return {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    eventType: row.event_type as string,
    envelope,
    classification: row.classification as OutboxRecord["classification"],
    createdAt: (row.created_at as Date).toISOString(),
    publishedAt: row.published_at ? (row.published_at as Date).toISOString() : undefined,
    attempts: row.attempts as number,
    lastError: (row.last_error as string) ?? undefined,
    status: row.status as OutboxRecord["status"],
  };
}

export async function insertOutboxEvent(pool: DbPool, outbox: OutboxRecord): Promise<void> {
  await pool.query(
    `INSERT INTO outbox_events (
      id, tenant_id, event_type, payload, classification, created_at,
      published_at, attempts, envelope, status, last_error, correlation_id, aggregate_id
    ) VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7,$8,$9::jsonb,$10,$11,$12,$13)
     ON CONFLICT (id) DO NOTHING`,
    [
      outbox.id,
      outbox.tenantId,
      outbox.eventType,
      JSON.stringify(outbox.envelope.payload),
      outbox.classification,
      outbox.createdAt,
      outbox.publishedAt ?? null,
      outbox.attempts,
      JSON.stringify(outbox.envelope),
      outbox.status,
      outbox.lastError ?? null,
      outbox.envelope.correlationId,
      outbox.envelope.aggregateId ?? null,
    ],
  );
}

export async function updateOutboxEventStatus(
  pool: DbPool,
  input: {
    id: string;
    status: OutboxRecord["status"];
    publishedAt?: string;
    attempts: number;
    lastError?: string;
  },
): Promise<void> {
  await pool.query(
    `UPDATE outbox_events
     SET status = $2, published_at = $3, attempts = $4, last_error = $5
     WHERE id = $1`,
    [input.id, input.status, input.publishedAt ?? null, input.attempts, input.lastError ?? null],
  );
}

export async function hydratePendingOutboxEvents(pool: DbPool): Promise<OutboxRecord[]> {
  const result = await pool.query(
    `SELECT id, tenant_id, event_type, payload, classification, created_at,
            published_at, attempts, envelope, status, last_error, correlation_id, aggregate_id
     FROM outbox_events WHERE status = 'pending' ORDER BY created_at ASC`,
  );
  return result.rows.map((row) => mapOutboxRow(row));
}

export async function countPendingOutboxEvents(pool: DbPool, tenantId?: string): Promise<number> {
  const result = tenantId
    ? await pool.query(`SELECT COUNT(*)::int AS c FROM outbox_events WHERE status = 'pending' AND tenant_id = $1`, [
        tenantId,
      ])
    : await pool.query(`SELECT COUNT(*)::int AS c FROM outbox_events WHERE status = 'pending'`);
  return result.rows[0]?.c ?? 0;
}
