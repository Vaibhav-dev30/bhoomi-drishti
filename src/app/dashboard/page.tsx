"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  ChevronRight,
  Layers,
  Server,
  Compass,
  CheckSquare,
  FileCheck,
  CreditCard,
  Flag,
  Home,
  PlayCircle,
  BarChart3,
  Info,
  RotateCcw,
  Check,
  Activity,
  Maximize2,
} from "lucide-react";
import {
  BHUNAKSHA_PROJECTS,
  LAMS_12_STAGES,
  getProject12StageMetrics,
} from "@/lib/bhunaksha-service";
import { BhuNakshaArchitectureModal } from "@/components/docs/bhunaksha-architecture-modal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Project Data Models for Interactive Experience
interface ProjectItem {
  id: string;
  code: string;
  name: string;
  type: string;
  location: string;
  state: string;
  district: string;
  isDemo?: boolean;
  overallProgress: number;
  statusText: string;
  currentActivity: string;
  lastUpdated: string;
  landRequiredHa: number;
  landAcquiredHa: number;
  compensationDisbursedCr: number;
  districtsCount: number;
  stages: {
    name: string;
    progress: number;
    status: "completed" | "in_progress" | "pending";
    note?: string;
  }[];
}

const DASHBOARD_PROJECTS: ProjectItem[] = [
  {
    id: "PRJ-001",
    code: "NH-48-EXP",
    name: "NH-48 Greenfield Express Bypass",
    type: "National Highway / Expressway",
    location: "Musalgaon, Sinnar Tehsil",
    district: "Nashik",
    state: "Maharashtra",
    overallProgress: 68,
    statusText: "Land Acquisition in Progress",
    currentActivity: "Statutory award verification is currently in progress",
    lastUpdated: "12 minutes ago",
    landRequiredHa: 1284,
    landAcquiredHa: 873,
    compensationDisbursedCr: 428,
    districtsCount: 6,
    stages: [
      { name: "Land Identification", progress: 100, status: "completed" },
      { name: "Survey & Verification", progress: 100, status: "completed" },
      { name: "Statutory Process", progress: 82, status: "in_progress", note: "82% Gazette notices cleared" },
      { name: "Land Acquisition", progress: 68, status: "in_progress", note: "68% plots formally acquired" },
      { name: "Compensation", progress: 54, status: "in_progress", note: "54% DBT disbursed" },
      { name: "Final Handover", progress: 0, status: "pending" },
    ],
  },
  {
    id: "PRJ-002",
    code: "RIC-SURAT",
    name: "Regional Infrastructure Corridor",
    type: "Multimodal Freight & Industrial",
    location: "Kim & Kosamba Nodes",
    district: "Surat",
    state: "Gujarat",
    overallProgress: 42,
    statusText: "Survey & Verification in Progress",
    currentActivity: "Joint measurement survey of 28 revenue villages active",
    lastUpdated: "25 minutes ago",
    landRequiredHa: 2140,
    landAcquiredHa: 899,
    compensationDisbursedCr: 216,
    districtsCount: 4,
    stages: [
      { name: "Land Identification", progress: 100, status: "completed" },
      { name: "Survey & Verification", progress: 78, status: "in_progress", note: "78% field survey verified" },
      { name: "Statutory Process", progress: 40, status: "in_progress", note: "Section 11 hearing stage" },
      { name: "Land Acquisition", progress: 25, status: "in_progress" },
      { name: "Compensation", progress: 15, status: "in_progress" },
      { name: "Final Handover", progress: 0, status: "pending" },
    ],
  },
  {
    id: "BD-DEMO-001",
    code: "BD-DEMO-001",
    name: "Rural Connectivity Link — Demo Project",
    type: "Rural Road / Connectivity Improvement",
    location: "Sinnar & Niphad Tehsils",
    district: "Nashik",
    state: "Maharashtra",
    isDemo: true,
    overallProgress: 15,
    statusText: "Project Initiation",
    currentActivity: "Project proposal submitted. Preliminary land requirement: 24.6 Ha across 2 villages.",
    lastUpdated: "Just now",
    landRequiredHa: 24.6,
    landAcquiredHa: 0,
    compensationDisbursedCr: 0,
    districtsCount: 1,
    stages: [
      { name: "Project Initiation", progress: 100, status: "completed" },
      { name: "Land Identification", progress: 0, status: "pending" },
      { name: "Survey & Verification", progress: 0, status: "pending" },
      { name: "Statutory Process", progress: 0, status: "pending" },
      { name: "Compensation", progress: 0, status: "pending" },
      { name: "Acquisition & Handover", progress: 0, status: "pending" },
    ],
  },
];

// Demo 6-Stage Configurations
interface DemoStageConfig {
  stageNumber: number;
  name: string;
  statusLabel: string;
  headline: string;
  description: string;
  infoItems: { label: string; value: string; isPending?: boolean }[];
  ctaText: string;
  overallProgress: number;
  landAcquiredHa: number;
  compensationCr: number;
}

const DEMO_STAGES: DemoStageConfig[] = [
  {
    stageNumber: 1,
    name: "Project Initiation",
    statusLabel: "Project Proposal Received",
    headline: "Stage 1 of 6 — Project Initiation",
    description: "24.6 Ha land requirement identified for the proposed rural connectivity corridor.",
    infoItems: [
      { label: "Project proposal", value: "Submitted" },
      { label: "Preliminary land requirement", value: "24.6 Ha" },
      { label: "Villages", value: "2" },
      { label: "Parcels identified", value: "18" },
      { label: "Department review", value: "Pending", isPending: true },
    ],
    ctaText: "Proceed to Land Identification →",
    overallProgress: 16,
    landAcquiredHa: 0,
    compensationCr: 0,
  },
  {
    stageNumber: 2,
    name: "Land Identification",
    statusLabel: "Land Identification Completed",
    headline: "Stage 2 of 6 — Land Identification",
    description: "All 18 cadastral parcels identified and mapped onto BhuNaksha GIS sajra sheet.",
    infoItems: [
      { label: "Land parcels identified", value: "18 / 18 parcels" },
      { label: "Corridor boundary alignment", value: "Verified (30m RoW)" },
      { label: "Affected villages", value: "2 (Panchayat verified)" },
      { label: "Encroachment screening", value: "Clear" },
      { label: "GIS overlay", value: "Active" },
    ],
    ctaText: "Proceed to Survey & Verification →",
    overallProgress: 33,
    landAcquiredHa: 0,
    compensationCr: 0,
  },
  {
    stageNumber: 3,
    name: "Survey & Verification",
    statusLabel: "Survey Verification in Progress",
    headline: "Stage 3 of 6 — Survey & Verification",
    description: "Cadastral ground verification and joint measurement survey (JMS) in progress.",
    infoItems: [
      { label: "Cadastral verification", value: "14 / 18 parcels verified (78%)" },
      { label: "Joint measurement survey", value: "In Progress" },
      { label: "Land titles (Bhulekh 7/12)", value: "14 Cleared" },
      { label: "Boundary stone monuments", value: "Marked" },
    ],
    ctaText: "Complete Verification & Proceed →",
    overallProgress: 52,
    landAcquiredHa: 6.2,
    compensationCr: 0,
  },
  {
    stageNumber: 4,
    name: "Statutory Process",
    statusLabel: "Statutory Review in Progress",
    headline: "Stage 4 of 6 — Statutory Process",
    description: "Section 11 preliminary notification gazette published. Public objection window active.",
    infoItems: [
      { label: "Statutory review", value: "18 parcels" },
      { label: "Documents verified", value: "16 documents" },
      { label: "Documents pending", value: "2 documents", isPending: true },
      { label: "Section 15 hearings", value: "Completed (No major dispute)" },
    ],
    ctaText: "Proceed to Compensation →",
    overallProgress: 70,
    landAcquiredHa: 14.8,
    compensationCr: 2.1,
  },
  {
    stageNumber: 5,
    name: "Compensation",
    statusLabel: "Compensation Ready for Approval",
    headline: "Stage 5 of 6 — Compensation Assessment",
    description: "Section 26-30 statutory award calculation sheet approved by CALA Competent Authority.",
    infoItems: [
      { label: "Estimated compensation", value: "₹8.42 Cr" },
      { label: "Beneficiaries", value: "31 Landowners" },
      { label: "Assessment completeness", value: "100%" },
      { label: "Solatium & 12% interest", value: "Computed" },
      { label: "PFMS Escrow allocation", value: "Ready" },
    ],
    ctaText: "Approve & Proceed to Disbursement →",
    overallProgress: 88,
    landAcquiredHa: 20.4,
    compensationCr: 8.42,
  },
  {
    stageNumber: 6,
    name: "Acquisition & Handover",
    statusLabel: "Acquisition Completed",
    headline: "Stage 6 of 6 — Acquisition & Handover",
    description: "Land acquisition workflow completed successfully. Physical possession under Section 38 taken.",
    infoItems: [
      { label: "Total land acquired", value: "24.6 Ha" },
      { label: "Parcels transferred", value: "18 Parcels" },
      { label: "Beneficiaries compensated", value: "31 Beneficiaries" },
      { label: "Total DBT disbursed", value: "₹8.42 Cr" },
      { label: "Status", value: "Possession Handed Over" },
    ],
    ctaText: "Acquisition Finalized",
    overallProgress: 100,
    landAcquiredHa: 24.6,
    compensationCr: 8.42,
  },
];

export default function DashboardPage() {
  const [archModalOpen, setArchModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("PRJ-001");
  const [animatedProgress, setAnimatedProgress] = useState<number>(0);
  const [demoStage, setDemoStage] = useState<number>(1);
  const [isAdvancingDemo, setIsAdvancingDemo] = useState<boolean>(false);
  const [selectedPipelineStage, setSelectedPipelineStage] = useState<number | null>(null);

  // Active selected project
  const selectedProject = useMemo(() => {
    return DASHBOARD_PROJECTS.find((p) => p.id === selectedProjectId) || DASHBOARD_PROJECTS[0];
  }, [selectedProjectId]);

  // If demo project is selected, pull current stage details
  const currentDemoConfig = useMemo(() => {
    return DEMO_STAGES[demoStage - 1];
  }, [demoStage]);

  // Target progress value based on project type
  const targetProgress = selectedProject.isDemo
    ? currentDemoConfig.overallProgress
    : selectedProject.overallProgress;

  // Smooth progress bar animation from 0% to target% over 800-1000ms upon selection
  useEffect(() => {
    setAnimatedProgress(0);
    const timer = setTimeout(() => {
      setAnimatedProgress(targetProgress);
    }, 80);
    return () => clearTimeout(timer);
  }, [selectedProjectId, targetProgress]);

  // Advance Demo Project Stage Handler
  const handleAdvanceDemoStage = () => {
    if (demoStage >= 6) return;
    setIsAdvancingDemo(true);
    setTimeout(() => {
      setDemoStage((prev) => prev + 1);
      setIsAdvancingDemo(false);
    }, 450);
  };

  const handleResetDemo = () => {
    setDemoStage(1);
  };

  // Base BhuNaksha metrics for statutory pipeline
  const activeBhuNakshaProject = BHUNAKSHA_PROJECTS[0];
  const metrics = useMemo(() => {
    return getProject12StageMetrics(activeBhuNakshaProject);
  }, [activeBhuNakshaProject]);

  const stageCounts: Record<number, number> = useMemo(() => {
    return {
      1: metrics.totalParcels,
      2: metrics.totalParcels,
      3: metrics.affectedParcels,
      4: metrics.rorVerifiedCount,
      5: metrics.fieldVerifiedCount,
      6: metrics.reviewedCount,
      7: metrics.notifiedCount,
      8: metrics.awardCompletedCount,
      9: metrics.compensationCasesCount,
      10: metrics.disbursedCount,
      11: metrics.possessionCompletedCount,
      12: metrics.rrCompletedCount,
    };
  }, [metrics]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans selection:bg-[#0F2942] selection:text-white">
      {/* ─────────────────────────────────────────────────────────────
          1. EXECUTIVE HEADER
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-[#15803D] border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-[#15803D]" />
                Authorized CALA Dashboard
              </span>
              <span className="text-xs text-slate-500 font-mono">
                RFCTLARR Act 2013 Statutory Portal
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Land Acquisition Management System
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Integrated operational monitoring across central highways, freight corridors, and district
              connectivity projects. Powered by NIC BhuNaksha cadastral sync and PFMS direct benefit transfer.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/map">
              <Button size="default" className="gap-2 bg-[#0F2942] hover:bg-[#16385C] text-white font-semibold shadow-xs cursor-pointer">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span>Open Full GIS Viewer</span>
              </Button>
            </Link>
            <Button
              size="default"
              variant="outline"
              onClick={() => setArchModalOpen(true)}
              className="gap-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold cursor-pointer"
            >
              <Server className="h-4 w-4 text-slate-600" />
              <span>BhuNaksha Specs</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. INTERACTIVE PROJECT SELECTION CARDS (AT LEAST 2 + DEMO)
      ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span>Select Active Infrastructure Project</span>
            <span className="text-xs font-normal text-slate-500">
              (Click any project to load dynamic status and progress details)
            </span>
          </h2>
          <span className="text-xs text-slate-500 hidden sm:inline">
            3 Projects Enrolled
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {DASHBOARD_PROJECTS.map((proj) => {
            const isSelected = selectedProjectId === proj.id;
            return (
              <div
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer text-left relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-white border-[#15803D] ring-2 ring-[#15803D]/20 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-[#FAF9F6] shadow-xs"
                }`}
              >
                <div>
                  {/* Top Bar: Code + Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {proj.code}
                    </span>

                    {proj.isDemo ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-[#15803D] border border-emerald-200">
                        Demonstration Project
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-medium">
                        {proj.district}, {proj.state}
                      </span>
                    )}
                  </div>

                  {/* Project Name */}
                  <h3 className="font-bold text-sm text-slate-900 leading-snug mb-1">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mb-3">
                    {proj.type} &bull; {proj.location}
                  </p>
                </div>

                {/* Progress Mini Bar & Selection Indicator */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#15803D]">
                        <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                        Active Project
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Click to Inspect</span>
                    )}
                  </div>

                  <span className="font-bold text-slate-800 text-xs">
                    {proj.isDemo ? `${currentDemoConfig.overallProgress}%` : `${proj.overallProgress}%`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. DEDICATED PROJECT STATUS & PROGRESS DETAIL PANEL
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6 transition-all duration-300">
        {/* Panel Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-500">
                {selectedProject.code}
              </span>
              {selectedProject.isDemo && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-[#15803D] border border-emerald-200">
                  DEMONSTRATION PROJECT
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {selectedProject.name}
            </h2>
            <p className="text-xs text-slate-500">
              {selectedProject.location} &bull; {selectedProject.district} District, {selectedProject.state}
            </p>
          </div>

          {/* Current Status Pill with Subtle Green Opacity Pulse (1.5-2s cycle, not neon) */}
          <div className="flex flex-col sm:items-end gap-1.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs">
              {/* Gentle Opacity Pulse Dot */}
              <span className="w-2 h-2 rounded-full bg-[#15803D] opacity-80 animate-pulse duration-2000" />
              <span>
                Current Status —{" "}
                <strong className="text-[#15803D]">
                  {selectedProject.isDemo ? currentDemoConfig.statusLabel : selectedProject.statusText}
                </strong>
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Last synchronized: {selectedProject.lastUpdated}
            </span>
          </div>
        </div>

        {/* Overall Progress Bar (Animated 0% -> Target% over 800-1000ms) */}
        <div className="space-y-2 bg-[#FAF9F6] p-4 sm:p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Overall Project Lifecycle Progress
            </span>
            <span className="font-bold text-base text-[#15803D]">
              {animatedProgress}% Complete
            </span>
          </div>

          {/* Horizontal Progress Track */}
          <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#15803D] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${animatedProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Stage Initiation</span>
            <span>Target: 100% Final Possession &amp; Handover</span>
          </div>
        </div>

        {/* 4 Compact Project Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[11px] font-medium block">Land Required</span>
            <div className="text-xl font-bold text-slate-900">
              {selectedProject.landRequiredHa} <span className="text-xs font-normal text-slate-500">Ha</span>
            </div>
            <span className="text-[10px] text-slate-400">Total Corridor Footprint</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[11px] font-medium block">Acquired Land</span>
            <div className="text-xl font-bold text-[#15803D]">
              {selectedProject.isDemo ? currentDemoConfig.landAcquiredHa : selectedProject.landAcquiredHa}{" "}
              <span className="text-xs font-normal text-slate-500">Ha</span>
            </div>
            <span className="text-[10px] text-slate-400">
              {Math.round(
                ((selectedProject.isDemo ? currentDemoConfig.landAcquiredHa : selectedProject.landAcquiredHa) /
                  selectedProject.landRequiredHa) *
                  100
              )}
              % of Footprint Cleared
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[11px] font-medium block">Compensation Disbursed</span>
            <div className="text-xl font-bold text-slate-900">
              ₹{selectedProject.isDemo ? currentDemoConfig.compensationCr : selectedProject.compensationDisbursedCr}{" "}
              <span className="text-xs font-normal text-slate-500">Cr</span>
            </div>
            <span className="text-[10px] text-[#15803D] font-medium">Direct Bank Transfer (DBT)</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[11px] font-medium block">Districts Involved</span>
            <div className="text-xl font-bold text-slate-900">
              {selectedProject.districtsCount} <span className="text-xs font-normal text-slate-500">Districts</span>
            </div>
            <span className="text-[10px] text-slate-400">Jurisdictional Alignment</span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            A. SPECIAL INTERACTIVE DEMO PROJECT EXPERIENCE (BD-DEMO-001)
        ───────────────────────────────────────────────────────────── */}
        {selectedProject.isDemo && (
          <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/80 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-900">
                    Interactive Demonstration Lifecycle Stepper
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    BD-DEMO-001
                  </span>
                </div>
                <p className="text-xs text-emerald-800">
                  Manually advance through the complete 6-stage land acquisition workflow during your presentation.
                </p>
              </div>

              {demoStage > 1 && (
                <button
                  type="button"
                  onClick={handleResetDemo}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset Demo Workflow</span>
                </button>
              )}
            </div>

            {/* 6-Stage Horizontal Stepper */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
              {[
                { num: 1, name: "01 Initiation" },
                { num: 2, name: "02 Identification" },
                { num: 3, name: "03 Survey & Verification" },
                { num: 4, name: "04 Statutory Process" },
                { num: 5, name: "05 Compensation" },
                { num: 6, name: "06 Handover" },
              ].map((stg) => {
                const isCompleted = demoStage > stg.num;
                const isCurrent = demoStage === stg.num;

                return (
                  <div
                    key={stg.num}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isCurrent
                        ? "bg-[#0F2942] text-white border-[#0F2942] shadow-xs font-bold"
                        : isCompleted
                        ? "bg-white text-slate-800 border-emerald-300 font-semibold"
                        : "bg-white/60 text-slate-400 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5 text-[#15803D]" />
                      ) : isCurrent ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400">●</span>
                      )}
                    </div>
                    <span className="text-[11px] block truncate">{stg.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Active Stage Card & Manual Advance Button */}
            <div className="bg-white rounded-xl border border-emerald-200 p-5 space-y-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                    {currentDemoConfig.headline}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-0.5">
                    {currentDemoConfig.statusLabel}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    {currentDemoConfig.description}
                  </p>
                </div>

                {demoStage < 6 ? (
                  <button
                    type="button"
                    disabled={isAdvancingDemo}
                    onClick={handleAdvanceDemoStage}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
                  >
                    {isAdvancingDemo ? (
                      <span>Validating &amp; Advancing...</span>
                    ) : (
                      <>
                        <span>{currentDemoConfig.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-[#15803D] text-xs font-bold shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lifecycle Completed</span>
                  </div>
                )}
              </div>

              {/* Stage Information Checklist Items */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
                {currentDemoConfig.infoItems.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10.5px]">{item.label}</span>
                    <span
                      className={`font-bold block mt-0.5 text-xs ${
                        item.isPending ? "text-amber-700" : "text-slate-900"
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {demoStage === 6 && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
                  <span className="font-semibold">
                    ✓ Land acquisition workflow completed successfully for all 18 parcels.
                  </span>
                  <Link href="/reports">
                    <Button size="sm" variant="outline" className="h-7 text-xs bg-white">
                      View Project Summary
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            B. REGULAR PROJECT PROGRESS BREAKDOWN (FOR PRJ-001 & PRJ-002)
        ───────────────────────────────────────────────────────────── */}
        {!selectedProject.isDemo && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Statutory Lifecycle Stage Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {selectedProject.stages.map((stg, idx) => {
                const isComp = stg.status === "completed";
                const isInProg = stg.status === "in_progress";

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{stg.name}</span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          isComp
                            ? "bg-emerald-50 text-[#15803D]"
                            : isInProg
                            ? "bg-blue-50 text-[#0284C7]"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {isComp ? "Completed" : isInProg ? `${stg.progress}%` : "Pending"}
                      </span>
                    </div>

                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isComp
                            ? "bg-[#15803D]"
                            : isInProg
                            ? "bg-[#0284C7]"
                            : "bg-slate-300"
                        }`}
                        style={{ width: `${stg.progress}%` }}
                      />
                    </div>

                    {stg.note && (
                      <span className="text-[10px] text-slate-500 block line-clamp-1">
                        {stg.note}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            C. CURRENT ACTIVITY & GIS GEOGRAPHIC FOOTPRINT
        ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Left: Current Activity Section */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Current Activity
                </span>
                <span className="w-2 h-2 rounded-full bg-[#15803D]" />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <p className="font-semibold text-slate-900 leading-relaxed">
                  {selectedProject.isDemo
                    ? currentDemoConfig.description
                    : selectedProject.currentActivity}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Last updated &bull; {selectedProject.lastUpdated}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2 pt-4">
              <Link href="/map" className="w-full">
                <Button variant="outline" className="w-full text-xs font-semibold justify-between border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-[#15803D]" />
                    <span>View Cadastral Parcels on GIS Map</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Button>
              </Link>
              <Link href="/compensation" className="w-full">
                <Button variant="outline" className="w-full text-xs font-semibold justify-between border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Coins className="w-3.5 h-3.5 text-amber-700" />
                    <span>Open Compensation &amp; PFMS Ledger</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Geographic Footprint Map Viewport */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs space-y-2 p-3">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                  <span className="font-bold text-slate-800 text-xs">
                    Project Geographic Footprint &bull; {selectedProject.district} District
                  </span>
                </div>
                <span className="text-[10.5px] font-mono text-slate-500">
                  {selectedProject.isDemo ? "24.6 Ha Corridor" : "60m RoW Alignment"}
                </span>
              </div>

              {/* GIS Map Preview Graphic */}
              <div className="relative h-[220px] rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                  style={{
                    backgroundImage: "url('/drone_orthomosaic.jpg')",
                    filter: selectedProject.id === "PRJ-002" ? "hue-rotate(30deg)" : "none",
                  }}
                />

                {/* Corridor Band Vector */}
                <div
                  className="absolute inset-x-0 top-1/3 h-14 -rotate-12 bg-amber-500/25 border-y border-amber-500/60 pointer-events-none flex items-center justify-center"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, rgba(245,158,11,0.15) 0, rgba(245,158,11,0.15) 8px, transparent 8px, transparent 16px)",
                  }}
                >
                  <span className="bg-black/60 text-amber-300 px-2.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider">
                    {selectedProject.code} ALIGNMENT FOOTPRINT
                  </span>
                </div>

                {/* Dynamic Parcel Overlay Vectors */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 220">
                  {/* Dynamic parcel coloring for Demo project stages */}
                  <polygon
                    points="200,60 320,70 290,150 180,130"
                    fill={
                      selectedProject.isDemo
                        ? demoStage >= 6
                          ? "rgba(16, 185, 129, 0.45)"
                          : demoStage >= 3
                          ? "rgba(2, 132, 199, 0.35)"
                          : "rgba(245, 158, 11, 0.25)"
                        : "rgba(16, 185, 129, 0.3)"
                    }
                    stroke={
                      selectedProject.isDemo
                        ? demoStage >= 6
                          ? "#10B981"
                          : demoStage >= 3
                          ? "#0284C7"
                          : "#F59E0B"
                        : "#10B981"
                    }
                    strokeWidth="1.5"
                  />
                  <polygon
                    points="320,70 420,80 390,160 290,150"
                    fill="rgba(15, 41, 66, 0.2)"
                    stroke="#0F2942"
                    strokeWidth="1.5"
                  />
                </svg>

                {/* Location Badges */}
                <div className="absolute top-4 left-4 bg-white/95 border border-slate-200 px-2 py-1 rounded text-[10px] font-semibold text-slate-800 shadow-2xs">
                  {selectedProject.district} Collectorate Jurisdiction
                </div>

                <div className="absolute bottom-4 right-4 bg-black/70 text-slate-300 font-mono text-[9.5px] px-2 py-1 rounded">
                  EPSG: 4326 &bull; BhuNaksha WFS
                </div>
              </div>

              {/* Map Footer Legend */}
              <div className="flex items-center justify-between text-[10.5px] text-slate-500 pt-1">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-xs bg-emerald-600" />
                    Verified Plot
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-xs bg-amber-500" />
                    Corridor Buffer
                  </span>
                </div>
                <Link href="/map" className="text-[#0F2942] hover:underline font-semibold">
                  Open Interactive Map &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. 12-STAGE STATUTORY RFCTLARR PIPELINE COUNTER
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-[#0284C7] border border-blue-200">
                RFCTLARR Act 2013 Pipeline
              </span>
              <span className="text-xs text-slate-500 font-mono">
                12 Statutory Lifecycle Stages
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight mt-1">
              Statutory Progression Pipeline (Khasra Plot Counts)
            </h2>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Active CALA Authority: <strong className="text-slate-800">{activeBhuNakshaProject.calaOfficer}</strong>
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
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between text-center relative ${
                  isSelected
                    ? "border-[#15803D] bg-emerald-50/50 shadow-2xs ring-1 ring-[#15803D]"
                    : "border-slate-200 bg-[#FAF9F6] hover:bg-slate-100/60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      S{s.stageNumber}
                    </span>
                  </div>
                  <div className="font-bold text-[11px] text-slate-900 leading-tight">
                    {s.shortTitle}
                  </div>
                </div>

                <div className="my-1.5">
                  <span className="font-mono text-lg font-bold text-slate-900 block">
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
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 animate-in fade-in duration-200">
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

      {/* Architecture Evaluation Modal */}
      <BhuNakshaArchitectureModal
        open={archModalOpen}
        onOpenChange={setArchModalOpen}
      />
    </div>
  );
}
