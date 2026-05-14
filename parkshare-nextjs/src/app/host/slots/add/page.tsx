"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Upload,
  Check,
  User,
  MapPin,
  Camera,
} from "lucide-react";
import type { Amenity, VehicleType } from "@/lib/types";

type Step = 1 | 2 | 3 | 4 | 5;

const AMENITIES: Amenity[] = ["CCTV", "EV Charging", "Sheltered", "Security Guard", "24/7 Access"];
const VEHICLE_TYPES: VehicleType[] = ["Sedan", "SUV", "Pickup Truck", "Motorcycle", "Van", "PUV"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
const DAY_KEYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

interface DayConfig {
  open: boolean;
  from: string;
  to: string;
}

const DEFAULT_DAY: DayConfig = { open: true, from: "08:00", to: "23:00" };

export default function AddSlotPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>(1);

  // Step 1: Photos
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  // Step 2: Location
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>(["Sedan"]);

  // Step 3: Pricing
  const [hourlyRate, setHourlyRate] = useState("");
  const [amenities, setAmenities] = useState<Amenity[]>([]);

  // Step 4: Availability
  const [open24_7, setOpen24_7] = useState(false);
  const [days, setDays] = useState<Record<string, DayConfig>>(
    Object.fromEntries(DAY_KEYS.map((d) => [d, { ...DEFAULT_DAY }]))
  );

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setPhotos((prev) => [...prev, ...files]);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) =>
          setPhotoPreviews((prev) => [...prev, ev.target?.result as string]);
        reader.readAsDataURL(file);
      }
    });
  }

  function toggleVehicle(v: VehicleType) {
    setVehicleTypes((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );
  }

  function toggleAmenity(a: Amenity) {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  }

  function toggleDay(key: string) {
    setDays((prev) => ({
      ...prev,
      [key]: { ...prev[key], open: !prev[key].open },
    }));
  }

  function updateDayTime(key: string, field: "from" | "to", value: string) {
    setDays((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  }

  function handlePublish() {
    router.push("/host/slots");
  }

  const TOTAL_STEPS = 5;

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (step > 1 ? setStep((s) => (s - 1) as Step) : router.back())}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-park-navy transition-colors"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <div>
            <h1 className="font-bold text-park-navy">List Your Parking Slot</h1>
            <p className="text-xs text-gray-400">
              Step {step} of {TOTAL_STEPS}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/host/slots/add"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-park-teal text-white text-xs font-semibold"
          >
            <Plus size={12} /> Add Slot
          </Link>
          <div className="w-8 h-8 rounded-full bg-park-teal flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
        </div>
      </div>

      {/* Step 1: Photos */}
      {step === 1 && (
        <div className="flex-1">
          <h2 className="text-xl font-extrabold text-park-navy mb-1">Show drivers your space</h2>
          <p className="text-sm text-gray-400 mb-6">Upload clear photos of your parking slot.</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-park-teal/40 rounded-2xl p-10 flex flex-col items-center gap-3 hover:border-park-teal hover:bg-park-teal-light/30 transition-colors mb-4"
          >
            {photoPreviews.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 w-full">
                {photoPreviews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Preview ${i + 1}`}
                    className="rounded-xl object-cover aspect-square w-full"
                  />
                ))}
              </div>
            ) : (
              <>
                <Upload size={36} className="text-park-teal" />
                <span className="font-semibold text-park-navy">Show drivers your space</span>
                <span className="text-xs text-gray-400">Upload clear photos of your parking slot.</span>
              </>
            )}
          </button>

          {photos.length > 0 && (
            <p className="text-xs text-park-teal mb-4 flex items-center gap-1">
              <Check size={12} /> {photos.length} photo{photos.length > 1 ? "s" : ""} selected
            </p>
          )}

          <button
            onClick={() => setStep(2)}
            className="w-full py-3 rounded-full bg-park-teal text-white font-semibold flex items-center justify-center gap-1 hover:bg-park-teal-dark transition-colors"
          >
            Continue <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Step 2: Location */}
      {step === 2 && (
        <div className="flex-1">
          <h2 className="text-xl font-extrabold text-park-navy mb-1">Parking Slot Location</h2>
          <p className="text-sm text-gray-400 mb-6">Tell drivers where your slot is.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-park-navy mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Slot 1"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-park-teal transition-colors bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-park-navy mb-1">Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="C. M. Recto St, Poblacion District"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-park-teal transition-colors bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-park-navy mb-1">Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Clean and spacious slot near the main road."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-park-teal transition-colors bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-park-navy mb-1">City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Davao"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-park-teal transition-colors bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-park-navy mb-2">
                Vehicle Compatibility
              </label>
              <div className="flex flex-wrap gap-2">
                {VEHICLE_TYPES.map((v) => (
                  <button
                    key={v}
                    onClick={() => toggleVehicle(v)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      vehicleTypes.includes(v)
                        ? "bg-park-teal text-white border-park-teal"
                        : "bg-white text-gray-600 border-gray-200 hover:border-park-teal"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep(3)}
            className="w-full py-3 rounded-full bg-park-teal text-white font-semibold flex items-center justify-center gap-1 hover:bg-park-teal-dark transition-colors mt-6"
          >
            Continue <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Step 3: Pricing */}
      {step === 3 && (
        <div className="flex-1">
          <h2 className="text-xl font-extrabold text-park-navy mb-1">Set Pricing</h2>
          <p className="text-sm text-gray-400 mb-6">Set your hourly rate and amenities.</p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-park-navy mb-1">Hourly Rate</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="Php 35"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-park-teal transition-colors bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-park-navy mb-2">Amenities</label>
              <div className="grid grid-cols-2 gap-2">
                {AMENITIES.map((a) => (
                  <label key={a} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={amenities.includes(a)}
                      onChange={() => toggleAmenity(a)}
                      className="rounded accent-park-teal"
                    />
                    <span className="text-sm text-gray-700">{a}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep(4)}
            className="w-full py-3 rounded-full bg-park-teal text-white font-semibold flex items-center justify-center gap-1 hover:bg-park-teal-dark transition-colors mt-6"
          >
            Continue <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Step 4: Availability */}
      {step === 4 && (
        <div className="flex-1">
          <h2 className="text-xl font-extrabold text-park-navy mb-1">Set Availability</h2>
          <p className="text-sm text-gray-400 mb-6">Set your operating hours.</p>

          {/* Open 24/7 Toggle */}
          <div className="flex items-center justify-between mb-5 p-3 bg-white rounded-xl border border-gray-200">
            <div>
              <p className="font-semibold text-park-navy text-sm">Open 24/7</p>
              <p className="text-xs text-gray-400">Operating all day</p>
            </div>
            <button
              onClick={() => setOpen24_7((v) => !v)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                open24_7 ? "bg-park-teal" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  open24_7 ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {!open24_7 && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-park-navy">Operating Hours</p>
              {DAYS.map((day, i) => {
                const key = DAY_KEYS[i];
                const config = days[key];
                return (
                  <div
                    key={day}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100"
                  >
                    <button
                      onClick={() => toggleDay(key)}
                      className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${
                        config.open ? "bg-park-teal" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                          config.open ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                    <span className="w-24 text-sm font-semibold text-park-navy">{day}</span>
                    {config.open ? (
                      <div className="flex items-center gap-2 text-sm text-gray-600 flex-1">
                        <select
                          value={config.from}
                          onChange={(e) => updateDayTime(key, "from", e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-park-teal"
                        >
                          {Array.from({ length: 24 }, (_, h) => {
                            const t = `${String(h).padStart(2, "0")}:00`;
                            return (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            );
                          })}
                        </select>
                        <span>to</span>
                        <select
                          value={config.to}
                          onChange={(e) => updateDayTime(key, "to", e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-park-teal"
                        >
                          {Array.from({ length: 24 }, (_, h) => {
                            const t = `${String(h).padStart(2, "0")}:00`;
                            return (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 flex-1">Closed</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={() => setStep(5)}
            className="w-full py-3 rounded-full bg-park-teal text-white font-semibold flex items-center justify-center gap-1 hover:bg-park-teal-dark transition-colors mt-6"
          >
            <Check size={16} /> Publish
          </button>
        </div>
      )}

      {/* Step 5: Review Listing */}
      {step === 5 && (
        <div className="flex-1">
          <h2 className="text-xl font-extrabold text-park-navy mb-1">Review Listing</h2>
          <p className="text-sm text-gray-400 mb-6">Check everything before publishing.</p>

          {/* Preview Card */}
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 mb-5 shadow-sm">
            {/* Photo preview */}
            <div className="aspect-[16/9] bg-gradient-to-br from-park-teal-light to-park-teal/20 flex items-center justify-center">
              {photoPreviews.length > 0 ? (
                <img
                  src={photoPreviews[0]}
                  alt="Slot preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera size={40} className="text-park-teal/40" />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-park-navy">{name || "Slot Name"}</h3>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                <MapPin size={11} />
                <span>{address || "Address"}</span>
              </div>
              {amenities.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {amenities.map((a) => (
                    <span
                      key={a}
                      className="text-xs px-2 py-0.5 rounded-full bg-park-teal-light text-park-teal"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-2 mb-6">
            {[
              {
                label: "Photos uploaded",
                value: photos.length > 0 ? `${photos.length} Photo${photos.length > 1 ? "s" : ""}` : "None",
                done: photos.length > 0,
              },
              {
                label: "Location set",
                value: address || "—",
                done: !!address,
              },
              {
                label: "Pricing set",
                value: hourlyRate ? `Php ${hourlyRate}/hr` : "—",
                done: !!hourlyRate,
              },
              {
                label: "Availability",
                value: open24_7 ? "Open 24/7" : "Custom hours",
                done: true,
              },
            ].map(({ label, value, done }) => (
              <div
                key={label}
                className="flex items-center justify-between py-2 border-b border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      done ? "bg-park-teal" : "bg-gray-200"
                    }`}
                  >
                    <Check size={11} className="text-white" />
                  </div>
                  <span className="text-sm text-gray-600">{label}</span>
                </div>
                <span className="text-sm font-semibold text-park-navy">{value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handlePublish}
            className="w-full py-3 rounded-full bg-park-teal text-white font-semibold flex items-center justify-center gap-1 hover:bg-park-teal-dark transition-colors"
          >
            <Check size={16} /> Publish
          </button>
        </div>
      )}
    </div>
  );
}
