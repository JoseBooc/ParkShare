"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  MapPin,
  Star,
  MessageCircle,
  Minus,
  Plus,
  User,
} from "lucide-react";
import { PARKING_SLOTS, REVIEWS } from "@/lib/mock-data";
import AmenityBadge from "@/components/ui/AmenityBadge";
import StarRating from "@/components/ui/StarRating";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Props {
  params: Promise<{ id: string }>;
}

export default function ListingPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();

  const slot = PARKING_SLOTS.find((s) => s.id === id);
  const reviews = REVIEWS.filter((r) => r.slotId === id);

  const [duration, setDuration] = useState(3);
  const serviceFeeRate = 0.06;

  if (!slot) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <p className="text-lg font-semibold">Parking slot not found</p>
        <Link href="/driver" className="mt-4 text-park-teal text-sm hover:underline">
          ← Back to listings
        </Link>
      </div>
    );
  }

  const subtotal = slot.price * duration;
  const serviceFee = Math.round(subtotal * serviceFeeRate);
  const total = subtotal + serviceFee;

  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-park-navy mb-4 transition-colors"
      >
        <ChevronLeft size={16} /> Back
      </button>

      {/* Photo Gallery */}
      <div className="relative aspect-[16/7] rounded-2xl overflow-hidden bg-gradient-to-br from-park-teal-light to-park-teal/30 mb-4 flex items-center justify-center">
        <MapPin size={64} className="text-park-teal/30" />
        {slot.isRecommended && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white text-park-teal text-xs font-semibold border border-park-teal">
            Recommended
          </span>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        <div className="flex-1">
          {/* Title + Rating */}
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-2xl font-extrabold text-park-navy">{slot.name}</h1>
            <div className="flex items-center gap-1 flex-shrink-0 mt-1">
              <Star size={14} className="fill-park-gold text-park-gold" />
              <span className="text-sm font-bold text-gray-700">{slot.rating}</span>
              <span className="text-xs text-gray-400">({slot.reviewCount} Reviews)</span>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
            <MapPin size={14} />
            <span>{slot.address}, {slot.city}</span>
          </div>

          {/* Host */}
          <div className="flex items-center justify-between mt-4 p-3 bg-white rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-park-teal flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-park-navy text-sm">{slot.hostName}</p>
                <p className="text-xs text-gray-400">
                  Host since {slot.hostSince} · {slot.hostBookings} bookings
                </p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-park-navy text-park-navy text-xs font-medium hover:bg-park-navy hover:text-white transition-colors">
              <MessageCircle size={12} /> Message Host
            </button>
          </div>

          {/* About */}
          <div className="mt-5">
            <h2 className="font-bold text-park-navy mb-1">About the slot</h2>
            <p className="text-sm text-gray-600">{slot.description}</p>
          </div>

          {/* Amenities */}
          <div className="mt-4">
            <h2 className="font-bold text-park-navy mb-2">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {slot.amenities.map((a) => (
                <AmenityBadge key={a} amenity={a} />
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="mt-5">
            <h2 className="font-bold text-park-navy mb-3">Availability</h2>
            <div className="flex gap-2 flex-wrap">
              {slot.availability.map((day) => (
                <div key={day.day} className="flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-500">{day.day}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      day.open
                        ? "bg-park-teal-light text-park-teal"
                        : "bg-red-50 text-red-400"
                    }`}
                  >
                    {day.open ? "Open" : "Closed"}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Operating hours: 8 AM – 11 PM (Mon – Sat)
            </p>
          </div>

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="mt-5">
              <h2 className="font-bold text-park-navy mb-1">
                Reviews ({slot.reviewCount}){" "}
                <span className="text-park-gold">
                  <Star size={14} className="inline fill-park-gold" /> {slot.rating}
                </span>
              </h2>
              <div className="space-y-3 mt-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-park-teal-light flex items-center justify-center">
                          <User size={14} className="text-park-teal" />
                        </div>
                        <span className="text-sm font-semibold text-park-teal">
                          {rev.userName}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">{rev.date}</span>
                    </div>
                    <StarRating rating={rev.rating} size={12} />
                    <p className="text-sm text-gray-600 mt-1">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking Widget — sticky on larger screens but inline on mobile */}
      </div>

      {/* Booking Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm sticky bottom-4">
        <p className="font-bold text-park-navy text-lg mb-4">
          ₱{slot.price}
          <span className="text-gray-400 font-normal text-sm">/hr</span>
        </p>

        <div className="space-y-3 mb-4">
          {/* Date */}
          <div className="border border-gray-200 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-400 mb-0.5">Date</p>
            <p className="text-sm font-semibold text-park-navy">{dateLabel}</p>
          </div>

          {/* Time */}
          <div className="border border-gray-200 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-400 mb-0.5">Time</p>
            <p className="text-sm font-semibold text-park-navy">6:00 – 9:00 AM</p>
          </div>

          {/* Duration */}
          <div className="border border-gray-200 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-400 mb-2">Duration</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDuration((d) => Math.max(1, d - 1))}
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="font-bold text-park-navy">{duration} hours</span>
              <button
                onClick={() => setDuration((d) => Math.min(12, d + 1))}
                className="w-7 h-7 rounded-full bg-park-teal text-white flex items-center justify-center hover:bg-park-teal-dark transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-1.5 border-t border-gray-100 pt-3 mb-4">
          <div className="flex justify-between text-sm text-gray-500">
            <span>₱{slot.price} × {duration} hours</span>
            <span>₱{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Service fee</span>
            <span>₱{serviceFee}</span>
          </div>
          <div className="flex justify-between font-bold text-park-navy">
            <span>Total</span>
            <span className="text-park-teal">₱{total}</span>
          </div>
        </div>

        <button className="w-full py-3 rounded-full bg-park-navy text-white font-semibold text-sm hover:bg-park-navy/90 transition-colors">
          Book Now
        </button>
      </div>
    </div>
  );
}
