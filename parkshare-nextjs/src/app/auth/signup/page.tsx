"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { type FormEvent, useState } from "react";

import { createClient } from "@/utils/supabase/client";

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignup = async () => {
    const supabase = createClient();
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin).replace(/\/$/, "");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    });
  };

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const supabase = createClient();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: "driver",
          },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (data.user) {
        await supabase.from("profiles").upsert(
          { id: data.user.id, full_name: fullName, role: "driver" },
          { onConflict: "id" }
        );
      }

      if (data.session) {
        router.push("/driver");
        return;
      }

      alert("Account created! Check your email to confirm, then sign in.");
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(rgba(31,43,143,0.82),rgba(31,43,143,0.82)),url('/images/sm-lanang-premier.jpg')] bg-cover bg-center px-4">
      <div className="w-full max-w-107.5 rounded-[28px] bg-white p-8 shadow-2xl">
        <Link
          href="/"
          className="mb-4 inline-block text-sm font-bold text-[#1E2A78]"
        >
          ← Back
        </Link>

        <div className="mb-4 flex justify-center">
          <Image
            src="/logo.png"
            alt="ParkShare"
            width={125}
            height={40}
            priority
          />
        </div>

        <h1 className="text-center text-[38px] font-black leading-tight text-[#1E2A78]">
          Create Account
        </h1>

        <p className="mx-auto mt-3 max-w-[320px] text-center text-base leading-7 text-gray-500">
          Find and reserve parking spaces before you arrive.
        </p>

        <form className="mt-7 space-y-4" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full rounded-2xl border border-gray-300 px-5 py-3 text-base outline-none focus:border-cyan-400"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-2xl border border-gray-300 px-5 py-3 text-base outline-none focus:border-cyan-400"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-2xl border border-gray-300 px-5 py-3 pr-14 text-base outline-none focus:border-cyan-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1E2A78]"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-[#1E2A78] py-3 text-lg font-bold text-white transition hover:bg-[#16215e] disabled:opacity-60"
          >
            {isLoading ? "Creating Account…" : "Create Driver Account"}
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs text-slate-400">
              <span className="bg-white px-2">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full rounded-xl border border-slate-200 py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 shadow-sm"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="h-4 w-4"
              alt="Google"
            />
            Continue with Google
          </button>

          <Link
            href="/"
            className="block w-full rounded-2xl border-2 border-[#1E2A78] py-3 text-center text-lg font-bold text-[#1E2A78]"
          >
            Already have an account?
          </Link>
        </form>

        <div className="mt-6 border-t border-gray-100 pt-5 text-center">
          <p className="text-sm text-gray-400">Want to list your parking space?</p>
          <Link
            href="/auth/signup/host"
            className="mt-1 inline-block text-sm font-bold text-park-teal hover:underline"
          >
            Create a Host Account →
          </Link>
        </div>
      </div>
    </main>
  );
}
