"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, User, ChevronDown, Bookmark, LogOut } from "lucide-react";

export default function DriverNavbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/driver" className="flex items-center">
          <img
            src="/logo.png"
            alt="ParkShare Logo"
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Center Nav */}
        <nav className="hidden items-center gap-7 sm:flex">
          <Link
            href="/driver"
            className={`text-sm font-semibold transition-colors ${
              pathname === "/driver"
                ? "text-park-navy"
                : "text-gray-400 hover:text-park-navy"
            }`}
          >
            Find Parking
          </Link>
          <Link
            href="/driver/saved"
            className={`text-sm font-semibold transition-colors ${
              pathname === "/driver/saved"
                ? "text-park-navy"
                : "text-gray-400 hover:text-park-navy"
            }`}
          >
            Saved Space
          </Link>
        </nav>

        {/* Right side */}
        <div className="relative flex items-center gap-3">
          {/* Bell */}
          <button
            type="button"
            onClick={() => {
              setShowNotifications((v) => !v);
              setShowProfile(false);
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-park-navy"
          >
            <Bell size={20} />
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
              2
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-12 top-12 w-80 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
              <h3 className="text-sm font-black text-park-navy">Notifications</h3>
              <div className="mt-3 space-y-3">
                <div className="rounded-xl bg-[#E8F9FD] p-3">
                  <p className="text-sm font-bold text-park-navy">Booking confirmed</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Your parking reservation has been saved.
                  </p>
                </div>
                <div className="rounded-xl bg-[#E8F9FD] p-3">
                  <p className="text-sm font-bold text-park-navy">Message from host</p>
                  <p className="mt-1 text-xs text-slate-500">
                    The host replied to your parking inquiry.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Avatar */}
          <button
            type="button"
            onClick={() => {
              setShowProfile((v) => !v);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-1 shadow-sm transition hover:shadow-md"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-park-teal text-white">
              <User size={16} />
            </div>
            <ChevronDown size={15} className="text-slate-500" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-48 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
              <Link
                href="/driver/profile"
                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-[#F6F8FB] hover:text-park-navy"
              >
                <User size={16} />
                My Profile
              </Link>
              <Link
                href="/driver/saved"
                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-[#F6F8FB] hover:text-park-navy"
              >
                <Bookmark size={16} />
                Saved Place
              </Link>
              <form action="/auth/signout" method="POST">
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 border-t border-gray-100 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
