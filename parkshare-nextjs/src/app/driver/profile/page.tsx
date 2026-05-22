"use client";

import { useState } from "react";
import Image from "next/image";
import { FileText, Upload, Plus, Car, X } from "lucide-react";

type Vehicle = {
  id: number;
  name: string;
  details: string;
};

export default function DriverProfilePage() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [name, setName] = useState("Hirai Momo");

  const [frontLicenseImage, setFrontLicenseImage] = useState<string | null>(null);
  const [backLicenseImage, setBackLicenseImage] = useState<string | null>(null);

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 1, name: "Mazda MX-5 Miata", details: "Red - ABC 123" },
    { id: 2, name: "BYD Sealion 7", details: "White - ABC 123" },
  ]);

  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  function showSaved() {
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 2500);
  }

  function handleSaveProfile() {
    setShowEditModal(false);
    showSaved();
  }

  function handleLicenseUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    side: "front" | "back"
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    if (side === "front") {
      setFrontLicenseImage(imageUrl);
    } else {
      setBackLicenseImage(imageUrl);
    }

    showSaved();
  }

  function handleAddVehicle() {
    const newVehicle = {
      id: Date.now(),
      name: "New Vehicle",
      details: "Color - Plate Number",
    };

    setVehicles((current) => [...current, newVehicle]);
    setEditingVehicle(newVehicle);
  }

  function handleSaveVehicle() {
    if (!editingVehicle) return;

    setVehicles((current) =>
      current.map((vehicle) =>
        vehicle.id === editingVehicle.id ? editingVehicle : vehicle
      )
    );

    setEditingVehicle(null);
    showSaved();
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      {showSavedMessage && (
        <div className="fixed right-4 top-4 z-50 rounded-xl bg-[#1F2B8F] px-4 py-2 text-sm font-semibold text-white shadow-lg">
          Changes saved successfully!
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-10 flex flex-col items-center gap-6 md:flex-row">
          <div className="rounded-full bg-white p-2 shadow-md">
            <Image
              src="/images/momo.jpg"
              alt="Profile"
              width={120}
              height={120}
              className="h-28 w-28 rounded-full object-cover"
              priority
            />
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-[#1F2B8F]">{name}</h1>
            <p className="mt-1 text-lg text-gray-500">Member since 2025</p>

            <button
              onClick={() => setShowEditModal(true)}
              className="mt-4 rounded-full bg-[#5BC0D6] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#49b0c7]"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-[#EAF7FA] p-6 text-center shadow-sm">
            <h2 className="text-4xl font-bold text-[#43C0D4]">67</h2>
            <p className="mt-2 text-lg text-[#1F2B8F]">Total Bookings</p>
          </div>

          <div className="rounded-3xl bg-[#EAF7FA] p-6 text-center shadow-sm">
            <h2 className="text-4xl font-bold text-[#43C0D4]">2</h2>
            <p className="mt-2 text-lg text-[#1F2B8F]">
              Saved Parking Spaces
            </p>
          </div>

          <div className="rounded-3xl bg-[#EAF7FA] p-6 text-center shadow-sm">
            <h2 className="text-4xl font-bold text-[#43C0D4]">3</h2>
            <p className="mt-2 text-lg text-[#1F2B8F]">Average Rating</p>
          </div>
        </div>

        <section className="mb-10 rounded-3xl bg-[#EAF7FA] p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={26} className="text-[#5BC0D6]" />
              <h2 className="text-2xl font-bold text-[#1F2B8F]">
                Driver’s License
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="flex h-56 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-white transition hover:ring-2 hover:ring-[#43C0D4]">
              {frontLicenseImage ? (
                <Image
                  src={frontLicenseImage}
                  alt="Front License"
                  width={500}
                  height={320}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <Upload className="mx-auto mb-2 text-[#5BC0D6]" size={24} />
                  Front License Image
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleLicenseUpload(e, "front")}
              />
            </label>

            <label className="flex h-56 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-white transition hover:ring-2 hover:ring-[#43C0D4]">
              {backLicenseImage ? (
                <Image
                  src={backLicenseImage}
                  alt="Back License"
                  width={500}
                  height={320}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <Upload className="mx-auto mb-2 text-[#5BC0D6]" size={24} />
                  Back License Image
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleLicenseUpload(e, "back")}
              />
            </label>
          </div>
        </section>

        <section className="rounded-3xl bg-[#EAF7FA] p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#1F2B8F]">
              Saved Vehicles
            </h2>

            <button
              onClick={handleAddVehicle}
              className="flex items-center gap-2 text-sm font-semibold text-[#5BC0D6] hover:opacity-80"
            >
              <Plus size={20} />
              Add Vehicle
            </button>
          </div>

          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex flex-col gap-4 rounded-2xl bg-white px-5 py-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF7FA]">
                    <Car size={24} className="text-[#5BC0D6]" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#1F2B8F]">
                      {vehicle.name}
                    </h3>
                    <p className="text-sm text-gray-500">{vehicle.details}</p>
                  </div>
                </div>

                <button
                  onClick={() => setEditingVehicle(vehicle)}
                  className="text-sm font-medium text-gray-500 hover:text-[#1F2B8F]"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <h2 className="mb-6 text-2xl font-bold text-[#1F2B8F]">
              Edit Profile
            </h2>

            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#43C0D4]"
            />

            <button
              onClick={handleSaveProfile}
              className="mt-6 w-full rounded-full bg-[#1F2B8F] py-3 text-lg font-semibold text-white transition hover:bg-[#16206d]"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {editingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6">
            <button
              onClick={() => setEditingVehicle(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <h2 className="mb-6 text-2xl font-bold text-[#1F2B8F]">
              Edit Vehicle
            </h2>

            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Vehicle Name
            </label>

            <input
              type="text"
              value={editingVehicle.name}
              onChange={(e) =>
                setEditingVehicle({
                  ...editingVehicle,
                  name: e.target.value,
                })
              }
              className="mb-4 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#43C0D4]"
            />

            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Details
            </label>

            <input
              type="text"
              value={editingVehicle.details}
              onChange={(e) =>
                setEditingVehicle({
                  ...editingVehicle,
                  details: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#43C0D4]"
            />

            <button
              onClick={handleSaveVehicle}
              className="mt-6 w-full rounded-full bg-[#1F2B8F] py-3 text-lg font-semibold text-white transition hover:bg-[#16206d]"
            >
              Save Vehicle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}