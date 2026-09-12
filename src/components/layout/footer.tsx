import React from "react";
import { ShieldCheck, Server } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#E5E0D6] bg-[#F5F2EB] text-xs text-slate-500 py-6 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Official compliance notes */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="BhoomiDrishti Logo" className="h-10 w-10 object-contain rounded-xl bg-white border border-[#E5E0D6] p-0.5 shrink-0 shadow-2xs" />
          <div className="flex flex-col gap-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-slate-800 font-semibold">
              <span>BhoomiDrishti — National Land Acquisition & Management System</span>
              <span className="text-slate-400">•</span>
              <span className="text-[#0284C7] font-bold">भूमि दृष्टि</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Designed in compliance with the RFCTLARR Act 2013, Guidelines for Indian Government Websites (GIGW 3.0), and STQC / CERT-In security standards.
            </p>
          </div>
        </div>

        {/* Right: Badges & Sovereign Cloud details */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-[#E5E0D6] text-[11px] text-slate-700 font-medium shadow-xs">
            <Server className="h-3.5 w-3.5 text-[#0284C7]" />
            <span>MeghRaj GI Cloud</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-[#E5E0D6] text-[11px] text-slate-700 font-medium shadow-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-[#15803D]" />
            <span>CERT-In Audited</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-[#E5E0D6] text-[11px] text-slate-700 font-medium shadow-xs">
            <span>WCAG 2.1 AA</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-[#E5E0D6] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
        <p>© 2026 Department of Land Resources, Ministry of Rural Development, Government of India.</p>
        <div className="flex items-center gap-4">
          <a href="/public" className="hover:text-[#0284C7] transition-colors">Grievance Redressal</a>
          <a href="/reports" className="hover:text-[#0284C7] transition-colors">Statutory Reports</a>
          <a href="/notifications" className="hover:text-[#0284C7] transition-colors">e-Gazette</a>
        </div>
      </div>
    </footer>
  );
}
