# C1 — Migration Strategy

**Status:** Architecture only — **no legacy import in C1**

## Existing contact universe

Do **not** import 3,000+ legacy contacts during C1 implementation.

## Future pipeline

```
Source → Normalize → Validate → Deduplicate → Classify → Human Review → Import → Reconcile
```

## C1 delivers

| Capability | Purpose |
| --- | --- |
| `crm_external_identifiers` | Source system + source record ID |
| `crm_import_batches` | Batch tracking (schema ready; import logic later) |
| Provenance columns | source_system, source_record_id, imported_at, verification_status |
| `LegacyCrmImportPort` | Interface only — no implementation |
| Dev/Test synthetic seed | Demo data in tests/migrations seed |

## Source authority

[external-systems-register](../../discovery/external-systems-register.md) — Existing CRM: **Unknown**. Do not invent source system IDs.

## Reconciliation

Post-import: counts, orphan check, duplicate candidate sweep, audit report per batch.

## Separate increment

Formal migration is **M1** (or post-C1 gate) — not part of C1 DoD.
