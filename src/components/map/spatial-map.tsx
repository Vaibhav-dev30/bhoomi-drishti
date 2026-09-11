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
} from "lucide-react";
import { MOCK_PROJECTS, INDIAN_STATES } from "@/lib/mock-data";
import { Project, LandParcel } from "@/types";
import { formatArea, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// --- Enhanced DivIcon Factory for Sector Markers ---
function createCustomPin(color: string, label?: string) {
  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div style="
        background: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid #ffffff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 9px;
          height: 9px;
          background: #ffffff;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

// Measurement Point Pin
const measureIcon = L.divIcon({
  className: "measure-div-icon",
  html: `
    <div style="
      background: #0284c7;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 3px solid #ffffff;
      box-shadow: 0 0 8px rgba(2,132,199,0.8);
    "></div>
  `,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

// --- High-Density Cadastral Parcels with 14-Digit ULPIN ---
export interface CadastralParcel extends LandParcel {
  ulpin: string;
  polygon: [number, number][];
  solatiumAmount: number;
  marketRatePerHa: number;
  khasraClassification: string;
}

const EXTENDED_CADASTRAL_PARCELS: CadastralParcel[] = [
  // Nashik - Sinnar Corridor (Samruddhi Mahamarg)
  {
    id: "PRC-001",
    projectId: "PRJ-001",
    surveyNumber: "42/1",
    khasraNumber: "KH-892",
    ulpin: "MH240019284712",
    village: "Sinnar",
    tehsil: "Sinnar",
    district: "Nashik",
    state: "Maharashtra",
    areaHectares: 2.5,
    landType: "agricultural",
    ownershipType: "private",
    status: "acquired",
    ownerName: "Ramesh Patil & Sons",
    marketValue: 4500000,
    marketRatePerHa: 1800000,
    solatiumAmount: 4500000,
    khasraClassification: "Irrigated Bagayat Land",
    coordinates: [19.845, 73.995],
    polygon: [
      [19.843, 73.992],
      [19.847, 73.992],
      [19.848, 73.997],
      [19.844, 73.998],
    ],
  },
  {
    id: "PRC-002",
    projectId: "PRJ-001",
    surveyNumber: "42/2",
    khasraNumber: "KH-893",
    ulpin: "MH240019284713",
    village: "Sinnar",
    tehsil: "Sinnar",
    district: "Nashik",
    state: "Maharashtra",
    areaHectares: 1.8,
    landType: "agricultural",
    ownershipType: "private",
    status: "possessed",
    ownerName: "Suresh Gaikwad",
    marketValue: 3240000,
    marketRatePerHa: 1800000,
    solatiumAmount: 3240000,
    khasraClassification: "Jirayat Non-irrigated",
    coordinates: [19.849, 73.996],
    polygon: [
      [19.848, 73.997],
      [19.852, 73.998],
      [19.853, 74.002],
      [19.849, 74.001],
    ],
  },
  {
    id: "PRC-003",
    projectId: "PRJ-001",
    surveyNumber: "43",
    khasraNumber: "KH-901",
    ulpin: "MH240019284714",
    village: "Sinnar",
    tehsil: "Sinnar",
    district: "Nashik",
    state: "Maharashtra",
    areaHectares: 3.2,
    landType: "commercial",
    ownershipType: "private",
    status: "notified",
    ownerName: "Priya Deshmukh & Co-owners",
    marketValue: 7680000,
    marketRatePerHa: 2400000,
    solatiumAmount: 7680000,
    khasraClassification: "Highway Frontage Commercial",
    coordinates: [19.854, 74.004],
    polygon: [
      [19.853, 74.002],
      [19.857, 74.003],
      [19.858, 74.008],
      [19.854, 74.007],
    ],
  },
  {
    id: "PRC-004",
    projectId: "PRJ-001",
    surveyNumber: "44/A",
    khasraNumber: "KH-910",
    ulpin: "MH240019284715",
    village: "Sinnar",
    tehsil: "Sinnar",
    district: "Nashik",
    state: "Maharashtra",
    areaHectares: 4.1,
    landType: "forest",
    ownershipType: "government",
    status: "surveyed",
    ownerName: "Maharashtra State Forest Dept",
    marketValue: 4920000,
    marketRatePerHa: 1200000,
    solatiumAmount: 0,
    khasraClassification: "Class-II Social Forest",
    coordinates: [19.859, 74.009],
    polygon: [
      [19.858, 74.008],
      [19.862, 74.009],
      [19.863, 74.015],
      [19.859, 74.014],
    ],
  },
  // Lucknow - Kakori Corridor (Delhi-Varanasi High-Speed Rail)
  {
    id: "PRC-005",
    projectId: "PRJ-002",
    surveyNumber: "112/4",
    khasraNumber: "KH-1024",
    ulpin: "UP240019884102",
    village: "Kakori",
    tehsil: "Lucknow",
    district: "Lucknow",
    state: "Uttar Pradesh",
    areaHectares: 3.5,
    landType: "agricultural",
    ownershipType: "private",
    status: "notified",
    ownerName: "Harishankar Tiwari",
    marketValue: 9800000,
    marketRatePerHa: 2800000,
    solatiumAmount: 9800000,
    khasraClassification: "Perennial Crop Multi-Crop",
    coordinates: [26.872, 80.795],
    polygon: [
      [26.869, 80.792],
      [26.874, 80.791],
      [26.876, 80.798],
      [26.871, 80.799],
    ],
  },
  {
    id: "PRC-006",
    projectId: "PRJ-002",
    surveyNumber: "113",
    khasraNumber: "KH-1025",
    ulpin: "UP240019884103",
    village: "Kakori",
    tehsil: "Lucknow",
    district: "Lucknow",
    state: "Uttar Pradesh",
    areaHectares: 2.8,
    landType: "residential",
    ownershipType: "private",
    status: "surveyed",
    ownerName: "Mohd. Azharuddin & 3 Others",
    marketValue: 8960000,
    marketRatePerHa: 3200000,
    solatiumAmount: 8960000,
    khasraClassification: "Abadi Settlement Extension",
    coordinates: [26.877, 80.801],
    polygon: [
      [26.875, 80.799],
      [26.879, 80.800],
      [26.881, 80.806],
      [26.877, 80.805],
    ],
  },
];

// --- Strategic Infrastructure Corridor Linear Polylines ---
const INFRASTRUCTURE_CORRIDORS: {
  id: string;
  name: string;
  projectCode: string;
  color: string;
  rowWidthMeters: number;
  path: [number, number][];
}[] = [
  {
    id: "CORR-001",
    name: "Mumbai-Nagpur Expressway (Samruddhi Mahamarg RoW Alignment)",
    projectCode: "MH-HWY-2024-001",
    color: "#0284c7", // Cerulean Blue
    rowWidthMeters: 120,
    path: [
      [19.78, 73.88],
      [19.82, 73.95],
      [19.845, 73.995],
      [19.89, 74.08],
      [19.95, 74.25],
      [20.02, 74.45],
    ],
  },
  {
    id: "CORR-002",
    name: "Delhi-Varanasi High-Speed Rail Corridor (Alignment Spine)",
    projectCode: "UP-RLY-2024-002",
    color: "#16a34a", // Emerald Green
    rowWidthMeters: 60,
    path: [
      [28.61, 77.23],
      [27.18, 78.01],
      [26.85, 80.94],
      [26.872, 80.795],
      [25.43, 81.84],
      [25.31, 82.97],
    ],
  },
];

// --- Circle Rate Valuation Density Heatmap Zones ---
const VALUATION_ZONES = [
  { center: [19.847, 73.996] as [number, number], radius: 1200, tier: "Zone A (Prime RoW)", rate: "₹24 L/ha", color: "#16a34a" },
  { center: [19.858, 74.01] as [number, number], radius: 1500, tier: "Zone B (Semi-Urban)", rate: "₹18 L/ha", color: "#0284c7" },
  { center: [26.873, 80.796] as [number, number], radius: 2000, tier: "Zone A (Bullet Train Buffer)", rate: "₹32 L/ha", color: "#eab308" },
];

// Quick Focus Presets
const QUICK_FOCUS_PRESETS = [
  { label: "All India", center: [21.5937, 78.9629] as [number, number], zoom: 5 },
  { label: "Nashik Corridor (MH)", center: [19.848, 73.997] as [number, number], zoom: 14 },
  { label: "Kakori HSR (UP)", center: [26.874, 80.796] as [number, number], zoom: 14 },
  { label: "Amaravati City (AP)", center: [16.5062, 80.648] as [number, number], zoom: 11 },
  { label: "Bhadla Solar (RJ)", center: [27.53, 71.91] as [number, number], zoom: 11 },
];

// Helper to calculate distance in km using Haversine formula
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Controller to smoothly fly map to coordinates
function MapViewController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.4 });
  }, [center, zoom, map]);
  return null;
}

// Interactive Map Events (Measurement & Live Coordinates)
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
  // Base Map Layer
  const [selectedBaseMap, setSelectedBaseMap] = useState<"cartoLight" | "satellite" | "osm">("cartoLight");

  // Operational Layers
  const [showProjects, setShowProjects] = useState(true);
  const [showCadastral, setShowCadastral] = useState(true);
  const [showCorridors, setShowCorridors] = useState(true);
  const [showValuationZones, setShowValuationZones] = useState(false);
  const [showStates, setShowStates] = useState(false);

  // Status Filter for Parcels
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Selection state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedParcel, setSelectedParcel] = useState<CadastralParcel | null>(EXTENDED_CADASTRAL_PARCELS[0]);
  const [selectedCorridor, setSelectedCorridor] = useState<typeof INFRASTRUCTURE_CORRIDORS[0] | null>(null);

  // Map viewport state
  const [mapCenter, setMapCenter] = useState<[number, number]>([19.848, 73.997]);
  const [mapZoom, setMapZoom] = useState(14);

  // Live HUD Telemetry
  const [cursorPos, setCursorPos] = useState({ lat: 19.848, lng: 73.997 });

  // Measurement Tool State
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);

  // Search Query
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);

  // Tile sources
  const baseMapTiles = {
    cartoLight: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  };

  // Color mapping
  const getParcelColor = (status: string) => {
    switch (status) {
      case "possessed":
        return "#16a34a"; // Vibrant Emerald
      case "acquired":
        return "#0284c7"; // Cerulean Light Blue
      case "notified":
        return "#f59e0b"; // Amber Gold
      case "surveyed":
        return "#9333ea"; // Purple
      default:
        return "#64748b";
    }
  };

  const getSectorPinColor = (type: string) => {
    switch (type) {
      case "highway":
        return "#0284c7";
      case "railway":
        return "#16a34a";
      case "irrigation":
        return "#0891b2";
      case "industrial":
        return "#8b5cf6";
      case "renewable_energy":
        return "#eab308";
      default:
        return "#ec4899";
    }
  };

  // Filtered Parcels
  const filteredParcels = useMemo(() => {
    return EXTENDED_CADASTRAL_PARCELS.filter((p) => {
      if (statusFilter === "all") return true;
      return p.status === statusFilter;
    });
  }, [statusFilter]);

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();

    const matchedParcels = EXTENDED_CADASTRAL_PARCELS.filter(
      (p) =>
        p.khasraNumber.toLowerCase().includes(q) ||
        p.ulpin.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q) ||
        p.ownerName.toLowerCase().includes(q)
    ).map((p) => ({ type: "parcel" as const, data: p }));

    const matchedProjects = MOCK_PROJECTS.filter(
      (pr) =>
        pr.name.toLowerCase().includes(q) ||
        pr.projectCode.toLowerCase().includes(q) ||
        pr.district.toLowerCase().includes(q)
    ).map((pr) => ({ type: "project" as const, data: pr }));

    return [...matchedParcels, ...matchedProjects].slice(0, 6);
  }, [searchQuery]);

  // Total measured distance in km
  const totalMeasureDistanceKm = useMemo(() => {
    if (measurePoints.length < 2) return 0;
    let dist = 0;
    for (let i = 1; i < measurePoints.length; i++) {
      dist += calculateDistanceKm(
        measurePoints[i - 1][0],
        measurePoints[i - 1][1],
        measurePoints[i][0],
        measurePoints[i][1]
      );
    }
    return dist;
  }, [measurePoints]);

  // Export GeoJSON
  const handleExportGeoJSON = () => {
    const geojsonData = {
      type: "FeatureCollection",
      features: filteredParcels.map((p) => ({
        type: "Feature",
        properties: {
          id: p.id,
          ulpin: p.ulpin,
          khasra: p.khasraNumber,
          surveyNumber: p.surveyNumber,
          village: p.village,
          owner: p.ownerName,
          areaHectares: p.areaHectares,
          status: p.status,
          marketValue: p.marketValue,
        },
        geometry: {
          type: "Polygon",
          coordinates: [p.polygon.map(([lat, lng]) => [lng, lat])],
        },
      })),
    };

    const blob = new Blob([JSON.stringify(geojsonData, null, 2)], {
      type: "application/geo+json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `BhoomiDrishti_Cadastral_Export_${Date.now()}.geojson`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative h-[calc(100vh-140px)] w-full rounded-3xl overflow-hidden border border-[#E5E0D6] bg-[#FAF8F5] shadow-2xl flex flex-col">
      
      {/* ───── 1. Top Unified GIS Toolbar ───── */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Left Side: Search & Layer Buttons */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          
          {/* Spatial Search Bar */}
          <div className="relative">
            <div className="flex items-center h-10 w-64 sm:w-80 rounded-xl bg-white/95 border border-[#E5E0D6] px-3 shadow-lg backdrop-blur-md">
              <Search className="h-4 w-4 text-[#0284C7] shrink-0 mr-2" />
              <input
                type="text"
                placeholder="Search Khasra, ULPIN, Village..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchResultsOpen(true);
                }}
                onFocus={() => setSearchResultsOpen(true)}
                className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Search Dropdown Results */}
            {searchResultsOpen && searchResults.length > 0 && (
              <div className="absolute top-12 left-0 w-80 rounded-xl bg-white border border-[#E5E0D6] p-2 shadow-2xl space-y-1 z-50">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Matched GIS Entities
                </div>
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (item.type === "parcel") {
                        setSelectedParcel(item.data as CadastralParcel);
                        setSelectedProject(null);
                        setSelectedCorridor(null);
                        setMapCenter(item.data.coordinates);
                        setMapZoom(16);
                      } else {
                        setSelectedProject(item.data as Project);
                        setSelectedParcel(null);
                        setSelectedCorridor(null);
                        setMapCenter([item.data.centerLat, item.data.centerLng]);
                        setMapZoom(13);
                      }
                      setSearchResultsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-[#F0FDF4] transition-colors flex items-center justify-between border-b border-slate-100 last:border-none"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        {item.type === "parcel" ? (item.data as CadastralParcel).khasraNumber : (item.data as Project).name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.type === "parcel"
                          ? `ULPIN: ${(item.data as CadastralParcel).ulpin} • ${(item.data as CadastralParcel).village}`
                          : `${(item.data as Project).district}, ${(item.data as Project).state}`}
                      </div>
                    </div>
                    <Badge variant={item.type === "parcel" ? "success" : "info"} className="text-[10px]">
                      {item.type}
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Base Map Switcher */}
          <div className="flex items-center rounded-xl bg-white/95 border border-[#E5E0D6] p-1 shadow-lg backdrop-blur-md text-xs">
            <button
              onClick={() => setSelectedBaseMap("cartoLight")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedBaseMap === "cartoLight"
                  ? "bg-[#E0F2FE] text-[#0284C7] shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Cadastral Light
            </button>
            <button
              onClick={() => setSelectedBaseMap("satellite")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedBaseMap === "satellite"
                  ? "bg-[#DCFCE7] text-[#15803D] shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ISRO Satellite
            </button>
            <button
              onClick={() => setSelectedBaseMap("osm")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedBaseMap === "osm"
                  ? "bg-[#E0F2FE] text-[#0284C7] shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              OSM Topo
            </button>
          </div>

          {/* Measurement Tool Toggle */}
          <button
            onClick={() => {
              setIsMeasuring(!isMeasuring);
              if (isMeasuring) setMeasurePoints([]);
            }}
            className={`h-10 px-3.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all shadow-lg backdrop-blur-md cursor-pointer ${
              isMeasuring
                ? "bg-[#0284C7] border-[#0284C7] text-white shadow-[#0284C7]/20"
                : "bg-white/95 border-[#E5E0D6] text-slate-700 hover:bg-[#F2EFE8]"
            }`}
          >
            <Ruler className="h-4 w-4 text-emerald-500" />
            <span>{isMeasuring ? "Measuring..." : "Measure Tool"}</span>
          </button>
        </div>

        {/* Right Side: Quick Focus & Export */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Quick Focus Dropdown */}
          <div className="flex items-center gap-1.5 bg-white/95 border border-[#E5E0D6] p-1 rounded-xl shadow-lg text-xs">
            <span className="text-[11px] font-semibold text-slate-400 px-2">Jump to:</span>
            {QUICK_FOCUS_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setMapCenter(preset.center);
                  setMapZoom(preset.zoom);
                }}
                className="px-2.5 py-1 rounded-lg hover:bg-[#F0FDF4] hover:text-[#15803D] text-slate-700 font-medium transition-colors text-[11px]"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Export GeoJSON Button */}
          <button
            onClick={handleExportGeoJSON}
            title="Download GeoJSON for QGIS / ArcGIS"
            className="h-10 px-3 rounded-xl bg-white/95 border border-[#E5E0D6] text-slate-700 hover:text-[#15803D] hover:bg-[#DCFCE7]/40 shadow-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Download className="h-4 w-4 text-[#15803D]" />
            <span className="hidden sm:inline">Export GeoJSON</span>
          </button>
        </div>
      </div>

      {/* ───── 2. Floating Layer Filter Bar (Left Side) ───── */}
      <div className="absolute top-20 left-4 z-[1000] flex flex-col gap-2 w-48 rounded-2xl bg-white/95 border border-[#E5E0D6] p-3 shadow-xl backdrop-blur-md text-xs">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          <span className="flex items-center gap-1">
            <Layers className="h-3.5 w-3.5 text-[#0284C7]" />
            <span>Map Layers</span>
          </span>
        </div>

        <label className="flex items-center justify-between cursor-pointer py-0.5 text-slate-700 hover:text-slate-950">
          <span className="font-medium">Cadastral Parcels</span>
          <input
            type="checkbox"
            checked={showCadastral}
            onChange={(e) => setShowCadastral(e.target.checked)}
            className="accent-[#15803D] h-4 w-4"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer py-0.5 text-slate-700 hover:text-slate-950">
          <span className="font-medium">Corridor Alignment</span>
          <input
            type="checkbox"
            checked={showCorridors}
            onChange={(e) => setShowCorridors(e.target.checked)}
            className="accent-[#0284C7] h-4 w-4"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer py-0.5 text-slate-700 hover:text-slate-950">
          <span className="font-medium">Project Markers</span>
          <input
            type="checkbox"
            checked={showProjects}
            onChange={(e) => setShowProjects(e.target.checked)}
            className="accent-[#0284C7] h-4 w-4"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer py-0.5 text-slate-700 hover:text-slate-950">
          <span className="font-medium">Valuation Heatmap</span>
          <input
            type="checkbox"
            checked={showValuationZones}
            onChange={(e) => setShowValuationZones(e.target.checked)}
            className="accent-amber-500 h-4 w-4"
          />
        </label>

        {/* Status Filter for Parcels */}
        <div className="pt-2 border-t border-slate-100 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Acquisition Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-[#E5E0D6] rounded-lg text-xs p-1.5 text-slate-800 font-semibold focus:outline-none"
          >
            <option value="all">All Statuses ({EXTENDED_CADASTRAL_PARCELS.length})</option>
            <option value="possessed">Possessed (Green)</option>
            <option value="acquired">Acquired (Blue)</option>
            <option value="notified">Notified (Amber)</option>
            <option value="surveyed">Surveyed (Purple)</option>
          </select>
        </div>
      </div>

      {/* ───── 3. Measurement HUD Banner (When Active) ───── */}
      {isMeasuring && (
        <div className="absolute top-20 right-4 z-[1000] rounded-2xl bg-white/95 border border-[#0284C7] p-3 shadow-2xl backdrop-blur-md text-xs space-y-2 w-72">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#0284C7] flex items-center gap-1.5">
              <Ruler className="h-4 w-4" />
              <span>Geodesic Distance Ruler</span>
            </span>
            <button
              onClick={() => setMeasurePoints([])}
              className="text-[10px] text-slate-400 hover:text-red-500 font-semibold underline"
            >
              Reset
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Click multiple points on the map to calculate linear corridor RoW distance.
          </p>
          <div className="p-2 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] flex items-baseline justify-between">
            <span className="text-xs font-semibold text-slate-700">Total Distance:</span>
            <span className="text-base font-extrabold text-[#0284C7] font-mono">
              {totalMeasureDistanceKm > 1
                ? `${totalMeasureDistanceKm.toFixed(3)} km`
                : `${(totalMeasureDistanceKm * 1000).toFixed(0)} meters`}
            </span>
          </div>
        </div>
      )}

      {/* ───── 4. Leaflet Interactive GIS Canvas ───── */}
      <div className="flex-1 w-full h-full relative">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <MapViewController center={mapCenter} zoom={mapZoom} />
          <MapEventTracker
            measuring={isMeasuring}
            onAddPoint={(pt) => setMeasurePoints((prev) => [...prev, pt])}
            onMouseMove={setCursorPos}
          />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO'
            url={baseMapTiles[selectedBaseMap]}
          />

          {/* Valuation Heatmap Density Zones */}
          {showValuationZones &&
            VALUATION_ZONES.map((zone, idx) => (
              <Circle
                key={idx}
                center={zone.center}
                radius={zone.radius}
                pathOptions={{
                  color: zone.color,
                  fillColor: zone.color,
                  fillOpacity: 0.18,
                  weight: 1.5,
                  dashArray: "6",
                }}
              >
                <Popup>
                  <div className="p-1 text-xs">
                    <span className="font-bold text-slate-900 block">{zone.tier}</span>
                    <span className="text-slate-600">Circle Rate: {zone.rate}</span>
                  </div>
                </Popup>
              </Circle>
            ))}

          {/* Infrastructure Corridor Polylines */}
          {showCorridors &&
            INFRASTRUCTURE_CORRIDORS.map((corr) => (
              <React.Fragment key={corr.id}>
                {/* Glow Outer Buffer Polyline */}
                <Polyline
                  positions={corr.path}
                  pathOptions={{
                    color: corr.color,
                    weight: 10,
                    opacity: 0.25,
                  }}
                />
                {/* Main Core Alignment Polyline */}
                <Polyline
                  positions={corr.path}
                  pathOptions={{
                    color: corr.color,
                    weight: 4,
                    opacity: 0.95,
                  }}
                  eventHandlers={{
                    click: () => {
                      setSelectedCorridor(corr);
                      setSelectedParcel(null);
                      setSelectedProject(null);
                    },
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-1 min-w-[200px] text-xs">
                      <div className="font-mono text-[10px] text-[#0284C7] font-bold">
                        {corr.projectCode}
                      </div>
                      <h4 className="font-bold text-slate-900 leading-tight">
                        {corr.name}
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        Right-of-Way (RoW) Buffer: <strong>{corr.rowWidthMeters} meters</strong>
                      </p>
                    </div>
                  </Popup>
                </Polyline>
              </React.Fragment>
            ))}

          {/* Cadastral Land Parcel Boundary Polygons */}
          {showCadastral &&
            filteredParcels.map((parcel) => (
              <Polygon
                key={parcel.id}
                positions={parcel.polygon}
                pathOptions={{
                  color: getParcelColor(parcel.status),
                  fillColor: getParcelColor(parcel.status),
                  fillOpacity: selectedParcel?.id === parcel.id ? 0.65 : 0.4,
                  weight: selectedParcel?.id === parcel.id ? 3.5 : 2,
                  dashArray: parcel.status === "notified" ? "4" : undefined,
                }}
                eventHandlers={{
                  click: () => {
                    setSelectedParcel(parcel);
                    setSelectedProject(null);
                    setSelectedCorridor(null);
                  },
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1.5 min-w-[200px] text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#15803D] font-bold">
                        ULPIN: {parcel.ulpin}
                      </span>
                      <span className="text-[10px] capitalize px-1.5 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                        {parcel.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 leading-tight">
                      Khasra: {parcel.khasraNumber} (Gat {parcel.surveyNumber})
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Owner: <strong>{parcel.ownerName}</strong>
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Area: <strong>{parcel.areaHectares} ha</strong> ({parcel.landType})
                    </p>
                    <p className="text-[11px] font-mono text-[#15803D] font-semibold">
                      Assessed Valuation: ₹{(parcel.marketValue / 100000).toFixed(2)} Lakh
                    </p>
                  </div>
                </Popup>
              </Polygon>
            ))}

          {/* Project Hub Markers */}
          {showProjects &&
            MOCK_PROJECTS.map((proj) => (
              <Marker
                key={proj.id}
                position={[proj.centerLat, proj.centerLng]}
                icon={createCustomPin(getSectorPinColor(proj.type))}
                eventHandlers={{
                  click: () => {
                    setSelectedProject(proj);
                    setSelectedParcel(null);
                    setSelectedCorridor(null);
                  },
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1 min-w-[210px] text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#0284C7] font-bold">
                        {proj.projectCode}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                        {proj.state}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 leading-tight">
                      {proj.name}
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Acquired: <strong>{formatArea(proj.areaAcquired)}</strong> / {formatArea(proj.totalAreaRequired)} ha
                    </p>
                    <p className="text-[11px] text-[#15803D] font-mono font-semibold">
                      Disbursed: ₹{proj.compensationDisbursed} L
                    </p>
                    <Link
                      href={`/projects/${proj.id}`}
                      className="inline-block mt-1 text-[11px] font-bold text-[#0284C7] hover:underline"
                    >
                      Open Project Dossier →
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* Active Measurement Polyline and Points */}
          {measurePoints.length > 0 && (
            <>
              <Polyline
                positions={measurePoints}
                pathOptions={{
                  color: "#0284c7",
                  weight: 3,
                  dashArray: "6",
                }}
              />
              {measurePoints.map((pt, idx) => (
                <Marker key={idx} position={pt} icon={measureIcon} />
              ))}
            </>
          )}
        </MapContainer>
      </div>

      {/* ───── 5. Bottom Live Telemetry Coordinates HUD Bar ───── */}
      <div className="absolute bottom-4 left-4 z-[1000] flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/95 border border-[#E5E0D6] shadow-xl backdrop-blur-md text-[11px] font-mono text-slate-700">
        <div className="flex items-center gap-1.5 text-[#15803D] font-semibold">
          <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-ping" />
          <span>NavIC • Bhuvan GIS Online</span>
        </div>
        <span className="text-slate-300">|</span>
        <span>LAT: {cursorPos.lat.toFixed(5)}° N</span>
        <span>LNG: {cursorPos.lng.toFixed(5)}° E</span>
        <span className="text-slate-300">|</span>
        <span className="text-[#0284C7] font-semibold">EPSG:4326 (WGS 84)</span>
      </div>

      {/* ───── 6. Rich Cadastral & Corridor Inspection Drawer (Bottom Right) ───── */}
      <div className="absolute bottom-4 right-4 z-[1000] w-80 sm:w-[400px] rounded-2xl border border-[#E5E0D6] bg-white/95 p-5 backdrop-blur-xl shadow-2xl space-y-4 max-h-[460px] overflow-y-auto">
        
        {selectedParcel ? (
          <div>
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#15803D] font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Cadastral Parcel Identified</span>
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Khasra #{selectedParcel.khasraNumber} (Gat {selectedParcel.surveyNumber})
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {selectedParcel.village}, {selectedParcel.tehsil}, {selectedParcel.district}
                </span>
              </div>
              <Badge
                variant={selectedParcel.status === "possessed" ? "success" : "default"}
                className="text-xs uppercase"
              >
                {selectedParcel.status}
              </Badge>
            </div>

            {/* Entity Details Grid */}
            <div className="space-y-2 py-3 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">14-Digit ULPIN (Bhu-Aadhaar):</span>
                <span className="font-mono font-bold text-[#0284C7]">
                  {selectedParcel.ulpin}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Owner of Record:</span>
                <span className="font-bold text-slate-900">
                  {selectedParcel.ownerName}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Classification:</span>
                <span className="font-medium text-slate-800">
                  {selectedParcel.khasraClassification}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Parcel Area:</span>
                <span className="font-bold text-slate-900">
                  {selectedParcel.areaHectares} Hectares ({selectedParcel.landType})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Base Circle Rate:</span>
                <span className="font-mono font-semibold text-slate-900">
                  ₹{(selectedParcel.marketRatePerHa / 100000).toFixed(1)} L/ha
                </span>
              </div>
              <div className="flex justify-between py-1 bg-[#F0FDF4] p-2 rounded-xl">
                <span className="text-[#15803D] font-bold">Sec 26-30 Assessed Award:</span>
                <span className="font-mono font-extrabold text-[#15803D]">
                  ₹{(selectedParcel.marketValue / 100000).toFixed(2)} Lakh
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex gap-2">
              <Link
                href={`/compensation?khasra=${selectedParcel.khasraNumber}`}
                className="flex-1"
              >
                <Button variant="default" size="sm" className="w-full bg-[#15803D] hover:bg-[#16A34A] text-white text-xs font-semibold">
                  Calculate Sec 26-30 Award →
                </Button>
              </Link>
              <Link href={`/projects/${selectedParcel.projectId}`}>
                <Button variant="outline" size="sm" className="text-xs border-[#E5E0D6] hover:bg-slate-50">
                  Dossier
                </Button>
              </Link>
            </div>
          </div>
        ) : selectedCorridor ? (
          <div>
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-mono text-[#0284C7] font-bold uppercase tracking-wider">
                Linear Infrastructure Alignment
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {selectedCorridor.name}
              </h3>
              <span className="text-xs font-mono text-slate-500">
                {selectedCorridor.projectCode}
              </span>
            </div>
            <div className="space-y-2 py-3 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Right-of-Way Buffer:</span>
                <span className="font-bold text-slate-900">{selectedCorridor.rowWidthMeters} meters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Geodesic Points:</span>
                <span className="font-mono">{selectedCorridor.path.length} survey waypoints</span>
              </div>
            </div>
          </div>
        ) : selectedProject ? (
          <div>
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-mono text-[#0284C7] font-bold uppercase tracking-wider">
                {selectedProject.projectCode}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {selectedProject.name}
              </h3>
              <span className="text-xs text-slate-500">
                {selectedProject.district}, {selectedProject.state}
              </span>
            </div>
            <div className="space-y-2 py-3 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Implementing Agency:</span>
                <span className="font-bold text-slate-900">{selectedProject.lrbName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Land Acquired:</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatArea(selectedProject.areaAcquired)} / {formatArea(selectedProject.totalAreaRequired)} ha
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Disbursed (PFMS):</span>
                <span className="font-mono font-bold text-[#15803D]">
                  ₹{selectedProject.compensationDisbursed} Lakhs
                </span>
              </div>
            </div>
            <Link href={`/projects/${selectedProject.id}`} className="block pt-1">
              <Button variant="default" size="sm" className="w-full bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-semibold">
                Open Statutory Project Dossier →
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-500 space-y-2">
            <Compass className="h-6 w-6 mx-auto text-[#0284C7] animate-spin" />
            <p className="font-medium text-slate-700">Select any parcel, corridor, or marker on the map to inspect geospatial attributes.</p>
          </div>
        )}
      </div>

    </div>
  );
}
