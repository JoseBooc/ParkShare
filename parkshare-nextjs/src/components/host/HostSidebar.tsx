"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ParkingCircle,
  CalendarDays,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/host", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/host/slots", icon: ParkingCircle, label: "My slot" },
  { href: "/host/calendar", icon: CalendarDays, label: "Calendar" },
  { href: "/host/messages", icon: MessageCircle, label: "Message Inbox" },
];

export default function HostSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-200 ${
        collapsed ? "w-16" : "w-56"
      } min-h-screen sticky top-0 h-screen`}
    >
      {/* Logo */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100">
        <Link href="/host" className="flex items-center overflow-hidden">
          {collapsed ? (
            <Image
              src="/logo-icon.png"
              alt="ParkShare"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
              priority
            />
          ) : (
            <Image
              src="/logo.png"
              alt="ParkShare"
              width={130}
              height={34}
              className="h-8 w-auto object-contain"
              priority
            />
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                active
                  ? "bg-park-teal-light text-park-teal font-semibold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-park-navy"
              }`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm whitespace-nowrap">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Profile + Collapse */}
      <div className="border-t border-gray-100 p-3 space-y-2">
        <button
          onClick={() => router.push("/driver")}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-park-navy transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <User size={18} className="flex-shrink-0" />
          {!collapsed && <span>Switch to Driver</span>}
        </button>
        <button
          onClick={() => setCollapsed((v) => !v)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-50 transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
