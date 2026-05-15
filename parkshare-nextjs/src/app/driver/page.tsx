"use client";

import { useMemo, useState } from "react";
import { Search, MapPin, Navigation, Sparkles } from "lucide-react";
import ParkingCard from "@/components/driver/ParkingCard";
import FilterDropdown, { type Filters } from "@/components/driver/FilterDropdown";
import { PARKING_SLOTS } from "@/lib/mock-data";

const DEFAULT_FILTERS: Filters = {
  maxPrice: "",
  amenities: [],
  vehicleTypes: [],
};

export default function DriverDashboard() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    return PARKING_SLOTS.filter((slot) => {
      const matchSearch =
        !search ||
        slot.name.toLowerCase().includes(search.toLowerCase()) ||
        slot.address.toLowerCase().includes(search.toLowerCase()) ||
        slot.city.toLowerCase().includes(search.toLowerCase());

      const matchPrice =
        !filters.maxPrice || slot.price <= Number(filters.maxPrice);

      const matchAmenities =
        filters.amenities.length === 0 ||
        filters.amenities.every((a) => slot.amenities.includes(a));

      const matchVehicle =
        filters.vehicleTypes.length === 0 ||
        filters.vehicleTypes.some((v) => slot.vehicleTypes.includes(v));

      return matchSearch && matchPrice && matchAmenities && matchVehicle;
    });
  }, [search, filters]);

  return (
    <main className="min-h-screen bg-white">
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
                    {PARKING_SLOTS.length}
                  </p>
                </div>

                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-semibold text-gray-400">
                    Starting Price
                  </p>
                  <p className="text-xl font-extrabold text-park-navy">
                    ₱35/hr
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
                  placeholder="Search location, city, or parking name"
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

      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-park-navy">
              Available parking spots near you
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              {filtered.length} spots found based on your search.
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white py-16 text-center">
            <p className="text-lg font-bold text-park-navy">No spots found</p>
            <p className="mt-1 text-sm text-gray-400">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((slot) => (
              <ParkingCard key={slot.id} slot={slot} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}