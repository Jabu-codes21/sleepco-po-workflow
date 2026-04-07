import { ROLES } from "@/data/users";
import { PO_STATUS } from "@/data/purchaseOrders";

const roleLabels = {
  [ROLES.LEGAL]: "Legal Review",
  [ROLES.COO]: "COO Approval",
  [ROLES.CFO]: "CFO Approval",
};

const roleNames = {
  [ROLES.LEGAL]: "Sneha Kapoor",
  [ROLES.COO]: "Karan Singla",
  [ROLES.CFO]: "Hemal Jain",
};

function getStepStatus(po, role) {
  const approval = po.approvals[role];
  if (!approval) return "skipped";
  if (approval.status === "approved") return "done";
  if (approval.status === "rejected") return "rejected";
  if (approval.status === "clarification") return "clarification";

  // Check if it's this step's turn
  if (role === ROLES.LEGAL && po.status === PO_STATUS.PENDING_LEGAL) return "current";
  if (role === ROLES.COO && po.status === PO_STATUS.PENDING_COO) return "current";
  if (role === ROLES.CFO && (po.status === PO_STATUS.PENDING_CFO || po.status === PO_STATUS.CFO_APPROVED)) return "current";

  return "pending";
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) + ", " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function ApprovalStepper({ po }) {
  const steps = [
    { role: "submitted", label: "Submitted", name: "Wani Deoras" },
    ...po.approvalChain.map((role) => ({
      role,
      label: roleLabels[role] || role,
      name: roleNames[role] || role,
    })),
    { role: "signed", label: po.signed ? "Signed" : "E-Signature", name: "Leegality" },
  ];

  return (
    <div className="flex items-start gap-0 overflow-x-auto py-2">
      {steps.map((step, i) => {
        let status;
        if (step.role === "submitted") {
          status = "done";
        } else if (step.role === "signed") {
          status = po.signed ? "done" : (po.status === PO_STATUS.CFO_APPROVED ? "current" : "pending");
        } else {
          status = getStepStatus(po, step.role);
        }

        const isLast = i === steps.length - 1;
        const date = step.role === "submitted"
          ? formatDate(po.createdAt)
          : step.role === "signed"
            ? (po.signedAt ? formatDate(po.signedAt) : null)
            : (po.approvals[step.role]?.date ? formatDate(po.approvals[step.role].date) : null);

        return (
          <div key={i} className="flex items-start shrink-0">
            <div className="flex flex-col items-center min-w-[100px]">
              {/* Circle */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                status === "done" ? "bg-emerald-500 border-emerald-500 text-white" :
                status === "current" ? "bg-white border-primary text-primary" :
                status === "rejected" ? "bg-red-500 border-red-500 text-white" :
                status === "clarification" ? "bg-violet-500 border-violet-500 text-white" :
                "bg-white border-slate-200 text-slate-400"
              }`}>
                {status === "done" ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                ) : status === "rejected" ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : status === "clarification" ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
                ) : status === "current" ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                ) : (
                  <span className="text-xs font-semibold">{i + 1}</span>
                )}
              </div>
              {/* Label */}
              <p className={`text-xs font-medium mt-1.5 text-center ${
                status === "done" ? "text-emerald-700" :
                status === "current" ? "text-primary-dark" :
                status === "rejected" ? "text-red-700" :
                status === "clarification" ? "text-violet-700" :
                "text-slate-400"
              }`}>
                {step.label}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 text-center">{step.name}</p>
              {date && <p className="text-[10px] text-slate-400 mt-0.5">{date}</p>}
            </div>
            {/* Connector line */}
            {!isLast && (
              <div className={`h-[2px] w-10 mt-[18px] shrink-0 ${
                status === "done" ? "bg-emerald-400" :
                status === "rejected" ? "bg-red-300" :
                "bg-slate-200"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
