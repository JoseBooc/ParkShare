import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/driver";

  // Use NEXT_PUBLIC_SITE_URL so Vercel serverless functions always redirect
  // to the real public domain instead of an internal Vercel origin URL.
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? requestUrl.origin).replace(/\/$/, "");

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
        setAll(items) {
          items.forEach(({ name, value, options }) => {
            try { cookieStore.set(name, value, options); } catch {}
            pendingCookies.push({ name, value, options });
          });
        },
      },
    }
  );

  const { data: exchangeData, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !exchangeData.user) {
    console.error("Auth callback error:", error?.message ?? "no user returned");
    return NextResponse.redirect(`${siteUrl}/`);
  }

  const user = exchangeData.user;

  // Upsert profile so every Google sign-in has a row in profiles
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    [user.user_metadata?.given_name, user.user_metadata?.family_name]
      .filter(Boolean)
      .join(" ") ||
    user.email?.split("@")[0] ||
    null;

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (existingProfile) {
    if (name) {
      await supabase.from("profiles").update({ full_name: name }).eq("id", user.id);
    }
  } else {
    await supabase.from("profiles").insert({ id: user.id, full_name: name, role: "driver" });
  }

  const role = existingProfile?.role ?? "driver";
  const redirectPath = next !== "/driver" ? next : role === "host" ? "/host/slots" : "/driver";

  const response = NextResponse.redirect(`${siteUrl}${redirectPath}`);
  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}
