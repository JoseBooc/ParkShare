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

interface Props {
  params: Promise<{ id: string }>;
}

export default function ListingPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();

  const slot = PARKING_SLOTS.find((s) => s.id === id);
  const reviews = REVIEWS.filter((r) => r.slotId === id);

  const [duration, setDuration] = useState(3);

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
  const serviceFee = Math.round(subtotal * 0.06);
  const total = subtotal + serviceFee;

  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-park-navy mb-4 transition-colors"
      >
        <ChevronLeft size={16} /> Back
      </button>

      {/* Photo Gallery */}
      <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden mb-6 h-52">
        {/* Main photo */}
        <div className="col-span-2 bg-gradient-to-br from-park-teal-light to-park-teal/30 flex items-center justify-center">
          <MapPin size={56} className="text-park-teal/30" />
        </div>
        {/* Two side photos */}
        <div className="flex flex-col gap-2">
          <div className="flex-1 bg-gradient-to-br from-park-teal/20 to-park-navy/10 flex items-center justify-center">
            <MapPin size={28} className="text-park-teal/20" />
          </div>
          <div className="flex-1 bg-gradient-to-br from-park-navy/10 to-park-teal/20 flex items-center justify-center">
            <MapPin size={28} className="text-park-teal/20" />
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Left column: listing info ── */}
        <div className="flex-1 min-w-0">

          {/* Recommended badge */}
          {slot.isRecommended && (
            <span className="inline-block mb-3 px-3 py-1 rounded-full border border-park-teal text-park-teal text-xs font-semibold">
              Recommended
            </span>
          )}

          {/* Title */}
          <h1 className="text-2xl font-extrabold text-park-navy leading-tight">
            {slot.name}
          </h1>

          {/* Address + Rating row */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
              <MapPin size={14} />
              <span>{slot.address}, {slot.city}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-park-gold text-park-gold" />
              <span className="text-sm font-bold text-gray-700">{slot.rating}</span>
              <span className="text-sm text-gray-400">({slot.reviewCount} Reviews)</span>
            </div>
          </div>

          {/* Host card */}
          <div className="flex items-center justify-between mt-5 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-park-teal flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-park-navy text-sm">{slot.hostName}</p>
                <p className="text-xs text-gray-400">
                  Host since {slot.hostSince} · {slot.hostBookings} bookings
                </p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-park-navy text-white text-xs font-semibold hover:bg-park-navy/90 transition-colors">
              <MessageCircle size={13} /> Message Host
            </button>
          </div>

          {/* About */}
          <div className="mt-6">
            <h2 className="font-bold text-park-navy mb-2">About the slot</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{slot.description}</p>
          </div>

          {/* Amenities */}
          <div className="mt-6">
            <h2 className="font-bold text-park-navy mb-3">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {slot.amenities.map((a) => (
                <AmenityBadge key={a} amenity={a} />
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="mt-6">
            <h2 className="font-bold text-park-navy mb-3">Availability</h2>
            <div className="grid grid-cols-7 gap-1 text-center">
              {slot.availability.map((day) => (
                <div key={day.day} className="flex flex-col items-center gap-1.5">
                  <span className="text-xs font-semibold text-gray-500">{day.day}</span>
                  <span
                    className={`w-full text-xs py-1 rounded-full font-medium ${
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
            <p className="text-xs text-gray-400 mt-3">
              Operating hours: 8 AM – 11 PM (Mon – Sat)
            </p>
          </div>

          {/* Reviews */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-bold text-park-navy">
                Reviews ({slot.reviewCount})
              </h2>
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-park-gold text-park-gold" />
                <span className="text-sm font-bold text-gray-700">{slot.rating}</span>
              </div>
            </div>
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-park-teal-light flex items-center justify-center">
                        <User size={15} className="text-park-teal" />
                      </div>
                      <span className="text-sm font-bold text-park-teal">{rev.userName}</span>
                    </div>
                    <span className="text-xs text-gray-400">{rev.date}</span>
                  </div>
                  <StarRating rating={rev.rating} size={13} />
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right column: booking card (sticky) ── */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm lg:sticky lg:top-24">
            <p className="font-extrabold text-park-navy text-xl mb-4">
              ₱{slot.price}
              <span className="text-gray-400 font-normal text-sm">/hr</span>
            </p>

            {/* Date */}
            <div className="border border-gray-200 rounded-xl px-4 py-3 mb-3">
              <p className="text-xs text-gray-400 mb-0.5">Date</p>
              <p className="text-sm font-semibold text-park-navy">{dateLabel}</p>
            </div>

            {/* Time */}
            <div className="border border-gray-200 rounded-xl px-4 py-3 mb-3">
              <p className="text-xs text-gray-400 mb-0.5">Time</p>
              <p className="text-sm font-semibold text-park-navy">6:00 – 9:00 AM</p>
            </div>

            {/* Duration */}
            <div className="border border-gray-200 rounded-xl px-4 py-3 mb-4">
              <p className="text-xs text-gray-400 mb-2">Duration</p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setDuration((d) => Math.max(1, d - 1))}
                  className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Minus size={13} />
                </button>
                <span className="font-bold text-park-navy text-sm">{duration} hours</span>
                <button
                  onClick={() => setDuration((d) => Math.min(12, d + 1))}
                  className="w-7 h-7 rounded-full bg-park-teal text-white flex items-center justify-center hover:bg-park-teal-dark transition-colors"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="space-y-1.5 border-t border-gray-100 pt-3 mb-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>₱{slot.price} × {duration} hours</span>
                <span>₱{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Service fee</span>
                <span>₱{serviceFee}</span>
              </div>
              <div className="flex justify-between font-extrabold text-park-navy pt-1">
                <span>Total</span>
                <span className="text-park-teal">₱{total}</span>
              </div>
            </div>

            <button className="w-full py-3 rounded-full bg-park-navy text-white font-bold text-sm hover:bg-park-navy/90 transition-colors">
              Book Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
