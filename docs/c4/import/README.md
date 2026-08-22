# C4 Supplier Import Templates

Ready-to-use CSV templates for migrating Serengeti Experience DMC's 300+ suppliers from local folders into Serengeti EOS.

## Quick start

1. Copy the CSV files from this folder to your working directory
2. Read [`field-reference.md`](./field-reference.md) for column definitions and validation rules
3. Fill in your supplier data — start with **10–20 pilot suppliers** before the full 300+
4. Assign a Sales champion per category to maintain data quality
5. Upload assets (photos) separately after content block import

## Files

| File | Description |
| --- | --- |
| [`supplier-import-schema.json`](./supplier-import-schema.json) | JSON Schema for programmatic validation |
| [`suppliers.csv`](./suppliers.csv) | Master supplier records (5 sample rows) |
| [`supplier-contacts.csv`](./supplier-contacts.csv) | Reservation and ops contacts |
| [`supplier-rates.csv`](./supplier-rates.csv) | Rate cards with seasonality |
| [`supplier-content-blocks.csv`](./supplier-content-blocks.csv) | Descriptions and asset references |
| [`field-reference.md`](./field-reference.md) | Complete field dictionary |

## Pilot migration checklist

- [ ] Identify 10 suppliers across each major category (accommodation, vehicle, excursion, AV, décor)
- [ ] Assign `supplierCode` using the naming convention in field-reference
- [ ] Sales champion validates rates against latest contract folders
- [ ] Upload 2–3 photos per accommodation supplier to Asset Library
- [ ] Run validation; fix all errors before commit
- [ ] Procurement reviews `pending_review` suppliers
- [ ] Mark verified suppliers in EOS UI after spot-check

## Validation

Validate CSV against the JSON schema before upload:

```bash
# Example using ajv-cli (optional)
npx ajv validate -s supplier-import-schema.json -d your-batch.json
```

Or use the EOS import UI (when C4 is deployed): Upload → Validate → Review errors → Commit.

## Related EOS documentation

- Commercial roadmap C4: `serengeti-eos/docs/architecture/commercial-roadmap.md`
- CRM import pattern (reference): `serengeti-eos/apps/api/src/crm/import.ts`
- Human approval matrix: `serengeti-eos/docs/architecture/16-human-approval-matrix.md`
