"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Star,
  MapPin,
  ShieldCheck,
  Car,
} from "lucide-react";
import type { ParkingSlot } from "@/lib/types";

interface ParkingCardProps {
  slot: ParkingSlot;
  saved?: boolean;
}

export default function ParkingCard({ slot, saved = false }: ParkingCardProps) {
  const [isSaved, setIsSaved] = useState(saved);

  return (
    <Link href={`/driver/listing/${slot.id}`} className="group block">
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-park-teal-light to-park-teal/30">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm">
              <MapPin size={30} className="text-park-teal" />
            </div>
          </div>

          {slot.isRecommended && (
            <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-park-teal shadow-sm">
              Recommended
            </span>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              setIsSaved((v) => !v);
            }}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
            aria-label={isSaved ? "Remove from saved" : "Save slot"}
          >
            <Heart
              size={17}
              className={
                isSaved
                  ? "fill-red-500 text-red-500"
                  : "text-gray-500"
              }
            />
          </button>

          <div className="absolute bottom-3 left-3 rounded-full bg-park-navy px-3 py-1 text-xs font-bold text-white shadow-sm">
            ₱{slot.price}/hr
          </div>
        </div>

        <div className="p-4">
          <div className="mb-2 flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 text-base font-extrabold text-park-navy">
              {slot.name}
            </h3>

            <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#fff8e5] px-2 py-1">
              <Star size={13} className="fill-park-gold text-park-gold" />
              <span className="text-xs font-bold text-gray-700">
                {slot.rating}
              </span>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-1 text-sm text-gray-500">
            <MapPin size={14} className="shrink-0 text-park-teal" />
            <p className="line-clamp-1">{slot.address}</p>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eefbfd] px-3 py-1 text-xs font-bold text-park-navy">
              <Car size={12} />
              {slot.vehicleTypes?.[0] || "Vehicle"}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full bg-[#eefbfd] px-3 py-1 text-xs font-bold text-park-navy">
              <ShieldCheck size={12} />
              Secure
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div>
              <p className="text-xs font-semibold text-gray-400">Starts at</p>
              <p className="text-lg font-extrabold text-park-teal">
                ₱{slot.price}
                <span className="text-xs font-normal text-gray-400">/hr</span>
              </p>
            </div>

            <span className="rounded-full bg-park-teal px-4 py-2 text-xs font-bold text-white transition-colors group-hover:bg-park-teal-dark">
              View Slot
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}