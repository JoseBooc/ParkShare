"use client";

import { useState } from "react";
import { Bell, X, BookCheck, Star, MessageCircle, Info } from "lucide-react";
import Link from "next/link";
import { NOTIFICATIONS } from "@/lib/mock-data";
import type { Notification } from "@/lib/types";

const TYPE_ICON: Record<Notification["type"], React.ElementType> = {
  booking: BookCheck,
  review: Star,
  message: MessageCircle,
  system: Info,
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 w-80 rounded-xl bg-white shadow-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-park-navy text-sm">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-park-teal hover:underline"
                  >
                    Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)}>
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            <ul className="max-h-80 overflow-y-auto divide-y divide-gray-50">
              {notifications.length === 0 ? (
                <li className="py-8 text-center text-sm text-gray-400">
                  No notifications
                </li>
              ) : (
                notifications.map((notif) => {
                  const Icon = TYPE_ICON[notif.type];
                  return (
                    <li
                      key={notif.id}
                      className={`px-4 py-3 flex gap-3 hover:bg-gray-50 transition-colors ${
                        !notif.read ? "bg-park-teal-light/40" : ""
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-park-teal-light flex items-center justify-center">
                        <Icon size={14} className="text-park-teal" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-park-navy truncate">
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">{notif.date}</p>
                      </div>
                      {!notif.read && (
                        <span className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-park-teal" />
                      )}
                    </li>
                  );
                })
              )}
            </ul>

            <div className="px-4 py-3 border-t border-gray-100 text-center">
              <Link
                href="/driver"
                className="text-xs text-park-teal hover:underline"
                onClick={() => setOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
