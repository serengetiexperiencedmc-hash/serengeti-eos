# E1-B6 — Reservations Consultant Execution Checklist

> **`OPERATIONAL ROUTING SUPERSEDED BY E1-B5 ROUTING RECONCILIATION (2026-09-17)`**  
> **Authoritative routing:** [`adr-0006-e1-b5-routing-reconciliation.md`](adr-0006-e1-b5-routing-reconciliation.md)  
> **`9 FULL-RFI ELIGIBLE / 2 SCOPE CLARIFICATION / 1 HOLD; 0 TRANSMISSIONS`**  
> **The original 11-provider full-pack SEND list in this checklist is SUPERSEDED.**  
> **Do not send the four-document pack to CU-10 or CU-11.**  
> **Do not transmit anything to CU-05.**  
> **`EXECUTION CHECKLIST — NOT A NEW AUTHORIZATION`**  
> **`THIS CHECKLIST DOES NOT CONSTITUTE TRANSMISSION`**  
> **`PACKAGE READY / NOT SENT`**  
> **`ACTUAL TRANSMISSIONS EVIDENCED: 0 FULL-RFI / 0 SCOPE CLARIFICATION`**  
> **`PREPARED ≠ TRANSMITTED`**  
> **`ROUTE VERIFIED ≠ RFI SENT`**  
> **`INFORMATION-GATHERING ONLY`**  
> **`NOT PROVIDER SELECTION`** · **`NOT ARCHITECTURE SELECTION`** · **`NOT CONTRACTING`**  
> **`Production / UAT / Migration / Deployment = NOT AUTHORIZED`**

**Date of this checklist:** 2026-09-17.  
**Routing reconciliation date:** 2026-09-17.  
**Authorized sender:** Reservations Consultant / rfp@serengetiexperiencedmc.com  
**Personal name:** Not recorded — do not invent one.  
**Authoritative operational routing:** [`adr-0006-e1-b5-routing-reconciliation.md`](adr-0006-e1-b5-routing-reconciliation.md)  
**Evidence register (historical rows preserved):** [`adr-0006-e1-b6-rfi-transmission-evidence-register.md`](adr-0006-e1-b6-rfi-transmission-evidence-register.md)  
**Approved wording:** [`adr-0006-e1-b5-rfi-transmittal-template.md`](adr-0006-e1-b5-rfi-transmittal-template.md)  
**Scope clarification questions:** [`adr-0006-e1-b4-6-conditional-provider-scope-clarification-gate.md`](adr-0006-e1-b4-6-conditional-provider-scope-clarification-gate.md)  
**Copy/paste payloads (internal; full-pack payloads for CU-10/CU-11 are not current full-RFI instructions):** [`adr-0006-e1-b5-provider-form-submission-payloads.md`](adr-0006-e1-b5-provider-form-submission-payloads.md)

This checklist helps the authorized Reservations Consultant execute the **already-authorized** information-gathering activity **in the reconciled categories**. Creating or reading this file is **not** a send.

---

## 1. Current governance state (do not change by preparing)

| Item | Value |
| --- | --- |
| Overall state | **PACKAGE READY / NOT SENT** |
| FULL-RFI ELIGIBLE | **9** / **0** transmitted |
| SCOPE CLARIFICATION | **2** (CU-10, CU-11) / **0** transmitted — E1-B4.6 nine questions only; **not** the four-document pack |
| HOLD | **1** (CU-05 — not a transmission target) |
| Historical 11-provider SEND list | **SUPERSEDED** |
| Actual transmissions evidenced | **0** |
| Delivery confirmations | 0 |
| Acknowledgements | 0 |
| Provider responses | 0 |

Do **not** mark any provider TRANSMITTED, DELIVERED, ACKNOWLEDGED, or RESPONSE RECEIVED because this checklist exists.

---

## 2. Authorized sender

| Field | Value |
| --- | --- |
| Role | Reservations Consultant |
| Email | rfp@serengetiexperiencedmc.com |
| Personal name | **Do not invent** |
| Transmittal From line | Reservations Consultant, rfp@serengetiexperiencedmc.com |

Use this mailbox as FROM on every email and as the contact email on every form. Do not substitute a personal mailbox.

---

## 3. Transmission package (exactly four documents)

For each **FULL-RFI ELIGIBLE** provider only, the default external package is:

| # | Document | Path |
| --- | --- | --- |
| 1 | Approved E1-B transmittal letter | `docs/governance/adr-0006-e1-b5-rfi-transmittal-template.md` |
| 2 | Frozen 168-question provider-neutral RFI/RFQ | `docs/governance/adr-0006-e1-b-provider-neutral-rfi-rfq.md` |
| 3 | Frozen PE-01–PE-48 evidence requirements | `docs/governance/adr-0006-e1-b-provider-evidence-requirements.md` |
| 4 | Frozen standard provider response template | `docs/governance/adr-0006-e1-b-standard-provider-response-template.md` |

Do **not** attach this four-document pack to CU-10 or CU-11. Those two, if a later human transmits clarification, receive **only** E1-B4.6 SC-01–SC-09. CU-05 receives **nothing**.

Do **not** attach internal governance documents (E1-B3/B4/B5/B6 registers, company-response files, legal/DPO packs, ADR-0006, DP-0006, this checklist, or the payloads file) unless a later governed instruction says so.

Do **not** alter the frozen questionnaire.

Omit the transmittal `[DEADLINE]` line. No universal numeric response deadline is established. If a provider later gives a date, record that provider-specific date as evidence only.

---

## 4. Verify frozen hashes **before** any transmission

Confirm these are the approved files. Do not send a file that does not match.

| File | SHA-256 |
| --- | --- |
| Questionnaire | `6CE0CD974232988236BE67A169E1E660AB29A127625C01A90378B736231FA2BE` |
| PE pack | `44C73163E7332C0FF995F774BC2716A35FF904410D6E4CDD008A720A987E583E` |
| Response template | `47FAA8E7F700DC04678686FDC938C5894AFB705E2E99172182020B3539DCFAE7` |

Windows example (PowerShell):

```powershell
Get-FileHash -Algorithm SHA256 `
  "docs/governance/adr-0006-e1-b-provider-neutral-rfi-rfq.md", `
  "docs/governance/adr-0006-e1-b-provider-evidence-requirements.md", `
  "docs/governance/adr-0006-e1-b-standard-provider-response-template.md"
```

If a hash differs, **stop**. Do not transmit.

---

## 5. Mandatory disclaimer (verbatim in every email and form)

RFI/RFQ issuance is an information-gathering and market-evidence activity only; responses will be subject to a separate governed evaluation and do not constitute provider or architecture selection, contracting, Production approval, or deployment authorization.

---

## 6. Status distinction (do not collapse)

| Status | Meaning | When to record |
| --- | --- | --- |
| **PREPARED** | Pack and route ready | True for the 9 FULL-RFI ELIGIBLE rows; CU-10/CU-11 prepared for E1-B4.6 questions only |
| **TRANSMITTED** | You actually sent the email or submitted the form | Only after a real send, with evidence |
| **DELIVERY / FORM ACCEPTANCE CONFIRMED** | Mail system accepted, or form returned confirmation | Separate artefact |
| **PROVIDER ACKNOWLEDGED** | Provider human or official auto-reply acknowledges the RFI | Separate artefact |
| **PROVIDER RESPONSE RECEIVED** | Actual questionnaire/evidence response arrived | Then E1-B3 intake |

A verified official webpage proves only that a route exists.

---

## 7. Providers — reconciled categories (not the historical 11)

**Full four-document RFI:** CU-01, CU-02, CU-03, CU-04, CU-06, CU-07, CU-08, CU-09, CU-12 only.

**E1-B4.6 nine questions only (not the full pack):** CU-10, CU-11 — only if a later human executes clarification.

**Nothing:** CU-05.

Do **not** transmit the full RFI to CU-10, CU-11, or CU-05.

| CU-ID | Provider | Official route | Method | Route status |
| --- | --- | --- | --- | --- |
| CU-01 | Africa Data Centres | enquiries@africadatacentres.com | EMAIL | ROUTE VERIFIED |
| CU-02 | Amazon Web Services | AWS official Sales Support / Contact Sales form — https://aws.amazon.com/contact-us/ · https://aws.amazon.com/contact-us/sales-support/ | WEB FORM | ROUTE VERIFIED |
| CU-03 | Google Cloud | Google Cloud Contact Sales form — https://cloud.google.com/contact/form | WEB FORM | ROUTE VERIFIED |
| CU-04 | Hetzner Online | info@hetzner.com | EMAIL | ROUTE VERIFIED |
| CU-06 | Microsoft Azure | Azure Contact Sales — https://azure.microsoft.com/contact/ | WEB FORM | ROUTE VERIFIED |
| CU-07 | Oracle Cloud Infrastructure | Oracle Contact Sales / Sub-Saharan Africa — https://www.oracle.com/africa/corporate/contact/ · https://www.oracle.com/corporate/contact/ | WEB FORM / OFFICIAL SALES ROUTE | ROUTE VERIFIED |
| CU-08 | OVHcloud | OVHcloud Dedicated Sales / Cloud Sales — https://www.ovhcloud.com/en/contact/ · current official sales form https://us.ovhcloud.com/contact-sales/ | OFFICIAL SALES ROUTE | ROUTE VERIFIED |
| CU-09 | Raxio Group | info@raxiogroup.com | EMAIL | ROUTE VERIFIED |
| CU-10 | SEACOM Limited | info@seacom.com — Tanzania Sales / Enterprise RFI routing request | EMAIL | ROUTE VERIFIED — **SCOPE CLARIFICATION only** |
| CU-11 | WIA | info@wia.co.tz | EMAIL | ROUTE VERIFIED — **SCOPE CLARIFICATION only** |
| CU-12 | Wingu Africa | Primary info@wingu.africa; secondary official contact/sales form | EMAIL unless the official form is required/preferred at execution time | ROUTE VERIFIED |

### Provider-specific routing notes

- **CU-07:** Use Contact Sales / Sub-Saharan Africa as the primary route. Do not invent an individual recipient. `contact@oracle.com` is published on official pages; it is not a named person.
- **CU-08:** Do not invent an email address. Use the official sales route/form.
- **CU-09:** Raxio’s Tanzania page currently describes TZ1 as “Launching 2026” / “Coming soon.” That is not proof TZ is operational. Still send the information-gathering RFI to the verified mailbox.
- **CU-10:** **Not a full-RFI recipient.** If a later human executes E1-B4.6 clarification only: ask SEACOM to route to Tanzania Sales / Enterprise RFI. Do **not** use CLS as the primary route. Do **not** describe info@seacom.com as a Tanzania-only mailbox. Do **not** attach the four-document pack.
- **CU-11:** **Not a full-RFI recipient.** If a later human executes E1-B4.6 clarification only, use info@wia.co.tz. Do **not** attach the four-document pack.
- **CU-12:** Email primary. Use the official contact/sales form only if required or preferred at execution time. Dar es Salaam, Tanzania is an available interested location on the official locations sales form.

---

## 8. Email execution (full RFI: CU-01, CU-04, CU-09, CU-12 unless CU-12 uses the form)

Do **not** use this full-pack email procedure for CU-10 or CU-11. Those two, if later executed, use E1-B4.6 SC-01–SC-09 only.

**Subject (do not invent a different one):**

SEDMC E1-B Provider RFI/RFQ — Infrastructure, Hosting, Data Residency & Recovery

For CU-10 / CU-11, do **not** use this full-RFI subject or the four attachments. Use the E1-B4.6 copy block if a later human executes clarification.

For each email provider:

1. Open the approved transmittal (`adr-0006-e1-b5-rfi-transmittal-template.md`) and the matching email payload in `adr-0006-e1-b5-provider-form-submission-payloads.md`.
2. Confirm the four approved external documents.
3. Confirm the three frozen hashes where applicable.
4. Create the email using the approved E1-B transmittal wording. Insert the actual send date only when sending. Leave `[SENDER NAME]` as the role (Reservations Consultant). Do not invent a personal name. Delete the `[DEADLINE]` line.
5. Use **FROM:** rfp@serengetiexperiencedmc.com
6. Address **only** the verified provider route in §7. Do not add invented names or extra mailboxes.
7. Attach the four approved external documents.
8. Confirm the mandatory disclaimer in §5 is present.
9. Send.
10. Immediately preserve evidence (§10).

Do not alter the frozen questionnaire.

---

## 9. Web-form / official sales-route execution (CU-02, CU-03, CU-06, CU-07, CU-08; CU-12 only if form used)

Copy the approved payload for that provider from `adr-0006-e1-b5-provider-form-submission-payloads.md`. Use the **E1-B6 official form URLs** in §7 if a payloads URL differs.

Company identity on every form:

- **Makundi Serengeti Experience DMC**
- Contact email: rfp@serengetiexperiencedmc.com
- Role: Reservations Consultant

Approved short project description (use the provider’s payload text; this is the common meaning):

SEDMC is gathering comparable information on Production hosting, data residency, PostgreSQL-capable infrastructure, backup/PITR, DR, security, support/SLA and TCO. No architecture or provider has been selected.

For each form provider:

1. Open the official provider form listed in §7.
2. Use the approved E1-B form submission payload.
3. Use rfp@serengetiexperiencedmc.com.
4. Identify SEDMC as **Makundi Serengeti Experience DMC**.
5. Use the approved project description.
6. Request the appropriate enterprise / RFI / procurement contact where the form allows. Do not invent a named person.
7. Attach the four approved external documents if attachments are supported.
8. If attachments are not supported, request the provider’s appropriate secure email or upload route. Do not paste the 168 questions into a short form.
9. Submit **only** after verifying the provider and form.
10. Immediately preserve the confirmation evidence (§10).

Do **not** claim a form was submitted unless it actually was. Do not create a vendor account for this RFI unless an official form truly requires one and that fact is recorded as evidence.

Official sales/contact forms are enquiry channels. They are not RFI/procurement portals and are not awards.

---

## 10. Evidence capture (immediately after each actual transmission)

### Email

Capture: date; time; timezone; sender; recipient; subject; Message-ID if available; sent-mail evidence; delivery/bounce information; provider acknowledgement if any.

### Web form

Capture: provider; official form URL; date; time; timezone; sender email; exact submitted text; attachments submitted; confirmation number if any; confirmation page; screenshot/PDF if available; automated acknowledgement if any.

Provide that evidence to the EOS governance process for registration in:

`docs/governance/adr-0006-e1-b6-rfi-transmission-evidence-register.md`

Do **not** manually claim transmission in governance records without evidence.

---

## 11. After a real provider response

Do **not** score or rank the response.

Route it into E1-B3 evidence intake:

**Receive → Register → Preserve → Assign evidence ID → Verify → Clarify if necessary → Evaluate.**

Do not treat receipt as verification, selection, contracting, or Production approval.

---

## 12. Execution tracker

Initial values: Prepared = YES; Sent = NO; Evidence Captured = NO; Delivery/Form Acceptance = NO; Acknowledged = NO; Response Received = NO; Follow-up = NOT STARTED.

The Consultant updates **Sent** and later columns only after the corresponding artefact exists. CU-10 and CU-11 **Sent** means E1-B4.6 clarification sent, **not** the full RFI.

| CU-ID | Provider | Route | Method | Prepared | Sent | Evidence Captured | Delivery/Form Acceptance | Acknowledged | Response Received | Follow-up | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CU-01 | Africa Data Centres | enquiries@africadatacentres.com | EMAIL | YES | NO | NO | NO | NO | NO | NOT STARTED | FULL-RFI ELIGIBLE |
| CU-02 | Amazon Web Services | AWS Sales Support / Contact Sales form | WEB FORM | YES | NO | NO | NO | NO | NO | NOT STARTED | FULL-RFI ELIGIBLE |
| CU-03 | Google Cloud | Google Cloud Contact Sales form | WEB FORM | YES | NO | NO | NO | NO | NO | NOT STARTED | FULL-RFI ELIGIBLE |
| CU-04 | Hetzner Online | info@hetzner.com | EMAIL | YES | NO | NO | NO | NO | NO | NOT STARTED | FULL-RFI ELIGIBLE |
| CU-06 | Microsoft Azure | Azure Contact Sales | WEB FORM | YES | NO | NO | NO | NO | NO | NOT STARTED | FULL-RFI ELIGIBLE |
| CU-07 | Oracle Cloud Infrastructure | Oracle Contact Sales / Sub-Saharan Africa | WEB FORM / OFFICIAL SALES ROUTE | YES | NO | NO | NO | NO | NO | NOT STARTED | FULL-RFI ELIGIBLE — do not invent an individual |
| CU-08 | OVHcloud | Dedicated Sales / Cloud Sales (incl. https://us.ovhcloud.com/contact-sales/) | OFFICIAL SALES ROUTE | YES | NO | NO | NO | NO | NO | NOT STARTED | FULL-RFI ELIGIBLE — do not invent an email |
| CU-09 | Raxio Group | info@raxiogroup.com | EMAIL | YES | NO | NO | NO | NO | NO | NOT STARTED | FULL-RFI ELIGIBLE — TZ1 not treated as operational |
| CU-10 | SEACOM Limited | info@seacom.com — Tanzania Sales / Enterprise RFI | EMAIL | YES | NO | NO | NO | NO | NO | NOT STARTED | **SCOPE CLARIFICATION** — not full RFI; not CLS; mailbox is not Tanzania-only |
| CU-11 | WIA | info@wia.co.tz | EMAIL | YES | NO | NO | NO | NO | NO | NOT STARTED | **SCOPE CLARIFICATION** — not full RFI |
| CU-12 | Wingu Africa | info@wingu.africa (email unless official form required/preferred) | EMAIL / FORM IF REQUIRED | YES | NO | NO | NO | NO | NO | NOT STARTED | FULL-RFI ELIGIBLE |

---

## 13. HOLD — not a transmission target

| CU-ID | Provider | Status |
| --- | --- | --- |
| CU-05 | Liquid C2 (Liquid Intelligent Technologies) | **HOLD — SCOPE CLARIFICATION** |

Do **not** send email, submit a form, call, or create a vendor account for CU-05 under this checklist. CU-05 is **not** in the scope-clarification transmission set.

---

## 14. Final governance statement

This checklist facilitates execution of an already-authorized information-gathering activity. It does not constitute provider selection, architecture selection, contracting, Production approval, deployment authorization, migration authorization, or provider commitment.

**Current state remains: PACKAGE READY / NOT SENT.** FULL-RFI 9 eligible / 0 transmitted. SCOPE CLARIFICATION 2 eligible / 0 transmitted. HOLD 1 / no transmission.
