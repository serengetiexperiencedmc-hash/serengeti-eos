export type ExecutionMode = "LIVE" | "SIMULATION";

export class LiveActionBlockedError extends Error {
  constructor(action: string) {
    super(`Simulation context cannot perform live action: ${action}`);
    this.name = "LiveActionBlockedError";
  }
}

export type ExecutionContext = {
  mode: ExecutionMode;
  correlationId: string;
  actorPrincipalId?: string;
};

export function assertLiveAllowed(ctx: ExecutionContext, action: string): void {
  if (ctx.mode === "SIMULATION") {
    throw new LiveActionBlockedError(action);
  }
}

export function isSimulation(ctx: ExecutionContext): boolean {
  return ctx.mode === "SIMULATION";
}
