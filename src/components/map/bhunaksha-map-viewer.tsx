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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BhuNakshaArchitectureModal } from "@/components/docs/bhunaksha-architecture-modal";

// Centroid Plot Badge DivIcon for Khasra numbers
function createKhasraBadgeIcon(
  khasraNumber: string,
  isSelected: boolean,
  isAffected: boolean,
  status: string,
  stageIndex: number = 3
) {
  let borderColor = "#16A34A";
  let bgGradient = "background: #F0FDF4; color: #166534;";

  if (stageIndex >= 10) {
    borderColor = "#7C3AED";
    bgGradient = "background: #FAF5FF; color: #6B21A8;";
  } else if (stageIndex === 3 || (stageIndex >= 7 && stageIndex <= 9)) {
    borderColor = "#DC2626";
    bgGradient = "background: #FEF2F2; color: #991B1B;";
  } else if (stageIndex >= 4 && stageIndex <= 6) {
    borderColor = "#D97706";
    bgGradient = "background: #FFFBEB; color: #92400E;";
  }

  const selectedRing = isSelected
    ? "box-shadow: 0 0 0 3px #0F172A, 0 4px 12px rgba(0,0,0,0.3); font-weight: 800; transform: scale(1.15) translate(-50%, -50%);"
    : "box-shadow: 0 2px 6px rgba(0,0,0,0.15); transform: translate(-50%, -50%);";

  return L.divIcon({
    className: "custom-khasra-badge",
    html: `
      <div style="
        ${bgGradient}
        border: 2px solid ${borderColor};
        ${selectedRing}
        font-family: ui-monospace, SFMono-Regular, monospace;
        font-size: 11px;
        line-height: 1;
        padding: 3px 7px;
        border-radius: 6px;
        white-space: nowrap;
        text-align: center;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        pointer-events: auto;
        transition: all 0.2s ease;
      ">
        <span style="width: 6px; height: 6px; border-radius: 50%; background: ${borderColor}; display: inline-block;"></span>
        <span>KH-${khasraNumber}</span>
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
    map.flyTo(center, zoom, { duration: 1.0 });
  }, [center, zoom, map]);
  return null;
}

// Telemetry tracker
function MapTelemetryTracker({
  onMouseMove,
}: {
  onMouseMove: (latlng: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    mousemove(e) {
      onMouseMove({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

interface BhuNakshaMapViewerProps {
  initialProjectId?: string;
  initialKhasraNumber?: string;
  initialStageFilter?: number;
}

export function BhuNakshaMapViewer({
  initialProjectId = "PRJ-001",
  initialKhasraNumber,
  initialStageFilter,
}: BhuNakshaMapViewerProps = {}) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId);
  const currentProject = useMemo(() => {
    return (
      BHUNAKSHA_PROJECTS.find((p) => p.id === selectedProjectId) ||
      BHUNAKSHA_PROJECTS[0]
    );
  }, [selectedProjectId]);

  const [selectedParcel, setSelectedParcel] = useState<BhuNakshaParcel>(() => {
    if (initialKhasraNumber) {
      const match = currentProject.parcels.find(
        (p) => p.khasraNumber === initialKhasraNumber
      );
      if (match) return match;
    }
    if (initialStageFilter) {
      const match = currentProject.parcels.find((p) => {
        const enriched = getParcel12StageInfo(p);
        return enriched.stageIndex === initialStageFilter;
      });
      if (match) return match;
    }
    return currentProject.parcels[0];
  });

  // Sync selected parcel when project or initial props change
  useEffect(() => {
    if (initialKhasraNumber) {
      const match = currentProject.parcels.find(
        (p) => p.khasraNumber === initialKhasraNumber
      );
      if (match) {
        setSelectedParcel(match);
        return;
      }
    }
    if (initialStageFilter) {
      const match = currentProject.parcels.find((p) => {
        const enriched = getParcel12StageInfo(p);
        return enriched.stageIndex === initialStageFilter;
      });
      if (match) {
        setSelectedParcel(match);
        return;
      }
    }
    setSelectedParcel(currentProject.parcels[0]);
  }, [currentProject, initialKhasraNumber, initialStageFilter]);

  // Display Mode: "cadastralSheet" (authentic Sajra) | "hybrid" (satellite + vectors) | "osm" (street map)
  const [mapMode, setMapMode] = useState<"cadastralSheet" | "hybrid" | "osm">("cadastralSheet");

  // Layers & Overlay Toggles
  const [showCorridor, setShowCorridor] = useState<boolean>(true);
  const [showKhasraLabels, setShowKhasraLabels] = useState<boolean>(true);
  const [filterImpact, setFilterImpact] = useState<"all" | "affected" | "unaffected">("all");

  // UI Panels
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(true);
  const [isHudCollapsed, setIsHudCollapsed] = useState<boolean>(false);
  const [dossierTab, setDossierTab] = useState<"details" | "ror" | "acquisition" | "possession">("details");
  const [apiDrawerOpen, setApiDrawerOpen] = useState<boolean>(false);
  const [architectureModalOpen, setArchitectureModalOpen] = useState<boolean>(false);
  const [copiedULPIN, setCopiedULPIN] = useState<boolean>(false);

  // Live Telemetry
  const [cursorPos, setCursorPos] = useState<{ lat: number; lng: number }>({
    lat: currentProject.parcels[0].coordinates[0],
    lng: currentProject.parcels[0].coordinates[1],
  });

  // Dynamic Camera coordinates based on project
  const cameraConfig = useMemo(() => {
    if (selectedProjectId === "PRJ-001") {
      return { center: [19.856, 73.998] as [number, number], zoom: 16 };
    }
    return { center: [24.518, 81.344] as [number, number], zoom: 15 };
  }, [selectedProjectId]);

  // Filtered parcels
  const visibleParcels = useMemo(() => {
    return currentProject.parcels.filter((p) => {
      if (filterImpact === "affected") return p.isAffected;
      if (filterImpact === "unaffected") return !p.isAffected;
      return true;
    });
  }, [currentProject, filterImpact]);

  // Copy ULPIN helper
  const handleCopyULPIN = (ulpin: string) => {
    navigator.clipboard.writeText(ulpin);
    setCopiedULPIN(true);
    setTimeout(() => setCopiedULPIN(false), 2000);
  };

  // Polygon Styles for BhuNaksha Cadastral parcels with 12-stage status colors
  const getParcelPolygonStyle = (parcel: BhuNakshaParcel) => {
    const isSelected = selectedParcel?.id === parcel.id;
    const enriched = getParcel12StageInfo(parcel);
    const stageColor = getParcelStageVisualColor(enriched);

    // Sajra / Cadastral Sheet mode colors
    if (mapMode === "cadastralSheet") {
      return {
        color: isSelected ? "#0F172A" : stageColor.borderColor,
        weight: isSelected ? 3.5 : 2,
        fillColor: stageColor.borderColor,
        fillOpacity: isSelected ? 0.65 : enriched.isAffected ? 0.35 : 0.15,
        dashArray: enriched.acquisitionType === "partial" ? "6, 4" : undefined,
      };
    }

    // Hybrid / Satellite mode colors
    if (mapMode === "hybrid") {
      return {
        color: isSelected ? "#FFFFFF" : stageColor.borderColor,
        weight: isSelected ? 3.5 : 2,
        fillColor: stageColor.borderColor,
        fillOpacity: isSelected ? 0.6 : 0.35,
        dashArray: enriched.acquisitionType === "partial" ? "6, 4" : undefined,
      };
    }

    // Standard OSM mode
    return {
      color: isSelected ? "#0F172A" : stageColor.borderColor,
      weight: isSelected ? 3.5 : 2,
      fillColor: stageColor.borderColor,
      fillOpacity: isSelected ? 0.6 : 0.35,
    };
  };

  // GeoJSON preview for API Inspector
  const activeGeoJsonPreview = useMemo(() => {
    return {
      type: "Feature",
      id: selectedParcel.ulpin,
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            ...selectedParcel.polygon.map(([lat, lng]) => [lng, lat]),
            [selectedParcel.polygon[0][1], selectedParcel.polygon[0][0]],
          ],
        ],
      },
      properties: {
        khasraNumber: selectedParcel.khasraNumber,
        ulpin: selectedParcel.ulpin,
        villageLgdCode: selectedParcel.villageLgdCode,
        sheetNumber: selectedParcel.sheetNumber,
        gisAreaHa: selectedParcel.gisCalculatedAreaHa,
        recordedRoRAreaHa: selectedParcel.recordedRoRAreaHa,
        isAffected: selectedParcel.isAffected,
        affectedAreaHa: selectedParcel.affectedAreaHa,
        acquisitionType: selectedParcel.acquisitionType,
        owners: selectedParcel.owners.map((o) => ({
          name: o.name,
          share: `${o.sharePercentage}%`,
        })),
        circleRateINR: selectedParcel.circleRatePerHa,
        totalCompensationPayableINR: selectedParcel.valuation.totalCompensationPayable,
      },
    };
  }, [selectedParcel]);

  return (
    <div className="relative w-full h-[calc(100vh-115px)] min-h-[580px] flex-1 flex flex-col bg-[#FAF8F5] overflow-hidden rounded-3xl border border-[#E5E0D6] shadow-sm">
      {/* ───── TOP CONTROLS BAR: Project Switcher & View Tools ───── */}
      <div className="z-10 bg-white/95 backdrop-blur-md border-b border-[#E5E0D6] px-4 py-2.5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 max-w-full">
          {/* Left: Project Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap hidden sm:inline">
              Cadastral Sheet:
            </span>
            {BHUNAKSHA_PROJECTS.map((proj) => {
              const isSelected = proj.id === selectedProjectId;
              return (
                <button
                  key={proj.id}
                  onClick={() => setSelectedProjectId(proj.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-[#15803D] text-white shadow-xs"
                      : "bg-[#FAF8F5] text-slate-700 hover:bg-[#F2EFE8] border border-[#E5E0D6]"
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{proj.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      isSelected ? "bg-white/20 text-white" : "bg-white text-slate-600 border border-[#E5E0D6]"
                    }`}
                  >
                    {proj.parcels.length} Khasras
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Map Modes, Corridor Toggle & API Inspector Button */}
          <div className="flex items-center gap-2 self-end lg:self-auto overflow-x-auto">
            {/* Map Mode Selector */}
            <div className="flex items-center bg-[#FAF8F5] p-1 rounded-xl border border-[#E5E0D6]">
              <button
                onClick={() => setMapMode("cadastralSheet")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mapMode === "hybrid"
                    ? "bg-white text-[#0284C7] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Satellite Imagery with BhuNaksha Cadastral Vectors"
              >
                🛰️ Satellite Hybrid
              </button>
              <button
                onClick={() => setMapMode("osm")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mapMode === "osm"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🗺️ Standard
              </button>
            </div>

            {/* Corridor Overlay Toggle */}
            <button
              onClick={() => setShowCorridor(!showCorridor)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                showCorridor
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-white text-slate-600 border-[#E5E0D6]"
              }`}
              title="Toggle Project Alignment Right-of-Way Corridor"
            >
              <span className={`h-2 w-2 rounded-full ${showCorridor ? "bg-red-600 animate-pulse" : "bg-slate-300"}`} />
              <span>Corridor Alignment</span>
            </button>

            {/* BhuNaksha API Inspector Button */}
            <button
              onClick={() => setApiDrawerOpen(!apiDrawerOpen)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>API Inspector</span>
            </button>

            {/* Architecture Dossier Modal Button */}
            <button
              onClick={() => setArchitectureModalOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Info className="h-3.5 w-3.5" />
              <span>Evaluation Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* ───── MAIN INTERACTIVE MAP & FLOATING HUD ───── */}
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
          <MapTelemetryTracker onMouseMove={setCursorPos} />

          {/* Map Base Tile Layers */}
          {mapMode === "cadastralSheet" && (
            // Clean parchment background overlay simulating traditional Sajra revenue sheet
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
              opacity={0.35}
            />
          )}

          {mapMode === "hybrid" && (
            // High-Resolution Satellite Tile Layer
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

          {/* Project Alignment Corridor Overlay (Line & Right-of-Way Buffer) */}
          {showCorridor && currentProject.corridorCenterline && (
            <>
              {/* Corridor Right of Way (Outer Buffer Band) */}
              <Polyline
                positions={currentProject.corridorCenterline}
                pathOptions={{
                  color: "#DC2626",
                  weight: 28,
                  opacity: 0.18,
                }}
              />
              {/* Corridor Centerline */}
              <Polyline
                positions={currentProject.corridorCenterline}
                pathOptions={{
                  color: "#B91C1C",
                  weight: 3,
                  dashArray: "8, 6",
                }}
              />
            </>
          )}

          {/* Zonal Project Boundary Polygon (e.g. Solar Park) */}
          {showCorridor && currentProject.boundaryPolygon && (
            <Polygon
              positions={currentProject.boundaryPolygon}
              pathOptions={{
                color: "#7C3AED",
                weight: 2.5,
                dashArray: "6, 6",
                fillColor: "#A855F7",
                fillOpacity: 0.12,
              }}
            />
          )}

          {/* BhuNaksha Cadastral Khasra Vector Polygons */}
          {visibleParcels.map((parcel) => {
            const isSelected = selectedParcel?.id === parcel.id;
            const enriched = getParcel12StageInfo(parcel);
            const style = getParcelPolygonStyle(parcel);

            return (
              <React.Fragment key={parcel.id}>
                <Polygon
                  positions={parcel.polygon}
                  pathOptions={style}
                  eventHandlers={{
                    click: () => {
                      setSelectedParcel(parcel);
                      if (!inspectorOpen) setInspectorOpen(true);
                    },
                  }}
                >
                  <Tooltip sticky direction="top" opacity={0.95}>
                    <div className="font-sans text-xs p-1 space-y-0.5">
                      <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Khasra {parcel.khasraNumber}</span>
                        {parcel.isAffected ? (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-100 text-red-800 font-sans font-bold">
                            {enriched.stageTitle}
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-sans font-bold">
                            Unaffected
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Area: {parcel.gisCalculatedAreaHa} Ha | Owner: {parcel.owners[0]?.name}
                      </div>
                      <div className="text-[10px] text-[#15803D] font-semibold">
                        ULPIN: {parcel.ulpin}
                      </div>
                    </div>
                  </Tooltip>
                </Polygon>

                {/* Centroid Plot Number Label Badge */}
                {showKhasraLabels && (
                  <Marker
                    position={parcel.coordinates}
                    icon={createKhasraBadgeIcon(
                      parcel.khasraNumber,
                      isSelected,
                      parcel.isAffected,
                      parcel.status,
                      enriched.stageIndex
                    )}
                    eventHandlers={{
                      click: () => {
                        setSelectedParcel(parcel);
                        if (!inspectorOpen) setInspectorOpen(true);
                      },
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </MapContainer>

        {/* ───── HUD STRIP: Village Sajra Sheet Metadata & Filter ───── */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 max-w-xs sm:max-w-sm pointer-events-none">
          {isHudCollapsed ? (
            <div className="bg-white/95 backdrop-blur-md border border-[#E5E0D6] rounded-2xl px-3 py-1.5 shadow-md pointer-events-auto flex items-center gap-2 text-xs font-bold text-slate-800 animate-in fade-in duration-150">
              <span className="text-[10px] uppercase font-mono font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-md border border-[#BBF7D0]">
                NIC BhuNaksha
              </span>
              <span>{currentProject.village} Cadastre</span>
              <span className="text-slate-300">•</span>
              <span className="text-red-700">{currentProject.totalAffectedParcels}/{currentProject.parcels.length}</span>
              <button
                onClick={() => setIsHudCollapsed(false)}
                className="p-1 rounded-lg hover:bg-[#F2EFE8] text-slate-500 hover:text-slate-900 cursor-pointer transition-colors"
                title="Expand Village Cadastre HUD"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="bg-white/95 backdrop-blur-md border border-[#E5E0D6] rounded-2xl p-3 shadow-md pointer-events-auto space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-mono font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-md border border-[#BBF7D0]">
                    NIC BhuNaksha GIS
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 font-semibold">
                    LGD: {currentProject.villageLgdCode}
                  </span>
                </div>
                <button
                  onClick={() => setIsHudCollapsed(true)}
                  className="p-1 rounded-lg hover:bg-[#F2EFE8] text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                  title="Collapse HUD"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
              </div>
              <h2 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                {currentProject.village} Village Cadastre
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Tehsil: {currentProject.tehsil} | District: {currentProject.district} ({currentProject.stateCode})
              </p>
              <div className="pt-2 border-t border-[#F2EFE8] flex items-center justify-between text-[11px]">
                <span className="text-slate-600">
                  Affected: <strong className="text-red-700">{currentProject.totalAffectedParcels}</strong> / {currentProject.parcels.length} Khasras
                </span>
                <span className="font-bold text-[#15803D]">{currentProject.totalAffectedAreaHa} Ha</span>
              </div>
            </div>
          )}

          {/* Quick Filter Pill */}
          {!isHudCollapsed && (
            <div className="bg-white/95 backdrop-blur-md border border-[#E5E0D6] rounded-xl p-1.5 shadow-sm pointer-events-auto flex items-center gap-1 text-[11px] font-bold">
              <button
                onClick={() => setFilterImpact("all")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filterImpact === "all" ? "bg-[#15803D] text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All ({currentProject.parcels.length})
              </button>
              <button
                onClick={() => setFilterImpact("affected")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filterImpact === "affected" ? "bg-red-600 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Affected ({currentProject.totalAffectedParcels})
              </button>
              <button
                onClick={() => setFilterImpact("unaffected")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filterImpact === "unaffected" ? "bg-sky-600 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Unaffected ({currentProject.parcels.length - currentProject.totalAffectedParcels})
              </button>
            </div>
          )}
        </div>

        {/* ───── BOTTOM TELEMETRY BAR ───── */}
        <div className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur-md border border-[#E5E0D6] rounded-xl px-3 py-1.5 shadow-sm text-[10px] font-mono text-slate-600 flex items-center gap-3 pointer-events-none">
          <div className="flex items-center gap-1.5">
            <Compass className="h-3 w-3 text-[#0284C7]" />
            <span>Lat: {cursorPos.lat.toFixed(5)}°N</span>
            <span>Lng: {cursorPos.lng.toFixed(5)}°E</span>
          </div>
          <span className="text-slate-300">|</span>
          <span>Datum: WGS84 (EPSG:4326)</span>
          <span className="text-slate-300">|</span>
          <span className="text-[#15803D] font-bold">{currentProject.scaleRatio}</span>
        </div>

        {/* ───── RIGHT SLIDE-OUT: 4-Section BhuNaksha Cadastral Parcel Dossier ───── */}
        {inspectorOpen && selectedParcel && (() => {
          const enriched = getParcel12StageInfo(selectedParcel);

          return (
            <div className="absolute top-3 right-3 bottom-3 z-20 w-[420px] max-w-[calc(100vw-24px)] bg-white/95 backdrop-blur-md border border-[#E5E0D6] rounded-3xl shadow-xl flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-200">
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

                <button
                  onClick={() => setInspectorOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-[#F2EFE8] transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* 12-Stage Visual Stepper Strip */}
              <div className="px-3.5 py-2 bg-[#FAF8F5] border-b border-[#E5E0D6] shrink-0">
                <div className="flex items-center justify-between mb-1 text-[10px]">
                  <span className="font-bold text-slate-500 uppercase tracking-wider">Statutory Journey</span>
                  <span className="font-bold text-[#15803D]">{enriched.stageTitle}</span>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
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
                        <span className="hidden sm:inline">{s.shortTitle}</span>
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
                    {/* ULPIN Strip */}
                    <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#E5E0D6] space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                        14-Digit Bhu-Aadhaar (ULPIN)
                      </span>
                      <div className="flex items-center justify-between font-mono font-extrabold text-slate-900 text-xs">
                        <span>{selectedParcel.ulpin}</span>
                        <button
                          onClick={() => handleCopyULPIN(selectedParcel.ulpin)}
                          className="p-1 rounded text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                          title="Copy ULPIN"
                        >
                          {copiedULPIN ? <Check className="h-3.5 w-3.5 text-[#15803D]" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Area Comparison */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D6]">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">GIS Calculated</span>
                        <span className="text-sm font-extrabold font-mono text-slate-900 block mt-0.5">
                          {selectedParcel.gisCalculatedAreaHa} Ha
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {selectedParcel.areaSqMeters.toLocaleString()} m²
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D6]">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Affected Area</span>
                        <span className={`text-sm font-extrabold font-mono block mt-0.5 ${selectedParcel.isAffected ? "text-red-700" : "text-slate-700"}`}>
                          {selectedParcel.affectedAreaHa} Ha
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">
                          {selectedParcel.affectedAreaPercentage}% of plot
                        </span>
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
                    {/* RoR Status Banner */}
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
                    {/* Statutory Stage Pill */}
                    <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D6] flex items-center justify-between">
                      <span className="text-slate-500">Current Statutory Stage:</span>
                      <Badge className="bg-[#15803D] text-white text-[10px]">
                        {enriched.stageTitle}
                      </Badge>
                    </div>

                    {/* RFCTLARR Valuation Card */}
                    {selectedParcel.isAffected ? (
                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]/40 border border-[#BBF7D0] space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803D] block">
                          Statutory Award Breakdown (RFCTLARR Sec 26-30)
                        </span>
                        <div className="space-y-1 text-[11px]">
                          <div className="flex justify-between text-slate-600">
                            <span>Base Market Rate (Circle Rate):</span>
                            <span className="font-mono">₹{(selectedParcel.circleRatePerHa / 100000).toFixed(1)} L / Ha</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Base Market Value ({selectedParcel.affectedAreaHa} Ha):</span>
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
                            <span>Assets (Borewells/Trees):</span>
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

                    {/* Objection Card if exists */}
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
                    {/* Possession Details */}
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

                    {/* Rehabilitation & Resettlement (R&R) */}
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
                          <span className="text-slate-500">Entitlement Package:</span>
                          <span className="font-medium text-slate-700 text-right truncate max-w-[200px]">
                            {enriched.rrDetails?.entitlementPackage || "Standard Sch II"}
                          </span>
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
                  <span>View Raw API</span>
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
                    Endpoint: GET /api/bhunaksha/wfs?project={currentProject.id}&khasra={selectedParcel.khasraNumber}
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
              {/* Simulated Curl Command */}
              <div className="bg-[#0F172A] text-slate-200 p-3 rounded-2xl overflow-x-auto space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold block"># Live Curl Request</span>
                <code>
                  curl -X GET &quot;https://bhoomidrishti.gov.in/api/bhunaksha/wfs?village={currentProject.villageLgdCode}&khasra={selectedParcel.khasraNumber}&quot; \<br />
                  &nbsp;&nbsp;-H &quot;Accept: application/geo+json&quot; \<br />
                  &nbsp;&nbsp;-H &quot;X-NIC-Auth-Token: STATE-REV-MH-2024-TOKEN&quot;
                </code>
              </div>

              {/* GeoJSON Payload */}
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
      </div>

      {/* Architecture Evaluation Modal */}
      <BhuNakshaArchitectureModal
        open={architectureModalOpen}
        onOpenChange={setArchitectureModalOpen}
      />
    </div>
  );
}
