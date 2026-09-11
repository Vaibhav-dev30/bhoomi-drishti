"use client";

import dynamic from "next/dynamic";
import React, { useState, Suspense } from "react";
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
import { AffectedLandTable } from "@/components/workflow/affected-land-table";
import { AcquisitionWorkflowStepper } from "@/components/workflow/acquisition-workflow-stepper";
import { BhuNakshaArchitectureModal } from "@/components/docs/bhunaksha-architecture-modal";
import { Button } from "@/components/ui/button";

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
  const primaryProject = BHUNAKSHA_PROJECTS[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-2.5">
      {/* ───── Sleek Compact Header Bar (saves 80px vertical height for the map) ───── */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-3 py-2 rounded-2xl bg-white border border-[#E5E0D6] shadow-xs shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#DCFCE7] text-[#15803D]">
            <Compass className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-extrabold text-slate-900 hidden sm:inline">BhuNaksha Cadastre:</span>
            <span className="font-bold text-slate-800">{primaryProject.name}</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
              RFCTLARR 2013
            </span>
          </div>
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
              📋 Parcels ({primaryProject.parcels.length})
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

      {/* Main View Tabs */}
      <div className="flex-1 flex flex-col min-h-0">
        {activeTab === "map" && (
          <BhuNakshaMapViewer
            initialKhasraNumber={khasraParam ?? undefined}
            initialStageFilter={stageParam ? parseInt(stageParam, 10) : undefined}
          />
        )}

        {activeTab === "table" && (
          <AffectedLandTable parcels={primaryProject.parcels} />
        )}

        {activeTab === "workflow" && (
          <AcquisitionWorkflowStepper project={primaryProject} />
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

