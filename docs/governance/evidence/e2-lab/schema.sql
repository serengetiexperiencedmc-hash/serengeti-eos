-- Stage 4B synthetic lab schema. NOT an EOS Production migration.
-- Stand-in tables for Commercial/RFP and Programme Building durability probes.
-- EOS runtime jointly-critical modules remain in-memory (ADR-0017); these tables
-- measure PostgreSQL recovery class only.

CREATE TABLE lab_markers (
  seq            BIGSERIAL PRIMARY KEY,
  marker_id      TEXT UNIQUE NOT NULL,
  function_class TEXT NOT NULL CHECK (function_class IN ('commercial_rfp', 'programme_building', 'probe', 'outbox')),
  commit_status  TEXT NOT NULL CHECK (commit_status IN ('committed')),
  durable_confirmed BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  note           TEXT
);

CREATE TABLE lab_rfp (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  marker_id  TEXT NOT NULL REFERENCES lab_markers (marker_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE lab_programme (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  rfp_id     TEXT NOT NULL REFERENCES lab_rfp (id),
  marker_id  TEXT NOT NULL REFERENCES lab_markers (marker_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE lab_outbox (
  id         TEXT PRIMARY KEY,
  marker_id  TEXT NOT NULL REFERENCES lab_markers (marker_id),
  payload    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);
