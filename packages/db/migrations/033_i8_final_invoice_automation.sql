-- I8.3 Final invoice automation & payment request listing (Development/Test).
-- No new tables; eligibility computed from fin_invoices + fin_payment_links at runtime.

COMMENT ON TABLE fin_invoices IS 'I8.3 adds final-invoice eligibility gate (deposit+progress paid) and auto-create endpoint';
