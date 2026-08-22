import {
  AckPolicy,
  DeliverPolicy,
  connect,
  StringCodec,
  type JetStreamClient,
  type JetStreamManager,
} from "nats";
import type { EventTransport } from "@sedmc/kernel";
import type { EnterpriseEventEnvelope } from "@sedmc/kernel";

export type NatsTransportOptions = {
  url: string;
  stream: string;
  subjectPrefix: string;
};

export type NatsTransportHandle = EventTransport & {
  close(): Promise<void>;
  provisionedTenants?: Set<string>;
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

export function tenantDurableConsumerName(tenantId: string): string {
  const compact = tenantId.replace(/-/g, "").slice(0, 16).toUpperCase();
  return `EOS_TENANT_${compact}`;
}

export function isAutoTenantDurablesEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.EOS_NATS_AUTO_TENANT_DURABLES !== "0";
}

/** I4.8: ensure a durable pull consumer filtered to one tenant. */
export async function ensureTenantDurableConsumer(
  jsm: JetStreamManager,
  stream: string,
  subjectPrefix: string,
  tenantId: string,
): Promise<{ durableName: string; filterSubject: string; created: boolean }> {
  const durableName = tenantDurableConsumerName(tenantId);
  const filterSubject = buildNatsTenantFilterSubject(subjectPrefix, tenantId);
  try {
    await jsm.consumers.info(stream, durableName);
    return { durableName, filterSubject, created: false };
  } catch {
    await jsm.consumers.add(stream, {
      durable_name: durableName,
      ack_policy: AckPolicy.Explicit,
      deliver_policy: DeliverPolicy.All,
      filter_subject: filterSubject,
    });
    return { durableName, filterSubject, created: true };
  }
}

export async function createNatsJetStreamTransport(opts: NatsTransportOptions): Promise<NatsTransportHandle> {
  const nc = await connect({ servers: opts.url });
  const js = nc.jetstream();
  const jsm = await nc.jetstreamManager();
  const sc = StringCodec();
  const provisionedTenants = new Set<string>();

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
    provisionedTenants,
    async publish(envelope: EnterpriseEventEnvelope) {
      if (isAutoTenantDurablesEnabled() && !provisionedTenants.has(envelope.tenantId)) {
        try {
          await ensureTenantDurableConsumer(jsm, opts.stream, opts.subjectPrefix, envelope.tenantId);
          provisionedTenants.add(envelope.tenantId);
        } catch {
          // Best-effort; publish still proceeds.
        }
      }
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
