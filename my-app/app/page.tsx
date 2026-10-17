import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();

  // Server Actions inlined in a Server Component. Both Auth.js helpers throw a
  // redirect, so the form submits and the browser navigates for us.
  async function signInWithGoogle() {
    "use server";
    await signIn("google");
  }

  async function signOutOfApp() {
    "use server";
    await signOut();
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
      <main className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl bg-white p-10 text-center dark:bg-zinc-900">
        {session?.user ? (
          <>
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
              Welcome, {session.user.name ?? session.user.email}
            </h1>
            <form action={signOutOfApp}>
              <button
                type="submit"
                className="h-11 rounded-full border border-solid border-black/[.08] px-6 text-sm font-medium text-black transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
              >
                Sign out
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
              Sign in to continue
            </h1>
            <form action={signInWithGoogle}>
              <button
                type="submit"
                className="h-11 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                Sign in with Google
              </button>
            </form>
          </>
        )}

        {/* Convenience link for testing the Auth.js sign-in page directly. */}
        <Link
          href="/api/auth/signin"
          className="text-sm text-zinc-600 underline underline-offset-4 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          /api/auth/signin
        </Link>
      </main>
    </div>
  );
}
