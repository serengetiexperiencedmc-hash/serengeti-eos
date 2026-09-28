# H-182 companion — Production DR validation procedure (not executed)

> **PROCEDURE PREPARED. TEST NOT AUTHORIZED. TEST NOT PERFORMED.**  
> Parent: H-182. Architecture: H-169. Test grant: P19 **ABSENT**.  
> Measured RTO/RPO **must not** be filled until a real authorized test produces dated evidence.

**Date:** 2026-09-22.

```text
PROCEDURE STATUS = PREPARED — NOT EXECUTED
P19 DR-test grant = NOT GRANTED
H177-D15 = NOT SELECTED FOR OUTBOUND
RTO requirement = ≤ 4 hours (business)
RPO requirement = ≤ 1 hour (business)
Measured RTO = NOT AVAILABLE
Measured RPO = NOT AVAILABLE
```

Pass/fail is against the **requirements**, using **measured** values from this procedure only.

---

## 1. Authorization to run this procedure

Do **not** start until **all** are true:

1. Written Production implementation already occurred (instances and replica exist) **or** an Owner-approved isolated DR-test environment is explicitly in scope of a P19 grant.
2. Written **P19** DR-test authorization naming window, operator, and rollback.
3. Named failover/switchover authority (HUM-08) — names not invented in this file.
4. Application validation criteria recorded (EV-A03) before the test.
5. This is **not** inferred from H-169, H-181, or this procedure existing.

---

## 2. Definitions

### RTO (measure)

`time from declared regional outage / approved failover start to EOS service restoration and validated business operation`

- **Start timestamp (`T0`):** the recorded instant of (a) declared regional outage for the test scenario **or** (b) approved failover start, whichever the P19 grant specifies. Record timezone (Africa/Nairobi and UTC).
- **End timestamp (`T1`):** the recorded instant when **all** of §6 application + database + transaction + business-acceptance checks pass.
- **Measured RTO:** `T1 − T0`.
- **Pass:** Measured RTO ≤ 4 hours.
- **Fail:** Measured RTO > 4 hours, or any §6 check failed, or timestamps missing.

Provider “replica failover is immediate” **must not** be copied in as measured RTO.

### RPO (measure)

`maximum confirmed amount of committed data potentially lost between the last accepted transaction and recovered state`

- **Marker method:** insert or confirm a uniquely identifiable committed business transaction `TX_LAST` on the primary **immediately before** `T0` (or at a recorded time `T_COMMIT` ≤ `T0`). Record transaction id / business key and `T_COMMIT`.
- **Recovered state:** after failover, query whether `TX_LAST` (and any later committed markers) are present.
- **Measured RPO:** if `TX_LAST` is present, RPO for that marker is **0** relative to `T_COMMIT` (still record replica lag evidence). If `TX_LAST` is absent, Measured RPO is `T0 − T_COMMIT` for that lost commit, or the lag-derived bound the test design recorded — **whichever is evidenced**. Do not invent a lag figure.
- **Pass:** Measured RPO ≤ 1 hour.
- **Fail:** Measured RPO > 1 hour, or inability to bound loss, or missing markers.

---

## 3. Evidence sources (required artefacts)

| Artefact | Content | Invented? |
| --- | --- | --- |
| Incident / test log | Operator, P19 grant id, `T0`/`T1`, UTC+EAT | No — from clock |
| Failover evidence | Provider operation ids, console/API output | No — from provider |
| Database validation | Query results for `TX_LAST`, connection to write endpoint | No |
| Application validation | Auth, core commercial read/write smoke, events/email if in scope | No |
| Transaction validation | Marker presence/absence | No |
| User/business acceptance | Named acceptor **when HUM-08 exists** | Do not invent name |
| Switchback evidence | Separate timestamps if switchback in scope | No |
| Measured RTO / RPO | Computed from above | No |

Store later under a dated evidence directory. **Do not** create mock results in this increment.

---

## 4. Pre-test checklist

- [ ] P19 grant on file
- [ ] Replica exists and is designated (implementation evidence)
- [ ] App DR package exists (even if passive not deployed — P19 must say what is in scope)
- [ ] Marker transaction plan
- [ ] Rollback plan (abort path)
- [ ] Stakeholders notified (roles, not invented people)

---

## 5. Execution steps (only after P19)

1. Record `T_COMMIT` and `TX_LAST`.
2. Record `T0` (declared outage or approved failover start).
3. Execute approved DB failover/promote **per then-current provider procedure** (do not paste stale CLI here as if it were a live run).
4. Cut over application per active-passive design (write endpoint / `[PRODUCTION DNS NAME TO BE DETERMINED]` — real name only if it exists at test time).
5. Run §6 validations.
6. Record `T1` when validations pass, or record **FAIL** with last failed check.
7. If switchback in scope: execute switchover when both healthy; record switchback evidence.
8. Compute Measured RTO and Measured RPO; record pass/fail.
9. Close incident log.

---

## 6. Validation checks (all required for `T1`)

| ID | Check |
| --- | --- |
| V-DB | Write endpoint accepts a new committed test transaction |
| V-TX | `TX_LAST` presence/absence recorded |
| V-APP | Application starts and authenticates in the recovered path |
| V-BIZ | Agreed commercial smoke (account/opportunity or P19-named slice) succeeds |
| V-OBS | Logging/monitoring still receiving signals (or documented gap) |

---

## 7. Result template (leave blank until a real test)

| Field | Value |
| --- | --- |
| P19 grant id | _empty_ |
| Operator | _empty — do not invent_ |
| `T_COMMIT` | _empty_ |
| `T0` | _empty_ |
| `T1` | _empty_ |
| Measured RTO | **NOT AVAILABLE** |
| Measured RPO | **NOT AVAILABLE** |
| Pass RTO ≤4h | **NOT EVALUATED** |
| Pass RPO ≤1h | **NOT EVALUATED** |

---

## 8. Explicit non-claims

```text
No DR test was performed.
No failover was performed.
No measured RTO or RPO exists.
Provider documentation is not a substitute for this procedure's outputs.
```
