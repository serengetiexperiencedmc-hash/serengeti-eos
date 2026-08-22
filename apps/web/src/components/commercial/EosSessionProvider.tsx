"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { EosApiError } from "@/lib/eos-client";
import { clearSession, getStoredEmail, getStoredToken, login, storeSession } from "@/lib/eos-session";

type SessionState = {
  token: string | null;
  email: string | null;
  ready: boolean;
  loggingIn: boolean;
  error: string | null;
};

type SessionContextValue = SessionState & {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function EosSessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>({
    token: null,
    email: null,
    ready: false,
    loggingIn: false,
    error: null,
  });

  useEffect(() => {
    const token = getStoredToken();
    const email = getStoredEmail();
    setState((s) => ({ ...s, token, email, ready: true }));
  }, []);

  const doLogin = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, loggingIn: true, error: null }));
    try {
      const result = await login(email, password);
      storeSession(result.accessToken, email);
      setState((s) => ({
        ...s,
        token: result.accessToken,
        email,
        loggingIn: false,
        error: null,
      }));
    } catch (err) {
      const message =
        err instanceof EosApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Login failed";
      setState((s) => ({ ...s, loggingIn: false, error: message }));
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setState((s) => ({ ...s, token: null, email: null, error: null }));
  }, []);

  const value = useMemo(
    () => ({ ...state, login: doLogin, logout }),
    [state, doLogin, logout],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useEosSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useEosSession must be used within EosSessionProvider");
  return ctx;
}

export function DevLoginPanel() {
  const { token, email, loggingIn, error, login, logout } = useEosSession();
  const [formEmail, setFormEmail] = useState("carol.admin@sedmc.local");
  const [password, setPassword] = useState("");

  if (token) {
    return (
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-line bg-ivory px-4 py-3 text-sm">
        <span className="text-ink-soft">
          API session · <strong className="text-ink">{email}</strong>
        </span>
        <button
          type="button"
          onClick={logout}
          className="text-xs font-medium text-muted underline-offset-2 hover:text-ink hover:underline"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="mb-5 rounded-[10px] border border-gold/40 bg-warning-bg px-5 py-4">
      <div className="mb-3 font-display text-lg font-semibold text-ink">Connect to EOS API</div>
      <p className="mb-4 text-sm text-ink-soft">
        Sign in with your Development credentials. Start the API with{" "}
        <code className="rounded bg-paper px-1.5 py-0.5 text-xs">npm run dev -w @sedmc/api</code> on port 8080.
      </p>
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await login(formEmail, password);
        }}
      >
        <label className="flex flex-col gap-1 text-xs text-muted">
          Email
          <input
            type="email"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            className="min-w-[220px] rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink"
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-w-[180px] rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink"
            required
          />
        </label>
        <button
          type="submit"
          disabled={loggingIn}
          className="rounded-md border border-ink bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-60"
        >
          {loggingIn ? "Signing in…" : "Sign in"}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
    </div>
  );
}
