"use client";

import { AppProvider } from "@/context/AppContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function ClientLayout({ children }) {
  return (
    <AppProvider>
      <div className="min-h-screen relative overflow-hidden">
        {/* Organic background blobs */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="blob bg-[#011543] w-[500px] h-[500px] -top-48 -left-24" />
          <div className="blob bg-[#006491] w-[400px] h-[400px] top-1/2 -right-24" />
          <div className="blob bg-[#7b97bc] w-[600px] h-[600px] -bottom-48 left-1/3" />
        </div>

        <Sidebar />
        <Header />
        <main className="ml-64 pt-24 pb-12 px-10 relative z-10">
          {children}
        </main>
      </div>
    </AppProvider>
  );
}
