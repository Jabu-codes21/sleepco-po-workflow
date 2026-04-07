"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ROLES } from "@/data/users";
import { PO_STATUS } from "@/data/purchaseOrders";

export default function ActionButtons({ po }) {
  const { currentUser, approvePO, rejectPO, requestClarification } = useApp();
  const [showReject, setShowReject] = useState(false);
  const [showClarify, setShowClarify] = useState(false);
  const [reason, setReason] = useState("");

  const role = currentUser.role;
  const canApprove =
    (role === ROLES.LEGAL && po.status === PO_STATUS.PENDING_LEGAL) ||
    (role === ROLES.COO && po.status === PO_STATUS.PENDING_COO) ||
    (role === ROLES.CFO && po.status === PO_STATUS.PENDING_CFO);

  if (!canApprove) {
    return <p className="text-[11px] text-[#757680]">No actions available for your role on this PO.</p>;
  }

  return (
    <div className="space-y-3">
      {!showReject && !showClarify && (
        <div className="flex gap-3">
          <button
            onClick={() => approvePO(po.id)}
            className="flex-1 px-8 py-3 rounded-lg bg-gradient-to-b from-[#1a2b58] to-[#011543] text-white font-bold shadow-lg shadow-[#011543]/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#011543]/30 active:translate-y-0 active:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">check</span>
            Approve
          </button>
          <button
            onClick={() => setShowReject(true)}
            className="px-6 py-3 rounded-lg glass-card text-[#011543] font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:bg-[#ffdad6]/40 hover:text-[#ba1a1a] active:translate-y-0 active:shadow-sm transition-all duration-200 cursor-pointer"
          >
            Reject
          </button>
          <button
            onClick={() => setShowClarify(true)}
            className="px-6 py-3 rounded-lg glass-card text-[#011543] font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:bg-[#d2e4ff]/40 hover:text-[#006491] active:translate-y-0 active:shadow-sm transition-all duration-200 cursor-pointer"
          >
            Clarify
          </button>
        </div>
      )}

      {showReject && (
        <div className="bg-[#ffdad6]/30 rounded-xl p-5 space-y-3 border border-[#ba1a1a]/10">
          <p className="text-xs font-bold text-[#93000a] uppercase tracking-wider">Reason for Rejection</p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this PO is being rejected..."
            rows={3}
            className="w-full text-sm bg-white/60 ghost-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#ba1a1a]/20 outline-none resize-none backdrop-blur-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={() => { rejectPO(po.id, reason); setShowReject(false); setReason(""); }}
              disabled={!reason.trim()}
              className="px-5 py-2 bg-[#ba1a1a] text-white text-sm font-bold rounded-lg disabled:opacity-40 transition-all"
            >
              Confirm Rejection
            </button>
            <button onClick={() => { setShowReject(false); setReason(""); }} className="px-4 py-2 text-sm text-[#45464f]">Cancel</button>
          </div>
        </div>
      )}

      {showClarify && (
        <div className="bg-[#d2e4ff]/30 rounded-xl p-5 space-y-3 border border-[#006491]/10">
          <p className="text-xs font-bold text-[#001c37] uppercase tracking-wider">Clarification Request</p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="What information do you need from the requester?"
            rows={3}
            className="w-full text-sm bg-white/60 ghost-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#006491]/20 outline-none resize-none backdrop-blur-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={() => { requestClarification(po.id, reason); setShowClarify(false); setReason(""); }}
              disabled={!reason.trim()}
              className="px-5 py-2 bg-[#006491] text-white text-sm font-bold rounded-lg disabled:opacity-40 transition-all"
            >
              Send Request
            </button>
            <button onClick={() => { setShowClarify(false); setReason(""); }} className="px-4 py-2 text-sm text-[#45464f]">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
