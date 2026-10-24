import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  /** Dynamic baseURL automatically using window.location.origin on client to prevent ERR_CONNECTION_REFUSED */
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
        process.env.BETTER_AUTH_URL ||
        "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession } = authClient;
