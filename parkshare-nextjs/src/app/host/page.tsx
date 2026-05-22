"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Plus,
  User,
  ParkingCircle,
  CalendarCheck,
  Wallet,
  Star,
  ArrowRight,
  ChevronDown,
  Bell,
} from "lucide-react";
import { HOST_SLOTS } from "@/lib/mock-data";

export default function HostDashboard() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const totalBookings = HOST_SLOTS.reduce(
    (s, sl) => s + sl.totalBookings,
    0
  );

  const totalEarned = HOST_SLOTS.reduce(
    (s, sl) => s + sl.totalEarned,
    0
  );

  const avgRating =
    HOST_SLOTS.length > 0
      ? HOST_SLOTS.reduce((s, sl) => s + sl.rating, 0) /
        HOST_SLOTS.length
      : 0;

  const stats = [
    {
      label: "Total Spaces",
      value: HOST_SLOTS.length.toString(),
      icon: ParkingCircle,
    },
    {
      label: "Total Bookings",
      value: totalBookings.toString(),
      icon: CalendarCheck,
    },
    {
      label: "Total Earned",
      value: `₱${(totalEarned / 1000).toFixed(1)}k`,
      icon: Wallet,
    },
    {
      label: "Average Rating",
      value: avgRating.toFixed(1),
      icon: Star,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* TOP HEADER */}
      <header className="flex items-center justify-between border-b border-gray-100 bg-[#eefbfd] px-8 py-5">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1E2A78]">
            Host Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Welcome back, Andrew
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* ADD SLOT */}
          <button className="flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-cyan-500">
            <Plus size={18} />
            Add Slot
          </button>

          {/* NOTIFICATION */}
          <button className="relative">
            <Bell className="text-[#1E2A78]" size={24} />

            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              2
            </span>
          </button>

          {/* PROFILE */}
          <div className="relative">
            <button
              onClick={() =>
                setShowProfileMenu(!showProfileMenu)
              }
              className="flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-400 font-bold text-white">
                A
              </div>

              <ChevronDown
                size={18}
                className="text-gray-500"
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="border-b border-slate-100 px-6 py-5">
                  <h3 className="text-lg font-bold text-[#1E2A78]">
                    Admin Account
                  </h3>

                  <p className="text-sm text-slate-500">
                    ParkShare Management
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    window.location.href = "/admin/login";
                  }}
                  className="w-full px-6 py-5 text-left font-semibold text-red-500 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <section className="px-8 py-8">
        {/* STATS */}
        <div className="grid gap-5 md:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
                <Icon size={20} />
              </div>

              <p className="text-sm font-semibold text-gray-400">
                {label}
              </p>

              <p className="mt-1 text-3xl font-extrabold text-[#1E2A78]">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          {/* PARKING SPACES */}
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-[#1E2A78]">
                  My Parking Spaces
                </h2>

                <p className="text-sm text-gray-400">
                  {HOST_SLOTS.length} spaces listed
                </p>
              </div>

              <Link
                href="/host/slots"
                className="flex items-center gap-1 text-sm font-bold text-cyan-500 hover:underline"
              >
                View all
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {HOST_SLOTS.map((slot, index) => (
                <div
                  key={slot.id}
                  className="overflow-hidden rounded-3xl bg-[#eefbfd] shadow-sm"
                >
                  <Image
                    src={slot.image}
                    alt={slot.name}
                    width={800}
                    height={400}
                    priority={index === 0}
                    className="h-52 w-full object-cover"
                  />

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-[#1E2A78]">
                      {slot.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {slot.address}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#1E2A78]">
                        ₱{slot.price}/hr
                      </span>

                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#1E2A78]">
                        {slot.totalBookings} bookings
                      </span>

                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#1E2A78]">
                        ₱
                        {(slot.totalEarned / 1000).toFixed(1)}
                        k earned
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* OVERVIEW */}
          <aside className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-extrabold text-[#1E2A78]">
              Today’s Overview
            </h2>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-cyan-50 p-5">
                <h3 className="font-bold text-[#1E2A78]">
                  Next Reservation
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Avida Towers Davao • 6:00 - 9:00 AM
                </p>
              </div>

              <div className="rounded-2xl bg-cyan-50 p-5">
                <h3 className="font-bold text-[#1E2A78]">
                  Pending Messages
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  2 new client inquiries
                </p>
              </div>

              <div className="rounded-2xl bg-cyan-50 p-5">
                <h3 className="font-bold text-[#1E2A78]">
                  Verification Status
                </h3>

                <p className="mt-2 font-semibold text-cyan-500">
                  Active Host Account
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}