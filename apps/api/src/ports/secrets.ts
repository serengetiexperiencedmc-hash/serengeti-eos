import type { SecretsProvider } from "@sedmc/kernel";

/** Development-only: reads process env. Never use as Production secrets platform. */
export function createEnvSecretsProvider(): SecretsProvider {
  return {
    name: "env-dev",
    get(reference: string): string | undefined {
      const value = process.env[reference];
      return value === undefined || value === "" ? undefined : value;
    },
  };
}
