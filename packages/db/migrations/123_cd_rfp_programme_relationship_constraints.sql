-- Gate C bounded Dev/Test slice — RFP / Programme relationship constraints.
-- Additive only; does not rewrite 016/017/122. Does not create schema_migrations.

ALTER TABLE rfp_rfps
  ADD CONSTRAINT rfp_rfps_opportunity_id_fkey
  FOREIGN KEY (opportunity_id)
  REFERENCES opp_opportunities (id)
  ON DELETE RESTRICT;

ALTER TABLE prg_programmes
  ADD CONSTRAINT prg_programmes_rfp_id_fkey
  FOREIGN KEY (rfp_id)
  REFERENCES rfp_rfps (id)
  ON DELETE RESTRICT;

CREATE UNIQUE INDEX IF NOT EXISTS prg_programmes_tenant_active_rfp
  ON prg_programmes (tenant_id, rfp_id)
  WHERE archived_at IS NULL;
