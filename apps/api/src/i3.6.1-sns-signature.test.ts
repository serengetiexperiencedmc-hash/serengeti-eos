import { createSign, generateKeyPairSync } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  buildSnsStringToSign,
  verifySnsMessage,
  verifySnsSignatureWithCert,
} from "./notifications/sns-signature.js";

function signMessage(message: Record<string, unknown>, privateKey: string, version = "2") {
  const algorithm = version === "2" ? "RSA-SHA256" : "RSA-SHA1";
  const signer = createSign(algorithm);
  signer.update(buildSnsStringToSign(message), "utf8");
  signer.end();
  return signer.sign(privateKey, "base64");
}

describe("I3.6.1 SNS signature verification", () => {
  it("builds Notification string to sign with optional Subject", () => {
    const withSubject = buildSnsStringToSign({
      Type: "Notification",
      Message: "body",
      MessageId: "mid",
      Subject: "subj",
      Timestamp: "2026-08-22T00:00:00.000Z",
      TopicArn: "arn:aws:sns:eu-west-1:123:topic",
    });
    expect(withSubject).toBe("body\nmid\nsubj\n2026-08-22T00:00:00.000Z\narn:aws:sns:eu-west-1:123:topic\nNotification\n");

    const withoutSubject = buildSnsStringToSign({
      Type: "Notification",
      Message: "body",
      MessageId: "mid",
      Timestamp: "2026-08-22T00:00:00.000Z",
      TopicArn: "arn:aws:sns:eu-west-1:123:topic",
    });
    expect(withoutSubject).toBe("body\nmid\n2026-08-22T00:00:00.000Z\narn:aws:sns:eu-west-1:123:topic\nNotification\n");
  });

  it("verifies valid RSA-SHA256 signature", () => {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
    const certPem = publicKey.export({ type: "spki", format: "pem" }) as string;
    const message = {
      Type: "Notification",
      Message: '{"notificationType":"Bounce"}',
      MessageId: "msg-1",
      Timestamp: "2026-08-22T00:00:00.000Z",
      TopicArn: "arn:aws:sns:eu-west-1:123456789012:ses-events",
      SignatureVersion: "2",
    };
    const signature = signMessage(message, privateKey.export({ type: "pkcs8", format: "pem" }), "2");
    expect(verifySnsSignatureWithCert({ ...message, Signature: signature }, certPem)).toBe(true);
  });

  it("rejects invalid signing cert URL", async () => {
    const result = await verifySnsMessage({
      Type: "Notification",
      Message: "x",
      MessageId: "1",
      Timestamp: "t",
      TopicArn: "arn",
      Signature: "sig",
      SigningCertURL: "https://evil.example/cert.pem",
      SignatureVersion: "2",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe("invalid_signing_cert_url");
  });

  it("skips verification when EOS_SES_WEBHOOK_SKIP_SNS_VERIFY=1", async () => {
    const prev = process.env.EOS_SES_WEBHOOK_SKIP_SNS_VERIFY;
    process.env.EOS_SES_WEBHOOK_SKIP_SNS_VERIFY = "1";
    try {
      const result = await verifySnsMessage({
        Type: "Notification",
        Message: "tampered",
        MessageId: "1",
        Timestamp: "t",
        TopicArn: "arn",
        Signature: "bad",
        SigningCertURL: "https://sns.eu-west-1.amazonaws.com/cert.pem",
        SignatureVersion: "2",
      });
      expect(result.ok).toBe(true);
    } finally {
      if (prev === undefined) delete process.env.EOS_SES_WEBHOOK_SKIP_SNS_VERIFY;
      else process.env.EOS_SES_WEBHOOK_SKIP_SNS_VERIFY = prev;
    }
  });

  it("allows direct payloads without SNS envelope fields", async () => {
    const result = await verifySnsMessage({
      notificationType: "Bounce",
      mail: { messageId: "ses-1" },
    });
    expect(result.ok).toBe(true);
  });
});
