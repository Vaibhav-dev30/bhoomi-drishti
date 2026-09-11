"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Download,
  Coins,
  ShieldCheck,
  AlertTriangle,
  Home,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import { MOCK_FAMILIES, MOCK_PROJECTS } from "@/lib/mock-data";
import { useApp } from "@/context/app-context";
import { filterProjectsForUser } from "@/lib/auth-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function FamiliesPage() {
  const { currentUser, scopedGrants } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [displacementFilter, setDisplacementFilter] = useState("all");

  // Jurisdictional Scoping
  const authorizedProjects = useMemo(() => {
    return filterProjectsForUser(currentUser, scopedGrants, MOCK_PROJECTS);
  }, [currentUser, scopedGrants]);

  const authorizedProjectIds = useMemo(() => {
    return new Set(authorizedProjects.map((p) => p.id));
  }, [authorizedProjects]);

  const jurisdictionFamilies = useMemo(() => {
    return MOCK_FAMILIES.filter((fam) => authorizedProjectIds.has(fam.projectId));
  }, [authorizedProjectIds]);

  const filteredFamilies = useMemo(() => {
    return jurisdictionFamilies.filter((fam) => {
      const matchSearch =
        !searchTerm ||
        fam.familyHeadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fam.fatherHusbandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fam.village.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = categoryFilter === "all" || fam.category === categoryFilter;
      const matchDisplacement =
        displacementFilter === "all" ||
        (displacementFilter === "displaced" && fam.isDisplaced) ||
        (displacementFilter === "non_displaced" && !fam.isDisplaced);
      return matchSearch && matchCategory && matchDisplacement;
    });
  }, [jurisdictionFamilies, searchTerm, categoryFilter, displacementFilter]);

  const totalFamilies = jurisdictionFamilies.length;
  const displacedCount = jurisdictionFamilies.filter((f) => f.isDisplaced).length;
  const bplCount = jurisdictionFamilies.filter((f) => f.isBPL).length;
  const totalPaid = jurisdictionFamilies.reduce((acc, f) => acc + f.compensationPaid, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* ───── 1. Top Header Banner ───── */}
      <div className="relative overflow-hidden rounded-3xl border border-[#E5E0D6] bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]">
                <Users className="h-3.5 w-3.5" />
                <span>RFCTLARR Act 2013 • Social Impact Census</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-amber-900 border border-[#FDE68A]">
                <span>Scope: {currentUser?.jurisdiction.displayText || "All India"}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-2">
              Affected & Displaced Families Register
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Comprehensive statutory census of titleholders, tenants, and agricultural workers entitled to direct compensation and Second Schedule R&R entitlements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const csvHeader = "ID,FamilyHead,FatherHusband,Village,District,Category,BPL,LandLostHa,CompensationPaid,RRStatus\n";
                const csvRows = filteredFamilies
                  .map(
                    (f) =>
                      `${f.id},"${f.familyHeadName}","${f.fatherHusbandName}","${f.village}","${f.district}",${f.category},${f.isBPL},${f.landLost},${f.compensationPaid},${f.rrStatus}`
                  )
                  .join("\n");
                const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `BhoomiDrishti_Affected_Families_${Date.now()}.csv`;
                a.click();
              }}
              className="h-9 text-xs font-bold gap-1.5 border-[#BAE6FD] bg-[#F0F9FF] text-[#0284C7] hover:bg-[#E0F2FE] shadow-xs cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Census CSV</span>
            </Button>
            <Link href="/rr">
              <Button size="sm" className="h-9 text-xs font-bold gap-1.5 bg-[#15803D] hover:bg-[#16A34A] text-white shadow-xs cursor-pointer">
                <span>R&R Monitoring →</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ───── 2. Metric Summary Strip ───── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <div className="p-5 rounded-3xl border border-[#E5E0D6] bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase font-bold text-slate-500">Sampled Families</span>
            <div className="p-2 rounded-xl bg-[#E0F2FE] text-[#0284C7]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">{totalFamilies}</span>
          <span className="text-xs text-slate-500 block mt-1">Surveyed across 12 projects</span>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-3xl border border-[#E5E0D6] bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase font-bold text-slate-500">Physically Displaced</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Home className="h-4 w-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-mono">{displacedCount}</span>
          <span className="text-xs text-amber-800/80 block mt-1">Sch II Resettlement Active</span>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-3xl border border-[#E5E0D6] bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase font-bold text-slate-500">BPL Card Holders</span>
            <div className="p-2 rounded-xl bg-[#FEF3C7] text-amber-700">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">{bplCount}</span>
          <span className="text-xs text-slate-500 block mt-1">Subsistence Allowance Priority</span>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-3xl border border-[#E5E0D6] bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase font-bold text-slate-500">Compensation Paid</span>
            <div className="p-2.5 rounded-xl bg-[#DCFCE7] text-[#15803D]">
              <Coins className="h-4 w-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#15803D] font-mono">
            ₹{(totalPaid / 10000000).toFixed(2)} Cr
          </span>
          <span className="text-xs text-[#15803D] font-medium block mt-1">100% PFMS DBT Disbursed</span>
        </div>
      </div>

      {/* ───── 3. Filter Controls Bar ───── */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl bg-white border border-[#E5E0D6] shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0284C7]" />
          <input
            type="text"
            placeholder="Search by family head, relative name, or village..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0284C7] focus:outline-none focus:ring-1 focus:ring-[#0284C7] transition-all"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-48 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] px-3 py-2 text-xs text-slate-800 font-semibold focus:border-[#0284C7] focus:outline-none cursor-pointer"
        >
          <option value="all">All Social Categories</option>
          <option value="general">General</option>
          <option value="obc">OBC</option>
          <option value="sc">SC</option>
          <option value="st">ST</option>
        </select>

        <select
          value={displacementFilter}
          onChange={(e) => setDisplacementFilter(e.target.value)}
          className="w-full sm:w-48 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] px-3 py-2 text-xs text-slate-800 font-semibold focus:border-[#0284C7] focus:outline-none cursor-pointer"
        >
          <option value="all">All Displacements</option>
          <option value="displaced">Physically Displaced</option>
          <option value="non_displaced">Land Loss Only</option>
        </select>
      </div>

      {/* ───── 4. Main Census Table ───── */}
      <div className="rounded-3xl border border-[#E5E0D6] bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-[#E5E0D6] bg-[#FAF8F5]">
              <TableHead className="text-slate-700 font-bold py-3.5">Family Head / Relative</TableHead>
              <TableHead className="text-slate-700 font-bold">Village / District</TableHead>
              <TableHead className="text-slate-700 font-bold">Category</TableHead>
              <TableHead className="text-slate-700 font-bold">Land Lost</TableHead>
              <TableHead className="text-slate-700 font-bold">Structure Status</TableHead>
              <TableHead className="text-slate-700 font-bold">Compensation (PFMS)</TableHead>
              <TableHead className="text-slate-700 font-bold">R&R Entitlement</TableHead>
              <TableHead className="text-right text-slate-700 font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFamilies.map((fam) => (
              <TableRow key={fam.id} className="border-[#F2EFE8] hover:bg-[#FAF8F5] transition-colors">
                <TableCell className="text-xs py-4">
                  <div className="font-bold text-slate-900 text-sm">{fam.familyHeadName}</div>
                  <div className="text-[11px] text-slate-500">
                    S/o {fam.fatherHusbandName} • <span className="font-medium text-slate-700">{fam.familyMembers} members</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-slate-700 font-medium">
                  {fam.village}, {fam.district}
                </TableCell>
                <TableCell className="text-xs uppercase font-mono">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      fam.isBPL
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : "bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]"
                    }`}
                  >
                    {fam.category} {fam.isBPL ? "• BPL" : ""}
                  </span>
                </TableCell>
                <TableCell className="text-xs font-mono font-bold text-slate-900">
                  {fam.landLost} ha
                </TableCell>
                <TableCell className="text-xs">
                  {fam.structureLost ? (
                    <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[11px]">
                      <Home className="h-3 w-3" /> Pucca House
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs">Land Only</span>
                  )}
                </TableCell>
                <TableCell className="text-xs font-mono">
                  <div className="text-[#15803D] font-extrabold text-sm">
                    ₹{(fam.compensationPaid / 100000).toFixed(1)} L paid
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    of ₹{(fam.totalCompensation / 100000).toFixed(1)} L assessed
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                      fam.rrStatus === "completed"
                        ? "bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]"
                        : fam.rrStatus === "monetary_paid"
                        ? "bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]"
                        : "bg-[#FEF3C7] text-amber-800 border border-amber-200"
                    }`}
                  >
                    {fam.rrStatus.replace(/_/g, " ")}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/compensation?familyId=${fam.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs font-bold text-[#0284C7] hover:text-[#0369A1] hover:bg-[#E0F2FE]"
                    >
                      <span>Ledger</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
