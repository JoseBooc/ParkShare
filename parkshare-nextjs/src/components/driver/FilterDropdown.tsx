"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { Amenity, VehicleType } from "@/lib/types";

const AMENITIES: Amenity[] = ["CCTV", "EV Charging", "24/7 Access", "Sheltered", "Security Guard"];
const VEHICLE_TYPES: VehicleType[] = ["Sedan", "SUV", "Pickup Truck", "Motorcycle", "Van", "PUV"];

interface Filters {
  maxPrice: string;
  amenities: Amenity[];
  vehicleTypes: VehicleType[];
}

interface FilterDropdownProps {
  filters: Filters;
  onApply: (filters: Filters) => void;
}

export default function FilterDropdown({ filters, onApply }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState<Filters>(filters);

  function toggleAmenity(a: Amenity) {
    setLocal((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
  }

  function toggleVehicle(v: VehicleType) {
    setLocal((prev) => ({
      ...prev,
      vehicleTypes: prev.vehicleTypes.includes(v)
        ? prev.vehicleTypes.filter((x) => x !== v)
        : [...prev.vehicleTypes, v],
    }));
  }

  function handleApply() {
    onApply(local);
    setOpen(false);
  }

  function handleClear() {
    const reset: Filters = { maxPrice: "", amenities: [], vehicleTypes: [] };
    setLocal(reset);
    onApply(reset);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-park-navy text-white text-sm font-medium hover:bg-park-navy/90 transition-colors"
      >
        <SlidersHorizontal size={16} />
        Filters
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl bg-white shadow-xl border border-gray-100 p-5">
            {/* Price Range */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-park-navy mb-2">
                Price Range <span className="font-normal text-gray-400">(per hour)</span>
              </label>
              <input
                type="number"
                placeholder="Max price (e.g. 50)"
                value={local.maxPrice}
                onChange={(e) => setLocal((p) => ({ ...p, maxPrice: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-park-teal transition-colors"
              />
            </div>

            {/* Amenities */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-park-navy mb-2">Amenities</p>
              <div className="space-y-2">
                {AMENITIES.map((a) => (
                  <label key={a} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={local.amenities.includes(a)}
                      onChange={() => toggleAmenity(a)}
                      className="rounded accent-park-teal"
                    />
                    <span className="text-sm text-gray-700">{a}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Vehicle Type */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-park-navy mb-2">Vehicle Type</p>
              <div className="flex flex-wrap gap-2">
                {VEHICLE_TYPES.map((v) => (
                  <button
                    key={v}
                    onClick={() => toggleVehicle(v)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      local.vehicleTypes.includes(v)
                        ? "bg-park-teal text-white border-park-teal"
                        : "bg-white text-gray-600 border-gray-200 hover:border-park-teal"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleClear}
                className="flex-1 py-2 rounded-full border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={handleApply}
                className="flex-1 py-2 rounded-full bg-park-teal text-white text-sm font-semibold hover:bg-park-teal-dark transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
