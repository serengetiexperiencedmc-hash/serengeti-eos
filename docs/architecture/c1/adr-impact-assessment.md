# C1 — ADR Impact Assessment

**Status:** Pre-implementation review

## Open ADRs — do not close by assumption

| ADR | Topic | C1 impact | Action |
| --- | --- | --- | --- |
| ADR-0006 | Hosting / data residency | CRM PII location undefined | **OPEN** — Dev/Test local only |
| ADR-0012 | Secrets platform | No production secrets in CRM | **OPEN** |
| ADR-0013 | Corporate IdP | Dev local auth for CRM API | **OPEN** |
| ADR-0010 | Transactional outbox | CRM events via existing outbox | Dev/Test transport only |

## Existing ADRs — alignment

| ADR | Alignment |
| --- | --- |
| ADR-0002 Modular monolith | CRM as bounded context module under `apps/api/src/crm/` |
| ADR-0008 AI | No AI in C1 — **blocked** |
| ADR-0015 Identity/secrets abstractions | Reuse ports |

## Potential new ADRs (not required to start C1 Dev/Test)

| Topic | Trigger |
| --- | --- |
| CRM PII retention & lawful basis | Before UAT with real contact data |
| CRM search technology | If PostgreSQL search insufficient at scale |
| Document storage for activity attachments | When object storage ADR closed |

## Decision papers

If C1 forces a production vendor choice (email, storage, search SaaS) → stop and create ADR/decision paper.

## External systems

Per [external-systems-register](../../discovery/external-systems-register.md): no ERP, GDS, banking, production email, production IdP in C1.

## Conclusion

**No new ADR required** to begin C1 Development/Test implementation once architecture preview is approved. Open ADRs remain open.
