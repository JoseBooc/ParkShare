"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
  Clock3,
} from "lucide-react";
import { CALENDAR_EVENTS } from "@/lib/mock-data";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  function dateKey(day: number) {
    return `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
  }

  function hasEvent(day: number) {
    return CALENDAR_EVENTS.some((e) => e.date === dateKey(day));
  }

  const selectedEvents = selectedDate
    ? CALENDAR_EVENTS.filter((e) => e.date === selectedDate)
    : [];

  const STATUS_COLORS: Record<string, string> = {
    confirmed: "bg-park-teal-light text-park-teal",
    pending: "bg-yellow-50 text-yellow-600",
    cancelled: "bg-red-50 text-red-400",
  };

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-[#eefbfd] px-4 py-5 sm:px-8 sm:py-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-park-teal sm:text-sm">
            Booking Management
          </p>

          <h1 className="mt-1 text-2xl font-extrabold text-park-navy sm:text-3xl">
            Calendar
          </h1>

          <p className="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">
            Manage reservations and upcoming schedules.
          </p>
        </div>
      </header>

      <section className="grid gap-6 px-4 py-6 sm:px-8 sm:py-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={prevMonth}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition-colors hover:bg-gray-50"
            >
              <ChevronLeft size={18} className="text-gray-600" />
            </button>

            <h2 className="text-xl font-extrabold text-park-navy">
              {MONTHS[currentMonth]} {currentYear}
            </h2>

            <button
              onClick={nextMonth}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition-colors hover:bg-gray-50"
            >
              <ChevronRight size={18} className="text-gray-600" />
            </button>
          </div>

          <div className="mb-3 grid grid-cols-7">
            {DAYS_OF_WEEK.map((d) => (
              <div
                key={d}
                className="py-2 text-center text-xs font-bold uppercase tracking-wide text-gray-400"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
              (day) => {
                const dk = dateKey(day);

                const isToday =
                  day === today.getDate() &&
                  currentMonth === today.getMonth() &&
                  currentYear === today.getFullYear();

                const isSelected = dk === selectedDate;

                const hasEv = hasEvent(day);

                return (
                  <button
                    key={day}
                    onClick={() =>
                      setSelectedDate(
                        dk === selectedDate ? null : dk
                      )
                    }
                    className={`relative aspect-square rounded-2xl text-sm font-bold transition-all duration-200 ${
                      isSelected
                        ? "bg-park-navy text-white shadow-md"
                        : isToday
                        ? "bg-park-teal text-white"
                        : "bg-[#eefbfd] text-park-navy hover:bg-park-teal-light"
                    }`}
                  >
                    <div className="flex h-full flex-col items-center justify-center">
                      {day}

                      {hasEv && (
                        <span
                          className={`mt-1 h-1.5 w-1.5 rounded-full ${
                            isSelected || isToday
                              ? "bg-white"
                              : "bg-park-teal"
                          }`}
                        />
                      )}
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </div>

        <aside className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-park-teal-light text-park-teal">
              <CalendarCheck size={20} />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-park-navy">
                {selectedDate
                  ? "Selected Day"
                  : "Upcoming Bookings"}
              </h3>

              <p className="text-sm text-gray-400">
                {selectedDate
                  ? selectedDate
                  : `${CALENDAR_EVENTS.length} upcoming reservations`}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {(selectedDate
              ? selectedEvents
              : CALENDAR_EVENTS
            ).length === 0 ? (
              <div className="rounded-2xl bg-[#eefbfd] p-8 text-center">
                <p className="font-bold text-park-navy">
                  No reservations found
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  There are no bookings scheduled.
                </p>
              </div>
            ) : (
              (selectedDate
                ? selectedEvents
                : CALENDAR_EVENTS
              ).map((evt) => (
                <div
                  key={evt.id}
                  className="rounded-2xl border border-gray-100 bg-[#eefbfd] p-4 transition-all hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-park-navy">
                        {evt.driverName}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {evt.slotName}
                      </p>

                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                        <Clock3 size={13} />
                        <span>
                          {evt.date} · {evt.startTime} – {evt.endTime}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        STATUS_COLORS[evt.status]
                      }`}
                    >
                      {evt.status.charAt(0).toUpperCase() +
                        evt.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}