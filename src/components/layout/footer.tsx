import React from "react";
import { ShieldCheck, Server, FileText, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/90 text-xs text-slate-400 py-6 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Official compliance notes */}
        <div className="flex flex-col gap-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-slate-300 font-medium">
            <span>BhoomiDrishti — National Land Acquisition & Management System</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400">भूमि दृष्टि</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Designed in compliance with the RFCTLARR Act 2013, Guidelines for Indian Government Websites (GIGW 3.0), and STQC / CERT-In security standards.
          </p>
        </div>

        {/* Right: Badges & Sovereign Cloud details */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
            <Server className="h-3 w-3 text-emerald-400" />
            <span>MeghRaj GI Cloud</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span>CERT-In Audited</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
            <span>WCAG 2.1 AA</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600 gap-2">
        <p>© 2026 Department of Land Resources, Ministry of Rural Development, Government of India.</p>
        <div className="flex items-center gap-4">
          <a href="/public" className="hover:text-slate-400 transition-colors">Grievance Redressal</a>
          <a href="/reports" className="hover:text-slate-400 transition-colors">Statutory Reports</a>
          <a href="/notifications" className="hover:text-slate-400 transition-colors">e-Gazette</a>
        </div>
      </div>
    </footer>
  );
}
