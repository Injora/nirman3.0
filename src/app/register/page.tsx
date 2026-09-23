import ConfirmationPanel from "@/components/register/ConfirmationPanel";
import RegistrationForm from "@/components/register/RegistrationForm";
import SignInPanel from "@/components/register/SignInPanel";
import { ALLOWED_EMAIL_DOMAIN } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type { Registration } from "@/lib/supabase/types";

export default async function RegisterPage({ searchParams }: PageProps<"/register">) {
  const params = await searchParams;
  const errorParam = typeof params.error === "string" ? params.error : undefined;
  const justSubmitted = params.submitted === "1";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
        <SignInPanel error={errorParam} />
      </section>
    );
  }

  const email = user.email?.toLowerCase() ?? "";
  if (!email.endsWith(`@${ALLOWED_EMAIL_DOMAIN}`)) {
    await supabase.auth.signOut();
    return (
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
        <SignInPanel error="domain" />
      </section>
    );
  }

  const { data: registration, error: fetchError } = await supabase
    .from("registrations")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle<Registration>();

  if (fetchError) {
    return (
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-xl border-2 border-paper bg-void-soft p-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-acid">
            Something went wrong
          </p>
          <p className="mt-3 text-sm text-paper/70">
            We couldn&apos;t load your registration status right now. Please refresh the page or
            try again shortly.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
      {registration ? (
        <ConfirmationPanel registration={registration} justSubmitted={justSubmitted} />
      ) : (
        <RegistrationForm
          userId={user.id}
          email={email}
          defaultName={typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : ""}
        />
      )}
    </section>
  );
}
