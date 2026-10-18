import type { Session } from 'next-auth';
import { auth } from '@/auth';
import { db } from '@/lib/db';

/**
 * The shape of the signed-in user used across the app's API routes.
 * `role` mirrors `User.role` in prisma/schema.prisma.
 */
export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string | null;
};

/**
 * Until Google OAuth is actually wired up we fall back to this mock user,
 * which matches the seed data (prisma/seed.ts).
 */
export const MOCK_USER: CurrentUser = {
  id: 'user-1',
  email: 'test@test.com',
  name: 'Test User',
  role: 'student',
};

/**
 * Mock auth is on by default until the Google credentials exist, so the API
 * keeps working in development. Set `AUTH_MOCK=false` to force the real
 * session, or `AUTH_MOCK=true` to force the mock.
 */
export function isMockAuthEnabled(): boolean {
  const flag = process.env.AUTH_MOCK;
  if (flag === 'true') return true;
  if (flag === 'false') return false;
  return !process.env.AUTH_GOOGLE_ID || !process.env.AUTH_GOOGLE_SECRET;
}

/**
 * Returns the Auth.js session, or a mock session while auth is not wired up.
 */
export async function getSession(): Promise<Session | null> {
  if (isMockAuthEnabled()) {
    return {
      user: { ...MOCK_USER, image: null },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    } as Session;
  }

  return auth();
}

/**
 * Returns the current user for use inside API routes, or `null` when nobody
 * is signed in.
 *
 * ```ts
 * const user = await getCurrentUser();
 * if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 * ```
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getSession();
  const email = session?.user?.email;

  if (!email) return null;

  // Prefer the database record so we get the real id and role.
  const dbUser = await db.user.findUnique({ where: { email } });
  if (dbUser) {
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      image: session.user.image ?? null,
    };
  }

  // Signed in with Google but not present in the database yet.
  return {
    id: session.user.id,
    email,
    name: session.user.name ?? email,
    role: 'student',
    image: session.user.image ?? null,
  };
}
