"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Star, MapPin } from "lucide-react";
import type { ParkingSlot } from "@/lib/types";

interface ParkingCardProps {
  slot: ParkingSlot;
  saved?: boolean;
}

export default function ParkingCard({ slot, saved = false }: ParkingCardProps) {
  const [isSaved, setIsSaved] = useState(saved);

  return (
    <Link href={`/driver/listing/${slot.id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-park-teal-light to-park-teal/30 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin size={48} className="text-park-teal/40" />
          </div>
          {/* Heart button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsSaved((v) => !v);
            }}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
            aria-label={isSaved ? "Remove from saved" : "Save slot"}
          >
            <Heart
              size={16}
              className={isSaved ? "fill-red-500 text-red-500" : "text-gray-500"}
            />
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-park-navy text-sm leading-tight line-clamp-1">
              {slot.name}
            </h3>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <Star size={12} className="fill-park-gold text-park-gold" />
              <span className="text-xs font-semibold text-gray-700">{slot.rating}</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
            {slot.address}
          </p>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-park-teal font-bold text-sm">
              ₱{slot.price}
              <span className="text-gray-400 font-normal text-xs">/hr</span>
            </span>
            {slot.isRecommended && (
              <span className="text-xs px-2 py-0.5 rounded-full border border-park-teal text-park-teal font-medium">
                Recommended
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
