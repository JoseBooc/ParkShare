"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AdminLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      email.trim().toLowerCase() === "admin@parkshare.com" &&
      password.trim() === "admin123"
    ) {
      router.push("/host")
    } else {
      alert("Invalid admin credentials")
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f7fb] px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-lg p-10 border border-slate-200">

        <div className="flex justify-center mb-6">
          <img
            src="/ParkShare.png"
            alt="ParkShare"
            className="h-14 object-contain"
          />
        </div>

        <h1 className="text-3xl font-bold text-center text-[#1E2B8A]">
          Admin Login
        </h1>

        <p className="text-center text-slate-500 mt-2 mb-8">
          Authorized administrators only
        </p>

        <form onSubmit={handleLogin} className="space-y-5">

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:border-cyan-500"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 pr-16 outline-none focus:border-cyan-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 hover:text-cyan-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-2xl transition"
          >
            Login as Admin
          </button>

        </form>
      </div>
    </main>
  )
}