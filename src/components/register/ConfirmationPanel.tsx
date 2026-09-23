import Link from "next/link";
import EyebrowLabel from "@/components/EyebrowLabel";
import type { Registration } from "@/lib/supabase/types";

export default function ConfirmationPanel({
  registration,
  justSubmitted,
}: {
  registration: Registration;
  justSubmitted: boolean;
}) {
  const createdAt = new Date(registration.created_at).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="mx-auto max-w-xl text-center">
      <EyebrowLabel tone={justSubmitted ? "acid" : "volt"}>
        {justSubmitted ? "Registration confirmed ✓" : "Already registered"}
      </EyebrowLabel>

      <h1 className="mt-4 font-display uppercase leading-[0.88] text-4xl sm:text-6xl break-words">
        {justSubmitted ? (
          <>
            You&apos;re in.
          </>
        ) : (
          <>
            You&apos;re already
            <br />
            registered.
          </>
        )}
      </h1>

      {!justSubmitted ? (
        <p className="mt-4 text-sm sm:text-base text-paper/60">
          This account already has a Nirmaan 3.0 registration on file.
        </p>
      ) : null}

      <div className="mt-10 border-2 border-paper bg-void-soft p-7 sm:p-9 text-left shadow-[8px_8px_0_0_#1e3aff]">
        <div className="grid grid-cols-2 gap-6">
          <Field label="Full name" value={registration.full_name} />
          <Field label="Registration ID" value={registration.registration_code} accent />
          <Field label="Email" value={registration.email} span />
          <Field label="Student ID" value={registration.student_id} />
          <Field label="Phone" value={registration.phone_number} />
          <Field label="Year" value={registration.year} />
          <Field label="Status" value={registration.registration_status} />
        </div>

        <div className="mt-6 border-t-2 border-paper/15 pt-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/40">
            Registered {createdAt}
          </p>
        </div>
      </div>

      <Link
        href="/"
        className="mt-8 inline-block font-mono text-xs uppercase tracking-[0.2em] text-paper/60 hover:text-volt"
      >
        ← Back to home
      </Link>
    </div>
  );
}

function Field({
  label,
  value,
  span,
  accent,
}: {
  label: string;
  value: string;
  span?: boolean;
  accent?: boolean;
}) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40">{label}</p>
      <p className={`mt-1 break-words text-sm sm:text-base ${accent ? "text-volt font-bold" : "text-paper"}`}>
        {value}
      </p>
    </div>
  );
}
