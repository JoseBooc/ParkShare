"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Wallet,
  FileText,
  CalendarDays,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type ParkingSlot = {
  id: string;
  created_at: string;
  host_id: string;
  title: string;
  address: string;
  price_per_hour: number;
  succeeding_rate?: number | null;
  description: string;
  status: string;
  image_url?: string | null;
};

export default function SlotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [slot, setSlot] = useState<ParkingSlot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchSlot() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("parking_slots")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error(error);
        setNotFound(true);
      } else {
        setSlot(data as ParkingSlot);
      }
      setIsLoading(false);
    }

    if (id) fetchSlot();
  }, [id]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm font-semibold text-gray-400">Loading slot…</p>
      </main>
    );
  }

  if (notFound || !slot) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-2xl font-extrabold text-[#1E2A78]">Slot not found</p>
          <Link
            href="/host/slots"
            className="mt-4 inline-block text-sm font-bold text-cyan-500 hover:underline"
          >
            ← Back to My Spaces
          </Link>
        </div>
      </main>
    );
  }

  const createdDate = new Date(slot.created_at).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="border-b border-gray-100 bg-[#eefbfd] px-8 py-6">
        <Link
          href="/host/slots"
          className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[#1E2A78] hover:text-cyan-500"
        >
          <ArrowLeft size={16} />
          Back to My Spaces
        </Link>

        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-500">
              Slot Details
            </p>

            <h1 className="mt-1 text-3xl font-extrabold text-[#1E2A78]">
              {slot.title}
            </h1>

            <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin size={14} />
              <span>{slot.address}</span>
            </div>
          </div>

          <Link
            href={`/host/slots/${id}/edit`}
            className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-cyan-500"
          >
            Edit Slot
          </Link>
        </div>
      </header>

      <section className="px-8 py-8">
        {/* SLOT IMAGE */}
        {(() => {
          const imageSrc =
            slot.image_url ||
            "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80";
          return (
            <img
              src={imageSrc}
              alt={slot.title}
              className="h-64 w-full rounded-3xl object-cover md:h-80"
            />
          );
        })()}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* LEFT */}
          <div className="space-y-6">
            {/* PRICE CARD */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
                <Wallet size={18} />
              </div>
              <p className="text-xs font-semibold text-gray-400">Pricing</p>

              <div className="mt-2 flex flex-wrap items-end gap-x-6 gap-y-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    First Hour
                  </p>
                  <p className="text-3xl font-extrabold text-[#1E2A78]">
                    ₱{slot.price_per_hour}
                    <span className="text-base font-semibold text-gray-400">/hr</span>
                  </p>
                </div>

                {slot.succeeding_rate != null && slot.succeeding_rate > 0 && (
                  <>
                    <span className="mb-1 text-xl font-bold text-gray-300">+</span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Succeeding Hours
                      </p>
                      <p className="text-3xl font-extrabold text-cyan-500">
                        ₱{slot.succeeding_rate}
                        <span className="text-base font-semibold text-gray-400">/hr</span>
                      </p>
                    </div>
                  </>
                )}
              </div>

              {slot.succeeding_rate != null && slot.succeeding_rate > 0 && (
                <p className="mt-3 text-xs text-gray-400">
                  First hour billed at ₱{slot.price_per_hour}, every hour after at ₱{slot.succeeding_rate}.
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <FileText size={18} className="text-cyan-500" />
                <h2 className="text-lg font-extrabold text-[#1E2A78]">
                  About this Space
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-gray-500">
                {slot.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-5">
            {/* STATUS */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-extrabold text-[#1E2A78]">
                Listing Status
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className="rounded-full bg-cyan-50 px-3 py-0.5 text-xs font-bold capitalize text-cyan-600">
                    {slot.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Listed on</span>
                  <span className="text-sm font-extrabold text-[#1E2A78]">
                    {createdDate}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Address</span>
                  <span className="max-w-40 text-right text-sm font-extrabold text-[#1E2A78]">
                    {slot.address}
                  </span>
                </div>
              </div>
            </div>

            {/* CALENDAR LINK */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <CalendarDays size={18} className="text-cyan-500" />
                <h2 className="text-lg font-extrabold text-[#1E2A78]">Bookings</h2>
              </div>
              <p className="mb-4 text-sm text-gray-500">
                View upcoming reservations for this slot.
              </p>
              <Link
                href="/host/calendar"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#eefbfd] px-4 py-2 text-sm font-bold text-cyan-600 transition-colors hover:bg-cyan-100"
              >
                Open Calendar →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
