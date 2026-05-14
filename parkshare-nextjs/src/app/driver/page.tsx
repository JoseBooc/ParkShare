"use client";

import { useState, useMemo } from "react";
import { Search, ChevronRight } from "lucide-react";
import ParkingCard from "@/components/driver/ParkingCard";
import FilterDropdown, { type Filters } from "@/components/driver/FilterDropdown";
import { PARKING_SLOTS } from "@/lib/mock-data";

const DEFAULT_FILTERS: Filters = { maxPrice: "", amenities: [], vehicleTypes: [] };

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
    <div className="px-4 py-8 max-w-2xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-park-navy leading-tight">
          Smart parking made{" "}
          <span className="text-park-teal">simple</span>
        </h1>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Location"
            className="w-full pl-10 pr-4 py-3 rounded-full border-2 border-park-teal bg-white text-sm outline-none focus:border-park-teal-dark transition-colors"
          />
        </div>
        <FilterDropdown filters={filters} onApply={setFilters} />
      </div>

      {/* Listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-park-navy">
            Available parking spots near you{" "}
            <span className="text-gray-400 font-normal">({filtered.length} spots)</span>
          </h2>
          <button className="p-1.5 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">No spots found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((slot) => (
              <ParkingCard key={slot.id} slot={slot} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
