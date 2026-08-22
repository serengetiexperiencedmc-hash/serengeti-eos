import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import type { EmailNotificationMessage } from "@sedmc/kernel";
import type { SesTransportConfig } from "@sedmc/kernel";

export type SesSendMetadata = {
  tenantId: string;
  notificationKey: string;
};

export async function sendViaSes(
  config: SesTransportConfig,
  message: EmailNotificationMessage,
  metadata?: SesSendMetadata,
): Promise<{ messageId: string }> {
  const client = new SESv2Client({
    region: config.region,
    ...(config.accessKeyId && config.secretAccessKey
      ? { credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey } }
      : {}),
  });

  const result = await client.send(
    new SendEmailCommand({
      FromEmailAddress: config.from,
      Destination: { ToAddresses: [message.to] },
      ...(config.configurationSet ? { ConfigurationSetName: config.configurationSet } : {}),
      ...(metadata
        ? {
            EmailTags: [
              { Name: "tenantId", Value: metadata.tenantId },
              { Name: "notificationKey", Value: metadata.notificationKey },
            ],
          }
        : {}),
      Content: {
        Simple: {
          Subject: { Data: message.subject, Charset: "UTF-8" },
          Body: {
            Text: { Data: message.bodyText, Charset: "UTF-8" },
            ...(message.bodyHtml ? { Html: { Data: message.bodyHtml, Charset: "UTF-8" } } : {}),
          },
        },
      },
    }),
  );

  return { messageId: result.MessageId ?? "" };
}
