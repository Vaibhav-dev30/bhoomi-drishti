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
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  Sparkles,
  Gavel,
  Coins,
  Compass,
  Eye,
  Download,
  Layers,
  AlertCircle,
  Check,
  RotateCcw,
  Users,
  CreditCard,
  Flag,
  Home,
  FileCheck,
  Landmark,
  BadgeAlert,
} from "lucide-react";
import { useApp } from "@/context/app-context";
import { checkResourceAccess } from "@/lib/auth-store";
import { RequestAccessModal } from "@/components/auth/request-access-modal";
import { MOCK_PROJECTS, MOCK_PLOTS, MOCK_FAMILIES, INDIAN_STATES } from "@/lib/mock-data";
import {
  BHUNAKSHA_PROJECTS,
  LAMS_12_STAGES,
  Lams12Stage,
  BhuNakshaProject,
} from "@/lib/bhunaksha-service";
import { ProjectStatus } from "@/types";
import { formatArea, formatCurrency, formatDate, getPercentage } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Statutory stage execution metadata (legal authorities, durations, evidence)
const STAGE_EXECUTION_DETAILS: Record<
  number,
  {
    durationDays: number;
    responsibleAuthority: string;
    requiredDocuments: string[];
    statutoryRole: string;
  }
> = {
  1: {
    durationDays: 30,
    responsibleAuthority: "Land Requiring Body (LRB) / District Collector",
    requiredDocuments: ["Form-1A Requisition", "Alignment Corridor Map", "Preliminary Feasibility Report"],
    statutoryRole: "Formal requisition submitted under RFCTLARR Act 2013 Sec 4.",
  },
  2: {
    durationDays: 21,
    responsibleAuthority: "Survey of India & PWD / NHAI Cadastral Cell",
    requiredDocuments: ["Corridor Centerline KMZ", "Right-of-Way Buffer Map (60m)", "Coordinate GeoJSON"],
    statutoryRole: "Spatial DGPS alignment overlaid on village cadastral sheet.",
  },
  3: {
    durationDays: 15,
    responsibleAuthority: "District Land Records Officer (DLRO)",
    requiredDocuments: ["BhuNaksha Cadastral Sheet", "Spatial Intersection Matrix", "Affected Khasra Registry"],
    statutoryRole: "Automated vector intersection identifying 10 affected and 4 buffer parcels.",
  },
  4: {
    durationDays: 21,
    responsibleAuthority: "Tehsildar & Revenue Circle Office",
    requiredDocuments: ["7/12 RoR Computerized Extracts", "Khatauni Register", "Encumbrance Certificate"],
    statutoryRole: "Bhulekh Record-of-Rights cross-verification and titleholder validation.",
  },
  5: {
    durationDays: 45,
    responsibleAuthority: "Special Land Acquisition Officer (SLAO) & Surveyors",
    requiredDocuments: ["JMS Panchnama", "DGPS Boundary Survey", "Tree & Structure Census"],
    statutoryRole: "Ground-truthing with DGPS boundary demarcation and asset inventory.",
  },
  6: {
    durationDays: 60,
    responsibleAuthority: "Competent Authority for Land Acquisition (CALA)",
    requiredDocuments: ["Section 15 Objection Dossier", "Public Hearing Minutes", "CALA Order Sec 15(2)"],
    statutoryRole: "Hearing of landowner claims and boundary alignment petitions.",
  },
  7: {
    durationDays: 30,
    responsibleAuthority: "Revenue Department, Govt of NCT of Delhi",
    requiredDocuments: ["Gazette Notification Sec 11", "Declaration Sec 19", "Gram Panchayat Notice Proof"],
    statutoryRole: "Official Gazette publication freezing private land transactions.",
  },
  8: {
    durationDays: 30,
    responsibleAuthority: "District Magistrate / CALA Division",
    requiredDocuments: ["Section 23 Award Decree", "Apportionment Schedule", "Title Clearance Order"],
    statutoryRole: "Formal Land Acquisition Award pronouncement per parcel.",
  },
  9: {
    durationDays: 15,
    responsibleAuthority: "CALA Valuation & Finance Wing",
    requiredDocuments: ["Valuation Matrix (1.5x Multiplier)", "100% Solatium Sheet", "12% Additional Interest Ledger"],
    statutoryRole: "Statutory compensation computation under Sections 26–30.",
  },
  10: {
    durationDays: 30,
    responsibleAuthority: "District Treasury & Escrow Bank (PFMS)",
    requiredDocuments: ["PFMS e-Kuber Scroll", "Direct Benefit Transfer Memo", "Bank Acknowledgment"],
    statutoryRole: "Direct Bank Transfer to verified Aadhaar-linked accounts.",
  },
  11: {
    durationDays: 15,
    responsibleAuthority: "CALA & NHAI Project Implementation Unit (PIU)",
    requiredDocuments: ["Section 38 Possession Memo", "Vesting Certificate", "Demarcation Panchnama"],
    statutoryRole: "Physical possession taken free from all encumbrances and revenue mutation.",
  },
  12: {
    durationDays: 90,
    responsibleAuthority: "Administrator R&R & District Collector",
    requiredDocuments: ["R&R Entitlement Package", "Relocation Grants Ledger", "Alternative Housing Allotment"],
    statutoryRole: "Second Schedule rehabilitation assistance for 4 displaced families.",
  },
};

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
  const [activeTab, setActiveTab] = useState<"stepper" | "khasras" | "matrix" | "families" | "documents">("stepper");

  // Demonstrable Project State
  const flagshipProject = MOCK_PROJECTS[0];
  const bhuProject = BHUNAKSHA_PROJECTS[0];

  // Interactive 12-stage demo state (current step defaulted to stage 8: Section 23 Award)
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(8);
  const [inspectedStageNumber, setInspectedStageNumber] = useState<number>(8);
  const [stepNotification, setStepNotification] = useState<string | null>(null);

  // Filtered projects list
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

  const activeInspectedStage = useMemo(() => {
    return LAMS_12_STAGES.find((s) => s.stageNumber === inspectedStageNumber) || LAMS_12_STAGES[0];
  }, [inspectedStageNumber]);

  const activeExecutionDetail = useMemo(() => {
    return STAGE_EXECUTION_DETAILS[inspectedStageNumber] || STAGE_EXECUTION_DETAILS[1];
  }, [inspectedStageNumber]);

  // Advance simulation to stage
  const handleSetSimulatedStage = (stageNum: number) => {
    setCurrentStageIdx(stageNum);
    setInspectedStageNumber(stageNum);
    const targetStage = LAMS_12_STAGES.find((s) => s.stageNumber === stageNum);
    setStepNotification(`Simulated project progress advanced to Stage ${stageNum}: ${targetStage?.shortTitle || ""}`);
    setTimeout(() => setStepNotification(null), 4000);
  };

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

  const access = checkResourceAccess(currentUser, scopedGrants, {
    projectId: flagshipProject.id,
    state: flagshipProject.state,
    stateCode: flagshipProject.stateCode,
    district: flagshipProject.district,
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* ───── 1. Top Executive Banner ───── */}
      <div className="relative overflow-hidden rounded-3xl border border-[#E5E0D6] bg-gradient-to-br from-white via-[#FAF8F5] to-[#F0FDF4]/60 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]">
                <FolderKanban className="h-3.5 w-3.5" />
                <span>Statutory Land Acquisition Registry</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>RFCTLARR Act 2013 Statutory Compliance</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]">
                <Compass className="h-3 w-3" />
                <span>NIC BhuNaksha GIS Integration</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {language === "hi" ? "भू-अर्जन परियोजना प्रबंधन एवं वैधानिक चरण" : "Project Management & 12-Stage Statutory Lifecycle"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {language === "hi"
                ? "दिल्ली-एनसीआर एवं गाज़ियाबाद भू-अर्जन परियोजनाओं के सभी 12 वैधानिक चरणों का इंटरैक्टिव प्रदर्शन, भू-नक्शा के खसरों और भूलेख रिकॉर्ड के साथ।"
                : "Interactive statutory lifecycle demonstrating land acquisition workflows across Delhi and Ghaziabad corridor nodes, from Section 4 Requisition to Section 38 Possession and Handover."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link href="/map?stage=8">
              <Button size="sm" className="h-9 gap-1.5 bg-[#15803D] hover:bg-[#166534] text-white font-bold shadow-xs">
                <Compass className="h-4 w-4" />
                <span>Inspect on GIS Map</span>
              </Button>
            </Link>
            <Link href={`/projects/${flagshipProject.id}`}>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 border-[#BAE6FD] bg-[#F0F9FF] text-[#0284C7] hover:bg-[#E0F2FE] font-bold">
                <FileText className="h-4 w-4" />
                <span>Project Dossier</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Live Step Notification Toast */}
        {stepNotification && (
          <div className="mt-4 p-3 rounded-2xl bg-[#DCFCE7] border border-[#86EFAC] text-xs text-[#15803D] font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#15803D]" />
            <span>{stepNotification}</span>
          </div>
        )}
      </div>

      {/* ───── 2. Interactive 12-Stage Statutory Lifecycle Step Navigator & Explorer ───── */}
      <div className="rounded-3xl border border-[#E5E0D6] bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2EFE8] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#0284C7]" />
                <span>12-Stage Statutory Acquisition Step Explorer</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E0F2FE] text-[#0284C7]">
                Active: Step {inspectedStageNumber} of 12
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Click any stage below to inspect its statutory mandate, responsible authority, evidentiary documents, and active cadastral khasras.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSetSimulatedStage(8)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-[#FAF8F5] border border-[#E5E0D6] px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
              <span>Reset to Award Stage (8)</span>
            </button>
          </div>
        </div>

        {/* Horizontal Step Pills Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {LAMS_12_STAGES.map((s) => {
            const isCurrentSimulated = s.stageNumber === currentStageIdx;
            const isInspected = s.stageNumber === inspectedStageNumber;
            const isCompleted = s.stageNumber < currentStageIdx;

            return (
              <button
                key={s.stageNumber}
                onClick={() => setInspectedStageNumber(s.stageNumber)}
                className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  isInspected
                    ? "border-[#0284C7] bg-[#F0F9FF] shadow-xs ring-2 ring-[#0284C7]/20"
                    : isCurrentSimulated
                    ? "border-amber-400 bg-amber-50/70"
                    : isCompleted
                    ? "border-[#E5E0D6] bg-white hover:border-[#CBD5E1]"
                    : "border-[#F2EFE8] bg-[#FAF8F5]/60 hover:bg-white text-slate-400"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      Step {s.stageNumber < 10 ? `0${s.stageNumber}` : s.stageNumber}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#15803D]" />
                    ) : isCurrentSimulated ? (
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    ) : (
                      <Clock className="h-3 w-3 text-slate-400" />
                    )}
                  </div>
                  <div className="text-xs font-bold text-slate-900 leading-tight line-clamp-1">
                    {s.shortTitle}
                  </div>
                  <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-mono">
                    {s.actReference}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[10px]">
                  <span
                    className={`font-semibold capitalize ${
                      isCompleted
                        ? "text-[#15803D]"
                        : isCurrentSimulated
                        ? "text-amber-700 font-bold"
                        : "text-slate-400"
                    }`}
                  >
                    {isCompleted ? "Completed" : isCurrentSimulated ? "Active Stage" : "Upcoming"}
                  </span>
                  <span className="text-slate-400 font-mono">{STAGE_EXECUTION_DETAILS[s.stageNumber]?.durationDays}d</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Step Deep-Dive Inspector Panel */}
        <div className="rounded-2xl border border-[#BAE6FD] bg-gradient-to-br from-[#F0F9FF] via-white to-[#FAF8F5] p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E0F2FE] pb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-extrabold bg-[#0284C7] text-white">
                  Step {activeInspectedStage.stageNumber}: {activeInspectedStage.title}
                </span>
                <Badge variant="outline" className="font-mono text-xs border-[#BAE6FD] text-[#0369A1] bg-white">
                  {activeInspectedStage.actReference}
                </Badge>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                  activeInspectedStage.stageNumber < currentStageIdx
                    ? "bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]"
                    : activeInspectedStage.stageNumber === currentStageIdx
                    ? "bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}>
                  Status: {activeInspectedStage.stageNumber < currentStageIdx ? "Completed" : activeInspectedStage.stageNumber === currentStageIdx ? "Currently Active in Project" : "Pending Execution"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-3xl leading-relaxed">
                {activeInspectedStage.description}
              </p>
            </div>

            {/* Quick Demonstration Actions */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link href={`/map?stage=${activeInspectedStage.stageNumber}`}>
                <Button size="sm" className="h-9 gap-1.5 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold shadow-xs">
                  <Compass className="h-3.5 w-3.5" />
                  <span>Inspect on BhuNaksha GIS Map</span>
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSetSimulatedStage(activeInspectedStage.stageNumber)}
                className="h-9 gap-1.5 border-[#BAE6FD] bg-white text-[#0284C7] hover:bg-[#E0F2FE] text-xs font-bold"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Simulate Step {activeInspectedStage.stageNumber}</span>
              </Button>
            </div>
          </div>

          {/* Detailed Stage Execution Spec Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Column 1: Authority & Mandate */}
            <div className="bg-white p-4 rounded-xl border border-[#E5E0D6] space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                <Building className="h-3 w-3 text-[#0284C7]" />
                Responsible Statutory Authority
              </span>
              <div className="font-bold text-slate-900 text-sm">{activeExecutionDetail.responsibleAuthority}</div>
              <p className="text-slate-600 leading-relaxed text-[11px] pt-1 border-t border-slate-100">
                {activeExecutionDetail.statutoryRole}
              </p>
              <div className="pt-2 flex items-center justify-between text-slate-500 text-[11px]">
                <span>Mandated Duration:</span>
                <span className="font-mono font-bold text-slate-900">{activeExecutionDetail.durationDays} Days</span>
              </div>
            </div>

            {/* Column 2: Required Evidentiary Documents */}
            <div className="bg-white p-4 rounded-xl border border-[#E5E0D6] space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                <FileText className="h-3 w-3 text-[#15803D]" />
                Evidentiary Documents & Records
              </span>
              <div className="space-y-1.5 pt-1">
                {activeExecutionDetail.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-1.5 rounded-lg bg-[#FAF8F5] border border-[#F2EFE8] text-[11px] font-medium text-slate-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#15803D] shrink-0" />
                    <span className="truncate">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Cadastral Parcels Behavior at this Step */}
            <div className="bg-white p-4 rounded-xl border border-[#E5E0D6] space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                <Layers className="h-3 w-3 text-[#B45309]" />
                Cadastral Scope ({bhuProject.name})
              </span>
              <div className="space-y-1 text-slate-700 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Khasras Surveyed:</span>
                  <span className="font-mono font-bold text-slate-900">14 Khasras (18.42 Ha)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Corridor Affected Khasras:</span>
                  <span className="font-mono font-bold text-[#15803D]">10 Affected (9.85 Ha)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Buffer / Unaffected:</span>
                  <span className="font-mono font-bold text-slate-600">4 Khasras (8.57 Ha)</span>
                </div>
              </div>

              {/* Sample parcel chips */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 block mb-1">Key Parcels Active:</span>
                <div className="flex flex-wrap gap-1">
                  {bhuProject.parcels.slice(0, 6).map((p) => (
                    <Link
                      key={p.id}
                      href={`/map?khasra=${p.khasraNumber}&stage=${activeInspectedStage.stageNumber}`}
                      className="px-2 py-0.5 rounded bg-[#FAF8F5] hover:bg-[#E0F2FE] text-slate-700 hover:text-[#0284C7] border border-[#E5E0D6] text-[10px] font-mono transition-colors"
                    >
                      Khasra {p.khasraNumber}
                    </Link>
                  ))}
                  <span className="text-[10px] text-slate-400 self-center">+8 more</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───── 3. Flagship Demonstrable Project Card ───── */}
      <div className="rounded-3xl border border-[#E5E0D6] bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F2EFE8] pb-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-lg bg-[#FAF8F5] text-slate-700 font-extrabold border border-[#E5E0D6]">
                {flagshipProject.projectCode}
              </span>
              <Badge variant="default" className="capitalize bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]">
                {flagshipProject.type} Corridor
              </Badge>
              {getStatusBadge(flagshipProject.status)}
              <span className="text-xs text-slate-500 font-mono">
                Jurisdiction: {flagshipProject.district}, {flagshipProject.state}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              {flagshipProject.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed">
              {flagshipProject.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {access.allowed ? (
              <Link href={`/projects/${flagshipProject.id}`}>
                <Button size="sm" className="h-9 gap-1.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-xs">
                  <span>Open Dossier</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setRequestTarget({
                    targetType: "project",
                    targetId: flagshipProject.id,
                    targetName: flagshipProject.name,
                    targetState: flagshipProject.state,
                    targetDistrict: flagshipProject.district,
                    seniorAuthorityName: access.seniorName || currentUser?.parentAuthorityName,
                    seniorAuthorityRole: access.seniorRole || currentUser?.parentAuthorityTitle,
                  })
                }
                className="h-9 gap-1.5 border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 text-xs font-bold"
              >
                <Lock className="h-3.5 w-3.5 text-amber-700" />
                <span>Request Access</span>
              </Button>
            )}
            <Link href="/map?stage=8">
              <Button size="sm" variant="outline" className="h-9 gap-1.5 border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D] hover:bg-[#DCFCE7] text-xs font-bold">
                <MapPin className="h-3.5 w-3.5" />
                <span>BhuNaksha GIS</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Key Statutory Health KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E5E0D6] space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Land Required & Acquired</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-slate-900 font-mono">
                {formatArea(flagshipProject.areaAcquired)}
              </span>
              <span className="text-xs text-slate-500 font-mono">of {formatArea(flagshipProject.totalAreaRequired)}</span>
            </div>
            <Progress value={getPercentage(flagshipProject.areaAcquired, flagshipProject.totalAreaRequired)} className="h-2 bg-[#E5E0D6]" indicatorClassName="bg-[#15803D]" />
            <span className="text-[10px] text-[#15803D] font-bold block">
              {getPercentage(flagshipProject.areaAcquired, flagshipProject.totalAreaRequired)}% Acquired (10 of 14 Parcels)
            </span>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E5E0D6] space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">PFMS Compensation Payout</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-[#15803D] font-mono">
                ₹{(flagshipProject.compensationDisbursed / 100).toFixed(2)} Cr
              </span>
              <span className="text-xs text-slate-500 font-mono">of ₹{(flagshipProject.compensationAssessed / 100).toFixed(2)} Cr</span>
            </div>
            <Progress value={getPercentage(flagshipProject.compensationDisbursed, flagshipProject.compensationAssessed)} className="h-2 bg-[#E5E0D6]" indicatorClassName="bg-[#0284C7]" />
            <span className="text-[10px] text-[#0284C7] font-bold block">
              {getPercentage(flagshipProject.compensationDisbursed, flagshipProject.compensationAssessed)}% Disbursed via e-Kuber DBT
            </span>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E5E0D6] space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Affected Families & R&R</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-slate-900 font-mono">
                {flagshipProject.rrCompletedFamilies} / {flagshipProject.displacedFamilies}
              </span>
              <span className="text-xs text-slate-500 font-mono">{flagshipProject.totalAffectedFamilies} Affected</span>
            </div>
            <Progress value={getPercentage(flagshipProject.rrCompletedFamilies, flagshipProject.displacedFamilies)} className="h-2 bg-[#E5E0D6]" indicatorClassName="bg-purple-600" />
            <span className="text-[10px] text-purple-700 font-bold block">
              {getPercentage(flagshipProject.rrCompletedFamilies, flagshipProject.displacedFamilies)}% Resettled under Schedule II
            </span>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E5E0D6] space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Statutory Compliance</span>
            <div className="text-xl font-extrabold text-slate-900 font-mono flex items-center gap-1.5">
              <ShieldCheck className="h-5 w-5 text-[#15803D]" />
              <span>100% Compliant</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              All statutory timelines under RFCTLARR Sec 11, 15, 19, 23 & 38 strictly met.
            </p>
            <span className="text-[10px] text-slate-400 block font-mono">Target Possession: {formatDate(flagshipProject.targetCompletionDate)}</span>
          </div>
        </div>

        {/* Administrative & Geographic Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[#F2EFE8] text-xs">
          <div className="space-y-1">
            <span className="text-slate-500 font-medium">Requisitioning Agency (LRB):</span>
            <div className="font-bold text-slate-900">{flagshipProject.lrbName}</div>
            <div className="text-[11px] text-slate-500">{flagshipProject.lrbType}</div>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 font-medium">Competent Authority (CALA):</span>
            <div className="font-bold text-slate-900">Competent Authority (CALA), {flagshipProject.district}</div>
            <div className="text-[11px] text-slate-500">{bhuProject.calaOfficer}</div>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 font-medium">Cadastral Sajra Sheet:</span>
            <div className="font-bold text-slate-900">{bhuProject.sajraSheetNumber}</div>
            <div className="text-[11px] text-slate-500">{bhuProject.village}, {flagshipProject.district}</div>
          </div>
        </div>
      </div>

      {/* ───── 4. Interactive Exploration Tabs: Cadastral Khasras, Statutory Matrix, Families, Documents ───── */}
      <div className="rounded-3xl border border-[#E5E0D6] bg-white p-6 shadow-sm space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#F2EFE8] pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("stepper")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "stepper"
                ? "bg-[#0284C7] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 bg-[#FAF8F5] border border-[#E5E0D6]"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive 12-Step Lifecycle</span>
          </button>
          <button
            onClick={() => setActiveTab("khasras")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "khasras"
                ? "bg-[#0284C7] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 bg-[#FAF8F5] border border-[#E5E0D6]"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>14 Cadastral Khasras (NIC BhuNaksha)</span>
          </button>
          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "matrix"
                ? "bg-[#0284C7] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 bg-[#FAF8F5] border border-[#E5E0D6]"
            }`}
          >
            <Gavel className="h-3.5 w-3.5" />
            <span>Statutory Timeline & Legal Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab("families")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "families"
                ? "bg-[#0284C7] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 bg-[#FAF8F5] border border-[#E5E0D6]"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Affected Titleholders & R&R ({MOCK_FAMILIES.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "documents"
                ? "bg-[#0284C7] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 bg-[#FAF8F5] border border-[#E5E0D6]"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Gazette & Statutory DMS (5)</span>
          </button>
        </div>

        {/* Tab 1: Interactive Stepper Visualizer */}
        {activeTab === "stepper" && (
          <div className="space-y-6">
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E5E0D6] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    RFCTLARR Act 2013 Statutory Progression Visualizer
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Step-by-step statutory execution from Form-1A Requisition to Physical Handover under Section 38.
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-[#15803D] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Current: Stage {currentStageIdx} of 12
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Overall Acquisition Completion</span>
                  <span className="font-mono text-slate-900 font-bold">{Math.round((currentStageIdx / 12) * 100)}%</span>
                </div>
                <Progress value={(currentStageIdx / 12) * 100} className="h-2.5 bg-[#E5E0D6]" indicatorClassName="bg-[#15803D]" />
              </div>
            </div>

            {/* Stepper Timeline Visual List */}
            <div className="space-y-3">
              {LAMS_12_STAGES.map((s) => {
                const isPassed = s.stageNumber < currentStageIdx;
                const isCurrent = s.stageNumber === currentStageIdx;
                const isUpcoming = s.stageNumber > currentStageIdx;

                return (
                  <div
                    key={s.stageNumber}
                    className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isCurrent
                        ? "border-[#0284C7] bg-[#F0F9FF] shadow-sm"
                        : isPassed
                        ? "border-[#E5E0D6] bg-white"
                        : "border-[#F2EFE8] bg-[#FAF8F5]/50 opacity-80"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                        isPassed
                          ? "bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]"
                          : isCurrent
                          ? "bg-[#0284C7] text-white shadow-xs"
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                      }`}>
                        {isPassed ? <Check className="h-4 w-4" /> : s.stageNumber}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-extrabold text-slate-900">{s.title}</span>
                          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                            {s.actReference}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              Current Statutory Step
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                          {s.description}
                        </p>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Authority: <strong className="text-slate-800">{STAGE_EXECUTION_DETAILS[s.stageNumber]?.responsibleAuthority}</strong> • Duration: {STAGE_EXECUTION_DETAILS[s.stageNumber]?.durationDays} days
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <Link href={`/map?stage=${s.stageNumber}`}>
                        <Button variant="outline" size="sm" className="h-8 text-xs font-bold gap-1 border-[#BAE6FD] bg-white text-[#0284C7] hover:bg-[#E0F2FE]">
                          <Compass className="h-3.5 w-3.5" />
                          <span>Map View</span>
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        onClick={() => handleSetSimulatedStage(s.stageNumber)}
                        className={`h-8 text-xs font-bold ${
                          isCurrent
                            ? "bg-[#0284C7] text-white hover:bg-[#0369A1]"
                            : "bg-[#FAF8F5] text-slate-700 hover:bg-[#E5E0D6] border border-[#E5E0D6]"
                        }`}
                      >
                        {isCurrent ? "Active" : "Jump to Step"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: 14 Cadastral Khasras Table */}
        {activeTab === "khasras" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Displaying all <strong className="text-slate-900 font-bold">{bhuProject.parcels.length} Demonstration Khasras</strong> of {bhuProject.village} Sajra Sheet
              </span>
              <span className="font-mono text-slate-700 font-bold">
                {bhuProject.totalAffectedParcels} Affected ({bhuProject.totalAffectedAreaHa} Ha) • {bhuProject.totalParcelsInVillageSheet - bhuProject.totalAffectedParcels} Buffer ({bhuProject.totalUnaffectedAreaHa} Ha)
              </span>
            </div>

            <div className="rounded-2xl border border-[#E5E0D6] overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#E5E0D6] bg-[#FAF8F5]">
                    <TableHead className="text-slate-700 font-bold text-xs">Khasra / Gat No</TableHead>
                    <TableHead className="text-slate-700 font-bold text-xs">ULPIN (Bhu-Aadhaar)</TableHead>
                    <TableHead className="text-slate-700 font-bold text-xs">Classification</TableHead>
                    <TableHead className="text-slate-700 font-bold text-xs">Primary Owner (Bhulekh 7/12)</TableHead>
                    <TableHead className="text-slate-700 font-bold text-xs text-right">Total Area</TableHead>
                    <TableHead className="text-slate-700 font-bold text-xs text-right">Affected Area</TableHead>
                    <TableHead className="text-slate-700 font-bold text-xs text-right">Compensation</TableHead>
                    <TableHead className="text-slate-700 font-bold text-xs">Statutory Status</TableHead>
                    <TableHead className="text-right text-slate-700 font-bold text-xs">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bhuProject.parcels.map((parcel) => (
                    <TableRow key={parcel.id} className="border-[#F2EFE8] hover:bg-[#FAF8F5] transition-colors">
                      <TableCell className="font-mono font-bold text-xs text-slate-900 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={parcel.isAffected ? "text-[#0284C7]" : "text-slate-400"}>
                            {parcel.khasraNumber}
                          </span>
                          {parcel.isAffected ? (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-100 text-red-700">
                              {parcel.acquisitionType}
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-600">
                              buffer
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-normal font-sans">{parcel.surveyNumber}</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-600">
                        {parcel.ulpin}
                      </TableCell>
                      <TableCell className="text-xs text-slate-700 capitalize">
                        {parcel.landClassification.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell className="text-xs text-slate-900 font-medium">
                        <div>{parcel.owners[0]?.name || "Government / Gram Sabha"}</div>
                        <div className="text-[10px] text-slate-500">Khatauni: {parcel.owners[0]?.khatauniNumber || "N/A"}</div>
                      </TableCell>
                      <TableCell className="text-xs font-mono text-right text-slate-700">
                        {parcel.recordedRoRAreaHa.toFixed(2)} ha
                      </TableCell>
                      <TableCell className="text-xs font-mono text-right font-bold text-slate-900">
                        {parcel.isAffected ? `${parcel.affectedAreaHa.toFixed(2)} ha` : "0.00 ha"}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-right font-extrabold text-[#15803D]">
                        {parcel.valuation?.totalCompensationPayable
                          ? `₹${(parcel.valuation.totalCompensationPayable / 100000).toFixed(1)} L`
                          : "₹0.0 L"}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          parcel.status === "possessed_mutated"
                            ? "bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]"
                            : parcel.status === "compensation_paid"
                            ? "bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]"
                            : parcel.status === "award_assessed"
                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                            : "bg-[#FAF8F5] text-slate-600 border border-[#E5E0D6]"
                        }`}>
                          {parcel.status.replace(/_/g, " ")}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/map?khasra=${parcel.khasraNumber}&stage=${currentStageIdx}`}>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs font-bold text-[#0284C7] hover:bg-[#E0F2FE]">
                            Inspect Map →
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Tab 3: Statutory Matrix */}
        {activeTab === "matrix" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#E5E0D6] overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#E5E0D6] bg-[#FAF8F5]">
                    <TableHead className="text-slate-700 font-bold text-xs">Stage #</TableHead>
                    <TableHead className="text-slate-700 font-bold text-xs">Statutory Step Title</TableHead>
                    <TableHead className="text-slate-700 font-bold text-xs">RFCTLARR 2013 Reference</TableHead>
                    <TableHead className="text-slate-700 font-bold text-xs">Responsible Authority</TableHead>
                    <TableHead className="text-slate-700 font-bold text-xs">Mandated Timeline</TableHead>
                    <TableHead className="text-slate-700 font-bold text-xs">Evidentiary Record</TableHead>
                    <TableHead className="text-right text-slate-700 font-bold text-xs">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {LAMS_12_STAGES.map((s) => {
                    const exec = STAGE_EXECUTION_DETAILS[s.stageNumber];
                    return (
                      <TableRow key={s.stageNumber} className="border-[#F2EFE8] hover:bg-[#FAF8F5] transition-colors">
                        <TableCell className="font-mono font-bold text-xs text-[#0284C7]">
                          Step {s.stageNumber}
                        </TableCell>
                        <TableCell className="font-bold text-xs text-slate-900">
                          {s.title}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-slate-600">
                          {s.actReference}
                        </TableCell>
                        <TableCell className="text-xs text-slate-800">
                          {exec?.responsibleAuthority}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-slate-700">
                          {exec?.durationDays} Days Max
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">
                          <span className="font-medium text-slate-900">{exec?.requiredDocuments[0]}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/map?stage=${s.stageNumber}`}>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs font-bold text-[#15803D] hover:bg-[#DCFCE7]">
                              Map Demo →
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Tab 4: Affected Families */}
        {activeTab === "families" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#E5E0D6] overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#E5E0D6] bg-[#FAF8F5]">
                    <TableHead className="text-slate-700 font-bold text-xs">Family Head</TableHead>
                    <TableHead className="text-slate-700 font-bold text-xs">Village & District</TableHead>
                    <TableHead className="text-slate-700 font-bold text-xs">Social Category</TableHead>
                    <TableHead className="text-slate-700 font-bold text-xs text-right">Land Acquired</TableHead>
                    <TableHead className="text-slate-700 font-bold text-xs text-right">Compensation Disbursed</TableHead>
                    <TableHead className="text-slate-700 font-bold text-xs">R&R Entitlement Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_FAMILIES.map((fam) => (
                    <TableRow key={fam.id} className="border-[#F2EFE8] hover:bg-[#FAF8F5] transition-colors">
                      <TableCell className="text-xs font-bold text-slate-900 py-3">
                        <div>{fam.familyHeadName}</div>
                        <div className="text-[10px] text-slate-500 font-normal">S/o {fam.fatherHusbandName} ({fam.familyMembers} members)</div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 font-medium">
                        {fam.village}, {flagshipProject.district}
                      </TableCell>
                      <TableCell className="text-xs uppercase font-mono">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          fam.isBPL ? "bg-red-100 text-red-700 border border-red-200" : "bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]"
                        }`}>
                          {fam.category} {fam.isBPL ? "• BPL" : ""}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs font-mono font-bold text-slate-900 text-right">
                        {fam.landLost} ha
                      </TableCell>
                      <TableCell className="text-xs font-mono text-right">
                        <div className="text-[#15803D] font-extrabold">₹{(fam.compensationPaid / 100000).toFixed(1)} L paid</div>
                        <div className="text-[10px] text-slate-500">of ₹{(fam.totalCompensation / 100000).toFixed(1)} L</div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                          fam.rrStatus === "completed"
                            ? "bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]"
                            : "bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]"
                        }`}>
                          {fam.rrStatus.replace(/_/g, " ")}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Tab 5: Documents */}
        {activeTab === "documents" && (
          <div className="space-y-3">
            {[
              { title: "Gazette Notification under Section 11(1) — Regional Corridor", date: "28 Feb 2026", size: "2.4 MB", ref: "GZ/UP/2026/1102", type: "Gazette Publication" },
              { title: "Social Impact Assessment (SIA) Final Report (Sec 6)", date: "20 Jan 2026", size: "14.8 MB", ref: "SIA/NCR/2026/88", type: "Expert Evaluation" },
              { title: "Joint Measurement Survey (JMS) Panchnama & DGPS Map", date: "15 Feb 2026", size: "8.2 MB", ref: "JMS/DEL/2026/02", type: "Survey Panchnama" },
              { title: "Section 19 Declaration of Acquisition — Delhi-NCR Nodes", date: "10 Apr 2026", size: "3.2 MB", ref: "GZ/DL/2026/1908", type: "Statutory Declaration" },
              { title: "Collector's Award Schedule under Section 23 & 31", date: "25 Jun 2026", size: "5.6 MB", ref: "AWD/CALA/2026/11", type: "Award Decree" },
            ].map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E5E0D6] bg-[#FAF8F5] hover:bg-white hover:border-[#CBD5E1] transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FEF3C7] text-[#B45309]">
                    <FileText className="h-4 w-4 shrink-0" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{doc.title}</p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Ref: {doc.ref} • {doc.type} • Published: {doc.date} • {doc.size}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs font-bold text-[#0284C7] hover:bg-[#E0F2FE] gap-1">
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PDF</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

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
