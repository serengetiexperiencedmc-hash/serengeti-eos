import { connect, StringCodec, type JetStreamClient, type NatsConnection } from "nats";
import type { EventTransport } from "@sedmc/kernel";
import type { EnterpriseEventEnvelope } from "@sedmc/kernel";

export type NatsTransportOptions = {
  url: string;
  stream: string;
  subjectPrefix: string;
};

export type NatsTransportHandle = EventTransport & {
  close(): Promise<void>;
};

export async function createNatsJetStreamTransport(opts: NatsTransportOptions): Promise<NatsTransportHandle> {
  const nc = await connect({ servers: opts.url });
  const js = nc.jetstream();
  const sc = StringCodec();

  try {
    await js.streams.add({
      name: opts.stream,
      subjects: [`${opts.subjectPrefix}.>`],
    });
  } catch {
    // Stream may already exist.
  }

  return {
    kind: "nats-jetstream",
    async publish(envelope: EnterpriseEventEnvelope) {
      const subject = `${opts.subjectPrefix}.${envelope.eventType.replaceAll(".", "_")}`;
      await js.publish(subject, sc.encode(JSON.stringify(envelope)));
    },
    health() {
      return { ok: !nc.isClosed(), detail: nc.isClosed() ? "nats_disconnected" : `nats://${opts.url}` };
    },
    async close() {
      await nc.drain();
      await nc.close();
    },
  };
}

export function createNatsTransportFromEnv(): NatsTransportOptions | null {
  const url = process.env.EOS_NATS_URL;
  if (!url) return null;
  return {
    url,
    stream: process.env.EOS_NATS_STREAM ?? "EOS_EVENTS",
    subjectPrefix: process.env.EOS_NATS_SUBJECT_PREFIX ?? "eos.events",
  };
}

export async function probeNatsJetStream(url: string): Promise<{ ok: boolean; detail: string }> {
  try {
    const nc = await connect({ servers: url, timeout: 3000 });
    const js: JetStreamClient = nc.jetstream();
    await js.streams.info(process.env.EOS_NATS_STREAM ?? "EOS_EVENTS").catch(() => undefined);
    await nc.drain();
    await nc.close();
    return { ok: true, detail: "nats_reachable" };
  } catch (err) {
    return { ok: false, detail: err instanceof Error ? err.message : "nats_unreachable" };
  }
}
