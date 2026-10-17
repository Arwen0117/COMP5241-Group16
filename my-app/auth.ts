import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import type { NextAuthConfig } from 'next-auth';

/**
 * Auth.js (next-auth v5) configuration.
 *
 * Docs: https://authjs.dev/getting-started/installation?framework=next.js
 *
 * The Google provider reads its credentials from the `AUTH_GOOGLE_ID` /
 * `AUTH_GOOGLE_SECRET` env vars. Until those are filled in, the app runs on a
 * mock session (see `lib/getCurrentUser.ts`), so nothing here breaks local dev.
 */
export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  // JWT sessions keep auth stateless for now; swap in a Prisma adapter later
  // if you want sessions/accounts persisted in the database.
  session: { strategy: 'jwt' },
  // Required outside Vercel (e.g. http://localhost:3000) so Auth.js trusts
  // the incoming host header instead of rejecting the request.
  trustHost: true,
  callbacks: {
    // Persist the database user id on the token so it survives across requests.
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Expose the id on the session object returned by `auth()`.
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string | undefined) ?? token.sub ?? '';
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
