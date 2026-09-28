-- F2-DP-01 (GPTA-H-85) — Dev/Test coexistence persist of already-specified F2 sidecar maps.
-- Additional to mixed persist. Does not replace mixed CRM / pipeline / RFP / programme / costing rows.
-- Does not create booking facts, KPI history, freeze-on-send snapshots, or Path D versioning.
-- Durability does not equal authority (H-83 G-03-B).
-- Not Production. Not eos_gateb. Catalogues remain frozen F2-I1; payloads are the existing fact objects.

CREATE TABLE IF NOT EXISTS f2_opportunity_facts (
  opportunity_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  updated_by_principal_id UUID NOT NULL,
  PRIMARY KEY (tenant_id, opportunity_id)
);

CREATE TABLE IF NOT EXISTS f2_rfp_facts (
  rfp_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  updated_by_principal_id UUID NOT NULL,
  PRIMARY KEY (tenant_id, rfp_id)
);

CREATE TABLE IF NOT EXISTS f2_path_b (
  rfp_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  updated_by_principal_id UUID NOT NULL,
  PRIMARY KEY (tenant_id, rfp_id)
);

CREATE TABLE IF NOT EXISTS f2_account_facts (
  account_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  updated_by_principal_id UUID NOT NULL,
  PRIMARY KEY (tenant_id, account_id)
);

CREATE TABLE IF NOT EXISTS f2_rate_identities (
  identity_id UUID NOT NULL PRIMARY KEY,
  rate_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  supplier_id UUID NOT NULL,
  version_identity INTEGER NOT NULL,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  updated_by_principal_id UUID NOT NULL,
  UNIQUE (tenant_id, rate_id, version_identity)
);

CREATE TABLE IF NOT EXISTS f2_programme_facts (
  programme_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  updated_by_principal_id UUID NOT NULL,
  PRIMARY KEY (tenant_id, programme_id)
);
