"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Polyline,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import {
  Layers,
  MapPin,
  Compass,
  Maximize2,
  Info,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Copy,
  Check,
  Eye,
  EyeOff,
  SlidersHorizontal,
  X,
  Code2,
  Download,
  Share2,
  ArrowUpRight,
  ShieldCheck,
  Building,
  Coins,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Ruler,
  Minimize2,
  MessageSquare,
  Tag,
  Play,
  Activity,
  BarChart3,
  Zap,
} from "lucide-react";
import {
  BHUNAKSHA_PROJECTS,
  BhuNakshaProject,
  BhuNakshaParcel,
  generateBhuNakshaGeoJSON,
  LAMS_12_STAGES,
  getParcel12StageInfo,
  getParcelStageVisualColor,
} from "@/lib/bhunaksha-service";
import {
  SPATIAL_PROJECTS,
  ALL_DEMO_SPATIAL_PARCELS,
  runSpatialAnalysis,
  generateAlignmentBufferPolygon,
  getShiftedCenterline,
  SpatialAnalysisResult,
  ProjectSpatialSummary,
  SpatialProjectEntity,
} from "@/lib/spatial-engine";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BhuNakshaArchitectureModal } from "@/components/docs/bhunaksha-architecture-modal";
import { useApp } from "@/context/app-context";
import { filterBhuParcelsForUser } from "@/lib/auth-store";

// Minimalist, authentic Cadastral Plot Number Label (non-intrusive)
function createKhasraBadgeIcon(
  khasraNumber: string,
  isSelected: boolean,
  isAffected: boolean,
  stageIndex: number = 3
) {
  const bg = isSelected
    ? "#0F172A"
    : "rgba(255, 255, 255, 0.88)";
  const color = isSelected ? "#FFFFFF" : "#1E293B";
  const border = isSelected
    ? "2px solid #0F172A"
    : isAffected
    ? "1px solid rgba(220, 38, 38, 0.5)"
    : "1px solid rgba(22, 163, 74, 0.5)";

  return L.divIcon({
    className: "custom-khasra-badge",
    html: `
      <div style="
        font-family: ui-monospace, SFMono-Regular, monospace;
        font-size: ${isSelected ? "11px" : "10px"};
        font-weight: ${isSelected ? "800" : "700"};
        line-height: 1;
        padding: ${isSelected ? "2px 6px" : "1px 4px"};
        border-radius: 4px;
        background: ${bg};
        color: ${color};
        border: ${border};
        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        white-space: nowrap;
        text-align: center;
        transform: translate(-50%, -50%);
        pointer-events: none;
        user-select: none;
      ">
        ${khasraNumber}
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

// Map Camera Fly-to Controller
function MapCameraController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.8 });
  }, [center, zoom, map]);
  return null;
}

// Telemetry tracker & map click handler
function MapTelemetryTracker({
  onMouseMove,
  onMapClick,
}: {
  onMouseMove: (latlng: { lat: number; lng: number }) => void;
  onMapClick: () => void;
}) {
  useMapEvents({
    mousemove(e) {
      onMouseMove({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
    click() {
      onMapClick();
    },
  });
  return null;
}

interface BhuNakshaMapViewerProps {
  initialProjectId?: string;
  initialKhasraNumber?: string;
  initialStageFilter?: number;
  onProjectChange?: (projectId: string) => void;
}

export function BhuNakshaMapViewer({
  initialProjectId = "DL-INFRA-001",
  initialKhasraNumber,
  initialStageFilter,
}: BhuNakshaMapViewerProps = {}) {
  const { currentUser, scopedGrants } = useApp();

  const activeProjectId = useMemo(() => {
    if (currentUser?.jurisdiction.level === "district" && currentUser.jurisdiction.districtCode === "GZB") {
      return "DL-GZB-002";
    }
    if (currentUser?.jurisdiction.level === "project" && currentUser.jurisdiction.projectId) {
      return currentUser.jurisdiction.projectId;
    }
    return initialProjectId || "DL-INFRA-001";
  }, [currentUser, initialProjectId]);

  const [selectedProjectId, setSelectedProjectId] = useState<string>(activeProjectId);

  useEffect(() => {
    setSelectedProjectId(activeProjectId);
  }, [activeProjectId]);

  const currentProject = useMemo(() => {
    return BHUNAKSHA_PROJECTS.find((p) => p.id === selectedProjectId) || BHUNAKSHA_PROJECTS[0];
  }, [selectedProjectId]);


  const authorizedParcels = useMemo(() => {
    return filterBhuParcelsForUser(currentUser, scopedGrants, currentProject.parcels);
  }, [currentUser, scopedGrants, currentProject]);

  // Selected Parcel state (defaults to null so map is completely clean and unencumbered)
  const [selectedParcel, setSelectedParcel] = useState<BhuNakshaParcel | null>(() => {
    if (initialKhasraNumber) {
      const match = authorizedParcels.find(
        (p) => p.khasraNumber === initialKhasraNumber
      );
      if (match) return match;
    }
    if (initialStageFilter) {
      const match = authorizedParcels.find((p) => {
        const enriched = getParcel12StageInfo(p);
        return enriched.stageIndex === initialStageFilter;
      });
      if (match) return match;
    }
    return null;
  });

  // Sync initial props
  useEffect(() => {
    if (initialKhasraNumber) {
      const match = authorizedParcels.find(
        (p) => p.khasraNumber === initialKhasraNumber
      );
      if (match) {
        setSelectedParcel(match);
        return;
      }
    }
    if (initialStageFilter) {
      const match = authorizedParcels.find((p) => {
        const enriched = getParcel12StageInfo(p);
        return enriched.stageIndex === initialStageFilter;
      });
      if (match) {
        setSelectedParcel(match);
        return;
      }
    }
  }, [authorizedParcels, initialKhasraNumber, initialStageFilter]);

  // Display Mode: "cadastralSheet" (authentic Sajra) | "hybrid" (satellite + vectors) | "osm" (street map)
  const [mapMode, setMapMode] = useState<"cadastralSheet" | "hybrid" | "osm">("cadastralSheet");

  // Layers & Overlay Toggles
  const [showCorridor, setShowCorridor] = useState<boolean>(true);
  const [showKhasraLabels, setShowKhasraLabels] = useState<boolean>(true);
  const [showTooltips, setShowTooltips] = useState<boolean>(false); // Popups OFF by default to eliminate clutter!
  const [zenMode, setZenMode] = useState<boolean>(false); // Zen / Focus GIS mode
  const [filterImpact, setFilterImpact] = useState<"all" | "affected" | "unaffected">("all");

  // Panels
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(false); // Drawer CLOSED by default!
  const [dossierTab, setDossierTab] = useState<"details" | "ror" | "acquisition" | "possession">("details");
  const [apiDrawerOpen, setApiDrawerOpen] = useState<boolean>(false);
  const [architectureModalOpen, setArchitectureModalOpen] = useState<boolean>(false);
  const [copiedULPIN, setCopiedULPIN] = useState<boolean>(false);
  // ───── Core Spatial Analysis Layer State ─────
  const [corridorWidth, setCorridorWidth] = useState<number>(60);
  const [alignmentShift, setAlignmentShift] = useState<number>(0); // 0 = statutory, 25 = +25m shift
  const [spatialAnalysisRunning, setSpatialAnalysisRunning] = useState<boolean>(false);
  const [spatialAnalysisProgress, setSpatialAnalysisProgress] = useState<string>("");
  const [analysisCompletedNotice, setAnalysisCompletedNotice] = useState<boolean>(false);
  const [scanningParcelIndex, setScanningParcelIndex] = useState<number>(-1);
  const [spatialReportModalOpen, setSpatialReportModalOpen] = useState<boolean>(false);

  // Dynamic Effective Centerline (accounting for Section 15 route-shift simulation)
  const effectiveCenterline = useMemo(() => {
    const raw = currentProject.corridorCenterline || [];
    return alignmentShift !== 0 ? getShiftedCenterline(raw, alignmentShift) : raw;
  }, [currentProject.corridorCenterline, alignmentShift]);

  // Dynamic Corridor Buffer Polygon
  const corridorBufferPolygon = useMemo(() => {
    if (!effectiveCenterline || effectiveCenterline.length < 2) return [];
    return generateAlignmentBufferPolygon(effectiveCenterline, corridorWidth);
  }, [effectiveCenterline, corridorWidth]);

  const [spatialSummary, setSpatialSummary] = useState<ProjectSpatialSummary | null>(() => {
    const matchedProject = SPATIAL_PROJECTS.find(p => p.projectCode === currentProject.projectCode) || SPATIAL_PROJECTS[0];
    const { summary } = runSpatialAnalysis(matchedProject, ALL_DEMO_SPATIAL_PARCELS, corridorWidth, effectiveCenterline);
    return summary;
  });
  const [spatialResultsMap, setSpatialResultsMap] = useState<Map<string, SpatialAnalysisResult>>(() => {
    const matchedProject = SPATIAL_PROJECTS.find(p => p.projectCode === currentProject.projectCode) || SPATIAL_PROJECTS[0];
    const { results } = runSpatialAnalysis(matchedProject, ALL_DEMO_SPATIAL_PARCELS, corridorWidth, effectiveCenterline);
    return new Map(results.map(r => [r.surveyNumber, r]));
  });

  // Re-run spatial analysis dynamically whenever project, corridor width, or route shift changes
  useEffect(() => {
    const matchedProject = SPATIAL_PROJECTS.find(p => p.projectCode === currentProject.projectCode) || SPATIAL_PROJECTS[0];
    const { results, summary } = runSpatialAnalysis(matchedProject, ALL_DEMO_SPATIAL_PARCELS, corridorWidth, effectiveCenterline);
    setSpatialResultsMap(new Map(results.map(r => [r.surveyNumber, r])));
    setSpatialSummary(summary);
    setSelectedParcel(null);
  }, [currentProject.projectCode, corridorWidth, effectiveCenterline]);

  // Execute interactive 4-stage spatial analysis pipeline with progressive laser sweep
  const handleRunSpatialAnalysis = () => {
    setSpatialAnalysisRunning(true);
    setAnalysisCompletedNotice(false);
    setSpatialAnalysisProgress(`1/4: Generating ${corridorWidth}m Geodetic Right-of-Way Buffer Corridor...`);

    let sweepIdx = 0;
    const sweepTimer = setInterval(() => {
      if (sweepIdx < authorizedParcels.length) {
        setScanningParcelIndex(sweepIdx);
        sweepIdx++;
      } else {
        clearInterval(sweepTimer);
      }
    }, 60);

    setTimeout(() => {
      setSpatialAnalysisProgress("2/4: Computing Sutherland-Hodgman & Ray-Casting Intersections...");

      setTimeout(() => {
        setSpatialAnalysisProgress("3/4: Quantifying Overlap Acreage & RFCTLARR Sec 27 Severance...");

        setTimeout(() => {
          setSpatialAnalysisProgress("4/4: Harmonizing Boundary Intersect with Bhulekh RoR Records...");

          setTimeout(() => {
            const matchedProject = SPATIAL_PROJECTS.find(p => p.projectCode === currentProject.projectCode) || SPATIAL_PROJECTS[0];
            const { results, summary } = runSpatialAnalysis(matchedProject, ALL_DEMO_SPATIAL_PARCELS, corridorWidth, effectiveCenterline);
            setSpatialResultsMap(new Map(results.map(r => [r.surveyNumber, r])));
            setSpatialSummary(summary);
            setSpatialAnalysisRunning(false);
            setScanningParcelIndex(-1);
            setSpatialAnalysisProgress("");
            setAnalysisCompletedNotice(true);
            setTimeout(() => setAnalysisCompletedNotice(false), 5000);
          }, 300);
        }, 300);
      }, 300);
    }, 300);
  };

  // Dynamic filter counts strictly derived from active spatial results
  const affectedCount = useMemo(() => {
    let count = 0;
    for (const p of authorizedParcels) {
      if (spatialResultsMap.get(p.khasraNumber)?.isAffected) count++;
    }
    return count;
  }, [authorizedParcels, spatialResultsMap]);

  const bufferCount = authorizedParcels.length - affectedCount;

  // Filtered visible parcels based on dynamic spatial results
  const visibleParcels = useMemo(() => {
    return authorizedParcels.filter((p) => {
      const sRes = spatialResultsMap.get(p.khasraNumber);
      const isAff = sRes ? sRes.isAffected : p.isAffected;
      if (filterImpact === "affected") return isAff;
      if (filterImpact === "unaffected") return !isAff;
      return true;
    });
  }, [authorizedParcels, filterImpact, spatialResultsMap]);

  // Live Telemetry
  const [cursorPos, setCursorPos] = useState<{ lat: number; lng: number }>(() => ({
    lat: authorizedParcels[0]?.coordinates[0] || (selectedProjectId === "DL-GZB-002" ? 28.67 : 28.72),
    lng: authorizedParcels[0]?.coordinates[1] || (selectedProjectId === "DL-GZB-002" ? 77.41 : 77.14),
  }));

  // Camera coordinates
  const cameraConfig = useMemo(() => {
    if (selectedProjectId === "DL-GZB-002") {
      return { center: [28.670, 77.411] as [number, number], zoom: 13 };
    }
    return { center: [28.721, 77.142] as [number, number], zoom: 14 };
  }, [selectedProjectId]);

  // Copy ULPIN helper
  const handleCopyULPIN = (ulpin: string) => {
    navigator.clipboard.writeText(ulpin);
    setCopiedULPIN(true);
    setTimeout(() => setCopiedULPIN(false), 2000);
  };

  // Polygon Styles for Cadastral parcels based on actual spatial intersection
  const getParcelPolygonStyle = (parcel: BhuNakshaParcel, index: number) => {
    const isSelected = selectedParcel?.id === parcel.id;
    const isScanning = scanningParcelIndex === index;
    const spatialResult = spatialResultsMap.get(parcel.khasraNumber);
    const isAffected = spatialResult ? spatialResult.isAffected : parcel.isAffected;
    const isSeverance = spatialResult?.severanceClaimEligible;

    if (isScanning) {
      return {
        color: "#22C55E",
        weight: 3.5,
        dashArray: "3, 3",
        fillColor: "#4ADE80",
        fillOpacity: 0.70,
      };
    }

    if (isSelected) {
      return {
        color: "#0284C7", // Green/blue highlight
        weight: 3.5,
        fillColor: "#0284C7",
        fillOpacity: 0.55,
      };
    }

    if (isAffected) {
      if (isSeverance) {
        return {
          color: "#DC2626", // Red for Section 27 severance
          weight: 2.5,
          fillColor: "#EF4444",
          fillOpacity: 0.40,
        };
      }
      return {
        color: "#D97706", // Subtle amber/orange outline
        weight: 2.2,
        fillColor: "#F59E0B",
        fillOpacity: 0.35,
      };
    }

    // Unaffected: Muted grey / neutral
    return {
      color: "#94A3B8",
      weight: 1.2,
      fillColor: "#CBD5E1",
      fillOpacity: 0.16,
    };
  };

  // Export Spatial Analysis GeoJSON
  const handleDownloadSpatialGeoJSON = () => {
    const features = authorizedParcels.map((p) => {
      const sRes = spatialResultsMap.get(p.khasraNumber);
      return {
        type: "Feature",
        id: p.ulpin,
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              ...p.polygon.map(([lat, lng]) => [lng, lat]),
              [p.polygon[0][1], p.polygon[0][0]],
            ],
          ],
        },
        properties: {
          khasraNumber: p.khasraNumber,
          surveyNumber: p.surveyNumber,
          village: p.village,
          tehsil: p.tehsil,
          district: p.district,
          totalAreaHa: p.gisCalculatedAreaHa,
          isAffected: sRes?.isAffected ?? p.isAffected,
          affectedAreaHa: sRes?.affectedAreaHa ?? p.affectedAreaHa,
          affectedPercentage: sRes?.affectedPercentage ?? p.affectedAreaPercentage,
          residualAreaHa: sRes?.residualAreaHa ?? p.residualAreaHa,
          acquisitionType: sRes?.acquisitionType ?? p.acquisitionType,
          severanceEligible: sRes?.severanceClaimEligible ?? false,
          rorStatus: sRes?.rorStatus ?? "Verified",
          estimatedCompensationINR: sRes?.estimatedCompensationINR ?? p.valuation.totalCompensationPayable,
        },
      };
    });

    const geojson = {
      type: "FeatureCollection",
      name: `BhoomiDrishti_Spatial_Analysis_${currentProject.projectCode}`,
      crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
      features,
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/geo+json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spatial_analysis_${currentProject.projectCode}_${corridorWidth}m.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export Spatial CSV Register
  const handleDownloadSpatialCSV = () => {
    const headers = [
      "Khasra No",
      "Survey No",
      "Village",
      "Tehsil",
      "District",
      "Total Area (Ha)",
      "Corridor Overlap %",
      "Acquired Area (Ha)",
      "Residual Area (Ha)",
      "Acquisition Type",
      "Sec 27 Severance Eligible",
      "RoR Title Status",
      "Circle Rate (INR/Ha)",
      "Est Compensation Award (INR)",
    ];

    const rows = authorizedParcels.map((p) => {
      const s = spatialResultsMap.get(p.khasraNumber);
      return [
        p.khasraNumber,
        p.surveyNumber,
        p.village,
        p.tehsil,
        p.district,
        p.gisCalculatedAreaHa,
        s?.affectedPercentage ?? (p.isAffected ? 100 : 0),
        s?.affectedAreaHa ?? p.affectedAreaHa,
        s?.residualAreaHa ?? p.residualAreaHa,
        s?.acquisitionType ?? p.acquisitionType,
        s?.severanceClaimEligible ? "YES" : "NO",
        s?.rorStatus ?? "Verified",
        p.circleRatePerHa,
        s?.estimatedCompensationINR ?? p.valuation.totalCompensationPayable,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const a = document.createElement("a");
    a.href = encodedUri;
    a.download = `spatial_register_${currentProject.projectCode}_${corridorWidth}m.csv`;
    a.click();
  };

  // Active GeoJSON preview for API Inspector
  const activeGeoJsonPreview = useMemo(() => {
    const p = selectedParcel || currentProject.parcels[0];
    const sRes = spatialResultsMap.get(p.khasraNumber);
    return {
      type: "Feature",
      id: p.ulpin,
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            ...p.polygon.map(([lat, lng]) => [lng, lat]),
            [p.polygon[0][1], p.polygon[0][0]],
          ],
        ],
      },
      properties: {
        khasraNumber: p.khasraNumber,
        ulpin: p.ulpin,
        villageLgdCode: p.villageLgdCode,
        sheetNumber: p.sheetNumber,
        gisAreaHa: p.gisCalculatedAreaHa,
        recordedRoRAreaHa: p.recordedRoRAreaHa,
        isAffected: sRes?.isAffected ?? p.isAffected,
        affectedAreaHa: sRes?.affectedAreaHa ?? p.affectedAreaHa,
        affectedPercentage: sRes?.affectedPercentage ?? p.affectedAreaPercentage,
        acquisitionType: sRes?.acquisitionType ?? p.acquisitionType,
        severanceClaimEligible: sRes?.severanceClaimEligible ?? false,
        owners: p.owners.map((o) => ({
          name: o.name,
          share: `${o.sharePercentage}%`,
        })),
        circleRateINR: p.circleRatePerHa,
        totalCompensationPayableINR: sRes?.estimatedCompensationINR ?? p.valuation.totalCompensationPayable,
      },
    };
  }, [selectedParcel, currentProject, spatialResultsMap]);

  return (
    <div className="relative w-full h-[calc(100vh-115px)] min-h-[580px] flex-1 flex flex-col bg-[#FAF8F5] overflow-hidden rounded-3xl border border-[#E5E0D6] shadow-sm">
      {/* ───── STREAMLINED 1-ROW GIS TOOLBAR (NO DUPLICATE HEADERS) ───── */}
      {!zenMode && (
        <div className="z-10 bg-white/95 backdrop-blur-md border-b border-[#E5E0D6] px-3 py-1.5 shadow-xs shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Left: Base Map Switcher, Buffer Width, and Corridor Controls */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Base Map Switcher */}
              <div className="flex items-center bg-[#FAF8F5] p-0.5 rounded-xl border border-[#E5E0D6] text-xs font-bold">
                <button
                  onClick={() => setMapMode("cadastralSheet")}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                    mapMode === "cadastralSheet"
                      ? "bg-white text-[#15803D] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Authentic BhuNaksha Village Sajra Sheet Mode"
                >
                  📜 Sajra Sheet
                </button>
                <button
                  onClick={() => setMapMode("hybrid")}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                    mapMode === "hybrid"
                      ? "bg-white text-[#0284C7] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="High-Res Satellite Imagery with Cadastral Boundaries"
                >
                  🛰️ Satellite
                </button>
                <button
                  onClick={() => setMapMode("osm")}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                    mapMode === "osm"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Street Map"
                >
                  🗺️ Streets
                </button>
              </div>

              {/* Dynamic RoW Buffer Width Selector */}
              <div className="flex items-center bg-[#FAF8F5] p-0.5 rounded-xl border border-[#E5E0D6] text-xs font-bold">
                <span className="text-[10px] uppercase font-mono text-slate-400 px-1.5 flex items-center gap-0.5">
                  <Ruler className="h-2.5 w-2.5" />
                  <span>Buffer:</span>
                </span>
                {[30, 60, 90, 120].map((w) => (
                  <button
                    key={w}
                    onClick={() => setCorridorWidth(w)}
                    className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer font-mono text-xs ${
                      corridorWidth === w
                        ? "bg-[#EA580C] text-white shadow-xs font-black"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                    title={`Set Corridor Right-of-Way Buffer to ${w}m`}
                  >
                    {w}m{w === 60 ? "★" : ""}
                  </button>
                ))}
              </div>

              {/* Section 15 Alignment Route Shift Simulation */}
              <button
                onClick={() => setAlignmentShift((prev) => (prev === 0 ? 25 : 0))}
                className={`px-2 py-1 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                  alignmentShift !== 0
                    ? "bg-purple-100 text-purple-900 border-purple-300 font-black shadow-xs"
                    : "bg-white text-slate-500 border-[#E5E0D6] hover:text-slate-800"
                }`}
                title="Simulate Section 15 Public Objection Alignment Shift (+25m lateral offset) to evaluate parcel preservation"
              >
                <Zap className="h-3 w-3 text-purple-600" />
                <span>{alignmentShift !== 0 ? "Shifted (+25m Alt)" : "Sec 15 Shift"}</span>
              </button>

              {/* Corridor Overlay Toggle */}
              <button
                onClick={() => setShowCorridor(!showCorridor)}
                className={`px-2 py-1 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                  showCorridor
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-white text-slate-400 border-[#E5E0D6] hover:text-slate-700"
                }`}
                title="Toggle Corridor Right-of-Way Overlay"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${showCorridor ? "bg-red-600 animate-pulse" : "bg-slate-300"}`} />
                <span>{corridorWidth}m RoW</span>
              </button>

              {/* Dynamic Parcel Filter Pills (Synchronized with Spatial Engine) */}
              <div className="hidden sm:flex items-center bg-[#FAF8F5] p-0.5 rounded-xl border border-[#E5E0D6] text-[11px] font-bold">
                <button
                  onClick={() => setFilterImpact("all")}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                    filterImpact === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  All ({authorizedParcels.length})
                </button>
                <button
                  onClick={() => setFilterImpact("affected")}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                    filterImpact === "affected" ? "bg-red-500 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Affected ({affectedCount})
                </button>
                <button
                  onClick={() => setFilterImpact("unaffected")}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                    filterImpact === "unaffected" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Buffer ({bufferCount})
                </button>
              </div>
            </div>

            {/* Right: GIS Toggles, Spatial Report, API Drawer & Run Analysis */}
            <div className="flex items-center gap-1.5">
              {/* Plot Numbers Toggle */}
              <button
                onClick={() => setShowKhasraLabels(!showKhasraLabels)}
                className={`px-2 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border ${
                  showKhasraLabels
                    ? "bg-[#FAF8F5] text-slate-900 border-[#CBD5E1]"
                    : "bg-white text-slate-400 border-[#E5E0D6]"
                }`}
                title="Toggle Khasra Plot Numbers"
              >
                <Tag className="h-3 w-3" />
                <span className="hidden md:inline">Numbers</span>
              </button>

              {/* Tooltips / Popups Toggle */}
              <button
                onClick={() => setShowTooltips(!showTooltips)}
                className={`px-2 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border ${
                  showTooltips
                    ? "bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]"
                    : "bg-white text-slate-400 border-[#E5E0D6]"
                }`}
                title={showTooltips ? "Hover tooltips enabled" : "Hover tooltips disabled"}
              >
                <MessageSquare className="h-3 w-3" />
                <span className="hidden md:inline">Popups</span>
                <span className="text-[10px] font-mono">{showTooltips ? "ON" : "OFF"}</span>
              </button>

              {/* Comprehensive Spatial Report Modal Button */}
              <button
                onClick={() => setSpatialReportModalOpen(true)}
                className="px-2 py-1 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                title="View Full Spatial Intersection Dossier and Breakdown"
              >
                <BarChart3 className="h-3 w-3 text-amber-700" />
                <span className="hidden lg:inline">Report</span>
              </button>

              {/* Zen / Full Map Mode Toggle */}
              <button
                onClick={() => setZenMode(true)}
                className="px-2 py-1 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-[#FAF8F5] border border-[#E5E0D6] flex items-center gap-1 cursor-pointer transition-colors"
                title="Zen Focus Mode: Hide all overlays to inspect pure cadastral map"
              >
                <Maximize2 className="h-3 w-3 text-slate-500" />
                <span className="hidden xl:inline">Zen View</span>
              </button>

              {/* Raw API Drawer Button */}
              <button
                onClick={() => setApiDrawerOpen(!apiDrawerOpen)}
                className="px-2 py-1 rounded-xl text-xs font-bold bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF] flex items-center gap-1 transition-colors cursor-pointer"
                title="Inspect NIC BhuNaksha WFS 2.0 GeoJSON Endpoint"
              >
                <Code2 className="h-3 w-3" />
                <span className="hidden xl:inline">API</span>
              </button>

              {/* Run Spatial Analysis Button */}
              <button
                onClick={handleRunSpatialAnalysis}
                disabled={spatialAnalysisRunning}
                className="px-3 py-1 rounded-xl text-xs font-bold bg-[#15803D] hover:bg-[#166534] text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                title="Execute geometric intersection pipeline against project corridor buffer"
              >
                {spatialAnalysisRunning ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Run Spatial Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───── MAIN INTERACTIVE MAP CANVAS ───── */}
      <div className="relative flex-1 w-full h-full isolate">
        <MapContainer
          center={cameraConfig.center}
          zoom={cameraConfig.zoom}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
          style={{
            background: mapMode === "cadastralSheet" ? "#FAF7EE" : "#0F172A",
          }}
        >
          <MapCameraController center={cameraConfig.center} zoom={cameraConfig.zoom} />
          <MapTelemetryTracker
            onMouseMove={setCursorPos}
            onMapClick={() => {
              if (selectedParcel && !inspectorOpen) {
                setSelectedParcel(null);
              }
            }}
          />

          {/* Map Base Tile Layers */}
          {mapMode === "cadastralSheet" && (
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
              opacity={0.35}
            />
          )}

          {mapMode === "hybrid" && (
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          )}

          {mapMode === "osm" && (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}

          {/* Highway Corridor Right-of-Way Buffer & Centerline */}
          {showCorridor && effectiveCenterline.length > 0 && (
            <>
              {/* Generated Corridor Polygon Buffer */}
              {corridorBufferPolygon.length > 0 && (
                <Polygon
                  positions={corridorBufferPolygon}
                  pathOptions={{
                    color: alignmentShift !== 0 ? "#7C3AED" : "#EA580C",
                    weight: 2,
                    dashArray: "4, 4",
                    fillColor: alignmentShift !== 0 ? "#A855F7" : "#FB923C",
                    fillOpacity: 0.18,
                  }}
                />
              )}
              {/* Project Alignment: Clear solid dark / high-contrast line */}
              <Polyline
                positions={effectiveCenterline}
                pathOptions={{
                  color: alignmentShift !== 0 ? "#581C87" : "#0F172A",
                  weight: 3.5,
                }}
              />
              <Polyline
                positions={effectiveCenterline}
                pathOptions={{
                  color: "#FFFFFF",
                  weight: 1.5,
                  dashArray: "6, 6",
                }}
              />
            </>
          )}

          {/* BhuNaksha Cadastral Khasra Vector Polygons */}
          {visibleParcels.map((parcel, index) => {
            const isSelected = selectedParcel?.id === parcel.id;
            const enriched = getParcel12StageInfo(parcel);
            const style = getParcelPolygonStyle(parcel, index);
            const sRes = spatialResultsMap.get(parcel.khasraNumber);
            const isAff = sRes ? sRes.isAffected : parcel.isAffected;

            return (
              <React.Fragment key={parcel.id}>
                <Polygon
                  positions={parcel.polygon}
                  pathOptions={style}
                  eventHandlers={{
                    click: (e) => {
                      L.DomEvent.stopPropagation(e);
                      setSelectedParcel(parcel);
                    },
                  }}
                >
                  {/* Tooltip on hover */}
                  {showTooltips && (
                    <Tooltip direction="top" offset={[0, -8]} opacity={0.92}>
                      <span className="font-mono text-xs font-semibold text-slate-900">
                        Khasra {parcel.khasraNumber} &bull; {parcel.gisCalculatedAreaHa} Ha &bull; {isAff ? `Affected (${sRes?.affectedPercentage ?? 100}%)` : "Buffer (0%)"}
                      </span>
                    </Tooltip>
                  )}
                </Polygon>

                {/* Centroid Plot Number Label */}
                {showKhasraLabels && (
                  <Marker
                    position={parcel.coordinates}
                    icon={createKhasraBadgeIcon(
                      parcel.khasraNumber,
                      isSelected,
                      isAff,
                      enriched.stageIndex
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </MapContainer>

        {/* ───── ZEN MODE EXIT BUTTON ───── */}
        {zenMode && (
          <button
            onClick={() => setZenMode(false)}
            className="absolute top-3 right-3 z-30 bg-slate-900/90 text-white hover:bg-slate-900 px-3 py-1.5 rounded-xl shadow-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-all animate-in fade-in"
          >
            <Minimize2 className="h-3.5 w-3.5" />
            <span>Exit Zen Mode</span>
          </button>
        )}

        {/* ───── SLEEK MINIMAL TOP-LEFT BADGE (DOES NOT COVER PARCELS) ───── */}
        {!zenMode && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none flex flex-col gap-2 max-w-md">
            <div className="bg-white/90 backdrop-blur-md border border-[#E5E0D6] rounded-xl px-2.5 py-1 shadow-xs pointer-events-auto flex items-center gap-2 text-[11px] font-semibold text-slate-700">
              <span className="h-2 w-2 rounded-full bg-[#15803D]" />
              <span className="font-bold text-slate-900">{currentProject.village}</span>
              <span className="text-slate-400">&bull;</span>
              <span className="font-mono text-slate-600">{currentProject.sajraSheetNumber}</span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-red-700 font-bold">{spatialSummary ? `${spatialSummary.affectedParcelsCount} Affected` : `${affectedCount} Affected`}</span>
              <span className="text-slate-400">&bull;</span>
              <span className="font-mono text-[#EA580C]">{corridorWidth}m RoW</span>
              {alignmentShift !== 0 && (
                <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 rounded">
                  +25m Shift
                </span>
              )}
            </div>

            {/* Spatial Analysis In-Progress HUD */}
            {spatialAnalysisRunning && (
              <div className="bg-slate-900/95 text-white backdrop-blur-md border border-slate-700 rounded-2xl px-3.5 py-2.5 shadow-xl pointer-events-auto flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
                <RefreshCw className="h-4 w-4 text-[#4ADE80] animate-spin shrink-0" />
                <div>
                  <div className="font-bold text-slate-100 flex items-center gap-1.5">
                    <span>Spatial Geometric Intersection Engine</span>
                    <span className="text-[10px] text-[#4ADE80] font-mono font-bold bg-[#15803D]/60 px-1.5 py-0.5 rounded">SCANNING</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono mt-0.5">{spatialAnalysisProgress}</div>
                </div>
              </div>
            )}

            {/* Spatial Analysis Complete Notice */}
            {analysisCompletedNotice && spatialSummary && (
              <div className="bg-white/95 text-slate-900 backdrop-blur-md border border-[#15803D]/40 rounded-2xl p-3 shadow-xl pointer-events-auto text-xs font-semibold animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#15803D] font-bold text-xs">
                    <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
                    <span>Spatial Intersection Complete</span>
                  </div>
                  <button
                    onClick={() => setSpatialReportModalOpen(true)}
                    className="text-[11px] font-bold text-[#0284C7] hover:underline cursor-pointer"
                  >
                    View Dossier &rarr;
                  </button>
                </div>
                <div className="text-[11px] text-slate-600 font-mono mt-1 flex flex-wrap items-center gap-2">
                  <span><strong>{spatialSummary.affectedParcelsCount}</strong> of {spatialSummary.totalParcelsCount} Parcels Affected</span>
                  <span>&bull;</span>
                  <span><strong>{spatialSummary.affectedLandHa}</strong> Ha Acquired</span>
                  <span>&bull;</span>
                  <span>₹<strong>{spatialSummary.totalEstimatedCompensationLakhs}</strong> L Est. Award</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ───── BOTTOM-LEFT TELEMETRY BADGE ───── */}
        {!zenMode && (
          <div className="absolute bottom-3 left-3 z-10 bg-white/85 backdrop-blur-md border border-[#E5E0D6] rounded-lg px-2 py-0.5 shadow-xs text-[10px] font-mono text-slate-500 flex items-center gap-2 pointer-events-none">
            <span>{cursorPos.lat.toFixed(5)}°N, {cursorPos.lng.toFixed(5)}°E</span>
            <span className="text-slate-300">|</span>
            <span className="text-[#15803D] font-bold">{currentProject.scaleRatio}</span>
          </div>
        )}

        {/* ───── NON-INTRUSIVE BOTTOM SUMMARY CARD (WHEN PARCEL CLICKED) ───── */}
        {selectedParcel && !inspectorOpen && !zenMode && (() => {
          const sRes = spatialResultsMap.get(selectedParcel.khasraNumber);
          const isAff = sRes ? sRes.isAffected : selectedParcel.isAffected;
          const affArea = sRes ? sRes.affectedAreaHa : selectedParcel.affectedAreaHa;
          const affPct = sRes ? sRes.affectedPercentage : selectedParcel.affectedAreaPercentage;
          const rorStat = sRes ? sRes.rorStatus : (selectedParcel.rorVerification?.status || "Verified");
          const acqStat = sRes ? sRes.acquisitionStatus : selectedParcel.status;

          return (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-3xl px-4 pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-150">
              <div className="bg-white/95 backdrop-blur-md border border-[#E5E0D6] rounded-2xl p-3.5 shadow-xl pointer-events-auto flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`font-mono text-xs font-extrabold px-2.5 py-1.5 rounded-xl text-white shrink-0 shadow-xs flex flex-col items-center justify-center leading-tight ${isAff ? "bg-[#D97706]" : "bg-slate-700"}`}>
                    <span>KHASRA</span>
                    <span className="text-sm font-black">{selectedParcel.khasraNumber}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 truncate">
                      <span>Survey No: {selectedParcel.surveyNumber}</span>
                      <span className="text-slate-300 font-normal">|</span>
                      <span>{selectedParcel.village}, Tehsil {selectedParcel.tehsil} ({selectedParcel.district})</span>
                      <span className="text-slate-300 font-normal">|</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isAff ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-slate-100 text-slate-700"}`}>
                        {isAff ? `Affected: ${affArea} Ha (${affPct}%)` : "Unaffected (0 Ha)"}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium truncate flex items-center gap-2 mt-1">
                      <span>Total Area: <strong className="text-slate-800 font-mono">{selectedParcel.gisCalculatedAreaHa} Ha</strong></span>
                      <span>&bull;</span>
                      <span>RoR: <strong className={rorStat === "Verified" ? "text-[#15803D]" : "text-amber-700"}>{rorStat}</strong></span>
                      <span>&bull;</span>
                      <span>Status: <strong className="text-slate-800">{acqStat}</strong></span>
                      <span>&bull;</span>
                      <span className="text-slate-400 font-mono text-[10px]">{selectedParcel.ulpin}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => setInspectorOpen(true)}
                    className="h-8 px-3 text-xs font-bold bg-[#15803D] hover:bg-[#166534] text-white rounded-xl shadow-xs cursor-pointer"
                  >
                    <span>Full Dossier</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                  <button
                    onClick={() => setSelectedParcel(null)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-[#F2EFE8] transition-colors cursor-pointer"
                    title="Close card"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ───── EXPANDED RIGHT SLIDE-OUT: 4-Section Cadastral Dossier (ONLY ON USER REQUEST) ───── */}
        {inspectorOpen && selectedParcel && (() => {
          const enriched = getParcel12StageInfo(selectedParcel);

          return (
            <div className="absolute top-3 right-3 bottom-3 z-20 w-[390px] max-w-[calc(100vw-24px)] bg-white/95 backdrop-blur-md border border-[#E5E0D6] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-200">
              {/* Dossier Header */}
              <div className="p-3.5 border-b border-[#E5E0D6] bg-gradient-to-r from-[#FAF8F5] to-white flex items-center justify-between shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-lg bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]">
                      KHASRA NO. {selectedParcel.khasraNumber}
                    </span>
                    {selectedParcel.isAffected ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                        {selectedParcel.acquisitionType.toUpperCase()}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        UNAFFECTED
                      </span>
                    )}
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                      Stage {enriched.stageIndex}/12
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    {selectedParcel.surveyNumber} &bull; {selectedParcel.village}
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setInspectorOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-[#F2EFE8] transition-colors cursor-pointer"
                    title="Collapse to bottom bar"
                  >
                    <Minimize2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setInspectorOpen(false);
                      setSelectedParcel(null);
                    }}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-[#F2EFE8] transition-colors cursor-pointer"
                    title="Close dossier"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* 12-Stage Visual Stepper Strip */}
              <div className="px-3.5 py-2 bg-[#FAF8F5] border-b border-[#E5E0D6] shrink-0">
                <div className="flex items-center justify-between mb-1 text-[10px]">
                  <span className="font-bold text-slate-500 uppercase tracking-wider">Statutory Milestone</span>
                  <span className="font-bold text-[#15803D]">{enriched.stageTitle}</span>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
                  {LAMS_12_STAGES.map((s) => {
                    const isDone = s.stageNumber <= (enriched.stageIndex ?? 3);
                    const isCurrent = s.stageNumber === (enriched.stageIndex ?? 3);

                    return (
                      <div
                        key={s.stageNumber}
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold shrink-0 transition-all ${
                          isCurrent
                            ? "bg-[#15803D] text-white shadow-xs"
                            : isDone
                            ? "bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]"
                            : "bg-white text-slate-400 border border-[#E5E0D6]"
                        }`}
                        title={`${s.title}: ${s.description}`}
                      >
                        <span>{s.stageNumber}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4-Section Tab Selector Bar */}
              <div className="grid grid-cols-4 border-b border-[#E5E0D6] bg-white text-[11px] font-bold shrink-0">
                <button
                  onClick={() => setDossierTab("details")}
                  className={`py-2 text-center transition-all cursor-pointer border-b-2 ${
                    dossierTab === "details"
                      ? "border-[#15803D] text-[#15803D] bg-[#F0FDF4]/50"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  📄 Details
                </button>
                <button
                  onClick={() => setDossierTab("ror")}
                  className={`py-2 text-center transition-all cursor-pointer border-b-2 ${
                    dossierTab === "ror"
                      ? "border-[#15803D] text-[#15803D] bg-[#F0FDF4]/50"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  👥 RoR Title
                </button>
                <button
                  onClick={() => setDossierTab("acquisition")}
                  className={`py-2 text-center transition-all cursor-pointer border-b-2 ${
                    dossierTab === "acquisition"
                      ? "border-[#15803D] text-[#15803D] bg-[#F0FDF4]/50"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  💰 Valuation
                </button>
                <button
                  onClick={() => setDossierTab("possession")}
                  className={`py-2 text-center transition-all cursor-pointer border-b-2 ${
                    dossierTab === "possession"
                      ? "border-[#15803D] text-[#15803D] bg-[#F0FDF4]/50"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  🏛️ R&R
                </button>
              </div>

              {/* Dossier Content Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                {/* ───── TAB 1: PARCEL DETAILS ───── */}
                {dossierTab === "details" && (
                  <div className="space-y-3">
                    {/* Geometric Intersection Alert Badge */}
                    <div className={`p-3 rounded-2xl border ${spatialResultsMap.get(selectedParcel.khasraNumber)?.isAffected ? "bg-amber-50/80 border-amber-300 text-amber-950" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span>Spatial Corridor Intersection:</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${spatialResultsMap.get(selectedParcel.khasraNumber)?.isAffected ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-700"}`}>
                          {spatialResultsMap.get(selectedParcel.khasraNumber)?.isAffected ? "AFFECTED BY ALIGNMENT" : "UNAFFECTED BUFFER"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Calculated via 60m buffer centerline polygon intersection geometry.
                      </p>
                    </div>

                    {/* 10 Core Spatial Parcel Fields Grid */}
                    <div className="bg-white rounded-2xl border border-[#E5E0D6] p-3 space-y-2 text-xs">
                      <div className="font-extrabold text-[11px] text-slate-400 uppercase tracking-wider">
                        Statutory Parcel Identifiers
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Parcel ID</span>
                          <span className="font-mono font-bold text-slate-900">{selectedParcel.id}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Survey Number</span>
                          <span className="font-mono font-bold text-slate-900">{selectedParcel.surveyNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Village</span>
                          <span className="font-bold text-slate-800">{selectedParcel.village}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Tehsil</span>
                          <span className="font-bold text-slate-800">{selectedParcel.tehsil}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">District</span>
                          <span className="font-bold text-slate-800">{selectedParcel.district} ({selectedParcel.state})</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">ULPIN (Bhu-Aadhaar)</span>
                          <span className="font-mono font-bold text-slate-800 text-[10px]">{selectedParcel.ulpin}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#F2EFE8] grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Total Area</span>
                          <span className="font-mono font-extrabold text-slate-900 text-sm">
                            {selectedParcel.gisCalculatedAreaHa} Ha
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono block">
                            {selectedParcel.areaSqMeters.toLocaleString()} m²
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Affected Area</span>
                          <span className={`font-mono font-extrabold text-sm block ${spatialResultsMap.get(selectedParcel.khasraNumber)?.isAffected ? "text-amber-700" : "text-slate-700"}`}>
                            {spatialResultsMap.get(selectedParcel.khasraNumber)?.affectedAreaHa ?? selectedParcel.affectedAreaHa} Ha
                          </span>
                          <span className="text-[10px] font-bold text-slate-600 block">
                            {spatialResultsMap.get(selectedParcel.khasraNumber)?.affectedPercentage ?? selectedParcel.affectedAreaPercentage}% of parcel
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">RoR Status</span>
                          <span className={`font-bold ${(spatialResultsMap.get(selectedParcel.khasraNumber)?.rorStatus ?? selectedParcel.rorVerification?.status) === "Verified" ? "text-[#15803D]" : "text-amber-700"}`}>
                            {spatialResultsMap.get(selectedParcel.khasraNumber)?.rorStatus ?? (selectedParcel.rorVerification?.status || "Verified")}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Acquisition Status</span>
                          <span className="font-bold text-slate-800 capitalize">
                            {(spatialResultsMap.get(selectedParcel.khasraNumber)?.acquisitionStatus ?? selectedParcel.status).replace(/_/g, " ")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Residual Area & Severance */}
                    {selectedParcel.isAffected && selectedParcel.acquisitionType === "partial" && (
                      <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                        <div className="flex items-center justify-between font-bold text-[11px]">
                          <span>Residual Farm Area Remaining:</span>
                          <span className="font-mono">{selectedParcel.residualAreaHa} Ha</span>
                        </div>
                        {selectedParcel.severanceClaimEligible && (
                          <p className="text-[10px] text-amber-900 leading-tight">
                            ⚠️ <strong>RFCTLARR Sec 27 Severance:</strong> Residual plot &lt; 0.2 Ha. Compulsory acquisition claim eligible.
                          </p>
                        )}
                      </div>
                    )}

                    {/* Dimensions & Chauhaddi */}
                    <div className="p-3 rounded-2xl bg-white border border-[#E5E0D6] space-y-2 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Plot Dimensions:</span>
                        <span className="font-mono font-bold text-slate-800">{selectedParcel.dimensions}</span>
                      </div>
                      <div className="pt-2 border-t border-[#F2EFE8] space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Chauhaddi (Boundaries)</span>
                        <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-600">
                          <div><strong>North:</strong> {selectedParcel.chauhaddi.north}</div>
                          <div><strong>South:</strong> {selectedParcel.chauhaddi.south}</div>
                          <div><strong>East:</strong> {selectedParcel.chauhaddi.east}</div>
                          <div><strong>West:</strong> {selectedParcel.chauhaddi.west}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ───── TAB 2: OWNERSHIP & ROR ───── */}
                {dossierTab === "ror" && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-[#DCFCE7]/60 border border-[#BBF7D0] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
                        <div>
                          <span className="font-bold text-[#15803D] block text-xs">Bhulekh RoR Computerised</span>
                          <span className="text-[10px] text-slate-600">
                            Khatauni: {enriched.rorVerification?.khatauniNo || "Verified"}
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-[#15803D] text-white text-[10px]">
                        {enriched.rorVerification?.status || "Verified"}
                      </Badge>
                    </div>

                    {/* Landowners List */}
                    <div className="rounded-2xl border border-[#E5E0D6] overflow-hidden">
                      <div className="bg-[#FAF8F5] px-3 py-2 text-[10px] font-bold text-slate-700 flex items-center justify-between border-b border-[#E5E0D6]">
                        <span>Recorded Landowner</span>
                        <span>Share %</span>
                      </div>
                      <div className="divide-y divide-[#E5E0D6] bg-white">
                        {selectedParcel.owners.map((owner, idx) => (
                          <div key={idx} className="p-2.5 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-slate-900 block">{owner.name}</span>
                              <span className="text-[10px] text-slate-500 block">
                                S/o {owner.fatherOrHusbandName} &bull; {owner.casteCategory}
                              </span>
                            </div>
                            <span className="font-mono font-extrabold text-slate-800">{owner.sharePercentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Land Classification */}
                    <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D6] space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Revenue Classification:</span>
                        <span className="font-bold text-slate-800 capitalize">{selectedParcel.landClassification.replace(/_/g, " ")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Soil Quality:</span>
                        <span className="font-semibold text-slate-800">{selectedParcel.soilClass}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Encumbrance Status:</span>
                        <span className="font-bold text-[#15803D]">Clear Title (NOC Granted)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ───── TAB 3: ACQUISITION & VALUATION ───── */}
                {dossierTab === "acquisition" && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D6] flex items-center justify-between">
                      <span className="text-slate-500">Current Statutory Stage:</span>
                      <Badge className="bg-[#15803D] text-white text-[10px]">
                        {enriched.stageTitle}
                      </Badge>
                    </div>

                    {selectedParcel.isAffected ? (
                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]/40 border border-[#BBF7D0] space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803D] block">
                          Statutory Award Breakdown (RFCTLARR Sec 26-30)
                        </span>
                        <div className="space-y-1 text-[11px]">
                          <div className="flex justify-between text-slate-600">
                            <span>Base Market Rate:</span>
                            <span className="font-mono">₹{(selectedParcel.circleRatePerHa / 100000).toFixed(1)} L / Ha</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Base Value ({selectedParcel.affectedAreaHa} Ha):</span>
                            <span className="font-mono">₹{(selectedParcel.valuation.baseMarketValue / 100000).toFixed(2)} L</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Rural Multiplier ({selectedParcel.valuation.ruralMultiplier}x):</span>
                            <span className="font-mono">₹{(selectedParcel.valuation.multipliedValue / 100000).toFixed(2)} L</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>100% Solatium (Sec 30(1)):</span>
                            <span className="font-mono">₹{(selectedParcel.valuation.solatiumAmount / 100000).toFixed(2)} L</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Attached Assets:</span>
                            <span className="font-mono">₹{(selectedParcel.valuation.assetsValue / 100000).toFixed(2)} L</span>
                          </div>
                          <div className="pt-1.5 border-t border-[#BBF7D0] flex justify-between font-bold text-slate-900 text-xs">
                            <span>Total Compensation Award:</span>
                            <span className="font-mono text-[#15803D] text-sm">
                              ₹{(selectedParcel.valuation.totalCompensationPayable / 100000).toFixed(2)} Lakhs
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D6] text-center text-slate-500 text-xs">
                        This parcel is outside the alignment corridor. No acquisition compensation required.
                      </div>
                    )}

                    {selectedParcel.objections && selectedParcel.objections.length > 0 && (
                      <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-1 text-amber-950">
                        <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-900">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />
                          <span>Section 15 Objection Registered</span>
                        </div>
                        <p className="text-[10px] text-amber-900 leading-tight">
                          {selectedParcel.objections[0].details}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ───── TAB 4: POSSESSION & R&R ───── */}
                {dossierTab === "possession" && (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-white border border-[#E5E0D6] space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Physical Possession (Section 38)
                      </span>
                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Possession Status:</span>
                          <span className="font-bold text-slate-900">
                            {enriched.possessionDetails?.status || "Pending Payment"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Memo Reference:</span>
                          <span className="font-mono font-bold text-slate-800">
                            {enriched.possessionDetails?.memoNumber || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Possession Date:</span>
                          <span className="font-mono text-slate-800">
                            {enriched.possessionDetails?.possessionDate || "Scheduled"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#FAF8F5] to-white border border-[#E5E0D6] space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] block">
                        Rehabilitation & Resettlement (Schedule II)
                      </span>
                      <div className="space-y-1.5 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-slate-500">R&R Status:</span>
                          <Badge className="bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]">
                            {enriched.rrDetails?.status || "Assessment Stage"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Eligible Families:</span>
                          <span className="font-bold text-slate-900">{enriched.rrDetails?.eligibleFamiliesCount || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Relocation Status:</span>
                          <span className="font-bold text-[#15803D]">{enriched.rrDetails?.relocationStatus || "N/A"}</span>
                        </div>
                        {enriched.rrDetails && enriched.rrDetails.totalAssistanceLakhs > 0 && (
                          <div className="pt-1.5 border-t border-[#E5E0D6] flex justify-between font-bold text-slate-900">
                            <span>R&R Grant Disbursed:</span>
                            <span className="font-mono text-[#15803D]">₹{enriched.rrDetails.totalAssistanceLakhs} Lakhs</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="p-3 border-t border-[#E5E0D6] bg-white flex items-center justify-between gap-2 shrink-0">
                <Link href={`/projects/${currentProject.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 font-bold">
                    <span>Project Dossier</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Button
                  size="sm"
                  onClick={() => setApiDrawerOpen(true)}
                  className="text-xs bg-[#15803D] hover:bg-[#166534] text-white font-bold gap-1.5"
                >
                  <Code2 className="h-3.5 w-3.5" />
                  <span>Raw API</span>
                </Button>
              </div>
            </div>
          );
        })()}

        {/* ───── POPUP API INSPECTOR MODAL / DRAWER ───── */}
        {apiDrawerOpen && (
          <div className="absolute inset-x-3 bottom-3 top-16 z-30 bg-white/95 backdrop-blur-md border border-[#E5E0D6] rounded-3xl shadow-2xl flex flex-col overflow-hidden max-w-4xl mx-auto animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#E5E0D6] bg-[#FAF8F5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-[#7C3AED]" />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    BhuNaksha OGC WFS 2.0 & Bhulekh RoR Live Inspector
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Endpoint: GET /api/bhunaksha/wfs?project={currentProject.id}&khasra={selectedParcel?.khasraNumber || "101"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setApiDrawerOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-[#F2EFE8] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
              <div className="bg-[#0F172A] text-slate-200 p-3 rounded-2xl overflow-x-auto space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold block"># Live Curl Request</span>
                <code>
                  curl -X GET &quot;https://bhoomidrishti.gov.in/api/bhunaksha/wfs?village={currentProject.villageLgdCode}&khasra={selectedParcel?.khasraNumber || "101"}&quot; \<br />
                  &nbsp;&nbsp;-H &quot;Accept: application/geo+json&quot; \<br />
                  &nbsp;&nbsp;-H &quot;X-NIC-Auth-Token: STATE-REV-MH-2024-TOKEN&quot;
                </code>
              </div>

              <div className="bg-[#FAF8F5] border border-[#E5E0D6] p-3 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 pb-1 border-b border-[#E5E0D6]">
                  <span>Response: 200 OK &bull; Content-Type: application/geo+json</span>
                  <span className="text-[#15803D]">Verified with Bhulekh RoR</span>
                </div>
                <pre className="text-[11px] text-slate-800 overflow-x-auto p-2 bg-white rounded-xl border border-[#E5E0D6] max-h-72">
                  {JSON.stringify(activeGeoJsonPreview, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-3 border-t border-[#E5E0D6] bg-white flex justify-end">
              <Button
                size="sm"
                onClick={() => setApiDrawerOpen(false)}
                className="text-xs bg-slate-900 text-white font-bold"
              >
                Close Inspector
              </Button>
            </div>
          </div>
        )}

        {/* ───── COMPREHENSIVE SPATIAL ANALYSIS REPORT MODAL ───── */}
        {spatialReportModalOpen && spatialSummary && (
          <div className="absolute inset-x-3 bottom-3 top-12 z-40 bg-white/98 backdrop-blur-lg border border-[#E5E0D6] rounded-3xl shadow-2xl flex flex-col overflow-hidden max-w-5xl mx-auto animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#E5E0D6] bg-[#FAF8F5] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-800">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <span>Spatial Intersection & Cadastral Impact Report</span>
                    <Badge className="bg-[#15803D] text-white text-[10px]">
                      {corridorWidth}m RoW Corridor
                    </Badge>
                    {alignmentShift !== 0 && (
                      <Badge className="bg-purple-600 text-white text-[10px]">
                        +25m Shifted Route
                      </Badge>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {currentProject.name} &bull; {currentProject.district} ({currentProject.state})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownloadSpatialGeoJSON}
                  className="h-8 text-xs font-bold gap-1 border-slate-300 cursor-pointer"
                  title="Download GeoJSON FeatureCollection"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>GeoJSON</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownloadSpatialCSV}
                  className="h-8 text-xs font-bold gap-1 border-slate-300 cursor-pointer"
                  title="Download CSV Register"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>CSV</span>
                </Button>
                <button
                  onClick={() => setSpatialReportModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-[#F2EFE8] transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* KPI Metric Cards Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-4 bg-white border-b border-[#E5E0D6]">
              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#E5E0D6]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Parcels</span>
                <span className="text-xl font-extrabold font-mono text-slate-900 block mt-0.5">
                  {spatialSummary.totalParcelsCount}
                </span>
                <span className="text-[10px] text-slate-500">Cadastral Sajra</span>
              </div>

              <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-200">
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Affected Parcels</span>
                <span className="text-xl font-extrabold font-mono text-amber-900 block mt-0.5">
                  {spatialSummary.affectedParcelsCount}
                </span>
                <span className="text-[10px] text-amber-800">
                  {((spatialSummary.affectedParcelsCount / spatialSummary.totalParcelsCount) * 100).toFixed(0)}% of sheet
                </span>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-[#E5E0D6]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Full / Partial</span>
                <span className="text-xl font-extrabold font-mono text-slate-900 block mt-0.5">
                  {spatialSummary.fullAcquisitionsCount} / {spatialSummary.partialAcquisitionsCount}
                </span>
                <span className="text-[10px] text-slate-500">Acquisition Type</span>
              </div>

              <div className="bg-red-50/80 p-3 rounded-2xl border border-red-200">
                <span className="text-[10px] uppercase font-bold text-red-700 block">Sec 27 Severance</span>
                <span className="text-xl font-extrabold font-mono text-red-900 block mt-0.5">
                  {spatialSummary.severanceParcelsCount}
                </span>
                <span className="text-[10px] text-red-700">Residual &lt; 0.25 Ha</span>
              </div>

              <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Acquired Land</span>
                <span className="text-xl font-extrabold font-mono text-emerald-900 block mt-0.5">
                  {spatialSummary.affectedLandHa} <span className="text-xs font-normal">Ha</span>
                </span>
                <span className="text-[10px] text-emerald-800">of {spatialSummary.totalLandRequirementHa} Ha</span>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-[#E5E0D6]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Award Budget</span>
                <span className="text-xl font-extrabold font-mono text-[#15803D] block mt-0.5">
                  ₹{spatialSummary.totalEstimatedCompensationLakhs} <span className="text-xs font-normal">L</span>
                </span>
                <span className="text-[10px] text-slate-500">RFCTLARR Award</span>
              </div>
            </div>

            {/* Scrollable Parcel Breakdown Table */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Plot-by-Plot Cadastral Spatial Intersect Register:</span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Analysis Timestamp: {new Date(spatialSummary.analysisTimestamp).toLocaleTimeString()}
                </span>
              </div>

              <div className="border border-[#E5E0D6] rounded-2xl overflow-hidden bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF8F5] border-b border-[#E5E0D6] text-[10px] uppercase font-extrabold text-slate-500">
                      <th className="py-2.5 px-3">Khasra</th>
                      <th className="py-2.5 px-3">Village</th>
                      <th className="py-2.5 px-3">Total Ha</th>
                      <th className="py-2.5 px-3">Overlap %</th>
                      <th className="py-2.5 px-3">Acquired Ha</th>
                      <th className="py-2.5 px-3">Residual Ha</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">RoR Title</th>
                      <th className="py-2.5 px-3 text-right">Est. Award (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E0D6] font-mono text-[11px]">
                    {authorizedParcels.map((p) => {
                      const s = spatialResultsMap.get(p.khasraNumber);
                      const isAff = s?.isAffected ?? p.isAffected;
                      const isSev = s?.severanceClaimEligible;

                      return (
                        <tr
                          key={p.id}
                          className={`hover:bg-[#FAF8F5] transition-colors cursor-pointer ${
                            selectedParcel?.id === p.id ? "bg-sky-50/70" : ""
                          }`}
                          onClick={() => {
                            setSelectedParcel(p);
                            setSpatialReportModalOpen(false);
                            setInspectorOpen(true);
                          }}
                        >
                          <td className="py-2 px-3 font-bold text-slate-900">
                            {p.khasraNumber}
                          </td>
                          <td className="py-2 px-3 font-sans text-slate-700">
                            {p.village}
                          </td>
                          <td className="py-2 px-3 text-slate-800">
                            {p.gisCalculatedAreaHa}
                          </td>
                          <td className="py-2 px-3">
                            <span className={`font-bold ${isAff ? "text-amber-700" : "text-slate-400"}`}>
                              {s?.affectedPercentage ?? 0}%
                            </span>
                          </td>
                          <td className="py-2 px-3 font-bold text-slate-900">
                            {s?.affectedAreaHa ?? 0}
                          </td>
                          <td className="py-2 px-3 text-slate-600">
                            {s?.residualAreaHa ?? p.gisCalculatedAreaHa}
                          </td>
                          <td className="py-2 px-3 font-sans">
                            {isAff ? (
                              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                isSev
                                  ? "bg-red-100 text-red-800"
                                  : s?.acquisitionType === "full"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}>
                                {isSev ? "SEVERANCE" : s?.acquisitionType?.toUpperCase()}
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                                BUFFER
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 font-sans">
                            <span className={`text-[10px] font-bold ${
                              (s?.rorStatus ?? "Verified") === "Verified" ? "text-[#15803D]" : "text-amber-700"
                            }`}>
                              {s?.rorStatus ?? "Verified"}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-[#15803D]">
                            {isAff ? `₹${((s?.estimatedCompensationINR ?? 0) / 100000).toFixed(2)} L` : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-[#E5E0D6] bg-[#FAF8F5] flex items-center justify-between">
              <div className="text-[11px] text-slate-500 font-medium">
                Click any row in the table to fly to and inspect the parcel directly on the cadastral map.
              </div>
              <Button
                size="sm"
                onClick={() => setSpatialReportModalOpen(false)}
                className="text-xs bg-slate-900 text-white font-bold rounded-xl"
              >
                Close Report
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Architecture Evaluation Modal */}
      <BhuNakshaArchitectureModal
        open={architectureModalOpen}
        onOpenChange={setArchitectureModalOpen}
      />
    </div>
  );
}
