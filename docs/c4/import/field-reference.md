# C4 Supplier Import — Field Reference

**Status:** Draft for Phase 0 data migration  
**Aligned with:** Serengeti EOS C4 Supplier Management, CRM import batch pattern (C1)  
**Classification default:** `Confidential` (supplier rates are need-to-know)

---

## Overview

Supplier data is imported in **four related CSV files**. Each file shares `supplierCode` as the foreign key. Import follows the same validate → review → commit flow as CRM bulk import.

| File | Purpose | Typical row count |
| --- | --- | --- |
| `suppliers.csv` | Master supplier records | ~300 |
| `supplier-contacts.csv` | Reservation / ops contacts | ~400–600 |
| `supplier-rates.csv` | Rate cards with seasonality | ~1,500–3,000 |
| `supplier-content-blocks.csv` | Reusable descriptions & asset refs | ~500–1,000 |

Photos and PDFs are **not embedded in CSV**. Upload assets separately via the Asset Library, referencing them by `assetFilename` in content blocks.

---

## Import order

1. `suppliers.csv` — must commit first (creates master records)
2. `supplier-contacts.csv` — links to suppliers
3. `supplier-rates.csv` — links to suppliers
4. `supplier-content-blocks.csv` — links to suppliers

Each file is a separate import batch with its own validation. Re-run validation after fixing errors; commit is idempotent per batch.

---

## 1. suppliers.csv

| Column | Required | Type | Constraints | Example |
| --- | --- | --- | --- | --- |
| `supplierCode` | Yes | string | Unique per tenant; `[A-Z0-9_-]{2,32}`; stable ID from legacy folders | `LOD-SERONERA-SOP` |
| `legalName` | Yes | string | 2–200 chars | `Seronera Safari Lodge Ltd` |
| `tradingName` | No | string | ≤200 chars | `Seronera Safari Lodge` |
| `category` | Yes | enum | See categories below | `accommodation` |
| `subcategory` | No | string | Free text or controlled list | `safari_lodge` |
| `country` | Yes | ISO 3166-1 alpha-2 | `TZ`, `KE`, `RW`, `UG`, `MU`, `ZA` | `TZ` |
| `region` | No | string | Destination area | `Serengeti National Park` |
| `city` | No | string | Nearest town/city | `Seronera` |
| `address` | No | string | Full postal address | `Seronera, Serengeti NP` |
| `latitude` | No | decimal | -90 to 90 | `-2.4542` |
| `longitude` | No | decimal | -180 to 180 | `34.8225` |
| `telephone` | No | E.164 or local | | `+255 27 250 0631` |
| `email` | No | email | General/reservations email | `reservations@example.co.tz` |
| `website` | No | URL | | `https://example.co.tz` |
| `status` | Yes | enum | `draft`, `pending_review`, `active`, `inactive`, `suspended` | `active` |
| `preferredPartner` | No | boolean | `true` / `false` | `true` |
| `paymentTermsDays` | No | integer | 0–365 | `30` |
| `defaultCurrency` | No | ISO 4217 | `USD`, `EUR`, `TZS`, `KES` | `USD` |
| `taxRegistrationNumber` | No | string | VAT/TIN if applicable | `123-456-789` |
| `contractRef` | No | string | Internal contract file reference | `CON-2024-089` |
| `contractValidFrom` | No | date | ISO 8601 `YYYY-MM-DD` | `2024-01-01` |
| `contractValidTo` | No | date | ISO 8601 `YYYY-MM-DD` | `2025-12-31` |
| `maintainedByEmail` | No | email | Sales consultant responsible for rates | `consultant@serengetiexperience.com` |
| `notes` | No | string | Internal notes (max 2000 chars) | `Preferred for incentive groups 40–80 pax` |
| `sourceRecordId` | No | string | Legacy folder/spreadsheet ID | `FOLDER-2023-LOD-042` |
| `classification` | No | enum | `Internal`, `Confidential`, `Restricted` | `Confidential` |

### Category enum (`category`)

| Value | Description |
| --- | --- |
| `accommodation` | Hotels, lodges, camps, tented camps |
| `vehicle_hire` | Safari vehicles, coaches, transfers |
| `excursion` | Game drives, park fees, activities, experiences |
| `av_entertainment` | AV equipment, DJs, MCs, staging |
| `decor` | Event décor, florals, theming |
| `catering` | F&B, banquet, bush dining |
| `venue` | Conference venues, meeting spaces |
| `guide_staff` | Guides, rangers, support staff |
| `air_charter` | Flights, helicopters, balloons |
| `miscellaneous` | Insurance, permits, other |

---

## 2. supplier-contacts.csv

| Column | Required | Type | Constraints | Example |
| --- | --- | --- | --- | --- |
| `supplierCode` | Yes | string | Must exist in suppliers.csv | `LOD-SERONERA-SOP` |
| `contactRole` | Yes | enum | See roles below | `reservations` |
| `givenName` | Yes | string | 1–100 chars | `Anna` |
| `familyName` | Yes | string | 1–100 chars | `Mwanga` |
| `email` | No | email | | `anna.m@example.co.tz` |
| `telephone` | No | string | | `+255 754 123 456` |
| `whatsapp` | No | string | E.164 preferred | `+255754123456` |
| `isPrimary` | No | boolean | One primary per role per supplier | `true` |
| `notes` | No | string | | `Available Mon–Sat 08:00–18:00 EAT` |

### Contact role enum (`contactRole`)

`reservations`, `operations`, `finance`, `management`, `sales`, `emergency`, `other`

---

## 3. supplier-rates.csv

| Column | Required | Type | Constraints | Example |
| --- | --- | --- | --- | --- |
| `supplierCode` | Yes | string | Must exist in suppliers.csv | `LOD-SERONERA-SOP` |
| `rateCode` | Yes | string | Unique per supplier; `[A-Z0-9_-]{2,32}` | `DBL-HIGH-2025` |
| `rateName` | Yes | string | Human-readable label | `Double Room — High Season 2025` |
| `rateType` | Yes | enum | See rate types below | `per_room_per_night` |
| `unitDescription` | No | string | e.g. "Standard double, FB" | `Standard double, full board` |
| `amount` | Yes | decimal | ≥ 0, max 4 decimal places | `450.00` |
| `currency` | Yes | ISO 4217 | | `USD` |
| `validFrom` | Yes | date | ISO 8601 | `2025-07-01` |
| `validTo` | Yes | date | ISO 8601; must be ≥ validFrom | `2025-10-31` |
| `seasonLabel` | No | string | | `High Season 2025` |
| `minPax` | No | integer | Minimum pax for rate | `2` |
| `maxPax` | No | integer | Maximum pax for rate | `2` |
| `minNights` | No | integer | Minimum stay | `2` |
| `commissionPercent` | No | decimal | 0–100 | `15.00` |
| `includesTax` | No | boolean | Rate inclusive of tax? | `false` |
| `taxPercent` | No | decimal | Applicable VAT if not included | `18.00` |
| `cancellationPolicyRef` | No | string | Link to policy doc/code | `CANC-LOD-STD` |
| `notes` | No | string | Internal pricing notes | `Subject to park fee increases` |
| `status` | Yes | enum | `draft`, `active`, `expired`, `superseded` | `active` |

### Rate type enum (`rateType`)

| Value | Use for |
| --- | --- |
| `per_room_per_night` | Accommodation |
| `per_person_per_night` | Accommodation (per person sharing) |
| `per_vehicle_per_day` | Safari vehicles, transfers |
| `per_person` | Park fees, single activities |
| `flat_fee` | MC/DJ full day, décor package |
| `per_hour` | AV, hourly services |
| `per_km` | Distance-based transfers |
| `percentage` | Commission-based items |

---

## 4. supplier-content-blocks.csv

| Column | Required | Type | Constraints | Example |
| --- | --- | --- | --- | --- |
| `supplierCode` | Yes | string | Must exist in suppliers.csv | `LOD-SERONERA-SOP` |
| `blockCode` | Yes | string | Unique per supplier | `DESC-OVERVIEW` |
| `blockType` | Yes | enum | See block types below | `description` |
| `title` | No | string | Display title | `Seronera Safari Lodge — Overview` |
| `body` | Yes | string | Plain text or markdown; max 5000 chars | `Nestled in the heart of the Serengeti...` |
| `language` | No | ISO 639-1 | Default `en` | `en` |
| `assetFilename` | No | string | Filename in asset upload batch | `seronera-lodge-exterior.jpg` |
| `assetAltText` | No | string | Accessibility alt text | `Seronera Safari Lodge exterior at sunset` |
| `tags` | No | string | Pipe-separated: `safari\|luxury\|serengeti` | `safari\|luxury\|serengeti` |
| `isDefault` | No | boolean | Default block for this type | `true` |
| `status` | Yes | enum | `draft`, `reviewed`, `approved`, `archived` | `approved` |

### Content block type enum (`blockType`)

`description`, `highlights`, `room_type`, `inclusions`, `exclusions`, `location`, `programme_snippet`, `image_caption`, `terms`

---

## Validation rules (system-enforced)

| Rule | Applies to |
| --- | --- |
| `supplierCode` unique within tenant | suppliers.csv |
| `supplierCode` must exist before child imports | contacts, rates, content |
| `rateCode` unique per supplier | supplier-rates.csv |
| `validTo` ≥ `validFrom` | supplier-rates.csv |
| No overlapping active rates for same supplier + rateType + unitDescription + date range | supplier-rates.csv (warning) |
| `category` must be valid enum | suppliers.csv |
| `email` format validation | suppliers.csv, contacts |
| `amount` ≥ 0 | supplier-rates.csv |
| Duplicate row detection within batch | all files |
| Classification clearance check on commit | all files |

---

## Approval workflow

| Step | Actor | Action |
| --- | --- | --- |
| 1 | Sales / Procurement | Upload CSV, run validation |
| 2 | System | Flag duplicates, missing refs, date overlaps |
| 3 | Sales champion | Fix errors, re-validate |
| 4 | Procurement | Review new suppliers (`status: pending_review`) |
| 5 | Procurement + Finance | Approve suppliers with bank/payment changes |
| 6 | Authorized user | Commit batch (requires `supplier:import:bulk` + idempotency key) |

Imported suppliers default to `dataQualityStatus: Unverified` until a Sales champion marks them verified in the UI.

---

## Asset upload (parallel track)

After importing content blocks, upload images to the Asset Library:

```
/assets/suppliers/{supplierCode}/{assetFilename}
```

Supported formats: `jpg`, `jpeg`, `png`, `webp`, `pdf` (max 10 MB per file).  
Naming convention: `{supplierCode}-{descriptor}.{ext}` e.g. `LOD-SERONERA-SOP-exterior.jpg`

---

## Sample supplierCode convention

```
{CAT}-{NAME}-{LOC}

CAT  = 3-letter category prefix (LOD, VEH, EXC, AVN, DEC, CAT, VEN, GDS, AIR, MSC)
NAME = abbreviated property/supplier name
LOC  = location abbreviation
```

Examples:
- `LOD-FOUR-SEAS-ARU` — Four Seasons Safari Lodge, Arusha
- `VEH-SEDMC-LC200` — SEDMC Land Cruiser 200 fleet
- `EXC-BALLOON-SRN` — Balloon safari, Seronera

---

## API alignment (future C4)

Import batches will mirror CRM:

```
POST   /v1/suppliers/import/batches          — submit CSV
POST   /v1/suppliers/import/batches/:id/validate
GET    /v1/suppliers/import/batches/:id
POST   /v1/suppliers/import/batches/:id/commit   — Idempotency-Key required
```

Entity types: `supplier`, `supplier_contact`, `supplier_rate`, `supplier_content_block`
