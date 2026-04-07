"use client";

import { useState } from "react";
import { getUserById } from "@/data/users";

export default function CommentThread({ po, onRespond }) {
  const [response, setResponse] = useState("");

  const threads = [];
  for (const [role, approval] of Object.entries(po.approvals || {})) {
    if (approval.clarificationNote) {
      const user = getUserById(approval.userId || (role === "coo" ? "u3" : role === "legal" ? "u2" : "u4"));
      threads.push({ type: "request", user, message: approval.clarificationNote });
    }
    if (approval.clarificationResponse) {
      threads.push({ type: "response", user: getUserById(po.requesterId), message: approval.clarificationResponse });
    }
  }

  if (!threads.length && !onRespond) return null;

  return (
    <div className="space-y-4">
      {threads.map((item, i) => (
        <div key={i} className={`flex gap-3 ${item.type === "response" ? "ml-8" : ""}`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
            item.type === "request" ? "bg-[#d2e4ff] text-[#001c37]" : "bg-[#c9e6ff] text-[#001e2f]"
          }`}>
            {item.user?.avatar || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#011543]">{item.user?.name}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                item.type === "request" ? "bg-[#d2e4ff] text-[#001c37]" : "bg-[#c9e6ff] text-[#001e2f]"
              }`}>
                {item.type === "request" ? "Clarification" : "Response"}
              </span>
            </div>
            <p className="text-sm text-[#45464f] mt-1 bg-white/40 p-3 rounded-lg border border-white/40 leading-relaxed">{item.message}</p>
          </div>
        </div>
      ))}

      {onRespond && (
        <div className="mt-4 pt-4 border-t border-[#c5c6d0]/10">
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Type your response..."
            rows={3}
            className="w-full text-sm bg-white/50 ghost-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3B9AD2]/20 outline-none resize-none backdrop-blur-sm"
          />
          <button
            onClick={() => { onRespond(response); setResponse(""); }}
            disabled={!response.trim()}
            className="mt-2 px-5 py-2 bg-[#006491] text-white text-sm font-bold rounded-lg disabled:opacity-40 transition-all"
          >
            Submit Response
          </button>
        </div>
      )}
    </div>
  );
}
