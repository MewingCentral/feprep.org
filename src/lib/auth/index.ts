import { Lucia, TimeSpan } from "lucia";
import { adapter } from "~/server/db";

import { type SelectUser } from "~/server/db/schema";

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      emailVerified: attributes.isEmailVerified,
    };
  },
  sessionExpiresIn: new TimeSpan(1, "w"),
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<SelectUser, "hashedPassword">;
  }
}
