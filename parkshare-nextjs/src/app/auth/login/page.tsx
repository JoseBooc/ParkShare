"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  function goToDriver() {
    window.location.assign(`${window.location.origin}/driver`);
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
          Welcome to ParkShare
        </h1>

        <p className="mx-auto mt-3 max-w-[320px] text-center text-base leading-7 text-gray-500">
          Find and reserve parking spaces before you arrive.
        </p>

        <div className="mt-7 space-y-4">
          <input
            type="text"
            placeholder="Email Address"
            className="w-full rounded-2xl border border-gray-300 px-5 py-3 text-base outline-none focus:border-cyan-400"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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
            type="button"
            onClick={goToDriver}
            onTouchEnd={goToDriver}
            className="w-full rounded-2xl bg-cyan-400 py-3 text-lg font-bold text-white transition hover:bg-cyan-500"
          >
            Login
          </button>

          <Link
            href="/auth/signup"
            className="block w-full rounded-2xl border-2 border-[#1E2A78] py-3 text-center text-lg font-bold text-[#1E2A78]"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}