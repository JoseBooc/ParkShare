"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ParkingCircle,
  CalendarDays,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Plus,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/host", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/host/slots", icon: ParkingCircle, label: "My Space" },
  { href: "/host/calendar", icon: CalendarDays, label: "Calendar" },
  { href: "/host/messages", icon: MessageCircle, label: "Message Inbox" },
];

export default function HostSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-0 z-50 h-screen min-h-screen border-r border-park-teal/25 bg-[#eefbfd] transition-all duration-200 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-4 py-6">
          <Link href="/host" className="flex items-center overflow-hidden">
            {collapsed ? (
              <Image
                src="/logo.png"
                alt="ParkShare"
                width={46}
                height={46}
                className="h-10 w-auto object-contain object-left"
                priority
              />
            ) : (
              <Image
                src="/logo.png"
                alt="ParkShare"
                width={170}
                height={52}
                className="h-11 w-auto object-contain"
                priority
              />
            )}
          </Link>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active =
              pathname === href ||
              (href !== "/host" && pathname.startsWith(href));

            return (
              <Link
                key={href}
                href={href}
                className={`relative z-50 flex touch-manipulation items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
                  active
                    ? "bg-park-teal-light font-bold text-park-navy"
                    : "text-park-navy/75 hover:bg-white hover:text-park-navy"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && (
                  <span className="whitespace-nowrap">{label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-park-teal/20 p-4">
          {!collapsed && (
            <Link
              href="/host/slots/add"
              className="relative z-50 flex w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-park-teal px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-park-teal-dark active:scale-95"
            >
              <Plus size={16} />
              Add Space
            </Link>
          )}

          {collapsed && (
            <Link
              href="/host/slots/add"
              className="relative z-50 flex w-full touch-manipulation items-center justify-center rounded-lg px-3 py-3 text-sm font-semibold text-park-navy/70 transition-colors hover:bg-white hover:text-park-navy active:scale-95"
            >
              <Plus size={18} className="flex-shrink-0" />
            </Link>
          )}

          <Link
            href="/driver"
            className={`relative z-50 flex w-full touch-manipulation items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-park-navy/70 transition-colors hover:bg-white hover:text-park-navy active:scale-95 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <User size={18} className="flex-shrink-0" />
            {!collapsed && <span>Switch to Driver</span>}
          </Link>

          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className={`relative z-50 flex w-full touch-manipulation items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-park-navy/50 transition-colors hover:bg-white active:scale-95 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}