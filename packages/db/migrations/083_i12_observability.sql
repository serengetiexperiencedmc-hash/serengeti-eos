-- I12 Observability (Development/Test).
-- Schema registry only. Spans are ephemeral in-process telemetry (not OLTP).
-- Health dependency map reads CMDB depends_on from 082. No collector.

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('observability', 3, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
