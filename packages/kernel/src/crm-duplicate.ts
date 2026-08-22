import { normalizeEmail, normalizePersonName } from "./crm-contact.js";
import { normalizeOrganizationName } from "./crm-org.js";
import type { CrmDuplicateStatus } from "./crm.js";

export const CRM_DUPLICATE_SCORE_THRESHOLD = 80;

export const CRM_DUPLICATE_SUPPRESSION_DAYS = 90;

export const CRM_DUPLICATE_DETECTION_RULES = {
  ORG_LEGAL_NAME_EXACT: "org_legal_name_exact",
  ORG_TRADING_NAME: "org_trading_name",
  ORG_DOMAIN: "org_domain",
  CONTACT_EMAIL_EXACT: "contact_email_exact",
  CONTACT_PHONE_EXACT: "contact_phone_exact",
  CONTACT_NAME_SAME_ORG: "contact_name_same_org",
} as const;

export type CrmDuplicateDetectionRule =
  (typeof CRM_DUPLICATE_DETECTION_RULES)[keyof typeof CRM_DUPLICATE_DETECTION_RULES];

export const CRM_DUPLICATE_SCORES: Record<CrmDuplicateDetectionRule, number> = {
  [CRM_DUPLICATE_DETECTION_RULES.ORG_LEGAL_NAME_EXACT]: 100,
  [CRM_DUPLICATE_DETECTION_RULES.ORG_TRADING_NAME]: 90,
  [CRM_DUPLICATE_DETECTION_RULES.ORG_DOMAIN]: 90,
  [CRM_DUPLICATE_DETECTION_RULES.CONTACT_EMAIL_EXACT]: 100,
  [CRM_DUPLICATE_DETECTION_RULES.CONTACT_PHONE_EXACT]: 80,
  [CRM_DUPLICATE_DETECTION_RULES.CONTACT_NAME_SAME_ORG]: 60,
};

export function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  if (!trimmed) return "";
  const compact = trimmed.replace(/[^\d+]/g, "");
  if (compact.startsWith("+")) return `+${compact.slice(1).replace(/\D/g, "")}`;
  return compact.replace(/\D/g, "");
}

export function normalizeDomain(value: string): string {
  let domain = value.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, "");
  domain = domain.replace(/^www\./, "");
  domain = domain.split("/")[0] ?? domain;
  return domain;
}

export function canonicalDuplicatePair(idA: string, idB: string): [string, string] {
  return idA < idB ? [idA, idB] : [idB, idA];
}

export function duplicateScoreMeetsThreshold(score: number): boolean {
  return score >= CRM_DUPLICATE_SCORE_THRESHOLD;
}

export function canReviewDuplicateDecision(
  status: CrmDuplicateStatus,
  decision: "confirm" | "reject",
): boolean {
  if (status === "ConfirmedDuplicate" || status === "NotDuplicate") return false;
  return decision === "confirm" || decision === "reject";
}

export function duplicateReviewTargetStatus(decision: "confirm" | "reject"): CrmDuplicateStatus {
  return decision === "confirm" ? "ConfirmedDuplicate" : "NotDuplicate";
}

export type OrganizationDuplicateSignals = {
  legalName: string;
  tradingName?: string;
  domain?: string;
  website?: string;
};

export type ContactDuplicateSignals = {
  givenName: string;
  familyName: string;
  email?: string;
  telephone?: string;
  mobile?: string;
  organizationIds: string[];
};

export type DuplicateMatch = {
  rule: CrmDuplicateDetectionRule;
  score: number;
  matchReason: string;
};

export function scoreOrganizationDuplicatePair(
  a: OrganizationDuplicateSignals,
  b: OrganizationDuplicateSignals,
): DuplicateMatch | null {
  const legalA = normalizeOrganizationName(a.legalName);
  const legalB = normalizeOrganizationName(b.legalName);
  if (legalA && legalA === legalB) {
    return {
      rule: CRM_DUPLICATE_DETECTION_RULES.ORG_LEGAL_NAME_EXACT,
      score: CRM_DUPLICATE_SCORES[CRM_DUPLICATE_DETECTION_RULES.ORG_LEGAL_NAME_EXACT],
      matchReason: "normalized_legal_name_exact",
    };
  }

  const namesA = [a.legalName, a.tradingName].filter(Boolean).map((n) => normalizeOrganizationName(n!));
  const namesB = [b.legalName, b.tradingName].filter(Boolean).map((n) => normalizeOrganizationName(n!));
  for (const nameA of namesA) {
    for (const nameB of namesB) {
      if (nameA && nameA === nameB) {
        return {
          rule: CRM_DUPLICATE_DETECTION_RULES.ORG_TRADING_NAME,
          score: CRM_DUPLICATE_SCORES[CRM_DUPLICATE_DETECTION_RULES.ORG_TRADING_NAME],
          matchReason: "normalized_trading_or_legal_name_match",
        };
      }
    }
  }

  const domainsA = [a.domain, a.website].filter(Boolean).map((d) => normalizeDomain(d!)).filter(Boolean);
  const domainsB = [b.domain, b.website].filter(Boolean).map((d) => normalizeDomain(d!)).filter(Boolean);
  for (const domainA of domainsA) {
    for (const domainB of domainsB) {
      if (domainA === domainB) {
        return {
          rule: CRM_DUPLICATE_DETECTION_RULES.ORG_DOMAIN,
          score: CRM_DUPLICATE_SCORES[CRM_DUPLICATE_DETECTION_RULES.ORG_DOMAIN],
          matchReason: "domain_exact",
        };
      }
    }
  }

  return null;
}

function contactPhones(signals: ContactDuplicateSignals): string[] {
  return [signals.telephone, signals.mobile]
    .filter(Boolean)
    .map((p) => normalizePhone(p!))
    .filter((p) => p.length >= 7);
}

export function scoreContactDuplicatePair(
  a: ContactDuplicateSignals,
  b: ContactDuplicateSignals,
): DuplicateMatch | null {
  if (a.email && b.email && normalizeEmail(a.email) === normalizeEmail(b.email)) {
    return {
      rule: CRM_DUPLICATE_DETECTION_RULES.CONTACT_EMAIL_EXACT,
      score: CRM_DUPLICATE_SCORES[CRM_DUPLICATE_DETECTION_RULES.CONTACT_EMAIL_EXACT],
      matchReason: "normalized_email_exact",
    };
  }

  const phonesA = contactPhones(a);
  const phonesB = contactPhones(b);
  for (const phoneA of phonesA) {
    for (const phoneB of phonesB) {
      if (phoneA === phoneB) {
        return {
          rule: CRM_DUPLICATE_DETECTION_RULES.CONTACT_PHONE_EXACT,
          score: CRM_DUPLICATE_SCORES[CRM_DUPLICATE_DETECTION_RULES.CONTACT_PHONE_EXACT],
          matchReason: "normalized_phone_exact",
        };
      }
    }
  }

  const fullNameA = normalizePersonName(`${a.givenName} ${a.familyName}`).toLowerCase();
  const fullNameB = normalizePersonName(`${b.givenName} ${b.familyName}`).toLowerCase();
  if (fullNameA && fullNameA === fullNameB) {
    const sharedOrg = a.organizationIds.some((orgId) => b.organizationIds.includes(orgId));
    if (sharedOrg) {
      return {
        rule: CRM_DUPLICATE_DETECTION_RULES.CONTACT_NAME_SAME_ORG,
        score: CRM_DUPLICATE_SCORES[CRM_DUPLICATE_DETECTION_RULES.CONTACT_NAME_SAME_ORG],
        matchReason: "same_name_shared_organization",
      };
    }
  }

  return null;
}
