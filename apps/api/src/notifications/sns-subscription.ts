export type SnsConfirmDeps = {
  fetchFn?: typeof fetch;
};

function subscribeUrlAllowed(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    return /\.amazonaws\.com(\.cn)?$/i.test(parsed.hostname);
  } catch {
    return false;
  }
}

export function isSnsAutoConfirmEnabled(): boolean {
  return process.env.EOS_SES_AUTO_CONFIRM_SUBSCRIPTION !== "0";
}

export async function confirmSnsSubscription(
  body: Record<string, unknown>,
  deps: SnsConfirmDeps = {},
): Promise<
  | { ok: true; result: "subscription_confirmed" | "subscription_acknowledged" }
  | { ok: false; reason: string }
> {
  if (body.Type !== "SubscriptionConfirmation") {
    return { ok: false, reason: "not_subscription_confirmation" };
  }

  const subscribeUrl = typeof body.SubscribeURL === "string" ? body.SubscribeURL : undefined;
  if (!subscribeUrl) {
    return { ok: true, result: "subscription_acknowledged" };
  }

  if (!isSnsAutoConfirmEnabled()) {
    return { ok: true, result: "subscription_acknowledged" };
  }

  if (!subscribeUrlAllowed(subscribeUrl)) {
    return { ok: false, reason: "invalid_subscribe_url" };
  }

  const fetchFn = deps.fetchFn ?? fetch;
  try {
    const res = await fetchFn(subscribeUrl, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return { ok: false, reason: "subscribe_confirm_failed" };
    return { ok: true, result: "subscription_confirmed" };
  } catch {
    return { ok: false, reason: "subscribe_confirm_failed" };
  }
}
