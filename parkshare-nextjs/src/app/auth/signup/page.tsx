"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Car,
  User,
  Mail,
  Lock,
  Phone,
  ChevronRight,
  ChevronLeft,
  Upload,
  Shield,
  Check,
} from "lucide-react";
import type { VehicleType } from "@/lib/types";

type Role = "driver" | "host";
type Step = 1 | 2 | 3 | 4;

const VEHICLE_TYPES: VehicleType[] = ["Sedan", "SUV", "Pickup Truck", "Motorcycle", "Van", "PUV"];

export default function SignupPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<Role>("driver");

  // Step 2 fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [plateNumber, setPlateNumber] = useState("");

  // Step 3 - file upload
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [licensePreview, setLicensePreview] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLicenseFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setLicensePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setLicensePreview(null);
    }
  }

  function handleCreate() {
    router.push(role === "driver" ? "/driver" : "/host");
  }

  const totalSteps = 4;

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-park-teal flex items-center justify-center mb-2">
          <span className="text-white font-bold text-xl">P</span>
        </div>
        <span className="text-xl font-bold">
          <span className="text-park-navy">Park</span>
          <span className="text-park-teal">Share</span>
        </span>
        <p className="text-sm text-gray-500 mt-1">Parking made simple</p>
      </div>

      <div className="bg-gray-100 rounded-2xl p-6 shadow-sm">
        {/* Step 1: Role Selection */}
        {step === 1 && (
          <>
            <h2 className="text-base font-bold text-park-navy">Create an account</h2>
            <p className="text-xs text-gray-400 mb-5">Step 1 of {totalSteps}</p>

            <div className="flex gap-3 mb-6">
              {(["driver", "host"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-4 rounded-xl border-2 transition-all ${
                    role === r
                      ? "border-park-teal bg-white text-park-teal"
                      : "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300"
                  }`}
                >
                  {r === "driver" ? <Car size={22} /> : <User size={22} />}
                  <span className="text-sm font-semibold">
                    {r === "driver" ? "I'm a driver" : "I'm a host"}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {r === "driver" ? "Find & book parking" : "Earn from your slot"}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-center text-xs text-gray-400 mb-4">
              You can switch between Driver and Host mode anytime from your profile.
            </p>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-full bg-park-navy text-white font-semibold text-sm flex items-center justify-center gap-1 hover:bg-park-navy/90 transition-colors"
            >
              Continue <ChevronRight size={16} />
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-bold text-park-navy hover:underline">
                Sign In
              </Link>
            </p>
          </>
        )}

        {/* Step 2: Personal Info */}
        {step === 2 && (
          <>
            <h2 className="text-base font-bold text-park-navy">Personal Information</h2>
            <p className="text-xs text-gray-400 mb-4">Step 2 of {totalSteps}</p>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">First Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-park-teal" />
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full pl-8 pr-2 py-2 rounded-xl bg-white border border-gray-200 text-sm outline-none focus:border-park-teal transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Last Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-park-teal" />
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full pl-8 pr-2 py-2 rounded-xl bg-white border border-gray-200 text-sm outline-none focus:border-park-teal transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-park-teal" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-gray-200 text-sm outline-none focus:border-park-teal transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-park-teal" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09XXXXXXXXX"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-gray-200 text-sm outline-none focus:border-park-teal transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-park-teal" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-gray-200 text-sm outline-none focus:border-park-teal transition-colors"
                  />
                </div>
              </div>

              {role === "driver" && (
                <>
                  <p className="text-xs font-bold text-park-teal pt-1">Vehicle Information</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Vehicle Model</label>
                      <input
                        value={vehicleModel}
                        onChange={(e) => setVehicleModel(e.target.value)}
                        placeholder="e.g. Toyota Vios"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm outline-none focus:border-park-teal transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Color</label>
                      <input
                        value={vehicleColor}
                        onChange={(e) => setVehicleColor(e.target.value)}
                        placeholder="e.g. White"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm outline-none focus:border-park-teal transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Plate Number</label>
                    <input
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value)}
                      placeholder="ABC 1234"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm outline-none focus:border-park-teal transition-colors"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1 px-4 py-2.5 rounded-full border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
              >
                <ChevronLeft size={14} /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-2.5 rounded-full bg-park-navy text-white font-semibold text-sm flex items-center justify-center gap-1 hover:bg-park-navy/90 transition-colors"
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}

        {/* Step 3: Identity Verification */}
        {step === 3 && (
          <>
            <h2 className="text-base font-bold text-park-navy">Identity Verification</h2>
            <p className="text-xs text-gray-400 mb-4">Step 3 of {totalSteps}</p>

            {/* Security Note */}
            <div className="flex items-start gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 mb-4">
              <Shield size={16} className="text-park-teal mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-500">
                Your documents are encrypted and stored securely. They are only used for
                verification and are never shared with third parties.
              </p>
            </div>

            {/* Driver's License Upload */}
            <div className="mb-4">
              <p className="text-xs font-bold text-park-teal mb-2 flex items-center gap-1.5">
                <span className="text-gray-700">Driver&apos;s License</span>
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-park-teal/40 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-park-teal hover:bg-park-teal-light/30 transition-colors"
              >
                {licensePreview ? (
                  <img
                    src={licensePreview}
                    alt="License preview"
                    className="max-h-28 rounded-lg object-contain"
                  />
                ) : (
                  <Upload size={28} className="text-park-teal" />
                )}
                <span className="text-sm font-semibold text-park-navy">
                  {licenseFile ? licenseFile.name : "Upload your driver's license"}
                </span>
                {!licenseFile && (
                  <span className="text-xs text-gray-400">
                    Front and back • JPG, PNG, PDF • Max 10 MB
                  </span>
                )}
              </button>
              {licenseFile && (
                <p className="text-xs text-park-teal mt-1 flex items-center gap-1">
                  <Check size={12} /> File selected — will be uploaded when backend is set up
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1 px-4 py-2.5 rounded-full border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
              >
                <ChevronLeft size={14} /> Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-2.5 rounded-full bg-park-navy text-white font-semibold text-sm flex items-center justify-center gap-1 hover:bg-park-navy/90 transition-colors"
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}

        {/* Step 4: Review & Confirm */}
        {step === 4 && (
          <>
            <h2 className="text-base font-bold text-park-navy">Review & Confirm</h2>
            <p className="text-xs text-gray-400 mb-4">Step 4 of {totalSteps}</p>

            {/* Account Type */}
            <div className="bg-white rounded-xl p-4 mb-3">
              <p className="text-xs font-semibold text-park-teal mb-2">Account Type</p>
              <div className="flex items-center gap-2">
                {role === "driver" ? <Car size={18} className="text-park-navy" /> : <User size={18} className="text-park-navy" />}
                <span className="font-bold text-park-navy text-sm">
                  {role === "driver" ? "Driver Account" : "Host Account"}
                </span>
              </div>
            </div>

            {/* Personal Details */}
            <div className="bg-white rounded-xl p-4 mb-3">
              <p className="text-xs font-semibold text-park-teal mb-3">Personal Details</p>
              <div className="space-y-2">
                {[
                  ["Full Name", `${firstName} ${lastName}`.trim() || "—"],
                  ["Email", email || "—"],
                  ["Phone", phone || "—"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="text-park-navy font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Status */}
            <div className="bg-white rounded-xl p-4 mb-4">
              <p className="text-xs font-semibold text-park-teal mb-3">Verification Status</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  {role === "driver" ? "Driver's License" : "Identity Document"}
                </span>
                <span className="text-park-teal font-semibold">
                  {licenseFile ? "Uploaded" : "Pending"}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-4 text-center">
              By creating an account, you agree to ParkShare&apos;s{" "}
              <span className="font-bold text-park-navy cursor-pointer hover:underline">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="font-bold text-park-navy cursor-pointer hover:underline">
                Privacy Policy
              </span>
              .
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-1 px-4 py-2.5 rounded-full border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
              >
                <ChevronLeft size={14} /> Back
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 py-2.5 rounded-full bg-park-navy text-white font-semibold text-sm flex items-center justify-center gap-1 hover:bg-park-navy/90 transition-colors"
              >
                Create Account <Check size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
