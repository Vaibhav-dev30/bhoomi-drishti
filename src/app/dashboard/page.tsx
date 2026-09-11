"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  ShieldCheck,
  Building2,
  Landmark,
  Coins,
  ArrowRight,
  PlusCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Factory,
  Sun,
  Trees,
  Lock,
  Unlock,
  KeyRound,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { useApp } from "@/context/app-context";
import {
  MOCK_PROJECTS,
  MOCK_PLOTS,
  TIMELINE_DATA,
} from "@/lib/mock-data";
import {
  filterProjectsForUser,
  filterPlotsForUser,
  calculateMetricsForUser,
  checkResourceAccess,
} from "@/lib/auth-store";
import { RequestAccessModal } from "@/components/auth/request-access-modal";
import { formatArea, formatCurrency, formatIndianNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { language, currentUser, scopedGrants } = useApp();
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>("PRJ-001");

  // State for Request Access Modal
  const [requestModal, setRequestModal] = useState<{
    isOpen: boolean;
    targetId: string;
    targetName: string;
    targetState?: string;
    targetDistrict?: string;
    seniorAuthorityName?: string;
    seniorAuthorityRole?: string;
  }>({
    isOpen: false,
    targetId: "",
    targetName: "",
  });

  // Calculate dynamic metrics strictly filtered to user's authorized jurisdiction
  const userMetrics = useMemo(() => {
    return calculateMetricsForUser(currentUser, scopedGrants);
  }, [currentUser, scopedGrants]);

  const authorizedProjects = useMemo(() => {
    return filterProjectsForUser(currentUser, scopedGrants, MOCK_PROJECTS);
  }, [currentUser, scopedGrants]);

  const authorizedPlots = useMemo(() => {
    return filterPlotsForUser(currentUser, scopedGrants, MOCK_PLOTS);
  }, [currentUser, scopedGrants]);

  const toggleProject = (id: string) => {
    setExpandedProjectId((prev) => (prev === id ? null : id));
  };

  const handleOpenRequestAccess = (proj: typeof MOCK_PROJECTS[0]) => {
    const check = checkResourceAccess(currentUser, scopedGrants, {
      projectId: proj.id,
      stateCode: proj.stateCode,
      state: proj.state,
      district: proj.district,
    });

    setRequestModal({
      isOpen: true,
      targetId: proj.id,
      targetName: proj.name,
      targetState: proj.state,
      targetDistrict: proj.district,
      seniorAuthorityName: check.seniorName,
      seniorAuthorityRole: check.seniorRole,
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* ───── 1. Top Executive Banner ───── */}
      <div className="relative overflow-hidden rounded-3xl border border-[#E5E0D6] bg-white p-6 sm:p-8 shadow-xs">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#E0F2FE]/40 via-[#DCFCE7]/30 to-transparent pointer-events-none rounded-full blur-3xl -z-0" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
                {currentUser?.jurisdiction.level.toUpperCase()} JURISDICTION ACTIVE
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">RFCTLARR Act 2013</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {language === "hi"
                ? "राष्ट्रीय भू-अर्जन एवं प्रबंधन डैशबोर्ड"
                : "Land Acquisition & Cadastral GIS Platform"}
            </h1>

            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Real-time statutory monitoring and plot-by-plot cadastral mapping for{" "}
              <strong className="text-slate-900 font-bold">{currentUser?.jurisdiction.displayText || "National Jurisdiction"}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/map">
              <Button size="lg" className="gap-2 bg-[#15803D] hover:bg-[#166534] text-white font-bold shadow-sm cursor-pointer">
                <MapPin className="h-4 w-4" />
                <span>Open GIS Map ({authorizedPlots.length} Plots)</span>
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline" size="lg" className="gap-2 border-[#E5E0D6] bg-[#FAF8F5] text-slate-700 hover:bg-[#F4EFEA] font-bold shadow-xs cursor-pointer">
                <Building2 className="h-4 w-4 text-[#0284C7]" />
                <span>Authorized Projects ({authorizedProjects.length})</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-6 pt-4 border-t border-[#E5E0D6] flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Authenticated Authority:</span>
            <span className="font-bold text-slate-900">{currentUser?.name}</span>
            <span className="text-slate-500 font-mono">• {currentUser?.designation}</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            {scopedGrants.length > 0 && (
              <span className="text-[#0284C7] font-semibold bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200 flex items-center gap-1.5">
                <Unlock className="w-3 h-3 text-[#0284C7]" />
                <span>{scopedGrants.length} Scoped Grant Active</span>
              </span>
            )}
            <span className="text-[#15803D] font-semibold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
              PFMS Direct Benefit Linked
            </span>
          </div>
        </div>
      </div>

      {/* ───── 2. Four Core High-Impact Metric Cards (Strictly Filtered) ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Active Authorized Projects */}
        <Card className="border-[#E5E0D6] bg-white p-5 rounded-2xl shadow-xs hover:border-[#BAE6FD] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Authorized Projects
            </span>
            <div className="p-2.5 rounded-xl bg-[#E0F2FE] text-[#0284C7]">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {userMetrics.totalProjects} {userMetrics.totalProjects === 1 ? "Project" : "Projects"}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Within {currentUser?.jurisdiction.displayText}
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-[#F2EFE8] text-xs text-[#0284C7] font-semibold">
              <span>All on statutory schedule</span>
            </div>
          </div>
        </Card>

        {/* Card 2: Mapped Plots in Jurisdiction */}
        <Card className="border-[#E5E0D6] bg-white p-5 rounded-2xl shadow-xs hover:border-[#BBF7D0] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Mapped Cadastral Plots
            </span>
            <div className="p-2.5 rounded-xl bg-[#DCFCE7] text-[#15803D]">
              <MapPin className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#15803D] tracking-tight">
              {authorizedPlots.length} Plots
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {authorizedPlots.filter((p) => p.plotStatus === "acquired").length} Acquired •{" "}
              {authorizedPlots.filter((p) => p.plotStatus === "available").length} Available
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-[#F2EFE8] text-xs text-[#15803D] font-semibold">
              <span>100% Contiguous Surveyed</span>
            </div>
          </div>
        </Card>

        {/* Card 3: Land Acquired */}
        <Card className="border-[#E5E0D6] bg-white p-5 rounded-2xl shadow-xs hover:border-[#BAE6FD] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Land Acquired
            </span>
            <div className="p-2.5 rounded-xl bg-[#E0F2FE] text-[#0284C7]">
              <Landmark className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {userMetrics.totalAreaAcquired} ha
            </div>
            <div className="text-xs text-slate-500 font-medium">
              of {userMetrics.totalAreaProposed} ha required
            </div>
            <Progress
              value={
                userMetrics.totalAreaProposed > 0
                  ? (userMetrics.totalAreaAcquired / userMetrics.totalAreaProposed) * 100
                  : 100
              }
              className="h-1.5 bg-[#F2EFE8]"
              indicatorClassName="bg-[#0284C7]"
            />
          </div>
        </Card>

        {/* Card 4: Compensation Disbursed */}
        <Card className="border-[#E5E0D6] bg-white p-5 rounded-2xl shadow-xs hover:border-[#BBF7D0] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Compensation Disbursed
            </span>
            <div className="p-2.5 rounded-xl bg-[#DCFCE7] text-[#15803D]">
              <Coins className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#15803D] tracking-tight">
              ₹{(userMetrics.totalCompensationDisbursed / 100).toFixed(1)} Cr
            </div>
            <div className="text-xs text-slate-500 font-medium">
              of ₹{(userMetrics.totalCompensationAssessed / 100).toFixed(1)} Cr assessed
            </div>
            <Progress
              value={
                userMetrics.totalCompensationAssessed > 0
                  ? (userMetrics.totalCompensationDisbursed / userMetrics.totalCompensationAssessed) * 100
                  : 100
              }
              className="h-1.5 bg-[#F2EFE8]"
              indicatorClassName="bg-[#15803D]"
            />
          </div>
        </Card>
      </div>

      {/* ───── 3. Featured Strategic Projects (With Inter-Jurisdiction Access Control) ───── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">National Benchmark Projects</h2>
            <p className="text-xs text-slate-500">
              Projects outside your authorized jurisdiction require official Senior Administrator sanction.
            </p>
          </div>
          <Link href="/map" className="text-xs font-bold text-[#15803D] hover:underline flex items-center gap-1">
            <span>View All on GIS Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {MOCK_PROJECTS.map((project) => {
            const isExpanded = expandedProjectId === project.id;
            const plotsForProject = MOCK_PLOTS.filter((p) => p.projectId === project.id);
            const acquiredCount = plotsForProject.filter((p) => p.plotStatus === "acquired").length;

            const accessCheck = checkResourceAccess(currentUser, scopedGrants, {
              projectId: project.id,
              stateCode: project.stateCode,
              state: project.state,
              district: project.district,
            });

            const isAuthorized = accessCheck.allowed;

            return (
              <div
                key={project.id}
                className={`bg-white rounded-2xl border shadow-xs overflow-hidden transition-all ${
                  isAuthorized ? "border-[#E5E0D6]" : "border-slate-200 bg-[#FAF8F5]/50"
                }`}
              >
                {/* Project Header Row */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div
                    onClick={() => isAuthorized && toggleProject(project.id)}
                    className={`flex items-start sm:items-center gap-3.5 flex-1 ${
                      isAuthorized ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-xl shrink-0 ${
                        !isAuthorized
                          ? "bg-slate-100 text-slate-400 border border-slate-200"
                          : project.type === "industrial"
                          ? "bg-sky-50 text-[#0284C7] border border-sky-100"
                          : project.type === "renewable_energy"
                          ? "bg-emerald-50 text-[#15803D] border border-emerald-100"
                          : "bg-amber-50 text-[#D97706] border border-amber-100"
                      }`}
                    >
                      {!isAuthorized ? (
                        <Lock className="w-5 h-5 text-amber-600" />
                      ) : project.type === "industrial" ? (
                        <Factory className="w-5 h-5" />
                      ) : project.type === "renewable_energy" ? (
                        <Sun className="w-5 h-5" />
                      ) : (
                        <Trees className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-xs font-bold text-slate-500">{project.projectCode}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-600 font-medium">
                          {project.district}, {project.state}
                        </span>

                        {isAuthorized ? (
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold uppercase ${
                              accessCheck.isScopedGrant
                                ? "bg-purple-50 text-purple-800 border-purple-200"
                                : "bg-emerald-50 text-emerald-800 border-emerald-200"
                            }`}
                          >
                            {accessCheck.isScopedGrant ? "Scoped Grant Active" : "Authorized"}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border-amber-200 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-amber-600" />
                            <span>Restricted Jurisdiction</span>
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-tight">
                        {project.name}
                      </h3>
                    </div>
                  </div>

                  {/* Right Side Stats & Actions */}
                  <div className="flex items-center gap-4 sm:gap-6 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    {isAuthorized ? (
                      <>
                        <div className="text-left md:text-right">
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Plots</span>
                          <span className="text-sm font-bold text-slate-900 font-mono">
                            {acquiredCount}/{plotsForProject.length} Acquired
                          </span>
                        </div>

                        <div className="text-left md:text-right">
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Land Required</span>
                          <span className="text-sm font-bold text-slate-900 font-mono">
                            {project.totalAreaRequired} ha
                          </span>
                        </div>

                        <button
                          onClick={() => toggleProject(project.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleOpenRequestAccess(project)}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs gap-1.5 shadow-xs"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Request Access</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Details for Authorized Projects */}
                {isAuthorized && isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-[#F2EFE8] bg-[#FAF8F5]/60 space-y-4">
                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                      {project.description}
                    </p>

                    {/* Plots Preview Strip */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-800">
                          Cadastral Plots in this Project ({plotsForProject.length} Total):
                        </span>
                        <Link
                          href="/map"
                          className="text-xs font-bold text-[#15803D] hover:underline flex items-center gap-1"
                        >
                          <span>Inspect on GIS Map</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {plotsForProject.map((plot) => (
                          <div
                            key={plot.id}
                            className="p-2 rounded-xl border bg-white border-emerald-200 text-slate-800 text-xs shadow-2xs"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-900">{plot.plotNumber}</span>
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono truncate">
                              {plot.surveyNumber} • {plot.dimensions}
                            </div>
                            <div className="text-[10px] font-semibold text-[#15803D] mt-0.5">
                              ₹{(plot.marketValue / 10000000).toFixed(2)} Cr
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Milestone & Links */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E5E0D6] text-xs">
                      <div className="flex items-center gap-4 text-slate-600">
                        <span>Requiring Body: <strong className="text-slate-800">{project.lrbName}</strong></span>
                        <span>•</span>
                        <span>Families Affected: <strong className="text-slate-800">{project.totalAffectedFamilies}</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/projects/${project.id}`}>
                          <Button size="sm" variant="outline" className="border-[#E5E0D6] bg-white text-slate-700 text-xs font-semibold">
                            Full Project Dossier
                          </Button>
                        </Link>
                        <Link href="/map">
                          <Button size="sm" className="bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold">
                            Open in GIS Map →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ───── 4. Progression Trajectory Chart ───── */}
      <Card className="border-[#E5E0D6] bg-white p-6 rounded-3xl shadow-xs">
        <CardHeader className="p-0 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-extrabold text-slate-900">
                Land Progression Trajectory (FY 2024–25)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Statutory progression trajectory for {currentUser?.jurisdiction.displayText}
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-bold text-[#15803D] bg-[#DCFCE7] px-3 py-1 rounded-full border border-[#BBF7D0]">
              78.7% Realized
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TIMELINE_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="notifiedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="acquiredGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15803d" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#15803d" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F2EFE8" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E5E0D6",
                    borderRadius: "12px",
                    color: "#0F172A",
                    fontSize: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Area
                  type="monotone"
                  dataKey="areaNotified"
                  name="Area Notified (ha)"
                  stroke="#0284c7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#notifiedGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="areaAcquired"
                  name="Land Acquired (ha)"
                  stroke="#15803d"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#acquiredGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* REQUEST ACCESS MODAL */}
      <RequestAccessModal
        isOpen={requestModal.isOpen}
        onClose={() => setRequestModal((prev) => ({ ...prev, isOpen: false }))}
        targetType="project"
        targetId={requestModal.targetId}
        targetName={requestModal.targetName}
        targetState={requestModal.targetState}
        targetDistrict={requestModal.targetDistrict}
        seniorAuthorityName={requestModal.seniorAuthorityName}
        seniorAuthorityRole={requestModal.seniorAuthorityRole}
      />
    </div>
  );
}
