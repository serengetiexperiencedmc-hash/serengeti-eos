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

/** I4.7: tenant-scoped subject — `{prefix}.{tenantId}.{eventType}` */
export function buildNatsEventSubject(subjectPrefix: string, tenantId: string, eventType: string): string {
  const normalizedType = eventType.replaceAll(".", "_");
  return `${subjectPrefix}.${tenantId}.${normalizedType}`;
}

/** Filter subject for a single tenant's events. */
export function buildNatsTenantFilterSubject(subjectPrefix: string, tenantId: string): string {
  return `${subjectPrefix}.${tenantId}.>`;
}

export function parseTenantIdFromNatsSubject(subject: string, subjectPrefix: string): string | undefined {
  const prefix = `${subjectPrefix}.`;
  if (!subject.startsWith(prefix)) return undefined;
  const rest = subject.slice(prefix.length);
  const tenantId = rest.split(".")[0];
  return tenantId || undefined;
}

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
      const subject = buildNatsEventSubject(opts.subjectPrefix, envelope.tenantId, envelope.eventType);
      await js.publish(subject, sc.encode(JSON.stringify(envelope)));
    },
    health() {
      return { ok: !nc.isClosed(), detail: nc.isClosed() ? "nats_disconnected" : `nats://${opts.url}` };
    },
    async close() {
      await nc.drain();
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

export function tenantDurableConsumerName(tenantId: string): string {
  const compact = tenantId.replace(/-/g, "").slice(0, 16).toUpperCase();
  return `EOS_TENANT_${compact}`;
}
