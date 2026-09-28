# E1-C — Human Decision Dependency Map

> **`SEQUENCING ONLY — NO OUTCOMES CHOSEN`**  
> **`NO DEPENDENCY INVENTED BEYOND REPOSITORY EVIDENCE`**  
> **`HUMAN DECISION ≠ PROVIDER FACT`**  
> **`NO PROVIDER SELECTED`** · **`NO ARCHITECTURE SELECTED`** · **`NO PRODUCTION AUTHORIZATION`**

**Date:** 2026-09-17.  
**Matrix:** [`adr-0006-e1-c-human-decision-evidence-closure-matrix.md`](adr-0006-e1-c-human-decision-evidence-closure-matrix.md).  
**Provider facts:** [`adr-0006-e1-c-provider-evidence-dependency-register.md`](adr-0006-e1-c-provider-evidence-dependency-register.md) (outside this map except where a human decision **also** needs them).

Arrows mean “unresolved upstream item **blocks truthful closure** of the downstream item.” They do **not** mean work on the downstream item cannot be **prepared**.

---

## Map (repository-supported)

```
DPO status (HUM-03 / E-03)
  → Combined Legal/DPO completeness (GAP-LEG-04)
  → Production privacy readiness (notice, IR DPO role, E1 close)

PDPC evidence (HUM-02 / E-02)
  → legal/privacy closure (GAP-LEG-02)
  → Combined privacy evidence (not a substitute for DPO)

Geography census (HUM-04 / E-05 / E-18)
  → applicable-law assessment (Kenya DPA / GDPR / UK GDPR remain conditional)
  → transfer assessment (path-by-path still needs topology — Class E)
  → residency requirements (criteria yes; approved jurisdiction still needs regions)

BCM sequence (HUM-07 / CD-01)
  → recovery design / runbook order
  → operational RACI packaging (HUM-08)
  → recovery testing order (validation plan; tests themselves are Dev/Test or Production-gate)

Production jurisdiction (HUM-10 / GAP-RES-01)
  → provider evaluation *criteria already exist*; *selection* waits
  → ADR-0006
  → DP-0006
  → Production infrastructure (not authorized)

Backup jurisdiction (HUM-10)
  → backup architecture
  → transfer assessment (backup copy path)
  → DR/recovery packaging

DR jurisdiction (HUM-10 / GAP-DR-01)
  → failover design
  → Restricted+ placement (GAP-RES-04 also needs copy locations — provider)
  → recovery validation (if DR in topology)

Budget (HUM-09)
  → commercial/TCO *acceptance* (quotes themselves are provider-dependent)

IdP current-state (HUM-05) / KMS product (HUM-06)
  → security architecture
  → Production implementation (ADR-0013 / ADR-0012 blocked)

Ops ownership (HUM-08)
  → operational readiness
  → Production authorization (necessary, not sufficient)

Entity extract (HUM-01)
  → verified contracting identity
  → privacy-notice entity fields
  → Production identity completeness

RFI send (HUM-11)
  → existence of provider responses
  → E1-B3 intake
  → all Class C closures

ADR-0006 / DP-0006 / E1 Owner approval (HUM-13)
  → Production authorization
  → UAT/hosting finalization (DP-0006 gate)
  → (does not exist until evidence pack exists)
```

---

## Downstream gates (compact)

| Unresolved human item | Affects |
| --- | --- |
| DPO status | Combined Legal/DPO; Production privacy readiness; E1 close |
| PDPC evidence | Legal/privacy closure |
| Geography census | Applicable-law and transfer **conclusions**; not E1-B intake |
| BCM sequence | Recovery design, RACI packaging, recovery test order |
| Production jurisdiction | Architecture geography; ADR-0006; DP-0006; Production infra |
| Backup jurisdiction | Backup architecture; transfer; DR/recovery |
| DR jurisdiction | Failover; Restricted+; recovery validation if used |
| Budget | TCO acceptance (not quote intake) |
| IdP / KMS | Security architecture; Production implementation |
| Ops ownership | Operational readiness; Production authorization |
| Entity extract | Contracting identity; notice entity; Production identity |
| HUM-11 send | Whether any provider evidence can exist |
| HUM-13 approvals | Production / UAT hosting finalization |

E1-B3 **intake** of a response is **not** blocked by HUM-01–HUM-10, HUM-12–HUM-15. It **is** blocked in practice by **zero transmissions** (HUM-11).

Architecture **selection** is blocked by missing provider evidence **and** HUM-10 / HUM-13. Class-level **evaluation criteria** are not blocked.

---

## Dependencies **not** drawn (unsupported or false)

| Claim | Why omitted |
| --- | --- |
| Legal Counsel attestation → DPO complete | Counsel ≠ DPO |
| Tanzania preference → Production jurisdiction decided | Preference ≠ approval |
| Owner pack CHANGED → CD-01 closed | CD-01 opened later |
| HUM-01/02/03 → cannot send RFI | Issuance is information-gathering; already authorized; send still human |
| Budget number → cannot receive quotes | Quotes do not require an approved envelope |
| Completing this map → Production ready | Map is sequencing only |

---

## DECISIONS POTENTIALLY RESOLVABLE NOW

Do **not** require provider evidence. Still require a human. **Not decided here.**

- Entity extract, PDPC artefact, DPO appointment or non-appointment  
- Geography census, current IdP fact, existing-contract harvest  
- BCM governing sequence (CD-01)  
- Paper ops RACI; IR/notice owner **title**  
- Whether to execute authorized RFI/clarification sends  

## DECISIONS THAT SHOULD WAIT FOR PROVIDER EVIDENCE

Do **not** make these now. Human preference is **not** a substitute.

| Topic | Provider dependency (existing mapping) |
| --- | --- |
| Production jurisdiction | PE-03 / actual regions |
| Backup jurisdiction | PE-06 |
| DR jurisdiction | PE-07 |
| IdP **hosting** (if hosted) | Identity processing location |
| KMS product | ADR-0012 after ADR-0006; provider KMS offering |
| TCO / cost-acceptance | Quotes (GAP-TCO-01/02) |
| Technical recovery requirements / measured RTO/RPO | Provider + Production/Dev labelled tests; lab ≠ Production |
| Adopt PITR as Production control | WAL/PITR capability |
| ADR-0006 / DP-0006 / E1 approval | Full evidence pack including provider evidence |
| Architecture / provider selection | Explicitly forbidden in this sprint |

---

## Sufficiency

Resolving every item on this map is **necessary and not sufficient** for Production. Class C, D, and E gaps remain. No infrastructure is provisioned by recording a decision.
