"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";

export default function Header() {
  const { currentUser, switchRole, users } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);

  const notifications = [
    { id: 1, text: "Welspun India PO awaiting your approval", time: "2 hours ago", icon: "pending_actions", unread: true },
    { id: 2, text: "Karan Singla approved PO-0046 (Godrej Interio)", time: "5 hours ago", icon: "check_circle", unread: true },
    { id: 3, text: "Clarification requested on PO-0045 (Packmatic)", time: "1 day ago", icon: "help", unread: false },
    { id: 4, text: "PO-0042 signed and finalized by CFO", time: "2 days ago", icon: "draw", unread: false },
    { id: 5, text: "New vendor Rajasthan Synthetics added", time: "3 days ago", icon: "factory", unread: false },
  ];

  return (
    <header className="fixed top-0 right-0 left-64 h-16 frosted-header z-40 flex items-center justify-between px-8 font-[var(--font-body)] text-sm font-medium">
      <div className="flex items-center gap-4">
        <span className="font-[var(--font-headline)] font-extrabold tracking-tighter text-[#1a2b58] text-xl">
          PO Manager
        </span>
        <div className="h-4 w-px bg-[#c5c6d0]/30 ml-2" />
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#45464f] text-sm">
            search
          </span>
          <input
            type="text"
            placeholder="Search orders, vendors..."
            className="bg-white/50 ghost-border rounded-full pl-10 pr-4 py-1.5 text-xs w-64 focus:ring-2 focus:ring-[#3B9AD2]/20 outline-none transition-all backdrop-blur-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* View Switcher */}
        <div className="relative flex items-center gap-2">
          <span className="text-[10px] text-[#757680] uppercase tracking-wider font-bold">View as</span>
          <select
            value={currentUser.id}
            onChange={(e) => switchRole(e.target.value)}
            className="appearance-none bg-transparent text-[#011543] font-bold text-xs pl-2 pr-6 py-1 border-b-2 border-[#3B9AD2] cursor-pointer focus:outline-none"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} — {user.title}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
            <span className="material-symbols-outlined text-[#45464f] text-sm">expand_more</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="text-[#011543] hover:text-[#3B9AD2] hover:scale-110 active:scale-95 transition-all duration-200 relative cursor-pointer p-1"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#ba1a1a] rounded-full border-2 border-[#f9f9f9]" />
            </button>

            {showNotifs && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl overflow-hidden z-50 border border-[#e2e2e2] shadow-xl shadow-[#011543]/10">
                  <div className="px-4 py-3 border-b border-[#c5c6d0]/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#011543] uppercase tracking-wider">Notifications</span>
                    <span className="text-[10px] font-bold text-[#006491] bg-[#6cc4fe]/10 px-2 py-0.5 rounded">{notifications.filter(n => n.unread).length} new</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 flex gap-3 hover:bg-[#011543]/[0.03] transition-colors cursor-pointer ${n.unread ? "bg-[#d2e4ff]/10" : ""}`}
                      >
                        <span className={`material-symbols-outlined text-[18px] mt-0.5 ${n.unread ? "text-[#006491]" : "text-[#757680]"}`}>
                          {n.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-relaxed ${n.unread ? "text-[#011543] font-semibold" : "text-[#45464f]"}`}>{n.text}</p>
                          <p className="text-[10px] text-[#757680] mt-0.5">{n.time}</p>
                        </div>
                        {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#006491] mt-1.5 shrink-0" />}
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-[#c5c6d0]/10 text-center">
                    <button className="text-[10px] font-bold text-[#006491] hover:underline">View All Notifications</button>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 pl-4 border-l border-[#c5c6d0]/30">
            <div className="text-right">
              <p className="text-xs font-bold text-[#011543]">{currentUser.name}</p>
              <p className="text-[10px] text-[#45464f]">{currentUser.title}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#1a2b58] flex items-center justify-center text-white text-xs font-bold">
              {currentUser.avatar}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
