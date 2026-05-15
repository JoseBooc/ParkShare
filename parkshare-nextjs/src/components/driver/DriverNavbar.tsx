"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, ChevronDown } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import NotificationBell from "@/components/ui/NotificationBell";

export default function DriverNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
      <Link href="/driver" className="flex items-center">
        <Image
          src="/logo.png"
          alt="ParkShare Logo"
          width={190}
          height={60}
          className="h-12 w-auto object-contain"
          priority
        />
      </Link>

      <div className="hidden sm:flex items-center gap-8">
        <Link
          href="/driver"
          className={`text-sm font-medium transition-colors ${
            pathname === "/driver"
              ? "text-park-teal border-b-2 border-park-teal pb-1"
              : "text-gray-500 hover:text-park-navy"
          }`}
        >
          Find Parking
        </Link>

        <Link
          href="/driver/saved"
          className={`text-sm font-medium transition-colors ${
            pathname === "/driver/saved"
              ? "text-park-teal border-b-2 border-park-teal pb-1"
              : "text-gray-500 hover:text-park-navy"
          }`}
        >
          Saved Slots
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full bg-park-navy p-1">
          <button className="rounded-full bg-white px-5 py-1.5 text-sm font-semibold text-park-navy">
            Driver
          </button>

          <button
            onClick={() => router.push("/host")}
            className="rounded-full px-5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Host
          </button>
        </div>

        <NotificationBell />

        <div className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-1 rounded-full p-1.5 transition-colors hover:bg-gray-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-park-teal">
              <User size={15} className="text-white" />
            </div>

            <ChevronDown size={14} className="text-gray-500" />
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileOpen(false)}
              />

              <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
                <div className="border-b border-gray-100 px-4 py-2">
                  <p className="text-sm font-semibold text-park-navy">
                    Andrew Jacob
                  </p>
                  <p className="text-xs text-gray-400">Driver</p>
                </div>

                <Link
                  href="/driver"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setProfileOpen(false)}
                >
                  My Profile
                </Link>

                <Link
                  href="/driver/saved"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setProfileOpen(false)}
                >
                  Saved Slots
                </Link>

                <hr className="my-1 border-gray-100" />

                <Link
                  href="/auth/login"
                  className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
                  onClick={() => setProfileOpen(false)}
                >
                  Sign Out
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}