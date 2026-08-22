-- I9.2 Encrypted field cache (Development/Test).
-- Client-side AES-GCM encryption; key derived from device + principal + salt.
-- Policy version 2 enforced via /v1/ops/sync/policy.

COMMENT ON TABLE ops_field_sync_sessions IS 'I9 field sync · I9.2 encrypted offline cache policy v2';
