"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Car, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

type Role = "driver" | "host";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("driver");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (role === "driver") {
      router.push("/driver");
    } else {
      router.push("/host");
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-park-teal flex items-center justify-center mb-2">
          <span className="text-white font-bold text-xl">P</span>
        </div>
        <span className="text-xl font-bold">
          <span className="text-park-navy">Park</span>
          <span className="text-park-teal">Share</span>
        </span>
        <p className="text-sm text-gray-500 mt-1">Parking made simple</p>
      </div>

      <div className="bg-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-park-navy mb-1">Welcome back!</h2>

        {/* Role Toggle */}
        <div className="flex gap-3 mb-5">
          {(["driver", "host"] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all ${
                role === r
                  ? "border-park-teal bg-white text-park-teal"
                  : "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300"
              }`}
            >
              {r === "driver" ? <Car size={20} /> : <User size={20} />}
              <span className="text-xs font-semibold">
                {r === "driver" ? "I'm a driver" : "I'm a host"}
              </span>
              <span className="text-[10px] text-gray-400">
                {r === "driver" ? "Find & book parking" : "Earn from your slot"}
              </span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-park-teal" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm outline-none focus:border-park-teal transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-park-teal" />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-white border border-gray-200 text-sm outline-none focus:border-park-teal transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-park-navy text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-park-navy/90 transition-colors mt-2"
          >
            Sign In as {role === "driver" ? "Driver" : "Host"}
            <span className="text-base">›</span>
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-bold text-park-navy hover:underline">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
