"use client";

import { useApp } from "@/context/AppContext";
import { ROLES } from "@/data/users";
import StatsCards from "@/components/StatsCards";
import POTable from "@/components/POTable";
import Link from "next/link";

const roleGreetings = {
  [ROLES.REQUESTER]: (name) => ({ title: `Welcome back, ${name.split(" ")[0]}.`, sub: "Track and manage your purchase order submissions" }),
  [ROLES.LEGAL]: (name) => ({ title: `Legal Review Queue`, sub: "Review pending POs for compliance and contract clearance" }),
  [ROLES.COO]: (name) => ({ title: `Operations Approval Queue`, sub: "Review operationally cleared purchase orders" }),
  [ROLES.CFO]: (name) => ({ title: `Financial Approval Queue`, sub: "Final financial sign-off for purchase orders" }),
  [ROLES.ADMIN]: (name) => ({ title: `System Overview`, sub: "Complete visibility into all POs across the organization" }),
};

export default function Dashboard() {
  const { currentUser, getVisiblePOs, stats } = useApp();
  const visiblePOs = getVisiblePOs();
  const greeting = roleGreetings[currentUser.role]?.(currentUser.name) || roleGreetings[ROLES.ADMIN](currentUser.name);

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Hero */}
      <div className="max-w-3xl">
        <h2 className="font-[var(--font-headline)] text-4xl font-extrabold text-[#011543] tracking-tight">
          {greeting.title}
        </h2>
        <p className="text-[#45464f] text-lg mt-2">
          {greeting.sub}
          {currentUser.role === ROLES.REQUESTER && (
            <>
              {" "}You have{" "}
              <span className="text-[#006491] font-bold">
                {visiblePOs.filter(p => !["approved", "rejected"].includes(p.status)).length} pending approvals
              </span>{" "}
              this week.
            </>
          )}
        </p>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* DOA Matrix — Admin only */}
      {currentUser.role === ROLES.ADMIN && (
        <div className="glass-card rounded-2xl p-6">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#45464f] mb-4">
            Delegation of Authority Matrix
          </h4>
          <div className="grid grid-cols-4 gap-4">
            {[
              { slab: "Under 1L", chain: "COO only", icon: "person" },
              { slab: "1 — 10L", chain: "COO + CFO", icon: "group" },
              { slab: "10 — 50L", chain: "Legal + COO + CFO", icon: "groups" },
              { slab: "Above 50L", chain: "Legal + COO + CFO + Founder", icon: "shield_person" },
            ].map((item, i) => (
              <div key={i} className="bg-white/40 rounded-xl p-4 ghost-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#006491] text-sm">{item.icon}</span>
                  <span className="text-sm font-bold text-[#011543]">{item.slab}</span>
                </div>
                <p className="text-xs text-[#45464f]">{item.chain}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-[var(--font-headline)] text-xl font-bold text-[#011543]">
              Recent Requisitions
            </h3>
            <p className="text-xs text-[#45464f]">
              {visiblePOs.length} order{visiblePOs.length !== 1 ? "s" : ""} in view
            </p>
          </div>
          <div className="flex gap-2">
            <button className="glass-card px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-white/40 transition-colors text-[#45464f]">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Filters
            </button>
            <button className="glass-card px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-white/40 transition-colors text-[#45464f]">
              <span className="material-symbols-outlined text-sm">download</span>
              Export
            </button>
          </div>
        </div>
        <POTable purchaseOrders={visiblePOs} />
      </div>
    </div>
  );
}
