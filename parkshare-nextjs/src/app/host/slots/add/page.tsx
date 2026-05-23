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

  const [hourlyRate, setHourlyRate] = useState("");

  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [open247, setOpen247] = useState(false);

  const [timeSettings, setTimeSettings] = useState(
    DAYS.map((day) => ({
      day,
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

  function updateTime(index: number, field: string, value: string) {
    setTimeSettings((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  function handleAmountChange(value: string) {
    const numbersOnly = value.replace(/\D/g, "");
    setHourlyRate(numbersOnly);
  }

  async function handlePublish() {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

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

      const { error } = await supabase.from("parking_slots").insert([
        {
          host_id: user?.id,
          title: name,
          address: city ? `${address}, ${city}` : address,
          price_per_hour: parseFloat(hourlyRate) || 0,
          description,
          status: "active",
          image_url: uploadedUrl || null,
        },
      ]);

      if (error) throw error;

      alert("Your parking slot has been published successfully!");
      router.push("/host/slots");
    } catch (error: any) {
      console.error("Full System Error Object:", error);
      const errorText =
        error?.message || error?.error_description || JSON.stringify(error);
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
        <div className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-sm">
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
                className="flex h-[320px] w-full items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-[#45c4d9] hover:bg-cyan-50"
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
                Set your hourly rate and amenities.
              </p>

              <input
                inputMode="numeric"
                value={hourlyRate}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="35"
                className="h-14 w-full rounded-2xl border border-gray-200 px-5 text-lg outline-none focus:border-cyan-400"
              />

              <p className="mb-4 mt-8 font-bold text-[#202b7b]">
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
                Configure your operating hours.
              </p>

              {/* TOGGLE */}
              <div className="mb-6 flex items-center justify-between rounded-2xl bg-[#f7fafc] p-5">
                <div>
                  <p className="font-bold text-[#202b7b]">
                    Open 24/7
                  </p>

                  <p className="text-sm text-gray-400">
                    Always available
                  </p>
                </div>

                <button
                  onClick={() => setOpen247(!open247)}
                  className={`relative flex h-8 w-16 items-center overflow-hidden rounded-full transition-all ${
                    open247 ? "bg-[#45c4d9]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-transform duration-300 ${
                      open247 ? "translate-x-8" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {!open247 && (
                <div className="space-y-4">
                  {timeSettings.map((item, index) => (
                    <div
                      key={item.day}
                      className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl bg-[#f7fafc] px-5 py-4"
                    >
                      <p className="font-bold text-[#202b7b]">
                        {item.day}
                      </p>

                      <div className="flex items-center gap-2">
                        <select
                          value={item.from}
                          onChange={(e) =>
                            updateTime(index, "from", e.target.value)
                          }
                          className="h-11 rounded-xl border border-gray-200 px-3"
                        >
                          {HOURS.map((h) => (
                            <option key={h}>{h}</option>
                          ))}
                        </select>

                        <select
                          value={item.fromPeriod}
                          onChange={(e) =>
                            updateTime(index, "fromPeriod", e.target.value)
                          }
                          className="h-11 rounded-xl border border-gray-200 px-3"
                        >
                          <option>AM</option>
                          <option>PM</option>
                        </select>

                        <span className="text-gray-400">to</span>

                        <select
                          value={item.to}
                          onChange={(e) =>
                            updateTime(index, "to", e.target.value)
                          }
                          className="h-11 rounded-xl border border-gray-200 px-3"
                        >
                          {HOURS.map((h) => (
                            <option key={h}>{h}</option>
                          ))}
                        </select>

                        <select
                          value={item.toPeriod}
                          onChange={(e) =>
                            updateTime(index, "toPeriod", e.target.value)
                          }
                          className="h-11 rounded-xl border border-gray-200 px-3"
                        >
                          <option>AM</option>
                          <option>PM</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}

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
                <div className="flex h-[260px] items-center justify-center bg-[#dff7fa]">
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

                  <div className="mt-6 text-3xl font-black text-[#45c4d9]">
                    ₱{hourlyRate || "0"}/hr
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