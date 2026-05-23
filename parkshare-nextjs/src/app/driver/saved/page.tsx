"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

type SavedSlot = {
  id: string;
  title: string;
  address: string | null;
  price_per_hour: number | null;
  image_url: string | null;
  type: string | null;
};

export default function SavedSlotsPage() {
  const [savedSlots, setSavedSlots] = useState<SavedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedSlots();
  }, []);

  async function fetchSavedSlots() {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("saved_slots")
        .select(`
          slot_id,
          parking_slots (
            id,
            title,
            address,
            price_per_hour,
            image_url,
            type
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        const slots = data
          .map((item: any) => item.parking_slots)
          .filter(Boolean) as SavedSlot[];
        setSavedSlots(slots);
      }
    } catch (err) {
      console.error("Error fetching saved slots:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUnsave(slotId: string) {
    setRemovingId(slotId);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("saved_slots")
        .delete()
        .eq("user_id", user.id)
        .eq("slot_id", slotId);

      if (error) throw error;
      setSavedSlots((prev) => prev.filter((s) => s.id !== slotId));
    } catch (err) {
      console.error("Error removing saved slot:", err);
      alert("Failed to remove. Please try again.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <Heart size={20} className="fill-rose-400 text-rose-400" />
        <h1 className="text-xl font-bold text-park-navy">Saved Slots</h1>
        {!loading && (
          <span className="text-sm text-gray-400">({savedSlots.length} saved)</span>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <p className="py-12 text-center text-sm text-slate-400 animate-pulse">
          Loading your saved slots…
        </p>
      ) : savedSlots.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-slate-100 py-20 text-center text-slate-400">
          <Heart size={40} className="text-slate-200" />
          <div>
            <p className="text-base font-semibold">No saved slots yet</p>
            <p className="mt-1 text-sm">
              Tap the heart icon on any parking slot to save it here.
            </p>
          </div>
          <Link
            href="/driver"
            className="mt-2 rounded-full bg-park-teal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-park-teal-dark"
          >
            Browse parking slots
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedSlots.map((slot) => (
            <div
              key={slot.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-48 w-full bg-slate-100">
                <img
                  src={slot.image_url || "/placeholder-parking.jpg"}
                  alt={slot.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm backdrop-blur-sm">
                  {slot.type || "Standard"}
                </span>
                <button
                  onClick={() => handleUnsave(slot.id)}
                  disabled={removingId === slot.id}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-rose-50 disabled:opacity-50"
                  aria-label="Remove from saved"
                >
                  <Heart
                    size={16}
                    className={
                      removingId === slot.id
                        ? "text-slate-300"
                        : "fill-rose-500 text-rose-500"
                    }
                  />
                </button>
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div className="space-y-1">
                  <h4 className="line-clamp-1 text-base font-bold text-slate-800">
                    {slot.title}
                  </h4>
                  <p className="line-clamp-1 text-xs text-slate-400">
                    {slot.address || "No address specified"}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
                  <span className="text-sm font-extrabold text-park-teal">
                    ₱{slot.price_per_hour ?? 0}/hr
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-500">
                    ● Available
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
