"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(rgba(31,43,143,0.82),rgba(31,43,143,0.82)),url('/images/sm-lanang-premier.jpg')] bg-cover bg-center px-4">
      <div className="w-full max-w-[430px] rounded-[28px] bg-white p-8 shadow-2xl">
        {/* BACK */}
        <Link
          href="/auth/login"
          className="mb-4 inline-block text-sm font-bold text-[#1E2A78]"
        >
          ← Back
        </Link>

        {/* LOGO */}
        <div className="mb-4 flex justify-center">
          <Image
            src="/logo.png"
            alt="ParkShare"
            width={125}
            height={40}
            priority
          />
        </div>

        {/* TITLE */}
        <h1 className="text-center text-[38px] font-black leading-tight text-[#1E2A78]">
          Create Account
        </h1>

        <p className="mx-auto mt-3 max-w-[320px] text-center text-base leading-7 text-gray-500">
          Join ParkShare and start finding secure parking spaces near you.
        </p>

        {/* FORM */}
        <div className="mt-7 space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded-2xl border border-gray-300 px-5 py-3 text-base outline-none focus:border-cyan-400"
          />

          <input
            type="text"
            placeholder="Email Address"
            className="w-full rounded-2xl border border-gray-300 px-5 py-3 text-base outline-none focus:border-cyan-400"
          />

          {/* PASSWORD */}
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

          {/* CREATE BUTTON */}
          <button
            type="button"
            onClick={() => {
              window.location.href = "/driver";
            }}
            className="w-full rounded-2xl bg-cyan-400 py-3 text-lg font-bold text-white"
          >
            Create Account
          </button>

          {/* GOOGLE BUTTON */}
          <button
            type="button"
            onClick={() => {
              window.location.href = "/driver";
            }}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-300 bg-white py-3 text-base font-bold text-gray-700 transition hover:bg-gray-50"
          >
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              alt="Google"
              width={20}
              height={20}
            />

            Continue with Google
          </button>

          {/* LOGIN */}
          <Link
            href="/auth/login"
            className="block w-full rounded-2xl border-2 border-[#1E2A78] py-3 text-center text-lg font-bold text-[#1E2A78]"
          >
            Already have an account?
          </Link>
        </div>
      </div>
    </main>
  );
}