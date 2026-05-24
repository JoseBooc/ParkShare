"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ParkingCircle,
  CalendarCheck,
  Wallet,
  Star,
  ChevronDown,
  Bell,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function HostDashboard() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [slotCount, setSlotCount] = useState<number>(0);
  const [bookingCount, setBookingCount] = useState<number>(0);
  const [totalEarned, setTotalEarned] = useState<number>(0);
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ count: sCount }, { data: profileData }, { data: slots }] = await Promise.all([
        supabase
          .from("parking_slots")
          .select("*", { count: "exact", head: true })
          .eq("host_id", user.id)
          .eq("status", "active"),
        supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single(),
        supabase
          .from("parking_slots")
          .select("id, price_per_hour")
          .eq("host_id", user.id),
      ]);

      setSlotCount(sCount ?? 0);
      setProfile(profileData);

      if (slots && slots.length > 0) {
        const slotIds = slots.map((s) => s.id);
        const priceMap = Object.fromEntries(
          slots.map((s) => [s.id, s.price_per_hour ?? 0])
        );

        const { data: bookings, count: bCount } = await supabase
          .from("bookings")
          .select("slot_id", { count: "exact" })
          .in("slot_id", slotIds);

        setBookingCount(bCount ?? 0);
        const earned = (bookings ?? []).reduce(
          (sum, b) => sum + (priceMap[b.slot_id] ?? 0),
          0
        );
        setTotalEarned(earned);
      }
    }
    fetchDashboardData();
  }, []);

  const stats = [
    {
      label: "Total Spaces",
      value: slotCount.toString(),
      icon: ParkingCircle,
    },
    {
      label: "Total Bookings",
      value: bookingCount.toString(),
      icon: CalendarCheck,
    },
    {
      label: "Total Earned",
      value: totalEarned > 0 ? `₱${totalEarned.toLocaleString()}` : "₱0",
      icon: Wallet,
    },
    {
      label: "Average Rating",
      value: "N/A",
      icon: Star,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* TOP HEADER */}
      <header className="flex items-center justify-between border-b border-gray-100 bg-[#eefbfd] px-4 py-4 sm:px-8 sm:py-5">
        <div>
          <h1 className="text-xl font-extrabold text-[#1E2A78] sm:text-3xl">
            Host Dashboard
          </h1>

          <p className="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">
            Welcome back, {profile?.full_name || "Host"}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* NOTIFICATION */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setShowProfileMenu(false);
              }}
              className="relative"
            >
              <Bell className="text-[#1E2A78]" size={24} />
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                2
              </span>
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 z-50 mt-4 w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <h3 className="text-base font-extrabold text-[#1E2A78]">
                    Notifications
                  </h3>

                  <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-500">
                    2 new
                  </span>
                </div>

                <ul className="divide-y divide-slate-50">
                  <li className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-slate-50">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-50">
                      <CalendarCheck size={16} className="text-cyan-500" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#1E2A78]">
                        New Booking Request
                      </p>

                      <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                        A driver requested to book Avida Towers Slot 1.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-slate-50">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-50">
                      <Bell size={16} className="text-cyan-500" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#1E2A78]">
                        Message from Driver
                      </p>

                      <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                        Inquiry received: &ldquo;Is your Gaisano Mall space open tonight?&rdquo;
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="border-t border-slate-100 px-5 py-3">
                  <Link
                    href="/host/messages"
                    onClick={() => setIsNotifOpen(false)}
                    className="block text-center text-xs font-bold text-cyan-500 hover:text-cyan-600"
                  >
                    View all messages →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div className="relative">
            <button
              onClick={() =>
                setShowProfileMenu(!showProfileMenu)
              }
              className="flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-400 font-bold text-white">
                {(profile?.full_name?.[0] ?? "H").toUpperCase()}
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
                    {profile?.full_name || "Host"}
                  </h3>

                  <span className="mt-2 inline-block rounded-full bg-cyan-50 px-3 py-0.5 text-xs font-bold text-cyan-600">
                    Host Account
                  </span>
                </div>

                <button
                  onClick={async () => {
                    setShowProfileMenu(false);
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    window.location.href = "/";
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
      <section className="px-4 py-6 sm:px-8 sm:py-8">
        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500 sm:mb-5 sm:h-11 sm:w-11 sm:rounded-2xl">
                <Icon size={18} />
              </div>

              <p className="text-xs font-semibold text-gray-400 sm:text-sm">
                {label}
              </p>

              <p className="mt-1 text-2xl font-extrabold text-[#1E2A78] sm:text-3xl">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* OVERVIEW */}
        <aside className="mt-6 w-full rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:mt-8 sm:max-w-sm sm:p-6">
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
      </section>
    </main>
  );
}