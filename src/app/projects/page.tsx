"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FolderKanban,
  PlusCircle,
  Search,
  Building,
  MapPin,
  ExternalLink,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Key,
} from "lucide-react";
import { useApp } from "@/context/app-context";
import { checkResourceAccess } from "@/lib/auth-store";
import { RequestAccessModal } from "@/components/auth/request-access-modal";
import { MOCK_PROJECTS, INDIAN_STATES } from "@/lib/mock-data";
import { ProjectStatus } from "@/types";
import { formatArea, getPercentage } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ProjectsPage() {
  const { language, searchQuery, setSearchQuery, currentUser, scopedGrants } = useApp();
  const [requestTarget, setRequestTarget] = useState<{
    targetType: "project" | "district" | "state" | "plots";
    targetId: string;
    targetName: string;
    targetState?: string;
    targetDistrict?: string;
    seniorAuthorityName?: string;
    seniorAuthorityRole?: string;
  } | null>(null);
  const [filterSector, setFilterSector] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterState, setFilterState] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.projectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.state.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSector = filterSector === "all" || p.type === filterSector;
      const matchStatus = filterStatus === "all" || p.status === filterStatus;
      const matchState = filterState === "all" || p.stateCode === filterState;
      return matchSearch && matchSector && matchStatus && matchState;
    });
  }, [searchQuery, filterSector, filterStatus, filterState]);

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case "completed":
      case "possession_taken":
        return <Badge variant="success">Possession Taken</Badge>;
      case "compensation_disbursing":
        return <Badge variant="default">Compensation Payout</Badge>;
      case "award_completed":
      case "award_in_progress":
        return <Badge variant="info">Award Stage (Sec 23)</Badge>;
      case "sec19_declared":
        return <Badge variant="purple">Sec 19 Declared</Badge>;
      case "sec11_notified":
      case "objections_open":
        return <Badge variant="default">Sec 11 Notified</Badge>;
      case "sia_in_progress":
      case "sia_completed":
      case "expert_review":
        return <Badge variant="outline">SIA Stage (Sec 4-7)</Badge>;
      default:
        return <Badge variant="secondary">{status.replace(/_/g, " ")}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* ───── 1. Top Executive Banner ───── */}
      <div className="relative overflow-hidden rounded-3xl border border-[#E5E0D6] bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]">
                <FolderKanban className="h-3.5 w-3.5" />
                <span>Central Requisition Registry</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-2">
              {language === "hi" ? "राष्ट्रीय भू-अर्जन परियोजनाएं" : "National Land Acquisition Projects"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {language === "hi"
                ? "सभी केंद्रीय मंत्रालयों एवं राज्य सरकारों की अधियाचित अवसंरचना परियोजनाओं का केंद्रीय रजिस्टर।"
                : "Central registry of infrastructure projects undergoing statutory land acquisition across India."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/projects/new">
              <Button size="sm" className="h-9 gap-1.5 bg-[#15803D] hover:bg-[#16A34A] text-white font-bold shadow-xs">
                <PlusCircle className="h-4 w-4" />
                <span>{language === "hi" ? "नया अधियाचन प्रस्ताव" : "Submit New Proposal"}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ───── 2. Filter and Search Bar ───── */}
      <div className="rounded-3xl border border-[#E5E0D6] bg-white p-5 space-y-3 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0284C7]" />
            <input
              type="text"
              placeholder="Search by project name, code, district, or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0284C7] focus:outline-none focus:ring-1 focus:ring-[#0284C7] transition-all"
            />
          </div>

          {/* Sector Filter */}
          <select
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
            className="w-full md:w-48 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] px-3 py-2 text-xs text-slate-800 font-semibold focus:border-[#0284C7] focus:outline-none cursor-pointer"
          >
            <option value="all">All Sectors</option>
            <option value="highway">Highways</option>
            <option value="railway">Railways</option>
            <option value="irrigation">Irrigation</option>
            <option value="industrial">Industrial</option>
            <option value="renewable_energy">Renewable</option>
            <option value="urban_development">Urban</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-52 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] px-3 py-2 text-xs text-slate-800 font-semibold focus:border-[#0284C7] focus:outline-none cursor-pointer"
          >
            <option value="all">All Lifecycle Stages</option>
            <option value="sia_in_progress">SIA In Progress</option>
            <option value="sec11_notified">Sec 11 Notified</option>
            <option value="objections_open">Objections Open</option>
            <option value="sec19_declared">Sec 19 Declared</option>
            <option value="award_completed">Award Completed</option>
            <option value="compensation_disbursing">Compensation Disbursing</option>
            <option value="possession_taken">Possession Taken</option>
          </select>

          {/* State Filter */}
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="w-full md:w-48 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] px-3 py-2 text-xs text-slate-800 font-semibold focus:border-[#0284C7] focus:outline-none cursor-pointer"
          >
            <option value="all">All States</option>
            {INDIAN_STATES.map((st) => (
              <option key={st.code} value={st.code}>
                {st.name}
              </option>
            ))}
          </select>

          {/* View mode buttons */}
          <div className="flex items-center rounded-xl border border-[#E5E0D6] bg-[#F5F2EB] p-1 shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "grid" ? "bg-white text-[#0284C7] shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "table" ? "bg-white text-[#0284C7] shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Table
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Showing <strong className="text-slate-900 font-bold">{filteredProjects.length}</strong> of {MOCK_PROJECTS.length} projects
          </span>
          {(filterSector !== "all" || filterStatus !== "all" || filterState !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setFilterSector("all");
                setFilterStatus("all");
                setFilterState("all");
                setSearchQuery("");
              }}
              className="text-[#0284C7] font-bold hover:underline cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* ───── 3. Grid View ───── */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => {
            const percentAcquired = getPercentage(proj.areaAcquired, proj.totalAreaRequired);
            const access = checkResourceAccess(currentUser, scopedGrants, {
              projectId: proj.id,
              state: proj.state,
              stateCode: proj.stateCode,
              district: proj.district,
            });
            return (
              <Card
                key={proj.id}
                className="group border-[#E5E0D6] bg-white hover:border-[#BAE6FD] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-lg bg-[#FAF8F5] text-slate-700 font-bold border border-[#E5E0D6]">
                        {proj.projectCode}
                      </span>
                      {!access.allowed && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          <Lock className="w-2.5 h-2.5 text-amber-700" />
                          Restricted
                        </span>
                      )}
                    </div>
                    {getStatusBadge(proj.status)}
                  </div>
                  <CardTitle className="text-base font-extrabold text-slate-900 group-hover:text-[#0284C7] transition-colors line-clamp-1">
                    {proj.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-1 text-slate-600 leading-relaxed">
                    {proj.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Geographic & LRB Details */}
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Requiring Agency:</span>
                      <span className="font-bold text-slate-900 truncate max-w-[180px]">
                        {proj.lrbName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Jurisdiction:</span>
                      <span className="font-medium text-slate-800">
                        {proj.district}, {proj.state}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Villages Notified:</span>
                      <span className="font-medium text-slate-800">{proj.villages.length} Villages ({proj.tehsil})</span>
                    </div>
                  </div>

                  {/* Acquisition Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-medium">Land Acquired</span>
                      <span className="font-mono font-bold text-slate-900">
                        {formatArea(proj.areaAcquired)} / {formatArea(proj.totalAreaRequired)} ({percentAcquired}%)
                      </span>
                    </div>
                    <Progress value={percentAcquired} className="h-2 bg-[#F2EFE8]" indicatorClassName="bg-[#0284C7]" />
                  </div>

                  {/* Financial & Social Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F2EFE8] text-xs">
                    <div className="bg-[#FAF8F5] p-2.5 rounded-2xl border border-[#E5E0D6]">
                      <span className="text-[10px] text-slate-500 block font-medium">Disbursed (PFMS)</span>
                      <span className="font-mono font-extrabold text-[#15803D]">
                        ₹{proj.compensationDisbursed} L
                      </span>
                      <span className="text-[10px] text-slate-500 block">of ₹{proj.compensationAssessed || proj.estimatedCost} L</span>
                    </div>
                    <div className="bg-[#FAF8F5] p-2.5 rounded-2xl border border-[#E5E0D6]">
                      <span className="text-[10px] text-slate-500 block font-medium">Affected Families</span>
                      <span className="font-mono font-extrabold text-[#0284C7]">
                        {proj.totalAffectedFamilies}
                      </span>
                      <span className="text-[10px] text-slate-500 block">R&R Done: {proj.rrCompletedFamilies}</span>
                    </div>
                  </div>

                  {/* Action Links with RBAC Jurisdiction Guard */}
                  <div className="pt-2 flex items-center gap-2">
                    {access.allowed ? (
                      <Link href={`/projects/${proj.id}`} className="flex-1 block">
                        <Button variant="outline" size="sm" className="w-full text-xs font-bold gap-1 border-[#BAE6FD] bg-[#F0F9FF] text-[#0284C7] hover:bg-[#E0F2FE]">
                          <span>Dossier</span>
                          <ExternalLink className="h-3.5 w-3.5 text-[#0284C7]" />
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setRequestTarget({
                            targetType: "project",
                            targetId: proj.id,
                            targetName: proj.name,
                            targetState: proj.state,
                            targetDistrict: proj.district,
                            seniorAuthorityName: access.seniorName || currentUser?.parentAuthorityName,
                            seniorAuthorityRole: access.seniorRole || currentUser?.parentAuthorityTitle,
                          })
                        }
                        className="flex-1 text-xs font-bold gap-1 border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                      >
                        <Lock className="h-3.5 w-3.5 text-amber-700" />
                        <span>Request Access</span>
                      </Button>
                    )}
                    <Link href="/map" className="flex-1 block">
                      <Button size="sm" className="w-full text-xs font-bold gap-1 bg-[#15803D] hover:bg-[#166534] text-white">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>GIS Map</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-3xl border border-[#E5E0D6] bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-[#E5E0D6] bg-[#FAF8F5]">
                <TableHead className="text-slate-700 font-bold">Project Code & Name</TableHead>
                <TableHead className="text-slate-700 font-bold">Requiring Body</TableHead>
                <TableHead className="text-slate-700 font-bold">Location</TableHead>
                <TableHead className="text-slate-700 font-bold">Area Progress</TableHead>
                <TableHead className="text-slate-700 font-bold">Disbursed</TableHead>
                <TableHead className="text-slate-700 font-bold">Status</TableHead>
                <TableHead className="text-right text-slate-700 font-bold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((proj) => {
                const access = checkResourceAccess(currentUser, scopedGrants, {
                  projectId: proj.id,
                  state: proj.state,
                  stateCode: proj.stateCode,
                  district: proj.district,
                });
                return (
                <TableRow key={proj.id} className="border-[#F2EFE8] hover:bg-[#FAF8F5] transition-colors">
                  <TableCell className="font-medium max-w-xs py-3">
                    <div className="font-mono text-[10px] text-[#0284C7] font-bold">{proj.projectCode}</div>
                    <div className="font-bold text-xs text-slate-900 truncate">{proj.name}</div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-700 font-medium">
                    {proj.lrbName}
                  </TableCell>
                  <TableCell className="text-xs text-slate-700 font-medium">
                    {proj.district}, {proj.stateCode}
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    <div className="font-bold text-slate-900">{formatArea(proj.areaAcquired)} / {formatArea(proj.totalAreaRequired)}</div>
                    <div className="text-[10px] text-slate-500">{getPercentage(proj.areaAcquired, proj.totalAreaRequired)}%</div>
                  </TableCell>
                  <TableCell className="text-xs font-mono font-extrabold text-[#15803D]">
                    ₹{proj.compensationDisbursed} L
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(proj.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    {access.allowed ? (
                      <Link href={`/projects/${proj.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs font-bold text-[#0284C7] hover:text-[#0369A1] hover:bg-[#E0F2FE]">
                          View →
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setRequestTarget({
                            targetType: "project",
                            targetId: proj.id,
                            targetName: proj.name,
                            targetState: proj.state,
                            targetDistrict: proj.district,
                            seniorAuthorityName: access.seniorName || currentUser?.parentAuthorityName,
                            seniorAuthorityRole: access.seniorRole || currentUser?.parentAuthorityTitle,
                          })
                        }
                        className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:bg-amber-100 gap-1"
                      >
                        <Lock className="w-3 h-3" />
                        <span>Request Access</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    {/* Cross-Jurisdiction Request Access Modal */}
      {requestTarget && (
        <RequestAccessModal
          isOpen={!!requestTarget}
          onClose={() => setRequestTarget(null)}
          targetType={requestTarget.targetType}
          targetId={requestTarget.targetId}
          targetName={requestTarget.targetName}
          targetState={requestTarget.targetState}
          targetDistrict={requestTarget.targetDistrict}
          seniorAuthorityName={requestTarget.seniorAuthorityName}
          seniorAuthorityRole={requestTarget.seniorAuthorityRole}
        />
      )}
    </div>
  );
}
