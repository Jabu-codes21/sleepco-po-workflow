"use client";

import Link from "next/link";
import StatusBadge from "./StatusBadge";

function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function POTable({ purchaseOrders }) {
  if (!purchaseOrders.length) {
    return (
      <div className="glass-card rounded-2xl p-16 text-center">
        <span className="material-symbols-outlined text-4xl text-[#c5c6d0] mb-3 block">
          inventory_2
        </span>
        <p className="text-sm font-semibold text-[#011543]">No purchase orders yet</p>
        <p className="text-xs text-[#45464f] mt-1">Orders relevant to your role will appear here</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-[#45464f]/60">
              <th className="px-8 py-4 font-bold">Request ID</th>
              <th className="px-8 py-4 font-bold">Vendor</th>
              <th className="px-8 py-4 font-bold">Department</th>
              <th className="px-8 py-4 font-bold text-right">Amount</th>
              <th className="px-8 py-4 font-bold">Status</th>
              <th className="px-8 py-4 font-bold">Date</th>
              <th className="px-8 py-4 font-bold" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c5c6d0]/10">
            {purchaseOrders.map((po) => (
              <tr
                key={po.id}
                className="hover:bg-[#011543]/[0.03] transition-colors group cursor-pointer"
              >
                <td className="px-8 py-5">
                  <Link href={`/po/${po.id}`} className="font-bold text-[#011543] hover:text-[#3B9AD2] transition-colors">
                    {po.poNumber}
                  </Link>
                  <p className="text-[10px] text-[#45464f] mt-0.5">{po.department}</p>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#e8e8e8] flex items-center justify-center font-bold text-[#011543] text-[10px]">
                      {po.vendorName.split(" ").map(w => w[0]).join("").slice(0, 2)}
                    </div>
                    <span className="text-sm font-semibold text-[#011543]">{po.vendorName}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm text-[#45464f]">{po.department}</span>
                </td>
                <td className="px-8 py-5 text-right">
                  <span className="font-bold text-[#011543]">{formatINR(po.amount)}</span>
                </td>
                <td className="px-8 py-5">
                  <StatusBadge status={po.status} />
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm text-[#45464f]">{formatDate(po.createdAt)}</span>
                </td>
                <td className="px-8 py-5 text-right">
                  <Link href={`/po/${po.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[#45464f]">chevron_right</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
