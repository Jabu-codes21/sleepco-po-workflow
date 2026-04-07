"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { vendors } from "@/data/vendors";
import { departments } from "@/data/purchaseOrders";
import { getSlabForAmount } from "@/data/doaMatrix";
import Link from "next/link";

export default function SubmitPO() {
  const { addPurchaseOrder } = useApp();
  const router = useRouter();
  const [form, setForm] = useState({ vendorId: "", department: "", amount: "", description: "", paymentTerms: "Net 30", deliveryDate: "" });
  const [submitted, setSubmitted] = useState(false);
  const [newPO, setNewPO] = useState(null);

  const selectedVendor = vendors.find((v) => v.id === form.vendorId);
  const amount = parseFloat(form.amount) || 0;
  const slab = amount > 0 ? getSlabForAmount(amount) : null;
  const canSubmit = form.vendorId && form.department && amount > 0 && form.description && form.deliveryDate;

  const handleSubmit = (e) => {
    e.preventDefault();
    const po = addPurchaseOrder({
      vendorId: form.vendorId, vendorName: selectedVendor?.name || "", department: form.department,
      amount, description: form.description, paymentTerms: form.paymentTerms, deliveryDate: form.deliveryDate,
      attachments: [{ name: `${selectedVendor?.name?.replace(/\s+/g, "_")}_Quotation.pdf`, size: "1.2 MB" }],
    });
    setNewPO(po);
    setSubmitted(true);
  };

  if (submitted && newPO) {
    return (
      <div className="max-w-xl mx-auto mt-12">
        <div className="glass-card rounded-2xl p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-[#006491]/10 flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-[#006491] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h2 className="font-[var(--font-headline)] text-2xl font-extrabold text-[#011543]">Order Submitted</h2>
          <p className="text-sm text-[#45464f] mt-1">Routed for approval automatically</p>
          <div className="bg-[#f3f3f3] rounded-xl p-5 mt-6 text-left space-y-3">
            <div className="flex justify-between text-sm"><span className="text-[#45464f]">PO Number</span><span className="font-mono font-bold text-[#006491]">{newPO.poNumber}</span></div>
            <div className="flex justify-between text-sm"><span className="text-[#45464f]">Vendor</span><span className="font-semibold text-[#011543]">{newPO.vendorName}</span></div>
            <div className="flex justify-between text-sm"><span className="text-[#45464f]">Amount</span><span className="font-bold text-[#011543]">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(newPO.amount)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-[#45464f]">Route</span><span className="font-medium text-[#006491]">{slab?.description}</span></div>
          </div>
          <div className="flex gap-3 mt-8 justify-center">
            <Link href={`/po/${newPO.id}`} className="px-6 py-2.5 rounded-lg bg-[#011543] text-white font-bold hover:-translate-y-0.5 transition-all">View Details</Link>
            <Link href="/" className="px-6 py-2.5 rounded-lg glass-card text-[#011543] font-semibold hover:bg-white/40 transition-all">Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = "w-full bg-white/50 ghost-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#3B9AD2]/20 outline-none transition-all backdrop-blur-sm";

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <nav className="flex items-center gap-2 text-xs text-[#45464f] font-medium mb-2">
          <Link href="/" className="hover:text-[#006491] transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            Back to Dashboard
          </Link>
        </nav>
        <h2 className="font-[var(--font-headline)] text-4xl font-extrabold text-[#011543] tracking-tight">Create New Purchase Order</h2>
        <p className="text-[#45464f] mt-2 max-w-2xl">Complete the procurement details below. The PO will be automatically routed based on the amount threshold.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-8">
        {/* Left column */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* General Info */}
          <section className="glass-card rounded-xl p-8 space-y-6 ambient-glow">
            <div className="flex items-center gap-3 border-b border-[#c5c6d0]/10 pb-4">
              <span className="material-symbols-outlined text-[#006491]" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
              <h3 className="font-[var(--font-headline)] font-bold text-lg text-[#011543]">General Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#45464f]">Department</label>
                <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className={inputClass}>
                  <option value="">Select department...</option>
                  {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#45464f]">Expected Delivery</label>
                <input type="date" value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#45464f]">Description & Justification</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Describe the purpose of this procurement..." className={`${inputClass} resize-none`} />
            </div>
          </section>

          {/* Attachments */}
          <section className="glass-card rounded-xl p-8 space-y-4 ambient-glow">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#45464f]">Supporting Documents</h4>
            <div className="border-2 border-dashed border-[#c5c6d0]/30 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#006491] transition-colors">
              <span className="material-symbols-outlined text-3xl text-[#45464f] mb-2">upload_file</span>
              <p className="text-xs font-medium text-[#45464f]">Drag and drop spec sheets or vendor quotations</p>
              <p className="text-[10px] text-[#757680] mt-1">PDF, Excel, or images up to 25MB</p>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Vendor */}
          <section className="glass-card rounded-xl p-6 space-y-6 ambient-glow">
            <div className="flex items-center gap-3 border-b border-[#c5c6d0]/10 pb-4">
              <span className="material-symbols-outlined text-[#006491]" style={{ fontVariationSettings: "'FILL' 1" }}>handshake</span>
              <h3 className="font-[var(--font-headline)] font-bold text-lg text-[#011543]">Vendor Select</h3>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#45464f]">Primary Vendor</label>
              <select value={form.vendorId} onChange={(e) => setForm({ ...form, vendorId: e.target.value })} className={inputClass}>
                <option value="">Select vendor...</option>
                {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
            {selectedVendor && (
              <div className="bg-[#1a2b58] p-4 rounded-xl text-white space-y-3 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <span className="material-symbols-outlined text-6xl">verified</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-[#8393c7] font-bold">{selectedVendor.category}</p>
                <p className="text-sm font-bold">{selectedVendor.name}</p>
                <div className="text-[10px] text-[#8393c7] flex gap-3">
                  <span>{selectedVendor.location}</span>
                </div>
              </div>
            )}
          </section>

          {/* Amount & Submit */}
          <section className="glass-card rounded-xl p-6 space-y-6 ambient-glow border-2 border-[#006491]/10">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#45464f]">Amount (INR)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#45464f] font-bold">&#8377;</span>
                <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0" className={`${inputClass} pl-7`} />
              </div>
              {slab && <p className="text-[11px] text-[#006491] font-bold mt-1">Route: {slab.description}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#45464f]">Payment Terms</label>
              <select value={form.paymentTerms} onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })} className={inputClass}>
                <option>Net 15</option><option>Net 30</option><option>Net 45</option><option>Net 60</option>
                <option>50% advance, 50% on completion</option><option>Annual upfront</option>
              </select>
            </div>
            {amount > 0 && (
              <div className="pt-4 border-t border-[#c5c6d0]/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#45464f]">Grand Total</p>
                <p className="text-3xl font-[var(--font-headline)] font-extrabold text-[#011543]">
                  {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)}
                </p>
              </div>
            )}
            <div className="space-y-3 pt-4">
              <button type="submit" disabled={!canSubmit} className="w-full py-4 bg-gradient-to-b from-[#1a2b58] to-[#011543] text-white rounded-lg font-bold shadow-lg shadow-[#011543]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                <span className="material-symbols-outlined text-sm">send</span>
                Submit for Approval
              </button>
              <button type="button" className="w-full py-3 bg-white/20 hover:bg-white/40 border border-white/40 backdrop-blur-md text-[#011543] rounded-lg font-bold transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">save</span>
                Save as Draft
              </button>
            </div>
            {slab && (
              <div className="flex items-start gap-3 p-4 bg-[#006491]/5 rounded-lg border border-[#006491]/10">
                <span className="material-symbols-outlined text-[#006491] text-sm mt-0.5">info</span>
                <p className="text-[11px] leading-relaxed text-[#45464f]">
                  This PO will be automatically routed via {slab.description} since the amount falls in the {slab.label} slab.
                </p>
              </div>
            )}
          </section>
        </div>
      </form>
    </div>
  );
}
