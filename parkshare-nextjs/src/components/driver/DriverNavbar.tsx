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
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Logo */}
      <Link href="/driver" className="flex items-center">
        <Image
          src="/logo.png"
          alt="ParkShare"
          width={140}
          height={36}
          className="h-9 w-auto object-contain"
          priority
        />
      </Link>

      {/* Nav Links */}
      <div className="hidden sm:flex items-center gap-6">
        <Link
          href="/driver"
          className={`text-sm font-medium transition-colors ${
            pathname === "/driver"
              ? "text-park-teal border-b-2 border-park-teal pb-0.5"
              : "text-gray-500 hover:text-park-navy"
          }`}
        >
          Find Parking
        </Link>
        <Link
          href="/driver/saved"
          className={`text-sm font-medium transition-colors ${
            pathname === "/driver/saved"
              ? "text-park-teal border-b-2 border-park-teal pb-0.5"
              : "text-gray-500 hover:text-park-navy"
          }`}
        >
          Saved Slots
        </Link>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        {/* Driver / Host Toggle */}
        <div className="flex items-center bg-park-navy rounded-full p-1">
          <button className="px-4 py-1 rounded-full bg-white text-park-navy text-sm font-semibold">
            Driver
          </button>
          <button
            onClick={() => router.push("/host")}
            className="px-4 py-1 rounded-full text-white text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Host
          </button>
        </div>

        {/* Notification Bell */}
        <NotificationBell />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-1 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-park-teal flex items-center justify-center">
              <User size={14} className="text-white" />
            </div>
            <ChevronDown size={14} className="text-gray-500" />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-11 z-50 w-48 rounded-xl bg-white shadow-xl border border-gray-100 py-2 overflow-hidden">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-park-navy">Andrew Jacob</p>
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
