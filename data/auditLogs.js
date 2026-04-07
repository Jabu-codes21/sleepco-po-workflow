export const initialAuditLogs = [
  // PO-042: Fully approved
  { id: "al-001", poId: "po-042", userId: "u1", action: "created", details: "PO submitted for Sheela Foam Industries", timestamp: "2026-03-15T10:32:00", before: null, after: "pending_legal" },
  { id: "al-002", poId: "po-042", userId: "u2", action: "approved", details: "Legal review approved. Contract terms verified against annual rate card.", timestamp: "2026-03-16T14:20:00", before: "pending_legal", after: "pending_coo" },
  { id: "al-003", poId: "po-042", userId: "u3", action: "approved", details: "Operational approval granted. Quantity aligned with Q2 production forecast.", timestamp: "2026-03-17T11:05:00", before: "pending_coo", after: "pending_cfo" },
  { id: "al-004", poId: "po-042", userId: "u4", action: "approved", details: "Financial approval granted.", timestamp: "2026-03-19T16:45:00", before: "pending_cfo", after: "approved" },
  { id: "al-005", poId: "po-042", userId: "u4", action: "signed", details: "E-signature applied via Leegality. Document ID: LEG-2026-04892", timestamp: "2026-03-19T16:48:00", before: "approved", after: "approved" },

  // PO-043: Pending CFO
  { id: "al-006", poId: "po-043", userId: "u1", action: "created", details: "PO submitted for Welspun India Ltd", timestamp: "2026-03-28T09:15:00", before: null, after: "pending_legal" },
  { id: "al-007", poId: "po-043", userId: "u2", action: "approved", details: "Legal review approved. Rate contract reference verified.", timestamp: "2026-03-29T10:45:00", before: "pending_legal", after: "pending_coo" },
  { id: "al-008", poId: "po-043", userId: "u3", action: "approved", details: "Approved. Fabric specs match production requirement.", timestamp: "2026-04-02T13:30:00", before: "pending_coo", after: "pending_cfo" },

  // PO-044: Approved (small amount, COO only)
  { id: "al-009", poId: "po-044", userId: "u1", action: "created", details: "PO submitted for BlueDart Express Ltd", timestamp: "2026-04-01T11:00:00", before: null, after: "pending_coo" },
  { id: "al-010", poId: "po-044", userId: "u3", action: "approved", details: "Approved. Pune store launch logistics confirmed.", timestamp: "2026-04-01T15:20:00", before: "pending_coo", after: "approved" },

  // PO-045: Clarification requested
  { id: "al-011", poId: "po-045", userId: "u1", action: "created", details: "PO submitted for Packmatic Industries", timestamp: "2026-04-02T14:30:00", before: null, after: "pending_coo" },
  { id: "al-012", poId: "po-045", userId: "u3", action: "clarification_requested", details: "Rate is 15% higher than last quarter. Requesting revised quote or vendor comparison.", timestamp: "2026-04-04T09:15:00", before: "pending_coo", after: "clarification_requested" },

  // PO-046: Pending COO
  { id: "al-013", poId: "po-046", userId: "u1", action: "created", details: "PO submitted for Godrej Interio — Koramangala store fit-out", timestamp: "2026-04-03T10:00:00", before: null, after: "pending_legal" },
  { id: "al-014", poId: "po-046", userId: "u2", action: "approved", details: "Legal review approved. Fit-out proposal terms are standard.", timestamp: "2026-04-05T11:30:00", before: "pending_legal", after: "pending_coo" },

  // PO-047: Rejected
  { id: "al-015", poId: "po-047", userId: "u1", action: "created", details: "PO submitted for Rajasthan Synthetics — new vendor trial", timestamp: "2026-03-25T08:45:00", before: null, after: "pending_coo" },
  { id: "al-016", poId: "po-047", userId: "u3", action: "rejected", details: "Rejected. New vendor requires QC pre-approval on sample batch before any PO.", timestamp: "2026-03-27T14:00:00", before: "pending_coo", after: "rejected" },

  // PO-048: Pending Legal
  { id: "al-017", poId: "po-048", userId: "u1", action: "created", details: "PO submitted for SupplyNote Technologies — annual SaaS renewal", timestamp: "2026-04-05T16:00:00", before: null, after: "pending_legal" },
];

export const actionLabels = {
  created: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
  clarification_requested: "Clarification Requested",
  clarification_responded: "Clarification Responded",
  signed: "E-Signed",
  edited: "Edited",
};

export const actionColors = {
  created: "text-blue-600",
  approved: "text-emerald-600",
  rejected: "text-red-600",
  clarification_requested: "text-violet-600",
  clarification_responded: "text-sky-600",
  signed: "text-indigo-600",
  edited: "text-slate-600",
};
