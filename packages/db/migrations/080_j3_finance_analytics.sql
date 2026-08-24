-- J3 Finance Analytics (Development/Test).
-- Rollup is computed at runtime from C9 bookings + I8 invoices + C6 cost sheets.
-- No additional persistence required for Dev/Test increment.

COMMENT ON TABLE fin_invoices IS 'I8 invoices · I8.3 auto-final · I8.4 control · J3 finance analytics rollup';
