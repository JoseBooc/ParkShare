"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, ChevronDown, User } from "lucide-react";

export default function DriverNavbar() {
  return (
    <header className="sticky top-0 z-[9999] w-full border-b border-gray-200 bg-white px-3 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
        <Link href="/driver" className="shrink-0">
          <Image
            src="/logo.png"
            alt="ParkShare"
            width={120}
            height={40}
            priority
            className="h-auto w-[75px] sm:w-[120px]"
          />
        </Link>

        <div className="flex rounded-full bg-park-navy p-1">
          <Link
            href="/driver"
            className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-park-navy sm:px-6 sm:text-sm"
          >
            Driver
          </Link>

          <Link
            href="/host"
            className="rounded-full px-4 py-1.5 text-xs font-bold text-white sm:px-6 sm:text-sm"
          >
            Host
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* NOTIFICATIONS */}
          <details className="relative">
            <summary className="list-none cursor-pointer">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
                  2
                </span>
              </div>
            </summary>

            <div className="absolute right-0 top-12 z-[9999] w-64 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
              <h3 className="font-bold text-park-navy">Notifications</h3>

              <div className="mt-3 space-y-3">
                <div className="rounded-xl bg-park-teal-light p-3">
                  <p className="text-sm font-bold text-park-navy">
                    Booking Confirmed
                  </p>
                  <p className="text-xs text-gray-500">
                    Your parking booking has been confirmed.
                  </p>
                </div>

                <div className="rounded-xl bg-park-teal-light p-3">
                  <p className="text-sm font-bold text-park-navy">
                    New Message
                  </p>
                  <p className="text-xs text-gray-500">
                    You received a message from the host.
                  </p>
                </div>
              </div>
            </div>
          </details>

          {/* PROFILE */}
          <details className="relative">
            <summary className="flex cursor-pointer list-none items-center gap-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-park-teal text-white">
                <User size={20} />
              </div>

              <ChevronDown size={17} className="text-gray-500" />
            </summary>

            <div className="absolute right-0 top-12 z-[9999] w-52 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
              <Link
                href="/driver/profile"
                className="block px-4 py-3 text-sm text-gray-700"
              >
                My Profile
              </Link>

              <Link
                href="/driver/saved"
                className="block px-4 py-3 text-sm text-gray-700"
              >
                Saved Slots
              </Link>

              <Link
                href="/host"
                className="block px-4 py-3 text-sm font-bold text-park-teal"
              >
                Switch to Host
              </Link>

              <Link
                href="/auth/login"
                className="block px-4 py-3 text-sm text-red-500"
              >
                Sign Out
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}