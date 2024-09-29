import { createStore } from "zustand/vanilla";
import { type validateRequest } from "~/lib/auth/validate-request";

export type AuthState = Awaited<ReturnType<typeof validateRequest>>;

export type AuthStore = AuthState;

export const defaultAuthState: AuthState = {
  user: null,
  session: null,
};

export const createAuthStore = (
  initialAuthState: AuthState = defaultAuthState,
) => {
  return createStore<AuthStore>()(() => ({
    ...initialAuthState,
  }));
};
