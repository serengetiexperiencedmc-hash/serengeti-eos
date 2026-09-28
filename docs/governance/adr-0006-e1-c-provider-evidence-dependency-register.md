# E1-C — Provider-Evidence Dependency Register (Class C)

> **`AWAITING PROVIDER RESPONSE`**  
> **`NO PROVIDER ANSWERS FILLED`**  
> **`0 TRANSMISSIONS`** · **`0 RESPONSES`**  
> **`FROZEN PE STATUSES REMAIN NOT REQUESTED — THIS FILE DOES NOT REWRITE THE PE PACK`**

**Date:** 2026-09-17.  
**Routing:** 9 FULL-RFI ELIGIBLE / 2 SCOPE CLARIFICATION / 1 HOLD.  
**PE pack:** [`adr-0006-e1-b-provider-evidence-requirements.md`](adr-0006-e1-b-provider-evidence-requirements.md) (unmodified).  
**Questionnaire:** [`adr-0006-e1-b-provider-neutral-rfi-rfq.md`](adr-0006-e1-b-provider-neutral-rfi-rfq.md) (unmodified).

Every row is **AWAITING PROVIDER RESPONSE** unless an independent SEDMC artefact already answers it. None of the Production hosting facts below are independently evidenced.

CU-10 / CU-11: full PE/Q pack **not** the current send. Map still applies **if** later full-RFI eligible. Until then, E1-B4.6 SC-01–SC-09 only. CU-05: no send.

---

| Gap / topic | E1-B PE / Q mapping (illustrative, not exclusive) | Independent SEDMC evidence? | Status |
| --- | --- | --- | --- |
| Production region (GAP-HST-01, GAP-HST-02) | PE-03 primary hosting geography | No | **AWAITING PROVIDER RESPONSE** |
| Tanzania residency | PE-03, PE-04; Class C facility questions | Preference only — not proof | **AWAITING PROVIDER RESPONSE** |
| Backup jurisdiction (GAP-BKP-01) | PE-06 backup geography | Lab dumps excluded | **AWAITING PROVIDER RESPONSE** |
| DR jurisdiction (GAP-DR-01) | PE-07 DR geography | Unselected | **AWAITING PROVIDER RESPONSE** |
| Restricted+ placement (GAP-RES-04) | PE-06/07; failover/copy questions | LA-14 criterion only | **AWAITING PROVIDER RESPONSE** |
| PostgreSQL (GAP-PER-03 related hosting) | PE-04; DB capability questions | ADR-0003 Dev class only | **AWAITING PROVIDER RESPONSE** |
| PITR / WAL (GAP-BKP-02) | Q-B-05; Q-E-05; Q-E-06 | E2 lab PARTIAL ≠ Production | **AWAITING PROVIDER RESPONSE** |
| Backup retention | Backup retention questions | None Production | **AWAITING PROVIDER RESPONSE** |
| Restore evidence (GAP-REC-01 related) | Restore-proof PE items | Lab synthetic only | **AWAITING PROVIDER RESPONSE** |
| Technical RTO/RPO (GAP-REC-02) | Q-G-02 and related Q-G | Business ≤3h/≤4h **KNOWN**; technical **not** measured in Production | **AWAITING PROVIDER RESPONSE** |
| Failover / failback (GAP-DR-02 provider part) | DR/failover questions | None | **AWAITING PROVIDER RESPONSE** |
| Subprocessors (GAP-LEG-05 vendors) | PE-09 | Register empty | **AWAITING PROVIDER RESPONSE** |
| Government access (GAP-SEU-04) | Government-access questions | None | **AWAITING PROVIDER RESPONSE** |
| Deletion | Deletion/retention questions | E-13 draft ≠ provider capability | **AWAITING PROVIDER RESPONSE** |
| Portability / exit | Exit/retrieval; TCO retrieval | DP-0006 exit dimension only | **AWAITING PROVIDER RESPONSE** |
| Encryption (GAP-SEU-02) | At-rest / in-transit / backup encryption | None Production | **AWAITING PROVIDER RESPONSE** |
| KMS (GAP-SEC-02) | KMS/secrets questions | ADR-0012 product unselected | **AWAITING PROVIDER RESPONSE** |
| Identity hosting (GAP-IDN-01 hosted IdP) | IdP processing location | Dev local IdP only | **AWAITING PROVIDER RESPONSE** |
| WAF (GAP-SEU-01) | Edge/WAF questions | Not selected | **AWAITING PROVIDER RESPONSE** |
| Monitoring (GAP-OBS-01) | Logging/monitoring questions | Dev logger `productionReady: false` | **AWAITING PROVIDER RESPONSE** |
| Support (GAP-SEU-03, GAP-OPS-03) | PE-08; SLA questions | Company MFA/log **requirements** only | **AWAITING PROVIDER RESPONSE** |
| TCO (GAP-TCO-01, GAP-TCO-02) | Q-N commercial breakdown | Structure known; no quotes | **AWAITING PROVIDER RESPONSE** |
| Object/document storage (GAP-PER-03) | PE-05 object storage geography | LocalFs Dev | **AWAITING PROVIDER RESPONSE** |
| Email (GAP-INF-02) | Email/subprocessor questions | Dev SES mention ≠ Production | **AWAITING PROVIDER RESPONSE** |
| Cloud-connect (GAP-NET-02 / CU-05) | Only if later in scope; SC not a SEND | HOLD | **AWAITING PROVIDER RESPONSE** (if ever sent) |
| CU-10 / CU-11 hosting scope (GAP-HST-03) | E1-B4.6 SC-01–SC-09 **not** 168-Q | Questions prepared; not sent | **AWAITING PROVIDER RESPONSE** (after human send) |

Do not treat a public contact page, region marketing page, or qualification tag as a filled answer.
