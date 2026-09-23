import { ALLOWED_EMAIL_DOMAIN } from "@/lib/constants";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isInstitutionalEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  return normalized.endsWith(`@${ALLOWED_EMAIL_DOMAIN}`);
}

export type RegistrationFormValues = {
  full_name: string;
  student_id: string;
  phone_number: string;
  branch: string;
  year: string;
};

export type RegistrationFormErrors = Partial<Record<keyof RegistrationFormValues, string>>;

export function validateRegistrationForm(values: RegistrationFormValues): RegistrationFormErrors {
  const errors: RegistrationFormErrors = {};

  const name = values.full_name.trim();
  if (name.length < 2 || name.length > 120) {
    errors.full_name = "Enter your full name.";
  }

  const studentId = values.student_id.trim();
  if (studentId.length < 2 || studentId.length > 40) {
    errors.student_id = "Enter a valid student ID.";
  }

  const phone = values.phone_number.trim();
  if (!/^[0-9+\-\s]{7,15}$/.test(phone)) {
    errors.phone_number = "Enter a valid phone number.";
  }

  if (!values.branch) {
    errors.branch = "Select your branch.";
  }

  if (!values.year) {
    errors.year = "Select your year.";
  }

  return errors;
}
