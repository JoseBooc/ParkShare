import Link from "next/link";
import {
  Plus,
  User,
  ParkingCircle,
  CalendarCheck,
  Wallet,
  Star,
  ArrowRight,
} from "lucide-react";
import { HOST_SLOTS } from "@/lib/mock-data";

export default function HostDashboard() {
  const totalBookings = HOST_SLOTS.reduce((s, sl) => s + sl.totalBookings, 0);
  const totalEarned = HOST_SLOTS.reduce((s, sl) => s + sl.totalEarned, 0);
  const avgRating =
    HOST_SLOTS.length > 0
      ? HOST_SLOTS.reduce((s, sl) => s + sl.rating, 0) / HOST_SLOTS.length
      : 0;

  const stats = [
    { label: "Total Spaces", value: HOST_SLOTS.length.toString(), icon: ParkingCircle },
    { label: "Total Bookings", value: totalBookings.toString(), icon: CalendarCheck },
    { label: "Total Earned", value: `₱${(totalEarned / 1000).toFixed(1)}k`, icon: Wallet },
    { label: "Average Rating", value: avgRating.toFixed(1), icon: Star },
  ];

  return (
    <main className="min-h-screen bg-white">
      <header className="flex items-center justify-between border-b border-gray-100 bg-[#eefbfd] px-8 py-5">
        <div>
          <h1 className="text-3xl font-extrabold text-park-navy">
            Host Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back, Andrew</p>
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
        <div className="grid gap-5 md:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-park-teal-light text-park-teal">
                <Icon size={20} />
              </div>

              <p className="text-sm font-semibold text-gray-400">{label}</p>
              <p className="mt-1 text-3xl font-extrabold text-park-navy">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-park-navy">
                  My Parking Spaces
                </h2>
                <p className="text-sm text-gray-400">
                  {HOST_SLOTS.length} spaces listed
                </p>
              </div>

              <Link
                href="/host/slots"
                className="flex items-center gap-1 text-sm font-bold text-park-teal hover:underline"
              >
                View all
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {HOST_SLOTS.map((slot) => (
                <div
                  key={slot.id}
                  className="overflow-hidden rounded-3xl bg-[#eefbfd] shadow-sm"
                >
                  <div className="flex h-44 items-center justify-center bg-gradient-to-br from-park-teal-light to-park-teal/30">
                    <ParkingCircle size={48} className="text-park-teal/60" />
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-extrabold text-park-navy">
                      {slot.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{slot.address}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-park-navy">
                        ₱{slot.price}/hr
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-park-navy">
                        {slot.totalBookings} bookings
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-park-navy">
                        ₱{(slot.totalEarned / 1000).toFixed(1)}k earned
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-park-navy">
              Today’s Overview
            </h2>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-[#eefbfd] p-4">
                <p className="text-sm font-bold text-park-navy">
                  Next Reservation
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Avida Towers Davao · 6:00 - 9:00 AM
                </p>
              </div>

              <div className="rounded-2xl bg-[#eefbfd] p-4">
                <p className="text-sm font-bold text-park-navy">
                  Pending Messages
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  2 new client inquiries
                </p>
              </div>

              <div className="rounded-2xl bg-[#eefbfd] p-4">
                <p className="text-sm font-bold text-park-navy">
                  Verification Status
                </p>
                <p className="mt-1 text-sm font-bold text-park-teal">
                  Active Host Account
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}