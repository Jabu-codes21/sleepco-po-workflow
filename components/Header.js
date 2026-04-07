"use client";

import { useApp } from "@/context/AppContext";

export default function Header() {
  const { currentUser, switchRole, users } = useApp();

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
        {/* Role Switcher */}
        <div className="relative">
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
          <button className="text-[#011543] hover:text-[#3B9AD2] transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#006491] rounded-full border-2 border-[#f9f9f9]" />
          </button>
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
