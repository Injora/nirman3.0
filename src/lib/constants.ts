export const EVENT_NAME = "NIRMAAN 3.0";
export const ORG_SHORT = "NST-SDC";
export const ORG_FULL = "NST Student Developer Club";
export const ALLOWED_EMAIL_DOMAIN = "adypu.edu.in";

export const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#hackathon", label: "Hackathon" },
  { href: "/#rules", label: "Rules" },
  { href: "/register", label: "Registration" },
] as const;

export const BRANCHES = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Other",
] as const;

export const YEARS = [
  { value: "1", label: "1st Year" },
  { value: "2", label: "2nd Year" },
  { value: "3", label: "3rd Year" },
  { value: "4", label: "4th Year" },
] as const;

export const ABOUT_POINTS = [
  {
    label: "01 // FORMAT",
    title: "Solo. No teams.",
    body: "Nirmaan 3.0 is built for individual builders. You register alone, you build alone, and you ship alone — one Google account, one registration, one shot.",
  },
  {
    label: "02 // ORGANIZER",
    title: "Run by NST-SDC",
    body: "Conducted by the Student Developer Club as part of its official student intake — a chance to get on the club's radar by shipping something real.",
  },
  {
    label: "03 // ELIGIBILITY",
    title: "ADYPU students only",
    body: "Open exclusively to students holding a verified @adypu.edu.in institutional email. Verification happens through Google sign-in, enforced at the database.",
  },
] as const;

export const RULES = [
  "This is a strictly solo hackathon — no teams, no team codes, no invites.",
  "One Google account may hold exactly one registration. Duplicate attempts are rejected.",
  "Only @adypu.edu.in institutional email addresses are eligible to register or participate.",
  "All code must be written during the hackathon window. Pre-built projects will be disqualified.",
  "Organizers reserve the right to verify identity and registration details at check-in.",
  "Decisions made by the NST-SDC organizing team are final.",
] as const;

export const TIMELINE = [
  { tag: "PHASE 01", title: "Registrations Open", detail: "Solo registration opens for all eligible ADYPU students." },
  { tag: "PHASE 02", title: "Problem Statements Drop", detail: "Tracks and problem statements are released to registered builders." },
  { tag: "PHASE 03", title: "Build Window", detail: "The solo build sprint — design, build, and ship your submission." },
  { tag: "PHASE 04", title: "Submissions Close", detail: "Final submissions lock. No late entries accepted." },
  { tag: "PHASE 05", title: "Results & Intake", detail: "Top builders are shortlisted into the NST-SDC student intake." },
] as const;
