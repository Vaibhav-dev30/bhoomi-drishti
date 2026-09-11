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
  Server,
  Code2,
  Compass,
  CheckSquare,
  FileCheck,
  CreditCard,
  Flag,
  Home,
  PlayCircle,
  BarChart3,
  Info,
} from "lucide-react";
import {
  BHUNAKSHA_PROJECTS,
  LAMS_12_STAGES,
  getParcel12StageInfo,
  getProject12StageMetrics,
} from "@/lib/bhunaksha-service";
import { BhuNakshaArchitectureModal } from "@/components/docs/bhunaksha-architecture-modal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [archModalOpen, setArchModalOpen] = useState(false);
  const [selectedProjectTab, setSelectedProjectTab] = useState<string>("PRJ-001");
  const [selectedPipelineStage, setSelectedPipelineStage] = useState<number | null>(null);

  const activeProject =
    BHUNAKSHA_PROJECTS.find((p) => p.id === selectedProjectTab) ||
    BHUNAKSHA_PROJECTS[0];

  const metrics = useMemo(() => {
    return getProject12StageMetrics(activeProject);
  }, [activeProject]);

  // Map 12 stage counts for the interactive pipeline counter
  const stageCounts: Record<number, number> = useMemo(() => {
    return {
      1: metrics.totalParcels, // Proposal: all parcels
      2: metrics.totalParcels, // Footprint: all parcels in boundary
      3: metrics.affectedParcels, // Intersecting affected
      4: metrics.rorVerifiedCount, // RoR verified
      5: metrics.fieldVerifiedCount, // Ground survey verified
      6: metrics.reviewedCount, // CALA / SLAO reviewed
      7: metrics.notifiedCount, // Gazette published
      8: metrics.awardCompletedCount, // Award pronounced
      9: metrics.compensationCasesCount, // Compensation cases
      10: metrics.disbursedCount, // Disbursed via PFMS
      11: metrics.possessionCompletedCount, // Possession taken
      12: metrics.rrCompletedCount, // R&R completed
    };
  }, [metrics]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* ───── 1. Top Executive Banner ───── */}
      <div className="relative overflow-hidden rounded-3xl border border-[#E5E0D6] bg-white p-6 sm:p-7 shadow-xs">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#DCFCE7]/40 via-[#E0F2FE]/30 to-transparent pointer-events-none rounded-full blur-3xl -z-0" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
                BHUNAKSHA CADASTRAL BRIDGE ACTIVE
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">
                RFCTLARR Act 2013 & OGC WFS 2.0
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Land Acquisition Management System (LAMS)
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              End-to-end statutory land acquisition platform powered by <strong>NIC BhuNaksha</strong> cadastral maps,
              automated corridor intersection, Bhulekh RoR verification, and direct PFMS compensation disbursement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/map">
              <Button size="lg" className="gap-2 bg-[#15803D] hover:bg-[#166534] text-white font-bold shadow-sm cursor-pointer">
                <MapPin className="h-4 w-4" />
                <span>Open BhuNaksha Map (14 Khasras)</span>
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setArchModalOpen(true)}
              className="gap-2 border-[#E5E0D6] bg-white hover:bg-[#FAF8F5] text-slate-800 font-bold cursor-pointer"
            >
              <Server className="h-4 w-4 text-[#0284C7]" />
              <span>BhuNaksha Evaluation</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ───── 2. Interactive Hackathon 5-Minute Demonstration Control Bar ───── */}
      <div className="rounded-3xl border border-[#BBF7D0] bg-[#F0FDF4] p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] shrink-0 mt-0.5">
              <PlayCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-slate-900">
                  Hackathon Demonstration Controls (12 Statutory Stages)
                </h2>
                <Badge className="bg-[#15803D] text-white text-[10px] uppercase font-mono">
                  Live Prototype
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Demonstrating 14 real-world parcels through the complete RFCTLARR lifecycle. Click any stage to inspect:
              </p>
            </div>
          </div>

          {/* Quick-Jump Stage Pills for Hackathon Jury */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Link href="/map?stage=3">
              <Button size="sm" variant="outline" className="h-8 text-xs font-bold border-[#E5E0D6] bg-white hover:bg-[#FAF8F5] text-slate-700">
                <Layers className="h-3.5 w-3.5 text-red-600 mr-1" />
                Stage 3: Affected GIS
              </Button>
            </Link>
            <Link href="/map?stage=4">
              <Button size="sm" variant="outline" className="h-8 text-xs font-bold border-[#E5E0D6] bg-white hover:bg-[#FAF8F5] text-slate-700">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-600 mr-1" />
                Stage 4: RoR Verify
              </Button>
            </Link>
            <Link href="/map?stage=9">
              <Button size="sm" variant="outline" className="h-8 text-xs font-bold border-[#E5E0D6] bg-white hover:bg-[#FAF8F5] text-slate-700">
                <Coins className="h-3.5 w-3.5 text-emerald-600 mr-1" />
                Stage 9: ₹ Compensation
              </Button>
            </Link>
            <Link href="/map?stage=10">
              <Button size="sm" variant="outline" className="h-8 text-xs font-bold border-[#E5E0D6] bg-white hover:bg-[#FAF8F5] text-slate-700">
                <CreditCard className="h-3.5 w-3.5 text-teal-600 mr-1" />
                Stage 10: PFMS DBT
              </Button>
            </Link>
            <Link href="/map?stage=12">
              <Button size="sm" variant="outline" className="h-8 text-xs font-bold border-[#E5E0D6] bg-white hover:bg-[#FAF8F5] text-slate-700">
                <Home className="h-3.5 w-3.5 text-purple-600 mr-1" />
                Stage 12: R&R
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ───── 3. Standardized 4 KPI Summary Cards ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Project Parcels */}
        <div className="rounded-3xl border border-[#E5E0D6] bg-white p-5 shadow-xs flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Project Parcels
            </span>
            <Building2 className="h-5 w-5 text-[#0284C7]" />
          </div>
          <div className="my-2">
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900">
              {metrics.totalParcels} <span className="text-sm font-sans font-bold text-slate-500">Khasras</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {activeProject.totalVillageAreaHa.toFixed(2)} Ha village sheet &bull; {activeProject.sajraSheetNumber}
          </div>
        </div>

        {/* Card 2: Affected Parcels */}
        <div className="rounded-3xl border border-[#E5E0D6] bg-white p-5 shadow-xs flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Affected Parcels
            </span>
            <Layers className="h-5 w-5 text-red-600" />
          </div>
          <div className="my-2">
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900">
              {metrics.affectedParcels} <span className="text-sm font-sans font-bold text-red-600">Affected</span>
            </div>
          </div>
          <div className="text-[11px] text-red-600 font-bold">
            {Math.round((metrics.affectedParcels / metrics.totalParcels) * 100)}% of sheet &bull; {activeProject.totalAffectedAreaHa.toFixed(2)} Ha required
          </div>
        </div>

        {/* Card 3: Compensation Assessed */}
        <div className="rounded-3xl border border-[#E5E0D6] bg-white p-5 shadow-xs flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Compensation Assessed
            </span>
            <Coins className="h-5 w-5 text-[#15803D]" />
          </div>
          <div className="my-2">
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900">
              ₹{metrics.totalCompensationAssessedCr} <span className="text-sm font-sans font-bold text-slate-500">Cr</span>
            </div>
          </div>
          <div className="text-[11px] text-[#15803D] font-bold">
            ₹{metrics.totalDisbursedCr} Cr Disbursed via PFMS
          </div>
        </div>

        {/* Card 4: Possession & R&R */}
        <div className="rounded-3xl border border-[#E5E0D6] bg-white p-5 shadow-xs flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Possession & R&R
            </span>
            <Home className="h-5 w-5 text-purple-600" />
          </div>
          <div className="my-2">
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900">
              {metrics.possessionCompletedCount} <span className="text-sm font-sans font-bold text-purple-700">Possessed</span>
            </div>
          </div>
          <div className="text-[11px] text-purple-700 font-bold">
            {metrics.rrCompletedCount} Families Resettled &bull; 1 In Transit
          </div>
        </div>
      </div>

      {/* ───── 4. 12-Stage Statutory Progress Pipeline Counter ───── */}
      <div className="rounded-3xl border border-[#E5E0D6] bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D6] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]">
                RFCTLARR Act 2013 Pipeline
              </span>
              <span className="text-xs text-slate-500 font-mono">
                12 Statutory Lifecycle Stages
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight mt-1">
              Project Statutory Progression Pipeline (Khasra Plot Counts)
            </h2>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Active CALA Authority: <strong className="text-slate-800">{activeProject.calaOfficer}</strong>
          </div>
        </div>

        {/* Pipeline Counter Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-2">
          {LAMS_12_STAGES.map((s) => {
            const count = stageCounts[s.stageNumber] ?? 0;
            const isSelected = selectedPipelineStage === s.stageNumber;

            return (
              <div
                key={s.stageNumber}
                onClick={() => setSelectedPipelineStage(isSelected ? null : s.stageNumber)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-center relative ${
                  isSelected
                    ? "border-[#15803D] bg-[#F0FDF4] shadow-xs ring-2 ring-[#15803D]/20"
                    : "border-[#E5E0D6] bg-[#FAF8F5] hover:bg-[#F2EFE8]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      S{s.stageNumber}
                    </span>
                  </div>
                  <div className="font-extrabold text-xs text-slate-900 leading-tight">
                    {s.shortTitle}
                  </div>
                </div>

                <div className="my-2">
                  <span className="font-mono text-xl font-extrabold text-slate-900 block">
                    {count}
                  </span>
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block">
                    Parcels
                  </span>
                </div>

                <div className="text-[9px] text-slate-500 truncate font-mono">
                  {s.actReference.split(" ")[0]} {s.actReference.split(" ")[1]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Stage Detail Callout */}
        {selectedPipelineStage && (
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D6] text-xs space-y-1 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">
                {LAMS_12_STAGES[selectedPipelineStage - 1].title}
              </span>
              <span className="font-mono text-xs text-slate-500">
                {LAMS_12_STAGES[selectedPipelineStage - 1].actReference}
              </span>
            </div>
            <p className="text-slate-600">
              {LAMS_12_STAGES[selectedPipelineStage - 1].description}
            </p>
          </div>
        )}
      </div>

      {/* ───── 5. Active Project Dossier Card ───── */}
      <div className="space-y-4">
        {/* Project Selector Tab Strip */}
        <div className="flex items-center justify-between gap-3 border-b border-[#E5E0D6] pb-2">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Select Project:
            </span>
            {BHUNAKSHA_PROJECTS.map((proj) => {
              const isSelected = proj.id === selectedProjectTab;
              return (
                <button
                  key={proj.id}
                  onClick={() => setSelectedProjectTab(proj.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#15803D] text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-[#FAF8F5] border border-[#E5E0D6]"
                  }`}
                >
                  {proj.name}
                </button>
              );
            })}
          </div>

          <Link href={`/projects/${activeProject.id}`}>
            <Button variant="ghost" size="sm" className="text-xs font-bold text-[#0284C7] gap-1 cursor-pointer">
              <span>View Full Dossier</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Active Project Card */}
        <Card className="rounded-3xl border-[#E5E0D6] bg-white shadow-xs overflow-hidden">
          <CardHeader className="bg-[#FAF8F5]/60 border-b border-[#E5E0D6] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-[#FEF3C7] text-[#B45309] font-bold border border-[#FDE68A]">
                    {activeProject.projectCode}
                  </span>
                  <Badge className="bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]">
                    {activeProject.sector.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    Sajra: {activeProject.sajraSheetNumber}
                  </span>
                </div>
                <CardTitle className="text-xl font-extrabold text-slate-900">
                  {activeProject.name}
                </CardTitle>
                <CardDescription className="text-xs text-slate-600 mt-1">
                  {activeProject.village} Village &bull; Tehsil {activeProject.tehsil} &bull; {activeProject.district} ({activeProject.state})
                </CardDescription>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Current Statutory Milestone
                </span>
                <span className="text-sm font-extrabold text-[#15803D] block">
                  Stage {activeProject.currentWorkflowStageIndex + 1}: {activeProject.currentStageName}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  CALA: {activeProject.calaOfficer}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">RFCTLARR Statutory Execution Progress</span>
                <span className="text-[#15803D]">
                  {Math.round(((activeProject.currentWorkflowStageIndex + 1) / 12) * 100)}% Complete (Stage {activeProject.currentWorkflowStageIndex + 1}/12)
                </span>
              </div>
              <Progress
                value={Math.round(((activeProject.currentWorkflowStageIndex + 1) / 12) * 100)}
                className="h-2.5 bg-slate-100"
              />
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E5E0D6]">
                <span className="text-slate-500 block">Affected Parcels</span>
                <span className="font-mono font-extrabold text-lg text-slate-900 block mt-0.5">
                  {activeProject.totalAffectedParcels} / {activeProject.parcels.length}
                </span>
                <span className="text-[10px] text-red-600 font-semibold">
                  {activeProject.corridorWidthMeters ? `${activeProject.corridorWidthMeters}m Corridor` : "Zonal Boundary"}
                </span>
              </div>

              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E5E0D6]">
                <span className="text-slate-500 block">Land Required</span>
                <span className="font-mono font-extrabold text-lg text-slate-900 block mt-0.5">
                  {activeProject.totalAffectedAreaHa} Ha
                </span>
                <span className="text-[10px] text-slate-500">
                  {(activeProject.totalAffectedAreaHa * 2.471).toFixed(1)} Acres
                </span>
              </div>

              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E5E0D6]">
                <span className="text-slate-500 block">Assessed Compensation</span>
                <span className="font-mono font-extrabold text-lg text-slate-900 block mt-0.5">
                  ₹{(activeProject.totalEstimatedCompensationLakhs / 100).toFixed(2)} Cr
                </span>
                <span className="text-[10px] text-[#15803D] font-semibold">
                  Sec 26-30 Statutory Award
                </span>
              </div>

              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E5E0D6]">
                <span className="text-slate-500 block">Disbursed to Landowners</span>
                <span className="font-mono font-extrabold text-lg text-[#15803D] block mt-0.5">
                  ₹{(activeProject.totalCompensationDisbursedLakhs / 100).toFixed(2)} Cr
                </span>
                <span className="text-[10px] text-slate-500">
                  {Math.round((activeProject.totalCompensationDisbursedLakhs / activeProject.totalEstimatedCompensationLakhs) * 100)}% Disbursed
                </span>
              </div>
            </div>

            {/* Statutory Pending Action Items */}
            <div className="bg-[#FEF9C3]/60 border border-amber-300 rounded-2xl p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertTriangle className="h-4 w-4 text-amber-700" />
                <span>Pending Statutory Action Items (CALA Competent Authority)</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-amber-950 font-medium">
                <li>
                  <strong>Section 15 Objection Hearing:</strong> Khasra 104 (Priya Vasant Gaikwad) scheduled regarding drip irrigation & pomegranate tree census.
                </li>
                <li>
                  <strong>Section 27 Severance Review:</strong> Khasra 113 has 0.15 Ha residual area (&lt;0.2 Ha). Under review for compulsory total acquisition.
                </li>
                <li>
                  <strong>PFMS Escrow Sanction:</strong> Deposit balance of ₹12.7 Cr into Escrow Account prior to Section 38 physical possession notice.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ───── 6. Demonstration Walkthrough Flowchart ───── */}
      <div className="bg-white rounded-3xl border border-[#E5E0D6] p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base">
          End-to-End System Demonstration Flow
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
          {[
            { label: "1. BhuNaksha Map", icon: "🗺️", sub: "Village Sajra Sheet" },
            { label: "2. Parcel Selection", icon: "📍", sub: "Khasra / Gat No" },
            { label: "3. Land Details", icon: "📄", sub: "Bhulekh RoR Link" },
            { label: "4. Affected Land", icon: "📐", sub: "Corridor Intersection" },
            { label: "5. LARR Workflow", icon: "⚡", sub: "Sec 11 to Sec 38" },
            { label: "6. Compensation", icon: "💰", sub: "Market × 1.5 + Solatium" },
            { label: "7. Status Tracking", icon: "📊", sub: "Plot-by-Plot Ledger" },
            { label: "8. Dashboard", icon: "🏛️", sub: "Executive Overview" },
          ].map((step, idx) => (
            <div key={idx} className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#E5E0D6] space-y-1">
              <span className="text-xl block">{step.icon}</span>
              <span className="font-bold text-slate-900 block text-[11px] leading-tight">{step.label}</span>
              <span className="text-[10px] text-slate-500 block leading-tight">{step.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Evaluation Modal */}
      <BhuNakshaArchitectureModal
        open={archModalOpen}
        onOpenChange={setArchModalOpen}
      />
    </div>
  );
}

