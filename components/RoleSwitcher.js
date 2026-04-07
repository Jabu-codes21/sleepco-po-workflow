"use client";

import { useApp } from "@/context/AppContext";

const roleColors = {
  requester: "bg-blue-500",
  legal: "bg-purple-500",
  coo: "bg-orange-500",
  cfo: "bg-emerald-500",
  admin: "bg-slate-500",
};

export default function RoleSwitcher() {
  const { currentUser, switchRole, users } = useApp();

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
        Viewing as
      </span>
      <div className="relative">
        <select
          value={currentUser.id}
          onChange={(e) => switchRole(e.target.value)}
          className="appearance-none bg-sidebar-hover text-white text-sm font-medium pl-3 pr-8 py-2 rounded-lg border border-slate-600 hover:border-slate-500 focus:outline-none focus:border-primary cursor-pointer transition-colors"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} — {user.title}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className={`h-2.5 w-2.5 rounded-full ${roleColors[currentUser.role]}`} title={currentUser.role} />
    </div>
  );
}
