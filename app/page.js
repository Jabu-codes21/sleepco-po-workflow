"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { showToast } from "@/components/Toast";
import { ROLES } from "@/data/users";
import { PO_STATUS } from "@/data/purchaseOrders";
import { vendors } from "@/data/vendors";
import StatsCards from "@/components/StatsCards";
import POTable from "@/components/POTable";
import Link from "next/link";

const filterMeta = {
  all: { title: (name, role) => {
    if (role === ROLES.REQUESTER) return `Welcome back, ${name.split(" ")[0]}.`;
    if (role === ROLES.LEGAL) return "Legal Review Queue";
    if (role === ROLES.COO) return "Operations Approval Queue";
    if (role === ROLES.CFO) return "Financial Approval Queue";
    return "System Overview";
  }, sub: "All purchase orders in your view" },
  pending: { title: () => "Pending Orders", sub: "Orders awaiting action in the approval pipeline" },
  approved: { title: () => "Approved POs", sub: "Successfully approved and signed purchase orders" },
  vendors: { title: () => "Vendor Directory", sub: "All registered vendors and their details" },
  settings: { title: () => "Settings", sub: "System configuration and preferences" },
};

export default function Dashboard() {
  const { currentUser, getVisiblePOs, stats, sidebarFilter } = useApp();
  const allVisiblePOs = getVisiblePOs();

  const filteredPOs = useMemo(() => {
    switch (sidebarFilter) {
      case "pending":
        return allVisiblePOs.filter((po) =>
          [PO_STATUS.PENDING_LEGAL, PO_STATUS.PENDING_COO, PO_STATUS.PENDING_CFO, PO_STATUS.CFO_APPROVED, PO_STATUS.CLARIFICATION_REQUESTED].includes(po.status)
        );
      case "approved":
        return allVisiblePOs.filter((po) => po.status === PO_STATUS.APPROVED);
      default:
        return allVisiblePOs;
    }
  }, [allVisiblePOs, sidebarFilter]);

  const meta = filterMeta[sidebarFilter] || filterMeta.all;
  const title = typeof meta.title === "function" ? meta.title(currentUser.name, currentUser.role) : meta.title;

  // Vendors page
  if (sidebarFilter === "vendors") {
    return (
      <div className="max-w-6xl mx-auto space-y-10">
        <div><h2 className="font-[var(--font-headline)] text-4xl font-extrabold text-[#011543] tracking-tight">Vendor Directory</h2><p className="text-[#45464f] text-lg mt-2">All registered vendors and suppliers</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((v) => (
            <div key={v.id} className="glass-card rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#1a2b58] flex items-center justify-center text-white text-xs font-bold">
                  {v.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#011543]">{v.name}</p>
                  <p className="text-[10px] text-[#45464f]">{v.category}</p>
                </div>
              </div>
              <div className="space-y-2 text-xs text-[#45464f]">
                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px] text-[#006491]">location_on</span>{v.location}</div>
                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px] text-[#006491]">badge</span><span className="font-mono text-[10px]">{v.gstin}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Settings page
  if (sidebarFilter === "settings") {
    return (
      <div className="max-w-6xl mx-auto space-y-10">
        <div><h2 className="font-[var(--font-headline)] text-4xl font-extrabold text-[#011543] tracking-tight">Settings</h2><p className="text-[#45464f] text-lg mt-2">System configuration and preferences</p></div>
        <div className="glass-card rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-[#c5c6d0]/10 pb-4">
            <span className="material-symbols-outlined text-[#006491]" style={{ fontVariationSettings: "'FILL' 1" }}>tune</span>
            <h3 className="font-[var(--font-headline)] font-bold text-lg text-[#011543]">Approval Thresholds</h3>
          </div>
          <p className="text-sm text-[#45464f]">DOA matrix configuration and notification preferences will be available here in the production version.</p>
          <div className="flex items-start gap-3 p-4 bg-[#006491]/5 rounded-lg border border-[#006491]/10">
            <span className="material-symbols-outlined text-[#006491] text-sm mt-0.5">info</span>
            <p className="text-[11px] leading-relaxed text-[#45464f]">This is a demo environment. Settings changes are not persisted.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Hero */}
      <div className="max-w-3xl">
        <h2 className="font-[var(--font-headline)] text-4xl font-extrabold text-[#011543] tracking-tight">{title}</h2>
        <p className="text-[#45464f] text-lg mt-2">
          {meta.sub}
          {sidebarFilter === "all" && currentUser.role === ROLES.REQUESTER && (
            <>{" "}You have <span className="text-[#006491] font-bold">{allVisiblePOs.filter(p => !["approved", "rejected"].includes(p.status)).length} pending approvals</span> this week.</>
          )}
        </p>
      </div>

      {/* Stats — only on main dashboard */}
      {sidebarFilter === "all" && <StatsCards />}

      {/* DOA Matrix — Admin only, main dashboard */}
      {sidebarFilter === "all" && currentUser.role === ROLES.ADMIN && (
        <div className="glass-card rounded-2xl p-6">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#45464f] mb-4">Delegation of Authority Matrix</h4>
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
      <TableSection filteredPOs={filteredPOs} sidebarFilter={sidebarFilter} />
    </div>
  );
}

function TableSection({ filteredPOs, sidebarFilter }) {
  const [search, setSearch] = useState("");

  const searchedPOs = useMemo(() => {
    if (!search.trim()) return filteredPOs;
    const q = search.toLowerCase();
    return filteredPOs.filter(
      (po) =>
        po.poNumber.toLowerCase().includes(q) ||
        po.vendorName.toLowerCase().includes(q) ||
        po.department.toLowerCase().includes(q)
    );
  }, [filteredPOs, search]);

  const exportCSV = () => {
    const headers = ["PO Number", "Vendor", "Department", "Amount (INR)", "Status", "Submitted"];
    const rows = searchedPOs.map((po) => [
      po.poNumber,
      po.vendorName,
      po.department,
      po.amount,
      po.status.replace(/_/g, " "),
      new Date(po.createdAt).toLocaleDateString("en-IN"),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `po-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV exported successfully", "success");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-[var(--font-headline)] text-xl font-bold text-[#011543]">
            {sidebarFilter === "pending" ? "Pending Orders" : sidebarFilter === "approved" ? "Approved Orders" : "Recent Requisitions"}
          </h3>
          <p className="text-xs text-[#45464f]">{searchedPOs.length} order{searchedPOs.length !== 1 ? "s" : ""} in view</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#757680] text-sm">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search PO, vendor, dept..."
              className="bg-white/50 ghost-border rounded-lg pl-9 pr-3 py-2 text-xs w-56 focus:ring-2 focus:ring-[#3B9AD2]/20 outline-none transition-all backdrop-blur-sm"
            />
          </div>
          <button
            onClick={exportCSV}
            className="glass-card px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-white/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer text-[#45464f]"
          >
            <span className="material-symbols-outlined text-sm">download</span>Export
          </button>
        </div>
      </div>

      {searchedPOs.length === 0 && filteredPOs.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-[#e6f4ea] flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[#1a7431] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              celebration
            </span>
          </div>
          <h3 className="font-[var(--font-headline)] text-xl font-bold text-[#011543]">All caught up!</h3>
          <p className="text-sm text-[#45464f] mt-1">No purchase orders pending in this view.</p>
        </div>
      ) : searchedPOs.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <span className="material-symbols-outlined text-3xl text-[#c5c6d0] block mb-2">search_off</span>
          <p className="text-sm text-[#45464f]">No results for &ldquo;{search}&rdquo;</p>
        </div>
      ) : (
        <POTable purchaseOrders={searchedPOs} />
      )}
    </div>
  );
}
