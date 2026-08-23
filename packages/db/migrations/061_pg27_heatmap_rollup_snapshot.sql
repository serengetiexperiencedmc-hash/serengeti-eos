-- PG.27 — persist last heatmap supplier rollup snapshot per tenant

CREATE TABLE IF NOT EXISTS sup_heatmap_rollup_snapshot (
  tenant_id UUID PRIMARY KEY,
  generated_at TIMESTAMPTZ NOT NULL,
  generated_by_principal_id UUID NOT NULL,
  window_from DATE,
  window_to DATE,
  conflict_count INT NOT NULL DEFAULT 0,
  unresolved_count INT NOT NULL DEFAULT 0,
  supplier_count INT NOT NULL DEFAULT 0,
  suppliers JSONB NOT NULL DEFAULT '[]'::jsonb
);
