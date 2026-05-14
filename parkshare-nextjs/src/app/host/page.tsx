import Link from "next/link";
import { Plus, User } from "lucide-react";
import { HOST_SLOTS } from "@/lib/mock-data";

export default function HostDashboard() {
  const totalBookings = HOST_SLOTS.reduce((s, sl) => s + sl.totalBookings, 0);
  const totalEarned = HOST_SLOTS.reduce((s, sl) => s + sl.totalEarned, 0);
  const avgRating =
    HOST_SLOTS.length > 0
      ? HOST_SLOTS.reduce((s, sl) => s + sl.rating, 0) / HOST_SLOTS.length
      : 0;

  return (
    <div className="p-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-park-navy">Host Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Welcome back, Andrew</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/host/slots/add"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-park-teal text-white text-sm font-semibold hover:bg-park-teal-dark transition-colors"
          >
            <Plus size={16} /> Add Slot
          </Link>
          <div className="w-9 h-9 rounded-full bg-park-teal flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Slots", value: HOST_SLOTS.length.toString() },
          { label: "Total Bookings", value: totalBookings.toString() },
          {
            label: "Total Earned",
            value: `₱${(totalEarned / 1000).toFixed(1)}k`,
          },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-2xl font-extrabold text-park-navy mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent Slots Preview */}
      {HOST_SLOTS.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-park-navy">Your Parking Slots</h2>
            <Link href="/host/slots" className="text-sm text-park-teal hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {HOST_SLOTS.map((slot) => (
              <div
                key={slot.id}
                className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-gray-100 shadow-sm"
              >
                <div className="w-16 h-16 rounded-xl bg-park-teal-light flex items-center justify-center flex-shrink-0">
                  <span className="text-park-teal font-bold text-lg">P</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-park-navy text-sm truncate">{slot.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{slot.address}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-park-teal font-semibold">₱{slot.price}/hr</span>
                    <span className="text-xs text-gray-400">{slot.totalBookings} bookings</span>
                    <span className="text-xs text-gray-400">
                      ₱{(slot.totalEarned / 1000).toFixed(1)}k earned
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-200">
          <p className="text-gray-400 font-medium mb-2">You have no parking slots yet</p>
          <Link
            href="/host/slots/add"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-park-teal text-white text-sm font-semibold hover:bg-park-teal-dark transition-colors"
          >
            <Plus size={16} /> Add your first slot
          </Link>
        </div>
      )}
    </div>
  );
}
