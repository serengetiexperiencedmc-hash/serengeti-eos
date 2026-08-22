import type { Logger } from "../observability.js";
import type { Store } from "../store.js";
import { DEFAULT_EVENT_CONSUMER, wrapTransportWithConsumer } from "./consumer.js";
import { startNatsJetStreamConsumer } from "./nats-consumer.js";

let natsConsumerHandle: { stop(): Promise<void> } | null = null;

export async function initEventConsumers(store: Store, logger: Logger): Promise<void> {
  if (store.eventTransport) {
    store.eventTransport = wrapTransportWithConsumer(store, store.eventTransport, DEFAULT_EVENT_CONSUMER);
    logger.info("event_consumer_wrapped", { consumer: DEFAULT_EVENT_CONSUMER, transport: store.eventTransport.kind });
  }

  const enableNatsConsumer =
    store.eventTransportKind === "nats-jetstream" &&
    process.env.EOS_NATS_CONSUMER_ENABLED !== "false" &&
    Boolean(process.env.EOS_NATS_URL);

  if (enableNatsConsumer) {
    natsConsumerHandle = await startNatsJetStreamConsumer(store, logger);
  }
}

export async function shutdownEventConsumers(): Promise<void> {
  if (natsConsumerHandle) {
    await natsConsumerHandle.stop();
    natsConsumerHandle = null;
  }
}
