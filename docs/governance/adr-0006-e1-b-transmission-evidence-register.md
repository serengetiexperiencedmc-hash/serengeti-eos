# E1-B — Transmission Evidence Register (Owner-Authorized Send)

> **`ADDITIVE 2026-09-17: E1-B TRANSMISSION PAUSED / SUPERSEDED AS CURRENT NEXT ACTION`**  
> **`EVIDENCE REGISTER — NOT A SEND`**  
> **`EVERY PROVIDER = NOT TRANSMITTED`**  
> **`0 TRANSMISSIONS`** · **`0 ACKNOWLEDGEMENTS`** · **`0 PROVIDER RESPONSES`**  
> **`9 FULL-RFI / 2 SCOPE CLARIFICATION / 1 HOLD`**  
> **`HISTORICAL 11-PROVIDER E1-B6 SEND ROWS = SUPERSEDED AS OPERATIONAL INSTRUCTION`**  
> **`DO NOT MOVE A ROW TO TRANSMITTED WITHOUT EXTERNAL ARTEFACT`**  
> **`NOT PROVIDER SELECTION`** · **`NOT ARCHITECTURE SELECTION`** · **`NOT PRODUCTION`**

**Date of register:** 2026-09-17.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Execution sheet:** [`adr-0006-e1-b-final-transmission-execution-sheet.md`](adr-0006-e1-b-final-transmission-execution-sheet.md).  
**Owner sender:** Patrick Makundi / `rfp@serengetiexperiencedmc.com` / **PDM**.  
**Authoritative routing:** [`adr-0006-e1-b5-routing-reconciliation.md`](adr-0006-e1-b5-routing-reconciliation.md).

Historical register [`adr-0006-e1-b6-rfi-transmission-evidence-register.md`](adr-0006-e1-b6-rfi-transmission-evidence-register.md) is **retained**. It still contains an 11-row historical SEND picture. **This file** is the live evidence register for the owner-authorized **9 / 2 / 1** execution. Do not treat a preparation claim as a send.

**Mandatory sentence (unchanged; required on any later send artefact):**

RFI/RFQ issuance is an information-gathering and market-evidence activity only; responses will be subject to a separate governed evaluation and do not constitute provider or architecture selection, contracting, Production approval, or deployment authorization.

---

## 1. Frozen hashes (verified this session; files not modified)

| File | SHA-256 |
| --- | --- |
| Questionnaire | `6CE0CD974232988236BE67A169E1E660AB29A127625C01A90378B736231FA2BE` |
| PE pack | `44C73163E7332C0FF995F774BC2716A35FF904410D6E4CDD008A720A987E583E` |
| Response template | `47FAA8E7F700DC04678686FDC938C5894AFB705E2E99172182020B3539DCFAE7` |

---

## 2. Status model

A row may move from **NOT TRANSMITTED** only with external evidence (sent-mail / form-acceptance artefact): timestamp, destination used, sender used, Message-ID or form confirmation, and evidence location.

Do **not** invent those fields. This register’s initial state applies **none** of TRANSMITTED, DELIVERY CONFIRMED, PROVIDER ACKNOWLEDGED, or PROVIDER RESPONSE RECEIVED.

---

## 3. Live rows (all NOT TRANSMITTED)

| Provider ID | Provider name | Category | Official route | Named recipient | Package | Transmission status | Message ID | Timestamp | Confirmation | Evidence location | Provider response |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CU-01 | Africa Data Centres | FULL-RFI | enquiries@africadatacentres.com | **NOT ESTABLISHED** | Four-document pack; PE-01–PE-48 placeholder | **NOT TRANSMITTED** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NONE** |
| CU-02 | Amazon Web Services | FULL-RFI | Official Contact Sales form | **NOT ESTABLISHED** | Four-document pack; PE-01–PE-48 placeholder | **NOT TRANSMITTED** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NONE** |
| CU-03 | Google Cloud | FULL-RFI | Official Contact Sales form | **NOT ESTABLISHED** | Four-document pack; PE-01–PE-48 placeholder | **NOT TRANSMITTED** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NONE** |
| CU-04 | Hetzner | FULL-RFI | info@hetzner.com | **NOT ESTABLISHED** | Four-document pack; PE-01–PE-48 placeholder | **NOT TRANSMITTED** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NONE** |
| CU-05 | Liquid C2 | HOLD | N/A — receives nothing | **NOT ESTABLISHED** | **None** | **NOT TRANSMITTED** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NONE** |
| CU-06 | Microsoft Azure | FULL-RFI | Official Contact Sales form | **NOT ESTABLISHED** | Four-document pack; PE-01–PE-48 placeholder | **NOT TRANSMITTED** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NONE** |
| CU-07 | Oracle Cloud Infrastructure | FULL-RFI | Official Contact Sales / Sub-Saharan Africa route | **NOT ESTABLISHED** | Four-document pack; PE-01–PE-48 placeholder | **NOT TRANSMITTED** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NONE** |
| CU-08 | OVHcloud | FULL-RFI | Official Dedicated/Cloud Sales route — **no invented email** | **NOT ESTABLISHED** | Four-document pack; PE-01–PE-48 placeholder | **NOT TRANSMITTED** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NONE** |
| CU-09 | Raxio Group | FULL-RFI | info@raxiogroup.com | **NOT ESTABLISHED** | Four-document pack; PE-01–PE-48 placeholder | **NOT TRANSMITTED** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NONE** |
| CU-10 | SEACOM Limited | SCOPE CLARIFICATION | info@seacom.com | **NOT ESTABLISHED** | SC-01–SC-09 **only** (not full pack) | **NOT TRANSMITTED** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NONE** |
| CU-11 | WIA | SCOPE CLARIFICATION | info@wia.co.tz | **NOT ESTABLISHED** | SC-01–SC-09 **only** (not full pack) | **NOT TRANSMITTED** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NONE** |
| CU-12 | Wingu Africa | FULL-RFI | info@wingu.africa | **NOT ESTABLISHED** | Four-document pack; PE-01–PE-48 placeholder | **NOT TRANSMITTED** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | **NONE** |

**Counts:** FULL-RFI **9** / SCOPE CLARIFICATION **2** / HOLD **1** / transmitted **0**.

---

## 4. Totals

| Channel | Count |
| --- | --- |
| Emails sent | **0** |
| Forms submitted | **0** |
| Telephone | **0** |
| Vendor accounts created | **0** |
| Acknowledgements | **0** |
| Provider responses | **0** |

---

## 5. What this register does not do

- Does **not** claim any transmission occurred.  
- Does **not** contact providers.  
- Does **not** select a provider or architecture.  
- Does **not** approve Production.  
- Does **not** modify frozen E1-B materials.  
- Does **not** implement application code, migrate, commit, or push.

---

## 6. Additive — 2026-09-17 current-execution pause

Direction: [`adr-0006-e1-c-sedmc-owned-infrastructure-direction.md`](adr-0006-e1-c-sedmc-owned-infrastructure-direction.md).

Rows above remain **NOT TRANSMITTED**. Counts remain **0 transmissions / 0 responses / 0 receipts**. No identifiers were fabricated. Provider RFI transmission is **paused as the current next action**. Do **not** send from this register without a new explicit owner decision. The frozen pack is **contingency material** unless reauthorized.
