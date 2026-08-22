# C1 CRM Performance Baseline

| Field | Value |
| --- | --- |
| Captured | 2026-08-22T09:31:36.202Z |
| Environment | Development/Test |
| Runtime mode | in-memory CRM store |
| PostgreSQL | schema-only; CRM API not persisted to PG |
| Sample size | 20 per operation |

| Operation | p50 (ms) | p95 (ms) |
| --- | ---: | ---: |
| organization_get | 0.92 | 1.73 |
| organization_create | 2.5 | 7.56 |
| contact_list | 0.88 | 3.54 |
| search_unified | 1.26 | 3.48 |
| duplicate_list | 0.88 | 3.72 |
| account_list | 0.87 | 2.92 |
| task_list | 0.8 | 1.81 |
| activity_list | 0.93 | 2.52 |
| tag_list | 0.87 | 4.46 |
| external_id_lookup_miss | 0.92 | 3.19 |

Not a production SLA. Dev/Test baseline evidence for C1 Gate.
