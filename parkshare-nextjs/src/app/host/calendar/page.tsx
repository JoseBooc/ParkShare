"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, User } from "lucide-react";
import Link from "next/link";
import { CALENDAR_EVENTS } from "@/lib/mock-data";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
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
    return `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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
    <div className="p-6 max-w-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-park-navy">Calendar</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your bookings</p>
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

      {/* Calendar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <h2 className="font-bold text-park-navy">
            {MONTHS[currentMonth]} {currentYear}
          </h2>
          <button onClick={nextMonth} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronRight size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS_OF_WEEK.map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
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
                onClick={() => setSelectedDate(dk === selectedDate ? null : dk)}
                className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium transition-colors relative ${
                  isSelected
                    ? "bg-park-navy text-white"
                    : isToday
                    ? "bg-park-teal text-white"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                {day}
                {hasEv && (
                  <span
                    className={`absolute bottom-1 w-1 h-1 rounded-full ${
                      isSelected || isToday ? "bg-white" : "bg-park-teal"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events for selected date */}
      {selectedDate && (
        <div>
          <h3 className="font-bold text-park-navy mb-3 text-sm">
            Bookings for {selectedDate}
          </h3>
          {selectedEvents.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6 bg-white rounded-xl border border-gray-100">
              No bookings on this date
            </p>
          ) : (
            <div className="space-y-3">
              {selectedEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-park-navy text-sm">{evt.driverName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{evt.slotName}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {evt.startTime} – {evt.endTime}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        STATUS_COLORS[evt.status]
                      }`}
                    >
                      {evt.status.charAt(0).toUpperCase() + evt.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* All upcoming events */}
      {!selectedDate && (
        <div>
          <h3 className="font-bold text-park-navy mb-3 text-sm">Upcoming Bookings</h3>
          {CALENDAR_EVENTS.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6 bg-white rounded-xl border border-gray-100">
              No upcoming bookings
            </p>
          ) : (
            <div className="space-y-3">
              {CALENDAR_EVENTS.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-park-navy text-sm">{evt.driverName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{evt.slotName}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {evt.date} · {evt.startTime} – {evt.endTime}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        STATUS_COLORS[evt.status]
                      }`}
                    >
                      {evt.status.charAt(0).toUpperCase() + evt.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
