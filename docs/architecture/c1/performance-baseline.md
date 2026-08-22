# C1 CRM Performance Baseline

| Field | Value |
| --- | --- |
| Captured | 2026-08-22T18:43:08.636Z |
| Environment | Development/Test |
| Runtime mode | in-memory CRM store |
| PostgreSQL | schema-only; CRM API not persisted to PG |
| Sample size | 20 per operation |

| Operation | p50 (ms) | p95 (ms) |
| --- | ---: | ---: |
| organization_get | 0.73 | 3.08 |
| organization_create | 2 | 3.67 |
| contact_list | 0.76 | 1.49 |
| search_unified | 1.08 | 3.39 |
| duplicate_list | 0.87 | 3.2 |
| account_list | 0.75 | 2.88 |
| task_list | 0.72 | 2.12 |
| activity_list | 0.68 | 1.55 |
| tag_list | 0.69 | 1.35 |
| external_id_lookup_miss | 0.78 | 1.53 |

Not a production SLA. Dev/Test baseline evidence for C1 Gate.
