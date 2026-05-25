"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { Search, Heart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import FilterDropdown, { type Filters } from "@/components/driver/FilterDropdown";
import { createClient } from "@/utils/supabase/client";

const DEFAULT_FILTERS: Filters = {
  maxPrice: "",
  amenities: [],
  vehicleTypes: [],
};

export default function DriverDashboard() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [parkingSlots, setParkingSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [savedSlotIds, setSavedSlotIds] = useState<string[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  async function loadSavedSlots() {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("saved_slots")
        .select("slot_id")
        .eq("user_id", user.id);

      if (error) {
        console.error("saved_slots SELECT error:", error.message, error.details);
        return;
      }
      if (data) setSavedSlotIds(data.map((item: any) => item.slot_id));
    } catch (err) {
      console.error("Error loading saved slots:", err);
    }
  }

  async function loadDriverBookings() {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: bookingsData } = await supabase
        .from("bookings")
        .select(`
          id,
          status,
          created_at,
          parking_slots (
            title,
            address,
            price_per_hour
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (bookingsData) setMyBookings(bookingsData);
    } catch (err) {
      console.error("Error loading driver bookings:", err);
    }
  }

  useEffect(() => {
    async function fetchAvailableSlots() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("parking_slots")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) setParkingSlots(data);
      } catch (err) {
        console.error("Error loading driver marketplace feed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAvailableSlots();
    loadDriverBookings();
    loadSavedSlots();
  }, []);

  const filtered = useMemo(() => {
    return parkingSlots.filter((slot) => {
      const matchSearch =
        !search ||
        (slot.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (slot.address ?? "").toLowerCase().includes(search.toLowerCase());

      const matchPrice =
        !filters.maxPrice ||
        (slot.price_per_hour ?? 0) <= Number(filters.maxPrice);

      return matchSearch && matchPrice;
    });
  }, [search, filters, parkingSlots]);

  const toggleSaveSlot = async (slotId: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please sign in to save your favorite slots!");
      return;
    }

    const isSaved = savedSlotIds.includes(slotId);

    if (isSaved) {
      const { error } = await supabase
        .from("saved_slots")
        .delete()
        .eq("user_id", user.id)
        .eq("slot_id", slotId);
      if (error) {
        console.error("saved_slots DELETE error:", error.message);
        return;
      }
      setSavedSlotIds((prev) => prev.filter((id) => id !== slotId));
    } else {
      const { error } = await supabase
        .from("saved_slots")
        .insert([{ user_id: user.id, slot_id: slotId }]);
      if (error) {
        console.error("saved_slots INSERT error:", error.message);
        return;
      }
      setSavedSlotIds((prev) => [...prev, slotId]);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f9fb]">
      {/* HERO */}
      <section className="bg-white px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-extrabold leading-tight text-park-navy sm:text-5xl lg:text-6xl">
            Parking made{" "}
            <span className="text-park-teal">simple</span>
          </h1>

          <p className="mt-3 text-sm text-gray-400 sm:mt-4 sm:text-base">
            Find and reserve nearby parking before you arrive.
          </p>

          {/* Search bar */}
          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 shadow-sm sm:mt-8 sm:gap-3 sm:px-5 sm:py-3.5">
            <Search size={17} className="shrink-0 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Location"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
            <FilterDropdown filters={filters} onApply={setFilters} />
          </div>
        </div>
      </section>

      {/* AVAILABLE SLOTS */}
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-4 flex items-center justify-between sm:mb-5">
            <div className="flex flex-wrap items-center gap-1.5">
              <h2 className="text-base font-extrabold text-park-navy sm:text-xl">
                Available parking spots near you
              </h2>
              {!loading && (
                <span className="text-xs font-semibold text-gray-400 sm:text-sm">
                  ({filtered.length} spaces)
                </span>
              )}
            </div>

            {!loading && filtered.length > 0 && (
              <div className="hidden gap-2 sm:flex">
                <button
                  onClick={() => carouselRef.current?.scrollBy({ left: -280, behavior: "smooth" })}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-park-navy hover:text-white"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => carouselRef.current?.scrollBy({ left: 280, behavior: "smooth" })}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-park-navy hover:text-white"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="px-6 text-center text-sm text-slate-400 animate-pulse">
            Searching for live spaces…
          </div>
        ) : filtered.length === 0 ? (
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-3xl border-2 border-dashed border-slate-100 p-10 text-center text-sm text-slate-400">
              {parkingSlots.length === 0
                ? "No active parking spaces listed yet. Check back soon!"
                : "No spots match your search. Try adjusting your filters."}
            </div>
          </div>
        ) : (
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scroll-smooth px-4 pb-4 snap-x snap-mandatory scrollbar-none sm:gap-5 sm:px-6"
          >
            {filtered.map((slot) => (
              <div
                key={slot.id}
                className="flex w-[72vw] shrink-0 snap-start flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition hover:shadow-md sm:w-65"
              >
                {/* Image */}
                <div className="p-3 pb-0">
                  <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-slate-100">
                    <img
                      src={slot.image_url || "/placeholder-parking.jpg"}
                      alt={slot.title}
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={() => toggleSaveSlot(slot.id)}
                      className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition hover:bg-rose-50"
                      aria-label={savedSlotIds.includes(slot.id) ? "Remove from saved" : "Save slot"}
                    >
                      <Heart
                        size={16}
                        className={
                          savedSlotIds.includes(slot.id)
                            ? "fill-rose-500 text-rose-500"
                            : "text-slate-300"
                        }
                      />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4">
                  <h4 className="line-clamp-1 text-sm font-bold text-slate-800">
                    {slot.title}
                  </h4>
                  <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">
                    {slot.address || "No address specified"}
                  </p>

                  <div className="mt-1.5 flex items-center gap-1">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-slate-600">5.0</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-park-navy">
                      ₱{slot.price_per_hour ?? 0}/hr
                    </span>
                    <span className="rounded-full bg-park-teal/10 px-2.5 py-0.5 text-[10px] font-bold text-park-teal">
                      Recommended
                    </span>
                  </div>

                  <Link
                    href={`/driver/slots/${slot.id}`}
                    className="mt-3 block rounded-xl bg-park-teal py-2 text-center text-xs font-bold text-white transition hover:bg-park-teal-dark"
                  >
                    View Slot
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MY RESERVATIONS */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="mb-4 sm:mb-5">
          <h2 className="text-base font-extrabold text-park-navy sm:text-xl">My Reservations</h2>
          <p className="mt-1 text-xs text-gray-400 sm:text-sm">
            Your active and past parking bookings.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {myBookings.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-8 text-center text-sm text-slate-400">
              You have no active parking reservations yet.
            </div>
          ) : (
            myBookings.map((booking) => {
              const slot = booking.parking_slots;
              return (
                <div
                  key={booking.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-cyan-100 sm:p-5"
                >
                  <div className="min-w-0 space-y-1">
                    <h4 className="truncate text-sm font-bold text-slate-800">
                      {slot?.title || "Parking Space"}
                    </h4>
                    <p className="truncate text-xs text-slate-400">
                      {slot?.address || "Location not available"}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Reserved on:{" "}
                      {new Date(booking.created_at).toLocaleDateString("en-PH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="shrink-0 space-y-1.5 text-right">
                    <span className="block text-xs font-extrabold text-park-teal">
                      ₱{slot?.price_per_hour ?? 0}/hr
                    </span>
                    <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold capitalize text-emerald-600">
                      {booking.status || "active"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
