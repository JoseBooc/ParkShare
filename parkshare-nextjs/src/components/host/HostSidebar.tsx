"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ParkingCircle,
  CalendarDays,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/host", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/host/slots", icon: ParkingCircle, label: "My Space" },
  { href: "/host/calendar", icon: CalendarDays, label: "Calendar" },
  { href: "/host/messages", icon: MessageCircle, label: "Messages" },
];

export default function HostSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  function isActive(href: string) {
    return pathname === href || (href !== "/host" && pathname.startsWith(href));
  }

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside
        className={`sticky top-0 z-50 hidden h-screen min-h-screen flex-col border-r border-park-teal/25 bg-[#eefbfd] transition-all duration-200 md:flex ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-6">
            <Link href="/host" className="flex items-center overflow-hidden">
              <img
                src="/logo.png"
                alt="ParkShare Logo"
                className={
                  collapsed
                    ? "h-8 w-auto object-contain object-left"
                    : "h-9 w-auto object-contain"
                }
              />
            </Link>
          </div>

          <nav className="flex-1 space-y-2 px-4">
            {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative z-50 flex touch-manipulation items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
                  isActive(href)
                    ? "bg-park-teal-light font-bold text-park-navy"
                    : "text-park-navy/75 hover:bg-white hover:text-park-navy"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && (
                  <span className="whitespace-nowrap">{label}</span>
                )}
              </Link>
            ))}
          </nav>

          <div className="space-y-2 border-t border-park-teal/20 p-4">
            {collapsed ? (
              <Link
                href="/host/slots/add"
                className="relative z-50 flex w-full touch-manipulation items-center justify-center rounded-lg px-3 py-3 text-sm font-semibold text-park-navy/70 transition-colors hover:bg-white hover:text-park-navy active:scale-95"
              >
                <Plus size={18} className="shrink-0" />
              </Link>
            ) : (
              <Link
                href="/host/slots/add"
                className="relative z-50 flex w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-park-teal px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-park-teal-dark active:scale-95"
              >
                <Plus size={16} />
                Add Space
              </Link>
            )}

            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              className={`relative z-50 flex w-full touch-manipulation items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-park-navy/50 transition-colors hover:bg-white active:scale-95 ${
                collapsed ? "justify-center" : ""
              }`}
            >
              {collapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
              {!collapsed && <span>Collapse</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center border-t border-gray-100 bg-white md:hidden">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors ${
              isActive(href) ? "text-park-teal" : "text-slate-400"
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}

        {/* Add Space pill */}
        <Link
          href="/host/slots/add"
          className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold text-park-teal"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-park-teal text-white shadow">
            <Plus size={15} />
          </div>
          <span>Add</span>
        </Link>
      </nav>
    </>
  );
}
