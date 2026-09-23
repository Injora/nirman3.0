# Nirmaan 3.0 — Registration

Registration site for **Nirmaan 3.0**, a solo hackathon run by **NST-SDC** (Student
Developer Club) as part of its student intake. Built with Next.js 16 (App Router) and
Supabase (Auth + Postgres).

- Google sign-in, restricted to `@adypu.edu.in` institutional accounts
- One registration per Google account, enforced at the database level
- Registration data lives in Postgres behind Row Level Security — no data is ever
  exposed publicly or queryable in bulk from the browser
- A lightweight organizer view at `/admin` for reviewing registrations

## Stack

| Layer      | Choice                                             |
| ---------- | --------------------------------------------------- |
| Frontend   | Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4 |
| Auth       | Supabase Auth (Google OAuth provider)              |
| Database   | Supabase Postgres, Row Level Security               |
| Hosting    | Any Next.js host (Vercel recommended)              |

No other backend exists — the frontend talks to Supabase directly (via the public
publishable key) for everything except cookie/session plumbing, which is handled by a
Route Handler (`/auth/callback`) and a request-time session refresher (`proxy.ts`,
Next 16's renamed `middleware.ts`).

## 1. Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase project's URL + publishable key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Until Supabase is configured
(see below), sign-in will fail — that's expected.

## 2. Supabase project setup

### 2.1 Create the project

Create a Supabase project dedicated to Nirmaan 3.0 (don't share it with an unrelated
app — the domain-restriction trigger below applies to *every* signup in the project).

### 2.2 Run the migration

In the Supabase SQL Editor, run the contents of
[`supabase/migrations/0001_nirmaan_registrations.sql`](supabase/migrations/0001_nirmaan_registrations.sql)
once. It creates:

- The `registrations` table, with `user_id` and `email` both unique, plus check
  constraints on phone format, year, status, and the `@adypu.edu.in` domain.
- A `BEFORE INSERT` trigger on `auth.users` that **rejects account creation
  outright** for any email that isn't `@adypu.edu.in` (case-insensitive, and it
  normalizes the stored email to lowercase). This is the authoritative
  enforcement layer — see "How the domain restriction is enforced" below.
- RLS policies so a signed-in student can only `select`/`insert` their **own**
  registration row — never anyone else's, never the whole table.
- An `admins` table + `is_admin()` function for the `/admin` view (see 2.5).

### 2.3 Configure the Google provider

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials),
   use (or create) an OAuth 2.0 Client ID of type "Web application".
2. Add this authorized redirect URI (Supabase's own callback, **not** your app's):
   `https://<your-project-ref>.supabase.co/auth/v1/callback`
3. In the Supabase Dashboard → **Authentication → Providers → Google**, enable the
   provider and paste in the Client ID and Client Secret from step 1.
4. In **Authentication → URL Configuration**:
   - **Site URL**: your production URL (e.g. `https://nirmaan.yourdomain.com`)
   - **Redirect URLs**: add both your production and local callback URLs:
     - `https://nirmaan.yourdomain.com/auth/callback`
     - `http://localhost:3000/auth/callback`

> This repo already has a `.env` file at the project root with a Google OAuth
> Client ID/Secret pair in it from your own Google Cloud setup — those are the
> values that go into step 3 above (Supabase's Google provider config), **not**
> into `.env.local`. The Next.js app itself never reads Google credentials
> directly; Supabase's Auth server handles the OAuth handshake.

### 2.4 Environment variables

Copy `.env.example` to `.env.local` and fill in (Project Settings → API):

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key, sb_publishable_...>
```

Only the publishable key is used — the secret key (SUPABASE_SECRET_KEY) is never needed by this app and
must never be added to any `NEXT_PUBLIC_*` variable or committed anywhere.

### 2.5 Make yourself an organizer (for `/admin`)

1. Sign in once through the deployed/running app with your own `@adypu.edu.in`
   Google account (this creates your `auth.users` row).
2. In the SQL Editor:
   ```sql
   select id, email from auth.users where email = 'you@adypu.edu.in';
   insert into public.admins (user_id) values ('<uuid-from-above>');
   ```
3. Visit `/admin` — you'll now see the registrations table with search/filter and
   a total count. Anyone not in `admins` is redirected away, whether or not they
   know the URL.

## 3. How the `@adypu.edu.in` restriction is enforced

Three independent layers, so no single bypass (browser devtools, direct REST
calls, a modified frontend) gets around it:

1. **Postgres trigger on `auth.users`** (`enforce_adypu_domain_on_signup`) —
   runs inside the database before a user row can ever be created. This is the
   real gate: even a raw call to Supabase's Auth REST API can't create an account
   with a non-`@adypu.edu.in` email.
2. **`/auth/callback` route handler** — after exchanging the OAuth code for a
   session, it double-checks the email and signs the user back out if it somehow
   slipped through, redirecting to `/register?error=domain` with a clear message.
3. **RLS insert policy on `registrations`** (plus a `CHECK` constraint on the
   column itself) — even if someone had a valid session under a different email
   scheme, the insert is rejected unless the email matches both the authenticated
   JWT and the `@adypu.edu.in` pattern.

Emails are normalized to lowercase at the trigger, so `Name@ADYPU.EDU.IN` and
`name@adypu.edu.in` are treated identically.

## 4. Solo-only / one-registration guarantee

- There is no team/invite concept anywhere in the schema or UI.
- `registrations.user_id` has a `UNIQUE` constraint, and a unique index on
  `lower(email)` — a second insert attempt for the same account fails at the
  database with a `23505` unique-violation, which the UI catches and turns into
  an "Already registered" state (not a crash).
- The registration code (`NIR-000001`, …) is generated by the database from a
  sequence — never client-generated, so it can't collide.

## 5. Deployment (Vercel)

1. Push this repo to GitHub and import it in Vercel.
2. Add the two environment variables from `.env.example` in the Vercel project
   settings.
3. Add your Vercel production URL to Supabase's Redirect URLs (see 2.3) and update
   the Site URL if this is the primary deployment.
4. Deploy. No build-time Supabase access is required — every route is
   request-time dynamic (it reads the auth cookie), so there's nothing to
   pre-render against a live database.

## 6. Project structure

```
src/
  app/
    page.tsx                 Landing page (hero, about, rules, timeline)
    register/page.tsx        Registration flow — server component, drives all states
    admin/page.tsx            Organizer view, protected by is_admin()
    auth/callback/route.ts    OAuth code exchange + domain re-check
  components/
    register/                 SignInPanel, RegistrationForm, ConfirmationPanel
    admin/AdminTable.tsx       Search/filter table (client component)
    SiteHeader.tsx, SiteFooter.tsx, Button.tsx, PosterCard.tsx, …
  lib/
    supabase/client.ts         Browser Supabase client
    supabase/server.ts         Server Supabase client (Server Components/Routes)
    supabase/types.ts          Hand-written Database types
    constants.ts, validation.ts
  proxy.ts                     Session refresh on every request (Next 16's proxy,
                                formerly middleware.ts)
supabase/migrations/
  0001_nirmaan_registrations.sql   Full schema, triggers, RLS — source of truth
```

## 7. Registration states covered

Logged out → Google auth in progress → unauthorized email → authenticated +
no registration (form) → just submitted (confirmation) → already registered
(on a later visit) → database/network error (inline message, not a crash). See
`src/app/register/page.tsx` and `src/components/register/*`.

## Notes

- This project targets **Next.js 16**, which renamed `middleware.ts` to
  `proxy.ts` (same behavior, new file name/export). If you're used to older
  Next.js docs, keep that in mind when extending this app.
- `@supabase/postgrest-js` in this project's installed version has a quirk where
  declaring table row types as `interface` (instead of `type`) breaks generic
  inference on `.insert()`, silently widening the expected type to `never[]`.
  `src/lib/supabase/types.ts` uses `type` aliases for exactly this reason — keep
  it that way if you extend the schema.
