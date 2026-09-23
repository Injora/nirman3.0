"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { EVENT_NAME, NAV_LINKS, ORG_SHORT } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

export default function SiteHeader({ userEmail }: { userEmail: string | null }) {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setSigningOut(false);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b-2 border-paper/15 bg-void/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-4">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center border-2 border-paper bg-volt font-display text-sm text-paper">
            N
          </span>
          <span className="font-display uppercase tracking-tight text-lg leading-none">
            {ORG_SHORT}
            <span className="ml-2 text-volt">{EVENT_NAME}</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-[0.2em]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-volt ${
                pathname === link.href ? "text-volt" : "text-paper/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {userEmail ? (
            <>
              <span className="border-2 border-volt bg-void px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-paper">
                {userEmail}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="font-mono text-xs uppercase tracking-widest text-paper/60 hover:text-volt disabled:opacity-50"
              >
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </>
          ) : (
            <Link
              href="/register"
              className="border-2 border-paper bg-volt px-5 py-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-paper shadow-[4px_4px_0_0_#f4f1e8] transition-transform hover:-translate-y-0.5"
            >
              Register →
            </Link>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className="md:hidden flex h-10 w-10 items-center justify-center border-2 border-paper"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="font-mono text-lg">{open ? "×" : "≡"}</span>
        </button>
      </div>

      {open ? (
        <div className="md:hidden border-t-2 border-paper/15 bg-void px-4 pb-6 pt-2">
          <nav className="flex flex-col gap-1 font-mono text-sm uppercase tracking-[0.2em]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-paper/10 py-3 text-paper/80 hover:text-volt"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4">
            {userEmail ? (
              <div className="flex flex-col gap-3">
                <span className="border-2 border-volt px-3 py-2 font-mono text-xs uppercase tracking-widest">
                  {userEmail}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="border-2 border-paper py-2.5 font-mono text-xs uppercase tracking-widest disabled:opacity-50"
                >
                  {signingOut ? "Signing out…" : "Sign out"}
                </button>
              </div>
            ) : (
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="block w-full border-2 border-paper bg-volt py-3 text-center font-mono text-xs font-bold uppercase tracking-[0.2em] text-paper"
              >
                Register →
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
