"use client";

import { useState } from "react";
import EyebrowLabel from "@/components/EyebrowLabel";
import { ALLOWED_EMAIL_DOMAIN, EVENT_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

export default function SignInPanel({ error }: { error?: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleGoogleSignIn() {
    setLoading(true);
    setMessage(null);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          hd: ALLOWED_EMAIL_DOMAIN,
          prompt: "select_account",
        },
      },
    });

    if (signInError) {
      setLoading(false);
      setMessage("Something went wrong starting Google sign-in. Please try again.");
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="text-center">
        <EyebrowLabel>SOLO HACKATHON // {EVENT_NAME}</EyebrowLabel>
        <h1 className="mt-3 font-display uppercase leading-[0.88] text-4xl sm:text-6xl break-words">
          {EVENT_NAME}
          <br />
          Registration
        </h1>
      </div>

      {error === "domain" ? (
        <div className="mt-8 border-2 border-paper bg-void px-5 py-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-acid">
            Institutional email required
          </p>
          <p className="mt-2 text-sm text-paper/80 leading-relaxed">
            Nirmaan 3.0 registration is restricted to @{ALLOWED_EMAIL_DOMAIN} institutional
            emails. Please sign in again with your ADYPU Google account.
          </p>
        </div>
      ) : null}

      {message ? (
        <div className="mt-8 border-2 border-paper bg-void px-5 py-4">
          <p className="text-sm text-paper/80">{message}</p>
        </div>
      ) : null}

      <div className="mt-10 border-2 border-paper bg-void-soft p-7 sm:p-10 shadow-[8px_8px_0_0_#1e3aff]">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 border-2 border-paper bg-volt px-6 py-4 font-mono text-sm font-bold uppercase tracking-[0.15em] text-paper shadow-[5px_5px_0_0_#f4f1e8] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleMark />
          {loading ? "Redirecting…" : "Continue with Google →"}
        </button>
        <p className="mt-5 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-paper/50">
          Only @{ALLOWED_EMAIL_DOMAIN} accounts are eligible.
        </p>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#fff"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"
      />
      <path
        fill="#fff"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.85.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.9v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#fff"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.16.28-1.7V4.97H.9A9 9 0 0 0 0 9c0 1.45.35 2.83.9 4.03l3.05-2.33z"
      />
      <path
        fill="#fff"
        d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .9 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  );
}
