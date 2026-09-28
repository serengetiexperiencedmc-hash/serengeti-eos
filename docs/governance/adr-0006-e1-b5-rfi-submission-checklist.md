# E1-B5 — RFI Submission Checklist

> **`INTERNAL PRE-SEND CONTROL`**  
> **`PACKAGE READY ≠ SENT`**  
> **`UNCHECKED ITEMS REMAIN UNCHECKED UNTIL FACTUALLY TRUE`**  
> **`THIS SESSION DOES NOT SEND`**

Use one copy of this checklist **per intended transmission**. Do not tick a box unless the fact is true. Inventing a recipient, sender, deadline, or send confirmation is forbidden.

Issuance package version: `E1-B5-ISSUANCE-PACKAGE`  
Register: [`adr-0006-e1-b5-rfi-issuance-control-register.md`](adr-0006-e1-b5-rfi-issuance-control-register.md)  
Manifest: [`adr-0006-e1-b5-rfi-issuance-package-manifest.md`](adr-0006-e1-b5-rfi-issuance-package-manifest.md)  
Cover: [`adr-0006-e1-b5-rfi-transmittal-template.md`](adr-0006-e1-b5-rfi-transmittal-template.md)

**Candidate ID (if any):** ________  
**Checklist date:** ________  
**Completed by:** ________  

---

## Package contents

- [ ] Recipient identity verified
- [ ] Recipient address verified
- [ ] Correct questionnaire version (frozen 168-question E1-B RFI/RFQ)
- [ ] PE-01–PE-48 pack attached
- [ ] Response template attached
- [ ] Transmittal sentence present (exact authorized wording)
- [ ] No provider-specific architecture preference
- [ ] No provider ranking
- [ ] No selection language
- [ ] No contracting commitment
- [ ] No Production commitment
- [ ] No UAT commitment
- [ ] Response deadline entered only if actually authorized/established
- [ ] Sender identity verified
- [ ] Transmission channel recorded
- [ ] Actual send confirmation captured
- [ ] Delivery confirmation captured
- [ ] Response tracking activated

**Current master copy:** all boxes **unchecked**. No recipient, sender, channel, or send confirmation exists.

---

## State-machine reminder

CANDIDATE IDENTIFIED → RECIPIENT NOT VERIFIED → RECIPIENT VERIFIED → PACKAGE READY → READY FOR TRANSMISSION → ACTUALLY SENT → DELIVERY CONFIRMED → RESPONSE RECEIVED → E1-B3 EVIDENCE INTAKE

Do **not** treat PACKAGE READY as SENT.  
Do **not** treat RECIPIENT IDENTIFIED as PROVIDER SELECTED.  
Do **not** treat RESPONSE RECEIVED as PROVIDER APPROVED.

Until a real transmission is recorded: **PACKAGE READY / NOT SENT**.
