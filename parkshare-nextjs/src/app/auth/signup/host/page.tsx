"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { type FormEvent, useState } from "react";

import { createClient } from "@/utils/supabase/client";

export default function HostSignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignup = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/host`,
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
            role: "host",
          },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (data.session) {
        router.push("/host/slots");
        return;
      }

      alert(
        "Host account created! Check your email to confirm, then sign in through the Host Portal."
      );
      router.push("/auth/login/host");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(rgba(31,43,143,0.82),rgba(31,43,143,0.82)),url('/images/sm-lanang-premier.jpg')] bg-cover bg-center px-4">
      <div className="w-full max-w-107.5 rounded-[28px] bg-white p-8 shadow-2xl">
        <Link
          href="/auth/login/host"
          className="mb-4 inline-block text-sm font-bold text-park-teal"
        >
          ← Back to Host Portal
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

        <div className="mb-1 flex justify-center">
          <span className="rounded-full bg-park-teal-light px-4 py-1 text-xs font-bold uppercase tracking-wide text-park-teal">
            Host Account
          </span>
        </div>

        <h1 className="mt-3 text-center text-[38px] font-black leading-tight text-[#1E2A78]">
          Join as a Host
        </h1>

        <p className="mx-auto mt-3 max-w-[320px] text-center text-base leading-7 text-gray-500">
          List your parking space and start earning with ParkShare.
        </p>

        <form className="mt-7 space-y-4" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full rounded-2xl border border-gray-300 px-5 py-3 text-base outline-none focus:border-park-teal"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-2xl border border-gray-300 px-5 py-3 text-base outline-none focus:border-park-teal"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-2xl border border-gray-300 px-5 py-3 pr-14 text-base outline-none focus:border-park-teal"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-park-teal"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-park-teal py-3 text-lg font-bold text-white transition hover:bg-park-teal-dark disabled:opacity-60"
          >
            {isLoading ? "Creating Account…" : "Create Host Account"}
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
            href="/auth/login/host"
            className="block w-full rounded-2xl border-2 border-park-teal py-3 text-center text-lg font-bold text-park-teal"
          >
            Already have a Host account?
          </Link>
        </form>
      </div>
    </main>
  );
}
