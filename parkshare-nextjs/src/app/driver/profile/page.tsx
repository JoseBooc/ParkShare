"use client";

import { useState, useEffect } from "react";
import { FileText, Upload, Plus, Car, X } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

type Profile = {
  id: string;
  full_name: string | null;
  role: string | null;
  created_at: string | null;
  avatar_url?: string | null;
};

type Vehicle = {
  id: string;
  user_id: string;
  make_model: string;
  color_plate: string;
};

type License = {
  id?: string;
  user_id: string;
  front_url: string | null;
  back_url: string | null;
};

export default function DriverProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [license, setLicense] = useState<License | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [name, setName] = useState("");

  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMakeModel, setNewMakeModel] = useState("");
  const [newColorPlate, setNewColorPlate] = useState("");
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);

  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isSavingVehicle, setIsSavingVehicle] = useState(false);

  useEffect(() => {
    async function loadAll() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const [profileRes, bookingsRes, vehiclesRes, licenseRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase.from("vehicles").select("*").eq("user_id", user.id),
        supabase
          .from("driver_licenses")
          .select("*")
          .eq("user_id", user.id)
          .single(),
      ]);

      setProfile(profileRes.data);
      setName(profileRes.data?.full_name || "");
      setBookingsCount(bookingsRes.count ?? 0);
      setVehicles(vehiclesRes.data ?? []);
      setLicense(licenseRes.data);

      setLoading(false);
    }

    loadAll();
  }, []);

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).getFullYear()
    : new Date().getFullYear();

  function showSaved() {
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 2500);
  }

  async function handleSaveProfile() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("profiles")
        .update({ full_name: name })
        .eq("id", user.id);
      setProfile((prev) => (prev ? { ...prev, full_name: name } : prev));
    }

    setShowEditModal(false);
    showSaved();
  }

  async function handleLicenseUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    side: "front" | "back"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const setUploading = side === "front" ? setUploadingFront : setUploadingBack;
    setUploading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Upload to the 'licenses' storage bucket
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${side}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("licenses")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("licenses").getPublicUrl(filePath);

      // Upsert the URL into driver_licenses, keyed on user_id
      const columnToUpdate = side === "front" ? "front_url" : "back_url";

      const { error: dbError } = await supabase
        .from("driver_licenses")
        .upsert(
          { user_id: user.id, [columnToUpdate]: publicUrl },
          { onConflict: "user_id" }
        );

      if (dbError) throw dbError;

      // Update local license state so the preview reflects immediately
      setLicense((prev) => ({
        user_id: user.id,
        front_url: prev?.front_url ?? null,
        back_url: prev?.back_url ?? null,
        ...prev,
        [columnToUpdate]: publicUrl,
      }));

      showSaved();
    } catch (err) {
      console.error("License upload error:", err);
      alert("Failed to save license image. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleAddVehicle(e: React.FormEvent) {
    e.preventDefault();
    setIsAddingVehicle(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIsAddingVehicle(false);
      return;
    }

    const { data, error } = await supabase
      .from("vehicles")
      .insert([
        {
          user_id: user.id,
          make_model: newMakeModel,
          color_plate: newColorPlate,
        },
      ])
      .select()
      .single();

    if (!error && data) {
      setVehicles((prev) => [...prev, data as Vehicle]);
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

    const supabase = createClient();
    const { error } = await supabase
      .from("vehicles")
      .update({
        make_model: editingVehicle.make_model,
        color_plate: editingVehicle.color_plate,
      })
      .eq("id", editingVehicle.id);

    if (!error) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === editingVehicle.id ? editingVehicle : v))
      );
      setEditingVehicle(null);
      showSaved();
    } else {
      alert("Failed to save changes. Please try again.");
    }

    setIsSavingVehicle(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7FB]">
        <p className="text-sm font-semibold text-gray-400">Loading profile…</p>
      </div>
    );
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
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Profile"
                width={120}
                height={120}
                className="h-28 w-28 rounded-full object-cover"
                priority
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-park-teal text-3xl font-black text-white">
                {initials}
              </div>
            )}
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-[#1F2B8F]">
              {profile?.full_name || "User Account"}
            </h1>
            <p className="mt-1 text-lg text-gray-500">
              Member since {memberSince}
            </p>
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
            <h2 className="text-2xl font-bold text-[#1F2B8F]">
              Driver's License
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* FRONT */}
            <label className="relative flex h-56 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-white transition hover:ring-2 hover:ring-[#43C0D4]">
              {uploadingFront ? (
                <p className="text-sm font-semibold text-gray-400">
                  Uploading…
                </p>
              ) : license?.front_url ? (
                <img
                  src={license.front_url}
                  alt="Front License"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <Upload className="mx-auto mb-2 text-[#5BC0D6]" size={24} />
                  <p className="text-sm">Front License Image</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleLicenseUpload(e, "front")}
              />
            </label>

            {/* BACK */}
            <label className="relative flex h-56 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-white transition hover:ring-2 hover:ring-[#43C0D4]">
              {uploadingBack ? (
                <p className="text-sm font-semibold text-gray-400">
                  Uploading…
                </p>
              ) : license?.back_url ? (
                <img
                  src={license.back_url}
                  alt="Back License"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <Upload className="mx-auto mb-2 text-[#5BC0D6]" size={24} />
                  <p className="text-sm">Back License Image</p>
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

        {/* VEHICLES */}
        <section className="rounded-3xl bg-[#EAF7FA] p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#1F2B8F]">
              Registered Vehicles
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 text-sm font-semibold text-[#5BC0D6] hover:opacity-80"
            >
              <Plus size={20} />
              Add Vehicle
            </button>
          </div>

          <div className="space-y-4">
            {vehicles.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-400">
                No vehicles added yet.
              </p>
            ) : (
              vehicles.map((car) => (
                <div
                  key={car.id}
                  className="flex flex-col gap-4 rounded-2xl bg-white px-5 py-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF7FA]">
                      <Car size={24} className="text-[#5BC0D6]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#1F2B8F]">
                        {car.make_model}
                      </h3>
                      <p className="text-sm text-gray-500">{car.color_plate}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingVehicle(car)}
                    className="text-sm font-medium text-gray-500 hover:text-[#1F2B8F]"
                  >
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
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <h2 className="mb-6 text-2xl font-bold text-[#1F2B8F]">
              Add Vehicle
            </h2>

            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Make / Model
                </label>
                <input
                  type="text"
                  value={newMakeModel}
                  onChange={(e) => setNewMakeModel(e.target.value)}
                  placeholder="e.g. Toyota Vios"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#43C0D4]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Color / Plate Number
                </label>
                <input
                  type="text"
                  value={newColorPlate}
                  onChange={(e) => setNewColorPlate(e.target.value)}
                  placeholder="e.g. White - ABC 123"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#43C0D4]"
                />
              </div>

              <button
                type="submit"
                disabled={isAddingVehicle}
                className="w-full rounded-full bg-[#5BC0D6] py-3 text-lg font-semibold text-white transition hover:bg-[#49b0c7] disabled:opacity-60"
              >
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
            <button
              onClick={() => setEditingVehicle(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <h2 className="mb-6 text-2xl font-bold text-[#1F2B8F]">
              Edit Vehicle
            </h2>

            <form onSubmit={handleSaveVehicle} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Make / Model
                </label>
                <input
                  type="text"
                  value={editingVehicle.make_model}
                  onChange={(e) =>
                    setEditingVehicle({
                      ...editingVehicle,
                      make_model: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#43C0D4]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Color / Plate Number
                </label>
                <input
                  type="text"
                  value={editingVehicle.color_plate}
                  onChange={(e) =>
                    setEditingVehicle({
                      ...editingVehicle,
                      color_plate: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#43C0D4]"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingVehicle}
                className="w-full rounded-full bg-[#1F2B8F] py-3 text-lg font-semibold text-white transition hover:bg-[#16206d] disabled:opacity-60"
              >
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
    </div>
  );
}
