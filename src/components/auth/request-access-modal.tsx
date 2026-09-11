"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  X,
  Lock,
  ArrowRight,
  Clock,
  Building2,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/context/app-context";
import { JurisdictionLevel } from "@/types";
import { Button } from "@/components/ui/button";

interface RequestAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: "project" | "district" | "state" | "plots";
  targetId: string;
  targetName: string;
  targetState?: string;
  targetDistrict?: string;
  seniorAuthorityName?: string;
  seniorAuthorityRole?: string;
}

export function RequestAccessModal({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetName,
  targetState,
  targetDistrict,
  seniorAuthorityName,
  seniorAuthorityRole,
}: RequestAccessModalProps) {
  const { currentUser, submitAccessRequest } = useApp();

  const [reason, setReason] = useState("");
  const [durationDays, setDurationDays] = useState(14);
  const [requestedScope, setRequestedScope] = useState<"full_project" | "gis_only" | "valuation_only">("full_project");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState("");

  if (!isOpen || !currentUser) return null;

  // Determine senior routing authority
  let routedToLevel: JurisdictionLevel = "national";
  let routedToRole = seniorAuthorityRole || "central_ministry";
  let approverTitle = seniorAuthorityName || "Smt. Rashmi Verma, IAS (Joint Secretary, Central Ministry)";

  if (currentUser.jurisdiction.level === "district") {
    routedToLevel = "state";
    routedToRole = "state_government";
    approverTitle = currentUser.parentAuthorityName || "Principal Secretary (Revenue), State Government";
  } else if (currentUser.jurisdiction.level === "project" || currentUser.jurisdiction.level === "tehsil") {
    routedToLevel = "district";
    routedToRole = "district_collector";
    approverTitle = currentUser.parentAuthorityName || "District Collector & CALA";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setSubmitting(true);
    try {
      const newReq = await submitAccessRequest({
        targetType,
        targetId,
        targetName,
        reason: reason.trim(),
        durationDays,
        routedToLevel,
        routedToRole,
      });
      setCreatedRequestId(newReq.id);
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit request", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setReason("");
    setCreatedRequestId("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl border border-[#E5E0D6] shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#F2EFE8]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  Restricted Jurisdiction
                </span>
                <span className="text-[11px] font-mono text-slate-400">RFCTLARR Sec 101</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                Request Inter-Jurisdiction Access
              </h3>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-[#FAF8F5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Target Explanation Banner */}
            <div className="bg-[#FAF8F5] border border-[#E5E0D6] rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Requested Resource:</span>
                <span className="font-mono font-bold text-slate-900">{targetId}</span>
              </div>
              <div className="font-bold text-sm text-slate-900">{targetName}</div>
              <div className="text-slate-600 text-[11px]">
                Location: <strong>{targetDistrict || "District"}, {targetState || "State"}</strong> (Outside your designated authority of{" "}
                <strong className="text-slate-900">{currentUser.jurisdiction.displayText}</strong>)
              </div>
            </div>

            {/* Hierarchical Routing Badge */}
            <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-3 text-sky-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[11px] text-sky-900">
                <Building2 className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Automated Statutory Routing</span>
              </div>
              <p className="text-[11px] text-sky-800 leading-relaxed">
                Based on your rank as <strong>{currentUser.designation}</strong>, this request is being routed to:
              </p>
              <div className="font-semibold text-xs text-sky-950 bg-white/70 px-2.5 py-1 rounded-lg border border-sky-100">
                {approverTitle}
              </div>
            </div>

            {/* Scoped Permissions Selection */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">Requested Access Scope</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRequestedScope("full_project")}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    requestedScope === "full_project"
                      ? "bg-emerald-50 border-[#15803D] text-[#15803D] font-bold"
                      : "bg-[#FAF8F5] border-[#E5E0D6] text-slate-600 hover:bg-[#F2EFE8]"
                  }`}
                >
                  <span className="block text-[11px]">Full Project</span>
                  <span className="text-[10px] text-slate-500 font-normal">CAD & Valuation</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRequestedScope("gis_only")}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    requestedScope === "gis_only"
                      ? "bg-emerald-50 border-[#15803D] text-[#15803D] font-bold"
                      : "bg-[#FAF8F5] border-[#E5E0D6] text-slate-600 hover:bg-[#F2EFE8]"
                  }`}
                >
                  <span className="block text-[11px]">GIS Plots Only</span>
                  <span className="text-[10px] text-slate-500 font-normal">Spatial Boundaries</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRequestedScope("valuation_only")}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    requestedScope === "valuation_only"
                      ? "bg-emerald-50 border-[#15803D] text-[#15803D] font-bold"
                      : "bg-[#FAF8F5] border-[#E5E0D6] text-slate-600 hover:bg-[#F2EFE8]"
                  }`}
                >
                  <span className="block text-[11px]">Audit / R&R</span>
                  <span className="text-[10px] text-slate-500 font-normal">Compensation Data</span>
                </button>
              </div>
            </div>

            {/* Validity Duration */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">Requested Validity Duration</label>
              <div className="flex items-center gap-2">
                {[7, 14, 30, 90].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDurationDays(days)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      durationDays === days
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white border-[#E5E0D6] text-slate-700 hover:bg-[#FAF8F5]"
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Justification Textarea */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">
                Administrative Justification / Case Necessity <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Inter-state technical alignment for adjacent railway spur / CAG statutory audit..."
                className="w-full p-3 border border-[#CBD5E1] rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#15803D] leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F2EFE8]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="border-[#E5E0D6] text-xs font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={submitting || !reason.trim()}
                className="bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold gap-1.5 shadow-xs"
              >
                {submitting ? "Routing..." : "Submit to Senior Officer"}
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </form>
        ) : (
          /* Submission Success State */
          <div className="py-4 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#15803D] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-extrabold text-slate-900">Access Request Submitted!</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Your request has been officially recorded in the National Land Acquisition Audit Trail and routed to{" "}
                <strong>{approverTitle}</strong>.
              </p>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E5E0D6] rounded-2xl p-3 max-w-xs mx-auto text-xs space-y-1 font-mono">
              <div className="text-slate-500">Request Docket ID</div>
              <div className="font-bold text-sm text-[#15803D]">{createdRequestId}</div>
              <div className="text-[10px] text-slate-400">Status: Pending Senior Sanction</div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={handleReset} className="text-xs">
                Close
              </Button>
              <Link href="/access-requests">
                <Button size="sm" className="bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold gap-1">
                  <span>Track in Access Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
