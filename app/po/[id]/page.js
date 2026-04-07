"use client";

import { use, useState } from "react";
import { useApp } from "@/context/AppContext";
import { ROLES, getUserById } from "@/data/users";
import { PO_STATUS } from "@/data/purchaseOrders";
import StatusBadge from "@/components/StatusBadge";
import AuditTrail from "@/components/AuditTrail";
import ActionButtons from "@/components/ActionButtons";
import CommentThread from "@/components/CommentThread";
import ESignatureModal from "@/components/ESignatureModal";
import Link from "next/link";

function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function formatTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) + ", " +
    new Date(dateStr).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

const roleLabels = { legal: "Legal Review", coo: "COO Approval", cfo: "CFO Approval" };
const roleNames = { legal: "Sneha Kapoor", coo: "Karan Singla", cfo: "Hemal Jain" };

function getStepStatus(po, role) {
  const a = po.approvals[role];
  if (!a) return "skipped";
  if (a.status === "approved") return "done";
  if (a.status === "rejected") return "rejected";
  if (a.status === "clarification") return "clarification";
  if (role === "legal" && po.status === PO_STATUS.PENDING_LEGAL) return "active";
  if (role === "coo" && po.status === PO_STATUS.PENDING_COO) return "active";
  if (role === "cfo" && (po.status === PO_STATUS.PENDING_CFO || po.status === PO_STATUS.CFO_APPROVED)) return "active";
  return "pending";
}

export default function PODetail({ params }) {
  const { id } = use(params);
  const { purchaseOrders, currentUser, signPO, respondToClarification } = useApp();
  const [showSignModal, setShowSignModal] = useState(false);
  const po = purchaseOrders.find((p) => p.id === id);

  if (!po) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <span className="material-symbols-outlined text-4xl text-[#c5c6d0] block mb-3">search_off</span>
        <p className="text-[#45464f]">Purchase order not found.</p>
        <Link href="/" className="text-sm text-[#3B9AD2] mt-2 inline-block hover:underline">Back to dashboard</Link>
      </div>
    );
  }

  const requester = getUserById(po.requesterId);
  const isCFOReadyToSign = currentUser.role === ROLES.CFO && po.status === PO_STATUS.CFO_APPROVED;
  const isRequesterClarification = currentUser.role === ROLES.REQUESTER && po.status === PO_STATUS.CLARIFICATION_REQUESTED;

  // Build stepper steps
  const steps = [
    { role: "submitted", label: "Submitted", name: requester?.name || "Requester", status: "done", date: po.createdAt },
    ...po.approvalChain.map((role) => ({
      role,
      label: roleLabels[role],
      name: roleNames[role],
      status: getStepStatus(po, role),
      date: po.approvals[role]?.date,
    })),
    {
      role: "signed", label: po.signed ? "Signed" : "E-Signature", name: "Leegality",
      status: po.signed ? "done" : (po.status === PO_STATUS.CFO_APPROVED ? "active" : "pending"),
      date: po.signedAt,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#45464f] font-medium">
        <Link href="/" className="hover:text-[#006491] transition-colors">Dashboard</Link>
        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
        <span className="text-[#006491]">{po.poNumber}</span>
      </nav>

      {/* Hero header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-[var(--font-headline)] text-4xl font-extrabold text-[#011543] tracking-tight">
            Purchase Order Detail
          </h1>
        </div>
        <div className="flex gap-3">
          {isCFOReadyToSign && (
            <button
              onClick={() => setShowSignModal(true)}
              className="px-8 py-2.5 rounded-lg bg-gradient-to-b from-[#1a2b58] to-[#011543] text-white font-bold shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">draw</span>
              Approve & Sign
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left column */}
        <div className="col-span-8 space-y-8">
          {/* Main PO Card */}
          <section className="glass-card rounded-2xl p-8">
            <div className="flex justify-between items-start mb-8">
              <div className="flex gap-5">
                <div className="w-14 h-14 rounded-2xl bg-[#1a2b58] flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
                </div>
                <div>
                  <h2 className="font-[var(--font-headline)] text-2xl font-bold text-[#011543]">{po.poNumber}</h2>
                  <p className="text-[#45464f] font-medium text-sm">{po.vendorName}</p>
                </div>
              </div>
              <div className="text-right">
                <StatusBadge status={po.status} size="lg" />
                <p className="mt-2 text-3xl font-black text-[#011543] font-[var(--font-headline)]">{formatINR(po.amount)}</p>
                <p className="text-xs text-[#45464f] mt-0.5">{po.paymentTerms}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-10 pt-6 border-t border-[#c5c6d0]/20">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#45464f]">Requester</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-8 h-8 rounded-full bg-[#e8e8e8] flex items-center justify-center text-[10px] font-bold text-[#011543]">
                    {requester?.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#011543]">{requester?.name}</p>
                    <p className="text-[10px] text-[#45464f]">{requester?.title}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#45464f]">Department</p>
                <p className="text-sm font-bold text-[#011543] mt-2">{po.department}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#45464f]">Timeline</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#45464f]">Submitted:</span>
                    <span className="font-bold text-[#011543]">{formatDate(po.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#45464f]">Delivery by:</span>
                    <span className="font-bold text-[#011543]">{formatDate(po.deliveryDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="glass-card rounded-2xl p-8">
            <h3 className="font-[var(--font-headline)] text-lg font-bold text-[#011543] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006491]" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
              Description & Justification
            </h3>
            <p className="text-sm text-[#45464f] leading-relaxed">{po.description}</p>
          </section>

          {/* Attachments */}
          <section className="glass-card rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-[var(--font-headline)] text-lg font-bold text-[#011543] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006491]" style={{ fontVariationSettings: "'FILL' 1" }}>attachment</span>
                Supporting Documents
              </h3>
              <button className="text-[#006491] text-xs font-bold flex items-center gap-1 hover:underline">
                <span className="material-symbols-outlined text-sm">download</span>
                Download All
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(po.attachments || []).map((file, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#f3f3f3] rounded-xl border border-white/40 hover:bg-white/60 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                    <div className="text-xs">
                      <p className="font-bold text-[#011543]">{file.name}</p>
                      <p className="text-[#45464f]">{file.size}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#757680] text-sm">download</span>
                </div>
              ))}
            </div>
          </section>

          {/* Clarification Thread */}
          {(po.status === PO_STATUS.CLARIFICATION_REQUESTED || Object.values(po.approvals || {}).some(a => a.clarificationNote)) && (
            <section className="glass-card rounded-2xl p-8">
              <h3 className="font-[var(--font-headline)] text-lg font-bold text-[#011543] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006491]">forum</span>
                Clarification Thread
              </h3>
              <CommentThread po={po} onRespond={isRequesterClarification ? (r) => respondToClarification(po.id, r) : null} />
            </section>
          )}

          {/* Action buttons (non-CFO-sign) */}
          {!isCFOReadyToSign && (
            <section className="glass-card rounded-2xl p-8">
              <h3 className="font-[var(--font-headline)] text-sm font-bold text-[#011543] mb-4">Actions</h3>
              <ActionButtons po={po} />
              {currentUser.role === ROLES.ADMIN && (
                <p className="text-[10px] text-[#757680] mt-3">Admin view is read-only. Switch role to take action.</p>
              )}
            </section>
          )}
        </div>

        {/* Right column */}
        <div className="col-span-4 space-y-8">
          {/* Approval Stepper */}
          <section className="glass-card rounded-2xl p-8">
            <h3 className="font-[var(--font-headline)] text-lg font-bold text-[#011543] mb-8">Approval Progress</h3>
            <div className="relative">
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-[#006491]/10" />
              <div className="space-y-8 relative">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 shrink-0 ${
                      step.status === "done" ? "bg-[#006491]" :
                      step.status === "active" ? "bg-white border-2 border-[#006491]" :
                      step.status === "rejected" ? "bg-[#ba1a1a]" :
                      step.status === "clarification" ? "bg-[#2c4869]" :
                      "bg-[#e2e2e2]"
                    }`}>
                      {step.status === "done" ? (
                        <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                      ) : step.status === "active" ? (
                        <div className="w-2 h-2 rounded-full bg-[#006491] animate-pulse" />
                      ) : step.status === "rejected" ? (
                        <span className="material-symbols-outlined text-white text-sm">close</span>
                      ) : step.status === "clarification" ? (
                        <span className="material-symbols-outlined text-white text-sm">help</span>
                      ) : (
                        <span className="material-symbols-outlined text-[#45464f] text-sm">lock</span>
                      )}
                    </div>
                    <div className={step.status === "pending" ? "opacity-40" : ""}>
                      <p className={`text-sm font-bold ${
                        step.status === "active" ? "text-[#006491]" :
                        step.status === "rejected" ? "text-[#ba1a1a]" :
                        "text-[#011543]"
                      }`}>
                        {step.label}
                      </p>
                      <p className="text-[11px] text-[#45464f]">
                        {step.status === "active" ? `Active Step • ${step.name}` :
                         step.status === "pending" ? "Pending Previous Steps" :
                         `${step.name}${step.date ? " • " + formatTime(step.date) : ""}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Audit Trail */}
          <section className="glass-card rounded-2xl p-6">
            <h3 className="font-[var(--font-headline)] text-sm font-bold text-[#011543] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#757680] text-lg">history</span>
              Audit Trail
            </h3>
            <AuditTrail poId={po.id} />
            <button className="w-full mt-6 py-2 border border-[#006491]/20 rounded-lg text-[#006491] text-xs font-bold hover:bg-[#006491]/5 transition-colors">
              View Full Log
            </button>
          </section>
        </div>
      </div>

      {showSignModal && (
        <ESignatureModal po={po} onSign={() => signPO(po.id)} onClose={() => setShowSignModal(false)} />
      )}
    </div>
  );
}
