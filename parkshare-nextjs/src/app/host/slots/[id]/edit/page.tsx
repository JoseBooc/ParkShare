"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const VEHICLE_TYPES = ["Sedan", "SUV", "Pickup Truck", "Motorcycle", "Van", "PUV"];
const AMENITY_OPTIONS = ["CCTV", "Sheltered", "24/7 Access", "EV Charging", "Security Guard"];

export default function EditSlotPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [succeedingRate, setSucceedingRate] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        setTitle(data.title ?? "");
        setAddress(data.address ?? "");
        setPrice(data.price_per_hour?.toString() ?? "");
        setSucceedingRate(data.succeeding_rate?.toString() ?? "");
        setDescription(data.description ?? "");
        setSelectedAmenities(Array.isArray(data.amenities) ? data.amenities : []);
        setSelectedVehicles(Array.isArray(data.vehicle_types) ? data.vehicle_types : []);
      }
      setIsFetching(false);
    }

    if (id) fetchSlot();
  }, [id]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("parking_slots")
        .update({
          title,
          address,
          price_per_hour: parseFloat(price),
          succeeding_rate: parseFloat(succeedingRate) || 0,
          description,
          amenities: selectedAmenities,
          vehicle_types: selectedVehicles,
        })
        .eq("id", id);

      if (error) {
        console.error(error);
        throw error;
      }

      alert(`Changes saved for "${title}".`);
      router.push("/host/slots");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save changes.";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm font-semibold text-gray-400">Loading slot…</p>
      </main>
    );
  }

  if (notFound) {
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

        <div className="mt-2">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-500">
            Edit Slot
          </p>

          <h1 className="mt-1 text-3xl font-extrabold text-[#1E2A78]">
            {title}
          </h1>
        </div>
      </header>

      {/* FORM */}
      <section className="px-8 py-8">
        <div className="mx-auto max-w-2xl">
          <form
            onSubmit={handleSave}
            className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm"
          >
            <h2 className="mb-6 text-xl font-extrabold text-[#1E2A78]">
              Slot Information
            </h2>

            {/* SLOT TITLE */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-bold text-[#1E2A78]">
                Slot Title / Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Avida Towers Davao"
                required
                className="w-full rounded-2xl border border-gray-200 px-5 py-3 text-base text-gray-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            {/* FIRST HOUR PRICE */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-bold text-[#1E2A78]">
                First Hour Rate (₱)
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-base font-bold text-gray-400">
                  ₱
                </span>
                <input
                  type="number"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="35"
                  required
                  className="w-full rounded-2xl border border-gray-200 py-3 pl-9 pr-5 text-base text-gray-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
            </div>

            {/* SUCCEEDING HOUR RATE */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-bold text-[#1E2A78]">
                Succeeding Hour Rate (₱)
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-base font-bold text-gray-400">
                  ₱
                </span>
                <input
                  type="number"
                  min="0"
                  value={succeedingRate}
                  onChange={(e) => setSucceedingRate(e.target.value)}
                  placeholder="25"
                  className="w-full rounded-2xl border border-gray-200 py-3 pl-9 pr-5 text-base text-gray-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-bold text-[#1E2A78]">
                Location / Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. C. M. Recto St, Poblacion District, Davao City"
                required
                className="w-full rounded-2xl border border-gray-200 px-5 py-3 text-base text-gray-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mb-8">
              <label className="mb-2 block text-sm font-bold text-[#1E2A78]">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your parking space…"
                rows={4}
                className="w-full resize-none rounded-2xl border border-gray-200 px-5 py-3 text-base text-gray-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            {/* VEHICLE TYPES */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-bold text-[#1E2A78]">
                Vehicle Compatibility
              </label>
              <div className="flex flex-wrap gap-2">
                {VEHICLE_TYPES.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() =>
                      setSelectedVehicles((prev) =>
                        prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
                      )
                    }
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      selectedVehicles.includes(v)
                        ? "border-park-teal bg-park-teal text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-park-teal"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* AMENITIES */}
            <div className="mb-8">
              <label className="mb-2 block text-sm font-bold text-[#1E2A78]">
                Amenities
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {AMENITY_OPTIONS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() =>
                      setSelectedAmenities((prev) =>
                        prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
                      )
                    }
                    className={`rounded-2xl border py-2.5 text-sm font-semibold transition ${
                      selectedAmenities.includes(a)
                        ? "border-park-teal bg-park-teal text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-park-teal"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-base font-bold text-white transition-colors hover:bg-emerald-600 disabled:opacity-60"
              >
                <Save size={17} />
                {isLoading ? "Saving…" : "Save Changes"}
              </button>

              <Link
                href={`/host/slots/${id}`}
                className="flex flex-1 items-center justify-center rounded-2xl border-2 border-[#1E2A78] py-3 text-base font-bold text-[#1E2A78] transition-colors hover:bg-[#1E2A78] hover:text-white"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
