# C1 CRM Performance Baseline

| Field | Value |
| --- | --- |
| Captured | 2026-09-17T00:01:09.219Z |
| Environment | Development/Test |
| Runtime mode | in-memory CRM store |
| PostgreSQL | schema-only; CRM API not persisted to PG |
| Sample size | 20 per operation |

| Operation | p50 (ms) | p95 (ms) |
| --- | ---: | ---: |
| organization_get | 1.1 | 2.4 |
| organization_create | 2.55 | 6.67 |
| contact_list | 1.02 | 1.57 |
| search_unified | 1.17 | 3.53 |
| duplicate_list | 0.9 | 1.33 |
| account_list | 0.95 | 1.59 |
| task_list | 0.98 | 1.49 |
| activity_list | 1.01 | 2.61 |
| tag_list | 0.9 | 1.81 |
| external_id_lookup_miss | 0.89 | 2.13 |

Not a production SLA. Dev/Test baseline evidence for C1 Gate.
