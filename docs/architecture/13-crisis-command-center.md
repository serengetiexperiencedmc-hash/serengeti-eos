# 13. Crisis Command Center Architecture

## 13.1 Severity ladder (unified, not siloed)

| Level | Name | Who can declare | Examples |
| --- | --- | --- | --- |
| L0 | Event | Any staff (report) | Weather watch, delayed vehicle |
| L1 | Incident | Ops / IT / Security duty | Guest injury, system outage |
| L2 | Major incident | Duty manager / CISO / Head of Ops | Multi-programme disruption, security breach in progress |
| L3 | Crisis | Authorised Crisis Commander / Executive | Fatality, kidnap, national emergency, existential cyber |

AI may **recommend** escalation. AI may **not** declare L2/L3 or send external crisis communications.

## 13.2 Command Center capabilities

- Crisis declaration (human) with severity, commander, team
- Situation dashboard (facts vs unconfirmed)
- Live timeline (immutable append)
- Decision log (authority, options, chosen action, rationale)
- Action tracker with owners and due times
- Communications log (internal / client / supplier / public)
- Resource allocation and financial impact estimate (labelled estimate)
- Recovery transition and post-crisis review

## 13.3 Communications

Emergency comms: email, SMS, in-app, push; Teams/business messaging when integrated; voice escalation when a provider exists.

External crisis communications: **risk-based approval** (see human approval matrix). Delivery, acknowledgement, and escalation are recorded.

## 13.4 Relationship to incident and BCM

A crisis **links** to incidents, programmes, suppliers, and BIA processes. It does not fork a second incident model. Unified incident lifecycle remains:

`Detection → Classification → Triage → Assignment → Investigation → Containment → Resolution → Recovery → Closure → RCA → Corrective Action`

Crisis is the **command overlay** for L3 (and optionally L2).

## 13.5 Exercises

Tabletop, technical, cyber (defensive/synthetic), operational, BCM, DR, AI-failure, supplier-failure, programme disruption.

AI may generate **injects** from approved scenario libraries. Scoring: response time, decision time, comms time, RTO/RPO, escalation, role clarity, control effectiveness, recovery. Outputs: report + corrective actions.
