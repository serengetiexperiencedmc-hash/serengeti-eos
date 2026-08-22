import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import type { EmailNotificationMessage } from "@sedmc/kernel";
import type { SesTransportConfig } from "@sedmc/kernel";

export async function sendViaSes(config: SesTransportConfig, message: EmailNotificationMessage): Promise<void> {
  const client = new SESv2Client({
    region: config.region,
    ...(config.accessKeyId && config.secretAccessKey
      ? { credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey } }
      : {}),
  });

  await client.send(
    new SendEmailCommand({
      FromEmailAddress: config.from,
      Destination: { ToAddresses: [message.to] },
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
}
