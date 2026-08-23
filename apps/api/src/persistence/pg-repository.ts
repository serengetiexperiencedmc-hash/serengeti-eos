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
    sesMessageId?: string;
    sentAt?: string;
    createdAt: string;
  },
): Promise<void> {
  await pool.query(
    `INSERT INTO notif_email_outbox (
      id, tenant_id, principal_id, notification_key, recipient_email,
      subject, body_text, template_key, status, adapter, ses_message_id, sent_at, created_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
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
      entry.sesMessageId ?? null,
      entry.sentAt ?? null,
      entry.createdAt,
    ],
  );
}

export async function updateNotifEmailOutboxStatus(
  pool: DbPool | undefined,
  outboxId: string,
  status: string,
): Promise<void> {
  if (!pool) return;
  await pool.query(`UPDATE notif_email_outbox SET status = $2 WHERE id = $1`, [outboxId, status]);
}

export async function updateNotifEmailOutboxBySesMessageId(
  pool: DbPool | undefined,
  outboxId: string,
  sesMessageId: string,
): Promise<void> {
  if (!pool) return;
  await pool.query(`UPDATE notif_email_outbox SET ses_message_id = $2 WHERE id = $1`, [outboxId, sesMessageId]);
}

export async function insertNotifEmailDeliveryEvent(
  pool: DbPool,
  entry: import("@sedmc/kernel").NotifEmailDeliveryEvent,
  payload: Record<string, unknown>,
): Promise<void> {
  await pool.query(
    `INSERT INTO notif_email_delivery_events (
      id, tenant_id, outbox_id, event_type, ses_message_id, sns_message_id, recipient_email, payload, received_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9)
     ON CONFLICT (sns_message_id) DO NOTHING`,
    [
      entry.id,
      entry.tenantId ?? null,
      entry.outboxId ?? null,
      entry.eventType,
      entry.sesMessageId ?? null,
      entry.snsMessageId ?? null,
      entry.recipientEmail ?? null,
      JSON.stringify(payload),
      entry.receivedAt,
    ],
  );
}

export async function countNotifEmailOutbox(pool: DbPool, tenantId: string): Promise<number> {
  const result = await pool.query(`SELECT COUNT(*)::int AS c FROM notif_email_outbox WHERE tenant_id = $1`, [tenantId]);
  return result.rows[0]?.c ?? 0;
}

export async function upsertNotifEmailSuppression(
  pool: DbPool,
  entry: import("@sedmc/kernel").NotifEmailSuppression,
): Promise<void> {
  await pool.query(
    `INSERT INTO notif_email_suppressions (
      id, tenant_id, email, reason, source_event_id, created_at, lifted_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT (id) DO UPDATE SET
       reason = EXCLUDED.reason,
       source_event_id = COALESCE(EXCLUDED.source_event_id, notif_email_suppressions.source_event_id),
       lifted_at = EXCLUDED.lifted_at`,
    [
      entry.id,
      entry.tenantId,
      entry.email,
      entry.reason,
      entry.sourceEventId ?? null,
      entry.createdAt,
      entry.liftedAt ?? null,
    ],
  );
}

export async function loadNotifEmailSuppressions(
  pool: DbPool,
): Promise<import("@sedmc/kernel").NotifEmailSuppression[]> {
  const result = await pool.query(
    `SELECT id, tenant_id, email, reason, source_event_id, created_at, lifted_at
     FROM notif_email_suppressions`,
  );
  return result.rows.map((row) => ({
    id: row.id as string,
    tenantId: row.tenant_id as string,
    email: row.email as string,
    reason: row.reason as import("@sedmc/kernel").NotifEmailSuppressionReason,
    ...(row.source_event_id ? { sourceEventId: row.source_event_id as string } : {}),
    createdAt: (row.created_at as Date).toISOString(),
    ...(row.lifted_at ? { liftedAt: (row.lifted_at as Date).toISOString() } : {}),
  }));
}

export async function upsertNotifEmailAllowlist(
  pool: DbPool,
  entry: import("@sedmc/kernel").NotifEmailAllowlistEntry,
): Promise<void> {
  await pool.query(
    `INSERT INTO notif_email_allowlist (
      id, tenant_id, email, note, created_at, created_by_principal_id, revoked_at, expires_at, ses_noted_at, ses_sync_note,
      ses_dual_control_status, ses_approved_at, ses_approved_by_principal_id, ses_approval_requested_by_principal_id,
      dual_reminder_snooze_until, dual_reminder_snoozed_by_principal_id, dual_reminder_dismissed_at,
      dual_reminder_dismiss_reason, dual_reminder_dismissed_by_principal_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
     ON CONFLICT (id) DO UPDATE SET
       note = EXCLUDED.note,
       revoked_at = EXCLUDED.revoked_at,
       expires_at = EXCLUDED.expires_at,
       ses_noted_at = EXCLUDED.ses_noted_at,
       ses_sync_note = EXCLUDED.ses_sync_note,
       ses_dual_control_status = EXCLUDED.ses_dual_control_status,
       ses_approved_at = EXCLUDED.ses_approved_at,
       ses_approved_by_principal_id = EXCLUDED.ses_approved_by_principal_id,
       ses_approval_requested_by_principal_id = EXCLUDED.ses_approval_requested_by_principal_id,
       dual_reminder_snooze_until = EXCLUDED.dual_reminder_snooze_until,
       dual_reminder_snoozed_by_principal_id = EXCLUDED.dual_reminder_snoozed_by_principal_id,
       dual_reminder_dismissed_at = EXCLUDED.dual_reminder_dismissed_at,
       dual_reminder_dismiss_reason = EXCLUDED.dual_reminder_dismiss_reason,
       dual_reminder_dismissed_by_principal_id = EXCLUDED.dual_reminder_dismissed_by_principal_id`,
    [
      entry.id,
      entry.tenantId,
      entry.email,
      entry.note ?? null,
      entry.createdAt,
      entry.createdByPrincipalId ?? null,
      entry.revokedAt ?? null,
      entry.expiresAt ?? null,
      entry.sesNotedAt ?? null,
      entry.sesSyncNote ?? null,
      entry.sesDualControlStatus ?? null,
      entry.sesApprovedAt ?? null,
      entry.sesApprovedByPrincipalId ?? null,
      entry.sesApprovalRequestedByPrincipalId ?? null,
      entry.dualReminderSnoozeUntil ?? null,
      entry.dualReminderSnoozedByPrincipalId ?? null,
      entry.dualReminderDismissedAt ?? null,
      entry.dualReminderDismissReason ?? null,
      entry.dualReminderDismissedByPrincipalId ?? null,
    ],
  );
}

export async function loadNotifEmailAllowlist(
  pool: DbPool,
): Promise<import("@sedmc/kernel").NotifEmailAllowlistEntry[]> {
  const result = await pool.query(
    `SELECT id, tenant_id, email, note, created_at, created_by_principal_id, revoked_at, expires_at, ses_noted_at, ses_sync_note,
            ses_dual_control_status, ses_approved_at, ses_approved_by_principal_id, ses_approval_requested_by_principal_id,
            dual_reminder_snooze_until, dual_reminder_snoozed_by_principal_id, dual_reminder_dismissed_at,
            dual_reminder_dismiss_reason, dual_reminder_dismissed_by_principal_id
     FROM notif_email_allowlist`,
  );
  return result.rows.map((row) => ({
    id: row.id as string,
    tenantId: row.tenant_id as string,
    email: row.email as string,
    ...(row.note ? { note: row.note as string } : {}),
    createdAt: (row.created_at as Date).toISOString(),
    ...(row.created_by_principal_id ? { createdByPrincipalId: row.created_by_principal_id as string } : {}),
    ...(row.revoked_at ? { revokedAt: (row.revoked_at as Date).toISOString() } : {}),
    ...(row.expires_at ? { expiresAt: (row.expires_at as Date).toISOString() } : {}),
    ...(row.ses_noted_at ? { sesNotedAt: (row.ses_noted_at as Date).toISOString() } : {}),
    ...(row.ses_sync_note ? { sesSyncNote: row.ses_sync_note as string } : {}),
    ...(row.ses_dual_control_status
      ? { sesDualControlStatus: row.ses_dual_control_status as "not_required" | "pending" | "approved" }
      : {}),
    ...(row.ses_approved_at ? { sesApprovedAt: (row.ses_approved_at as Date).toISOString() } : {}),
    ...(row.ses_approved_by_principal_id
      ? { sesApprovedByPrincipalId: row.ses_approved_by_principal_id as string }
      : {}),
    ...(row.ses_approval_requested_by_principal_id
      ? { sesApprovalRequestedByPrincipalId: row.ses_approval_requested_by_principal_id as string }
      : {}),
    ...(row.dual_reminder_snooze_until
      ? { dualReminderSnoozeUntil: (row.dual_reminder_snooze_until as Date).toISOString() }
      : {}),
    ...(row.dual_reminder_snoozed_by_principal_id
      ? { dualReminderSnoozedByPrincipalId: row.dual_reminder_snoozed_by_principal_id as string }
      : {}),
    ...(row.dual_reminder_dismissed_at
      ? { dualReminderDismissedAt: (row.dual_reminder_dismissed_at as Date).toISOString() }
      : {}),
    ...(row.dual_reminder_dismiss_reason
      ? { dualReminderDismissReason: row.dual_reminder_dismiss_reason as string }
      : {}),
    ...(row.dual_reminder_dismissed_by_principal_id
      ? { dualReminderDismissedByPrincipalId: row.dual_reminder_dismissed_by_principal_id as string }
      : {}),
  }));
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

// --- I4.3 processed_events persistence ---

export async function insertProcessedEvent(
  pool: DbPool,
  key: import("@sedmc/kernel").ProcessedEventKey,
): Promise<void> {
  await pool.query(
    `INSERT INTO processed_events (tenant_id, consumer, event_id, processed_at)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (tenant_id, consumer, event_id) DO UPDATE SET processed_at = EXCLUDED.processed_at`,
    [key.tenantId, key.consumer, key.eventId, key.processedAt],
  );
}

export async function deleteProcessedEvent(
  pool: DbPool,
  tenantId: string,
  consumer: string,
  eventId: string,
): Promise<void> {
  await pool.query(
    `DELETE FROM processed_events WHERE tenant_id = $1 AND consumer = $2 AND event_id = $3`,
    [tenantId, consumer, eventId],
  );
}

export async function loadProcessedEvents(pool: DbPool): Promise<import("@sedmc/kernel").ProcessedEventKey[]> {
  const result = await pool.query(
    `SELECT tenant_id, consumer, event_id, processed_at FROM processed_events ORDER BY processed_at ASC`,
  );
  return result.rows.map((row) => ({
    tenantId: row.tenant_id as string,
    consumer: row.consumer as string,
    eventId: row.event_id as string,
    processedAt: new Date(row.processed_at as string).toISOString(),
  }));
}

export async function countProcessedEvents(pool: DbPool, tenantId: string, consumer?: string): Promise<number> {
  const result = consumer
    ? await pool.query(
        `SELECT COUNT(*)::int AS c FROM processed_events WHERE tenant_id = $1 AND consumer = $2`,
        [tenantId, consumer],
      )
    : await pool.query(`SELECT COUNT(*)::int AS c FROM processed_events WHERE tenant_id = $1`, [tenantId]);
  return result.rows[0]?.c ?? 0;
}

// --- I4.4 NATS consumer offsets ---

export async function upsertNatsConsumerOffset(
  pool: DbPool,
  offset: import("@sedmc/kernel").NatsConsumerOffset,
): Promise<void> {
  await pool.query(
    `INSERT INTO nats_consumer_offsets (tenant_id, consumer, stream, last_stream_seq, last_event_id, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (tenant_id, consumer, stream) DO UPDATE SET
       last_stream_seq = GREATEST(nats_consumer_offsets.last_stream_seq, EXCLUDED.last_stream_seq),
       last_event_id = EXCLUDED.last_event_id,
       updated_at = EXCLUDED.updated_at`,
    [
      offset.tenantId,
      offset.consumer,
      offset.stream,
      offset.lastStreamSeq,
      offset.lastEventId ?? null,
      offset.updatedAt,
    ],
  );
}

export async function loadNatsConsumerOffsets(pool: DbPool): Promise<import("@sedmc/kernel").NatsConsumerOffset[]> {
  const result = await pool.query(
    `SELECT tenant_id, consumer, stream, last_stream_seq, last_event_id, updated_at
     FROM nats_consumer_offsets ORDER BY updated_at ASC`,
  );
  return result.rows.map((row) => ({
    tenantId: row.tenant_id as string,
    consumer: row.consumer as string,
    stream: row.stream as string,
    lastStreamSeq: Number(row.last_stream_seq),
    ...(row.last_event_id ? { lastEventId: row.last_event_id as string } : {}),
    updatedAt: new Date(row.updated_at as string).toISOString(),
  }));
}

export async function countNatsConsumerOffsets(pool: DbPool, tenantId: string): Promise<number> {
  const result = await pool.query(`SELECT COUNT(*)::int AS c FROM nats_consumer_offsets WHERE tenant_id = $1`, [
    tenantId,
  ]);
  return result.rows[0]?.c ?? 0;
}

// --- PG.4 CRM external IDs, duplicates, imports ---

export async function upsertCrmExternalIdentifier(
  pool: DbPool,
  ext: import("@sedmc/kernel").CrmExternalIdentifier,
): Promise<void> {
  await pool.query(
    `INSERT INTO crm_external_identifiers (
      id, tenant_id, system_key, external_id, entity_type, entity_id, created_at, created_by_principal_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (id) DO UPDATE SET
       system_key = EXCLUDED.system_key,
       external_id = EXCLUDED.external_id,
       entity_type = EXCLUDED.entity_type,
       entity_id = EXCLUDED.entity_id`,
    [
      ext.id,
      ext.tenantId,
      ext.systemKey,
      ext.externalId,
      ext.entityType,
      ext.entityId,
      ext.createdAt,
      ext.createdByPrincipalId,
    ],
  );
}

export async function deleteCrmExternalIdentifier(pool: DbPool, id: string): Promise<void> {
  await pool.query(`DELETE FROM crm_external_identifiers WHERE id = $1`, [id]);
}

export async function loadCrmExternalIdentifiers(
  pool: DbPool,
): Promise<import("@sedmc/kernel").CrmExternalIdentifier[]> {
  const result = await pool.query(`SELECT * FROM crm_external_identifiers ORDER BY created_at ASC`);
  return result.rows.map((row) => ({
    id: row.id as string,
    tenantId: row.tenant_id as string,
    systemKey: row.system_key as string,
    externalId: row.external_id as string,
    entityType: row.entity_type as string,
    entityId: row.entity_id as string,
    createdAt: new Date(row.created_at as string).toISOString(),
    createdByPrincipalId: row.created_by_principal_id as string,
  }));
}

export async function countCrmExternalIdentifiers(pool: DbPool, tenantId: string): Promise<number> {
  const result = await pool.query(`SELECT COUNT(*)::int AS c FROM crm_external_identifiers WHERE tenant_id = $1`, [
    tenantId,
  ]);
  return result.rows[0]?.c ?? 0;
}

export async function upsertCrmDuplicateCandidate(
  pool: DbPool,
  row: import("@sedmc/kernel").CrmDuplicateCandidate,
): Promise<void> {
  await pool.query(
    `INSERT INTO crm_duplicate_candidates (
      id, tenant_id, entity_type, entity_id_a, entity_id_b, score, status,
      detection_rule, match_reason, detected_at, reviewed_at, reviewed_by_principal_id, review_reason
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     ON CONFLICT (id) DO UPDATE SET
       status = EXCLUDED.status,
       reviewed_at = EXCLUDED.reviewed_at,
       reviewed_by_principal_id = EXCLUDED.reviewed_by_principal_id,
       review_reason = EXCLUDED.review_reason`,
    [
      row.id,
      row.tenantId,
      row.entityType,
      row.entityIdA,
      row.entityIdB,
      row.score,
      row.status,
      row.detectionRule ?? null,
      row.matchReason ?? null,
      row.detectedAt,
      row.reviewedAt ?? null,
      row.reviewedByPrincipalId ?? null,
      row.reviewReason ?? null,
    ],
  );
}

export async function loadCrmDuplicateCandidates(
  pool: DbPool,
): Promise<import("@sedmc/kernel").CrmDuplicateCandidate[]> {
  const result = await pool.query(`SELECT * FROM crm_duplicate_candidates ORDER BY detected_at ASC`);
  return result.rows.map((row) => ({
    id: row.id as string,
    tenantId: row.tenant_id as string,
    entityType: row.entity_type as "organization" | "contact",
    entityIdA: row.entity_id_a as string,
    entityIdB: row.entity_id_b as string,
    score: Number(row.score),
    status: row.status as import("@sedmc/kernel").CrmDuplicateCandidate["status"],
    ...(row.detection_rule ? { detectionRule: row.detection_rule as string } : {}),
    ...(row.match_reason ? { matchReason: row.match_reason as string } : {}),
    detectedAt: new Date(row.detected_at as string).toISOString(),
    ...(row.reviewed_at ? { reviewedAt: new Date(row.reviewed_at as string).toISOString() } : {}),
    ...(row.reviewed_by_principal_id
      ? { reviewedByPrincipalId: row.reviewed_by_principal_id as string }
      : {}),
    ...(row.review_reason ? { reviewReason: row.review_reason as string } : {}),
  }));
}

export async function countCrmDuplicateCandidates(pool: DbPool, tenantId: string): Promise<number> {
  const result = await pool.query(`SELECT COUNT(*)::int AS c FROM crm_duplicate_candidates WHERE tenant_id = $1`, [
    tenantId,
  ]);
  return result.rows[0]?.c ?? 0;
}

export async function upsertCrmImportBatch(pool: DbPool, batch: import("@sedmc/kernel").CrmImportBatch): Promise<void> {
  await pool.query(
    `INSERT INTO crm_import_batches (
      id, tenant_id, source_system, entity_type, mode, status, row_count,
      valid_count, invalid_count, committed_count, csv_content, validation_results,
      execute_idempotency_key, created_at, validated_at, committed_at,
      created_by_principal_id, committed_by_principal_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13,$14,$15,$16,$17,$18)
     ON CONFLICT (id) DO UPDATE SET
       status = EXCLUDED.status,
       valid_count = EXCLUDED.valid_count,
       invalid_count = EXCLUDED.invalid_count,
       committed_count = EXCLUDED.committed_count,
       validation_results = EXCLUDED.validation_results,
       execute_idempotency_key = EXCLUDED.execute_idempotency_key,
       validated_at = EXCLUDED.validated_at,
       committed_at = EXCLUDED.committed_at,
       committed_by_principal_id = EXCLUDED.committed_by_principal_id`,
    [
      batch.id,
      batch.tenantId,
      batch.sourceSystem,
      batch.entityType,
      batch.mode,
      batch.status,
      batch.rowCount,
      batch.validCount ?? null,
      batch.invalidCount ?? null,
      batch.committedCount ?? null,
      batch.csvContent,
      batch.validationResults ? JSON.stringify(batch.validationResults) : null,
      batch.executeIdempotencyKey ?? null,
      batch.createdAt,
      batch.validatedAt ?? null,
      batch.committedAt ?? null,
      batch.createdByPrincipalId,
      batch.committedByPrincipalId ?? null,
    ],
  );
}

export async function loadCrmImportBatches(pool: DbPool): Promise<import("@sedmc/kernel").CrmImportBatch[]> {
  const result = await pool.query(`SELECT * FROM crm_import_batches ORDER BY created_at ASC`);
  return result.rows.map((row) => ({
    id: row.id as string,
    tenantId: row.tenant_id as string,
    sourceSystem: row.source_system as string,
    entityType: row.entity_type as "organization" | "contact",
    mode: (row.mode as "create_only") ?? "create_only",
    status: row.status as import("@sedmc/kernel").CrmImportBatch["status"],
    rowCount: row.row_count as number,
    ...(row.valid_count != null ? { validCount: row.valid_count as number } : {}),
    ...(row.invalid_count != null ? { invalidCount: row.invalid_count as number } : {}),
    ...(row.committed_count != null ? { committedCount: row.committed_count as number } : {}),
    csvContent: (row.csv_content as string) ?? "",
    ...(row.validation_results
      ? { validationResults: row.validation_results as import("@sedmc/kernel").CrmImportRowResult[] }
      : {}),
    ...(row.execute_idempotency_key ? { executeIdempotencyKey: row.execute_idempotency_key as string } : {}),
    createdAt: new Date(row.created_at as string).toISOString(),
    ...(row.validated_at ? { validatedAt: new Date(row.validated_at as string).toISOString() } : {}),
    ...(row.committed_at ? { committedAt: new Date(row.committed_at as string).toISOString() } : {}),
    createdByPrincipalId: row.created_by_principal_id as string,
    ...(row.committed_by_principal_id
      ? { committedByPrincipalId: row.committed_by_principal_id as string }
      : {}),
  }));
}

export async function countCrmImportBatches(pool: DbPool, tenantId: string): Promise<number> {
  const result = await pool.query(`SELECT COUNT(*)::int AS c FROM crm_import_batches WHERE tenant_id = $1`, [tenantId]);
  return result.rows[0]?.c ?? 0;
}

// --- PG.5 supplier import batches ---

export async function upsertSupImportBatch(pool: DbPool, batch: import("@sedmc/kernel").SupImportBatch): Promise<void> {
  await pool.query(
    `INSERT INTO sup_import_batches (
      id, tenant_id, source_system, entity_type, mode, status, row_count,
      valid_count, invalid_count, committed_count, csv_content, validation_results,
      execute_idempotency_key, created_at, validated_at, committed_at,
      created_by_principal_id, committed_by_principal_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13,$14,$15,$16,$17,$18)
     ON CONFLICT (id) DO UPDATE SET
       status = EXCLUDED.status,
       valid_count = EXCLUDED.valid_count,
       invalid_count = EXCLUDED.invalid_count,
       committed_count = EXCLUDED.committed_count,
       validation_results = EXCLUDED.validation_results,
       execute_idempotency_key = EXCLUDED.execute_idempotency_key,
       validated_at = EXCLUDED.validated_at,
       committed_at = EXCLUDED.committed_at,
       committed_by_principal_id = EXCLUDED.committed_by_principal_id`,
    [
      batch.id,
      batch.tenantId,
      batch.sourceSystem,
      batch.entityType,
      batch.mode,
      batch.status,
      batch.rowCount,
      batch.validCount ?? null,
      batch.invalidCount ?? null,
      batch.committedCount ?? null,
      batch.csvContent,
      batch.validationResults ? JSON.stringify(batch.validationResults) : null,
      batch.executeIdempotencyKey ?? null,
      batch.createdAt,
      batch.validatedAt ?? null,
      batch.committedAt ?? null,
      batch.createdByPrincipalId,
      batch.committedByPrincipalId ?? null,
    ],
  );
}

export async function loadSupImportBatches(pool: DbPool): Promise<import("@sedmc/kernel").SupImportBatch[]> {
  const result = await pool.query(`SELECT * FROM sup_import_batches ORDER BY created_at ASC`);
  return result.rows.map((row) => ({
    id: row.id as string,
    tenantId: row.tenant_id as string,
    sourceSystem: row.source_system as string,
    entityType: row.entity_type as import("@sedmc/kernel").SupImportBatch["entityType"],
    mode: row.mode as import("@sedmc/kernel").SupImportBatch["mode"],
    status: row.status as import("@sedmc/kernel").SupImportBatch["status"],
    rowCount: row.row_count as number,
    ...(row.valid_count != null ? { validCount: row.valid_count as number } : {}),
    ...(row.invalid_count != null ? { invalidCount: row.invalid_count as number } : {}),
    ...(row.committed_count != null ? { committedCount: row.committed_count as number } : {}),
    csvContent: (row.csv_content as string) ?? "",
    ...(row.validation_results
      ? { validationResults: row.validation_results as import("@sedmc/kernel").SupImportRowResult[] }
      : {}),
    ...(row.execute_idempotency_key ? { executeIdempotencyKey: row.execute_idempotency_key as string } : {}),
    createdAt: new Date(row.created_at as string).toISOString(),
    ...(row.validated_at ? { validatedAt: new Date(row.validated_at as string).toISOString() } : {}),
    ...(row.committed_at ? { committedAt: new Date(row.committed_at as string).toISOString() } : {}),
    createdByPrincipalId: row.created_by_principal_id as string,
    ...(row.committed_by_principal_id
      ? { committedByPrincipalId: row.committed_by_principal_id as string }
      : {}),
  }));
}

export async function countSupImportBatches(pool: DbPool, tenantId: string): Promise<number> {
  const result = await pool.query(`SELECT COUNT(*)::int AS c FROM sup_import_batches WHERE tenant_id = $1`, [tenantId]);
  return result.rows[0]?.c ?? 0;
}

// --- PG.6 supplier entities ---

export async function upsertSupSupplier(pool: DbPool, s: import("@sedmc/kernel").SupSupplier): Promise<void> {
  await pool.query(
    `INSERT INTO sup_suppliers (
      id, tenant_id, supplier_code, legal_name, trading_name, category, subcategory, country, region, city,
      address, latitude, longitude, telephone, email, website, status, preferred_partner, payment_terms_days,
      default_currency, tax_registration_number, contract_ref, contract_valid_from, contract_valid_to, notes,
      data_quality_status, classification, source_system, source_record_id, import_batch_id, version,
      archived_at, created_at, updated_at, created_by_principal_id, updated_by_principal_id
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36
    )
    ON CONFLICT (id) DO UPDATE SET
      legal_name = EXCLUDED.legal_name,
      trading_name = EXCLUDED.trading_name,
      category = EXCLUDED.category,
      subcategory = EXCLUDED.subcategory,
      country = EXCLUDED.country,
      region = EXCLUDED.region,
      city = EXCLUDED.city,
      address = EXCLUDED.address,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      telephone = EXCLUDED.telephone,
      email = EXCLUDED.email,
      website = EXCLUDED.website,
      status = EXCLUDED.status,
      preferred_partner = EXCLUDED.preferred_partner,
      payment_terms_days = EXCLUDED.payment_terms_days,
      default_currency = EXCLUDED.default_currency,
      tax_registration_number = EXCLUDED.tax_registration_number,
      contract_ref = EXCLUDED.contract_ref,
      contract_valid_from = EXCLUDED.contract_valid_from,
      contract_valid_to = EXCLUDED.contract_valid_to,
      notes = EXCLUDED.notes,
      data_quality_status = EXCLUDED.data_quality_status,
      classification = EXCLUDED.classification,
      source_system = EXCLUDED.source_system,
      source_record_id = EXCLUDED.source_record_id,
      import_batch_id = EXCLUDED.import_batch_id,
      version = EXCLUDED.version,
      archived_at = EXCLUDED.archived_at,
      updated_at = EXCLUDED.updated_at,
      updated_by_principal_id = EXCLUDED.updated_by_principal_id`,
    [
      s.id, s.tenantId, s.supplierCode, s.legalName, s.tradingName ?? null, s.category, s.subcategory ?? null,
      s.country, s.region ?? null, s.city ?? null, s.address ?? null, s.latitude ?? null, s.longitude ?? null,
      s.telephone ?? null, s.email ?? null, s.website ?? null, s.status, s.preferredPartner,
      s.paymentTermsDays ?? null, s.defaultCurrency ?? null, s.taxRegistrationNumber ?? null,
      s.contractRef ?? null, s.contractValidFrom ?? null, s.contractValidTo ?? null, s.notes ?? null,
      s.dataQualityStatus, s.classification, s.sourceSystem ?? null, s.sourceRecordId ?? null,
      s.importBatchId ?? null, s.version, s.archivedAt ?? null, s.createdAt, s.updatedAt,
      s.createdByPrincipalId, s.updatedByPrincipalId,
    ],
  );
}

function mapSupSupplierRow(row: Record<string, unknown>): import("@sedmc/kernel").SupSupplier {
  return {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    supplierCode: row.supplier_code as string,
    legalName: row.legal_name as string,
    ...(row.trading_name ? { tradingName: row.trading_name as string } : {}),
    category: row.category as import("@sedmc/kernel").SupSupplier["category"],
    ...(row.subcategory ? { subcategory: row.subcategory as string } : {}),
    country: row.country as string,
    ...(row.region ? { region: row.region as string } : {}),
    ...(row.city ? { city: row.city as string } : {}),
    ...(row.address ? { address: row.address as string } : {}),
    ...(row.latitude != null ? { latitude: Number(row.latitude) } : {}),
    ...(row.longitude != null ? { longitude: Number(row.longitude) } : {}),
    ...(row.telephone ? { telephone: row.telephone as string } : {}),
    ...(row.email ? { email: row.email as string } : {}),
    ...(row.website ? { website: row.website as string } : {}),
    status: row.status as import("@sedmc/kernel").SupSupplier["status"],
    preferredPartner: row.preferred_partner as boolean,
    ...(row.payment_terms_days != null ? { paymentTermsDays: row.payment_terms_days as number } : {}),
    ...(row.default_currency ? { defaultCurrency: row.default_currency as string } : {}),
    ...(row.tax_registration_number ? { taxRegistrationNumber: row.tax_registration_number as string } : {}),
    ...(row.contract_ref ? { contractRef: row.contract_ref as string } : {}),
    ...(row.contract_valid_from ? { contractValidFrom: String(row.contract_valid_from).slice(0, 10) } : {}),
    ...(row.contract_valid_to ? { contractValidTo: String(row.contract_valid_to).slice(0, 10) } : {}),
    ...(row.notes ? { notes: row.notes as string } : {}),
    dataQualityStatus: row.data_quality_status as import("@sedmc/kernel").SupSupplier["dataQualityStatus"],
    classification: row.classification as import("@sedmc/kernel").SupSupplier["classification"],
    ...(row.source_system ? { sourceSystem: row.source_system as string } : {}),
    ...(row.source_record_id ? { sourceRecordId: row.source_record_id as string } : {}),
    ...(row.import_batch_id ? { importBatchId: row.import_batch_id as string } : {}),
    version: row.version as number,
    ...(row.archived_at ? { archivedAt: new Date(row.archived_at as string).toISOString() } : {}),
    createdAt: new Date(row.created_at as string).toISOString(),
    updatedAt: new Date(row.updated_at as string).toISOString(),
    createdByPrincipalId: row.created_by_principal_id as string,
    updatedByPrincipalId: row.updated_by_principal_id as string,
  };
}

export async function loadSupSuppliers(pool: DbPool): Promise<import("@sedmc/kernel").SupSupplier[]> {
  const result = await pool.query(`SELECT * FROM sup_suppliers ORDER BY created_at ASC`);
  return result.rows.map(mapSupSupplierRow);
}

export async function countSupSuppliers(pool: DbPool, tenantId: string): Promise<number> {
  const result = await pool.query(`SELECT COUNT(*)::int AS c FROM sup_suppliers WHERE tenant_id = $1`, [tenantId]);
  return result.rows[0]?.c ?? 0;
}

export async function upsertSupContact(pool: DbPool, c: import("@sedmc/kernel").SupContact): Promise<void> {
  await pool.query(
    `INSERT INTO sup_contacts (
      id, tenant_id, supplier_id, contact_role, given_name, family_name, email, telephone, whatsapp,
      is_primary, notes, import_batch_id, version, archived_at, created_at, updated_at,
      created_by_principal_id, updated_by_principal_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
    ON CONFLICT (id) DO UPDATE SET
      contact_role = EXCLUDED.contact_role,
      given_name = EXCLUDED.given_name,
      family_name = EXCLUDED.family_name,
      email = EXCLUDED.email,
      telephone = EXCLUDED.telephone,
      whatsapp = EXCLUDED.whatsapp,
      is_primary = EXCLUDED.is_primary,
      notes = EXCLUDED.notes,
      import_batch_id = EXCLUDED.import_batch_id,
      version = EXCLUDED.version,
      archived_at = EXCLUDED.archived_at,
      updated_at = EXCLUDED.updated_at,
      updated_by_principal_id = EXCLUDED.updated_by_principal_id`,
    [
      c.id, c.tenantId, c.supplierId, c.contactRole, c.givenName, c.familyName, c.email ?? null,
      c.telephone ?? null, c.whatsapp ?? null, c.isPrimary, c.notes ?? null, c.importBatchId ?? null,
      c.version, c.archivedAt ?? null, c.createdAt, c.updatedAt, c.createdByPrincipalId, c.updatedByPrincipalId,
    ],
  );
}

export async function loadSupContacts(pool: DbPool): Promise<import("@sedmc/kernel").SupContact[]> {
  const result = await pool.query(`SELECT * FROM sup_contacts ORDER BY created_at ASC`);
  return result.rows.map((row) => ({
    id: row.id as string,
    tenantId: row.tenant_id as string,
    supplierId: row.supplier_id as string,
    contactRole: row.contact_role as string,
    givenName: row.given_name as string,
    familyName: row.family_name as string,
    ...(row.email ? { email: row.email as string } : {}),
    ...(row.telephone ? { telephone: row.telephone as string } : {}),
    ...(row.whatsapp ? { whatsapp: row.whatsapp as string } : {}),
    isPrimary: row.is_primary as boolean,
    ...(row.notes ? { notes: row.notes as string } : {}),
    ...(row.import_batch_id ? { importBatchId: row.import_batch_id as string } : {}),
    version: row.version as number,
    ...(row.archived_at ? { archivedAt: new Date(row.archived_at as string).toISOString() } : {}),
    createdAt: new Date(row.created_at as string).toISOString(),
    updatedAt: new Date(row.updated_at as string).toISOString(),
    createdByPrincipalId: row.created_by_principal_id as string,
    updatedByPrincipalId: row.updated_by_principal_id as string,
  }));
}

export async function countSupContacts(pool: DbPool, tenantId: string): Promise<number> {
  const result = await pool.query(`SELECT COUNT(*)::int AS c FROM sup_contacts WHERE tenant_id = $1`, [tenantId]);
  return result.rows[0]?.c ?? 0;
}

export async function upsertSupRate(pool: DbPool, r: import("@sedmc/kernel").SupRate): Promise<void> {
  await pool.query(
    `INSERT INTO sup_rates (
      id, tenant_id, supplier_id, rate_code, rate_name, rate_type, unit_description, amount, currency,
      valid_from, valid_to, season_label, season_id, min_pax, max_pax, min_nights, commission_percent, includes_tax,
      tax_percent, cancellation_policy_ref, notes, status, import_batch_id, version, archived_at,
      created_at, updated_at, created_by_principal_id, updated_by_principal_id, preferred_in_conflict
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30
    )
    ON CONFLICT (id) DO UPDATE SET
      rate_name = EXCLUDED.rate_name,
      rate_type = EXCLUDED.rate_type,
      unit_description = EXCLUDED.unit_description,
      amount = EXCLUDED.amount,
      currency = EXCLUDED.currency,
      valid_from = EXCLUDED.valid_from,
      valid_to = EXCLUDED.valid_to,
      season_label = EXCLUDED.season_label,
      season_id = EXCLUDED.season_id,
      min_pax = EXCLUDED.min_pax,
      max_pax = EXCLUDED.max_pax,
      min_nights = EXCLUDED.min_nights,
      commission_percent = EXCLUDED.commission_percent,
      includes_tax = EXCLUDED.includes_tax,
      tax_percent = EXCLUDED.tax_percent,
      cancellation_policy_ref = EXCLUDED.cancellation_policy_ref,
      notes = EXCLUDED.notes,
      status = EXCLUDED.status,
      import_batch_id = EXCLUDED.import_batch_id,
      version = EXCLUDED.version,
      archived_at = EXCLUDED.archived_at,
      updated_at = EXCLUDED.updated_at,
      updated_by_principal_id = EXCLUDED.updated_by_principal_id,
      preferred_in_conflict = EXCLUDED.preferred_in_conflict`,
    [
      r.id, r.tenantId, r.supplierId, r.rateCode, r.rateName, r.rateType, r.unitDescription ?? null, r.amount,
      r.currency, r.validFrom, r.validTo, r.seasonLabel ?? null, r.seasonId ?? null, r.minPax ?? null, r.maxPax ?? null,
      r.minNights ?? null, r.commissionPercent ?? null, r.includesTax, r.taxPercent ?? null,
      r.cancellationPolicyRef ?? null, r.notes ?? null, r.status, r.importBatchId ?? null, r.version,
      r.archivedAt ?? null, r.createdAt, r.updatedAt, r.createdByPrincipalId, r.updatedByPrincipalId,
      Boolean(r.preferredInConflict),
    ],
  );
}

export async function loadSupRates(pool: DbPool): Promise<import("@sedmc/kernel").SupRate[]> {
  const result = await pool.query(`SELECT * FROM sup_rates ORDER BY created_at ASC`);
  return result.rows.map((row) => ({
    id: row.id as string,
    tenantId: row.tenant_id as string,
    supplierId: row.supplier_id as string,
    rateCode: row.rate_code as string,
    rateName: row.rate_name as string,
    rateType: row.rate_type as string,
    ...(row.unit_description ? { unitDescription: row.unit_description as string } : {}),
    amount: Number(row.amount),
    currency: row.currency as string,
    validFrom: String(row.valid_from).slice(0, 10),
    validTo: String(row.valid_to).slice(0, 10),
    ...(row.season_label ? { seasonLabel: row.season_label as string } : {}),
    ...(row.season_id ? { seasonId: row.season_id as string } : {}),
    ...(row.min_pax != null ? { minPax: row.min_pax as number } : {}),
    ...(row.max_pax != null ? { maxPax: row.max_pax as number } : {}),
    ...(row.min_nights != null ? { minNights: row.min_nights as number } : {}),
    ...(row.commission_percent != null ? { commissionPercent: Number(row.commission_percent) } : {}),
    includesTax: row.includes_tax as boolean,
    ...(row.tax_percent != null ? { taxPercent: Number(row.tax_percent) } : {}),
    ...(row.cancellation_policy_ref ? { cancellationPolicyRef: row.cancellation_policy_ref as string } : {}),
    ...(row.notes ? { notes: row.notes as string } : {}),
    status: row.status as string,
    ...(row.preferred_in_conflict ? { preferredInConflict: true } : {}),
    ...(row.import_batch_id ? { importBatchId: row.import_batch_id as string } : {}),
    version: row.version as number,
    ...(row.archived_at ? { archivedAt: new Date(row.archived_at as string).toISOString() } : {}),
    createdAt: new Date(row.created_at as string).toISOString(),
    updatedAt: new Date(row.updated_at as string).toISOString(),
    createdByPrincipalId: row.created_by_principal_id as string,
    updatedByPrincipalId: row.updated_by_principal_id as string,
  }));
}

/** PG.28 — upsert named season catalogue row. */
export async function upsertSupSeason(pool: DbPool, s: import("@sedmc/kernel").SupSeason): Promise<void> {
  await pool.query(
    `INSERT INTO sup_seasons (
      id, tenant_id, season_code, label, valid_from, valid_to, month_from, month_to,
      version, archived_at, created_at, updated_at, created_by_principal_id, updated_by_principal_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     ON CONFLICT (id) DO UPDATE SET
       season_code = EXCLUDED.season_code,
       label = EXCLUDED.label,
       valid_from = EXCLUDED.valid_from,
       valid_to = EXCLUDED.valid_to,
       month_from = EXCLUDED.month_from,
       month_to = EXCLUDED.month_to,
       version = EXCLUDED.version,
       archived_at = EXCLUDED.archived_at,
       updated_at = EXCLUDED.updated_at,
       updated_by_principal_id = EXCLUDED.updated_by_principal_id`,
    [
      s.id,
      s.tenantId,
      s.seasonCode,
      s.label,
      s.validFrom ?? null,
      s.validTo ?? null,
      s.monthFrom ?? null,
      s.monthTo ?? null,
      s.version,
      s.archivedAt ?? null,
      s.createdAt,
      s.updatedAt,
      s.createdByPrincipalId,
      s.updatedByPrincipalId,
    ],
  );
}

export async function loadSupSeasons(pool: DbPool): Promise<import("@sedmc/kernel").SupSeason[]> {
  const result = await pool.query(`SELECT * FROM sup_seasons ORDER BY created_at ASC`);
  return result.rows.map((row) => ({
    id: row.id as string,
    tenantId: row.tenant_id as string,
    seasonCode: row.season_code as string,
    label: row.label as string,
    ...(row.valid_from ? { validFrom: String(row.valid_from).slice(0, 10) } : {}),
    ...(row.valid_to ? { validTo: String(row.valid_to).slice(0, 10) } : {}),
    ...(row.month_from != null ? { monthFrom: Number(row.month_from) } : {}),
    ...(row.month_to != null ? { monthTo: Number(row.month_to) } : {}),
    version: Number(row.version ?? 1),
    ...(row.archived_at ? { archivedAt: (row.archived_at as Date).toISOString() } : {}),
    createdAt: (row.created_at as Date).toISOString(),
    updatedAt: (row.updated_at as Date).toISOString(),
    createdByPrincipalId: row.created_by_principal_id as string,
    updatedByPrincipalId: row.updated_by_principal_id as string,
  }));
}

export async function countSupRates(pool: DbPool, tenantId: string): Promise<number> {
  const result = await pool.query(`SELECT COUNT(*)::int AS c FROM sup_rates WHERE tenant_id = $1`, [tenantId]);
  return result.rows[0]?.c ?? 0;
}

export async function upsertSupContentBlock(pool: DbPool, b: import("@sedmc/kernel").SupContentBlock): Promise<void> {
  await pool.query(
    `INSERT INTO sup_content_blocks (
      id, tenant_id, supplier_id, block_code, block_type, title, body, language, asset_filename,
      asset_alt_text, tags, is_default, status, import_batch_id, version, archived_at,
      created_at, updated_at, created_by_principal_id, updated_by_principal_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
    ON CONFLICT (id) DO UPDATE SET
      block_type = EXCLUDED.block_type,
      title = EXCLUDED.title,
      body = EXCLUDED.body,
      language = EXCLUDED.language,
      asset_filename = EXCLUDED.asset_filename,
      asset_alt_text = EXCLUDED.asset_alt_text,
      tags = EXCLUDED.tags,
      is_default = EXCLUDED.is_default,
      status = EXCLUDED.status,
      import_batch_id = EXCLUDED.import_batch_id,
      version = EXCLUDED.version,
      archived_at = EXCLUDED.archived_at,
      updated_at = EXCLUDED.updated_at,
      updated_by_principal_id = EXCLUDED.updated_by_principal_id`,
    [
      b.id, b.tenantId, b.supplierId, b.blockCode, b.blockType, b.title ?? null, b.body, b.language,
      b.assetFilename ?? null, b.assetAltText ?? null, b.tags ?? null, b.isDefault, b.status,
      b.importBatchId ?? null, b.version, b.archivedAt ?? null, b.createdAt, b.updatedAt,
      b.createdByPrincipalId, b.updatedByPrincipalId,
    ],
  );
}

export async function loadSupContentBlocks(pool: DbPool): Promise<import("@sedmc/kernel").SupContentBlock[]> {
  const result = await pool.query(`SELECT * FROM sup_content_blocks ORDER BY created_at ASC`);
  return result.rows.map((row) => ({
    id: row.id as string,
    tenantId: row.tenant_id as string,
    supplierId: row.supplier_id as string,
    blockCode: row.block_code as string,
    blockType: row.block_type as string,
    ...(row.title ? { title: row.title as string } : {}),
    body: row.body as string,
    language: row.language as string,
    ...(row.asset_filename ? { assetFilename: row.asset_filename as string } : {}),
    ...(row.asset_alt_text ? { assetAltText: row.asset_alt_text as string } : {}),
    ...(row.tags ? { tags: row.tags as string[] } : {}),
    isDefault: row.is_default as boolean,
    status: row.status as string,
    ...(row.import_batch_id ? { importBatchId: row.import_batch_id as string } : {}),
    version: row.version as number,
    ...(row.archived_at ? { archivedAt: new Date(row.archived_at as string).toISOString() } : {}),
    createdAt: new Date(row.created_at as string).toISOString(),
    updatedAt: new Date(row.updated_at as string).toISOString(),
    createdByPrincipalId: row.created_by_principal_id as string,
    updatedByPrincipalId: row.updated_by_principal_id as string,
  }));
}

export async function countSupContentBlocks(pool: DbPool, tenantId: string): Promise<number> {
  const result = await pool.query(`SELECT COUNT(*)::int AS c FROM sup_content_blocks WHERE tenant_id = $1`, [tenantId]);
  return result.rows[0]?.c ?? 0;
}

// --- PG.7 supplier import execute idempotency ---

export function supImportExecutePgKey(batchId: string, clientKey: string): string {
  return `${batchId}:${clientKey}`;
}

export function supImportExecuteStoreKey(tenantId: string, batchId: string, clientKey: string): string {
  return `${tenantId}:${batchId}:${clientKey}`;
}

export async function upsertSupImportExecuteIdempotency(
  pool: DbPool,
  row: { tenantId: string; batchId: string; clientKey: string },
): Promise<void> {
  await pool.query(
    `INSERT INTO sup_import_execute_idempotency (tenant_id, idempotency_key, batch_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (tenant_id, idempotency_key) DO UPDATE SET batch_id = EXCLUDED.batch_id`,
    [row.tenantId, supImportExecutePgKey(row.batchId, row.clientKey), row.batchId],
  );
}

export async function loadSupImportExecuteIdempotencies(
  pool: DbPool,
): Promise<Array<{ storeKey: string; status: string }>> {
  const result = await pool.query(
    `SELECT tenant_id, idempotency_key, batch_id FROM sup_import_execute_idempotency`,
  );
  return result.rows.map((row) => {
    const tenantId = row.tenant_id as string;
    const pgKey = row.idempotency_key as string;
    const batchId = row.batch_id as string;
    const clientKey = pgKey.startsWith(`${batchId}:`) ? pgKey.slice(batchId.length + 1) : pgKey;
    return {
      storeKey: supImportExecuteStoreKey(tenantId, batchId, clientKey),
      status: "committed",
    };
  });
}

export async function countSupImportExecuteIdempotencies(pool: DbPool, tenantId: string): Promise<number> {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS c FROM sup_import_execute_idempotency WHERE tenant_id = $1`,
    [tenantId],
  );
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

export async function upsertCrmAccount(pool: DbPool, account: import("@sedmc/kernel").CrmAccount): Promise<void> {
  await pool.query(
    `INSERT INTO crm_accounts (
      id, tenant_id, organization_id, relationship_id, account_name, owner_principal_id,
      market, strategic_classification, priority, next_action, status, classification,
      version, archived_at, created_at, updated_at, created_by_principal_id, updated_by_principal_id
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18
    )
    ON CONFLICT (id) DO UPDATE SET
      organization_id = EXCLUDED.organization_id,
      relationship_id = EXCLUDED.relationship_id,
      account_name = EXCLUDED.account_name,
      owner_principal_id = EXCLUDED.owner_principal_id,
      market = EXCLUDED.market,
      strategic_classification = EXCLUDED.strategic_classification,
      priority = EXCLUDED.priority,
      next_action = EXCLUDED.next_action,
      status = EXCLUDED.status,
      classification = EXCLUDED.classification,
      version = EXCLUDED.version,
      archived_at = EXCLUDED.archived_at,
      updated_at = EXCLUDED.updated_at,
      updated_by_principal_id = EXCLUDED.updated_by_principal_id`,
    [
      account.id,
      account.tenantId,
      account.organizationId,
      account.relationshipId ?? null,
      account.accountName,
      account.ownerPrincipalId,
      account.market ?? null,
      account.strategicClassification ?? null,
      account.priority ?? null,
      account.nextAction ?? null,
      account.status,
      account.classification,
      account.version,
      account.archivedAt ?? null,
      account.createdAt,
      account.updatedAt,
      account.createdByPrincipalId,
      account.updatedByPrincipalId,
    ],
  );
}

export async function upsertCrmNote(pool: DbPool, note: import("@sedmc/kernel").CrmNote): Promise<void> {
  await pool.query(
    `INSERT INTO crm_notes (
      id, tenant_id, body, entity_type, entity_id, classification,
      version, archived_at, created_at, updated_at, created_by_principal_id, updated_by_principal_id
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
    )
    ON CONFLICT (id) DO UPDATE SET
      body = EXCLUDED.body,
      entity_type = EXCLUDED.entity_type,
      entity_id = EXCLUDED.entity_id,
      classification = EXCLUDED.classification,
      version = EXCLUDED.version,
      archived_at = EXCLUDED.archived_at,
      updated_at = EXCLUDED.updated_at,
      updated_by_principal_id = EXCLUDED.updated_by_principal_id`,
    [
      note.id,
      note.tenantId,
      note.body,
      note.entityType,
      note.entityId,
      note.classification,
      note.version,
      note.archivedAt ?? null,
      note.createdAt,
      note.updatedAt,
      note.createdByPrincipalId,
      note.updatedByPrincipalId,
    ],
  );
}

export async function loadCrmAccounts(pool: DbPool): Promise<import("@sedmc/kernel").CrmAccount[]> {
  const result = await pool.query(`SELECT * FROM crm_accounts ORDER BY created_at ASC`);
  return result.rows.map((row) => ({
    id: row.id as string,
    tenantId: row.tenant_id as string,
    organizationId: row.organization_id as string,
    ...(row.relationship_id ? { relationshipId: row.relationship_id as string } : {}),
    accountName: row.account_name as string,
    ownerPrincipalId: row.owner_principal_id as string,
    ...(row.market ? { market: row.market as string } : {}),
    ...(row.strategic_classification ? { strategicClassification: row.strategic_classification as string } : {}),
    ...(row.priority ? { priority: row.priority as string } : {}),
    ...(row.next_action ? { nextAction: row.next_action as string } : {}),
    status: row.status as import("@sedmc/kernel").CrmAccount["status"],
    classification: row.classification as import("@sedmc/kernel").Classification,
    version: row.version as number,
    ...(row.archived_at ? { archivedAt: pgTimestamp(row, "archived_at") } : {}),
    createdAt: pgTimestamp(row, "created_at"),
    updatedAt: pgTimestamp(row, "updated_at"),
    createdByPrincipalId: row.created_by_principal_id as string,
    updatedByPrincipalId: row.updated_by_principal_id as string,
  }));
}

export async function loadCrmNotes(pool: DbPool): Promise<import("@sedmc/kernel").CrmNote[]> {
  const result = await pool.query(`SELECT * FROM crm_notes ORDER BY created_at ASC`);
  return result.rows.map((row) => ({
    id: row.id as string,
    tenantId: row.tenant_id as string,
    body: row.body as string,
    entityType: row.entity_type as string,
    entityId: row.entity_id as string,
    classification: row.classification as import("@sedmc/kernel").Classification,
    version: row.version as number,
    ...(row.archived_at ? { archivedAt: pgTimestamp(row, "archived_at") } : {}),
    createdAt: pgTimestamp(row, "created_at"),
    updatedAt: pgTimestamp(row, "updated_at"),
    createdByPrincipalId: row.created_by_principal_id as string,
    updatedByPrincipalId: row.updated_by_principal_id as string,
  }));
}

export async function countCrmAccounts(pool: DbPool, tenantId: string): Promise<number> {
  const result = await pool.query(`SELECT COUNT(*)::int AS c FROM crm_accounts WHERE tenant_id = $1`, [tenantId]);
  return result.rows[0]?.c ?? 0;
}

export async function countCrmNotes(pool: DbPool, tenantId: string): Promise<number> {
  const result = await pool.query(`SELECT COUNT(*)::int AS c FROM crm_notes WHERE tenant_id = $1`, [tenantId]);
  return result.rows[0]?.c ?? 0;
}

export async function upsertCrmMergeRecord(
  pool: DbPool,
  record: import("@sedmc/kernel").CrmMergeRecord,
): Promise<void> {
  await pool.query(
    `INSERT INTO crm_merge_records (
      id, tenant_id, entity_type, survivor_id, merged_ids, duplicate_candidate_id,
      field_resolutions, reason, idempotency_key, affected_counts, merged_at, merged_by_principal_id
    ) VALUES (
      $1,$2,$3,$4,$5::jsonb,$6,$7::jsonb,$8,$9,$10::jsonb,$11,$12
    )
    ON CONFLICT (id) DO UPDATE SET
      survivor_id = EXCLUDED.survivor_id,
      merged_ids = EXCLUDED.merged_ids,
      duplicate_candidate_id = EXCLUDED.duplicate_candidate_id,
      field_resolutions = EXCLUDED.field_resolutions,
      reason = EXCLUDED.reason,
      idempotency_key = EXCLUDED.idempotency_key,
      affected_counts = EXCLUDED.affected_counts,
      merged_at = EXCLUDED.merged_at,
      merged_by_principal_id = EXCLUDED.merged_by_principal_id`,
    [
      record.id,
      record.tenantId,
      record.entityType,
      record.survivorId,
      JSON.stringify(record.mergedIds),
      record.duplicateCandidateId ?? null,
      JSON.stringify(record.fieldResolutions),
      record.reason,
      record.idempotencyKey ?? null,
      JSON.stringify(record.affectedCounts),
      record.mergedAt,
      record.mergedByPrincipalId,
    ],
  );
}

export async function loadCrmMergeRecords(pool: DbPool): Promise<import("@sedmc/kernel").CrmMergeRecord[]> {
  const result = await pool.query(`SELECT * FROM crm_merge_records ORDER BY merged_at ASC`);
  return result.rows.map((row) => ({
    id: row.id as string,
    tenantId: row.tenant_id as string,
    entityType: row.entity_type as "organization" | "contact",
    survivorId: row.survivor_id as string,
    mergedIds: row.merged_ids as string[],
    ...(row.duplicate_candidate_id ? { duplicateCandidateId: row.duplicate_candidate_id as string } : {}),
    fieldResolutions: (row.field_resolutions ?? {}) as Record<string, unknown>,
    reason: row.reason as string,
    ...(row.idempotency_key ? { idempotencyKey: row.idempotency_key as string } : {}),
    affectedCounts: (row.affected_counts ?? {}) as Record<string, number>,
    mergedAt: pgTimestamp(row, "merged_at"),
    mergedByPrincipalId: row.merged_by_principal_id as string,
  }));
}

export async function countCrmMergeRecords(pool: DbPool, tenantId: string): Promise<number> {
  const result = await pool.query(`SELECT COUNT(*)::int AS c FROM crm_merge_records WHERE tenant_id = $1`, [tenantId]);
  return result.rows[0]?.c ?? 0;
}

export async function upsertCrmRelationshipType(
  pool: DbPool,
  row: { id: string; tenantId: string; key: string; label: string; active: boolean },
): Promise<void> {
  await pool.query(
    `INSERT INTO crm_relationship_types (id, tenant_id, key, label, active)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (tenant_id, key) DO UPDATE SET label = EXCLUDED.label, active = EXCLUDED.active`,
    [row.id, row.tenantId, row.key, row.label, row.active],
  );
}

export async function upsertCrmRelationship(pool: DbPool, rel: import("@sedmc/kernel").CrmRelationship): Promise<void> {
  await pool.query(
    `INSERT INTO crm_relationships (
      id, tenant_id, relationship_type_id, status, from_organization_id, to_organization_id,
      from_contact_id, to_contact_id, organization_unit_id, notes, version,
      created_at, updated_at, created_by_principal_id, updated_by_principal_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
    ON CONFLICT (id) DO UPDATE SET
      relationship_type_id = EXCLUDED.relationship_type_id,
      status = EXCLUDED.status,
      from_organization_id = EXCLUDED.from_organization_id,
      to_organization_id = EXCLUDED.to_organization_id,
      from_contact_id = EXCLUDED.from_contact_id,
      to_contact_id = EXCLUDED.to_contact_id,
      organization_unit_id = EXCLUDED.organization_unit_id,
      notes = EXCLUDED.notes,
      version = EXCLUDED.version,
      updated_at = EXCLUDED.updated_at,
      updated_by_principal_id = EXCLUDED.updated_by_principal_id`,
    [
      rel.id, rel.tenantId, rel.relationshipTypeId, rel.status,
      rel.fromOrganizationId ?? null, rel.toOrganizationId ?? null,
      rel.fromContactId ?? null, rel.toContactId ?? null,
      rel.organizationUnitId ?? null, rel.notes ?? null, rel.version,
      rel.createdAt, rel.updatedAt, rel.createdByPrincipalId, rel.updatedByPrincipalId,
    ],
  );
}

export async function loadCrmRelationships(pool: DbPool): Promise<import("@sedmc/kernel").CrmRelationship[]> {
  const result = await pool.query(`SELECT * FROM crm_relationships ORDER BY created_at ASC`);
  return result.rows.map((row) => ({
    id: row.id as string,
    tenantId: row.tenant_id as string,
    relationshipTypeId: row.relationship_type_id as string,
    status: row.status as import("@sedmc/kernel").CrmRelationship["status"],
    ...(row.from_organization_id ? { fromOrganizationId: row.from_organization_id as string } : {}),
    ...(row.to_organization_id ? { toOrganizationId: row.to_organization_id as string } : {}),
    ...(row.from_contact_id ? { fromContactId: row.from_contact_id as string } : {}),
    ...(row.to_contact_id ? { toContactId: row.to_contact_id as string } : {}),
    ...(row.organization_unit_id ? { organizationUnitId: row.organization_unit_id as string } : {}),
    ...(row.notes ? { notes: row.notes as string } : {}),
    version: row.version as number,
    createdAt: pgTimestamp(row, "created_at"),
    updatedAt: pgTimestamp(row, "updated_at"),
    createdByPrincipalId: row.created_by_principal_id as string,
    updatedByPrincipalId: row.updated_by_principal_id as string,
  }));
}

export async function countCrmRelationships(pool: DbPool, tenantId: string): Promise<number> {
  const result = await pool.query(`SELECT COUNT(*)::int AS c FROM crm_relationships WHERE tenant_id = $1`, [tenantId]);
  return result.rows[0]?.c ?? 0;
}

export async function upsertCrmTask(pool: DbPool, task: import("@sedmc/kernel").CrmTask): Promise<void> {
  await pool.query(
    `INSERT INTO crm_tasks (
      id, tenant_id, title, description, assignee_principal_id, priority, due_at, status,
      related_organization_id, related_contact_id, related_account_id, related_activity_id,
      classification, version, completed_at, created_at, updated_at, created_by_principal_id, updated_by_principal_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      assignee_principal_id = EXCLUDED.assignee_principal_id,
      priority = EXCLUDED.priority,
      due_at = EXCLUDED.due_at,
      status = EXCLUDED.status,
      related_organization_id = EXCLUDED.related_organization_id,
      related_contact_id = EXCLUDED.related_contact_id,
      related_account_id = EXCLUDED.related_account_id,
      related_activity_id = EXCLUDED.related_activity_id,
      classification = EXCLUDED.classification,
      version = EXCLUDED.version,
      completed_at = EXCLUDED.completed_at,
      updated_at = EXCLUDED.updated_at,
      updated_by_principal_id = EXCLUDED.updated_by_principal_id`,
    [
      task.id, task.tenantId, task.title, task.description ?? null, task.assigneePrincipalId,
      task.priority ?? null, task.dueAt ?? null, task.status,
      task.relatedOrganizationId ?? null, task.relatedContactId ?? null,
      task.relatedAccountId ?? null, task.relatedActivityId ?? null,
      task.classification, task.version, task.completedAt ?? null,
      task.createdAt, task.updatedAt, task.createdByPrincipalId, task.updatedByPrincipalId,
    ],
  );
}

export async function loadCrmTasks(pool: DbPool): Promise<import("@sedmc/kernel").CrmTask[]> {
  const result = await pool.query(`SELECT * FROM crm_tasks ORDER BY created_at ASC`);
  return result.rows.map((row) => ({
    id: row.id as string,
    tenantId: row.tenant_id as string,
    title: row.title as string,
    ...(row.description ? { description: row.description as string } : {}),
    assigneePrincipalId: row.assignee_principal_id as string,
    ...(row.priority ? { priority: row.priority as string } : {}),
    ...(row.due_at ? { dueAt: pgTimestamp(row, "due_at") } : {}),
    status: row.status as import("@sedmc/kernel").CrmTask["status"],
    ...(row.related_organization_id ? { relatedOrganizationId: row.related_organization_id as string } : {}),
    ...(row.related_contact_id ? { relatedContactId: row.related_contact_id as string } : {}),
    ...(row.related_account_id ? { relatedAccountId: row.related_account_id as string } : {}),
    ...(row.related_activity_id ? { relatedActivityId: row.related_activity_id as string } : {}),
    classification: row.classification as import("@sedmc/kernel").Classification,
    version: row.version as number,
    ...(row.completed_at ? { completedAt: pgTimestamp(row, "completed_at") } : {}),
    createdAt: pgTimestamp(row, "created_at"),
    updatedAt: pgTimestamp(row, "updated_at"),
    createdByPrincipalId: row.created_by_principal_id as string,
    updatedByPrincipalId: row.updated_by_principal_id as string,
  }));
}

export async function countCrmTasks(pool: DbPool, tenantId: string): Promise<number> {
  const result = await pool.query(`SELECT COUNT(*)::int AS c FROM crm_tasks WHERE tenant_id = $1`, [tenantId]);
  return result.rows[0]?.c ?? 0;
}

export async function upsertCrmTag(pool: DbPool, tag: import("@sedmc/kernel").CrmTag): Promise<void> {
  await pool.query(
    `INSERT INTO crm_tags (
      id, tenant_id, key, label, active, archived_at, version,
      created_at, updated_at, created_by_principal_id, updated_by_principal_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    ON CONFLICT (id) DO UPDATE SET
      label = EXCLUDED.label,
      active = EXCLUDED.active,
      archived_at = EXCLUDED.archived_at,
      version = EXCLUDED.version,
      updated_at = EXCLUDED.updated_at,
      updated_by_principal_id = EXCLUDED.updated_by_principal_id`,
    [
      tag.id, tag.tenantId, tag.key, tag.label, tag.active,
      tag.archivedAt ?? null, tag.version, tag.createdAt, tag.updatedAt,
      tag.createdByPrincipalId, tag.updatedByPrincipalId,
    ],
  );
}

export async function upsertCrmEntityTag(pool: DbPool, row: import("@sedmc/kernel").CrmEntityTag): Promise<void> {
  await pool.query(
    `INSERT INTO crm_entity_tags (id, tenant_id, tag_id, entity_type, entity_id, created_at, created_by_principal_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT (tenant_id, tag_id, entity_type, entity_id) DO UPDATE SET
       id = EXCLUDED.id,
       created_at = EXCLUDED.created_at,
       created_by_principal_id = EXCLUDED.created_by_principal_id`,
    [row.id, row.tenantId, row.tagId, row.entityType, row.entityId, row.createdAt, row.createdByPrincipalId],
  );
}

export async function deleteCrmEntityTag(pool: DbPool, id: string): Promise<void> {
  await pool.query(`DELETE FROM crm_entity_tags WHERE id = $1`, [id]);
}

export async function loadCrmTags(pool: DbPool): Promise<import("@sedmc/kernel").CrmTag[]> {
  const result = await pool.query(`SELECT * FROM crm_tags ORDER BY created_at ASC`);
  return result.rows.map((row) => ({
    id: row.id as string,
    tenantId: row.tenant_id as string,
    key: row.key as string,
    label: row.label as string,
    active: row.active as boolean,
    ...(row.archived_at ? { archivedAt: pgTimestamp(row, "archived_at") } : {}),
    version: row.version as number,
    createdAt: pgTimestamp(row, "created_at"),
    updatedAt: pgTimestamp(row, "updated_at"),
    createdByPrincipalId: row.created_by_principal_id as string,
    updatedByPrincipalId: row.updated_by_principal_id as string,
  }));
}

export async function loadCrmEntityTags(pool: DbPool): Promise<import("@sedmc/kernel").CrmEntityTag[]> {
  const result = await pool.query(`SELECT * FROM crm_entity_tags ORDER BY created_at ASC`);
  return result.rows.map((row) => ({
    id: row.id as string,
    tenantId: row.tenant_id as string,
    tagId: row.tag_id as string,
    entityType: row.entity_type as string,
    entityId: row.entity_id as string,
    createdAt: pgTimestamp(row, "created_at"),
    createdByPrincipalId: row.created_by_principal_id as string,
  }));
}

export async function countCrmTags(pool: DbPool, tenantId: string): Promise<number> {
  const result = await pool.query(`SELECT COUNT(*)::int AS c FROM crm_tags WHERE tenant_id = $1`, [tenantId]);
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

/** I4.20 — upsert DLQ SLA digest last-run stamp (one row per tenant). */
export async function upsertNotifDlqSlaDigestLastRun(
  pool: DbPool,
  run: import("@sedmc/kernel").NotifDlqSlaDigestLastRun,
): Promise<void> {
  await pool.query(
    `INSERT INTO notif_dlq_sla_digest_last_run (
      tenant_id, day, last_run_at, last_run_by_principal_id,
      breached_count, dispatched_count, skipped_count, recipient_count
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (tenant_id) DO UPDATE SET
       day = EXCLUDED.day,
       last_run_at = EXCLUDED.last_run_at,
       last_run_by_principal_id = EXCLUDED.last_run_by_principal_id,
       breached_count = EXCLUDED.breached_count,
       dispatched_count = EXCLUDED.dispatched_count,
       skipped_count = EXCLUDED.skipped_count,
       recipient_count = EXCLUDED.recipient_count`,
    [
      run.tenantId,
      run.day,
      run.lastRunAt,
      run.lastRunByPrincipalId,
      run.breachedCount,
      run.dispatchedCount,
      run.skippedCount,
      run.recipientCount,
    ],
  );
}

export async function loadNotifDlqSlaDigestLastRuns(
  pool: DbPool,
): Promise<import("@sedmc/kernel").NotifDlqSlaDigestLastRun[]> {
  const result = await pool.query(
    `SELECT tenant_id, day, last_run_at, last_run_by_principal_id,
            breached_count, dispatched_count, skipped_count, recipient_count
     FROM notif_dlq_sla_digest_last_run`,
  );
  return result.rows.map((row) => ({
    tenantId: row.tenant_id as string,
    day: row.day as string,
    lastRunAt: (row.last_run_at as Date).toISOString(),
    lastRunByPrincipalId: row.last_run_by_principal_id as string,
    breachedCount: Number(row.breached_count ?? 0),
    dispatchedCount: Number(row.dispatched_count ?? 0),
    skippedCount: Number(row.skipped_count ?? 0),
    recipientCount: Number(row.recipient_count ?? 0),
  }));
}

/** I3.24 — upsert allowlist dual digest last-run stamp (one row per tenant). */
export async function upsertNotifAllowlistDualDigestLastRun(
  pool: DbPool,
  run: import("@sedmc/kernel").NotifAllowlistDualDigestLastRun,
): Promise<void> {
  await pool.query(
    `INSERT INTO notif_allowlist_dual_digest_last_run (
      tenant_id, day, last_run_at, last_run_by_principal_id,
      pending_count, dispatched_count, skipped_count, recipient_count
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (tenant_id) DO UPDATE SET
       day = EXCLUDED.day,
       last_run_at = EXCLUDED.last_run_at,
       last_run_by_principal_id = EXCLUDED.last_run_by_principal_id,
       pending_count = EXCLUDED.pending_count,
       dispatched_count = EXCLUDED.dispatched_count,
       skipped_count = EXCLUDED.skipped_count,
       recipient_count = EXCLUDED.recipient_count`,
    [
      run.tenantId,
      run.day,
      run.lastRunAt,
      run.lastRunByPrincipalId,
      run.pendingCount,
      run.dispatchedCount,
      run.skippedCount,
      run.recipientCount,
    ],
  );
}

export async function loadNotifAllowlistDualDigestLastRuns(
  pool: DbPool,
): Promise<import("@sedmc/kernel").NotifAllowlistDualDigestLastRun[]> {
  const result = await pool.query(
    `SELECT tenant_id, day, last_run_at, last_run_by_principal_id,
            pending_count, dispatched_count, skipped_count, recipient_count
     FROM notif_allowlist_dual_digest_last_run`,
  );
  return result.rows.map((row) => ({
    tenantId: row.tenant_id as string,
    day: row.day as string,
    lastRunAt: (row.last_run_at as Date).toISOString(),
    lastRunByPrincipalId: row.last_run_by_principal_id as string,
    pendingCount: Number(row.pending_count ?? 0),
    dispatchedCount: Number(row.dispatched_count ?? 0),
    skippedCount: Number(row.skipped_count ?? 0),
    recipientCount: Number(row.recipient_count ?? 0),
  }));
}

/** I4.25 — upsert stale DLQ SLA digest snooze/ack (one row per tenant). */
export async function upsertNotifDlqSlaDigestStaleSuppression(
  pool: DbPool,
  suppression: import("@sedmc/kernel").NotifDlqSlaDigestStaleSuppression,
): Promise<void> {
  await pool.query(
    `INSERT INTO notif_dlq_sla_digest_stale_suppression (
      tenant_id, acknowledged_at, snoozed_until, updated_at, updated_by_principal_id
    ) VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (tenant_id) DO UPDATE SET
       acknowledged_at = EXCLUDED.acknowledged_at,
       snoozed_until = EXCLUDED.snoozed_until,
       updated_at = EXCLUDED.updated_at,
       updated_by_principal_id = EXCLUDED.updated_by_principal_id`,
    [
      suppression.tenantId,
      suppression.acknowledgedAt ?? null,
      suppression.snoozedUntil ?? null,
      suppression.updatedAt,
      suppression.updatedByPrincipalId,
    ],
  );
}

export async function loadNotifDlqSlaDigestStaleSuppressions(
  pool: DbPool,
): Promise<import("@sedmc/kernel").NotifDlqSlaDigestStaleSuppression[]> {
  const result = await pool.query(
    `SELECT tenant_id, acknowledged_at, snoozed_until, updated_at, updated_by_principal_id
     FROM notif_dlq_sla_digest_stale_suppression`,
  );
  return result.rows.map((row) => ({
    tenantId: row.tenant_id as string,
    ...(row.acknowledged_at ? { acknowledgedAt: (row.acknowledged_at as Date).toISOString() } : {}),
    ...(row.snoozed_until ? { snoozedUntil: (row.snoozed_until as Date).toISOString() } : {}),
    updatedAt: (row.updated_at as Date).toISOString(),
    updatedByPrincipalId: row.updated_by_principal_id as string,
  }));
}

export async function deleteNotifDlqSlaDigestStaleSuppression(pool: DbPool, tenantId: string): Promise<void> {
  await pool.query(`DELETE FROM notif_dlq_sla_digest_stale_suppression WHERE tenant_id = $1`, [tenantId]);
}

/** I4.27 — append-only stale DLQ SLA digest snooze/ack/clear audit. */
export async function insertNotifDlqSlaDigestStaleSuppressionAudit(
  pool: DbPool,
  entry: import("@sedmc/kernel").NotifDlqSlaDigestStaleSuppressionAudit,
): Promise<void> {
  await pool.query(
    `INSERT INTO notif_dlq_sla_digest_stale_suppression_audit (
      id, tenant_id, action, snoozed_until, acknowledged_at, created_at, created_by_principal_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [
      entry.id,
      entry.tenantId,
      entry.action,
      entry.snoozedUntil ?? null,
      entry.acknowledgedAt ?? null,
      entry.createdAt,
      entry.createdByPrincipalId,
    ],
  );
}

export async function loadNotifDlqSlaDigestStaleSuppressionAudits(
  pool: DbPool,
): Promise<import("@sedmc/kernel").NotifDlqSlaDigestStaleSuppressionAudit[]> {
  const result = await pool.query(
    `SELECT id, tenant_id, action, snoozed_until, acknowledged_at, created_at, created_by_principal_id
     FROM notif_dlq_sla_digest_stale_suppression_audit
     ORDER BY created_at ASC`,
  );
  return result.rows.map((row) => ({
    id: row.id as string,
    tenantId: row.tenant_id as string,
    action: row.action as import("@sedmc/kernel").NotifDlqSlaDigestStaleSuppressionAudit["action"],
    ...(row.snoozed_until ? { snoozedUntil: (row.snoozed_until as Date).toISOString() } : {}),
    ...(row.acknowledged_at ? { acknowledgedAt: (row.acknowledged_at as Date).toISOString() } : {}),
    createdAt: (row.created_at as Date).toISOString(),
    createdByPrincipalId: row.created_by_principal_id as string,
  }));
}

/** I3.28 — upsert stale allowlist dual digest snooze/ack (one row per tenant). */
export async function upsertNotifAllowlistDualDigestStaleSuppression(
  pool: DbPool,
  suppression: import("@sedmc/kernel").NotifAllowlistDualDigestStaleSuppression,
): Promise<void> {
  await pool.query(
    `INSERT INTO notif_allowlist_dual_digest_stale_suppression (
      tenant_id, acknowledged_at, snoozed_until, updated_at, updated_by_principal_id
    ) VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (tenant_id) DO UPDATE SET
       acknowledged_at = EXCLUDED.acknowledged_at,
       snoozed_until = EXCLUDED.snoozed_until,
       updated_at = EXCLUDED.updated_at,
       updated_by_principal_id = EXCLUDED.updated_by_principal_id`,
    [
      suppression.tenantId,
      suppression.acknowledgedAt ?? null,
      suppression.snoozedUntil ?? null,
      suppression.updatedAt,
      suppression.updatedByPrincipalId,
    ],
  );
}

export async function loadNotifAllowlistDualDigestStaleSuppressions(
  pool: DbPool,
): Promise<import("@sedmc/kernel").NotifAllowlistDualDigestStaleSuppression[]> {
  const result = await pool.query(
    `SELECT tenant_id, acknowledged_at, snoozed_until, updated_at, updated_by_principal_id
     FROM notif_allowlist_dual_digest_stale_suppression`,
  );
  return result.rows.map((row) => ({
    tenantId: row.tenant_id as string,
    ...(row.acknowledged_at ? { acknowledgedAt: (row.acknowledged_at as Date).toISOString() } : {}),
    ...(row.snoozed_until ? { snoozedUntil: (row.snoozed_until as Date).toISOString() } : {}),
    updatedAt: (row.updated_at as Date).toISOString(),
    updatedByPrincipalId: row.updated_by_principal_id as string,
  }));
}

export async function deleteNotifAllowlistDualDigestStaleSuppression(pool: DbPool, tenantId: string): Promise<void> {
  await pool.query(`DELETE FROM notif_allowlist_dual_digest_stale_suppression WHERE tenant_id = $1`, [tenantId]);
}

/** PG.27 — upsert last heatmap supplier rollup snapshot (one row per tenant). */
export async function upsertSupHeatmapRollupSnapshot(
  pool: DbPool,
  snapshot: import("@sedmc/kernel").SupHeatmapRollupSnapshot,
): Promise<void> {
  await pool.query(
    `INSERT INTO sup_heatmap_rollup_snapshot (
      tenant_id, generated_at, generated_by_principal_id, window_from, window_to,
      conflict_count, unresolved_count, supplier_count, suppliers
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb)
     ON CONFLICT (tenant_id) DO UPDATE SET
       generated_at = EXCLUDED.generated_at,
       generated_by_principal_id = EXCLUDED.generated_by_principal_id,
       window_from = EXCLUDED.window_from,
       window_to = EXCLUDED.window_to,
       conflict_count = EXCLUDED.conflict_count,
       unresolved_count = EXCLUDED.unresolved_count,
       supplier_count = EXCLUDED.supplier_count,
       suppliers = EXCLUDED.suppliers`,
    [
      snapshot.tenantId,
      snapshot.generatedAt,
      snapshot.generatedByPrincipalId,
      snapshot.from ?? null,
      snapshot.to ?? null,
      snapshot.conflictCount,
      snapshot.unresolvedCount,
      snapshot.supplierCount,
      JSON.stringify(snapshot.suppliers),
    ],
  );
}

export async function loadSupHeatmapRollupSnapshots(
  pool: DbPool,
): Promise<import("@sedmc/kernel").SupHeatmapRollupSnapshot[]> {
  const result = await pool.query(
    `SELECT tenant_id, generated_at, generated_by_principal_id, window_from, window_to,
            conflict_count, unresolved_count, supplier_count, suppliers
     FROM sup_heatmap_rollup_snapshot`,
  );
  return result.rows.map((row) => {
    const raw = row.suppliers;
    const suppliers = Array.isArray(raw) ? raw : JSON.parse(String(raw ?? "[]"));
    return {
      tenantId: row.tenant_id as string,
      generatedAt: (row.generated_at as Date).toISOString(),
      generatedByPrincipalId: row.generated_by_principal_id as string,
      ...(row.window_from ? { from: String(row.window_from).slice(0, 10) } : {}),
      ...(row.window_to ? { to: String(row.window_to).slice(0, 10) } : {}),
      conflictCount: Number(row.conflict_count ?? 0),
      unresolvedCount: Number(row.unresolved_count ?? 0),
      supplierCount: Number(row.supplier_count ?? 0),
      suppliers,
    };
  });
}

/** I20.4 — upsert AI draft artefacts. */
export async function upsertAiDraft(pool: DbPool, draft: import("@sedmc/kernel").AiDraft): Promise<void> {
  await pool.query(
    `INSERT INTO ai_drafts (
      id, tenant_id, recommendation_key, artefact_type, title, body, status, autonomy_level,
      created_at, created_by_principal_id, accepted_at, accepted_by_principal_id,
      discarded_at, discarded_by_principal_id, applied_entity_type, applied_entity_id,
      related_organization_id, related_contact_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
     ON CONFLICT (id) DO UPDATE SET
       recommendation_key = EXCLUDED.recommendation_key,
       artefact_type = EXCLUDED.artefact_type,
       title = EXCLUDED.title,
       body = EXCLUDED.body,
       status = EXCLUDED.status,
       autonomy_level = EXCLUDED.autonomy_level,
       accepted_at = EXCLUDED.accepted_at,
       accepted_by_principal_id = EXCLUDED.accepted_by_principal_id,
       discarded_at = EXCLUDED.discarded_at,
       discarded_by_principal_id = EXCLUDED.discarded_by_principal_id,
       applied_entity_type = EXCLUDED.applied_entity_type,
       applied_entity_id = EXCLUDED.applied_entity_id,
       related_organization_id = EXCLUDED.related_organization_id,
       related_contact_id = EXCLUDED.related_contact_id`,
    [
      draft.id,
      draft.tenantId,
      draft.recommendationKey,
      draft.artefactType,
      draft.title,
      draft.body,
      draft.status,
      draft.autonomyLevel,
      draft.createdAt,
      draft.createdByPrincipalId,
      draft.acceptedAt ?? null,
      draft.acceptedByPrincipalId ?? null,
      draft.discardedAt ?? null,
      draft.discardedByPrincipalId ?? null,
      draft.appliedEntityType ?? null,
      draft.appliedEntityId ?? null,
      draft.relatedOrganizationId ?? null,
      draft.relatedContactId ?? null,
    ],
  );
}

export async function loadAiDrafts(pool: DbPool): Promise<import("@sedmc/kernel").AiDraft[]> {
  const result = await pool.query(
    `SELECT id, tenant_id, recommendation_key, artefact_type, title, body, status, autonomy_level,
            created_at, created_by_principal_id, accepted_at, accepted_by_principal_id,
            discarded_at, discarded_by_principal_id, applied_entity_type, applied_entity_id,
            related_organization_id, related_contact_id
     FROM ai_drafts
     ORDER BY created_at ASC`,
  );
  return result.rows.map((row) => {
    const createdAt = row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at);
    const acceptedAt = row.accepted_at
      ? row.accepted_at instanceof Date
        ? row.accepted_at.toISOString()
        : String(row.accepted_at)
      : undefined;
    const discardedAt = row.discarded_at
      ? row.discarded_at instanceof Date
        ? row.discarded_at.toISOString()
        : String(row.discarded_at)
      : undefined;
    return {
      id: row.id as string,
      tenantId: row.tenant_id as string,
      recommendationKey: row.recommendation_key as import("@sedmc/kernel").AiDraft["recommendationKey"],
      artefactType: row.artefact_type as import("@sedmc/kernel").AiDraft["artefactType"],
      title: row.title as string,
      body: row.body as string,
      status: row.status as import("@sedmc/kernel").AiDraft["status"],
      autonomyLevel: 2 as const,
      createdAt,
      createdByPrincipalId: row.created_by_principal_id as string,
      ...(acceptedAt ? { acceptedAt } : {}),
      ...(row.accepted_by_principal_id ? { acceptedByPrincipalId: row.accepted_by_principal_id as string } : {}),
      ...(discardedAt ? { discardedAt } : {}),
      ...(row.discarded_by_principal_id ? { discardedByPrincipalId: row.discarded_by_principal_id as string } : {}),
      ...(row.applied_entity_type
        ? {
            appliedEntityType: row.applied_entity_type as import("@sedmc/kernel").AiDraft["appliedEntityType"],
            appliedEntityId: row.applied_entity_id as string,
          }
        : {}),
      ...(row.related_organization_id ? { relatedOrganizationId: row.related_organization_id as string } : {}),
      ...(row.related_contact_id ? { relatedContactId: row.related_contact_id as string } : {}),
    };
  });
}

/** I20.9 — upsert last recommend run. */
export async function upsertAiRecommendRun(
  pool: DbPool,
  run: import("@sedmc/kernel").AiRecommendLastRun,
): Promise<void> {
  await pool.query(
    `INSERT INTO ai_recommend_runs (
      tenant_id, principal_id, occurred_at, provider, item_count, keys
    ) VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (tenant_id, principal_id) DO UPDATE SET
       occurred_at = EXCLUDED.occurred_at,
       provider = EXCLUDED.provider,
       item_count = EXCLUDED.item_count,
       keys = EXCLUDED.keys`,
    [run.tenantId, run.principalId, run.occurredAt, run.provider, run.count, run.keys],
  );
}

export async function loadAiRecommendRuns(
  pool: DbPool,
): Promise<import("@sedmc/kernel").AiRecommendLastRun[]> {
  const result = await pool.query(
    `SELECT tenant_id, principal_id, occurred_at, provider, item_count, keys
     FROM ai_recommend_runs
     ORDER BY occurred_at ASC`,
  );
  return result.rows.map((row) => {
    const occurredAt = row.occurred_at instanceof Date ? row.occurred_at.toISOString() : String(row.occurred_at);
    return {
      tenantId: row.tenant_id as string,
      principalId: row.principal_id as string,
      occurredAt,
      provider: row.provider as string,
      count: Number(row.item_count),
      keys: Array.isArray(row.keys) ? (row.keys as string[]) : [],
    };
  });
}

/** I20.13 — upsert stale recommend snooze/ack (one row per tenant + principal). */
export async function upsertAiRecommendStaleSuppression(
  pool: DbPool,
  suppression: import("@sedmc/kernel").AiRecommendStaleSuppression,
): Promise<void> {
  await pool.query(
    `INSERT INTO ai_recommend_stale_suppression (
      tenant_id, principal_id, acknowledged_at, snoozed_until, updated_at, updated_by_principal_id
    ) VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (tenant_id, principal_id) DO UPDATE SET
       acknowledged_at = EXCLUDED.acknowledged_at,
       snoozed_until = EXCLUDED.snoozed_until,
       updated_at = EXCLUDED.updated_at,
       updated_by_principal_id = EXCLUDED.updated_by_principal_id`,
    [
      suppression.tenantId,
      suppression.principalId,
      suppression.acknowledgedAt ?? null,
      suppression.snoozedUntil ?? null,
      suppression.updatedAt,
      suppression.updatedByPrincipalId,
    ],
  );
}

export async function loadAiRecommendStaleSuppressions(
  pool: DbPool,
): Promise<import("@sedmc/kernel").AiRecommendStaleSuppression[]> {
  const result = await pool.query(
    `SELECT tenant_id, principal_id, acknowledged_at, snoozed_until, updated_at, updated_by_principal_id
     FROM ai_recommend_stale_suppression`,
  );
  return result.rows.map((row) => {
    const updatedAt = row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at);
    const acknowledgedAt =
      row.acknowledged_at instanceof Date
        ? row.acknowledged_at.toISOString()
        : row.acknowledged_at
          ? String(row.acknowledged_at)
          : undefined;
    const snoozedUntil =
      row.snoozed_until instanceof Date
        ? row.snoozed_until.toISOString()
        : row.snoozed_until
          ? String(row.snoozed_until)
          : undefined;
    return {
      tenantId: row.tenant_id as string,
      principalId: row.principal_id as string,
      ...(acknowledgedAt ? { acknowledgedAt } : {}),
      ...(snoozedUntil ? { snoozedUntil } : {}),
      updatedAt,
      updatedByPrincipalId: row.updated_by_principal_id as string,
    };
  });
}

export async function deleteAiRecommendStaleSuppression(
  pool: DbPool,
  tenantId: string,
  principalId: string,
): Promise<void> {
  await pool.query(
    `DELETE FROM ai_recommend_stale_suppression WHERE tenant_id = $1 AND principal_id = $2`,
    [tenantId, principalId],
  );
}

/** I20.15 — append-only stale recommend snooze/ack/clear audit. */
export async function insertAiRecommendStaleSuppressionAudit(
  pool: DbPool,
  entry: import("@sedmc/kernel").AiRecommendStaleSuppressionAudit,
): Promise<void> {
  await pool.query(
    `INSERT INTO ai_recommend_stale_suppression_audit (
      id, tenant_id, principal_id, action, snoozed_until, acknowledged_at, created_at, created_by_principal_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [
      entry.id,
      entry.tenantId,
      entry.principalId,
      entry.action,
      entry.snoozedUntil ?? null,
      entry.acknowledgedAt ?? null,
      entry.createdAt,
      entry.createdByPrincipalId,
    ],
  );
}

export async function loadAiRecommendStaleSuppressionAudits(
  pool: DbPool,
): Promise<import("@sedmc/kernel").AiRecommendStaleSuppressionAudit[]> {
  const result = await pool.query(
    `SELECT id, tenant_id, principal_id, action, snoozed_until, acknowledged_at, created_at, created_by_principal_id
     FROM ai_recommend_stale_suppression_audit
     ORDER BY created_at ASC`,
  );
  return result.rows.map((row) => {
    const createdAt = row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at);
    const snoozedUntil =
      row.snoozed_until instanceof Date
        ? row.snoozed_until.toISOString()
        : row.snoozed_until
          ? String(row.snoozed_until)
          : undefined;
    const acknowledgedAt =
      row.acknowledged_at instanceof Date
        ? row.acknowledged_at.toISOString()
        : row.acknowledged_at
          ? String(row.acknowledged_at)
          : undefined;
    return {
      id: row.id as string,
      tenantId: row.tenant_id as string,
      principalId: row.principal_id as string,
      action: row.action as import("@sedmc/kernel").AiRecommendStaleSuppressionAudit["action"],
      ...(snoozedUntil ? { snoozedUntil } : {}),
      ...(acknowledgedAt ? { acknowledgedAt } : {}),
      createdAt,
      createdByPrincipalId: row.created_by_principal_id as string,
    };
  });
}

/** I20.17 — upsert last-used stale recommend audit export filter. */
export async function upsertAiRecommendStaleAuditExportLastFilter(
  pool: DbPool,
  row: import("@sedmc/kernel").AiRecommendStaleAuditExportLastFilter,
): Promise<void> {
  await pool.query(
    `INSERT INTO ai_recommend_stale_audit_export_last_filter (
      tenant_id, principal_id, action, since_text, until_text, updated_at
    ) VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (tenant_id, principal_id) DO UPDATE SET
       action = EXCLUDED.action,
       since_text = EXCLUDED.since_text,
       until_text = EXCLUDED.until_text,
       updated_at = EXCLUDED.updated_at`,
    [row.tenantId, row.principalId, row.action ?? null, row.since ?? null, row.until ?? null, row.updatedAt],
  );
}

export async function loadAiRecommendStaleAuditExportLastFilters(
  pool: DbPool,
): Promise<import("@sedmc/kernel").AiRecommendStaleAuditExportLastFilter[]> {
  const result = await pool.query(
    `SELECT tenant_id, principal_id, action, since_text, until_text, updated_at
     FROM ai_recommend_stale_audit_export_last_filter`,
  );
  return result.rows.map((row) => {
    const updatedAt = row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at);
    return {
      tenantId: row.tenant_id as string,
      principalId: row.principal_id as string,
      ...(row.action ? { action: row.action as "snooze" | "ack" | "cleared" } : {}),
      ...(row.since_text ? { since: String(row.since_text) } : {}),
      ...(row.until_text ? { until: String(row.until_text) } : {}),
      updatedAt,
    };
  });
}

/** I20.19 — upsert named tenant stale recommend audit export preset. */
export async function upsertAiRecommendStaleAuditExportPreset(
  pool: DbPool,
  row: import("@sedmc/kernel").AiRecommendStaleAuditExportPreset,
): Promise<void> {
  await pool.query(
    `INSERT INTO ai_recommend_stale_audit_export_preset (
      id, tenant_id, name, action, since_text, until_text,
      created_at, created_by_principal_id, updated_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       action = EXCLUDED.action,
       since_text = EXCLUDED.since_text,
       until_text = EXCLUDED.until_text,
       updated_at = EXCLUDED.updated_at`,
    [
      row.id,
      row.tenantId,
      row.name,
      row.action ?? null,
      row.since ?? null,
      row.until ?? null,
      row.createdAt,
      row.createdByPrincipalId,
      row.updatedAt,
    ],
  );
}

export async function loadAiRecommendStaleAuditExportPresets(
  pool: DbPool,
): Promise<import("@sedmc/kernel").AiRecommendStaleAuditExportPreset[]> {
  const result = await pool.query(
    `SELECT id, tenant_id, name, action, since_text, until_text,
            created_at, created_by_principal_id, updated_at
     FROM ai_recommend_stale_audit_export_preset`,
  );
  return result.rows.map((row) => {
    const createdAt = row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at);
    const updatedAt = row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at);
    return {
      id: row.id as string,
      tenantId: row.tenant_id as string,
      name: String(row.name),
      ...(row.action ? { action: row.action as "snooze" | "ack" | "cleared" } : {}),
      ...(row.since_text ? { since: String(row.since_text) } : {}),
      ...(row.until_text ? { until: String(row.until_text) } : {}),
      createdAt,
      createdByPrincipalId: row.created_by_principal_id as string,
      updatedAt,
    };
  });
}

export async function deleteAiRecommendStaleAuditExportPreset(pool: DbPool, id: string): Promise<void> {
  await pool.query(`DELETE FROM ai_recommend_stale_audit_export_preset WHERE id = $1`, [id]);
}
