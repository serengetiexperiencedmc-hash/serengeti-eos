# C1 CRM Performance Baseline

| Field | Value |
| --- | --- |
| Captured | 2026-08-22T16:24:09.921Z |
| Environment | Development/Test |
| Runtime mode | in-memory CRM store |
| PostgreSQL | schema-only; CRM API not persisted to PG |
| Sample size | 20 per operation |

| Operation | p50 (ms) | p95 (ms) |
| --- | ---: | ---: |
| organization_get | 0.81 | 2.4 |
| organization_create | 2.31 | 8.28 |
| contact_list | 1.16 | 3.02 |
| search_unified | 1.84 | 4.41 |
| duplicate_list | 1.16 | 2.42 |
| account_list | 1.04 | 1.96 |
| task_list | 0.94 | 4.44 |
| activity_list | 0.9 | 4.69 |
| tag_list | 0.84 | 2.16 |
| external_id_lookup_miss | 0.95 | 1.88 |

Not a production SLA. Dev/Test baseline evidence for C1 Gate.
