"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BhuNakshaParcel,
  getParcel12StageInfo,
  getParcelStageVisualColor,
} from "@/lib/bhunaksha-service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CreditCard,
  Landmark,
  Home,
} from "lucide-react";

interface Props {
  parcels: BhuNakshaParcel[];
  onSelectParcel?: (parcel: BhuNakshaParcel) => void;
}

export function AffectedLandTable({ parcels, onSelectParcel }: Props) {
  const [filterType, setFilterType] = useState<"all" | "full" | "partial" | "unaffected">("all");
  const [expandedParcelId, setExpandedParcelId] = useState<string | null>(null);

  const enrichedParcels = parcels.map(getParcel12StageInfo);

  const filtered = enrichedParcels.filter((p) => {
    if (filterType === "full") return p.acquisitionType === "full";
    if (filterType === "partial") return p.acquisitionType === "partial";
    if (filterType === "unaffected") return p.acquisitionType === "unaffected";
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedParcelId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E5E0D6] p-6 shadow-sm space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D6] pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            BhuNaksha Affected Cadastral Parcels Register
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Plot-by-plot alignment intersection, 12-stage RFCTLARR statutory status, and compensation awards.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-[#E5E0D6] text-xs font-bold">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              filterType === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({parcels.length})
          </button>
          <button
            onClick={() => setFilterType("full")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              filterType === "full" ? "bg-red-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Full ({parcels.filter((p) => p.acquisitionType === "full").length})
          </button>
          <button
            onClick={() => setFilterType("partial")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              filterType === "partial" ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Partial ({parcels.filter((p) => p.acquisitionType === "partial").length})
          </button>
          <button
            onClick={() => setFilterType("unaffected")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              filterType === "unaffected" ? "bg-sky-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Unaffected ({parcels.filter((p) => p.acquisitionType === "unaffected").length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#E5E0D6]">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#FAF8F5] hover:bg-[#FAF8F5] text-xs font-extrabold text-slate-700">
              <TableHead className="w-10"></TableHead>
              <TableHead>Khasra / Gat No.</TableHead>
              <TableHead>Primary Landowner (RoR)</TableHead>
              <TableHead>Classification</TableHead>
              <TableHead className="text-right">GIS Area (Ha)</TableHead>
              <TableHead className="text-right">Affected (Ha)</TableHead>
              <TableHead>Statutory Stage</TableHead>
              <TableHead className="text-right">Valuation (₹)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs">
            {filtered.map((parcel) => {
              const isExpanded = expandedParcelId === parcel.id;
              const colorInfo = getParcelStageVisualColor(parcel);
              const stageNum = parcel.stageIndex ?? (parcel.isAffected ? 3 : 2);

              return (
                <React.Fragment key={parcel.id}>
                  <TableRow
                    className={`hover:bg-[#FBF9F3] transition-colors cursor-pointer ${
                      parcel.isAffected ? "bg-red-50/20" : ""
                    }`}
                    onClick={() => toggleExpand(parcel.id)}
                  >
                    <TableCell className="p-2 text-center text-slate-400">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </TableCell>
                    <TableCell className="font-mono font-bold text-slate-900">
                      <div>
                        <span>KH-{parcel.khasraNumber}</span>
                        <span className="block text-[10px] text-slate-400 font-sans">{parcel.surveyNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-slate-900">{parcel.owners[0]?.name}</div>
                      <div className="text-[10px] text-slate-500">
                        {parcel.owners.length > 1
                          ? `+${parcel.owners.length - 1} co-owners (${parcel.owners[0]?.sharePercentage}%)`
                          : "Sole owner (100%)"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="capitalize text-[10px] bg-[#F2EFE8] text-slate-800 border-[#E5E0D6]">
                        {parcel.landClassification.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-slate-900">
                      {parcel.gisCalculatedAreaHa} Ha
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold">
                      <span className={parcel.isAffected ? "text-red-700" : "text-slate-500"}>
                        {parcel.affectedAreaHa} Ha
                      </span>
                      {parcel.isAffected && (
                        <span className="block text-[10px] text-slate-400">
                          {parcel.affectedAreaPercentage}%
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${colorInfo.labelBg} ${colorInfo.labelText}`}
                      >
                        Stage {stageNum} &bull; {colorInfo.categoryLabel}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-slate-900">
                      {parcel.valuation.totalCompensationPayable > 0
                        ? `₹${(parcel.valuation.totalCompensationPayable / 100000).toFixed(2)} L`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`capitalize text-[10px] font-bold ${
                          parcel.status === "award_assessed"
                            ? "bg-purple-50 text-purple-800 border-purple-200"
                            : parcel.status === "compensation_paid" || parcel.status === "possessed_mutated"
                            ? "bg-green-50 text-green-800 border-green-200"
                            : parcel.status === "objection_filed"
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {parcel.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                      <Link href={`/map?khasra=${parcel.khasraNumber}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-[11px] text-[#0284C7] hover:bg-[#E0F2FE] cursor-pointer"
                          title="Inspect on Cadastral Map"
                        >
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span>Map</span>
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Khasra Detail Drawer Row */}
                  {isExpanded && (
                    <TableRow className="bg-[#FAF8F5]/80 hover:bg-[#FAF8F5]/80">
                      <TableCell colSpan={10} className="p-4">
                        <div className="bg-white rounded-2xl border border-[#E5E0D6] p-4 shadow-xs space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F2EFE8] pb-2">
                            <span className="font-mono text-xs font-bold text-slate-800">
                              ULPIN (Bhu-Aadhaar): <span className="text-[#15803D]">{parcel.ulpin}</span>
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              Chauhaddi: North: {parcel.chauhaddi.north} &bull; East: {parcel.chauhaddi.east}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                            <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D6] space-y-0.5">
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                                1. RoR (Bhulekh)
                              </span>
                              <span className="font-bold text-slate-800 block">
                                Khatauni: {parcel.owners[0]?.khatauniNumber || "KH-000"}
                              </span>
                              <span className="text-[10px] text-emerald-700 font-semibold block">
                                Status: {parcel.rorVerification?.status || "Verified"}
                              </span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D6] space-y-0.5">
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                                2. JMS Field Survey
                              </span>
                              <span className="font-bold text-slate-800 block">
                                Residual: {parcel.residualAreaHa} Ha
                              </span>
                              <span className="text-[10px] text-slate-600 block">
                                {parcel.fieldVerification?.officer || "SLAO Surveyor"}
                              </span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-0.5">
                              <span className="text-[10px] text-[#15803D] font-bold uppercase block">
                                3. RFCTLARR Award
                              </span>
                              <span className="font-mono font-extrabold text-[#15803D] text-xs block">
                                ₹{(parcel.valuation.totalCompensationPayable / 100000).toFixed(2)} Lakhs
                              </span>
                              <span className="text-[10px] text-slate-600 block">
                                Market × 1.5 + Solatium
                              </span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D6] space-y-0.5">
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                                4. Possession & R&R
                              </span>
                              <span className="font-bold text-slate-800 block">
                                {parcel.possessionDetails?.status || "Pending"}
                              </span>
                              <span className="text-[10px] text-purple-700 font-semibold block">
                                {parcel.rrDetails?.status === "Completed"
                                  ? "R&R Settled"
                                  : parcel.rrDetails?.relocationStatus || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

