"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { createClient } from "@/utils/supabase/client";

export default function HostLoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const supabase = createClient();

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      const user = data.user;

      // Query profiles table as the authoritative role source
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const role = profile?.role ?? user?.user_metadata?.role;

      if (role === "host") {
        router.push("/host/slots");
        return;
      }

      await supabase.auth.signOut();
      alert(
        "Access Denied: This portal is strictly reserved for ParkShare Hosts. Drivers must log in through the driver portal."
      );
    } catch (authError) {
      const message =
        authError instanceof Error
          ? authError.message
          : "Unable to sign in. Please check your credentials and try again.";

      alert(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(rgba(31,43,143,0.82),rgba(31,43,143,0.82)),url('/images/sm-lanang-premier.jpg')] bg-cover bg-center px-4">
      <div className="w-full max-w-[430px] rounded-[28px] bg-white p-8 shadow-2xl">
        <Link href="/" className="mb-4 inline-block text-sm font-bold text-[#1E2A78]">
          ← Back
        </Link>

        <div className="mb-4 flex justify-center">
          <Image src="/logo.png" alt="ParkShare" width={125} height={40} priority />
        </div>

        <h1 className="text-center text-[38px] font-black leading-tight text-[#1E2A78]">
          Host Portal
        </h1>

        <p className="mx-auto mt-3 max-w-[320px] text-center text-base leading-7 text-gray-500">
          Sign in to manage your parking spaces and track your earnings.
        </p>

        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-gray-300 px-5 py-3 text-base outline-none focus:border-cyan-400"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            className="w-full rounded-2xl bg-cyan-400 py-3 text-lg font-bold text-white transition hover:bg-cyan-500"
          >
            {isLoading ? "Logging in..." : "Login as Host"}
          </button>

          <Link
            href="/auth/signup/host"
            className="block w-full rounded-2xl border-2 border-[#1E2A78] py-3 text-center text-lg font-bold text-[#1E2A78]"
          >
            Create a Host Account
          </Link>
        </form>
      </div>
    </main>
  );
}
