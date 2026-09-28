-- H-203 commercial core Programme / RFP / Finance (Development/Test).
-- Additive only. Does not authorize Production. Does not invent commercial rates.

ALTER TABLE prg_programmes
  ADD COLUMN IF NOT EXISTS commercial_version_label TEXT NOT NULL DEFAULT 'draft'
    CHECK (commercial_version_label IN ('draft', 'revised', 'client', 'final'));

ALTER TABLE prg_days
  ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE prg_items DROP CONSTRAINT IF EXISTS prg_items_item_type_check;
ALTER TABLE prg_items ADD CONSTRAINT prg_items_item_type_check
  CHECK (item_type IS NULL OR item_type IN (
    'accommodation', 'activity', 'experience', 'transport', 'flight',
    'meal', 'meeting_event', 'excursion', 'guide', 'equipment', 'other'
  ));

ALTER TABLE cost_line_items
  ADD COLUMN IF NOT EXISTS programme_item_id UUID REFERENCES prg_items (id);

CREATE INDEX IF NOT EXISTS cost_line_items_programme_item
  ON cost_line_items (tenant_id, programme_item_id)
  WHERE programme_item_id IS NOT NULL;
