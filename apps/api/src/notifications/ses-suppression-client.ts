import {
  DeleteSuppressedDestinationCommand,
  ListSuppressedDestinationsCommand,
  PutSuppressedDestinationCommand,
  SESv2Client,
} from "@aws-sdk/client-sesv2";
import type { SesTransportConfig } from "@sedmc/kernel";
import { parseSesConfigFromEnv } from "@sedmc/kernel";

export type SesAccountSuppression = {
  email: string;
  reason: "bounce" | "complaint" | "ses_account";
};

export type SesSuppressionClient = {
  list(): Promise<SesAccountSuppression[]>;
  put(email: string, reason: "BOUNCE" | "COMPLAINT"): Promise<void>;
  remove(email: string): Promise<void>;
};

function mapSesReason(reason?: string): SesAccountSuppression["reason"] {
  if (reason === "BOUNCE") return "bounce";
  if (reason === "COMPLAINT") return "complaint";
  return "ses_account";
}

export function createSesSuppressionClient(config: SesTransportConfig): SesSuppressionClient {
  const client = new SESv2Client({
    region: config.region,
    ...(config.accessKeyId && config.secretAccessKey
      ? { credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey } }
      : {}),
  });

  return {
    async list() {
      const items: SesAccountSuppression[] = [];
      let nextToken: string | undefined;
      do {
        const res = await client.send(
          new ListSuppressedDestinationsCommand({
            PageSize: 100,
            ...(nextToken ? { NextToken: nextToken } : {}),
          }),
        );
        for (const row of res.SuppressedDestinationSummaries ?? []) {
          if (!row.EmailAddress) continue;
          items.push({
            email: row.EmailAddress,
            reason: mapSesReason(row.Reason),
          });
        }
        nextToken = res.NextToken;
      } while (nextToken);
      return items;
    },
    async put(email, reason) {
      await client.send(
        new PutSuppressedDestinationCommand({
          EmailAddress: email,
          Reason: reason,
        }),
      );
    },
    async remove(email) {
      await client.send(
        new DeleteSuppressedDestinationCommand({
          EmailAddress: email,
        }),
      );
    },
  };
}

export function createSesSuppressionClientFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): SesSuppressionClient | null {
  if (env.EOS_SES_SUPPRESSION_SYNC === "0") return null;
  const config = parseSesConfigFromEnv(env);
  if (!config) return null;
  return createSesSuppressionClient(config);
}

export function createInMemorySesSuppressionClient(
  seed: SesAccountSuppression[] = [],
): SesSuppressionClient & { store: SesAccountSuppression[] } {
  const store = [...seed];
  return {
    store,
    async list() {
      return [...store];
    },
    async put(email, reason) {
      const normalized = email.trim().toLowerCase();
      const mapped = reason === "BOUNCE" ? "bounce" : "complaint";
      const existing = store.find((s) => s.email === normalized);
      if (existing) existing.reason = mapped;
      else store.push({ email: normalized, reason: mapped });
    },
    async remove(email) {
      const normalized = email.trim().toLowerCase();
      const idx = store.findIndex((s) => s.email === normalized);
      if (idx >= 0) store.splice(idx, 1);
    },
  };
}
