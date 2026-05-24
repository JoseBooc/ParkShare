"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Plus,
  MapPin,
  ParkingCircle,
  CalendarCheck,
  Wallet,
  Pencil,
  Eye,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type ParkingSlot = {
  id: string;
  created_at: string;
  host_id: string;
  title: string;
  address: string;
  price_per_hour: number;
  description: string;
  status: string;
  image_url: string | null;
};

export default function MySlotsPage() {
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSlots() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let query = supabase
        .from("parking_slots")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (user) {
        query = query.eq("host_id", user.id);
      }

      const { data, error } = await query;

      if (!error && data) {
        setSlots(data as ParkingSlot[]);
      }
      setIsLoading(false);
    }

    fetchSlots();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-[#eefbfd] px-4 py-5 sm:px-8 sm:py-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-park-teal sm:text-sm">
            Host Management
          </p>

          <h1 className="mt-1 text-2xl font-extrabold text-park-navy sm:text-3xl">
            My Parking Spaces
          </h1>

          <p className="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">
            Manage your listed slots, pricing, and booking performance.
          </p>
        </div>
      </header>

      <section className="px-4 py-6 sm:px-8 sm:py-8">
        <div className="mb-6 grid grid-cols-2 gap-4 sm:mb-8 sm:gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-park-teal-light text-park-teal sm:mb-4 sm:h-11 sm:w-11 sm:rounded-2xl">
              <ParkingCircle size={18} />
            </div>
            <p className="text-xs font-semibold text-gray-400 sm:text-sm">Active Spaces</p>
            <p className="mt-1 text-2xl font-extrabold text-park-navy sm:text-3xl">
              {isLoading ? "…" : slots.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-park-teal-light text-park-teal sm:mb-4 sm:h-11 sm:w-11 sm:rounded-2xl">
              <CalendarCheck size={18} />
            </div>
            <p className="text-xs font-semibold text-gray-400 sm:text-sm">Total Bookings</p>
            <p className="mt-1 text-2xl font-extrabold text-park-navy sm:text-3xl">—</p>
          </div>

          <div className="col-span-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 md:col-span-1">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-park-teal-light text-park-teal sm:mb-4 sm:h-11 sm:w-11 sm:rounded-2xl">
              <Wallet size={18} />
            </div>
            <p className="text-xs font-semibold text-gray-400 sm:text-sm">Total Earned</p>
            <p className="mt-1 text-2xl font-extrabold text-park-navy sm:text-3xl">—</p>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center">
            <p className="text-sm font-semibold text-gray-400">
              Loading your spaces…
            </p>
          </div>
        ) : slots.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <p className="mb-3 text-lg font-bold text-park-navy">
              No parking spaces listed yet
            </p>

            <p className="mx-auto mb-6 max-w-md text-sm text-gray-500">
              Add your first parking slot so drivers can discover and reserve it.
            </p>

            <Link
              href="/host/slots/add"
              className="inline-flex items-center gap-2 rounded-full bg-park-teal px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-park-teal-dark"
            >
              <Plus size={16} />
              Add your first slot
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {slots.map((slot, index) => (
              <div
                key={slot.id}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative flex h-52 items-center justify-center overflow-hidden bg-linear-to-br from-cyan-50 to-cyan-100">
                  {slot.image_url ? (
                    <img
                      src={slot.image_url}
                      alt={slot.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ParkingCircle size={48} className="text-cyan-200" />
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-park-navy shadow-sm">
                    Slot {index + 1}
                  </span>

                  <span className="absolute right-4 top-4 rounded-full bg-park-teal px-3 py-1 text-xs font-bold text-white shadow-sm">
                    Active
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-park-navy">
                        {slot.title}
                      </h3>

                      <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                        <MapPin size={14} />
                        <span>{slot.address}</span>
                      </div>
                    </div>

                    <p className="rounded-full bg-[#eefbfd] px-3 py-1 text-sm font-extrabold text-park-teal">
                      ₱{slot.price_per_hour}/hr
                    </p>
                  </div>

                  {slot.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-gray-500">
                      {slot.description}
                    </p>
                  )}

                  <div className="mt-5 flex gap-3">
                    <Link
                      href={`/host/slots/${slot.id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full border border-park-navy px-4 py-2.5 text-sm font-bold text-park-navy transition-colors hover:bg-park-navy hover:text-white"
                    >
                      <Eye size={15} />
                      View
                    </Link>

                    <Link
                      href={`/host/slots/${slot.id}/edit`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-park-teal px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-park-teal-dark"
                    >
                      <Pencil size={15} />
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
