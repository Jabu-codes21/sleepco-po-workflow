"use client";

import { useState, useEffect, useCallback } from "react";

let toastHandler = null;

export function showToast(message, type = "success") {
  if (toastHandler) toastHandler({ message, type, id: Date.now() });
}

const icons = {
  success: "check_circle",
  error: "error",
  info: "info",
  warning: "warning",
};

const colors = {
  success: "bg-[#e6f4ea] text-[#1a7431] border-[#1a7431]/20",
  error: "bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]/20",
  info: "bg-[#d2e4ff] text-[#001c37] border-[#006491]/20",
  warning: "bg-[#fff3e0] text-[#7a4100] border-[#7a4100]/20",
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 3000);
  }, []);

  useEffect(() => {
    toastHandler = addToast;
    return () => { toastHandler = null; };
  }, [addToast]);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-5 py-3 rounded-xl border shadow-lg animate-[slideUp_0.3s_ease-out] ${colors[toast.type] || colors.success}`}
          style={{ animation: "slideUp 0.3s ease-out" }}
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {icons[toast.type] || icons.success}
          </span>
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
