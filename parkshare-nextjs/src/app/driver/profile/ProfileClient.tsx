"use client";

import { useState } from "react";
import { FileText, Upload, Plus, Car, X } from "lucide-react";
import Image from "next/image";
import { saveProfile, addVehicle, updateVehicle, uploadLicense } from "./actions";

type Profile = {
  id: string;
  full_name: string | null;
  role: string | null;
  updated_at?: string | null;
};

type Vehicle = {
  id: string;
  user_id: string;
  make_model: string;
  color_plate: string;
};

type License = {
  user_id: string;
  front_url: string | null;
  back_url: string | null;
};

type Props = {
  initialProfile: Profile | null;
  bookingsCount: number;
  initialVehicles: Vehicle[];
  initialLicense: License | null;
};

export default function ProfileClient({
  initialProfile,
  bookingsCount,
  initialVehicles,
  initialLicense,
}: Props) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [license, setLicense] = useState<License | null>(initialLicense);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [name, setName] = useState(initialProfile?.full_name || "");

  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMakeModel, setNewMakeModel] = useState("");
  const [newColorPlate, setNewColorPlate] = useState("");
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);

  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isSavingVehicle, setIsSavingVehicle] = useState(false);

  const memberSince = new Date().getFullYear();

  function showSaved() {
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 2500);
  }

  async function handleSaveProfile() {
    const result = await saveProfile(name);
    if (!result.error) {
      setProfile((prev) =>
        prev ? { ...prev, full_name: name } : { id: "", full_name: name, role: "driver" }
      );
    }
    setShowEditModal(false);
    showSaved();
  }

  async function handleLicenseUpload(e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") {
    const file = e.target.files?.[0];
    if (!file) return;

    const setUploading = side === "front" ? setUploadingFront : setUploadingBack;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadLicense(formData, side);

      if (result.url) {
        setLicense((prev) => ({
          user_id: prev?.user_id ?? "",
          front_url: prev?.front_url ?? null,
          back_url: prev?.back_url ?? null,
          [side === "front" ? "front_url" : "back_url"]: result.url,
        }));
        showSaved();
      } else {
        alert("Failed to upload license. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleAddVehicle(e: React.FormEvent) {
    e.preventDefault();
    setIsAddingVehicle(true);

    const result = await addVehicle(newMakeModel, newColorPlate);
    if (!result.error && result.data) {
      setVehicles((prev) => [...prev, result.data as Vehicle]);
      setNewMakeModel("");
      setNewColorPlate("");
      setShowAddModal(false);
      showSaved();
    } else {
      alert("Failed to add vehicle. Please try again.");
    }

    setIsAddingVehicle(false);
  }

  async function handleSaveVehicle(e: React.FormEvent) {
    e.preventDefault();
    if (!editingVehicle) return;
    setIsSavingVehicle(true);

    const result = await updateVehicle(editingVehicle.id, editingVehicle.make_model, editingVehicle.color_plate);
    if (!result.error) {
      setVehicles((prev) => prev.map((v) => (v.id === editingVehicle.id ? editingVehicle : v)));
      setEditingVehicle(null);
      showSaved();
    } else {
      alert("Failed to save changes. Please try again.");
    }

    setIsSavingVehicle(false);
  }

  const initials = (profile?.full_name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      {showSavedMessage && (
        <div className="fixed right-4 top-4 z-50 rounded-xl bg-[#1F2B8F] px-4 py-2 text-sm font-semibold text-white shadow-lg">
          Changes saved successfully!
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* PROFILE HEADER */}
        <div className="mb-10 flex flex-col items-center gap-6 md:flex-row">
          <div className="rounded-full bg-white p-2 shadow-md">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-park-teal text-3xl font-black text-white">
              {initials}
            </div>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-[#1F2B8F]">
              {profile?.full_name || "User Account"}
            </h1>
            <p className="mt-1 text-lg text-gray-500">Member since {memberSince}</p>
            <button
              onClick={() => setShowEditModal(true)}
              className="mt-4 rounded-full bg-[#5BC0D6] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#49b0c7]"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-[#EAF7FA] p-6 text-center shadow-sm">
            <h2 className="text-4xl font-bold text-[#43C0D4]">{bookingsCount}</h2>
            <p className="mt-2 text-lg text-[#1F2B8F]">Total Bookings</p>
          </div>
          <div className="rounded-3xl bg-[#EAF7FA] p-6 text-center shadow-sm">
            <h2 className="text-4xl font-bold text-[#43C0D4]">{vehicles.length}</h2>
            <p className="mt-2 text-lg text-[#1F2B8F]">Registered Vehicles</p>
          </div>
          <div className="rounded-3xl bg-[#EAF7FA] p-6 text-center shadow-sm">
            <h2 className="text-4xl font-bold text-[#43C0D4]">—</h2>
            <p className="mt-2 text-lg text-[#1F2B8F]">Average Rating</p>
          </div>
        </div>

        {/* DRIVER'S LICENSE */}
        <section className="mb-10 rounded-3xl bg-[#EAF7FA] p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <FileText size={26} className="text-[#5BC0D6]" />
            <h2 className="text-2xl font-bold text-[#1F2B8F]">Driver's License</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="relative flex h-56 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-white transition hover:ring-2 hover:ring-[#43C0D4]">
              {uploadingFront ? (
                <p className="text-sm font-semibold text-gray-400">Uploading…</p>
              ) : license?.front_url ? (
                <img src={license.front_url} alt="Front License" className="h-full w-full object-cover" />
              ) : (
                <div className="text-center text-gray-400">
                  <Upload className="mx-auto mb-2 text-[#5BC0D6]" size={24} />
                  <p className="text-sm">Front License Image</p>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLicenseUpload(e, "front")} />
            </label>

            <label className="relative flex h-56 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-white transition hover:ring-2 hover:ring-[#43C0D4]">
              {uploadingBack ? (
                <p className="text-sm font-semibold text-gray-400">Uploading…</p>
              ) : license?.back_url ? (
                <img src={license.back_url} alt="Back License" className="h-full w-full object-cover" />
              ) : (
                <div className="text-center text-gray-400">
                  <Upload className="mx-auto mb-2 text-[#5BC0D6]" size={24} />
                  <p className="text-sm">Back License Image</p>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLicenseUpload(e, "back")} />
            </label>
          </div>
        </section>

        {/* VEHICLES */}
        <section className="rounded-3xl bg-[#EAF7FA] p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#1F2B8F]">Registered Vehicles</h2>
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 text-sm font-semibold text-[#5BC0D6] hover:opacity-80">
              <Plus size={20} />
              Add Vehicle
            </button>
          </div>
          <div className="space-y-4">
            {vehicles.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-400">No vehicles added yet.</p>
            ) : (
              vehicles.map((car) => (
                <div key={car.id} className="flex flex-col gap-4 rounded-2xl bg-white px-5 py-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF7FA]">
                      <Car size={24} className="text-[#5BC0D6]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#1F2B8F]">{car.make_model}</h3>
                      <p className="text-sm text-gray-500">{car.color_plate}</p>
                    </div>
                  </div>
                  <button onClick={() => setEditingVehicle(car)} className="text-sm font-medium text-gray-500 hover:text-[#1F2B8F]">
                    Edit
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* ADD VEHICLE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6">
            <button onClick={() => setShowAddModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h2 className="mb-6 text-2xl font-bold text-[#1F2B8F]">Add Vehicle</h2>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Make / Model</label>
                <input type="text" value={newMakeModel} onChange={(e) => setNewMakeModel(e.target.value)} placeholder="e.g. Toyota Vios" required className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#43C0D4]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Color / Plate Number</label>
                <input type="text" value={newColorPlate} onChange={(e) => setNewColorPlate(e.target.value)} placeholder="e.g. White - ABC 123" required className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#43C0D4]" />
              </div>
              <button type="submit" disabled={isAddingVehicle} className="w-full rounded-full bg-[#5BC0D6] py-3 text-lg font-semibold text-white transition hover:bg-[#49b0c7] disabled:opacity-60">
                {isAddingVehicle ? "Adding…" : "Add Vehicle"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT VEHICLE MODAL */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6">
            <button onClick={() => setEditingVehicle(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h2 className="mb-6 text-2xl font-bold text-[#1F2B8F]">Edit Vehicle</h2>
            <form onSubmit={handleSaveVehicle} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Make / Model</label>
                <input type="text" value={editingVehicle.make_model} onChange={(e) => setEditingVehicle({ ...editingVehicle, make_model: e.target.value })} required className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#43C0D4]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Color / Plate Number</label>
                <input type="text" value={editingVehicle.color_plate} onChange={(e) => setEditingVehicle({ ...editingVehicle, color_plate: e.target.value })} required className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#43C0D4]" />
              </div>
              <button type="submit" disabled={isSavingVehicle} className="w-full rounded-full bg-[#1F2B8F] py-3 text-lg font-semibold text-white transition hover:bg-[#16206d] disabled:opacity-60">
                {isSavingVehicle ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6">
            <button onClick={() => setShowEditModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h2 className="mb-6 text-2xl font-bold text-[#1F2B8F]">Edit Profile</h2>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#43C0D4]" />
            <button onClick={handleSaveProfile} className="mt-6 w-full rounded-full bg-[#1F2B8F] py-3 text-lg font-semibold text-white transition hover:bg-[#16206d]">
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
