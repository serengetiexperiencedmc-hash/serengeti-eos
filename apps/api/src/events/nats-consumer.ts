import {
  AckPolicy,
  connect,
  DeliverPolicy,
  StringCodec,
  type JetStreamSubscription,
  type NatsConnection,
} from "nats";
import type { EnterpriseEventEnvelope } from "@sedmc/kernel";
import type { Logger } from "../observability.js";
import type { Store } from "../store.js";
import { DEFAULT_EVENT_CONSUMER, processEventEnvelope } from "./consumer.js";
import {
  buildNatsTenantFilterSubject,
  createNatsTransportFromEnv,
  tenantDurableConsumerName,
} from "./nats-transport.js";
import { recordNatsConsumerOffset } from "../persistence/nats-offsets.js";

export type NatsConsumerHandle = {
  stop(): Promise<void>;
};

function resolveSubscribeSubject(subjectPrefix: string): { subject: string; durableName: string; filterMode: "all" | "tenant" } {
  const consumerName = process.env.EOS_NATS_CONSUMER ?? "EOS_PLATFORM_OBSERVER";
  const filterTenant = process.env.EOS_NATS_FILTER_TENANT?.trim();
  if (filterTenant) {
    return {
      subject: buildNatsTenantFilterSubject(subjectPrefix, filterTenant),
      durableName: process.env.EOS_NATS_CONSUMER ?? tenantDurableConsumerName(filterTenant),
      filterMode: "tenant",
    };
  }
  const explicitFilter = process.env.EOS_NATS_FILTER_SUBJECT?.trim();
  if (explicitFilter) {
    return { subject: explicitFilter, durableName: consumerName, filterMode: "tenant" };
  }
  return {
    subject: `${subjectPrefix}.>`,
    durableName: consumerName,
    filterMode: "all",
  };
}

export async function startNatsJetStreamConsumer(
  store: Store,
  logger: Logger,
): Promise<NatsConsumerHandle | null> {
  const opts = createNatsTransportFromEnv();
  if (!opts) return null;

  const resolved = resolveSubscribeSubject(opts.subjectPrefix);
  const nc: NatsConnection = await connect({ servers: opts.url });
  const js = nc.jetstream();
  const sc = StringCodec();

  let sub: JetStreamSubscription;
  try {
    sub = await js.subscribe(resolved.subject, {
      config: {
        durable_name: resolved.durableName,
        ack_policy: AckPolicy.Explicit,
        deliver_policy: DeliverPolicy.All,
        filter_subject: resolved.subject,
      },
    });
  } catch (err) {
    logger.error("nats_consumer_subscribe_failed", {
      err: err instanceof Error ? err.message : "unknown",
      subject: resolved.subject,
    });
    await nc.drain();
    await nc.close();
    return null;
  }

  logger.info("nats_consumer_started", {
    consumer: DEFAULT_EVENT_CONSUMER,
    durable: resolved.durableName,
    subject: resolved.subject,
    filterMode: resolved.filterMode,
    increment: "I4.7",
  });

  let stopped = false;
  void (async () => {
    for await (const msg of sub) {
      if (stopped) break;
      try {
        const envelope = JSON.parse(sc.decode(msg.data)) as EnterpriseEventEnvelope;
        const result = processEventEnvelope(store, envelope, DEFAULT_EVENT_CONSUMER);
        if (result.delivered) {
          if (result.processed && msg.seq) {
            recordNatsConsumerOffset(store, {
              tenantId: envelope.tenantId,
              consumer: DEFAULT_EVENT_CONSUMER,
              stream: opts.stream,
              streamSeq: msg.seq,
              eventId: envelope.eventId,
            });
          }
          msg.ack();
        } else msg.nak();
      } catch (err) {
        logger.warn("nats_consumer_message_failed", {
          err: err instanceof Error ? err.message : "unknown",
        });
        msg.nak();
      }
    }
  })();

  return {
    async stop() {
      stopped = true;
      await sub.drain();
      await nc.drain();
      await nc.close();
    },
  };
}
