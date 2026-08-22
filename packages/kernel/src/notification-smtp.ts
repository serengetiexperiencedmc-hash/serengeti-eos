export type SmtpTransportConfig = {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from: string;
};

export function parseSmtpConfigFromEnv(env: NodeJS.ProcessEnv = process.env): SmtpTransportConfig | null {
  const host = env.EOS_SMTP_HOST?.trim();
  if (!host) return null;
  const port = Number(env.EOS_SMTP_PORT ?? 587);
  const from = env.EOS_SMTP_FROM?.trim() ?? "noreply@sedmc.local";
  const user = env.EOS_SMTP_USER?.trim();
  const pass = env.EOS_SMTP_PASS?.trim();
  return {
    host,
    port: Number.isFinite(port) ? port : 587,
    secure: env.EOS_SMTP_SECURE === "true" || port === 465,
    from,
    ...(user ? { user } : {}),
    ...(pass ? { pass } : {}),
  };
}

export function isSmtpConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.EOS_SMTP_HOST?.trim());
}
