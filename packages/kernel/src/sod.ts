import type { SodRule } from "./types.js";

export type PriorAction = {
  principalId: string;
  action: string;
  objectId: string;
};

export function sodViolation(
  rules: SodRule[],
  prior: PriorAction[],
  next: PriorAction,
): SodRule | undefined {
  for (const rule of rules) {
    const pair = new Set([rule.actionA, rule.actionB]);
    if (!pair.has(next.action)) continue;
    const other = next.action === rule.actionA ? rule.actionB : rule.actionA;
    const conflict = prior.find(
      (p) =>
        p.principalId === next.principalId &&
        p.action === other &&
        (!rule.sameObject || p.objectId === next.objectId),
    );
    if (conflict) return rule;
  }
  return undefined;
}
