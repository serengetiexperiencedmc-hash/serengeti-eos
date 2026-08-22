# I4 Operational Recovery (Development/Test)

**Not a Production runbook.** Documents expected Dev/Test behaviour before CRM/MICE event volume.

## Publisher restart

Pending outbox rows remain in PostgreSQL / in-memory store. On restart, publisher drains `status=pending`. Events are recoverable; at-least-once delivery may duplicate on transport — consumers must be idempotent.

## Consumer restart

Processed events tracked by `(tenantId, consumer, eventId)`. Restart skips already-processed events. Unprocessed events remain on bus / are re-delivered.

## Database recovery

Unpublished outbox records must survive restore from backup (Production: validated in ADR-0011 / BCM increment). Dev/Test: in-memory store is not durable — PostgreSQL path via migration `003_i4_outbox_events.sql`.

## Event transport failure

Business transactions **commit with outbox** even if publisher is down. Availability policy: domain write succeeds; downstream async processing is eventually consistent. No silent event loss on successful business commit.

## DLQ recovery

1. Failed → DLQ (`status=failed`)
2. Investigate (`investigating`)
3. Correct root cause (`corrected`)
4. Request replay with reason (`requestReplay`)
5. Authorized execute (`executeReplayRequest`)
6. Re-publish from outbox pending
7. Resolve (`resolved`) or permanently reject (`permanently_rejected` → `closed`)

Replay is privileged — not available to ordinary users.

## Transport note

`in-memory-dev` is the Development/Test stand-in. Production transport (NATS intended) requires ADR, infrastructure, and Production Readiness Review — not configured in this increment.
