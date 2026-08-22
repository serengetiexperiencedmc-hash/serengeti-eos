-- C1.9 CRM domain event catalogue (Development/Test).
-- Event persistence uses existing I4 outbox_events table; this migration registers CRM schema phase.

UPDATE schema_registry
SET phase = 10, status = 'active'
WHERE context_key = 'crm';
