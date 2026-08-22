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

// --- PG.3 CRM persistence ---

export async function upsertCrmOrganizationType(
  pool: DbPool,
  row: { id: string; tenantId: string; key: string; label: string; active: boolean },
): Promise<void> {
  await pool.query(
    `INSERT INTO crm_organization_types (id, tenant_id, key, label, active)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (tenant_id, key) DO UPDATE SET label = EXCLUDED.label, active = EXCLUDED.active`,
    [row.id, row.tenantId, row.key, row.label, row.active],
  );
}

export async function upsertCrmOrganization(pool: DbPool, org: import("@sedmc/kernel").CrmOrganization): Promise<void> {
  await pool.query(
    `INSERT INTO crm_organizations (
      id, tenant_id, legal_name, trading_name, organization_type_id, country, region, market,
      website, domain, primary_email, primary_telephone, address, status, data_quality_status,
      classification, owner_principal_id, source, source_system, source_record_id, import_batch_id,
      version, merged_into_id, archived_at, created_at, updated_at, created_by_principal_id, updated_by_principal_id
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28
    )
    ON CONFLICT (id) DO UPDATE SET
      legal_name = EXCLUDED.legal_name,
      trading_name = EXCLUDED.trading_name,
      organization_type_id = EXCLUDED.organization_type_id,
      country = EXCLUDED.country,
      region = EXCLUDED.region,
      market = EXCLUDED.market,
      website = EXCLUDED.website,
      domain = EXCLUDED.domain,
      primary_email = EXCLUDED.primary_email,
      primary_telephone = EXCLUDED.primary_telephone,
      address = EXCLUDED.address,
      status = EXCLUDED.status,
      data_quality_status = EXCLUDED.data_quality_status,
      classification = EXCLUDED.classification,
      owner_principal_id = EXCLUDED.owner_principal_id,
      source = EXCLUDED.source,
      version = EXCLUDED.version,
      merged_into_id = EXCLUDED.merged_into_id,
      archived_at = EXCLUDED.archived_at,
      updated_at = EXCLUDED.updated_at,
      updated_by_principal_id = EXCLUDED.updated_by_principal_id`,
    [
      org.id,
      org.tenantId,
      org.legalName,
      org.tradingName ?? null,
      org.organizationTypeId,
      org.country ?? null,
      org.region ?? null,
      org.market ?? null,
      org.website ?? null,
      org.domain ?? null,
      org.primaryEmail ?? null,
      org.primaryTelephone ?? null,
      org.address ? JSON.stringify(org.address) : null,
      org.status,
      org.dataQualityStatus,
      org.classification,
      org.ownerPrincipalId ?? null,
      org.source ?? null,
      org.sourceSystem ?? null,
      org.sourceRecordId ?? null,
      org.importBatchId ?? null,
      org.version,
      org.mergedIntoId ?? null,
      org.archivedAt ?? null,
      org.createdAt,
      org.updatedAt,
      org.createdByPrincipalId,
      org.updatedByPrincipalId,
    ],
  );
}

export async function upsertCrmContact(pool: DbPool, contact: import("@sedmc/kernel").CrmContact): Promise<void> {
  await pool.query(
    `INSERT INTO crm_contacts (
      id, tenant_id, given_name, family_name, preferred_name, job_title, department, email, telephone, mobile,
      country, timezone, language, status, data_quality_status, classification, communication_preferences,
      source, merged_into_id, archived_at, version, created_at, updated_at, created_by_principal_id, updated_by_principal_id
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17::jsonb,$18,$19,$20,$21,$22,$23,$24,$25
    )
    ON CONFLICT (id) DO UPDATE SET
      given_name = EXCLUDED.given_name,
      family_name = EXCLUDED.family_name,
      preferred_name = EXCLUDED.preferred_name,
      job_title = EXCLUDED.job_title,
      department = EXCLUDED.department,
      email = EXCLUDED.email,
      telephone = EXCLUDED.telephone,
      mobile = EXCLUDED.mobile,
      country = EXCLUDED.country,
      timezone = EXCLUDED.timezone,
      language = EXCLUDED.language,
      status = EXCLUDED.status,
      data_quality_status = EXCLUDED.data_quality_status,
      classification = EXCLUDED.classification,
      communication_preferences = EXCLUDED.communication_preferences,
      source = EXCLUDED.source,
      merged_into_id = EXCLUDED.merged_into_id,
      archived_at = EXCLUDED.archived_at,
      version = EXCLUDED.version,
      updated_at = EXCLUDED.updated_at,
      updated_by_principal_id = EXCLUDED.updated_by_principal_id`,
    [
      contact.id,
      contact.tenantId,
      contact.givenName,
      contact.familyName,
      contact.preferredName ?? null,
      contact.jobTitle ?? null,
      contact.department ?? null,
      contact.email ?? null,
      contact.telephone ?? null,
      contact.mobile ?? null,
      contact.country ?? null,
      contact.timezone ?? null,
      contact.language ?? null,
      contact.status,
      contact.dataQualityStatus,
      contact.classification,
      contact.communicationPreferences ? JSON.stringify(contact.communicationPreferences) : null,
      contact.source ?? null,
      contact.mergedIntoId ?? null,
      contact.archivedAt ?? null,
      contact.version,
      contact.createdAt,
      contact.updatedAt,
      contact.createdByPrincipalId,
      contact.updatedByPrincipalId,
    ],
  );
}

export async function upsertCrmActivity(pool: DbPool, activity: import("@sedmc/kernel").CrmActivity): Promise<void> {
  await pool.query(
    `INSERT INTO crm_activities (
      id, tenant_id, activity_type, subject, occurred_at, organization_id, contact_id,
      organization_unit_id, relationship_id, owner_principal_id, outcome, notes, classification,
      version, archived_at, created_at, updated_at, created_by_principal_id, updated_by_principal_id
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19
    )
    ON CONFLICT (id) DO UPDATE SET
      activity_type = EXCLUDED.activity_type,
      subject = EXCLUDED.subject,
      occurred_at = EXCLUDED.occurred_at,
      organization_id = EXCLUDED.organization_id,
      contact_id = EXCLUDED.contact_id,
      organization_unit_id = EXCLUDED.organization_unit_id,
      relationship_id = EXCLUDED.relationship_id,
      owner_principal_id = EXCLUDED.owner_principal_id,
      outcome = EXCLUDED.outcome,
      notes = EXCLUDED.notes,
      classification = EXCLUDED.classification,
      version = EXCLUDED.version,
      archived_at = EXCLUDED.archived_at,
      updated_at = EXCLUDED.updated_at,
      updated_by_principal_id = EXCLUDED.updated_by_principal_id`,
    [
      activity.id,
      activity.tenantId,
      activity.activityType,
      activity.subject,
      activity.occurredAt,
      activity.organizationId ?? null,
      activity.contactId ?? null,
      activity.organizationUnitId ?? null,
      activity.relationshipId ?? null,
      activity.ownerPrincipalId,
      activity.outcome ?? null,
      activity.notes ?? null,
      activity.classification,
      activity.version,
      activity.archivedAt ?? null,
      activity.createdAt,
      activity.updatedAt,
      activity.createdByPrincipalId,
      activity.updatedByPrincipalId,
    ],
  );
}

function pgTimestamp(row: Record<string, unknown>, key: string): string {
  const v = row[key];
  return v instanceof Date ? v.toISOString() : String(v);
}

export async function loadCrmOrganizations(pool: DbPool): Promise<import("@sedmc/kernel").CrmOrganization[]> {
  const result = await pool.query(`SELECT * FROM crm_organizations ORDER BY created_at ASC`);
  return result.rows.map((row) => ({
    id: row.id as string,
    tenantId: row.tenant_id as string,
    legalName: row.legal_name as string,
    ...(row.trading_name ? { tradingName: row.trading_name as string } : {}),
    organizationTypeId: row.organization_type_id as string,
    ...(row.country ? { country: row.country as string } : {}),
    ...(row.region ? { region: row.region as string } : {}),
    ...(row.market ? { market: row.market as string } : {}),
    ...(row.website ? { website: row.website as string } : {}),
    ...(row.domain ? { domain: row.domain as string } : {}),
    ...(row.primary_email ? { primaryEmail: row.primary_email as string } : {}),
    ...(row.primary_telephone ? { primaryTelephone: row.primary_telephone as string } : {}),
    ...(row.address ? { address: row.address as Record<string, unknown> } : {}),
    status: row.status as import("@sedmc/kernel").CrmOrganization["status"],
    dataQualityStatus: row.data_quality_status as import("@sedmc/kernel").CrmOrganization["dataQualityStatus"],
    classification: row.classification as import("@sedmc/kernel").Classification,
    ...(row.owner_principal_id ? { ownerPrincipalId: row.owner_principal_id as string } : {}),
    ...(row.source ? { source: row.source as string } : {}),
    ...(row.source_system ? { sourceSystem: row.source_system as string } : {}),
    ...(row.source_record_id ? { sourceRecordId: row.source_record_id as string } : {}),
    ...(row.import_batch_id ? { importBatchId: row.import_batch_id as string } : {}),
    version: row.version as number,
    ...(row.merged_into_id ? { mergedIntoId: row.merged_into_id as string } : {}),
    ...(row.archived_at ? { archivedAt: pgTimestamp(row, "archived_at") } : {}),
    createdAt: pgTimestamp(row, "created_at"),
    updatedAt: pgTimestamp(row, "updated_at"),
    createdByPrincipalId: row.created_by_principal_id as string,
    updatedByPrincipalId: row.updated_by_principal_id as string,
  }));
}

export async function loadCrmContacts(pool: DbPool): Promise<import("@sedmc/kernel").CrmContact[]> {
  const result = await pool.query(`SELECT * FROM crm_contacts ORDER BY created_at ASC`);
  return result.rows.map((row) => ({
    id: row.id as string,
    tenantId: row.tenant_id as string,
    givenName: row.given_name as string,
    familyName: row.family_name as string,
    ...(row.preferred_name ? { preferredName: row.preferred_name as string } : {}),
    ...(row.job_title ? { jobTitle: row.job_title as string } : {}),
    ...(row.department ? { department: row.department as string } : {}),
    ...(row.email ? { email: row.email as string } : {}),
    ...(row.telephone ? { telephone: row.telephone as string } : {}),
    ...(row.mobile ? { mobile: row.mobile as string } : {}),
    ...(row.country ? { country: row.country as string } : {}),
    ...(row.timezone ? { timezone: row.timezone as string } : {}),
    ...(row.language ? { language: row.language as string } : {}),
    status: row.status as import("@sedmc/kernel").CrmContact["status"],
    dataQualityStatus: row.data_quality_status as import("@sedmc/kernel").CrmContact["dataQualityStatus"],
    classification: row.classification as import("@sedmc/kernel").Classification,
    ...(row.communication_preferences
      ? { communicationPreferences: row.communication_preferences as Record<string, unknown> }
      : {}),
    ...(row.source ? { source: row.source as string } : {}),
    ...(row.merged_into_id ? { mergedIntoId: row.merged_into_id as string } : {}),
    ...(row.archived_at ? { archivedAt: pgTimestamp(row, "archived_at") } : {}),
    version: row.version as number,
    createdAt: pgTimestamp(row, "created_at"),
    updatedAt: pgTimestamp(row, "updated_at"),
    createdByPrincipalId: row.created_by_principal_id as string,
    updatedByPrincipalId: row.updated_by_principal_id as string,
  }));
}

export async function loadCrmActivities(pool: DbPool): Promise<import("@sedmc/kernel").CrmActivity[]> {
  const result = await pool.query(`SELECT * FROM crm_activities ORDER BY occurred_at ASC`);
  return result.rows.map((row) => ({
    id: row.id as string,
    tenantId: row.tenant_id as string,
    activityType: row.activity_type as string,
    subject: row.subject as string,
    occurredAt: pgTimestamp(row, "occurred_at"),
    ...(row.organization_id ? { organizationId: row.organization_id as string } : {}),
    ...(row.contact_id ? { contactId: row.contact_id as string } : {}),
    ...(row.organization_unit_id ? { organizationUnitId: row.organization_unit_id as string } : {}),
    ...(row.relationship_id ? { relationshipId: row.relationship_id as string } : {}),
    ownerPrincipalId: row.owner_principal_id as string,
    ...(row.outcome ? { outcome: row.outcome as string } : {}),
    ...(row.notes ? { notes: row.notes as string } : {}),
    classification: row.classification as import("@sedmc/kernel").Classification,
    version: row.version as number,
    ...(row.archived_at ? { archivedAt: pgTimestamp(row, "archived_at") } : {}),
    createdAt: pgTimestamp(row, "created_at"),
    updatedAt: pgTimestamp(row, "updated_at"),
    createdByPrincipalId: row.created_by_principal_id as string,
    updatedByPrincipalId: row.updated_by_principal_id as string,
  }));
}

export async function countCrmOrganizations(pool: DbPool, tenantId: string): Promise<number> {
  const result = await pool.query(`SELECT COUNT(*)::int AS c FROM crm_organizations WHERE tenant_id = $1`, [tenantId]);
  return result.rows[0]?.c ?? 0;
}

export async function upsertNotifEmailTemplate(
  pool: DbPool,
  row: {
    id: string;
    tenantId: string;
    templateKey: string;
    subject: string;
    bodyText: string;
    bodyHtml?: string;
  },
): Promise<void> {
  await pool.query(
    `INSERT INTO notif_email_templates (id, tenant_id, template_key, subject, body_text, body_html)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (tenant_id, template_key) DO UPDATE SET
       subject = EXCLUDED.subject,
       body_text = EXCLUDED.body_text,
       body_html = EXCLUDED.body_html,
       updated_at = now()`,
    [row.id, row.tenantId, row.templateKey, row.subject, row.bodyText, row.bodyHtml ?? null],
  );
}

export async function loadNotifEmailTemplates(
  pool: DbPool,
): Promise<Array<{ id: string; tenantId: string; templateKey: string; subject: string; bodyText: string; bodyHtml?: string }>> {
  const result = await pool.query(
    `SELECT id, tenant_id, template_key, subject, body_text, body_html FROM notif_email_templates`,
  );
  return result.rows.map((row) => ({
    id: row.id as string,
    tenantId: row.tenant_id as string,
    templateKey: row.template_key as string,
    subject: row.subject as string,
    bodyText: row.body_text as string,
    ...(row.body_html ? { bodyHtml: row.body_html as string } : {}),
  }));
}

export async function countNotifEmailTemplates(pool: DbPool, tenantId: string): Promise<number> {
  const result = await pool.query(`SELECT COUNT(*)::int AS c FROM notif_email_templates WHERE tenant_id = $1`, [
    tenantId,
  ]);
  return result.rows[0]?.c ?? 0;
}
