"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Car, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

type Role = "driver" | "host";

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("driver");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    if (role === "driver") {
      router.push("/driver");
    } else {
      router.push("/host");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4 py-6">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm">
          {/* Logo */}
          <div className="mb-5 flex flex-col items-center">
            <Image
              src="/logo.png"
              alt="ParkShare"
              width={180}
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />

            <p className="mt-2 text-base font-medium text-gray-500">
              Parking made simple
            </p>
          </div>

          {/* Heading */}
          <h2 className="mb-4 text-2xl font-black text-park-navy">
            Welcome back!
          </h2>

          {/* Role Toggle */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            {(["driver", "host"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-2xl border-2 px-4 py-4 text-center transition-all ${
                  role === r
                    ? "border-park-teal bg-white text-park-teal shadow-sm"
                    : "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300"
                }`}
              >
                <div className="mb-2 flex justify-center">
                  {r === "driver" ? (
                    <Car size={22} />
                  ) : (
                    <User size={22} />
                  )}
                </div>

                <p className="text-base font-black">
                  {r === "driver" ? "I'm a driver" : "I'm a host"}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {r === "driver"
                    ? "Find & book parking"
                    : "Earn from your slot"}
                </p>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-600">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-park-teal"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="h-14 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-base outline-none transition-colors focus:border-park-teal"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-600">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-park-teal"
                />

                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-14 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-12 text-base outline-none transition-colors focus:border-park-teal"
                />

                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPass ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-park-navy text-base font-black text-white transition-colors hover:bg-park-navy/90"
            >
              Sign In as {role === "driver" ? "Driver" : "Host"}
              <span className="text-xl">›</span>
            </button>
          </form>

          {/* Footer */}
          <p className="mt-5 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-black text-park-navy hover:underline"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}