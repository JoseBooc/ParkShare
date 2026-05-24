"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Shield, Home, Calendar, DollarSign } from 'lucide-react';

export default function HostProfilePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Host system analytics counters
  const [spacesCount, setSpacesCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [parkingSlots, setParkingSlots] = useState<any[]>([]);

  useEffect(() => {
    async function fetchHostProfileContext() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch user profile name metadata and properties concurrently
        const [profileRes, slotsRes, bookingsRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase.from('parking_slots').select('*').eq('host_id', user.id),
          supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('host_id', user.id)
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        if (slotsRes.data) {
          setParkingSlots(slotsRes.data);
          setSpacesCount(slotsRes.data.length);
        }
        if (bookingsRes.count) setBookingsCount(bookingsRes.count);

      } catch (err) {
        console.error("Error collecting host profile context payload:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHostProfileContext();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <p className="text-sm text-slate-400 font-medium animate-pulse">Loading Your Host Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Host Identity Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-cyan-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-sm">
            {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'H'}
          </div>

          <div className="text-center sm:text-left flex-1 space-y-1">
            <h1 className="text-2xl font-bold text-slate-800">
              {profile?.full_name || "Host"}
            </h1>
            <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1">
              <Shield className="w-3.5 h-3.5 text-cyan-500" />
              Verified Host Account
            </p>
          </div>

          <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 transition text-white text-xs font-medium rounded-xl">
            Account Management
          </button>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-lg">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{spacesCount}</p>
              <p className="text-xs text-slate-400 font-medium">My Spaces</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{bookingsCount}</p>
              <p className="text-xs text-slate-400 font-medium">Bookings Filled</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">₱0.00</p>
              <p className="text-xs text-slate-400 font-medium">Gross Income</p>
            </div>
          </div>
        </div>

        {/* Listed Parking Spaces */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Home className="w-5 h-5 text-cyan-500" /> Listed Parking Spaces
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parkingSlots.length === 0 ? (
              <div className="col-span-full border-2 border-dashed border-slate-100 rounded-2xl p-8 text-center text-slate-400 text-sm">
                No active listed spaces found. Use the dashboard to add your first parking slot!
              </div>
            ) : (
              parkingSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between hover:border-cyan-200 transition"
                >
                  <div className="space-y-2">
                    {slot.image_url && (
                      <img
                        src={slot.image_url}
                        alt={slot.title || slot.name}
                        className="w-full h-36 object-cover rounded-xl mb-2"
                      />
                    )}
                    <h4 className="font-bold text-slate-800 text-base">
                      {slot.title || slot.name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {slot.address || slot.location || "No address provided"}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-50">
                    <span className="text-xs px-2.5 py-1 bg-cyan-50 text-cyan-600 font-semibold rounded-md">
                      ₱{slot.price_per_hour || slot.price || "0"}/hr
                    </span>
                    <span className="text-xs text-slate-400 font-medium capitalize">
                      Status:{" "}
                      <span className="text-emerald-500 font-semibold">
                        {slot.status || "Active"}
                      </span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
