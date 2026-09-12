"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ChevronRight,
  Layers,
  Compass,
  CheckSquare,
  FileCheck,
  CreditCard,
  Flag,
  RotateCcw,
  Check,
  Activity,
  Maximize2,
  Search,
  ExternalLink,
  HelpCircle,
  Eye,
  Calendar,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  BHUNAKSHA_PROJECTS,
  BhuNakshaProject,
  BhuNakshaParcel,
  getParcel12StageInfo,
} from "@/lib/bhunaksha-service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-context";
import { checkResourceAccess, filterBhuParcelsForUser } from "@/lib/auth-store";

// ============================================================
// PROJECT DATA MODELS FOR TWO OFFICIAL DEMO PROJECTS
// ============================================================
interface DemoProjectConfig {
  id: "DL-INFRA-001" | "DL-GZB-002";
  code: string;
  name: string;
  type: string;
  location: string;
  state: string;
  district: string;
  localities: string[];
  totalLandHa: number;
  totalParcels: number;
  startStage: number; // Delhi = 1, Ghaziabad = 2
  defaultParcelId: string;
  mapCenter: [number, number]; // [lat, lng]
  mapZoom: number;
}

const OFFICIAL_PROJECTS: DemoProjectConfig[] = [
  {
    id: "DL-INFRA-001",
    code: "DL-INFRA-2026-001",
    name: "Delhi Land & Infrastructure Development Project",
    type: "Urban Infrastructure / Land Acquisition",
    location: "Delhi, NCT of Delhi",
    state: "Delhi",
    district: "North Delhi",
    localities: ["Alipur", "Narela", "Hamidpur"],
    totalLandHa: 18.4,
    totalParcels: 12,
    startStage: 1, // Stage 1 — Project Initiation
    defaultParcelId: "DEMO-482",
    mapCenter: [28.724, 77.144],
    mapZoom: 14,
  },
  {
    id: "DL-GZB-002",
    code: "DL-GZB-2026-002",
    name: "Delhi–Ghaziabad Regional Connectivity Project",
    type: "Regional Transport / Infrastructure Corridor",
    location: "Delhi → Ghaziabad, Uttar Pradesh",
    state: "Uttar Pradesh",
    district: "Ghaziabad",
    localities: ["Sahibabad", "Arthala", "Morta", "Duhai"],
    totalLandHa: 26.8,
    totalParcels: 18,
    startStage: 2, // Stage 2 — Land Identification
    defaultParcelId: "DEMO-501",
    mapCenter: [28.675, 77.418],
    mapZoom: 13,
  },
];

// 6 Official Lifecycle Stages
interface StageInfo {
  number: number;
  name: string;
  statusLabel: string;
  headline: string;
  description: string;
  ctaText: string;
  actionRequired: string;
}

const STAGE_CONFIG: Record<number, {
  name: string;
  delhi: StageInfo;
  ghaziabad: StageInfo;
}> = {
  1: {
    name: "Project Initiation",
    delhi: {
      number: 1,
      name: "Project Initiation",
      statusLabel: "Project Initiation",
      headline: "Stage 1 of 6 — Project Initiation",
      description: "Project proposal received and preliminary land requirement identified for North Delhi urban infrastructure expansion.",
      ctaText: "Proceed to Land Identification →",
      actionRequired: "Preliminary land verification pending",
    },
    ghaziabad: {
      number: 1,
      name: "Project Initiation",
      statusLabel: "Project Initiation",
      headline: "Stage 1 of 6 — Project Initiation",
      description: "Regional rapid transport corridor alignment proposal submitted to CALA Ghaziabad.",
      ctaText: "Proceed to Land Identification →",
      actionRequired: "Corridor boundary alignment review pending",
    },
  },
  2: {
    name: "Land Identification",
    delhi: {
      number: 2,
      name: "Land Identification",
      statusLabel: "Land Identification in Progress",
      headline: "Stage 2 of 6 — Land Identification",
      description: "12 of 12 affected cadastral parcels identified from Alipur and Narela digital Sajra sheets.",
      ctaText: "Proceed to Survey & Verification →",
      actionRequired: "Verify affected parcel boundaries with DGPS layer",
    },
    ghaziabad: {
      number: 2,
      name: "Land Identification",
      statusLabel: "Land Identification in Progress",
      headline: "Stage 2 of 6 — Land Identification",
      description: "18 affected cadastral parcels identified along Sahibabad, Arthala, Morta, and Duhai corridor alignment.",
      ctaText: "Proceed to Survey & RoR Verification →",
      actionRequired: "Verify affected parcels and computerized UP Bhulekh records",
    },
  },
  3: {
    name: "Survey & RoR Verification",
    delhi: {
      number: 3,
      name: "Survey & RoR Verification",
      statusLabel: "Survey & RoR Verification in Progress",
      headline: "Stage 3 of 6 — Survey & RoR Verification",
      description: "Cadastral ground verification and computerized RoR cross-matching active across North Delhi revenue circles.",
      ctaText: "Complete Verification & Proceed →",
      actionRequired: "Complete verification for 2 pending Alipur parcels",
    },
    ghaziabad: {
      number: 3,
      name: "Survey & RoR Verification",
      statusLabel: "Survey & RoR Verification in Progress",
      headline: "Stage 3 of 6 — Survey & RoR Verification",
      description: "Joint measurement survey and Bhulekh 7/12 land titles verification active across Ghaziabad nodes.",
      ctaText: "Complete Verification & Proceed →",
      actionRequired: "Resolve 1 joint title discrepancy in Morta node",
    },
  },
  4: {
    name: "Statutory Process",
    delhi: {
      number: 4,
      name: "Statutory Process",
      statusLabel: "Statutory Review in Progress",
      headline: "Stage 4 of 6 — Statutory Process",
      description: "Section 11 Preliminary Notification Gazette published. 11 documents verified, 1 document pending CALA scrutiny.",
      ctaText: "Proceed to Compensation →",
      actionRequired: "Clear CALA scrutiny order for final Section 19 declaration",
    },
    ghaziabad: {
      number: 4,
      name: "Statutory Process",
      statusLabel: "Statutory Review in Progress",
      headline: "Stage 4 of 6 — Statutory Process",
      description: "Section 11 Gazette published for all 18 parcels. 16 documents verified, 2 documents pending review.",
      ctaText: "Proceed to Compensation →",
      actionRequired: "Complete Section 15 objection hearings summary",
    },
  },
  5: {
    name: "Compensation",
    delhi: {
      number: 5,
      name: "Compensation",
      statusLabel: "Compensation Ready for Approval",
      headline: "Stage 5 of 6 — Compensation Assessment",
      description: "Section 26-30 statutory award calculation sheet completed. 100% Solatium & interest computed for 24 beneficiaries.",
      ctaText: "Approve & Proceed to Disbursement →",
      actionRequired: "Sign Section 23 award decree and allocate PFMS funds",
    },
    ghaziabad: {
      number: 5,
      name: "Compensation",
      statusLabel: "Compensation Ready for Approval",
      headline: "Stage 5 of 6 — Compensation Assessment",
      description: "Statutory compensation award of ₹8.42 Cr computed for 31 beneficiaries across Sahibabad and Duhai nodes.",
      ctaText: "Approve & Proceed to Disbursement →",
      actionRequired: "Authorize PFMS e-Kuber electronic escrow release",
    },
  },
  6: {
    name: "Acquisition & Handover",
    delhi: {
      number: 6,
      name: "Acquisition & Handover",
      statusLabel: "Acquisition Completed",
      headline: "Stage 6 of 6 — Acquisition & Handover",
      description: "Land acquisition workflow completed successfully. Physical possession under Section 38 taken and handed over to DDA.",
      ctaText: "View Project Summary",
      actionRequired: "Workflow completed · Archive project dossier",
    },
    ghaziabad: {
      number: 6,
      name: "Acquisition & Handover",
      statusLabel: "Acquisition Completed",
      headline: "Stage 6 of 6 — Acquisition & Handover",
      description: "26.8 Ha acquisition completed successfully across 18 parcels. ₹8.42 Cr disbursed and possession handed over.",
      ctaText: "View Project Summary",
      actionRequired: "Workflow completed · Archive project dossier",
    },
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, scopedGrants } = useApp();
  const [parcelStatusOverrides, setParcelStatusOverrides] = useState<Record<string, "Verified" | "Pending Verification" | "Discrepancy Found">>({});

  // Strict Jurisdictional Project Filtering
  const authorizedProjectConfigs = useMemo(() => {
    return OFFICIAL_PROJECTS.filter((p) => {
      const check = checkResourceAccess(currentUser, scopedGrants, {
        projectId: p.id,
        state: p.state,
        stateCode: p.id === "DL-INFRA-001" ? "DL" : "UP",
        district: p.district,
      });
      return check.allowed;
    });
  }, [currentUser, scopedGrants]);

  // Selected Project State (guaranteed to default to authorized project)
  const [selectedProjectId, setSelectedProjectId] = useState<"DL-INFRA-001" | "DL-GZB-002">(() => {
    return authorizedProjectConfigs[0]?.id || "DL-INFRA-001";
  });

  // Track manual workflow stages per project (Delhi starts at 1, Ghaziabad starts at 2)
  const [projectStages, setProjectStages] = useState<{ "DL-INFRA-001": number; "DL-GZB-002": number }>({
    "DL-INFRA-001": 1,
    "DL-GZB-002": 2,
  });

  // Transition animation state (400-600ms transition)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Selected Parcel ID (e.g. DEMO-482 or DEMO-501)
  const [selectedParcelId, setSelectedParcelId] = useState<string>("DEMO-482");

  // Synchronize selection when currentUser / authorizedProjectConfigs changes
  useEffect(() => {
    if (authorizedProjectConfigs.length > 0) {
      const isAllowed = authorizedProjectConfigs.some((p) => p.id === selectedProjectId);
      if (!isAllowed) {
        const nextId = authorizedProjectConfigs[0].id;
        setSelectedProjectId(nextId);
        setSelectedParcelId(nextId === "DL-INFRA-001" ? "DEMO-482" : "DEMO-501");
      }
    }
  }, [authorizedProjectConfigs, selectedProjectId]);

  // RoR Inspection Modal / Action Toast state
  const [actionNotification, setActionNotification] = useState<string | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState<boolean>(false);

  // GIS Layer Toggles
  const [layerBaseMap, setLayerBaseMap] = useState<boolean>(true);
  const [layerSatellite, setLayerSatellite] = useState<boolean>(false);
  const [layerCadastral, setLayerCadastral] = useState<boolean>(true);
  const [layerLocalities, setLayerLocalities] = useState<boolean>(true);
  const [layerRoads, setLayerRoads] = useState<boolean>(true);
  const [layerAlignment, setLayerAlignment] = useState<boolean>(true);

  // Active Project Data
  const currentProjectConfig = useMemo(() => {
    return (
      authorizedProjectConfigs.find((p) => p.id === selectedProjectId) ||
      authorizedProjectConfigs[0] ||
      OFFICIAL_PROJECTS[0]
    );
  }, [authorizedProjectConfigs, selectedProjectId]);

  const currentBhuProject = useMemo(() => {
    return BHUNAKSHA_PROJECTS.find((p) => p.id === selectedProjectId) || BHUNAKSHA_PROJECTS[0];
  }, [selectedProjectId]);

  // Authorized Parcels strictly scoped to user jurisdiction
  const authorizedParcels = useMemo(() => {
    return filterBhuParcelsForUser(currentUser, scopedGrants, currentBhuProject.parcels);
  }, [currentUser, scopedGrants, currentBhuProject]);

  // Synchronize selectedParcelId when switching jurisdiction / projects
  useEffect(() => {
    if (authorizedParcels.length > 0 && !authorizedParcels.some((p) => p.khasraNumber === selectedParcelId)) {
      setSelectedParcelId(authorizedParcels[0].khasraNumber);
    }
  }, [authorizedParcels, selectedParcelId]);

  const currentStageNumber = projectStages[selectedProjectId] || 1;
  const currentStageInfo = useMemo(() => {
    const stageGroup = STAGE_CONFIG[currentStageNumber] || STAGE_CONFIG[1];
    return selectedProjectId === "DL-INFRA-001" ? stageGroup.delhi : stageGroup.ghaziabad;
  }, [currentStageNumber, selectedProjectId]);

  // Handle Project Change (smooth transition)
  const handleSelectProject = (projectId: "DL-INFRA-001" | "DL-GZB-002") => {
    if (projectId === selectedProjectId) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedProjectId(projectId);
      const defaultParcel = projectId === "DL-INFRA-001" ? "DEMO-482" : "DEMO-501";
      setSelectedParcelId(defaultParcel);
      setIsTransitioning(false);
    }, 450);
  };

  // Handle Manual Stage Progression (400-600ms transition)
  const handleProceedStage = () => {
    if (currentStageNumber >= 6) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setProjectStages((prev) => ({
        ...prev,
        [selectedProjectId]: (prev[selectedProjectId] || 1) + 1,
      }));
      setIsTransitioning(false);
      setActionNotification(`Advanced to ${STAGE_CONFIG[currentStageNumber + 1].name}`);
      setTimeout(() => setActionNotification(null), 3500);
    }, 500);
  };

  // Reset Demo Workflow for active project
  const handleResetWorkflow = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      const initialStage = selectedProjectId === "DL-INFRA-001" ? 1 : 2;
      setProjectStages((prev) => ({
        ...prev,
        [selectedProjectId]: initialStage,
      }));
      setSelectedParcelId(selectedProjectId === "DL-INFRA-001" ? "DEMO-482" : "DEMO-501");
      setIsTransitioning(false);
      setActionNotification(`Demo reset to initial stage for ${currentProjectConfig.name}`);
      setTimeout(() => setActionNotification(null), 3000);
    }, 400);
  };

  // Connected Metrics based on current stage & authorized parcels
  const projectMetrics = useMemo(() => {
    const isDelhi = selectedProjectId === "DL-INFRA-001";
    const parcelCount = authorizedParcels.length;
    const totalLand = authorizedParcels.reduce((sum, p) => sum + p.affectedAreaHa, 0).toFixed(1) + " Ha";
    const verifiedCount = authorizedParcels.filter((p) => p.rorVerification?.status === "Verified").length;
    const rorText = `${verifiedCount} / ${parcelCount}`;

    if (isDelhi) {
      switch (currentStageNumber) {
        case 1:
          return { land: totalLand, parcels: parcelCount, rorVerified: rorText, progress: 32, actions: 2, delays: 1 };
        case 2:
          return { land: totalLand, parcels: parcelCount, rorVerified: rorText, progress: 48, actions: 2, delays: 1 };
        case 3:
          return { land: totalLand, parcels: parcelCount, rorVerified: rorText, progress: 68, actions: 1, delays: 1 };
        case 4:
          return { land: totalLand, parcels: parcelCount, rorVerified: rorText, progress: 82, actions: 1, delays: 0 };
        case 5:
          return { land: totalLand, parcels: parcelCount, rorVerified: rorText, progress: 94, actions: 1, delays: 0 };
        case 6:
        default:
          return { land: totalLand, parcels: parcelCount, rorVerified: rorText, progress: 100, actions: 0, delays: 0 };
      }
    } else {
      switch (currentStageNumber) {
        case 1:
          return { land: totalLand, parcels: parcelCount, rorVerified: rorText, progress: 25, actions: 3, delays: 2 };
        case 2:
          return { land: totalLand, parcels: parcelCount, rorVerified: rorText, progress: 41, actions: 3, delays: 2 };
        case 3:
          return { land: totalLand, parcels: parcelCount, rorVerified: rorText, progress: 64, actions: 2, delays: 1 };
        case 4:
          return { land: totalLand, parcels: parcelCount, rorVerified: rorText, progress: 80, actions: 1, delays: 0 };
        case 5:
          return { land: totalLand, parcels: parcelCount, rorVerified: rorText, progress: 92, actions: 1, delays: 0 };
        case 6:
        default:
          return { land: totalLand, parcels: parcelCount, rorVerified: rorText, progress: 100, actions: 0, delays: 0 };
      }
    }
  }, [selectedProjectId, currentStageNumber, authorizedParcels]);

  // Selected Parcel lookup
  const selectedParcel = useMemo(() => {
    const base =
      authorizedParcels.find((p) => p.khasraNumber === selectedParcelId) ||
      authorizedParcels[0] ||
      currentBhuProject.parcels[0];

    const override = parcelStatusOverrides[base.khasraNumber];
    if (override && base.rorVerification) {
      return {
        ...base,
        rorVerification: {
          ...base.rorVerification,
          status: override,
          remarks:
            override === "Verified"
              ? "Record of Rights verified and succession dispute resolved by CALA."
              : base.rorVerification.remarks,
        },
      };
    }
    return base;
  }, [authorizedParcels, currentBhuProject, selectedParcelId, parcelStatusOverrides]);

  // Dynamic Delays List
  const delayItems = useMemo(() => {
    if (currentUser?.jurisdiction.level === "tehsil") {
      return [
        {
          id: "del-teh-1",
          title: "Ground field verification pending (DEMO-105)",
          detail: "3 days pending · Alipur Revenue Circle Field Survey",
          parcelTarget: "DEMO-105",
          level: "amber" as const,
        },
      ];
    }
    if (selectedProjectId === "DL-INFRA-001") {
      if (currentStageNumber <= 2) {
        return [
          {
            id: "del-dl-1",
            title: "2 parcels awaiting RoR verification",
            detail: "8 days pending · Alipur Revenue Circle",
            parcelTarget: "DEMO-105",
            level: "amber" as const,
          },
          {
            id: "del-dl-2",
            title: "Preliminary boundary coordination",
            detail: "3 days pending · DDA Utility Interface",
            parcelTarget: "DEMO-111",
            level: "green" as const,
          },
        ];
      }
      if (currentStageNumber === 3) {
        return [
          {
            id: "del-dl-1",
            title: "1 parcel awaiting Khatauni succession clearance",
            detail: "DEMO-105 under scrutiny · 4 days pending",
            parcelTarget: "DEMO-105",
            level: "amber" as const,
          },
        ];
      }
      return [
        {
          id: "del-dl-ok",
          title: "All acquisition activities on schedule",
          detail: "0 overdue tasks in statutory pipeline",
          parcelTarget: "DEMO-482",
          level: "green" as const,
        },
      ];
    } else {
      if (currentStageNumber <= 2) {
        return [
          {
            id: "del-gzb-1",
            title: "3 RoR records awaiting verification",
            detail: "6 days pending · Arthala & Morta revenue circles",
            parcelTarget: "DEMO-506",
            level: "red" as const,
          },
          {
            id: "del-gzb-2",
            title: "Statutory document scrutiny pending",
            detail: "Duhai corridor node · 4 days pending",
            parcelTarget: "DEMO-515",
            level: "amber" as const,
          },
        ];
      }
      if (currentStageNumber === 3) {
        return [
          {
            id: "del-gzb-1",
            title: "Joint title dispute review in Morta node",
            detail: "Revenue court inquiry scheduled · 2 days pending",
            parcelTarget: "DEMO-506",
            level: "amber" as const,
          },
        ];
      }
      return [
        {
          id: "del-gzb-ok",
          title: "All Ghaziabad pipeline milestones on schedule",
          detail: "0 overdue statutory notices",
          parcelTarget: "DEMO-501",
          level: "green" as const,
        },
      ];
    }
  }, [currentUser, selectedProjectId, currentStageNumber]);

  // Dynamic Action Center Items
  const actionItems = useMemo(() => {
    if (currentUser?.jurisdiction.level === "tehsil") {
      return [
        {
          id: "act-teh-1",
          title: "Physical field survey & ground-truthing (Khasra DEMO-105)",
          project: "Delhi Land & Infrastructure Development Project",
          priority: "High",
          due: "1 day",
          buttonText: "Open Field Dossier →",
          action: () => {
            setSelectedParcelId("DEMO-105");
            setDetailsModalOpen(true);
            setActionNotification("Opened field survey dossier for DEMO-105");
            setTimeout(() => setActionNotification(null), 3000);
          },
        },
        {
          id: "act-teh-2",
          title: "Authenticate digital Jamabandi mutations for Alipur circle",
          project: "Delhi Land & Infrastructure Development Project",
          priority: "Medium",
          due: "2 days",
          buttonText: "Verify Records →",
          action: () => {
            setSelectedParcelId("DEMO-482");
            setDetailsModalOpen(true);
            setActionNotification("Opened Alipur Tehsil digital Jamabandi mutation registry");
            setTimeout(() => setActionNotification(null), 3000);
          },
        },
      ];
    }
    if (currentUser?.jurisdiction.level === "project") {
      return [
        {
          id: "act-prj-1",
          title: "Approve right-of-way demarcation coordinates (DEMO-501)",
          project: "Delhi–Ghaziabad Regional Connectivity Project",
          priority: "High",
          due: "1 day",
          buttonText: "Review Alignment →",
          action: () => {
            router.push("/map?projectId=DL-GZB-002&khasra=DEMO-501");
          },
        },
        {
          id: "act-prj-2",
          title: "Resolve survey boundary monumentation discrepancy",
          project: "Delhi–Ghaziabad Regional Connectivity Project",
          priority: "Medium",
          due: "3 days",
          buttonText: "View Survey Map →",
          action: () => {
            router.push("/map?projectId=DL-GZB-002&khasra=DEMO-506");
          },
        },
      ];
    }
    if (selectedProjectId === "DL-INFRA-001") {
      return [
        {
          id: "act-1",
          title: currentStageNumber === 1 ? "Preliminary land verification pending" : "Verify pending parcel records",
          project: "Delhi Land & Infrastructure Development Project",
          priority: "Medium",
          due: "3 days",
          buttonText: "Open Project →",
          action: () => {
            router.push(`/projects/DL-INFRA-001`);
          },
        },
        {
          id: "act-2",
          title: "Review succession discrepancy on Survey DEMO-105",
          project: "Delhi Land & Infrastructure Development Project",
          priority: "High",
          due: "1 day",
          buttonText: "Review Records →",
          action: () => {
            setSelectedParcelId("DEMO-105");
            setDetailsModalOpen(true);
            setActionNotification("Opened succession discrepancy review dossier for DEMO-105");
            setTimeout(() => setActionNotification(null), 3000);
          },
        },
      ];
    } else {
      return [
        {
          id: "act-1",
          title: "Verify pending parcel records (DEMO-506)",
          project: "Delhi–Ghaziabad Regional Connectivity Project",
          priority: "High",
          due: "2 days",
          buttonText: "Review Records →",
          action: () => {
            setSelectedParcelId("DEMO-506");
            setDetailsModalOpen(true);
            setActionNotification("Opened pending RoR record review for DEMO-506");
            setTimeout(() => setActionNotification(null), 3000);
          },
        },
        {
          id: "act-2",
          title: "Approve survey boundary monumentation",
          project: "Delhi–Ghaziabad Regional Connectivity Project",
          priority: "High",
          due: "1 day",
          buttonText: "Open Review →",
          action: () => {
            setSelectedParcelId("DEMO-501");
            setDetailsModalOpen(true);
            setActionNotification("Opened Ghaziabad corridor boundary monumentation dossier for DEMO-501");
            setTimeout(() => setActionNotification(null), 3000);
          },
        },
      ];
    }
  }, [currentUser, selectedProjectId, currentStageNumber, router]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-14 font-sans selection:bg-[#0B2740] selection:text-white">
      {/* ─────────────────────────────────────────────────────────────
          1. DEMO NOTIFICATION TOAST
      ───────────────────────────────────────────────────────────── */}
      {actionNotification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-[#0B2740] text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{actionNotification}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. PROJECT SELECTION SECTION (TWO PROJECTS ONLY)
      ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 flex items-center gap-2.5">
              <span>National Land Acquisition & Project Intelligence</span>
              <Badge variant="outline" className="bg-[#FAF8F5] border-[#E5E0D6] text-slate-700 font-mono text-[10px] px-2 py-0.5">
                NIC GovTech
              </Badge>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Multi-project decision support system covering Delhi NCT and Ghaziabad, Uttar Pradesh infrastructure corridors.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleResetWorkflow}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
              title="Reset the demo to initial state"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
              <span>Reset Workflow ↺</span>
            </button>
          </div>
        </div>

        {/* Project Selection Cards (Strictly Filtered by User Jurisdiction) */}
        <div className={`grid grid-cols-1 ${authorizedProjectConfigs.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1"} gap-4`}>
          {authorizedProjectConfigs.map((project) => {
            const isSelected = project.id === selectedProjectId;
            const stageNum = projectStages[project.id];
            const stageName = STAGE_CONFIG[stageNum].name;
            const progress = project.id === "DL-INFRA-001"
              ? (stageNum === 1 ? 32 : stageNum === 2 ? 48 : stageNum === 3 ? 68 : stageNum === 4 ? 82 : stageNum === 5 ? 94 : 100)
              : (stageNum === 1 ? 25 : stageNum === 2 ? 41 : stageNum === 3 ? 64 : stageNum === 4 ? 80 : stageNum === 5 ? 92 : 100);

            return (
              <div
                key={project.id}
                onClick={() => handleSelectProject(project.id)}
                className={`group relative rounded-2xl p-5 border transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-white border-[#0B2740] shadow-md ring-2 ring-[#0B2740]/15"
                    : "bg-[#FAFAFA] border-slate-200/90 hover:bg-white hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                {/* Active Selection Banner */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {project.id === "DL-INFRA-001" ? "Project 01" : "Project 02"}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">· {project.code}</span>
                  </div>

                  {/* Gentle 1.5-2s Pulse on active status dot */}
                  <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 duration-1000" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 animate-pulse" />
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800">
                      {isSelected ? "Active Selection" : "Active"}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0B2740] transition-colors leading-snug">
                  {project.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{project.location}</span>
                </div>

                {/* Cross-Jurisdiction Indicator for DL-GZB-002 */}
                {project.id === "DL-GZB-002" && (
                  <div className="mt-2 p-2 bg-slate-100/70 border border-slate-200 rounded-lg text-[10.5px] text-slate-600 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Cross-Jurisdiction Alignment:</span>
                    <span className="font-mono text-slate-500">
                      {currentUser?.jurisdiction.level === "national"
                        ? "Delhi (6.2 Ha, 4 Plots) + Ghaziabad (20.6 Ha, 14 Plots)"
                        : "Ghaziabad Jurisdiction Scope · 20.6 Ha · 14 Plots"}
                    </span>
                  </div>
                )}

                {/* Localities pill row */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  {project.localities.map((loc) => (
                    <span
                      key={loc}
                      className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/60"
                    >
                      {loc}
                    </span>
                  ))}
                  <span className="text-[10px] font-semibold text-[#0B2740] ml-auto">
                    {project.totalLandHa} Ha Required
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-600 font-medium flex items-center gap-1.5">
                      <span className="text-slate-400 text-[10px]">STAGE {stageNum}/6:</span>
                      <strong className="text-slate-900">{stageName}</strong>
                    </span>
                    <span className="font-mono font-bold text-slate-900">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0B2740] rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2B. STATUTORY INTEROPERABILITY & GOVERNMENT API GATEWAY STRIP
          (Item 11: API integration with land records, cadastral maps, & portals)
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                National Interoperability Gateway & Government API Exchange
              </span>
              <span className="text-[11px] text-slate-500">
                Live statutory integrations per RFCTLARR 2013 & Digital India Land Records Modernization Programme (DILRMP)
              </span>
            </div>
          </div>

          {/* Connected Gov Gateways */}
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <strong className="text-slate-800">NIC BhuNaksha WFS:</strong>
              <span className="font-mono text-emerald-700 font-semibold">Online · 24ms</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <strong className="text-slate-800">State RoR (Bhulekh):</strong>
              <span className="font-mono text-emerald-700 font-semibold">Online · 38ms</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <strong className="text-slate-800">PFMS e-Kuber DBT:</strong>
              <span className="font-mono text-emerald-700 font-semibold">Ready · Escrow Synced</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <strong className="text-slate-800">LGD & Parivesh:</strong>
              <span className="font-mono text-emerald-700 font-semibold">Active · 2.4.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. PROJECT INTELLIGENCE HEADER
      ───────────────────────────────────────────────────────────── */}
      <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-opacity duration-300 ${isTransitioning ? "opacity-60" : "opacity-100"}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 text-[#0B2740]">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Project Intelligence Overview
                </h2>
                <span className="text-[11px] font-mono text-slate-500">
                  · {currentProjectConfig.name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <strong className="text-slate-700">● Current Status:</strong> {currentStageInfo.statusLabel}
                </span>
                <span>·</span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Last updated: 12 minutes ago
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 self-start sm:self-auto">
            <span>CALA Officer:</span>
            <strong className="text-slate-800 font-sans">{currentBhuProject.calaOfficer.split("(")[0]}</strong>
          </div>
        </div>

        {/* 6 Connected Decision Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">Total Land</span>
            <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">
              {projectMetrics.land}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Corridor requirement</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">Affected Parcels</span>
            <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">
              {projectMetrics.parcels}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Cadastral khasras</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">RoR Verified</span>
            <span className="text-xl font-black text-[#15803D] font-mono mt-0.5 block">
              {projectMetrics.rorVerified}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Revenue title match</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">Acquisition Progress</span>
            <span className="text-xl font-black text-[#0B2740] font-mono mt-0.5 block">
              {projectMetrics.progress}%
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Stage {currentStageNumber} of 6</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">Actions Required</span>
            <span className={`text-xl font-black font-mono mt-0.5 block ${projectMetrics.actions > 0 ? "text-amber-600" : "text-emerald-600"}`}>
              {projectMetrics.actions}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Pending officer tasks</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">Delays</span>
            <span className={`text-xl font-black font-mono mt-0.5 block ${projectMetrics.delays > 0 ? "text-red-600" : "text-emerald-600"}`}>
              {projectMetrics.delays}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Bottlenecks flagged</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. MAIN INTELLIGENCE WORKFLOW GRID: GIS MAP + RoR PANEL
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: GIS Map Viewer (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs bg-white">
            <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2.5">
                <Compass className="h-4 w-4 text-[#0B2740]" />
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900">
                    GIS — Project Alignment & Cadastral Overlay
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    {selectedProjectId === "DL-INFRA-001"
                      ? "North Delhi Corridor Scope · Alipur & Narela (EPSG: 4326)"
                      : "Delhi–Ghaziabad Corridor Scope · Sahibabad & Duhai (EPSG: 4326)"}
                  </CardDescription>
                </div>
              </div>

              <Badge variant="outline" className="text-[11px] font-mono text-slate-600 bg-slate-50">
                {currentProjectConfig.state}
              </Badge>
            </CardHeader>

            {/* Layer Control Bar */}
            <div className="px-4 py-2.5 bg-[#FAF8F5] border-b border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold text-[11px] mr-1 flex items-center gap-1">
                <Layers className="h-3 w-3" /> Layers:
              </span>
              <button
                onClick={() => setLayerBaseMap(!layerBaseMap)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                  layerBaseMap ? "bg-white text-slate-800 border-slate-300 shadow-2xs font-bold" : "text-slate-400 border-transparent hover:text-slate-600"
                }`}
              >
                Base Map
              </button>
              <button
                onClick={() => setLayerSatellite(!layerSatellite)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                  layerSatellite ? "bg-[#0B2740] text-white border-[#0B2740] font-bold" : "text-slate-400 border-transparent hover:text-slate-600"
                }`}
              >
                Satellite
              </button>
              <button
                onClick={() => setLayerCadastral(!layerCadastral)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                  layerCadastral ? "bg-amber-100/80 text-amber-900 border-amber-300 font-bold" : "text-slate-400 border-transparent hover:text-slate-600"
                }`}
              >
                Cadastral Parcels
              </button>
              <button
                onClick={() => setLayerLocalities(!layerLocalities)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                  layerLocalities ? "bg-emerald-100/80 text-emerald-900 border-emerald-300 font-bold" : "text-slate-400 border-transparent hover:text-slate-600"
                }`}
              >
                Localities
              </button>
              <button
                onClick={() => setLayerRoads(!layerRoads)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                  layerRoads ? "bg-blue-100/80 text-blue-900 border-blue-300 font-bold" : "text-slate-400 border-transparent hover:text-slate-600"
                }`}
              >
                Roads
              </button>
              <button
                onClick={() => setLayerAlignment(!layerAlignment)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                  layerAlignment ? "bg-slate-800 text-white border-slate-800 font-bold" : "text-slate-400 border-transparent hover:text-slate-600"
                }`}
              >
                Alignment Corridor
              </button>
            </div>

            {/* Interactive Vector GIS Map Viewport */}
            <div className={`relative h-[430px] w-full select-none overflow-hidden transition-all duration-500 ${
              layerSatellite ? "bg-slate-900" : "bg-[#F7F9FC]"
            }`}>
              {/* Background Grid Linework */}
              <svg className="absolute inset-0 w-full h-full opacity-35 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="gisGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke={layerSatellite ? "#334155" : "#CBD5E1"} strokeWidth="0.8" strokeDasharray="2,2" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#gisGrid)" />
              </svg>

              {/* Roads Vector Layer */}
              {layerRoads && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Primary arterial highway */}
                  <path
                    d={selectedProjectId === "DL-INFRA-001"
                      ? "M -20,280 Q 240,240 520,160 T 900,80"
                      : "M -20,120 Q 200,190 480,270 T 900,340"}
                    fill="none"
                    stroke={layerSatellite ? "#64748B" : "#94A3B8"}
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <path
                    d={selectedProjectId === "DL-INFRA-001"
                      ? "M -20,280 Q 240,240 520,160 T 900,80"
                      : "M -20,120 Q 200,190 480,270 T 900,340"}
                    fill="none"
                    stroke={layerSatellite ? "#F8FAFC" : "#FFFFFF"}
                    strokeWidth="1.5"
                    strokeDasharray="6,4"
                  />
                  {/* Secondary connecting road */}
                  <path
                    d={selectedProjectId === "DL-INFRA-001"
                      ? "M 180,450 Q 260,260 320,-20"
                      : "M 420,-20 Q 380,220 310,450"}
                    fill="none"
                    stroke={layerSatellite ? "#475569" : "#CBD5E1"}
                    strokeWidth="3"
                  />
                </svg>
              )}

              {/* Alignment Corridor Buffer Layer (60m RoW) */}
              {layerAlignment && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* 60m buffer band */}
                  <path
                    d={selectedProjectId === "DL-INFRA-001"
                      ? "M 40,360 L 640,60"
                      : "M 50,80 L 620,360"}
                    fill="none"
                    stroke="rgba(14, 116, 144, 0.15)"
                    strokeWidth="68"
                    strokeLinecap="round"
                  />
                  {/* Centerline solid prominent corridor */}
                  <path
                    d={selectedProjectId === "DL-INFRA-001"
                      ? "M 40,360 L 640,60"
                      : "M 50,80 L 620,360"}
                    fill="none"
                    stroke="#0284C7"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}

              {/* Cadastral Parcels Interactive Layer */}
              {layerCadastral && (
                <div className="absolute inset-0">
                  {authorizedParcels.map((parcel, idx) => {
                    const isSelected = parcel.khasraNumber === selectedParcelId;
                    const isAffected = parcel.isAffected;

                    // Compute clean 2D layout offsets relative to project
                    const baseLeft = selectedProjectId === "DL-INFRA-001"
                      ? 70 + (idx % 4) * 115 + Math.floor(idx / 4) * 25
                      : 65 + (idx % 5) * 98 + Math.floor(idx / 5) * 18;

                    const baseTop = selectedProjectId === "DL-INFRA-001"
                      ? 60 + Math.floor(idx / 4) * 95 + (idx % 2) * 15
                      : 50 + Math.floor(idx / 5) * 85 + (idx % 2) * 12;

                    return (
                      <div
                        key={parcel.id}
                        onClick={() => setSelectedParcelId(parcel.khasraNumber)}
                        style={{
                          left: `${baseLeft}px`,
                          top: `${baseTop}px`,
                          width: `${parcel.isAffected ? 88 : 74}px`,
                          height: `${parcel.isAffected ? 72 : 62}px`,
                        }}
                        className={`absolute rounded-lg border cursor-pointer transition-all duration-300 flex flex-col items-center justify-center p-1.5 shadow-2xs ${
                          isSelected
                            ? "bg-[#0284C7]/25 border-[#0284C7] ring-2 ring-[#0284C7] z-30 scale-105"
                            : isAffected
                            ? "bg-amber-500/15 border-amber-600 hover:bg-amber-500/25 z-10"
                            : "bg-slate-200/40 border-slate-300/80 text-slate-400 z-0 opacity-70"
                        }`}
                        title={`${parcel.khasraNumber}: ${parcel.gisCalculatedAreaHa} Ha (${parcel.village})`}
                      >
                        <span className={`text-[11px] font-bold font-mono tracking-tight ${
                          isSelected ? "text-[#0284C7]" : isAffected ? "text-amber-900" : "text-slate-500"
                        }`}>
                          {parcel.khasraNumber}
                        </span>
                        <span className="text-[9.5px] font-medium text-slate-600">
                          {parcel.gisCalculatedAreaHa} Ha
                        </span>
                        {isAffected && (
                          <span className={`text-[8.5px] px-1 rounded-sm mt-0.5 font-bold ${
                            parcel.rorVerification?.status === "Verified"
                              ? "bg-emerald-100 text-emerald-800"
                              : parcel.rorVerification?.status === "Discrepancy Found"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {parcel.rorVerification?.status === "Verified" ? "Verified" : parcel.rorVerification?.status === "Discrepancy Found" ? "Discrepancy" : "Pending"}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Localities Text Labels */}
              {layerLocalities && (
                <div className="absolute inset-0 pointer-events-none">
                  {selectedProjectId === "DL-INFRA-001" ? (
                    <>
                      <div className="absolute top-6 left-12 bg-white/90 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-bold text-slate-800 shadow-2xs">
                        Alipur Locality (NCT)
                      </div>
                      <div className="absolute top-44 right-16 bg-white/90 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-bold text-slate-800 shadow-2xs">
                        Narela Sub-City
                      </div>
                      <div className="absolute bottom-8 left-20 bg-white/90 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-bold text-slate-800 shadow-2xs">
                        Hamidpur Boundary
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="absolute top-6 left-8 bg-white/90 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-bold text-slate-800 shadow-2xs">
                        Sahibabad Junction
                      </div>
                      <div className="absolute top-28 left-64 bg-white/90 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-bold text-slate-800 shadow-2xs">
                        Arthala Corridor
                      </div>
                      <div className="absolute bottom-24 right-28 bg-white/90 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-bold text-slate-800 shadow-2xs">
                        Morta Node
                      </div>
                      <div className="absolute bottom-6 right-8 bg-white/90 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-bold text-slate-800 shadow-2xs">
                        Duhai Rapid Transit
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* GIS Map Legend overlay */}
              <div className="absolute bottom-3 left-3 bg-white/92 backdrop-blur-xs border border-slate-200 rounded-xl p-2.5 shadow-sm text-[10px] space-y-1 z-30">
                <div className="font-bold text-slate-800 mb-1">Spatial Analysis Legend</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs border border-amber-600 bg-amber-500/20" />
                  <span className="text-slate-600">Affected Cadastral Parcels ({authorizedParcels.length})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs border-2 border-[#0284C7] bg-[#0284C7]/30" />
                  <span className="text-slate-600 font-bold">Selected Parcel ({selectedParcelId})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 bg-[#0284C7]" />
                  <span className="text-slate-600">60m Infrastructure Corridor</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Spatial Analysis Summary Box */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Spatial Affected Summary</span>
              <span className="text-slate-500 text-[11px]">
                {authorizedParcels.length} parcels intersecting the 60-meter right-of-way buffer in active jurisdiction.
              </span>
            </div>
            <div className="flex items-center gap-4 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">AFFECTED AREA</span>
                <span className="font-bold text-slate-900">{authorizedParcels.reduce((sum, p) => sum + p.affectedAreaHa, 0).toFixed(1)} Ha</span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-400 block text-[10px]">LOCALITIES</span>
                <span className="font-bold text-slate-900">{Array.from(new Set(authorizedParcels.map((p) => p.village))).length} Localities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: RoR & Ownership Verification Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="rounded-2xl border border-slate-200 shadow-xs bg-white overflow-hidden">
            <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-[#0B2740]" />
                <CardTitle className="text-sm font-bold text-slate-900">
                  Ownership & RoR Verification
                </CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono text-amber-800 bg-amber-50 border-amber-200">
                Demonstration Data
              </Badge>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              {/* Selected Parcel Badge Row */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 font-mono">SURVEY NUMBER</span>
                  <div className="text-lg font-black text-slate-950 font-mono">
                    {selectedParcel.khasraNumber}
                  </div>
                </div>

                <Badge
                  className={`text-xs px-3 py-1 font-bold ${
                    selectedParcel.rorVerification?.status === "Verified"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : selectedParcel.rorVerification?.status === "Discrepancy Found"
                      ? "bg-red-100 text-red-800 border-red-300"
                      : "bg-amber-100 text-amber-800 border-amber-300"
                  }`}
                >
                  {selectedParcel.rorVerification?.status || "Verified"}
                </Badge>
              </div>

              {/* Ownership Details Grid */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100/70">
                  <span className="text-slate-500 font-medium">Recorded Holder:</span>
                  <span className="font-bold text-slate-900 text-right max-w-[200px]">
                    {selectedParcel.owners[0]?.name || "Demo Landholder"}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100/70">
                  <span className="text-slate-500 font-medium">Land Area:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {selectedParcel.gisCalculatedAreaHa} Ha ({selectedParcel.areaSqMeters?.toLocaleString()} sq.m)
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100/70">
                  <span className="text-slate-500 font-medium">Location / Locality:</span>
                  <span className="font-bold text-slate-800">
                    {selectedParcel.village}, {selectedParcel.district}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100/70">
                  <span className="text-slate-500 font-medium">Khatauni No.:</span>
                  <span className="font-mono text-slate-700 font-semibold">
                    {selectedParcel.owners[0]?.khatauniNumber || "KH-000"}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100/70">
                  <span className="text-slate-500 font-medium">Verification Date:</span>
                  <span className="font-mono text-slate-700">
                    {selectedParcel.rorVerification?.verificationDate || "12 Sep 2026"}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100/70">
                  <span className="text-slate-500 font-medium">Estimated Award:</span>
                  <span className="font-mono font-bold text-[#0B2740]">
                    ₹{(selectedParcel.valuation.totalCompensationPayable / 100000).toFixed(2)} Lakhs
                  </span>
                </div>
              </div>

              {/* Status Note or Discrepancy Alert */}
              {selectedParcel.rorVerification?.status === "Discrepancy Found" ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-red-900">
                    <strong className="block font-bold">Ownership discrepancy requires review</strong>
                    <p className="text-[11px] text-red-700 mt-0.5">
                      {selectedParcel.rorVerification?.remarks || "Khatauni succession record requires CALA inquiry under Section 15."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-950">
                    <strong className="block font-bold">Title Verified Against Revenue Records</strong>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Verified by {selectedParcel.rorVerification?.verifiedBy || "Revenue Circle Officer"}. No encumbrances recorded.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDetailsModalOpen(true)}
                  className="flex-1 text-xs border-slate-300 font-semibold text-slate-800 hover:bg-slate-50"
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  View Details
                </Button>

                <Button
                  size="sm"
                  onClick={() => {
                    setActionNotification(`Created task: RoR Field Audit for ${selectedParcel.khasraNumber}`);
                    setTimeout(() => setActionNotification(null), 3000);
                  }}
                  className="flex-1 text-xs bg-[#0B2740] hover:bg-slate-800 text-white font-semibold"
                >
                  <CheckSquare className="h-3.5 w-3.5 mr-1" />
                  Create Task
                </Button>
              </div>

              {/* Sample Data Disclaimer */}
              <div className="text-[10px] text-slate-400 text-center italic pt-1">
                Clearly marked demonstration data. Fictional sample landholders for system evaluation only.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. 6-STAGE MANUAL ACQUISITION LIFECYCLE STEPPER
      ───────────────────────────────────────────────────────────── */}
      <Card className="rounded-2xl border border-slate-200 shadow-xs bg-white overflow-hidden">
        <CardHeader className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#0B2740]" />
              <CardTitle className="text-base font-bold text-slate-900">
                Acquisition Workflow Stepper (6 Statutory Stages)
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Presenter-driven manual progression · Click "Proceed to Next Stage" to demonstrate the complete lifecycle.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleProceedStage}
              disabled={currentStageNumber >= 6 || isTransitioning}
              className={`h-9 px-4 text-xs font-bold transition-all shadow-xs ${
                currentStageNumber >= 6
                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  : "bg-[#0B2740] hover:bg-slate-800 text-white cursor-pointer active:scale-95"
              }`}
            >
              {isTransitioning ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Advancing...
                </span>
              ) : currentStageNumber >= 6 ? (
                "Workflow Completed ✓"
              ) : (
                currentStageInfo.ctaText
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Horizontal Stepper Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((stg) => {
              const isPast = stg < currentStageNumber;
              const isCurrent = stg === currentStageNumber;
              const isUpcoming = stg > currentStageNumber;
              const stageTitle = STAGE_CONFIG[stg].name;

              return (
                <div
                  key={stg}
                  className={`p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? "bg-[#0B2740] text-white border-[#0B2740] shadow-sm ring-2 ring-[#0B2740]/20"
                      : isPast
                      ? "bg-emerald-50 text-emerald-950 border-emerald-200"
                      : "bg-slate-50 text-slate-400 border-slate-200/70"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-mono font-bold ${
                      isCurrent ? "text-slate-300" : isPast ? "text-emerald-700" : "text-slate-400"
                    }`}>
                      STAGE 0{stg}
                    </span>
                    {isPast ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <span className={`text-xs font-bold block truncate ${
                    isCurrent ? "text-white" : isPast ? "text-emerald-900" : "text-slate-600"
                  }`}>
                    {stageTitle}
                  </span>
                  <span className={`text-[9.5px] mt-0.5 block ${
                    isCurrent ? "text-slate-300" : isPast ? "text-emerald-700" : "text-slate-400"
                  }`}>
                    {isPast ? "Completed" : isCurrent ? "Active Stage" : "Pending"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Current Active Stage Detailed Panel */}
          <div className="rounded-xl border border-slate-200 bg-[#FAF8F5] p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-500">
                  {currentStageInfo.headline}
                </span>
                <h4 className="text-base font-bold text-slate-950">
                  {currentStageInfo.statusLabel}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentStageInfo.description}
                </p>
              </div>

              {/* Action Required Box */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shrink-0 min-w-[240px]">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  ACTION REQUIRED
                </span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">
                  {currentStageInfo.actionRequired}
                </span>
                <Button
                  size="sm"
                  onClick={handleProceedStage}
                  disabled={currentStageNumber >= 6 || isTransitioning}
                  className="mt-2.5 h-8 w-full text-xs bg-[#0B2740] hover:bg-slate-800 text-white font-bold cursor-pointer shadow-xs"
                >
                  {isTransitioning ? (
                    <span className="flex items-center gap-1.5 justify-center">
                      <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Advancing...
                    </span>
                  ) : currentStageNumber >= 6 ? (
                    "Stage Completed ✓"
                  ) : (
                    <span>Execute Transition →</span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─────────────────────────────────────────────────────────────
          6. DELAY INTELLIGENCE & ACTION CENTER (BOTTOM GRID)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Delay Intelligence ("Kaha delay ho raha hai?") */}
        <Card className="rounded-2xl border border-slate-200 shadow-xs bg-white overflow-hidden">
          <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <CardTitle className="text-sm font-bold text-slate-900">
                Delay Intelligence & Bottlenecks
              </CardTitle>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {delayItems.length} Flagged
            </span>
          </CardHeader>

          <CardContent className="p-4 space-y-2.5">
            {delayItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedParcelId(item.parcelTarget);
                  setDetailsModalOpen(true);
                  setActionNotification(`Inspecting flagged parcel ${item.parcelTarget}`);
                  setTimeout(() => setActionNotification(null), 3000);
                }}
                className="p-3 rounded-xl border border-slate-100 bg-[#FAFAFA] hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    item.level === "red" ? "bg-red-500" : item.level === "amber" ? "bg-amber-500" : "bg-emerald-500"
                  }`} />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 group-hover:text-[#0B2740] transition-colors">
                      {item.title}
                    </h5>
                    <span className="text-[11px] text-slate-500">{item.detail}</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedParcelId(item.parcelTarget);
                    setDetailsModalOpen(true);
                  }}
                  className="h-7 text-xs font-bold text-[#0B2740] hover:text-white hover:bg-[#0B2740] px-2.5 shrink-0 cursor-pointer rounded-lg border border-slate-200 transition-colors"
                >
                  Inspect →
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Center ("Kis action ki zarurat hai?") */}
        <Card className="rounded-2xl border border-slate-200 shadow-xs bg-white overflow-hidden">
          <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-[#0B2740]" />
              <CardTitle className="text-sm font-bold text-slate-900">
                Officer Action Center
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono text-slate-600 bg-slate-50">
              Priority Tasks
            </Badge>
          </CardHeader>

          <CardContent className="p-4 space-y-2.5">
            {actionItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-slate-100 bg-[#FAFAFA] hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-slate-900">{item.title}</h5>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      item.priority === "High" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                  <span className="text-[10.5px] text-slate-500 mt-0.5 block">
                    {item.project} · Due in {item.due}
                  </span>
                </div>

                <Button
                  size="sm"
                  onClick={item.action}
                  className="h-8 text-xs bg-[#0B2740] hover:bg-slate-800 text-white font-semibold shrink-0 cursor-pointer"
                >
                  {item.buttonText}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          7. PARCEL DETAILS MODAL (POPUP INSPECTOR & RECORD REVIEW)
      ───────────────────────────────────────────────────────────── */}
      {detailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#0B2740] text-white flex items-center justify-center font-mono font-black text-sm shadow-xs">
                  {selectedParcel.khasraNumber.split("-")[1] || "GIS"}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span>Cadastral Dossier — {selectedParcel.khasraNumber}</span>
                    <Badge
                      className={`text-[10px] px-2 py-0.5 font-bold ${
                        selectedParcel.rorVerification?.status === "Verified"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : selectedParcel.rorVerification?.status === "Discrepancy Found"
                          ? "bg-red-100 text-red-800 border-red-300"
                          : "bg-amber-100 text-amber-800 border-amber-300"
                      }`}
                    >
                      {selectedParcel.rorVerification?.status || "Verified"}
                    </Badge>
                  </h3>
                  <span className="text-xs text-slate-500">
                    {selectedParcel.village}, {selectedParcel.tehsil}, {selectedParcel.district} · ULPIN: <span className="font-mono text-slate-700 font-semibold">{selectedParcel.ulpin}</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="space-y-3.5 text-xs overflow-y-auto pr-1">
              {/* Ownership & Khatauni Card */}
              <div className="p-3.5 bg-[#FAF8F5] border border-[#E5E0D6] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-mono text-[10px] uppercase font-bold tracking-wider">
                    Computerized RoR (Record of Rights)
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Bhulekh Verified
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">RECORDED LANDHOLDER</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {selectedParcel.owners[0]?.name || "Recorded Landholder"}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      S/o {selectedParcel.owners[0]?.fatherOrHusbandName || "Revenue Record"} · Share: {selectedParcel.owners[0]?.sharePercentage || 100}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">KHATAUNI NUMBER</span>
                    <span className="font-mono font-bold text-slate-900 block mt-0.5">
                      {selectedParcel.owners[0]?.khatauniNumber || "KH-000"}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Category: {selectedParcel.owners[0]?.casteCategory || "General"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Spatial Geometry & Dimensions Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 border border-slate-200 rounded-xl bg-white shadow-2xs">
                  <span className="text-slate-400 block text-[10px] font-bold">TOTAL AREA</span>
                  <span className="font-mono font-extrabold text-slate-900 text-sm block mt-0.5">
                    {selectedParcel.gisCalculatedAreaHa} <span className="text-xs font-normal text-slate-500">Ha</span>
                  </span>
                  <span className="text-[10px] text-slate-500">{selectedParcel.areaSqMeters?.toLocaleString()} sq.m</span>
                </div>
                <div className="p-3 border border-slate-200 rounded-xl bg-white shadow-2xs">
                  <span className="text-slate-400 block text-[10px] font-bold">AFFECTED / RESIDUAL</span>
                  <span className="font-mono font-extrabold text-amber-900 text-sm block mt-0.5">
                    {selectedParcel.affectedAreaHa} <span className="text-xs font-normal text-slate-500">Ha</span>
                  </span>
                  <span className="text-[10px] text-slate-500">{selectedParcel.residualAreaHa} Ha residual</span>
                </div>
                <div className="p-3 border border-slate-200 rounded-xl bg-white shadow-2xs">
                  <span className="text-slate-400 block text-[10px] font-bold">CIRCLE RATE</span>
                  <span className="font-mono font-extrabold text-slate-900 text-sm block mt-0.5">
                    ₹{(selectedParcel.circleRatePerHa / 100000).toFixed(0)} <span className="text-xs font-normal text-slate-500">L/Ha</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Circle Guidance</span>
                </div>
              </div>

              {/* Status Note or Discrepancy Banner */}
              {selectedParcel.rorVerification?.status === "Discrepancy Found" ? (
                <div className="p-3 bg-red-50/90 border border-red-200 rounded-xl flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-red-900">
                    <strong className="block font-bold">Ownership & Succession Discrepancy Flagged</strong>
                    <p className="text-[11px] text-red-700 mt-0.5">
                      {selectedParcel.rorVerification?.remarks ||
                        "Khatauni succession record has joint title conflict under Section 15 RFCTLARR inquiry."}
                    </p>
                  </div>
                </div>
              ) : selectedParcel.rorVerification?.status === "Pending Verification" ? (
                <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl flex items-start gap-2.5">
                  <Clock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900">
                    <strong className="block font-bold">RoR Verification Pending Revenue Scrutiny</strong>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      {selectedParcel.rorVerification?.remarks ||
                        "Awaiting final ground-truthing panchnama from Tehsil Alipur Patwari circle."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-950">
                    <strong className="block font-bold">Title Verified Against State Revenue Records</strong>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Verified by {selectedParcel.rorVerification?.verifiedBy || "CALA Revenue Circle"}. Encumbrance-free freehold title.
                    </p>
                  </div>
                </div>
              )}

              {/* RFCTLARR Compensation Assessment */}
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
                <span className="text-emerald-900 font-bold block text-xs">
                  RFCTLARR 2013 Statutory Compensation Assessment (Sec 23-30)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Base Market Value</span>
                    <span className="font-mono font-bold text-slate-800">
                      ₹{(selectedParcel.valuation.baseMarketValue / 100000).toFixed(2)} L
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Multiplier (1.5x)</span>
                    <span className="font-mono font-bold text-slate-800">
                      ₹{(selectedParcel.valuation.multipliedValue / 100000).toFixed(2)} L
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">100% Solatium</span>
                    <span className="font-mono font-bold text-slate-800">
                      ₹{(selectedParcel.valuation.solatiumAmount / 100000).toFixed(2)} L
                    </span>
                  </div>
                  <div>
                    <span className="text-emerald-700 block text-[10px] font-bold">Total Award</span>
                    <span className="font-mono font-extrabold text-[#15803D]">
                      ₹{(selectedParcel.valuation.totalCompensationPayable / 100000).toFixed(2)} L
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setDetailsModalOpen(false);
                    router.push(`/map?projectId=${selectedProjectId}&khasra=${selectedParcel.khasraNumber}`);
                  }}
                  className="h-8 text-xs font-bold gap-1 text-[#15803D] border-emerald-300 hover:bg-emerald-50 cursor-pointer"
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>View on Cadastral Map 🗺️</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setDetailsModalOpen(false);
                    router.push(`/map?projectId=${selectedProjectId}&tab=table&khasra=${selectedParcel.khasraNumber}`);
                  }}
                  className="h-8 text-xs font-bold gap-1 text-slate-700 border-slate-300 hover:bg-slate-50 cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Cadastral Table 📋</span>
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {selectedParcel.rorVerification?.status !== "Verified" && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setParcelStatusOverrides((prev) => ({
                        ...prev,
                        [selectedParcel.khasraNumber]: "Verified",
                      }));
                      setActionNotification(`Discrepancy resolved & Survey ${selectedParcel.khasraNumber} marked Verified!`);
                      setTimeout(() => setActionNotification(null), 4000);
                    }}
                    className="h-8 text-xs font-bold bg-[#15803D] hover:bg-emerald-700 text-white cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Verify & Clear Discrepancy
                  </Button>
                )}

                <Button
                  onClick={() => setDetailsModalOpen(false)}
                  className="h-8 text-xs bg-[#0B2740] hover:bg-slate-800 text-white font-semibold px-4 cursor-pointer"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
