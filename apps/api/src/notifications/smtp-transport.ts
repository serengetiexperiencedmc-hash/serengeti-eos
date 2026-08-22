import net from "node:net";
import type { EmailNotificationMessage } from "@sedmc/kernel";
import type { SmtpTransportConfig } from "@sedmc/kernel";

/** Minimal SMTP client for Dev/Test relays (e.g. Mailhog on :1025). Not Production-grade. */
export async function sendViaSmtp(config: SmtpTransportConfig, message: EmailNotificationMessage): Promise<void> {
  const lines = [
    `EHLO eos.local\r\n`,
    `MAIL FROM:<${config.from}>\r\n`,
    `RCPT TO:<${message.to}>\r\n`,
    `DATA\r\n`,
    `From: ${config.from}\r\n`,
    `To: ${message.to}\r\n`,
    `Subject: ${message.subject}\r\n`,
    `Content-Type: text/plain; charset=utf-8\r\n`,
    `\r\n`,
    `${message.bodyText}\r\n`,
    `.\r\n`,
    `QUIT\r\n`,
  ];

  await new Promise<void>((resolve, reject) => {
    const socket = net.connect(config.port, config.host);
    let step = 0;
    let buffer = "";

    const fail = (err: Error) => {
      socket.destroy();
      reject(err);
    };

    socket.on("error", fail);
    socket.on("data", (chunk) => {
      buffer += chunk.toString();
      while (buffer.includes("\r\n")) {
        const idx = buffer.indexOf("\r\n");
        const line = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        const code = Number(line.slice(0, 3));
        if (!Number.isFinite(code)) continue;

        if (step === 0 && code === 220) {
          socket.write(lines[step]!);
          step += 1;
          continue;
        }
        if (code >= 400) {
          fail(new Error(`smtp_error:${line}`));
          return;
        }
        if (step < lines.length) {
          socket.write(lines[step]!);
          step += 1;
        } else if (code === 221) {
          socket.end();
          resolve();
          return;
        }
      }
    });
    socket.on("close", () => resolve());
  });
}
