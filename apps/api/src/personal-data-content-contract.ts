/**
 * H-140 — API wrapper for the structural person-domain content contract.
 * Does not scan free-text bodies or file bytes.
 */
import { findPersonDomainObjectKeys, isPersonDomainDocumentFilename } from "@sedmc/kernel";
import { personDomainRemoved } from "./personal-data-phase1.js";

export function rejectPersonDomainContent(input: unknown) {
  if (findPersonDomainObjectKeys(input).length > 0) return personDomainRemoved();
  return undefined;
}

export function rejectPersonDomainDocumentFilename(filename: string) {
  if (isPersonDomainDocumentFilename(filename)) return personDomainRemoved();
  return undefined;
}
