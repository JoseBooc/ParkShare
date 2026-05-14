import ParkingCard from "@/components/driver/ParkingCard";
import { PARKING_SLOTS } from "@/lib/mock-data";
import { Heart } from "lucide-react";
import Link from "next/link";

// Mock: first 3 slots are saved
const SAVED_SLOTS = PARKING_SLOTS.slice(0, 3);

export default function SavedSlotsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Heart size={20} className="fill-red-400 text-red-400" />
        <h1 className="text-xl font-bold text-park-navy">Saved Slots</h1>
        <span className="text-gray-400 text-sm">({SAVED_SLOTS.length} saved)</span>
      </div>

      {SAVED_SLOTS.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <Heart size={48} className="mx-auto mb-4 text-gray-200" />
          <p className="font-semibold text-lg">No saved slots yet</p>
          <p className="text-sm mt-1">
            Tap the heart icon on any parking slot to save it here.
          </p>
          <Link
            href="/driver"
            className="mt-4 inline-block text-park-teal text-sm hover:underline"
          >
            Browse parking slots
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {SAVED_SLOTS.map((slot) => (
            <ParkingCard key={slot.id} slot={slot} saved />
          ))}
        </div>
      )}
    </div>
  );
}
