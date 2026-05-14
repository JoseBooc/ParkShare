import Link from "next/link";
import { Plus, MapPin, User } from "lucide-react";
import { HOST_SLOTS } from "@/lib/mock-data";

export default function MySlotsPage() {
  return (
    <div className="p-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-park-navy">My Parking Slots</h1>
          <p className="text-sm text-gray-400 mt-0.5">{HOST_SLOTS.length} slots listed</p>
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

      {HOST_SLOTS.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
          <p className="text-gray-400 font-medium mb-2">No slots listed yet</p>
          <Link
            href="/host/slots/add"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-park-teal text-white text-sm font-semibold hover:bg-park-teal-dark transition-colors"
          >
            <Plus size={16} /> Add your first slot
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {HOST_SLOTS.map((slot) => (
            <div
              key={slot.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Image placeholder */}
              <div className="aspect-[16/9] bg-gradient-to-br from-park-teal-light to-park-teal/20 flex items-center justify-center">
                <MapPin size={40} className="text-park-teal/40" />
              </div>

              <div className="p-4">
                <h3 className="font-bold text-park-navy text-sm">{slot.name}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                  <MapPin size={11} />
                  <span>{slot.address}</span>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="font-semibold text-park-teal">₱{slot.price}/hr</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span>{slot.totalBookings} bookings</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span>₱{(slot.totalEarned / 1000).toFixed(1)}k earned</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
