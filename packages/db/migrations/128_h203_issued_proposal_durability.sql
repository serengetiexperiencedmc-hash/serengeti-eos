-- H-203 Issued Proposal durability (Development/Test).
-- Additive only. Does not authorize Production.
-- Persists the immutable ISS-* identity and client-safe snapshot.
-- Does not implement PDF, email, dispatch, or client/public access.

CREATE TABLE IF NOT EXISTS issued_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  issued_code TEXT NOT NULL CHECK (issued_code LIKE 'ISS-%'),
  kind TEXT NOT NULL DEFAULT 'issued_proposal' CHECK (kind = 'issued_proposal'),
  programme_id UUID NOT NULL REFERENCES prg_programmes (id),
  rfp_id UUID NOT NULL REFERENCES rfp_rfps (id),
  c8_proposal_id UUID REFERENCES prop_proposals (id),
  programme_commercial_version_label TEXT NOT NULL CHECK (programme_commercial_version_label = 'final'),
  programme_version_number INTEGER CHECK (programme_version_number IS NULL OR programme_version_number >= 1),
  programme_version_id UUID REFERENCES prg_programme_versions (id),
  issued_by_principal_id UUID NOT NULL REFERENCES principals (id),
  approval_authority TEXT NOT NULL CHECK (approval_authority IN ('ceo_md', 'commercial_director', 'platform.admin')),
  approval_request_id UUID REFERENCES com_approval_requests (id),
  issued_at TIMESTAMPTZ NOT NULL,
  approval_recorded_at TIMESTAMPTZ NOT NULL,
  client_safe JSONB NOT NULL,
  immutable BOOLEAN NOT NULL DEFAULT true CHECK (immutable = true),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, issued_code),
  CONSTRAINT issued_proposals_client_safe_required CHECK (
    client_safe ? 'issuingEntity'
    AND client_safe ? 'clientSellingPrice'
    AND client_safe ? 'currency'
    AND client_safe ? 'programmeCode'
    AND client_safe ? 'programmeTitle'
  ),
  CONSTRAINT issued_proposals_client_safe_no_internal CHECK (
    NOT (client_safe ?| ARRAY[
      'supplierCost',
      'totalCost',
      'grossProfit',
      'grossMargin',
      'grossMarginPercent',
      'marginPercent',
      'marginAmount',
      'markupPercent',
      'markupPercentApplied',
      'markupValue',
      'fileFee',
      'fileFeeAmount',
      'commission',
      'baseSellPrice',
      'sellPriceSource',
      'taxAmount',
      'taxRatePercent',
      'taxMode',
      'fxRate',
      'fxCurrencyPair',
      'fxAsOfDate',
      'fxSourceReference',
      'marginFloorPercent',
      'marginMeetsFloor',
      'approvalRequestId',
      'costLines',
      'costLineItems',
      'snapshot',
      'internalSnapshot',
      'workflow',
      'audit',
      'sentAt',
      'clientViewedAt',
      'marginFloorExceptionReason',
      'marginFloorExceptionByPrincipalId',
      'marginFloorExceptionAt',
      'approvalAuthority',
      'issuedByPrincipalId',
      'c8ProposalId',
      'tenantId',
      'sellPrice',
      'supplierId',
      'supplierRateId',
      'costSheetId'
    ])
  )
);

CREATE INDEX IF NOT EXISTS issued_proposals_tenant_programme
  ON issued_proposals (tenant_id, programme_id, issued_at DESC);

CREATE INDEX IF NOT EXISTS issued_proposals_tenant_rfp
  ON issued_proposals (tenant_id, rfp_id);

CREATE OR REPLACE FUNCTION issued_proposals_immutable() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'issued_proposals are insert-only';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS issued_proposals_no_update ON issued_proposals;
CREATE TRIGGER issued_proposals_no_update
  BEFORE UPDATE OR DELETE ON issued_proposals
  FOR EACH ROW EXECUTE FUNCTION issued_proposals_immutable();
