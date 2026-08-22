# C1 CRM Performance Baseline

| Field | Value |
| --- | --- |
| Captured | 2026-08-22T15:42:37.338Z |
| Environment | Development/Test |
| Runtime mode | in-memory CRM store |
| PostgreSQL | schema-only; CRM API not persisted to PG |
| Sample size | 20 per operation |

| Operation | p50 (ms) | p95 (ms) |
| --- | ---: | ---: |
| organization_get | 0.86 | 2.02 |
| organization_create | 2.37 | 8.36 |
| contact_list | 0.93 | 1.72 |
| search_unified | 1.24 | 3.48 |
| duplicate_list | 0.85 | 3.11 |
| account_list | 0.93 | 2.37 |
| task_list | 0.87 | 1.53 |
| activity_list | 1.05 | 1.77 |
| tag_list | 0.85 | 2.18 |
| external_id_lookup_miss | 0.91 | 1.79 |

Not a production SLA. Dev/Test baseline evidence for C1 Gate.
