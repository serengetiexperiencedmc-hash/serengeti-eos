-- C10 Booking Command Center (Development/Test).
-- Aggregated snapshot is computed at runtime from C9 + O1-O4 + I8 entities.
-- No additional persistence required for Dev/Test increment.

COMMENT ON TABLE bkg_bookings IS 'C9 bookings · C10 command center aggregates booking + ops + finance snapshot';
