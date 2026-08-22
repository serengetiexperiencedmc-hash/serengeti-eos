import { isSmtpConfigured } from "@sedmc/kernel";

export function resolveEmailAdapterName(): string {
  const adapter = process.env.EOS_EMAIL_ADAPTER ?? "dev-outbox";
  if (adapter === "smtp") return isSmtpConfigured() ? "smtp" : "smtp-stub";
  if (adapter === "smtp-stub") return "smtp-stub";
  return "dev-outbox";
}
