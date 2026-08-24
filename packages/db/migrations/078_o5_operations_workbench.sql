-- O5 Operations Workbench (Development/Test).
-- Queue is computed at runtime from C9 bookings + O1-O4 + I9 conflicts.
-- No additional persistence required for Dev/Test increment.

COMMENT ON TABLE bkg_bookings IS 'C9 bookings · C10 command center · O5 operations workbench queue';
