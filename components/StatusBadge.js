import { statusLabels } from "@/data/purchaseOrders";

const statusStyles = {
  draft: "bg-[#eeeeee] text-[#45464f]",
  pending_legal: "bg-[#6cc4fe]/20 text-[#005075]",
  legal_approved: "bg-[#dbe1ff] text-[#041845]",
  pending_coo: "bg-[#6cc4fe]/20 text-[#005075]",
  coo_approved: "bg-[#dbe1ff] text-[#041845]",
  pending_cfo: "bg-[#6cc4fe]/20 text-[#005075]",
  cfo_approved: "bg-[#b5c5fb]/30 text-[#354573]",
  approved: "bg-[#1a2b58] text-[#8393c7]",
  rejected: "bg-[#ffdad6] text-[#93000a]",
  clarification_requested: "bg-[#d2e4ff] text-[#001c37]",
};

const statusDots = {
  draft: "bg-[#757680]",
  pending_legal: "bg-[#006491]",
  legal_approved: "bg-[#354573]",
  pending_coo: "bg-[#006491]",
  coo_approved: "bg-[#354573]",
  pending_cfo: "bg-[#006491]",
  cfo_approved: "bg-[#4d5d8d]",
  approved: "bg-[#8393c7]",
  rejected: "bg-[#ba1a1a]",
  clarification_requested: "bg-[#001c37]",
};

export default function StatusBadge({ status, size = "sm" }) {
  const style = statusStyles[status] || statusStyles.draft;
  const dot = statusDots[status] || statusDots.draft;
  const label = statusLabels[status] || status;
  const sizeClass = size === "lg" ? "px-3.5 py-1.5 text-xs" : "px-2.5 py-1 text-[10px]";

  return (
    <span className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider ${style} ${sizeClass}`}>
      <span className={`w-1 h-1 rounded-full ${dot} mr-1.5`} />
      {label}
    </span>
  );
}
