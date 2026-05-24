import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  // OAuth provider sent back an error — redirect cleanly to login
  const oauthError = searchParams.get("error");
  if (oauthError) {
    const description = searchParams.get("error_description") ?? oauthError;
    console.error("[auth/callback] OAuth provider error:", description);
    return NextResponse.redirect(`${origin}/`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/`);
  }

  const cookieStore = await cookies();

  // Collect cookies that Supabase wants to set so we can apply them
  // directly to the redirect response (cookieStore alone is not enough).
  const pendingCookies: Array<{ name: string; value: string; options: Record<string, unknown> }> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try { cookieStore.set(name, value, options); } catch {}
            pendingCookies.push({ name, value, options });
          });
        },
      },
    }
  );

  // Exchange the OAuth code for a live session
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("[auth/callback] Exchange failed:", exchangeError.message);
    return NextResponse.redirect(`${origin}/`);
  }

  // Verify the session was created successfully
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error("[auth/callback] No user after exchange");
    return NextResponse.redirect(`${origin}/`);
  }

  // Sync display name from Google metadata
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    [user.user_metadata?.given_name, user.user_metadata?.family_name]
      .filter(Boolean)
      .join(" ") ||
    user.email?.split("@")[0] ||
    null;

  // Check if a profile already exists to avoid overwriting the role
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (existingProfile) {
    if (name) {
      await supabase
        .from("profiles")
        .update({ full_name: name })
        .eq("id", user.id);
    }
  } else {
    await supabase.from("profiles").insert({
      id: user.id,
      full_name: name,
      role: "driver" as any,
    });
  }

  // Determine where to send the user
  const role = existingProfile?.role ?? "driver";
  const redirectPath = next ?? (role === "host" ? "/host/slots" : "/driver");

  // Build the redirect and stamp every session cookie onto the response
  // so the browser actually receives and stores the tokens.
  const response = NextResponse.redirect(`${origin}${redirectPath}`);
  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options as any);
  });

  return response;
}
