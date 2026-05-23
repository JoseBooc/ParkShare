"use client";

import { useMemo, useState, useEffect } from "react";
import { Search, MapPin, Navigation, Sparkles, Heart } from "lucide-react";
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
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [savedSlotIds, setSavedSlotIds] = useState<string[]>([]);

  async function loadSavedSlots() {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("saved_slots")
        .select("slot_id")
        .eq("user_id", user.id);

      if (data) setSavedSlotIds(data.map((item) => item.slot_id));
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

  const handleCreateBooking = async (slotId: string) => {
    try {
      setBookingLoading(true);

      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        alert("Please sign in to your account to reserve a parking slot.");
        return;
      }

      const { error: dbError } = await supabase
        .from("bookings")
        .insert([{ user_id: user.id, slot_id: slotId, status: "active" }]);

      if (dbError) throw dbError;

      alert("Parking slot reserved successfully! Your space is locked in.");
      setSelectedSlot(null);
      await loadDriverBookings();
    } catch (err) {
      console.error("Booking failure:", err);
      alert("Failed to confirm your reservation. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const toggleSaveSlot = async (slotId: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please sign in to save your favorite slots!");
      return;
    }

    const isSaved = savedSlotIds.includes(slotId);

    if (isSaved) {
      await supabase.from("saved_slots").delete().eq("user_id", user.id).eq("slot_id", slotId);
      setSavedSlotIds((prev) => prev.filter((id) => id !== slotId));
    } else {
      await supabase.from("saved_slots").insert([{ user_id: user.id, slot_id: slotId }]);
      setSavedSlotIds((prev) => [...prev, slotId]);
    }
  };

  const minPrice =
    parkingSlots.length > 0
      ? Math.min(...parkingSlots.map((s) => s.price_per_hour ?? 0))
      : null;

  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="bg-gradient-to-br from-[#eefbfd] via-white to-[#f7ffff] px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-park-teal shadow-sm">
                <Sparkles size={16} />
                Smart Parking, Made Simple
              </div>

              <h1 className="text-4xl font-extrabold leading-tight text-park-navy sm:text-5xl">
                Find parking before you arrive.
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-gray-500">
                Search nearby available parking spaces, compare prices, and
                reserve a slot before going to your destination.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-semibold text-gray-400">
                    Available Spots
                  </p>
                  <p className="text-xl font-extrabold text-park-navy">
                    {loading ? "…" : parkingSlots.length}
                  </p>
                </div>

                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-semibold text-gray-400">
                    Starting Price
                  </p>
                  <p className="text-xl font-extrabold text-park-navy">
                    {loading || minPrice === null ? "…" : `₱${minPrice}/hr`}
                  </p>
                </div>

                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-semibold text-gray-400">
                    Location
                  </p>
                  <p className="text-xl font-extrabold text-park-navy">
                    Davao
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-lg">
              <div className="flex h-64 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-park-teal-light to-park-teal/30">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                    <MapPin size={30} className="text-park-teal" />
                  </div>

                  <p className="text-lg font-extrabold text-park-navy">
                    Nearby Parking Map
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Live preview for available spaces
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="mt-8 rounded-[2rem] bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search location or parking name"
                  className="w-full rounded-full border-2 border-park-teal bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition-colors focus:border-park-teal-dark"
                />
              </div>

              <FilterDropdown filters={filters} onApply={setFilters} />

              <button className="flex items-center justify-center gap-2 rounded-full bg-park-navy px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-park-navy/90">
                <Navigation size={16} />
                Use Location
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SLOTS GRID */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-park-navy">
              Available parking spots near you
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {loading ? "Searching…" : `${filtered.length} spot${filtered.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="col-span-full animate-pulse text-center text-sm text-slate-400">
              Searching for live spaces…
            </p>
          ) : filtered.length === 0 ? (
            <div className="col-span-full rounded-3xl border-2 border-dashed border-slate-100 p-10 text-center text-sm text-slate-400">
              {parkingSlots.length === 0
                ? "No active parking spaces listed yet. Check back soon!"
                : "No spots match your search. Try adjusting your filters."}
            </div>
          ) : (
            filtered.map((slot) => (
              <div
                key={slot.id}
                className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <div>
                  <div className="relative h-48 w-full bg-slate-100">
                    <img
                      src={slot.image_url || "/placeholder-parking.jpg"}
                      alt={slot.title}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm backdrop-blur-sm">
                      {slot.type || "Standard"}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSaveSlot(slot.id); }}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-rose-50"
                      aria-label={savedSlotIds.includes(slot.id) ? "Remove from saved" : "Save slot"}
                    >
                      <Heart
                        size={16}
                        className={savedSlotIds.includes(slot.id) ? "fill-rose-500 text-rose-500" : "text-slate-300"}
                      />
                    </button>
                  </div>

                  <div className="space-y-1 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="line-clamp-1 text-base font-bold text-slate-800">
                        {slot.title}
                      </h4>
                      <span className="whitespace-nowrap text-sm font-extrabold text-park-teal">
                        ₱{slot.price_per_hour ?? 0}/hr
                      </span>
                    </div>
                    <p className="line-clamp-1 text-xs text-slate-400">
                      {slot.address || "No address specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 px-5 pb-5 pt-3">
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-500">
                    ● Available
                  </span>
                  <button
                    onClick={() => setSelectedSlot(slot)}
                    className="rounded-xl bg-park-teal px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-park-teal-dark"
                  >
                    View Slot
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      {/* MY RESERVATIONS */}
      <section className="mx-auto max-w-5xl px-6 pb-12">
        <div className="mb-5">
          <h2 className="text-2xl font-extrabold text-park-navy">
            My Reservations
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Your active and past parking bookings.
          </p>
        </div>

        <div className="space-y-4">
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
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-cyan-100"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800">
                      {slot?.title || "Parking Space"}
                    </h4>
                    <p className="text-xs text-slate-400">
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

                  <div className="space-y-2 text-right">
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

      {/* SLOT DETAIL MODAL */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl">

            {/* Cover image */}
            <div className="relative h-56 w-full bg-slate-100">
              <img
                src={selectedSlot.image_url || "/placeholder-parking.jpg"}
                alt={selectedSlot.title}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => setSelectedSlot(null)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sm font-bold text-slate-700 shadow-md transition hover:bg-white backdrop-blur-sm"
              >
                ✕
              </button>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              <div className="space-y-1">
                <span className="rounded-md bg-cyan-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-600">
                  {selectedSlot.type || "Standard Space"}
                </span>
                <h3 className="pt-1 text-xl font-black text-slate-800">
                  {selectedSlot.title}
                </h3>
                <p className="text-sm font-medium text-slate-400">
                  {selectedSlot.address || "No address specified"}
                </p>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Hourly Rental Fee
                  </p>
                  <p className="text-xl font-extrabold text-park-teal">
                    ₱{selectedSlot.price_per_hour ?? 0}/hr
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Availability
                  </p>
                  <p className="text-sm font-bold text-emerald-500">
                    ● Vacant / Active
                  </p>
                </div>
              </div>

              {selectedSlot.description && (
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Host Information & Rules
                  </h4>
                  <p className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-sm text-slate-600">
                    {selectedSlot.description}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 border-t border-slate-100 bg-slate-50/50 p-4">
              <button
                onClick={() => setSelectedSlot(null)}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
              >
                Close Preview
              </button>
              <button
                onClick={() => handleCreateBooking(selectedSlot.id)}
                disabled={bookingLoading}
                className="flex-1 rounded-xl bg-park-teal py-3 text-sm font-bold text-white shadow-md shadow-cyan-100 transition hover:bg-park-teal-dark disabled:bg-slate-300 disabled:shadow-none"
              >
                {bookingLoading ? "Processing…" : "Reserve Spot Now"}
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}
