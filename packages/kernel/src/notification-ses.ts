export type SesTransportConfig = {
  region: string;
  from: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  configurationSet?: string;
};

export function parseSesConfigFromEnv(env: NodeJS.ProcessEnv = process.env): SesTransportConfig | null {
  const region = env.EOS_SES_REGION?.trim();
  if (!region) return null;
  const from = env.EOS_SES_FROM?.trim() ?? env.EOS_SMTP_FROM?.trim() ?? "noreply@sedmc.local";
  const accessKeyId = env.EOS_SES_ACCESS_KEY_ID?.trim() ?? env.AWS_ACCESS_KEY_ID?.trim();
  const secretAccessKey = env.EOS_SES_SECRET_ACCESS_KEY?.trim() ?? env.AWS_SECRET_ACCESS_KEY?.trim();
  const configurationSet = env.EOS_SES_CONFIGURATION_SET?.trim();
  return {
    region,
    from,
    ...(accessKeyId ? { accessKeyId } : {}),
    ...(secretAccessKey ? { secretAccessKey } : {}),
    ...(configurationSet ? { configurationSet } : {}),
  };
}

export function isSesConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.EOS_SES_REGION?.trim());
}
