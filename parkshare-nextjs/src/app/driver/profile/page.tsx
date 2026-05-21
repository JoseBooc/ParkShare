"use client";

import { useState } from "react";
import Image from "next/image";
import { FileText, Upload, Plus, Car, X } from "lucide-react";

export default function DriverProfilePage() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [name, setName] = useState("Hirai Momo");
  const [licenseImage, setLicenseImage] = useState<string | null>(null);

  const [vehicles, setVehicles] = useState([
    { id: 1, name: "Mazda MX-5 Miata", details: "Red - ABC 123" },
    { id: 2, name: "BYD Sealion 7", details: "White - ABC 123" },
  ]);

  function showSaved() {
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 2500);
  }

  function handleSaveProfile() {
    setShowEditModal(false);
    showSaved();
  }

  function handleLicenseUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      setLicenseImage(URL.createObjectURL(file));
      showSaved();
    }
  }

  function handleAddVehicle() {
    setVehicles([
      ...vehicles,
      {
        id: vehicles.length + 1,
        name: "New Vehicle",
        details: "Color - Plate Number",
      },
    ]);

    showSaved();
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      {showSavedMessage && (
        <div className="fixed right-4 top-4 z-50 rounded-2xl bg-[#1F2B8F] px-4 py-3 text-sm font-semibold text-white shadow-xl md:right-6 md:top-6 md:px-6 md:py-4 md:text-base">
          Changes saved successfully!
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-10 md:py-12">
        {/* Profile Header */}
        <div className="mb-8 flex flex-col items-center gap-5 text-center md:mb-14 md:flex-row md:gap-16 md:text-left">
          <div className="rounded-full bg-white p-2 shadow-lg md:p-3">
            <Image
              src="/images/momo.jpg"
              alt="Profile"
              width={160}
              height={160}
              className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-xl md:h-40 md:w-40"
              priority
            />
          </div>

          <div>
            <h1 className="text-4xl font-extrabold leading-none text-[#1F2B8F] md:text-7xl">
              {name}
            </h1>

            <p className="mt-3 text-2xl text-gray-500 md:text-5xl">
              Member since 2025
            </p>

            <button
              onClick={() => setShowEditModal(true)}
              className="mt-5 rounded-full bg-[#5BC0D6] px-8 py-3 text-lg font-bold text-white transition hover:bg-[#49b0c7] md:mt-8 md:px-14 md:py-5 md:text-3xl"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 rounded-3xl bg-[#EAF7FA] p-6 shadow-sm md:mb-14 md:grid-cols-3 md:gap-6 md:rounded-[40px] md:p-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#43C0D4] md:text-5xl">
              67
            </h2>
            <p className="mt-2 text-lg text-[#1F2B8F] md:text-3xl">
              Total Bookings
            </p>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#43C0D4] md:text-5xl">
              2
            </h2>
            <p className="mt-2 text-lg text-[#1F2B8F] md:text-3xl">
              Saved Parking Spaces
            </p>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#43C0D4] md:text-5xl">
              3
            </h2>
            <p className="mt-2 text-lg text-[#1F2B8F] md:text-3xl">
              Average Rating
            </p>
          </div>
        </div>

        {/* Driver License */}
        <section className="mb-8 rounded-3xl bg-[#EAF7FA] p-5 shadow-sm md:mb-14 md:rounded-[40px] md:p-10">
          <div className="mb-6 flex flex-col gap-4 md:mb-10 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <FileText size={28} className="text-[#5BC0D6] md:size-10" />

              <h2 className="text-3xl font-bold text-[#1F2B8F] md:text-5xl">
                Driver’s License
              </h2>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-lg font-semibold text-[#5BC0D6] hover:opacity-80 md:gap-3 md:text-3xl">
              <Upload size={24} className="md:size-8" />
              Upload

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLicenseUpload}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-10">
            <div className="flex h-48 items-center justify-center overflow-hidden rounded-3xl bg-white md:h-[320px]">
              {licenseImage ? (
                <Image
                  src={licenseImage}
                  alt="License"
                  width={500}
                  height={320}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-base text-gray-400 md:text-2xl">
                  Front License Image
                </span>
              )}
            </div>

            <div className="flex h-48 items-center justify-center rounded-3xl bg-white md:h-[320px]">
              <span className="text-base text-gray-400 md:text-2xl">
                Back License Image
              </span>
            </div>
          </div>
        </section>

        {/* Saved Vehicles */}
        <section className="rounded-3xl bg-[#EAF7FA] p-5 shadow-sm md:rounded-[40px] md:p-10">
          <div className="mb-6 flex flex-col gap-3 md:mb-10 md:flex-row md:items-center md:justify-between">
            <h2 className="text-3xl font-bold text-[#1F2B8F] md:text-6xl">
              Saved Vehicles
            </h2>

            <button
              onClick={handleAddVehicle}
              className="flex items-center gap-2 text-lg font-semibold text-[#5BC0D6] hover:opacity-80 md:gap-3 md:text-3xl"
            >
              <Plus size={24} className="md:size-9" />
              Add Vehicle
            </button>
          </div>

          <div className="space-y-4 md:space-y-8">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex flex-col gap-4 rounded-3xl bg-white px-5 py-5 md:flex-row md:items-center md:justify-between md:rounded-[35px] md:px-10 md:py-8"
              >
                <div className="flex items-center gap-4 md:gap-10">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#EAF7FA] md:h-28 md:w-28">
                    <Car size={28} className="text-[#5BC0D6] md:size-12" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-[#1F2B8F] md:text-5xl">
                      {vehicle.name}
                    </h3>

                    <p className="mt-1 text-base text-gray-500 md:mt-2 md:text-3xl">
                      {vehicle.details}
                    </p>
                  </div>
                </div>

                <button className="self-end text-lg text-gray-500 hover:text-[#1F2B8F] md:self-auto md:text-3xl">
                  Edit
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 md:max-w-2xl md:rounded-[40px] md:p-12">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 md:right-8 md:top-8"
            >
              <X size={28} className="md:size-10" />
            </button>

            <h2 className="mb-6 text-3xl font-bold text-[#1F2B8F] md:mb-10 md:text-6xl">
              Edit Profile
            </h2>

            <div>
              <label className="mb-2 block text-lg font-semibold text-gray-700 md:mb-4 md:text-3xl">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-lg outline-none focus:border-[#43C0D4] md:rounded-3xl md:px-8 md:py-6 md:text-3xl"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              className="mt-6 w-full rounded-full bg-[#1F2B8F] py-4 text-xl font-bold text-white transition hover:bg-[#16206d] md:py-6 md:text-4xl"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}