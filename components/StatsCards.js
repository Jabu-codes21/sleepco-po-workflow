"use client";

import { useApp } from "@/context/AppContext";
import { ROLES } from "@/data/users";

function formatINR(amount) {
  if (amount >= 10000000) return `${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
  return amount.toString();
}

export default function StatsCards() {
  const { stats, currentUser, getVisiblePOs } = useApp();
  const visiblePOs = getVisiblePOs();

  const roleCards = {
    [ROLES.REQUESTER]: [
      { label: "Active POs", value: visiblePOs.length, icon: "shopping_bag", tag: "Active POs" },
      { label: "Pending Approval", value: visiblePOs.filter(p => !["approved", "rejected"].includes(p.status)).length, icon: "timer", tag: "Pending" },
      { label: "Need My Response", value: visiblePOs.filter(p => p.status === "clarification_requested").length, icon: "chat_bubble", tag: "Action Needed" },
      { label: "Approved", value: visiblePOs.filter(p => p.status === "approved").length, icon: "check_circle", tag: "Complete" },
    ],
    [ROLES.LEGAL]: [
      { label: "Awaiting Review", value: visiblePOs.filter(p => p.status === "pending_legal").length, icon: "gavel", tag: "My Queue" },
      { label: "Reviewed", value: visiblePOs.filter(p => p.approvals?.legal?.status === "approved").length, icon: "verified", tag: "Done" },
      { label: "Total Pipeline", value: visiblePOs.length, icon: "stacked_line_chart", tag: "All" },
      { label: "Value Pending", value: formatINR(visiblePOs.filter(p => p.status === "pending_legal").reduce((s, p) => s + p.amount, 0)), icon: "currency_rupee", tag: "Financial", isFormatted: true },
    ],
    [ROLES.COO]: [
      { label: "Awaiting Approval", value: visiblePOs.filter(p => p.status === "pending_coo").length, icon: "pending_actions", tag: "My Queue" },
      { label: "Approved by Me", value: visiblePOs.filter(p => p.approvals?.coo?.status === "approved").length, icon: "thumb_up", tag: "Done" },
      { label: "Clarifications Sent", value: visiblePOs.filter(p => p.approvals?.coo?.status === "clarification").length, icon: "help", tag: "Waiting" },
      { label: "Value Pending", value: formatINR(visiblePOs.filter(p => p.status === "pending_coo").reduce((s, p) => s + p.amount, 0)), icon: "currency_rupee", tag: "Financial", isFormatted: true },
    ],
    [ROLES.CFO]: [
      { label: "Awaiting Approval", value: visiblePOs.filter(p => p.status === "pending_cfo" || p.status === "cfo_approved").length, icon: "pending_actions", tag: "My Queue" },
      { label: "Signed Off", value: visiblePOs.filter(p => p.approvals?.cfo?.status === "approved").length, icon: "verified", tag: "Complete" },
      { label: "Value Pending", value: formatINR(stats.totalValuePending), icon: "account_balance", tag: "Financial", isFormatted: true },
      { label: "Avg. Turnaround", value: `${stats.avgApprovalDays}d`, icon: "speed", tag: "Performance", isFormatted: true },
    ],
    [ROLES.ADMIN]: [
      { label: "Total Pending", value: stats.totalPending, icon: "pending_actions", tag: "Open" },
      { label: "Approved", value: stats.approvedThisMonth, icon: "check_circle", tag: "This Month" },
      { label: "Value Pending", value: formatINR(stats.totalValuePending), icon: "account_balance", tag: "Financial", isFormatted: true },
      { label: "Avg. Turnaround", value: `${stats.avgApprovalDays}d`, icon: "speed", tag: "Performance", isFormatted: true },
    ],
  };

  const cards = roleCards[currentUser.role] || roleCards[ROLES.ADMIN];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <div key={i} className="glass-card rounded-xl p-6 flex flex-col justify-between h-36 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <span
              className="material-symbols-outlined p-2 bg-[#011543]/5 text-[#011543] rounded-lg text-[20px]"
            >
              {card.icon}
            </span>
            <span className="text-[10px] font-bold text-[#005075] uppercase tracking-wider bg-[#6cc4fe]/10 px-2 py-0.5 rounded">
              {card.tag}
            </span>
          </div>
          <div>
            <p className="text-3xl font-bold font-[var(--font-headline)] text-[#011543]">
              {card.isFormatted ? card.value : card.value}
            </p>
            <p className="text-xs text-[#45464f] mt-0.5">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
