"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Check,
  MapPin,
  Camera,
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";

type Step = 1 | 2 | 3 | 4 | 5;

const VEHICLE_TYPES = [
  "Sedan",
  "SUV",
  "Pickup Truck",
  "Motorcycle",
  "Van",
  "PUV",
];

const AMENITIES = [
  "CCTV",
  "Sheltered",
  "24/7 Access",
  "EV Charging",
  "Security Guard",
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const HOURS = [
  "1:00",
  "2:00",
  "3:00",
  "4:00",
  "5:00",
  "6:00",
  "7:00",
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
];

export default function AddSlotPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");

  const [firstHourRate, setFirstHourRate] = useState("");
  const [succeedingRate, setSucceedingRate] = useState("");

  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [timeSettings, setTimeSettings] = useState(
    DAYS.map((day, i) => ({
      day,
      isOpen: i < 6, // Mon–Sat open by default, Sunday closed
      is247: false,
      from: "8:00",
      fromPeriod: "AM",
      to: "11:00",
      toPeriod: "PM",
    }))
  );

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function toggleVehicle(vehicle: string) {
    setSelectedVehicles((prev) =>
      prev.includes(vehicle)
        ? prev.filter((v) => v !== vehicle)
        : [...prev, vehicle]
    );
  }

  function toggleAmenity(amenity: string) {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  }

  function toggleDayOpen(index: number) {
    setTimeSettings((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, isOpen: !item.isOpen, is247: false } : item
      )
    );
  }

  function toggleDay247(index: number) {
    setTimeSettings((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, is247: !item.is247 } : item
      )
    );
  }

  function updateTime(index: number, field: string, value: string) {
    setTimeSettings((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  async function handlePublish() {
    setIsLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Authentication session not found. Please log in again.");

      let uploadedUrl = "";

      if (imageFile && imageFile.name) {
        try {
          const fileExt = imageFile.name.split(".").pop();
          const uniqueId = Math.random().toString(36).substring(2, 11);
          const fileName = `${Date.now()}-${uniqueId}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("parking-images")
            .upload(fileName, imageFile);

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from("parking-images")
            .getPublicUrl(fileName);

          uploadedUrl = urlData.publicUrl;
        } catch (storageErr) {
          console.error("Storage upload failed:", storageErr);
        }
      }

      const insertPayload = {
        host_id: user.id,
        title: name,
        address: city ? `${address}, ${city}` : address,
        description,
        price_per_hour: parseFloat(firstHourRate) || 0,
        succeeding_rate: parseFloat(succeedingRate) || 0,
        status: "active",
        image_url: uploadedUrl || null,
        vehicle_types: Array.isArray(selectedVehicles) ? selectedVehicles : [],
        amenities: Array.isArray(selectedAmenities) ? selectedAmenities : [],
        availability: timeSettings,
        open_247: timeSettings.every((d) => !d.isOpen || d.is247),
      };

      const { error: insertError } = await supabase
        .from("parking_slots")
        .insert([insertPayload]);

      if (insertError) throw insertError;

      alert("Your parking slot has been published successfully!");
      router.push("/host/slots");
    } catch (error: any) {
      console.error("Full System Error Object:", error);
      const errorText =
        error?.message ||
        error?.details ||
        error?.error_description ||
        (typeof error === "object" ? JSON.stringify(error) : String(error));
      alert(`Failed to publish listing: ${errorText}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7fafc] px-6 py-8">
      <div className="mx-auto max-w-3xl">
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() =>
              step > 1 ? setStep((step - 1) as Step) : router.back()
            }
            className="flex items-center gap-2 text-lg font-semibold text-gray-500 hover:text-[#202b7b]"
          >
            <ChevronLeft size={22} />
            Back
          </button>

          <div className="text-right">
            <h1 className="text-4xl font-black text-[#202b7b]">
              List Your Parking Slot
            </h1>

            <p className="mt-1 text-lg font-semibold text-gray-400">
              Step {step} of 5
            </p>
          </div>
        </div>

        {/* CARD */}
        <div className="rounded-4xl border border-gray-100 bg-white p-8 shadow-sm">
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h2 className="text-3xl font-black text-[#202b7b]">
                Show Drivers Your Space
              </h2>

              <p className="mb-6 mt-2 text-lg text-gray-400">
                Upload clear photos of your parking slot.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhoto}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex h-80 w-full items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-[#45c4d9] hover:bg-cyan-50"
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <Upload
                      size={44}
                      className="mx-auto mb-3 text-[#45c4d9]"
                    />

                    <p className="text-xl font-bold text-[#202b7b]">
                      Upload Photo
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      JPG or PNG supported
                    </p>
                  </div>
                )}
              </button>

              <button
                onClick={() => setStep(2)}
                className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#45c4d9] font-bold text-white"
              >
                Continue
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <h2 className="text-3xl font-black text-[#202b7b]">
                Parking Slot Location
              </h2>

              <p className="mb-6 mt-2 text-lg text-gray-400">
                Tell drivers where your slot is.
              </p>

              <div className="space-y-5">
                <input
                  placeholder="Slot Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-gray-200 px-5 outline-none focus:border-cyan-400"
                />

                <input
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-gray-200 px-5 outline-none focus:border-cyan-400"
                />

                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-32 w-full resize-none rounded-2xl border border-gray-200 p-5 outline-none focus:border-cyan-400"
                />

                <input
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-gray-200 px-5 outline-none focus:border-cyan-400"
                />
              </div>

              <p className="mb-3 mt-6 font-bold text-[#202b7b]">
                Vehicle Compatibility
              </p>

              <div className="flex flex-wrap gap-3">
                {VEHICLE_TYPES.map((vehicle) => (
                  <button
                    key={vehicle}
                    onClick={() => toggleVehicle(vehicle)}
                    className={`h-11 rounded-full border px-4 ${
                      selectedVehicles.includes(vehicle)
                        ? "border-[#45c4d9] bg-[#45c4d9] text-white"
                        : "border-gray-200 bg-white text-gray-600"
                    }`}
                  >
                    {vehicle}
                  </button>
                ))}
              </div>

              <p className="mb-4 mt-6 font-bold text-[#202b7b]">
                Amenities
              </p>

              <div className="grid grid-cols-2 gap-4">
                {AMENITIES.map((amenity) => (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`h-12 rounded-2xl border text-sm font-semibold ${
                      selectedAmenities.includes(amenity)
                        ? "border-[#45c4d9] bg-[#45c4d9] text-white"
                        : "border-gray-200 bg-white text-gray-600"
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(3)}
                className="mt-8 h-14 w-full rounded-full bg-[#45c4d9] font-bold text-white"
              >
                Continue
              </button>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <h2 className="text-3xl font-black text-[#202b7b]">
                Set Pricing
              </h2>

              <p className="mb-6 mt-2 text-lg text-gray-400">
                Set your hourly rate.
              </p>

              {/* First hour rate */}
              <label className="mb-1.5 block text-sm font-bold text-[#202b7b]">
                First Hour Rate
              </label>
              <div className="relative mb-4">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">₱</span>
                <input
                  inputMode="numeric"
                  value={firstHourRate}
                  onChange={(e) => setFirstHourRate(e.target.value.replace(/\D/g, ""))}
                  placeholder="35"
                  className="h-14 w-full rounded-2xl border border-gray-200 pl-10 pr-5 text-lg outline-none focus:border-cyan-400"
                />
              </div>

              {/* Succeeding hour rate */}
              <label className="mb-1.5 block text-sm font-bold text-[#202b7b]">
                Succeeding Hour Rate
              </label>
              <div className="relative mb-5">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">₱</span>
                <input
                  inputMode="numeric"
                  value={succeedingRate}
                  onChange={(e) => setSucceedingRate(e.target.value.replace(/\D/g, ""))}
                  placeholder="25"
                  className="h-14 w-full rounded-2xl border border-gray-200 pl-10 pr-5 text-lg outline-none focus:border-cyan-400"
                />
              </div>

              {/* Live pricing preview */}
              {(firstHourRate || succeedingRate) && (
                <div className="mb-6 rounded-2xl border border-[#45c4d9]/30 bg-[#eefbfd] p-5">
                  <p className="mb-3 text-base font-black text-[#202b7b]">
                    ₱{firstHourRate || 0}{" "}
                    <span className="font-semibold text-gray-500">First hour</span>
                    {succeedingRate && (
                      <>
                        {" "}+{" "}₱{succeedingRate}
                        <span className="font-semibold text-gray-500">/Succeeding hour</span>
                      </>
                    )}
                  </p>

                  <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                    Example: 3 hr visit
                  </p>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>1st hour (base rate)</span>
                      <span>₱{firstHourRate || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2 succeeding hours × ₱{succeedingRate || 0}</span>
                      <span>₱{(parseInt(succeedingRate || "0") * 2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service fee (5%)</span>
                      <span>
                        ₱{Math.round((parseInt(firstHourRate || "0") + parseInt(succeedingRate || "0") * 2) * 0.05)}
                      </span>
                    </div>
                    <hr className="my-1 border-[#45c4d9]/20" />
                    <div className="flex justify-between font-black text-[#202b7b]">
                      <span>Total</span>
                      <span>
                        ₱{
                          parseInt(firstHourRate || "0") +
                          parseInt(succeedingRate || "0") * 2 +
                          Math.round((parseInt(firstHourRate || "0") + parseInt(succeedingRate || "0") * 2) * 0.05)
                        }
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setStep(4)}
                className="mt-8 h-14 w-full rounded-full bg-[#45c4d9] font-bold text-white"
              >
                Continue
              </button>
            </>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <>
              <h2 className="text-3xl font-black text-[#202b7b]">
                Set Availability
              </h2>

              <p className="mb-6 mt-2 text-lg text-gray-400">
                Configure your operating hours per day.
              </p>

              <div className="space-y-4">
                {timeSettings.map((item, index) => (
                  <div
                    key={item.day}
                    className="rounded-2xl bg-[#f7fafc] px-5 py-4"
                  >
                    {/* Day header row */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-[#202b7b]">{item.day}</p>

                      <div className="flex items-center gap-2">
                        {/* Open / Closed toggle */}
                        <button
                          type="button"
                          onClick={() => toggleDayOpen(index)}
                          className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                            item.isOpen
                              ? "bg-[#45c4d9] text-white"
                              : "bg-red-50 text-red-400"
                          }`}
                        >
                          {item.isOpen ? "Open" : "Closed"}
                        </button>

                        {/* 24/7 toggle — only when day is open */}
                        {item.isOpen && (
                          <button
                            type="button"
                            onClick={() => toggleDay247(index)}
                            className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                              item.is247
                                ? "bg-[#45c4d9] text-white"
                                : "border border-[#45c4d9] text-[#45c4d9]"
                            }`}
                          >
                            24/7
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Time pickers — only when open AND not 24/7 */}
                    {item.isOpen && !item.is247 && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <select
                          value={item.from}
                          onChange={(e) => updateTime(index, "from", e.target.value)}
                          className="h-10 rounded-xl border border-gray-200 px-3 text-sm"
                        >
                          {HOURS.map((h) => <option key={h}>{h}</option>)}
                        </select>
                        <select
                          value={item.fromPeriod}
                          onChange={(e) => updateTime(index, "fromPeriod", e.target.value)}
                          className="h-10 rounded-xl border border-gray-200 px-3 text-sm"
                        >
                          <option>AM</option>
                          <option>PM</option>
                        </select>
                        <span className="text-sm text-gray-400">to</span>
                        <select
                          value={item.to}
                          onChange={(e) => updateTime(index, "to", e.target.value)}
                          className="h-10 rounded-xl border border-gray-200 px-3 text-sm"
                        >
                          {HOURS.map((h) => <option key={h}>{h}</option>)}
                        </select>
                        <select
                          value={item.toPeriod}
                          onChange={(e) => updateTime(index, "toPeriod", e.target.value)}
                          className="h-10 rounded-xl border border-gray-200 px-3 text-sm"
                        >
                          <option>AM</option>
                          <option>PM</option>
                        </select>
                      </div>
                    )}

                    {/* 24/7 label when active */}
                    {item.isOpen && item.is247 && (
                      <p className="mt-2 text-sm font-semibold text-[#45c4d9]">
                        Open all day · 24 hours
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(5)}
                className="mt-8 h-14 w-full rounded-full bg-[#45c4d9] font-bold text-white"
              >
                Continue
              </button>
            </>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <>
              <h2 className="text-3xl font-black text-[#202b7b]">
                Review Listing
              </h2>

              <p className="mb-6 mt-2 text-lg text-gray-400">
                Check everything before publishing.
              </p>

              <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                <div className="flex h-65 items-center justify-center bg-[#dff7fa]">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Camera
                      size={42}
                      className="text-[#45c4d9]"
                    />
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-black text-[#202b7b]">
                    {name || "Slot Name"}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-gray-400">
                    <MapPin size={16} />
                    <span>{address || "Address"}</span>
                  </div>

                  <p className="mt-4 text-gray-500">
                    {description || "No description added."}
                  </p>

                  {/* Pricing preview — matches Step 3 style */}
                  <div className="mt-6 rounded-2xl border border-[#45c4d9]/30 bg-[#eefbfd] p-5">
                    <p className="mb-3 text-base font-black text-[#202b7b]">
                      ₱{firstHourRate || "0"}{" "}
                      <span className="font-semibold text-gray-500">First hour</span>
                      {succeedingRate && (
                        <>
                          {" "}+{" "}₱{succeedingRate}
                          <span className="font-semibold text-gray-500">/Succeeding hour</span>
                        </>
                      )}
                    </p>

                    <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                      Example: 3 hr visit
                    </p>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>1st hour (base rate)</span>
                        <span>₱{firstHourRate || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>2 succeeding hours × ₱{succeedingRate || 0}</span>
                        <span>₱{parseInt(succeedingRate || "0") * 2}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service fee (5%)</span>
                        <span>
                          ₱{Math.round((parseInt(firstHourRate || "0") + parseInt(succeedingRate || "0") * 2) * 0.05)}
                        </span>
                      </div>
                      <hr className="my-1 border-[#45c4d9]/20" />
                      <div className="flex justify-between font-black text-[#202b7b]">
                        <span>Total</span>
                        <span>
                          ₱{
                            parseInt(firstHourRate || "0") +
                            parseInt(succeedingRate || "0") * 2 +
                            Math.round((parseInt(firstHourRate || "0") + parseInt(succeedingRate || "0") * 2) * 0.05)
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePublish}
                disabled={isLoading}
                className="mt-8 h-14 w-full rounded-full bg-[#45c4d9] font-bold text-white disabled:opacity-60"
              >
                {isLoading ? (
                  "Publishing…"
                ) : (
                  <>
                    <Check size={16} className="mr-2 inline" />
                    Publish Listing
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}