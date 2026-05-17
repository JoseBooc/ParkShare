"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Car,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  IdCard,
  Upload,
} from "lucide-react";

type Role = "driver" | "host";

export default function SignupPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("driver");
  const [showPass, setShowPass] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(role === "driver" ? "/driver" : "/host");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4 py-6">
      <div className="w-full max-w-md">
        <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col items-center">
            <Image
              src="/logo.png"
              alt="ParkShare"
              width={170}
              height={55}
              className="h-11 w-auto object-contain"
              priority
            />
            <p className="mt-1 text-sm font-medium text-gray-500">
              Parking made simple
            </p>
          </div>

          <h1 className="text-2xl font-black text-park-navy">
            Create an account
          </h1>
          <p className="mb-4 mt-1 text-sm text-gray-400">
            Sign up as a driver or host to continue.
          </p>

          <div className="mb-4 grid grid-cols-2 gap-3">
            {(["driver", "host"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-2xl border-2 px-3 py-4 text-center transition-all ${
                  role === r
                    ? "border-park-teal bg-white text-park-teal shadow-sm"
                    : "border-gray-200 bg-gray-50 text-gray-400"
                }`}
              >
                <div className="mb-2 flex justify-center">
                  {r === "driver" ? <Car size={22} /> : <User size={22} />}
                </div>

                <p className="text-base font-black">
                  {r === "driver" ? "Driver" : "Host"}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {r === "driver" ? "Book parking" : "List parking"}
                </p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <User
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-park-teal"
              />
              <input
                type="text"
                placeholder="Full Name"
                className="h-13 w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-park-teal"
              />
            </div>

            <div className="relative">
              <Phone
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-park-teal"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="h-13 w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-park-teal"
              />
            </div>

            <div className="relative">
              <Mail
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-park-teal"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="h-13 w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-park-teal"
              />
            </div>

            <div className="relative">
              <Lock
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-park-teal"
              />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                className="h-13 w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-11 text-sm outline-none focus:border-park-teal"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-park-teal bg-[#eefbfd] px-4 py-3 text-sm font-bold text-park-navy">
              <Upload size={18} className="text-park-teal" />
              <span>
                {role === "driver"
                  ? "Upload Driver’s License"
                  : "Upload Valid ID / License"}
              </span>
              <input type="file" accept="image/*" className="hidden" />
            </label>

            <button
              type="submit"
              className="mt-2 flex h-14 w-full items-center justify-center rounded-full bg-park-navy text-base font-black text-white transition-colors hover:bg-park-navy/90"
            >
              Sign Up as {role === "driver" ? "Driver" : "Host"} ›
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-black text-park-navy hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}