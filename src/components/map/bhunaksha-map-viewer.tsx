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
}

export function BhuNakshaMapViewer({
  initialProjectId = "PRJ-001",
  initialKhasraNumber,
  initialStageFilter,
}: BhuNakshaMapViewerProps = {}) {
  const currentProject = BHUNAKSHA_PROJECTS[0];

  // Selected Parcel state (defaults to null so map is completely clean and unencumbered)
  const [selectedParcel, setSelectedParcel] = useState<BhuNakshaParcel | null>(() => {
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
    return null;
  });

  // Sync initial props
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
  }, [currentProject, initialKhasraNumber, initialStageFilter]);

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

  // Live Telemetry
  const [cursorPos, setCursorPos] = useState<{ lat: number; lng: number }>({
    lat: currentProject.parcels[0].coordinates[0],
    lng: currentProject.parcels[0].coordinates[1],
  });

  // Camera coordinates
  const cameraConfig = useMemo(() => {
    return { center: [19.856, 73.998] as [number, number], zoom: 16 };
  }, []);

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

    if (mapMode === "cadastralSheet") {
      return {
        color: isSelected ? "#0F172A" : stageColor.borderColor,
        weight: isSelected ? 3.5 : 1.8,
        fillColor: stageColor.borderColor,
        fillOpacity: isSelected ? 0.6 : enriched.isAffected ? 0.32 : 0.12,
        dashArray: enriched.acquisitionType === "partial" ? "6, 4" : undefined,
      };
    }

    if (mapMode === "hybrid") {
      return {
        color: isSelected ? "#FFFFFF" : stageColor.borderColor,
        weight: isSelected ? 3.5 : 1.8,
        fillColor: stageColor.borderColor,
        fillOpacity: isSelected ? 0.55 : 0.3,
        dashArray: enriched.acquisitionType === "partial" ? "6, 4" : undefined,
      };
    }

    return {
      color: isSelected ? "#0F172A" : stageColor.borderColor,
      weight: isSelected ? 3.5 : 1.8,
      fillColor: stageColor.borderColor,
      fillOpacity: isSelected ? 0.55 : 0.3,
    };
  };

  // Active GeoJSON preview for API Inspector
  const activeGeoJsonPreview = useMemo(() => {
    const p = selectedParcel || currentProject.parcels[0];
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
        isAffected: p.isAffected,
        affectedAreaHa: p.affectedAreaHa,
        acquisitionType: p.acquisitionType,
        owners: p.owners.map((o) => ({
          name: o.name,
          share: `${o.sharePercentage}%`,
        })),
        circleRateINR: p.circleRatePerHa,
        totalCompensationPayableINR: p.valuation.totalCompensationPayable,
      },
    };
  }, [selectedParcel, currentProject]);

  return (
    <div className="relative w-full h-[calc(100vh-115px)] min-h-[580px] flex-1 flex flex-col bg-[#FAF8F5] overflow-hidden rounded-3xl border border-[#E5E0D6] shadow-sm">
      {/* ───── STREAMLINED 1-ROW GIS TOOLBAR (NO DUPLICATE HEADERS) ───── */}
      {!zenMode && (
        <div className="z-10 bg-white/95 backdrop-blur-md border-b border-[#E5E0D6] px-3.5 py-2 shadow-xs shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Left: Base Map Switcher & Corridor Toggle */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#FAF8F5] p-0.5 rounded-xl border border-[#E5E0D6] text-xs font-bold">
                <button
                  onClick={() => setMapMode("cadastralSheet")}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
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
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
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
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    mapMode === "osm"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Street Map"
                >
                  🗺️ Streets
                </button>
              </div>

              {/* Corridor Toggle */}
              <button
                onClick={() => setShowCorridor(!showCorridor)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  showCorridor
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-white text-slate-500 border-[#E5E0D6] hover:text-slate-800"
                }`}
                title="Toggle 60m Highway Corridor Right-of-Way"
              >
                <span className={`h-2 w-2 rounded-full ${showCorridor ? "bg-red-600 animate-pulse" : "bg-slate-300"}`} />
                <span>60m Corridor</span>
              </button>

              {/* Parcel Filter Pills */}
              <div className="hidden sm:flex items-center bg-[#FAF8F5] p-0.5 rounded-xl border border-[#E5E0D6] text-[11px] font-bold">
                <button
                  onClick={() => setFilterImpact("all")}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                    filterImpact === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  All ({currentProject.parcels.length})
                </button>
                <button
                  onClick={() => setFilterImpact("affected")}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                    filterImpact === "affected" ? "bg-red-500 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Affected ({currentProject.totalAffectedParcels})
                </button>
                <button
                  onClick={() => setFilterImpact("unaffected")}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                    filterImpact === "unaffected" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Buffer ({currentProject.parcels.length - currentProject.totalAffectedParcels})
                </button>
              </div>
            </div>

            {/* Right: GIS Toggles (Labels, Popups, Zen Mode, API) */}
            <div className="flex items-center gap-1.5">
              {/* Labels Toggle */}
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
                title={showTooltips ? "Hover tooltips enabled" : "Hover tooltips disabled for clean map inspection"}
              >
                <MessageSquare className="h-3 w-3" />
                <span className="hidden md:inline">Popups</span>
                <span className="text-[10px] font-mono">{showTooltips ? "ON" : "OFF"}</span>
              </button>

              {/* Zen / Full Map Mode Toggle */}
              <button
                onClick={() => setZenMode(true)}
                className="px-2 py-1 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-[#FAF8F5] border border-[#E5E0D6] flex items-center gap-1 cursor-pointer transition-colors"
                title="Zen Focus Mode: Hide all overlays to inspect pure cadastral map"
              >
                <Maximize2 className="h-3 w-3 text-slate-500" />
                <span className="hidden lg:inline">Zen View</span>
              </button>

              {/* Raw API Drawer Button */}
              <button
                onClick={() => setApiDrawerOpen(!apiDrawerOpen)}
                className="px-2 py-1 rounded-xl text-xs font-bold bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF] flex items-center gap-1 transition-colors cursor-pointer"
                title="Inspect NIC BhuNaksha WFS 2.0 GeoJSON Endpoint"
              >
                <Code2 className="h-3 w-3" />
                <span className="hidden lg:inline">API</span>
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

          {/* 60m Highway Corridor Right-of-Way Buffer & Centerline */}
          {showCorridor && currentProject.corridorCenterline && (
            <>
              <Polyline
                positions={currentProject.corridorCenterline}
                pathOptions={{
                  color: "#DC2626",
                  weight: 28,
                  opacity: 0.18,
                }}
              />
              <Polyline
                positions={currentProject.corridorCenterline}
                pathOptions={{
                  color: "#B91C1C",
                  weight: 2.5,
                  dashArray: "8, 6",
                }}
              />
            </>
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
                    click: (e) => {
                      L.DomEvent.stopPropagation(e);
                      setSelectedParcel(parcel);
                    },
                  }}
                >
                  {/* Subtle, non-sticky, clean 1-line tooltip ONLY when enabled */}
                  {showTooltips && (
                    <Tooltip direction="top" offset={[0, -8]} opacity={0.92}>
                      <span className="font-mono text-xs font-semibold text-slate-900">
                        Khasra {parcel.khasraNumber} &bull; {parcel.gisCalculatedAreaHa} Ha &bull; {parcel.isAffected ? "Affected" : "Buffer"}
                      </span>
                    </Tooltip>
                  )}
                </Polygon>

                {/* Minimalist Centroid Plot Number Label */}
                {showKhasraLabels && (
                  <Marker
                    position={parcel.coordinates}
                    icon={createKhasraBadgeIcon(
                      parcel.khasraNumber,
                      isSelected,
                      parcel.isAffected,
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
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md border border-[#E5E0D6] rounded-xl px-2.5 py-1 shadow-xs pointer-events-auto flex items-center gap-2 text-[11px] font-semibold text-slate-700">
              <span className="h-2 w-2 rounded-full bg-[#15803D]" />
              <span className="font-bold text-slate-900">{currentProject.village}</span>
              <span className="text-slate-400">&bull;</span>
              <span className="font-mono text-slate-600">{currentProject.sajraSheetNumber}</span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-red-700 font-bold">{currentProject.totalAffectedParcels} Affected</span>
            </div>
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
        {selectedParcel && !inspectorOpen && !zenMode && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4 pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-150">
            <div className="bg-white/95 backdrop-blur-md border border-[#E5E0D6] rounded-2xl p-3 shadow-xl pointer-events-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-[#0284C7] text-white shrink-0 shadow-xs">
                  KH-{selectedParcel.khasraNumber}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 truncate">
                    <span>{selectedParcel.owners[0]?.name || "Gram Sabha"}</span>
                    <span className="text-slate-400 font-normal">&bull;</span>
                    <span className="font-mono text-slate-700">{selectedParcel.gisCalculatedAreaHa} Ha</span>
                    <span className="text-slate-400 font-normal">&bull;</span>
                    <span className={selectedParcel.isAffected ? "text-red-700" : "text-[#15803D]"}>
                      {selectedParcel.isAffected ? `${selectedParcel.affectedAreaHa} Ha (${selectedParcel.acquisitionType})` : "Unaffected Buffer"}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium truncate flex items-center gap-2 mt-0.5">
                    <span>{selectedParcel.surveyNumber}</span>
                    <span>&bull;</span>
                    <span className="capitalize">{selectedParcel.landClassification.replace(/_/g, " ")}</span>
                    <span>&bull;</span>
                    <span className="text-[#15803D] font-mono font-bold">
                      ₹{(selectedParcel.valuation.totalCompensationPayable / 100000).toFixed(1)} L
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  size="sm"
                  onClick={() => setInspectorOpen(true)}
                  className="h-8 px-3 text-xs font-bold bg-[#15803D] hover:bg-[#166534] text-white rounded-xl shadow-xs"
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
        )}

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
      </div>

      {/* Architecture Evaluation Modal */}
      <BhuNakshaArchitectureModal
        open={architectureModalOpen}
        onOpenChange={setArchitectureModalOpen}
      />
    </div>
  );
}
