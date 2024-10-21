import { type User, type Session } from "lucia";
import { cache } from "react";
import { lucia } from ".";
import { cookies } from "next/headers";

export const uncachedValidateRequest = async (): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  const c = await cookies();
  const sessionId = c.get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return { user: null, session: null };
  }
  const result = await lucia.validateSession(sessionId);
  // Next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session?.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      c.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      c.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
  } catch {
    console.error("Failed to set session cookie");
  }
  return result;
};

export const validateRequest = cache(uncachedValidateRequest);
