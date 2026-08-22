export type EmailTemplate = {
  key: string;
  subject: string;
  bodyText: string;
  bodyHtml?: string;
};

export type EmailTemplateVars = {
  severity: string;
  title: string;
  body: string;
  href: string;
};

export const DEFAULT_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    key: "notif.rfp.urgent",
    subject: "[EOS URGENT] {{title}}",
    bodyText: "{{title}}\n\n{{body}}\n\nView in EOS: {{href}}",
  },
  {
    key: "notif.rfp.warning",
    subject: "[EOS WARNING] {{title}}",
    bodyText: "{{title}}\n\n{{body}}\n\nView in EOS: {{href}}",
  },
  {
    key: "notif.finance.warning",
    subject: "[EOS WARNING] {{title}}",
    bodyText: "{{title}}\n\n{{body}}\n\nView in EOS: {{href}}",
  },
  {
    key: "notif.operations.warning",
    subject: "[EOS WARNING] {{title}}",
    bodyText: "{{title}}\n\n{{body}}\n\nView in EOS: {{href}}",
  },
  {
    key: "notif.approval.urgent",
    subject: "[EOS URGENT] {{title}}",
    bodyText: "{{title}}\n\n{{body}}\n\nView in EOS: {{href}}",
  },
  {
    key: "notif.handover.info",
    subject: "[EOS INFO] {{title}}",
    bodyText: "{{title}}\n\n{{body}}\n\nView in EOS: {{href}}",
  },
];

function interpolate(template: string, vars: EmailTemplateVars): string {
  return template
    .replace(/\{\{title\}\}/g, vars.title)
    .replace(/\{\{body\}\}/g, vars.body)
    .replace(/\{\{href\}\}/g, vars.href)
    .replace(/\{\{severity\}\}/g, vars.severity);
}

export function resolveEmailTemplate(
  templateKey: string,
  vars: EmailTemplateVars,
  overrides: EmailTemplate[] = [],
): { subject: string; bodyText: string; bodyHtml?: string; templateKey: string } {
  const template =
    overrides.find((t) => t.key === templateKey) ??
    DEFAULT_EMAIL_TEMPLATES.find((t) => t.key === templateKey) ??
    DEFAULT_EMAIL_TEMPLATES.find((t) => t.key === "notif.rfp.urgent")!;

  return {
    templateKey: template.key,
    subject: interpolate(template.subject, vars),
    bodyText: interpolate(template.bodyText, vars),
    bodyHtml: template.bodyHtml ? interpolate(template.bodyHtml, vars) : undefined,
  };
}

export function listEmailTemplateKeys(overrides: EmailTemplate[] = []): string[] {
  const keys = new Set(DEFAULT_EMAIL_TEMPLATES.map((t) => t.key));
  for (const t of overrides) keys.add(t.key);
  return [...keys].sort();
}
