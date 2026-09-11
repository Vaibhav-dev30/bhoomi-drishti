"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserCheck,
  Building2,
  Calendar,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Lock,
  Unlock,
  Sparkles,
  FileCheck2,
} from "lucide-react";
import { useApp } from "@/context/app-context";
import { AccessRequest } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AccessRequestsPage() {
  const {
    currentUser,
    accessRequests,
    approveAccessRequest,
    rejectAccessRequest,
    scopedGrants,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing" | "grants">("incoming");
  const [selectedReqForApproval, setSelectedReqForApproval] = useState<AccessRequest | null>(null);
  const [approvalComments, setApprovalComments] = useState("Sanctioned under Section 101 of RFCTLARR Act 2013 for official inter-agency coordination.");
  const [approvalDays, setApprovalDays] = useState(14);

  const [selectedReqForRejection, setSelectedReqForRejection] = useState<AccessRequest | null>(null);
  const [rejectionComments, setRejectionComments] = useState("");

  if (!currentUser) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Authentication Required</h2>
        <p className="text-xs text-slate-500">Please sign in to view the statutory access request portal.</p>
        <Link href="/">
          <Button size="sm">Go to Login</Button>
        </Link>
      </div>
    );
  }

  // Filter incoming requests based on user hierarchy
  const isNationalAdmin = currentUser.jurisdiction.level === "national" || currentUser.role === "super_admin" || currentUser.role === "central_ministry";
  const isStateAdmin = currentUser.jurisdiction.level === "state";
  const isDistrictAdmin = currentUser.jurisdiction.level === "district";

  const incomingRequests = accessRequests.filter((req) => {
    if (isNationalAdmin) return true;
    if (isStateAdmin && req.routedToLevel === "state") return true;
    if (isDistrictAdmin && req.routedToLevel === "district") return true;
    return false;
  });

  const outgoingRequests = accessRequests.filter((req) => req.requesterId === currentUser.id);

  const pendingIncomingCount = incomingRequests.filter((r) => r.status === "pending").length;

  const handleApproveConfirm = () => {
    if (!selectedReqForApproval) return;
    approveAccessRequest(selectedReqForApproval.id, approvalComments, approvalDays);
    setSelectedReqForApproval(null);
  };

  const handleRejectConfirm = () => {
    if (!selectedReqForRejection || !rejectionComments.trim()) return;
    rejectAccessRequest(selectedReqForRejection.id, rejectionComments);
    setSelectedReqForRejection(null);
    setRejectionComments("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* ───── 1. Top Executive Banner ───── */}
      <div className="relative overflow-hidden rounded-3xl border border-[#E5E0D6] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Statutory Authority Portal</span>
              </span>
              <span className="text-xs text-slate-500 font-mono">Hierarchy Level: {currentUser.jurisdiction.level.toUpperCase()}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Inter-Jurisdiction Access Governance
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Strict compartmentalization of sensitive land records with an automated hierarchical senior approval workflow and time-scoped grants.
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E5E0D6] rounded-2xl p-4 text-xs space-y-1 shrink-0">
            <div className="text-slate-500 font-medium">Logged-in Authority:</div>
            <div className="font-bold text-slate-900">{currentUser.name}</div>
            <div className="text-[#15803D] font-semibold">{currentUser.designation}</div>
            <div className="text-slate-600 font-mono text-[11px]">{currentUser.jurisdiction.displayText}</div>
          </div>
        </div>
      </div>

      {/* ───── 2. Summary Metric Cards ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-[#E5E0D6] bg-white p-4 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Pending for Approval</span>
          <span className="text-2xl font-extrabold text-amber-700 font-mono mt-1 block">
            {pendingIncomingCount}
          </span>
          <span className="text-[11px] text-slate-500">Requires your official sanction</span>
        </Card>

        <Card className="border-[#E5E0D6] bg-white p-4 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">My Outgoing Requests</span>
          <span className="text-2xl font-extrabold text-[#0284C7] font-mono mt-1 block">
            {outgoingRequests.length}
          </span>
          <span className="text-[11px] text-slate-500">{outgoingRequests.filter((r) => r.status === "approved").length} granted</span>
        </Card>

        <Card className="border-[#E5E0D6] bg-white p-4 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Active Scoped Grants</span>
          <span className="text-2xl font-extrabold text-[#15803D] font-mono mt-1 block">
            {scopedGrants.length}
          </span>
          <span className="text-[11px] text-slate-500">Active temporary permissions</span>
        </Card>

        <Card className="border-[#E5E0D6] bg-white p-4 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Audit Compliance</span>
          <span className="text-2xl font-extrabold text-emerald-800 font-mono mt-1 block">
            100%
          </span>
          <span className="text-[11px] text-slate-500">All grants logged to CAG registry</span>
        </Card>
      </div>

      {/* ───── 3. Tabbed Navigation ───── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E5E0D6] pb-2">
          <button
            onClick={() => setActiveTab("incoming")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "incoming"
                ? "bg-[#15803D] text-white shadow-xs"
                : "bg-white text-slate-600 border border-[#E5E0D6] hover:bg-[#FAF8F5]"
            }`}
          >
            <span>Incoming for My Approval</span>
            {pendingIncomingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-mono font-bold">
                {pendingIncomingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("outgoing")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "outgoing"
                ? "bg-[#0284C7] text-white shadow-xs"
                : "bg-white text-slate-600 border border-[#E5E0D6] hover:bg-[#FAF8F5]"
            }`}
          >
            <span>My Outgoing Requests</span>
            <span className="text-[10px] font-mono">({outgoingRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("grants")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "grants"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 border border-[#E5E0D6] hover:bg-[#FAF8F5]"
            }`}
          >
            <span>Active Grants Ledger</span>
            <span className="text-[10px] font-mono">({scopedGrants.length})</span>
          </button>
        </div>

        {/* ───── TAB 1: INCOMING REQUESTS ───── */}
        {activeTab === "incoming" && (
          <div className="space-y-4">
            {incomingRequests.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#E5E0D6] text-xs text-slate-500">
                No incoming access requests pending for your authority level.
              </div>
            ) : (
              incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-[#E5E0D6] p-5 shadow-xs space-y-4 hover:border-[#BAE6FD] transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2EFE8] pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E5E0D6]">
                        {req.id}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          req.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : req.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 font-mono">
                      Submitted: {new Date(req.createdAt).toLocaleDateString("en-IN")}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Requester Profile */}
                    <div className="bg-[#FAF8F5] border border-[#E5E0D6] rounded-xl p-3.5 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                        Requester Authority Details
                      </span>
                      <div className="font-bold text-sm text-slate-900">{req.requesterName}</div>
                      <div className="text-slate-600 font-medium">{req.requesterDesignation}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{req.requesterJurisdiction}</div>
                    </div>

                    {/* Target Resource & Reason */}
                    <div className="bg-sky-50/50 border border-sky-100 rounded-xl p-3.5 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-sky-700 tracking-wider block">
                        Target Resource & Scope ({req.durationDays} Days Requested)
                      </span>
                      <div className="font-bold text-sm text-slate-900">{req.targetName}</div>
                      <div className="text-slate-600 text-[11px]">
                        Target ID: <span className="font-mono font-bold text-[#0284C7]">{req.targetId}</span>
                      </div>
                      <div className="text-[11px] text-slate-700 italic bg-white/70 p-2 rounded-lg border border-sky-100 mt-1">
                        "{req.reason}"
                      </div>
                    </div>
                  </div>

                  {/* Resolution Controls or Status */}
                  {req.status === "pending" ? (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F2EFE8]">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedReqForRejection(req)}
                        className="text-xs border-red-200 text-red-700 hover:bg-red-50 font-semibold"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Reject Request
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setSelectedReqForApproval(req)}
                        className="bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold gap-1 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Grant Scoped Access
                      </Button>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5E0D6] text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                        {req.status === "approved" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span>
                          {req.status === "approved" ? "Approved by: " : "Rejected by: "}
                          <strong>{req.approverName}</strong>
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">Remarks: {req.approverComments}</p>
                      {req.expiresAt && (
                        <p className="text-emerald-700 font-mono text-[10px]">
                          Temporary Scoped Grant Valid Until: {new Date(req.expiresAt).toLocaleDateString("en-IN")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ───── TAB 2: OUTGOING REQUESTS ───── */}
        {activeTab === "outgoing" && (
          <div className="space-y-4">
            {outgoingRequests.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#E5E0D6] text-xs text-slate-500">
                You have not submitted any out-of-jurisdiction access requests yet.
              </div>
            ) : (
              outgoingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-[#E5E0D6] p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700">{req.id}</span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          req.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : req.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    {req.status === "approved" && (
                      <Link href={`/projects/${req.targetId}`}>
                        <Button size="sm" className="bg-[#15803D] text-white text-xs gap-1">
                          <span>Access Project Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    )}
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="font-bold text-sm text-slate-900">{req.targetName}</div>
                    <div className="text-slate-600">Reason: "{req.reason}"</div>
                    <div className="text-slate-500 text-[11px]">
                      Routed To Authority: <strong className="text-slate-800">{req.routedToRole.replace("_", " ").toUpperCase()}</strong>
                    </div>
                  </div>

                  {req.status === "approved" && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-950 font-mono">
                      Grant Issued by {req.approverName}. Active until {new Date(req.expiresAt || "").toLocaleDateString("en-IN")}.
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ───── TAB 3: ACTIVE GRANTS REGISTRY ───── */}
        {activeTab === "grants" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#E5E0D6] overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF8F5] border-b border-[#E5E0D6] text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Grant ID</th>
                    <th className="p-3.5">Target Resource</th>
                    <th className="p-3.5">Scope Type</th>
                    <th className="p-3.5">Sanctioned By</th>
                    <th className="p-3.5">Expiration Date</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {scopedGrants.map((grant) => {
                    const isExpired = new Date(grant.expiresAt).getTime() < Date.now();
                    return (
                      <tr key={grant.id} className="hover:bg-[#FAF8F5]/60">
                        <td className="p-3.5 font-mono font-bold text-slate-800">{grant.id}</td>
                        <td className="p-3.5 font-bold text-slate-900">{grant.targetName}</td>
                        <td className="p-3.5 capitalize font-medium text-slate-600">{grant.targetType}</td>
                        <td className="p-3.5 text-slate-700">{grant.grantedBy}</td>
                        <td className="p-3.5 font-mono text-slate-600">{new Date(grant.expiresAt).toLocaleDateString("en-IN")}</td>
                        <td className="p-3.5">
                          <Badge variant={isExpired ? "secondary" : "default"} className="text-[10px]">
                            {isExpired ? "Expired" : "Active & Enforced"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* APPROVAL DIALOG MODAL */}
      {selectedReqForApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#E5E0D6] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-base text-slate-900">Sanction Scoped Access Grant</h3>
              <button onClick={() => setSelectedReqForApproval(null)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3">
              <p className="text-slate-600">
                You are approving cross-jurisdiction access to <strong>{selectedReqForApproval.targetName}</strong> for:
              </p>
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E5E0D6] space-y-1 font-mono">
                <div>{selectedReqForApproval.requesterName}</div>
                <div className="text-slate-500 text-[11px]">{selectedReqForApproval.requesterDesignation}</div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 block">Grant Validity Duration (Days)</label>
                <div className="flex items-center gap-2">
                  {[7, 14, 30, 90].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setApprovalDays(days)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold ${
                        approvalDays === days
                          ? "bg-[#15803D] text-white border-[#15803D]"
                          : "bg-white border-[#E5E0D6] text-slate-700"
                      }`}
                    >
                      {days} Days
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 block">Sanction Remarks / Order Note</label>
                <textarea
                  rows={3}
                  value={approvalComments}
                  onChange={(e) => setApprovalComments(e.target.value)}
                  className="w-full p-2.5 border border-[#CBD5E1] rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={() => setSelectedReqForApproval(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleApproveConfirm} className="bg-[#15803D] text-white font-bold">
                Confirm & Issue Grant
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION DIALOG MODAL */}
      {selectedReqForRejection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#E5E0D6] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-base text-red-900">Reject Access Request</h3>
              <button onClick={() => setSelectedReqForRejection(null)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3">
              <p className="text-slate-600">
                Please provide the statutory or administrative grounds for withholding authorization:
              </p>
              <textarea
                required
                rows={3}
                value={rejectionComments}
                onChange={(e) => setRejectionComments(e.target.value)}
                placeholder="e.g. Jurisdiction is reserved for State Forest clearance; no cross-agency necessity established."
                className="w-full p-2.5 border border-[#CBD5E1] rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={() => setSelectedReqForRejection(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!rejectionComments.trim()}
                onClick={handleRejectConfirm}
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Reject with Cause
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
