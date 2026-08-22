-- C1.10 CRM completion / hardening (Development/Test).
-- No schema changes; records CRM foundation hardening gate in registry.

UPDATE schema_registry
SET phase = 11, status = 'active'
WHERE context_key = 'crm';
