# C4 UI — Supplier Create / Update

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment | C4 (UI slice with historical I4.7) |
| Implementation status | **IMPLEMENTED** — create/edit modal on Supplier Library |
| Environment | Development/Test only |

**Increment:** C4 UI (with I4.7)  
**Server version:** `0.42.0-i4.7-c4-ui` (historical ship identity; C4 does not bump current API VERSION)

## Summary

Commercial Supplier Library wires the PG.8 REST mutations:

- **Add Supplier** opens create form (`POST /v1/suppliers`)
- Detail drawer **Edit** opens update form (`PATCH /v1/suppliers/:id`)

## UI

- `SupplierFormModal` — create/edit shared form
- `/commercial/suppliers` — enables previously disabled Add button

## Verification

```bash
npm run typecheck -w @sedmc/web
```
