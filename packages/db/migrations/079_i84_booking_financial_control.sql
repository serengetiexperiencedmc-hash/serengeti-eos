-- I8.4 Booking Financial Control (Development/Test).
-- Rollup is computed at runtime from C9 bookings + I8 invoices/quotes + C6 cost sheets.
-- No additional persistence required for Dev/Test increment.

COMMENT ON TABLE fin_invoices IS 'I8 invoices · I8.3 auto-final · I8.4 booking financial control rollup';
