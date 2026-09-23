-- Nirmaan 3.0 — registrations schema, domain enforcement, and RLS.
--
-- Run this once in the Supabase SQL Editor (or via `supabase db push`) on a
-- project dedicated to Nirmaan 3.0. It is idempotent-ish (safe to re-run
-- after fixing an error partway through) but is not designed to be run
-- twice successfully end-to-end — use a fresh migration for changes.

create extension if not exists pgcrypto;

-- ============================================================================
-- 1. DOMAIN ENFORCEMENT AT THE AUTH LAYER
-- ============================================================================
-- This is the authoritative enforcement point: it runs inside Postgres
-- before a row can ever be written to auth.users, so it cannot be bypassed
-- by calling the Supabase Auth REST/JS API directly, regardless of what the
-- frontend does. Emails are also normalized to lowercase here.
create or replace function public.enforce_adypu_domain()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is null or lower(new.email) not like '%@adypu.edu.in' then
    raise exception
      'Nirmaan 3.0 registration is restricted to @adypu.edu.in institutional accounts.'
      using errcode = 'P0001';
  end if;

  new.email := lower(new.email);
  return new;
end;
$$;

drop trigger if exists enforce_adypu_domain_on_signup on auth.users;
create trigger enforce_adypu_domain_on_signup
  before insert on auth.users
  for each row
  execute function public.enforce_adypu_domain();

-- ============================================================================
-- 2. REGISTRATIONS TABLE
-- ============================================================================
create sequence if not exists public.registration_code_seq start 1;

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  registration_code text not null unique
    default ('NIR-' || lpad(nextval('public.registration_code_seq')::text, 6, '0')),
  full_name text not null,
  email text not null,
  student_id text not null,
  phone_number text not null,
  branch text not null,
  year text not null,
  registration_status text not null default 'registered',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint registrations_user_unique unique (user_id),
  constraint registrations_full_name_len check (char_length(btrim(full_name)) between 2 and 120),
  constraint registrations_student_id_len check (char_length(btrim(student_id)) between 2 and 40),
  constraint registrations_phone_format check (phone_number ~ '^[0-9+\-\s]{7,15}$'),
  constraint registrations_year_valid check (year in ('1', '2', '3', '4')),
  constraint registrations_status_valid
    check (registration_status in ('registered', 'waitlisted', 'cancelled')),
  -- Defense in depth: even a direct insert bypassing the app must satisfy
  -- the same @adypu.edu.in restriction as the auth.users trigger.
  constraint registrations_email_domain check (email = lower(email) and email like '%@adypu.edu.in')
);

-- Case-insensitive uniqueness on email in addition to the user_id constraint
-- above — belt and braces against the same person registering under two
-- Supabase auth identities that happen to share an email.
create unique index if not exists registrations_email_lower_idx
  on public.registrations (lower(email));

create index if not exists registrations_created_at_idx
  on public.registrations (created_at desc);
create index if not exists registrations_status_idx
  on public.registrations (registration_status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists registrations_set_updated_at on public.registrations;
create trigger registrations_set_updated_at
  before update on public.registrations
  for each row
  execute function public.set_updated_at();

alter table public.registrations enable row level security;

drop policy if exists "Students can view own registration" on public.registrations;
create policy "Students can view own registration"
  on public.registrations
  for select
  to authenticated
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Students can insert own registration" on public.registrations;
create policy "Students can insert own registration"
  on public.registrations
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    and email like '%@adypu.edu.in'
  );

-- No UPDATE or DELETE policy: registrations are immutable once submitted.
-- (Add an UPDATE policy scoped to `auth.uid() = user_id` later if the
-- product needs student-editable registrations.)

-- ============================================================================
-- 3. ADMIN / ORGANIZER ACCESS
-- ============================================================================
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
-- Intentionally no policies: only the service role (which bypasses RLS) or
-- the Supabase SQL Editor (as postgres) can read/write this table. No
-- authenticated-role policy exists, so it is never queryable from the
-- browser or the anon/authenticated API key.

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to authenticated;

-- ============================================================================
-- 4. MAKE SOMEONE AN ADMIN (run manually, per organizer)
-- ============================================================================
-- After the organizer has signed in at least once via Google, find their
-- user id and insert it here:
--
--   select id, email from auth.users where email = 'organizer@adypu.edu.in';
--   insert into public.admins (user_id) values ('<uuid-from-above>');
