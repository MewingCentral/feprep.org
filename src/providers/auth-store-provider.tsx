"use client";

import { createContext, useContext, useRef } from "react";
import { type validateRequest } from "~/lib/auth/validate-request";
import { type AuthStore, createAuthStore } from "~/stores/auth-store";
import { useStore } from "zustand";

export type AuthStoreApi = ReturnType<typeof createAuthStore>;

export const AuthStoreContext = createContext<AuthStoreApi | undefined>(
  undefined,
);

export function AuthStoreProvider({
  children,
  auth,
}: {
  children: React.ReactNode;
  auth: Awaited<ReturnType<typeof validateRequest>>;
}) {
  const storeRef = useRef<AuthStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createAuthStore(auth);
  }

  return (
    <AuthStoreContext.Provider value={storeRef.current}>
      {children}
    </AuthStoreContext.Provider>
  );
}

export function useAuthStore<T>(selector: (state: AuthStore) => T): T {
  const authStore = useContext(AuthStoreContext);
  if (!authStore) {
    throw new Error("useAuthStore must be used within an AuthStoreProvider");
  }
  return useStore(authStore, selector);
}
