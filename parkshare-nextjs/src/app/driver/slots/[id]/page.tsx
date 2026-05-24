"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Star,
  ShieldCheck,
  Clock,
  Camera,
  ChevronLeft,
  Minus,
  Plus,
  MessageCircle,
  User,
  Car,
  Zap,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type AvailabilityDay = {
  day: string;
  isOpen: boolean;
  from: string;
  fromPeriod: string;
  to: string;
  toPeriod: string;
};

type Slot = {
  id: string;
  title: string;
  address: string | null;
  price_per_hour: number | null;
  description: string | null;
  image_url: string | null;
  type: string | null;
  status: string;
  host_id: string | null;
  amenities?: string[] | null;
  vehicle_types?: string[] | null;
  availability?: AvailabilityDay[] | null;
  open_247?: boolean | null;
  succeeding_rate?: number | null;
};

type HostProfile = {
  full_name: string | null;
  created_at: string | null;
};

const SERVICE_FEE = 6;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const MOCK_REVIEWS = [
  {
    id: "r1",
    userName: "Shanaiah Cava",
    rating: 5,
    comment: "Soooooooooooo clean! Will book again fr!",
    date: "November 13, 2026",
  },
  {
    id: "r2",
    userName: "Miguel Torres",
    rating: 5,
    comment: "Very convenient location and the host is very responsive. Highly recommended!",
    date: "November 10, 2026",
  },
];

const AMENITY_ICON: Record<string, React.ReactNode> = {
  CCTV: <Camera size={12} />,
  "Security Guard": <ShieldCheck size={12} />,
  "24/7 Access": <Clock size={12} />,
  "EV Charging": <Zap size={12} />,
  Sheltered: <Car size={12} />,
};

const DEFAULT_AMENITIES = ["CCTV", "Security Guard", "24/7 Access"];

export default function SlotDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [slot, setSlot] = useState<Slot | null>(null);
  const [host, setHost] = useState<HostProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  const todayLabel = new Date().toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    if (!id) return;

    async function load() {
      const supabase = createClient();

      const { data: slotData, error } = await supabase
        .from("parking_slots")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !slotData) {
        router.push("/driver");
        return;
      }

      setSlot(slotData);

      if (slotData.host_id) {
        const { data: hostData } = await supabase
          .from("profiles")
          .select("full_name, created_at")
          .eq("id", slotData.host_id)
          .single();
        if (hostData) setHost(hostData);
      }

      setLoading(false);
    }

    load();
  }, [id, router]);

  const firstHour = slot?.price_per_hour ?? 0;
  const succeedingRate = slot?.succeeding_rate ?? firstHour;
  const succeedingHours = Math.max(0, duration - 1);
  const basePrice = firstHour + succeedingHours * succeedingRate;
  const serviceFee = Math.round(basePrice * 0.05);
  const total = basePrice + serviceFee;

  const amenities: string[] =
    Array.isArray(slot?.amenities) && slot.amenities.length > 0
      ? slot.amenities
      : DEFAULT_AMENITIES;

  const vehicleTypes: string[] =
    Array.isArray(slot?.vehicle_types) && slot.vehicle_types.length > 0
      ? slot.vehicle_types
      : [];

  const availabilityDays: AvailabilityDay[] =
    slot?.open_247
      ? DAYS.map((day) => ({ day, isOpen: true, from: "12:00", fromPeriod: "AM", to: "11:00", toPeriod: "PM" }))
      : Array.isArray(slot?.availability) && slot.availability.length > 0
        ? slot.availability
        : DAYS.map((day, i) => ({ day, isOpen: i < 6, from: "8:00", fromPeriod: "AM", to: "11:00", toPeriod: "PM" }));

  const openDays = availabilityDays.filter((d) => d.isOpen);
  const operatingHoursText = slot?.open_247
    ? "Open 24/7 every day"
    : openDays.length > 0
      ? `${openDays[0].from} ${openDays[0].fromPeriod} – ${openDays[0].to} ${openDays[0].toPeriod} (${openDays.map((d) => d.day.slice(0, 3)).join(", ")})`
      : "Contact host for hours";

  const hostSince = host?.created_at
    ? new Date(host.created_at).getFullYear()
    : "2020";

  const handleBook = async () => {
    setBookingLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please sign in to book a slot.");
        return;
      }
      const { error } = await supabase
        .from("bookings")
        .insert([{ user_id: user.id, slot_id: id, status: "active" }]);
      if (error) throw error;
      alert("Slot booked successfully! Your space is locked in.");
      router.push("/driver");
    } catch {
      alert("Failed to complete booking. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="animate-pulse text-sm text-slate-400">Loading slot details…</p>
      </div>
    );
  }

  if (!slot) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">

        {/* Back navigation */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-park-navy"
        >
          <ChevronLeft size={16} />
          Back to listings
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">

          {/* ─── LEFT COLUMN ─── */}
          <div className="space-y-6">

            {/* Cover image */}
            <div className="overflow-hidden rounded-3xl bg-slate-100">
              <img
                src={slot.image_url || "/placeholder-parking.jpg"}
                alt={slot.title}
                className="h-64 w-full object-cover sm:h-80"
              />
            </div>

            {/* Badge + title + address + rating */}
            <div>
              {slot.type && (
                <span className="mb-3 inline-block rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
                  {slot.type}
                </span>
              )}
              <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
                {slot.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin size={14} className="shrink-0 text-park-teal" />
                  {slot.address || "No address specified"}
                </span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  5
                  <span className="font-normal text-slate-400">(67 Reviews)</span>
                </span>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Host info */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-park-teal/10">
                  <User size={22} className="text-park-teal" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">
                    {host?.full_name || "ParkShare Host"}
                  </p>
                  <p className="text-xs text-slate-400">
                    Host since {hostSince} · 67 bookings
                  </p>
                </div>
              </div>
              <button className="flex w-fit items-center gap-2 rounded-full bg-park-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-park-navy/90">
                <MessageCircle size={14} />
                Message Host
              </button>
            </div>

            <hr className="border-slate-100" />

            {/* Description */}
            {slot.description && (
              <>
                <div>
                  <h2 className="mb-2 text-base font-bold text-slate-800">About the spaces</h2>
                  <p className="text-sm leading-7 text-slate-500">{slot.description}</p>
                </div>
                <hr className="border-slate-100" />
              </>
            )}

            {/* Amenities */}
            <div>
              <h2 className="mb-3 text-base font-bold text-slate-800">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {amenities.map((a) => (
                  <span
                    key={a}
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
                  >
                    {AMENITY_ICON[a] ?? <ShieldCheck size={12} />}
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Vehicle types */}
            {vehicleTypes.length > 0 && (
              <>
                <div>
                  <h2 className="mb-3 text-base font-bold text-slate-800">Vehicle Compatibility</h2>
                  <div className="flex flex-wrap gap-2">
                    {vehicleTypes.map((v) => (
                      <span
                        key={v}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
                <hr className="border-slate-100" />
              </>
            )}

            {/* Availability */}
            <div>
              <h2 className="mb-4 text-base font-bold text-slate-800">Availability</h2>
              <div className="flex flex-wrap gap-3">
                {availabilityDays.map((item) => (
                  <div key={item.day} className="flex flex-col items-center gap-1.5">
                    <span className="text-xs text-slate-400">{item.day.slice(0, 3)}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.isOpen
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {item.isOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-400">{operatingHoursText}</p>
            </div>

            <hr className="border-slate-100" />

            {/* Reviews */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-800">
                  Reviews{" "}
                  <span className="font-normal text-slate-400">(67)</span>
                </h2>
                <span className="flex items-center gap-1 text-sm font-bold text-slate-700">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  5
                </span>
              </div>

              <div className="space-y-4">
                {MOCK_REVIEWS.map((review) => (
                  <div key={review.id} className="rounded-2xl bg-slate-50 p-5">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-park-teal/10">
                          <User size={16} className="text-park-teal" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {review.userName}
                          </p>
                          <div className="mt-0.5 flex gap-0.5">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star
                                key={i}
                                size={11}
                                className="fill-amber-400 text-amber-400"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="shrink-0 text-xs text-slate-400">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN — Sticky booking card ─── */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg">

              {/* Price header */}
              <div className="mb-5 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  {/* First hour */}
                  <div className="flex-1">
                    <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      First Hour
                    </p>
                    <p className="text-2xl font-black text-park-teal">
                      ₱{firstHour}
                      <span className="text-sm font-semibold text-slate-400">/hr</span>
                    </p>
                  </div>

                  {/* Succeeding hours — always show when > 0 */}
                  {succeedingRate > 0 && (
                    <>
                      <span className="mt-3 text-base font-bold text-slate-300">+</span>
                      <div className="flex-1">
                        <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Succeeding Hrs
                        </p>
                        <p className="text-2xl font-black text-park-navy">
                          ₱{succeedingRate}
                          <span className="text-sm font-semibold text-slate-400">/hr</span>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="mb-3 rounded-2xl border border-slate-200 px-4 py-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Date
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800">{todayLabel}</p>
              </div>

              {/* Time */}
              <div className="mb-3 rounded-2xl border border-slate-200 px-4 py-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Time
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800">6:00 – 9:00 AM</p>
              </div>

              {/* Duration stepper */}
              <div className="mb-5 rounded-2xl border border-slate-200 px-4 py-3.5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Duration
                </p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setDuration((d) => Math.max(1, d - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-park-navy text-white transition hover:bg-park-navy/80 active:scale-95"
                    aria-label="Decrease duration"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold text-slate-800">
                    {duration} hour{duration !== 1 ? "s" : ""}
                  </span>
                  <button
                    onClick={() => setDuration((d) => Math.min(24, d + 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-park-navy text-white transition hover:bg-park-navy/80 active:scale-95"
                    aria-label="Increase duration"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <hr className="mb-5 border-slate-100" />

              {/* Pricing breakdown */}
              <div className="mb-5 space-y-2.5 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>1st hour (base rate)</span>
                  <span>₱{firstHour}</span>
                </div>
                {succeedingHours > 0 && (
                  <div className="flex items-center justify-between text-slate-600">
                    <span>
                      {succeedingHours} succeeding hr{succeedingHours !== 1 ? "s" : ""} × ₱{succeedingRate}
                    </span>
                    <span>₱{succeedingHours * succeedingRate}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-slate-600">
                  <span>Service fee (5%)</span>
                  <span>₱{serviceFee}</span>
                </div>
                <hr className="border-slate-100" />
                <div className="flex items-center justify-between font-black text-slate-900">
                  <span>Total</span>
                  <span className="text-park-teal">₱{total}</span>
                </div>
              </div>

              {/* Book Now */}
              <button
                onClick={handleBook}
                disabled={bookingLoading}
                className="w-full rounded-2xl bg-park-navy py-4 text-sm font-bold text-white transition hover:bg-park-navy/90 active:scale-[0.98] disabled:opacity-60"
              >
                {bookingLoading ? "Processing…" : "Book Now"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
