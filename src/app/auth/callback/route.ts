import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { ALLOWED_EMAIL_DOMAIN } from "@/lib/constants";

// Exchanges the Google OAuth `code` for a Supabase session.
//
// Domain restriction is enforced in three layers, this route is only the
// second (defense in depth — the authoritative layer is the Postgres
// trigger on auth.users, see supabase/migrations):
//   1. Postgres trigger on auth.users rejects account creation outright.
//   2. This route re-checks the email and signs the user back out if it
//      somehow slipped through.
//   3. RLS insert policy on `registrations` re-checks it again.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");

  if (oauthError || !code) {
    return NextResponse.redirect(`${origin}/register?error=domain`);
  }

  const response = NextResponse.redirect(`${origin}/register`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/register?error=domain`);
  }

  const email = data.user.email?.toLowerCase() ?? "";
  if (!email.endsWith(`@${ALLOWED_EMAIL_DOMAIN}`)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/register?error=domain`);
  }

  return response;
}
