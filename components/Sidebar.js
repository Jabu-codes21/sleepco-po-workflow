"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ROLES } from "@/data/users";

const navItems = [
  { label: "Dashboard", filter: "all", icon: "dashboard" },
  { label: "Pending Orders", filter: "pending", icon: "pending_actions" },
  { label: "Approved POs", filter: "approved", icon: "check_circle" },
  { label: "Vendors", filter: "vendors", icon: "factory" },
  { label: "Settings", filter: "settings", icon: "settings" },
];

export default function Sidebar() {
  const { currentUser, sidebarFilter, setSidebarFilter } = useApp();
  const pathname = usePathname();
  const isOnDashboard = pathname === "/";

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 frosted-sidebar flex flex-col p-6 z-50 font-[var(--font-headline)] tracking-tight">
      {/* Brand */}
      <div className="mb-10 px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#011543] flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              bedtime
            </span>
          </div>
          <div>
            <div className="text-[#011543] font-bold text-lg leading-tight">SleepCo Internal</div>
            <div className="text-[10px] text-[#45464f] uppercase tracking-widest mt-0.5">Approval Portal</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = isOnDashboard && sidebarFilter === item.filter;
          return (
            <Link
              key={item.filter}
              href="/"
              onClick={() => setSidebarFilter(item.filter)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#1a2b58] text-white font-bold"
                  : "text-[#45464f] hover:bg-[#f3f3f3]"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto pt-6 space-y-3 border-t border-[#c5c6d0]/10">
        {currentUser.role === ROLES.REQUESTER && (
          <Link
            href="/submit"
            className="w-full bg-[#3B9AD2] text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#006491]/20 hover:scale-[0.97] active:scale-95 transition-transform text-sm"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New Request
          </Link>
        )}
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-[#45464f] hover:bg-[#f3f3f3] rounded-lg transition-all text-sm"
        >
          <span className="material-symbols-outlined text-[20px]">help</span>
          <span>Help Center</span>
        </a>
      </div>
    </aside>
  );
}
