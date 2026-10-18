import type { DefaultSession } from 'next-auth';

// Make the extra fields we put on the session/token known to TypeScript.
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
  }
}
