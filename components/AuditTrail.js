"use client";

import { useApp } from "@/context/AppContext";
import { getUserById } from "@/data/users";
import { actionLabels } from "@/data/auditLogs";

function formatTimestamp(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) + ", " +
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

const actionDotColors = {
  created: "bg-[#006491]",
  approved: "bg-[#006491]",
  rejected: "bg-[#ba1a1a]",
  clarification_requested: "bg-[#2c4869]",
  clarification_responded: "bg-[#3B9AD2]",
  signed: "bg-[#354573]",
  edited: "bg-[#757680]",
};

export default function AuditTrail({ poId }) {
  const { getLogsForPO } = useApp();
  const logs = getLogsForPO(poId);

  if (!logs.length) return <p className="text-xs text-[#757680] text-center py-4">No entries yet</p>;

  return (
    <div className="space-y-5">
      {logs.map((log) => {
        const user = getUserById(log.userId);
        return (
          <div key={log.id} className="flex gap-3">
            <div className={`flex-shrink-0 w-1.5 h-1.5 mt-1.5 rounded-full ${actionDotColors[log.action] || "bg-[#757680]"}`} />
            <div className="text-[12px]">
              <span className="font-bold text-[#011543]">{user?.name || "System"}</span>
              {" "}
              <span className="text-[#45464f]">
                {log.action === "created" ? "submitted the PO" :
                 log.action === "approved" ? "approved" :
                 log.action === "rejected" ? "rejected" :
                 log.action === "clarification_requested" ? "requested clarification" :
                 log.action === "clarification_responded" ? "responded" :
                 log.action === "signed" ? "applied e-signature" :
                 actionLabels[log.action]}
              </span>
              {log.details && log.action !== "created" && (
                <p className="text-[#45464f] bg-white/40 p-2 rounded-lg mt-1 border border-white/40 text-[11px] italic leading-relaxed">
                  {log.details}
                </p>
              )}
              <div className="text-[10px] text-[#757680] mt-1">
                {formatTimestamp(log.timestamp)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
