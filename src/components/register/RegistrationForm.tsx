"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EyebrowLabel from "@/components/EyebrowLabel";
import { BRANCHES, EVENT_NAME, YEARS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import {
  validateRegistrationForm,
  type RegistrationFormErrors,
  type RegistrationFormValues,
} from "@/lib/validation";

const UNIQUE_VIOLATION = "23505";

const fieldClass =
  "w-full border-2 border-paper bg-void px-4 py-3.5 font-mono text-sm text-paper placeholder:text-paper/30 outline-none focus:border-volt";

const labelClass = "block font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60 mb-2";

export default function RegistrationForm({
  userId,
  email,
  defaultName,
}: {
  userId: string;
  email: string;
  defaultName: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<RegistrationFormValues>({
    full_name: defaultName,
    student_id: "",
    phone_number: "",
    branch: "",
    year: "",
  });
  const [errors, setErrors] = useState<RegistrationFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function update<K extends keyof RegistrationFormValues>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const nextErrors = validateRegistrationForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const supabase = createClient();

    const { error } = await supabase.from("registrations").insert({
      user_id: userId,
      email,
      full_name: values.full_name.trim(),
      student_id: values.student_id.trim(),
      phone_number: values.phone_number.trim(),
      branch: values.branch,
      year: values.year,
    });

    if (error) {
      setSubmitting(false);
      if (error.code === UNIQUE_VIOLATION) {
        router.push("/register");
        router.refresh();
        return;
      }
      setFormError(
        "We couldn't save your registration. Please check your connection and try again.",
      );
      return;
    }

    router.push("/register?submitted=1");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-xl">
      <EyebrowLabel tone="acid">Identity verified</EyebrowLabel>
      <p className="mt-2 font-mono text-sm text-paper/80 break-all">{email}</p>

      <h1 className="mt-6 font-display uppercase leading-[0.88] text-4xl sm:text-5xl break-words">
        Complete your
        <br />
        {EVENT_NAME} registration
      </h1>

      {formError ? (
        <div className="mt-6 border-2 border-paper bg-void px-5 py-4">
          <p className="text-sm text-paper/80">{formError}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <div>
          <label className={labelClass} htmlFor="email">
            Institutional email
          </label>
          <input id="email" value={email} disabled className={`${fieldClass} opacity-60`} />
        </div>

        <div>
          <label className={labelClass} htmlFor="full_name">
            Full name
          </label>
          <input
            id="full_name"
            className={fieldClass}
            value={values.full_name}
            onChange={(e) => update("full_name", e.target.value)}
            placeholder="Your full name"
          />
          {errors.full_name ? <FieldError message={errors.full_name} /> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="student_id">
            Student ID
          </label>
          <input
            id="student_id"
            className={fieldClass}
            value={values.student_id}
            onChange={(e) => update("student_id", e.target.value)}
            placeholder="e.g. e25b070901"
          />
          {errors.student_id ? <FieldError message={errors.student_id} /> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="phone_number">
            Phone number
          </label>
          <input
            id="phone_number"
            className={fieldClass}
            value={values.phone_number}
            onChange={(e) => update("phone_number", e.target.value)}
            placeholder="+91 90000 00000"
          />
          {errors.phone_number ? <FieldError message={errors.phone_number} /> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="branch">
            Branch
          </label>
          <select
            id="branch"
            className={fieldClass}
            value={values.branch}
            onChange={(e) => update("branch", e.target.value)}
          >
            <option value="">Select branch</option>
            {BRANCHES.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
          {errors.branch ? <FieldError message={errors.branch} /> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="year">
            Year
          </label>
          <select
            id="year"
            className={fieldClass}
            value={values.year}
            onChange={(e) => update("year", e.target.value)}
          >
            <option value="">Select year</option>
            {YEARS.map((year) => (
              <option key={year.value} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
          {errors.year ? <FieldError message={errors.year} /> : null}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full border-2 border-paper bg-volt px-6 py-4 font-mono text-sm font-bold uppercase tracking-[0.15em] text-paper shadow-[5px_5px_0_0_#f4f1e8] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Confirm Registration →"}
        </button>
      </form>
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return <p className="mt-2 font-mono text-[11px] uppercase tracking-wide text-acid">{message}</p>;
}
