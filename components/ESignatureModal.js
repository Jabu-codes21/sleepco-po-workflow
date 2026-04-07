"use client";

import { useState } from "react";

export default function ESignatureModal({ po, onSign, onClose }) {
  const [step, setStep] = useState(1); // 1: confirm, 2: OTP, 3: signing, 4: done
  const [otp, setOtp] = useState("");

  const handleSendOTP = () => setStep(2);

  const handleVerifyOTP = () => {
    setStep(3);
    // Simulate signing delay
    setTimeout(() => {
      setStep(4);
    }, 1500);
  };

  const handleDone = () => {
    onSign();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Digital Signature</h3>
              <p className="text-xs text-indigo-200">Powered by Leegality</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Document</span>
                  <span className="font-medium text-slate-800">{po.poNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Vendor</span>
                  <span className="font-medium text-slate-800">{po.vendorName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-semibold text-slate-800">
                    {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(po.amount)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                By signing, you confirm that you have reviewed and approved this purchase order. An Aadhaar OTP will be sent to your registered mobile number.
              </p>
              <button
                onClick={handleSendOTP}
                className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Send Aadhaar OTP
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-800">Enter OTP</p>
                <p className="text-xs text-slate-500 mt-1">OTP sent to mobile ending ****7890</p>
              </div>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit OTP"
                className="w-full text-center text-2xl font-mono tracking-[0.5em] py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={handleVerifyOTP}
                disabled={otp.length < 6}
                className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Verify & Sign
              </button>
              <p className="text-xs text-center text-slate-400">
                Demo mode — enter any 6 digits
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto animate-spin">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-700">Applying digital signature...</p>
              <p className="text-xs text-slate-400">Validating with Leegality</p>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-700">Document Signed Successfully</p>
                <p className="text-xs text-slate-500 mt-1">
                  Document ID: LEG-2026-{String(Date.now()).slice(-5)}
                </p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 text-xs text-emerald-700">
                Signed PDF has been generated and saved. The requester will be notified via email.
              </div>
              <button
                onClick={handleDone}
                className="w-full py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
