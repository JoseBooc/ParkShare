import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/driver";

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ?? requestUrl.origin
  ).replace(/\/$/, "");

  if (!code) {
    return NextResponse.redirect(`${siteUrl}/`);
  }

  const cookieStore = await cookies();
  const pendingCookies: { name: string; value: string; options: any }[] = [];

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
            try {
              cookieStore.set(name, value, options);
            } catch {}
            pendingCookies.push({ name, value, options });
          });
        },
      },
    }
  );

  // Step 1 — exchange the OAuth code for a session (PKCE)
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session || !data.user) {
    console.error("[callback] exchange failed:", error?.message ?? "no session");
    return NextResponse.redirect(`${siteUrl}/`);
  }

  const user = data.user;

  // Step 2 — upsert profile (non-fatal: session must succeed even if this fails)
  let role = "driver";
  try {
    const name =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      [user.user_metadata?.given_name, user.user_metadata?.family_name]
        .filter(Boolean)
        .join(" ") ||
      user.email?.split("@")[0] ||
      null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile) {
      role = profile.role ?? "driver";
      await supabase
        .from("profiles")
        .update({
          ...(name ? { full_name: name } : {}),
          ...(user.email ? { email: user.email } : {}),
        })
        .eq("id", user.id);
    } else {
      await supabase.from("profiles").insert({
        id: user.id,
        email: user.email ?? null,
        full_name: name,
        role: "driver",
      });
    }
  } catch (profileErr) {
    console.error("[callback] profile upsert failed (non-fatal):", profileErr);
  }

  // Step 3 — redirect, stamping every session cookie onto the response
  const redirectPath =
    next !== "/driver" ? next : role === "host" ? "/host/slots" : "/driver";

  const response = NextResponse.redirect(`${siteUrl}${redirectPath}`);
  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}
