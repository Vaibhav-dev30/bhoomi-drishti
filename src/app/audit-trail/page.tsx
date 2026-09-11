"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Lock,
  UserCheck,
  Calendar,
  Layers,
  FileSpreadsheet,
  Building2,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/context/app-context";
import { AuditLogEntry } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AuditTrailPage() {
  const { auditLogs, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState<string>("ALL");

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchAction = filterAction === "ALL" || log.action === filterAction;
      const matchSearch =
        !searchQuery ||
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.targetResource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.userRole.toLowerCase().includes(searchQuery.toLowerCase());
      return matchAction && matchSearch;
    });
  }, [auditLogs, filterAction, searchQuery]);

  const exportCSV = () => {
    const headers = ["Log ID", "Timestamp", "User", "Designation", "Jurisdiction", "Action", "Target Resource", "Details", "IP Address"];
    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.userName}"`,
      `"${l.userRole}"`,
      `"${l.userJurisdiction}"`,
      l.action,
      `"${l.targetResource}"`,
      `"${l.details}"`,
      l.ipAddress,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `BhoomiDrishti_Audit_Trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getActionBadge = (action: AuditLogEntry["action"]) => {
    switch (action) {
      case "ACCESS_REQUEST_APPROVED":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Sanction Approved</Badge>;
      case "ACCESS_REQUEST_REJECTED":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Sanction Rejected</Badge>;
      case "ACCESS_REQUEST_SUBMITTED":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Access Requested</Badge>;
      case "CROSS_JURISDICTION_ACCESS":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Cross-Jurisdiction</Badge>;
      case "LOGIN":
        return <Badge className="bg-sky-100 text-sky-800 border-sky-200">Auth Login</Badge>;
      case "LOGOUT":
        return <Badge className="bg-slate-100 text-slate-700 border-slate-200">Auth Logout</Badge>;
      case "SIGNUP":
        return <Badge className="bg-teal-100 text-teal-800 border-teal-200">Officer Onboarded</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#E5E0D6] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Statutory Compliance Registry</span>
              </span>
              <span className="text-xs text-slate-500 font-mono">RFCTLARR Act Sec 101</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
              National Land Records Audit Trail
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Immutable digital ledger of all administrator sign-ins, jurisdiction-boundary crossings, and senior sanction orders.
            </p>
          </div>

          <Button
            onClick={exportCSV}
            size="sm"
            className="gap-2 bg-[#15803D] hover:bg-[#166534] text-white font-bold shrink-0 shadow-xs"
          >
            <Download className="h-4 w-4" />
            <span>Export Official CSV</span>
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E5E0D6] shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by officer, target, or details..."
            className="w-full pl-9 pr-3 py-1.5 border border-[#E5E0D6] rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#15803D]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Action:</span>
          {["ALL", "ACCESS_REQUEST_SUBMITTED", "ACCESS_REQUEST_APPROVED", "LOGIN", "SIGNUP"].map((act) => (
            <button
              key={act}
              onClick={() => setFilterAction(act)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterAction === act
                  ? "bg-slate-900 text-white"
                  : "bg-[#FAF8F5] text-slate-600 border border-[#E5E0D6] hover:bg-[#F2EFE8]"
              }`}
            >
              {act === "ALL" ? "All Events" : act.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border border-[#E5E0D6] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF8F5] border-b border-[#E5E0D6] text-slate-700 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Event ID</th>
                <th className="p-4">Timestamp (IST)</th>
                <th className="p-4">Officer / Authority</th>
                <th className="p-4">Action Type</th>
                <th className="p-4">Target Resource</th>
                <th className="p-4">Action Details</th>
                <th className="p-4">IP / Terminal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-700">{log.id}</td>
                  <td className="p-4 font-mono text-slate-600 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{log.userName}</div>
                    <div className="text-[11px] text-slate-500">{log.userRole}</div>
                    <div className="text-[10px] font-mono text-[#0284C7]">{log.userJurisdiction}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap">{getActionBadge(log.action)}</td>
                  <td className="p-4 font-semibold text-slate-800">{log.targetResource}</td>
                  <td className="p-4 text-slate-600 max-w-sm">{log.details}</td>
                  <td className="p-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
