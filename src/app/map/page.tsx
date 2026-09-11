"use client";

import dynamic from "next/dynamic";
import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Compass,
  Layers,
  ShieldCheck,
  Server,
  FileSpreadsheet,
  Workflow,
  Sparkles,
  Info,
} from "lucide-react";
import { BHUNAKSHA_PROJECTS } from "@/lib/bhunaksha-service";
import {
  SPATIAL_PROJECTS,
  ALL_DEMO_SPATIAL_PARCELS,
  runSpatialAnalysis,
} from "@/lib/spatial-engine";
import { AffectedLandTable } from "@/components/workflow/affected-land-table";
import { AcquisitionWorkflowStepper } from "@/components/workflow/acquisition-workflow-stepper";
import { BhuNakshaArchitectureModal } from "@/components/docs/bhunaksha-architecture-modal";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-context";
import { filterBhuParcelsForUser } from "@/lib/auth-store";

// Dynamically import Leaflet BhuNaksha viewer with SSR disabled
const BhuNakshaMapViewer = dynamic(
  () =>
    import("@/components/map/bhunaksha-map-viewer").then(
      (mod) => mod.BhuNakshaMapViewer
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[calc(100vh-160px)] w-full rounded-3xl border border-[#E5E0D6] bg-[#FAF8F5] flex flex-col items-center justify-center text-slate-500 gap-3 shadow-md">
        <div className="h-10 w-10 border-4 border-[#15803D] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-900">
          Loading NIC BhuNaksha Cadastral Spatial Engine...
        </p>
        <span className="text-xs text-slate-500">
          Connecting to digitized village Sajra sheets and Bhulekh RoR databases
        </span>
      </div>
    ),
  }
);

function MapPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const khasraParam = searchParams.get("khasra");
  const stageParam = searchParams.get("stage");

  const [activeTab, setActiveTab] = useState<"map" | "table" | "workflow">(() => {
    if (tabParam === "table") return "table";
    if (tabParam === "workflow") return "workflow";
    return "map";
  });
  const [archModalOpen, setArchModalOpen] = useState(false);
  const { currentUser, scopedGrants } = useApp();

  const primaryProject = useMemo(() => {
    if (currentUser?.jurisdiction.level === "district" && currentUser.jurisdiction.districtCode === "GZB") {
      return BHUNAKSHA_PROJECTS.find((p) => p.id === "DL-GZB-002") || BHUNAKSHA_PROJECTS[0];
    }
    if (currentUser?.jurisdiction.level === "project" && currentUser.jurisdiction.projectId) {
      return BHUNAKSHA_PROJECTS.find((p) => p.id === currentUser.jurisdiction.projectId) || BHUNAKSHA_PROJECTS[0];
    }
    return BHUNAKSHA_PROJECTS[0];
  }, [currentUser]);

  const [currentSelectedProjectId, setCurrentSelectedProjectId] = useState<string>(() => primaryProject.id);

  const activeProject = useMemo(() => {
    return BHUNAKSHA_PROJECTS.find((p) => p.id === currentSelectedProjectId) || primaryProject;
  }, [currentSelectedProjectId, primaryProject]);

  const authorizedParcels = useMemo(() => {
    return filterBhuParcelsForUser(currentUser, scopedGrants, activeProject.parcels);
  }, [currentUser, scopedGrants, activeProject]);

  // Dynamic project spatial summary calculated strictly from geometry
  const activeSpatialSummary = useMemo(() => {
    const matched = SPATIAL_PROJECTS.find((p) => p.projectCode === activeProject.projectCode) || SPATIAL_PROJECTS[0];
    const { summary } = runSpatialAnalysis(matched, ALL_DEMO_SPATIAL_PARCELS);
    return summary;
  }, [activeProject.projectCode]);

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-2.5">
      {/* ───── Sleek Compact Header Bar with Project Switcher ───── */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white border border-[#E5E0D6] shadow-xs shrink-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#DCFCE7] text-[#15803D]">
            <Compass className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-extrabold text-slate-900">Project Area:</span>
          </div>

          {/* Project Switcher Pill (Delhi vs Ghaziabad) */}
          <div className="flex items-center bg-[#FAF8F5] p-0.5 rounded-xl border border-[#E5E0D6] text-xs font-bold">
            <button
              onClick={() => setCurrentSelectedProjectId("DL-INFRA-001")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                currentSelectedProjectId === "DL-INFRA-001"
                  ? "bg-white text-[#15803D] shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🏛️ Delhi (North Delhi)</span>
            </button>
            <button
              onClick={() => setCurrentSelectedProjectId("DL-GZB-002")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                currentSelectedProjectId === "DL-GZB-002"
                  ? "bg-white text-[#0284C7] shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🚆 Ghaziabad (NCR Corridor)</span>
            </button>
          </div>

          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
            RFCTLARR 2013
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200">
            Demonstration GIS Data
          </span>
        </div>

        {/* Action Buttons & Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#FAF8F5] p-0.5 rounded-xl border border-[#E5E0D6] text-xs font-bold">
            <button
              onClick={() => setActiveTab("map")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === "map"
                  ? "bg-white text-[#15803D] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🗺️ Cadastral Map
            </button>
            <button
              onClick={() => setActiveTab("table")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === "table"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              📋 Parcels ({authorizedParcels.length})
            </button>
            <button
              onClick={() => setActiveTab("workflow")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === "workflow"
                  ? "bg-white text-[#0284C7] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ⚡ 12-Stage Lifecycle
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setArchModalOpen(true)}
            className="h-7 text-xs font-bold gap-1 border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D] hover:bg-[#DCFCE7] px-2.5 rounded-xl cursor-pointer"
          >
            <Server className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Architecture</span>
          </Button>
        </div>
      </div>

      {/* ───── Dynamic Spatial Summary Strip (Calculated from Core Geometry) ───── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 px-1">
        <div className="bg-white px-3 py-2 rounded-xl border border-[#E5E0D6] shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Parcels</span>
          <span className="text-base font-extrabold font-mono text-slate-900 block mt-0.5">
            {activeSpatialSummary.totalParcelsCount}
          </span>
          <span className="text-[10px] text-slate-500 truncate block">Cadastral Sheet</span>
        </div>

        <div className="bg-amber-50/70 px-3 py-2 rounded-xl border border-amber-200/80 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-amber-700 block">Affected Parcels</span>
          <span className="text-base font-extrabold font-mono text-amber-900 block mt-0.5">
            {activeSpatialSummary.affectedParcelsCount}
          </span>
          <span className="text-[10px] text-amber-800/80 truncate block">Corridor Overlap</span>
        </div>

        <div className="bg-white px-3 py-2 rounded-xl border border-[#E5E0D6] shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Land Req.</span>
          <span className="text-base font-extrabold font-mono text-slate-900 block mt-0.5">
            {activeSpatialSummary.totalLandRequirementHa} <span className="text-xs font-normal text-slate-500">Ha</span>
          </span>
          <span className="text-[10px] text-slate-500 truncate block">Surveyed Area</span>
        </div>

        <div className="bg-emerald-50/70 px-3 py-2 rounded-xl border border-emerald-200/80 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-emerald-700 block">Affected Land</span>
          <span className="text-base font-extrabold font-mono text-emerald-900 block mt-0.5">
            {activeSpatialSummary.affectedLandHa} <span className="text-xs font-normal text-emerald-700">Ha</span>
          </span>
          <span className="text-[10px] text-emerald-800/80 truncate block">Within 60m Corridor</span>
        </div>

        <div className="bg-white px-3 py-2 rounded-xl border border-[#E5E0D6] shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">RoR Verified</span>
          <span className="text-base font-extrabold font-mono text-[#15803D] block mt-0.5">
            {activeSpatialSummary.rorVerifiedCount}
          </span>
          <span className="text-[10px] text-slate-500 truncate block">Bhulekh Matched</span>
        </div>

        <div className="bg-white px-3 py-2 rounded-xl border border-[#E5E0D6] shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">RoR Pending</span>
          <span className="text-base font-extrabold font-mono text-amber-700 block mt-0.5">
            {activeSpatialSummary.rorPendingCount}
          </span>
          <span className="text-[10px] text-slate-500 truncate block">Under Scrutiny</span>
        </div>
      </div>

      {/* Main View Tabs */}
      <div className="flex-1 flex flex-col min-h-0">
        {activeTab === "map" && (
          <BhuNakshaMapViewer
            key={activeProject.id}
            initialProjectId={activeProject.id}
            initialKhasraNumber={khasraParam ?? undefined}
            initialStageFilter={stageParam ? parseInt(stageParam, 10) : undefined}
          />
        )}

        {activeTab === "table" && (
          <AffectedLandTable parcels={authorizedParcels} />
        )}

        {activeTab === "workflow" && (
          <AcquisitionWorkflowStepper project={activeProject} />
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

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[calc(100vh-160px)] w-full rounded-3xl border border-[#E5E0D6] bg-[#FAF8F5] flex flex-col items-center justify-center text-slate-500 gap-3 shadow-md">
          <div className="h-10 w-10 border-4 border-[#15803D] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-900">
            Initializing BhuNaksha Cadastral Interface...
          </p>
        </div>
      }
    >
      <MapPageContent />
    </Suspense>
  );
}

