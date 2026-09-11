"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Polyline,
  Circle,
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
  Search,
  Building2,
  FileText,
  Ruler,
  Download,
  Eye,
  SlidersHorizontal,
  X,
  Navigation,
  Sparkles,
  Landmark,
  Coins,
  ShieldCheck,
  Check,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Copy,
  ArrowUpRight,
  Sun,
  Trees,
  Factory,
  Key,
  Lock,
  ShieldAlert,
} from "lucide-react";
import { MOCK_PROJECTS, MOCK_PLOTS } from "@/lib/mock-data";
import { Project, LandParcel } from "@/types";
import { useApp } from "@/context/app-context";
import { checkResourceAccess } from "@/lib/auth-store";
import { RequestAccessModal } from "@/components/auth/request-access-modal";
import { formatCurrency, formatIndianNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Centroid Plot Badge DivIcon
function createPlotBadgeIcon(plotNumber: string, isSelected: boolean, status: string) {
  let statusDotColor = "#15803D"; // green
  if (status === "available") statusDotColor = "#0284C7"; // blue
  if (status === "disputed") statusDotColor = "#D97706"; // amber
  if (status === "reserved") statusDotColor = "#7C3AED"; // purple

  const containerStyle = isSelected
    ? "background: #0f172a; color: #ffffff; border: 2px solid #38bdf8; box-shadow: 0 4px 14px rgba(0,0,0,0.35); font-weight: 700;"
    : "background: rgba(255, 255, 255, 0.95); color: #1e293b; border: 1.5px solid #cbd5e1; box-shadow: 0 2px 6px rgba(0,0,0,0.12); font-weight: 600;";

  return L.divIcon({
    className: "custom-plot-badge",
    html: `
      <div style="
        ${containerStyle}
        font-family: ui-sans-serif, system-ui, sans-serif;
        font-size: 11px;
        line-height: 1;
        padding: 3px 8px;
        border-radius: 6px;
        white-space: nowrap;
        text-align: center;
        transform: translate(-50%, -50%);
        display: inline-flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        pointer-events: auto;
      ">
        <span style="width: 7px; height: 7px; border-radius: 50%; background: ${statusDotColor}; display: inline-block;"></span>
        <span>${plotNumber}</span>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

// Map Camera Controller
function MapCameraController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

// Map Event Tracker (Telemetry & Measurement)
function MapEventTracker({
  measuring,
  onAddPoint,
  onMouseMove,
}: {
  measuring: boolean;
  onAddPoint: (latlng: [number, number]) => void;
  onMouseMove: (latlng: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click(e) {
      if (measuring) {
        onAddPoint([e.latlng.lat, e.latlng.lng]);
      }
    },
    mousemove(e) {
      onMouseMove({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export function SpatialMapViewer() {
  const { currentUser, scopedGrants } = useApp();
  const [requestAccessResource, setRequestAccessResource] = useState<{
    targetType: "project" | "district" | "state" | "plots";
    targetId: string;
    targetName: string;
    targetState?: string;
    targetDistrict?: string;
    seniorAuthorityName?: string;
    seniorAuthorityRole?: string;
  } | null>(null);

  // Pre-calculate access map for projects
  const projectAccessMap = useMemo(() => {
    const map: Record<string, any> = {};
    MOCK_PROJECTS.forEach((p) => {
      map[p.id] = checkResourceAccess(currentUser, scopedGrants, {
        projectId: p.id,
        state: p.state,
        stateCode: p.stateCode,
        district: p.district,
      });
    });
    return map;
  }, [currentUser, scopedGrants]);

  // First authorized project for current user
  const firstAuthorizedId = useMemo(() => {
    const found = MOCK_PROJECTS.find((p) => projectAccessMap[p.id]?.allowed);
    return found ? found.id : "DL-INFRA-001";
  }, [projectAccessMap]);

  // Active Project
  const [selectedProjectId, setSelectedProjectId] = useState<string>(firstAuthorizedId);

  // Sync when user changes or grants change
  useEffect(() => {
    if (!projectAccessMap[selectedProjectId]?.allowed && firstAuthorizedId) {
      setSelectedProjectId(firstAuthorizedId);
    }
  }, [firstAuthorizedId, projectAccessMap, selectedProjectId]);

  const currentProject = useMemo(() => {
    return MOCK_PROJECTS.find((p) => p.id === selectedProjectId) || MOCK_PROJECTS[0];
  }, [selectedProjectId]);

  // Selected Plot for Inspection
  const [selectedPlot, setSelectedPlot] = useState<LandParcel | null>(() => {
    return MOCK_PLOTS.find((p) => p.projectId === "DL-INFRA-001") || MOCK_PLOTS[0];
  });

  // Basemap API Key state (reads from localStorage or env)
  const [apiKey, setApiKey] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("bhoomi_basemap_key") ||
        process.env.NEXT_PUBLIC_CARTO_API_KEY ||
        process.env.NEXT_PUBLIC_BASEMAP_API_KEY ||
        process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
        process.env.NEXT_PUBLIC_MAPTILER_KEY ||
        ""
      );
    }
    return (
      process.env.NEXT_PUBLIC_CARTO_API_KEY ||
      process.env.NEXT_PUBLIC_BASEMAP_API_KEY ||
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
      process.env.NEXT_PUBLIC_MAPTILER_KEY ||
      ""
    );
  });
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [inputKey, setInputKey] = useState(apiKey);

  // Base Map Layer
  const [baseMap, setBaseMap] = useState<"cartoLight" | "satellite" | "osm">("cartoLight");

  // Status Filter ("all" | "acquired" | "available" | "disputed" | "reserved")
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Layer Toggles
  const [showBadges, setShowBadges] = useState(true);

  // Inspector Panel State
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [copiedULPIN, setCopiedULPIN] = useState(false);

  // Measurement Tool
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);

  // Telemetry HUD
  const [cursorPos, setCursorPos] = useState({ lat: 19.852, lng: 73.998 });

  // Save API Key
  const handleSaveApiKey = (keyToSave: string) => {
    const trimmed = keyToSave.trim();
    setApiKey(trimmed);
    if (typeof window !== "undefined") {
      localStorage.setItem("bhoomi_basemap_key", trimmed);
    }
    setShowKeyModal(false);
  };

  // Dynamic Tile Sources using CARTO API Key
  const baseMapTiles = useMemo(() => {
    const key = apiKey.trim();
    const isMapbox = key.startsWith("pk.");
    const isMapTiler = key.length >= 20 && key.startsWith("maptiler");

    if (isMapbox) {
      return {
        cartoLight: `https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${key}`,
        satellite: `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${key}`,
        osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      };
    }

    if (isMapTiler) {
      return {
        cartoLight: `https://api.maptiler.com/maps/voyager/{z}/{x}/{y}.png?key=${key}`,
        satellite: `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${key}`,
        osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      };
    }

    // Default primary: Basemaps by CARTO (CartoDB Voyager) with optional CARTO API Key
    const cartoVoyagerUrl = key
      ? `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?api_key=${key}`
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    return {
      cartoLight: cartoVoyagerUrl,
      satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    };
  }, [apiKey]);

  // Center & Zoom by Project (Delhi & Ghaziabad)
  const projectCameraConfig: Record<string, { center: [number, number]; zoom: number }> = {
    "DL-INFRA-001": { center: [28.724, 77.144], zoom: 15 },
    "DL-GZB-002": { center: [28.675, 77.418], zoom: 14 },
  };

  const currentCamera = projectCameraConfig[selectedProjectId] || { center: [28.724, 77.144], zoom: 15 };

  // Filtered Plots
  const visiblePlots = useMemo(() => {
    return MOCK_PLOTS.filter((plot) => {
      const matchesProject = plot.projectId === selectedProjectId;
      const matchesStatus =
        statusFilter === "all" ? true : plot.plotStatus === statusFilter;
      return matchesProject && matchesStatus;
    });
  }, [selectedProjectId, statusFilter]);

  // Project plot counts by status
  const projectPlots = useMemo(() => {
    return MOCK_PLOTS.filter((p) => p.projectId === selectedProjectId);
  }, [selectedProjectId]);

  const statusCounts = useMemo(() => {
    const counts = { all: projectPlots.length, acquired: 0, available: 0, disputed: 0, reserved: 0 };
    projectPlots.forEach((p) => {
      if (p.plotStatus in counts) {
        counts[p.plotStatus as keyof typeof counts]++;
      }
    });
    return counts;
  }, [projectPlots]);

  // Handle Project Change with Jurisdiction Guard
  const handleSelectProject = (projectId: string) => {
    const access = projectAccessMap[projectId];
    if (access && !access.allowed) {
      const proj = MOCK_PROJECTS.find((p) => p.id === projectId);
      if (proj) {
        setRequestAccessResource({
          targetType: "project",
          targetId: proj.id,
          targetName: proj.name,
          targetState: proj.state,
          targetDistrict: proj.district,
          seniorAuthorityName: access.seniorName || currentUser?.parentAuthorityName || "Competent Authority",
          seniorAuthorityRole: access.seniorRole || currentUser?.parentAuthorityTitle || "Senior Administrator",
        });
      }
      return;
    }
    setSelectedProjectId(projectId);
    const firstPlot = MOCK_PLOTS.find((p) => p.projectId === projectId);
    if (firstPlot) {
      setSelectedPlot(firstPlot);
    }
  };

  // Plot Colors
  const getPlotStyles = (plot: LandParcel, isSelected: boolean) => {
    switch (plot.plotStatus) {
      case "acquired":
        return {
          color: isSelected ? "#0F172A" : "#15803D",
          fillColor: "#16A34A",
          fillOpacity: isSelected ? 0.72 : 0.45,
          weight: isSelected ? 3.5 : 2,
        };
      case "available":
        return {
          color: isSelected ? "#0F172A" : "#0284C7",
          fillColor: "#38BDF8",
          fillOpacity: isSelected ? 0.72 : 0.45,
          weight: isSelected ? 3.5 : 2,
        };
      case "disputed":
        return {
          color: isSelected ? "#0F172A" : "#D97706",
          fillColor: "#F59E0B",
          fillOpacity: isSelected ? 0.72 : 0.45,
          weight: isSelected ? 3.5 : 2,
        };
      case "reserved":
        return {
          color: isSelected ? "#0F172A" : "#7C3AED",
          fillColor: "#A855F7",
          fillOpacity: isSelected ? 0.72 : 0.45,
          weight: isSelected ? 3.5 : 2,
        };
      default:
        return {
          color: "#64748B",
          fillColor: "#94A3B8",
          fillOpacity: 0.4,
          weight: 2,
        };
    }
  };

  // Copy ULPIN
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedULPIN(true);
    setTimeout(() => setCopiedULPIN(false), 2000);
  };

  // Calculate measurement distance
  const measuredDistanceMeters = useMemo(() => {
    if (measurePoints.length < 2) return 0;
    let total = 0;
    for (let i = 0; i < measurePoints.length - 1; i++) {
      const p1 = L.latLng(measurePoints[i][0], measurePoints[i][1]);
      const p2 = L.latLng(measurePoints[i + 1][0], measurePoints[i + 1][1]);
      total += p1.distanceTo(p2);
    }
    return Math.round(total);
  }, [measurePoints]);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col bg-[#FAF8F5] overflow-hidden">
      {/* TOP CONTROL BAR: Project Selector & Status Chips */}
      <div className="z-10 bg-white/95 backdrop-blur-md border-b border-[#E5E0D6] px-4 py-3 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 max-w-7xl mx-auto">
          {/* Project Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap hidden sm:inline">
              Project:
            </span>
            {MOCK_PROJECTS.map((project) => {
              const isSelected = project.id === selectedProjectId;
              const access = projectAccessMap[project.id];
              const isLocked = access && !access.allowed;

              return (
                <button
                  key={project.id}
                  onClick={() => handleSelectProject(project.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                    isSelected
                      ? "bg-[#15803D] text-white shadow-xs"
                      : isLocked
                      ? "bg-[#FEF3C7]/70 text-amber-900 hover:bg-[#FDE68A] border border-amber-300"
                      : "bg-[#F4EFEA] text-slate-700 hover:bg-[#EBE5DC] border border-[#E5E0D6]"
                  }`}
                  title={isLocked ? `Jurisdiction Restricted: Click to request access from ${access?.seniorRole || 'Senior Authority'}` : undefined}
                >
                  {isLocked ? (
                    <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  ) : (
                    <>
                      {project.type === "industrial" && <Factory className="w-3.5 h-3.5" />}
                      {project.type === "renewable_energy" && <Sun className="w-3.5 h-3.5" />}
                      {project.type === "irrigation" && <Trees className="w-3.5 h-3.5" />}
                    </>
                  )}
                  <span>{project.name}</span>
                  {isLocked ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-amber-200/80 text-amber-950">
                      Restricted
                    </span>
                  ) : (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                        isSelected ? "bg-white/25 text-white" : "bg-white text-slate-600"
                      }`}
                    >
                      {MOCK_PLOTS.filter((p) => p.projectId === project.id).length} Plots
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Tools: Base Map + API Key + Measurement */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Base Layer Switcher */}
            <div className="flex items-center bg-[#F4EFEA] border border-[#E5E0D6] rounded-lg p-0.5 text-xs font-medium">
              <button
                onClick={() => setBaseMap("cartoLight")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  baseMap === "cartoLight"
                    ? "bg-white text-slate-900 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Cadastral Light
              </button>
              <button
                onClick={() => setBaseMap("satellite")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  baseMap === "satellite"
                    ? "bg-white text-slate-900 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Satellite Imagery
              </button>
              <button
                onClick={() => setBaseMap("osm")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  baseMap === "osm"
                    ? "bg-white text-slate-900 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                OSM Standard
              </button>
            </div>

            {/* Basemap API Key Button */}
            <button
              onClick={() => {
                setInputKey(apiKey);
                setShowKeyModal(true);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
                apiKey
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                  : "bg-white text-slate-700 border-[#E5E0D6] hover:bg-[#F4EFEA]"
              }`}
              title="Configure Basemap API Key (Mapbox / MapTiler / Custom)"
            >
              <Key className={`w-3.5 h-3.5 ${apiKey ? "text-[#15803D]" : "text-slate-500"}`} />
              <span>{apiKey ? "API Key Active" : "Add API Key"}</span>
              {apiKey && <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />}
            </button>

            {/* Measurement Tool Button */}
            <button
              onClick={() => {
                setIsMeasuring(!isMeasuring);
                setMeasurePoints([]);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
                isMeasuring
                  ? "bg-[#0284C7] text-white border-[#0284C7] shadow-xs"
                  : "bg-white text-slate-700 border-[#E5E0D6] hover:bg-[#F4EFEA]"
              }`}
              title="Click to measure distance on map"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>{isMeasuring ? "Measuring..." : "Measure"}</span>
            </button>

            {/* Badges Toggle */}
            <button
              onClick={() => setShowBadges(!showBadges)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
                showBadges
                  ? "bg-white text-slate-800 border-[#CBD5E1]"
                  : "bg-[#F4EFEA] text-slate-400 border-[#E5E0D6]"
              }`}
              title="Toggle plot centroid numbers"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Labels</span>
            </button>
          </div>
        </div>

        {/* SUB-ROW: Status Filter Chips & Active Count */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F0EBE1] text-xs max-w-7xl mx-auto">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <span className="text-[11px] font-semibold text-slate-500 mr-1">Filter Status:</span>
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                statusFilter === "all"
                  ? "bg-slate-800 text-white"
                  : "bg-[#F4EFEA] text-slate-600 hover:bg-[#EBE5DC]"
              }`}
            >
              All ({statusCounts.all})
            </button>
            <button
              onClick={() => setStatusFilter("acquired")}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
                statusFilter === "acquired"
                  ? "bg-[#15803D] text-white"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#15803D]"></span>
              Acquired ({statusCounts.acquired})
            </button>
            <button
              onClick={() => setStatusFilter("available")}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
                statusFilter === "available"
                  ? "bg-[#0284C7] text-white"
                  : "bg-sky-50 text-sky-800 hover:bg-sky-100"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#0284C7]"></span>
              Available / Notified ({statusCounts.available})
            </button>
            {statusCounts.disputed > 0 && (
              <button
                onClick={() => setStatusFilter("disputed")}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
                  statusFilter === "disputed"
                    ? "bg-[#D97706] text-white"
                    : "bg-amber-50 text-amber-800 hover:bg-amber-100"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#D97706]"></span>
                Disputed ({statusCounts.disputed})
              </button>
            )}
            {statusCounts.reserved > 0 && (
              <button
                onClick={() => setStatusFilter("reserved")}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
                  statusFilter === "reserved"
                    ? "bg-[#7C3AED] text-white"
                    : "bg-purple-50 text-purple-800 hover:bg-purple-100"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#7C3AED]"></span>
                Reserved ({statusCounts.reserved})
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span>Lat: {cursorPos.lat.toFixed(4)}°N</span>
            <span>•</span>
            <span>Lng: {cursorPos.lng.toFixed(4)}°E</span>
          </div>
        </div>
      </div>

      {/* API KEY CONFIGURATION MODAL */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-[#E5E0D6] shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-[#15803D]">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">CARTO & Basemap API Key</h3>
                  <p className="text-[11px] text-slate-500">Basemaps by CARTO (CartoDB Voyager)</p>
                </div>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Paste your <strong>CARTO API key</strong> below to authenticate all <strong>CartoDB Voyager</strong> Cadastral basemap tile requests.
              </p>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 block">CARTO API Key / Access Token</label>
                <input
                  type="text"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Paste your CARTO API key here"
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-[#15803D] focus:border-transparent"
                />
              </div>

              <div className="bg-[#FAF8F5] border border-[#E5E0D6] rounded-lg p-3 text-[11px] space-y-1 text-slate-600">
                <div className="font-semibold text-slate-800">Active Basemap Engine:</div>
                <div>• <strong>Basemaps by CARTO</strong>: CartoDB Voyager tiles with your API key authentication</div>
                <div>• <strong>Satellite Imagery</strong>: High-resolution Esri World Imagery</div>
                <div>• <strong>Mapbox / MapTiler</strong>: Auto-detected if token starts with <code>pk.</code> or <code>maptiler</code></div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              {apiKey && (
                <button
                  onClick={() => handleSaveApiKey("")}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors mr-auto"
                >
                  Clear Key
                </button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowKeyModal(false)}
                className="border-[#E5E0D6] text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => handleSaveApiKey(inputKey)}
                className="bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold"
              >
                Save & Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN MAP AREA + CONNECTED PLOT INSPECTOR */}
      <div className="relative flex-1 w-full h-full">
        {/* Leaflet Map Container */}
        <MapContainer
          key={apiKey || "default-tiles"}
          center={currentCamera.center}
          zoom={currentCamera.zoom}
          className="w-full h-full z-0"
          zoomControl={false}
        >
          <MapCameraController center={currentCamera.center} zoom={currentCamera.zoom} />
          <MapEventTracker
            measuring={isMeasuring}
            onAddPoint={(pt) => setMeasurePoints((prev) => [...prev, pt])}
            onMouseMove={setCursorPos}
          />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={baseMapTiles[baseMap]}
          />

          {/* Measurement Polyline */}
          {isMeasuring && measurePoints.length > 0 && (
            <>
              <Polyline
                positions={measurePoints}
                pathOptions={{ color: "#0284C7", weight: 3, dashArray: "6, 6" }}
              />
              {measurePoints.map((pt, idx) => (
                <Circle
                  key={idx}
                  center={pt}
                  radius={2}
                  pathOptions={{ color: "#0284C7", fillColor: "#ffffff", fillOpacity: 1, weight: 2 }}
                />
              ))}
            </>
          )}

          {/* Render All Contiguous Plot Polygons */}
          {visiblePlots.map((plot) => {
            const isSelected = selectedPlot?.id === plot.id;
            const styles = getPlotStyles(plot, isSelected);

            return (
              <React.Fragment key={plot.id}>
                <Polygon
                  positions={plot.polygon}
                  pathOptions={styles}
                  eventHandlers={{
                    click: () => {
                      setSelectedPlot(plot);
                      setInspectorOpen(true);
                    },
                  }}
                >
                  <Popup>
                    <div className="p-2 space-y-1.5 min-w-[220px] text-xs font-sans">
                      <div className="flex items-center justify-between border-b pb-1">
                        <span className="font-bold text-slate-900 text-sm">{plot.plotNumber}</span>
                        <span
                          className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            plot.plotStatus === "acquired"
                              ? "bg-emerald-100 text-emerald-800"
                              : plot.plotStatus === "available"
                              ? "bg-sky-100 text-sky-800"
                              : plot.plotStatus === "disputed"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {plot.plotStatus}
                        </span>
                      </div>
                      <p className="text-slate-600">
                        Survey: <strong>{plot.surveyNumber}</strong> | Khasra: <strong>{plot.khasraNumber}</strong>
                      </p>
                      <p className="font-mono text-[11px] text-slate-700">
                        ULPIN: <strong>{plot.ulpin}</strong>
                      </p>
                      <p className="text-slate-600">
                        Owner: <strong>{plot.ownerName}</strong>
                      </p>
                      <p className="text-slate-600">
                        Dimensions: <strong>{plot.dimensions}</strong> ({plot.areaSqMeters.toLocaleString("en-IN")} sq.m)
                      </p>
                      <p className="text-[#15803D] font-bold text-xs pt-1 border-t">
                        Valuation: ₹{(plot.marketValue / 10000000).toFixed(2)} Cr
                      </p>
                    </div>
                  </Popup>
                </Polygon>

                {/* Centroid Plot Badge Marker */}
                {showBadges && plot.centroid && (
                  <Marker
                    position={plot.centroid}
                    icon={createPlotBadgeIcon(plot.plotNumber, isSelected, plot.plotStatus)}
                    eventHandlers={{
                      click: () => {
                        setSelectedPlot(plot);
                        setInspectorOpen(true);
                      },
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </MapContainer>

        {/* MEASUREMENT HUD OVERLAY */}
        {isMeasuring && (
          <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md border border-[#0284C7] shadow-lg rounded-xl p-3 max-w-xs text-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-[#0284C7]" />
                Linear Measurement Tool
              </span>
              <button
                onClick={() => {
                  setIsMeasuring(false);
                  setMeasurePoints([]);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              Click anywhere on the map to add measurement points along plot boundaries.
            </p>
            <div className="mt-2 bg-sky-50 rounded-lg p-2 border border-sky-100 flex items-center justify-between font-mono">
              <span className="text-sky-800 font-medium">Total Distance:</span>
              <span className="text-sky-950 font-bold text-sm">{measuredDistanceMeters} meters</span>
            </div>
            {measurePoints.length > 0 && (
              <button
                onClick={() => setMeasurePoints([])}
                className="mt-2 w-full text-center text-[11px] text-slate-500 hover:text-slate-800 underline"
              >
                Reset measurement points
              </button>
            )}
          </div>
        )}

        {/* MAP LEGEND (Bottom-Left) */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md border border-[#E5E0D6] shadow-md rounded-xl p-3 text-xs hidden md:block">
          <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2">
            Cadastral Plot Legend
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-700"></div>
              <span className="text-slate-700">Acquired / Possessed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-sky-400 border border-sky-600"></div>
              <span className="text-slate-700">Available / Notified (Sec 11)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-amber-400 border border-amber-600"></div>
              <span className="text-slate-700">Disputed / In Litigation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-purple-400 border border-purple-600"></div>
              <span className="text-slate-700">Reserved / Public Utility</span>
            </div>
          </div>
        </div>

        {/* CONNECTED PLOT INSPECTOR (Floating Right Panel) */}
        {inspectorOpen && selectedPlot && (
          <div className="absolute top-4 right-4 bottom-4 z-20 w-88 md:w-96 bg-white/95 backdrop-blur-md border border-[#E5E0D6] shadow-xl rounded-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-300">
            {/* Inspector Header */}
            <div className="p-4 border-b border-[#E5E0D6] bg-gradient-to-b from-[#FAF8F5] to-white flex items-start justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-slate-500">{selectedPlot.id}</span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      selectedPlot.plotStatus === "acquired"
                        ? "bg-emerald-100 text-emerald-800"
                        : selectedPlot.plotStatus === "available"
                        ? "bg-sky-100 text-sky-800"
                        : selectedPlot.plotStatus === "disputed"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {selectedPlot.plotStatus}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  {selectedPlot.plotNumber}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">{currentProject.name}</p>
              </div>
              <button
                onClick={() => setInspectorOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-[#F4EFEA] transition-colors"
                title="Close Inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Inspector Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* ULPIN Card */}
              <div className="bg-[#FAF8F5] border border-[#E5E0D6] rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <span>ULPIN (Bhu-Aadhaar)</span>
                  <button
                    onClick={() => copyToClipboard(selectedPlot.ulpin)}
                    className="flex items-center gap-1 text-[#0284C7] hover:underline font-normal"
                  >
                    {copiedULPIN ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="font-mono text-sm font-bold text-slate-900 tracking-wider">
                  {selectedPlot.ulpin}
                </div>
                <div className="text-[11px] text-slate-500">
                  Survey No: <strong className="text-slate-800">{selectedPlot.surveyNumber}</strong> | Khasra:{" "}
                  <strong className="text-slate-800">{selectedPlot.khasraNumber}</strong>
                </div>
              </div>

              {/* Physical Dimensions & Geometry */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-[#0284C7]" />
                  Parcel Dimensions & Area
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#FAF8F5] border border-[#E5E0D6] rounded-lg p-2.5">
                    <span className="text-[10px] text-slate-500 block">Boundary Dimensions</span>
                    <span className="font-semibold text-slate-900 text-xs font-mono">
                      {selectedPlot.dimensions}
                    </span>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#E5E0D6] rounded-lg p-2.5">
                    <span className="text-[10px] text-slate-500 block">Square Meters</span>
                    <span className="font-semibold text-slate-900 text-xs font-mono">
                      {selectedPlot.areaSqMeters.toLocaleString("en-IN")} sq.m
                    </span>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#E5E0D6] rounded-lg p-2.5">
                    <span className="text-[10px] text-slate-500 block">Metric Hectares</span>
                    <span className="font-semibold text-slate-900 text-xs font-mono">
                      {selectedPlot.areaHectares} ha
                    </span>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#E5E0D6] rounded-lg p-2.5">
                    <span className="text-[10px] text-slate-500 block">Imperial Acres</span>
                    <span className="font-semibold text-slate-900 text-xs font-mono">
                      {(selectedPlot.areaHectares * 2.471).toFixed(2)} acres
                    </span>
                  </div>
                </div>
              </div>

              {/* Ownership & Classification */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-[#15803D]" />
                  Ownership & Land Category
                </h4>
                <div className="bg-[#FAF8F5] border border-[#E5E0D6] rounded-xl p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Registered Owner:</span>
                    <span className="font-semibold text-slate-900 text-right">{selectedPlot.ownerName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Ownership Type:</span>
                    <span className="font-medium text-slate-800 capitalize">{selectedPlot.ownershipType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Land Use / Class:</span>
                    <span className="font-medium text-slate-800">{selectedPlot.khasraClassification}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Jurisdiction:</span>
                    <span className="font-medium text-slate-800">
                      {selectedPlot.village}, {selectedPlot.tehsil} ({selectedPlot.district})
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Valuation & Solatium */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-[#D97706]" />
                  RFCTLARR Act 2013 Compensation
                </h4>
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 space-y-2 text-emerald-950">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-800">Assessed Market Value:</span>
                    <span className="font-semibold font-mono">
                      ₹{(selectedPlot.marketValue / 10000000).toFixed(2)} Cr
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-800">100% Solatium (Sec 30):</span>
                    <span className="font-semibold font-mono">
                      ₹{((selectedPlot.solatiumAmount || selectedPlot.marketValue) / 10000000).toFixed(2)} Cr
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-emerald-200 text-xs font-bold">
                    <span>Total Compensation Award:</span>
                    <span className="font-mono text-emerald-900">
                      ₹{((selectedPlot.marketValue * 2) / 10000000).toFixed(2)} Cr
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-700 italic">
                    Determined at ₹{(selectedPlot.pricePerSqM || 3800).toLocaleString("en-IN")}/sq.m with rural multiplication factor 2.0x.
                  </div>
                </div>
              </div>

              {/* Disputed Note if Disputed */}
              {selectedPlot.plotStatus === "disputed" && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1.5 text-amber-950">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Litigation Notice on Title</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Title dispute under RFCTLARR Authority Section 64. Disbursement withheld pending amicable division between legal heirs.
                  </p>
                </div>
              )}
            </div>

            {/* Inspector Footer Actions */}
            <div className="p-3 border-t border-[#E5E0D6] bg-[#FAF8F5] flex items-center gap-2 shrink-0">
              <Link
                href={`/projects/${selectedPlot.projectId}`}
                className="flex-1 text-center py-2 px-3 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Project File</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedPlot, null, 2));
                  const downloadAnchor = document.createElement("a");
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `cadastral_${selectedPlot.id}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                className="py-2 px-3 rounded-lg bg-white border border-[#E5E0D6] hover:bg-[#F4EFEA] text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1"
                title="Download Parcel JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </div>
          </div>
        )}

        {/* Re-open Inspector Floating Button (if closed) */}
        {!inspectorOpen && selectedPlot && (
          <button
            onClick={() => setInspectorOpen(true)}
            className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md border border-[#E5E0D6] shadow-lg rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-[#F4EFEA] flex items-center gap-2 transition-all"
          >
            <Info className="w-4 h-4 text-[#15803D]" />
            <span>Inspect {selectedPlot.plotNumber}</span>
          </button>
        )}
      </div>

      {/* Cross-Jurisdiction Request Access Modal */}
      {requestAccessResource && (
        <RequestAccessModal
          isOpen={!!requestAccessResource}
          onClose={() => setRequestAccessResource(null)}
          targetType={requestAccessResource.targetType}
          targetId={requestAccessResource.targetId}
          targetName={requestAccessResource.targetName}
          targetState={requestAccessResource.targetState}
          targetDistrict={requestAccessResource.targetDistrict}
          seniorAuthorityName={requestAccessResource.seniorAuthorityName}
          seniorAuthorityRole={requestAccessResource.seniorAuthorityRole}
        />
      )}
    </div>
  );
}
