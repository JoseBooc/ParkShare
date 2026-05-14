"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { Amenity, VehicleType } from "@/lib/types";

const AMENITIES: Amenity[] = ["CCTV", "EV Charging", "24/7 Access", "Sheltered", "Security Guard"];
const VEHICLE_TYPES: VehicleType[] = ["Sedan", "SUV", "Pickup Truck", "Motorcycle", "Van", "PUV"];

export interface Filters {
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

  const activeCount =
    (local.maxPrice ? 1 : 0) + local.amenities.length + local.vehicleTypes.length;

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors ${
          open || activeCount > 0
            ? "bg-park-navy text-white"
            : "bg-park-navy text-white hover:bg-park-navy/90"
        }`}
      >
        <SlidersHorizontal size={15} />
        Filters
        {activeCount > 0 && (
          <span className="ml-0.5 bg-park-teal text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Panel — full-width, anchored to the right, opens below */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-[520px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white shadow-xl border border-gray-100 p-5">

            {/* 3-column filter sections */}
            <div className="grid grid-cols-3 gap-5">

              {/* Price Range */}
              <div>
                <p className="text-xs font-bold text-park-navy mb-1">
                  Price Range{" "}
                  <span className="font-normal text-gray-400">(per hour)</span>
                </p>
                <input
                  type="number"
                  placeholder="Php 35"
                  value={local.maxPrice}
                  onChange={(e) =>
                    setLocal((p) => ({ ...p, maxPrice: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-park-teal transition-colors"
                />
              </div>

              {/* Amenities */}
              <div>
                <p className="text-xs font-bold text-park-navy mb-2">Amenities</p>
                <div className="space-y-1.5">
                  {AMENITIES.map((a) => (
                    <label key={a} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={local.amenities.includes(a)}
                        onChange={() => toggleAmenity(a)}
                        className="rounded accent-park-teal w-3.5 h-3.5"
                      />
                      <span className="text-sm text-gray-700">{a}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Vehicle Type */}
              <div>
                <p className="text-xs font-bold text-park-navy mb-2">Vehicle Type</p>
                <div className="flex flex-wrap gap-1.5">
                  {VEHICLE_TYPES.map((v) => (
                    <button
                      key={v}
                      onClick={() => toggleVehicle(v)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        local.vehicleTypes.includes(v)
                          ? "bg-park-navy text-white border-park-navy"
                          : "bg-white text-gray-600 border-gray-200 hover:border-park-navy"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100">
              <button
                onClick={handleClear}
                className="px-5 py-2 rounded-full border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium"
              >
                Clear All
              </button>
              <button
                onClick={handleApply}
                className="px-5 py-2 rounded-full bg-park-teal text-white text-sm font-semibold hover:bg-park-teal-dark transition-colors"
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
