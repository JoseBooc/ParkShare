import Link from "next/link";
import {
  Plus,
  MapPin,
  User,
  ParkingCircle,
  CalendarCheck,
  Wallet,
  Pencil,
  Eye,
} from "lucide-react";
import { HOST_SLOTS } from "@/lib/mock-data";

export default function MySlotsPage() {
  const totalBookings = HOST_SLOTS.reduce(
    (sum, slot) => sum + slot.totalBookings,
    0
  );

  const totalEarned = HOST_SLOTS.reduce(
    (sum, slot) => sum + slot.totalEarned,
    0
  );

  return (
    <main className="min-h-screen bg-white">
      <header className="flex flex-col gap-5 border-b border-gray-100 bg-[#eefbfd] px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-park-teal">
            Host Management
          </p>

          <h1 className="mt-1 text-3xl font-extrabold text-park-navy">
            My Parking Spaces
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your listed slots, pricing, and booking performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/host/slots/add"
            className="flex items-center gap-2 rounded-full bg-park-teal px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-park-teal-dark"
          >
            <Plus size={16} />
            Add Slot
          </Link>

          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-park-navy bg-white">
            <User size={17} className="text-park-navy" />
          </div>
        </div>
      </header>

      <section className="px-8 py-8">
        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-park-teal-light text-park-teal">
              <ParkingCircle size={20} />
            </div>

            <p className="text-sm font-semibold text-gray-400">Active Spaces</p>
            <p className="mt-1 text-3xl font-extrabold text-park-navy">
              {HOST_SLOTS.length}
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-park-teal-light text-park-teal">
              <CalendarCheck size={20} />
            </div>

            <p className="text-sm font-semibold text-gray-400">Total Bookings</p>
            <p className="mt-1 text-3xl font-extrabold text-park-navy">
              {totalBookings}
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-park-teal-light text-park-teal">
              <Wallet size={20} />
            </div>

            <p className="text-sm font-semibold text-gray-400">Total Earned</p>
            <p className="mt-1 text-3xl font-extrabold text-park-navy">
              ₱{(totalEarned / 1000).toFixed(1)}k
            </p>
          </div>
        </div>

        {HOST_SLOTS.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <p className="mb-3 text-lg font-bold text-park-navy">
              No parking spaces listed yet
            </p>

            <p className="mx-auto mb-6 max-w-md text-sm text-gray-500">
              Add your first parking slot so drivers can discover and reserve it.
            </p>

            <Link
              href="/host/slots/add"
              className="inline-flex items-center gap-2 rounded-full bg-park-teal px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-park-teal-dark"
            >
              <Plus size={16} />
              Add your first slot
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {HOST_SLOTS.map((slot, index) => (
              <div
                key={slot.id}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative flex h-52 items-center justify-center bg-gradient-to-br from-park-teal-light to-park-teal/30">
                  <ParkingCircle size={54} className="text-park-teal/60" />

                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-park-navy shadow-sm">
                    Slot {index + 1}
                  </span>

                  <span className="absolute right-4 top-4 rounded-full bg-park-teal px-3 py-1 text-xs font-bold text-white shadow-sm">
                    Active
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-park-navy">
                        {slot.name}
                      </h3>

                      <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                        <MapPin size={14} />
                        <span>{slot.address}</span>
                      </div>
                    </div>

                    <p className="rounded-full bg-[#eefbfd] px-3 py-1 text-sm font-extrabold text-park-teal">
                      ₱{slot.price}/hr
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-[#eefbfd] p-4">
                      <p className="text-xs font-semibold text-gray-400">
                        Bookings
                      </p>
                      <p className="mt-1 text-lg font-extrabold text-park-navy">
                        {slot.totalBookings}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#eefbfd] p-4">
                      <p className="text-xs font-semibold text-gray-400">
                        Earnings
                      </p>
                      <p className="mt-1 text-lg font-extrabold text-park-navy">
                        ₱{(slot.totalEarned / 1000).toFixed(1)}k
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <Link
                      href={`/host/slots/${slot.id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full border border-park-navy px-4 py-2.5 text-sm font-bold text-park-navy transition-colors hover:bg-park-navy hover:text-white"
                    >
                      <Eye size={15} />
                      View
                    </Link>

                    <Link
                      href={`/host/slots/${slot.id}/edit`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-park-teal px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-park-teal-dark"
                    >
                      <Pencil size={15} />
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}