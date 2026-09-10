"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FolderKanban,
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  Building,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useApp } from "@/context/app-context";
import { MOCK_PROJECTS, INDIAN_STATES } from "@/lib/mock-data";
import { Project, ProjectStatus, ProjectType } from "@/types";
import { formatArea, formatCurrency, getPercentage } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ProjectsPage() {
  const { language, searchQuery, setSearchQuery } = useApp();
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FolderKanban className="h-6 w-6 text-amber-400" />
            <span>
              {language === "hi" ? "राष्ट्रीय भू-अर्जन परियोजनाएं" : "National Land Acquisition Projects"}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {language === "hi"
              ? "सभी केंद्रीय मंत्रालयों एवं राज्य सरकारों की अधियाचित अवसंरचना परियोजनाओं का केंद्रीय रजिस्टर।"
              : "Central registry of infrastructure projects undergoing statutory land acquisition across India."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/projects/new">
            <Button variant="default" size="sm" className="gap-1.5">
              <PlusCircle className="h-4 w-4" />
              <span>{language === "hi" ? "नया अधियाचन प्रस्ताव" : "Submit New Proposal"}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by project name, code, district, or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950/80 pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Sector Filter */}
          <select
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
            className="w-full md:w-48 rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-300 focus:border-amber-500 focus:outline-none cursor-pointer"
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
            className="w-full md:w-52 rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-300 focus:border-amber-500 focus:outline-none cursor-pointer"
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
            className="w-full md:w-48 rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-300 focus:border-amber-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All States</option>
            {INDIAN_STATES.map((st) => (
              <option key={st.code} value={st.code}>
                {st.name}
              </option>
            ))}
          </select>

          {/* View mode buttons */}
          <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950 p-0.5 shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-2.5 py-1 rounded text-xs font-medium ${
                viewMode === "grid" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-2.5 py-1 rounded text-xs font-medium ${
                viewMode === "table" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400"
              }`}
            >
              Table
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>
            Showing <strong className="text-white">{filteredProjects.length}</strong> of {MOCK_PROJECTS.length} projects
          </span>
          {(filterSector !== "all" || filterStatus !== "all" || filterState !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setFilterSector("all");
                setFilterStatus("all");
                setFilterState("all");
                setSearchQuery("");
              }}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((proj) => {
            const percentAcquired = getPercentage(proj.areaAcquired, proj.totalAreaRequired);
            return (
              <Card
                key={proj.id}
                className="group border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90 transition-all flex flex-col justify-between"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-semibold border border-slate-700">
                      {proj.projectCode}
                    </span>
                    {getStatusBadge(proj.status)}
                  </div>
                  <CardTitle className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                    {proj.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {proj.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Geographic & LRB Details */}
                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Requiring Agency:</span>
                      <span className="font-medium text-white truncate max-w-[180px]">
                        {proj.lrbName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Jurisdiction:</span>
                      <span>
                        {proj.district}, {proj.state}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Villages Notified:</span>
                      <span>{proj.villages.length} Villages ({proj.tehsil})</span>
                    </div>
                  </div>

                  {/* Acquisition Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Land Acquired</span>
                      <span className="font-mono font-semibold text-white">
                        {formatArea(proj.areaAcquired)} / {formatArea(proj.totalAreaRequired)} ({percentAcquired}%)
                      </span>
                    </div>
                    <Progress value={percentAcquired} />
                  </div>

                  {/* Financial & Social Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                      <span className="text-[10px] text-slate-500 block">Compensation Disbursed</span>
                      <span className="font-mono font-bold text-emerald-400">
                        ₹{proj.compensationDisbursed} L
                      </span>
                      <span className="text-[10px] text-slate-500 block">of ₹{proj.compensationAssessed || proj.estimatedCost} L</span>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                      <span className="text-[10px] text-slate-500 block">Affected Families</span>
                      <span className="font-mono font-bold text-purple-400">
                        {proj.totalAffectedFamilies}
                      </span>
                      <span className="text-[10px] text-slate-500 block">R&R Done: {proj.rrCompletedFamilies}</span>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-2">
                    <Link href={`/projects/${proj.id}`} className="w-full block">
                      <Button variant="outline" size="sm" className="w-full text-xs gap-1 group-hover:border-amber-500/50">
                        <span>Inspect Complete Statutory Dossier</span>
                        <ExternalLink className="h-3.5 w-3.5 text-amber-400" />
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
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Code & Name</TableHead>
                <TableHead>Requiring Body</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Area Progress</TableHead>
                <TableHead>Disbursed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((proj) => (
                <TableRow key={proj.id}>
                  <TableCell className="font-medium text-white max-w-xs">
                    <div className="font-mono text-[10px] text-amber-400">{proj.projectCode}</div>
                    <div className="font-semibold text-xs truncate">{proj.name}</div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-300">
                    {proj.lrbName}
                  </TableCell>
                  <TableCell className="text-xs text-slate-300">
                    {proj.district}, {proj.stateCode}
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    <div>{formatArea(proj.areaAcquired)} / {formatArea(proj.totalAreaRequired)}</div>
                    <div className="text-[10px] text-slate-500">{getPercentage(proj.areaAcquired, proj.totalAreaRequired)}%</div>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-emerald-400">
                    ₹{proj.compensationDisbursed} L
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(proj.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/projects/${proj.id}`}>
                      <Button variant="ghost" size="sm" className="text-xs text-amber-400">
                        View →
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
