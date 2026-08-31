/** Narrow service unions that include success objects with `error?: never`. */
export function isHttpErrorResult(result: object): result is { error: string } {
  return "error" in result && typeof (result as { error?: unknown }).error === "string";
}

/** Drop keys whose values are `undefined` so objects satisfy `exactOptionalPropertyTypes`. */
export function withoutUndefined<T extends Record<string, unknown>>(
  record: T,
): { [K in keyof T as undefined extends T[K] ? never : K]: T[K] } & {
  [K in keyof T as undefined extends T[K] ? K : never]?: Exclude<T[K], undefined>;
} {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    if (value !== undefined) out[key] = value;
  }
  return out as never;
}

export function sendHttpError(
  reply: { code: (n: number) => { send: (b: unknown) => unknown } },
  result: { error: string },
): unknown {
  switch (result.error) {
    case "unauthenticated":
      return reply.code(401).send(result);
    case "forbidden":
      return reply.code(403).send(result);
    case "not_found":
      return reply.code(404).send(result);
    case "conflict":
      return reply.code(409).send(result);
    default:
      return reply.code(400).send(result);
  }
}
