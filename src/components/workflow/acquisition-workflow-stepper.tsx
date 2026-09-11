"use client";

import React, { useState } from "react";
import {
  LAMS_12_STAGES,
  BhuNakshaProject,
} from "@/lib/bhunaksha-service";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ChevronRight,
  ShieldCheck,
  Building,
  ArrowRight,
  Sparkles,
  Gavel,
  Coins,
  Send,
  Calendar,
  Layers,
  MapPin,
  CreditCard,
  Flag,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  project: BhuNakshaProject;
  onAdvanceStage?: (newStageIndex: number) => void;
}

// Stage details lookup for documents and authority
const STAGE_EXECUTION_DETAILS: Record<
  number,
  {
    durationDays: number;
    responsibleAuthority: string;
    requiredDocuments: string[];
  }
> = {
  1: {
    durationDays: 30,
    responsibleAuthority: "Land Requiring Body (LRB) / District Collector",
    requiredDocuments: ["Form-1A Requisition", "Alignment Map", "Feasibility Report"],
  },
  2: {
    durationDays: 21,
    responsibleAuthority: "Survey of India & PWD / NHAI Cadastral Cell",
    requiredDocuments: ["Corridor Centerline KMZ", "Right-of-Way Buffer Map", "Coordinate GeoJSON"],
  },
  3: {
    durationDays: 15,
    responsibleAuthority: "District Land Records Officer (DLRO)",
    requiredDocuments: ["BhuNaksha Cadastral Sheet", "Intersection Analysis Report", "Affected Khasra Registry"],
  },
  4: {
    durationDays: 21,
    responsibleAuthority: "Tehsildar & Revenue Circle Office",
    requiredDocuments: ["7/12 RoR Computerized Extracts", "Khatauni Register", "Encumbrance Certificate"],
  },
  5: {
    durationDays: 45,
    responsibleAuthority: "SLAO Land Surveyor & LRB Engineers",
    requiredDocuments: ["JMS Panchnama", "DGPS Vertex Report", "Tree & Structure Census"],
  },
  6: {
    durationDays: 60,
    responsibleAuthority: "Competent Authority for Land Acquisition (CALA)",
    requiredDocuments: ["Section 15 Objection Dossier", "Public Hearing Minutes", "CALA Order Sec 15(2)"],
  },
  7: {
    durationDays: 30,
    responsibleAuthority: "Revenue Department, Govt of NCT of Delhi",
    requiredDocuments: ["Gazette Notification Sec 11", "Declaration Sec 19", "Gram Panchayat Notice Proof"],
  },
  8: {
    durationDays: 30,
    responsibleAuthority: "District Collector / CALA",
    requiredDocuments: ["Section 23 Award Decree", "Apportionment Schedule", "Title Clearance Order"],
  },
  9: {
    durationDays: 15,
    responsibleAuthority: "CALA Valuation & Finance Wing",
    requiredDocuments: ["Valuation Matrix (1.5x Multiplier)", "100% Solatium Sheet", "12% Additional Interest Ledger"],
  },
  10: {
    durationDays: 30,
    responsibleAuthority: "District Treasury & Escrow Bank (PFMS)",
    requiredDocuments: ["PFMS e-Kuber Scroll", "Direct Benefit Transfer Memo", "Bank Acknowledgment"],
  },
  11: {
    durationDays: 15,
    responsibleAuthority: "CALA & Acquiring Body PIU",
    requiredDocuments: ["Section 38 Possession Memo", "Vesting Certificate", "Demarcation Panchnama"],
  },
  12: {
    durationDays: 90,
    responsibleAuthority: "Administrator R&R & District Collector",
    requiredDocuments: ["R&R Entitlement Package", "Relocation Grants Ledger", "Alternative Housing Allotment"],
  },
};

export function AcquisitionWorkflowStepper({ project, onAdvanceStage }: Props) {
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(
    project.currentWorkflowStageIndex || 0
  );
  const [activeTabStage, setActiveTabStage] = useState<number>(
    project.currentWorkflowStageIndex || 0
  );
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const activeStageConfig = LAMS_12_STAGES[activeTabStage] || LAMS_12_STAGES[0];
  const activeExecutionDetail =
    STAGE_EXECUTION_DETAILS[activeStageConfig.stageNumber] || STAGE_EXECUTION_DETAILS[1];

  const handleAdvance = () => {
    if (currentStageIdx < LAMS_12_STAGES.length - 1) {
      const next = currentStageIdx + 1;
      setCurrentStageIdx(next);
      setActiveTabStage(next);
      if (onAdvanceStage) onAdvanceStage(next);
      setActionSuccessMessage(
        `Successfully advanced project to Stage ${next + 1}: ${LAMS_12_STAGES[next].title}`
      );
      setTimeout(() => setActionSuccessMessage(null), 4000);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E5E0D6] p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D6] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
              RFCTLARR Act 2013 Statutory Tracker
            </span>
            <span className="text-xs font-mono text-slate-500 font-semibold">
              Stage {currentStageIdx + 1} of 12
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            Statutory Land Acquisition Lifecycle
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Active CALA Authority: <strong className="text-slate-800">{project.calaOfficer}</strong>
          </p>
        </div>

        <Button
          onClick={handleAdvance}
          disabled={currentStageIdx >= LAMS_12_STAGES.length - 1}
          className="bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold gap-1.5 shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Advance to Next Statutory Stage</span>
        </Button>
      </div>

      {actionSuccessMessage && (
        <div className="p-3 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* 12-Stage Horizontal Stepper Carousel / Strip */}
      <div className="overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center min-w-[840px] gap-2">
          {LAMS_12_STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIdx;
            const isCurrent = idx === currentStageIdx;
            const isSelectedTab = idx === activeTabStage;

            return (
              <button
                key={stage.code}
                onClick={() => setActiveTabStage(idx)}
                className={`flex-1 p-3 rounded-2xl border text-left transition-all cursor-pointer relative min-w-[120px] ${
                  isSelectedTab
                    ? "border-[#15803D] bg-[#F0FDF4] shadow-xs ring-2 ring-[#15803D]/20"
                    : isCompleted
                    ? "border-[#BBF7D0] bg-[#FAF8F5] text-slate-700 hover:bg-[#F2EFE8]"
                    : isCurrent
                    ? "border-amber-300 bg-amber-50/60 text-slate-800"
                    : "border-[#E5E0D6] bg-white text-slate-400 hover:text-slate-600"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCompleted
                        ? "bg-[#15803D] text-white"
                        : isCurrent
                        ? "bg-amber-500 text-white animate-pulse"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isCompleted ? "✓" : idx + 1}
                  </span>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    {isCompleted ? "Done" : isCurrent ? "Active" : "Pending"}
                  </span>
                </div>
                <div className="font-extrabold text-[11px] leading-tight truncate text-slate-900">
                  {stage.shortTitle}
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5 font-mono">
                  {stage.actReference.split(" ")[0]} {stage.actReference.split(" ")[1]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Deep-Dive Dossier */}
      <div className="rounded-2xl border border-[#E5E0D6] bg-[#FAF8F5] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D6] pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]">
                STAGE {activeStageConfig.stageNumber}: {activeStageConfig.code.toUpperCase()}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Statutory Window: {activeExecutionDetail.durationDays} Days
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              {activeStageConfig.title}
            </h3>
            <span className="text-xs text-amber-800 font-semibold block">
              Legal Mandate: {activeStageConfig.actReference}
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#E5E0D6] text-xs space-y-0.5 shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Enforcing Authority
            </span>
            <span className="font-bold text-slate-900 block">
              {activeExecutionDetail.responsibleAuthority}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {activeStageConfig.description}
        </p>

        {/* Required Statutory Documents */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Statutory Records & Gazettes Required:
          </span>
          <div className="flex flex-wrap gap-2">
            {activeExecutionDetail.requiredDocuments.map((doc: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 rounded-xl bg-white border border-[#E5E0D6] text-xs font-semibold text-slate-800 flex items-center gap-1.5 shadow-2xs"
              >
                <FileText className="h-3.5 w-3.5 text-[#0284C7]" />
                <span>{doc}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

