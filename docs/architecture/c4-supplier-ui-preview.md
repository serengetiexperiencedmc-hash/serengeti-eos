# C4 UI — Supplier Create / Update

**Increment:** C4 UI (with I4.7)  
**Server version:** `0.42.0-i4.7-c4-ui`

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
